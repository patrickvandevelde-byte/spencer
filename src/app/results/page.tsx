"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo } from "react";
import { ACTUATORS, FLUIDS, predict, recommendTooling, INDUSTRY_LABELS, PRODUCT_CATEGORY_LABELS } from "@/lib/data";
import type { Actuator, Fluid, PredictionResult, ToolingSpec } from "@/lib/data";
import Link from "next/link";
import { ActuatorIllustration, SprayPatternIllustration, ACTUATOR_COLORS } from "@/components/ActuatorIllustrations";
import { TechnicalDesignPanel } from "@/components/TechnicalDesign";
import { addToCart, trackEvent } from "@/lib/store";
import dynamic from "next/dynamic";

const ActuatorViewer3D = dynamic(() => import("@/components/ActuatorViewer3D"), {
  ssr: false,
  loading: () => (
    <div className="glass flex items-center justify-center rounded-xl" style={{ height: 400 }}>
      <div className="text-center">
        <svg className="mx-auto h-8 w-8 animate-spin text-[var(--accent)]" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
          <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="mt-2 text-xs text-[var(--muted)]">Loading 3D viewer...</p>
      </div>
    </div>
  ),
});

function RegimeBadge({ regime }: { regime: string }) {
  const colors: Record<string, string> = {
    Atomization: "var(--success)",
    "Wind-stressed": "var(--accent)",
    "Wind-induced": "var(--warning)",
    Rayleigh: "var(--danger)",
  };
  const color = colors[regime] || "var(--muted)";
  return (
    <span className="rounded-md border px-2.5 py-1 text-xs font-bold" style={{ borderColor: color, color }}>
      {regime}
    </span>
  );
}

function CloggingBadge({ risk }: { risk: string }) {
  const colors: Record<string, string> = {
    none: "var(--success)", low: "var(--success)", moderate: "var(--warning)", high: "var(--danger)",
  };
  const labels: Record<string, string> = {
    none: "No Risk", low: "Low", moderate: "Moderate", high: "High Risk",
  };
  return (
    <span
      className="rounded-md border px-2.5 py-1 text-xs font-bold uppercase"
      style={{ borderColor: colors[risk], color: colors[risk] }}
    >
      {labels[risk] || risk}
    </span>
  );
}

