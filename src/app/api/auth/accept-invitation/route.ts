import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { invitations, users } from '@/db/schema';
import {
  hashPassword,
  createJWT,
  setSessionCookie,
  isValidPassword,
} from '@/auth/utils';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, firstName, lastName } = body;

    // Validation
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password required' },
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

    // Find invitation
    const invitation = await db.query.invitations.findFirst({
      where: (invitations, { eq }) => eq(invitations.token, token),
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 400 }
      );
    }

    // Check if expired
    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      );
    }

    // Check if already accepted
    if (invitation.acceptedAt) {
      return NextResponse.json(
        { error: 'This invitation has already been used' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq, and }) =>
        and(
          eq(users.email, invitation.email),
          eq(users.tenantId, invitation.tenantId)
        ),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User account already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user account
    const [newUser] = await db
      .insert(users)
      .values({
        id: uuidv4(),
        email: invitation.email,
        passwordHash,
        firstName: firstName || '',
        lastName: lastName || '',
        tenantId: invitation.tenantId,
        role: invitation.role as any,
      })
      .returning({ id: users.id, email: users.email, tenantId: users.tenantId });

    // Mark invitation as accepted
    await db
      .update(invitations)
      .set({ acceptedAt: new Date() })
      .where(eq(invitations.id, invitation.id));

    // Create JWT token
    const jwtToken = await createJWT({
      sub: newUser.id,
      tenantId: newUser.tenantId,
      email: newUser.email,
      role: invitation.role as any,
    });

    // Set session cookie
    await setSessionCookie(jwtToken);

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          tenantId: newUser.tenantId,
          role: invitation.role,
        },
        token: jwtToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Accept invitation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
