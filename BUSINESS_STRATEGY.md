# AeroSpec Business Strategy & Product Roadmap

## Executive Summary

AeroSpec transforms the actuator selection and procurement process from a manual, time-intensive R&D workflow into a digitized, AI-powered platform. This document outlines the customer segments, critical use cases, pain points, and SaaS/ecommerce monetization strategy.

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
- **Reduce discovery phase** from 2–3 weeks → 2–3 hours
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
- **Reduce RFQ cycle** from 4–6 weeks → 2–3 days
- **Reduce BOM cost** by 10–15% through intelligent price/performance trade-offs
- **Consolidate suppliers** from 4–5 → 2–3 through volume aggregation
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

### 4.1 Tier-Based SaaS Pricing Model

#### **Starter Plan: $500/month**
- **Target:** Individual R&D teams, SMB packaging companies
- **Includes:**
  - Up to 50 configurations/month
  - Access to 25 actuator catalog
  - Basic fluid property input (manual entry only)
  - 1 user seat
  - Email support (24-hour response)
  - Monthly performance report
- **Procurement Discount:** 10% off actuator orders placed through platform

#### **Professional Plan: $2,000/month**
- **Target:** Mid-market packaging companies, larger R&D teams
- **Includes:**
  - Unlimited configurations
  - Full actuator catalog (25+ SKUs)
  - MSDS parsing (automated hazard extraction)
  - Regulatory compliance flags (EPA, CPSIA, CE)
  - Up to 5 user seats
  - Priority email + Slack support (4-hour response)
  - Weekly performance & insights reports
  - API access (basic; 10k calls/month)
- **Procurement Discount:** 15% off actuator orders; preferred pricing from Spencer

#### **Enterprise Plan: Custom Pricing (typically $5,000–$20,000/month)**
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

AeroSpec captures **margin on every actuator order** placed through the platform:

**Transaction Structure:**
1. **Spencer/Coster manufacturing cost:** $2–$5 per unit
2. **Platform list price:** $4–$15 per unit (varies by SKU, volume)
3. **Customer sees:** $4–$15 (wholesale cost; transparent)
4. **AeroSpec margin:** $0.50–$2.00 per unit (10–15% of transaction value)

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
- Average transaction margin: $1.00–$1.50
- Customer acquisition cost (CAC): $2,000 per Starter, $5,000 per Professional
- Payback period: 8–12 months

### Year 1 Projection
| Category | Q1 | Q2 | Q3 | Q4 | **Year 1 Total** |
|----------|----|----|----|----|-----------------|
| SaaS Subscriptions | $2k | $8k | $18k | $32k | **$60k** |
| Procurement Revenue | $20k | $45k | $95k | $180k | **$340k** |
| **Gross Revenue** | $22k | $53k | $113k | $212k | **$400k** |
| Operating Costs | $120k | $135k | $150k | $170k | **$575k** |
| **Net (EBITDA)** | -$98k | -$82k | -$37k | +$42k | **-$175k** |

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

### Product Metrics
- **Configuration generation:** Target 1,000+ per month by end of Year 1
- **Feedback loop adoption:** >40% of Professional+ customers submitting field data
- **Model accuracy:** Improve from 70% → 90% by end of Year 2
- **System uptime:** 99.5%+ (track in dashboard)

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

**Document Version:** 1.0
**Last Updated:** 2026-02-21
**Next Review:** 2026-04-30
