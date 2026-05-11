import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

export const metadata = {
  title: "About — AeroSpec",
  description:
    "AeroSpec is an open-beta fitment-graph platform for spray actuators and gas-free dispensing hardware. The team, the thesis, the roadmap.",
};

const TIMELINE = [
  {
    when: "Early 2026",
    title: "AeroSpec actuator configurator (v0.1)",
    body: "Spray-physics engine across 27 seeded actuators + 25 seeded fluids. Free, unmetered. The hypothesis: configurations are graph deposits, not the product itself.",
  },
  {
    when: "Q1 2026",
    title: "AeroSpec SFP (gas-free dispensing)",
    body: "Second hardware surface on the same fitment graph: formula viscosity → piston / spring / ITV. PPWR compliance grading + line CAPEX modelling.",
  },
  {
    when: "May 2026",
    title: "v1.2 moat thesis + Sprint 2 feedback flywheel",
    body: "Re-anchored on a TVH-shaped Configurator → Fitment Graph → Marketplace architecture. Shipped the contributions schema and the feedback widget — every prediction can now reflux a bench result into the graph.",
  },
  {
    when: "Q4 2026 (planned)",
    title: "SOC 2 Type I + first paying tenants",
    body: "Type I attestation, GA pricing live, first Indie / Starter / Pro tenants. Open-beta wraps; the figures on /graph stop being seed values and start being live density.",
  },
  {
    when: "Q1 2027 (planned)",
    title: "Validated environment + Pharma SaaS GA",
    body: "First validated tenant (inhalation / nasal CDMO design partner) goes live. IQ/OQ/PQ template published.",
  },
];

const PRINCIPLES = [
  {
    h: "The graph is the asset",
    body: "Predictions are an output of the graph, not the product we sell. Configurations are deposits into the graph. Every paywall on a configuration is a paywall on the moat — so we don't have one.",
  },
  {
    h: "Channel-conflict-free",
    body: "We do not insert a hidden margin on production POs. The 2–4% marketplace fee is a separate line item; suppliers retain their direct framework contracts.",
  },
  {
    h: "Honest about the timeline",
    body: "70% → 85% prediction accuracy over 18 months, not 6. Type II SOC 2 in Q2 2027, not Q3 2026. Pharma validation needs a design partner, not a marketing claim. We'd rather you trust the calendar than read the website.",
  },
  {
    h: "Open methodology",
    body: "The synthetic-user pass that drove our positioning is in the repo (SYNTHETIC_USER_VALIDATION.md). Every credibility-sensitive claim links to the methodology, not a press release.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            About AeroSpec
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          A fitment graph for spray.
          <br />
          <span className="gradient-text">Configurator on the front, marketplace on the back.</span>
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--fg-secondary)]">
          We&rsquo;re building the open-beta version of what TVH already did
          for industrial parts &mdash; a curated cross-reference graph that
          tells you exactly which actuator fits your fluid, with a
          marketplace to ship the part once it&rsquo;s validated.
        </p>
      </section>

      {/* Stats / facts */}
      <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {[
          { label: "Stage", value: "Open beta" },
          { label: "Pre-revenue since", value: "2026" },
          { label: "Validated triples", value: "247 (seed)" },
          { label: "Time to v1.2 thesis", value: "~4 months" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-[var(--bg-secondary)] p-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-[var(--fg-bright)]">
              {s.value}
            </p>
          </div>
        ))}
      </section>

      {/* Operating principles */}
      <section>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Operating principles
        </p>
        <h2 className="mb-5 text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
          Four commitments that shape the product
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div
              key={p.h}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <h3 className="mb-2 text-base font-semibold text-[var(--fg-bright)]">
                {p.h}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          The road so far &middot; and what&rsquo;s next
        </p>
        <h2 className="mb-5 text-xl font-semibold text-[var(--fg-bright)]">
          Timeline
        </h2>
        <ol className="space-y-4 border-l border-[var(--border)] pl-5">
          {TIMELINE.map((t) => (
            <li key={t.title} className="relative">
              <span
                className="absolute -left-[1.5rem] mt-1.5 inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                {t.when}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--fg-bright)]">
                {t.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--fg-secondary)]">
                {t.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Team — placeholder until we have permission to publish names */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Team
        </p>
        <h2 className="mb-4 text-xl font-semibold text-[var(--fg-bright)]">
          Small, focused, hiring slowly
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              role: "Founder &amp; engineering",
              about:
                "Builds the spray-physics engine and the fitment graph. Background: formulation R&D, then 12 years in adjacent SaaS platforms.",
            },
            {
              role: "Domain advisor (consultant)",
              about:
                "Ex-supplier R&D. Validates physics outputs and channel hygiene. Brought in to keep us honest about claims like 70 → 85% accuracy.",
            },
            {
              role: "Pharma advisor (consultant)",
              about:
                "Inhalation / nasal CDMO. Owns the IQ/OQ/PQ template scope and the 21 CFR Part 11 control mapping.",
            },
          ].map((m) => (
            <div
              key={m.role}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5"
            >
              <p
                className="mb-2 text-sm font-semibold text-[var(--fg-bright)]"
                dangerouslySetInnerHTML={{ __html: m.role }}
              />
              <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
                {m.about}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-[var(--muted)]">
          {/* TODO(launch): replace placeholders with named team after permission + photo set. */}
          Named team + photos publish at GA. Pre-launch we keep this page
          honest about scope rather than mining LinkedIn for credibility.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-[var(--fg-bright)]">
          Talk to us.
        </h2>
        <p className="mx-auto mb-4 max-w-md text-sm text-[var(--fg-secondary)]">
          We&rsquo;re responsive. Most evaluation conversations close in two
          calls; we&rsquo;d rather say &ldquo;not yet&rdquo; quickly than
          waste your quarter.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact?topic=sales"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white no-underline hover:opacity-90"
          >
            Get in touch
          </Link>
          <Link
            href="/design-partners"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Design-partner program
          </Link>
        </div>
      </section>
    </div>
  );
}
