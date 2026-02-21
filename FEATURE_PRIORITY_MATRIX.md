# AeroSpec Feature Priority Matrix

## Overview

This document maps specific product features to customer pain points and priorities them by impact, effort, and customer demand.

---

## Pain Point → Feature Mapping

### Customer Segment: Formulation Chemists

#### Pain Point 1: Manual Actuator Selection (2–3 weeks per cycle)
**Impact:** 🔴 CRITICAL | **Effort:** 🟢 LOW | **Customer Value:** 🔴 CRITICAL

| Feature | MVP | Phase 2 | Phase 3+ | Impact | Status |
|---|---|---|---|---|---|
| Automated compatibility matrix generation | ✅ | | | Instant results vs. weeks | ✅ Done |
| MSDS file upload & hazard extraction | | ✅ | | Reduce manual data entry | ⏳ Planned |
| Regex + NLP for hazard classification | | ✅ | | Auto-flag incompatibilities | ⏳ Planned |
| Predictive spray physics (Ohnesorge) | ✅ | | | Show predicted performance | ✅ Done |
| Material compatibility database | ✅ | | | Cross-check fluid-actuator pairs | ✅ Done |
| Visual spray pattern illustrations | ✅ | | | Easy comparison | ✅ Done |
| Side-by-side configuration comparison | ✅ | | | Quickly narrow down options | ✅ Done |

**Effort Breakdown:**
- MVP: ~40 hours (Neo4j traversal, UI)
- Phase 2: ~60 hours (MSDS parsing, NLP)
- Phase 3+: ~80 hours (Advanced ML predictions)

**Expected Outcome:** Reduce formulation-to-sample time from **6–8 weeks → 2–3 hours**

---

#### Pain Point 2: No Closed-Loop Learning (predictions not improved by field data)
**Impact:** 🟠 HIGH | **Effort:** 🟠 MEDIUM | **Customer Value:** 🟠 HIGH

| Feature | MVP | Phase 2 | Phase 3+ | Impact | Status |
|---|---|---|---|---|---|
| Post-use feedback capture (survey) | | | ✅ | Users report actual performance | ⏳ Planned |
| Star rating for satisfaction | | | ✅ | Quick sentiment metric | ⏳ Planned |
| Actual spray performance input | | | ✅ | Real vs. predicted data | ⏳ Planned |
| Anomaly detection (flagging outliers) | | | ✅ | Identify prediction failures early | ⏳ Planned |
| ML model retraining (automated) | | | ✅ | Improve accuracy over time | ⏳ Planned |
| Model accuracy dashboard | | | ✅ | Show users we're improving | ⏳ Planned |
| Insights engine (pattern recognition) | | | ✅ | Surface emergent rules | ⏳ Planned |

**Effort Breakdown:**
- Phase 3: ~120 hours (feedback UI, anomaly detection)
- Phase 4: ~100 hours (ML pipeline, retraining)
- Phase 5+: ~150 hours (insights dashboard, A/B testing)

**Expected Outcome:** Prediction accuracy **70% → 90%+** within 6 months; defensible moat vs. competitors

---

### Customer Segment: Packaging Engineers

#### Pain Point 1: RFQ Process Takes 4–6 Weeks (manual supplier outreach)
**Impact:** 🔴 CRITICAL | **Effort:** 🟠 MEDIUM | **Customer Value:** 🔴 CRITICAL

| Feature | MVP | Phase 2 | Phase 3+ | Impact | Status |
|---|---|---|---|---|---|
| Real-time supplier pricing feed | | ✅ | | Know current costs instantly | ⏳ Planned |
| Real-time inventory sync | | ✅ | | See what's in stock | ⏳ Planned |
| Automated RFQ generation (1-click) | | ✅ | | Replace email chains | ⏳ Planned |
| Multi-supplier quote comparison | | ✅ | | Compare Spencer, Coster in one place | ⏳ Planned |
| Cost optimizer algorithm | | | ✅ | Recommend lowest-cost config | ⏳ Planned |
| Preferred pricing for loyalty | | ✅ | | Volume discounts auto-applied | ⏳ Planned |
| Lead time transparency | | ✅ | | Know delivery timeline upfront | ⏳ Planned |

