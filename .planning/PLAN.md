# UX Improvement Plan — AeroSpec User Journeys

## Customer Pain Points Analysis

### Critical Pain Points

#### 1. Configure ↔ Compare: Completely Disconnected
- After running predictions in Configure, users see ranked actuator results
- The "Compare Actuators" link on Results page (`/results`) goes to `/compare` with **zero context**
- Compare page requires manual re-selection of actuators, fluid, and pressure
- Users must mentally track which actuators scored well, then re-find them in Compare
- **Impact**: High friction at the most critical decision-making step. Users who want to evaluate 2-3 top candidates face a complete context restart

#### 2. Compare Page is a Dead End
- No outbound CTAs: no "View Detail", no "Procure", no "Export"
- Users compare actuators but can't act on the comparison
- No URL state — comparisons can't be shared with colleagues or bookmarked
- No export for engineering review meetings
- **Impact**: Comparison results are ephemeral and non-actionable

#### 3. Home Page Catalog: Context Lost on Navigation
- Actuator cards link to `/configure` with no pre-selection
- Fluid rows link to `/configure` with no pre-selection
- User browses the catalog, finds an interesting actuator, clicks it, and lands on a blank form
- **Impact**: Wasted research effort; user has to manually find the same actuator/fluid in dropdowns

#### 4. Configure Results: No Multi-Select for Comparison
- Results show a ranked list but only offer "Detail" per row
- No way to select 2-4 top actuators and jump to a side-by-side comparison
- The most natural workflow (predict → select top N → compare) doesn't exist
- **Impact**: Forces users into a serial detail-view-one-at-a-time workflow instead of parallel comparison

### Medium Pain Points

#### 5. No Cross-Page Workflow Indicator
- No breadcrumbs or step indicators
- Users can't tell where they are in the Configure → Compare → Procure journey
- Navigation relies entirely on the top nav bar (which has 7 items, all equally weighted)
- **Impact**: Cognitive overhead; users lose track of their position in the evaluation workflow

## Critical Features to Implement

### Feature 1: Compare Page Deep Linking
Accept URL params: `?actuators=id1,id2&fluid=fluidId&pressure=5`
Pre-populate actuator selection, fluid, and pressure from URL.

### Feature 2: Compare Page CTAs
- "View Detail" link per actuator column → `/results?actuator=X&fluid=Y&pressure=Z`
- "Procure" button per actuator → `/procurement?actuator=X`
- Export comparison as CSV
- "Copy Share Link" button that generates URL with current state

### Feature 3: Configure Results → Compare Bridge
- Add checkboxes to each result row for multi-select
- Show floating "Compare Selected (N)" button when 2+ selected
- Button links to `/compare?actuators=id1,id2,id3&fluid=fluidId&pressure=5`

### Feature 4: Results Page → Compare with Context
- Fix "Compare" link to include current actuator context
- Link to `/compare?actuators=currentId&fluid=fluidId&pressure=pressure` so at least the current actuator is pre-selected

### Feature 5: Home → Configure with Context
- Actuator cards: `/configure?actuator=id`
- Fluid rows: `/configure?fluid=id`
- Configure page reads URL params and pre-selects matching entries

### Feature 6: Workflow Breadcrumb
- Subtle breadcrumb component: Configure → Compare → Procure
- Highlights current step
- Shows on Configure, Compare, Results, and Procurement pages

## Implementation Order
1. Compare deep linking (foundation for everything else)
2. Compare CTAs (makes Compare useful)
3. Configure multi-select + Compare bridge (the highest-impact flow)
4. Results → Compare fix (quick fix)
5. Home → Configure context (improves entry flow)
6. Workflow breadcrumb (improves navigation clarity)
