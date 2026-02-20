"use client";

import { useState } from "react";
import { FLUIDS, SOLVENT_CLASS_LABELS } from "@/lib/data";
import type { Actuator, Fluid, PredictionResult, SolventClass } from "@/lib/data";
import Link from "next/link";
import { ActuatorIllustration, SprayPatternIllustration, ACTUATOR_COLORS } from "@/components/ActuatorIllustrations";

interface ResultRow {
  actuator: Actuator;
  prediction: PredictionResult;
}

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 80 ? "score-excellent" : score >= 50 ? "score-good" : "score-poor";
  return (
    <span className={`inline-block rounded-md border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] font-bold ${cls}`}>
      {score}/100
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

const ALL_SOLVENT_CLASSES = Object.keys(SOLVENT_CLASS_LABELS) as SolventClass[];

export default function ConfigurePage() {
  const [fluidId, setFluidId] = useState(FLUIDS[0].id);
  const [pressure, setPressure] = useState(5);
  const [results, setResults] = useState<ResultRow[] | null>(null);
  const [selectedFluid, setSelectedFluid] = useState<Fluid | null>(null);
  const [loading, setLoading] = useState(false);
  const [solventFilter, setSolventFilter] = useState<SolventClass | "all">("all");

  const filteredFluids = FLUIDS.filter(
    (f) => solventFilter === "all" || f.solventClass === solventFilter
  );

  async function handlePredict() {
    setLoading(true);
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fluidId, pressure_bar: pressure }),
    });
    const data = await res.json();
    setResults(data.results);
    setSelectedFluid(data.fluid);
    setLoading(false);
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--accent)]">STEP 1</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-[var(--fg-bright)]">
          Actuator Configuration
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Select a fluid and pressure to predict optimal actuator performance across all 12 geometries
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-bright rounded-xl p-6">
        {/* Solvent class quick-filter */}
        <div className="mb-4">
          <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Filter by Solvent Class
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setSolventFilter("all"); setFluidId(FLUIDS[0].id); }}
              className={`rounded-lg border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
                solventFilter === "all"
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
              }`}
            >
              All
            </button>
            {ALL_SOLVENT_CLASSES.map((sc) => {
              const count = FLUIDS.filter((f) => f.solventClass === sc).length;
              if (count === 0) return null;
              return (
                <button
                  key={sc}
                  onClick={() => {
                    setSolventFilter(sc);
                    const first = FLUIDS.find((f) => f.solventClass === sc);
                    if (first) setFluidId(first.id);
                  }}
                  className={`rounded-lg border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
                    solventFilter === sc
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  {SOLVENT_CLASS_LABELS[sc]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Select Fluid
            </label>
            <select
              value={fluidId}
              onChange={(e) => setFluidId(e.target.value)}
              className="input-field w-full rounded-lg px-4 py-3 font-[family-name:var(--font-mono)] text-xs"
            >
              {filteredFluids.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.viscosity_cP} cP
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
            <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">Range: 1–30 bar</p>
          </div>
          <div className="flex items-end">
            <button
              onClick={handlePredict}
              disabled={loading}
              className="btn-primary w-full rounded-lg px-6 py-3 font-[family-name:var(--font-mono)] text-xs tracking-wider"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                    <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Computing...
                </span>
              ) : (
                "Run Prediction"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Fluid Properties + Hazards */}
      {selectedFluid && (
        <div className="glass animate-in rounded-xl p-6">
          <h2 className="mb-4 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--muted)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            </svg>
            Fluid Properties — {selectedFluid.name}
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs md:grid-cols-4">
            {[
              { label: "Viscosity", value: `${selectedFluid.viscosity_cP} cP` },
              { label: "Density", value: `${selectedFluid.density_kg_m3} kg/m³` },
              { label: "Surface Tension", value: `${selectedFluid.surfaceTension_mN_m} mN/m` },
              { label: "Solvent Class", value: selectedFluid.solventClass },
              { label: "pH", value: String(selectedFluid.pH) },
              { label: "CAS", value: selectedFluid.cas },
              { label: "Flash Point", value: selectedFluid.flashPoint_C !== null ? `${selectedFluid.flashPoint_C}°C` : "N/A" },
              { label: "Category", value: selectedFluid.category },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-[var(--muted)]">{item.label}</span>
                <p className="mt-0.5 font-semibold text-[var(--fg-bright)]">{item.value}</p>
              </div>
            ))}
          </div>
          {/* Hazards & PPE */}
          {(selectedFluid.hazards.length > 0 || selectedFluid.ppeRequired.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-4 border-t border-[var(--border)] pt-4">
              {selectedFluid.hazards.length > 0 && (
                <div>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--danger)]">Hazards</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedFluid.hazards.map((h) => (
                      <span key={h} className="rounded-md border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--danger)]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedFluid.ppeRequired.length > 0 && (
                <div>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--warning)]">PPE Required</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedFluid.ppeRequired.map((p) => (
                      <span key={p} className="rounded-md border border-[var(--warning)]/30 bg-[var(--warning)]/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--warning)]">
                        {p.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="animate-in">
          <h2 className="mb-6 text-xl font-bold text-[var(--fg-bright)]">
            Predicted Configurations ({results.length} actuators)
          </h2>

          <div className="space-y-4">
            {results.map((r, i) => {
              const color = ACTUATOR_COLORS[r.actuator.type] || "#06b6d4";
              const hasWarnings = r.prediction.safetyWarnings.length > 0;
              return (
                <div
                  key={r.actuator.id}
                  className={`glass group rounded-xl p-5 transition-all hover:border-[var(--border-bright)] ${hasWarnings ? "border-l-2 border-l-[var(--danger)]" : ""}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)]">
                        <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--muted)]">#{i + 1}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ActuatorIllustration type={r.actuator.type} size={56} />
                        <SprayPatternIllustration type={r.actuator.type} size={40} />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider" style={{ color }}>
                          {r.actuator.sku}
                        </span>
                        <span className="text-xs text-[var(--muted)]">{r.actuator.name}</span>
                        <RegimeBadge regime={r.prediction.atomizationRegime} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 font-[family-name:var(--font-mono)] text-[11px]">
                        <span><span className="text-[var(--muted)]">Cone:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.coneAngle_deg}°</strong></span>
                        <span><span className="text-[var(--muted)]">Dv50:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.dropletSizeDv50_um} µm</strong></span>
                        <span><span className="text-[var(--muted)]">Flow:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.flowRate_mL_min} mL/min</strong></span>
                        <span><span className="text-[var(--muted)]">V:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.velocityExit_m_s} m/s</strong></span>
                        <span><span className="text-[var(--muted)]">Oh:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.ohnesorgeNumber}</strong></span>
                      </div>
                      {/* Safety warnings inline */}
                      {hasWarnings && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {r.prediction.safetyWarnings.map((w, wi) => (
                            <span key={wi} className="rounded-md border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--danger)]">
                              {w.split(":")[0]}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <ScoreBadge score={r.prediction.compatibilityScore} />
                      <Link
                        href={`/results?actuator=${r.actuator.id}&fluid=${selectedFluid?.id}&pressure=${pressure}`}
                        className="btn-secondary rounded-lg px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] tracking-wider no-underline"
                      >
                        Detail →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
