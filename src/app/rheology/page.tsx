import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

export const metadata = {
  title: "Non-Newtonian Rheology — AeroSpec",
  description:
    "How AeroSpec handles shear-thinning, shear-thickening, and viscoelastic fluids: apparent viscosity at orifice, power-law and Carreau models, where simple atomization predictors fail.",
};

const REGIMES = [
  {
    h: "Newtonian (η = const)",
    body: "Water, ethanol, glycerin (dilute), most thin solvents. Simple atomization models work fine. We use them as the baseline.",
    examples: "Toners, micellar water, perfume",
    confidence: "High",
    color: "var(--success)",
  },
  {
    h: "Power-law shear-thinning (n < 1)",
    body: "Viscosity drops with shear rate. Apparent viscosity at orifice is much lower than the cup measurement. Most personal-care serums, conditioners, light gels.",
    examples: "Hair serum, body lotion, light gel",
    confidence: "Calibrated",
    color: "var(--accent)",
  },
  {
    h: "Carreau (η₀ → η∞ with transition)",
    body: "Plateau at low shear, plateau at high shear, transition in between. Polymer solutions, modified-cellulose body lotions. We fit Carreau parameters from a viscosity–shear sweep if you have it.",
    examples: "Cream, thick lotion, polymer gel",
    confidence: "Calibrated (with sweep data)",
    color: "var(--accent)",
  },
  {
    h: "Shear-thickening (n > 1)",
    body: "Viscosity rises with shear rate. Rare in spray formulations but seen in dense colloidal suspensions and some sunscreens. Our predictor flags these as needing bench validation before lock-in.",
    examples: "Heavily filled paste, dense suspension",
    confidence: "Flagged · bench required",
    color: "var(--warning)",
  },
  {
    h: "Viscoelastic (G' / G'' significant)",
    body: "Stress relaxation matters; spray break-up is dominated by elasticity, not just viscosity. Polymer-thickened serums in the upper range. We deliberately do not over-claim accuracy here; we surface the warning.",
    examples: "Hyaluronic acid serum, polymer cosmetic",
    confidence: "Bench-only",
    color: "var(--danger)",
  },
];

const METHOD = [
  {
    label: "Shear rate at orifice",
    formula: "γ̇ = 8 · v_exit / D_orifice",
    body: "Pipe-flow approximation. The orifice diameter and exit velocity drive the shear rate the fluid actually sees at break-up.",
  },
  {
    label: "Power-law apparent viscosity",
    formula: "η_apparent = K · γ̇^(n-1)",
    body: "Solved for the operating shear rate. K and n inferred from your viscosity input + a sensible default (n ≈ 0.6 for most serums).",
  },
  {
    label: "Modified Ohnesorge",
    formula: "Oh = η_apparent / √(ρ · σ · D)",
    body: "We feed apparent viscosity (not cup viscosity) into the dimensionless atomization parameters. Compatibility, regime, and Dv50 update accordingly.",
  },
  {
    label: "Atomization regime threshold",
    formula: "Oh × Re > 60 → atomization · else wind-stressed",
    body: "Standard threshold map. Where Oh is sensitive to rheology, atomization regime can flip with rheology — surfacing the risk before bench.",
  },
];

export default function RheologyPage() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            Non-Newtonian rheology
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Serums fool
          <br />
          <span className="gradient-text">simple atomization models.</span>
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--fg-secondary)]">
          Persona P2 (mid-market R&amp;D) flagged this:{" "}
          <em>&ldquo;Non-Newtonian serums fool simple atomization
          models.&rdquo;</em>{" "}
          Here&rsquo;s exactly how AeroSpec handles shear-rate effects &mdash;
          and where we explicitly say &ldquo;bench it.&rdquo;
        </p>
      </section>

      {/* Rheology regimes */}
      <section>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Five regimes &middot; confidence per regime
        </p>
        <h2 className="mb-5 text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
          Where the predictor is calibrated &mdash; and where it punts
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {REGIMES.map((r) => (
            <div
              key={r.h}
              className="rounded-2xl border bg-[var(--surface)] p-6"
              style={{ borderColor: `color-mix(in srgb, ${r.color} 30%, transparent)` }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-[var(--fg-bright)]">
                  {r.h}
                </h3>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${r.color} 14%, transparent)`,
                    color: r.color,
                  }}
                >
                  {r.confidence}
                </span>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-[var(--fg-secondary)]">
                {r.body}
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                Examples: <span className="text-[var(--fg-secondary)]">{r.examples}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Methodology
        </p>
        <h2 className="mb-5 text-xl font-semibold text-[var(--fg-bright)]">
          How apparent viscosity flows through to predictions
        </h2>
        <div className="space-y-4">
          {METHOD.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5"
            >
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-[var(--fg-bright)]">
                  {m.label}
                </h3>
                <code className="rounded bg-[var(--bg-secondary)] px-2 py-0.5 font-mono text-[11px] text-[var(--accent)]">
                  {m.formula}
                </code>
              </div>
              <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.04] p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-[var(--fg-bright)]">
          Try it on a serum
        </h2>
        <p className="mx-auto mb-5 max-w-md text-sm text-[var(--fg-secondary)]">
          Open the custom-fluid input, switch rheology to power-law, and
          watch apparent-viscosity ripple through to Dv50 + regime + clogging
          risk.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/configure?intent=non-newtonian"
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white no-underline hover:opacity-90"
          >
            Try the configurator
          </Link>
          <Link
            href="/graph"
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            See graph density
          </Link>
        </div>
      </section>
    </div>
  );
}
