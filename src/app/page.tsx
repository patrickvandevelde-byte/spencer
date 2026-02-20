import Link from "next/link";
import { ACTUATORS, FLUIDS } from "@/lib/data";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="border border-[var(--border)] bg-[var(--surface)] p-8">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-[var(--muted)]">
          Phase 0 — Proof of Concept
        </p>
        <h1 className="mb-4 text-2xl font-bold leading-tight">
          Predictive Actuator
          <br />
          Configurator &amp; Procurement
        </h1>
        <p className="mb-6 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
          Input fluid properties and hardware constraints to instantly receive mechanically
          compatible, mathematically predicted actuator configurations — then seamlessly procure
          them for pilot testing or mass production.
        </p>
        <Link
          href="/configure"
          className="inline-block border border-[var(--accent)] bg-[var(--accent)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--bg)] no-underline hover:bg-transparent hover:text-[var(--accent)]"
        >
          Start Configuration &rarr;
        </Link>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { label: "Actuator Geometries", value: ACTUATORS.length },
          { label: "Newtonian Fluids", value: FLUIDS.length },
          { label: "Prediction Latency", value: "<50ms" },
        ].map((s) => (
          <div key={s.label} className="border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
            <p className="mb-1 text-3xl font-bold">{s.value}</p>
            <p className="text-[10px] uppercase tracking-widest text-[var(--muted)]">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Actuator Catalog */}
      <section>
        <h2 className="mb-4 text-xs uppercase tracking-widest text-[var(--muted)]">
          Actuator Catalog
        </h2>
        <div className="overflow-x-auto border border-[var(--border)]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--code-bg)] text-left text-[10px] uppercase tracking-widest text-[var(--muted)]">
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Orifice (mm)</th>
                <th className="px-4 py-2">Max Pressure</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {ACTUATORS.map((a) => (
                <tr key={a.id} className="border-b border-[var(--border)] hover:bg-[var(--code-bg)]">
                  <td className="px-4 py-2 font-bold">{a.sku}</td>
                  <td className="px-4 py-2">{a.name}</td>
                  <td className="px-4 py-2">{a.type.replace("_", " ")}</td>
                  <td className="px-4 py-2">{a.orificeDiameter_mm}</td>
                  <td className="px-4 py-2">{a.maxPressure_bar} bar</td>
                  <td className="px-4 py-2">${a.price_usd.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Fluid Reference */}
      <section>
        <h2 className="mb-4 text-xs uppercase tracking-widest text-[var(--muted)]">
          Fluid Reference Library
        </h2>
        <div className="overflow-x-auto border border-[var(--border)]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--code-bg)] text-left text-[10px] uppercase tracking-widest text-[var(--muted)]">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Viscosity (cP)</th>
                <th className="px-4 py-2">Density (kg/m³)</th>
                <th className="px-4 py-2">Surface Tension</th>
                <th className="px-4 py-2">Class</th>
              </tr>
            </thead>
            <tbody>
              {FLUIDS.map((f) => (
                <tr key={f.id} className="border-b border-[var(--border)] hover:bg-[var(--code-bg)]">
                  <td className="px-4 py-2 font-bold">{f.id}</td>
                  <td className="px-4 py-2">{f.name}</td>
                  <td className="px-4 py-2">{f.viscosity_cP}</td>
                  <td className="px-4 py-2">{f.density_kg_m3}</td>
                  <td className="px-4 py-2">{f.surfaceTension_mN_m} mN/m</td>
                  <td className="px-4 py-2">{f.solventClass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pipeline */}
      <section className="border border-[var(--border)] bg-[var(--surface)] p-8">
        <h2 className="mb-4 text-xs uppercase tracking-widest text-[var(--muted)]">
          Computational Pipeline
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            "MSDS / Fluid Input",
            "Property Extraction",
            "Graph DB Traversal",
            "ML Surrogate Prediction",
            "BOM / Config Export",
            "Procurement",
          ].map((step, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-[var(--muted)]">&rarr;</span>}
              <span className="border border-[var(--border)] bg-[var(--code-bg)] px-3 py-1">
                {step}
              </span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
