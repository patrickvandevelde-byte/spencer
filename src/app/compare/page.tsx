"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ACTUATORS, FLUIDS, predict } from "@/lib/data";
import type { Actuator, PredictionResult } from "@/lib/data";
import { ActuatorIllustration, SprayPatternIllustration, ACTUATOR_COLORS } from "@/components/ActuatorIllustrations";
import { trackEvent } from "@/lib/store";

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 80 ? "score-excellent" : score >= 50 ? "score-good" : "score-poor";
  return (
    <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-semibold ${cls}`}>
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
    <span className="rounded-md border px-2 py-0.5 text-xs font-bold" style={{ borderColor: color, color }}>
      {regime}
    </span>
  );
}

function exportComparisonCSV(
  predictions: { actuator: Actuator; prediction: PredictionResult }[],
  fluidName: string,
  pressure: number,
) {
  const headers = [
    "Parameter",
    ...predictions.map(({ actuator }) => actuator.sku),
  ];
  const rows = [
    headers,
    ["Actuator Name", ...predictions.map(({ actuator }) => actuator.name)],
    ["Compatibility Score", ...predictions.map(({ prediction }) => String(prediction.compatibilityScore))],
    ["Atomization Regime", ...predictions.map(({ prediction }) => prediction.atomizationRegime)],
    ["Cone Angle (deg)", ...predictions.map(({ prediction }) => String(prediction.coneAngle_deg))],
    ["Dv50 (um)", ...predictions.map(({ prediction }) => String(prediction.dropletSizeDv50_um))],
    ["Flow Rate (mL/min)", ...predictions.map(({ prediction }) => String(prediction.flowRate_mL_min))],
    ["Spray Width @100mm (mm)", ...predictions.map(({ prediction }) => String(prediction.sprayWidth_mm_at_100mm))],
    ["Exit Velocity (m/s)", ...predictions.map(({ prediction }) => String(prediction.velocityExit_m_s))],
    ["Reynolds (Re)", ...predictions.map(({ prediction }) => String(prediction.reynoldsNumber))],
    ["Weber (We)", ...predictions.map(({ prediction }) => String(prediction.weberNumber))],
    ["Ohnesorge (Oh)", ...predictions.map(({ prediction }) => String(prediction.ohnesorgeNumber))],
    ["Orifice (mm)", ...predictions.map(({ actuator }) => String(actuator.orificeDiameter_mm))],
    ["Max Pressure (bar)", ...predictions.map(({ actuator }) => String(actuator.maxPressure_bar))],
    ["Unit Price (USD)", ...predictions.map(({ actuator }) => actuator.price_usd.toFixed(2))],
    ["Lead Time (days)", ...predictions.map(({ actuator }) => String(actuator.leadTime_days))],
    ["Safety Warnings", ...predictions.map(({ prediction }) => prediction.safetyWarnings.join("; ") || "None")],
  ];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aerospec_comparison_${fluidName.replace(/\s+/g, "_")}_${pressure}bar.csv`;
  a.click();
  URL.revokeObjectURL(url);
  trackEvent("export", { type: "comparison_csv", actuatorCount: predictions.length });
}

