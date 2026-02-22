// ============================================================
// KMD (Knowledge Monopoly Database) Schema
// Relational tables for validated formula/actuator/piston settings
// ============================================================

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
} from 'drizzle-orm/pg-core';
import { tenants, users } from './schema';

// --- Enums ---

export const viscosityCategoryEnum = pgEnum('viscosity_category', [
  'liquid',
  'lotion',
  'cream',
  'paste',
  'gel',
]);

export const ppwrGradeEnum = pgEnum('ppwr_grade', ['A', 'B', 'C', 'D', 'E']);

export const sfpLineEnum = pgEnum('sfp_line', ['Line38', 'Line53']);

export const recipeStatusEnum = pgEnum('recipe_status', [
  'draft',
  'validated',
  'production',
  'archived',
]);

// --- Formula Records ---

export const kmdFormulas = pgTable(
  'kmd_formulas',
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

    // Formula properties
    viscosity_cP: decimal('viscosity_cP', { precision: 12, scale: 2 }).notNull(),
    density_g_cm3: decimal('density_g_cm3', { precision: 8, scale: 4 }).notNull(),
    gasSensitive: boolean('gas_sensitive').notNull().default(false),
    category: viscosityCategoryEnum('category').notNull(),
    fillVolume_ml: decimal('fill_volume_ml', { precision: 8, scale: 2 }).notNull(),
    orientation360: boolean('orientation_360').notNull().default(false),

    // Metadata
    productType: varchar('product_type', { length: 100 }),
    brandName: varchar('brand_name', { length: 255 }),
    regulatoryMarket: varchar('regulatory_market', { length: 100 }),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    tenantIdx: index('kmd_formulas_tenant_idx').on(table.tenantId),
    categoryIdx: index('kmd_formulas_category_idx').on(table.category),
  })
);

// --- SFP Recipes ---

export const kmdRecipes = pgTable(
  'kmd_recipes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    formulaId: uuid('formula_id')
      .notNull()
      .references(() => kmdFormulas.id, { onDelete: 'cascade' }),
    createdByUserId: uuid('created_by_user_id')
      .notNull()
      .references(() => users.id),

    name: varchar('name', { length: 255 }).notNull(),
    status: recipeStatusEnum('status').notNull().default('draft'),

    // Hardware selections
    itvId: varchar('itv_id', { length: 50 }).notNull(),
    pistonId: varchar('piston_id', { length: 50 }).notNull(),
    lpvId: varchar('lpv_id', { length: 50 }).notNull(),

    // Physics results
    referencePreload_bar: decimal('reference_preload_bar', { precision: 6, scale: 2 }).notNull(),
    outputPressure_bar: decimal('output_pressure_bar', { precision: 6, scale: 2 }).notNull(),
    pressureVariation_pct: decimal('pressure_variation_pct', { precision: 5, scale: 2 }),
    pistonForce_N: decimal('piston_force_N', { precision: 8, scale: 2 }),
    strokeLength_mm: decimal('stroke_length_mm', { precision: 8, scale: 2 }),

    // Component selections (JSON array of 11 parts)
    components: jsonb('components').notNull().default('[]'),

    // Compliance
    ppwrGrade: ppwrGradeEnum('ppwr_grade'),
    ppwrScore: integer('ppwr_score'),

    // Filling
    sfpLine: sfpLineEnum('sfp_line').notNull().default('Line38'),

    // QR code data (serialised recipe for SFP filling platform)
    qrPayload: text('qr_payload'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    tenantIdx: index('kmd_recipes_tenant_idx').on(table.tenantId),
    formulaIdx: index('kmd_recipes_formula_idx').on(table.formulaId),
    statusIdx: index('kmd_recipes_status_idx').on(table.status),
  })
);

// --- Component Compatibility Records ---

export const kmdCompatibility = pgTable(
  'kmd_compatibility',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // What is being matched
    category: viscosityCategoryEnum('category').notNull(),
    viscosityMin_cP: decimal('viscosity_min_cP', { precision: 12, scale: 2 }).notNull(),
    viscosityMax_cP: decimal('viscosity_max_cP', { precision: 12, scale: 2 }).notNull(),

    // Compatible hardware
    itvId: varchar('itv_id', { length: 50 }).notNull(),
    pistonId: varchar('piston_id', { length: 50 }).notNull(),
    lpvIds: jsonb('lpv_ids').notNull().default('[]'),

    // Validation
    validated: boolean('validated').notNull().default(false),
    validatedByUserId: uuid('validated_by_user_id').references(() => users.id),
    validationDate: timestamp('validation_date'),
    testReport: text('test_report'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index('kmd_compat_category_idx').on(table.category),
  })
);
