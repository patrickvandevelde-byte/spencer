# AeroSpec: Predictive Actuator Configurator & Procurement Platform 🚀

> **Live PoC Environment:** [spencer-poc.vercel.app](https://spencer-poc.vercel.app)

> A self-improving, event-driven web application that allows formulation chemists and packaging engineers to input fluid properties and hardware constraints to instantly receive mechanically compatible, mathematically predicted actuator configurations—and seamlessly procure them for pilot testing or mass production.

---

## Table of Contents
1. [Project Scope & Objectives](#project-scope--objectives)
2. [Customer Profiles & Business Model](#customer-profiles--business-model)
3. [Strategic Roadmap](#strategic-roadmap)
4. [Architecture & Microservices (ADR)](#architecture--microservices-adr)
5. [SaaS & E-commerce Features](#saas--e-commerce-features)
6. [Data Pipeline & ML Setup](#data-pipeline--ml-setup)
7. [Product Requirements & User Flow (PRD)](#product-requirements--user-flow-prd)
8. [UI/UX Architecture](#uiux-architecture)

---

## Project Scope & Objectives

The primary goal is to transform a historically physical trial-and-error R&D process into a digitized, sub-second computational workflow that connects directly to the supply chain.

* **In-Scope:** * Automated MSDS parsing (OCR) and thermophysical database integration (NIST/DIPPR).
  * Graph DB traversal for mechanical compatibility.
  * ML Surrogate Model inference for spray physics (cone angle, droplet size).
  * 3D CAD/BOM export.
  * Continuous learning telemetry loop (MLOps).
  * B2B E-commerce & Procurement Pipeline (Sample ordering, bulk PO generation).
* **Out-of-Scope (Phase 1):** * Live in-browser 3D fluid rendering.
  * Predicting long-term chemical degradation of actuator plastics.

---

## Customer Profiles & Business Model

**→ [Full Business Strategy Documentation](./BUSINESS_STRATEGY.md)**

### Primary Customer Segments

1. **Formulation Chemists** (R&D Teams)
   - 2–6 weeks per new product → 2–3 hours with AeroSpec
   - Current pain: Manual actuator testing; trial-and-error iterations
   - Value: Reduce time-to-market; eliminate wasted samples; ensure compliance

2. **Packaging Engineers** (Downstream Teams)
   - Need instant compatibility validation + cost optimization
   - Current pain: Depend on supplier datasheets; pressure to reduce BOM cost
   - Value: 10–15% BOM cost reduction; faster design cycles; regulatory assurance

3. **Procurement Leaders** (Supply Chain)
   - 4–6 weeks RFQ-to-contract → 2–3 days with AeroSpec
   - Current pain: Manual RFQs; lack visibility into pricing/inventory; supplier fragmentation
   - Value: Real-time pricing; supplier consolidation; SLA tracking

4. **Contract Manufacturers** (CMOs)
   - 5–20 configurations per month across multiple brands
   - Current pain: Thin margins; complexity managing multiple SKUs + requirements
   - Value: Pre-screen compatibility; minimize failed batches; faster time-to-production

### Business Model

| Revenue Stream | Year 1 Target | Year 2 Target | Notes |
|---|---|---|---|
| **SaaS Subscriptions** | $60k | $350k | Starter ($500/mo) → Enterprise ($5k–$20k/mo) |
| **Procurement Margin** | $340k | $1,300k | $0.50–$2.00 per actuator (10–15% of transaction) |
| **Data & Analytics Licensing** | — | $120k | Trend reports to actuator manufacturers |
| **Consulting & ML Training** | — | $150k | Custom surrogate models for enterprise customers |
| **Integration & API Licensing** | — | $150k | Revenue share from ERP/supplier integrations |
| **Total Gross Revenue** | **$400k** | **$1,920k** | 5x growth; 53% EBITDA margin |

---

## Strategic Roadmap

* **Phase 0: Proof of Concept (Weeks 1-4)**
  * **Scope:** 5 standard actuator geometries, 10 purely Newtonian fluids.
  * **Deliverable:** Lightweight Next.js/Python app deployed to **spencer-poc.vercel.app** demonstrating manual PDF text extraction -> Graph DB traversal -> rudimentary ML prediction.
* **Phase 1: Ground Truth & Ontology (Months 1-2)**
  * Build Neo4j Graph DB schema. Secure DIPPR/NIST API access. Generate synthetic training data via automated Computational Fluid Dynamics (CFD).
* **Phase 2: ML Training & MLOps (Months 3-4)**
  * Train the initial PyTorch/TensorFlow surrogate model. Establish the automated retraining pipeline.
* **Phase 3: Microservices & Core UI (Months 5-6)**
  * Build the Kubernetes event-driven backend. Scale the "Clinical Brutalist" Next.js frontend on Vercel for edge-cached, zero-latency user experiences.
* **Phase 4: Commerce & ERP Integration (Months 7-8)**
  * Build the checkout flow via Vercel Serverless Functions. Integrate payment gateways (Stripe) and sync live inventory/pricing from manufacturing ERPs.
* **Phase 5: Beta & Telemetry (Months 9-10)**
  * Roll out to controlled trusted fillers to seed the continuous feedback loop.

---

## Architecture & Microservices (ADR)

> **Full technical architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)

**Frontend (Vercel Edge):**
- Next.js 16.1.6 (App Router) with SSR/SSG for sub-100ms response times
- Tailwind CSS 4 "Clinical Brutalist" design system
- React Three Fiber for 3D actuator visualization
- 8 pages: Home, Configure, Results, Compare, Procurement, Cart, Orders, Analytics

**Physics Engine (Deterministic):**
- Lefebvre, Dombrowski & Johns, Nukiyama & Tanasawa, Lang atomization models
- Non-Newtonian apparent viscosity at orifice shear rate
- Ohnesorge/Weber regime classification
- Full droplet distribution (Dv10/Dv50/Dv90)
- Multi-factor compatibility scoring (0–100)

**Data Layer:**
- PostgreSQL via Drizzle ORM: Users, tenants, configurations, procurements, feedback
- localStorage: Saved configs, shopping cart, orders, analytics events
- 27 actuators × 25 fluids × 12 spray types in-memory

**Commerce:**
- Shopping cart with persistent state
- Order tracking with status progression
- Simulated stock levels per actuator
- Volume pricing with discount tiers (15% at 500+, 25% at 1,000+)
- Stripe SDK installed for future payment integration

---

## SaaS & E-commerce Features

### Phase 1: MVP Essentials (Weeks 1–4) ✅ Complete
- ✅ Actuator catalog with visual illustrations (27 actuators, 12 types)
- ✅ Fluid reference library with hazard data (25 fluids, 9 solvent classes)
- ✅ Real-time compatibility matrix generation
- ✅ Ohnesorge regime classification & safety warnings
- ✅ Non-Newtonian fluid support (power-law, Bingham, Herschel-Bulkley)
- ✅ Droplet distribution (Dv10/Dv50/Dv90 + span)
- ✅ Material stress analysis (swelling, cracking, leaching)
- ✅ 3D parametric actuator viewer (React Three Fiber)
- ✅ Regulatory compliance checks (CR, FDA, cleanroom, flammability)
- ✅ Tooling recommendations (FDM, SLA, SLS, soft tool, hardened steel)
- ⏳ User authentication & account management (DB schema ready)
- ⏳ Basic feedback mechanism (DB schema ready)

### Phase 2: SaaS Foundation (Months 2–3) ✅ Complete
- ✅ Saved configurations (localStorage save/load with project management)
- ✅ Regulatory compliance flags (CR, FDA, cleanroom, flammability, chemical hazards, material compatibility)
- ✅ PDF report export (full technical report with print-to-PDF)
- ✅ CSV data export
- ✅ Analytics dashboard (usage metrics, top actuators/fluids, activity timeline)
- ✅ Advanced search & filters (solvent class, manufacturer, industry tags)
- ✅ Valve stem interface profiles (male/female, diameters, engagement depth)
- ✅ Ergonomic data display (actuation force, stroke length, prime strokes, ADA compliance)
- ⏳ Multi-seat team collaboration
- ⏳ MSDS file upload & automated hazard extraction
- ⏳ Email/Slack notifications
- ⏳ Stripe payment integration (dependency installed, not wired)

### Phase 3: Procurement & Commerce (Months 4–5) ✅ Complete
- ✅ Simulated stock status & lead times per actuator
- ✅ Shopping cart with persistent state (localStorage)
- ✅ Checkout flow with order placement
- ✅ Bulk PO generation for pilot/production quantities
- ✅ Order tracking page with status progression
- ✅ Procurement discount tiers (15% at 500+, 25% at 1,000+)
- ✅ Volume pricing table per actuator
- ⏳ Spencer/Coster live pricing & inventory APIs
- ⏳ Invoicing & net-30 terms for Enterprise

### Phase 4: ML & Continuous Learning (Months 6–7)
- ⏳ Post-purchase feedback survey (spray performance, compatibility)
- ⏳ Anomaly detection (prediction vs. reality divergence)
- ⏳ Automated weekly model retraining
- ⏳ A/B testing framework for new models
- ⏳ Model accuracy dashboard (transparency)
- ⏳ Recommendations engine (suggest optimal configurations)
- ⏳ Heatmaps of successful/failed configuration patterns

### Phase 5: Enterprise Features (Months 8–9)
- ⏳ REST API with rate limiting & quotas
- ⏳ ERP webhooks (SAP, Oracle NetSuite, Microsoft Dynamics)
- ⏳ Single sign-on (SAML 2.0, OAuth 2.0)
- ⏳ Role-based access control (Admin, User, Viewer)
- ⏳ Comprehensive audit logging & compliance reports
- ⏳ Custom integrations via Zapier / Make.com
- ⏳ White-label SaaS option (for partner resale)
- ⏳ 99.9% SLA monitoring & incident reporting

### Phase 6: Advanced Intelligence (Months 10–12)
- ⏳ Custom reporting builder (drag-drop dashboard)
- ⏳ Predictive insights (demand forecasting for inventory)
- ⏳ Cost optimization recommendations
- ⏳ Supplier consolidation analysis
- ⏳ Regulatory change alerts (auto-scan FDA, EPA updates)
- ⏳ Custom ML model training (customer's proprietary fluids)
- ⏳ Raw data export for BI tools (Tableau, Power BI)

---
