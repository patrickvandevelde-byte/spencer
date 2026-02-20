# AeroSpec: Predictive Actuator Configurator 🚀

> A self-improving, event-driven web application that allows formulation chemists and packaging engineers to input fluid properties and hardware constraints to instantly receive mechanically compatible, mathematically predicted actuator configurations.

---

## Table of Contents
1. [Project Scope & Objectives](#project-scope--objectives)
2. [Strategic Roadmap](#strategic-roadmap)
3. [Architecture & Microservices (ADR)](#architecture--microservices-adr)
4. [Data Pipeline & ML Setup](#data-pipeline--ml-setup)
5. [Product Requirements & Fallback (PRD)](#product-requirements--fallback-prd)
6. [UI/UX Architecture](#uiux-architecture)

---

## Project Scope & Objectives

The primary goal is to transform a historically physical trial-and-error R&D process into a digitized, sub-second computational workflow.

* **In-Scope:** * Automated MSDS parsing (OCR).
  * Integration with global thermophysical databases (NIST/DIPPR).
  * Graph DB traversal for mechanical compatibility.
  * ML Surrogate Model inference for spray physics (cone angle, droplet size).
  * 3D CAD/BOM export.
  * Continuous learning telemetry loop (MLOps).
* **Out-of-Scope (Phase 1):** * Direct integration with 3rd-party ERP/PLM systems.
  * Live in-browser 3D fluid rendering.
  * Predicting long-term chemical degradation of actuator plastics.

---

## Strategic Roadmap

* **Phase 0: Proof of Concept (Weeks 1-4)**
  * **Scope:** 5 standard actuator geometries, 10 purely Newtonian fluids.
  * **Deliverable:** Lightweight Python Streamlit app demonstrating manual PDF text extraction -> basic Graph DB traversal -> rudimentary Random Forest model predicting cone angle.
* **Phase 1: Ground Truth & Ontology (Months 1-2)**
  * Build Neo4j Graph DB schema. Secure DIPPR/NIST API access. Generate synthetic training data via automated Computational Fluid Dynamics (CFD).
* **Phase 2: ML Training & MLOps (Months 3-4)**
  * Train the initial PyTorch/TensorFlow surrogate model. Establish the automated retraining pipeline.
* **Phase 3: Microservices & UI (Months 5-6)**
  * Build the Kubernetes event-driven backend and "Clinical Brutalist" frontend UI.
* **Phase 4: Beta & Telemetry (Months 7-8)**
  * Roll out to controlled trusted fillers to seed the continuous feedback loop.

---

## Architecture & Microservices (ADR)



We utilize an event-driven microservices architecture deployed via Kubernetes to ensure the Graph DB and ML Engine scale independently.

* **Service A (Ingestion & Enrichment):** Python-based OCR (AWS Textract) + chemical database API hooks. Geometric parsing for STEP files.
* **Service B (Graph Query Engine):** Neo4j backend solving mechanical combinations via Cypher queries.
* **Service C (Inference Engine):** Containerized PyTorch/TensorFlow model exposed via REST/gRPC API.
* **Service D (Telemetry/MLOps):** Apache Kafka event stream logging predictions and ingesting real-world feedback to trigger automated retraining (Kubeflow/MLflow).

---

## Data Pipeline & ML Setup

Solving the "Cold Start" problem requires synthesizing ground truth data before user interaction.

### 1. Engineering Databases
AeroSpec queries "Gold Standard" databases to cross-reference messy MSDS uploads:
* **DIPPR 801:** Highly accurate, temperature-dependent correlations for liquid viscosity, surface tension, and vapor pressure.
* **NIST Chemistry WebBook:** Validation layer for density, specific volume, and baseline dynamic viscosity.

### 2. CFD Synthetic Pipeline

* Simulate 10,000+ combinations of standard actuator geometries against a Latin Hypercube Sampling (LHS) of DIPPR fluid properties.
* Results (droplet size, velocity, cone angle) serve as baseline labels ($y$) for the Surrogate Model.

### 3. Handling Non-Newtonian Fluids
Single-point viscosity is insufficient. We model non-Newtonian fluids using the Power-law (Ostwald-de Waele) model. The system captures the flow consistency index ($K$) and flow behavior index ($n$) to calculate apparent viscosity ($\mu_{app}$) under specific shear rates ($\dot{\gamma}$):

$$\mu_{app} = K \dot{\gamma}^{n-1}$$

### 4. Feature Engineering Matrix

| Feature Category | Source / Raw Input | Vectorized ML Feature Representation |
| :--- | :--- | :--- |
| **Mechanical** | Graph DB (STEP file) | Encoded geometric embeddings (volume, orifice area). |
| **Fluid Base** | NIST/DIPPR (via CAS #) | Specific gravity, baseline surface tension (0-1 scale). |
| **Rheology** | User MSDS + DIPPR | $K$ and $n$ variables. Categorical encoding (Newtonian, Thixotropic). |
| **Forces** | Target Force (Newtons) | Continuous variable for pressure drop across the valve. |

---

## Product Requirements & Fallback (PRD)



If the prediction pipeline fails, the system must degrade gracefully.

1. **Ingestion & Enrichment:** User uploads MSDS. Service A extracts text and pings engineering databases (CAS #) to fill rheological gaps.
2. **Validation:** UI presents extracted data. Out-of-bounds data requires mandatory manual correction.
3. **Inference & Confidence Scoring:**
   * **High Confidence (>85%):** Display top 3 configurations with simulated spray patterns.
   * **Marginal Confidence (60% - 84%):** Display configurations with a "Lab Test Recommended" warning badge.
   * **Low Confidence (<60%):** Reject prediction. Display closest historical mechanical match from Graph DB (no physics predictions) and prompt physical lab test.

---

## UI/UX Architecture

**Design Language:** *Clinical Brutalist* (slate grays, crisp whites, monospaced numerical fonts). Focus on precision, data density, and building scientific trust.

### Target Profiles
* **Formulation Chemist:** Focuses on fluid behavior. Needs flawless MSDS parsing and chemical validations.
* **Packaging Engineer:** Focuses on spatial constraints. Needs instant STEP ingestion and one-click CAD/BOM export.

### Core Interface Modules
1. **Multi-Modal Dropzone:** Drag-and-drop target for MSDS PDFs and 3D STEP files.
2. **Validation Ledger:** Split-screen (PDF vs. extracted ledger). Low-confidence extraction fields pulse amber for mandatory human review.
3. **Prediction Canvas:** Horizontal carousel of recommended configurations ranked by ML Confidence. Features 2D cross-sections, spray cone simulations, and an **"Export Spec Package (BOM & STEP)"** button.
