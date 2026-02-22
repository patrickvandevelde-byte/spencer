# Project State

## Current Focus
Spenser Configurator (SFP Operating Standard) — fully implemented

## Recently Completed
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
- [ ] Run Drizzle migration for KMD tables
- [ ] Add QR code generation for SFP Recipes (currently exports JSON)
- [ ] Connect Spenser configure results to procurement workflow
- [ ] Phase 2: Automated PPWR documentation generation
- [ ] Phase 3: AI-powered inline QC feedback loop for 95%+ OEE
- [ ] Consider adding "Add to Compare" on home page actuator cards
- [ ] Keyboard shortcuts for power users
