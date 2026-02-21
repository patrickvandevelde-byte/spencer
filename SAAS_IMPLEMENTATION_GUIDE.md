# AeroSpec SaaS & E-commerce Implementation Guide

## Overview

This document provides technical specifications for implementing the SaaS and e-commerce features outlined in BUSINESS_STRATEGY.md. It includes:

1. **User & Tenant Management** - Multi-seat team collaboration with RBAC
2. **Procurement Integration** - Supplier APIs, pricing sync, order management
3. **Payment & Billing** - Stripe integration, subscription tiers, transaction processing
4. **Analytics & Feedback** - Usage tracking, ML telemetry, continuous improvement
5. **Compliance & Security** - GDPR, data protection, audit logging

---

## Part 1: User & Tenant Management

### 1.1 Authentication & Authorization

#### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role ENUM('admin', 'user', 'viewer') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  INDEX (tenant_id, role)
);

-- Tenants (organizations/companies)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  plan ENUM('starter', 'professional', 'enterprise') NOT NULL DEFAULT 'starter',
  subscription_status ENUM('active', 'trialing', 'past_due', 'canceled') NOT NULL DEFAULT 'trialing',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  trial_ends_at TIMESTAMP,
  billing_email VARCHAR(255),
  max_users INT DEFAULT 1,
  max_configurations INT DEFAULT 50,
  procurement_discount_pct DECIMAL(4, 2) DEFAULT 0,
  api_quota_monthly INT DEFAULT 0,
  features JSONB DEFAULT '{}', -- e.g., {"msds_parsing": true, "api_access": false}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Invitations for team members
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user', 'viewer') NOT NULL DEFAULT 'user',
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Session tracking (for analytics)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  last_activity_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);
```

#### API Endpoints

```typescript
// Authentication
POST   /api/auth/signup              // Create account + tenant
POST   /api/auth/login               // Email/password auth
POST   /api/auth/logout              // Invalidate session
POST   /api/auth/refresh             // Refresh JWT token
POST   /api/auth/forgot-password     // Request password reset
POST   /api/auth/reset-password      // Confirm password reset

// Single Sign-On (Enterprise)
GET    /api/auth/saml/metadata       // SAML metadata
POST   /api/auth/saml/acs            // SAML assertion consumer service
GET    /api/auth/oauth/callback      // OAuth callback

// Tenant Management
GET    /api/tenants/me               // Get current tenant info
PUT    /api/tenants/me               // Update tenant (name, billing email)
DELETE /api/tenants/me               // Delete tenant + all data (with confirmation)

// Team Members
GET    /api/tenants/members          // List team members
POST   /api/tenants/members/invite   // Invite user to tenant
PUT    /api/tenants/members/:user_id // Update user role
DELETE /api/tenants/members/:user_id // Remove user from tenant
GET    /api/tenants/invitations      // List pending invitations
POST   /api/tenants/invitations/:token/accept // Accept invitation
```

#### JWT Claims Structure

```json
{
  "sub": "user-uuid",
  "tenant_id": "tenant-uuid",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1645000000,
  "exp": 1645003600,
  "features": {
    "msds_parsing": true,
    "api_access": false,
    "ecommerce": true
  }
}
```

### 1.2 Role-Based Access Control (RBAC)

| Permission | Admin | User | Viewer |
|---|---|---|---|
| View configurations | ✅ | ✅ | ✅ |
| Create/Edit configurations | ✅ | ✅ | ❌ |
| Delete configurations | ✅ | Own only | ❌ |
| Invite team members | ✅ | ❌ | ❌ |
| Manage billing | ✅ | ❌ | ❌ |
| View analytics | ✅ | ✅ | ❌ |
| Export data | ✅ | ✅ | ❌ |
| API access | ✅ | If enabled | ❌ |

### 1.3 Rate Limiting & Quotas

```typescript
// Rate limits (per tenant, based on plan)
const RATE_LIMITS = {
  starter: {
    api_calls_per_month: 0,          // No API access
    configurations_per_month: 50,
    export_requests_per_day: 5,
    max_users: 1
  },
  professional: {
    api_calls_per_month: 10_000,
    configurations_per_month: -1,    // Unlimited
    export_requests_per_day: 50,
    max_users: 5
  },
  enterprise: {
    api_calls_per_month: -1,         // Unlimited
    configurations_per_month: -1,
    export_requests_per_day: -1,
    max_users: -1
  }
};

