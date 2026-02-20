// ============================================================
// AeroSpec — Extended Product & Fluid Database
// 12 Actuator Geometries × 25 Newtonian Fluids
// Enhanced prediction with Ohnesorge regime classification
// ============================================================

export type ActuatorType =
  | "full_cone"
  | "hollow_cone"
  | "flat_fan"
  | "fine_mist"
  | "jet_stream"
  | "air_atomizing"
  | "spiral"
  | "deflection"
  | "ultrasonic"
  | "multi_orifice"
  | "adjustable_cone"
  | "impingement";

export type SolventClass =
  | "aqueous"
  | "alcohol"
  | "hydrocarbon"
  | "silicone"
  | "glycol"
  | "ketone"
  | "ester"
  | "emulsion"
  | "caustic";

export type Industry =
  | "pharmaceutical"
  | "agriculture"
  | "food_beverage"
  | "automotive"
  | "chemical"
  | "cosmetics"
  | "electronics"
  | "hvac"
  | "mining"
  | "textile";

export interface Actuator {
  id: string;
  name: string;
  type: ActuatorType;
  orificeDiameter_mm: number;
  swirlChamberAngle_deg: number;
  maxPressure_bar: number;
  materialCompatibility: SolventClass[];
  typicalApplications: string[];
  industries: Industry[];
  price_usd: number;
  leadTime_days: number;
  sku: string;
  description: string;
}

export interface Fluid {
  id: string;
  name: string;
  viscosity_cP: number;
  density_kg_m3: number;
  surfaceTension_mN_m: number;
  pH: number;
  solventClass: SolventClass;
  flashPoint_C: number | null;
  cas: string;
  category: string;
  hazards: string[];
  ppeRequired: string[];
}

export type AtomizationRegime =
  | "Rayleigh"        // Oh > 1, low We — dripping / large drops
  | "Wind-induced"    // Oh < 1, moderate We — aerodynamic breakup
  | "Wind-stressed"   // Oh < 1, high We — ligament formation
  | "Atomization";    // Oh < 1, very high We — full atomization

export interface PredictionResult {
  actuatorId: string;
  fluidId: string;
  coneAngle_deg: number;
  dropletSizeDv50_um: number;
  flowRate_mL_min: number;
  sprayWidth_mm_at_100mm: number;
  compatibilityScore: number; // 0-100
  pressureRequired_bar: number;
  reynoldsNumber: number;
  weberNumber: number;
  ohnesorgeNumber: number;
  atomizationRegime: AtomizationRegime;
  velocityExit_m_s: number;
  safetyWarnings: string[];
}

