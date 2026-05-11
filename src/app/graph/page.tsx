import Link from "next/link";
import { headers } from "next/headers";
import { GRAPH_SEED, type GraphDensity } from "@/lib/graph-seed";
import { BetaBanner } from "@/components/BetaBanner";

// Fetched at request time so a fresh contribution is visible
// on the next page load without an explicit revalidation
// trigger. The endpoint itself is force-dynamic.
export const dynamic = "force-dynamic";

async function loadDensity(): Promise<GraphDensity> {
  try {
    const hdrs = await headers();
    const host = hdrs.get("host");
    const proto = hdrs.get("x-forwarded-proto") ?? "http";
    if (!host) return GRAPH_SEED;
    const res = await fetch(`${proto}://${host}/api/graph/density`, {
      cache: "no-store",
    });
    if (!res.ok) return GRAPH_SEED;
    return (await res.json()) as GraphDensity;
  } catch {
    return GRAPH_SEED;
  }
}

function Sparkline({
  data,
  width = 280,
  height = 64,
}: {
  data: number[];
  width?: number;
  height?: number;
}) {
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

export default async function GraphPage() {
  const GRAPH = await loadDensity();
  const catalogProgress6mo =
    (GRAPH.catalogActuators / GRAPH.catalogTarget6mo) * 100;
  const catalogProgress18mo =
    (GRAPH.catalogActuators / GRAPH.catalogTarget18mo) * 100;

  return (
    <div className="space-y-16 py-8">
      <BetaBanner />

      {/* Hero */}
      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            The asset · {GRAPH.live ? "live density" : "seeded baseline"}
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
              +{GRAPH.contributionsLast7d} last 7 days · +
              {GRAPH.contributionsLast30d} last 30 days
            </p>
          </div>
          <div className="md:justify-self-end">
            <p className="mb-2 text-[11px] font-medium text-[var(--muted)]">
              Density · last 12 weeks
            </p>
            <Sparkline data={GRAPH.densityHistory} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[
            {
              label: "Unvalidated pairs",
              value: GRAPH.unvalidatedPairs.toLocaleString(),
              sub: "awaiting first report",
            },
            {
              label: "Actuator SKUs",
              value: GRAPH.catalogActuators,
              sub: `target ${GRAPH.catalogTarget6mo} by month 6`,
            },
            {
              label: "Fluids cataloged",
              value: GRAPH.catalogFluids,
              sub: "growing weekly",
            },
            {
              label: "Active contributors",
              value: GRAPH.contributors,
              sub: "customers + partners",
            },
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
            From {GRAPH.catalogActuators} SKUs today to{" "}
            {GRAPH.catalogTarget18mo.toLocaleString()}+ in 18 months.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--fg-secondary)]">
            Catalog expansion via supplier partnerships (Spencer, Coster,
            Lindal, Aptar) and crowd-curated long-tail submissions.
            Density compounds with every new SKU and every new fluid.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              label: `Month 6 target · ${GRAPH.catalogTarget6mo} SKUs`,
              pct: catalogProgress6mo,
              cur: GRAPH.catalogActuators,
              target: GRAPH.catalogTarget6mo,
            },
            {
              label: `Month 18 target · ${GRAPH.catalogTarget18mo.toLocaleString()} SKUs`,
              pct: catalogProgress18mo,
              cur: GRAPH.catalogActuators,
              target: GRAPH.catalogTarget18mo,
            },
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
            {GRAPH.topFluids.map((f) => {
              const max = GRAPH.topFluids[0].validations;
              const pct = (f.validations / max) * 100;
              return (
                <div key={f.name} className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-[var(--fg)]">{f.name}</span>
                    <span className="text-[var(--muted)]">
                      {f.validations}{" "}
                      <span
                        className={
                          f.trend.startsWith("+")
                            ? "text-[var(--success)]"
                            : "text-[var(--muted)]"
                        }
                      >
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
            {GRAPH.topActuators.map((a) => {
              const max = GRAPH.topActuators[0].validations;
              const pct = (a.validations / max) * 100;
              return (
                <div key={a.sku} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <span className="font-mono font-semibold text-[var(--fg-bright)]">
                        {a.sku}
                      </span>
                      <span className="ml-2 text-[var(--fg-secondary)]">
                        {a.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-[var(--muted)]">
                      {a.validations}
                    </span>
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
            target{" "}
            <strong className="text-[var(--fg)]">85% by month 18</strong>{" "}
            with 5,000+ validated triples.
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
            {
              step: "1",
              title: "Configure",
              body:
                "User inputs fluid properties; configurator returns ranked actuator candidates with predicted spray physics.",
            },
            {
              step: "2",
              title: "Order sample",
              body:
                "User orders a sample through the marketplace. Order linked to the configuration ID — graph remembers what was tried.",
            },
            {
              step: "3",
              title: "Report outcome",
              body:
                "Post-test, user reports the actual cone angle, droplet size, clogging, material wear. One-click confirm or correct the prediction.",
            },
            {
              step: "4",
              title: "Triple validated",
              body:
                "The fluid → actuator → outcome triple lands in the graph. After three independent confirmations, the triple becomes community-validated.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5"
            >
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
        <Link
          href="/contact?topic=partners"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 no-underline transition-all hover:border-[var(--border-hover)]"
        >
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            For suppliers
          </p>
          <p className="mb-2 text-base font-semibold text-[var(--fg-bright)]">
            List your catalog →
          </p>
          <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
            Coster, Lindal, Aptar partnership inquiries.
          </p>
        </Link>
      </section>

      <section className="text-center">
        <p className="text-xs text-[var(--muted)]">
          {GRAPH.live
            ? GRAPH.augmented
              ? "Counters are seed baseline + live contributions (Sprint 2)."
              : "Sprint 2 contributions schema is live — waiting for the first submission to layer on top of the seed baseline."
            : "Density figures are seed-data baselines. Connect DATABASE_URL to enable live contribution counters."}{" "}
          See BUSINESS_STRATEGY.md §0 + §12.
        </p>
      </section>
    </div>
  );
}
