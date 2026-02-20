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
    <nav className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest">
        <Link href="/" className="font-bold text-[var(--fg)] no-underline hover:opacity-70">
          AeroSpec
        </Link>
        <div className="flex gap-6">
          <Link href="/configure" className="text-[var(--muted)] no-underline hover:text-[var(--fg)]">
            Configure
          </Link>
          <Link href="/procurement" className="text-[var(--muted)] no-underline hover:text-[var(--fg)]">
            Procure
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
        <main className="mx-auto max-w-6xl px-4 py-8 font-[family-name:var(--font-mono)]">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] py-6 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
          AeroSpec PoC v0.1 &mdash; Phase 0 Proof of Concept
        </footer>
      </body>
    </html>
  );
}
