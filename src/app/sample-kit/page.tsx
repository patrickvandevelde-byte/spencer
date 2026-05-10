import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

export const metadata = {
  title: "Sample Qualification Kit — AeroSpec",
  description:
    "One sample order, multiple suppliers, one tracking dashboard, one curated bench-test protocol — built for indie DTC brands and CMOs onboarding new accounts.",
};

const KITS = [
  {
    name: "Starter Qualification",
    target: "Indie DTC · early formulation",
    sampleCount: 4,
    suppliers: 2,
    leadTime: "5–7 business days",
    price: "$249",
    includes: [
      "4 actuators across 2 suppliers",
      "Top-3 ranked candidates from your last configuration",
      "Wildcard pick (algorithmic 4th best)",
      "Bench-test protocol PDF (cone angle, Dv50 method, clogging test)",
      "Guaranteed ship-by date or 50% refund",
      "Result-upload to graph rewards $50 credit",
    ],
    cta: { label: "Build Starter Kit", href: "/configure?intent=sample-kit-starter" },
    accent: "var(--accent)",
  },
  {
    name: "CMO Account Onboarding",
    target: "CMOs qualifying new brand accounts",
    sampleCount: 12,
    suppliers: 4,
    leadTime: "10–14 business days",
    price: "$1,490",
    badge: "Most Popular",
    includes: [
      "12 actuators across 4 suppliers (multi-vendor parallel)",
      "Side-by-side bench-test protocol (Brenda-class workflow)",
      "Pre-shipment QA: visual + dimensional check per SKU",
      "Single tracking dashboard across all 4 vendors",
      "Two ship-to addresses (lab + plant)",
      "Guaranteed 14-day delivery or full kit refund",
      "BOM cost breakdown + Net-30 invoicing available",
    ],
    cta: { label: "Build Onboarding Kit", href: "/configure?intent=sample-kit-cmo" },
    accent: "var(--accent)",
    featured: true,
  },
  {
    name: "Pilot Bridge",
    target: "Brands moving from qualification to 5-25k pilot run",
    sampleCount: 100,
    suppliers: 1,
    leadTime: "3–4 weeks",
    price: "From $1,200",
    includes: [
      "100 actuators from your selected supplier",
      "Same SKU as the qualified sample (no surprises in pilot)",
      "Sample-to-pilot price guarantee: per-unit cost +0% from sample order",
      "Conditional 14-day-delivery guarantee",
      "Pilot-run telemetry: clog/leak/spray-pattern rejection rate",
      "Auto-upgrade to production POs at 5k units cumulative",
    ],
    cta: { label: "Bridge to Pilot", href: "/contact?topic=sales" },
    accent: "var(--accent)",
  },
];

const GUARANTEES = [
  {
    title: "Guaranteed delivery window",
    body: "Every kit ships in the stated window or you get 50% (Starter / Pilot) / 100% (CMO) of the kit price refunded. No fine print.",
  },
  {
    title: "Curated multi-supplier orchestration",
    body: "One PO from you, multiple supplier orders from us, one consolidated tracking dashboard. Solves Persona P9's '4–6 suppliers, 6+ weeks' pain.",
  },
  {
    title: "Pre-shipment quality check",
    body: "Visual + dimensional QA before the package leaves us. Persona P5 (indie DTC): 'scary samples' becomes 'samples we trust'.",
  },
  {
    title: "Bench-test protocol included",
    body: "PDF protocol per kit: how to test cone angle, droplet distribution, clogging risk, ergonomics — using your existing lab equipment.",
  },
  {
    title: "Result-upload reward",
    body: "Upload bench results back to AeroSpec and earn a credit toward your next kit. Validated triples are how the graph grows.",
  },
  {
    title: "Sample-to-pilot continuity",
    body: "If the qualified SKU works, the pilot order ships the same physical part — no second qualification cycle.",
  },
];

const TIMELINE = [
  {
    step: "1",
    title: "Run a configuration",
    body: "Get a ranked actuator list from /configure with your fluid + AVL filter applied.",
    cta: { label: "Configure now", href: "/configure" },
  },
  {
    step: "2",
    title: "Pick a kit size",
    body: "Starter (4 actuators), CMO Onboarding (12), or Pilot Bridge (100) — based on where you are in the funnel.",
  },
  {
    step: "3",
    title: "We orchestrate",
    body: "One PO from you. We place sub-orders with suppliers, run pre-shipment QA, and consolidate into one shipment.",
  },
  {
    step: "4",
    title: "Bench-test + report",
    body: "Use the bundled protocol. Upload results to the graph for a credit. Move the qualified SKU into a pilot order with continuity.",
  },
];