// ---- CSV Export ----
function exportCSV(actuator: Actuator, fluid: Fluid, result: PredictionResult, pressure: number) {
  const dist = result.dropletDistribution;
  const rows = [
    ["Parameter", "Value", "Unit"],
    ["Actuator", actuator.sku, ""],
    ["Actuator Name", actuator.name, ""],
    ["Fluid", fluid.name, ""],
    ["Operating Pressure", String(pressure), "bar"],
    ["Compatibility Score", String(result.compatibilityScore), "/100"],
    ["Atomization Regime", result.atomizationRegime, ""],
    ["Cone Angle", String(result.coneAngle_deg), "deg"],
    ["Dv10", String(dist.Dv10_um), "um"],
    ["Dv50", String(dist.Dv50_um), "um"],
    ["Dv90", String(dist.Dv90_um), "um"],
    ["Span", String(dist.span), ""],
    ["Flow Rate", String(result.flowRate_mL_min), "mL/min"],
    ["Delivery Rate", String(result.deliveryRate_g_s), "g/s"],
    ["Spray Width @100mm", String(result.sprayWidth_mm_at_100mm), "mm"],
    ["Exit Velocity", String(result.velocityExit_m_s), "m/s"],
    ["Reynolds Number", String(result.reynoldsNumber), ""],
    ["Weber Number", String(result.weberNumber), ""],
    ["Ohnesorge Number", String(result.ohnesorgeNumber), ""],
    ["Apparent Viscosity", String(result.apparentViscosity_cP), "cP"],
    ["Clogging Risk", result.cloggingRisk, ""],
    ["Swelling Risk", String(result.materialStress.swellingRisk), ""],
    ["Stress Cracking Risk", String(result.materialStress.stressCrackingRisk), ""],
    ["Leaching Risk", String(result.materialStress.leachingRisk), ""],
    ...result.safetyWarnings.map((w, i) => [`Safety Warning ${i + 1}`, w, ""]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aerospec_${actuator.sku}_${fluid.id}_${pressure}bar.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---- PDF Export (Print-based) ----
function exportPDF(actuator: Actuator, fluid: Fluid, result: PredictionResult, pressure: number) {
  const dist = result.dropletDistribution;
  const td = actuator.technicalDesign;
  const scoreLabel = result.compatibilityScore >= 80 ? "Excellent" : result.compatibilityScore >= 50 ? "Good" : "Poor";

  const html = `<!DOCTYPE html>
<html><head><title>AeroSpec Report - ${actuator.sku}</title>
<style>
body{font-family:system-ui,-apple-system,sans-serif;color:#1a1a1a;max-width:800px;margin:0 auto;padding:40px;font-size:12px;line-height:1.6}
h1{font-size:22px;margin:0;color:#0e7490}
h2{font-size:14px;color:#0e7490;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-top:24px}
.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0e7490;padding-bottom:16px;margin-bottom:20px}
.meta{color:#6b7280;font-size:11px}
.score{font-size:48px;font-weight:bold;color:${result.compatibilityScore >= 80 ? '#16a34a' : result.compatibilityScore >= 50 ? '#d97706' : '#dc2626'}}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px 24px}
.label{color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:0.05em}
.value{font-weight:600;font-size:13px}
.warn{background:#fef3c7;border:1px solid #f59e0b;padding:6px 12px;border-radius:4px;margin:4px 0;color:#92400e}
.danger{background:#fee2e2;border:1px solid #ef4444;padding:6px 12px;border-radius:4px;margin:4px 0;color:#991b1b}
.pass{color:#16a34a}.fail{color:#dc2626}
table{width:100%;border-collapse:collapse;margin:8px 0}
th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #e5e7eb;font-size:11px}
th{color:#6b7280;text-transform:uppercase;font-size:10px;letter-spacing:0.05em}
.footer{margin-top:40px;border-top:2px solid #0e7490;padding-top:12px;color:#9ca3af;font-size:10px;text-align:center}
@media print{body{padding:20px}}
</style></head><body>
<div class="header"><div>
<h1>AeroSpec Technical Report</h1>
<p class="meta">${actuator.sku} &mdash; ${actuator.name}</p>
<p class="meta">${fluid.name} @ ${pressure} bar &bull; Generated ${new Date().toLocaleDateString()}</p>
</div><div style="text-align:right">
<div class="score">${result.compatibilityScore}</div>
<div class="meta">/100 &mdash; ${scoreLabel}</div>
</div></div>

<h2>Spray Physics</h2>
<div class="grid3">
<div><div class="label">Cone Angle</div><div class="value">${result.coneAngle_deg}&deg;</div></div>
<div><div class="label">Dv50</div><div class="value">${dist.Dv50_um} &micro;m</div></div>
<div><div class="label">Flow Rate</div><div class="value">${result.flowRate_mL_min} mL/min</div></div>
<div><div class="label">Exit Velocity</div><div class="value">${result.velocityExit_m_s} m/s</div></div>
<div><div class="label">Delivery Rate</div><div class="value">${result.deliveryRate_g_s} g/s</div></div>
<div><div class="label">Spray Width @100mm</div><div class="value">${result.sprayWidth_mm_at_100mm} mm</div></div>
</div>

<h2>Droplet Distribution</h2>
<div class="grid3">
<div><div class="label">Dv10</div><div class="value">${dist.Dv10_um} &micro;m</div></div>
<div><div class="label">Dv50 (Median)</div><div class="value">${dist.Dv50_um} &micro;m</div></div>
<div><div class="label">Dv90</div><div class="value">${dist.Dv90_um} &micro;m</div></div>
<div><div class="label">Span</div><div class="value">${dist.span}</div></div>
<div><div class="label">Regime</div><div class="value">${result.atomizationRegime}</div></div>
<div><div class="label">Clogging Risk</div><div class="value">${result.cloggingRisk}</div></div>
</div>

<h2>Dimensionless Numbers</h2>
<div class="grid3">
<div><div class="label">Reynolds (Re)</div><div class="value">${result.reynoldsNumber.toLocaleString()}</div></div>
<div><div class="label">Weber (We)</div><div class="value">${result.weberNumber.toLocaleString()}</div></div>
<div><div class="label">Ohnesorge (Oh)</div><div class="value">${result.ohnesorgeNumber}</div></div>
</div>

<h2>Fluid Properties</h2>
<div class="grid">
<div><div class="label">Viscosity</div><div class="value">${fluid.viscosity_cP} cP</div></div>
<div><div class="label">Density</div><div class="value">${fluid.density_kg_m3} kg/m&sup3;</div></div>
<div><div class="label">Surface Tension</div><div class="value">${fluid.surfaceTension_mN_m} mN/m</div></div>
<div><div class="label">Solvent Class</div><div class="value">${fluid.solventClass}</div></div>
<div><div class="label">Rheology</div><div class="value">${fluid.rheology}</div></div>
<div><div class="label">pH</div><div class="value">${fluid.pH}</div></div>
${result.apparentViscosity_cP !== fluid.viscosity_cP ? `<div><div class="label">Apparent Viscosity</div><div class="value">${result.apparentViscosity_cP} cP</div></div>` : ''}
</div>

<h2>Actuator Specifications</h2>
<div class="grid">
<div><div class="label">Manufacturer</div><div class="value">${actuator.manufacturer}</div></div>
<div><div class="label">Category</div><div class="value">${actuator.productCategory}</div></div>
<div><div class="label">Orifice</div><div class="value">${actuator.orificeDiameter_mm} mm</div></div>
<div><div class="label">Max Pressure</div><div class="value">${actuator.maxPressure_bar} bar</div></div>
<div><div class="label">Body Material</div><div class="value">${td.bodyMaterial}</div></div>
<div><div class="label">Seal Material</div><div class="value">${td.sealMaterial}</div></div>
${td.stemProfile ? `<div><div class="label">Stem Profile</div><div class="value">${td.stemProfile} &mdash; &empty;${td.stemExternalDiameter_mm || '?'}mm</div></div>` : ''}
${td.actuationForce_N ? `<div><div class="label">Actuation Force</div><div class="value">${td.actuationForce_N} N</div></div>` : ''}
${td.strokeLength_mm ? `<div><div class="label">Stroke Length</div><div class="value">${td.strokeLength_mm} mm</div></div>` : ''}
${td.primeStrokes ? `<div><div class="label">Prime Strokes</div><div class="value">${td.primeStrokes}</div></div>` : ''}
</div>

${result.safetyWarnings.length > 0 ? `<h2>Safety Warnings</h2>${result.safetyWarnings.map(w => `<div class="danger">${w}</div>`).join('')}` : ''}

${(result.materialStress.swellingRisk || result.materialStress.stressCrackingRisk || result.materialStress.leachingRisk) ? `<h2>Material Stress Analysis</h2>
${result.materialStress.swellingRisk ? '<div class="warn">Swelling Risk: Solvent may cause polymer swelling</div>' : ''}
${result.materialStress.stressCrackingRisk ? '<div class="danger">Stress Cracking Risk: Environmental stress cracking possible</div>' : ''}
${result.materialStress.leachingRisk ? '<div class="warn">Leaching Risk: Components may leach into product</div>' : ''}` : ''}

<h2>Compliance</h2>
<div class="grid">
<div><div class="label">Material Compatible</div><div class="value ${actuator.materialCompatibility.includes(fluid.solventClass) ? 'pass' : 'fail'}">${actuator.materialCompatibility.includes(fluid.solventClass) ? 'PASS' : 'FAIL'}</div></div>
<div><div class="label">Pressure Rating</div><div class="value ${pressure <= actuator.maxPressure_bar ? 'pass' : 'fail'}">${pressure <= actuator.maxPressure_bar ? 'SAFE' : 'OVER LIMIT'}</div></div>
${td.childResistant ? '<div><div class="label">Child Resistant</div><div class="value pass">Yes</div></div>' : ''}
${td.fdaCompliant ? '<div><div class="label">FDA Compliant</div><div class="value pass">Yes</div></div>' : ''}
${td.cleanroomClass ? `<div><div class="label">Cleanroom</div><div class="value pass">${td.cleanroomClass}</div></div>` : ''}
</div>

<div class="footer">
AeroSpec Predictive Actuator Configurator &bull; Confidential Technical Report &bull; ${new Date().toISOString().split('T')[0]}
</div></body></html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }
  trackEvent("export", { type: "pdf", actuatorId: actuator.id, fluidId: fluid.id });
}

// ---- Valve Stem & Ergonomic Section ----
function StemErgonomicsSection({ actuator }: { actuator: Actuator }) {
  const td = actuator.technicalDesign;
  const hasStem = td.stemProfile || td.stemExternalDiameter_mm;
  const hasErgonomics = td.actuationForce_N || td.strokeLength_mm || td.primeStrokes;

  if (!hasStem && !hasErgonomics) return null;

  // ADA compliance threshold
  const adaLimit = 22.2; // 5 lbf ≈ 22.2 N, typical ADA max
  const isAdaCompliant = td.actuationForce_N ? td.actuationForce_N <= adaLimit : null;

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="mb-5 flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6v6l4 2" />
        </svg>
        Valve Interface & Ergonomics
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Stem profile */}
        {hasStem && (
          <div>
            <span className="text-xs font-medium text-[var(--muted)]">Stem Profile</span>
            <div className="mt-3 space-y-3 text-xs">
              {td.stemProfile && (
                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-[var(--muted)]">Type</span>
                  <strong className="tabular-nums text-[var(--fg-bright)]">{td.stemProfile}</strong>
                </div>
              )}
              {td.stemExternalDiameter_mm && (
                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-[var(--muted)]">External Diameter</span>
                  <strong className="tabular-nums text-[var(--fg-bright)]">{td.stemExternalDiameter_mm} mm</strong>
                </div>
              )}
              {td.stemInternalDiameter_mm && (
                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-[var(--muted)]">Internal Diameter</span>
                  <strong className="tabular-nums text-[var(--fg-bright)]">{td.stemInternalDiameter_mm} mm</strong>
                </div>
              )}
              {td.engagementDepth_mm && (
                <div className="flex justify-between pb-2">
                  <span className="text-[var(--muted)]">Engagement Depth</span>
                  <strong className="tabular-nums text-[var(--fg-bright)]">{td.engagementDepth_mm} mm</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ergonomics */}
        {hasErgonomics && (
          <div>
            <span className="text-xs font-medium text-[var(--muted)]">Ergonomic Data</span>
            <div className="mt-3 space-y-3 text-xs">
              {td.actuationForce_N && (
                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-[var(--muted)]">Actuation Force</span>
                  <span className="flex items-center gap-2">
                    <strong className="tabular-nums text-[var(--fg-bright)]">{td.actuationForce_N} N</strong>
                    {isAdaCompliant !== null && (
                      <span className={`rounded-md border px-1.5 py-0.5 text-[11px] font-bold ${
                        isAdaCompliant ? "border-[var(--success)] text-[var(--success)]" : "border-[var(--warning)] text-[var(--warning)]"
                      }`}>
                        {isAdaCompliant ? "ADA OK" : "HIGH FORCE"}
                      </span>
                    )}
                  </span>
                </div>
              )}
              {td.strokeLength_mm && (
                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-[var(--muted)]">Stroke Length</span>
                  <strong className="tabular-nums text-[var(--fg-bright)]">{td.strokeLength_mm} mm</strong>
                </div>
              )}
              {td.returnSpeed_mm_s && (
                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-[var(--muted)]">Return Speed</span>
                  <strong className="tabular-nums text-[var(--fg-bright)]">{td.returnSpeed_mm_s} mm/s</strong>
                </div>
              )}
              {td.primeStrokes && (
                <div className="flex justify-between pb-2">
                  <span className="text-[var(--muted)]">Prime Strokes</span>
                  <strong className="tabular-nums text-[var(--fg-bright)]">{td.primeStrokes} actuations</strong>
                </div>
              )}
              {td.dosage_uL && (
                <div className="flex justify-between pb-2">
                  <span className="text-[var(--muted)]">Dose per Actuation</span>
                  <strong className="tabular-nums text-[var(--fg-bright)]">{td.dosage_uL} µL</strong>
                </div>
              )}
              {td.internalVolume_uL && (
                <div className="flex justify-between pb-2">
                  <span className="text-[var(--muted)]">Dead Volume</span>
                  <strong className="tabular-nums text-[var(--fg-bright)]">{td.internalVolume_uL} µL</strong>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Mini SVG Performance Chart ----
function PressureChart({ actuator, fluid }: { actuator: Actuator; fluid: Fluid }) {
  const data = useMemo(() => {
    const points: { p: number; dv50: number; flow: number; score: number }[] = [];
    const maxP = Math.min(actuator.maxPressure_bar, 30);
    const step = Math.max(1, Math.floor(maxP / 12));
    for (let p = 1; p <= maxP; p += step) {
      const r = predict(actuator, fluid, p);
      points.push({ p, dv50: r.dropletSizeDv50_um, flow: r.flowRate_mL_min, score: r.compatibilityScore });
    }
    return points;
  }, [actuator, fluid]);

  if (data.length < 2) return null;

  const W = 400, H = 160, PAD = 40;
  const maxDv50 = Math.max(...data.map((d) => d.dv50));
  const maxFlow = Math.max(...data.map((d) => d.flow));
  const maxP = data[data.length - 1].p;
  const minP = data[0].p;

  function xPos(p: number) { return PAD + ((p - minP) / (maxP - minP)) * (W - PAD * 2); }
  function yDv50(v: number) { return H - PAD - (v / maxDv50) * (H - PAD * 2); }
  function yFlow(v: number) { return H - PAD - (v / maxFlow) * (H - PAD * 2); }

  const dv50Path = data.map((d, i) => `${i === 0 ? "M" : "L"}${xPos(d.p).toFixed(1)},${yDv50(d.dv50).toFixed(1)}`).join(" ");
  const flowPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${xPos(d.p).toFixed(1)},${yFlow(d.flow).toFixed(1)}`).join(" ");

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="mb-4 flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
        Performance vs Pressure
      </h2>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: 500 }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={PAD} y1={PAD + f * (H - PAD * 2)} x2={W - PAD} y2={PAD + f * (H - PAD * 2)} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4,4" />
        ))}
        {/* Axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--border)" strokeWidth="1" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="var(--border)" strokeWidth="1" />
        {/* X axis labels */}
        <text x={W / 2} y={H - 5} textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="monospace">Pressure (bar)</text>
        {data.filter((_, i) => i % 2 === 0).map((d) => (
          <text key={d.p} x={xPos(d.p)} y={H - PAD + 14} textAnchor="middle" fill="var(--muted)" fontSize="8" fontFamily="monospace">{d.p}</text>
        ))}
        {/* Dv50 line (cyan) */}
        <path d={dv50Path} fill="none" stroke="#06b6d4" strokeWidth="2" />
        {data.map((d) => (
          <circle key={`dv50-${d.p}`} cx={xPos(d.p)} cy={yDv50(d.dv50)} r="2.5" fill="#06b6d4" />
        ))}
        {/* Flow line (emerald) */}
        <path d={flowPath} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6,3" />
        {data.map((d) => (
          <circle key={`flow-${d.p}`} cx={xPos(d.p)} cy={yFlow(d.flow)} r="2.5" fill="#10b981" />
        ))}
        {/* Y axis labels */}
        <text x={PAD - 4} y={PAD + 4} textAnchor="end" fill="#06b6d4" fontSize="8" fontFamily="monospace">{maxDv50}µm</text>
        <text x={PAD - 4} y={H - PAD} textAnchor="end" fill="#06b6d4" fontSize="8" fontFamily="monospace">0</text>
      </svg>
      <div className="mt-3 flex items-center gap-6 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded" style={{ backgroundColor: "#06b6d4" }} />
          <span className="text-[#06b6d4]">Dv50 (µm)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded border-t border-dashed" style={{ borderColor: "#10b981" }} />
          <span className="text-[#10b981]">Flow Rate (mL/min)</span>
        </span>
      </div>
    </div>
  );
}

