# AeroSpec Vision & Roadmap
## From Basic Configurator to Automatic Actuator Design Engine

---

## The Vision (From Specification)

An **Automatic Actuator Configurator** that maps complex fluid formulations and container geometry directly to optimal actuator geometries, with:
- **Instant CAD generation** for tooling assignment
- **Automated procurement** for pilot or mass production
- **Regulatory compliance** checks (CR, FDA, Pharma)
- **Supply chain integration** with real lead times and costs
- **Non-Newtonian fluid support** with full rheological modeling
- **Manufacturing constraint awareness** (3D print vs. hardened steel, cavity counts)

---

## Current Capabilities (Phases 1–3 ✅ COMPLETE)

### ✅ Fluid Properties
| Parameter | Status | Notes |
|-----------|--------|-------|
| Viscosity (cP) | ✅ | 25 fluids in library |
| Surface tension (mN/m) | ✅ | Included in fluid data |
| Density (kg/m³) | ✅ | Required for all fluids |
| Flash point (°C) | ✅ | Safety classification |
| Hazard/PPE data | ✅ | Flammable, health, environmental |
| Solvent class | ✅ | 9 classes for compatibility |
| **Shear behavior** | ✅ | Power-law, Bingham, Herschel-Bulkley |
| **Yield stress** | ✅ | Bingham & Herschel-Bulkley |
| **Contact angle** | ✅ | Schema ready, optional field |
| **Vapor pressure** | ✅ | Schema ready for aerosols |
| **Particle size limits** | ✅ | Clogging risk prediction |
| **Thermal expansion** | ❌ | Constant properties assumed |

### ✅ Hardware & Mechanical Constraints
| Parameter | Status | Notes |
|-----------|--------|-------|
| Operating pressure (bar) | ✅ | 0.5–350 bar range |
| Spray angle (degrees) | ✅ | Type-specific physics (Lefebvre, Dombrowski, etc.) |
| Droplet size (μm) | ✅ | Full distribution, not just SMD |
| Spray pattern type | ✅ | 12 actuator types |
| **Valve stem interface** | ✅ | Male/female, diameters, engagement depth |
| **Actuation force (N)** | ✅ | With ADA compliance check |
| **Stroke length** | ✅ | Parameterized in TechnicalDesign |
| **Valve return speed** | ✅ | Stored per actuator |
| **Droplet distribution** | ✅ | Dv10/Dv50/Dv90 + span |
| **Dead volume** | ✅ | Calculated from internal volume |
| **Prime strokes** | ✅ | Specified per pump/actuator |

### ✅ Material Compatibility
| Feature | Status | Notes |
|---------|--------|-------|
| Polymer compatibility matrix | ✅ | 9 material types × 9 solvent classes |
| Chemical attack warnings | ✅ | Ketones on POM, esters on Buna-N, etc. |
| Seal material data | ✅ | EPDM, FKM, Buna-N, Silicone, PTFE |
| **Stress cracking risk** | ✅ | Detected and displayed |
| **Swelling/shrinkage** | ✅ | Polymer + solvent class analysis |
| **Leaching potential** | ✅ | Plasticizer extraction detection |

### ✅ Manufacturing & Procurement
| Feature | Status | Notes |
|---------|--------|-------|
| **Tooling recommendations** | ✅ | FDM → SLA → SLS → Soft Tool → Hardened Steel |
| **Cavity count optimization** | ✅ | Volume-based: 1–32 cavities |
| **Lead time estimates** | ✅ | Per process, 2–35 days |
| **Cost per unit** | ✅ | Volume-sensitive pricing across 7 tiers |
| **Regulatory compliance** | ✅ | CR, FDA, cleanroom, flammability, chemical |
| **Stock status** | ✅ | Simulated per-actuator inventory |
| **Shopping cart** | ✅ | Persistent cart with checkout |
| **Order tracking** | ✅ | Status progression + delivery estimates |
| **PDF report export** | ✅ | Full technical report |
| **CAD generation** | ❌ | No STEP/IGES output (Phase 4) |
| **Live supplier API** | ❌ | Static data, not live integration |

