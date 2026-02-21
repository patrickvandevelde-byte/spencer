"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ACTUATORS } from "@/lib/data";
import Link from "next/link";
import { ActuatorIllustration, ACTUATOR_COLORS } from "@/components/ActuatorIllustrations";
import { getStockLevel, createOrder, addToCart } from "@/lib/store";

function ProcurementContent() {
  const params = useSearchParams();
  const actuatorId = params.get("actuator");
  const initialQty = Number(params.get("qty")) || 100;

  const [selectedId, setSelectedId] = useState(actuatorId || ACTUATORS[0].id);
  const [qty, setQty] = useState(initialQty);
  const [orderType, setOrderType] = useState<"sample" | "bulk">("sample");
  const [submitted, setSubmitted] = useState(false);

  const actuator = ACTUATORS.find((a) => a.id === selectedId);
  if (!actuator) return null;

  const color = ACTUATOR_COLORS[actuator.type] || "#06b6d4";
  const sampleQty = Math.min(qty, 10);
  const unitPrice =
    orderType === "bulk" && qty >= 1000
      ? actuator.price_usd * 0.75
      : orderType === "bulk" && qty >= 500
        ? actuator.price_usd * 0.85
        : actuator.price_usd;
  const total = unitPrice * (orderType === "sample" ? sampleQty : qty);

  const stock = getStockLevel(selectedId);
  const stockColor = stock.status === "in_stock" ? "var(--success)" : stock.status === "low_stock" ? "var(--warning)" : stock.status === "out_of_stock" ? "var(--danger)" : "var(--muted)";
  const stockLabel = stock.status === "in_stock" ? `In Stock (${stock.inStock} units)` : stock.status === "low_stock" ? `Low Stock (${stock.inStock} left)` : stock.status === "out_of_stock" ? "Out of Stock" : "Made to Order";

  function handleSubmit() {
    if (!actuator) return;
    createOrder([{
      actuatorId: selectedId,
      sku: actuator.sku,
      name: actuator.name,
      quantity: orderType === "sample" ? sampleQty : qty,
      unitPrice,
      orderType,
    }], total);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg space-y-8 py-12">
        <div className="glass-bright rounded-xl p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--success)] bg-[var(--success)]/10">
            <svg className="h-8 w-8 text-[var(--success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <p className="mb-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--success)]">
            Order Confirmed
          </p>
          <h1 className="mb-6 text-2xl font-bold text-[var(--fg-bright)]">
            PO #{Date.now().toString(36).toUpperCase()}
          </h1>
          <div className="mx-auto max-w-sm space-y-3 text-xs">
            {[
              { label: "Item", value: `${actuator.sku} — ${actuator.name}` },
              { label: "Type", value: orderType === "sample" ? "Sample Order" : "Bulk PO" },
              { label: "Quantity", value: `${orderType === "sample" ? sampleQty : qty} units` },
              { label: "Unit Price", value: `$${unitPrice.toFixed(2)}` },
              { label: "Total", value: `$${total.toFixed(2)}` },
            ].map((item, i, arr) => (
              <div key={item.label} className={`flex justify-between pb-2 ${i < arr.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
                <span className="text-[var(--muted)]">{item.label}</span>
                <strong className="text-[var(--fg-bright)]">{item.value}</strong>
              </div>
            ))}
          </div>
          <p className="mt-6 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
            Est. Lead Time: {actuator.leadTime_days} business days
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/configure"
              className="btn-secondary rounded-lg px-5 py-2.5 font-[family-name:var(--font-mono)] text-[11px] tracking-wider no-underline"
            >
              New Configuration
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-primary rounded-lg px-5 py-2.5 font-[family-name:var(--font-mono)] text-[11px] tracking-wider"
            >
              Place Another Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--accent)]">PROCUREMENT</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-[var(--fg-bright)]">
          Order Actuators
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Request samples or place bulk purchase orders
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Form */}
        <div className="glass rounded-xl p-6">
          <div className="space-y-6">
            {/* Actuator preview */}
            <div className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
              <ActuatorIllustration type={actuator.type} size={64} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider" style={{ color }}>
                    {actuator.sku}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-[var(--fg-bright)]">{actuator.name}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] font-bold" style={{ borderColor: stockColor, color: stockColor }}>
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stockColor }} />
                  {stockLabel}
                </span>
                <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
                  Lead: {actuator.leadTime_days} days
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Select Actuator
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="input-field w-full rounded-lg px-4 py-3 font-[family-name:var(--font-mono)] text-xs"
              >
                {ACTUATORS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.sku} — {a.name} (${a.price_usd.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Order Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setOrderType("sample")}
                  className={`flex-1 rounded-lg border px-4 py-3 font-[family-name:var(--font-mono)] text-xs tracking-wider transition-all ${
                    orderType === "sample"
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] shadow-[var(--glow)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  Sample (1-10)
                </button>
                <button
                  onClick={() => setOrderType("bulk")}
                  className={`flex-1 rounded-lg border px-4 py-3 font-[family-name:var(--font-mono)] text-xs tracking-wider transition-all ${
                    orderType === "bulk"
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] shadow-[var(--glow)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  Bulk PO
                </button>
              </div>
            </div>

            {orderType === "bulk" && (
              <div className="animate-in">
                <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                  Quantity
                </label>
                <input
                  type="number"
                  min={11}
                  max={100000}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="input-field w-full rounded-lg px-4 py-3 font-[family-name:var(--font-mono)] text-xs"
                />
                {qty >= 500 && (
                  <p className="mt-1.5 flex items-center gap-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--success)]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Volume discount: {qty >= 1000 ? "25%" : "15%"} off
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass-bright rounded-xl p-6">
          <h2 className="mb-5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--muted)]">
            Order Summary
          </h2>
          <div className="space-y-4 text-xs">
            {[
              { label: "Item", value: actuator.sku },
              { label: "Description", value: actuator.name },
              { label: "Quantity", value: String(orderType === "sample" ? sampleQty : qty) },
              { label: "Unit Price", value: `$${unitPrice.toFixed(2)}` },
              { label: "Lead Time", value: `${actuator.leadTime_days} days` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between border-b border-[var(--border)] pb-3">
                <span className="text-[var(--muted)]">{item.label}</span>
                <strong className="font-[family-name:var(--font-mono)] text-[var(--fg-bright)]">{item.value}</strong>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span className="text-sm font-bold text-[var(--fg-bright)]">Total</span>
              <span className="text-lg font-bold text-[var(--accent)]">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="btn-primary mt-8 w-full rounded-lg px-6 py-3.5 font-[family-name:var(--font-mono)] text-xs tracking-wider"
          >
            {orderType === "sample" ? "Request Sample" : "Generate Purchase Order"}
          </button>
          <button
            onClick={() => {
              addToCart({
                actuatorId: selectedId,
                quantity: orderType === "sample" ? sampleQty : qty,
                orderType,
              });
              alert(`Added ${actuator.sku} to cart`);
            }}
            className="btn-secondary mt-3 w-full rounded-lg px-6 py-3 font-[family-name:var(--font-mono)] text-xs tracking-wider flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            Add to Cart Instead
          </button>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--muted)]">
          Volume Pricing — {actuator.sku}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-5 py-3 text-left font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Tier</th>
                <th className="px-5 py-3 text-left font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Quantity</th>
                <th className="px-5 py-3 text-left font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Unit Price</th>
                <th className="px-5 py-3 text-left font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">Discount</th>
              </tr>
            </thead>
            <tbody>
              {[
                { tier: "Sample", qty: "1–10", price: actuator.price_usd, discount: null },
                { tier: "Standard", qty: "11–499", price: actuator.price_usd, discount: null },
                { tier: "Volume", qty: "500–999", price: actuator.price_usd * 0.85, discount: "15% off" },
                { tier: "Enterprise", qty: "1,000+", price: actuator.price_usd * 0.75, discount: "25% off" },
              ].map((row) => (
                <tr key={row.tier} className="table-row-hover border-b border-[var(--border)] last:border-b-0">
                  <td className="px-5 py-3 text-[var(--fg-bright)]">{row.tier}</td>
                  <td className="px-5 py-3 font-[family-name:var(--font-mono)]">{row.qty}</td>
                  <td className="px-5 py-3 font-[family-name:var(--font-mono)]">${row.price.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    {row.discount ? (
                      <span className="rounded-md border border-[var(--success)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold text-[var(--success)]">
                        {row.discount}
                      </span>
                    ) : (
                      <span className="text-[var(--muted)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ProcurementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <svg className="h-8 w-8 animate-spin text-[var(--accent)]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
            <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      }
    >
      <ProcurementContent />
    </Suspense>
  );
}
