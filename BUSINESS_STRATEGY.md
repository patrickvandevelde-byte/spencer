# AeroSpec Business Strategy & Product Roadmap

> **v1.2 (2026-05-10):** Strategic architecture commits to a three-pillar
> model — **Configurator → Fitment Graph → Parts Marketplace** — closely
> patterned on TVH (parts distributor whose moat is the fitment graph,
> not the storefront). Pricing flips: configurations become unmetered
> on every tier; revenue ladders by graph access depth + procurement
> margin. ML accuracy claim recast as graph-density KPI. Full v1.2
> changelog in §12.
>
> **v1.1 (2026-05-10):** Tightened time-savings, BOM, ML, and CAC claims
> based on synthetic-user validation. ICP narrowed to mid-market CPG +
> regional CMOs; Indie tier and Pharma SaaS vertical added; procurement
> model split into three transparent take-rates. v1.1 changelog in §11.

## 0. Moat Thesis & Strategic Architecture **[v1.2]**

**The asset is the fitment graph, not the configurator.**

A configurator UI can be cloned in two quarters by Coster, Spencer, or any
CAD vendor. A *cross-reference graph* — the curated, growing dataset of
**fluid rheology → actuator geometry → spray outcome → material
compatibility → regulatory flag** — cannot be cloned without a decade of
data acquisition or a customer base contributing back. TVH built a
$2B/yr parts-distribution business on exactly this primitive: their moat
is the fitment data, the catalog and the storefront are downstream.

### The three pillars

1. **Configurator (the funnel).** Best-in-class spray-physics calculator.
   **Free / unmetered for everyone.** Each session is a deposit into the
   graph (the fluid the user tried, the actuator they picked, the outcome
   they reported back). Optimized for **contribution rate**, not for
   per-seat revenue.

2. **Fitment Graph (the moat).** Proprietary, growing cross-reference
   asset. Density and quality compound with every configurator session
   and every customer-reported bench / field outcome. Surfaced publicly
   at `/graph` so buyers, partners, and investors can see the asset
   getting denser week-over-week. **Graph density is the headline
   company KPI** — replacing "configurations / month" from v1.0.

