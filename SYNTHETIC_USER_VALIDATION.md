# Synthetic User Validation — AeroSpec / Spencer Configurator

**Purpose:** Stress-test the assumptions in `BUSINESS_STRATEGY.md` against
realistic, segment-representative customer profiles before further build-out.
Each persona is constructed from public industry context (org size, tooling,
buying authority, regulatory posture). Interviews are simulated — they
surface plausible objections, not verified quotes — and any number presented
here is a working hypothesis, not field-validated truth.

**Date:** 2026-05-10
**Author:** Claude (synthetic-research)
**Status:** v1.0 — feeds the v1.1 revisions in `BUSINESS_STRATEGY.md`

---

## 1. Method

1. Built **10 synthetic personas** spanning the four declared segments plus
   adjacent / skeptical roles (regulated pharma, indie DTC, independent
   consultant).
2. Ran a **structured 12-question interview** against each persona, probing
   the specific quantitative claims in §1, §2, §4, §8, §10 of
   `BUSINESS_STRATEGY.md`.
3. Tagged every assumption as **VALIDATED / PARTIALLY-VALIDATED /
   INVALIDATED / NEEDS-DATA** based on convergence across personas.
4. Translated findings into concrete edits to the business concept (see §6
   and the v1.1 changelog appended to `BUSINESS_STRATEGY.md`).

The interview script is reproduced in §3. Verbatim transcripts are
abbreviated to the highest-signal exchanges per persona.

---

## 2. Synthetic Personas

| # | Persona | Segment | Org | Region | Buying Authority |
|---|---|---|---|---|---|
| P1 | Dr. Priya Raman, Senior Formulation Chemist | A — R&D | Tier-1 CPG (Unilever-class), 150k FTE | UK | Influencer; CTO/VP signs |
| P2 | Marcus Beaulieu, Formulation Lead | A — R&D | Mid-market premium haircare, 220 FTE | US | Recommender; CFO signs |
| P3 | Dr. Yuki Tanaka, Principal Scientist | A — R&D (regulated) | Inhalation pharma CDMO, 800 FTE | JP/US | Influencer; QA + Reg gate |
| P4 | Sandra Ochoa, Packaging Eng. Manager | B — Packaging | Mid-market beauty (Coty-class), 4k FTE | US | Approver up to $250k/yr |
| P5 | James Okafor, Packaging Engineer | B — Packaging | Indie "clean" DTC haircare, 40 FTE | US | Owner; founder co-signs |
| P6 | Helmut Krause, Strategic Sourcing Director | C — Procurement | Tier-1 CPG (Henkel-class), 50k FTE | DE | High; >$1M contracts |
| P7 | Rachel Stern, Procurement Manager | C — Procurement | Mid-market household goods, 6k FTE | US | Medium; $50–500k POs |
| P8 | Luca Ferrari, Operations Director | D — CMO | Aerosol contract filler, 500 FTE | IT | High on ops capex |
| P9 | Brenda Park, Procurement & Ops | D — CMO | Regional aerosol filler, 250 FTE | US | High; full P&L |
| P10 | Dr. Alan Hobbs, Independent Consultant | Skeptic | Self-employed (ex-Coster R&D, 30 yrs) | US | n/a (competitor) |

---

## 3. Interview Script

1. Walk me through your current actuator-selection workflow end-to-end.
2. Where in that workflow do days/weeks actually disappear — prediction,
   sample procurement, physical testing, regulatory sign-off, or internal
   approvals?
3. We claim a screening cycle of 2–6 weeks compresses to 2–3 hours. Plausible?
4. What % of actuator decisions could you make on **prediction alone**, with
   no physical bench validation? Why?
5. How are actuators procured today — direct contracts, distributors, ERP
   punch-out, ad-hoc samples? What are typical unit prices and volumes?
6. If a SaaS marketplace inserted a $0.50–$2.00 margin on each $2–$5
   actuator, would that survive procurement review?
7. Would you consolidate Spencer / Coster / Aptar / Lindal through one
   middleman? What would block that?
8. Would you submit your real spray performance / formulation data to a
   shared ML training set? Under what conditions?
9. What does compliance automation (MSDS parse, EPA/CPSIA/CE flags) save
   you in $ or weeks?
10. What does your team pay for comparable software today, and who owns the
    budget line?
11. Stripped to essentials — what is the single feature you'd pay for, and
    what is the single feature you'd never use?
