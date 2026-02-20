# AeroSpec: Predictive Actuator Configurator & Procurement Platform 🚀

> A self-improving, event-driven web application that allows formulation chemists and packaging engineers to input fluid properties and hardware constraints to instantly receive mechanically compatible, mathematically predicted actuator configurations—and seamlessly procure them for pilot testing or mass production.

---

## Table of Contents
1. [Project Scope & Objectives](#project-scope--objectives)
2. [Strategic Roadmap](#strategic-roadmap)
3. [Architecture & Microservices (ADR)](#architecture--microservices-adr)
4. [Data Pipeline & ML Setup](#data-pipeline--ml-setup)
5. [Product Requirements & User Flow (PRD)](#product-requirements--user-flow-prd)
6. [UI/UX Architecture](#uiux-architecture)

---

## Project Scope & Objectives

The primary goal is to transform a historically physical trial-and-error R&D process into a digitized, sub-second computational workflow that connects directly to the supply chain.

* **In-Scope:** * Automated MSDS parsing (OCR) and thermophysical database integration (NIST/DIPPR).
  * Graph DB traversal for mechanical compatibility.
  * ML Surrogate Model inference for spray physics (cone angle, droplet size).
  * 3D CAD/BOM export.
  * Continuous learning telemetry loop (MLOps).
  * **B2B E-commerce & Procurement Pipeline (Sample ordering, bulk PO generation, inventory sync).**
* **Out-of-Scope (Phase 1):** * Live in-browser 3D fluid rendering.
  * Predicting long-term chemical degradation of actuator plastics.

---

## Strategic Roadmap

* **Phase 0: Proof of Concept (Weeks 1-4)**
  * **Scope:** 5 standard actuator geometries, 10 purely Newtonian fluids.
  * **Deliverable:** Lightweight Python Streamlit app demonstrating manual PDF text extraction -> Graph DB traversal -> rudimentary ML prediction.
* **Phase 1: Ground Truth & Ontology (Months 1-2)**
  * Build Neo4j Graph DB schema. Secure DIPPR/NIST API access. Generate synthetic training data via automated Computational Fluid Dynamics (CFD).
* **Phase 2: ML Training & MLOps (Months 3-4)**
  * Train the initial PyTorch/TensorFlow surrogate model. Establish the automated retraining pipeline.
* **Phase 3: Microservices & Core UI (Months 5-6)**
  * Build the Kubernetes event-driven backend and core prediction frontend.
* **Phase 4: Commerce & ERP Integration (Months 7-8)**
  * Build the checkout flow. Integrate payment gateways (Stripe) and sync live inventory/pricing from manufacturing ERPs via API.
* **Phase 5: Beta & Telemetry (Months 9-10)**
  * Roll out to controlled trusted fillers to seed the continuous feedback loop.

---

## Architecture & Microservices (ADR)



We utilize an event-driven microservices architecture deployed via Kubernetes to ensure heavy data science workloads do not bottleneck the e-commerce transactions.

* **Service A (Ingestion & Enrichment):** Python-based OCR (AWS Textract) + chemical database API hooks. Geometric parsing for STEP files.
* **Service B (Graph Query Engine):** Neo4j backend solving mechanical combinations via Cypher queries.
* **Service C (Inference Engine):** Containerized PyTorch/TensorFlow model exposed via REST/gRPC API.
* **Service D (Telemetry/MLOps):** Apache Kafka event stream logging predictions and ingesting real-world feedback to trigger automated retraining.
* **Service E (Commerce Engine):** Node.js/Go service managing pricing tiers, inventory checks, Stripe B2B payments, and translating orders into ERP-compatible formats for the manufacturer.

---

## Data Pipeline & ML Setup

### 1. Engineering Databases
AeroSpec queries "Gold Standard" databases to cross-reference messy MSDS uploads:
* **DIPPR 801:** Highly accurate correlations for liquid viscosity, surface tension, and vapor pressure.
* **NIST Chemistry WebBook:** Validation layer for density and baseline dynamic viscosity.

### 2. CFD Synthetic Pipeline & Non-Newtonian Handling
* Simulate 10,000+ combinations via LHS. Results serve as baseline labels for the Surrogate Model.
* We model non-Newtonian fluids using the Power-law (Ostwald-de Waele) model to capture shear-dependent viscosity ($\mu_{app}$) inside the actuator.

---

## Product Requirements & User Flow (PRD)



1. **Ingestion & Enrichment:** User uploads MSDS. Service A extracts text and pings engineering databases to fill rheological gaps.
2. **Validation:** UI presents extracted data. Out-of-bounds data requires mandatory manual correction.
3. **Inference & Confidence Scoring:**
   * **High Confidence (>85%):** Display top 3 configurations with simulated spray patterns.
   * **Marginal Confidence (60% - 84%):** Display configurations with a "Lab Test Recommended" warning badge.
   * **Low Confidence (<60%):** Reject prediction. Prompt manual lab test.
4. **Procurement (The Commerce Loop):**
   * From a successful prediction, users can click **"Order Pilot Samples"** (e.g., 50-500 units) via credit card or **"Generate Bulk PO"** for mass production (routing through standard B2B invoice terms).

---

## UI/UX Architecture

**Design Language:** *Clinical Brutalist* (slate grays, crisp whites, monospaced numerical fonts). Focus on precision, data density, and building scientific trust.

### Target Profiles
* **Formulation Chemist:** Focuses on fluid behavior. 
* **Packaging Engineer:** Focuses on spatial constraints.
* **Procurement Manager (New):** Focuses on unit economics, lead times, and bulk ordering.

### Core Interface Modules
1. **Multi-Modal Dropzone:** Drag-and-drop target for MSDS PDFs and 3D STEP files.
2. **Validation Ledger:** Split-screen (PDF vs. extracted ledger). Low-confidence extraction fields pulse amber for mandatory human review.
3. **Prediction Canvas & Cart:** Horizontal carousel of recommended configurations ranked by ML Confidence. 
   * **Action Row:** Features the 2D cross-sections, spray cone simulations, and three buttons: **"Export Spec Package (BOM)"**, **"Order Pilot Samples"**, and **"Request Bulk Quote"**.
4. **B2B Checkout Ledger:** A streamlined, invoice-style checkout page confirming the SKUs, lead times pulled live from the ERP, and fields for internal Company PO Numbers.
