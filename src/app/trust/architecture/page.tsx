import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

export const metadata = {
  title: "Architecture — Data Isolation, VPC, DP — AeroSpec Trust",
  description:
    "AeroSpec architecture for IP protection: VPC-isolated Enterprise tenancy, customer-managed KMS, differential-privacy aggregation, on-prem model export.",
};

const TIERS = [
  {
    name: "Multi-tenant (Free / Indie / Starter)",
    description:
      "Standard SaaS multi-tenancy. Row-level isolation enforced at the ORM layer. Encryption at rest (AES-256, AWS-managed) + in transit (TLS 1.3).",
    isolation: "Logical (RLS)",
    keys: "AWS-managed KMS",
    mlSharing: "Aggregate only (≥3-source consensus)",
    audit: "Per-tenant audit log",
    color: "var(--muted)",
  },
  {
    name: "Single-tenant DB (Professional)",
    description:
      "Dedicated database per tenant. ML feedback opt-in only; data leaving the tenant boundary routes through differential-privacy aggregation with ε ≤ 1.0.",
    isolation: "Dedicated DB + RLS",
    keys: "Customer-managed KMS (BYOK)",
    mlSharing: "Opt-in, DP-aggregated (ε ≤ 1.0)",
    audit: "Tamper-evident chained log",
    color: "var(--accent)",
  },
  {
    name: "VPC-isolated (Enterprise)",
    description:
      "Single-tenant VPC. Customer-supplied KMS keys. No outbound data flow to AeroSpec multi-tenant infra except for licensed model-weight pulls (signed + versioned). Formula data never leaves the customer boundary.",
    isolation: "Single-tenant VPC + private endpoint",
    keys: "Customer KMS, customer-rotated",
    mlSharing: "None unless explicitly enabled",
    audit: "Customer-controlled, SIEM-exported",
    color: "var(--accent-secondary)",
  },
  {
    name: "On-prem (Enterprise + Pharma)",
    description:
      "Air-gapped option. AeroSpec ships signed container images + signed model weights; customer runs inside their own Kubernetes / OpenShift. Updates pulled by the customer; no AeroSpec network ingress.",
    isolation: "Customer-controlled (air-gappable)",
    keys: "Customer KMS / HSM",
    mlSharing: "None (model frozen at customer's release cadence)",
    audit: "Customer SIEM",
    color: "var(--success)",
  },
];

const DP_PARAMS = [
  { name: "Mechanism", value: "Laplace + Gaussian (composed)" },
  { name: "Epsilon budget (ε)", value: "1.0 / month / tenant (default)" },
  { name: "Delta (δ)", value: "1 / n²  where n = tenant submission count" },
  { name: "Composition", value: "Advanced composition theorem" },
  { name: "Audit", value: "ε / δ consumption visible to tenant admin" },
];