12. What kills this deal in your org? (Procurement, Legal, IT-sec, IP,
    timing, internal politics.)

---

## 4. Interview Highlights (abbreviated)

### P1 — Priya Raman (Tier-1 CPG R&D)

> **Q3 (2-week→2-hour claim):** "False framing. The 2 weeks is rarely
> *prediction* — it's queueing for the spray lab and waiting on physical
> samples. Your tool removes maybe 3–4 days of literature review and
> shortlisting. The bench week and the QA review week stay."
>
> **Q5 (procurement reality):** "We buy actuators on framework contracts at
> roughly $0.04–$0.09 per unit at 50–500M annual volumes. Your '$4–$15
> wholesale' number is a sample-pricing number. On production volume, your
> $1 margin is **15–25× our unit cost.** Procurement laughs that out of the
> room."
>
> **Q8 (data sharing):** "We will not export formulation parameters to a
> SaaS vendor. Period. On-prem or differential privacy or no deal — and even
> then Legal takes 9 months."
>
> **Q11 (must-have feature):** "Compatibility pre-screen against our
> qualified-supplier whitelist. If your output is filtered to suppliers we
> already buy from, that's useful. Otherwise it's noise."
>
> **Q12 (deal killer):** "InfoSec + Legal review on AI-trained-on-our-data."

### P2 — Marcus Beaulieu (Mid-market haircare R&D)

> **Q3:** "Hours is generous but the *direction* is right. We spend ~10
> days screening because we don't have the relationships Unilever has. Cut
> that to 2–3 days and we'd buy."
>
> **Q4:** "Maybe 60% of decisions could go on prediction *for screening*.
> Final lock-in still needs the spray lab — non-Newtonian serums fool
> simple atomization models."
>
> **Q5:** "We order 50k–500k units per launch through distributors. Direct
> sample buys, $3–$8 each, 50 at a time. *That's where your margin works
> — on samples, not production.*"
>
> **Q11:** "Compatibility matrix + sample procurement in one click. I'd pay
> $500–$1,500/mo for that."

### P3 — Yuki Tanaka (Inhalation pharma CDMO)

> **Q3:** "Irrelevant in our world. USP <601> testing and IQ/OQ/PQ govern
> the timeline. Prediction can rank early candidates, but it cannot
> shortcut FDA. Total cycle is 12–24 months and you save weeks, not months."
>
> **Q5:** "Procurement runs through Approved Vendor List + change-control.
> We will **not** buy a single actuator through a third-party platform —
> regulatory exposure."
>
> **Q9:** "21 CFR Part 11 compliance, e-signature, and full audit trail
> are the price of admission. Without it, we cannot deploy."
>
> **Q11:** "Pure SaaS for early-phase candidate ranking. I'd pay $4–8k/mo.
> Procurement features: don't care, won't use."

### P4 — Sandra Ochoa (Mid-market beauty packaging)

> **Q3:** "2–3 days is realistic. 2–3 hours is marketing copy."
>
> **Q5/Q7:** "10–15% BOM reduction *only if* the recommendation switches us
> off our incumbent — and the qualification cost (3–6 months, ~$80k) often
> kills the savings. Real savings are 4–7% in practice."
>
> **Q7:** "I won't consolidate to a single middleman. I'll consolidate
> *quote intake*, not contracts."
>
> **Q11:** "Ergonomics + ADA actuation force data, side-by-side. I have
> nowhere else to get that."

### P5 — James Okafor (Indie DTC haircare)

> **Q5:** "We order 5–20k units. Today: Alibaba, scary samples, lots of
> failures. We'd kill for a curated catalog with *guaranteed* sample
> shipping."
>
> **Q10:** "$500/mo is too much. $99–$199 with metered config credits is
> the indie price point. There are 2,000+ shops like us."
>
> **Q11:** "Sample-to-pilot path. I don't need ERP."

### P6 — Helmut Krause (Tier-1 CPG sourcing)

> **Q3 (RFQ cycle):** "4–6 weeks → 2–3 days is unrealistic. Internal
> approvals alone are 2 weeks. Realistic compression is 4–6 weeks → 10–14
> days."
>
> **Q5/Q6:** "Spencer/Coster/Aptar give us framework pricing 30–60% below
> what your platform shows. We will not pay your margin on top. You can be
> a *price-discovery* tool feeding our SAP Ariba — never a transactional
> middleman on production volume."
>
> **Q11:** "Real-time supplier capacity + risk signals (geopolitical, raw
> material). Spray-physics prediction is interesting; supplier intelligence
> is the budget line."

