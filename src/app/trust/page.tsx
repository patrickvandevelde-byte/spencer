import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

// Status taxonomy — explicit about what's shipping vs. what's
// architecturally ready vs. what's roadmap. Synthetic-user
// validation flagged "controls listed as Available with no
// production tenants" as a credibility risk; pills now disclose
// the real state.
const PILLARS = [
  {
    title: "Data Isolation",
    status: "Architecture ready",
    statusColor: "var(--accent)",
    body: "Enterprise tenants will deploy in a VPC-isolated environment (AWS / Azure / GCP). Formulation data never leaves the tenant boundary; ML training is opt-in only. Awaiting first production tenant before status moves to Available.",
    bullets: [
      "Single-tenant VPC isolation (Enterprise)",
      "Differential-privacy aggregation (Professional, opt-in)",
      "On-prem export of trained model weights for Enterprise + Pharma",
    ],
  },
  {
    title: "Pharma / 21 CFR Part 11",
    status: "Roadmap · Q1 2027",
    statusColor: "var(--warning)",
    body: "Validated environment for inhalation / nasal CDMOs. IQ / OQ documentation, audit trail, and e-signature are scoped on the Pharma SaaS tier. First validated deployment targeted Q1 2027 — timeline is contingent on lead-customer partnership.",
    bullets: [
      "Tamper-evident audit log per configuration & order",
      "FDA 21 CFR Part 11 e-signature on screening decisions",
      "GMP-friendly export bundle (PDF + signed checksum)",
      "Approved Vendor List integration · no procurement attach",
    ],
  },
  {
    title: "SOC 2 Type II",
    status: "Roadmap · Type I Q4 2026 / Type II Q2 2027",
    statusColor: "var(--warning)",
    body: "Vanta engagement scoped; controls inventory under construction. Type I attestation targeted Q4 2026, Type II window Q2 2027. We will publish the report URL the moment it lands; pre-then, expect a security questionnaire turnaround within 5 business days.",
    bullets: [
      "Vanta-managed control evidence",
      "Penetration test by external firm · annual cadence post-Type-I",
      "Customer-accessible trust portal at GA",
    ],
  },
  {
    title: "Supply-chain channel hygiene",
    status: "Policy in force",
    statusColor: "var(--accent)",
    body: "Production procurement is pass-through with a transparent 2–4% take rate visible line-item on the PO. No hidden margin on production volume. Policy applies from day one of the marketplace, including the open-beta period.",
    bullets: [
      "Sample marketplace margin disclosed in catalog",
      "Production POs: marketplace fee on the line, not in the unit price",
      "Coster / Lindal / Aptar co-sell agreements scoped; no channel-conflict on framework accounts",
    ],
  },
  {
    title: "Auth & access control",
    status: "Email/password live · SSO architecture ready",
    statusColor: "var(--accent)",
    body: "Email + password is live today. SAML 2.0 SSO and SCIM provisioning are wired in the Enterprise codepath; first paying tenant flips them on.",
    bullets: [
      "SAML 2.0 SSO (Okta / Azure AD / Google Workspace)",
      "SCIM provisioning · automated joiner / mover / leaver",
      "RBAC: Admin / User / Viewer",
      "Session-bound MFA (TOTP)",
    ],
  },
  {
    title: "Data residency",
    status: "EU + US (Enterprise · architecture ready)",
    statusColor: "var(--accent)",
    body: "Region selection is part of the Enterprise provisioning contract. Backups remain in-region. Cross-border data flows require explicit per-tenant approval. Beta tenants currently run in eu-central-1 only.",
    bullets: [
      "EU residency: Frankfurt + Dublin",
      "US residency: us-east-1 + us-west-2",
      "Pharma tier: customer-hosted option available",
    ],
  },
];

const FAQ = [
  {
    q: "What happens to my formulation data if I cancel?",
    a: "30-day export window in JSON + PDF. After 30 days the production tenant is wiped per the DPA; backups age out within 90 days. No silent retention for ML training.",
  },
  {
    q: "Do you train shared ML models on my data?",
    a: "Only with explicit per-tenant opt-in, and even then routed through differential-privacy aggregation. Enterprise customers can deploy on-prem so the question is moot.",
  },
  {
    q: "What's your IP protection posture for Tier-1 CPG?",
    a: "VPC-isolated tenancy + customer-managed KMS keys + signed model-weight export. Validation interviews flagged this as the gating concern; we now make it the default architectural option for Enterprise.",
  },
  {
    q: "How do you handle DSARs / GDPR / CCPA?",
    a: "DSAR requests are handled via the contact form (topic = Trust). 30-day SLA for access, deletion, portability. Sub-processor list maintained at /trust/subprocessors with 60-day change notice; a dedicated DSAR portal lands with the SOC 2 Type I milestone.",
  },
  {
    q: "Where can I see the methodology behind your buyer claims?",
    a: "The synthetic-user validation pass that informs the v1.1 / v1.2 positioning is in SYNTHETIC_USER_VALIDATION.md (repo). Real-customer-discovery gaps from §7 are open and tracked publicly. We'd rather show you the methodology than wave a research-firm logo.",
  },
];

export default function Trust() {
  return (
    <div className="space-y-16 py-8">
      <BetaBanner />

      {/* Hero */}
      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            Trust &amp; Compliance
          </span>
        </div>
        <h1 className="mb-5 text-5xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Built for buyers who
          <br />
          <span className="gradient-text">have an InfoSec team.</span>
        </h1>
        <p className="mx-auto max-w-lg text-lg leading-relaxed text-[var(--fg-secondary)]">
          The deal-killers our validation pass surfaced — IP leakage, GMP
          audit, channel conflict — addressed by architecture, not by
          marketing copy.
        </p>
      </section>

      {/* Pillars */}
      <section className="grid gap-5 md:grid-cols-2">
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--border-hover)]"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-[var(--fg-bright)]">
                {p.title}
              </h3>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `color-mix(in srgb, ${p.statusColor} 12%, transparent)`,
                  color: p.statusColor,
                }}
              >
                {p.status}
              </span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[var(--fg-secondary)]">
              {p.body}
            </p>
            <ul className="space-y-1.5">
              {p.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-xs text-[var(--fg-secondary)]"
                >
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
          Procurement / Legal FAQ
        </h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
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

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <p className="mb-3 text-sm text-[var(--fg-bright)]">
          Need a security questionnaire, DPA, or the sub-processor list?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact?topic=trust"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white no-underline hover:opacity-90"
          >
            Open a Trust request
          </Link>
          <Link
            href="/trust/subprocessors"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            View sub-processors
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Pricing
          </Link>
        </div>
        <p className="mt-4 text-[11px] text-[var(--muted)]">
          {/* Last-updated stamp signals the page is maintained. */}
          Last updated 2026-05-10 &middot; controls reviewed monthly during the open-beta period.
        </p>
      </section>
    </div>
  );
}
