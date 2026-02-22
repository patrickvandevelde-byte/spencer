import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { WorkflowBreadcrumb } from "@/components/WorkflowBreadcrumb";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroSpec + Spenser — Spray Atomization & Gas-Free Filling",
  description:
    "Two platforms: AeroSpec maps fluid physics to optimal actuators. Spenser configures gas-free mechanical dispensing with PPWR compliance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NavBar />
        <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
          <WorkflowBreadcrumb />
          {children}
        </main>
        <footer className="border-t border-[var(--border)] py-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="#06b6d4" strokeWidth="1.5" opacity="0.2" />
                  <circle cx="16" cy="16" r="3" fill="#06b6d4" opacity="0.4" />
                </svg>
                <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[var(--muted)]">
                  AEROSPEC
                </span>
              </div>
              <span className="h-3 w-px bg-[var(--border)]" />
              <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[var(--muted)]">
                SPENSER SFP
              </span>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--muted)] opacity-50">
              Spray Intelligence &middot; Gas-Free Filling
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
