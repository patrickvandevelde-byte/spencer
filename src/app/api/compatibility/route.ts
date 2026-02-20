import { NextRequest, NextResponse } from "next/server";
import { ACTUATORS, FLUIDS } from "@/lib/data";

export async function GET(req: NextRequest) {
  const fluidId = req.nextUrl.searchParams.get("fluidId");

  if (!fluidId) {
    // Return full compatibility matrix
    const matrix = FLUIDS.map((fluid) => ({
      fluid: fluid.id,
      fluidName: fluid.name,
      compatible: ACTUATORS.filter((a) =>
        a.materialCompatibility.includes(fluid.solventClass)
      ).map((a) => a.id),
    }));
    return NextResponse.json({ matrix });
  }

  const fluid = FLUIDS.find((f) => f.id === fluidId);
  if (!fluid) {
    return NextResponse.json({ error: "Fluid not found" }, { status: 400 });
  }

  const compatible = ACTUATORS.filter((a) =>
    a.materialCompatibility.includes(fluid.solventClass)
  );
  const incompatible = ACTUATORS.filter(
    (a) => !a.materialCompatibility.includes(fluid.solventClass)
  );

  return NextResponse.json({
    fluid,
    compatible,
    incompatible,
  });
}
