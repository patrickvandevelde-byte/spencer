import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

export const metadata = {
  title: "Partner Program — AeroSpec",
  description:
    "Supplier and consultant partner program: co-sell terms, revenue share, white-label, no channel conflict on framework accounts.",
};

const TRACKS = [
  {
    title: "Supplier (Coster, Lindal, Aptar &amp; peers)",
    body: "List your catalog. Get sample / pilot order flow. Co-sell on framework accounts &mdash; we never margin-stack on your direct production contracts.",
    benefits: [
      "Listed in the configurator and AVL whitelist menu",
      "Sample / pilot order fulfilment via your existing logistics",
      "Co-sell on Enterprise accounts (revenue share negotiated)",
      "No transactional middleman on production volume (Trust §Supply-chain)",
      "Capacity + lead-time signals surfaced on /intel (you control the data)",
      "60-day notice on any catalog or pricing-display change",
    ],
    cta: { label: "Apply: Supplier partner", href: "/contact?topic=partners" },
    color: "var(--accent)",
  },
  {
    title: "Consultant / Advisory firm",
    body: "Re-brand the configurator under your domain. Run client engagements with self-serve continuity. 20&ndash;30% rev-share on subscriptions you bring in.",
    benefits: [
      "White-label theming + custom subdomain",
      "Multi-client workspaces; billed through you or direct",
      "20% rev-share Indie/Starter · 30% Pro/Pharma · 10% Enterprise",
      "Co-branded compliance + screening reports",
      "Listed in the certified-consultant directory",
      "Monthly office hours with the Spencer team",
    ],
    cta: { label: "Apply: Consultant", href: "/contact?topic=partners" },
    color: "var(--accent-secondary)",
  },
  {
    title: "Design partner (open beta)",
    body: "Free Pro-tier access through GA in exchange for a 3-month committed feedback loop. Direct access to the founders. Co-author the validation pack we publish.",
    benefits: [
      "Free Pro-tier access through GA",
      "Weekly 30-minute office-hours with the team",
      "Co-authored case study (anonymous or named — your call)",
      "Direct line to feature roadmap; veto right on any change affecting your workflow",
      "20% lifetime discount post-GA (locked at design-partner pricing)",
      "Pharma design partners: free Pharma SaaS + co-authored IQ/OQ/PQ template",
    ],
    cta: { label: "Apply: Design partner", href: "/contact?topic=design-partner" },
    color: "var(--success)",
  },
];

const CHANNEL_TERMS = [
  {
    label: "No production-volume margin",
    body: "We charge 2–4% transparent take on production POs and 10–15% on samples / pilots. We do not insert a margin on your direct framework contracts with mutual customers.",
  },
  {
    label: "Co-sell, not displace",
    body: "On Enterprise accounts we may be brought in by procurement (price-discovery) or by R&D (screening); either way we credit the supplier of record and route the PO through your existing channel.",
  },
  {
    label: "Catalog truth-in-display",
    body: "List prices, lead times, and capacity signals are publishable only with supplier approval. You control the data; we publish what you let us publish.",
  },
  {
    label: "60-day notice on any change",
    body: "Catalog structure, pricing display, take-rate changes — all subject to 60-day partner notice. Same terms as our customer DPA.",
  },
];

export default function PartnersPage() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            Partner Program
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Three partner tracks.
          <br />
          <span className="gradient-text">Zero channel conflict.</span>
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--fg-secondary)]">
          The skeptic from the validation pass (P10, ex-Coster R&amp;D) was
          unambiguous: &ldquo;Spencer and Coster will not let you
          margin-stack on their flagship accounts.&rdquo; This program is the
          architectural answer to that critique.
        </p>
      </section>

      {/* Tracks */}
      <section className="grid gap-5 lg:grid-cols-3">
        {TRACKS.map((t) => (
          <div
            key={t.title}
            className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--border-hover)]"
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className="inline-flex h-3 w-3 rounded-full"
                style={{ backgroundColor: t.color }}
              />
              <h3
                className="text-base font-semibold text-[var(--fg-bright)]"
                dangerouslySetInnerHTML={{ __html: t.title }}
              />
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[var(--fg-secondary)]">
              {t.body}
            </p>
            <ul className="mb-6 space-y-2">
              {t.benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-xs text-[var(--fg-secondary)]"
                >
                  <span
                    className="mt-1 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              href={t.cta.href}
              className="mt-auto rounded-full border border-[var(--border)] px-4 py-2 text-center text-xs font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
            >
              {t.cta.label} &rarr;
            </Link>
          </div>
        ))}
      </section>

      {/* Channel-hygiene terms */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Channel hygiene — the four commitments
        </p>
        <h2 className="mb-4 text-xl font-semibold text-[var(--fg-bright)]">
          What we won&rsquo;t do, on paper
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {CHANNEL_TERMS.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5"
            >
              <p className="mb-2 text-sm font-semibold text-[var(--fg-bright)]">
                {c.label}
              </p>
              <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <p className="mb-3 text-sm text-[var(--fg-bright)]">
          Questions about the program before applying?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact?topic=partners"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white no-underline hover:opacity-90"
          >
            Talk to partnerships
          </Link>
          <Link
            href="/trust"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Trust &amp; Compliance
          </Link>
          <Link
            href="/design-partners"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Current design partners
          </Link>
        </div>
      </section>
    </div>
  );
}
