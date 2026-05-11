import Link from "next/link";

// Honest disclosure that headline figures (validated triples,
// catalog SKUs, customer counts) are forward-looking targets,
// not customer-base proxies. Synthetic-user validation surfaced
// credibility-of-implied-traction as a deal-killer for mid-market
// CPG and pharma buyers; this banner is the cheap, durable fix.
export function BetaBanner({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) {
  if (variant === "compact") {
    return (
      <div className="rounded-full border border-[var(--warning)]/40 bg-[var(--warning)]/[0.06] px-3 py-1 text-[11px] text-[var(--fg-secondary)]">
        <span className="font-semibold text-[var(--warning)]">Open beta</span>
        <span className="mx-1.5 text-[var(--muted)]">·</span>
        <span>Pre-revenue. Numbers are forward-looking targets.</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--warning)]/30 bg-[var(--warning)]/[0.04] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--warning)]/15 text-xs font-bold text-[var(--warning)]">
          β
        </span>
        <div className="flex-1 text-xs leading-relaxed text-[var(--fg-secondary)]">
          <p>
            <strong className="text-[var(--fg-bright)]">Open beta &middot; pre-revenue.</strong>{" "}
            AeroSpec is in active development. Catalog counts (27+ actuators,
            25+ fluids) reflect the seeded library. Graph density figures are
            forward-looking targets layered on the Sprint-1 baseline &mdash;
            live submissions accumulate on top once the contributions schema
            is migrated. Pricing, SLAs, and certifications listed reflect the
            roadmap, not current customer commitments.
          </p>
          <p className="mt-2">
            Helping us validate?{" "}
            <Link
              href="/contact?topic=design-partner"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Become a design partner &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
