"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ACTUATORS, FLUIDS, predict, INDUSTRY_LABELS } from "@/lib/data";
import Link from "next/link";
import { ActuatorIllustration, SprayPatternIllustration, ACTUATOR_COLORS } from "@/components/ActuatorIllustrations";

function RegimeBadge({ regime }: { regime: string }) {
  const colors: Record<string, string> = {
    Atomization: "var(--success)",
    "Wind-stressed": "var(--accent)",
    "Wind-induced": "var(--warning)",
    Rayleigh: "var(--danger)",
  };
  const color = colors[regime] || "var(--muted)";
  return (
    <span className="rounded-md border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] font-bold" style={{ borderColor: color, color }}>
      {regime}
    </span>
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
  const color = ACTUATOR_COLORS[actuator.type] || "#06b6d4";
  const scoreColor = result.compatibilityScore >= 80 ? "var(--success)" : result.compatibilityScore >= 50 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--accent)]">PREDICTION DETAIL</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-[var(--fg-bright)]">{actuator.name}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{fluid.name} @ {pressure} bar</p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{actuator.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <ActuatorIllustration type={actuator.type} size={80} />
          <SprayPatternIllustration type={actuator.type} size={60} />
        </div>
      </div>

      {/* Score + Regime Banner */}
      <div className="glass-bright rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Compatibility Score
            </p>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold" style={{ color: scoreColor, textShadow: `0 0 30px ${scoreColor}40` }}>
                {result.compatibilityScore}
              </span>
              <span className="mb-1 text-xl text-[var(--muted)]">/100</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="mb-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Atomization Regime
              </p>
              <RegimeBadge regime={result.atomizationRegime} />
            </div>
          </div>
          <div className="space-y-2 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--muted)]">Material</span>
              {actuator.materialCompatibility.includes(fluid.solventClass) ? (
                <span className="rounded-md border border-[var(--success)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold text-[var(--success)]">PASS</span>
              ) : (
                <span className="rounded-md border border-[var(--danger)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold text-[var(--danger)]">FAIL</span>
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--muted)]">Pressure</span>
              {pressure <= actuator.maxPressure_bar ? (
                <span className="rounded-md border border-[var(--success)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold text-[var(--success)]">SAFE</span>
              ) : (
                <span className="rounded-md border border-[var(--danger)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold text-[var(--danger)]">OVER</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Warnings */}
      {result.safetyWarnings.length > 0 && (
        <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-5">
          <h2 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--danger)]">
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
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--warning)]">Required PPE:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {fluid.ppeRequired.map((p) => (
                  <span key={p} className="rounded-md border border-[var(--warning)]/30 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--warning)]">
                    {p.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Physics + Dimensionless Numbers */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-xl p-6">
          <h2 className="mb-5 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--muted)]">
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
                <strong className="font-[family-name:var(--font-mono)] text-[var(--fg-bright)]">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="mb-5 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--muted)]">
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
                <strong className="font-[family-name:var(--font-mono)] text-[var(--fg-bright)]">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spray Visualization */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--muted)]">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          Spray Visualization — {actuator.type.replace(/_/g, " ")}
        </h2>
        <div className="flex items-center justify-center gap-12 py-6">
          <div className="text-center">
            <p className="mb-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">Side View</p>
            <div className="float"><ActuatorIllustration type={actuator.type} size={160} /></div>
          </div>
          <div className="text-center">
            <p className="mb-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">Top-Down Pattern</p>
            <div className="float" style={{ animationDelay: "1s" }}><SprayPatternIllustration type={actuator.type} size={120} /></div>
          </div>
        </div>
      </div>

      {/* Actuator Specs */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--muted)]">
          Actuator Specifications
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs md:grid-cols-4">
          {[
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
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">Industries</span>
          <div className="mt-2 flex flex-wrap gap-1">
            {actuator.industries.map((ind) => (
              <span key={ind} className="rounded-md bg-[var(--accent)]/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--accent)]">
                {INDUSTRY_LABELS[ind]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/configure" className="btn-secondary rounded-lg px-6 py-3 font-[family-name:var(--font-mono)] text-xs tracking-wider no-underline">
          ← Back to Configurator
        </Link>
        <Link href={`/compare`} className="btn-secondary rounded-lg px-6 py-3 font-[family-name:var(--font-mono)] text-xs tracking-wider no-underline">
          Compare Actuators
        </Link>
        <Link href={`/procurement?actuator=${actuator.id}&qty=100`} className="btn-primary rounded-lg px-6 py-3 font-[family-name:var(--font-mono)] text-xs tracking-wider no-underline">
          Procure This Actuator →
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
