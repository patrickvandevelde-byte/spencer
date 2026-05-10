# Project State

## Current Focus
v1.2 moat-thesis architecture: Configurator → Fitment Graph → Parts
Marketplace. Sprint 1 shipped (strategy + site + /graph + pricing flip).
Sprint 2 next: feedback loop in configurator to start the flywheel.

## Recently Completed
- 2026-05-10: **v1.2 moat thesis (Sprint 1)** — committed to a TVH-shaped
  three-pillar architecture (configurator funnels into fitment graph,
  graph monetizes via parts marketplace + tiered access). Added §0 Moat
  Thesis and §12 changelog to `BUSINESS_STRATEGY.md`. Flipped pricing:
  configs are unmetered on every tier (new $0 Free Configurator); tiers
  ladder by graph access depth + procurement perks. Headline KPI
  switched from configurations/month to graph density. Built `/graph`
  surface (live density counters, top fluids/actuators by validation,
  flywheel narrative). Rewrote homepage hero to three-pillar framing;
  Spenser SFP demoted to "other graphs" sub-card. Added Graph link to
  NavBar marketing area. Rolls-Royce-style outcome SLA held as Year-3+
  optionality.
- 2026-05-10: **Synthetic-user validation (v1.1)** — 10 personas across
  Segments A–D + pharma + consultant skeptic; 12-question structured
  interviews; produced `SYNTHETIC_USER_VALIDATION.md` and v1.1 revisions
  to `BUSINESS_STRATEGY.md` (ICP narrowing, Indie tier, Pharma vertical,
  procurement-model split, tightened time/BOM/ML/CAC claims).
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
- [ ] **Sprint 2:** Add feedback loop to configurator (post-config
      "did you bench-test?" capture, 1-click rating, contributions
      schema). Without this, graph density doesn't grow → no moat.
- [ ] **Sprint 3:** Wire `/graph` surface to live database queries
      (currently seeded from constants).
- [ ] **Sprint 4:** Supplier-partnership outreach kit; catalog expansion
      plan (27 → 100 SKUs target via Spencer / Coster / Lindal / Aptar).
- [ ] **Sprint 5–6:** Production-PO marketplace (2–4% transparent take),
      Ariba / Coupa integration scoping.
- [ ] Close real-customer-discovery gaps from `SYNTHETIC_USER_VALIDATION.md` §7
      (5 mid-market CPG calls, 3 pharma CDMO calls, channel-conflict
      review with Spencer/Coster).
- [ ] Resolve Spenser SFP branding (sub-graph vs. integrated view) — v1.2
      treats it as a second graph but UI still routes to /spenser.
- [ ] Run Drizzle migration for KMD tables.
- [ ] Add QR code generation for SFP Recipes (currently exports JSON)
- [ ] Connect Spenser configure results to procurement workflow
- [ ] Phase 2: Automated PPWR documentation generation
- [ ] Phase 3: AI-powered inline QC feedback loop for 95%+ OEE
- [ ] Consider adding "Add to Compare" on home page actuator cards
- [ ] Keyboard shortcuts for power users
