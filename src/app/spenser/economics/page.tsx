"use client";

import { useState } from "react";
import Link from "next/link";
import type { CapexComparison, ROITimeline, OpexBreakdown } from "@/lib/financial-model";

interface EconomicsResult {
  input: { annualVolume_units: number; lineType: string; productCategory: string };
  capex: CapexComparison;
  roi: ROITimeline;
  opex: OpexBreakdown;
}

function formatEur(value: number): string {
  if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`;
  return `€${value.toFixed(2)}`;
}

function ROIChart({ timeline }: { timeline: ROITimeline }) {
  const months = timeline.months;
  const maxVal = Math.max(...months.map((m) => Math.max(m.spenserCumulative_eur, m.traditionalCumulative_eur)));
  const w = 500;
  const h = 200;
  const pad = 50;

  const toX = (month: number) => pad + (month / 60) * (w - pad * 2);
  const toY = (val: number) => h - pad - ((val / maxVal) * (h - pad * 2));

  const spenserPath = months.map((m, i) => `${i === 0 ? "M" : "L"}${toX(m.month).toFixed(1)},${toY(m.spenserCumulative_eur).toFixed(1)}`).join(" ");
  const tradPath = months.map((m, i) => `${i === 0 ? "M" : "L"}${toX(m.month).toFixed(1)},${toY(m.traditionalCumulative_eur).toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ fontFamily: "var(--font-mono)" }}>
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={pad} y1={toY(maxVal * f)} x2={w - pad} y2={toY(maxVal * f)} stroke="var(--border)" strokeWidth="0.5" />
      ))}
      {/* Break-even line */}
      {timeline.breakEvenMonth > 0 && timeline.breakEvenMonth <= 60 && (
        <>
          <line x1={toX(timeline.breakEvenMonth)} y1={pad - 10} x2={toX(timeline.breakEvenMonth)} y2={h - pad} stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 2" />
          <text x={toX(timeline.breakEvenMonth)} y={pad - 14} fill="var(--accent)" fontSize="8" textAnchor="middle">
            Break-even: {timeline.breakEvenMonth} mo
          </text>
        </>
      )}
      {/* Curves */}
      <path d={tradPath} fill="none" stroke="var(--danger)" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" />
      <path d={spenserPath} fill="none" stroke="var(--success)" strokeWidth="2" />
      {/* Axis labels */}
      <text x={pad} y={h - pad + 14} fill="var(--muted)" fontSize="8" textAnchor="middle">0</text>
      <text x={toX(12)} y={h - pad + 14} fill="var(--muted)" fontSize="8" textAnchor="middle">12</text>
      <text x={toX(24)} y={h - pad + 14} fill="var(--muted)" fontSize="8" textAnchor="middle">24</text>
      <text x={toX(36)} y={h - pad + 14} fill="var(--muted)" fontSize="8" textAnchor="middle">36</text>
      <text x={toX(48)} y={h - pad + 14} fill="var(--muted)" fontSize="8" textAnchor="middle">48</text>
      <text x={toX(60)} y={h - pad + 14} fill="var(--muted)" fontSize="8" textAnchor="middle">60 mo</text>
      <text x={pad - 4} y={toY(0) + 3} fill="var(--muted)" fontSize="8" textAnchor="end">€0</text>
      <text x={pad - 4} y={toY(maxVal) + 3} fill="var(--muted)" fontSize="8" textAnchor="end">{formatEur(maxVal)}</text>
      {/* Legend */}
      <line x1={pad} y1={10} x2={pad + 16} y2={10} stroke="var(--success)" strokeWidth="2" />
      <text x={pad + 20} y={13} fill="var(--success)" fontSize="8">Spenser SFP</text>
      <line x1={pad + 100} y1={10} x2={pad + 116} y2={10} stroke="var(--danger)" strokeWidth="1.5" strokeDasharray="4 2" />
      <text x={pad + 120} y={13} fill="var(--danger)" fontSize="8">Traditional Aerosol</text>
    </svg>
  );
}

