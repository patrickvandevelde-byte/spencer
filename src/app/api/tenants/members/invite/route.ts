import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { invitations, users } from '@/db/schema';
import {
  generateInvitationToken,
  getInvitationExpiry,
} from '@/auth/utils';
import { isValidEmail } from '@/auth/utils';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Get user info from headers (added by middleware)
    const userId = request.headers.get('x-user-id');
    const tenantId = request.headers.get('x-tenant-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId || !tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can invite users
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can invite team members' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, role } = body;

    // Validation
    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!['admin', 'user', 'viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists in this tenant
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq, and }) =>
        and(
          eq(users.email, email),
          eq(users.tenantId, tenantId)
        ),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already in this organization' },
        { status: 400 }
      );
    }

    // Check if invitation already exists
    const existingInvitation = await db.query.invitations.findFirst({
      where: (invitations, { eq, and }) =>
        and(
          eq(invitations.email, email),
          eq(invitations.tenantId, tenantId)
        ),
    });

    if (existingInvitation && !existingInvitation.acceptedAt) {
      return NextResponse.json(
        { error: 'Pending invitation already exists for this email' },
        { status: 400 }
      );
    }

    // Generate invitation token
    const token = generateInvitationToken();
    const expiresAt = getInvitationExpiry();

    // Create invitation
    const [invitation] = await db
      .insert(invitations)
      .values({
        id: uuidv4(),
        tenantId,
        email,
        role,
        token,
        expiresAt,
      } as any)
      .returning();

    // TODO: Send email with invitation link
    // const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/accept-invitation?token=${token}`;
    // await sendInvitationEmail(email, inviteLink);

    return NextResponse.json(
      {
        message: 'Invitation sent successfully',
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
