import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  pgEnum,
  jsonb,
  index,
  uniqueIndex,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// ENUMS
// ============================================================================

export const planEnum = pgEnum('plan', ['starter', 'professional', 'enterprise']);
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'trialing',
  'past_due',
  'canceled',
]);
export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'viewer']);
export const configurationStatusEnum = pgEnum('configuration_status', [
  'draft',
  'complete',
  'ordered',
  'testing',
]);
export const procurementStatusEnum = pgEnum('procurement_status', [
  'draft',
  'submitted',
  'confirmed',
  'shipped',
  'delivered',
  'failed',
]);
export const procurementTypeEnum = pgEnum('procurement_type', [
  'sample',
  'pilot',
  'production',
]);
export const paymentStatusEnum = pgEnum('payment_status', [
  'unpaid',
  'pending',
  'paid',
]);
export const feedbackPassFailEnum = pgEnum('pass_fail', [
  'pass',
  'fail',
  'unknown',
]);
export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft',
  'sent',
  'paid',
  'canceled',
]);

// ============================================================================
// TENANTS (Organizations/Companies)
// ============================================================================

export const tenants = pgTable(
  'tenants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    plan: planEnum('plan').notNull().default('starter'),
    subscriptionStatus: subscriptionStatusEnum('subscription_status')
      .notNull()
      .default('trialing'),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
    trialEndsAt: timestamp('trial_ends_at'),
    billingEmail: varchar('billing_email', { length: 255 }),
    maxUsers: integer('max_users').default(1),
    maxConfigurations: integer('max_configurations').default(50),
    procurementDiscountPct: decimal('procurement_discount_pct', {
      precision: 4,
      scale: 2,
    }).default('0'),
    apiQuotaMonthly: integer('api_quota_monthly').default(0),
    features: jsonb('features').default('{}'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    slugIdx: uniqueIndex('tenants_slug_idx').on(table.slug),
    createdAtIdx: index('tenants_created_at_idx').on(table.createdAt),
  })
);

// ============================================================================
// USERS
// ============================================================================

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    role: userRoleEnum('role').notNull().default('user'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastLogin: timestamp('last_login'),
    isActive: boolean('is_active').default(true),
  },
  (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    tenantIdIdx: index('users_tenant_id_idx').on(table.tenantId),
    tenantRoleIdx: index('users_tenant_role_idx').on(table.tenantId, table.role),
  })
);

// ============================================================================
// SESSIONS
// ============================================================================

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    ipAddress: varchar('ip_address', { length: 50 }),
    userAgent: text('user_agent'),
    startedAt: timestamp('started_at').defaultNow().notNull(),
    lastActivityAt: timestamp('last_activity_at').defaultNow().notNull(),
    endedAt: timestamp('ended_at'),
  },
  (table) => ({
    userIdIdx: index('sessions_user_id_idx').on(table.userId),
    tenantIdIdx: index('sessions_tenant_id_idx').on(table.tenantId),
  })
);

// ============================================================================
// INVITATIONS
// ============================================================================

export const invitations = pgTable(
  'invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 255 }).notNull(),
    role: userRoleEnum('role').notNull().default('user'),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    acceptedAt: timestamp('accepted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    tenantIdIdx: index('invitations_tenant_id_idx').on(table.tenantId),
    tokenIdx: uniqueIndex('invitations_token_idx').on(table.token),
  })
);

// ============================================================================
// CONFIGURATIONS
// ============================================================================