**Effort Breakdown:**
- Phase 2: ~80 hours (supplier API integration)
- Phase 3: ~60 hours (cost optimizer, algorithms)
- Phase 4+: ~40 hours (loyalty tiers, discounts)

**Expected Outcome:** Reduce RFQ cycle from **4–6 weeks → 2–3 days**; Reduce BOM cost by **10–15%**

---

#### Pain Point 2: Regulatory Compliance Takes 2–3 Weeks (manual review)
**Impact:** 🟠 HIGH | **Effort:** 🟡 MEDIUM-HIGH | **Customer Value:** 🔴 CRITICAL

| Feature | MVP | Phase 2 | Phase 3+ | Impact | Status |
|---|---|---|---|---|---|
| Hazard classification extraction | | ✅ | | Auto-parse MSDS hazards | ⏳ Planned |
| Material compatibility matrix | ✅ | | | Cross-check fluid-elastomer pairs | ✅ Done |
| Regulatory flag system (EPA, CPSIA, CE) | | ✅ | | Highlight compliance gaps | ⏳ Planned |
| Auto-generated compliance report | | ✅ | | Export for submission | ⏳ Planned |
| Audit trail & decision log | | ✅ | | Demonstrate due diligence | ⏳ Planned |
| Regulatory change alerts | | | ✅ | Notify of new constraints | ⏳ Planned |
| Pre-approved configuration templates | | | ✅ | Fast-track common use cases | ⏳ Planned |

**Effort Breakdown:**
- Phase 2: ~90 hours (regulatory database, flag system)
- Phase 3+: ~100 hours (alert system, templates)

**Expected Outcome:** Reduce compliance review from **2–3 weeks → 2–3 days**; Near-zero audit risk

---

### Customer Segment: Procurement Leaders

#### Pain Point 1: Supplier Fragmentation (5+ suppliers, no visibility)
**Impact:** 🔴 CRITICAL | **Effort:** 🟠 MEDIUM | **Customer Value:** 🟠 HIGH

| Feature | MVP | Phase 2 | Phase 3+ | Impact | Status |
|---|---|---|---|---|---|
| Unified supplier catalog UI | | ✅ | | All suppliers in one place | ⏳ Planned |
| Real-time pricing sync | | ✅ | | Always current costs | ⏳ Planned |
| SLA tracking & performance metrics | | | ✅ | See which suppliers deliver on time | ⏳ Planned |
| Supplier consolidation analysis | | | ✅ | Recommend supplier reduction | ⏳ Planned |
| Volume aggregation for better terms | | ✅ | | Pool orders across business units | ⏳ Planned |
| Contract management module | | | ✅ | Track terms, renewals, pricing tiers | ⏳ Planned |
| Preferred supplier portal | | ✅ | | Configure default suppliers | ⏳ Planned |

**Effort Breakdown:**
- Phase 2: ~70 hours (supplier UI, sync)
- Phase 3+: ~110 hours (SLA tracking, consolidation analysis)

**Expected Outcome:** Consolidate from **5 suppliers → 2–3**; Improve payment terms by **5–10 days**

---

#### Pain Point 2: Manual Data Entry & Spreadsheet Madness
**Impact:** 🟠 HIGH | **Effort:** 🟢 LOW-MEDIUM | **Customer Value:** 🟠 HIGH

