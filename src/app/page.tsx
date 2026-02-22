import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-8 text-center">
        <div className="dot-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-bright)] bg-[var(--surface)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[var(--accent)]">
              TWO PLATFORMS, ONE MISSION
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-[var(--fg-bright)] md:text-5xl">
            Spray Atomization Intelligence
            <br />
            <span className="gradient-text">&amp; Gas-Free Filling</span>
          </h1>

          <p className="mx-auto mb-4 max-w-2xl text-lg text-[var(--fg)]">
            Two engineering platforms for different challenges.
            Choose the one that matches your workflow.
          </p>
        </div>
      </section>

      {/* Product Cards */}
      <section className="grid gap-8 md:grid-cols-2">
        {/* AeroSpec */}
        <Link
          href="/catalog"
          className="glass group relative rounded-2xl p-8 no-underline transition-all hover:border-[var(--border-bright)] hover:shadow-[var(--glow)]"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" stroke="#06b6d4" strokeWidth="1.5">
                  <circle cx="16" cy="16" r="12" opacity="0.3" />
                  <circle cx="16" cy="16" r="6" />
                  <line x1="16" y1="4" x2="16" y2="10" opacity="0.5" />
                  <line x1="16" y1="22" x2="16" y2="28" opacity="0.5" />
                  <line x1="4" y1="16" x2="10" y2="16" opacity="0.5" />
                  <line x1="22" y1="16" x2="28" y2="16" opacity="0.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--fg-bright)] group-hover:text-[var(--accent)] transition-colors">
                  AeroSpec
                </h2>
                <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--accent)]">
                  ACTUATOR CONFIGURATOR
                </p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" className="opacity-0 transition-opacity group-hover:opacity-100">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          <p className="mb-6 text-sm leading-relaxed text-[var(--muted)]">
            Map fluid rheology to optimal spray actuators using type-specific atomization models.
            Covers Newtonian &amp; non-Newtonian fluids, Dv10/Dv50/Dv90 droplet distribution,
            material compatibility, and clogging risk.
          </p>

          <div className="mb-6 grid grid-cols-3 gap-3">
            {[
              { label: "Actuators", value: "27" },
              { label: "Fluids", value: "25+" },
              { label: "Spray Types", value: "12" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-[var(--border)] p-2 text-center">
                <div className="text-lg font-bold text-[var(--fg-bright)]">{s.value}</div>
                <div className="font-[family-name:var(--font-mono)] text-[8px] tracking-wider text-[var(--muted)]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--muted)]">
            Best for: <span className="text-[var(--fg)]">Spray system engineers, R&amp;D teams, nozzle selection</span>
          </div>
        </Link>

        {/* Spenser SFP */}
        <Link
          href="/spenser"
          className="glass group relative rounded-2xl p-8 no-underline transition-all hover:border-[var(--accent-secondary)]/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-secondary)]/10">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" stroke="#8b5cf6" strokeWidth="1.5">
                  <rect x="8" y="4" width="16" height="24" rx="3" opacity="0.3" />
                  <line x1="8" y1="16" x2="24" y2="16" />
                  <circle cx="16" cy="10" r="2" fill="#8b5cf6" opacity="0.5" />
                  <path d="M12 22h8" opacity="0.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--fg-bright)] group-hover:text-[var(--accent-secondary)] transition-colors">
                  Spenser
                </h2>
                <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--accent-secondary)]">
                  SFP CONFIGURATOR
                </p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" className="opacity-0 transition-opacity group-hover:opacity-100">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          <p className="mb-6 text-sm leading-relaxed text-[var(--muted)]">
            Configure gas-free mechanical dispensing systems. Translate formula viscosity into
            hardware specifications via Boyle&apos;s Law bypass, with real-time PPWR compliance
            grading and ROI modelling.
          </p>

          <div className="mb-6 grid grid-cols-3 gap-3">
            {[
              { label: "IM Parts", value: "11" },
              { label: "PPWR Grade", value: "A-E" },
              { label: "Line CAPEX", value: "€150K" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-[var(--border)] p-2 text-center">
                <div className="text-lg font-bold text-[var(--fg-bright)]">{s.value}</div>
                <div className="font-[family-name:var(--font-mono)] text-[8px] tracking-wider text-[var(--muted)]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--muted)]">
            Best for: <span className="text-[var(--fg)]">Formulation chemists, packaging engineers, filler operators</span>
          </div>
        </Link>
      </section>

      {/* Decision Helper */}
      <section className="glass-bright rounded-2xl p-8">
        <h2 className="mb-6 text-center font-[family-name:var(--font-mono)] text-sm tracking-wider text-[var(--accent)]">
          WHICH PLATFORM DO I NEED?
        </h2>
        <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--border)] md:grid-cols-3">
          <div className="bg-[var(--bg-secondary)] p-5 text-center font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--muted)]">
            YOUR QUESTION
          </div>
          <div className="bg-[var(--bg-secondary)] p-5 text-center font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--accent)]">
            AEROSPEC
          </div>
          <div className="bg-[var(--bg-secondary)] p-5 text-center font-[family-name:var(--font-mono)] text-xs tracking-wider text-[var(--accent-secondary)]">
            SPENSER SFP
          </div>

          {[
            { question: "Which nozzle fits my fluid?", aerospec: true, spenser: false },
            { question: "How do I avoid compressed gas?", aerospec: false, spenser: true },
            { question: "What droplet size will I get?", aerospec: true, spenser: false },
            { question: "Is my packaging PPWR compliant?", aerospec: false, spenser: true },
            { question: "Which actuator material is safe?", aerospec: true, spenser: false },
            { question: "What's the ROI vs aerosol lines?", aerospec: false, spenser: true },
            { question: "Can I dispense gas-sensitive actives?", aerospec: false, spenser: true },
            { question: "Spray cone angle prediction?", aerospec: true, spenser: false },
          ].map((row) => (
            <div key={row.question} className="contents">
              <div className="border-t border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--fg)]">
                {row.question}
              </div>
              <div className="flex items-center justify-center border-t border-[var(--border)] bg-[var(--surface)] p-4">
                {row.aerospec ? (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-bold text-[var(--accent)]">&#10003;</span>
                ) : (
                  <span className="text-[var(--muted)] opacity-30">&mdash;</span>
                )}
              </div>
              <div className="flex items-center justify-center border-t border-[var(--border)] bg-[var(--surface)] p-4">
                {row.spenser ? (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-secondary)]/20 text-xs font-bold text-[var(--accent-secondary)]">&#10003;</span>
                ) : (
                  <span className="text-[var(--muted)] opacity-30">&mdash;</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Atomization Models", value: "8", sub: "Lefebvre, Dombrowski, Nukiyama..." },
          { label: "Zero Gas Systems", value: "6", sub: "Piston + ITV configurations" },
          { label: "PPWR Compliance", value: "A", sub: "Single-stream PET recyclability" },
          { label: "Line CAPEX Savings", value: "92%", sub: "€150K vs €2M traditional" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-[var(--fg-bright)]">{s.value}</p>
            <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--muted)]">{s.label}</p>
            <p className="mt-1 text-[10px] text-[var(--muted)] opacity-60">{s.sub}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
