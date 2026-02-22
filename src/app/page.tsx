import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-24 py-12">
      {/* Hero */}
      <section className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-sm font-medium text-[var(--accent)]">
          Two platforms. One mission.
        </p>

        <h1 className="mb-5 text-5xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Spray Intelligence
          <br />
          <span className="gradient-text">and Gas-Free Filling.</span>
        </h1>

        <p className="mx-auto max-w-lg text-lg leading-relaxed text-[var(--fg-secondary)]">
          Two engineering platforms for different challenges.
          Choose the one that matches your workflow.
        </p>
      </section>

      {/* Product Cards */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* AeroSpec */}
        <Link
          href="/catalog"
          className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 no-underline transition-all hover:shadow-[var(--shadow-lg)] hover:border-[var(--border-hover)]"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/8">
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
              <h2 className="text-xl font-semibold text-[var(--fg-bright)] group-hover:text-[var(--accent)] transition-colors">
                AeroSpec
              </h2>
              <p className="text-xs font-medium text-[var(--muted)]">
                Actuator Configurator
              </p>
            </div>
          </div>

          <p className="mb-8 text-sm leading-relaxed text-[var(--fg-secondary)]">
            Map fluid rheology to optimal spray actuators using type-specific atomization models.
            Covers Newtonian &amp; non-Newtonian fluids, droplet distribution,
            material compatibility, and clogging risk.
          </p>

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

          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span>Spray system engineers, R&amp;D teams</span>
            <span className="text-[var(--accent)] font-medium group-hover:translate-x-1 transition-transform">
              Explore &rarr;
            </span>
          </div>
        </Link>

        {/* Spenser SFP */}
        <Link
          href="/spenser"
          className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 no-underline transition-all hover:shadow-[var(--shadow-lg)] hover:border-[var(--border-hover)]"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-secondary)]/8">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5">
                <rect x="8" y="4" width="16" height="24" rx="3" opacity="0.3" />
                <line x1="8" y1="16" x2="24" y2="16" />
                <circle cx="16" cy="10" r="2" fill="var(--accent-secondary)" opacity="0.5" />
                <path d="M12 22h8" opacity="0.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--fg-bright)] group-hover:text-[var(--accent-secondary)] transition-colors">
                Spenser
              </h2>
              <p className="text-xs font-medium text-[var(--muted)]">
                SFP Configurator
              </p>
            </div>
          </div>

          <p className="mb-8 text-sm leading-relaxed text-[var(--fg-secondary)]">
            Configure gas-free mechanical dispensing systems. Translate formula viscosity into
            hardware specifications via Boyle&apos;s Law bypass, with PPWR compliance
            grading and ROI modelling.
          </p>

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

          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span>Formulation chemists, packaging engineers</span>
            <span className="text-[var(--accent-secondary)] font-medium group-hover:translate-x-1 transition-transform">
              Explore &rarr;
            </span>
          </div>
        </Link>
      </section>

      {/* Decision Helper */}
      <section>
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
          Which platform do I need?
        </h2>
        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <div className="grid grid-cols-3">
            <div className="bg-[var(--bg-secondary)] px-5 py-3 text-xs font-medium text-[var(--muted)]">
              Your question
            </div>
            <div className="bg-[var(--bg-secondary)] px-5 py-3 text-center text-xs font-medium text-[var(--accent)]">
              AeroSpec
            </div>
            <div className="bg-[var(--bg-secondary)] px-5 py-3 text-center text-xs font-medium text-[var(--accent-secondary)]">
              Spenser SFP
            </div>
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
              <div className="border-t border-[var(--border)] px-5 py-3.5 text-sm text-[var(--fg)]">
                {row.question}
              </div>
              <div className="flex items-center justify-center border-t border-[var(--border)] px-5 py-3.5">
                {row.aerospec ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs text-[var(--accent)]">&#10003;</span>
                ) : (
                  <span className="text-[var(--muted)] opacity-30">&mdash;</span>
                )}
              </div>
              <div className="flex items-center justify-center border-t border-[var(--border)] px-5 py-3.5">
                {row.spenser ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-secondary)]/10 text-xs text-[var(--accent-secondary)]">&#10003;</span>
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
          <div key={s.label} className="rounded-2xl bg-[var(--bg-secondary)] p-6 text-center">
            <p className="text-3xl font-semibold text-[var(--fg-bright)]">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-[var(--muted)]">{s.label}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)] opacity-60">{s.sub}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
