import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

export const metadata = {
  title: "AeroSpec for CMOs — Aerosol & Spray Contract Fillers",
  description:
    "Pre-screen actuators before client meetings. Quote 2 weeks faster. Save 40+ engineering hours per month. Built for the contract-filler workflow.",
};

const WEDGES = [
  {
    title: "Pre-screen before the client meeting",
    body: "Run the formula and get a ranked actuator list with predicted spray physics in 5 minutes — before the prospect arrives. Walk in with a shortlist, not a question.",
    metric: "40+ engineering hours/mo saved",
    sourcePersona: "P8 (Luca, EU CMO ops director)",
  },
  {
    title: "Onboard new accounts 2 weeks faster",
    body: "Sample qualification cycle drops from 6+ weeks to 2 weeks with multi-supplier sample kits + one tracking dashboard. Bid more accounts; close more.",
    metric: "6 wks → 2 wks per account",
    sourcePersona: "P9 (Brenda, US regional CMO)",
  },
  {
    title: "Keep your supplier contracts",
    body: "We don't replace your direct relationships with Coster, Lindal, Aptar. We add price-discovery and engineering pre-screening on top — never a transactional middleman on production volume.",
    metric: "0% margin on production POs",
    sourcePersona: "P8 + Trust §Supply-chain channel hygiene",
  },
];

const FAQ = [
  {
    q: "We have direct framework contracts with Coster / Lindal. Why use AeroSpec?",
    a: "Because the budget bleed isn't on production unit cost — it's on the engineering hours spent re-qualifying actuators for every new brand account that walks in the door. Pre-screening with the configurator + the fitment graph collapses that work. The marketplace is opt-in; the engineering layer is what you actually pay for.",
  },
  {
    q: "Will our suppliers see our quote activity through AeroSpec?",
    a: "No. The configurator is private to your tenant; supplier-side telemetry is limited to PO-level data when you actually place an order. Trust page documents the channel-hygiene posture.",
  },
  {
    q: "What if our client wants an actuator that fails our QA?",
    a: "The configurator surfaces failure modes (clogging risk, material stress, ergonomic out-of-spec). You hand the report to the client; they revise the requirement instead of arguing with you about it. P4 (mid-market beauty packaging) said this is the conversation she struggles to win.",
  },
  {
    q: "How quickly can a sample kit ship to my lab + plant?",
    a: "CMO Onboarding kit: 10–14 business days, guaranteed. Multi-supplier orchestration consolidates 4 vendor leads into one tracking dashboard. Two ship-to addresses are built into the kit (lab + plant).",
  },
  {
    q: "Pricing?",
    a: "Professional ($2,000/mo) is the right tier for most CMOs: 5 seats, Graph API for ERP-side automation, supplier-qualified AVL filter, scheduled BOM reports. Enterprise adds Ariba/Coupa punch-out for clients that require it.",
  },
];

export default function CmoLanding() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            For Contract Fillers (Aerosol &amp; Spray)
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Quote two weeks faster.
          <br />
          <span className="gradient-text">Win more accounts.</span>
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--fg-secondary)]">
          The wedge isn&rsquo;t unit cost &mdash; you already have framework
          contracts. The wedge is the engineering pre-screening that
          collapses onboarding cycles. The synthetic-user pass surfaced this
          as the #1 CMO use case.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/configure"
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white no-underline hover:opacity-90"
          >
            Try the configurator
          </Link>
          <Link
            href="/contact?topic=sales"
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Talk to Sales
          </Link>
        </div>
      </section>

      {/* Three wedges */}
      <section className="grid gap-4 md:grid-cols-3">
        {WEDGES.map((w) => (
          <div
            key={w.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              {w.metric}
            </p>
            <h3 className="mb-2 text-base font-semibold text-[var(--fg-bright)]">
              {w.title}
            </h3>
            <p className="mb-3 text-xs leading-relaxed text-[var(--fg-secondary)]">
              {w.body}
            </p>
            <p className="text-[10px] italic text-[var(--muted)]">
              Source: {w.sourcePersona}
            </p>
          </div>
        ))}
      </section>

      {/* Workflow diagram */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          The contract-filler workflow
        </p>
        <h2 className="mb-5 text-xl font-semibold text-[var(--fg-bright)]">
          Where AeroSpec slots in (and where it doesn&rsquo;t)
        </h2>
        <div className="grid gap-3 md:grid-cols-5">
          {[
            { phase: "1", label: "Brand RFP", aerospec: false },
            { phase: "2", label: "Pre-screen", aerospec: true },
            { phase: "3", label: "Sample qual", aerospec: true },
            { phase: "4", label: "Bench lab", aerospec: false },
            { phase: "5", label: "Pilot + scale", aerospec: true },
          ].map((p) => (
            <div
              key={p.phase}
              className={`rounded-xl border p-4 text-center ${
                p.aerospec
                  ? "border-[var(--accent)]/30 bg-[var(--accent)]/[0.04]"
                  : "border-[var(--border)] bg-[var(--bg)]"
              }`}
            >
              <p
                className={`text-2xl font-semibold ${
                  p.aerospec
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)]"
                }`}
              >
                {p.phase}
              </p>
              <p className="mt-1 text-xs font-semibold text-[var(--fg-bright)]">
                {p.label}
              </p>
              <p className="mt-2 text-[10px] text-[var(--muted)]">
                {p.aerospec ? "AeroSpec" : "Your team"}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-[var(--muted)]">
          Steps 1 (brand RFP) and 4 (your bench lab) stay with you. AeroSpec
          slots into steps 2 (pre-screen), 3 (sample-kit orchestration), and
          5 (pilot + production marketplace with transparent take).
        </p>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
          CMO-specific FAQ
        </h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--border-hover)]"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-[var(--fg-bright)]">
                {item.q}
                <span className="text-[var(--muted)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--fg-secondary)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.04] p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-[var(--fg-bright)]">
          Bring your next brand account to AeroSpec
        </h2>
        <p className="mx-auto mb-5 max-w-md text-sm text-[var(--fg-secondary)]">
          Pre-screen one prospect and tell us if it didn&rsquo;t save you
          half a day. We&rsquo;ll work for the next one for free.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/configure"
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white no-underline hover:opacity-90"
          >
            Pre-screen now
          </Link>
          <Link
            href="/sample-kit"
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Sample-kit options
          </Link>
        </div>
      </section>
    </div>
  );
}