### P7 — Rachel Stern (Mid-market procurement)

> **Q5/Q6:** "Margin model could work for samples and pilot quantities.
> Production POs need transparent pass-through pricing — call it a 2–4%
> marketplace fee, not $1 hidden margin."
>
> **Q9:** "Net-30 + invoicing + tax-exempt handling are non-negotiable.
> Stripe Checkout alone won't fly."

### P8 — Luca Ferrari (EU CMO ops director)

> **Q3:** "5–20 configs/month is right. We onboard 6–10 brand accounts a
> year, each with multiple SKUs."
>
> **Q5:** "We have direct contracts with Coster and Lindal. Better than
> anything you'd offer. *But* — pre-screening before client meetings would
> save us 40+ engineering hours/month and let us quote 2 weeks faster.
> That's the wedge."
>
> **Q10:** "$2–4k/mo for Professional. Enterprise pricing as quoted is
> aspirational for our margins."

### P9 — Brenda Park (US regional CMO)

> **Q3 + Q5:** "Most painful step is qualifying samples for *new* brand
> accounts — 4–6 suppliers, 6+ weeks. Cut that to 2 weeks via your
> platform and I'll sign tomorrow."
>
> **Q11:** "Sample-aggregation + compatibility pre-flight. Pay $1.5–3k/mo."

### P10 — Alan Hobbs (Skeptic, ex-supplier R&D)

> **Q (model):** "70%→90% accuracy in 6 months is fantasy. You need
> 10–20k validated runs across non-Newtonian fluids. Plan for 18–24
> months to 80–85%."
>
> **Q (procurement):** "Spencer and Coster will not let you margin-stack
> on their flagship accounts. Expect channel conflict letters within 12
> months unless you co-sell. The smart play is pure SaaS + sample
> marketplace, with revenue-share to suppliers — not a hidden middleman."
>
> **Q (CAC):** "$2k Starter CAC plausible. $5k Pro CAC is half the
> reality. Enterprise CAC is $25–50k including booth, SDR, AE, legal."

---

## 5. Assumption Verdicts

| # | Assumption (current) | Source | Verdict | Revised |
|---|---|---|---|---|
| 1 | Screening: 2–6 weeks → **2–3 hours** | §2.1 | INVALIDATED | 2–6 weeks → **2–3 days** for screening; physical bench retained |
| 2 | RFQ-to-contract: 4–6 weeks → **2–3 days** | §2.2 | INVALIDATED | 4–6 weeks → **10–14 days** (internal approval bottleneck) |
| 3 | BOM cost reduction **10–15%** | §1, §2.2 | PARTIALLY | **4–8% realized** after qualification cost; 10–15% only on greenfield BOMs |
| 4 | Procurement margin **$0.50–$2.00 / unit** at $4–15 list | §4.2 | PARTIALLY | Holds for **samples + pilot** quantities; production needs **2–4% take-rate marketplace** |
| 5 | Tier-1 CPG procures via AeroSpec | §1.A, §1.C | INVALIDATED | Tier-1 CPG = price-discovery + Ariba/Coupa integration only, never middleman |
| 6 | Supplier consolidation to AeroSpec | §2.2 | INVALIDATED | Consolidate **quote intake**, not contracts |
| 7 | ML feedback adoption **>40%** Pro+ | §10 | INVALIDATED | **15–25%** realistic without on-prem / differential-privacy option |
| 8 | Prediction accuracy **70% → 90% in 6mo** | §10 | INVALIDATED | **70% → 85% in 18 months**; >85% requires CFD-augmented training set |
| 9 | Pricing: Starter $500 / Pro $2k / Ent $5–20k | §4.1 | PARTIALLY | Add **Indie $99/mo**; Pro holds; Enterprise floor is **$8k**, ceiling honest at **$25k** |
| 10 | CAC $2k Starter / $5k Pro | §8 | PARTIALLY | Starter $1.5k OK; **Pro $8–12k**; **Enterprise $30–50k** |
| 11 | Use freq: chemists 5–15 / CMOs 5–20 / mo | §1 | VALIDATED | Holds |
| 12 | Compliance flags valuable | §2.3 | VALIDATED — but pharma vertical needs **21 CFR Part 11**, not just EPA/CPSIA/CE |
| 13 | Closed-loop ML moat | §2.4 | NEEDS-DATA | Defensible only with synthetic-CFD bootstrap + opt-in field data |
| 14 | Year-1 gross revenue **$400k** | §8 | NEEDS-RECAST | See §6 — mix shifts away from production procurement |

