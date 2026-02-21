// ============================================================
// AeroSpec — Client-Side Persistence Layer
// localStorage-backed state for saved configs, cart, and orders
// ============================================================

export interface SavedConfiguration {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Fluid params
  inputMode: "library" | "custom";
  fluidId: string;
  customFluid?: {
    viscosity: number;
    density: number;
    surfaceTension: number;
    solventClass: string;
    rheology: string;
    powerLawN: number;
    particleSize: number;
  };
  // Operating conditions
  pressure: number;
  // Result snapshot
  topActuatorId?: string;
  topScore?: number;
}

export interface CartItem {
  actuatorId: string;
  quantity: number;
  orderType: "sample" | "bulk";
  addedAt: string;
  // Snapshot of context
  fluidId?: string;
  pressure?: number;
}

export interface Order {
  id: string;
  poNumber: string;
  createdAt: string;
  status: "confirmed" | "processing" | "shipped" | "delivered";
  items: OrderItem[];
  totalUsd: number;
  estimatedDelivery: string;
}

export interface OrderItem {
  actuatorId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  orderType: "sample" | "bulk";
}

// ---- Generic helpers ----
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Saved Configurations ----
const CONFIGS_KEY = "aerospec_configs";

export function getSavedConfigs(): SavedConfiguration[] {
  return getItem<SavedConfiguration[]>(CONFIGS_KEY, []);
}

export function saveConfig(config: Omit<SavedConfiguration, "id" | "createdAt" | "updatedAt">): SavedConfiguration {
  const configs = getSavedConfigs();
  const now = new Date().toISOString();
  const saved: SavedConfiguration = {
    ...config,
    id: `cfg_${Date.now().toString(36)}`,
    createdAt: now,
    updatedAt: now,
  };
  configs.unshift(saved);
  setItem(CONFIGS_KEY, configs);
  return saved;
}

export function deleteConfig(id: string): void {
  const configs = getSavedConfigs().filter((c) => c.id !== id);
  setItem(CONFIGS_KEY, configs);
}

export function updateConfig(id: string, updates: Partial<SavedConfiguration>): void {
  const configs = getSavedConfigs().map((c) =>
    c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
  );
  setItem(CONFIGS_KEY, configs);
}

// ---- Shopping Cart ----
const CART_KEY = "aerospec_cart";

export function getCart(): CartItem[] {
  return getItem<CartItem[]>(CART_KEY, []);
}

export function addToCart(item: Omit<CartItem, "addedAt">): CartItem[] {
  const cart = getCart();
  const existing = cart.find(
    (c) => c.actuatorId === item.actuatorId && c.orderType === item.orderType
  );
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push({ ...item, addedAt: new Date().toISOString() });
  }
  setItem(CART_KEY, cart);
  return cart;
}

export function removeFromCart(actuatorId: string): CartItem[] {
  const cart = getCart().filter((c) => c.actuatorId !== actuatorId);
  setItem(CART_KEY, cart);
  return cart;
}

export function updateCartQuantity(actuatorId: string, quantity: number): CartItem[] {
  const cart = getCart().map((c) =>
    c.actuatorId === actuatorId ? { ...c, quantity } : c
  );
  setItem(CART_KEY, cart);
  return cart;
}

export function clearCart(): void {
  setItem(CART_KEY, []);
}

export function getCartCount(): number {
  return getCart().length;
}

// ---- Orders ----
const ORDERS_KEY = "aerospec_orders";

export function getOrders(): Order[] {
  return getItem<Order[]>(ORDERS_KEY, []);
}

export function createOrder(items: OrderItem[], totalUsd: number): Order {
  const orders = getOrders();
  const leadDays = Math.max(...items.map(() => 14)); // Simplified
  const delivery = new Date();
  delivery.setDate(delivery.getDate() + leadDays);

  const order: Order = {
    id: `ord_${Date.now().toString(36)}`,
    poNumber: `PO-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "confirmed",
    items,
    totalUsd,
    estimatedDelivery: delivery.toISOString(),
  };
  orders.unshift(order);
  setItem(ORDERS_KEY, orders);
  return order;
}

// ---- Analytics Tracking ----
const ANALYTICS_KEY = "aerospec_analytics";

interface AnalyticsEvent {
  type: "prediction" | "comparison" | "order" | "config_save" | "export";
  timestamp: string;
  data: Record<string, string | number>;
}

export function trackEvent(type: AnalyticsEvent["type"], data: Record<string, string | number>): void {
  const events = getItem<AnalyticsEvent[]>(ANALYTICS_KEY, []);
  events.push({ type, timestamp: new Date().toISOString(), data });
  // Keep last 500 events
  if (events.length > 500) events.splice(0, events.length - 500);
  setItem(ANALYTICS_KEY, events);
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  return getItem<AnalyticsEvent[]>(ANALYTICS_KEY, []);
}

// ---- Stock Simulation ----
// Simulated inventory levels per actuator (seeded from SKU hash)
export function getStockLevel(actuatorId: string): { inStock: number; status: "in_stock" | "low_stock" | "out_of_stock" | "made_to_order" } {
  // Deterministic pseudo-random from id
  let hash = 0;
  for (let i = 0; i < actuatorId.length; i++) {
    hash = ((hash << 5) - hash + actuatorId.charCodeAt(i)) | 0;
  }
  const base = Math.abs(hash % 1000);

  if (base < 50) return { inStock: 0, status: "out_of_stock" };
  if (base < 150) return { inStock: Math.abs(hash % 20) + 5, status: "low_stock" };
  if (base < 800) return { inStock: Math.abs(hash % 500) + 50, status: "in_stock" };
  return { inStock: 0, status: "made_to_order" };
}
