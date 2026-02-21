import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const userRole = request.headers.get('x-user-role');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all users in tenant
    const teamMembers = await db.query.users.findMany({
      where: (users, { eq }) => eq(users.tenantId, tenantId),
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        members: teamMembers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('List members error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const userRole = request.headers.get('x-user-role');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can update member roles
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can manage team members' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, role } = body;

    // Validation
    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role required' },
        { status: 400 }
      );
    }

    if (!['admin', 'user', 'viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user exists in this tenant
    const user = await db.query.users.findFirst({
      where: (users, { eq, and }) =>
        and(
          eq(users.id, userId),
          eq(users.tenantId, tenantId)
        ),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update role
    const [updatedUser] = await db
      .update(users)
      .set({ role: role as any })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
      });

    return NextResponse.json(
      {
        message: 'User role updated',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
