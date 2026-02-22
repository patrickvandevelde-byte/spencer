"use client";

import { useState } from "react";
import Link from "next/link";
import type { FormulaInput, PhysicsResult, PressureCurvePoint } from "@/lib/spenser-physics";
import type { ITVSpec, LPVSpec } from "@/lib/kmd-data";
import type { PPWRResult } from "@/lib/ppwr-compliance";

type ViscosityCategory = FormulaInput["category"];

interface ComponentEntry {
  part: { id: string; name: string; weight_g: number; description: string };
  selectedMaterial: string;
  note: string;
}

interface ConfigResult {
  input: FormulaInput;
  category: ViscosityCategory;
  physics: PhysicsResult;
  compatibleITVs: ITVSpec[];
  compatibleLPVs: LPVSpec[];
  components: ComponentEntry[];
  ppwr: PPWRResult;
  pressureCurve: PressureCurvePoint[];
}

const CATEGORY_EXAMPLES: Record<ViscosityCategory, string> = {
  liquid: "Toners, micellar water, setting sprays",
  lotion: "Body lotions, sunscreens, light serums",
  cream: "Moisturisers, shaving creams, conditioners",
  paste: "Toothpaste, hair wax, thick sunscreen",
  gel: "Hair gel, shower gel, medical gels",
};

function PressureCurveChart({ curve }: { curve: PressureCurvePoint[] }) {
  if (curve.length === 0) return null;
  const maxP = Math.max(...curve.map((p) => Math.max(p.spenser_bar, p.bov_bar, p.aerosol_bar)));
  const h = 180;
  const w = 400;
  const pad = 40;

  const toX = (i: number) => pad + (i / (curve.length - 1)) * (w - pad * 2);
  const toY = (val: number) => h - pad - ((val / maxP) * (h - pad * 2));

  const makePath = (key: keyof PressureCurvePoint) =>
    curve.map((p, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(p[key] as number).toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={pad} y1={toY(maxP * f)} x2={w - pad} y2={toY(maxP * f)} stroke="var(--border)" strokeWidth="0.5" />
      ))}
      {/* Axis labels */}
      <text x={pad - 4} y={h - pad + 14} fill="var(--muted)" fontSize="8" textAnchor="end">0%</text>
      <text x={w - pad + 4} y={h - pad + 14} fill="var(--muted)" fontSize="8" textAnchor="start">100%</text>
      <text x={pad - 4} y={toY(maxP) + 3} fill="var(--muted)" fontSize="8" textAnchor="end">{maxP.toFixed(1)}</text>
      <text x={w / 2} y={h - 4} fill="var(--muted)" fontSize="8" textAnchor="middle">Product Dispensed</text>
      {/* Curves */}
      <path d={makePath("aerosol_bar")} fill="none" stroke="var(--danger)" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
      <path d={makePath("bov_bar")} fill="none" stroke="var(--warning)" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.7" />
      <path d={makePath("spenser_bar")} fill="none" stroke="var(--success)" strokeWidth="2" />
      {/* Legend */}
      <line x1={pad} y1={12} x2={pad + 16} y2={12} stroke="var(--success)" strokeWidth="2" />
      <text x={pad + 20} y={15} fill="var(--success)" fontSize="8">Spenser SFP</text>
      <line x1={pad + 90} y1={12} x2={pad + 106} y2={12} stroke="var(--warning)" strokeWidth="1.5" strokeDasharray="6 3" />
      <text x={pad + 110} y={15} fill="var(--warning)" fontSize="8">BOV</text>
      <line x1={pad + 140} y1={12} x2={pad + 156} y2={12} stroke="var(--danger)" strokeWidth="1.5" strokeDasharray="4 2" />
      <text x={pad + 160} y={15} fill="var(--danger)" fontSize="8">Aerosol</text>
    </svg>
  );
}

function GradeBadge({ grade, score }: { grade: string; score: number }) {
  const colors: Record<string, string> = {
    A: "text-[var(--success)] border-[var(--success)]",
    B: "text-[var(--accent)] border-[var(--accent)]",
    C: "text-[var(--warning)] border-[var(--warning)]",
    D: "text-[var(--danger)] border-[var(--danger)]",
    E: "text-[var(--danger)] border-[var(--danger)]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-sm font-bold ${colors[grade] ?? ""}`}>
      Grade {grade} <span className="text-xs font-normal opacity-70">({score}%)</span>
    </span>
  );
}

