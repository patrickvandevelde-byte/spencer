import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

export const metadata = {
  title: "Validated Environment — 21 CFR Part 11 — AeroSpec",
  description:
    "Pharma-grade environment scope: 21 CFR Part 11 e-signature, IQ/OQ/PQ documentation, audit trail, and validated change control.",
};

const CONTROLS = [
  {
    title: "Electronic records — §11.10(a)",
    body: "Tamper-evident append-only audit log per configuration, prediction, and order action. SHA-256 chained; immutable export.",
    status: "Architecture ready",
  },
  {
    title: "Electronic signatures — §11.50, §11.70, §11.200",
    body: "Two-factor e-sign with reason code, captured on screening decision lock-in and on data exports leaving the tenant.",
    status: "Architecture ready",
  },
  {
    title: "Audit trail — §11.10(e), §11.10(k)",
    body: "Who-did-what-when, before/after diffs on every editable field, immutable from creation. Surfaces in /audit-log per tenant; exports as 21 CFR-compliant CSV with checksum.",
    status: "Architecture ready",
  },
  {
    title: "Access controls — §11.10(d), §11.300",
    body: "RBAC (Admin/User/Viewer/Auditor) + SSO required; password complexity per Annex; user-lockout policy enforced.",
    status: "RBAC live · SAML SSO architecture ready",
  },
  {
    title: "Operational checks — §11.10(g)",
    body: "Pre-validated workflows for screening, lock-in, export; deviations route to QA review before record finalization.",
    status: "Roadmap · ships with first Pharma design partner",
  },
  {
    title: "Validated environment — IQ/OQ/PQ",
    body: "Installation Qualification template (env vars, infra checklist), Operational Qualification (process tests), Performance Qualification (prediction-accuracy SLA). Co-authored with first Pharma design partner.",
    status: "Roadmap · Q1 2027",
  },
  {
    title: "GxP change control",
    body: "Tenant change-control board for environment, schema, and model-weight changes. 60-day pre-notification on model-impacting changes; opt-out hold per tenant.",
    status: "Roadmap · ships with validated environment",
  },
  {
    title: "Documentation bundle",
    body: "Validation Master Plan (VMP), URS, FRS, design specs, risk assessment (FMEA), traceability matrix &mdash; templated and tenant-customisable.",
    status: "Template scaffolded",
  },
];

const TIMELINE = [
  {
    quarter: "Now",
    title: "Design-partner intake",
    body: "Selecting 1–2 inhalation / nasal CDMOs to co-validate the environment. Free Pharma SaaS access during validation; rev-share on the IQ/OQ/PQ template.",
  },
  {
    quarter: "Q4 2026",
    title: "SOC 2 Type I + audit trail GA",
    body: "Type I attestation closes baseline IT controls. Audit-log + e-sign go live behind the Pharma feature flag.",
  },
  {
    quarter: "Q1 2027",
    title: "IQ/OQ/PQ + validated environment GA",
    body: "First validated tenant goes live. Validation pack published. Pharma SaaS tier opens commercially.",
  },
  {
    quarter: "Q2 2027",
    title: "SOC 2 Type II",
    body: "Continuous-control evidence; required to scale validated tenants beyond design partners.",
  },
];

export default function ValidatedEnvironmentPage() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            Pharma SaaS &middot; Validated Environment
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          21 CFR Part 11 &mdash;
          <br />
          <span className="gradient-text">co-validated, not retrofitted.</span>
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--fg-secondary)]">
          Persona P3 (Yuki Tanaka, Inhalation CDMO Principal Scientist) was
          direct: &ldquo;21 CFR Part 11 compliance, e-signature, and full
          audit trail are the price of admission. Without it, we cannot
          deploy.&rdquo; This is how we get there with a design partner,
          not a marketing claim.
        </p>
      </section>

      {/* Controls matrix */}
      <section>
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
            Controls matrix
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
            Eight Part-11 control families &mdash; status per family
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {CONTROLS.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-[var(--fg-bright)]">
                  {c.title}
                </h3>
                <span
                  className="shrink-0 rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]"
                  title={c.status}
                >
                  {c.status.split(" ")[0]}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
                {c.body}
              </p>
              <p className="mt-2 text-[10px] text-[var(--muted)]">
                Status: {c.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Validation timeline
        </p>
        <h2 className="mb-5 text-xl font-semibold text-[var(--fg-bright)]">
          From architecture to first validated tenant
        </h2>
        <div className="space-y-4">
          {TIMELINE.map((t, i) => (
            <div
              key={t.quarter}
              className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4"
            >
              <div className="shrink-0">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{
                    backgroundColor:
                      i === 0 ? "var(--accent)" : "var(--bg-secondary)",
                    color: i === 0 ? "white" : "var(--muted)",
                  }}
                >
                  {t.quarter}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--fg-bright)]">
                  {t.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--fg-secondary)]">
                  {t.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Design partner CTA */}
      <section className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.04] p-8 text-center">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          For inhalation / nasal CDMOs
        </p>
        <h2 className="mb-3 text-2xl font-semibold text-[var(--fg-bright)]">
          Co-validate the environment with us.
        </h2>
        <p className="mx-auto mb-5 max-w-xl text-sm leading-relaxed text-[var(--fg-secondary)]">
          The first 1&ndash;2 Pharma design partners get free Pharma SaaS
          access through GA, co-authored IQ/OQ/PQ templates, and a
          revenue-share on the validation pack we publish.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact?topic=pharma"
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white no-underline hover:opacity-90"
          >
            Apply as a design partner
          </Link>
          <Link
            href="/trust/architecture"
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Architecture deep-dive
          </Link>
          <Link
            href="/trust"
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Trust &amp; Compliance
          </Link>
        </div>
      </section>

      <p className="text-center text-[11px] text-[var(--muted)]">
        Last updated 2026-05-10 &middot; Co-validation timeline contingent
        on design-partner intake; all dates are scoped, not contractual.
      </p>
    </div>
  );
}