export const configurations = pgTable(
  'configurations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    createdByUserId: uuid('created_by_user_id')
      .notNull()
      .references(() => users.id),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),

    // Fluid properties
    fluidId: uuid('fluid_id'),
    fluidViscosityCp: decimal('fluid_viscosity_cP', {
      precision: 10,
      scale: 2,
    }),
    fluidDensityKgM3: decimal('fluid_density_kg_m3', {
      precision: 10,
      scale: 2,
    }),
    fluidSurfaceTensionMnM: decimal('fluid_surface_tension_mN_m', {
      precision: 10,
      scale: 2,
    }),
    fluidFlashPointC: integer('fluid_flash_point_C'),

    // Hardware constraints
    targetSprayConeDeg: integer('target_spray_cone_deg'),
    targetDropletSizeUm: integer('target_droplet_size_um'),
    maxPressureBar: integer('max_pressure_bar'),
    targetFlowRateMlMin: decimal('target_flow_rate_ml_min', {
      precision: 10,
      scale: 2,
    }),

    // Results
    compatibleActuators: jsonb('compatible_actuators').default('[]'),

    // Metadata
    status: configurationStatusEnum('status').notNull().default('draft'),
    tags: jsonb('tags').default('[]'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    accessedAt: timestamp('accessed_at'),
    archivedAt: timestamp('archived_at'),
  },
  (table) => ({
    tenantStatusIdx: index('configurations_tenant_status_idx').on(
      table.tenantId,
      table.status
    ),
    tenantCreatedIdx: index('configurations_tenant_created_idx').on(
      table.tenantId,
      table.createdAt
    ),
    createdByIdx: index('configurations_created_by_user_id_idx').on(
      table.createdByUserId
    ),
  })
);

// ============================================================================
// CONFIGURATION VERSIONS
// ============================================================================

export const configurationVersions = pgTable(
  'configuration_versions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    configurationId: uuid('configuration_id')
      .notNull()
      .references(() => configurations.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),
    changes: jsonb('changes').notNull(),
    changedByUserId: uuid('changed_by_user_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    configIdIdx: index('config_versions_config_id_idx').on(
      table.configurationId
    ),
  })
);

// ============================================================================
// PROCUREMENTS
// ============================================================================

export const procurements = pgTable(
  'procurements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    configurationId: uuid('configuration_id')
      .notNull()
      .references(() => configurations.id),
    createdByUserId: uuid('created_by_user_id')
      .notNull()
      .references(() => users.id),

    // Order details
    status: procurementStatusEnum('status').notNull().default('draft'),
    orderType: procurementTypeEnum('order_type').notNull().default('sample'),

    // Items
    items: jsonb('items').notNull().default('[]'),

    // Pricing
    subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
    tax: decimal('tax', { precision: 12, scale: 2 }).default('0'),
    discountPct: decimal('discount_pct', { precision: 5, scale: 2 }).default('0'),
    shipping: decimal('shipping', { precision: 12, scale: 2 }).default('0'),
    total: decimal('total', { precision: 12, scale: 2 }).notNull(),

    // Suppliers
    suppliersQuoted: jsonb('suppliers_quoted').notNull().default('[]'),
    selectedSupplier: varchar('selected_supplier', { length: 100 }),
    supplierOrderId: varchar('supplier_order_id', { length: 255 }),

    // Delivery
    shipToAddress: jsonb('ship_to_address').notNull(),
    expectedDeliveryDate: timestamp('expected_delivery_date'),
    trackingNumber: varchar('tracking_number', { length: 255 }),

    // Payment
    paymentStatus: paymentStatusEnum('payment_status')
      .notNull()
      .default('unpaid'),
    stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
    paidAt: timestamp('paid_at'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    tenantStatusIdx: index('procurements_tenant_status_idx').on(
      table.tenantId,
      table.status
    ),
    configIdIdx: index('procurements_config_id_idx').on(table.configurationId),
    createdAtIdx: index('procurements_created_at_idx').on(table.createdAt),
  })
);

// ============================================================================
// FEEDBACK
// ============================================================================

export const feedback = pgTable(
  'feedback',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    configurationId: uuid('configuration_id')
      .notNull()
      .references(() => configurations.id),
    procurementId: uuid('procurement_id').references(() => procurements.id),

    // Feedback content
    rating: integer('rating'),
    sprayConAngleActual: integer('spray_cone_angle_actual'),
    dropletSizeRangeUm: varchar('droplet_size_range_um', { length: 50 }),
    flowRateActualMlMin: decimal('flow_rate_actual_ml_min', {
      precision: 10,
      scale: 2,
    }),
    passFail: feedbackPassFailEnum('pass_fail'),
    issueDescription: text('issue_description'),

    // Anomaly detection
    predictionMatched: boolean('prediction_matched'),
    confidenceInPrediction: integer('confidence_in_prediction').default(50),

    // Test conditions
    testConditions: jsonb('test_conditions'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    configIdIdx: index('feedback_config_id_idx').on(table.configurationId),
    passFailIdx: index('feedback_pass_fail_idx').on(table.passFail),
  })
);

