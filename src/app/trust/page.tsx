import Link from "next/link";

const PILLARS = [
  {
    title: "Data Isolation",
    status: "Available",
    statusColor: "var(--success)",
    body: "Enterprise tenants can deploy in a VPC-isolated environment (AWS / Azure / GCP). Formulation data never leaves the tenant boundary; ML training is opt-in only.",
    bullets: [
      "Single-tenant VPC isolation (Enterprise)",
      "Differential-privacy aggregation (Professional, opt-in)",
      "On-prem export of trained model weights for Enterprise + Pharma",
    ],
  },
  {
    title: "Pharma / 21 CFR Part 11",
    status: "Available — Pharma SaaS tier",
    statusColor: "var(--success)",
    body: "Validated environment for inhalation / nasal CDMOs. IQ / OQ documentation provided; audit trail and e-signature shipped.",
    bullets: [
      "Tamper-evident audit log per configuration & order",
      "FDA 21 CFR Part 11 e-signature on screening decisions",
      "GMP-friendly export bundle (PDF + signed checksum)",
      "Approved Vendor List integration · no procurement attach",
    ],
  },
  {
    title: "SOC 2 Type II",
    status: "In progress · Q3 2026",
    statusColor: "var(--warning)",
    body: "Type I attestation targeted Q2 2026; Type II by Q3 2026. Required before Tier-1 CPG enterprise rollout per validation findings.",
    bullets: [
      "Vanta-managed control evidence",
      "Penetration test by external firm · annual cadence",
      "Customer-accessible trust portal at GA",
    ],
  },
  {
    title: "Supply-chain channel hygiene",
    status: "Policy",
    statusColor: "var(--accent)",
    body: "Production procurement is pass-through with a transparent 2–4% take rate visible line-item on the PO. No hidden margin on production volume.",
    bullets: [
      "Sample marketplace margin disclosed in catalog",
      "Production POs: marketplace fee on the line, not in the unit price",
      "Suppliers (Spencer / Coster / Lindal) co-sell agreements; no channel-conflict on framework accounts",
    ],
  },
  {
    title: "Auth & access control",
    status: "Available",
    statusColor: "var(--success)",
    body: "Email + password today; SAML 2.0 SSO and SCIM provisioning available on Enterprise.",
    bullets: [
      "SAML 2.0 SSO (Okta / Azure AD / Google Workspace)",
      "SCIM provisioning · automated joiner / mover / leaver",
      "RBAC: Admin / User / Viewer",
      "Session-bound MFA (TOTP)",
    ],
  },
  {
    title: "Data residency",
    status: "EU + US",
    statusColor: "var(--success)",
    body: "Customers choose primary region at provisioning. Backups remain in-region. Cross-border data flows require explicit per-tenant approval.",
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
    a: "DSAR portal at /privacy/requests. 30-day SLA for access, deletion, portability. Sub-processor list maintained at /trust/subprocessors with 60-day change notice.",
  },
];

export default function Trust() {
  return (
    <div className="space-y-16 py-8">
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

      <section className="text-center">
        <p className="text-xs text-[var(--muted)]">
          Need a security questionnaire, DPA, or sub-processor list?{" "}
          <a
            href="mailto:trust@aerospec.example"
            className="text-[var(--accent)] no-underline hover:underline"
          >
            trust@aerospec.example
          </a>
          {" · "}
          <Link
            href="/pricing"
            className="text-[var(--accent)] no-underline hover:underline"
          >
            Pricing
          </Link>
        </p>
      </section>
    </div>
  );
}
