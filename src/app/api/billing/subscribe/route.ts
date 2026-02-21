import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { tenants, billingSubscriptions } from '@/db/schema';
import {
  createStripeCustomer,
  createSubscription,
  PLANS,
} from '@/lib/stripe';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const userRole = request.headers.get('x-user-role');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can manage billing
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can manage billing' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { plan } = body;

    // Validation
    if (!plan || !['starter', 'professional', 'enterprise'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Get tenant
    const tenant = await db.query.tenants.findFirst({
      where: (tenants, { eq }) => eq(tenants.id, tenantId),
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    // Check if already has a subscription
    const existingSubscription = await db.query.billingSubscriptions.findFirst({
      where: (billingSubscriptions, { eq }) =>
        eq(billingSubscriptions.tenantId, tenantId),
    });

    let stripeCustomerId = tenant.stripeCustomerId;

    // Create Stripe customer if not exists
    if (!stripeCustomerId) {
      const customer = await createStripeCustomer(
        tenant.billingEmail || 'billing@example.com',
        tenant.name
      );
      stripeCustomerId = customer.id;

      // Update tenant with Stripe customer ID
      await db
        .update(tenants)
        .set({ stripeCustomerId })
        .where(eq(tenants.id, tenantId));
    }

    let subscription: any;

    if (existingSubscription) {
      // Update existing subscription
      const { updateSubscription } = await import('@/lib/stripe');
      subscription = await updateSubscription(
        existingSubscription.stripeSubscriptionId!,
        plan
      );

      // Update billing subscription
      await db
        .update(billingSubscriptions)
        .set({
          plan: plan as any,
          stripeSubscriptionId: subscription.id,
          currentPeriodStart: new Date(
            subscription.current_period_start * 1000
          ),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          status: subscription.status as any,
          updatedAt: new Date(),
        })
        .where(eq(billingSubscriptions.tenantId, tenantId));
    } else {
      // Create new subscription
      subscription = await createSubscription(stripeCustomerId, plan);

      // Create billing subscription record
      await db
        .insert(billingSubscriptions)
        .values({
          id: uuidv4(),
          tenantId,
          stripeCustomerId,
          stripeSubscriptionId: subscription.id,
          plan: plan as any,
          status: subscription.status as any,
          currentPeriodStart: new Date(
            subscription.current_period_start * 1000
          ),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        } as any);
    }

    // Update tenant plan
    const planDetails = PLANS[plan as keyof typeof PLANS];
    await db
      .update(tenants)
      .set({
        plan: plan as any,
        subscriptionStatus: subscription.status as any,
        maxUsers: planDetails.features.max_users,
        maxConfigurations: planDetails.features.max_configurations,
        procurementDiscountPct: (planDetails.features.procurement_discount * 100) as any,
        apiQuotaMonthly: (planDetails.features as any).api_quota || 0,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, tenantId));

    return NextResponse.json(
      {
        message: 'Subscription created/updated',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          plan,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
