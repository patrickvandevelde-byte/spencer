"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const WORKFLOW_STEPS = [
  { path: "/configure", label: "Configure", shortLabel: "1" },
  { path: "/compare", label: "Compare", shortLabel: "2" },
  { path: "/results", label: "Results", shortLabel: "3" },
  { path: "/procurement", label: "Procure", shortLabel: "4" },
] as const;

export function WorkflowBreadcrumb() {
  const pathname = usePathname();

  // Only show on workflow-relevant pages
  const currentIndex = WORKFLOW_STEPS.findIndex((s) => pathname.startsWith(s.path));
  if (currentIndex === -1) return null;

  return (
    <div className="mb-8 flex items-center gap-1">
      {WORKFLOW_STEPS.map((step, i) => {
        const isCurrent = pathname.startsWith(step.path);
        const isPast = i < currentIndex;

        return (
          <div key={step.path} className="flex items-center gap-1">
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isPast || isCurrent ? "var(--accent)" : "var(--border)"} strokeWidth="2" className="mx-0.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
            <Link
              href={step.path}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider no-underline transition-all ${
                isCurrent
                  ? "border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)]"
                  : isPast
                    ? "text-[var(--accent)]/60 hover:text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ${
                isCurrent
                  ? "bg-[var(--accent)] text-[var(--bg)]"
                  : isPast
                    ? "bg-[var(--accent)]/20 text-[var(--accent)]"
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
