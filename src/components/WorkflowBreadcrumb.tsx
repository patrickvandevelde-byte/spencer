"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface WorkflowStep {
  path: string;
  label: string;
  shortLabel: string;
}

const AEROSPEC_STEPS: WorkflowStep[] = [
  { path: "/catalog", label: "Catalog", shortLabel: "1" },
  { path: "/configure", label: "Configure", shortLabel: "2" },
  { path: "/compare", label: "Compare", shortLabel: "3" },
  { path: "/results", label: "Results", shortLabel: "4" },
  { path: "/procurement", label: "Procure", shortLabel: "5" },
];

const SPENSER_STEPS: WorkflowStep[] = [
  { path: "/spenser", label: "Dashboard", shortLabel: "1" },
  { path: "/spenser/configure", label: "Configure", shortLabel: "2" },
  { path: "/spenser/compliance", label: "Compliance", shortLabel: "3" },
  { path: "/spenser/economics", label: "Economics", shortLabel: "4" },
];

export function WorkflowBreadcrumb() {
  const pathname = usePathname();

  // Determine which workflow to show
  const isSpenser = pathname.startsWith("/spenser");
  const steps = isSpenser ? SPENSER_STEPS : AEROSPEC_STEPS;

  // Find current step — for Spenser dashboard use exact match
  const currentIndex = steps.findIndex((s) => {
    if (isSpenser && s.path === "/spenser") return pathname === "/spenser";
    return pathname.startsWith(s.path);
  });

  // Don't show on homepage or non-workflow pages
  if (currentIndex === -1) return null;

  const accentColor = isSpenser ? "var(--accent-secondary)" : "var(--accent)";

  return (
    <div className="mb-8 flex items-center gap-1">
      {steps.map((step, i) => {
        const isCurrent = isSpenser && step.path === "/spenser"
          ? pathname === "/spenser"
          : pathname.startsWith(step.path);
        const isPast = i < currentIndex;

        return (
          <div key={step.path} className="flex items-center gap-1">
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isPast || isCurrent ? accentColor : "var(--border)"} strokeWidth="2" className="mx-0.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
            <Link
              href={step.path}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider no-underline transition-all ${
                isCurrent
                  ? isSpenser
                    ? "border border-[var(--accent-secondary)]/30 bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]"
                    : "border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)]"
                  : isPast
                    ? isSpenser
                      ? "text-[var(--accent-secondary)]/60 hover:text-[var(--accent-secondary)]"
                      : "text-[var(--accent)]/60 hover:text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ${
                isCurrent
                  ? isSpenser
                    ? "bg-[var(--accent-secondary)] text-[var(--bg)]"
                    : "bg-[var(--accent)] text-[var(--bg)]"
                  : isPast
                    ? isSpenser
                      ? "bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)]"
                      : "bg-[var(--accent)]/20 text-[var(--accent)]"
                    : "bg-[var(--border)] text-[var(--muted)]"
              }`}>
                {isPast ? (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  step.shortLabel
                )}
              </span>
              {step.label}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
