import Link from "next/link";

const TIERS = [
  {
    id: "indie",
    name: "Indie / Maker",
    price: "$99",
    cadence: "/ month",
    tagline: "DTC brands buying their first 5–25k units",
    cta: { label: "Start Indie", href: "/catalog" },
    highlights: [
      "10 configurations / month (metered credits)",
      "Curated catalog: top 12 actuator SKUs",
      "Sample marketplace access (10–15% take-rate baked into sample price)",
      "1 user seat",
      "Community + email support",
    ],
    notIncluded: [
      "MSDS auto-parsing",
      "Regulatory flags",
      "API access",
    ],
    accent: "var(--accent)",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$500",
    cadence: "/ month",
    tagline: "Single-product R&D teams + small packaging shops",
    cta: { label: "Start Starter", href: "/catalog" },
    highlights: [
      "50 configurations / month",
      "Full 27-actuator catalog + 25-fluid library",
      "Manual MSDS entry + Ohnesorge classification",
      "Saved configurations (cloud)",
      "1 user seat · email support (24h)",
      "10% off actuator orders placed through platform",
    ],
    notIncluded: [
      "MSDS OCR",
      "Multi-seat",
      "API access",
    ],
    accent: "var(--accent)",
  },
  {
    id: "pro",
    name: "Professional",
    price: "$2,000",
    cadence: "/ month",
    tagline: "Mid-market CPG + regional CMOs (the v1.1 sweet spot)",
    badge: "Most Popular",
    cta: { label: "Talk to Sales", href: "mailto:sales@aerospec.example" },
    highlights: [
      "Unlimited configurations",
      "Automated MSDS parsing (OCR + hazard extraction)",
      "EPA / CPSIA / CE / RoHS compliance flags",
      "Up to 5 user seats · Slack + email priority support",
      "API access (10k calls / month)",
      "15% off actuator orders + preferred Spencer pricing",
      "PDF / CSV / BOM export, audit trail",
    ],
    notIncluded: [
      "21 CFR Part 11",
      "On-prem / VPC-isolated tenancy",
      "Custom ML training",
    ],
    accent: "var(--accent)",
    featured: true,
  },
  {
    id: "pharma",
    name: "Pharma SaaS",
    price: "$4–8k",
    cadence: "/ month",
    tagline: "Inhalation / nasal CDMOs (MDI, DPI, nasal sprays)",
    cta: { label: "Request Validation Pack", href: "mailto:pharma@aerospec.example" },
    highlights: [
      "Everything in Professional",
      "21 CFR Part 11 audit trail + e-signature",
      "Validated environment (IQ / OQ documentation)",
      "GMP-friendly export · candidate-ranking-only mode",
      "Approved Vendor List integration",
      "No procurement attach (by design)",
    ],
    notIncluded: [
      "Production procurement",
      "Sample marketplace (regulatory exclusion)",
    ],
    accent: "var(--accent-secondary)",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$8–25k",
    cadence: "/ month",
    tagline: "Tier-1 CPG + global CMOs · Year-2 motion",
    cta: { label: "Talk to Sales", href: "mailto:sales@aerospec.example" },
    highlights: [
      "Everything in Professional",
      "SOC 2 Type II · on-prem / VPC-isolated tenancy",
      "Ariba / Coupa / SAP punch-out · ERP webhooks",
      "Dedicated account manager + QBR",
      "Custom ML training on your formulations",
      "Unlimited API · SAML SSO · RBAC",
      "Volume procurement discounts (20%+ at qualified volume)",
      "99.9% uptime SLA",
    ],
    notIncluded: [],
    accent: "var(--accent-secondary)",
    note: "Implementation fee $10–50k (one-time)",
  },
];

const PROCUREMENT_TIERS = [
  {
    label: "Sample & Pilot Marketplace",
    take: "10–15%",
    pricing: "Margin baked into list price · transparent per-unit",
    body: "Where the historical $0.50–$2.00 / unit margin actually survives. Designed for qualification orders, indie pilot runs, and bench validation — 5–500 unit quantities.",
  },
  {
    label: "Production Price-Discovery",
    take: "2–4%",
    pricing: "Pass-through pricing · marketplace fee capped per PO",
    body: "Transparent supplier quotes. Suppliers (or buyer + supplier 50/50) pay the fee. No hidden margin on production volume — sourcing teams get full price visibility.",
  },
  {
    label: "Enterprise ERP Integration",
    take: "0%",
    pricing: "Monetized via SaaS subscription + implementation fee",
    body: "Ariba / Coupa / SAP punch-out and ERP webhooks. Pure SaaS revenue — channel-conflict-free for Spencer, Coster, Lindal, and other partner suppliers.",
  },
];

