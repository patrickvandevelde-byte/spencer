"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ACTUATORS } from "@/lib/data";
import Link from "next/link";

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

  const sampleQty = Math.min(qty, 10);
  const unitPrice =
    orderType === "bulk" && qty >= 1000
      ? actuator.price_usd * 0.75
      : orderType === "bulk" && qty >= 500
        ? actuator.price_usd * 0.85
        : actuator.price_usd;
  const total = unitPrice * (orderType === "sample" ? sampleQty : qty);

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="space-y-8">
        <div className="border border-[var(--success)] bg-[var(--surface)] p-8 text-center">
          <p className="mb-2 text-[10px] uppercase tracking-widest" style={{ color: "var(--success)" }}>
            Order Confirmed
          </p>
          <h1 className="mb-4 text-xl font-bold">PO #{Date.now().toString(36).toUpperCase()}</h1>
          <div className="mx-auto max-w-sm space-y-2 text-xs">
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Item</span>
              <strong>{actuator.sku} — {actuator.name}</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Type</span>
              <strong>{orderType === "sample" ? "Sample Order" : "Bulk PO"}</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Quantity</span>
              <strong>{orderType === "sample" ? sampleQty : qty} units</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Unit Price</span>
              <strong>${unitPrice.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>
          <p className="mt-6 text-[10px] text-[var(--muted)]">
            Est. Lead Time: {actuator.leadTime_days} business days
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/configure"
              className="border border-[var(--border)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--muted)] no-underline hover:text-[var(--fg)]"
            >
              New Configuration
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="border border-[var(--accent)] bg-[var(--accent)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--bg)] hover:bg-transparent hover:text-[var(--accent)]"
            >
              Place Another Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-widest text-[var(--muted)]">
          Procurement
        </p>
        <h1 className="text-xl font-bold">Order Actuators</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Form */}
        <div className="space-y-6 border border-[var(--border)] bg-[var(--surface)] p-6">
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Select Actuator
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs focus:border-[var(--accent)] focus:outline-none"
            >
              {ACTUATORS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.sku} — {a.name} (${a.price_usd.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Order Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setOrderType("sample")}
                className={`flex-1 border px-4 py-2 text-xs uppercase tracking-widest ${
                  orderType === "sample"
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"
                }`}
              >
                Sample (1-10)
              </button>
              <button
                onClick={() => setOrderType("bulk")}
                className={`flex-1 border px-4 py-2 text-xs uppercase tracking-widest ${
                  orderType === "bulk"
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"
                }`}
              >
                Bulk PO
              </button>
            </div>
          </div>

          {orderType === "bulk" && (
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Quantity
              </label>
              <input
                type="number"
                min={11}
                max={100000}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs focus:border-[var(--accent)] focus:outline-none"
              />
              {qty >= 500 && (
                <p className="mt-1 text-[10px]" style={{ color: "var(--success)" }}>
                  Volume discount applied: {qty >= 1000 ? "25%" : "15%"} off
                </p>
              )}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-4 text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Order Summary
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Item</span>
              <strong>{actuator.sku}</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Description</span>
              <strong>{actuator.name}</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Quantity</span>
              <strong>{orderType === "sample" ? sampleQty : qty}</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Unit Price</span>
              <strong>${unitPrice.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted)]">Lead Time</span>
              <strong>{actuator.leadTime_days} days</strong>
            </div>
            <div className="flex justify-between pt-2 text-sm">
              <span className="font-bold">Total</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-xs uppercase tracking-widest text-[var(--bg)] hover:bg-transparent hover:text-[var(--accent)]"
          >
            {orderType === "sample" ? "Request Sample" : "Generate Purchase Order"}
          </button>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-4 text-[10px] uppercase tracking-widest text-[var(--muted)]">
          Volume Pricing — {actuator.sku}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--code-bg)] text-left text-[10px] uppercase tracking-widest text-[var(--muted)]">
                <th className="px-4 py-2">Tier</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Unit Price</th>
                <th className="px-4 py-2">Discount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--border)]">
                <td className="px-4 py-2">Sample</td>
                <td className="px-4 py-2">1–10</td>
                <td className="px-4 py-2">${actuator.price_usd.toFixed(2)}</td>
                <td className="px-4 py-2 text-[var(--muted)]">—</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="px-4 py-2">Standard</td>
                <td className="px-4 py-2">11–499</td>
                <td className="px-4 py-2">${actuator.price_usd.toFixed(2)}</td>
                <td className="px-4 py-2 text-[var(--muted)]">—</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="px-4 py-2">Volume</td>
                <td className="px-4 py-2">500–999</td>
                <td className="px-4 py-2">${(actuator.price_usd * 0.85).toFixed(2)}</td>
                <td className="px-4 py-2" style={{ color: "var(--success)" }}>15% off</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="px-4 py-2">Enterprise</td>
                <td className="px-4 py-2">1,000+</td>
                <td className="px-4 py-2">${(actuator.price_usd * 0.75).toFixed(2)}</td>
                <td className="px-4 py-2" style={{ color: "var(--success)" }}>25% off</td>
              </tr>
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
        <div className="py-12 text-center text-xs text-[var(--muted)]">Loading...</div>
      }
    >
      <ProcurementContent />
    </Suspense>
  );
}