---

## 6. Recommended Changes to the Business Concept

**6.1 Refine the ICP.** The sweet spot is **mid-market CPG ($50M–$500M revenue)
brands and regional/specialty CMOs**, not Tier-1 CPG (24-month sales cycle,
won't pay platform margin) and not solo indies (can't afford $500/mo).
Tier-1 is a **Year-2+ enterprise-integration motion**, not a Year-1 ICP.

**6.2 Add an Indie tier.** Introduce **Indie / Maker $99/mo** with metered
configuration credits and curated sample procurement. This is the
product-led growth wedge that converts indie DTC brands into Starter as
they scale.

**6.3 Re-anchor the procurement model.** Stop describing it as a uniform
$0.50–$2.00 hidden margin. Split into:
- **Sample & pilot marketplace:** 10–15% take-rate on $3–$15 sample units
  (this is where the $1 margin actually holds).
- **Production price-discovery + RFQ orchestration:** flat 2–4% marketplace
  fee on transparent pass-through pricing, capped per PO.
- **Enterprise integration:** Ariba / Coupa / SAP punch-out — no margin,
  paid via SaaS subscription + implementation fee.

**6.4 Split the regulated-pharma vertical.** Inhalation pharma / CDMO is a
distinct segment with no procurement attach, requires **21 CFR Part 11,
e-signature, validated audit trail**, and willingly pays $4–$8k/mo for SaaS
alone. Treat as Segment E with its own roadmap.

**6.5 Reset the ML accuracy & adoption claims.** Prediction accuracy
70%→**85% over 18 months**, bootstrapped via synthetic CFD; field-data
opt-in target **20%**, gated on either (a) on-prem deployment for
Enterprise or (b) differential-privacy aggregation for Pro.

**6.6 Reset the CAC + Year-1 revenue mix.** Procurement revenue Year 1
should be modeled as **samples + pilot only** (not production). Revised
revenue mix below; total Year-1 GR slips from $400k → roughly **$280k**
unless the indie tier overperforms.

| Stream | v1.0 Y1 | v1.1 Y1 | Note |
|---|---|---|---|
| SaaS Subscriptions | $60k | $95k | Indie tier adds volume |
| Sample / Pilot Procurement | (subset of $340k) | $150k | Where $0.50–$2 margin survives |
| Production Procurement (take-rate) | (subset of $340k) | $25k | Conservative; ramp in Y2 |
| Pharma SaaS (new vertical) | — | $10k | 1–2 design partners |
| **Total** | **$400k** | **~$280k** | Recovered in Y2 via indie ramp |

**6.7 Capture the consultant-channel risk.** Independent consultants
(Hobbs-class) are both buyers (white-label) and competitors. Add an
**Affiliate / White-label Consultant** SKU at 20–30% rev-share — converts
them from objectors to distributors.

**6.8 Sequence the build differently.** Re-order Phase 4–5 work:
1. SOC 2 Type II + on-prem-export option **before** Tier-1 CPG outreach.
2. 21 CFR Part 11 module **before** pharma vertical launch.
3. Sample-procurement marketplace **before** any production-procurement
   integrations — that's where margin actually exists today.

---

## 7. Open Questions / Next Validation Steps

1. **Run 5 real customer-discovery calls** in the mid-market CPG segment to
   confirm the 4–8% BOM-reduction band and the $99/$500/$2k tier appetite.
2. **Validate sample-marketplace take-rate** with Spencer, Coster, Lindal
   directly — channel-conflict risk is real per Hobbs (P10).
3. **Pharma CDMO discovery** (3 calls) to size the validated-environment
   SaaS opportunity and confirm $4–8k/mo willingness.
4. **Tier-1 CPG architecture review** — is on-prem / VPC-isolated
   deployment economically viable at our scale?
5. **CFD synthetic-data plan** — how many runs, what cost, what timeline to
   bootstrap from 70% to 85% prediction accuracy?

---

**Document Version:** 1.0
**Feeds:** `BUSINESS_STRATEGY.md` v1.1 (changelog appended)
