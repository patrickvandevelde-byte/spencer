"use client";

import { useState, useEffect } from "react";
import { getCart, removeFromCart, updateCartQuantity, clearCart, createOrder } from "@/lib/store";
import type { CartItem, OrderItem } from "@/lib/store";
import { ACTUATORS } from "@/lib/data";
import Link from "next/link";
import { ActuatorIllustration, ACTUATOR_COLORS } from "@/components/ActuatorIllustrations";

function getUnitPrice(actuatorId: string, qty: number, orderType: "sample" | "bulk"): number {
  const act = ACTUATORS.find((a) => a.id === actuatorId);
  if (!act) return 0;
  if (orderType === "bulk" && qty >= 1000) return act.price_usd * 0.75;
  if (orderType === "bulk" && qty >= 500) return act.price_usd * 0.85;
  return act.price_usd;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [poNumber, setPoNumber] = useState("");

  useEffect(() => {
    setCart(getCart());
  }, []);

  const cartTotal = cart.reduce((sum, item) => {
    const price = getUnitPrice(item.actuatorId, item.quantity, item.orderType);
    return sum + price * item.quantity;
  }, 0);

  function handleRemove(actuatorId: string) {
    const updated = removeFromCart(actuatorId);
    setCart(updated);
  }

  function handleUpdateQty(actuatorId: string, qty: number) {
    if (qty < 1) return;
    const updated = updateCartQuantity(actuatorId, qty);
    setCart(updated);
  }

  function handleCheckout() {
    const items: OrderItem[] = cart.map((item) => {
      const act = ACTUATORS.find((a) => a.id === item.actuatorId);
      const unitPrice = getUnitPrice(item.actuatorId, item.quantity, item.orderType);
      return {
        actuatorId: item.actuatorId,
        sku: act?.sku || "",
        name: act?.name || "",
        quantity: item.quantity,
        unitPrice,
        orderType: item.orderType,
      };
    });
    const order = createOrder(items, cartTotal);
    clearCart();
    setCart([]);
    setOrderPlaced(true);
    setPoNumber(order.poNumber);
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-lg space-y-8 py-12">
        <div className="glass-bright rounded-xl p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--success)] bg-[var(--success)]/10">
            <svg className="h-8 w-8 text-[var(--success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="mb-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--success)]">
            Order Placed
          </p>
          <h1 className="mb-2 text-2xl font-bold text-[var(--fg-bright)]">{poNumber}</h1>
          <p className="text-sm text-[var(--muted)]">Your order has been confirmed and is being processed.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/orders" className="btn-primary rounded-lg px-5 py-2.5 font-[family-name:var(--font-mono)] text-[11px] tracking-wider no-underline">
              Track Order
            </Link>
            <Link href="/configure" className="btn-secondary rounded-lg px-5 py-2.5 font-[family-name:var(--font-mono)] text-[11px] tracking-wider no-underline">
              New Configuration
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--accent)]">CART</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-[var(--fg-bright)]">Shopping Cart</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Review items before placing your procurement order.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="glass-bright rounded-xl p-12 text-center">
          <svg className="mx-auto mb-4 h-12 w-12 text-[var(--muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          <p className="text-sm text-[var(--muted)]">Your cart is empty.</p>
          <Link href="/configure" className="btn-primary mt-4 inline-block rounded-lg px-6 py-2.5 font-[family-name:var(--font-mono)] text-xs tracking-wider no-underline">
            Configure Actuators
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart items */}
          <div className="space-y-3 lg:col-span-2">
            {cart.map((item) => {
              const act = ACTUATORS.find((a) => a.id === item.actuatorId);
              if (!act) return null;
              const color = ACTUATOR_COLORS[act.type] || "#06b6d4";
              const unitPrice = getUnitPrice(item.actuatorId, item.quantity, item.orderType);
              const lineTotal = unitPrice * item.quantity;

              return (
                <div key={item.actuatorId} className="glass rounded-xl p-5 transition-all hover:border-[var(--border-bright)]">
                  <div className="flex items-center gap-4">
                    <ActuatorIllustration type={act.type} size={56} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold" style={{ color }}>{act.sku}</span>
                        <span className="text-xs text-[var(--muted)]">{act.name}</span>
                        <span className="rounded-md border border-[var(--border)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase text-[var(--muted)]">
                          {item.orderType}
                        </span>
                      </div>
                      <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
                        ${unitPrice.toFixed(2)} / unit
                        {item.quantity >= 500 && (
                          <span className="ml-2 text-[var(--success)]">
                            {item.quantity >= 1000 ? "25% off" : "15% off"}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-lg border border-[var(--border)]">
                        <button
                          onClick={() => handleUpdateQty(item.actuatorId, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-[var(--muted)] hover:text-[var(--fg-bright)] transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--fg-bright)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.actuatorId, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-[var(--muted)] hover:text-[var(--fg-bright)] transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="w-24 text-right font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--fg-bright)]">
                        ${lineTotal.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemove(item.actuatorId)}
                        className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="glass-bright rounded-xl p-6 h-fit sticky top-24">
            <h2 className="mb-5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--muted)]">
              Order Summary
            </h2>
            <div className="space-y-3 text-xs">
              {cart.map((item) => {
                const act = ACTUATORS.find((a) => a.id === item.actuatorId);
                const unitPrice = getUnitPrice(item.actuatorId, item.quantity, item.orderType);
                return (
                  <div key={item.actuatorId} className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-[var(--muted)]">{act?.sku} x{item.quantity}</span>
                    <span className="font-[family-name:var(--font-mono)] text-[var(--fg-bright)]">${(unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
              <div className="flex justify-between pt-2">
                <span className="text-sm font-bold text-[var(--fg-bright)]">Total</span>
                <span className="text-xl font-bold text-[var(--accent)]">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="btn-primary mt-6 w-full rounded-lg px-6 py-3.5 font-[family-name:var(--font-mono)] text-xs tracking-wider"
            >
              Place Order
            </button>
            <p className="mt-3 text-center font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
              Volume discounts applied automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