export default function SpenserConfigurePage() {
  const [form, setForm] = useState({
    viscosity_cP: "",
    density_g_cm3: "1.0",
    fillVolume_ml: "150",
    gasSensitive: false,
    orientation360: false,
  });
  const [result, setResult] = useState<ConfigResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/spenser/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          viscosity_cP: Number(form.viscosity_cP),
          density_g_cm3: Number(form.density_g_cm3),
          fillVolume_ml: Number(form.fillVolume_ml),
          gasSensitive: form.gasSensitive,
          orientation360: form.orientation360,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Configuration failed");
        setResult(null);
      } else {
        setResult(data as ConfigResult);
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/spenser" className="text-xs text-[var(--muted)] no-underline hover:text-[var(--accent)]">
            &larr; Spenser Dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--fg-bright)]">Formula-to-Hardware Mapping</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Enter your formula data to generate a complete SFP hardware specification.</p>
        </div>
        <span className="rounded-full border border-[var(--border-bright)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
          FLOW A
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6">
        <div className="mb-4 text-xs font-medium text-[var(--muted)]">
          PRODUCT INPUT
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-[var(--muted)]">Viscosity (cP)</label>
            <input
              type="number"
              min="1"
              max="500000"
              step="any"
              required
              value={form.viscosity_cP}
              onChange={(e) => setForm({ ...form, viscosity_cP: e.target.value })}
              className="input-field w-full rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 5000"
            />
            {form.viscosity_cP && (
              <div className="mt-1 text-[10px] text-[var(--accent)]">
                {CATEGORY_EXAMPLES[
                  Number(form.viscosity_cP) < 100 ? "liquid"
                    : Number(form.viscosity_cP) < 1000 ? "lotion"
                    : Number(form.viscosity_cP) < 10000 ? "cream"
                    : Number(form.viscosity_cP) < 50000 ? "paste"
                    : "gel"
                ]}
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted)]">Density (g/cm³)</label>
            <input
              type="number"
              min="0.5"
              max="3.0"
              step="0.01"
              required
              value={form.density_g_cm3}
              onChange={(e) => setForm({ ...form, density_g_cm3: e.target.value })}
              className="input-field w-full rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted)]">Fill Volume (ml)</label>
            <input
              type="number"
              min="10"
              max="500"
              step="1"
              required
              value={form.fillVolume_ml}
              onChange={(e) => setForm({ ...form, fillVolume_ml: e.target.value })}
              className="input-field w-full rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-[var(--fg)]">
            <input
              type="checkbox"
              checked={form.gasSensitive}
              onChange={(e) => setForm({ ...form, gasSensitive: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Gas-sensitive actives
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--fg)]">
            <input
              type="checkbox"
              checked={form.orientation360}
              onChange={(e) => setForm({ ...form, orientation360: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            360° orientation
          </label>
          <button type="submit" disabled={loading} className="btn-primary ml-auto rounded-lg px-6 py-2 text-xs font-medium">
            {loading ? "SIMULATING..." : "RUN CONFIGURATION"}
          </button>
        </div>
        {error && <div className="mt-3 rounded-lg border border-[var(--danger)] bg-[var(--danger)]/10 p-3 text-sm text-[var(--danger)]">{error}</div>}
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-8 animate-in">
          {/* Pressure Simulation */}
          <section className="glass-bright rounded-2xl p-6">
            <div className="mb-4 text-xs font-medium text-[var(--accent)]">PRESSURE CURVE SIMULATION</div>
            <div className="grid gap-6 md:grid-cols-2">
              <PressureCurveChart curve={result.pressureCurve} />
              <div className="space-y-3">
                <div className="rounded-xl border border-[var(--border)] p-4">
                  <div className="text-xs text-[var(--muted)]">Output Pressure</div>
                  <div className="text-2xl font-bold text-[var(--fg-bright)]">{result.physics.equilibrium.outputPressure_bar} bar</div>
                  <div className="text-xs text-[var(--success)]">&lt;{result.physics.equilibrium.pressureVariation_pct}% variation</div>
                </div>
                <div className="rounded-xl border border-[var(--border)] p-4">
                  <div className="text-xs text-[var(--muted)]">Reference Preload</div>
                  <div className="text-lg font-bold text-[var(--fg-bright)]">{result.physics.equilibrium.referencePreload_bar} bar</div>
                </div>
                <div className="rounded-xl border border-[var(--border)] p-4">
                  <div className="text-xs text-[var(--muted)]">Piston Force</div>
                  <div className="text-lg font-bold text-[var(--fg-bright)]">{result.physics.equilibrium.pistonForce_N} N</div>
                </div>
              </div>
            </div>
          </section>

          {/* Recommended Piston */}
          <section className="glass rounded-2xl p-6">
            <div className="mb-4 text-xs font-medium text-[var(--muted)]">RECOMMENDED PISTON</div>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <div className="text-xs text-[var(--muted)]">Model</div>
                <div className="font-semibold text-[var(--fg-bright)]">{result.physics.recommendedPiston.name}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--muted)]">Diameter</div>
                <div className="font-semibold text-[var(--fg-bright)]">{result.physics.recommendedPiston.diameter_mm} mm</div>
              </div>
              <div>
                <div className="text-xs text-[var(--muted)]">Seal Material</div>
                <div className="font-semibold text-[var(--fg-bright)]">{result.physics.recommendedPiston.sealMaterial}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--muted)]">Stroke Length</div>
                <div className="font-semibold text-[var(--fg-bright)]">{result.physics.equilibrium.strokeLength_mm} mm</div>
              </div>
            </div>
          </section>

          {/* Compatible ITVs */}
          <section className="glass rounded-2xl p-6">
            <div className="mb-4 text-xs font-medium text-[var(--muted)]">
              COMPATIBLE INTEGRATED VALVES (ITV)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted)]">
                    <th className="pb-2 pr-4">Model</th>
                    <th className="pb-2 pr-4">Orifice</th>
                    <th className="pb-2 pr-4">Flow Rate</th>
                    <th className="pb-2 pr-4">Max Pressure</th>
                    <th className="pb-2">Spray Angle</th>
                  </tr>
                </thead>
                <tbody>
                  {result.compatibleITVs.map((itv) => (
                    <tr key={itv.id} className="border-b border-[var(--border)] table-row-hover">
                      <td className="py-2 pr-4 font-semibold text-[var(--fg-bright)]">{itv.name}</td>
                      <td className="py-2 pr-4">{itv.orifice_mm} mm</td>
                      <td className="py-2 pr-4">{itv.flowRate_ml_min} ml/min</td>
                      <td className="py-2 pr-4">{itv.maxPressure_bar} bar</td>
                      <td className="py-2">{itv.sprayAngle_deg}°</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Compatible LPVs */}
          <section className="glass rounded-2xl p-6">
            <div className="mb-4 text-xs font-medium text-[var(--muted)]">
              COMPATIBLE PRESSURE VESSELS (LPV)
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {result.compatibleLPVs.map((lpv) => (
                <div key={lpv.id} className="rounded-xl border border-[var(--border)] p-4">
                  <div className="font-semibold text-[var(--fg-bright)]">{lpv.name}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-[var(--muted)]">Volume:</span> {lpv.volume_ml} ml</div>
                    <div><span className="text-[var(--muted)]">Max:</span> {lpv.maxPressure_bar} bar</div>
                    <div><span className="text-[var(--muted)]">Print:</span> {lpv.printingSurface_cm2} cm²</div>
                    <div><span className="text-[var(--muted)]">Weight:</span> {lpv.weight_g} g</div>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    {lpv.transparent && <span className="rounded bg-[var(--accent)]/10 px-1.5 py-0.5 text-[10px] text-[var(--accent)]">Transparent</span>}
                    <span className="rounded bg-[var(--success)]/10 px-1.5 py-0.5 text-[10px] text-[var(--success)]">{lpv.recyclingStream}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 11 IM Parts */}
          <section className="glass rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs font-medium text-[var(--muted)]">
                11 INJECTION-MOULDED PARTS
              </div>
              <GradeBadge grade={result.ppwr.grade} score={result.ppwr.score} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted)]">
                    <th className="pb-2 pr-4">#</th>
                    <th className="pb-2 pr-4">Part</th>
                    <th className="pb-2 pr-4">Material</th>
                    <th className="pb-2 pr-4">Weight</th>
                    <th className="pb-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {result.components.map((comp, i) => (
                    <tr key={comp.part.id} className="border-b border-[var(--border)] table-row-hover">
                      <td className="py-2 pr-4 text-xs text-[var(--muted)]">{i + 1}</td>
                      <td className="py-2 pr-4 font-semibold text-[var(--fg-bright)]">{comp.part.name}</td>
                      <td className="py-2 pr-4">
                        <span className="rounded bg-[var(--surface)] px-2 py-0.5 text-xs">
                          {comp.selectedMaterial}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-xs">{comp.part.weight_g} g</td>
                      <td className="py-2 text-xs text-[var(--muted)]">{comp.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Finalization */}
          <section className="glass-bright rounded-2xl p-6 text-center">
            <div className="mb-2 text-xs font-medium text-[var(--accent)]">RECIPE READY</div>
            <p className="mb-4 text-sm text-[var(--muted)]">
              Configuration complete. Generate a QR-code Recipe for the SFP Filling Platform.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href={`/spenser/compliance?category=${result.category}`}
                className="btn-secondary rounded-lg px-5 py-2 text-xs font-medium no-underline"
              >
                CHECK COMPLIANCE
              </Link>
              <Link
                href="/spenser/economics"
                className="btn-secondary rounded-lg px-5 py-2 text-xs font-medium no-underline"
              >
                VIEW ECONOMICS
              </Link>
              <button
                className="btn-primary rounded-lg px-5 py-2 text-xs font-medium"
                onClick={() => {
                  const recipe = {
                    formula: result.input,
                    physics: result.physics.equilibrium,
                    piston: result.physics.recommendedPiston.id,
                    itv: result.compatibleITVs[0]?.id,
                    lpv: result.compatibleLPVs[0]?.id,
                    ppwr: result.ppwr.grade,
                    generated: new Date().toISOString(),
                  };
                  const blob = new Blob([JSON.stringify(recipe, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `sfp-recipe-${result.category}-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                DOWNLOAD RECIPE
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