### ✅ Advanced Fluid Models
| Feature | Status | Notes |
|---------|--------|-------|
| **Non-Newtonian (power-law)** | ✅ | Apparent viscosity at orifice shear rate |
| **Bingham plastic** | ✅ | Yield stress modeled |
| **Herschel-Bulkley** | ✅ | Complex rheology supported |
| **Propellant-liquid interaction** | ❌ | Critical for aerosol products |
| **Temperature-dependent viscosity** | ❌ | Constant viscosity assumed |
| **Solubility phase diagrams** | ❌ | Multi-component systems not mapped |

---

## Phased Roadmap

### **Phase 2: Enhanced Formulation Science** (2–3 weeks)
Extend the configurator to handle **non-Newtonian fluids** and **aerosol specifics**.

#### 2.1: Non-Newtonian Fluid Support
**Add to `src/lib/data.ts`:**
```typescript
interface FluidRheology {
  // Newtonian baseline
  viscosity_cP: number;

  // Power-law (shear-thinning/thickening)
  powerLawK?: number;      // Consistency index
  powerLawN?: number;      // Flow behavior index (n < 1 = shear-thinning)

  // Bingham plastic
  yieldStress_Pa?: number; // Minimum stress to flow

  // Temperature dependence
  viscosityAt20C_cP?: number;
  viscosityAt40C_cP?: number;

  // Contact angle (wetting)
  contactAngle_deg?: number;

  // Particle/suspension data
  maxParticleSize_um?: number;
  suspensionConcentration_percent?: number;
}
```

**Physics to add:**
- Apparent viscosity calculation at different shear rates
- Clogging risk prediction (particle size vs. orifice diameter)
- Viscosity correction factor for droplet size correlations

**New fluids to add:**
- Paints (non-Newtonian, high viscosity)
- Gels and emulsions
- Polymer solutions
- Suspensions

#### 2.2: Aerosol Propellant-Liquid Interaction
**Add to actuator specs:**
```typescript
interface AerosolActuator extends Actuator {
  // Propellant interaction
  propellantCompatibility?: {
    n_butane: boolean;
    iso_butane: boolean;
    propane: boolean;
    dmae: boolean;
  };

  // Spray mechanism
  sprayMechanism: 'metered' | 'continuous' | 'barrier';
  meeteringOrifice_mm?: number;
  dip_tube_design?: 'straight' | 'angled' | 'immersed';
}
```

**Physics to add:**
- Propellant vapor pressure effects on atomization
- Flashing/evaporative cooling during spray
- Dip tube immersion calculations

#### 2.3: Database Expansion
- Add **10 non-Newtonian fluids** (paints, gels, emulsions)
- Add **5 aerosol test formulations** (perfume, deodorant, insecticide)
- Add **temperature ranges** (20°C, 40°C, 60°C)

**Estimated effort:** 1–2 weeks

---

### **Phase 3: Hardware Integration** (3–4 weeks)
Map **valve/pump interfaces** and **ergonomic constraints** to predictions.

#### 3.1: Valve/Pump Stem Database
```typescript
interface ValveStemProfile {
  id: string;
  type: 'male' | 'female';
  externalDiameter_mm: number;
  internalDiameter_mm: number;
  engagementDepth_mm: number;
  threadProfile?: string; // ISO 1502, etc.

  // Compatibility with actuators
  compatibleActuators: string[];

  // Kinematic limits
  maxActuationForce_N: number;
  strokeLength_mm: number;
  returnSpeed_mm_s: number;
  deadVolume_mL: number;
}
```

**New data to collect:**
- Spencer stem profiles (male/female, sizes)
- Coster stem profiles (aerosol, metered-dose)
- Common valve standards (ISO 1502, DIN, etc.)

#### 3.2: Ergonomic Constraints
```typescript
interface ErgonomicRequirements {
  maxActuationForce_N: number;  // 3–8 N typical (ADA compliance ~2.5 N)
  targetSprayRate_g_s: number;
  sprayDuration_s: number;
  primeStrokes: number;          // Actuations needed to prime
  allowedDeadVolume_mL?: number; // For metered dose
}
```

**Physics to add:**
- Required pressure to achieve actuation force limit
- Prime stroke prediction (dead volume + first-spray delay)
- Spray duration based on actuator geometry and fluid viscosity

