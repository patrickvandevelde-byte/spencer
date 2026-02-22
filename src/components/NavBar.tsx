"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavContext = "home" | "aerospec" | "spenser";

function getContext(pathname: string): NavContext {
  if (pathname.startsWith("/spenser")) return "spenser";
  if (
    pathname.startsWith("/configure") ||
    pathname.startsWith("/results") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/procurement") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/catalog")
  ) {
    return "aerospec";
  }
  return "home";
}

const NAV_LINK =
  "rounded-lg px-3 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide no-underline transition-all";
const NAV_DEFAULT = `${NAV_LINK} text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--accent)]`;
const NAV_ACTIVE = `${NAV_LINK} text-[var(--accent)] bg-[var(--accent)]/10`;

function AeroSpecNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/catalog", label: "Catalog" },
    { href: "/configure", label: "Configure" },
    { href: "/compare", label: "Compare" },
    { href: "/procurement", label: "Procure" },
    { href: "/orders", label: "Orders" },
    { href: "/analytics", label: "Analytics" },
    { href: "/cart", label: "Cart", icon: true },
  ];

  return (
    <>
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${active ? NAV_ACTIVE : NAV_DEFAULT} ${item.icon ? "flex items-center gap-1" : ""}`}
          >
            {item.icon && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
            )}
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

function SpenserNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/spenser", label: "Dashboard", exact: true },
    { href: "/spenser/configure", label: "Configure" },
    { href: "/spenser/compliance", label: "Compliance" },
    { href: "/spenser/economics", label: "Economics" },
  ];

  return (
    <>
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? NAV_ACTIVE : NAV_DEFAULT}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const context = getContext(pathname);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo — always links home */}
        <Link href="/" className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#06b6d4" strokeWidth="1.5" opacity="0.3" />
              <circle cx="16" cy="16" r="8" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
              <circle cx="16" cy="16" r="3" fill="#06b6d4" />
              <line x1="16" y1="2" x2="16" y2="8" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
              <line x1="16" y1="24" x2="16" y2="30" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
              <line x1="2" y1="16" x2="8" y2="16" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
              <line x1="24" y1="16" x2="30" y2="16" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            {context === "spenser" ? (
              <span className="font-[family-name:var(--font-mono)] text-sm font-bold tracking-wider text-[var(--fg-bright)]">
                SPENSER
              </span>
            ) : context === "aerospec" ? (
              <span className="font-[family-name:var(--font-mono)] text-sm font-bold tracking-wider text-[var(--fg-bright)]">
                AEROSPEC
              </span>
            ) : (
              <span className="font-[family-name:var(--font-mono)] text-sm font-bold tracking-wider text-[var(--fg-bright)]">
                AEROSPEC
              </span>
            )}
            {context !== "home" && (
              <span className="rounded border border-[var(--border)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[8px] tracking-wider text-[var(--muted)]">
                {context === "spenser" ? "SFP" : "ACTUATOR"}
              </span>
            )}
          </div>
        </Link>

        {/* Context-aware navigation */}
        <div className="flex items-center gap-1">
          {context === "aerospec" && <AeroSpecNav pathname={pathname} />}
          {context === "spenser" && <SpenserNav pathname={pathname} />}

          {/* Product switcher — always visible */}
          {context !== "home" && (
            <>
              <span className="mx-1.5 h-4 w-px bg-[var(--border)]" />
              {context === "aerospec" ? (
                <Link
                  href="/spenser"
                  className={`${NAV_LINK} text-[var(--accent-secondary)] border border-[var(--accent-secondary)]/30 hover:bg-[var(--accent-secondary)]/10`}
                >
                  Switch to Spenser
                </Link>
              ) : (
                <Link
                  href="/catalog"
                  className={`${NAV_LINK} text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/10`}
                >
                  Switch to AeroSpec
                </Link>
              )}
            </>
          )}

          {/* Home: show both product CTAs */}
          {context === "home" && (
            <>
              <Link
                href="/catalog"
                className="btn-secondary rounded-lg px-4 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide no-underline"
              >
                AeroSpec
              </Link>
              <Link
                href="/spenser"
                className="btn-primary ml-1 rounded-lg px-4 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide no-underline"
              >
                Spenser SFP
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