// ---- Tooling Section ----
function ToolingSection({ actuator }: { actuator: Actuator }) {
  const [volume, setVolume] = useState(100);
  const tooling = recommendTooling(volume, actuator);

  const labelMap: Record<string, string> = {
    fdm_3d_print: "FDM 3D Print (Concept)",
    sla_resin: "SLA Resin (Hi-Res Prototype)",
    sls_nylon: "SLS Nylon (Functional Pilot)",
    soft_tool: "Soft Tooling (Pilot Production)",
    hardened_steel: "Hardened Steel (Mass Production)",
  };
  const colorMap: Record<string, string> = {
    fdm_3d_print: "var(--muted)",
    sla_resin: "var(--accent)",
    sls_nylon: "var(--accent-secondary)",
    soft_tool: "var(--warning)",
    hardened_steel: "var(--success)",
  };

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="mb-5 flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </svg>
        Tooling Recommendation
      </h2>

      <div className="mb-5 flex items-center gap-4">
        <label className="text-xs font-medium text-[var(--muted)]">
          Production Volume:
        </label>
        <input
          type="number" min={1} max={1000000} value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="input-field w-32 rounded-lg px-3 py-2 text-sm"
        />
        <span className="text-xs text-[var(--muted)]">units</span>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs md:grid-cols-3">
        <div>
          <span className="text-[var(--muted)]">Recommended Process</span>
          <p className="mt-0.5 font-semibold" style={{ color: colorMap[tooling.recommendation] }}>
            {labelMap[tooling.recommendation]}
          </p>
        </div>
        <div>
          <span className="text-[var(--muted)]">Cavity Count</span>
          <p className="mt-0.5 tabular-nums font-semibold text-[var(--fg-bright)]">
            {tooling.cavityCount} {tooling.cavityCount > 1 ? "cavities" : "cavity"}
          </p>
        </div>
        <div>
          <span className="text-[var(--muted)]">Lead Time</span>
          <p className="mt-0.5 tabular-nums font-semibold text-[var(--fg-bright)]">
            {tooling.estimatedLeadTime_days} days
          </p>
        </div>
        <div>
          <span className="text-[var(--muted)]">Tool Cost</span>
          <p className="mt-0.5 tabular-nums font-semibold text-[var(--fg-bright)]">
            {tooling.estimatedToolCost_usd > 0 ? `$${tooling.estimatedToolCost_usd.toLocaleString()}` : "None (print-on-demand)"}
          </p>
        </div>
        <div>
          <span className="text-[var(--muted)]">Cost Per Unit</span>
          <p className="mt-0.5 tabular-nums font-semibold text-[var(--fg-bright)]">
            ${tooling.costPerUnit_usd.toFixed(2)}
          </p>
        </div>
        <div>
          <span className="text-[var(--muted)]">Total (tool + units)</span>
          <p className="mt-0.5 tabular-nums font-bold text-[var(--accent)]">
            ${(tooling.estimatedToolCost_usd + tooling.costPerUnit_usd * volume).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Volume tier comparison */}
      <div className="mt-5 border-t border-[var(--border)] pt-4">
        <span className="text-xs font-medium text-[var(--muted)]">Cost At Volume</span>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left text-xs font-medium text-[var(--muted)]">Volume</th>
                <th className="py-2 pr-4 text-left text-xs font-medium text-[var(--muted)]">Process</th>
                <th className="py-2 pr-4 text-left text-xs font-medium text-[var(--muted)]">Unit Cost</th>
                <th className="py-2 text-left text-xs font-medium text-[var(--muted)]">Total</th>
              </tr>
            </thead>
            <tbody>
              {[3, 15, 50, 500, 1000, 10000, 100000].map((v) => {
                const t = recommendTooling(v, actuator);
                const total = t.estimatedToolCost_usd + t.costPerUnit_usd * v;
                const isActive = v === volume;
                return (
                  <tr key={v} className={`border-b border-[var(--border)] last:border-b-0 ${isActive ? "bg-[var(--accent)]/5" : ""}`}>
                    <td className="py-2 pr-4 tabular-nums">{v.toLocaleString()}</td>
                    <td className="py-2 pr-4" style={{ color: colorMap[t.recommendation] }}>{labelMap[t.recommendation].split(" (")[0]}</td>
                    <td className="py-2 pr-4 tabular-nums">${t.costPerUnit_usd.toFixed(2)}</td>
                    <td className="py-2 tabular-nums font-semibold">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---- Regulatory Compliance Section ----
function RegulatorySection({ actuator, fluid }: { actuator: Actuator; fluid: Fluid }) {
  const td = actuator.technicalDesign;
  const checks: { label: string; status: "pass" | "warn" | "fail" | "na"; detail: string }[] = [];

  // Child resistant
  if (td.childResistant) {
    checks.push({ label: "Child Resistant (CR)", status: "pass", detail: "CR mechanism included in design" });
  } else {
    const needsCR = actuator.industries.some((i) => ["household", "agrochemical", "pharmaceutical"].includes(i));
    checks.push({
      label: "Child Resistant (CR)",
      status: needsCR ? "warn" : "na",
      detail: needsCR ? "Recommended for this industry — not present" : "Not required for application",
    });
  }

  // FDA compliance
  if (td.fdaCompliant) {
    checks.push({ label: "FDA Material Compliance", status: "pass", detail: "Materials are FDA-approved for contact" });
  } else {
    const needsFDA = actuator.industries.some((i) => ["pharmaceutical", "personal_care", "food_beverage"].includes(i));
    checks.push({
      label: "FDA Material Compliance",
      status: needsFDA ? "warn" : "na",
      detail: needsFDA ? "Recommended for this industry — verify materials" : "Not required for application",
    });
  }

  // Cleanroom
  if (td.cleanroomClass) {
    checks.push({ label: "Cleanroom Class", status: "pass", detail: `Certified ${td.cleanroomClass.replace("_", " ")}` });
  } else {
    const needsClean = actuator.industries.some((i) => ["pharmaceutical"].includes(i));
    checks.push({
      label: "Cleanroom Class",
      status: needsClean ? "warn" : "na",
      detail: needsClean ? "Pharma applications typically require ISO 7+" : "Not required",
    });
  }

  // Flammability check
  if (fluid.flashPoint_C !== null && fluid.flashPoint_C < 60) {
    checks.push({ label: "Flammability", status: "warn", detail: `Flash point ${fluid.flashPoint_C}°C — consider ATEX-rated equipment` });
  } else {
    checks.push({ label: "Flammability", status: "pass", detail: "No flammability concerns" });
  }

  // Chemical hazards
  if (fluid.hazards.length > 0) {
    checks.push({ label: "Chemical Hazards", status: "warn", detail: `${fluid.hazards.join(", ")} — ensure proper containment` });
  } else {
    checks.push({ label: "Chemical Hazards", status: "pass", detail: "No classified hazards" });
  }

  // Material compatibility
  const matCompat = actuator.materialCompatibility.includes(fluid.solventClass);
  checks.push({
    label: "Material Compatibility",
    status: matCompat ? "pass" : "fail",
    detail: matCompat ? `${td.bodyMaterial} compatible with ${fluid.solventClass}` : `${td.bodyMaterial} NOT compatible with ${fluid.solventClass} — risk of degradation`,
  });

  const statusIcon: Record<string, { color: string; icon: string }> = {
    pass: { color: "var(--success)", icon: "M20 6L9 17l-5-5" },
    warn: { color: "var(--warning)", icon: "M12 9v2m0 4h.01" },
    fail: { color: "var(--danger)", icon: "M18 6L6 18M6 6l12 12" },
    na: { color: "var(--muted)", icon: "M5 12h14" },
  };

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="mb-5 flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Regulatory & Safety Compliance
      </h2>
      <div className="space-y-3">
        {checks.map((c) => {
          const s = statusIcon[c.status];
          return (
            <div key={c.label} className="flex items-start gap-3 rounded-lg border border-[var(--border)] px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                <path d={s.icon} />
              </svg>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--fg-bright)]">{c.label}</span>
                  <span
                    className="rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase"
                    style={{ borderColor: s.color, color: s.color }}
                  >
                    {c.status === "na" ? "N/A" : c.status}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">{c.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Droplet Distribution Visualization ----
function DistributionBar({ dist }: { dist: { Dv10_um: number; Dv50_um: number; Dv90_um: number; span: number } }) {
  const max = dist.Dv90_um * 1.2;
  const pct10 = (dist.Dv10_um / max) * 100;
  const pct50 = (dist.Dv50_um / max) * 100;
  const pct90 = (dist.Dv90_um / max) * 100;

  return (
    <div className="space-y-3">
      <div className="relative h-10 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
        {/* Dv10-Dv90 range bar */}
        <div
          className="absolute top-1 bottom-1 rounded-md bg-[var(--accent)]/15"
          style={{ left: `${pct10}%`, width: `${pct90 - pct10}%` }}
        />
        {/* Dv10 marker */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-[#06b6d4]/60" style={{ left: `${pct10}%` }}>
          <span className="absolute -top-5 -translate-x-1/2 text-[11px] text-[#06b6d4]">{dist.Dv10_um}</span>
        </div>
        {/* Dv50 marker */}
        <div className="absolute top-0 bottom-0 w-1 bg-[var(--accent)]" style={{ left: `${pct50}%` }}>
          <span className="absolute -top-5 -translate-x-1/2 text-xs font-bold text-[var(--accent)]">{dist.Dv50_um}</span>
        </div>
        {/* Dv90 marker */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-[#06b6d4]/60" style={{ left: `${pct90}%` }}>
          <span className="absolute -top-5 -translate-x-1/2 text-[11px] text-[#06b6d4]">{dist.Dv90_um}</span>
        </div>
      </div>
      <div className="flex justify-between text-[11px] text-[var(--muted)]">
        <span>0 µm</span>
        <span>{Math.round(max)} µm</span>
      </div>
    </div>
  );
}

function ResultsContent() {
  const params = useSearchParams();
  const actuatorId = params.get("actuator");
  const fluidId = params.get("fluid");
  const pressure = Number(params.get("pressure")) || 5;

  const actuator = ACTUATORS.find((a) => a.id === actuatorId);
  const fluid = FLUIDS.find((f) => f.id === fluidId);

  if (!actuator || !fluid) {
    return (
      <div className="glass-bright rounded-xl p-12 text-center">
        <p className="text-sm text-[var(--danger)]">
          Missing or invalid parameters.{" "}
          <Link href="/configure" className="underline text-[var(--accent)]">Back to configurator</Link>.
        </p>
      </div>
    );
  }

  const result = predict(actuator, fluid, pressure);
  const dist = result.dropletDistribution;
  const color = ACTUATOR_COLORS[actuator.type] || "#06b6d4";
  const scoreColor = result.compatibilityScore >= 80 ? "var(--success)" : result.compatibilityScore >= 50 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="space-y-8">
      {/* Header + Export */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
            <span className="text-xs tracking-wider text-[var(--accent)]">PREDICTION DETAIL</span>
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--fg-bright)]">{actuator.name}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{fluid.name} @ {pressure} bar</p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{actuator.description}</p>
        </div>
        <div className="flex items-center gap-4 pattern-dark">
          <ActuatorIllustration type={actuator.type} size={80} />
          <SprayPatternIllustration type={actuator.type} size={60} />
        </div>
      </div>

      {/* Score + Regime + Clogging Banner */}
      <div className="glass-bright rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-medium text-[var(--muted)]">
              Compatibility Score
            </p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold" style={{ color: scoreColor, textShadow: `0 0 30px ${scoreColor}40` }}>
                {result.compatibilityScore}
              </span>
              <span className="mb-1 text-xl text-[var(--muted)]">/100</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-medium text-[var(--muted)]">
              Atomization Regime
            </p>
            <RegimeBadge regime={result.atomizationRegime} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-medium text-[var(--muted)]">
              Clogging Risk
            </p>
            <CloggingBadge risk={result.cloggingRisk} />
          </div>
          <div className="space-y-2 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs text-[var(--muted)]">Material</span>
              {actuator.materialCompatibility.includes(fluid.solventClass) ? (
                <span className="rounded-md border border-[var(--success)] px-2 py-0.5 text-xs font-bold text-[var(--success)]">PASS</span>
              ) : (
                <span className="rounded-md border border-[var(--danger)] px-2 py-0.5 text-xs font-bold text-[var(--danger)]">FAIL</span>
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs text-[var(--muted)]">Pressure</span>
              {pressure <= actuator.maxPressure_bar ? (
                <span className="rounded-md border border-[var(--success)] px-2 py-0.5 text-xs font-bold text-[var(--success)]">SAFE</span>
              ) : (
                <span className="rounded-md border border-[var(--danger)] px-2 py-0.5 text-xs font-bold text-[var(--danger)]">OVER</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Material Stress Analysis */}
      {(result.materialStress.swellingRisk || result.materialStress.stressCrackingRisk || result.materialStress.leachingRisk) && (
        <div className="rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/5 p-5">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-medium text-[var(--warning)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01" /></svg>
            Material Stress Analysis
          </h2>
          <div className="flex flex-wrap gap-3">
            {result.materialStress.swellingRisk && (
              <div className="rounded-lg border border-[var(--warning)]/30 bg-[var(--bg)] px-4 py-2">
                <p className="text-xs font-bold text-[var(--warning)]">Swelling Risk</p>
                <p className="text-[10px] text-[var(--muted)]">Solvent may cause polymer swelling in {actuator.technicalDesign.bodyMaterial}</p>
              </div>
            )}
            {result.materialStress.stressCrackingRisk && (
              <div className="rounded-lg border border-[var(--danger)]/30 bg-[var(--bg)] px-4 py-2">
                <p className="text-xs font-bold text-[var(--danger)]">Stress Cracking Risk</p>
                <p className="text-[10px] text-[var(--muted)]">Environmental stress cracking possible with {fluid.solventClass} solvents</p>
              </div>
            )}
            {result.materialStress.leachingRisk && (
              <div className="rounded-lg border border-[var(--warning)]/30 bg-[var(--bg)] px-4 py-2">
                <p className="text-xs font-bold text-[var(--warning)]">Leaching Risk</p>
                <p className="text-[10px] text-[var(--muted)]">Components may leach into product — verify for food/pharma applications</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Safety Warnings */}
      {result.safetyWarnings.length > 0 && (
        <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-5">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-medium text-[var(--danger)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            Safety Warnings
          </h2>
          <div className="space-y-2">
            {result.safetyWarnings.map((w, i) => (
              <p key={i} className="text-xs text-[var(--danger)]">{w}</p>
            ))}
          </div>
          {fluid.ppeRequired.length > 0 && (
            <div className="mt-3 border-t border-[var(--danger)]/20 pt-3">
              <span className="text-xs font-medium text-[var(--warning)]">Required PPE:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {fluid.ppeRequired.map((p) => (
                  <span key={p} className="rounded-md border border-[var(--warning)]/30 px-2 py-0.5 text-xs text-[var(--warning)]">
                    {p.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Droplet Distribution */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-5 flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
          </svg>
          Droplet Size Distribution
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-5">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="rounded-lg border border-[var(--border)] p-3">
                <p className="text-xs text-[var(--muted)]">Dv10</p>
                <p className="text-lg font-bold text-[var(--fg-bright)]">{dist.Dv10_um}</p>
                <p className="text-[11px] text-[var(--muted)]">µm</p>
              </div>
              <div className="rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/5 p-3">
                <p className="text-xs text-[var(--accent)]">Dv50</p>
                <p className="text-lg font-bold text-[var(--accent)]">{dist.Dv50_um}</p>
                <p className="text-[11px] text-[var(--muted)]">µm</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] p-3">
                <p className="text-xs text-[var(--muted)]">Dv90</p>
                <p className="text-lg font-bold text-[var(--fg-bright)]">{dist.Dv90_um}</p>
                <p className="text-[11px] text-[var(--muted)]">µm</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] p-3">
                <p className="text-xs text-[var(--muted)]">Span</p>
                <p className="text-lg font-bold text-[var(--fg-bright)]">{dist.span}</p>
                <p className="text-[11px] text-[var(--muted)]">(Dv90-Dv10)/Dv50</p>
              </div>
            </div>
            <DistributionBar dist={dist} />
          </div>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between border-b border-[var(--border)] pb-3">
              <span className="text-[var(--muted)]">Delivery Rate</span>
              <strong className="tabular-nums text-[var(--fg-bright)]">{result.deliveryRate_g_s} g/s</strong>
            </div>
            {fluid.rheology !== "newtonian" && (
              <div className="flex justify-between border-b border-[var(--border)] pb-3">
                <span className="text-[var(--muted)]">Apparent Viscosity (at orifice)</span>
                <strong className="tabular-nums text-[var(--accent)]">{result.apparentViscosity_cP} cP</strong>
              </div>
            )}
            <div className="flex justify-between border-b border-[var(--border)] pb-3">
              <span className="text-[var(--muted)]">Nominal Viscosity</span>
              <strong className="tabular-nums text-[var(--fg-bright)]">{fluid.viscosity_cP} cP</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-3">
              <span className="text-[var(--muted)]">Polydispersity</span>
              <strong className="tabular-nums text-[var(--fg-bright)]">
                {dist.span < 1 ? "Narrow" : dist.span < 2 ? "Moderate" : "Wide"} ({dist.span})
              </strong>
            </div>
            <div className="flex justify-between pb-3">
              <span className="text-[var(--muted)]">Flow Regime</span>
              <strong className="tabular-nums text-[var(--fg-bright)]">
                {result.reynoldsNumber > 4000 ? "Turbulent" : result.reynoldsNumber > 2000 ? "Transitional" : "Laminar"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Physics + Dimensionless Numbers */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-xl p-6">
          <h2 className="mb-5 flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            </svg>
            Spray Physics
          </h2>
          <div className="space-y-4 text-xs">
            {[
              { label: "Predicted Cone Angle", value: `${result.coneAngle_deg}°` },
              { label: "Droplet Size (Dv50)", value: `${result.dropletSizeDv50_um} µm` },
              { label: "Flow Rate", value: `${result.flowRate_mL_min} mL/min` },
              { label: "Spray Width @ 100mm", value: `${result.sprayWidth_mm_at_100mm} mm` },
              { label: "Exit Velocity", value: `${result.velocityExit_m_s} m/s` },
            ].map((item, i, arr) => (
              <div key={item.label} className={`flex justify-between pb-3 ${i < arr.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
                <span className="text-[var(--muted)]">{item.label}</span>
                <strong className="tabular-nums text-[var(--fg-bright)]">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="mb-5 flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
            </svg>
            Dimensionless Numbers
          </h2>
          <div className="space-y-4 text-xs">
            {[
              { label: "Reynolds Number (Re)", value: result.reynoldsNumber.toLocaleString() },
              { label: "Weber Number (We)", value: result.weberNumber.toLocaleString() },
              { label: "Ohnesorge Number (Oh)", value: String(result.ohnesorgeNumber) },
              { label: "Atomization Regime", value: result.atomizationRegime },
              { label: "Flow Regime", value: result.reynoldsNumber > 4000 ? "Turbulent" : result.reynoldsNumber > 2000 ? "Transitional" : "Laminar" },
            ].map((item, i, arr) => (
              <div key={item.label} className={`flex justify-between pb-3 ${i < arr.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
                <span className="text-[var(--muted)]">{item.label}</span>
                <strong className="tabular-nums text-[var(--fg-bright)]">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <PressureChart actuator={actuator} fluid={fluid} />

      {/* 3D Parametric Viewer + CAD Export */}
      <ActuatorViewer3D actuator={actuator} height={420} />

      {/* Spray Pattern Visualization (2D) */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          Spray Pattern — {actuator.type.replace(/_/g, " ")}
        </h2>
        <div className="flex items-center justify-center gap-12 rounded-lg bg-[#0c1222] py-8 px-6">
          <div className="text-center">
            <p className="mb-2 text-xs font-medium text-slate-400">Side View</p>
            <div className="float"><ActuatorIllustration type={actuator.type} size={160} /></div>
          </div>
          <div className="text-center">
            <p className="mb-2 text-xs font-medium text-slate-400">Top-Down Pattern</p>
            <div className="float" style={{ animationDelay: "1s" }}><SprayPatternIllustration type={actuator.type} size={120} /></div>
          </div>
        </div>
      </div>

      {/* Valve Stem & Ergonomics */}
      <StemErgonomicsSection actuator={actuator} />

      {/* Tooling Recommendation */}
      <ToolingSection actuator={actuator} />

      {/* Regulatory Compliance */}
      <RegulatorySection actuator={actuator} fluid={fluid} />

      {/* Actuator Specs */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-5 text-xs font-medium text-[var(--muted)]">
          Actuator Specifications
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs md:grid-cols-4">
          {[
            { label: "Manufacturer", value: actuator.manufacturer },
            { label: "Category", value: PRODUCT_CATEGORY_LABELS[actuator.productCategory] },
            { label: "SKU", value: actuator.sku },
            { label: "Type", value: actuator.type.replace(/_/g, " ") },
            { label: "Orifice", value: `${actuator.orificeDiameter_mm} mm` },
            { label: "Max Pressure", value: `${actuator.maxPressure_bar} bar` },
            { label: "Swirl Angle", value: `${actuator.swirlChamberAngle_deg}°` },
            { label: "Compatible With", value: actuator.materialCompatibility.join(", ") },
            { label: "Applications", value: actuator.typicalApplications.join(", ") },
            { label: "Unit Price", value: `$${actuator.price_usd.toFixed(2)}` },
          ].map((item) => (
            <div key={item.label}>
              <span className="text-[var(--muted)]">{item.label}</span>
              <p className="mt-0.5 font-semibold text-[var(--fg-bright)]">{item.value}</p>
            </div>
          ))}
        </div>
        {/* Industries */}
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <span className="text-xs font-medium text-[var(--muted)]">Industries</span>
          <div className="mt-2 flex flex-wrap gap-1">
            {actuator.industries.map((ind) => (
              <span key={ind} className="rounded-md bg-[var(--accent)]/5 px-2 py-0.5 text-xs tracking-wider text-[var(--accent)]">
                {INDUSTRY_LABELS[ind]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Design */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-5 flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
          </svg>
          Technical Design
        </h2>
        <TechnicalDesignPanel actuator={actuator} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => exportCSV(actuator, fluid, result, pressure)}
          className="btn-secondary rounded-lg px-6 py-3 text-sm tracking-wider flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export CSV
        </button>
        <button
          onClick={() => exportPDF(actuator, fluid, result, pressure)}
          className="btn-secondary rounded-lg px-6 py-3 text-sm tracking-wider flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
          </svg>
          Export PDF
        </button>
        <button
          onClick={() => {
            addToCart({ actuatorId: actuator.id, quantity: 10, orderType: "sample" });
            alert(`Added ${actuator.sku} to cart`);
          }}
          className="btn-secondary rounded-lg px-6 py-3 text-sm tracking-wider flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          Add to Cart
        </button>
        <Link href="/configure" className="btn-secondary rounded-lg px-6 py-3 text-sm tracking-wider no-underline">
          Back to Configurator
        </Link>
        <Link href={`/compare?actuators=${actuator.id}&fluid=${fluid.id}&pressure=${pressure}`} className="btn-secondary rounded-lg px-6 py-3 text-sm tracking-wider no-underline">
          Compare Actuators
        </Link>
        <Link href={`/procurement?actuator=${actuator.id}&qty=100`} className="btn-primary rounded-lg px-6 py-3 text-sm tracking-wider no-underline">
          Procure This Actuator
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPage() {
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
      <ResultsContent />
    </Suspense>
  );
}
