"use client";

import { useState } from "react";
import Link from "next/link";
import { ACTUATORS, FLUIDS, INDUSTRY_LABELS, SOLVENT_CLASS_LABELS, PRODUCT_CATEGORY_LABELS } from "@/lib/data";
import type { Industry, SolventClass, Manufacturer } from "@/lib/data";
import { ActuatorIllustration, SprayPatternIllustration, ACTUATOR_COLORS } from "@/components/ActuatorIllustrations";

const ALL_INDUSTRIES = Object.keys(INDUSTRY_LABELS) as Industry[];
const ALL_SOLVENT_CLASSES = Object.keys(SOLVENT_CLASS_LABELS) as SolventClass[];

export default function CatalogPage() {
  const [industryFilter, setIndustryFilter] = useState<Industry | "all">("all");
  const [solventFilter, setSolventFilter] = useState<SolventClass | "all">("all");
  const [mfrFilter, setMfrFilter] = useState<Manufacturer | "all">("all");
  const [search, setSearch] = useState("");

  const filteredActuators = ACTUATORS.filter(
    (a) =>
      (industryFilter === "all" || a.industries.includes(industryFilter)) &&
      (mfrFilter === "all" || a.manufacturer === mfrFilter) &&
      (search === "" || a.name.toLowerCase().includes(search.toLowerCase()) || a.sku.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()))
  );
  const filteredFluids = FLUIDS.filter(
    (f) =>
      (solventFilter === "all" || f.solventClass === solventFilter) &&
      (search === "" || f.name.toLowerCase().includes(search.toLowerCase()) || f.category.toLowerCase().includes(search.toLowerCase()))
  );

  const nonNewtonianCount = FLUIDS.filter((f) => f.rheology !== "newtonian").length;

  return (
    <div className="space-y-16">
      {/* Header */}
      <section>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-bright)] bg-[var(--surface)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[var(--accent)]">
            AEROSPEC CATALOG
          </span>
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-[var(--fg-bright)]">
          Actuator &amp; Fluid Library
        </h1>
        <p className="mb-2 max-w-2xl text-[var(--fg)]">
          Browse the full hardware and fluid database. Click any actuator or fluid to start a configuration.
        </p>
        <p className="max-w-2xl text-sm text-[var(--muted)]">
          Newtonian + Non-Newtonian fluids &middot; Dv10/Dv50/Dv90 droplet distribution &middot; Material compatibility &middot; Clogging risk
        </p>
      </section>

      {/* Key Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "Actuators", value: ACTUATORS.length },
          { label: "Fluids", value: FLUIDS.length },
          { label: "Non-Newtonian", value: nonNewtonianCount },
          { label: "Industries", value: ALL_INDUSTRIES.length },
          { label: "Solvent Classes", value: ALL_SOLVENT_CLASSES.length },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-[var(--fg-bright)]">{s.value}</p>
            <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--muted)]">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Search Bar */}
      <section>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search actuators, fluids, SKUs, materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full rounded-xl py-4 pl-12 pr-6 font-[family-name:var(--font-mono)] text-sm"
          />
        </div>
      </section>

      {/* Actuator Catalog */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-[var(--fg-bright)]">Actuator Catalog</h2>
            <p className="text-[var(--muted)]">
              {filteredActuators.length} of {ACTUATORS.length} actuators &mdash; click any card to configure
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
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
            <span className="mx-2 border-l border-[var(--border)]" />
            <button
              onClick={() => setIndustryFilter("all")}
              className={`rounded-lg border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
                industryFilter === "all"
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
              }`}
            >
              All Industries
            </button>
            {ALL_INDUSTRIES.map((ind) => {
              const count = ACTUATORS.filter((a) => a.industries.includes(ind)).length;
              if (count === 0) return null;
              return (
                <button key={ind} onClick={() => setIndustryFilter(ind)}
                  className={`rounded-lg border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
                    industryFilter === ind ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  {INDUSTRY_LABELS[ind]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredActuators.map((a) => {
            const color = ACTUATOR_COLORS[a.type] || "#06b6d4";
            return (
              <Link
                key={a.id}
                href={`/configure?actuator=${a.id}`}
                className="glass group rounded-xl p-6 transition-all hover:border-[var(--border-bright)] hover:shadow-[var(--glow)] no-underline block"
              >
                <div className="mb-4 flex items-center justify-between">
                  <ActuatorIllustration type={a.type} size={70} />
                  <SprayPatternIllustration type={a.type} size={44} />
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider" style={{ color }}>{a.sku}</span>
                  <span className={`rounded-md border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[8px] font-bold uppercase tracking-wider ${a.manufacturer === "Coster" ? "border-[#ec4899]/30 text-[#ec4899]" : "border-[#06b6d4]/30 text-[#06b6d4]"}`}>
                    {a.manufacturer}
                  </span>
                </div>

                <h3 className="mb-1 text-sm font-semibold text-[var(--fg-bright)]">{a.name}</h3>
                <p className="mb-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--muted)]">
                  {PRODUCT_CATEGORY_LABELS[a.productCategory]} &middot; {a.technicalDesign.bodyMaterial}
                </p>

                <div className="mt-3 space-y-1.5 text-[11px]">
                  <div className="flex justify-between"><span className="text-[var(--muted)]">Orifice</span><span className="font-semibold">{a.orificeDiameter_mm} mm</span></div>
                  <div className="flex justify-between"><span className="text-[var(--muted)]">Max Pressure</span><span className="font-semibold">{a.maxPressure_bar} bar</span></div>
                  <div className="flex justify-between"><span className="text-[var(--muted)]">Price</span><span className="font-semibold">${a.price_usd.toFixed(2)}</span></div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {a.materialCompatibility.slice(0, 3).map((mat) => (
                    <span key={mat} className="rounded-md border border-[var(--border)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-wider text-[var(--muted)]">{mat}</span>
                  ))}
                  {a.materialCompatibility.length > 3 && (
                    <span className="text-[var(--muted)] text-[8px]">+{a.materialCompatibility.length - 3}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Fluid Library */}
      <section className="space-y-6">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-[var(--fg-bright)]">Fluid Library</h2>
          <p className="text-[var(--muted)]">
            {FLUIDS.length} fluids ({nonNewtonianCount} non-Newtonian) &mdash; click a row to configure with that fluid
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSolventFilter("all")}
            className={`rounded-lg border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${solventFilter === "all" ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"}`}>
            All ({FLUIDS.length})
          </button>
          {ALL_SOLVENT_CLASSES.map((sc) => {
            const count = FLUIDS.filter((f) => f.solventClass === sc).length;
            if (count === 0) return null;
            return (
              <button key={sc} onClick={() => setSolventFilter(sc)}
                className={`rounded-lg border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${solventFilter === sc ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"}`}>
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
                  <th className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Name</th>
                  <th className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Viscosity</th>
                  <th className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Density</th>
                  <th className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Tension</th>
                  <th className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Rheology</th>
                  <th className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Class</th>
                  <th className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Hazards</th>
                </tr>
              </thead>
              <tbody>
                {filteredFluids.map((f) => (
                  <Link key={f.id} href={`/configure?fluid=${f.id}`} className="table-row-hover border-b border-[var(--border)] last:border-b-0 no-underline cursor-pointer" style={{ display: "table-row" }}>
                    <td className="px-4 py-3 text-[var(--fg-bright)] font-semibold">{f.name}</td>
                    <td className="px-4 py-3 font-[family-name:var(--font-mono)]">{f.viscosity_cP} cP</td>
                    <td className="px-4 py-3 font-[family-name:var(--font-mono)]">{f.density_kg_m3}</td>
                    <td className="px-4 py-3 font-[family-name:var(--font-mono)]">{f.surfaceTension_mN_m}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-md border px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider ${f.rheology !== "newtonian" ? "border-[var(--accent)]/40 text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)]"}`}>
                        {f.rheology.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md border border-[var(--border)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--muted)]">
                        {f.solventClass}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {f.hazards.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {f.hazards.slice(0, 2).map((h) => (
                            <span key={h} className="rounded-md border border-[var(--danger)]/30 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[8px] text-[var(--danger)]">{h}</span>
                          ))}
                          {f.hazards.length > 2 && <span className="text-[var(--danger)] text-[8px]">+{f.hazards.length - 2}</span>}
                        </div>
                      ) : <span className="text-[var(--muted)]">&mdash;</span>}
                    </td>
                  </Link>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="glass-bright rounded-xl p-10">
        <h2 className="mb-3 text-2xl font-bold text-[var(--fg-bright)]">
          Ready to configure?
        </h2>
        <p className="mb-6 text-[var(--muted)]">
          Select from the library or enter custom fluid properties. The engine handles Newtonian and non-Newtonian fluids, particle suspensions, and material compatibility analysis.
        </p>
        <Link
          href="/configure"
          className="btn-primary inline-flex items-center gap-2 rounded-lg px-7 py-3 font-[family-name:var(--font-mono)] text-sm font-semibold tracking-wide no-underline"
        >
          Open Configurator
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </section>
    </div>
  );
}
