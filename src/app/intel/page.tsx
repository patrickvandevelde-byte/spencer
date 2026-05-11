import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";
import {
  SUPPLIER_SIGNALS,
  MATERIAL_ALERTS,
  RISK_COLOR,
  RISK_LABEL,
} from "@/lib/supplier-intel";

export const metadata = {
  title: "Supplier Intelligence — AeroSpec",
  description:
    "Capacity utilization, lead-time trend, geopolitical and raw-material risk per actuator manufacturer.",
};

function RiskPill({ band }: { band: keyof typeof RISK_COLOR }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{
        backgroundColor: `color-mix(in srgb, ${RISK_COLOR[band]} 14%, transparent)`,
        color: RISK_COLOR[band],
      }}
    >
      {RISK_LABEL[band]}
    </span>
  );
}

function CapacityBar({ pct }: { pct: number }) {
  const color = pct > 90 ? "var(--danger)" : pct > 80 ? "var(--warning)" : "var(--success)";
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between text-[11px]">
        <span className="text-[var(--muted)]">Capacity</span>
        <span className="tabular-nums font-semibold" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function TrendArrow({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "flat")
    return <span className="text-[var(--muted)]">→</span>;
  if (trend === "up")
    return <span className="text-[var(--warning)]">↑</span>;
  return <span className="text-[var(--success)]">↓</span>;
}

export default function IntelPage() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            Supplier Intelligence
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Sourcing teams want
          <br />
          <span className="gradient-text">supplier intel</span>, not just spray data.
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--fg-secondary)]">
          Capacity utilization, lead-time trend, geopolitical risk, and
          raw-material movement per manufacturer. Persona P6 (&ldquo;Spray
          physics is interesting; supplier intelligence is the budget line&rdquo;)
          told us this is the buy.
        </p>
      </section>

      {/* Supplier signal table */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              Supplier signals
            </p>
            <h2 className="text-lg font-semibold text-[var(--fg-bright)]">
              Capacity &amp; risk &mdash; {SUPPLIER_SIGNALS.length} manufacturers tracked
            </h2>
          </div>
          <p className="text-[11px] text-[var(--muted)]">
            Updated weekly &middot; last refresh{" "}
            {SUPPLIER_SIGNALS[0].lastUpdated}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {SUPPLIER_SIGNALS.map((s) => (
            <div
              key={s.manufacturer}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--fg-bright)]">
                    {s.manufacturer}
                  </p>
                  <p className="text-[11px] text-[var(--muted)]">{s.region}</p>
                </div>
                <span
                  className="rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    color:
                      s.esgGrade === "A"
                        ? "var(--success)"
                        : s.esgGrade === "B"
                          ? "var(--accent)"
                          : "var(--warning)",
                  }}
                >
                  ESG {s.esgGrade}
                </span>
              </div>

              <div className="mb-3">
                <CapacityBar pct={s.capacityUtilizationPct} />
              </div>

              <div className="mb-3 grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="text-[var(--muted)]">Lead time</p>
                  <p className="font-semibold text-[var(--fg-bright)]">
                    {s.leadTimeWeeks}w <TrendArrow trend={s.leadTimeTrend} />
                  </p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Geopolitical</p>
                  <p>
                    <RiskPill band={s.geopoliticalRisk} />
                  </p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Raw materials</p>
                  <p>
                    <RiskPill band={s.rawMaterialRisk} />
                  </p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Updated</p>
                  <p className="text-[var(--fg-secondary)]">{s.lastUpdated}</p>
                </div>
              </div>

              <p className="rounded-md bg-[var(--bg-secondary)] px-3 py-2 text-[11px] leading-relaxed text-[var(--fg-secondary)]">
                {s.notes}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Material alerts */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Raw-material alerts
        </p>
        <h2 className="mb-4 text-lg font-semibold text-[var(--fg-bright)]">
          What&rsquo;s moving the BOM this month
        </h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Material
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Risk band
                </th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Movement (30d)
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Driver
                </th>
              </tr>
            </thead>
            <tbody>
              {MATERIAL_ALERTS.map((m) => (
                <tr
                  key={m.material}
                  className="border-t border-[var(--border)]"
                >
                  <td className="px-4 py-3 text-sm font-medium text-[var(--fg-bright)]">
                    {m.material}
                  </td>
                  <td className="px-4 py-3">
                    <RiskPill band={m.status} />
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span
                      className={
                        m.movementPct < 0
                          ? "text-[var(--success)]"
                          : m.movementPct > 4
                            ? "text-[var(--warning)]"
                            : "text-[var(--fg-bright)]"
                      }
                    >
                      {m.movementPct > 0 ? "+" : ""}
                      {m.movementPct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] leading-relaxed text-[var(--fg-secondary)]">
                    {m.driver}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Methodology
        </p>
        <h2 className="mb-3 text-base font-semibold text-[var(--fg-bright)]">
          Where the numbers come from
        </h2>
        <ul className="space-y-2 text-sm leading-relaxed text-[var(--fg-secondary)]">
          <li>
            <strong className="text-[var(--fg-bright)]">Capacity:</strong>{" "}
            blended estimate of stated quarterly output (10-K / annual
            reports for public manufacturers) and our own placed-order /
            quoted-lead-time observations across the marketplace.
          </li>
          <li>
            <strong className="text-[var(--fg-bright)]">Lead time:</strong>{" "}
            rolling 28-day median of supplier-quoted ship dates on
            marketplace POs, weighted by SKU volume.
          </li>
          <li>
            <strong className="text-[var(--fg-bright)]">
              Geopolitical risk:
            </strong>{" "}
            country-of-operations risk score from{" "}
            <a
              href="https://www.controlrisks.com"
              className="text-[var(--accent)] no-underline hover:underline"
            >
              Control Risks
            </a>{" "}
            (public band only) +{" "}
            <a
              href="https://www.imf.org/external/research/index.htm"
              className="text-[var(--accent)] no-underline hover:underline"
            >
              IMF
            </a>{" "}
            macro indicators.
          </li>
          <li>
            <strong className="text-[var(--fg-bright)]">Raw material:</strong>{" "}
            LME / NYMEX commodity ticks pinned to BOM-weighted material
            mix.
          </li>
          <li>
            <strong className="text-[var(--fg-bright)]">ESG grade:</strong>{" "}
            CDP-disclosed score normalised to A/B/C; refreshed quarterly
            with supplier-published filings.
          </li>
        </ul>
        <p className="mt-3 text-[11px] text-[var(--muted)]">
          Source feeds and refresh cadence visible per row at GA. Pre-GA
          figures shown here are seeded representative values &mdash; the
          surface and the scoring methodology are the deliverable; the
          live feed lands with the SOC 2 Type I milestone.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <p className="mb-3 text-sm text-[var(--fg-bright)]">
          Want a custom risk dashboard for your AVL?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact?topic=enterprise"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white no-underline hover:opacity-90"
          >
            Talk to Sales
          </Link>
          <Link
            href="/settings/avl"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Configure your AVL
          </Link>
        </div>
      </section>
    </div>
  );
}