// Implement using Redis
// Key: `tenant:{tenant_id}:api_calls:{month}`
// Value: call count
// TTL: 30 days
```

---

## Part 2: Configuration & Procurement Management

### 2.1 Configuration Data Model

```sql
CREATE TABLE configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_by_user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Fluid properties
  fluid_id UUID REFERENCES fluids(id),
  fluid_viscosity_cP DECIMAL(10, 2),
  fluid_density_kg_m3 DECIMAL(10, 2),
  fluid_surface_tension_mN_m DECIMAL(10, 2),
  fluid_flash_point_C INT,

  -- Hardware constraints
  target_spray_cone_deg INT,
  target_droplet_size_um INT,
  max_pressure_bar INT,
  target_flow_rate_ml_min DECIMAL(10, 2),

  -- Results
  compatible_actuators JSONB NOT NULL DEFAULT '[]', -- Array of SKU + predictions

  -- Metadata
  status ENUM('draft', 'complete', 'ordered', 'testing') NOT NULL DEFAULT 'draft',
  shared_with UUID[] DEFAULT '{}',     -- Array of user_ids this is shared with
  tags VARCHAR[] DEFAULT '{}',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  accessed_at TIMESTAMP,
  archived_at TIMESTAMP,

  INDEX (tenant_id, status, created_at DESC),
  INDEX (created_by_user_id)
);

-- Version history for configurations
CREATE TABLE configuration_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  configuration_id UUID NOT NULL REFERENCES configurations(id) ON DELETE CASCADE,
  version INT NOT NULL,
  changes JSONB NOT NULL,           -- Diff from previous version
  changed_by_user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shared configurations (collaboration)
CREATE TABLE configuration_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  configuration_id UUID NOT NULL REFERENCES configurations(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission ENUM('view', 'edit') NOT NULL DEFAULT 'view',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (configuration_id, shared_with_user_id)
);
```

### 2.2 Procurement Order Data Model

```sql
CREATE TABLE procurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  configuration_id UUID NOT NULL REFERENCES configurations(id),
  created_by_user_id UUID NOT NULL REFERENCES users(id),

  -- Order details
  status ENUM('draft', 'submitted', 'confirmed', 'shipped', 'delivered', 'failed') NOT NULL DEFAULT 'draft',
  order_type ENUM('sample', 'pilot', 'production') NOT NULL DEFAULT 'sample',

  -- Items (actuator SKUs + quantities)
  items JSONB NOT NULL,  -- [{sku: "SPENC-A1", qty: 10, unit_price: 5.00, ...}]

  -- Pricing
  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(12, 2) DEFAULT 0,
  discount_pct DECIMAL(5, 2) DEFAULT 0,    -- Applied per-plan
  shipping DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,

  -- Suppliers
  suppliers_quoted JSONB NOT NULL,  -- [{name: "Spencer", total: X}, {name: "Coster", total: Y}]
  selected_supplier VARCHAR(100),
  supplier_order_id VARCHAR(255),    -- Reference in supplier's system

  -- Delivery
  ship_to_address JSONB NOT NULL,
  expected_delivery_date DATE,
  tracking_number VARCHAR(255),

  -- Payment
  payment_status ENUM('unpaid', 'pending', 'paid') NOT NULL DEFAULT 'unpaid',
  stripe_payment_intent_id VARCHAR(255),
  paid_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  INDEX (tenant_id, status, created_at DESC),
  INDEX (configuration_id)
);

-- Procurement line items (breakdown)
CREATE TABLE procurement_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procurement_id UUID NOT NULL REFERENCES procurements(id) ON DELETE CASCADE,
  actuator_sku VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  supplier VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2.3 Procurement API Endpoints

```typescript
// Configuration management
GET    /api/configurations              // List user's configurations
POST   /api/configurations              // Create configuration
GET    /api/configurations/:id          // Get configuration
PUT    /api/configurations/:id          // Update configuration
DELETE /api/configurations/:id          // Archive configuration
POST   /api/configurations/:id/duplicate // Clone configuration

// Configuration sharing
POST   /api/configurations/:id/share    // Share with team member
DELETE /api/configurations/:id/shares/:user_id // Unshare

// Procurement
GET    /api/procurements                // List user's orders
POST   /api/procurements                // Create new procurement (from configuration)
GET    /api/procurements/:id            // Get procurement details
PUT    /api/procurements/:id            // Update procurement (before submission)
DELETE /api/procurements/:id            // Cancel procurement

// Procurement comparison (real-time)
POST   /api/procurements/compare        // Get pricing from all suppliers
  // Request: { items: [{sku: "SPENC-A1", qty: 10}] }
  // Response: { suppliers: [{name: "Spencer", total: X, delivery: "3 days"}] }

// Checkout & payment
POST   /api/procurements/:id/checkout   // Initiate Stripe checkout
GET    /api/procurements/:id/payment-status // Poll payment status
```