function CompareContent() {
  const params = useSearchParams();

  // Deep linking: read actuators, fluid, pressure from URL params
  const urlActuators = params.get("actuators");
  const urlFluid = params.get("fluid");
  const urlPressure = params.get("pressure");

  const initialIds = urlActuators
    ? urlActuators.split(",").filter((id) => ACTUATORS.some((a) => a.id === id))
    : [ACTUATORS[0].id, ACTUATORS[1].id];
  const initialFluid = urlFluid && FLUIDS.some((f) => f.id === urlFluid) ? urlFluid : FLUIDS[0].id;
  const initialPressure = urlPressure ? Number(urlPressure) : 5;

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [fluidId, setFluidId] = useState(initialFluid);
  const [pressure, setPressure] = useState(initialPressure);
  const [shareMessage, setShareMessage] = useState("");

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

  function handleCopyShareLink() {
    const shareUrl = `${window.location.origin}/compare?actuators=${selectedIds.join(",")}&fluid=${fluidId}&pressure=${pressure}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareMessage("Link copied!");
      setTimeout(() => setShareMessage(""), 2500);
    });
  }

  // Find best score for highlighting the winner
  const bestScore = predictions.length >= 2
    ? Math.max(...predictions.map((p) => p.prediction.compatibilityScore))
    : -1;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
            <span className="text-xs font-medium text-[var(--accent)]">COMPARE</span>
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--fg-bright)]">
            Side-by-Side Comparison
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Select up to 4 actuators to compare their predicted performance
          </p>
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {predictions.length >= 2 && (
            <>
              <button
                onClick={() => exportComparisonCSV(predictions, fluid.name, pressure)}
                className="btn-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export CSV
              </button>
              <button
                onClick={handleCopyShareLink}
                className="btn-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </svg>
                Share Link
              </button>
            </>
          )}
          <Link
            href="/configure"
            className="btn-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium no-underline"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Configure
          </Link>
        </div>
      </div>

      {shareMessage && (
        <div className="animate-in rounded-lg border border-[var(--success)]/30 bg-[var(--success)]/5 px-4 py-2 text-xs text-[var(--success)]">
          {shareMessage}
        </div>
      )}

      {/* Controls */}
      <div className="glass-bright rounded-xl p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium text-[var(--muted)]">
              Test Fluid
            </label>
            <select
              value={fluidId}
              onChange={(e) => setFluidId(e.target.value)}
              className="input-field w-full rounded-lg px-4 py-3 tabular-nums text-xs"
            >
              {FLUIDS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.viscosity_cP} cP ({f.solventClass})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-[var(--muted)]">
              Operating Pressure (bar)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              step={0.5}
              value={pressure}
              onChange={(e) => setPressure(Number(e.target.value))}
              className="input-field w-full rounded-lg px-4 py-3 tabular-nums text-xs"
            />
          </div>
        </div>

        {/* Actuator selector */}
        <div className="mt-6">
          <label className="mb-3 block text-xs font-medium text-[var(--muted)]">
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
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all ${
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
                  <th className="px-5 py-4 text-left text-xs font-medium text-[var(--muted)]">
                    Parameter
                  </th>
                  {predictions.map(({ actuator, prediction }) => {
                    const color = ACTUATOR_COLORS[actuator.type] || "#06b6d4";
                    const isWinner = prediction.compatibilityScore === bestScore;
                    return (
                      <th key={actuator.id} className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          {isWinner && (
                            <span className="rounded-full border border-[var(--success)]/40 bg-[var(--success)]/10 px-2 py-0.5 text-[10px] font-bold font-medium text-[var(--success)]">
                              Best Match
                            </span>
                          )}
                          <ActuatorIllustration type={actuator.type} size={56} />
                          <span className="text-xs font-semibold" style={{ color }}>
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
                          className={`px-5 py-3 text-center tabular-nums ${isBest ? "font-bold text-[var(--accent)]" : "text-[var(--fg-bright)]"}`}
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
                      <td key={actuator.id} className="px-5 py-3 text-center tabular-nums text-[var(--fg-bright)]">
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
                        <span className="text-[var(--success)] text-xs">None</span>
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
                {/* Per-actuator action row */}
                <tr>
                  <td className="px-5 py-4 text-[var(--muted)]">Actions</td>
                  {predictions.map(({ actuator }) => (
                    <td key={actuator.id} className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Link
                          href={`/results?actuator=${actuator.id}&fluid=${fluidId}&pressure=${pressure}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--accent)]/30 px-3 py-1.5 text-xs text-[var(--accent)] no-underline transition-all hover:bg-[var(--accent)]/10"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          Detail
                        </Link>
                        <Link
                          href={`/procurement?actuator=${actuator.id}&qty=100`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--success)]/30 px-3 py-1.5 text-xs text-[var(--success)] no-underline transition-all hover:bg-[var(--success)]/10"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
                          Procure
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {predictions.length < 2 && (
        <div className="glass rounded-xl p-12 text-center space-y-4">
          <p className="text-sm text-[var(--muted)]">Select at least 2 actuators to compare</p>
          <Link
            href="/configure"
            className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 text-xs font-medium no-underline"
          >
            Run a prediction to find candidates
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <svg className="h-8 w-8 animate-spin text-[var(--accent)]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
            <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
