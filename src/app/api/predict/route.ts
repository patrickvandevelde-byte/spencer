import { NextRequest, NextResponse } from "next/server";
import { ACTUATORS, FLUIDS, predict } from "@/lib/data";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fluidId, pressure_bar } = body;

  const fluid = FLUIDS.find((f) => f.id === fluidId);
  if (!fluid) {
    return NextResponse.json({ error: "Fluid not found" }, { status: 400 });
  }

  const pressure = Number(pressure_bar) || 5;

  const results = ACTUATORS.map((actuator) => ({
    actuator,
    prediction: predict(actuator, fluid, pressure),
  }));

  // Sort by compatibility score descending
  results.sort((a, b) => b.prediction.compatibilityScore - a.prediction.compatibilityScore);

  return NextResponse.json({ fluid, pressure: pressure, results });
}
