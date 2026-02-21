import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { configurations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const userId = request.headers.get('x-user-id');

    if (!tenantId || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all configurations for this tenant
    const configs = await db.query.configurations.findMany({
      where: (configurations, { eq }) => eq(configurations.tenantId, tenantId),
      orderBy: (configurations, { desc }) => [desc(configurations.createdAt)],
      columns: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
      },
    });

    return NextResponse.json(
      { configurations: configs },
      { status: 200 }
    );
  } catch (error) {
    console.error('List configurations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const userId = request.headers.get('x-user-id');

    if (!tenantId || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      fluidViscosityCp,
      fluidDensityKgM3,
      fluidSurfaceTensionMnM,
      fluidFlashPointC,
      targetSprayConeDeg,
      targetDropletSizeUm,
      maxPressureBar,
      targetFlowRateMlMin,
      compatibleActuators,
      tags,
    } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Configuration name required' },
        { status: 400 }
      );
    }

    // Create configuration
    const configId = uuidv4();
    const [config] = await db
      .insert(configurations)
      .values({
        id: configId,
        tenantId,
        createdByUserId: userId,
        name,
        description: description || null,
        fluidViscosityCp: fluidViscosityCp ? parseFloat(fluidViscosityCp) : null,
        fluidDensityKgM3: fluidDensityKgM3 ? parseFloat(fluidDensityKgM3) : null,
        fluidSurfaceTensionMnM: fluidSurfaceTensionMnM ? parseFloat(fluidSurfaceTensionMnM) : null,
        fluidFlashPointC: fluidFlashPointC ? parseInt(fluidFlashPointC) : null,
        targetSprayConeDeg: targetSprayConeDeg ? parseInt(targetSprayConeDeg) : null,
        targetDropletSizeUm: targetDropletSizeUm ? parseInt(targetDropletSizeUm) : null,
        maxPressureBar: maxPressureBar ? parseInt(maxPressureBar) : null,
        targetFlowRateMlMin: targetFlowRateMlMin ? parseFloat(targetFlowRateMlMin) : null,
        compatibleActuators: compatibleActuators || [],
        tags: tags || [],
        status: 'draft',
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Configuration created',
        configuration: config,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create configuration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
