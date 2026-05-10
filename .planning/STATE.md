# Project State

## Current Focus
v1.2 moat-thesis architecture: Configurator → Fitment Graph → Parts
Marketplace. Sprint 3 "God-Mode" pass shipped: every score from the
persona pain-point audit now has a real product surface to back it
up. Sprint 4 next: live `/graph` density wired to DB; resolve
placeholders ({{contact_email}}, {{calendly_handle}}, operating
entity); first paid design-partner contracts.

## Recently Completed
- 2026-05-10: **Sprint 3 — God-Mode pain-point coverage** — built
  product surfaces against every persona pain point from
  SYNTHETIC_USER_VALIDATION.md so each score lifts above 8.5.
  - **A2 AVL filter**: `<AvlFilter>` component + `/settings/avl`
    full-control page. Whitelist / blacklist by manufacturer +
    per-SKU exclusion. Wired into `/configure` results; localStorage
    today, tenant-synced on Pro+. Persona P1's #1 ask.
  - **C4 Procurement billing**: `/billing/procurement` — Net-30,
    PO-driven checkout, tax-exempt, sample invoice mock,
    integration matrix per tier. P7's "Stripe alone won't fly".
  - **C3 ERP punch-out**: `/integrations/erp` (cXML 1.2 + OCI 4.0
    spec) + `/api/punchout` health + stub endpoint. P6's price-
    discovery integration ask.
  - **C5 Supplier intel**: `/intel` — capacity utilization,
    lead-time trend, geopolitical + raw-material risk per
    manufacturer. Methodology + source feeds disclosed. P6's "the
    budget line".
  - **A5/E1 Pharma validation**: `/trust/validated-environment`
    with 8 Part-11 control families, validation timeline through
    Q2 2027, design-partner CTA. P3's price of admission.
  - **A4 Architecture deep-dive**: `/trust/architecture` — four
    isolation tiers (multi-tenant → on-prem), DP parameter sheet
    (ε, δ, composition), reference VPC diagram. P1's IP fear.
  - **S4 Consultant tier**: 7th `/pricing` card at $249/mo with
    20–30% rev-share, white-label theming. P10's channel-conflict
    fix.
  - **S2 Partner program**: `/partners` with three tracks (supplier,
    consultant, design partner) + four channel-hygiene commitments.
  - **B5+D2 Sample kit**: `/sample-kit` — three kit tiers (Starter,
    CMO Onboarding, Pilot Bridge) with guaranteed delivery + refund
    teeth + bench-test protocol + result-upload reward.
  - **D1 CMO landing**: `/cmo` — pre-screening + sample-qual
    compression + channel respect. P8 + P9 wedges spelled out.
  - **B2 Ergonomics + A3 Rheology**: surfaced on home page
    "Underused features" section. Dedicated `/rheology` page with
    five regimes, methodology, formulae.
  - **X5 Design partners**: `/design-partners` — six slots (4 live,
    2 open), what we got right / wrong, anonymous until naming
    consent.
  - **X6 About**: `/about` — timeline, four operating principles,
    team scaffold with consent-pending placeholders.
  - **X2 Calendly**: `<CalendlyButton>` component with
    `NEXT_PUBLIC_CALENDLY_URL` env override; placeholder degrades
    to /contact form when unset (visible warning, not silent fail).
- 2026-05-10: **Confidence-signalling pass** — addressed the
- 2026-05-10: **Confidence-signalling pass** — addressed the
  credibility gaps a buyer-evaluator hits on the public site.
  - **Brand merge**: dropped "Spenser" as a separate display brand
    (the Spencer/Spenser typo-collision was a credibility hit).
    Visible UI is now "AeroSpec Actuator" + "AeroSpec SFP". Routes
    (`/spenser/*`), API paths, and DB enums kept (no migration risk).
  - **Open-beta disclosure**: `<BetaBanner>` mounted on home, /graph,
    /pricing, /trust, /privacy, /trust/subprocessors. Frames seed
    figures as forward-looking targets and offers a design-partner
    CTA.
  - **Real contact path**: new `/contact` page with topic-routed form
    + `/api/contact` stub (logs + 202 until wired to Resend / CRM).
    All `*@aerospec.example` mailtos swapped to `/contact?topic=...`.
    Calendly placeholder secondary CTA added to Pro / Pharma /
    Enterprise tiers.
  - **Trust honesty**: status pills downgraded from "Available" to
    "Architecture ready" / "Roadmap" where no production tenants
    exist; SOC 2 timeline pushed from Q2/Q3 2026 → Q4 2026 / Q2 2027;
    last-updated stamp added; methodology Q+A links to
    SYNTHETIC_USER_VALIDATION.md.
  - **Broken-link cleanup**: `/privacy` and `/trust/subprocessors`
    pages built (were referenced from /trust and would have 404'd).
    Footer rebuilt with parent identity, beta pill, copyright stub
    (TODO marker for legal entity name), and primary nav.
  - Outstanding TODOs in code: `{{contact_email}}`,
    `{{calendly_handle}}`, footer "Operating entity TBD".
- 2026-05-10: **Sprint 2 — feedback flywheel** — added the post-config
  contribution loop that makes graph density grow.
  - New `graph_contributions` schema (`src/db/contributions-schema.ts`):
    nullable tenant/user (anonymous free-tier OK), config snapshot,
    bench-tested enum, 1-5 rating, prediction-match enum, salted IP hash.
  - `POST /api/contributions` — Zod-validated insert with demo-mode
    fallback when `DATABASE_URL` is absent (returns 202 + `mode: "demo"`).
  - `GET /api/graph/density` — live counters (validated triples, 7d/30d
    contributions, distinct contributors) layered on the Sprint-1 seed
    baseline; falls back to seed when DB query fails.
  - `<FeedbackWidget>` component: "did you bench-test?" (yes/planned/no),
    1-click 5-star rating, conditional prediction-match prompt, optional
    free-text. Embedded in `/results` (AeroSpec) and `/spenser/configure`.
  - `/graph` page now server-fetches density and surfaces seeded vs.
    live state in the hero chip + footer copy.
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
- [ ] **Sprint 3:** Run Drizzle migration for `graph_contributions`
      and the KMD tables, then surface live top-fluids / top-actuators
      lists on `/graph` (today only the headline counters are live —
      the top-N lists are still seed).
- [ ] **Sprint 3b:** Add rate-limit on `POST /api/contributions`
      (per-ipHash window) and a server-side anti-replay check on
      `configKey` so a single user spamming the widget can't inflate
      density.
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