export default function SpenserEconomicsPage() {
  const [form, setForm] = useState({
    annualVolume_units: "1700000",
    lineType: "Line38" as "Line38" | "Line53",
    productCategory: "Cosmetics",
  });
  const [result, setResult] = useState<EconomicsResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/spenser/economics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          annualVolume_units: Number(form.annualVolume_units),
          lineType: form.lineType,
          productCategory: form.productCategory,
        }),
      });
      const data = await res.json();
      if (res.ok) setResult(data as EconomicsResult);
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/spenser" className="font-[family-name:var(--font-mono)] text-xs text-[var(--muted)] no-underline hover:text-[var(--accent)]">
            &larr; Spenser Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-[var(--fg-bright)]">Filler Economics</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Compare SFP line investment against traditional aerosol infrastructure. Visualise ROI and payback period.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border-bright)] bg-[var(--surface)] px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--accent)]">
          FLOW C
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6">
        <div className="mb-4 font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--muted)]">CAPEX COMPARISON INPUT</div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs text-[var(--muted)]">Annual Volume (units/yr)</label>
            <input
              type="number"
              min="1000"
              max="50000000"
              step="1000"
              required
              value={form.annualVolume_units}
              onChange={(e) => setForm({ ...form, annualVolume_units: e.target.value })}
              className="input-field w-48 rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted)]">SFP Line Type</label>
            <select
              value={form.lineType}
              onChange={(e) => setForm({ ...form, lineType: e.target.value as "Line38" | "Line53" })}
              className="input-field rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-sm"
            >
              <option value="Line38">Line 38 (€150K, 2,400 uph)</option>
              <option value="Line53">Line 53 (€220K, 4,800 uph)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--muted)]">Product Category</label>
            <input
              type="text"
              value={form.productCategory}
              onChange={(e) => setForm({ ...form, productCategory: e.target.value })}
              className="input-field w-36 rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-sm"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary rounded-lg px-6 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wider">
            {loading ? "CALCULATING..." : "CALCULATE ROI"}
          </button>
        </div>
      </form>

      {result && (
        <div className="space-y-8 animate-in">
          {/* CAPEX Comparison */}
          <section className="grid gap-6 md:grid-cols-3">
            <div className="glass-bright rounded-2xl p-6">
              <div className="mb-1 font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--accent)]">SPENSER SFP</div>
              <div className="text-3xl font-bold text-[var(--success)]">{formatEur(result.capex.spenser.capex_eur)}</div>
              <div className="mt-1 text-xs text-[var(--muted)]">+ {formatEur(result.capex.spenser.installationCost_eur)} installation</div>
              <div className="mt-3 space-y-1 text-xs text-[var(--muted)]">
                <div>Floor space: {result.capex.spenser.requiredFloorSpace_m2} m²</div>
                <div>Speed: {result.capex.spenser.fillingSpeed_uph.toLocaleString()} uph</div>
                <div>Operators: {result.capex.spenser.operatorCount}</div>
                <div>Lead time: {result.capex.spenser.leadTime_weeks} weeks</div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="mb-1 font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--muted)]">TRADITIONAL AEROSOL</div>
              <div className="text-3xl font-bold text-[var(--danger)]">{formatEur(result.capex.traditional.capex_eur)}</div>
              <div className="mt-1 text-xs text-[var(--muted)]">+ {formatEur(result.capex.traditional.installationCost_eur)} installation</div>
              <div className="mt-3 space-y-1 text-xs text-[var(--muted)]">
                <div>Floor space: {result.capex.traditional.requiredFloorSpace_m2} m²</div>
                <div>Speed: {result.capex.traditional.fillingSpeed_uph.toLocaleString()} uph</div>
                <div>Operators: {result.capex.traditional.operatorCount}</div>
                <div>Lead time: {result.capex.traditional.leadTime_weeks} weeks</div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="mb-1 font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--accent)]">SAVINGS</div>
              <div className="text-3xl font-bold text-[var(--fg-bright)]">{formatEur(result.capex.delta.capexSaving_eur)}</div>
              <div className="mt-1 text-xs text-[var(--success)]">{result.capex.delta.capexSaving_pct}% lower CAPEX</div>
              <div className="mt-3 space-y-1 text-xs">
                <div className="text-[var(--muted)]">Per-unit saving: <span className="text-[var(--success)]">€{result.capex.delta.opexPerUnitDelta_eur}/unit</span></div>
                <div className="text-[var(--muted)]">Annual OPEX saving: <span className="text-[var(--success)]">{formatEur(result.capex.delta.annualOpexSaving_eur)}</span></div>
                <div className="text-[var(--muted)]">Payback: <span className="text-[var(--accent)]">{result.capex.delta.paybackMonths} months</span></div>
                <div className="text-[var(--muted)]">5yr saving: <span className="text-[var(--success)]">{formatEur(result.capex.delta.fiveYearSaving_eur)}</span></div>
              </div>
            </div>
          </section>

          {/* ROI Timeline */}
          <section className="glass-bright rounded-2xl p-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--accent)]">ROI TIMELINE (60 MONTHS)</div>
              <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--muted)]">
                5-Year ROI: <span className="text-[var(--success)] font-bold">{result.roi.fiveYearROI_pct}%</span>
              </div>
            </div>
            <ROIChart timeline={result.roi} />
          </section>

          {/* OPEX Breakdown */}
          <section className="glass rounded-2xl p-6">
            <div className="mb-4 font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--muted)]">
              OPEX BREAKDOWN (ANNUAL @ {Number(form.annualVolume_units).toLocaleString()} UNITS)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted)]">
                    <th className="pb-2 pr-4">Cost Category</th>
                    <th className="pb-2 pr-4 text-right">Spenser SFP</th>
                    <th className="pb-2 pr-4 text-right">Traditional</th>
                    <th className="pb-2 text-right">Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(result.opex.spenser) as Array<keyof typeof result.opex.spenser>)
                    .filter((k) => k !== "total_eur")
                    .map((key) => {
                      const keyStr = String(key);
                      const label = keyStr
                        .replace(/_eur$/, "")
                        .replace(/_/g, " ")
                        .replace(/^\w/, (c) => c.toUpperCase());
                      const sVal = result.opex.spenser[key];
                      const tVal = result.opex.traditional[key];
                      const delta = tVal - sVal;
                      return (
                        <tr key={key} className="border-b border-[var(--border)] table-row-hover">
                          <td className="py-2 pr-4 text-[var(--fg-bright)]">{label}</td>
                          <td className="py-2 pr-4 text-right font-[family-name:var(--font-mono)]">{formatEur(sVal)}</td>
                          <td className="py-2 pr-4 text-right font-[family-name:var(--font-mono)]">{formatEur(tVal)}</td>
                          <td className={`py-2 text-right font-[family-name:var(--font-mono)] ${delta > 0 ? "text-[var(--success)]" : delta < 0 ? "text-[var(--danger)]" : ""}`}>
                            {delta > 0 ? "+" : ""}{formatEur(delta)}
                          </td>
                        </tr>
                      );
                    })}
                  <tr className="border-t-2 border-[var(--accent)] font-bold">
                    <td className="py-2 pr-4 text-[var(--fg-bright)]">Total</td>
                    <td className="py-2 pr-4 text-right font-[family-name:var(--font-mono)] text-[var(--success)]">{formatEur(result.opex.spenser.total_eur)}</td>
                    <td className="py-2 pr-4 text-right font-[family-name:var(--font-mono)] text-[var(--danger)]">{formatEur(result.opex.traditional.total_eur)}</td>
                    <td className="py-2 text-right font-[family-name:var(--font-mono)] text-[var(--success)]">
                      +{formatEur(result.opex.traditional.total_eur - result.opex.spenser.total_eur)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Infrastructure Comparison */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <div className="mb-3 font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--success)]">SPENSER SFP ADVANTAGES</div>
              <ul className="space-y-2 text-sm text-[var(--fg)]">
                <li className="flex items-start gap-2"><span className="text-[var(--success)]">&#10003;</span> Zero gas infrastructure (no ATEX compliance)</li>
                <li className="flex items-start gap-2"><span className="text-[var(--success)]">&#10003;</span> Single operator (vs 4 for traditional)</li>
                <li className="flex items-start gap-2"><span className="text-[var(--success)]">&#10003;</span> 35-50 m² footprint (vs 300 m²)</li>
                <li className="flex items-start gap-2"><span className="text-[var(--success)]">&#10003;</span> 8-10 week lead time (vs 26 weeks)</li>
                <li className="flex items-start gap-2"><span className="text-[var(--success)]">&#10003;</span> PPWR Grade A packaging compliance</li>
                <li className="flex items-start gap-2"><span className="text-[var(--success)]">&#10003;</span> Compatible with gas-sensitive formulas</li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="mb-3 font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--danger)]">TRADITIONAL AEROSOL CONSTRAINTS</div>
              <ul className="space-y-2 text-sm text-[var(--muted)]">
                <li className="flex items-start gap-2"><span className="text-[var(--danger)]">&#10007;</span> LPG/DME gas infrastructure required</li>
                <li className="flex items-start gap-2"><span className="text-[var(--danger)]">&#10007;</span> ATEX Zone 2 compliance mandatory</li>
                <li className="flex items-start gap-2"><span className="text-[var(--danger)]">&#10007;</span> 300 m² minimum floor space</li>
                <li className="flex items-start gap-2"><span className="text-[var(--danger)]">&#10007;</span> 26+ week delivery and commissioning</li>
                <li className="flex items-start gap-2"><span className="text-[var(--danger)]">&#10007;</span> PPWR Grade D-E (multi-material waste)</li>
                <li className="flex items-start gap-2"><span className="text-[var(--danger)]">&#10007;</span> Incompatible with gas-sensitive actives</li>
              </ul>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
