import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

export const metadata = {
  title: "Privacy — AeroSpec",
  description:
    "How AeroSpec collects, processes, and protects user data during the open-beta period.",
};

const SECTIONS = [
  {
    h: "What we collect",
    body:
      "Configurator submissions (fluid properties, hardware selections, predicted outcomes), graph contributions you submit (bench-test outcome, rating, optional notes), and account data if you register (email, hashed password, organisation). The free configurator is anonymous by default — no account required, no cookies set beyond a minimal session id.",
  },
  {
    h: "What we do with it",
    body:
      "Aggregate fluid → actuator → outcome triples power the fitment graph. Identifiable data is never sold or shared. ML training on customer data is opt-in only and routed through differential-privacy aggregation; Pharma and Enterprise tenants can deploy on-prem so the question doesn't arise.",
  },
  {
    h: "What we don't do",
    body:
      "We do not run third-party advertising trackers. We do not enrich your work email against data brokers. We do not retain anonymous configurator submissions beyond what's needed to compute graph density. Anti-spam IP hashes are salted and one-way.",
  },
  {
    h: "Your rights (GDPR / CCPA)",
    body:
      "Access, deletion, portability, and objection requests are honored within 30 days. File a request via the contact form (topic = Trust). Until the dedicated DSAR portal lands with the SOC 2 Type I milestone, manual handling applies.",
  },
  {
    h: "Sub-processors",
    body:
      "Maintained at /trust/subprocessors with 60-day notice on changes. Today's list is short because we're pre-revenue: hosting, error monitoring, transactional email. Payment + ERP processors join when paying tenants do.",
  },
  {
    h: "Retention",
    body:
      "Active tenant data: lifetime of the contract. After cancellation: 30-day export window, then a hard wipe of the production tenant; backups age out within 90 days. Anonymous configurator data: graph aggregates kept indefinitely; raw submissions truncated after 24 months.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center">
        <h1 className="mb-3 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Privacy
        </h1>
        <p className="text-sm text-[var(--fg-secondary)]">
          Plain-English summary. The DPA and full legal policy will be linked
          here at GA. Until then, this page is what governs.
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Last updated 2026-05-10 &middot; pre-revenue · open beta
        </p>
      </section>

      <section className="mx-auto max-w-3xl space-y-4">
        {SECTIONS.map((s) => (
          <div
            key={s.h}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <h2 className="mb-2 text-base font-semibold text-[var(--fg-bright)]">
              {s.h}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
              {s.body}
            </p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm text-[var(--fg-secondary)]">
          Question, DSAR, or DPA request?{" "}
          <Link
            href="/contact?topic=trust"
            className="text-[var(--accent)] no-underline hover:underline"
          >
            File via the Trust form &rarr;
          </Link>
        </p>
      </section>
    </div>
  );
}