export default function Pricing() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            v1.1 pricing · revised May 2026
          </span>
        </div>
        <h1 className="mb-5 text-5xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Pay for outcomes,
          <br />
          <span className="gradient-text">not for screen-time.</span>
        </h1>
        <p className="mx-auto max-w-lg text-lg leading-relaxed text-[var(--fg-secondary)]">
          Five tiers grounded in real customer-discovery: indie DTC,
          mid-market CPG, regional CMOs, regulated pharma, and Tier-1
          enterprise. No hidden procurement margin on production volume.
        </p>
      </section>

      {/* Tier grid */}
      <section className="grid gap-5 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`relative flex flex-col rounded-2xl border bg-[var(--surface)] p-7 transition-all ${
              tier.featured
                ? "border-[var(--accent)]/40 shadow-[var(--shadow-lg)]"
                : "border-[var(--border)] hover:border-[var(--border-hover)]"
            }`}
          >
            {tier.badge && (
              <span className="absolute -top-3 left-7 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                {tier.badge}
              </span>
            )}

            <div className="mb-4 flex items-baseline gap-1">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: tier.accent }}
              >
                {tier.name}
              </span>
            </div>

            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-[var(--fg-bright)]">
                {tier.price}
              </span>
              <span className="text-sm text-[var(--muted)]">
                {tier.cadence}
              </span>
            </div>
            <p className="mb-6 text-sm text-[var(--fg-secondary)]">
              {tier.tagline}
            </p>

            <ul className="mb-6 space-y-2">
              {tier.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2 text-xs text-[var(--fg-secondary)]"
                >
                  <span
                    className="mt-1 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: tier.accent }}
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {tier.notIncluded.length > 0 && (
              <div className="mb-6 rounded-lg bg-[var(--bg-secondary)] px-3 py-2">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Not included
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  {tier.notIncluded.join(" · ")}
                </p>
              </div>
            )}

            {tier.note && (
              <p className="mb-4 text-[11px] italic text-[var(--muted)]">
                {tier.note}
              </p>
            )}

            <div className="mt-auto">
              <Link
                href={tier.cta.href}
                className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium no-underline transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  backgroundColor: tier.featured
                    ? "var(--accent)"
                    : "var(--bg-secondary)",
                  color: tier.featured ? "white" : "var(--fg)",
                }}
              >
                {tier.cta.label}
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Procurement model — transparent take-rate */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <div className="mb-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            Procurement model
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
            Three transactions. Three transparent take-rates.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--fg-secondary)]">
            Sourcing teams told us a uniform hidden margin is a non-starter
            on production volume. So we split it.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {PROCUREMENT_TIERS.map((p) => (
            <div
              key={p.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5"
            >
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {p.label}
              </p>
              <p className="mb-2 text-3xl font-semibold text-[var(--fg-bright)]">
                {p.take}
              </p>
              <p className="mb-3 text-[11px] font-medium text-[var(--accent)]">
                {p.pricing}
              </p>
              <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ — buyer-objection focused */}
      <section className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
          Buyer FAQ
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Will my formulation data train your shared models?",
              a: "Only if you opt in. Professional and Enterprise customers can route field data through differential-privacy aggregation; Enterprise can deploy on-prem / VPC-isolated tenancy where data never leaves their environment. Default is no.",
            },
            {
              q: "Is the procurement margin really transparent on production POs?",
              a: "Yes. Production orders use pass-through supplier pricing with a 2–4% marketplace fee shown line-item on the PO. The 10–15% margin only applies to sample / pilot marketplace orders, where it's baked into the catalog price.",
            },
            {
              q: "What about pharma / GMP environments?",
              a: "The Pharma SaaS tier ships 21 CFR Part 11 e-signatures and a validated audit trail. We do not attach procurement to pharma — your Approved Vendor List + change-control process stays in charge.",
            },
            {
              q: "How accurate are the spray predictions?",
              a: "Today: ~70% directional accuracy on shortlist ranking, validated against bench testing. Roadmap: 85% over 18 months via synthetic-CFD bootstrapping. Use predictions to compress shortlists from 2–3 weeks to 2–3 days; physical validation stays required.",
            },
            {
              q: "Can independent consultants resell or white-label?",
              a: "Yes. Affiliate / white-label SKU available with 20–30% revenue share. Designed for consultants whose clients need a self-serve tool between engagements.",
            },
          ].map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:border-[var(--border-hover)]"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-[var(--fg-bright)]">
                {item.q}
                <span className="text-[var(--muted)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--fg-secondary)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="text-center">
        <p className="text-xs text-[var(--muted)]">
          Source &amp; methodology:{" "}
          <Link
            href="/trust"
            className="text-[var(--accent)] no-underline hover:underline"
          >
            Trust &amp; Compliance
          </Link>
          {" · "}
          v1.1 pricing reflects synthetic-user validation findings. See
          BUSINESS_STRATEGY.md §11 changelog.
        </p>
      </section>
    </div>
  );
}