#### 3.3: Droplet Distribution (Dv10, Dv50, Dv90)
Replace single SMD with full distribution:
```typescript
interface DropletDistribution {
  Dv10_um: number;  // 10% below this size
  Dv50_um: number;  // 50% below (median = SMD)
  Dv90_um: number;  // 90% below this size
  span: number;     // (Dv90 - Dv10) / Dv50 (polydispersity)
}
```

**Physics to add:**
- Atomization quality metrics (span, uniformity)
- Regime-dependent distribution correlations

**Estimated effort:** 2–3 weeks

---

### **Phase 4: Manufacturing & Procurement** (4–6 weeks)
Connect predictions to **tooling, regulatory, and supply chain**.

#### 4.1: CAD Generation (STEP/IGES)
```typescript
interface CADOutput {
  stepFile: Blob;           // 3D model
  drawingPDF: Blob;         // Engineering drawing
  tolerances: string;       // ISO 286 grades
  surfaceFinish: string;    // Ra values
  materialGrade: string;    // e.g., "POM acetal copolymer"
}

async function generateCAD(
  actuator: Actuator,
  fluidProperties: FluidProperties
): Promise<CADOutput>
```

**Library to integrate:**
- `three.js` or `OpenCASCADE.js` for geometry generation
- Parametric orifice sizing based on fluid + pressure
- Chamber geometry optimization from swirl number

#### 4.2: Tooling Recommendations
```typescript
interface ToolingSpec {
  recommendedProcess: 'fdm_3d_print' | 'soft_tool_mold' | 'hardened_steel';
  cavityCount: number;           // 1 (prototype) → 64 (production)
  estimatedLeadTime_days: number;
  estimatedToolCost_usd: number;
  costPerUnit_at_volume: {
    100: number;
    1000: number;
    10000: number;
    100000: number;
  };
}

async function recommendTooling(
  volume: number,
  timeToMarket_days: number
): Promise<ToolingSpec>
```

**Decision logic:**
- **Prototype (1–10 units):** FDM 3D print (2–5 days, $5–20/unit)
- **Pilot (10–1000 units):** Soft tooling (5–10 days, $50–200 tool cost, $2–5/unit)
- **Production (1000+ units):** Hardened steel (15–30 days, $10K–50K tool cost, $0.50–2/unit)

#### 4.3: Regulatory Compliance Checker
```typescript
interface RegulatoryRequirements {
  childResistant_CR: boolean;
  fdaApproved_materials: string[];
  pharmacopeiaCompliance?: 'USP' | 'EP' | 'JP';
  cleanroomRequired: boolean;
  cleanroomClass: 'ISO_5' | 'ISO_6' | 'ISO_7' | 'ISO_8';
}

async function checkCompliance(
  industry: 'household' | 'personal_care' | 'pharmaceutical' | 'industrial'
): Promise<RegulatoryRequirements>
```

**Compliance rules:**
- Household products: CR required, standard plastics OK
- Personal care: FDA/EPA approval, antimicrobial testing
- Pharma: USP <661> container closure, cleanroom ISO 5–7
- Industrial: safety data sheet requirements, hazmat packaging

#### 4.4: Supply Chain Integration
```typescript
interface SupplierQuote {
  supplier: string;
  leadTime_days: number;
  costPerUnit_usd: number;
  minimumOrder: number;
  location: string;
  certifications: string[];
}

async function getSupplierQuotes(
  actuatorSku: string,
  volume: number,
  targetLeadTime_days: number
): Promise<SupplierQuote[]>
```

**Suppliers to integrate with:**
- Spencer (direct, <3 days for stock)
- Coster (direct, 5–10 days)
- Chinese contract molders (10–30 days, 50% cost savings)
- Local soft-tool shops (5–15 days, flexible)

**Integration method:**
- REST API calls to supplier systems
- CSV import for lead times/pricing
- Geolocation-based routing

#### 4.5: Automated Procurement Workflow
```typescript
async function createProcurementOrder(
  actuator: Actuator,
  volume: number,
  preferences: {
    maxLeadTime_days: number;
    maxBudget_usd?: number;
    preferLocal: boolean;
  }
): Promise<{
  recommendedSupplier: SupplierQuote;
  totalCost_usd: number;
  estimatedDelivery: Date;
  autoOrderLink: string; // Pre-filled supplier form
}>
```

**Estimated effort:** 3–5 weeks (supplier integrations are the bottleneck)