3. **Parts Marketplace (the monetization).** The graph is what makes the
   parts business defensible: customers come for the answer ("which
   actuator fits my fluid?") and stay for the one-click sample order.
   Revenue stack:
   - Sample / pilot orders: **10–15% take-rate** baked into list price
     (intact from v1.1)
   - Production POs: **2–4% transparent marketplace fee** shown line-item
   - Graph access tiers: SaaS subscription priced by *what slice of the
     graph you can read* (community / validated / supplier-qualified /
     private)
   - Enterprise: SaaS + implementation fee, no procurement margin
     (Ariba / Coupa / SAP punch-out, channel-conflict-free)

### What this changes vs. v1.1

| Dimension | v1.1 | v1.2 |
|---|---|---|
| Headline KPI | Configurations / month | **Graph density** (validated fluid-actuator-outcome triples) |
| Configurator pricing | Metered (10 / 50 / unlimited) | **Free / unmetered everywhere** |
| Tier ladder | Configs + features | **Graph access depth + procurement perks** |
| ML claim | "70% → 85% accuracy in 18mo" | **"Graph density → predictive confidence"** (accuracy is a downstream consequence of density, not a directly-pursued metric) |
| Catalog target | 27 actuators × 25 fluids (sufficient for demo) | **27 → 200 in 6mo → 2,000+ in 18mo** via supplier partnerships and crowd-curated long-tail |
| Defensibility narrative | "We have a configurator + procurement attach" | **"We are the fitment graph for spray actuators"** |

### Year-3+ optionality (not committed)

The graph naturally enables a second moat — **outcome-as-a-service** in
the Rolls-Royce TotalCare mold: once predictive density is high enough,
package "guaranteed actuation cycles" as a per-million-spray SLA,
underwriting actuator failure in pharma MDI / luxury fragrance / industrial
dispensing where failure cost is highest. **Not built into Year-1 plan;
held as future option.**

### Spenser SFP under v1.2

Spenser is reframed as a **second fitment graph** on shared infrastructure
(gas-free dispensing parts, same monetization model, same graph schema)
rather than a co-equal twin product. Homepage no longer gives equal
billing; Spenser is reached via a sub-nav under "Other graphs."

---

## Executive Summary

AeroSpec transforms the actuator selection and procurement process from a
manual, time-intensive R&D workflow into a digitized, AI-powered platform.
This document outlines the customer segments, critical use cases, pain
points, and SaaS / e-commerce monetization strategy.

**[v1.1] ICP refinement:** the Year-1 sweet spot is **mid-market CPG
brands ($50M–$500M revenue) and regional / specialty CMOs**, plus a new
**Indie / Maker** product-led wedge and a separate **regulated-pharma
SaaS** vertical. Tier-1 CPG (Unilever / P&G / Henkel-class) is a Year-2+
enterprise-integration motion, not a Year-1 ICP.

---

## 1. Customer Profiles & User Personas

### 1.1 Primary Customer Segments

#### **Segment A: Formulation Chemists (R&D Teams)**
- **Role:** Research & development professionals developing spray-based products
- **Organization Size:** 50–500+ employees
- **Budget Authority:** Medium (influenced by purchasing department)
- **Pain Points:**
  - Currently manually test dozens of actuator configurations against new formulations
  - Trial-and-error process takes 2–6 weeks per new product
  - Lack real-time access to spray physics predictions
  - Need MSDS parsing and hazard compliance tracking
  - **[v1.1] Caveat:** Tier-1 CPG R&D will not export formulation data to
    an external SaaS without on-prem / VPC-isolated deployment or
    differential-privacy aggregation. Treat them as a Year-2 motion gated
    on SOC 2 Type II + isolated-tenancy.
- **Buying Signal:** New product development cycles; compliance audits
- **Key Metrics:** Time-to-market reduction (from weeks to hours), R&D cost savings
- **Use Frequency:** 5–15 configurations per month during active development
- **Typical Workflow:**
  1. Receive new fluid formulation (with MSDS)
  2. Input fluid properties into AeroSpec
  3. Receive compatibility matrix + predicted spray parameters
  4. Order sample batches for bench testing
  5. Compare results against prediction; provide feedback

#### **Segment B: Packaging Engineers (Downstream Users)**
- **Role:** Design spray systems for consumer products (perfume, cleaning products, haircare)
- **Organization Size:** Mid-market (100–2000 employees)
- **Budget Authority:** Medium to high (capital budgeting)
- **Pain Points:**
  - Depend on actuator manufacturers' technical datasheets (incomplete for custom formulations)
  - Pressure to reduce BOM cost while meeting performance specs
  - Need to match actuator compatibility with regulatory constraints (flammability, environmental)
- **Buying Signal:** New product launches; cost reduction initiatives
- **Key Metrics:** BOM cost reduction, time-to-market, regulatory compliance
- **Use Frequency:** 2–5 configurations per quarter; bulk procurement during ramp-up
- **Typical Workflow:**
  1. Receive formulation specs from upstream (marketing, R&D)
  2. Use AeroSpec to validate actuator performance predictions
  3. Cross-compare against competitor products
  4. Initiate procurement (sample → pilot → production quantities)
  5. Monitor feedback loop; adjust as needed

#### **Segment C: Procurement/Supply Chain Leaders**
- **Role:** Manage vendor relationships and supply contracts
- **Organization Size:** Enterprise-level
- **Budget Authority:** High (approval authority for >$100k contracts)
- **Pain Points:**
  - Manual RFQs to multiple suppliers (Spencer, Coster, FDG, Wessel)
  - Lack visibility into real-time inventory and pricing
  - Pressure to consolidate suppliers and reduce complexity
- **Buying Signal:** Annual contract reviews; inventory optimization
- **Key Metrics:** Cost per unit, supplier consolidation, lead time reduction
- **Use Frequency:** 2–10 purchase orders per month
- **Typical Workflow:**
  1. Receive engineering specifications from packaging team
  2. Query AeroSpec for price/availability across suppliers
  3. Generate bulk POs directly within platform
  4. Track shipments and monitor SLAs
  5. Provide feedback on compatibility and performance

#### **Segment D: Contract Manufacturers (CMOs)**
- **Role:** Manufacture spray formulations for third-party brands
- **Organization Size:** 100–1000+ employees
- **Budget Authority:** High (capital and R&D budgets)
- **Pain Points:**
  - Operate on thin margins; need rapid design-to-production cycles
  - Support multiple brands simultaneously with varying requirements
  - Minimize waste and failed batches (time + material cost)
- **Buying Signal:** New customer engagements; process optimization drives
- **Key Metrics:** Batch yield, time-to-first-production, customer satisfaction
- **Use Frequency:** 5–20 configurations per month
- **Typical Workflow:**
  1. Ingest brand specifications and formulations
  2. Use AeroSpec to pre-screen actuator compatibility
  3. Cross-check with existing procurement contracts
  4. Initiate rapid sampling and validation
  5. Scale to pilot and production with minimal rework

---

## 2. Critical Use Cases & Pain Points

### 2.1 Use Case 1: New Product Development (Formulation-to-Sample)

**Actors:** Formulation Chemist, Packaging Engineer, Procurement Lead

**Current Process (6–8 weeks):**
1. Receive new fluid formulation
2. Manual literature review of compatible actuators (2–3 days)
3. Order 5–10 sample actuators from suppliers (3–5 days lead time)
4. Bench test samples (3–5 days per iteration)
5. Analyze spray patterns, Ohnesorge regime, safety (2–3 days)
6. Iterate if results don't match expectations (repeats steps 3–5)
7. Document findings and proceed to production BOM

**Pain Points:**
- **Time:** Sequential, trial-and-error iterations delay go-to-market
- **Cost:** Wasted samples, reagent usage, labor hours
- **Data Loss:** Paper-based documentation, tribal knowledge silos
- **Compliance:** Manual hazard tracking; risk of missing safety constraints

**AeroSpec Solution:**
- **Input fluid properties** (viscosity, density, surface tension, flash point) from MSDS
- **Instant compatibility matrix** showing predicted spray physics (cone angle, droplet size) for all ~25 actuators
- **Visual comparison tools** to see side-by-side predictions
- **Ohnesorge regime classification** with safety warnings
- **Directly order samples** through integrated procurement
- **Closed-loop feedback:** Test results feed ML model for continuous improvement

**Expected Impact:**
- **[v1.1] Reduce screening / shortlist phase** from 2–3 weeks → **2–3 days**
  (the original "2–3 hours" claim conflated prediction with the bench
  validation that customers will not skip; see Validation §5, row 1)
- **Reduce total sample waste** by 40–60%
- **Improve compliance tracking** with automated hazard flags
- **Enable parallel testing** of top 3–5 candidates instead of sequential

---

### 2.2 Use Case 2: Cost Optimization & Supplier Consolidation

**Actors:** Packaging Engineer, Procurement Lead, Supply Chain Director

**Current Process (4–6 weeks):**
1. Specify actuator requirements (performance, cost, volume)
2. Issue RFQs to 3–5 suppliers manually
3. Wait for quotes (5–10 days per supplier)
4. Compare pricing, MOQs, lead times in spreadsheets
5. Negotiate contracts; update internal BOM systems
6. Place initial PO; monitor shipments

**Pain Points:**
- **Time:** RFQ-to-contract can take 6+ weeks for strategic components
- **Fragmentation:** Each supplier has different pricing, MOQ, lead time
- **Visibility:** No real-time inventory or pricing updates
- **Waste:** Duplicate data entry across systems; supplier consolidation difficult

**AeroSpec Solution:**
- **Unified supplier catalog:** Spencer, Coster, FDG, Wessel integrated
- **Real-time pricing & inventory:** Direct API feeds from suppliers
- **Bulk RFQ generation:** One-click multi-supplier requests
- **Price optimization algorithm:** Automatically recommend lowest-cost configuration meeting specs
- **Contract templates:** Pre-negotiated terms with suppliers
- **Direct procurement:** Place POs within platform; auto-sync to ERP

**Expected Impact:**
- **[v1.1] Reduce RFQ cycle** from 4–6 weeks → **10–14 days** (the
  original "2–3 days" did not account for internal approval workflows;
  see Validation §5, row 2)
- **[v1.1] Reduce BOM cost** by **4–8% on incumbent switches** and 10–15%
  only on greenfield BOMs after netting out qualification cost (3–6 mo,
  ~$80k); see Validation §5, row 3
- **[v1.1] Consolidate quote intake** (not contracts) from 4–5 → 1
  request — Tier-1 CPG sourcing teams will not consolidate contracts
  through a middleman
- **Improve supply chain visibility** with real-time SLA tracking

---

### 2.3 Use Case 3: Cross-Platform Compliance & Regulatory

**Actors:** Quality Assurance Lead, Regulatory Affairs, Formulation Chemist

**Current Process (2–3 weeks per product):**
1. Manual review of fluid hazard classification
2. Cross-reference actuator material compatibility against chemical databases
3. Document compatibility constraints in design specifications
4. Risk assessment for flammable fluids, pressure vessels, environmental exposure
5. Submit regulatory documentation for approval

**Pain Points:**
- **Manual review:** Spreadsheet-based tracking; prone to human error
- **Fragmentation:** Different regulatory frameworks (EPA, CPSIA, CE marking)
- **Incomplete data:** Material safety data sheets often outdated or incomplete
- **Audit risk:** Limited audit trail; difficult to demonstrate compliance

**AeroSpec Solution:**
- **Automated MSDS parsing:** Extract hazard classification, flash point, regulatory notes
- **Material compatibility matrix:** Verified against material suppliers (e.g., Dupont Elastomer Database)
- **Regulatory flag system:** Highlight constraints for EPA, CPSIA, CE, FCC, RoHS
- **Audit trail:** Complete version history and decision logs
- **Safety recommendations:** Automated warnings for incompatible fluid-actuator pairs
- **Compliance export:** Generate regulatory documentation for submission

**Expected Impact:**
- **Reduce compliance review** from 2–3 weeks → 2–3 days
- **Eliminate manual errors** through automated hazard matching
- **Improve audit readiness** with complete decision logs
- **Enable faster regulatory approval** with pre-formatted submission docs

---

### 2.4 Use Case 4: Real-World Feedback Loop & ML Iteration

**Actors:** Formulation Chemist, Field Sales, ML/Data Team

**Current Process (Manual, Ad-hoc):**
1. Field teams collect spray test results (spray pattern, cone angle, flow rate)
2. Communicate findings back to R&D via email, meetings
3. Data enters tribal knowledge (no central repository)
4. Insights never feed back into actuator selection guidance

**Pain Points:**
- **Lost Data:** Real-world feedback never reaches predictive models
- **Tribal Knowledge:** Decision rules stuck in people's heads, not codified
- **No Continuous Improvement:** Prediction accuracy doesn't improve over time
- **Missed Opportunities:** Patterns in failed configurations go unanalyzed

**AeroSpec Solution:**
- **Integrated feedback capture:** Users report actual spray performance post-launch
- **Anomaly detection:** Flag predictions that diverge from reality
- **ML pipeline:** Automatically retrain models using verified field data
- **Version control:** Track model accuracy improvement over time
- **Insights dashboard:** Highlight emerging patterns and rules
- **Feedback rewards:** Gamification to encourage user participation

**Expected Impact:**
- **Improve prediction accuracy** from 70% → 90%+ within 6 months
- **Enable proactive alerts** for high-risk configurations before field deployment
- **Capture institutional knowledge** in data instead of people
- **Create defensible moat:** Proprietary training data; hard to replicate

---

## 3. Customer Journey Map

```
AWARENESS           CONSIDERATION        DECISION            IMPLEMENTATION      EXPANSION
────────────────────────────────────────────────────────────────────────────────────────

↓                   ↓                     ↓                  ↓                    ↓
─ Trade show        ─ Free trial (14 days)  ─ Case study      ─ Onboarding (2h)   ─ Bulk procurement
  demo             ─ Webinar               ─ ROI calc         ─ API setup          ─ Advanced APIs
─ LinkedIn posts   ─ Technical docs        ─ Security audit   ─ Team training      ─ Custom integrations
─ Referrals        ─ Competitive matrix    ─ Pilot project    ─ Go-live            ─ ML feedback loop
─ Industry         ─ Customer testimonials                    ─ 30-day check-in    ─ Enterprise plan
  publications

USER:
Formulation Chemist / Packaging Engineer / Procurement Lead
```

---

## 4. Pricing & Monetization Strategy

### 4.1 Tier-Based SaaS Pricing Model **[v1.2]**

> **v1.2 pricing flip:** Configurator is **free and unmetered on every
> tier**. Tiers ladder by *graph access depth* + *procurement perks*.
> Configurations are inputs to the moat, not products sold to users.

#### **Free Configurator: $0**
- **Target:** Anyone — students, researchers, curious engineers, indie
  founders evaluating fit
- **Includes:**
  - Unlimited configurations (forever)
  - Read access to the **community-validated subgraph** (only triples
    where ≥3 customers have reported consistent outcomes)
  - Sample marketplace access (10–15% take-rate baked into list price)
  - 1 user seat · community support
- **Why this exists (v1.2):** Configurations are the data-acquisition
  instrument. A paywall on configs is a paywall on the moat. Free is
  correct.

#### **Indie / Maker Plan: $99/month**
- **Target:** Indie DTC brands (haircare, clean beauty, fragrance), 5–50
  FTE, ordering 5–25k units per launch
- **Includes:**
  - Everything in Free
  - Saved configurations + project workspace (cloud)
  - Read access to the **full validated graph** (single-customer reports
    included with confidence flagging)
  - Indie procurement perks: bundled sample kits, MOQ-flexible pilot
    runs, 10% off catalog
  - 1 user seat · email support (48h)

#### **Starter Plan: $500/month**
- **Target:** Single-product R&D teams, SMB packaging shops
- **Includes:**
  - Everything in Indie
  - **Supplier-qualified filter** (only show actuators from your
    qualified-vendor list)
  - Manual MSDS entry + Ohnesorge classification + safety warnings
  - Audit trail per configuration
  - 1 user seat · email support (24h)
  - **15% off** actuator orders placed through platform

#### **Professional Plan: $2,000/month**
- **Target:** Mid-market CPG + regional CMOs (the v1.1 sweet spot)
- **Includes:**
  - Everything in Starter
  - **Graph API access** (10k calls / month — read fitment data
    programmatically)
  - MSDS OCR + automated hazard extraction
  - Regulatory compliance flags (EPA / CPSIA / CE / RoHS)
  - Up to 5 user seats · Slack + email priority (4h)
  - PDF / CSV / BOM export · scheduled reports
  - **Preferred Spencer pricing** + 15% catalog discount

#### **Pharma SaaS Plan: $4,000–$8,000/month** *(v1.1, refined v1.2)*
- **Target:** Inhalation pharma / nasal spray CDMOs (MDI, DPI, nasal); 200–
  2,000 FTE
- **Includes:**
  - Everything in Professional, **plus**:
  - 21 CFR Part 11 compliant audit trail + e-signature
  - Validated environment (IQ/OQ documentation provided)
  - **Private graph contributions** — your bench results stay in your
    tenant; aggregated only with explicit opt-in via differential privacy
  - Candidate-ranking-only mode for early-phase formulation screening
  - GMP-friendly export · no procurement attach (by design)
- **Why it exists:** Pharma CDMOs explicitly do not want procurement
  features but pay materially more for validated SaaS + graph access
  without IP exposure (validation P3, Tanaka).

#### **Enterprise Plan: Custom Pricing (typically $8,000–$25,000/month)** *(v1.1, refined v1.2)*
> v1.2 framing: Enterprise is **graph access at maximum depth + on-prem
> tenancy + ERP punch-out**. No transactional procurement margin (channel-
> conflict-free). Implementation fee $10–50k one-time.
- **Target:** Large OEMs, contract manufacturers, supply chain leaders
- **Includes:**
  - Everything in Professional
  - Unlimited API calls
  - ERP integration (SAP, Oracle NetSuite via Zapier/custom webhooks)
  - Custom integrations (supplier systems, regulatory databases)
  - Dedicated account manager
  - Quarterly business reviews
  - Custom ML model training (using their proprietary formulations)
  - Volume-based procurement discounts (20%+ for qualified volume)
  - SLA guarantee (99.9% uptime)
  - Advanced analytics and predictive insights
- **Implementation fee:** $10,000–$50,000 (one-time)

### 4.2 Procurement Revenue (Core Monetization)

> **[v1.1] Major revision.** Validation interviews (P1, P6) showed the
> uniform "$0.50–$2.00 hidden margin per unit" model breaks at production
> volume — Tier-1 CPG framework pricing ($0.04–$0.09/unit at 50–500M
> units/yr) is 15–25× below our previously stated wholesale price, and
> sourcing teams will route those POs around the platform. The model is
> now split by transaction type:

**Tier 1 — Sample & pilot marketplace (margin survives here):**
- Spencer / Coster sample cost: $2–$5 per unit
- Platform sample price: $4–$15 per unit
- AeroSpec margin: **$0.50–$2.00 per unit (10–15% take-rate)**
- This is where the original v1.0 model is intact — small-batch sample
  buys, qualification orders, indie pilot runs.

**Tier 2 — Production price-discovery + RFQ orchestration:**
- Pass-through pricing (transparent supplier quotes, no hidden margin)
- AeroSpec take-rate: **2–4% marketplace fee, capped per PO**
- Customer-facing value: consolidated RFQ intake, real-time pricing,
  audit trail. Suppliers pay (or co-pay) the take-rate, not the buyer.

**Tier 3 — Enterprise integration (no transactional margin):**
- Ariba / Coupa / SAP punch-out, ERP webhooks
- Monetized via SaaS subscription + one-time implementation fee
- No procurement margin on production POs — channel-conflict avoidance.

**[v1.1] Revenue projection (Year 1, recast):**
- Sample / pilot procurement: ~$150k (was rolled into $340k)
- Production price-discovery take-rate: ~$25k (conservative ramp)
- See §8 for the full revised Year-1 mix.

**Revenue Projection (Year 1):**
- 50 Starter customers × 100 units/month = 60,000 units
- 20 Professional customers × 500 units/month = 120,000 units
- 3 Enterprise customers × 2,000 units/month = 72,000 units
- **Total Year 1:** ~252,000 units × $1.00 average margin = **$252,000**

**Revenue Projection (Year 2, scaled):**
- 200 Starter customers = 240,000 units
- 100 Professional customers = 600,000 units
- 10 Enterprise customers = 240,000 units
- **Total Year 2:** ~1,080,000 units × $1.20 average margin = **$1,296,000**

### 4.3 Additional Revenue Streams

#### **A. Data & Analytics Licensing**
- **Anonymized trend reports:** Predict market demand for actuator types
- **Formulation insights:** Identify gaps in product portfolio
- **Buyer:** Actuator manufacturers (Spencer, Coster, FDG)
- **Price:** $10k–$50k per year per licensee
- **Frequency:** 4 licensees × $30k = **$120k/year**

#### **B. Consulting & Custom Model Training**
- **Service:** Build proprietary ML models for enterprise customers
- **Use Case:** Estimate spray performance for non-Newtonian fluids or novel geometries
- **Price:** $20k–$100k per engagement
- **Frequency:** 2–4 engagements per year = **$60k–$200k/year**

#### **C. Integration & API Licensing**
- **Partners:** ERP vendors, supplier systems, quality management tools
- **Use Case:** Embed AeroSpec predictions into third-party workflows
- **Price:** Revenue share (5–10% of platform revenue from integrated customers)
- **Frequency:** 2–3 strategic partnerships = **$50k–$150k/year (Year 2+)**

#### **D. Premium Support & SLA**
- **Enterprise customers:** 24/7 support, dedicated success manager
- **Add-on:** $2,000–$5,000/month per account
- **Frequency:** 2–4 customers opt-in = **$48k–$240k/year**

---

## 5. SaaS Feature Roadmap

### Phase 1: MVP (Weeks 1–4) ✅ In Progress
- [x] Actuator catalog (25+ SKUs)
- [x] Fluid reference library (25 Newtonian fluids)
- [x] Compatibility matrix generation
- [x] Ohnesorge regime classification
- [x] Spray pattern visualization
- [ ] Basic user authentication
- [ ] Configuration history (per user)
- [ ] Simple feedback loop (star ratings)

### Phase 2: Core SaaS (Months 2–3)
- [ ] User accounts & multi-seat management
- [ ] MSDS file upload & OCR parsing
- [ ] Automated hazard extraction (regex + NLP)
- [ ] Regulatory compliance flags (EPA, CPSIA, CE)
- [ ] Advanced search & filtering
- [ ] Saved configurations (cloud storage)
- [ ] Export to PDF/CAD (BOM generation)
- [ ] Email/Slack notifications
- [ ] Basic analytics dashboard (config count, most-used SKUs)
- [ ] Stripe payment integration
- [ ] Email support queue

### Phase 3: Procurement Integration (Months 4–5)
- [ ] Spencer/Coster pricing API integration
- [ ] Real-time inventory feed
- [ ] Direct procurement workflow (sample → bulk)
- [ ] Shopping cart & checkout
- [ ] Order tracking (shipment status)
- [ ] Invoicing & payment (net-30 terms for enterprises)
- [ ] Procurement discount tiers
- [ ] Supplier performance tracking

### Phase 4: ML & Continuous Learning (Months 6–7)
- [ ] Feedback capture mechanism (post-use survey)
- [ ] Anomaly detection (prediction vs. reality)
- [ ] Automated model retraining (weekly)
- [ ] A/B testing framework (new models)
- [ ] Model accuracy dashboard
- [ ] Insights & recommendations engine
- [ ] Field data visualization (heat maps of common configurations)

### Phase 5: Enterprise Features (Months 8–9)
- [ ] API tier & rate limiting
- [ ] ERP webhooks (SAP, Oracle, NetSuite)
- [ ] Single sign-on (SAML/OAuth)
- [ ] Role-based access control (RBAC)
- [ ] Audit logging & compliance reports
- [ ] Custom integrations (Zapier, Make)
- [ ] White-label option (partner resale)
- [ ] SLA monitoring & uptime dashboard

### Phase 6: Advanced Analytics (Months 10–12)
- [ ] Custom reporting builder
- [ ] Predictive insights (demand forecasting)
- [ ] Cost optimization recommendations
- [ ] Supplier consolidation analysis
- [ ] Regulatory change alerts
- [ ] Custom ML model training (proprietary fluids)
- [ ] Data export (raw datasets for BI tools)

---

## 6. Competitive Positioning

### Current Market Gaps

| Feature | AeroSpec | CAD Software* | Supplier Datasheets | Consulting |
|---------|----------|---------------|-------------------|------------|
| **Instant Compatibility** | ✅ | ❌ | ❌ | ✅ (slow) |
| **Spray Physics Prediction** | ✅ | ❌ | ❌ | ✅ (expensive) |
| **Real-time Procurement** | ✅ | ❌ | ❌ | ❌ |
| **Automated Hazard Compliance** | ✅ | ❌ | ❌ | ✅ (manual) |
| **Closed-loop ML Feedback** | ✅ | ❌ | ❌ | ❌ |
| **Cost** | $500–$20k/yr | $5k–$50k/yr | Free | $100k+/yr |
| **Speed (Hours → Minutes)** | ✅ | Slow | Manual | Weeks |

*CAD = SolidWorks, CATIA, Fusion 360

### Key Differentiators

1. **Prediction Velocity:** Formulation → compatible actuators in <5 minutes
2. **Closed-loop Learning:** Feedback directly improves future predictions
3. **Procurement Integration:** From prediction to order in one platform
4. **Regulatory Automation:** Compliance flags without manual review
5. **Industry Expertise:** Ohnesorge regime, spray physics embedded in UI
6. **Real-time Pricing:** Live inventory and pricing across suppliers

---

## 7. Go-to-Market Strategy

### Phase 1: Early Adopter Outreach (Months 1–2)
- **Target:** 20 formulation chemists at Spencer/Coster customers
- **Mechanism:** Direct outreach via LinkedIn; free 30-day trial
- **Conversion Goal:** 5–10 Starter customers
- **Case Study Goal:** 1–2 detailed customer testimonials

### Phase 2: Content Marketing (Months 2–4)
- **Blog:** "5 Most Common Actuator Selection Errors" (SEO-optimized)
- **Webinar:** "From Formulation to Production in 48 Hours"
- **Whitepaper:** "Cost-Benefit Analysis: AeroSpec vs. Manual Selection" (gated)
- **LinkedIn:** Weekly tips on spray physics, formulation compliance
- **Goal:** 100+ inbound leads per month

### Phase 3: Industry Partnerships (Months 3–6)
- **Spencer/Coster:** Co-marketing, sales enablement
- **Suppliers:** Premium listings, referral fees (10% for closed deals)
- **ERP vendors:** Integration partnerships (Zapier, Make.com)
- **Industry associations:** Booth at trade shows (ESCA, AOAC)

### Phase 4: Sales Motion (Ongoing)
- **Inside Sales:** AE responsible for Professional/Enterprise tiers
- **Account-Based Marketing:** Targeted campaigns for high-value prospects
- **Sales Collateral:** ROI calculator, competitive matrix, technical briefs
- **Sales Enablement:** Monthly win/loss analysis; playbook updates

### Phase 5: Customer Success (Ongoing)
- **Onboarding:** 2-hour walkthrough for Professional+ tiers
- **NPS Surveys:** Monthly pulse check; respond to detractors within 48h
- **Usage Analytics:** Identify at-risk accounts (low engagement); proactive outreach
- **Quarterly Business Reviews:** Strategic alignment for Enterprise customers
- **Expansion:** Upsell advanced features as customers mature

---

## 8. Financial Projections (Year 1–3)

### Assumptions
- SaaS customers grow at 40% YoY
- Procurement transaction volume grows at 150% YoY (as product scales)
- Average transaction margin: $1.00–$1.50 (samples / pilot only); 2–4%
  marketplace fee on production POs **[v1.1]**
- **[v1.1]** Customer acquisition cost (CAC): **$1,500 Indie/Starter,
  $8,000–$12,000 Professional, $30,000–$50,000 Enterprise** (was
  understated in v1.0; per validation P10)
- Payback period: 8–12 months Indie/Starter; 14–18 months Pro;
  18–24 months Enterprise **[v1.1]**

### Year 1 Projection — **[v1.1] recast**
| Category | Q1 | Q2 | Q3 | Q4 | **Year 1 Total** |
|----------|----|----|----|----|-----------------|
| SaaS — Indie ($99) + Starter + Pro | $5k | $15k | $30k | $45k | **$95k** |
| Pharma SaaS (1–2 design partners) | $0 | $2k | $4k | $4k | **$10k** |
| Sample / Pilot Procurement (10–15%) | $10k | $25k | $45k | $70k | **$150k** |
| Production Procurement (2–4% take) | $0 | $3k | $7k | $15k | **$25k** |
| **Gross Revenue** | $15k | $45k | $86k | $134k | **~$280k** |
| Operating Costs | $120k | $135k | $150k | $170k | **$575k** |
| **Net (EBITDA)** | -$105k | -$90k | -$64k | -$36k | **-$295k** |

> **Why down from $400k → $280k (v1.1):** Validation showed Tier-1 CPG
> production procurement will not flow through AeroSpec in Year 1 (P1, P6).
> The Indie tier and Pharma SaaS recover ~$45k of that loss. The remaining
> gap is real and should be closed in Year 2 via indie ramp and Ariba /
> Coupa integrations, not by re-asserting the v1.0 numbers.

### Year 2 Projection
| Category | Target |
|----------|--------|
| SaaS Subscriptions | $350k |
| Procurement Revenue | $1,300k |
| Data & Analytics | $120k |
| Consulting & Integration | $150k |
| **Gross Revenue** | **$1,920k** |
| Operating Costs | $900k |
| **Net (EBITDA)** | **+$1,020k (53% margin)** |

### Year 3 Projection
| Category | Target |
|----------|--------|
| SaaS Subscriptions | $800k |
| Procurement Revenue | $3,500k |
| Data & Analytics | $300k |
| Consulting & Integration | $400k |
| **Gross Revenue** | **$5,000k** |
| Operating Costs | $1,500k |
| **Net (EBITDA)** | **+$3,500k (70% margin)** |

---

## 9. Risk Mitigation & Contingencies

### Risk 1: Supplier Integration Delays
- **Mitigation:** Begin API scoping with Spencer/Coster immediately; negotiate exclusivity windows
- **Fallback:** Launch with manual procurement initially; automate later

### Risk 2: Prediction Model Inaccuracy
- **Mitigation:** Start with conservative predictions; weight field feedback heavily
- **Fallback:** Offer "safety factor" mode; validate all predictions via small-scale testing

### Risk 3: Competitive Pressure (CAD vendors, consultants)
- **Mitigation:** Lock in early-adopter data; establish network effects
- **Fallback:** Position as complementary (export to CAD); offer white-label to consultants

### Risk 4: Regulatory Complexity
- **Mitigation:** Hire regulatory compliance expert early; build modular compliance flags
- **Fallback:** Start with single region (e.g., EPA); expand incrementally

---

## 10. Success Metrics & KPIs

### Product Metrics **[v1.2 — graph-density-led]**
- **Graph density (headline KPI):** target **5,000 validated triples**
  by end of Year 1 (fluid-class × actuator × confirmed-outcome).
  Current baseline: ~675 unvalidated potential pairs (27 actuators × 25
  fluids); ~200 validated via internal seed data.
- **Catalog depth:** **27 → 200 SKUs by month 6, 2,000+ by month 18**
  via supplier partnerships (Spencer, Coster, Lindal, Aptar) +
  crowd-curated long-tail.
- **Contribution rate:** **35% of configurator sessions** end with a
  feedback / outcome capture by end of Year 1. (Currently 0% — feedback
  loop ships in Sprint 2.)
- **Feedback loop adoption:** 20% of Professional+ customers submitting
  field data (per v1.1 — gated on differential-privacy / on-prem).
- **Predictive confidence:** downstream consequence of graph density.
  Model accuracy 70% → 85% over 18 months remains the engineering
  milestone; the *measured* customer-facing metric is **% of
  recommendations with ≥3-source consensus in the graph**.
- **System uptime:** 99.5%+

### Business Metrics
- **Customer acquisition:** 50+ SaaS customers (all tiers) by end of Year 1
- **Net retention rate:** >120% (expansion + upsell revenue)
- **Customer lifetime value (LTV):** >$20,000 (based on procurement margin + subscription)
- **Gross margin:** >60% by end of Year 1
- **Payback period:** <12 months for all cohorts

### Customer Health
- **NPS (Net Promoter Score):** Target 50+ (by annual survey)
- **Churn rate:** <5% monthly (SaaS), <10% annually
- **Support ticket resolution:** <48 hours for Professional+
- **Feature adoption:** >70% of key features used within 60 days

---

## 11. [v1.1] Changelog & Synthetic-User Validation Summary

**Source:** `SYNTHETIC_USER_VALIDATION.md` (10 personas across Segments
A–D plus pharma + consultant skeptics; 12-question structured script).

**Headline changes:**

1. **ICP narrowed.** Year-1 sweet spot = mid-market CPG ($50M–$500M) +
   regional CMOs. Tier-1 CPG and indie DTC are addressed via *separate*
   motions (Enterprise integration; Indie/Maker product-led tier).
2. **Indie / Maker tier added** at **$99/mo** (§4.1). Sample-marketplace
   take-rate is the monetization, not the subscription.
3. **Pharma SaaS vertical split out** at **$4–$8k/mo** (§4.1). 21 CFR
   Part 11 + e-signature + validated environment. **No** procurement
   attach.
4. **Procurement model split into 3 tiers** (§4.2): sample/pilot
   marketplace (10–15% take, intact), production price-discovery (2–4%
   take, transparent), enterprise integration (no margin, SaaS-only).
5. **Time-savings claim corrected.** Screening 2–6 weeks → **2–3 days**
   (was "2–3 hours"). RFQ 4–6 weeks → **10–14 days** (was "2–3 days").
6. **BOM cost reduction tightened** to **4–8% on incumbent switches**;
   10–15% only on greenfield.
7. **ML metrics reset.** Field-data adoption target 40% → **20%**;
   accuracy ramp 70%→90% in 6mo → **70%→85% in 18mo** (synthetic-CFD
   bootstrap).
8. **CAC corrected.** Pro CAC $5k → **$8–12k**; Enterprise CAC
   **$30–50k** (previously implicit, now explicit).
9. **Year-1 GR recast** from $400k to **~$280k** (§8) — production-
   procurement revenue is deferred to Year 2 because Tier-1 CPG won't
   route prod POs through AeroSpec without Ariba/Coupa integration.
10. **Sequencing changes:** SOC 2 Type II + on-prem export *before*
    Tier-1 outreach; 21 CFR Part 11 *before* pharma launch; sample
    marketplace *before* production-procurement integrations.
11. **Consultant channel SKU** (Affiliate / White-label, 20–30% rev-share)
    introduced to convert independent consultants from objectors into
    distributors (per validation P10 / Hobbs).

**Open validation gaps to close (real customer-discovery, not synthetic):**
- 5 mid-market CPG calls to confirm 4–8% BOM-reduction and tier appetite
- Channel-conflict review with Spencer / Coster on the sample-marketplace
  take-rate
- 3 pharma CDMO calls to size the validated-environment SaaS opportunity
- Tier-1 CPG architecture review on VPC-isolated deployment economics
- CFD synthetic-data build plan to validate the 18-month accuracy ramp

---

## 12. [v1.2] Changelog — Three-Pillar Architecture

**Trigger:** Strategic critique that the v1.1 SaaS-plus-procurement framing
was a revenue mix, not a moat. TVH (parts distributor whose moat is the
fitment graph) and Rolls-Royce (outcome-as-a-service) reviewed as
reference moats; the **TVH pattern was selected** as the Year-1 wedge,
with Rolls-Royce-style outcome SLAs held as a Year-3+ option.

**Headline changes:**

1. **§0 Moat Thesis added.** Three-pillar architecture commits the
   product to **Configurator → Fitment Graph → Parts Marketplace**.
2. **Pricing flipped (§4.1).** Configurations are unmetered on every
   tier including a new **$0 Free Configurator**. Tiers ladder by
   *graph access depth* (community → validated → supplier-qualified →
   private) plus *procurement perks*, not by config count.
3. **Headline KPI changed (§10).** From "configurations / month" to
   **graph density** (validated fluid-actuator-outcome triples). Target
   5,000 by end of Year 1.
4. **Catalog depth target added.** 27 SKUs → 200 in 6mo → 2,000+ in
   18mo via supplier partnerships and crowd-curated long-tail.
5. **Contribution rate KPI added.** 35% of configurator sessions
   capturing feedback / outcomes by end of Year 1 (currently 0%;
   feedback loop is Sprint 2 priority).
6. **Predictive confidence reframed** as a downstream consequence of
   graph density, not a directly-pursued metric.
7. **Spenser SFP reframed** as a second fitment graph on shared
   infrastructure, not a co-equal twin product.
8. **Year-3+ optionality named.** Outcome-as-a-service SLA tier (per-
   million-actuations pricing for pharma / luxury / industrial) held
   as a future option, not in the Year-1 plan.

**Open questions deferred to v1.3:**
- Supplier-partnership economics for catalog expansion (sample-marketplace
  margin split with Spencer / Coster / Lindal / Aptar)
- Graph-access tiering for partners and consultants (white-label / API
  reseller SKU)
- Spenser's branding consolidation (sub-brand vs. integrated graph view)

---

## Appendix: Glossary

- **Ohnesorge Regime:** Classification of spray atomization behavior based on dimensionless fluid properties
- **MSDS:** Material Safety Data Sheet; regulatory hazard document
- **BOM:** Bill of Materials; itemized parts list for manufacturing
- **MOQ:** Minimum Order Quantity
- **ERP:** Enterprise Resource Planning system (e.g., SAP, Oracle)
- **API:** Application Programming Interface
- **ML:** Machine Learning
- **CAC:** Customer Acquisition Cost
- **LTV:** Customer Lifetime Value
- **NPS:** Net Promoter Score

---

**Document Version:** 1.1
**Last Updated:** 2026-05-10
**Next Review:** 2026-07-15
**v1.1 Sources:** `SYNTHETIC_USER_VALIDATION.md`
