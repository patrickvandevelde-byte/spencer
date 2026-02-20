"use client";

import { useState } from "react";
import { FLUIDS } from "@/lib/data";
import type { Actuator, Fluid, PredictionResult } from "@/lib/data";
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

export default function ConfigurePage() {
  const [fluidId, setFluidId] = useState(FLUIDS[0].id);
  const [pressure, setPressure] = useState(5);
  const [results, setResults] = useState<ResultRow[] | null>(null);
  const [selectedFluid, setSelectedFluid] = useState<Fluid | null>(null);
  const [loading, setLoading] = useState(false);

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
          Select a fluid and pressure to predict optimal actuator performance
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-bright rounded-xl p-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Fluid Selection */}
          <div>
            <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Select Fluid
            </label>
            <select
              value={fluidId}
              onChange={(e) => setFluidId(e.target.value)}
              className="input-field w-full rounded-lg px-4 py-3 font-[family-name:var(--font-mono)] text-xs"
            >
              {FLUIDS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.viscosity_cP} cP
                </option>
              ))}
            </select>
          </div>

          {/* Pressure */}
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

          {/* Submit */}
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

      {/* Fluid Properties Card */}
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
            ].map((item) => (
              <div key={item.label}>
                <span className="text-[var(--muted)]">{item.label}</span>
                <p className="mt-0.5 font-semibold text-[var(--fg-bright)]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results — Visual Cards */}
      {results && (
        <div className="animate-in">
          <h2 className="mb-6 text-xl font-bold text-[var(--fg-bright)]">
            Predicted Configurations
          </h2>

          <div className="space-y-4">
            {results.map((r, i) => {
              const color = ACTUATOR_COLORS[r.actuator.type] || "#06b6d4";
              return (
                <div
                  key={r.actuator.id}
                  className="glass group rounded-xl p-5 transition-all hover:border-[var(--border-bright)]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    {/* Rank + Illustration */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)]">
                        <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--muted)]">
                          #{i + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ActuatorIllustration type={r.actuator.type} size={64} />
                        <SprayPatternIllustration type={r.actuator.type} size={48} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider" style={{ color }}>
                          {r.actuator.sku}
                        </span>
                        <span className="text-xs text-[var(--muted)]">{r.actuator.name}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 font-[family-name:var(--font-mono)] text-[11px]">
                        <span><span className="text-[var(--muted)]">Cone:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.coneAngle_deg}°</strong></span>
                        <span><span className="text-[var(--muted)]">Dv50:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.dropletSizeDv50_um} µm</strong></span>
                        <span><span className="text-[var(--muted)]">Flow:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.flowRate_mL_min} mL/min</strong></span>
                        <span><span className="text-[var(--muted)]">Width:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.sprayWidth_mm_at_100mm} mm</strong></span>
                        <span><span className="text-[var(--muted)]">Re:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.reynoldsNumber.toLocaleString()}</strong></span>
                        <span><span className="text-[var(--muted)]">We:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.weberNumber.toLocaleString()}</strong></span>
                      </div>
                    </div>

                    {/* Score + Action */}
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
