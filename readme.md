# AeroSpec: Predictive Actuator Configurator & Procurement Platform 🚀

> **Live PoC Environment:** [spencer-poc.vercel.app](https://spencer-poc.vercel.app)

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
  * B2B E-commerce & Procurement Pipeline (Sample ordering, bulk PO generation).
* **Out-of-Scope (Phase 1):** * Live in-browser 3D fluid rendering.
  * Predicting long-term chemical degradation of actuator plastics.

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

[Image of decoupled Next.js frontend deployed on Vercel communicating with Kubernetes backend microservices]

We
