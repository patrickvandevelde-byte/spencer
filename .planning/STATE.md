# Project State

## Current Focus
Business-concept validation pass via synthetic users (v1.1 strategy)

## Recently Completed
- 2026-05-10: **Synthetic-user validation** — 10 personas across Segments
  A–D + pharma + consultant skeptic; 12-question structured interviews;
  produced `SYNTHETIC_USER_VALIDATION.md` and v1.1 revisions to
  `BUSINESS_STRATEGY.md`. Major changes: ICP narrowed to mid-market CPG
  + regional CMOs; Indie/Maker $99 tier added; Pharma SaaS vertical
  split out at $4–$8k/mo; procurement model split into sample / price-
  discovery / enterprise-integration; time-savings + BOM + ML + CAC +
  Year-1 GR claims tightened.
- 2026-02-22: **Spenser Configurator** — Complete implementation of the SFP system configurator
  - Physics Engine: Boyle's Law bypass via mechanical equilibrium (piston/spring preload)
  - KMD: 11 IM parts, 6 ITVs, 7 LPVs, 5 product categories with viscosity mapping
  - PPWR Compliance: Grade A-E scoring, material audit, Compliance Pack export
  - Financial Modeler: CAPEX/OPEX comparison, 60-month ROI timeline
  - 3 API routes: /api/spenser/configure, /compliance, /economics
  - 4 UI pages: Dashboard + Flow A (Formula-to-Hardware) + Flow B (PPWR) + Flow C (Economics)
  - KMD database schema (Drizzle): kmd_formulas, kmd_recipes, kmd_compatibility tables
  - Nav updated with SFP Configurator link
- 2026-02-22: Installed GSD (Get Shit Done) v1.20.5 globally for Claude Code
- 2026-02-22: Deep UX analysis of all user journeys and pain points
- 2026-02-22: Compare page deep linking, multi-select, workflow breadcrumb

## Key Decisions
- Spenser physics engine is deterministic (not ML): mechanical equilibrium calculations
- 11 IM parts defined as the standard SFP component set (ITV, LPV, piston, seals, etc.)
- PPWR scoring uses weight-adjusted recyclability per component
- Financial model: Line 38 (€150K) and Line 53 (€220K) as SFP options vs €2M traditional
- Use URL params (not localStorage) for cross-page data flow
- Floating compare bar in Configure: non-intrusive

## Known Issues
- Pre-existing lint warning in results/page.tsx (unused ToolingSpec import)
- Compare page URL doesn't update live as user changes selections
- KMD database tables defined but no migration deployed yet (schema-only)

## What's Next
- [ ] Close real-customer-discovery gaps from `SYNTHETIC_USER_VALIDATION.md` §7
      (5 mid-market CPG calls, 3 pharma CDMO calls, channel-conflict
      review with Spencer/Coster)
- [ ] Scope Indie/Maker $99 tier (metered config credits, curated
      catalog, sample-marketplace UX)
- [ ] Scope Pharma SaaS vertical (21 CFR Part 11, e-signature, validated
      environment)
- [ ] Run Drizzle migration for KMD tables
- [ ] Add QR code generation for SFP Recipes (currently exports JSON)
- [ ] Connect Spenser configure results to procurement workflow
- [ ] Phase 2: Automated PPWR documentation generation
- [ ] Phase 3: AI-powered inline QC feedback loop for 95%+ OEE
- [ ] Consider adding "Add to Compare" on home page actuator cards
- [ ] Keyboard shortcuts for power users
