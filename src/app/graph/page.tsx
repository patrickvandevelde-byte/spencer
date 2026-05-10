import Link from "next/link";

// Seed numbers reflect current state. Replace with live queries once
// the contributions schema is wired (Sprint 2).
const GRAPH = {
  validatedTriples: 247,
  unvalidatedPairs: 428,
  catalogActuators: 27,
  catalogFluids: 25,
  catalogTarget6mo: 200,
  catalogTarget18mo: 2000,
  contributors: 18,
  contributionsLast7d: 31,
  contributionsLast30d: 124,
  predictiveConsensusRate: 0.62, // % of recommendations w/ ≥3-source consensus
};

const TOP_FLUIDS = [
  { name: "Ethanol (anhydrous)", validations: 38, trend: "+4" },
  { name: "Isopropyl alcohol 70%", validations: 31, trend: "+2" },
  { name: "Deionized water", validations: 27, trend: "+3" },
  { name: "Propylene glycol", validations: 21, trend: "+1" },
  { name: "Glycerin (anhydrous)", validations: 18, trend: "+2" },
  { name: "Hexylene glycol", validations: 14, trend: "0" },
  { name: "Cyclomethicone D5", validations: 12, trend: "+1" },
  { name: "Acetone", validations: 11, trend: "0" },
];

const TOP_ACTUATORS = [
  { sku: "SP-MBU-018", name: "Mechanical Break-Up · 0.018″", validations: 29 },
  { sku: "SP-MBU-022", name: "Mechanical Break-Up · 0.022″", validations: 24 },
  { sku: "SP-FAN-035", name: "Flat Fan · 0.035″", validations: 21 },
  { sku: "SP-FOAM-040", name: "Foam Generator · 0.040″", validations: 18 },
  { sku: "SP-MIST-014", name: "Fine Mist · 0.014″", validations: 16 },
  { sku: "SP-CONE-028", name: "Hollow Cone · 0.028″", validations: 14 },
];

// Tiny inline sparkline — last 12 weeks of weekly graph density
const DENSITY_HISTORY = [142, 148, 156, 161, 169, 178, 185, 198, 209, 221, 234, 247];

function Sparkline({ data, width = 280, height = 64 }: { data: number[]; width?: number; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={i * step}
          cy={height - ((v - min) / range) * height}
          r={i === data.length - 1 ? 4 : 0}
          fill="var(--accent)"
        />
      ))}
    </svg>
  );
}

