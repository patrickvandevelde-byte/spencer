"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { ViscosityCategory } from "@/lib/spenser-physics";
import type { PPWRResult } from "@/lib/ppwr-compliance";
import type { IMPart } from "@/lib/kmd-data";

interface ComponentEntry {
  part: IMPart;
  selectedMaterial: string;
  note: string;
}

interface ComplianceResult {
  category: ViscosityCategory;
  components: ComponentEntry[];
  parts: IMPart[];
  ppwr: PPWRResult;
  wasteComparison: {
    spenser: { recyclability_pct: number; streams: number; grade: string };
    traditional: { recyclability_pct: number; streams: number; grade: string };
  };
}

function GradeDisplay({ grade, score, label }: { grade: string; score: number; label: string }) {
  const gradeColors: Record<string, { bg: string; border: string; text: string }> = {
    A: { bg: "rgba(16,185,129,0.1)", border: "var(--success)", text: "var(--success)" },
    B: { bg: "rgba(6,182,212,0.1)", border: "var(--accent)", text: "var(--accent)" },
    C: { bg: "rgba(245,158,11,0.1)", border: "var(--warning)", text: "var(--warning)" },
    D: { bg: "rgba(239,68,68,0.1)", border: "var(--danger)", text: "var(--danger)" },
    E: { bg: "rgba(239,68,68,0.15)", border: "var(--danger)", text: "var(--danger)" },
  };
  const colors = gradeColors[grade] ?? gradeColors.C;

  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{ background: colors.bg, border: `2px solid ${colors.border}` }}
    >
      <div className="font-[family-name:var(--font-mono)] text-6xl font-bold" style={{ color: colors.text }}>
        {grade}
      </div>
      <div className="mt-2 text-2xl font-bold text-[var(--fg-bright)]">{score}%</div>
      <div className="mt-1 text-sm text-[var(--muted)]">{label}</div>
    </div>
  );
}