// ============================================================================
// BILLING
// ============================================================================

export const billingSubscriptions = pgTable(
  'billing_subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .unique()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 })
      .notNull()
      .unique(),
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
    plan: planEnum('plan').notNull(),

    status: subscriptionStatusEnum('status').notNull().default('active'),
    currentPeriodStart: timestamp('current_period_start').notNull(),
    currentPeriodEnd: timestamp('current_period_end').notNull(),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    canceledAt: timestamp('canceled_at'),
  },
  (table) => ({
    tenantIdIdx: uniqueIndex('billing_subs_tenant_id_idx').on(table.tenantId),
    stripeSubIdx: index('billing_subs_stripe_sub_id_idx').on(
      table.stripeSubscriptionId
    ),
  })
);

// ============================================================================
// INVOICES
// ============================================================================

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    stripeInvoiceId: varchar('stripe_invoice_id', { length: 255 })
      .notNull()
      .unique(),

    invoiceDate: timestamp('invoice_date').notNull(),
    dueDate: timestamp('due_date').notNull(),

    subscriptionAmount: decimal('subscription_amount', {
      precision: 12,
      scale: 2,
    }),
    procurementCommissions: decimal('procurement_commissions', {
      precision: 12,
      scale: 2,
    }),
    creditsApplied: decimal('credits_applied', { precision: 12, scale: 2 })
      .default('0'),

    subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
    tax: decimal('tax', { precision: 12, scale: 2 }).default('0'),
    total: decimal('total', { precision: 12, scale: 2 }).notNull(),

    status: invoiceStatusEnum('status').notNull().default('draft'),
    paidAt: timestamp('paid_at'),

    pdfUrl: text('pdf_url'),
    memo: text('memo'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    tenantIdIdx: index('invoices_tenant_id_idx').on(table.tenantId),
    statusIdx: index('invoices_status_idx').on(table.status),
  })
);

// ============================================================================
// AUDIT LOGS
// ============================================================================

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),

    action: varchar('action', { length: 50 }).notNull(),
    resourceType: varchar('resource_type', { length: 50 }).notNull(),
    resourceId: uuid('resource_id').notNull(),

    changes: jsonb('changes'),
    ipAddress: varchar('ip_address', { length: 50 }),
    userAgent: text('user_agent'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    tenantCreatedIdx: index('audit_logs_tenant_created_idx').on(
      table.tenantId,
      table.createdAt
    ),
    resourceIdx: index('audit_logs_resource_idx').on(
      table.resourceType,
      table.resourceId
    ),
  })
);

// ============================================================================
// RELATIONS
// ============================================================================

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  configurations: many(configurations),
  procurements: many(procurements),
  feedback: many(feedback),
  sessions: many(sessions),
  invitations: many(invitations),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  configurations: many(configurations),
  sessions: many(sessions),
  auditLogs: many(auditLogs),
}));

export const configurationsRelations = relations(
  configurations,
  ({ one, many }) => ({
    tenant: one(tenants, {
      fields: [configurations.tenantId],
      references: [tenants.id],
    }),
    creator: one(users, {
      fields: [configurations.createdByUserId],
      references: [users.id],
    }),
    versions: many(configurationVersions),
    procurements: many(procurements),
    feedback: many(feedback),
  })
);

export const procurementsRelations = relations(
  procurements,
  ({ one, many }) => ({
    tenant: one(tenants, {
      fields: [procurements.tenantId],
      references: [tenants.id],
    }),
    configuration: one(configurations, {
      fields: [procurements.configurationId],
      references: [configurations.id],
    }),
    creator: one(users, {
      fields: [procurements.createdByUserId],
      references: [users.id],
    }),
    feedback: many(feedback),
  })
);

export const feedbackRelations = relations(feedback, ({ one }) => ({
  tenant: one(tenants, {
    fields: [feedback.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [feedback.userId],
    references: [users.id],
  }),
  configuration: one(configurations, {
    fields: [feedback.configurationId],
    references: [configurations.id],
  }),
  procurement: one(procurements, {
    fields: [feedback.procurementId],
    references: [procurements.id],
  }),
}));