// -----------------------------------------------------------
// 12 Actuator Geometries
// -----------------------------------------------------------
export const ACTUATORS: Actuator[] = [
  // ---- Original 5 ----
  {
    id: "ACT-FC-001",
    name: "FC-60 Full Cone Nozzle",
    type: "full_cone",
    orificeDiameter_mm: 0.8,
    swirlChamberAngle_deg: 60,
    maxPressure_bar: 10,
    materialCompatibility: ["aqueous", "alcohol", "glycol"],
    typicalApplications: ["Surface coating", "Humidification", "Dust suppression"],
    industries: ["chemical", "hvac", "mining"],
    price_usd: 24.5,
    leadTime_days: 5,
    sku: "SP-FC60-08",
    description: "General-purpose full cone nozzle producing uniform circular coverage. Internal swirl chamber creates even droplet distribution across the entire spray cross-section.",
  },
  {
    id: "ACT-HC-002",
    name: "HC-45 Hollow Cone Nozzle",
    type: "hollow_cone",
    orificeDiameter_mm: 0.5,
    swirlChamberAngle_deg: 45,
    maxPressure_bar: 15,
    materialCompatibility: ["aqueous", "alcohol", "silicone"],
    typicalApplications: ["Pharmaceutical coating", "Evaporative cooling", "Fine dispersion"],
    industries: ["pharmaceutical", "hvac", "chemical"],
    price_usd: 32.0,
    leadTime_days: 7,
    sku: "SP-HC45-05",
    description: "Precision hollow cone nozzle with fine droplet ring pattern. Concentrates spray on the perimeter for rapid evaporation and high surface-area-to-volume ratio.",
  },
  {
    id: "ACT-FF-003",
    name: "FF-110 Flat Fan Nozzle",
    type: "flat_fan",
    orificeDiameter_mm: 1.2,
    swirlChamberAngle_deg: 110,
    maxPressure_bar: 8,
    materialCompatibility: ["aqueous", "hydrocarbon", "glycol"],
    typicalApplications: ["Agricultural spray", "Parts washing", "Conveyor lubrication"],
    industries: ["agriculture", "automotive", "food_beverage"],
    price_usd: 18.0,
    leadTime_days: 3,
    sku: "SP-FF110-12",
    description: "Wide-angle flat fan producing a thin, uniform curtain of spray. Elliptical orifice geometry delivers excellent edge-to-edge coverage for line applications.",
  },
  {
    id: "ACT-FM-004",
    name: "FM-30 Fine Mist Actuator",
    type: "fine_mist",
    orificeDiameter_mm: 0.3,
    swirlChamberAngle_deg: 30,
    maxPressure_bar: 20,
    materialCompatibility: ["aqueous", "alcohol", "silicone"],
    typicalApplications: ["Cosmetic spray", "Nasal delivery", "Air freshener"],
    industries: ["cosmetics", "pharmaceutical"],
    price_usd: 45.0,
    leadTime_days: 10,
    sku: "SP-FM30-03",
    description: "Ultra-fine mist actuator with sub-50µm Dv50. Micro-machined orifice and high-shear swirl chamber produce cloud-like aerosol distribution.",
  },
  {
    id: "ACT-JS-005",
    name: "JS-0 Jet Stream Nozzle",
    type: "jet_stream",
    orificeDiameter_mm: 1.5,
    swirlChamberAngle_deg: 0,
    maxPressure_bar: 25,
    materialCompatibility: ["aqueous", "hydrocarbon", "glycol", "alcohol"],
    typicalApplications: ["High-pressure cleaning", "Cutting fluid", "Targeted dispensing"],
    industries: ["automotive", "chemical", "mining"],
    price_usd: 28.0,
    leadTime_days: 4,
    sku: "SP-JS0-15",
    description: "Zero-swirl jet nozzle for maximum penetration and impact force. Coherent stream maintains tight focus over long throw distances.",
  },

  // ---- New 7 ----
  {
    id: "ACT-AA-006",
    name: "AA-90 Air-Atomizing Nozzle",
    type: "air_atomizing",
    orificeDiameter_mm: 0.7,
    swirlChamberAngle_deg: 90,
    maxPressure_bar: 7,
    materialCompatibility: ["aqueous", "alcohol", "emulsion", "glycol", "ester"],
    typicalApplications: ["Tablet coating", "Paint atomization", "Flavor coating", "Humidification"],
    industries: ["pharmaceutical", "automotive", "food_beverage", "textile"],
    price_usd: 68.0,
    leadTime_days: 12,
    sku: "SP-AA90-07",
    description: "Dual-fluid nozzle using compressed air to shear the liquid into ultra-fine droplets independent of liquid pressure. Adjustable air cap controls spray angle and droplet size.",
  },
  {
    id: "ACT-SP-007",
    name: "SP-360 Spiral Nozzle",
    type: "spiral",
    orificeDiameter_mm: 2.0,
    swirlChamberAngle_deg: 360,
    maxPressure_bar: 6,
    materialCompatibility: ["aqueous", "glycol", "caustic", "emulsion"],
    typicalApplications: ["Flue gas desulfurization", "Gas scrubbing", "Tank washing", "Cooling towers"],
    industries: ["chemical", "hvac", "mining"],
    price_usd: 35.0,
    leadTime_days: 5,
    sku: "SP-SP360-20",
    description: "Clog-resistant spiral body with no internal swirl chamber. Liquid follows a helical path along the outer surface, producing a full-cone pattern with large free passage.",
  },
  {
    id: "ACT-DF-008",
    name: "DF-150 Deflection Nozzle",
    type: "deflection",
    orificeDiameter_mm: 1.8,
    swirlChamberAngle_deg: 150,
    maxPressure_bar: 5,
    materialCompatibility: ["aqueous", "emulsion", "glycol", "caustic"],
    typicalApplications: ["Tray washing", "Conveyor cleaning", "Foam application", "Rinsing"],
    industries: ["food_beverage", "chemical", "automotive"],
    price_usd: 22.0,
    leadTime_days: 3,
    sku: "SP-DF150-18",
    description: "Flat deflection plate redirects liquid stream into an ultra-wide, thin sheet. No internal passages to clog — ideal for slurries and fluids with suspended solids.",
  },
  {
    id: "ACT-US-009",
    name: "US-0 Ultrasonic Atomizer",
    type: "ultrasonic",
    orificeDiameter_mm: 0.15,
    swirlChamberAngle_deg: 0,
    maxPressure_bar: 2,
    materialCompatibility: ["aqueous", "alcohol", "silicone", "ester"],
    typicalApplications: ["Photoresist coating", "Thin film deposition", "Medical nebulization", "Precision lubrication"],
    industries: ["electronics", "pharmaceutical", "cosmetics"],
    price_usd: 185.0,
    leadTime_days: 21,
    sku: "SP-US0-015",
    description: "Piezoelectric-driven nozzle atomizes liquid at the resonant frequency of a titanium horn. Produces extremely narrow droplet distribution (span < 1.2) at near-zero velocity.",
  },
  {
    id: "ACT-MO-010",
    name: "MO-8X Multi-Orifice Cluster",
    type: "multi_orifice",
    orificeDiameter_mm: 0.4,
    swirlChamberAngle_deg: 40,
    maxPressure_bar: 12,
    materialCompatibility: ["aqueous", "alcohol", "glycol", "emulsion"],
    typicalApplications: ["PCB flux spray", "Multi-zone coating", "Sanitizer dispensing", "Array cooling"],
    industries: ["electronics", "food_beverage", "pharmaceutical"],
    price_usd: 78.0,
    leadTime_days: 14,
    sku: "SP-MO8X-04",
    description: "Eight micro-orifices arranged in a ring pattern for uniform area coverage from a single nozzle body. Each orifice produces its own cone, merging into a combined footprint.",
  },
  {
    id: "ACT-AC-011",
    name: "AC-VAR Adjustable Cone Nozzle",
    type: "adjustable_cone",
    orificeDiameter_mm: 1.0,
    swirlChamberAngle_deg: 75,
    maxPressure_bar: 12,
    materialCompatibility: ["aqueous", "alcohol", "hydrocarbon", "glycol", "silicone"],
    typicalApplications: ["R&D prototyping", "Variable-rate coating", "Process optimization", "QC testing"],
    industries: ["chemical", "pharmaceutical", "automotive", "food_beverage"],
    price_usd: 52.0,
    leadTime_days: 8,
    sku: "SP-ACVAR-10",
    description: "Externally adjustable needle valve changes the effective orifice area in real-time. Turn the knurled collar to sweep from jet to wide cone — ideal for process development.",
  },
  {
    id: "ACT-IM-012",
    name: "IM-45 Impingement Nozzle",
    type: "impingement",
    orificeDiameter_mm: 0.6,
    swirlChamberAngle_deg: 45,
    maxPressure_bar: 18,
    materialCompatibility: ["aqueous", "alcohol", "ketone", "ester"],
    typicalApplications: ["Solvent degreasing", "Precision rinsing", "Chemical etching", "Reactive mixing"],
    industries: ["electronics", "chemical", "automotive"],
    price_usd: 55.0,
    leadTime_days: 10,
    sku: "SP-IM45-06",
    description: "Two opposing liquid jets collide at a controlled angle, shattering into a thin, flat sheet of fine droplets. Excellent for reactive two-component systems.",
  },
];