| Feature | MVP | Phase 2 | Phase 3+ | Impact | Status |
|---|---|---|---|---|---|
| Auto-sync with ERP (SAP, Oracle, NetSuite) | | | ✅ | Eliminate manual PO entry | ⏳ Planned |
| Webhook for real-time order sync | | ✅ | | Push data directly to ERP | ⏳ Planned |
| CSV import/export | | ✅ | | Bulk operations | ⏳ Planned |
| Configurator → ERP BOM auto-generation | | ✅ | | Pre-fill BOM from prediction | ⏳ Planned |
| Inventory visibility across locations | | | ✅ | Know stock at all warehouses | ⏳ Planned |
| Demand forecasting (based on historical) | | | ✅ | Predict next month's needs | ⏳ Planned |

**Effort Breakdown:**
- Phase 2: ~60 hours (webhooks, CSV, BOM)
- Phase 3+: ~100 hours (demand forecasting, inventory)

**Expected Outcome:** Reduce manual data entry by **80%**; Eliminate ERP re-entry errors

---

### Customer Segment: Contract Manufacturers (CMOs)

#### Pain Point 1: Managing Multiple Brands + Formulations
**Impact:** 🔴 CRITICAL | **Effort:** 🟡 MEDIUM-HIGH | **Customer Value:** 🔴 CRITICAL

| Feature | MVP | Phase 2 | Phase 3+ | Impact | Status |
|---|---|---|---|---|---|
| Multi-tenant workspace isolation | | ✅ | | Keep customer data separate | ⏳ Planned |
| Template library for common fluids | | ✅ | | Reuse across brands | ⏳ Planned |
| Batch management & traceability | | | ✅ | Link production batches to configs | ⏳ Planned |
| White-label branded reports | | | ✅ | Export reports with customer logo | ⏳ Planned |
| Workstation sync (multiple users) | | ✅ | | Team collaboration | ⏳ Planned |
| Configuration audit trail | | ✅ | | Prove who approved what | ⏳ Planned |
| Automated workflow state machine | | | ✅ | Formulation → Testing → Approval → Production | ⏳ Planned |

**Effort Breakdown:**
- Phase 2: ~80 hours (templates, collaboration, audit)
- Phase 3+: ~120 hours (batch tracking, workflow, white-label)

**Expected Outcome:** Reduce design-to-production cycle by **40%**; Improve batch yield by **5–10%**

---

## Feature Triage: Impact vs. Effort Matrix

```
IMPACT (High)
    ^
    |   QUICK WINS              STRATEGIC
    |   ├─ MSDS parsing         ├─ ML feedback loop
    |   ├─ Regulatory flags     ├─ Cost optimizer
    |   ├─ Real-time pricing    ├─ Custom ML models
    |   └─ RFQ generation       └─ Supplier consolidation
    |
    |   LOW VALUE               TIME SINK
    |   ├─ 3D rendering         ├─ Plastic degradation
    |   ├─ Advanced charting    └─ Legacy system migration
    |
    └────────────────────────────────> EFFORT (High)
```

### Recommended Prioritization (MVP → Enterprise)

#### **MVP (Weeks 1–4)** [DONE]
- ✅ Actuator catalog with illustrations
- ✅ Fluid reference library
- ✅ Compatibility matrix
- ✅ Spray physics predictions (Ohnesorge)
- ✅ Visual comparison tools

#### **Phase 2 (Months 2–3)** [HIGH PRIORITY]
- ⏳ MSDS file upload & OCR/NLP extraction
- ⏳ Regulatory compliance flags
- ⏳ Real-time supplier pricing sync
- ⏳ Automated RFQ generation
- ⏳ Configuration versioning & sharing
- ⏳ User accounts & authentication
- ⏳ Stripe billing integration

#### **Phase 3 (Months 4–5)** [HIGH PRIORITY]
- ⏳ Direct e-commerce procurement (checkout)
- ⏳ Multi-supplier quote comparison
- ⏳ Order tracking & shipment status
- ⏳ Invoice generation & payment terms
- ⏳ Procurement discount tiers

