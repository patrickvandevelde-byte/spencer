"use client";

import { useState } from "react";
import Link from "next/link";
import { ACTUATORS, FLUIDS, INDUSTRY_LABELS, SOLVENT_CLASS_LABELS, PRODUCT_CATEGORY_LABELS } from "@/lib/data";
import type { Industry, SolventClass, Manufacturer } from "@/lib/data";
import { ActuatorIllustration, SprayPatternIllustration, ACTUATOR_COLORS } from "@/components/ActuatorIllustrations";

const ALL_INDUSTRIES = Object.keys(INDUSTRY_LABELS) as Industry[];
const ALL_SOLVENT_CLASSES = Object.keys(SOLVENT_CLASS_LABELS) as SolventClass[];

export default function Home() {
  const [industryFilter, setIndustryFilter] = useState<Industry | "all">("all");
  const [solventFilter, setSolventFilter] = useState<SolventClass | "all">("all");
  const [mfrFilter, setMfrFilter] = useState<Manufacturer | "all">("all");

  const filteredActuators = ACTUATORS.filter(
    (a) =>
      (industryFilter === "all" || a.industries.includes(industryFilter)) &&
      (mfrFilter === "all" || a.manufacturer === mfrFilter)
  );
  const filteredFluids = FLUIDS.filter(
    (f) => solventFilter === "all" || f.solventClass === solventFilter
  );

  return (
    <div className="space-y-24">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden py-20">
        <div className="dot-grid absolute inset-0 opacity-50" />
        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-bright)] bg-[var(--surface)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[var(--accent)]">
              SPRAY PHYSICS SOLVER
            </span>
          </div>

          <h1 className="mb-6 max-w-2xl text-6xl font-bold leading-[1.2] tracking-tight text-[var(--fg-bright)]">
            Find the Right Actuator
            <br />
            <span className="gradient-text">Instantly</span>
          </h1>

          <p className="mb-2 max-w-xl text-lg text-[var(--muted)]">
            Enter your fluid properties and constraints. Get physics-based actuator predictions with compatibility scores, safety warnings, and material analysis.
          </p>
          <p className="mb-8 max-w-xl text-sm text-[var(--muted)]">
            Type-specific atomization models • Material chemical attack detection • Real-time Ohnesorge regime classification
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/configure"
              className="btn-primary inline-flex items-center gap-2 rounded-lg px-7 py-3 font-[family-name:var(--font-mono)] text-sm font-semibold tracking-wide no-underline transition-all hover:shadow-lg"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Start Configuration
            </Link>
            <Link
              href="#workflow"
              className="btn-secondary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-[family-name:var(--font-mono)] text-sm tracking-wide no-underline"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ===== KEY STATS ===== */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Actuator Types", value: ACTUATORS.length, icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
          { label: "Fluid Database", value: FLUIDS.length, icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" },
          { label: "Industries", value: ALL_INDUSTRIES.length, icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
          { label: "Solvent Classes", value: ALL_SOLVENT_CLASSES.length, icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 2v4m8-4v4m-9 4h10" },
        ].map((s) => (
          <div key={s.label} className="glass group rounded-xl p-6 transition-all hover:border-[var(--border-bright)] hover:shadow-[var(--glow)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={s.icon} />
              </svg>
            </div>
            <p className="mb-1 text-3xl font-bold text-[var(--fg-bright)]">{s.value}</p>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--muted)]">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {/* ===== HOW IT WORKS / WORKFLOW ===== */}
      <section id="workflow" className="space-y-10">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-[var(--fg-bright)]">
            How It Works
          </h2>
          <p className="max-w-2xl text-[var(--muted)]">
            A seamless workflow from fluid selection to validated predictions to procurement
          </p>
        </div>

        {/* Visual workflow steps */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "1",
              title: "Select Fluid",
              description: "Choose from 25 Newtonian fluids or enter custom properties (viscosity, density, surface tension)",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            },
            {
              step: "2",
              title: "Set Pressure",
              description: "Define operating pressure (1–350 bar). Physics engine classifies atomization regime (full cone, mist, etc.)",
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
            },
            {
              step: "3",
              title: "Get Predictions",
              description: "Receive ranked list of compatible actuators with droplet size, spray angle, and compatibility scores",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            },
            {
              step: "4",
              title: "Compare & Order",
              description: "Side-by-side comparison of candidates. Check material compatibility warnings. Request sample or bulk order",
              icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z",
            },
          ].map((w, i) => (
            <div key={i} className="glass rounded-xl p-6 border border-[var(--border)]/50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] font-bold">
                {w.step}
              </div>
              <h3 className="mb-2 font-semibold text-[var(--fg-bright)]">{w.title}</h3>
              <p className="text-sm text-[var(--muted)]">{w.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== KEY FEATURES ===== */}
      <section className="space-y-8">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-[var(--fg-bright)]">
            Why AeroSpec
          </h2>
          <p className="max-w-2xl text-[var(--muted)]">
            Scientific foundation powered by spray physics, not guesswork
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Type-Specific Physics",
              description: "Each actuator geometry uses empirically-validated models: Lefebvre for swirl, Dombrowski & Johns for flat fan, Nukiyama & Tanasawa for air-atomizing, Lang for ultrasonic",
              icon: "⚗️",
            },
            {
              title: "Material Compatibility",
              description: "Automatic chemical attack detection. Ketones attack POM, hydrocarbons swell EPDM, caustics corrode aluminum. We flag incompatibilities instantly",
              icon: "⚠️",
            },
            {
              title: "Regime Classification",
              description: "Ohnesorge and Weber number calculations classify atomization regimes in real-time. Know if your fluid will atomize properly before ordering",
              icon: "📊",
            },
            {
              title: "Geometry-Based Predictions",
              description: "Swirl number calculated from actual chamber dimensions, channel counts, and orifice angles. Predictions scale to your actual hardware",
              icon: "🎯",
            },
          ].map((f, i) => (
            <div key={i} className="glass rounded-xl p-6 border border-[var(--border)]/50">
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-semibold text-[var(--fg-bright)]">{f.title}</h3>
              <p className="text-sm text-[var(--muted)]">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ACTUATOR CATALOG ===== */}
      <section id="catalog" className="space-y-6">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-[var(--fg-bright)]">
            Actuator Catalog
          </h2>
          <p className="text-[var(--muted)]">
            {ACTUATORS.length} precision nozzles from Spencer and Coster across {ALL_INDUSTRIES.length} industries
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Manufacturer filter */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">By Brand</p>
            <div className="flex flex-wrap gap-2">
              {(["all", "Spencer", "Coster"] as const).map((m) => {
                const count = m === "all" ? ACTUATORS.length : ACTUATORS.filter((a) => a.manufacturer === m).length;
                return (
                  <button
                    key={m}
                    onClick={() => setMfrFilter(m)}
                    className={`rounded-lg border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
                      mfrFilter === m
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
                    }`}
                  >
                    {m === "all" ? "All" : m} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Industry filter */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">By Industry</p>
            <div className="flex flex-wrap gap-2">
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
          </div>
        </div>

        {/* Actuator grid */}
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
                    <ActuatorIllustration type={a.type} size={80} />
                  </div>
                  <div className="text-right">
                    <SprayPatternIllustration type={a.type} size={48} />
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider" style={{ color }}>
                    {a.sku}
                  </span>
                  <span className={`rounded-md border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[8px] font-bold uppercase tracking-wider ${a.manufacturer === "Coster" ? "border-[#ec4899]/30 text-[#ec4899]" : "border-[#06b6d4]/30 text-[#06b6d4]"}`}>
                    {a.manufacturer}
                  </span>
                </div>

                <h3 className="mb-2 text-sm font-semibold text-[var(--fg-bright)]">
                  {a.name}
                </h3>

                <p className="mb-3 text-[11px] leading-relaxed text-[var(--muted)]">
                  {a.description}
                </p>

                <div className="mb-3 space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Orifice</span>
                    <span className="font-semibold">{a.orificeDiameter_mm} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Max Pressure</span>
                    <span className="font-semibold">{a.maxPressure_bar} bar</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Spray Angle</span>
                    <span className="font-semibold">{a.swirlChamberAngle_deg}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Price</span>
                    <span className="font-semibold">${a.price_usd.toFixed(2)}</span>
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
                  {a.industries.slice(0, 2).map((ind) => (
                    <span key={ind} className="rounded-md bg-[var(--accent)]/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] tracking-wider text-[var(--accent)]" style={{ opacity: 0.7 }}>
                      {INDUSTRY_LABELS[ind]}
                    </span>
                  ))}
                  {a.industries.length > 2 && (
                    <span className="rounded-md bg-[var(--accent)]/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] tracking-wider text-[var(--accent)]" style={{ opacity: 0.7 }}>
                      +{a.industries.length - 2}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== FLUID LIBRARY ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-[var(--fg-bright)]">
            Fluid Reference Library
          </h2>
          <p className="text-[var(--muted)]">
            {FLUIDS.length} Newtonian test fluids with full hazard and PPE data
          </p>
        </div>

        {/* Solvent class filter */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">By Solvent Class</p>
          <div className="flex flex-wrap gap-2">
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
        </div>

        {/* Fluid table */}
        <div className="glass overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">ID</th>
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Name</th>
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Viscosity</th>
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Density</th>
                  <th className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Tension</th>
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
                    <td className="px-5 py-3 font-[family-name:var(--font-mono)] text-[10px]">{f.surfaceTension_mN_m}</td>
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
                        <span className="text-[var(--muted)]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {f.hazards.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {f.hazards.slice(0, 2).map((h) => (
                            <span key={h} className="rounded-md border border-[var(--danger)]/30 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[8px] text-[var(--danger)]">
                              {h}
                            </span>
                          ))}
                          {f.hazards.length > 2 && (
                            <span className="text-[var(--danger)] text-[8px]">+{f.hazards.length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[var(--success)]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== CTA FOOTER ===== */}
      <section className="glass-bright rounded-xl p-10">
        <div className="mb-6 max-w-2xl">
          <h2 className="mb-3 text-2xl font-bold text-[var(--fg-bright)]">
            Ready to find your actuator?
          </h2>
          <p className="text-[var(--muted)]">
            Start a configuration in 30 seconds. Input your fluid properties and constraints. Get ranked results with physics-backed predictions.
          </p>
        </div>
        <Link
          href="/configure"
          className="btn-primary inline-flex items-center gap-2 rounded-lg px-7 py-3 font-[family-name:var(--font-mono)] text-sm font-semibold tracking-wide no-underline transition-all hover:shadow-lg"
        >
          Begin Configuration
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
