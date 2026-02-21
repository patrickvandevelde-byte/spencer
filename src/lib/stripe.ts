import Stripe from 'stripe';

// Lazy initialization — only crashes when Stripe is actually called,
// not when the module is imported.  The core prediction app never
// touches Stripe, so no env var is needed to run it.
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  return new Stripe(key);
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getStripe(), prop, receiver);
  },
});

// ============================================================================
// PLAN DEFINITIONS
// ============================================================================

export const PLANS = {
  starter: {
    name: 'Starter',
    stripePriceId: process.env.STRIPE_PRICE_ID_STARTER || 'price_starter',
    priceInCents: 50000, // $500/month
    features: {
      max_users: 1,
      max_configurations: 50,
      api_access: false,
      procurement_discount: 0.1, // 10%
      support: 'email',
    },
  },
  professional: {
    name: 'Professional',
    stripePriceId: process.env.STRIPE_PRICE_ID_PROFESSIONAL || 'price_professional',
    priceInCents: 200000, // $2,000/month
    features: {
      max_users: 5,
      max_configurations: -1, // unlimited
      api_access: true,
      api_quota: 10000, // calls per month
      procurement_discount: 0.15, // 15%
      support: 'priority_email',
    },
  },
  enterprise: {
    name: 'Enterprise',
    stripePriceId: process.env.STRIPE_PRICE_ID_ENTERPRISE || 'price_enterprise',
    priceInCents: 500000, // $5,000/month (minimum)
    features: {
      max_users: -1, // unlimited
      max_configurations: -1, // unlimited
      api_access: true,
      api_quota: -1, // unlimited
      procurement_discount: 0.2, // 20%
      support: 'dedicated',
    },
  },
};

// ============================================================================
// CUSTOMER CREATION
// ============================================================================

export async function createStripeCustomer(
  email: string,
  tenantName: string
) {
  const customer = await stripe.customers.create({
    email,
    name: tenantName,
    metadata: {
      tenantName,
    },
  });

  return customer;
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

export async function createSubscription(
  customerId: string,
  planKey: 'starter' | 'professional' | 'enterprise'
) {
  const plan = PLANS[planKey];

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: plan.stripePriceId,
      },
    ],
    trial_period_days: 14,
    metadata: {
      plan: planKey,
    },
  });

  return subscription;
}

export async function updateSubscription(
  subscriptionId: string,
  planKey: 'starter' | 'professional' | 'enterprise'
) {
  const plan = PLANS[planKey];
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const updated = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: plan.stripePriceId,
      },
    ],
    metadata: {
      plan: planKey,
    },
  });

  return updated;
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}

// ============================================================================
// PAYMENT INTENT
// ============================================================================

export async function createPaymentIntent(
  customerId: string,
  amountInCents: number,
  description: string
) {
  const paymentIntent = await stripe.paymentIntents.create({
    customer: customerId,
    amount: amountInCents,
    currency: 'usd',
    description,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

// ============================================================================
// INVOICE MANAGEMENT
// ============================================================================

export async function getCustomerInvoices(customerId: string) {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit: 100,
  });

  return invoices.data;
}

export async function getInvoice(invoiceId: string) {
  const invoice = await stripe.invoices.retrieve(invoiceId);
  return invoice;
}

// ============================================================================
// WEBHOOK EVENT HANDLING
// ============================================================================

export type StripeWebhookEvent =
  | Stripe.CustomerSubscriptionCreatedEvent
  | Stripe.CustomerSubscriptionUpdatedEvent
  | Stripe.CustomerSubscriptionDeletedEvent
  | Stripe.InvoicePaymentSucceededEvent
  | Stripe.InvoicePaymentFailedEvent;

export function getEventType(event: Stripe.Event): string | null {
  return event.type as string;
}

export function constructWebhookEvent(
  body: string,
  sig: string,
  endpointSecret: string
) {
  return stripe.webhooks.constructEvent(body, sig, endpointSecret);
}
