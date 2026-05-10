// ============================================================
// Graph Contributions Schema (Sprint 2 — feedback flywheel)
//
// Records every post-config user submission that grows the
// fitment graph. Designed to accept anonymous submissions from
// the free configurator: tenant/user references are nullable.
// One row per submission; aggregate counters are derived via
// GROUP BY (no triple-table denormalisation yet — keeps the
// write path single-table and the read path cheap to refactor).
// ============================================================

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { tenants, users } from './schema';

// Which configurator surface produced the contribution.
export const contributionSourceEnum = pgEnum('contribution_source', [
  'aerospec', // legacy actuator / fluid predictor
  'spenser',  // SFP formula-to-hardware configurator
]);

// Did the user actually run a bench test, or are they reporting
// expectations / a planning-stage rating?
export const benchTestedEnum = pgEnum('bench_tested', [
  'yes',
  'no',
  'planned',
]);

// How well the predicted outcome matched the bench result.
// `n/a` covers the planning-stage path where there is nothing
// to compare against yet.
export const predictionMatchEnum = pgEnum('prediction_match', [
  'matched',
  'partial',
  'mismatch',
  'n/a',
]);

export const graphContributions = pgTable(
  'graph_contributions',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    source: contributionSourceEnum('source').notNull(),

    // Optional ownership — null for anonymous free-tier
    // submissions; populated when the user is logged in.
    tenantId: uuid('tenant_id').references(() => tenants.id, {
      onDelete: 'set null',
    }),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),

    // Stable identity for the configuration that produced this
    // contribution. For AeroSpec: `${actuatorSku}::${fluidId}::${pressureBar}`.
    // For Spenser: `${category}::${viscosityBucket}::${itvId}::${pistonId}`.
    // Hash, not a foreign key — works even when the
    // configuration was never persisted server-side.
    configKey: varchar('config_key', { length: 255 }).notNull(),

    // Human-readable summary of what was configured, so the
    // contribution makes sense without re-running the engine.
    configSummary: jsonb('config_summary').notNull(),

    // The 1-click signals.
    benchTested: benchTestedEnum('bench_tested').notNull(),
    rating: integer('rating'), // 1..5 thumbs; null = no rating given
    predictionMatch: predictionMatchEnum('prediction_match').notNull(),

    // Optional free-text — kept short, surfaced on contributor pages.
    notes: text('notes'),

    // Anti-spam / rate-limit hints. ipHash is a salted SHA-256, never raw IP.
    ipHash: varchar('ip_hash', { length: 64 }),
    userAgent: text('user_agent'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    sourceIdx: index('graph_contributions_source_idx').on(table.source),
    configKeyIdx: index('graph_contributions_config_key_idx').on(table.configKey),
    createdAtIdx: index('graph_contributions_created_at_idx').on(table.createdAt),
    benchTestedIdx: index('graph_contributions_bench_tested_idx').on(
      table.benchTested
    ),
  })
);

export type GraphContribution = typeof graphContributions.$inferSelect;
export type NewGraphContribution = typeof graphContributions.$inferInsert;
