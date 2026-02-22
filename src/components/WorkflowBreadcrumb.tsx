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

  const isSpenser = pathname.startsWith("/spenser");
  const steps = isSpenser ? SPENSER_STEPS : AEROSPEC_STEPS;

  const currentIndex = steps.findIndex((s) => {
    if (isSpenser && s.path === "/spenser") return pathname === "/spenser";
    return pathname.startsWith(s.path);
  });

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
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium no-underline transition-all ${
                isCurrent
                  ? isSpenser
                    ? "bg-[var(--accent-secondary)]/8 text-[var(--accent-secondary)]"
                    : "bg-[var(--accent)]/8 text-[var(--accent)]"
                  : isPast
                    ? isSpenser
                      ? "text-[var(--accent-secondary)]/60 hover:text-[var(--accent-secondary)]"
                      : "text-[var(--accent)]/60 hover:text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold ${
                isCurrent
                  ? isSpenser
                    ? "bg-[var(--accent-secondary)] text-white"
                    : "bg-[var(--accent)] text-white"
                  : isPast
                    ? isSpenser
                      ? "bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)]"
                      : "bg-[var(--accent)]/15 text-[var(--accent)]"
                    : "bg-[var(--bg-secondary)] text-[var(--muted)]"
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