---

## Part 3: Billing & Payment

### 3.1 Stripe Integration

```typescript
// Initialize Stripe
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Subscription products (create once in Stripe dashboard)
const PLANS = {
  starter: {
    stripe_price_id: 'price_starter_monthly',
    amount_cents: 50000,  // $500/month
    currency: 'usd',
    recurring: { interval: 'month' }
  },
  professional: {
    stripe_price_id: 'price_professional_monthly',
    amount_cents: 200000, // $2,000/month
    currency: 'usd',
    recurring: { interval: 'month' }
  },
  enterprise: {
    // Custom pricing; handled separately
  }
};

// Webhook handler (Stripe events)
POST /api/webhooks/stripe
  // Handle: customer.subscription.created
  //         customer.subscription.updated
  //         customer.subscription.deleted
  //         invoice.payment_succeeded
  //         invoice.payment_failed
```

### 3.2 Billing Database Schema

```sql
CREATE TABLE billing_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255) NOT NULL UNIQUE,
  stripe_subscription_id VARCHAR(255),
  plan ENUM('starter', 'professional', 'enterprise') NOT NULL,

  status ENUM('active', 'trialing', 'past_due', 'canceled') NOT NULL DEFAULT 'active',
  current_period_start DATE NOT NULL,
  current_period_end DATE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  canceled_at TIMESTAMP
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  stripe_invoice_id VARCHAR(255) NOT NULL UNIQUE,

  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,

  -- Line items
  subscription_amount DECIMAL(12, 2),
  procurement_commissions DECIMAL(12, 2),    -- Margin from orders
  credits_applied DECIMAL(12, 2) DEFAULT 0,

  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,

  status ENUM('draft', 'sent', 'paid', 'canceled') NOT NULL DEFAULT 'draft',
  paid_at TIMESTAMP,

  pdf_url TEXT,
  memo TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Procurement revenue tracking (for invoicing)
CREATE TABLE procurement_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procurement_id UUID NOT NULL REFERENCES procurements(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  supplier VARCHAR(100) NOT NULL,
  order_total DECIMAL(12, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL,  -- 10%, 15%, 20%+ based on plan
  commission_amount DECIMAL(12, 2) NOT NULL,
  invoice_id UUID REFERENCES invoices(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.3 Billing Endpoints

```typescript
// Subscription management
POST   /api/billing/subscribe           // Create subscription
POST   /api/billing/change-plan         // Upgrade/downgrade
DELETE /api/billing/cancel              // Cancel subscription

// Billing portal
GET    /api/billing/portal-session      // Redirect to Stripe billing portal
GET    /api/billing/subscription        // Get current subscription details
GET    /api/billing/invoices            // List invoices
GET    /api/billing/invoices/:id        // Download invoice PDF

// Procurement commission tracking (internal)
GET    /api/admin/commissions           // View all commissions (admin only)
GET    /api/admin/revenue/monthly       // Revenue by month
```

---

## Part 4: Feedback & ML Integration

### 4.1 Feedback Collection

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  configuration_id UUID NOT NULL REFERENCES configurations(id),
  procurement_id UUID REFERENCES procurements(id),

  -- Feedback content
  rating INT,                            -- 1-5 stars (optional)
  spray_cone_angle_actual INT,           -- Measured during testing
  droplet_size_range_um VARCHAR(50),     -- e.g., "50-100"
  flow_rate_actual_ml_min DECIMAL(10, 2),
  pass_fail ENUM('pass', 'fail', 'unknown'),
  issue_description TEXT,                -- If fail or issues

  -- Anomaly detection
  prediction_matched BOOLEAN,            -- Did reality match AeroSpec's prediction?
  confidence_in_prediction INT DEFAULT 50,  -- User's subjective confidence

  # Configuration variables for reproducibility
  test_conditions JSONB,                 -- {temperature: 25, humidity: 45, batch_id: "..."}

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  INDEX (configuration_id, created_at DESC),
  INDEX (pass_fail)
);

-- Aggregated metrics for ML training
CREATE TABLE feedback_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actuator_sku VARCHAR(50) NOT NULL,
  fluid_id UUID NOT NULL REFERENCES fluids(id),

  total_tests INT DEFAULT 0,
  pass_count INT DEFAULT 0,
  fail_count INT DEFAULT 0,
  avg_confidence DECIMAL(3, 2),

  avg_cone_angle_predicted INT,
  avg_cone_angle_actual INT,
  cone_angle_rmse DECIMAL(5, 2),

  avg_droplet_size_predicted INT,
  avg_droplet_size_actual INT,
  droplet_size_rmse DECIMAL(5, 2),

  last_updated TIMESTAMP DEFAULT NOW(),

  UNIQUE (actuator_sku, fluid_id),
  INDEX (cone_angle_rmse, droplet_size_rmse)
);
```

