"use client";

import { useState } from "react";
import { ACTUATORS, FLUIDS, predict } from "@/lib/data";
import type { Actuator, Fluid, PredictionResult } from "@/lib/data";
import { ActuatorIllustration, SprayPatternIllustration, ACTUATOR_COLORS } from "@/components/ActuatorIllustrations";

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 80 ? "score-excellent" : score >= 50 ? "score-good" : "score-poor";
  return (
    <span className={`inline-block rounded-md border px-2 py-0.5 font-[family-name:var(--font-mono)] text-[11px] font-bold ${cls}`}>
      {score}
    </span>
  );
}

function RegimeBadge({ regime }: { regime: string }) {
  const colors: Record<string, string> = {
    Atomization: "var(--success)",
    "Wind-stressed": "var(--accent)",
    "Wind-induced": "var(--warning)",
    Rayleigh: "var(--danger)",
  };
  const color = colors[regime] || "var(--muted)";
  return (
    <span className="rounded-md border px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold" style={{ borderColor: color, color }}>
      {regime}
    </span>
  );
}

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    ACTUATORS[0].id,
    ACTUATORS[1].id,
  ]);
  const [fluidId, setFluidId] = useState(FLUIDS[0].id);
  const [pressure, setPressure] = useState(5);

  const fluid = FLUIDS.find((f) => f.id === fluidId)!;
  const comparisons = selectedIds
    .map((id) => ACTUATORS.find((a) => a.id === id))
    .filter(Boolean) as Actuator[];
  const predictions = comparisons.map((a) => ({
    actuator: a,
    prediction: predict(a, fluid, pressure),
  }));

  function toggleActuator(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 4
          ? [...prev, id]
          : prev
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--accent)]">COMPARE</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-[var(--fg-bright)]">
          Side-by-Side Comparison
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Select up to 4 actuators to compare their predicted performance
        </p>
      </div>

      {/* Controls */}
      <div className="glass-bright rounded-xl p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Test Fluid
            </label>
            <select
              value={fluidId}
              onChange={(e) => setFluidId(e.target.value)}
              className="input-field w-full rounded-lg px-4 py-3 font-[family-name:var(--font-mono)] text-xs"
            >
              {FLUIDS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.viscosity_cP} cP ({f.solventClass})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Operating Pressure (bar)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              step={0.5}
              value={pressure}
              onChange={(e) => setPressure(Number(e.target.value))}
              className="input-field w-full rounded-lg px-4 py-3 font-[family-name:var(--font-mono)] text-xs"
            />
          </div>
        </div>

        {/* Actuator selector */}
        <div className="mt-6">
          <label className="mb-3 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Select Actuators (2-4)
          </label>
          <div className="flex flex-wrap gap-2">
            {ACTUATORS.map((a) => {
              const active = selectedIds.includes(a.id);
              const color = ACTUATOR_COLORS[a.type] || "#06b6d4";
              return (
                <button
                  key={a.id}
                  onClick={() => toggleActuator(a.id)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] transition-all ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: active ? color : "var(--muted)" }} />
                  {a.sku}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      {predictions.length >= 2 && (
        <div className="glass overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-5 py-4 text-left font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">
                    Parameter
                  </th>
                  {predictions.map(({ actuator }) => {
                    const color = ACTUATOR_COLORS[actuator.type] || "#06b6d4";
                    return (
                      <th key={actuator.id} className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <ActuatorIllustration type={actuator.type} size={56} />
                          <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider" style={{ color }}>
                            {actuator.sku}
                          </span>
                          <span className="text-[10px] text-[var(--muted)]">{actuator.name}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* Spray Pattern */}
                <tr className="border-b border-[var(--border)]">
                  <td className="px-5 py-3 text-[var(--muted)]">Spray Pattern</td>
                  {predictions.map(({ actuator }) => (
                    <td key={actuator.id} className="px-5 py-3 text-center">
                      <div className="flex justify-center">
                        <SprayPatternIllustration type={actuator.type} size={48} />
                      </div>
                    </td>
                  ))}
                </tr>
                {/* Score */}
                <tr className="border-b border-[var(--border)]">
                  <td className="px-5 py-3 text-[var(--muted)]">Compatibility Score</td>
                  {predictions.map(({ actuator, prediction }) => (
                    <td key={actuator.id} className="px-5 py-3 text-center">
                      <ScoreBadge score={prediction.compatibilityScore} />
                    </td>
                  ))}
                </tr>
                {/* Atomization Regime */}
                <tr className="border-b border-[var(--border)]">
                  <td className="px-5 py-3 text-[var(--muted)]">Atomization Regime</td>
                  {predictions.map(({ actuator, prediction }) => (
                    <td key={actuator.id} className="px-5 py-3 text-center">
                      <RegimeBadge regime={prediction.atomizationRegime} />
                    </td>
                  ))}
                </tr>
                {/* Numeric rows */}
                {([
                  ["Cone Angle", "coneAngle_deg", "°"],
                  ["Droplet Dv50", "dropletSizeDv50_um", " µm"],
                  ["Flow Rate", "flowRate_mL_min", " mL/min"],
                  ["Spray Width @ 100mm", "sprayWidth_mm_at_100mm", " mm"],
                  ["Exit Velocity", "velocityExit_m_s", " m/s"],
                  ["Reynolds (Re)", "reynoldsNumber", ""],
                  ["Weber (We)", "weberNumber", ""],
                  ["Ohnesorge (Oh)", "ohnesorgeNumber", ""],
                ] as [string, keyof PredictionResult, string][]).map(([label, key, unit]) => (
                  <tr key={label} className="table-row-hover border-b border-[var(--border)] last:border-b-0">
                    <td className="px-5 py-3 text-[var(--muted)]">{label}</td>
                    {predictions.map(({ actuator, prediction }) => {
                      const val = prediction[key];
                      const numVal = typeof val === "number" ? val : 0;
                      const best = Math.max(
                        ...predictions.map((p) => {
                          const v = p.prediction[key];
                          return typeof v === "number" ? v : 0;
                        })
                      );
                      const isBest = numVal === best && predictions.length > 1;
                      return (
                        <td
                          key={actuator.id}
                          className={`px-5 py-3 text-center font-[family-name:var(--font-mono)] ${isBest ? "font-bold text-[var(--accent)]" : "text-[var(--fg-bright)]"}`}
                        >
                          {typeof val === "number" ? val.toLocaleString() : typeof val === "string" ? val : "—"}
                          {unit}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* Spec rows */}
                {([
                  ["Orifice Diameter", (a: Actuator) => `${a.orificeDiameter_mm} mm`],
                  ["Max Pressure", (a: Actuator) => `${a.maxPressure_bar} bar`],
                  ["Unit Price", (a: Actuator) => `$${a.price_usd.toFixed(2)}`],
                  ["Lead Time", (a: Actuator) => `${a.leadTime_days} days`],
                ] as [string, (a: Actuator) => string][]).map(([label, fn]) => (
                  <tr key={label} className="table-row-hover border-b border-[var(--border)] last:border-b-0">
                    <td className="px-5 py-3 text-[var(--muted)]">{label}</td>
                    {predictions.map(({ actuator }) => (
                      <td key={actuator.id} className="px-5 py-3 text-center font-[family-name:var(--font-mono)] text-[var(--fg-bright)]">
                        {fn(actuator)}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Safety Warnings */}
                <tr className="border-b border-[var(--border)]">
                  <td className="px-5 py-3 text-[var(--muted)]">Safety Warnings</td>
                  {predictions.map(({ actuator, prediction }) => (
                    <td key={actuator.id} className="px-5 py-3 text-center">
                      {prediction.safetyWarnings.length === 0 ? (
                        <span className="text-[var(--success)] font-[family-name:var(--font-mono)] text-[10px]">None</span>
                      ) : (
                        <div className="space-y-1">
                          {prediction.safetyWarnings.map((w, i) => (
                            <p key={i} className="text-[10px] text-[var(--danger)]">{w.split(":")[0]}</p>
                          ))}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {predictions.length < 2 && (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-sm text-[var(--muted)]">Select at least 2 actuators to compare</p>
        </div>
      )}
    </div>
  );
}
