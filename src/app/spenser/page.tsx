"use client";

import Link from "next/link";

const FLOWS = [
  {
    id: "configure",
    title: "Formula-to-Hardware",
    subtitle: "Flow A",
    description:
      "Enter viscosity data and orientation needs. Get a complete hardware specification with 11 injection-moulded parts, piston selection, and a QR-code Recipe.",
    href: "/spenser/configure",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="4" width="24" height="24" rx="3" opacity="0.3" />
        <circle cx="16" cy="16" r="6" />
        <line x1="16" y1="4" x2="16" y2="10" opacity="0.5" />
        <line x1="16" y1="22" x2="16" y2="28" opacity="0.5" />
        <line x1="4" y1="16" x2="10" y2="16" opacity="0.5" />
        <line x1="22" y1="16" x2="28" y2="16" opacity="0.5" />
      </svg>
    ),
    stats: ["11 IM Parts", "Boyle's Law Bypass", "QR Recipe"],
  },
  {
    id: "compliance",
    title: "Regulatory Compliance",
    subtitle: "Flow B",
    description:
      "Real-time PPWR scoring (Grade A-E) based on material selections. Detect non-recyclable laminates and export a Compliance Pack.",
    href: "/spenser/compliance",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 3L28 9v10c0 7-5.3 11.3-12 13C9.3 30.3 4 26 4 19V9l12-6z" opacity="0.3" />
        <path d="M11 16l3 3 7-7" strokeWidth="2" />
      </svg>
    ),
    stats: ["PPWR Grade A-E", "Material Audit", "Compliance Pack"],
  },
  {
    id: "economics",
    title: "Filler Economics",
    subtitle: "Flow C",
    description:
      "Compare SFP line CAPEX (from €150K) against traditional aerosol infrastructure (€2M+). Visualise ROI and 5-year TCO.",
    href: "/spenser/economics",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="20" width="5" height="8" rx="1" opacity="0.3" />
        <rect x="13" y="14" width="5" height="14" rx="1" opacity="0.5" />
        <rect x="22" y="6" width="5" height="22" rx="1" />
      </svg>
    ),
    stats: ["CAPEX Comparison", "OPEX Delta", "ROI Timeline"],
  },
];

const PERSONAS = [
  {
    role: "Formulation Chemist",
    action: "Validate gas-sensitive actives in zero-gas environment",
    flow: "A",
  },
  {
    role: "Packaging Engineer",
    action: "Select PET body transparency and printing canvas",
    flow: "A + B",
  },
  {
    role: "Filler Operator",
    action: "Download turnkey filling station Recipes",
    flow: "A",
  },
];

export default function SpenserDashboard() {
  return (
    <div className="space-y-20 py-8">
      {/* Hero */}
      <section className="text-center space-y-5">
        <p className="text-sm font-medium text-[var(--accent-secondary)]">
          SFP Operating Standard
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-[var(--fg-bright)]">
          Spenser Configurator
        </h1>
        <p className="mx-auto max-w-xl text-[var(--muted)] leading-relaxed">
          Translate formula physics into mechanical hardware specifications.
          Bypass gas-dependent constraints with the SFP system.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-[var(--muted)]">
          <span>P<sub>1</sub>V<sub>1</sub> = P<sub>2</sub>V<sub>2</sub> <span className="text-[var(--danger)] line-through">Gas</span></span>
          <span className="text-[var(--accent-secondary)]">vs</span>
          <span>F<sub>spring</sub> = P &times; A <span className="text-[var(--success)]">Mechanical</span></span>
        </div>
      </section>

      {/* Flow Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        {FLOWS.map((flow) => (
          <Link
            key={flow.id}
            href={flow.href}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 no-underline transition-all hover:shadow-[var(--shadow-md)] hover:border-[var(--border-hover)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[var(--accent-secondary)]">{flow.icon}</div>
              <span className="rounded-full bg-[var(--bg-secondary)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--muted)]">
                {flow.subtitle}
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[var(--fg-bright)] group-hover:text-[var(--accent-secondary)] transition-colors">
              {flow.title}
            </h3>
            <p className="mb-4 text-sm text-[var(--muted)] leading-relaxed">
              {flow.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {flow.stats.map((stat) => (
                <span
                  key={stat}
                  className="rounded-full bg-[var(--bg-secondary)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--muted)]"
                >
                  {stat}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>

      {/* Key Differentiators */}
      <section className="rounded-2xl bg-[var(--bg-secondary)] p-8">
        <h2 className="mb-6 text-center text-sm font-semibold text-[var(--accent-secondary)]">
          SFP vs Traditional Aerosol
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Gas Required", spenser: "None", traditional: "LPG / DME / N₂O" },
            { label: "Line CAPEX", spenser: "€150K", traditional: "€2M+" },
            { label: "Pressure Consistency", spenser: "<2% variation", traditional: "30-50% drop" },
            { label: "PPWR Grade", spenser: "Grade A", traditional: "Grade D-E" },
          ].map((row) => (
            <div key={row.label} className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 text-center">
              <div className="mb-2 text-xs font-medium text-[var(--muted)]">
                {row.label}
              </div>
              <div className="mb-1 text-sm font-semibold text-[var(--success)]">
                {row.spenser}
              </div>
              <div className="text-xs text-[var(--muted)] line-through opacity-60">
                {row.traditional}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* User Personas */}
      <section>
        <h2 className="mb-6 text-center text-sm font-medium text-[var(--muted)]">
          Designed for
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PERSONAS.map((persona) => (
            <div
              key={persona.role}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="mb-1 font-semibold text-[var(--fg-bright)]">
                {persona.role}
              </div>
              <div className="mb-2 text-sm text-[var(--muted)]">
                {persona.action}
              </div>
              <div className="text-xs font-medium text-[var(--accent-secondary)]">
                Flow {persona.flow}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