### 4.2 Feedback Endpoints

```typescript
// Feedback submission
POST   /api/feedback                     // Submit test feedback
GET    /api/configurations/:id/feedback  // View feedback on configuration

// Feedback analytics (for users)
GET    /api/analytics/accuracy           // How accurate is our model?
GET    /api/analytics/usage              // Your usage stats
GET    /api/analytics/top-configurations // Most-used SKUs, fluids

// Feedback data (for ML)
GET    /api/ml/training-data             // (Authenticated ML service only)
  // Returns anonymized feedback for model retraining
```

---

## Part 5: Supplier API Integration

### 5.1 Spencer & Coster API Mock

```typescript
// Mock supplier APIs (replace with real endpoints as available)

interface SupplierQuote {
  supplier: string;
  items: Array<{
    sku: string;
    quantity: number;
    unit_price: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  lead_time_days: number;
  availability: 'in_stock' | 'backorder' | 'unavailable';
}

// Spencer API
async function getSpencerQuote(items: CartItem[]): Promise<SupplierQuote> {
  const response = await fetch('https://api.spencer-group.com/quotes', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SPENCER_API_KEY}` },
    body: JSON.stringify({
      items: items.map(i => ({ sku: i.sku, quantity: i.qty }))
    })
  });
  return response.json();
}

// Coster API
async function getCosterQuote(items: CartItem[]): Promise<SupplierQuote> {
  const response = await fetch('https://api.coster-group.com/v2/quote', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${COSTER_API_KEY}` },
    body: JSON.stringify({
      line_items: items.map(i => ({ code: i.sku, qty: i.qty }))
    })
  });
  return response.json();
}
```

### 5.2 Supplier Sync (Scheduled)

```typescript
// Sync pricing + inventory every 4 hours
import cron from 'node-cron';

cron.schedule('0 */4 * * *', async () => {
  const actuators = await db.select().from(schema.actuators);

  for (const supplier of ['spencer', 'coster']) {
    for (const actuator of actuators) {
      // Fetch current price
      const price = await getSupplierPrice(supplier, actuator.sku);

      // Update database
      await db.update(schema.actuators)
        .set({
          [`${supplier}_price_usd`]: price.unit_price,
          [`${supplier}_stock_units`]: price.in_stock,
          [`${supplier}_lead_days`]: price.lead_time_days,
          [`${supplier}_last_synced`]: new Date()
        })
        .where(eq(schema.actuators.id, actuator.id));
    }
  }
});
```

---

## Part 6: Compliance & Security

### 6.1 Data Protection & GDPR

```typescript
// Data retention policies
const DATA_RETENTION = {
  configurations: 2555,        // 7 years (audit compliance)
  procurements: 2555,          // 7 years
  feedback: 1825,              // 5 years
  user_activity_logs: 365,     // 1 year
  deleted_user_data: 30        // 30 days grace period for recovery
};

// GDPR endpoints
DELETE /api/users/me           // Right to be forgotten
  // Anonymize all personal data; retain only aggregated stats

GET    /api/users/me/export    // Download all personal data (CSV/JSON)

// GDPR consent tracking
POST   /api/consent/track      // Record user consent to terms, privacy policy
GET    /api/consent/status     // Check current consent status
```

### 6.2 Audit Logging

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  action VARCHAR(50) NOT NULL,        -- e.g., "configuration.create", "procurement.submit"
  resource_type VARCHAR(50) NOT NULL, -- e.g., "configuration", "procurement"
  resource_id UUID NOT NULL,

  changes JSONB,                      -- What changed (old_value → new_value)
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP DEFAULT NOW(),

  INDEX (tenant_id, created_at DESC),
  INDEX (resource_type, resource_id)
);
```

### 6.3 Security Headers & CSP

```typescript
// Next.js middleware for security headers
export async function middleware(req: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';"
  );

  return response;
}
```

---

## Part 7: Advanced Features (Months 8–12)

### 7.1 REST API for Enterprise

```typescript
// API authentication (API key)
GET    /api/configurations?api_key=sk_live_...
POST   /api/procurements?api_key=sk_live_...

