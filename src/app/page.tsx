"use client";

import { useState } from "react";
import Link from "next/link";
import { ACTUATORS, FLUIDS, INDUSTRY_LABELS, SOLVENT_CLASS_LABELS } from "@/lib/data";
import type { Industry, SolventClass } from "@/lib/data";
import { ActuatorIllustration, SprayPatternIllustration, ACTUATOR_COLORS } from "@/components/ActuatorIllustrations";

const ALL_INDUSTRIES = Object.keys(INDUSTRY_LABELS) as Industry[];
const ALL_SOLVENT_CLASSES = Object.keys(SOLVENT_CLASS_LABELS) as SolventClass[];

export default function Home() {
  const [industryFilter, setIndustryFilter] = useState<Industry | "all">("all");
  const [solventFilter, setSolventFilter] = useState<SolventClass | "all">("all");

  const filteredActuators = ACTUATORS.filter(
    (a) => industryFilter === "all" || a.industries.includes(industryFilter)
  );
  const filteredFluids = FLUIDS.filter(
    (f) => solventFilter === "all" || f.solventClass === solventFilter
  );

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-16">
        <div className="dot-grid absolute inset-0 opacity-50" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-bright)] bg-[var(--surface)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[var(--accent)]">
              12 ACTUATORS &middot; 25 FLUIDS &middot; 9 SOLVENT CLASSES
            </span>
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-[var(--fg-bright)]">
            Predictive Actuator
            <br />
            <span className="gradient-text">Configurator</span>
          </h1>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-[var(--muted)]">
            Input fluid properties and hardware constraints to instantly receive
            mechanically compatible, mathematically predicted actuator
            configurations — with Ohnesorge regime classification, safety
            warnings, and side-by-side comparison.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/configure"
              className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-[family-name:var(--font-mono)] text-xs tracking-wider no-underline"
            >
              Start Configuration
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6.5 3.5L11 8l-4.5 4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/compare"
              className="btn-secondary inline-block rounded-lg px-6 py-3 font-[family-name:var(--font-mono)] text-xs tracking-wider no-underline"
            >
              Compare Actuators
            </Link>
            <Link
              href="#catalog"
              className="btn-secondary inline-block rounded-lg px-6 py-3 font-[family-name:var(--font-mono)] text-xs tracking-wider no-underline"
            >
              View Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Actuator Geometries", value: ACTUATORS.length, icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
          { label: "Newtonian Fluids", value: FLUIDS.length, icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" },
          { label: "Solvent Classes", value: ALL_SOLVENT_CLASSES.length, icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 2v4m8-4v4m-9 4h10" },
          { label: "Industries Served", value: ALL_INDUSTRIES.length, icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
        ].map((s) => (
          <div key={s.label} className="glass group rounded-xl p-6 transition-all hover:border-[var(--border-bright)] hover:shadow-[var(--glow)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={s.icon} />
              </svg>
            </div>
            <p className="mb-1 text-3xl font-bold text-[var(--fg-bright)]">{s.value}</p>
            <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--muted)]">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {/* Actuator Catalog — Visual Cards with Industry Filter */}
      <section id="catalog">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-[var(--fg-bright)]">
            Actuator Catalog
          </h2>
          <p className="text-sm text-[var(--muted)]">
            {ACTUATORS.length} precision nozzle geometries across {ALL_INDUSTRIES.length} industries
          </p>
        </div>

        {/* Industry filter chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setIndustryFilter("all")}
            className={`rounded-lg border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
              industryFilter === "all"
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
            }`}
          >
            All ({ACTUATORS.length})
          </button>
          {ALL_INDUSTRIES.map((ind) => {
            const count = ACTUATORS.filter((a) => a.industries.includes(ind)).length;
            if (count === 0) return null;
            return (
              <button
                key={ind}
                onClick={() => setIndustryFilter(ind)}
                className={`rounded-lg border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
                  industryFilter === ind
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
                }`}
              >
                {INDUSTRY_LABELS[ind]} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredActuators.map((a) => {
            const color = ACTUATOR_COLORS[a.type] || "#06b6d4";
            return (
              <div
                key={a.id}
                className="glass group rounded-xl p-6 transition-all hover:border-[var(--border-bright)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="float">
                    <ActuatorIllustration type={a.type} size={90} />
                  </div>
                  <div className="text-right">
                    <SprayPatternIllustration type={a.type} size={56} />
                    <p className="mt-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-widest text-[var(--muted)]">
                      Spray Pattern
                    </p>
                  </div>
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider" style={{ color }}>
                    {a.sku}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-[var(--fg-bright)]">
                  {a.name}
                </h3>
                <p className="mb-3 text-[11px] leading-relaxed text-[var(--muted)]">
                  {a.description}
                </p>
                <div className="mb-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[var(--muted)]">Orifice</span>
                    <p className="font-semibold text-[var(--fg)]">{a.orificeDiameter_mm} mm</p>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">Max Pressure</span>
                    <p className="font-semibold text-[var(--fg)]">{a.maxPressure_bar} bar</p>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">Swirl Angle</span>
                    <p className="font-semibold text-[var(--fg)]">{a.swirlChamberAngle_deg}°</p>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">Price</span>
                    <p className="font-semibold text-[var(--fg)]">${a.price_usd.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mb-2 flex flex-wrap gap-1">
                  {a.materialCompatibility.map((m) => (
                    <span key={m} className="rounded-md border border-[var(--border)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--muted)]">
                      {m}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {a.industries.map((ind) => (
                    <span key={ind} className="rounded-md bg-[var(--accent)]/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] tracking-wider text-[var(--accent)]" style={{ opacity: 0.7 }}>
                      {INDUSTRY_LABELS[ind]}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fluid Reference with Solvent Class Filter */}
      <section>
        <div className="mb-4">
          <h2 className="mb-2 text-2xl font-bold text-[var(--fg-bright)]">
            Fluid Reference Library
          </h2>
          <p className="text-sm text-[var(--muted)]">
            {FLUIDS.length} Newtonian fluids across {ALL_SOLVENT_CLASSES.length} solvent classes with hazard and PPE data
          </p>
        </div>

        {/* Solvent class filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSolventFilter("all")}
            className={`rounded-lg border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
              solventFilter === "all"
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
            }`}
          >
            All ({FLUIDS.length})
          </button>
          {ALL_SOLVENT_CLASSES.map((sc) => {
            const count = FLUIDS.filter((f) => f.solventClass === sc).length;
            if (count === 0) return null;
            return (
              <button
                key={sc}
                onClick={() => setSolventFilter(sc)}
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

        <div className="glass overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">ID</th>
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Name</th>
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Viscosity (cP)</th>
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Density (kg/m³)</th>
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Surface Tension</th>
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Class</th>
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Flash Pt</th>
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Hazards</th>
                </tr>
              </thead>
              <tbody>
                {filteredFluids.map((f) => (
                  <tr key={f.id} className="table-row-hover border-b border-[var(--border)] last:border-b-0">
                    <td className="px-5 py-3 font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{f.id}</td>
                    <td className="px-5 py-3 text-[var(--fg-bright)]">{f.name}</td>
                    <td className="px-5 py-3 font-[family-name:var(--font-mono)]">{f.viscosity_cP}</td>
                    <td className="px-5 py-3 font-[family-name:var(--font-mono)]">{f.density_kg_m3}</td>
                    <td className="px-5 py-3 font-[family-name:var(--font-mono)]">{f.surfaceTension_mN_m} mN/m</td>
                    <td className="px-5 py-3">
                      <span className="rounded-md border border-[var(--border)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--muted)]">
                        {f.solventClass}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-[family-name:var(--font-mono)]">
                      {f.flashPoint_C !== null ? (
                        <span className={f.flashPoint_C < 23 ? "text-[var(--danger)]" : ""}>
                          {f.flashPoint_C}°C
                        </span>
                      ) : (
                        <span className="text-[var(--muted)]">N/A</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {f.hazards.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {f.hazards.map((h) => (
                            <span key={h} className="rounded-md border border-[var(--danger)]/30 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--danger)]">
                              {h}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[var(--success)] text-[10px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Computational Pipeline */}
      <section className="glass-bright rounded-xl p-8">
        <h2 className="mb-6 text-lg font-bold text-[var(--fg-bright)]">
          Computational Pipeline
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { step: "Fluid Input", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
            { step: "Property Extraction", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 2v4m8-4v4m-9 4h10" },
            { step: "Regime Classification", icon: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14" },
            { step: "Surrogate Prediction", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            { step: "Safety Analysis", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
            { step: "Procurement", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-3">
              {i > 0 && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--muted)]">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              <span className="group flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 transition-all hover:border-[var(--accent)] hover:shadow-[var(--glow)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
                  <path d={item.icon} />
                </svg>
                <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-[var(--fg)]">
                  {item.step}
                </span>
              </span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
