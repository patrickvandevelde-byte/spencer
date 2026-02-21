import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { configurations, configurationVersions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const { id } = await params;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get configuration
    const config = await db.query.configurations.findFirst({
      where: (configurations, { eq, and }) =>
        and(
          eq(configurations.id, id),
          eq(configurations.tenantId, tenantId)
        ),
    });

    if (!config) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    // Update accessed time
    await db
      .update(configurations)
      .set({ accessedAt: new Date() })
      .where(eq(configurations.id, id));

    return NextResponse.json(
      { configuration: config },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get configuration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const userId = request.headers.get('x-user-id');
    const { id } = await params;

    if (!tenantId || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Get existing configuration
    const existingConfig = await db.query.configurations.findFirst({
      where: (configurations, { eq, and }) =>
        and(
          eq(configurations.id, id),
          eq(configurations.tenantId, tenantId)
        ),
    });

    if (!existingConfig) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    // Create version record if content changed
    const changes: Record<string, [any, any]> = {};
    let hasChanges = false;

    for (const [key, value] of Object.entries(body)) {
      if (existingConfig[key as keyof typeof existingConfig] !== value) {
        changes[key] = [
          existingConfig[key as keyof typeof existingConfig],
          value,
        ];
        hasChanges = true;
      }
    }

    if (hasChanges) {
      await db
        .insert(configurationVersions)
        .values({
          id: uuidv4(),
          configurationId: id,
          version: 1, // TODO: increment version properly
          changes,
          changedByUserId: userId,
        } as any);
    }

    // Update configuration
    const [updated] = await db
      .update(configurations)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(configurations.id, id))
      .returning();

    return NextResponse.json(
      {
        message: 'Configuration updated',
        configuration: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update configuration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const { id } = await params;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if configuration exists
    const config = await db.query.configurations.findFirst({
      where: (configurations, { eq, and }) =>
        and(
          eq(configurations.id, id),
          eq(configurations.tenantId, tenantId)
        ),
    });

    if (!config) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    // Soft delete by archiving
    await db
      .update(configurations)
      .set({ archivedAt: new Date() })
      .where(eq(configurations.id, id));

    return NextResponse.json(
      { message: 'Configuration archived' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete configuration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
