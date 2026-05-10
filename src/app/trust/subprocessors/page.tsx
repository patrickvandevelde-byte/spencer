import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

export const metadata = {
  title: "Sub-processors — AeroSpec Trust",
  description:
    "Third-party data processors used by AeroSpec during the open-beta period.",
};

// Pre-revenue list — kept deliberately short. Each addition triggers
// a 60-day customer notice once paying tenants exist.
type Status = "active" | "scoped";
type Region = "EU" | "US" | "Global";

const SUBPROCESSORS: {
  vendor: string;
  purpose: string;
  data: string;
  region: Region;
  status: Status;
}[] = [
  {
    vendor: "Vercel",
    purpose: "Application hosting + CDN",
    data: "Request metadata, configurator submissions in transit",
    region: "Global",
    status: "active",
  },
  {
    vendor: "Postgres provider — TBD",
    purpose: "Primary database (configurations, contributions, accounts)",
    data: "Tenant + user records, configurations, graph contributions",
    region: "EU",
    status: "scoped",
  },
  {
    vendor: "Sentry",
    purpose: "Error monitoring + performance tracing",
    data: "Stack traces, request context (PII-scrubbed)",
    region: "EU",
    status: "scoped",
  },
  {
    vendor: "Stripe",
    purpose: "Payment + subscription billing",
    data: "Billing email, payment instrument, invoice metadata",
    region: "Global",
    status: "scoped",
  },
  {
    vendor: "Resend (or similar)",
    purpose: "Transactional email (auth, notifications)",
    data: "User email, message content",
    region: "EU",
    status: "scoped",
  },
];

const STATUS_COLOR: Record<Status, string> = {
  active: "var(--success)",
  scoped: "var(--warning)",
};

const STATUS_LABEL: Record<Status, string> = {
  active: "Active",
  scoped: "Scoped — activates when first paying tenant uses it",
};

export default function SubprocessorsPage() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center">
        <h1 className="mb-3 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Sub-processors
        </h1>
        <p className="text-sm text-[var(--fg-secondary)]">
          Third parties that process customer or end-user data on our
          behalf. The list is short because we&rsquo;re pre-revenue. Any
          addition triggers a 60-day notice to paying tenants.
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Last updated 2026-05-10
        </p>
      </section>

      <section className="mx-auto max-w-4xl">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <tr>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Vendor
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Purpose
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Data processed
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Region
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {SUBPROCESSORS.map((s) => (
                <tr key={s.vendor} className="border-b border-[var(--border)] last:border-b-0">
                  <td className="px-5 py-4 text-sm font-semibold text-[var(--fg-bright)]">
                    {s.vendor}
                  </td>
                  <td className="px-5 py-4 text-xs text-[var(--fg-secondary)]">
                    {s.purpose}
                  </td>
                  <td className="px-5 py-4 text-xs text-[var(--fg-secondary)]">
                    {s.data}
                  </td>
                  <td className="px-5 py-4 text-xs text-[var(--fg-secondary)]">
                    {s.region}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${STATUS_COLOR[s.status]} 12%, transparent)`,
                        color: STATUS_COLOR[s.status],
                      }}
                      title={STATUS_LABEL[s.status]}
                    >
                      {s.status === "active" ? "Active" : "Scoped"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm text-[var(--fg-secondary)]">
          Want to be notified when a new sub-processor is added?{" "}
          <Link
            href="/contact?topic=trust"
            className="text-[var(--accent)] no-underline hover:underline"
          >
            Subscribe via the Trust form &rarr;
          </Link>
        </p>
      </section>
    </div>
  );
}
