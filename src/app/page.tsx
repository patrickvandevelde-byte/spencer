import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-20 py-8">
      {/* Hero — three-pillar framing */}
      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            The fitment graph for spray actuators
          </span>
        </div>

        <h1 className="mb-5 text-5xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Configure. Find the fit.
          <br />
          <span className="gradient-text">Order the parts.</span>
        </h1>

        <p className="mx-auto max-w-lg text-lg leading-relaxed text-[var(--fg-secondary)]">
          A free spray-physics configurator on top of a proprietary
          fluid-to-actuator fitment graph. The graph tells you which
          actuator fits your fluid &mdash; the marketplace ships you the part.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/configure"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white no-underline transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Configure (free)
            <span className="text-xs opacity-80">&rarr;</span>
          </Link>
          <Link
            href="/graph"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] no-underline transition-all hover:border-[var(--border-hover)]"
          >
            See the graph
            <span className="text-xs opacity-60">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Three pillars */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            tag: "01 · Funnel",
            title: "Configurator",
            body: "Spray-physics calculator across 27+ actuators and 25+ fluids. Free and unmetered — every session is a deposit into the graph.",
            href: "/configure",
            cta: "Run a configuration",
            accent: "var(--accent)",
          },
          {
            tag: "02 · Moat",
            title: "Fitment Graph",
            body: "247 validated fluid-actuator-outcome triples and growing. The proprietary asset that makes recommendations defensible.",
            href: "/graph",
            cta: "View live density",
            accent: "var(--accent)",
          },
          {
            tag: "03 · Revenue",
            title: "Parts Marketplace",
            body: "One-click sample orders (10–15% take baked into list). Production POs at a transparent 2–4% marketplace fee, line-item disclosed.",
            href: "/procurement",
            cta: "Browse the catalog",
            accent: "var(--accent-secondary)",
          },
        ].map((p) => (
          <Link
            key={p.tag}
            href={p.href}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 no-underline transition-all hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-sm)]"
          >
            <p
              className="mb-2 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: p.accent }}
            >
              {p.tag}
            </p>
            <h3 className="mb-2 text-xl font-semibold text-[var(--fg-bright)]">
              {p.title}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-[var(--fg-secondary)]">
              {p.body}
            </p>
            <p
              className="text-xs font-medium"
              style={{ color: p.accent }}
            >
              {p.cta} &rarr;
            </p>
          </Link>
        ))}
      </section>

      {/* Other graphs — Spenser SFP de-emphasized to a sub-card */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Other graphs · same infrastructure
            </p>
            <h3 className="mb-1 text-base font-semibold text-[var(--fg-bright)]">
              Spenser SFP — gas-free dispensing fitment
            </h3>
            <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
              A second fitment graph on the same schema: formula viscosity &rarr;
              piston / spring / ITV hardware. PPWR compliance grading and
              line-CAPEX modelling. Useful if you&rsquo;re moving away from
              compressed-gas aerosol formats.
            </p>
          </div>
          <Link
            href="/spenser"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--accent-secondary)]/30 bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--accent-secondary)] no-underline transition-all hover:bg-[var(--accent-secondary)]/8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-secondary)]" />
            Open Spenser SFP
            <span className="text-[10px] opacity-60">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
