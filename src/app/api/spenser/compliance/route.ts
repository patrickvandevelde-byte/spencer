import { NextResponse } from 'next/server';
import { IM_PARTS, buildComponentList } from '@/lib/kmd-data';
import { assessCompliance, comparePackagingWaste } from '@/lib/ppwr-compliance';
import { classifyViscosity } from '@/lib/spenser-physics';
import type { ViscosityCategory } from '@/lib/spenser-physics';

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;

    // Accept either a viscosity-based auto-selection or explicit material overrides
    const viscosity_cP = Number(body.viscosity_cP) || undefined;
    const materialOverrides = body.materialOverrides as Record<string, string> | undefined;
    const gasSensitive = body.gasSensitive === true;

    let category: ViscosityCategory = 'cream';
    if (viscosity_cP) {
      category = classifyViscosity(viscosity_cP);
    } else if (typeof body.category === 'string') {
      category = body.category as ViscosityCategory;
    }

    // Build component list with defaults
    const components = buildComponentList(category, gasSensitive);

    // Apply any material overrides from the user
    if (materialOverrides) {
      for (const comp of components) {
        const override = materialOverrides[comp.part.id];
        if (override && comp.part.materialOptions.includes(override)) {
          comp.selectedMaterial = override;
          comp.note = `User override: ${override}`;
        }
      }
    }

    // Run assessment
    const ppwrResult = assessCompliance(
      components.map(({ part, selectedMaterial }) => ({ part, selectedMaterial }))
    );

    // Packaging comparison (Spenser vs traditional)
    const wasteComparison = comparePackagingWaste();

    return NextResponse.json({
      category,
      components,
      parts: IM_PARTS,
      ppwr: ppwrResult,
      wasteComparison,
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
