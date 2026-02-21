import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { procurements } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all procurements for this tenant
    const allProcurements = await db.query.procurements.findMany({
      where: (procurements, { eq }) => eq(procurements.tenantId, tenantId),
      orderBy: (procurements, { desc }) => [desc(procurements.createdAt)],
      columns: {
        id: true,
        status: true,
        orderType: true,
        total: true,
        selectedSupplier: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { procurements: allProcurements },
      { status: 200 }
    );
  } catch (error) {
    console.error('List procurements error:', error);
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
      configurationId,
      orderType = 'sample',
      items = [],
      shipToAddress = {},
    } = body;

    // Validation
    if (!configurationId || items.length === 0) {
      return NextResponse.json(
        { error: 'Configuration ID and items required' },
        { status: 400 }
      );
    }

    if (!['sample', 'pilot', 'production'].includes(orderType)) {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.qty * item.unit_price,
      0
    );

    const procId = uuidv4();
    const [procurement] = await db
      .insert(procurements)
      .values({
        id: procId,
        tenantId,
        configurationId,
        createdByUserId: userId,
        orderType: orderType as any,
        items,
        shipToAddress,
        subtotal: subtotal.toString(),
        total: subtotal.toString(),
        suppliersQuoted: [],
        status: 'draft',
      } as any)
      .returning();

    return NextResponse.json(
      {
        message: 'Procurement created',
        procurement: {
          id: procurement.id,
          status: procurement.status,
          orderType: procurement.orderType,
          total: procurement.total,
          createdAt: procurement.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create procurement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