export default function GraphPage() {
  const catalogProgress6mo = (GRAPH.catalogActuators / GRAPH.catalogTarget6mo) * 100;
  const catalogProgress18mo = (GRAPH.catalogActuators / GRAPH.catalogTarget18mo) * 100;

  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            The asset · live density
          </span>
        </div>
        <h1 className="mb-5 text-5xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          The fitment graph for
          <br />
          <span className="gradient-text">spray actuators.</span>
        </h1>
        <p className="mx-auto max-w-lg text-lg leading-relaxed text-[var(--fg-secondary)]">
          A curated, growing cross-reference of fluid rheology → actuator
          geometry → spray outcome → material compatibility → regulatory
          flag. Every configuration deepens it. Every customer-reported
          bench result validates a triple.
        </p>
      </section>

      {/* Headline density counter */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              Validated triples
            </p>
            <p className="text-6xl font-semibold tracking-tight text-[var(--fg-bright)]">
              {GRAPH.validatedTriples.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-[var(--fg-secondary)]">
              +{GRAPH.contributionsLast7d} last 7 days · +{GRAPH.contributionsLast30d} last 30 days
            </p>
          </div>
          <div className="md:justify-self-end">
            <p className="mb-2 text-[11px] font-medium text-[var(--muted)]">
              Density · last 12 weeks
            </p>
            <Sparkline data={DENSITY_HISTORY} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[
            { label: "Unvalidated pairs", value: GRAPH.unvalidatedPairs.toLocaleString(), sub: "awaiting first report" },
            { label: "Actuator SKUs", value: GRAPH.catalogActuators, sub: `target 200 by month 6` },
            { label: "Fluids cataloged", value: GRAPH.catalogFluids, sub: "growing weekly" },
            { label: "Active contributors", value: GRAPH.contributors, sub: "customers + partners" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-[var(--bg-secondary)] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {s.label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-[var(--fg-bright)]">
                {s.value}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--fg-secondary)]">
                {s.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog growth progress */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <div className="mb-6">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
            Catalog depth
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
            From 27 SKUs today to 2,000+ in 18 months.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--fg-secondary)]">
            Catalog expansion via supplier partnerships (Spencer, Coster,
            Lindal, Aptar) and crowd-curated long-tail submissions.
            Density compounds with every new SKU and every new fluid.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { label: "Month 6 target · 200 SKUs", pct: catalogProgress6mo, cur: GRAPH.catalogActuators, target: GRAPH.catalogTarget6mo },
            { label: "Month 18 target · 2,000 SKUs", pct: catalogProgress18mo, cur: GRAPH.catalogActuators, target: GRAPH.catalogTarget18mo },
          ].map((row) => (
            <div key={row.label}>
              <div className="mb-1.5 flex items-baseline justify-between text-xs">
                <span className="font-medium text-[var(--fg)]">{row.label}</span>
                <span className="text-[var(--muted)]">
                  {row.cur} / {row.target.toLocaleString()} ({row.pct.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-all"
                  style={{ width: `${Math.max(row.pct, 0.5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top fluids + actuators by validation count */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
            Top fluids by validations
          </p>
          <h3 className="mb-4 text-lg font-semibold text-[var(--fg-bright)]">
            Most-tested fluids
          </h3>
          <div className="space-y-2">
            {TOP_FLUIDS.map((f) => {
              const max = TOP_FLUIDS[0].validations;
              const pct = (f.validations / max) * 100;
              return (
                <div key={f.name} className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-[var(--fg)]">{f.name}</span>
                    <span className="text-[var(--muted)]">
                      {f.validations}{" "}
                      <span className={f.trend.startsWith("+") ? "text-[var(--success)]" : "text-[var(--muted)]"}>
                        {f.trend !== "0" ? f.trend : ""}
                      </span>
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-secondary)]">
            Top actuators by validations
          </p>
          <h3 className="mb-4 text-lg font-semibold text-[var(--fg-bright)]">
            Most-validated SKUs
          </h3>
          <div className="space-y-3">
            {TOP_ACTUATORS.map((a) => {
              const max = TOP_ACTUATORS[0].validations;
              const pct = (a.validations / max) * 100;
              return (
                <div key={a.sku} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <span className="font-mono font-semibold text-[var(--fg-bright)]">{a.sku}</span>
                      <span className="ml-2 text-[var(--fg-secondary)]">{a.name}</span>
                    </div>
                    <span className="shrink-0 text-[var(--muted)]">{a.validations}</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent-secondary)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Predictive consensus */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              Predictive confidence
            </p>
            <p className="text-5xl font-semibold tracking-tight text-[var(--fg-bright)]">
              {(GRAPH.predictiveConsensusRate * 100).toFixed(0)}%
            </p>
            <p className="mt-1 text-xs text-[var(--fg-secondary)]">
              of recommendations have ≥3-source consensus
            </p>
          </div>
          <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
            Predictive accuracy is a downstream consequence of graph
            density. As density grows, more recommendations are backed by
            multiple independent customer-reported outcomes. Today: 62%
            three-source consensus on common fluid classes; rising to a
            target <strong className="text-[var(--fg)]">85% by month 18</strong> with 5,000+
            validated triples.
          </p>
        </div>
      </section>

      {/* The flywheel — how the graph grows */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          The flywheel
        </p>
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
          How a single configuration deepens the graph.
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { step: "1", title: "Configure", body: "User inputs fluid properties; configurator returns ranked actuator candidates with predicted spray physics." },
            { step: "2", title: "Order sample", body: "User orders a sample through the marketplace. Order linked to the configuration ID — graph remembers what was tried." },
            { step: "3", title: "Report outcome", body: "Post-test, user reports the actual cone angle, droplet size, clogging, material wear. One-click confirm or correct the prediction." },
            { step: "4", title: "Triple validated", body: "The fluid → actuator → outcome triple lands in the graph. After three independent confirmations, the triple becomes community-validated." },
          ].map((s) => (
            <div key={s.step} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
              <p className="mb-2 text-3xl font-semibold text-[var(--accent)]">
                {s.step}
              </p>
              <p className="mb-2 text-sm font-semibold text-[var(--fg-bright)]">
                {s.title}
              </p>
              <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/configure"
          className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/[0.04] p-6 no-underline transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/[0.08]"
        >
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
            Contribute
          </p>
          <p className="mb-2 text-base font-semibold text-[var(--fg-bright)]">
            Run a configuration →
          </p>
          <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
            Every session is a deposit. Free, unmetered, forever.
          </p>
        </Link>
        <Link
          href="/pricing"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 no-underline transition-all hover:border-[var(--border-hover)]"
        >
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Read access
          </p>
          <p className="mb-2 text-base font-semibold text-[var(--fg-bright)]">
            Graph access tiers →
          </p>
          <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
            Community / validated / supplier-qualified / private. Free →
            Enterprise.
          </p>
        </Link>
        <a
          href="mailto:partners@aerospec.example"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 no-underline transition-all hover:border-[var(--border-hover)]"
        >
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            For suppliers
          </p>
          <p className="mb-2 text-base font-semibold text-[var(--fg-bright)]">
            List your catalog →
          </p>
          <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
            Spencer, Coster, Lindal, Aptar partnership inquiries.
          </p>
        </a>
      </section>

      <section className="text-center">
        <p className="text-xs text-[var(--muted)]">
          Density figures are seed-data baselines (Sprint 1). Live graph
          queries ship with the contributions schema in Sprint 2. See
          BUSINESS_STRATEGY.md §0 + §12.
        </p>
      </section>
    </div>
  );
}
