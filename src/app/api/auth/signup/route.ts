import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { users, tenants } from '@/db/schema';
import {
  hashPassword,
  createJWT,
  setSessionCookie,
  isValidEmail,
  isValidPassword,
} from '@/auth/utils';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, companyName } = body;

    // Validation
    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        {
          error:
            'Password must be at least 8 characters with uppercase, lowercase, and number',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create tenant (organization)
    const tenantSlug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const uniqueSlug = `${tenantSlug}-${uuidv4().slice(0, 8)}`;

    const [tenant] = await db
      .insert(tenants)
      .values({
        id: uuidv4(),
        name: companyName,
        slug: uniqueSlug,
        plan: 'starter',
        subscriptionStatus: 'trialing',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      } as any)
      .returning();

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        id: uuidv4(),
        email,
        passwordHash,
        firstName: firstName || '',
        lastName: lastName || '',
        tenantId: tenant.id,
        role: 'admin', // First user is admin
      } as any)
      .returning({ id: users.id, email: users.email, tenantId: users.tenantId });

    // Create JWT token
    const token = await createJWT({
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: 'admin',
    });

    // Set session cookie
    await setSessionCookie(token);

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: { id: user.id, email: user.email },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
