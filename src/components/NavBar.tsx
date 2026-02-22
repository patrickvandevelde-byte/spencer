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
  "px-3 py-1.5 text-xs font-medium no-underline transition-colors rounded-full";
const NAV_DEFAULT = `${NAV_LINK} text-[var(--muted)] hover:text-[var(--fg)]`;
const NAV_ACTIVE = `${NAV_LINK} text-[var(--fg)] bg-[var(--bg-secondary)]`;

function AeroSpecNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/catalog", label: "Catalog" },
    { href: "/configure", label: "Configure" },
    { href: "/compare", label: "Compare" },
    { href: "/procurement", label: "Procure" },
    { href: "/orders", label: "Orders" },
    { href: "/analytics", label: "Analytics" },
    { href: "/cart", label: "Cart" },
  ];

  return (
    <>
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
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
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--border)] bg-[rgba(255,255,255,0.72)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-[980px] items-center justify-between px-6 h-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline transition-opacity hover:opacity-60">
          <span className="text-sm font-semibold tracking-tight text-[var(--fg-bright)]">
            {context === "spenser" ? "Spenser" : context === "aerospec" ? "AeroSpec" : "AeroSpec"}
          </span>
          {context !== "home" && (
            <span className="rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]">
              {context === "spenser" ? "SFP" : "Actuator"}
            </span>
          )}
        </Link>

        {/* Context-aware navigation */}
        <div className="flex items-center gap-0.5">
          {context === "aerospec" && <AeroSpecNav pathname={pathname} />}
          {context === "spenser" && <SpenserNav pathname={pathname} />}

          {/* Product switcher */}
          {context !== "home" && (
            <>
              <span className="mx-2 h-4 w-px bg-[var(--border)]" />
              {context === "aerospec" ? (
                <Link
                  href="/spenser"
                  className={`${NAV_LINK} text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)]/8`}
                >
                  Spenser
                </Link>
              ) : (
                <Link
                  href="/catalog"
                  className={`${NAV_LINK} text-[var(--accent)] hover:bg-[var(--accent)]/8`}
                >
                  AeroSpec
                </Link>
              )}
            </>
          )}

          {/* Home: show both product links */}
          {context === "home" && (
            <>
              <Link
                href="/catalog"
                className="rounded-full px-4 py-1.5 text-xs font-medium text-[var(--accent)] no-underline transition-colors hover:bg-[var(--accent)]/8"
              >
                AeroSpec
              </Link>
              <Link
                href="/spenser"
                className="btn-primary ml-1 px-4 py-1.5 text-xs no-underline"
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
