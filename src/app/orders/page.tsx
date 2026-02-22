"use client";

import { useState, useEffect } from "react";
import { getOrders } from "@/lib/store";
import type { Order } from "@/lib/store";
import { ACTUATORS } from "@/lib/data";
import Link from "next/link";
import { ActuatorIllustration, ACTUATOR_COLORS } from "@/components/ActuatorIllustrations";

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: string }> = {
  confirmed: { color: "var(--accent)", label: "Confirmed", icon: "M20 6L9 17l-5-5" },
  processing: { color: "var(--warning)", label: "Processing", icon: "M12 2v4m0 12v4m-7-7H1m22 0h-4m-2.636-5.364l-2.828 2.828m8.486-8.486l-2.828 2.828M4.222 19.778l2.828-2.828M4.222 4.222l2.828 2.828" },
  shipped: { color: "var(--accent-secondary)", label: "Shipped", icon: "M5 12h14M12 5l7 7-7 7" },
  delivered: { color: "var(--success)", label: "Delivered", icon: "M20 6L9 17l-5-5" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
          <span className="text-xs font-medium text-[var(--accent)]">ORDER TRACKING</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-[var(--fg-bright)]">Your Orders</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Track order status, delivery estimates, and procurement history.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="glass-bright rounded-xl p-12 text-center">
          <svg className="mx-auto mb-4 h-12 w-12 text-[var(--muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="22" height="18" rx="2" />
            <path d="M1 9h22" />
          </svg>
          <p className="text-sm text-[var(--muted)]">No orders yet.</p>
          <Link href="/procurement" className="btn-primary mt-4 inline-block rounded-lg px-6 py-2.5 text-xs font-medium no-underline">
            Place Your First Order
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            const created = new Date(order.createdAt);
            const delivery = new Date(order.estimatedDelivery);
            const now = new Date();
            const totalDays = (delivery.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
            const elapsed = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
            const progress = Math.min(100, Math.max(5, (elapsed / totalDays) * 100));

            return (
              <div key={order.id} className="glass rounded-xl p-6 transition-all hover:border-[var(--border-bright)]">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="tabular-nums text-lg font-bold text-[var(--fg-bright)]">{order.poNumber}</span>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold uppercase"
                        style={{ borderColor: cfg.color, color: cfg.color }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={cfg.icon} />
                        </svg>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Placed {created.toLocaleDateString()} &middot; {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular-nums text-lg font-bold text-[var(--accent)]">
                      ${order.totalUsd.toFixed(2)}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      Est. delivery: {delivery.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-[var(--muted)]">
                    <span>Ordered</span>
                    <span>Processing</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--surface)]">
                    <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: cfg.color }} />
                  </div>
                </div>

                {/* Items */}
                <div className="mt-4 space-y-2">
                  {order.items.map((item, i) => {
                    const act = ACTUATORS.find((a) => a.id === item.actuatorId);
                    const color = act ? ACTUATOR_COLORS[act.type] || "#06b6d4" : "#06b6d4";
                    return (
                      <div key={i} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5">
                        {act && <div className="pattern-dark"><ActuatorIllustration type={act.type} size={32} /></div>}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                            <span className="text-xs font-bold" style={{ color }}>{item.sku}</span>
                            <span className="text-[11px] text-[var(--muted)]">{item.name}</span>
                          </div>
                        </div>
                        <span className="text-xs text-[var(--muted)]">
                          {item.quantity} &times; ${item.unitPrice.toFixed(2)}
                        </span>
                        <span className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[11px] uppercase text-[var(--muted)]">
                          {item.orderType}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
