# Project State

## Current Focus
User journey improvements across the AeroSpec website

## Recently Completed
- 2026-02-22: Deep UX analysis of all user journeys and pain points
- 2026-02-22: Compare page deep linking (URL params: actuators, fluid, pressure)
- 2026-02-22: Compare page CTAs (Detail, Procure, Export CSV, Share Link, Back to Configure)
- 2026-02-22: Configure results multi-select with floating compare bar
- 2026-02-22: Results → Compare link now carries actuator/fluid/pressure context
- 2026-02-22: Home page catalog cards now pass actuator/fluid IDs to Configure
- 2026-02-22: Configure page reads URL params for pre-selected actuator/fluid
- 2026-02-22: Workflow breadcrumb component (Configure → Compare → Results → Procure)

## Key Decisions
- Use URL params (not localStorage) for cross-page data flow: shareable, bookmarkable, no state sync issues
- Floating compare bar in Configure: non-intrusive, appears only when items are selected
- "Best Match" badge in Compare table header: highlights winner visually
- WorkflowBreadcrumb as separate component: reusable, auto-detects current step from pathname

## Known Issues
- Pre-existing lint warning in results/page.tsx (unused ToolingSpec import) — not from our changes
- Compare page still uses component state for selections after initial URL load — URL doesn't update live as user changes selections

## What's Next
- [ ] Consider adding "Add to Compare" button directly on home page actuator cards
- [ ] URL state sync for Compare page (update URL as user changes selections)
- [ ] Keyboard shortcuts for power users (e.g., 'c' to compare selected)
- [ ] Animated transitions between workflow steps