export default function SampleKitPage() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            Sample-to-Pilot Path
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          One PO. Multiple suppliers.
          <br />
          <span className="gradient-text">Guaranteed delivery.</span>
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--fg-secondary)]">
          Persona P5 (indie DTC) and P9 (regional CMO) said it most clearly:
          they need a curated sample-to-pilot path. This is that path &mdash;
          orchestration on our side, single dashboard on yours, guaranteed
          ship dates with refund teeth.
        </p>
      </section>

      {/* Kit tiers */}
      <section className="grid gap-5 lg:grid-cols-3">
        {KITS.map((k) => (
          <div
            key={k.name}
            className={`relative flex flex-col rounded-2xl border bg-[var(--surface)] p-7 transition-all ${
              k.featured
                ? "border-[var(--accent)]/40 shadow-[var(--shadow-lg)]"
                : "border-[var(--border)] hover:border-[var(--border-hover)]"
            }`}
          >
            {k.badge && (
              <span className="absolute -top-3 left-7 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                {k.badge}
              </span>
            )}
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: k.accent }}
            >
              {k.name}
            </p>
            <p className="mb-4 text-sm text-[var(--fg-secondary)]">{k.target}</p>
            <div className="mb-3 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-[var(--fg-bright)]">
                {k.price}
              </span>
              <span className="text-xs text-[var(--muted)]">
                /kit · {k.leadTime}
              </span>
            </div>
            <div className="mb-5 grid grid-cols-2 gap-3 rounded-lg bg-[var(--bg-secondary)] p-3 text-[11px]">
              <div>
                <p className="text-[var(--muted)]">Actuators</p>
                <p className="font-semibold text-[var(--fg-bright)]">
                  {k.sampleCount}
                </p>
              </div>
              <div>
                <p className="text-[var(--muted)]">Suppliers</p>
                <p className="font-semibold text-[var(--fg-bright)]">
                  {k.suppliers}
                </p>
              </div>
            </div>
            <ul className="mb-6 space-y-2">
              {k.includes.map((i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-[var(--fg-secondary)]"
                >
                  <span
                    className="mt-1 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: k.accent }}
                  />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <Link
              href={k.cta.href}
              className="mt-auto flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium no-underline transition-all hover:opacity-90"
              style={{
                backgroundColor: k.featured
                  ? "var(--accent)"
                  : "var(--bg-secondary)",
                color: k.featured ? "white" : "var(--fg)",
              }}
            >
              {k.cta.label}
            </Link>
          </div>
        ))}
      </section>

      {/* Guarantees */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Six guarantees
        </p>
        <h2 className="mb-5 text-xl font-semibold tracking-tight text-[var(--fg-bright)]">
          Why a kit isn&rsquo;t just an order
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GUARANTEES.map((g) => (
            <div
              key={g.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5"
            >
              <p className="mb-2 text-sm font-semibold text-[var(--fg-bright)]">
                {g.title}
              </p>
              <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
                {g.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          How it works
        </p>
        <h2 className="mb-5 text-xl font-semibold text-[var(--fg-bright)]">
          Four steps, one tracking dashboard
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          {TIMELINE.map((t) => (
            <div
              key={t.step}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5"
            >
              <p className="mb-2 text-3xl font-semibold text-[var(--accent)]">
                {t.step}
              </p>
              <p className="mb-2 text-sm font-semibold text-[var(--fg-bright)]">
                {t.title}
              </p>
              <p className="mb-3 text-xs leading-relaxed text-[var(--fg-secondary)]">
                {t.body}
              </p>
              {t.cta && (
                <Link
                  href={t.cta.href}
                  className="text-[11px] font-medium text-[var(--accent)] no-underline hover:underline"
                >
                  {t.cta.label} &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="text-center">
        <p className="text-xs text-[var(--muted)]">
          Sample marketplace margin is 10&ndash;15% baked into kit price &mdash;
          disclosed at line item.{" "}
          <Link
            href="/pricing"
            className="text-[var(--accent)] no-underline hover:underline"
          >
            See pricing
          </Link>{" "}
          for production-volume terms (2&ndash;4% transparent take).
        </p>
      </section>
    </div>
  );
}