export default function SpenserCompliancePage() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<ViscosityCategory>(
    (searchParams.get("category") as ViscosityCategory) || "cream"
  );
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runAssessment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/spenser/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          materialOverrides: Object.keys(overrides).length > 0 ? overrides : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) setResult(data as ComplianceResult);
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAssessment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/spenser" className="font-[family-name:var(--font-mono)] text-xs text-[var(--muted)] no-underline hover:text-[var(--accent)]">
            &larr; Spenser Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-[var(--fg-bright)]">Regulatory Compliance (PPWR)</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Real-time PPWR scoring based on material selections. Identify recyclability and export a Compliance Pack.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border-bright)] bg-[var(--surface)] px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--accent)]">
          FLOW B
        </span>
      </div>

      {/* Controls */}
      <div className="glass rounded-2xl p-6">
        <div className="mb-4 font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--muted)]">MATERIAL CHECK</div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs text-[var(--muted)]">Product Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ViscosityCategory)}
              className="input-field rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-sm"
            >
              <option value="liquid">Liquids</option>
              <option value="lotion">Lotions</option>
              <option value="cream">Creams</option>
              <option value="paste">Pastes</option>
              <option value="gel">Gels</option>
            </select>
          </div>
          <button
            onClick={runAssessment}
            disabled={loading}
            className="btn-primary rounded-lg px-6 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wider"
          >
            {loading ? "ASSESSING..." : "RUN ASSESSMENT"}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-8 animate-in">
          {/* Grade Display */}
          <div className="grid gap-6 md:grid-cols-3">
            <GradeDisplay grade={result.ppwr.grade} score={result.ppwr.score} label={result.ppwr.label} />
            <div className="glass rounded-2xl p-6">
              <div className="mb-3 font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--muted)]">SUMMARY</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Total Parts</span>
                  <span className="font-semibold text-[var(--fg-bright)]">{result.ppwr.summary.totalParts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Recyclable Parts</span>
                  <span className="font-semibold text-[var(--success)]">{result.ppwr.summary.recyclableParts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Mono-Material</span>
                  <span className="font-semibold text-[var(--fg-bright)]">{result.ppwr.summary.monoMaterialPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">PET Content</span>
                  <span className="font-semibold text-[var(--fg-bright)]">{result.ppwr.summary.petPct}%</span>
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="mb-3 font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--muted)]">VS TRADITIONAL</div>
              <div className="space-y-3">
                <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-3">
                  <div className="text-xs text-[var(--muted)]">Spenser SFP</div>
                  <div className="text-lg font-bold text-[var(--success)]">{result.wasteComparison.spenser.recyclability_pct}%</div>
                  <div className="text-[10px] text-[var(--muted)]">{result.wasteComparison.spenser.streams} waste stream — Grade {result.wasteComparison.spenser.grade}</div>
                </div>
                <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-3">
                  <div className="text-xs text-[var(--muted)]">Traditional Aerosol</div>
                  <div className="text-lg font-bold text-[var(--danger)]">{result.wasteComparison.traditional.recyclability_pct}%</div>
                  <div className="text-[10px] text-[var(--muted)]">{result.wasteComparison.traditional.streams} waste streams — Grade {result.wasteComparison.traditional.grade}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Material Audit Table */}
          <section className="glass rounded-2xl p-6">
            <div className="mb-4 font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--muted)]">
              MATERIAL AUDIT — {result.ppwr.assessments.length} COMPONENTS
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted)]">
                    <th className="pb-2 pr-4">Component</th>
                    <th className="pb-2 pr-4">Material</th>
                    <th className="pb-2 pr-4">Override</th>
                    <th className="pb-2 pr-4">Recyclability</th>
                    <th className="pb-2 pr-4">Stream</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.ppwr.assessments.map((a, i) => {
                    const comp = result.components[i];
                    const flagColor = a.flag === "pass" ? "var(--success)" : a.flag === "warning" ? "var(--warning)" : "var(--danger)";
                    return (
                      <tr key={a.partId} className="border-b border-[var(--border)] table-row-hover">
                        <td className="py-2 pr-4 font-semibold text-[var(--fg-bright)]">{a.partName}</td>
                        <td className="py-2 pr-4 font-[family-name:var(--font-mono)] text-xs">{a.material}</td>
                        <td className="py-2 pr-4">
                          {comp && (
                            <select
                              value={overrides[a.partId] ?? a.material}
                              onChange={(e) => {
                                const newOverrides = { ...overrides, [a.partId]: e.target.value };
                                setOverrides(newOverrides);
                              }}
                              className="input-field rounded px-2 py-1 font-[family-name:var(--font-mono)] text-[11px]"
                            >
                              {comp.part.materialOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-[var(--surface)]">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${a.recyclabilityScore}%`, background: flagColor }}
                              />
                            </div>
                            <span className="font-[family-name:var(--font-mono)] text-xs">{a.recyclabilityScore}%</span>
                          </div>
                        </td>
                        <td className="py-2 pr-4 text-xs text-[var(--muted)]">{a.wasteStream}</td>
                        <td className="py-2">
                          <span className="inline-block h-2 w-2 rounded-full" style={{ background: flagColor }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {Object.keys(overrides).length > 0 && (
              <button
                onClick={runAssessment}
                className="btn-primary mt-4 rounded-lg px-5 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wider"
              >
                RE-ASSESS WITH OVERRIDES
              </button>
            )}
          </section>

          {/* Recommendations */}
          {result.ppwr.summary.recommendations.length > 0 && (
            <section className="glass rounded-2xl p-6">
              <div className="mb-4 font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--muted)]">RECOMMENDATIONS</div>
              <ul className="space-y-2">
                {result.ppwr.summary.recommendations.map((rec) => (
                  <li key={rec} className="flex items-start gap-2 text-sm text-[var(--fg)]">
                    <span className="mt-1 text-[var(--accent)]">&#9654;</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Compliance Pack Export */}
          <section className="glass-bright rounded-2xl p-6 text-center">
            <div className="mb-2 font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--accent)]">CERTIFICATION</div>
            <p className="mb-4 text-sm text-[var(--muted)]">
              {result.ppwr.compliancePack.certificationReady
                ? "This configuration is ready for PPWR certification."
                : "This configuration requires material changes before certification."}
            </p>
            <button
              className="btn-primary rounded-lg px-6 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wider"
              onClick={() => {
                const blob = new Blob([JSON.stringify(result.ppwr.compliancePack, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `ppwr-compliance-pack-${result.ppwr.grade}-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              EXPORT COMPLIANCE PACK
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
