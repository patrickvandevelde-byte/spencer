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
        <main className="mx-auto max-w-[980px] px-6 pt-20 pb-20">
          <WorkflowBreadcrumb />
          {children}
        </main>
        <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] py-6">
          <div className="mx-auto flex max-w-[980px] items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                AeroSpec
              </span>
              <span className="h-3 w-px bg-[var(--border)]" />
              <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-secondary)]" />
                Spenser SFP
              </span>
            </div>
            <span className="text-xs text-[var(--muted)]">
              Spray Intelligence &middot; Gas-Free Filling
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