#### **Phase 4 (Months 6–7)** [STRATEGIC]
- ⏳ Feedback collection mechanism
- ⏳ Anomaly detection (model accuracy)
- ⏳ Automated ML model retraining
- ⏳ Model accuracy dashboard
- ⏳ Insights & recommendations engine

#### **Phase 5 (Months 8–9)** [ENTERPRISE]
- ⏳ REST API with rate limiting
- ⏳ ERP integrations (SAP, Oracle, NetSuite)
- ⏳ SAML SSO & OAuth 2.0
- ⏳ Advanced RBAC & audit logging
- ⏳ 99.9% SLA & uptime monitoring

#### **Phase 6 (Months 10–12)** [EXPANSION]
- ⏳ Custom reporting builder
- ⏳ Demand forecasting
- ⏳ Supplier consolidation analysis
- ⏳ Custom ML model training
- ⏳ White-label options

---

## Resource Allocation Estimate

### Phase 2 (Months 2–3): MVP → SaaS Foundation

**Team:** 3 FTE (1 backend, 1 frontend, 1 product/QA)

| Feature | Dev Hours | QA Hours | Product Hours | Total |
|---|---|---|---|---|
| User authentication | 40 | 15 | 10 | 65 |
| MSDS parsing (OCR + NLP) | 80 | 20 | 15 | 115 |
| Regulatory flags | 50 | 15 | 10 | 75 |
| Real-time pricing sync | 60 | 15 | 10 | 85 |
| RFQ generation | 45 | 12 | 8 | 65 |
| Configuration persistence | 35 | 10 | 8 | 53 |
| Stripe billing | 50 | 15 | 10 | 75 |
| **Phase 2 Total** | **360** | **102** | **71** | **533 hours** |

**Estimated Timeline:** 3 months (6-week effort at 100% capacity, buffer for reviews)

---

## Success Metrics by Feature

### MSDS Parsing
- ✅ **Success:** Extracts hazards with 95%+ accuracy (validated against manual)
- ✅ **Adoption:** 80%+ of Starter+ customers use MSDS upload
- ✅ **Time Saved:** Users report 2–3 hours saved per configuration

### Regulatory Compliance
- ✅ **Compliance Rate:** 100% of configurations have regulatory assessment
- ✅ **Accuracy:** <1% false positives (over-flagging)
- ✅ **Audit Readiness:** Exportable report passes internal compliance review

### Real-time Pricing
- ✅ **Data Freshness:** <4-hour pricing stale age
- ✅ **Supplier Coverage:** 99%+ of catalog updated daily
- ✅ **Cost Savings:** Professional customers report 10–15% BOM cost reduction

### RFQ Generation
- ✅ **Adoption:** 60%+ of procurement orders generated via platform
- ✅ **Time Reduction:** RFQ-to-order cycle <3 days (vs. 4–6 weeks)
- ✅ **Accuracy:** >99% of auto-generated RFQs need zero edits

### Feedback Loop & ML
- ✅ **Feedback Submission Rate:** >40% of users provide feedback
- ✅ **Model Accuracy:** Improve from 70% → 90% within 6 months
- ✅ **Prediction Confidence:** Users report "confident" or "very confident" >80%

---

## Risk Mitigation

### Risk 1: MSDS Parsing Accuracy Issues
- **Mitigation:** Start with regex-based extraction; validate against 100 real MSDS
- **Fallback:** Offer manual review option; expert UX for exception handling

### Risk 2: Supplier API Delays
- **Mitigation:** Begin negotiations with Spencer/Coster immediately
- **Fallback:** Mock supplier data for MVP; real integration in Phase 3

### Risk 3: ML Model Overfitting to Newtonian Fluids
- **Mitigation:** Use synthetic training data + expert-validated cases
- **Fallback:** Position as "Newtonian fluids only" in Phase 0; expand later

---

**Document Version:** 1.0
**Last Updated:** 2026-02-21
**Next Review:** 2026-04-30