export default function ArchitecturePage() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            Architecture &middot; Data Isolation
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Your formulation data
          <br />
          <span className="gradient-text">stays where you put it.</span>
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--fg-secondary)]">
          Persona P1 (Tier-1 CPG R&amp;D): &ldquo;We will not export
          formulation parameters to a SaaS vendor. Period.&rdquo; Four
          isolation tiers up to fully air-gapped on-prem. Differential
          privacy is the default for any aggregate that crosses the
          tenant boundary.
        </p>
      </section>

      {/* Isolation tier diagram */}
      <section className="grid gap-4 md:grid-cols-2">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className="rounded-2xl border bg-[var(--surface)] p-6"
            style={{ borderColor: `color-mix(in srgb, ${t.color} 35%, transparent)` }}
          >
            <div className="mb-3 flex items-start gap-3">
              <span
                className="mt-1 inline-flex h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: t.color }}
              />
              <h3 className="text-base font-semibold text-[var(--fg-bright)]">
                {t.name}
              </h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[var(--fg-secondary)]">
              {t.description}
            </p>
            <dl className="space-y-2 text-[11px]">
              <div className="flex justify-between gap-3 border-b border-[var(--border)] pb-2">
                <dt className="text-[var(--muted)]">Isolation</dt>
                <dd className="text-right text-[var(--fg-bright)]">
                  {t.isolation}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-[var(--border)] pb-2">
                <dt className="text-[var(--muted)]">Encryption keys</dt>
                <dd className="text-right text-[var(--fg-bright)]">{t.keys}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-[var(--border)] pb-2">
                <dt className="text-[var(--muted)]">ML data sharing</dt>
                <dd className="text-right text-[var(--fg-bright)]">
                  {t.mlSharing}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--muted)]">Audit</dt>
                <dd className="text-right text-[var(--fg-bright)]">{t.audit}</dd>
              </div>
            </dl>
          </div>
        ))}
      </section>

      {/* DP parameter sheet */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Differential-privacy parameters
        </p>
        <h2 className="mb-4 text-base font-semibold text-[var(--fg-bright)]">
          What &ldquo;DP-aggregated&rdquo; actually means
        </h2>
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {DP_PARAMS.map((p) => (
            <div
              key={p.name}
              className="rounded-lg bg-[var(--bg)] px-4 py-3"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {p.name}
              </dt>
              <dd className="mt-1 font-mono text-xs text-[var(--fg-bright)]">
                {p.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[11px] leading-relaxed text-[var(--muted)]">
          Defaults are conservative and visible to tenant administrators in
          /settings/privacy at GA. ε / δ are configurable per tenant under
          their DPA; Pharma + Enterprise tenants can set ε = 0 (no
          cross-tenant sharing) without affecting their own predictions.
        </p>
      </section>

      {/* Architecture ASCII diagram */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Reference architecture
        </p>
        <h2 className="mb-4 text-base font-semibold text-[var(--fg-bright)]">
          VPC-isolated Enterprise tenant
        </h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 font-mono text-[11px] leading-relaxed text-[var(--fg-secondary)]">
          <pre className="whitespace-pre">{`┌─────────────────────────────────────────────────────────────────┐
│  CUSTOMER AWS / AZURE / GCP ACCOUNT                              │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │ Customer VPC (single-tenant, no peering)                 │   │
│   │                                                          │   │
│   │   ┌─────────────┐    ┌──────────────┐    ┌──────────┐    │   │
│   │   │  AeroSpec   │───▶│  Postgres    │    │  KMS     │    │   │
│   │   │  app pods   │    │  (single)    │◀───│  (BYOK)  │    │   │
│   │   └──────┬──────┘    └──────────────┘    └──────────┘    │   │
│   │          │                                                │   │
│   │          ▼                                                │   │
│   │   ┌─────────────┐    ┌──────────────┐                    │   │
│   │   │  Audit log  │    │  Object      │    Outbound:        │   │
│   │   │  (chained)  │    │  storage     │    SIGNED          │   │
│   │   └─────────────┘    │  (encrypted) │    MODEL PULLS      │   │
│   │                       └──────────────┘    only             │   │
│   │                                                          │   │
│   └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼ (signed weights, versioned)       │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
                  AeroSpec model-distribution endpoint
                  (read-only, signed releases)`}</pre>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-[var(--muted)]">
          No customer data flows back to AeroSpec multi-tenant infra. Model
          weight pulls are read-only, signed releases at the customer&rsquo;s
          chosen cadence. SIEM integration via Customer&rsquo;s native log
          shipping (CloudWatch / Sentinel / Stackdriver).
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <p className="mb-3 text-sm text-[var(--fg-bright)]">
          Architecture review for your InfoSec team?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact?topic=enterprise"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white no-underline hover:opacity-90"
          >
            Book architecture review
          </Link>
          <Link
            href="/trust"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Trust pillars
          </Link>
          <Link
            href="/trust/validated-environment"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            21 CFR Part 11
          </Link>
        </div>
      </section>
    </div>
  );
}
