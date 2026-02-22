import { NextResponse } from 'next/server';
import {
  calculateCapexComparison,
  calculateROITimeline,
  calculateOpexBreakdown,
} from '@/lib/financial-model';

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;

    const annualVolume_units = Number(body.annualVolume_units);
    if (!annualVolume_units || annualVolume_units < 1000) {
      return NextResponse.json(
        { error: 'annualVolume_units must be at least 1,000' },
        { status: 400 }
      );
    }

    const lineType = body.lineType === 'Line53' ? 'Line53' as const : 'Line38' as const;
    const productCategory = typeof body.productCategory === 'string'
      ? body.productCategory
      : 'General';

    const capex = calculateCapexComparison({
      annualVolume_units,
      productCategory,
      lineType,
    });

    const roi = calculateROITimeline({
      annualVolume_units,
      productCategory,
      lineType,
    });

    const opex = calculateOpexBreakdown(annualVolume_units);

    return NextResponse.json({
      input: { annualVolume_units, lineType, productCategory },
      capex,
      roi,
      opex,
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
