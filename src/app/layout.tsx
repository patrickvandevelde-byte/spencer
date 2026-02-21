import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroSpec — Predictive Actuator Configurator",
  description:
    "Input fluid properties and hardware constraints to instantly receive mechanically compatible, mathematically predicted actuator configurations.",
};

function Nav() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity">
          {/* Logo mark */}
          <div className="relative flex h-8 w-8 items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#06b6d4" strokeWidth="1.5" opacity="0.3"/>
              <circle cx="16" cy="16" r="8" stroke="#06b6d4" strokeWidth="1" opacity="0.5"/>
              <circle cx="16" cy="16" r="3" fill="#06b6d4"/>
              <line x1="16" y1="2" x2="16" y2="8" stroke="#06b6d4" strokeWidth="1" opacity="0.4"/>
              <line x1="16" y1="24" x2="16" y2="30" stroke="#06b6d4" strokeWidth="1" opacity="0.4"/>
              <line x1="2" y1="16" x2="8" y2="16" stroke="#06b6d4" strokeWidth="1" opacity="0.4"/>
              <line x1="24" y1="16" x2="30" y2="16" stroke="#06b6d4" strokeWidth="1" opacity="0.4"/>
            </svg>
          </div>
          <span className="font-[family-name:var(--font-mono)] text-sm font-bold tracking-wider text-[var(--fg-bright)]">
            AEROSPEC
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/configure"
            className="rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide text-[var(--muted)] no-underline transition-all hover:bg-[var(--surface)] hover:text-[var(--accent)]"
          >
            Configure
          </Link>
          <Link
            href="/compare"
            className="rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide text-[var(--muted)] no-underline transition-all hover:bg-[var(--surface)] hover:text-[var(--accent)]"
          >
            Compare
          </Link>
          <Link
            href="/procurement"
            className="rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide text-[var(--muted)] no-underline transition-all hover:bg-[var(--surface)] hover:text-[var(--accent)]"
          >
            Procure
          </Link>
          <Link
            href="/orders"
            className="rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide text-[var(--muted)] no-underline transition-all hover:bg-[var(--surface)] hover:text-[var(--accent)]"
          >
            Orders
          </Link>
          <Link
            href="/analytics"
            className="rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide text-[var(--muted)] no-underline transition-all hover:bg-[var(--surface)] hover:text-[var(--accent)]"
          >
            Analytics
          </Link>
          <Link
            href="/cart"
            className="rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide text-[var(--muted)] no-underline transition-all hover:bg-[var(--surface)] hover:text-[var(--accent)] flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            Cart
          </Link>
          <Link
            href="/configure"
            className="btn-primary ml-2 rounded-lg px-4 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide no-underline"
          >
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Nav />
        <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] py-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#06b6d4" strokeWidth="1.5" opacity="0.2"/>
                <circle cx="16" cy="16" r="3" fill="#06b6d4" opacity="0.4"/>
              </svg>
              <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[var(--muted)]">
                AEROSPEC v0.3
              </span>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--muted)] opacity-50">
              Predictive Actuator Intelligence
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
