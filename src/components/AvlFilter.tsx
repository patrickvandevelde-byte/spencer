"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAvl, setAvl, type AvlState, type AvlMode } from "@/lib/store";

type Props = {
  // Known manufacturers in the loaded catalog. We pass them in so
  // the component doesn't have to import the full data module.
  manufacturers: string[];
  // Total SKU count for the "X of Y SKUs visible" line.
  totalSkus: number;
  // Filtered SKU count after applying the AVL.
  visibleSkus: number;
  // Called whenever the user changes the AVL, so the parent can
  // re-run predictions against the new filter set.
  onChange?: (next: AvlState) => void;
  // Compact display for sidebar / inline embedding.
  compact?: boolean;
};

export function AvlFilter({
  manufacturers,
  totalSkus,
  visibleSkus,
  onChange,
  compact = false,
}: Props) {
  const [state, setState] = useState<AvlState | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setState(getAvl());
  }, []);

  if (!state) return null;

  function commit(next: Partial<AvlState>) {
    const saved = setAvl(next);
    setState(saved);
    onChange?.(saved);
  }

  function toggleMfr(m: string) {
    const has = state!.manufacturers.includes(m);
    commit({
      manufacturers: has
        ? state!.manufacturers.filter((x) => x !== m)
        : [...state!.manufacturers, m],
    });
  }

  function setMode(mode: AvlMode) {
    commit({ mode });
  }

  const filterActive = state.mode !== "all" || state.excludedSkus.length > 0;

  return (
    <div
      className={
        compact
          ? "rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3"
          : "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
      }
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              Approved Vendor List
            </span>
            {filterActive && (
              <span className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                Active
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-[var(--fg-bright)]">
            <strong className="tabular-nums">{visibleSkus}</strong> of{" "}
            <span className="tabular-nums">{totalSkus}</span> SKUs visible
            {state.mode === "whitelist" &&
              state.manufacturers.length > 0 && (
                <span className="text-[var(--muted)]">
                  {" "}
                  &middot; whitelisting {state.manufacturers.length}{" "}
                  manufacturer{state.manufacturers.length === 1 ? "" : "s"}
                </span>
              )}
            {state.mode === "blacklist" &&
              state.manufacturers.length > 0 && (
                <span className="text-[var(--muted)]">
                  {" "}
                  &middot; blocking {state.manufacturers.length}
                </span>
              )}
            {state.excludedSkus.length > 0 && (
              <span className="text-[var(--muted)]">
                {" "}
                &middot; {state.excludedSkus.length} SKU
                {state.excludedSkus.length === 1 ? "" : "s"} excluded
              </span>
            )}
          </p>
        </div>
        <span
          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-[var(--muted)] transition-transform"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          +
        </span>
      </button>

      {open && (
        <div className="mt-4 space-y-4 border-t border-[var(--border)] pt-4">
          <fieldset>
            <legend className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Mode
            </legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { v: "all" as const, label: "Show all" },
                  { v: "whitelist" as const, label: "Whitelist (my AVL)" },
                  { v: "blacklist" as const, label: "Blacklist" },
                ] as const
              ).map((opt) => {
                const active = state.mode === opt.v;
                return (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setMode(opt.v)}
                    aria-pressed={active}
                    className={
                      active
                        ? "rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white"
                        : "rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--fg)] hover:border-[var(--border-hover)]"
                    }
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {state.mode !== "all" && (
            <fieldset>
              <legend className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Manufacturers
              </legend>
              <div className="flex flex-wrap gap-2">
                {manufacturers.map((m) => {
                  const checked = state.manufacturers.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMfr(m)}
                      aria-pressed={checked}
                      className={
                        checked
                          ? "rounded-full border border-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
                          : "rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--fg-secondary)] hover:border-[var(--border-hover)]"
                      }
                    >
                      {checked ? "✓ " : ""}
                      {m}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <p className="text-[10px] leading-relaxed text-[var(--muted)]">
              Stored locally. Pro+ tiers sync the AVL to your tenant and
              share it across seats.{" "}
              <Link
                href="/settings/avl"
                className="text-[var(--accent)] underline-offset-2 hover:underline"
              >
                Manage SKU exclusions &rarr;
              </Link>
            </p>
            {filterActive && (
              <button
                type="button"
                onClick={() =>
                  commit({
                    mode: "all",
                    manufacturers: [],
                    excludedSkus: [],
                  })
                }
                className="text-[10px] text-[var(--muted)] underline-offset-2 hover:text-[var(--fg)] hover:underline"
              >
                Reset AVL
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
