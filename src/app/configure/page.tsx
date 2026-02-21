"use client";

import { useState } from "react";
import { FLUIDS, SOLVENT_CLASS_LABELS } from "@/lib/data";
import type { Actuator, Fluid, PredictionResult, SolventClass, RheologyType } from "@/lib/data";
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

function CloggingBadge({ risk }: { risk: string }) {
  const colors: Record<string, string> = {
    none: "var(--muted)", low: "var(--success)", moderate: "var(--warning)", high: "var(--danger)",
  };
  if (risk === "none") return null;
  return (
    <span className="rounded-md border px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-bold uppercase" style={{ borderColor: colors[risk], color: colors[risk] }}>
      Clog: {risk}
    </span>
  );
}

const ALL_SOLVENT_CLASSES = Object.keys(SOLVENT_CLASS_LABELS) as SolventClass[];

export default function ConfigurePage() {
  // Fluid selection
  const [inputMode, setInputMode] = useState<"library" | "custom">("library");
  const [fluidId, setFluidId] = useState(FLUIDS[0].id);
  const [solventFilter, setSolventFilter] = useState<SolventClass | "all">("all");

  // Custom fluid properties
  const [customViscosity, setCustomViscosity] = useState(1.0);
  const [customDensity, setCustomDensity] = useState(998);
  const [customSurfaceTension, setCustomSurfaceTension] = useState(72.8);
  const [customSolventClass, setCustomSolventClass] = useState<SolventClass>("aqueous");
  const [customRheology, setCustomRheology] = useState<RheologyType>("newtonian");
  const [customPowerLawN, setCustomPowerLawN] = useState(1.0);
  const [customParticleSize, setCustomParticleSize] = useState(0);

  // Operating conditions
  const [pressure, setPressure] = useState(5);

  // Results
  const [results, setResults] = useState<ResultRow[] | null>(null);
  const [selectedFluid, setSelectedFluid] = useState<Fluid | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredFluids = FLUIDS.filter(
    (f) => solventFilter === "all" || f.solventClass === solventFilter
  );

  async function handlePredict() {
    setLoading(true);

    if (inputMode === "custom") {
      // Build a custom fluid object and call predict client-side
      const { ACTUATORS, predict } = await import("@/lib/data");
      const customFluid: Fluid = {
        id: "CUSTOM",
        name: "Custom Fluid",
        viscosity_cP: customViscosity,
        density_kg_m3: customDensity,
        surfaceTension_mN_m: customSurfaceTension,
        pH: 7.0,
        solventClass: customSolventClass,
        flashPoint_C: null,
        cas: "—",
        category: "User-Defined",
        hazards: [],
        ppeRequired: [],
        rheology: customRheology,
        powerLawN: customRheology === "power_law" ? customPowerLawN : undefined,
        powerLawK: customRheology === "power_law" ? customViscosity / 1000 : undefined,
        maxParticleSize_um: customParticleSize > 0 ? customParticleSize : undefined,
      };
      const predResults = ACTUATORS.map((actuator) => ({
        actuator,
        prediction: predict(actuator, customFluid, pressure),
      }));
      predResults.sort((a, b) => b.prediction.compatibilityScore - a.prediction.compatibilityScore);
      setResults(predResults);
      setSelectedFluid(customFluid);
    } else {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fluidId, pressure_bar: pressure }),
      });
      const data = await res.json();
      setResults(data.results);
      setSelectedFluid(data.fluid);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--fg-bright)]">
          Actuator Configurator
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Define fluid properties and operating conditions. The engine predicts optimal actuator performance using type-specific atomization models.
        </p>
      </div>

      {/* ===== STEP 1: FLUID INPUT ===== */}
      <div className="glass-bright rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
            Step 1 — Fluid Properties
          </h2>
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            <button
              onClick={() => setInputMode("library")}
              className={`px-4 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
                inputMode === "library" ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--muted)]"
              }`}
            >
              Library ({FLUIDS.length} fluids)
            </button>
            <button
              onClick={() => setInputMode("custom")}
              className={`px-4 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
                inputMode === "custom" ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--muted)]"
              }`}
            >
              Custom Input
            </button>
          </div>
        </div>

        {inputMode === "library" ? (
          <>
            {/* Solvent class quick-filter */}
            <div>
              <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Solvent Class
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
                    {f.name} — {f.viscosity_cP} cP {f.rheology !== "newtonian" ? `(${f.rheology})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          /* Custom fluid input form */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Dynamic Viscosity (cP)
              </label>
              <input
                type="number" min={0.1} max={100000} step={0.1}
                value={customViscosity}
                onChange={(e) => setCustomViscosity(Number(e.target.value))}
                className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Density (kg/m³)
              </label>
              <input
                type="number" min={500} max={3000} step={1}
                value={customDensity}
                onChange={(e) => setCustomDensity(Number(e.target.value))}
                className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Surface Tension (mN/m)
              </label>
              <input
                type="number" min={10} max={80} step={0.1}
                value={customSurfaceTension}
                onChange={(e) => setCustomSurfaceTension(Number(e.target.value))}
                className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Solvent Class
              </label>
              <select
                value={customSolventClass}
                onChange={(e) => setCustomSolventClass(e.target.value as SolventClass)}
                className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
              >
                {ALL_SOLVENT_CLASSES.map((sc) => (
                  <option key={sc} value={sc}>{SOLVENT_CLASS_LABELS[sc]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Rheology Type
              </label>
              <select
                value={customRheology}
                onChange={(e) => setCustomRheology(e.target.value as RheologyType)}
                className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
              >
                <option value="newtonian">Newtonian</option>
                <option value="power_law">Power-Law (Shear-Thinning)</option>
                <option value="bingham">Bingham Plastic</option>
                <option value="herschel_bulkley">Herschel-Bulkley</option>
              </select>
            </div>
            {customRheology === "power_law" && (
              <div>
                <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                  Flow Index (n) <span className="normal-case">n&lt;1 = shear-thinning</span>
                </label>
                <input
                  type="number" min={0.1} max={2} step={0.01}
                  value={customPowerLawN}
                  onChange={(e) => setCustomPowerLawN(Number(e.target.value))}
                  className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Max Particle Size (µm) <span className="normal-case">0 = no particles</span>
              </label>
              <input
                type="number" min={0} max={500} step={1}
                value={customParticleSize}
                onChange={(e) => setCustomParticleSize(Number(e.target.value))}
                className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* ===== STEP 2: OPERATING CONDITIONS ===== */}
      <div className="glass-bright rounded-xl p-6 space-y-5">
        <h2 className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
          Step 2 — Operating Conditions
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Operating Pressure (bar)
            </label>
            <input
              type="number"
              min={0.5}
              max={350}
              step={0.5}
              value={pressure}
              onChange={(e) => setPressure(Number(e.target.value))}
              className="input-field w-full rounded-lg px-4 py-3 font-[family-name:var(--font-mono)] text-xs"
            />
            <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">Range: 0.5–350 bar</p>
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

      {/* ===== FLUID SUMMARY ===== */}
      {selectedFluid && (
        <div className="glass animate-in rounded-xl p-6">
          <h2 className="mb-4 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
            Fluid Profile — {selectedFluid.name}
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs md:grid-cols-4 lg:grid-cols-5">
            {[
              { label: "Viscosity", value: `${selectedFluid.viscosity_cP} cP` },
              { label: "Density", value: `${selectedFluid.density_kg_m3} kg/m³` },
              { label: "Surface Tension", value: `${selectedFluid.surfaceTension_mN_m} mN/m` },
              { label: "Solvent Class", value: SOLVENT_CLASS_LABELS[selectedFluid.solventClass] },
              { label: "Rheology", value: selectedFluid.rheology.replace("_", " ") },
              ...(selectedFluid.powerLawN ? [{ label: "Flow Index (n)", value: String(selectedFluid.powerLawN) }] : []),
              ...(selectedFluid.yieldStress_Pa ? [{ label: "Yield Stress", value: `${selectedFluid.yieldStress_Pa} Pa` }] : []),
              ...(selectedFluid.maxParticleSize_um ? [{ label: "Max Particle", value: `${selectedFluid.maxParticleSize_um} µm` }] : []),
              ...(selectedFluid.suspensionConcentration_pct ? [{ label: "Solids", value: `${selectedFluid.suspensionConcentration_pct}%` }] : []),
              { label: "pH", value: String(selectedFluid.pH) },
              { label: "Flash Point", value: selectedFluid.flashPoint_C !== null ? `${selectedFluid.flashPoint_C}°C` : "N/A" },
              { label: "CAS", value: selectedFluid.cas },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-[var(--muted)]">{item.label}</span>
                <p className="mt-0.5 font-semibold text-[var(--fg-bright)]">{item.value}</p>
              </div>
            ))}
          </div>
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

      {/* ===== RESULTS ===== */}
      {results && (
        <div className="animate-in">
          <h2 className="mb-6 text-xl font-bold text-[var(--fg-bright)]">
            Predicted Configurations ({results.length} actuators ranked)
          </h2>

          <div className="space-y-4">
            {results.map((r, i) => {
              const color = ACTUATOR_COLORS[r.actuator.type] || "#06b6d4";
              const hasWarnings = r.prediction.safetyWarnings.length > 0;
              const dist = r.prediction.dropletDistribution;
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
                      <div className="mb-1 flex items-center gap-2 flex-wrap">
                        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider" style={{ color }}>
                          {r.actuator.sku}
                        </span>
                        <span className="text-xs text-[var(--muted)]">{r.actuator.name}</span>
                        <RegimeBadge regime={r.prediction.atomizationRegime} />
                        <CloggingBadge risk={r.prediction.cloggingRisk} />
                      </div>

                      {/* Primary metrics */}
                      <div className="mt-2 flex flex-wrap gap-4 font-[family-name:var(--font-mono)] text-[11px]">
                        <span><span className="text-[var(--muted)]">Cone:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.coneAngle_deg}°</strong></span>
                        <span>
                          <span className="text-[var(--muted)]">Dv10/50/90:</span>{" "}
                          <strong className="text-[var(--fg-bright)]">{dist.Dv10_um}/{dist.Dv50_um}/{dist.Dv90_um} µm</strong>
                        </span>
                        <span><span className="text-[var(--muted)]">Span:</span> <strong className="text-[var(--fg-bright)]">{dist.span}</strong></span>
                        <span><span className="text-[var(--muted)]">Flow:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.flowRate_mL_min} mL/min</strong></span>
                        <span><span className="text-[var(--muted)]">Rate:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.deliveryRate_g_s} g/s</strong></span>
                      </div>

                      {/* Apparent viscosity for non-Newtonian */}
                      {selectedFluid && selectedFluid.rheology !== "newtonian" && (
                        <div className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
                          Apparent viscosity at orifice: {r.prediction.apparentViscosity_cP} cP
                        </div>
                      )}

                      {/* Material stress indicators */}
                      {(r.prediction.materialStress.swellingRisk || r.prediction.materialStress.stressCrackingRisk) && (
                        <div className="mt-1 flex gap-2">
                          {r.prediction.materialStress.swellingRisk && (
                            <span className="rounded-md border border-[var(--warning)]/40 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--warning)]">Swelling Risk</span>
                          )}
                          {r.prediction.materialStress.stressCrackingRisk && (
                            <span className="rounded-md border border-[var(--danger)]/40 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--danger)]">Stress Crack Risk</span>
                          )}
                          {r.prediction.materialStress.leachingRisk && (
                            <span className="rounded-md border border-[var(--warning)]/40 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--warning)]">Leaching Risk</span>
                          )}
                        </div>
                      )}

                      {/* Safety warnings */}
                      {hasWarnings && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {r.prediction.safetyWarnings.slice(0, 3).map((w, wi) => (
                            <span key={wi} className="rounded-md border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--danger)]">
                              {w.split(":")[0]}
                            </span>
                          ))}
                          {r.prediction.safetyWarnings.length > 3 && (
                            <span className="text-[var(--danger)] text-[9px]">+{r.prediction.safetyWarnings.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <ScoreBadge score={r.prediction.compatibilityScore} />
                      <Link
                        href={`/results?actuator=${r.actuator.id}&fluid=${selectedFluid?.id}&pressure=${pressure}`}
                        className="btn-secondary rounded-lg px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] tracking-wider no-underline"
                      >
                        Detail
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