// -----------------------------------------------------------
// 25 Newtonian Fluids across 9 solvent classes
// -----------------------------------------------------------
export const FLUIDS: Fluid[] = [
  // ---- Aqueous (6) ----
  {
    id: "FLD-001",
    name: "Deionized Water",
    viscosity_cP: 1.0,
    density_kg_m3: 998,
    surfaceTension_mN_m: 72.8,
    pH: 7.0,
    solventClass: "aqueous",
    flashPoint_C: null,
    cas: "7732-18-5",
    category: "Base Solvent",
    hazards: [],
    ppeRequired: [],
  },
  {
    id: "FLD-004",
    name: "Glycerin (10% aq.)",
    viscosity_cP: 1.3,
    density_kg_m3: 1025,
    surfaceTension_mN_m: 71.5,
    pH: 7.0,
    solventClass: "aqueous",
    flashPoint_C: null,
    cas: "56-81-5",
    category: "Humectant",
    hazards: [],
    ppeRequired: ["gloves"],
  },
  {
    id: "FLD-009",
    name: "Saline (0.9% NaCl)",
    viscosity_cP: 1.02,
    density_kg_m3: 1005,
    surfaceTension_mN_m: 73.0,
    pH: 6.5,
    solventClass: "aqueous",
    flashPoint_C: null,
    cas: "7647-14-5",
    category: "Pharmaceutical",
    hazards: [],
    ppeRequired: ["gloves"],
  },
  {
    id: "FLD-011",
    name: "Hydrogen Peroxide (3%)",
    viscosity_cP: 1.1,
    density_kg_m3: 1010,
    surfaceTension_mN_m: 74.0,
    pH: 4.5,
    solventClass: "aqueous",
    flashPoint_C: null,
    cas: "7722-84-1",
    category: "Oxidizer / Sanitizer",
    hazards: ["oxidizer", "irritant"],
    ppeRequired: ["gloves", "goggles"],
  },
  {
    id: "FLD-012",
    name: "Surfactant Solution (0.1% Tween 80)",
    viscosity_cP: 1.05,
    density_kg_m3: 1000,
    surfaceTension_mN_m: 38.0,
    pH: 6.8,
    solventClass: "aqueous",
    flashPoint_C: null,
    cas: "9005-65-6",
    category: "Wetting Agent",
    hazards: [],
    ppeRequired: ["gloves"],
  },
  {
    id: "FLD-013",
    name: "HPMC Coating Solution (5%)",
    viscosity_cP: 8.0,
    density_kg_m3: 1020,
    surfaceTension_mN_m: 45.0,
    pH: 6.5,
    solventClass: "aqueous",
    flashPoint_C: null,
    cas: "9004-65-3",
    category: "Pharmaceutical Coating",
    hazards: [],
    ppeRequired: ["gloves", "dust_mask"],
  },

  // ---- Alcohol (3) ----
  {
    id: "FLD-002",
    name: "Ethanol (95%)",
    viscosity_cP: 1.2,
    density_kg_m3: 789,
    surfaceTension_mN_m: 22.1,
    pH: 7.0,
    solventClass: "alcohol",
    flashPoint_C: 13,
    cas: "64-17-5",
    category: "Solvent",
    hazards: ["flammable"],
    ppeRequired: ["goggles", "gloves"],
  },
  {
    id: "FLD-003",
    name: "Isopropanol (70%)",
    viscosity_cP: 2.4,
    density_kg_m3: 810,
    surfaceTension_mN_m: 23.0,
    pH: 7.0,
    solventClass: "alcohol",
    flashPoint_C: 12,
    cas: "67-63-0",
    category: "Sanitizer / Solvent",
    hazards: ["flammable"],
    ppeRequired: ["goggles", "gloves"],
  },
  {
    id: "FLD-014",
    name: "n-Butanol",
    viscosity_cP: 2.95,
    density_kg_m3: 810,
    surfaceTension_mN_m: 24.6,
    pH: 7.0,
    solventClass: "alcohol",
    flashPoint_C: 35,
    cas: "71-36-3",
    category: "Cosolvent",
    hazards: ["flammable", "irritant"],
    ppeRequired: ["goggles", "gloves", "fume_hood"],
  },

  // ---- Glycol (3) ----
  {
    id: "FLD-005",
    name: "Glycerin (50% aq.)",
    viscosity_cP: 6.0,
    density_kg_m3: 1130,
    surfaceTension_mN_m: 68.5,
    pH: 7.0,
    solventClass: "glycol",
    flashPoint_C: null,
    cas: "56-81-5",
    category: "Humectant / Carrier",
    hazards: [],
    ppeRequired: ["gloves"],
  },
  {
    id: "FLD-006",
    name: "Propylene Glycol (PG)",
    viscosity_cP: 52.0,
    density_kg_m3: 1036,
    surfaceTension_mN_m: 36.0,
    pH: 7.0,
    solventClass: "glycol",
    flashPoint_C: 99,
    cas: "57-55-6",
    category: "Carrier / Antifreeze",
    hazards: [],
    ppeRequired: ["gloves"],
  },
  {
    id: "FLD-010",
    name: "Ethylene Glycol (30% aq.)",
    viscosity_cP: 2.5,
    density_kg_m3: 1042,
    surfaceTension_mN_m: 56.0,
    pH: 7.0,
    solventClass: "glycol",
    flashPoint_C: 111,
    cas: "107-21-1",
    category: "Coolant / Antifreeze",
    hazards: ["toxic_if_ingested"],
    ppeRequired: ["gloves", "goggles"],
  },

  // ---- Hydrocarbon (3) ----
  {
    id: "FLD-007",
    name: "Light Mineral Oil",
    viscosity_cP: 15.0,
    density_kg_m3: 840,
    surfaceTension_mN_m: 30.0,
    pH: 7.0,
    solventClass: "hydrocarbon",
    flashPoint_C: 135,
    cas: "8042-47-5",
    category: "Lubricant",
    hazards: ["combustible"],
    ppeRequired: ["gloves"],
  },
  {
    id: "FLD-015",
    name: "Naphtha (VM&P)",
    viscosity_cP: 0.65,
    density_kg_m3: 740,
    surfaceTension_mN_m: 25.0,
    pH: 7.0,
    solventClass: "hydrocarbon",
    flashPoint_C: 10,
    cas: "64742-89-8",
    category: "Cleaning Solvent",
    hazards: ["flammable", "vapors"],
    ppeRequired: ["goggles", "gloves", "fume_hood", "respirator"],
  },
  {
    id: "FLD-016",
    name: "Soluble Cutting Fluid (5%)",
    viscosity_cP: 2.0,
    density_kg_m3: 990,
    surfaceTension_mN_m: 35.0,
    pH: 9.0,
    solventClass: "hydrocarbon",
    flashPoint_C: null,
    cas: "64742-65-0",
    category: "Metalworking Fluid",
    hazards: ["irritant"],
    ppeRequired: ["gloves", "goggles"],
  },

  // ---- Silicone (2) ----
  {
    id: "FLD-008",
    name: "Silicone Fluid (5 cSt)",
    viscosity_cP: 4.6,
    density_kg_m3: 920,
    surfaceTension_mN_m: 19.7,
    pH: 7.0,
    solventClass: "silicone",
    flashPoint_C: 136,
    cas: "63148-62-9",
    category: "Release Agent",
    hazards: [],
    ppeRequired: ["gloves"],
  },
  {
    id: "FLD-017",
    name: "Silicone Fluid (50 cSt)",
    viscosity_cP: 48.0,
    density_kg_m3: 960,
    surfaceTension_mN_m: 20.9,
    pH: 7.0,
    solventClass: "silicone",
    flashPoint_C: 230,
    cas: "63148-62-9",
    category: "Damping / Coating",
    hazards: [],
    ppeRequired: ["gloves"],
  },

  // ---- Ketone (2) ----
  {
    id: "FLD-018",
    name: "Acetone",
    viscosity_cP: 0.32,
    density_kg_m3: 784,
    surfaceTension_mN_m: 23.5,
    pH: 7.0,
    solventClass: "ketone",
    flashPoint_C: -20,
    cas: "67-64-1",
    category: "Fast-Evaporating Solvent",
    hazards: ["highly_flammable", "vapors"],
    ppeRequired: ["goggles", "gloves", "fume_hood"],
  },
  {
    id: "FLD-019",
    name: "Methyl Ethyl Ketone (MEK)",
    viscosity_cP: 0.43,
    density_kg_m3: 805,
    surfaceTension_mN_m: 24.6,
    pH: 7.0,
    solventClass: "ketone",
    flashPoint_C: -9,
    cas: "78-93-3",
    category: "Industrial Solvent",
    hazards: ["highly_flammable", "vapors", "irritant"],
    ppeRequired: ["goggles", "gloves", "fume_hood", "respirator"],
  },

  // ---- Ester (2) ----
  {
    id: "FLD-020",
    name: "Ethyl Acetate",
    viscosity_cP: 0.45,
    density_kg_m3: 897,
    surfaceTension_mN_m: 23.9,
    pH: 7.0,
    solventClass: "ester",
    flashPoint_C: -4,
    cas: "141-78-6",
    category: "Coating Solvent",
    hazards: ["highly_flammable", "vapors"],
    ppeRequired: ["goggles", "gloves", "fume_hood"],
  },
  {
    id: "FLD-021",
    name: "Isopropyl Myristate",
    viscosity_cP: 5.5,
    density_kg_m3: 853,
    surfaceTension_mN_m: 28.0,
    pH: 7.0,
    solventClass: "ester",
    flashPoint_C: 167,
    cas: "110-27-0",
    category: "Cosmetic Emollient",
    hazards: [],
    ppeRequired: ["gloves"],
  },

  // ---- Emulsion (2) ----
  {
    id: "FLD-022",
    name: "Acrylic Latex Emulsion (40%)",
    viscosity_cP: 25.0,
    density_kg_m3: 1050,
    surfaceTension_mN_m: 34.0,
    pH: 8.5,
    solventClass: "emulsion",
    flashPoint_C: null,
    cas: "9003-01-4",
    category: "Coating / Adhesive",
    hazards: ["irritant"],
    ppeRequired: ["gloves", "goggles"],
  },
  {
    id: "FLD-023",
    name: "PVA Solution (10%)",
    viscosity_cP: 12.0,
    density_kg_m3: 1020,
    surfaceTension_mN_m: 50.0,
    pH: 5.0,
    solventClass: "emulsion",
    flashPoint_C: null,
    cas: "9002-89-5",
    category: "Film-Forming Agent",
    hazards: [],
    ppeRequired: ["gloves"],
  },

  // ---- Caustic (2) ----
  {
    id: "FLD-024",
    name: "Sodium Hydroxide (2%)",
    viscosity_cP: 1.2,
    density_kg_m3: 1022,
    surfaceTension_mN_m: 74.0,
    pH: 13.5,
    solventClass: "caustic",
    flashPoint_C: null,
    cas: "1310-73-2",
    category: "CIP Cleaning Agent",
    hazards: ["corrosive"],
    ppeRequired: ["goggles", "gloves", "face_shield", "apron"],
  },
  {
    id: "FLD-025",
    name: "Citric Acid (10% aq.)",
    viscosity_cP: 1.15,
    density_kg_m3: 1040,
    surfaceTension_mN_m: 68.0,
    pH: 2.0,
    solventClass: "caustic",
    flashPoint_C: null,
    cas: "77-92-9",
    category: "Descaler / Food Acid",
    hazards: ["irritant"],
    ppeRequired: ["goggles", "gloves"],
  },
];

