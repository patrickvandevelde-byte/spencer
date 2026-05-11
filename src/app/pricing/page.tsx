import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";
import { CALENDLY_URL } from "@/components/CalendlyButton";

const TIERS = [
  {
    id: "free",
    name: "Free Configurator",
    price: "$0",
    cadence: "forever",
    tagline: "Anyone — students, researchers, indie founders evaluating fit",
    cta: { label: "Start configuring", href: "/configure" },
    graphAccess: "Community-validated subgraph",
    graphAccessSub: "Triples confirmed by ≥3 customers",
    procurement: "Sample marketplace · 10–15% take baked into list",
    highlights: [
      "Unlimited configurations · forever",
      "Read access to the community-validated subgraph",
      "27+ actuator catalog · 25+ fluid library",
      "Sample marketplace access",
      "1 user seat · community support",
    ],
    accent: "var(--accent)",
  },
  {
    id: "indie",
    name: "Indie / Maker",
    price: "$99",
    cadence: "/ month",
    tagline: "Indie DTC brands, 5–50 FTE, 5–25k unit launches",
    cta: { label: "Start Indie", href: "/configure" },
    graphAccess: "Full validated graph",
    graphAccessSub: "Single-customer reports w/ confidence flags",
    procurement: "Bundled sample kits · 10% off catalog",
    highlights: [
      "Everything in Free",
      "Saved configurations + project workspace",
      "Read access to the full validated graph",
      "Indie procurement perks: bundled sample kits, MOQ-flexible pilots",
      "1 user seat · email support (48h)",
    ],
    accent: "var(--accent)",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$500",
    cadence: "/ month",
    tagline: "Single-product R&D teams, SMB packaging shops",
    cta: { label: "Start Starter", href: "/configure" },
    graphAccess: "+ Supplier-qualified filter",
    graphAccessSub: "Show only your AVL suppliers",
    procurement: "15% off catalog orders",
    highlights: [
      "Everything in Indie",
      "Supplier-qualified filter (your AVL only)",
      "Manual MSDS entry · Ohnesorge classification · safety warnings",
      "Audit trail per configuration",
      "1 user seat · email support (24h)",
      "15% off actuator orders",
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
    cta: { label: "Talk to Sales", href: "/contact?topic=sales" },
    bookCall: true,
    graphAccess: "+ Graph API (10k calls/mo)",
    graphAccessSub: "Read fitment data programmatically",
    procurement: "15% + preferred Spencer pricing",
    highlights: [
      "Everything in Starter",
      "Graph API access (10k calls / month)",
      "MSDS OCR + automated hazard extraction",
      "Regulatory compliance flags (EPA / CPSIA / CE / RoHS)",
      "Up to 5 user seats · Slack + email priority (4h)",
      "PDF / CSV / BOM export · scheduled reports",
      "Preferred Spencer pricing + 15% catalog discount",
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
    cta: { label: "Request Validation Pack", href: "/contact?topic=pharma" },
    bookCall: true,
    graphAccess: "Private graph contributions",
    graphAccessSub: "Differential-privacy aggregation, opt-in only",
    procurement: "No procurement attach (by design)",
    highlights: [
      "Everything in Professional",
      "21 CFR Part 11 audit trail + e-signature",
      "Validated environment (IQ / OQ documentation)",
      "Private graph contributions (DP-aggregated, opt-in)",
      "Candidate-ranking-only mode for early-phase screening",
      "GMP-friendly export · no procurement attach",
    ],
    accent: "var(--accent-secondary)",
  },
  {
    id: "consultant",
    name: "Consultant / Affiliate",
    price: "$249",
    cadence: "/ month + rev-share",
    tagline: "Independent consultants, ex-supplier R&D, advisory firms",
    cta: { label: "Apply to partner program", href: "/contact?topic=partners" },
    graphAccess: "+ White-label branding",
    graphAccessSub: "Re-skin the configurator under your firm's domain",
    procurement: "20–30% rev-share on client-converted subscriptions",
    highlights: [
      "Everything in Professional, on your domain",
      "White-label theming: logo, colors, custom subdomain",
      "Client workspaces (multi-client, billed-through-you)",
      "20% rev-share on Indie/Starter; 30% on Pro/Pharma; 10% on Enterprise",
      "Co-branded compliance + screening reports",
      "Office hours w/ Spencer team (monthly)",
      "Listed on AeroSpec's certified-consultant directory",
    ],
    accent: "var(--accent-secondary)",
    note: "Designed for consultants whose clients need self-serve between engagements",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$8–25k",
    cadence: "/ month",
    tagline: "Tier-1 CPG + global CMOs · Year-2 motion",
    cta: { label: "Talk to Sales", href: "/contact?topic=enterprise" },
    bookCall: true,
    graphAccess: "Maximum graph depth + on-prem",
    graphAccessSub: "VPC-isolated tenancy · custom training",
    procurement: "ERP punch-out · no transactional margin",
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
    accent: "var(--accent-secondary)",
    note: "Implementation fee $10–50k (one-time)",
  },
];

const PROCUREMENT_TIERS = [
  {
    label: "Sample & Pilot Marketplace",
    take: "10–15%",
    pricing: "Margin baked into list price · transparent per-unit",
    body: "Where the original $0.50–$2.00 / unit margin actually survives. Designed for qualification orders, indie pilot runs, and bench validation — 5–500 unit quantities.",
  },
  {
    label: "Production Price-Discovery",
    take: "2–4%",
    pricing: "Pass-through pricing · marketplace fee capped per PO",
    body: "Transparent supplier quotes. Marketplace fee shown line-item on the PO — never hidden in the unit price. Sourcing teams keep full visibility for procurement review.",
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
      <BetaBanner />

      {/* Hero */}
      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            v1.2 pricing · configurations are free, the graph is the product
          </span>
        </div>
        <h1 className="mb-5 text-5xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Configurations are free.
          <br />
          <span className="gradient-text">Graph access is the product.</span>
        </h1>
        <p className="mx-auto max-w-lg text-lg leading-relaxed text-[var(--fg-secondary)]">
          Every configuration is a deposit into the fitment graph — so we
          don&rsquo;t paywall them. Tiers ladder by <em>how much of the graph
          you can read</em> and <em>what procurement perks you get</em>, not
          by how many configs you ran this month.
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
            <p className="mb-5 text-sm text-[var(--fg-secondary)]">
              {tier.tagline}
            </p>

            {/* Graph access + procurement summary — the new ladder dimensions */}
            <div className="mb-5 space-y-3 rounded-lg bg-[var(--bg-secondary)] p-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Graph access
                </p>
                <p className="text-xs font-medium text-[var(--fg-bright)]">
                  {tier.graphAccess}
                </p>
                <p className="text-[11px] text-[var(--muted)]">
                  {tier.graphAccessSub}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Procurement
                </p>
                <p className="text-[11px] text-[var(--fg-secondary)]">
                  {tier.procurement}
                </p>
              </div>
            </div>

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

            {tier.note && (
              <p className="mb-4 text-[11px] italic text-[var(--muted)]">
                {tier.note}
              </p>
            )}

            <div className="mt-auto space-y-2">
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
              {tier.bookCall && (
                <a
                  href={CALENDLY_URL}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-2 text-xs font-medium text-[var(--fg-secondary)] no-underline transition-all hover:border-[var(--border-hover)] hover:text-[var(--fg)]"
                >
                  Or book 30 min &rarr;
                </a>
              )}
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
              q: "Why is the configurator free?",
              a: "Because configurations are inputs to our moat (the fitment graph), not outputs we sell. Every session you run — including the free ones — makes the graph denser and the next user's recommendation better. Paywalling configs would paywall the moat.",
            },
            {
              q: "Will my formulation data train your shared models?",
              a: "Only if you opt in. Professional and Enterprise customers can route field data through differential-privacy aggregation; Pharma and Enterprise tenants can deploy on-prem / VPC-isolated where data never leaves their environment. Default is no.",
            },
            {
              q: "What does \"graph access depth\" actually mean per tier?",
              a: "Free sees triples confirmed by ≥3 customers (community-validated). Indie sees the full validated graph including single-source reports with confidence flags. Starter adds a supplier-qualified filter (your AVL only). Pro adds a programmatic API. Pharma adds private contributions. Enterprise adds maximum depth + on-prem.",
            },
            {
              q: "Is the procurement margin really transparent on production POs?",
              a: "Yes. Production orders use pass-through supplier pricing with a 2–4% marketplace fee shown line-item on the PO. The 10–15% margin only applies to sample / pilot marketplace orders, where it's baked into the catalog price.",
            },
            {
              q: "How accurate are the spray predictions?",
              a: "Today: 62% of recommendations have ≥3-source consensus in the graph; we expect that to rise as graph density grows. Use predictions to compress shortlists from 2–3 weeks to 2–3 days; physical bench validation stays required for regulatory / QA sign-off.",
            },
            {
              q: "Can independent consultants resell or white-label?",
              a: "Yes — Affiliate / white-label SKU available with 20–30% revenue share. Designed for consultants whose clients need a self-serve tool between engagements.",
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
          <Link
            href="/graph"
            className="text-[var(--accent)] no-underline hover:underline"
          >
            Live graph density
          </Link>
          {" · "}
          v1.2 pricing reflects the moat-thesis architecture. See
          BUSINESS_STRATEGY.md §0 + §12.
        </p>
      </section>
    </div>
  );
}