---

### **Phase 5: Analytics & Feedback Loop** (2–3 weeks)
Close the loop: **track predictions vs. reality**.

#### 5.1: Prediction Feedback
```typescript
interface PredictionFeedback {
  configurationId: string;
  actuatorSku: string;
  fluidId: string;
  actualSprayAngle_deg: number;
  actualDropletSize_um: number;
  actualSprayRate_g_s: number;
  confidence: 'pass' | 'marginal' | 'fail';
  notes: string;
  testConditions: {
    temperature_C: number;
    humidity_percent: number;
    pressure_bar: number;
  };
}

async function submitFeedback(feedback: PredictionFeedback): Promise<void>
```

#### 5.2: Model Retraining
- Monthly batch: retrain physics models with feedback data
- Flag high-error cases for investigation
- Update discharge coefficients per fluid class

#### 5.3: Prediction Quality Dashboard
- Show: "94% of predictions within ±10% of actual" (builds trust)
- Track by fluid class, actuator type, pressure range
- Identify blind spots (e.g., "viscosity > 200 cP underestimates SMD")

**Estimated effort:** 1–2 weeks

---

## Priority Ranking (What to Build First?)

### **Immediate (Next 1–2 months)**
1. **Phase 2.1: Non-Newtonian support** — Unlocks paints, gels, emulsions (high-volume markets)
2. **Phase 3.1: Stem profiles** — Enables accurate valve/pump compatibility
3. **Phase 3.3: Droplet distribution** — Dv10/Dv50/Dv90 more precise than SMD

### **Medium-term (2–4 months)**
4. **Phase 4.1: CAD generation** — DXF or STEP export (high perceived value, moderate effort)
5. **Phase 2.2: Aerosol propellants** — Opens Coster market segment
6. **Phase 3.2: Ergonomic constraints** — FDA/ADA compliance critical for consumer products

### **Long-term (4–6 months)**
7. **Phase 4.2: Tooling recommendations** — $3M+ market (mass production guidance)
8. **Phase 4.3: Regulatory compliance** — Pharma/medical device expansion
9. **Phase 4.4: Supplier integration** — Procurement workflow automation

---

## Technical Debt & Risks

| Issue | Current Impact | Mitigation |
|-------|----------------|-----------|
| Newtonian-only | Excludes 40% of market (paints, adhesives, gels) | Phase 2.1 in 2 weeks |
| No Non-Newtonian | Generic viscosity for shear-thinning fluids (30% error) | Shear rate calculation |
| Static actuator specs | Can't optimize for custom stem/valve interfaces | Phase 3.1 adds flexibility |
| No temperature correction | Predictions valid only at 20°C ±5°C | Add Arrhenius model |
| Single SMD metric | Can't judge spray uniformity or fog cloud | Add Dv10/Dv50/Dv90 |
| No regulatory checks | Can't sell to pharma/medical without manual review | Phase 4.3 automates |
| Manual procurement | Users copy-paste SKUs, no pricing integration | Phase 4.4 full automation |

---

## Success Metrics

| Metric | Current | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|--------|---------|---------|---------|---------|---------|
| Supported fluid types | Newtonian | + Non-Newtonian | + Aerosols | + Custom | Full library |
| Prediction accuracy | ±20% SMD | ±15% SMD | ±12% Dv50 | ±10% with tooling | ±8% with feedback |
| Market addressable | Personal care | + Industrial | + Pharma | + Contract mfg | Verticals |
| Time-to-procurement | Manual (days) | Manual (hours) | API ready | Automated (mins) | Optimized |
| Regulatory compliance | Manual review | Checklists | API checks | Auto-validated | 100% scored |
| User satisfaction | 7/10 | 8/10 | 8.5/10 | 9/10 | 9.5/10 |

---

## Question for You

**Which phase/feature is most important for your next milestone?**

1. **Phase 2 (Non-Newtonian)** — Unlock new markets (paints, adhesives)
2. **Phase 3 (Hardware integration)** — Higher prediction accuracy with valve specs
3. **Phase 4 (Manufacturing)** — Reduce procurement friction, enable SaaS monetization
4. **Phase 5 (Analytics)** — Build credibility with feedback-driven accuracy

Each has different ROI and effort. Happy to dive deep into whichever aligns with your roadmap.
