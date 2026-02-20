"use client";

import { useState } from "react";
import { FLUIDS, ACTUATORS } from "@/lib/data";
import type { Actuator, Fluid, PredictionResult } from "@/lib/data";
import Link from "next/link";

interface ResultRow {
  actuator: Actuator;
  prediction: PredictionResult;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "var(--success)"
      : score >= 50
        ? "var(--warning)"
        : "var(--danger)";
  return (
    <span
      className="inline-block border px-2 py-0.5 text-[10px] font-bold uppercase"
      style={{ borderColor: color, color }}
    >
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
    <div className="space-y-8">
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-widest text-[var(--muted)]">
          Step 1
        </p>
        <h1 className="text-xl font-bold">Actuator Configuration</h1>
      </div>

      {/* Input Form */}
      <div className="grid gap-6 border border-[var(--border)] bg-[var(--surface)] p-6 md:grid-cols-3">
        {/* Fluid Selection */}
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Select Fluid
          </label>
          <select
            value={fluidId}
            onChange={(e) => setFluidId(e.target.value)}
            className="w-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs focus:border-[var(--accent)] focus:outline-none"
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
          <label className="mb-2 block text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Operating Pressure (bar)
          </label>
          <input
            type="number"
            min={1}
            max={30}
            step={0.5}
            value={pressure}
            onChange={(e) => setPressure(Number(e.target.value))}
            className="w-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs focus:border-[var(--accent)] focus:outline-none"
          />
          <p className="mt-1 text-[10px] text-[var(--muted)]">Range: 1–30 bar</p>
        </div>

        {/* Submit */}
        <div className="flex items-end">
          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--bg)] hover:bg-transparent hover:text-[var(--accent)] disabled:opacity-50"
          >
            {loading ? "Computing..." : "Run Prediction"}
          </button>
        </div>
      </div>

      {/* Fluid Properties Card */}
      {selectedFluid && (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-3 text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Fluid Properties — {selectedFluid.name}
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs md:grid-cols-4">
            <div>
              <span className="text-[var(--muted)]">Viscosity:</span>{" "}
              <strong>{selectedFluid.viscosity_cP} cP</strong>
            </div>
            <div>
              <span className="text-[var(--muted)]">Density:</span>{" "}
              <strong>{selectedFluid.density_kg_m3} kg/m³</strong>
            </div>
            <div>
              <span className="text-[var(--muted)]">Surface Tension:</span>{" "}
              <strong>{selectedFluid.surfaceTension_mN_m} mN/m</strong>
            </div>
            <div>
              <span className="text-[var(--muted)]">Solvent Class:</span>{" "}
              <strong>{selectedFluid.solventClass}</strong>
            </div>
            <div>
              <span className="text-[var(--muted)]">pH:</span>{" "}
              <strong>{selectedFluid.pH}</strong>
            </div>
            <div>
              <span className="text-[var(--muted)]">CAS:</span>{" "}
              <strong>{selectedFluid.cas}</strong>
            </div>
            <div>
              <span className="text-[var(--muted)]">Flash Point:</span>{" "}
              <strong>{selectedFluid.flashPoint_C !== null ? `${selectedFluid.flashPoint_C}°C` : "N/A"}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {results && (
        <div>
          <h2 className="mb-4 text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Predicted Configurations — Ranked by Compatibility
          </h2>
          <div className="overflow-x-auto border border-[var(--border)]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--code-bg)] text-left text-[10px] uppercase tracking-widest text-[var(--muted)]">
                  <th className="px-3 py-2">Rank</th>
                  <th className="px-3 py-2">Actuator</th>
                  <th className="px-3 py-2">Score</th>
                  <th className="px-3 py-2">Cone Angle</th>
                  <th className="px-3 py-2">Droplet Dv50</th>
                  <th className="px-3 py-2">Flow Rate</th>
                  <th className="px-3 py-2">Spray Width</th>
                  <th className="px-3 py-2">Re</th>
                  <th className="px-3 py-2">We</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.actuator.id} className="border-b border-[var(--border)] hover:bg-[var(--code-bg)]">
                    <td className="px-3 py-2 font-bold">{i + 1}</td>
                    <td className="px-3 py-2">
                      <div className="font-bold">{r.actuator.sku}</div>
                      <div className="text-[var(--muted)]">{r.actuator.name}</div>
                    </td>
                    <td className="px-3 py-2">
                      <ScoreBadge score={r.prediction.compatibilityScore} />
                    </td>
                    <td className="px-3 py-2">{r.prediction.coneAngle_deg}°</td>
                    <td className="px-3 py-2">{r.prediction.dropletSizeDv50_um} µm</td>
                    <td className="px-3 py-2">{r.prediction.flowRate_mL_min} mL/min</td>
                    <td className="px-3 py-2">{r.prediction.sprayWidth_mm_at_100mm} mm</td>
                    <td className="px-3 py-2">{r.prediction.reynoldsNumber.toLocaleString()}</td>
                    <td className="px-3 py-2">{r.prediction.weberNumber.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/results?actuator=${r.actuator.id}&fluid=${selectedFluid?.id}&pressure=${pressure}`}
                        className="border border-[var(--accent)] px-2 py-1 text-[10px] uppercase tracking-widest text-[var(--accent)] no-underline hover:bg-[var(--accent)] hover:text-[var(--bg)]"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
