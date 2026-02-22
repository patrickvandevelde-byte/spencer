import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-20 py-8">
      {/* Hero */}
      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            Two platforms
          </span>
          <span className="h-3 w-px bg-[var(--border)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            One mission
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-secondary)]" />
        </div>

        <h1 className="mb-5 text-5xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Spray Intelligence
          <br />
          <span className="gradient-text">and Gas-Free Filling.</span>
        </h1>

        <p className="mx-auto max-w-lg text-lg leading-relaxed text-[var(--fg-secondary)]">
          Pick the platform that matches your engineering challenge.
          Switch between them anytime.
        </p>

        {/* Quick jump anchors */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#aerospec"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-5 py-2.5 text-sm font-medium text-[var(--accent)] no-underline transition-all hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/40"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            AeroSpec
            <span className="text-xs opacity-60">&darr;</span>
          </a>
          <a
            href="#spenser"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-secondary)]/20 bg-[var(--accent-secondary)]/5 px-5 py-2.5 text-sm font-medium text-[var(--accent-secondary)] no-underline transition-all hover:bg-[var(--accent-secondary)]/10 hover:border-[var(--accent-secondary)]/40"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--accent-secondary)]" />
            Spenser SFP
            <span className="text-xs opacity-60">&darr;</span>
          </a>
        </div>
      </section>

      {/* Product Cards */}
      <section className="grid gap-8 md:grid-cols-2">
        {/* AeroSpec Card */}
        <div id="aerospec" className="scroll-mt-20 flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all hover:shadow-[var(--shadow-lg)] hover:border-[var(--border-hover)]">
          {/* Color bar */}
          <div className="h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/60" />

          <div className="flex flex-1 flex-col p-8">
            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/8">
                <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                  <circle cx="16" cy="16" r="12" opacity="0.3" />
                  <circle cx="16" cy="16" r="6" />
                  <line x1="16" y1="4" x2="16" y2="10" opacity="0.5" />
                  <line x1="16" y1="22" x2="16" y2="28" opacity="0.5" />
                  <line x1="4" y1="16" x2="10" y2="16" opacity="0.5" />
                  <line x1="22" y1="16" x2="28" y2="16" opacity="0.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--fg-bright)]">
                  AeroSpec
                </h2>
                <p className="text-xs font-medium text-[var(--accent)]">
                  Actuator Configurator
                </p>
              </div>
            </div>

            {/* Value prop */}
            <p className="mb-2 text-sm font-medium text-[var(--fg)]">
              Which nozzle fits my fluid?
            </p>
            <p className="mb-6 text-sm leading-relaxed text-[var(--fg-secondary)]">
              Map fluid rheology to optimal spray actuators. Covers Newtonian &amp; non-Newtonian fluids,
              droplet distribution, material compatibility, and clogging risk.
            </p>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              {[
                { label: "Actuators", value: "27" },
                { label: "Fluids", value: "25+" },
                { label: "Spray Types", value: "12" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-[var(--bg-secondary)] p-3 text-center">
                  <div className="text-lg font-semibold text-[var(--fg-bright)]">{s.value}</div>
                  <div className="text-[10px] font-medium text-[var(--muted)]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Who it's for */}
            <div className="mb-6 rounded-xl bg-[var(--bg-secondary)] px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)] mb-1.5">
                Built for
              </p>
              <p className="text-xs text-[var(--fg-secondary)]">
                Spray system engineers, R&amp;D teams, product development
              </p>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-2">
              <Link
                href="/catalog"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white no-underline transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Open AeroSpec
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Spenser SFP Card */}
        <div id="spenser" className="scroll-mt-20 flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all hover:shadow-[var(--shadow-lg)] hover:border-[var(--border-hover)]">
          {/* Color bar */}
          <div className="h-1 bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-secondary)]/60" />

          <div className="flex flex-1 flex-col p-8">
            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-secondary)]/8">
                <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5">
                  <rect x="8" y="4" width="16" height="24" rx="3" opacity="0.3" />
                  <line x1="8" y1="16" x2="24" y2="16" />
                  <circle cx="16" cy="10" r="2" fill="var(--accent-secondary)" opacity="0.5" />
                  <path d="M12 22h8" opacity="0.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--fg-bright)]">
                  Spenser SFP
                </h2>
                <p className="text-xs font-medium text-[var(--accent-secondary)]">
                  Gas-Free Configurator
                </p>
              </div>
            </div>

            {/* Value prop */}
            <p className="mb-2 text-sm font-medium text-[var(--fg)]">
              How do I eliminate compressed gas?
            </p>
            <p className="mb-6 text-sm leading-relaxed text-[var(--fg-secondary)]">
              Configure gas-free mechanical dispensing systems. Translate formula viscosity into
              hardware specs via Boyle&apos;s Law bypass, with PPWR compliance grading and ROI modelling.
            </p>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              {[
                { label: "IM Parts", value: "11" },
                { label: "PPWR Grade", value: "A-E" },
                { label: "Line CAPEX", value: "€150K" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-[var(--bg-secondary)] p-3 text-center">
                  <div className="text-lg font-semibold text-[var(--fg-bright)]">{s.value}</div>
                  <div className="text-[10px] font-medium text-[var(--muted)]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Who it's for */}
            <div className="mb-6 rounded-xl bg-[var(--bg-secondary)] px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)] mb-1.5">
                Built for
              </p>
              <p className="text-xs text-[var(--fg-secondary)]">
                Formulation chemists, packaging engineers, sustainability leads
              </p>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-2">
              <Link
                href="/spenser"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-secondary)] px-6 py-2.5 text-sm font-medium text-white no-underline transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Open Spenser SFP
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Helper — scannable question router */}
      <section className="mx-auto max-w-xl">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
            Not sure which to pick?
          </h2>
          <p className="text-sm text-[var(--fg-secondary)]">
            Find your question &mdash; we&rsquo;ll point you to the right platform.
          </p>
        </div>

        <div className="space-y-2">
          {([
            { q: "Which nozzle fits my fluid?", platform: "aerospec" as const },
            { q: "How do I avoid compressed gas?", platform: "spenser" as const },
            { q: "What droplet size will I get?", platform: "aerospec" as const },
            { q: "Is my packaging PPWR compliant?", platform: "spenser" as const },
            { q: "Which actuator material is safe?", platform: "aerospec" as const },
            { q: "What\u2019s the ROI vs aerosol lines?", platform: "spenser" as const },
            { q: "Can I dispense gas-sensitive actives?", platform: "spenser" as const },
            { q: "Spray cone angle prediction?", platform: "aerospec" as const },
          ]).map((row) => (
            <Link
              key={row.q}
              href={row.platform === "aerospec" ? "/catalog" : "/spenser"}
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 no-underline transition-all hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-sm)]"
            >
              <span className="text-sm text-[var(--fg)]">{row.q}</span>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
                  row.platform === "aerospec"
                    ? "bg-[var(--accent)]/8 text-[var(--accent)]"
                    : "bg-[var(--accent-secondary)]/8 text-[var(--accent-secondary)]"
                }`}
              >
                {row.platform === "aerospec" ? "AeroSpec" : "Spenser SFP"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Stats — grouped by platform */}
      <section className="grid gap-8 md:grid-cols-2">
        {/* AeroSpec stats */}
        <div className="rounded-2xl border border-[var(--accent)]/10 bg-[var(--accent)]/[0.02] p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="text-xs font-semibold text-[var(--accent)]">AeroSpec highlights</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Atomization Models", value: "8", sub: "Lefebvre, Dombrowski, Nukiyama..." },
              { label: "Spray Types", value: "12", sub: "Full cone, hollow cone, flat fan..." },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-[var(--surface)] p-4 text-center">
                <p className="text-2xl font-semibold text-[var(--fg-bright)]">{s.value}</p>
                <p className="mt-1 text-xs font-medium text-[var(--muted)]">{s.label}</p>
                <p className="mt-0.5 text-[10px] text-[var(--muted)] opacity-60">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Spenser stats */}
        <div className="rounded-2xl border border-[var(--accent-secondary)]/10 bg-[var(--accent-secondary)]/[0.02] p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-secondary)]" />
            <span className="text-xs font-semibold text-[var(--accent-secondary)]">Spenser SFP highlights</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "PPWR Compliance", value: "A", sub: "Single-stream PET recyclability" },
              { label: "Line CAPEX Savings", value: "92%", sub: "€150K vs €2M traditional" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-[var(--surface)] p-4 text-center">
                <p className="text-2xl font-semibold text-[var(--fg-bright)]">{s.value}</p>
                <p className="mt-1 text-xs font-medium text-[var(--muted)]">{s.label}</p>
                <p className="mt-0.5 text-[10px] text-[var(--muted)] opacity-60">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
