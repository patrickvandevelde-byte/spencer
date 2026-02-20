"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ACTUATORS, FLUIDS, predict } from "@/lib/data";
import Link from "next/link";

function ResultsContent() {
  const params = useSearchParams();
  const actuatorId = params.get("actuator");
  const fluidId = params.get("fluid");
  const pressure = Number(params.get("pressure")) || 5;

  const actuator = ACTUATORS.find((a) => a.id === actuatorId);
  const fluid = FLUIDS.find((f) => f.id === fluidId);

  if (!actuator || !fluid) {
    return (
      <div className="border border-[var(--danger)] bg-[var(--surface)] p-8 text-center">
        <p className="text-sm text-[var(--danger)]">
          Missing or invalid parameters. Please run a prediction from the{" "}
          <Link href="/configure" className="underline">
            configurator
          </Link>
          .
        </p>
      </div>
    );
  }

  const result = predict(actuator, fluid, pressure);
  const scoreColor =
    result.compatibilityScore >= 80
      ? "var(--success)"
      : result.compatibilityScore >= 50
        ? "var(--warning)"
        : "var(--danger)";

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-widest text-[var(--muted)]">
          Prediction Detail
        </p>
        <h1 className="text-xl font-bold">{actuator.name}</h1>
        <p className="text-xs text-[var(--muted)]">
          {fluid.name} @ {pressure} bar
        </p>
      </div>

      {/* Score Banner */}
      <div
        className="flex items-center justify-between border p-6"
        style={{ borderColor: scoreColor }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Compatibility Score
          </p>
          <p className="text-4xl font-bold" style={{ color: scoreColor }}>
            {result.compatibilityScore}/100
          </p>
        </div>
        <div className="text-right text-xs text-[var(--muted)]">
          <p>
            Material:{" "}
            {actuator.materialCompatibility.includes(fluid.solventClass)
              ? "PASS"
              : "FAIL"}
          </p>
          <p>
            Pressure:{" "}
            {pressure <= actuator.maxPressure_bar ? "SAFE" : "OVER-PRESSURE"}
          </p>
        </div>
      </div>

      {/* Spray Physics */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-4 text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Spray Physics
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Predicted Cone Angle</span>
              <strong>{result.coneAngle_deg}°</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Droplet Size (Dv50)</span>
              <strong>{result.dropletSizeDv50_um} µm</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Flow Rate</span>
              <strong>{result.flowRate_mL_min} mL/min</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Spray Width @ 100mm</span>
              <strong>{result.sprayWidth_mm_at_100mm} mm</strong>
            </div>
          </div>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-4 text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Dimensionless Numbers
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Reynolds Number (Re)</span>
              <strong>{result.reynoldsNumber.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Weber Number (We)</span>
              <strong>{result.weberNumber.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Flow Regime</span>
              <strong>{result.reynoldsNumber > 4000 ? "Turbulent" : result.reynoldsNumber > 2000 ? "Transitional" : "Laminar"}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Operating Pressure</span>
              <strong>{pressure} bar</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Actuator Specs */}
      <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-4 text-[10px] uppercase tracking-widest text-[var(--muted)]">
          Actuator Specifications
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs md:grid-cols-4">
          <div>
            <span className="text-[var(--muted)]">SKU:</span>{" "}
            <strong>{actuator.sku}</strong>
          </div>
          <div>
            <span className="text-[var(--muted)]">Type:</span>{" "}
            <strong>{actuator.type.replace("_", " ")}</strong>
          </div>
          <div>
            <span className="text-[var(--muted)]">Orifice:</span>{" "}
            <strong>{actuator.orificeDiameter_mm} mm</strong>
          </div>
          <div>
            <span className="text-[var(--muted)]">Max Pressure:</span>{" "}
            <strong>{actuator.maxPressure_bar} bar</strong>
          </div>
          <div>
            <span className="text-[var(--muted)]">Swirl Angle:</span>{" "}
            <strong>{actuator.swirlChamberAngle_deg}°</strong>
          </div>
          <div>
            <span className="text-[var(--muted)]">Compatible With:</span>{" "}
            <strong>{actuator.materialCompatibility.join(", ")}</strong>
          </div>
          <div>
            <span className="text-[var(--muted)]">Applications:</span>{" "}
            <strong>{actuator.typicalApplications.join(", ")}</strong>
          </div>
          <div>
            <span className="text-[var(--muted)]">Unit Price:</span>{" "}
            <strong>${actuator.price_usd.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href="/configure"
          className="border border-[var(--border)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--muted)] no-underline hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          &larr; Back to Configurator
        </Link>
        <Link
          href={`/procurement?actuator=${actuator.id}&qty=100`}
          className="border border-[var(--accent)] bg-[var(--accent)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--bg)] no-underline hover:bg-transparent hover:text-[var(--accent)]"
        >
          Procure This Actuator &rarr;
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-[var(--muted)]">Loading...</div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
