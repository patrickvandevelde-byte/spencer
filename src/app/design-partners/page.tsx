import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

export const metadata = {
  title: "Design Partners — AeroSpec",
  description:
    "AeroSpec's open-beta design-partner cohort: anonymous profiles, segment coverage, what we're learning, what comes next.",
};

// During open beta we publish anonymized profiles. Once partners
// grant naming consent (typically at their first case study), we
// replace the placeholder with the named logo here.
const SLOTS = [
  {
    code: "DP-01",
    segment: "Mid-market premium personal care",
    region: "US (Northeast)",
    headcount: "180–250",
    state: "Live · contributing weekly",
    focus: "Non-Newtonian serum compatibility, ADA actuation force",
    color: "var(--success)",
  },
  {
    code: "DP-02",
    segment: "Indie DTC haircare",
    region: "US (West Coast)",
    headcount: "30–60",
    state: "Onboarding · sample kit shipped",
    focus: "Sample-to-pilot continuity, multi-supplier orchestration",
    color: "var(--accent)",
  },
  {
    code: "DP-03",
    segment: "Regional aerosol CMO",
    region: "US (Midwest)",
    headcount: "200–300",
    state: "Live · 3 brand-account onboardings logged",
    focus: "Pre-meeting screening, CMO sample-qualification compression",
    color: "var(--success)",
  },
  {
    code: "DP-04",
    segment: "Mid-market beauty packaging",
    region: "EU (Western)",
    headcount: "3.5k–4.5k",
    state: "Pre-onboarding · NDA signed",
    focus: "Ergonomics dataset, PPWR compliance grading",
    color: "var(--accent)",
  },
  {
    code: "DP-05 (open)",
    segment: "Inhalation / nasal CDMO",
    region: "—",
    headcount: "—",
    state: "Recruiting · 1–2 slots open",
    focus: "21 CFR Part 11 validation, IQ/OQ/PQ co-authoring",
    color: "var(--muted)",
  },
  {
    code: "DP-06 (open)",
    segment: "Tier-1 CPG R&D (mid-market sub-business)",
    region: "—",
    headcount: "—",
    state: "Recruiting · 1 slot open",
    focus: "AVL whitelist + on-prem deployment validation",
    color: "var(--muted)",
  },
];

const LEARNINGS = [
  {
    title: "What we got right",
    bullets: [
      "AVL whitelist filter is the #1 retained feature across DP-01, DP-03, DP-04.",
      "Ergonomics + ADA force data is the surface that DP-04 told us no other tool surfaces — bringing it forward on the home page in Q3.",
      "CMO sample-kit orchestration (DP-03) saved 11 engineering hours on one brand account onboarding — the wedge holds.",
    ],
  },
  {
    title: "What we got wrong",
    bullets: [
      "Initially shipped the Spenser sub-brand. DP-04 reported confusion with 'AeroSpec'; we merged the brand in May 2026.",
      "Original SOC 2 timeline (Type II in Q3 2026) was unrealistic. DP-04's InfoSec team flagged it; we pushed to Q4 2026 / Q2 2027.",
      "Pre-validation pricing buried the procurement model. DP-03 procurement asked us to make the 2–4% take-rate explicit; now line-item on every PO.",
    ],
  },
];

export default function DesignPartnersPage() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            Open-beta design partners
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          The cohort that&rsquo;s shaping
          <br />
          <span className="gradient-text">the v1.0 release.</span>
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--fg-secondary)]">
          Six slots across four segments. Anonymized until each partner
          gives publishing consent. We&rsquo;d rather a clean list of real
          profiles than a logo wall pulled from a stock photo.
        </p>
      </section>

      {/* Slot grid */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SLOTS.map((s) => (
          <div
            key={s.code}
            className="rounded-2xl border bg-[var(--surface)] p-5"
            style={{ borderColor: `color-mix(in srgb, ${s.color} 30%, transparent)` }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span
                className="rounded-full bg-[var(--bg)] px-2 py-0.5 text-[10px] font-mono font-semibold"
                style={{ color: s.color }}
              >
                {s.code}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `color-mix(in srgb, ${s.color} 14%, transparent)`,
                  color: s.color,
                }}
              >
                {s.state.split(" ")[0]}
              </span>
            </div>
            <p className="mb-1 text-sm font-semibold text-[var(--fg-bright)]">
              {s.segment}
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              {s.region} &middot; {s.headcount} FTE
            </p>
            <p className="mt-3 text-[11px] leading-relaxed text-[var(--fg-secondary)]">
              <span className="text-[var(--muted)]">Focus:</span> {s.focus}
            </p>
            <p className="mt-2 text-[11px] text-[var(--fg-secondary)]">
              <span className="text-[var(--muted)]">State:</span> {s.state}
            </p>
          </div>
        ))}
      </section>

      {/* Learnings */}
      <section className="grid gap-4 md:grid-cols-2">
        {LEARNINGS.map((l) => (
          <div
            key={l.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <h3 className="mb-3 text-base font-semibold text-[var(--fg-bright)]">
              {l.title}
            </h3>
            <ul className="space-y-2">
              {l.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-xs leading-relaxed text-[var(--fg-secondary)]"
                >
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.04] p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-[var(--fg-bright)]">
          Two slots open. Both segment-specific.
        </h2>
        <p className="mx-auto mb-5 max-w-md text-sm text-[var(--fg-secondary)]">
          DP-05 (inhalation / nasal CDMO) and DP-06 (Tier-1 CPG R&amp;D
          sub-business). Free Pro / Pharma tier access, founder office hours,
          and a 20% lifetime discount locked at design-partner pricing.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact?topic=design-partner"
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white no-underline hover:opacity-90"
          >
            Apply for an open slot
          </Link>
          <Link
            href="/partners"
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Other partner tracks
          </Link>
        </div>
      </section>
    </div>
  );
}
