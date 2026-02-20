// ============================================================
// AeroSpec PoC — Mock Data
// 5 Standard Actuator Geometries × 10 Newtonian Fluids
// ============================================================

export interface Actuator {
  id: string;
  name: string;
  type: "full_cone" | "hollow_cone" | "flat_fan" | "fine_mist" | "jet_stream";
  orificeDiameter_mm: number;
  swirlChamberAngle_deg: number;
  maxPressure_bar: number;
  materialCompatibility: string[];
  typicalApplications: string[];
  price_usd: number;
  leadTime_days: number;
  sku: string;
}

export interface Fluid {
  id: string;
  name: string;
  viscosity_cP: number;
  density_kg_m3: number;
  surfaceTension_mN_m: number;
  pH: number;
  solventClass: "aqueous" | "alcohol" | "hydrocarbon" | "silicone" | "glycol";
  flashPoint_C: number | null;
  cas: string;
}

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
}

// -----------------------------------------------------------
// 5 Actuator Geometries
// -----------------------------------------------------------
export const ACTUATORS: Actuator[] = [
  {
    id: "ACT-FC-001",
    name: "FC-60 Full Cone Nozzle",
    type: "full_cone",
    orificeDiameter_mm: 0.8,
    swirlChamberAngle_deg: 60,
    maxPressure_bar: 10,
    materialCompatibility: ["aqueous", "alcohol", "glycol"],
    typicalApplications: ["Surface coating", "Humidification", "Dust suppression"],
    price_usd: 24.5,
    leadTime_days: 5,
    sku: "SP-FC60-08",
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
    price_usd: 32.0,
    leadTime_days: 7,
    sku: "SP-HC45-05",
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
    price_usd: 18.0,
    leadTime_days: 3,
    sku: "SP-FF110-12",
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
    price_usd: 45.0,
    leadTime_days: 10,
    sku: "SP-FM30-03",
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
    price_usd: 28.0,
    leadTime_days: 4,
    sku: "SP-JS0-15",
  },
];

// -----------------------------------------------------------
// 10 Newtonian Fluids
// -----------------------------------------------------------
export const FLUIDS: Fluid[] = [
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
  },
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
  },
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
  },
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
  },
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
  },
];

// -----------------------------------------------------------
// Prediction Engine (Surrogate Model Mock)
// Uses simplified Navier-Stokes derived correlations
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

  // Compatibility score
  const materialMatch = actuator.materialCompatibility.includes(fluid.solventClass);
  const viscosityPenalty = fluid.viscosity_cP > 20 ? 30 : fluid.viscosity_cP > 5 ? 10 : 0;
  const pressureSafe = pressure_bar <= actuator.maxPressure_bar;
  const compatibilityScore = Math.max(
    0,
    (materialMatch ? 70 : 20) + (pressureSafe ? 20 : -10) - viscosityPenalty + (Re > 2000 ? 10 : 0)
  );

  return {
    actuatorId: actuator.id,
    fluidId: fluid.id,
    coneAngle_deg: Math.round(coneAngle * 10) / 10,
    dropletSizeDv50_um: Math.round(Dv50_um * 10) / 10,
    flowRate_mL_min: Math.round(flowRate_mL_min * 10) / 10,
    sprayWidth_mm_at_100mm: Math.round(sprayWidth * 10) / 10,
    compatibilityScore: Math.min(100, Math.round(compatibilityScore)),
    pressureRequired_bar: pressure_bar,
    reynoldsNumber: Math.round(Re),
    weberNumber: Math.round(We),
  };
}