// -----------------------------------------------------------
// Industry metadata
// -----------------------------------------------------------
export const INDUSTRY_LABELS: Record<Industry, string> = {
  pharmaceutical: "Pharmaceutical",
  agriculture: "Agriculture",
  food_beverage: "Food & Beverage",
  automotive: "Automotive",
  chemical: "Chemical Processing",
  cosmetics: "Cosmetics",
  electronics: "Electronics",
  hvac: "HVAC / Cooling",
  mining: "Mining",
  textile: "Textile",
};

export const SOLVENT_CLASS_LABELS: Record<SolventClass, string> = {
  aqueous: "Aqueous",
  alcohol: "Alcohol",
  hydrocarbon: "Hydrocarbon",
  silicone: "Silicone",
  glycol: "Glycol",
  ketone: "Ketone",
  ester: "Ester",
  emulsion: "Emulsion",
  caustic: "Caustic / Acid",
};

// -----------------------------------------------------------
// Prediction Engine (Enhanced Surrogate Model)
// Uses simplified Navier-Stokes derived correlations
// + Ohnesorge regime classification
// -----------------------------------------------------------
export function predict(actuator: Actuator, fluid: Fluid, pressure_bar: number): PredictionResult {
  const d = actuator.orificeDiameter_mm / 1000; // m
  const mu = fluid.viscosity_cP / 1000; // Pa·s
  const rho = fluid.density_kg_m3;
  const sigma = fluid.surfaceTension_mN_m / 1000; // N/m
  const P = pressure_bar * 1e5; // Pa

  // Velocity from Bernoulli: v = Cd * sqrt(2*deltaP/rho)
  const Cd = 0.62;
  const v = Cd * Math.sqrt((2 * P) / rho);

  // Flow rate Q = Cd * A * sqrt(2*deltaP/rho)
  const A = Math.PI * (d / 2) ** 2;
  const Q_m3_s = Cd * A * Math.sqrt((2 * P) / rho);
  const flowRate_mL_min = Q_m3_s * 1e6 * 60;

  // Reynolds Number
  const Re = (rho * v * d) / mu;

  // Weber Number
  const We = (rho * v ** 2 * d) / sigma;

  // Ohnesorge Number: Oh = mu / sqrt(rho * sigma * d) = sqrt(We) / Re
  const Oh = mu / Math.sqrt(rho * sigma * d);

  // Atomization regime classification
  let atomizationRegime: AtomizationRegime;
  if (Oh > 1) {
    atomizationRegime = "Rayleigh";
  } else if (We < 100) {
    atomizationRegime = "Wind-induced";
  } else if (We < 1000) {
    atomizationRegime = "Wind-stressed";
  } else {
    atomizationRegime = "Atomization";
  }

  // Cone angle model: base angle scaled by sqrt(We)/Re^0.1
  const baseAngle = actuator.swirlChamberAngle_deg;
  const coneAngle = Math.min(
    150,
    Math.max(5, baseAngle * 0.8 + 10 * Math.sqrt(We) / Math.pow(Re, 0.1))
  );

  // Droplet size (Sauter Mean Diameter correlation)
  // SMD ∝ d * Re^(-0.5) * We^(-0.25)
  const Dv50_m = 2.5 * d * Math.pow(Re, -0.5) * Math.pow(We, -0.25);
  const Dv50_um = Dv50_m * 1e6;

  // Spray width at 100mm distance
  const sprayWidth = 2 * 100 * Math.tan((coneAngle * Math.PI) / 360);

  // --- Safety Warnings ---
  const safetyWarnings: string[] = [];
  if (fluid.flashPoint_C !== null && fluid.flashPoint_C < 23) {
    safetyWarnings.push("FLAMMABLE: Flash point below 23°C — ensure ATEX/Ex-rated environment");
  }
  if (fluid.flashPoint_C !== null && fluid.flashPoint_C >= 23 && fluid.flashPoint_C < 60) {
    safetyWarnings.push("COMBUSTIBLE: Flash point below 60°C — avoid ignition sources");
  }
  if (fluid.hazards.includes("corrosive")) {
    safetyWarnings.push("CORROSIVE: Ensure wetted parts are chemically resistant");
  }
  if (fluid.hazards.includes("oxidizer")) {
    safetyWarnings.push("OXIDIZER: Keep away from organics and reducing agents");
  }
  if (fluid.pH < 3) {
    safetyWarnings.push("ACIDIC: pH below 3 — verify seal and body material compatibility");
  }
  if (fluid.pH > 12) {
    safetyWarnings.push("ALKALINE: pH above 12 — verify seal and body material compatibility");
  }
  if (pressure_bar > actuator.maxPressure_bar) {
    safetyWarnings.push(`OVERPRESSURE: Operating at ${pressure_bar} bar exceeds rated ${actuator.maxPressure_bar} bar`);
  }
  if (Dv50_um < 30 && fluid.hazards.some(h => h.includes("flammable"))) {
    safetyWarnings.push("EXPLOSIVE MIST: Sub-30µm droplets of flammable liquid — explosive atmosphere risk");
  }
  if (fluid.ppeRequired.includes("respirator")) {
    safetyWarnings.push("INHALATION: Respiratory protection required — use in ventilated area");
  }

  // --- Compatibility score (enhanced) ---
  const materialMatch = actuator.materialCompatibility.includes(fluid.solventClass);
  const viscosityPenalty = fluid.viscosity_cP > 30 ? 35 : fluid.viscosity_cP > 10 ? 15 : fluid.viscosity_cP > 5 ? 5 : 0;
  const pressureSafe = pressure_bar <= actuator.maxPressure_bar;
  const regimeBonus = atomizationRegime === "Atomization" ? 10 : atomizationRegime === "Wind-stressed" ? 5 : 0;
  const compatibilityScore = Math.max(
    0,
    Math.min(
      100,
      (materialMatch ? 70 : 20) + (pressureSafe ? 20 : -10) - viscosityPenalty + regimeBonus
    )
  );

  return {
    actuatorId: actuator.id,
    fluidId: fluid.id,
    coneAngle_deg: Math.round(coneAngle * 10) / 10,
    dropletSizeDv50_um: Math.round(Dv50_um * 10) / 10,
    flowRate_mL_min: Math.round(flowRate_mL_min * 10) / 10,
    sprayWidth_mm_at_100mm: Math.round(sprayWidth * 10) / 10,
    compatibilityScore: Math.round(compatibilityScore),
    pressureRequired_bar: pressure_bar,
    reynoldsNumber: Math.round(Re),
    weberNumber: Math.round(We),
    ohnesorgeNumber: Math.round(Oh * 10000) / 10000,
    atomizationRegime,
    velocityExit_m_s: Math.round(v * 100) / 100,
    safetyWarnings,
  };
}
