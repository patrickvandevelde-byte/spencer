import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { tenants, billingSubscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

function getStripeInstance() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not set');
  return new Stripe(key);
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = getStripeInstance().webhooks.constructEvent(body, sig, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle events
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;

        // Find tenant by customer ID
        const tenant = await db.query.tenants.findFirst({
          where: (tenants, { eq }) =>
            eq(tenants.stripeCustomerId, subscription.customer as string),
        });

        if (tenant) {
          const periodStart = new Date(subscription.current_period_start * 1000);
          const periodEnd = new Date(subscription.current_period_end * 1000);

          // Update or create billing subscription
          const existingBilling = await db.query.billingSubscriptions.findFirst({
            where: (billingSubscriptions, { eq }) =>
              eq(billingSubscriptions.tenantId, tenant.id),
          });

          if (existingBilling) {
            await db
              .update(billingSubscriptions)
              .set({
                stripeSubscriptionId: subscription.id,
                status: subscription.status as any,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
                updatedAt: new Date(),
              })
              .where(eq(billingSubscriptions.tenantId, tenant.id));
          }

          // Update tenant subscription status
          await db
            .update(tenants)
            .set({
              subscriptionStatus: subscription.status as any,
              stripeSubscriptionId: subscription.id,
              updatedAt: new Date(),
            })
            .where(eq(tenants.id, tenant.id));
        }

        console.log('Subscription updated:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;

        // Find and update billing subscription
        const billing = await db.query.billingSubscriptions.findFirst({
          where: (billingSubscriptions, { eq }) =>
            eq(billingSubscriptions.stripeSubscriptionId, subscription.id),
        });

        if (billing) {
          await db
            .update(billingSubscriptions)
            .set({
              status: 'canceled' as any,
              canceledAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(billingSubscriptions.id, billing.id));

          // Update tenant
          await db
            .update(tenants)
            .set({
              subscriptionStatus: 'canceled' as any,
              updatedAt: new Date(),
            })
            .where(eq(tenants.id, billing.tenantId));
        }

        console.log('Subscription deleted:', subscription.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;

        // Find tenant
        const tenant = await db.query.tenants.findFirst({
          where: (tenants, { eq }) =>
            eq(tenants.stripeCustomerId, invoice.customer as string),
        });

        if (tenant) {
          // TODO: Update billing records and mark invoice as paid
          console.log('Invoice paid:', invoice.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;

        // Find tenant
        const tenant = await db.query.tenants.findFirst({
          where: (tenants, { eq }) =>
            eq(tenants.stripeCustomerId, invoice.customer as string),
        });

        if (tenant) {
          // Update subscription status to past_due
          await db
            .update(billingSubscriptions)
            .set({
              status: 'past_due' as any,
              updatedAt: new Date(),
            })
            .where(eq(billingSubscriptions.tenantId, tenant.id));

          // TODO: Send payment failed email to customer
          console.log('Invoice payment failed:', invoice.id);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
