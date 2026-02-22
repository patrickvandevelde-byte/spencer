import { NextResponse } from 'next/server';
import type { FormulaInput } from '@/lib/spenser-physics';
import {
  runPhysicsEngine,
  classifyViscosity,
  generatePressureCurves,
  compareSystems,
} from '@/lib/spenser-physics';
import {
  getCompatibleITVs,
  getCompatibleLPVs,
  buildComponentList,
} from '@/lib/kmd-data';
import { assessCompliance } from '@/lib/ppwr-compliance';

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;

    const viscosity_cP = Number(body.viscosity_cP);
    const density_g_cm3 = Number(body.density_g_cm3);
    const fillVolume_ml = Number(body.fillVolume_ml);

    if (!viscosity_cP || !density_g_cm3 || !fillVolume_ml) {
      return NextResponse.json(
        { error: 'Missing required fields: viscosity_cP, density_g_cm3, fillVolume_ml' },
        { status: 400 }
      );
    }

    const category = classifyViscosity(viscosity_cP);

    const input: FormulaInput = {
      viscosity_cP,
      density_g_cm3,
      gasSensitive: body.gasSensitive === true,
      category,
      fillVolume_ml,
      orientation360: body.orientation360 === true,
    };

    // Run physics engine
    const physicsResult = runPhysicsEngine(input);
    if ('error' in physicsResult) {
      return NextResponse.json({ error: physicsResult.error }, { status: 422 });
    }

    // Get compatible components
    const compatibleITVs = getCompatibleITVs(viscosity_cP, category, input.orientation360);
    const compatibleLPVs = getCompatibleLPVs(fillVolume_ml, physicsResult.equilibrium.outputPressure_bar);

    // Build component list
    const components = buildComponentList(category, input.gasSensitive);

    // Run PPWR assessment
    const ppwrResult = assessCompliance(
      components.map(({ part, selectedMaterial }) => ({ part, selectedMaterial }))
    );

    // Generate pressure curves for comparison
    const pressureCurve = generatePressureCurves(physicsResult.equilibrium.outputPressure_bar);
    const systemComparison = compareSystems(physicsResult.equilibrium.outputPressure_bar);

    return NextResponse.json({
      input,
      category,
      physics: physicsResult,
      compatibleITVs,
      compatibleLPVs,
      components,
      ppwr: ppwrResult,
      pressureCurve,
      systemComparison,
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
