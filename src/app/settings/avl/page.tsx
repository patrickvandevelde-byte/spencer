"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ACTUATORS } from "@/lib/data";
import { getAvl, setAvl, type AvlState } from "@/lib/store";

export default function AvlSettingsPage() {
  const [state, setStateLocal] = useState<AvlState | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setStateLocal(getAvl());
  }, []);

  if (!state) {
    return (
      <div className="py-12 text-center text-sm text-[var(--muted)]">
        Loading AVL…
      </div>
    );
  }

  function commit(next: Partial<AvlState>) {
    setStateLocal(setAvl(next));
  }

  function toggleSku(sku: string) {
    const has = state!.excludedSkus.includes(sku);
    commit({
      excludedSkus: has
        ? state!.excludedSkus.filter((s) => s !== sku)
        : [...state!.excludedSkus, sku],
    });
  }

  const manufacturers = Array.from(
    new Set(ACTUATORS.map((a) => a.manufacturer))
  ).sort();

  const filtered = ACTUATORS.filter((a) => {
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return (
      a.sku.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.manufacturer.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-10 py-8">
      <section className="mx-auto max-w-3xl">
        <Link
          href="/configure"
          className="text-xs text-[var(--muted)] no-underline hover:text-[var(--fg)]"
        >
          &larr; Back to Configure
        </Link>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--fg-bright)]">
          Approved Vendor List
        </h1>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--fg-secondary)]">
          Pre-screen actuator recommendations to suppliers you actually buy
          from. The configurator will hide SKUs outside this list and rank
          the rest as normal.
        </p>
      </section>

      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-3 text-sm font-semibold text-[var(--fg-bright)]">
            1 &middot; Mode
          </h2>
          <div className="flex flex-wrap gap-2">
            {(
              [
                {
                  v: "all" as const,
                  label: "Show all",
                  body: "No filter applied.",
                },
                {
                  v: "whitelist" as const,
                  label: "Whitelist (default)",
                  body: "Show only SKUs from the manufacturers below.",
                },
                {
                  v: "blacklist" as const,
                  label: "Blacklist",
                  body: "Show everything except SKUs from the manufacturers below.",
                },
              ] as const
            ).map((opt) => {
              const active = state.mode === opt.v;
              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => commit({ mode: opt.v })}
                  className={
                    active
                      ? "rounded-xl border border-[var(--accent)] bg-[var(--accent)]/8 px-4 py-3 text-left"
                      : "rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-left hover:border-[var(--border-hover)]"
                  }
                >
                  <p className="text-xs font-semibold text-[var(--fg-bright)]">
                    {opt.label}
                  </p>
                  <p className="mt-1 text-[10px] text-[var(--muted)]">
                    {opt.body}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-3 text-sm font-semibold text-[var(--fg-bright)]">
            2 &middot; Manufacturers
          </h2>
          <p className="mb-3 text-[11px] text-[var(--muted)]">
            Selected: {state.manufacturers.length || 0}
          </p>
          <div className="flex flex-wrap gap-2">
            {manufacturers.map((m) => {
              const has = state.manufacturers.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() =>
                    commit({
                      manufacturers: has
                        ? state.manufacturers.filter((x) => x !== m)
                        : [...state.manufacturers, m],
                    })
                  }
                  aria-pressed={has}
                  className={
                    has
                      ? "rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white"
                      : "rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--fg)] hover:border-[var(--border-hover)]"
                  }
                >
                  {has ? "✓ " : ""}
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-[var(--fg-bright)]">
              3 &middot; SKU exclusions
            </h2>
            <p className="text-[11px] text-[var(--muted)]">
              {state.excludedSkus.length} excluded
            </p>
          </div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by SKU, name, or manufacturer…"
            className="mb-4 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
          />
          <div className="max-h-[420px] overflow-y-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-[var(--bg-secondary)]">
                <tr>
                  <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                    SKU
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Name
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Mfr
                  </th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Excluded
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const excluded = state.excludedSkus.includes(a.sku);
                  return (
                    <tr
                      key={a.sku}
                      className="border-t border-[var(--border)]"
                    >
                      <td className="px-3 py-2 font-mono text-[11px] text-[var(--fg-bright)]">
                        {a.sku}
                      </td>
                      <td className="px-3 py-2 text-[var(--fg-secondary)]">
                        {a.name}
                      </td>
                      <td className="px-3 py-2 text-[var(--muted)]">
                        {a.manufacturer}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => toggleSku(a.sku)}
                          aria-pressed={excluded}
                          className={
                            excluded
                              ? "rounded-full bg-[var(--danger)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--danger)]"
                              : "rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted)] hover:border-[var(--border-hover)]"
                          }
                        >
                          {excluded ? "Excluded" : "Allow"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-3 text-sm font-semibold text-[var(--fg-bright)]">
            4 &middot; Notes (visible to your team)
          </h2>
          <textarea
            value={state.notes}
            onChange={(e) => commit({ notes: e.target.value })}
            placeholder="e.g. &lsquo;Aptar Q3-2026 quality hold &mdash; revisit Q1 2027.&rsquo;"
            rows={3}
            maxLength={1000}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <p className="text-center text-[11px] text-[var(--muted)]">
          Saved locally to this browser. Pro+ tiers sync the AVL to your
          tenant and share it across seats &middot; last updated{" "}
          {new Date(state.updatedAt).toLocaleString()}
        </p>
      </section>
    </div>
  );
}