// Rate limiting (per API key)
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9999
X-RateLimit-Reset: 1645003600

// Webhooks for Enterprise
POST   /webhooks/procurements
  // Event: procurement.status_changed
  // Payload: { id, status, updated_at }
```

### 7.2 ERP Integrations

```typescript
// SAP integration via Zapier/Make
// NetSuite integration via custom webhooks
// Dynamics 365 via Microsoft Graph API

// Whenever a procurement is submitted:
// 1. Create purchase order in ERP
// 2. Sync inventory (as items ship)
// 3. Update accounting (record commission revenue)
```

### 7.3 Custom Model Training

```typescript
// Endpoint for Enterprise customers
POST   /api/ml/custom-models/train
  // Request:
  // {
  //   name: "My Company Fluids",
  //   training_data: [feedback records],
  //   model_type: "xgboost" | "neural_net"
  // }
  //
  // Response:
  // { model_id, status: "training", eta_hours: 2 }

GET    /api/ml/custom-models/:model_id
  // Check training progress

POST   /api/configurations/predict
  // Use custom model instead of default
  // ?model_id=custom_123
```

---

## Part 8: Migration & Deployment

### 8.1 Database Migrations

```bash
# Use Drizzle ORM migrations
npm run migrations:generate  -- "add_procurement_tables"
npm run migrations:migrate

# Backup before major changes
pg_dump aerospec_prod > backup_2026_02_20.sql
```

### 8.2 Deployment Checklist

- [ ] Stripe account created & products configured
- [ ] Email provider configured (SendGrid, Mailgun)
- [ ] Environment variables set (.env.local)
- [ ] Database migrations run
- [ ] Initial user + tenant seeded
- [ ] Payment webhooks configured
- [ ] Error monitoring configured (Sentry)
- [ ] Analytics configured (PostHog, Mixpanel)
- [ ] SSL certificates valid
- [ ] Backup strategy tested
- [ ] Disaster recovery plan documented

---

## Part 9: Success Metrics & Monitoring

### 9.1 Key Metrics

```
SaaS Metrics:
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn Rate (monthly)
- Net Retention Rate (expansion revenue)
- Free Trial Conversion Rate

Procurement Metrics:
- Total Orders (monthly)
- Average Order Value (AOV)
- Commission Revenue (monthly)
- Supplier Split (Spencer vs. Coster)

Product Metrics:
- Daily Active Users (DAU)
- Configuration Generation Rate
- Feedback Submission Rate (%)
- Model Accuracy (vs. real-world data)
- API Call Volume
- System Uptime (%)
```

### 9.2 Monitoring Setup

```typescript
// Datadog / New Relic
import { tracer } from 'dd-trace';

tracer.init();

// Log important events
tracer.trace('procurement.create', async () => {
  // Create procurement
});
```

---

## Appendix: Testing Checklist

### Unit Tests
- [ ] Configuration CRUD operations
- [ ] Procurement calculations (discounts, taxes)
- [ ] Payment status transitions
- [ ] Rate limiting logic
- [ ] RBAC permissions

### Integration Tests
- [ ] End-to-end procurement flow (config → order → payment)
- [ ] Multi-tenant data isolation
- [ ] Stripe webhook handling
- [ ] Supplier API calls
- [ ] Feedback ingestion

### E2E Tests (Cypress)
- [ ] User signup → first configuration → procurement
- [ ] Team member invitation flow
- [ ] Billing portal access
- [ ] API key generation & usage

### Security Tests
- [ ] CSRF protection
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Rate limiting enforcement
- [ ] Auth token expiration

---

**Document Version:** 1.0
**Last Updated:** 2026-02-21
**Next Review:** 2026-04-30
