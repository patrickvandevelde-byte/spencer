"use client";

import { useState, useEffect, useMemo } from "react";
import { getAnalyticsEvents, getOrders, getSavedConfigs } from "@/lib/store";
import { ACTUATORS, FLUIDS } from "@/lib/data";
import Link from "next/link";

interface StatCard {
  label: string;
  value: string | number;
  sub: string;
  color: string;
}

export default function AnalyticsPage() {
  const [events, setEvents] = useState<ReturnType<typeof getAnalyticsEvents>>([]);
  const [orders, setOrders] = useState<ReturnType<typeof getOrders>>([]);
  const [configs, setConfigs] = useState<ReturnType<typeof getSavedConfigs>>([]);

  useEffect(() => {
    setEvents(getAnalyticsEvents());
    setOrders(getOrders());
    setConfigs(getSavedConfigs());
  }, []);

  const stats = useMemo<StatCard[]>(() => {
    const predictions = events.filter((e) => e.type === "prediction").length;
    const comparisons = events.filter((e) => e.type === "comparison").length;
    const exports = events.filter((e) => e.type === "export").length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalUsd, 0);
    return [
      { label: "Predictions Run", value: predictions, sub: "Total physics simulations", color: "var(--accent)" },
      { label: "Comparisons", value: comparisons, sub: "Side-by-side analyses", color: "var(--accent-secondary)" },
      { label: "Saved Configs", value: configs.length, sub: "Project configurations", color: "var(--success)" },
      { label: "Orders Placed", value: orders.length, sub: `$${totalRevenue.toFixed(2)} total`, color: "var(--warning)" },
      { label: "Exports", value: exports, sub: "CSV & PDF downloads", color: "var(--muted)" },
      { label: "Catalog Size", value: `${ACTUATORS.length}/${FLUIDS.length}`, sub: "Actuators / Fluids", color: "var(--accent)" },
    ];
  }, [events, orders, configs]);

  // Most-used actuators
  const topActuators = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((e) => {
      if (e.data.actuatorId) {
        const id = String(e.data.actuatorId);
        counts[id] = (counts[id] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, count]) => {
        const act = ACTUATORS.find((a) => a.id === id);
        return { id, count, sku: act?.sku || id, name: act?.name || "Unknown" };
      });
  }, [events]);

  // Most-used fluids
  const topFluids = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((e) => {
      if (e.data.fluidId) {
        const id = String(e.data.fluidId);
        counts[id] = (counts[id] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, count]) => {
        const fl = FLUIDS.find((f) => f.id === id);
        return { id, count, name: fl?.name || id };
      });
  }, [events]);

  // Activity timeline (last 30 days)
  const activityByDay = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days[d.toISOString().split("T")[0]] = 0;
    }
    events.forEach((e) => {
      const day = e.timestamp.split("T")[0];
      if (day in days) days[day]++;
    });
    return Object.entries(days).map(([date, count]) => ({ date, count }));
  }, [events]);

  const maxActivity = Math.max(1, ...activityByDay.map((d) => d.count));

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
          <span className="text-xs font-medium text-[var(--accent)]">ANALYTICS</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-[var(--fg-bright)]">Usage Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Platform metrics, most-used configurations, and procurement insights.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-xl p-5">
            <p className="text-xs font-medium text-[var(--muted)]">{s.label}</p>
            <p className="mt-1 text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Activity heatmap */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-xs font-medium text-[var(--muted)]">
          Activity — Last 30 Days
        </h2>
        {events.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--muted)]">
            No activity tracked yet. Start using the configurator to see data here.
          </p>
        ) : (
          <div className="flex items-end gap-1" style={{ height: 120 }}>
            {activityByDay.map((d) => {
              const h = Math.max(4, (d.count / maxActivity) * 100);
              return (
                <div key={d.date} className="group relative flex-1">
                  <div
                    className="w-full rounded-t-sm bg-[var(--accent)] transition-all hover:bg-[var(--accent-secondary)]"
                    style={{ height: `${h}%`, opacity: d.count > 0 ? 0.3 + (d.count / maxActivity) * 0.7 : 0.1 }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block rounded bg-[var(--surface)] border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--fg-bright)] whitespace-nowrap">
                    {d.date}: {d.count}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-2 flex justify-between text-[11px] text-[var(--muted)]">
          <span>{activityByDay[0]?.date}</span>
          <span>{activityByDay[activityByDay.length - 1]?.date}</span>
        </div>
      </div>

      {/* Top actuators + fluids */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-xs font-medium text-[var(--muted)]">
            Most-Used Actuators
          </h2>
          {topActuators.length === 0 ? (
            <p className="py-4 text-center text-[11px] text-[var(--muted)]">Run predictions to populate</p>
          ) : (
            <div className="space-y-2">
              {topActuators.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2">
                  <span className="text-xs text-[var(--muted)]">#{i + 1}</span>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-[var(--accent)]">{a.sku}</span>
                    <span className="ml-2 text-[11px] text-[var(--muted)]">{a.name}</span>
                  </div>
                  <span className="text-xs text-[var(--fg-bright)]">{a.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-xs font-medium text-[var(--muted)]">
            Most-Used Fluids
          </h2>
          {topFluids.length === 0 ? (
            <p className="py-4 text-center text-[11px] text-[var(--muted)]">Run predictions to populate</p>
          ) : (
            <div className="space-y-2">
              {topFluids.map((f, i) => (
                <div key={f.id} className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2">
                  <span className="text-xs text-[var(--muted)]">#{i + 1}</span>
                  <div className="flex-1">
                    <span className="text-[11px] font-semibold text-[var(--fg-bright)]">{f.name}</span>
                  </div>
                  <span className="text-xs text-[var(--fg-bright)]">{f.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders summary */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-xs font-medium text-[var(--muted)]">
          Recent Orders
        </h2>
        {orders.length === 0 ? (
          <p className="py-4 text-center text-[11px] text-[var(--muted)]">
            No orders placed yet. <Link href="/procurement" className="text-[var(--accent)] underline">Go to procurement</Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="py-2 pr-4 text-left text-xs font-medium text-[var(--muted)]">PO #</th>
                  <th className="py-2 pr-4 text-left text-xs font-medium text-[var(--muted)]">Date</th>
                  <th className="py-2 pr-4 text-left text-xs font-medium text-[var(--muted)]">Items</th>
                  <th className="py-2 pr-4 text-left text-xs font-medium text-[var(--muted)]">Total</th>
                  <th className="py-2 text-left text-xs font-medium text-[var(--muted)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((o) => (
                  <tr key={o.id} className="border-b border-[var(--border)] last:border-b-0">
                    <td className="py-2 pr-4 tabular-nums font-bold text-[var(--fg-bright)]">{o.poNumber}</td>
                    <td className="py-2 pr-4 text-[var(--muted)]">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 pr-4">{o.items.length}</td>
                    <td className="py-2 pr-4 tabular-nums font-bold text-[var(--accent)]">${o.totalUsd.toFixed(2)}</td>
                    <td className="py-2">
                      <span className="rounded-md border px-2 py-0.5 text-[11px] uppercase"
                        style={{
                          borderColor: o.status === "delivered" ? "var(--success)" : o.status === "shipped" ? "var(--accent-secondary)" : "var(--accent)",
                          color: o.status === "delivered" ? "var(--success)" : o.status === "shipped" ? "var(--accent-secondary)" : "var(--accent)",
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        <Link href="/configure" className="btn-primary rounded-lg px-5 py-2.5 text-xs font-medium no-underline">
          New Configuration
        </Link>
        <Link href="/orders" className="btn-secondary rounded-lg px-5 py-2.5 text-xs font-medium no-underline">
          View All Orders
        </Link>
        <Link href="/compare" className="btn-secondary rounded-lg px-5 py-2.5 text-xs font-medium no-underline">
          Compare Actuators
        </Link>
      </div>
    </div>
  );
}
