import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { WorkflowBreadcrumb } from "@/components/WorkflowBreadcrumb";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroSpec — Spray Configurator & Fitment Graph",
  description:
    "AeroSpec maps fluid rheology to optimal spray actuators and gas-free SFP hardware. Free configurator on top of a proprietary fluid-to-hardware fitment graph.",
};

import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NavBar />
        <main className="mx-auto max-w-[980px] px-6 pt-20 pb-20">
          <WorkflowBreadcrumb />
          {children}
        </main>
        <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] py-8">
          <div className="mx-auto grid max-w-[980px] gap-6 px-6 md:grid-cols-[1fr_auto] md:items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tracking-tight text-[var(--fg-bright)]">
                  AeroSpec
                </span>
                <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]">
                  Open beta
                </span>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-[var(--muted)]">
                Two product surfaces, one fitment graph: <strong className="text-[var(--fg-secondary)]">AeroSpec Actuator</strong>{" "}
                (fluid &rarr; spray actuator) and <strong className="text-[var(--fg-secondary)]">AeroSpec SFP</strong>{" "}
                (formula &rarr; gas-free dispensing hardware). Pre-revenue;
                density figures are forward-looking targets unless flagged
                live.
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                {/* TODO(legal): replace placeholder with registered company name + address before launch */}
                &copy; {new Date().getFullYear()} AeroSpec &middot; Operating
                entity TBD &middot;{" "}
                <Link href="/privacy" className="text-[var(--muted)] underline-offset-2 hover:text-[var(--fg)] hover:underline">
                  Privacy
                </Link>{" "}
                &middot;{" "}
                <Link href="/trust/subprocessors" className="text-[var(--muted)] underline-offset-2 hover:text-[var(--fg)] hover:underline">
                  Sub-processors
                </Link>
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs md:justify-end">
              <Link href="/configure" className="text-[var(--muted)] no-underline hover:text-[var(--fg)]">
                Configure
              </Link>
              <Link href="/graph" className="text-[var(--muted)] no-underline hover:text-[var(--fg)]">
                Graph
              </Link>
              <Link href="/pricing" className="text-[var(--muted)] no-underline hover:text-[var(--fg)]">
                Pricing
              </Link>
              <Link href="/trust" className="text-[var(--muted)] no-underline hover:text-[var(--fg)]">
                Trust
              </Link>
              <Link href="/contact" className="text-[var(--accent)] no-underline hover:underline">
                Contact
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
