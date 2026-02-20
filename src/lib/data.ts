// ============================================================
// AeroSpec — Extended Product & Fluid Database
// Spencer Actuators + Coster Group Product Range
// Technical Design Specifications + Ohnesorge Regime
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
  | "textile"
  | "household"
  | "personal_care";

export type Manufacturer = "Spencer" | "Coster";

export type ProductCategory =
  | "nozzle"
  | "aerosol_actuator"
  | "aerosol_valve"
  | "spray_pump"
  | "perfumery_pump"
  | "dispenser";

// Technical design / engineering specification
export interface TechnicalDesign {
  // Physical dimensions
  bodyDiameter_mm: number;
  bodyLength_mm: number;
  connectionType: string;            // "1/4 BSP" | "1" crimp" | "20mm snap" etc.
  stemDiameter_mm: number | null;    // for aerosol valves/actuators
  neckSize_mm: number | null;        // for pumps
  weight_g: number;

  // Internal geometry
  swirlChannels: number;             // 0 = no swirl (jet), 2-8 typical
  swirlChannelWidth_mm: number | null;
  chamberDiameter_mm: number | null;
  chamberDepth_mm: number | null;
  inletDiameter_mm: number;
  orificeGeometry: "round" | "elliptical" | "slot" | "multi_hole" | "annular" | "mesh";
  orificeCount: number;

  // Materials
  bodyMaterial: string;              // "PP" | "POM" | "316SS" | "PVDF" | "Titanium"
  sealMaterial: string;              // "Buna-N" | "EPDM" | "FKM" | "PTFE" | "Silicone"
  springMaterial: string | null;     // "302 SS" | "Inconel" | null for pumpless
  insertMaterial: string | null;     // "POM" | "PP" | "ceramic" | "ruby"

  // Flow path
  flowPathDescription: string;       // Human-readable flow path for engineering cross-section
  internalVolume_uL: number | null;  // dead volume
  dosage_uL: number | null;          // metered dose per actuation (null = continuous)

  // Surface finish
  surfaceFinish_Ra_um: number | null; // Ra roughness of internal bore
}

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
  // New fields
  manufacturer: Manufacturer;
  productCategory: ProductCategory;
  technicalDesign: TechnicalDesign;
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
// SPENCER Nozzle Geometries (12) — industrial spray nozzles
// -----------------------------------------------------------
const SPENCER_ACTUATORS: Actuator[] = [
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
    manufacturer: "Spencer",
    productCategory: "nozzle",
    technicalDesign: {
      bodyDiameter_mm: 18, bodyLength_mm: 32, connectionType: "1/4\" BSP Female",
      stemDiameter_mm: null, neckSize_mm: null, weight_g: 28,
      swirlChannels: 4, swirlChannelWidth_mm: 0.6, chamberDiameter_mm: 6.0,
      chamberDepth_mm: 4.5, inletDiameter_mm: 4.0, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "316L Stainless Steel", sealMaterial: "FKM (Viton)",
      springMaterial: null, insertMaterial: "POM (Delrin)",
      flowPathDescription: "Inlet → 4-channel tangential swirl chamber → converging cone → round orifice exit",
      internalVolume_uL: 180, dosage_uL: null, surfaceFinish_Ra_um: 0.8,
    },
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
    manufacturer: "Spencer",
    productCategory: "nozzle",
    technicalDesign: {
      bodyDiameter_mm: 16, bodyLength_mm: 28, connectionType: "1/4\" BSP Female",
      stemDiameter_mm: null, neckSize_mm: null, weight_g: 22,
      swirlChannels: 3, swirlChannelWidth_mm: 0.4, chamberDiameter_mm: 5.0,
      chamberDepth_mm: 6.0, inletDiameter_mm: 3.5, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "316L Stainless Steel", sealMaterial: "EPDM",
      springMaterial: null, insertMaterial: "ceramic",
      flowPathDescription: "Inlet → 3-channel high-ratio swirl chamber → annular film formation → round orifice → hollow cone sheet breakup",
      internalVolume_uL: 120, dosage_uL: null, surfaceFinish_Ra_um: 0.4,
    },
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
    manufacturer: "Spencer",
    productCategory: "nozzle",
    technicalDesign: {
      bodyDiameter_mm: 20, bodyLength_mm: 26, connectionType: "1/4\" BSP Male",
      stemDiameter_mm: null, neckSize_mm: null, weight_g: 32,
      swirlChannels: 0, swirlChannelWidth_mm: null, chamberDiameter_mm: null,
      chamberDepth_mm: null, inletDiameter_mm: 5.0, orificeGeometry: "elliptical", orificeCount: 1,
      bodyMaterial: "316L Stainless Steel", sealMaterial: "Buna-N",
      springMaterial: null, insertMaterial: null,
      flowPathDescription: "Inlet → hemispherical plenum → converging elliptical slot → flat sheet breakup",
      internalVolume_uL: 250, dosage_uL: null, surfaceFinish_Ra_um: 1.6,
    },
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
    manufacturer: "Spencer",
    productCategory: "nozzle",
    technicalDesign: {
      bodyDiameter_mm: 12, bodyLength_mm: 22, connectionType: "Press-fit 3.9mm stem",
      stemDiameter_mm: 3.9, neckSize_mm: null, weight_g: 8,
      swirlChannels: 6, swirlChannelWidth_mm: 0.15, chamberDiameter_mm: 2.8,
      chamberDepth_mm: 1.8, inletDiameter_mm: 2.0, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "POM (Delrin)", sealMaterial: "Buna-N",
      springMaterial: "302 Stainless Steel", insertMaterial: "POM (Delrin)",
      flowPathDescription: "Stem inlet → 6-channel micro-swirl insert → vortex chamber → micro-orifice exit",
      internalVolume_uL: 35, dosage_uL: null, surfaceFinish_Ra_um: 0.2,
    },
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
    manufacturer: "Spencer",
    productCategory: "nozzle",
    technicalDesign: {
      bodyDiameter_mm: 22, bodyLength_mm: 35, connectionType: "1/4\" BSP Female",
      stemDiameter_mm: null, neckSize_mm: null, weight_g: 45,
      swirlChannels: 0, swirlChannelWidth_mm: null, chamberDiameter_mm: null,
      chamberDepth_mm: null, inletDiameter_mm: 6.0, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "316L Stainless Steel", sealMaterial: "PTFE",
      springMaterial: null, insertMaterial: "Tungsten Carbide",
      flowPathDescription: "Inlet → straight bore contraction → polished converging nozzle → coherent jet exit",
      internalVolume_uL: 400, dosage_uL: null, surfaceFinish_Ra_um: 0.1,
    },
  },
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
    manufacturer: "Spencer",
    productCategory: "nozzle",
    technicalDesign: {
      bodyDiameter_mm: 28, bodyLength_mm: 48, connectionType: "1/4\" BSP Female (liquid) + 1/4\" BSP Female (air)",
      stemDiameter_mm: null, neckSize_mm: null, weight_g: 85,
      swirlChannels: 2, swirlChannelWidth_mm: 0.5, chamberDiameter_mm: 4.0,
      chamberDepth_mm: 3.0, inletDiameter_mm: 3.5, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "316L Stainless Steel", sealMaterial: "PTFE",
      springMaterial: null, insertMaterial: "316L Stainless Steel",
      flowPathDescription: "Liquid inlet → central tube → liquid orifice → annular air sheath from converging air cap → external mix atomization",
      internalVolume_uL: 300, dosage_uL: null, surfaceFinish_Ra_um: 0.8,
    },
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
    manufacturer: "Spencer",
    productCategory: "nozzle",
    technicalDesign: {
      bodyDiameter_mm: 24, bodyLength_mm: 30, connectionType: "3/4\" BSP Male",
      stemDiameter_mm: null, neckSize_mm: null, weight_g: 55,
      swirlChannels: 0, swirlChannelWidth_mm: null, chamberDiameter_mm: null,
      chamberDepth_mm: null, inletDiameter_mm: 12.0, orificeGeometry: "annular", orificeCount: 1,
      bodyMaterial: "316L Stainless Steel", sealMaterial: "N/A (one-piece)",
      springMaterial: null, insertMaterial: null,
      flowPathDescription: "Inlet → open helical ramp (no enclosed passages) → centrifugal film along outer body → full cone sheet breakup at exit edge",
      internalVolume_uL: 800, dosage_uL: null, surfaceFinish_Ra_um: 3.2,
    },
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
    manufacturer: "Spencer",
    productCategory: "nozzle",
    technicalDesign: {
      bodyDiameter_mm: 20, bodyLength_mm: 25, connectionType: "1/4\" BSP Male",
      stemDiameter_mm: null, neckSize_mm: null, weight_g: 30,
      swirlChannels: 0, swirlChannelWidth_mm: null, chamberDiameter_mm: null,
      chamberDepth_mm: null, inletDiameter_mm: 6.0, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "316L Stainless Steel", sealMaterial: "N/A (one-piece)",
      springMaterial: null, insertMaterial: null,
      flowPathDescription: "Inlet → straight bore → round exit orifice → impact on angled deflection plate → ultra-wide flat sheet",
      internalVolume_uL: 200, dosage_uL: null, surfaceFinish_Ra_um: 1.6,
    },
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
    manufacturer: "Spencer",
    productCategory: "nozzle",
    technicalDesign: {
      bodyDiameter_mm: 25, bodyLength_mm: 95, connectionType: "Luer-Lock female + BNC electrical",
      stemDiameter_mm: null, neckSize_mm: null, weight_g: 62,
      swirlChannels: 0, swirlChannelWidth_mm: null, chamberDiameter_mm: null,
      chamberDepth_mm: null, inletDiameter_mm: 1.6, orificeGeometry: "mesh", orificeCount: 1,
      bodyMaterial: "Titanium Grade 5 (horn) + 316L housing", sealMaterial: "PTFE",
      springMaterial: null, insertMaterial: "Titanium Grade 5",
      flowPathDescription: "Luer-lock inlet → axial feed tube → liquid film on titanium horn tip → piezo-driven capillary wave breakup at 48 kHz",
      internalVolume_uL: 15, dosage_uL: null, surfaceFinish_Ra_um: 0.05,
    },
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
    manufacturer: "Spencer",
    productCategory: "nozzle",
    technicalDesign: {
      bodyDiameter_mm: 24, bodyLength_mm: 30, connectionType: "1/4\" BSP Female",
      stemDiameter_mm: null, neckSize_mm: null, weight_g: 38,
      swirlChannels: 8, swirlChannelWidth_mm: 0.2, chamberDiameter_mm: 3.0,
      chamberDepth_mm: 2.0, inletDiameter_mm: 4.0, orificeGeometry: "multi_hole", orificeCount: 8,
      bodyMaterial: "316L Stainless Steel", sealMaterial: "FKM (Viton)",
      springMaterial: null, insertMaterial: "ceramic",
      flowPathDescription: "Inlet → central plenum → 8 radial micro-swirl inserts → 8 individual round orifices (Ø0.4mm each) in ring pattern",
      internalVolume_uL: 220, dosage_uL: null, surfaceFinish_Ra_um: 0.4,
    },
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
    manufacturer: "Spencer",
    productCategory: "nozzle",
    technicalDesign: {
      bodyDiameter_mm: 22, bodyLength_mm: 45, connectionType: "1/4\" BSP Female",
      stemDiameter_mm: null, neckSize_mm: null, weight_g: 52,
      swirlChannels: 4, swirlChannelWidth_mm: 0.5, chamberDiameter_mm: 5.0,
      chamberDepth_mm: 5.0, inletDiameter_mm: 4.0, orificeGeometry: "annular", orificeCount: 1,
      bodyMaterial: "316L Stainless Steel", sealMaterial: "PTFE packing",
      springMaterial: "302 Stainless Steel", insertMaterial: "316L Stainless Steel (needle)",
      flowPathDescription: "Inlet → swirl chamber → annular gap between conical needle and seat (adjustable via external collar) → variable cone exit",
      internalVolume_uL: 350, dosage_uL: null, surfaceFinish_Ra_um: 0.4,
    },
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
    manufacturer: "Spencer",
    productCategory: "nozzle",
    technicalDesign: {
      bodyDiameter_mm: 30, bodyLength_mm: 38, connectionType: "2× 1/8\" BSP Female",
      stemDiameter_mm: null, neckSize_mm: null, weight_g: 65,
      swirlChannels: 0, swirlChannelWidth_mm: null, chamberDiameter_mm: null,
      chamberDepth_mm: null, inletDiameter_mm: 2.5, orificeGeometry: "round", orificeCount: 2,
      bodyMaterial: "316L Stainless Steel", sealMaterial: "PTFE",
      springMaterial: null, insertMaterial: "Ruby orifice jewels",
      flowPathDescription: "2× separate inlets → 2× converging bores at 45° → impingement point → planar sheet breakup → wide flat spray",
      internalVolume_uL: 80, dosage_uL: null, surfaceFinish_Ra_um: 0.1,
    },
  },
];

// -----------------------------------------------------------
// COSTER GROUP Product Range
// Actuators, Aerosol Valves, Spray Pumps, Perfumery Pumps
// -----------------------------------------------------------
const COSTER_ACTUATORS: Actuator[] = [
  // ---- Aerosol Actuators ----
  {
    id: "CST-ORB-001",
    name: "Orbit Spray Cap",
    type: "full_cone",
    orificeDiameter_mm: 0.5,
    swirlChamberAngle_deg: 50,
    maxPressure_bar: 12,
    materialCompatibility: ["aqueous", "alcohol", "silicone", "hydrocarbon"],
    typicalApplications: ["Deodorant spray", "Air freshener", "Household spray", "Anti-perspirant"],
    industries: ["personal_care", "household", "cosmetics"],
    price_usd: 0.12,
    leadTime_days: 21,
    sku: "CST-V20-ORBIT",
    description: "Two-piece spray cap with universal design, ideal for personal care and household aerosols. Available in PCR resin. Fits necked-in tinplate cans and transfer aluminium cans. Optional tamper-tag guarantee seal on rear finger pad.",
    manufacturer: "Coster",
    productCategory: "aerosol_actuator",
    technicalDesign: {
      bodyDiameter_mm: 34, bodyLength_mm: 42, connectionType: "1\" male valve snap-on",
      stemDiameter_mm: 3.0, neckSize_mm: null, weight_g: 5.2,
      swirlChannels: 4, swirlChannelWidth_mm: 0.12, chamberDiameter_mm: 2.2,
      chamberDepth_mm: 1.0, inletDiameter_mm: 2.0, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP (Polypropylene)", sealMaterial: "Integrated PP gasket",
      springMaterial: null, insertMaterial: "POM (Delrin)",
      flowPathDescription: "Valve stem → actuator bore → POM swirl insert (4-channel tangential) → vortex chamber → round orifice",
      internalVolume_uL: 22, dosage_uL: null, surfaceFinish_Ra_um: null,
    },
  },
  {
    id: "CST-MIL-002",
    name: "Milano Actuator",
    type: "fine_mist",
    orificeDiameter_mm: 0.45,
    swirlChamberAngle_deg: 40,
    maxPressure_bar: 12,
    materialCompatibility: ["aqueous", "alcohol", "silicone"],
    typicalApplications: ["Deodorant spray", "Body spray", "Anti-perspirant", "Cosmetic spray"],
    industries: ["personal_care", "cosmetics"],
    price_usd: 0.15,
    leadTime_days: 21,
    sku: "CST-V05-MILANO",
    description: "Unisex-design actuator suitable for liquids, foams, and gels. For 1\" male valves and BOVs. Available in short and long skirt variants. Milano Eco variant uses mono-material PP with V06.217 insert for recyclability.",
    manufacturer: "Coster",
    productCategory: "aerosol_actuator",
    technicalDesign: {
      bodyDiameter_mm: 34, bodyLength_mm: 38, connectionType: "1\" male valve snap-on",
      stemDiameter_mm: 3.0, neckSize_mm: null, weight_g: 4.8,
      swirlChannels: 4, swirlChannelWidth_mm: 0.1, chamberDiameter_mm: 2.0,
      chamberDepth_mm: 0.8, inletDiameter_mm: 2.0, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP (Polypropylene)", sealMaterial: "Integrated PP",
      springMaterial: null, insertMaterial: "POM (or PP for Eco variant)",
      flowPathDescription: "Valve stem → actuator channel → swirl insert → vortex chamber → fine mist orifice",
      internalVolume_uL: 18, dosage_uL: null, surfaceFinish_Ra_um: null,
    },
  },
  {
    id: "CST-CAP-003",
    name: "Capri Actuator with Overcap",
    type: "fine_mist",
    orificeDiameter_mm: 0.4,
    swirlChamberAngle_deg: 35,
    maxPressure_bar: 12,
    materialCompatibility: ["aqueous", "alcohol", "silicone"],
    typicalApplications: ["Deodorant", "Anti-perspirant", "Cosmetics", "Sunscreen", "Household"],
    industries: ["personal_care", "cosmetics", "pharmaceutical", "household"],
    price_usd: 0.18,
    leadTime_days: 21,
    sku: "CST-V20-CAPRI",
    description: "Two-piece spray actuator with integrated overcap. Finger pad with integrated spray channel fitted within the collar. Designed for a broad set of applications including DEO, AP, cosmetics, pharmaceuticals, sunscreens and household goods. Also available with directional insert.",
    manufacturer: "Coster",
    productCategory: "aerosol_actuator",
    technicalDesign: {
      bodyDiameter_mm: 38, bodyLength_mm: 55, connectionType: "1\" male valve snap-on",
      stemDiameter_mm: 3.0, neckSize_mm: null, weight_g: 8.5,
      swirlChannels: 4, swirlChannelWidth_mm: 0.1, chamberDiameter_mm: 2.0,
      chamberDepth_mm: 0.9, inletDiameter_mm: 2.0, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP (Polypropylene)", sealMaterial: "Integrated PP",
      springMaterial: null, insertMaterial: "POM (directional or standard)",
      flowPathDescription: "Valve stem → integrated finger-pad spray channel → swirl insert → vortex chamber → orifice. Overcap snaps over collar.",
      internalVolume_uL: 20, dosage_uL: null, surfaceFinish_Ra_um: null,
    },
  },
  {
    id: "CST-HYD-004",
    name: "Hydra Insecticide Spray Cap",
    type: "jet_stream",
    orificeDiameter_mm: 0.7,
    swirlChamberAngle_deg: 0,
    maxPressure_bar: 12,
    materialCompatibility: ["aqueous", "hydrocarbon", "alcohol"],
    typicalApplications: ["Insecticide spray", "Household spray", "Air freshener", "Cleaning spray"],
    industries: ["household", "agriculture"],
    price_usd: 0.10,
    leadTime_days: 21,
    sku: "CST-V20-HYDRA",
    description: "Spray cap specifically designed for insecticide and household products. Directional spray variant with Ø0.7mm orifice for focused jet delivery. Suitable for necked-in Ø57mm tinplate cans. Also available with swirl insert for AP and diffuse spray patterns.",
    manufacturer: "Coster",
    productCategory: "aerosol_actuator",
    technicalDesign: {
      bodyDiameter_mm: 40, bodyLength_mm: 35, connectionType: "1\" male valve snap-on",
      stemDiameter_mm: 3.0, neckSize_mm: null, weight_g: 6.0,
      swirlChannels: 0, swirlChannelWidth_mm: null, chamberDiameter_mm: null,
      chamberDepth_mm: null, inletDiameter_mm: 2.5, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP (Polypropylene)", sealMaterial: "Integrated PP",
      springMaterial: null, insertMaterial: null,
      flowPathDescription: "Valve stem → straight actuator bore → directional orifice (no swirl) for focused insecticide jet",
      internalVolume_uL: 25, dosage_uL: null, surfaceFinish_Ra_um: null,
    },
  },
  {
    id: "CST-SAL-005",
    name: "SALUS Nasal Actuator",
    type: "hollow_cone",
    orificeDiameter_mm: 0.35,
    swirlChamberAngle_deg: 25,
    maxPressure_bar: 8,
    materialCompatibility: ["aqueous"],
    typicalApplications: ["Nasal saline spray", "Nasal pharmaceutical", "Paediatric nasal"],
    industries: ["pharmaceutical"],
    price_usd: 0.35,
    leadTime_days: 30,
    sku: "CST-SALUS",
    description: "Ergonomic nasal actuator for saline and pharmaceutical solutions. Shaped for easy delivery including children and elderly. Suitable for BOVs and 1\" valves with Ø3.9mm stem. Available in male valve version (for BOVs/KV) and female valve version (for NKWBFU).",
    manufacturer: "Coster",
    productCategory: "aerosol_actuator",
    technicalDesign: {
      bodyDiameter_mm: 18, bodyLength_mm: 65, connectionType: "1\" valve Ø3.9mm stem press-fit",
      stemDiameter_mm: 3.9, neckSize_mm: null, weight_g: 4.5,
      swirlChannels: 3, swirlChannelWidth_mm: 0.08, chamberDiameter_mm: 1.8,
      chamberDepth_mm: 0.6, inletDiameter_mm: 1.5, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP (medical grade)", sealMaterial: "Silicone (medical grade)",
      springMaterial: null, insertMaterial: "POM (Delrin)",
      flowPathDescription: "Valve stem → nasal tip bore → 3-channel micro-swirl insert → gentle hollow cone nasal mist",
      internalVolume_uL: 12, dosage_uL: null, surfaceFinish_Ra_um: null,
    },
  },
  {
    id: "CST-SFR-006",
    name: "Sfera Foam/Gel Spray Cap",
    type: "full_cone",
    orificeDiameter_mm: 1.2,
    swirlChamberAngle_deg: 0,
    maxPressure_bar: 8,
    materialCompatibility: ["aqueous", "emulsion"],
    typicalApplications: ["Shaving foam", "Hair mousse", "Topical foam", "Gel dispensing"],
    industries: ["personal_care", "cosmetics", "pharmaceutical"],
    price_usd: 0.14,
    leadTime_days: 21,
    sku: "CST-V20-SFERA",
    description: "Efficient spray cap available in foam and gel versions. Gel version includes protection overcap V20.103. Suitable for necked-in Ø52mm tinplate cans and transfer Ø53mm aluminium cans with BOV valves.",
    manufacturer: "Coster",
    productCategory: "aerosol_actuator",
    technicalDesign: {
      bodyDiameter_mm: 42, bodyLength_mm: 45, connectionType: "1\" male valve snap-on / BOV",
      stemDiameter_mm: 3.0, neckSize_mm: null, weight_g: 7.2,
      swirlChannels: 0, swirlChannelWidth_mm: null, chamberDiameter_mm: null,
      chamberDepth_mm: null, inletDiameter_mm: 3.0, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP (Polypropylene)", sealMaterial: "Integrated PP",
      springMaterial: null, insertMaterial: "PP mesh (foam version)",
      flowPathDescription: "Valve stem → expansion chamber → mesh screen (foam) or open bore (gel) → wide orifice exit",
      internalVolume_uL: 45, dosage_uL: null, surfaceFinish_Ra_um: null,
    },
  },
  // ---- Aerosol Valves ----
  {
    id: "CST-NKE-007",
    name: "NKE Standard Eurostem Valve",
    type: "fine_mist",
    orificeDiameter_mm: 0.5,
    swirlChamberAngle_deg: 30,
    maxPressure_bar: 12,
    materialCompatibility: ["aqueous", "alcohol", "hydrocarbon", "silicone"],
    typicalApplications: ["Personal care aerosol", "Deodorant", "Hair spray", "Household spray"],
    industries: ["personal_care", "household", "cosmetics"],
    price_usd: 0.08,
    leadTime_days: 21,
    sku: "CST-NKE",
    description: "1-inch standard aerosol valve with Eurostem and reduced stroke spring. Housing without additional gas orifice (VPH). The Eurostem provides industry-standard compatibility with all major actuator brands. Upright use only.",
    manufacturer: "Coster",
    productCategory: "aerosol_valve",
    technicalDesign: {
      bodyDiameter_mm: 25.4, bodyLength_mm: 28, connectionType: "1\" crimp-on (FEA standard)",
      stemDiameter_mm: 3.0, neckSize_mm: null, weight_g: 3.8,
      swirlChannels: 0, swirlChannelWidth_mm: null, chamberDiameter_mm: null,
      chamberDepth_mm: null, inletDiameter_mm: 2.5, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP housing + tinplate mounting cup", sealMaterial: "Buna-N stem gasket",
      springMaterial: "302 Stainless Steel", insertMaterial: "POM stem tip",
      flowPathDescription: "Dip tube → valve housing inlet → stem gasket seal (closed) → actuate: stem depresses, gasket opens → product flows through stem bore to actuator",
      internalVolume_uL: 60, dosage_uL: null, surfaceFinish_Ra_um: null,
    },
  },
  {
    id: "CST-RTRA-008",
    name: "RTRA Tilt-Action Valve",
    type: "fine_mist",
    orificeDiameter_mm: 0.45,
    swirlChamberAngle_deg: 30,
    maxPressure_bar: 12,
    materialCompatibility: ["aqueous", "alcohol", "hydrocarbon"],
    typicalApplications: ["Water-based aerosol", "Air freshener", "LPG-propelled spray", "Flammable product spray"],
    industries: ["household", "personal_care"],
    price_usd: 0.09,
    leadTime_days: 21,
    sku: "CST-RTRA",
    description: "Tilt-action aerosol valve with fast-filling housing. VPH (vapour phase hole) and RTP (return to product) orifices can be sized to application requirements. Optimised for water-based products with LPG propellant. The precise orifice sizing guarantees fine, uniform atomisation that reduces flammability.",
    manufacturer: "Coster",
    productCategory: "aerosol_valve",
    technicalDesign: {
      bodyDiameter_mm: 25.4, bodyLength_mm: 30, connectionType: "1\" crimp-on (FEA standard)",
      stemDiameter_mm: 3.0, neckSize_mm: null, weight_g: 4.2,
      swirlChannels: 0, swirlChannelWidth_mm: null, chamberDiameter_mm: null,
      chamberDepth_mm: null, inletDiameter_mm: 2.5, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP housing + tinplate mounting cup", sealMaterial: "Buna-N stem gasket + housing gasket",
      springMaterial: "302 Stainless Steel", insertMaterial: "POM stem tip",
      flowPathDescription: "Dip tube → housing (with VPH gas orifice and RTP product orifice) → tilt stem to open gasket seal → product + propellant mix → exit through stem bore",
      internalVolume_uL: 65, dosage_uL: null, surfaceFinish_Ra_um: null,
    },
  },
  {
    id: "CST-BOV-009",
    name: "NKLCU Bag-on-Valve",
    type: "full_cone",
    orificeDiameter_mm: 0.6,
    swirlChamberAngle_deg: 30,
    maxPressure_bar: 10,
    materialCompatibility: ["aqueous", "alcohol", "emulsion", "silicone"],
    typicalApplications: ["Pharmaceutical spray", "Wound care", "Cosmetic spray", "Food spray", "Sunscreen"],
    industries: ["pharmaceutical", "cosmetics", "food_beverage", "personal_care"],
    price_usd: 0.45,
    leadTime_days: 28,
    sku: "CST-NKLCU-BOV",
    description: "Bag-on-valve system separating product from propellant. Laminated bag (PE/Al/PE) ensures product purity. All materials FDA food-contact compliant. Available in multiple flow rates for sprays, gels, and foams. Compressed air or nitrogen propellant — no VOC, no flammability.",
    manufacturer: "Coster",
    productCategory: "aerosol_valve",
    technicalDesign: {
      bodyDiameter_mm: 25.4, bodyLength_mm: 35, connectionType: "1\" crimp-on (FEA standard)",
      stemDiameter_mm: 3.0, neckSize_mm: null, weight_g: 12.0,
      swirlChannels: 0, swirlChannelWidth_mm: null, chamberDiameter_mm: null,
      chamberDepth_mm: null, inletDiameter_mm: 3.0, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP housing + PE/Al/PE laminated bag", sealMaterial: "Silicone gasket (FDA)",
      springMaterial: "302 Stainless Steel", insertMaterial: "POM stem",
      flowPathDescription: "Product sealed in laminated bag → compressed air between bag and can wall → bag compression forces product through valve stem → actuator",
      internalVolume_uL: 80, dosage_uL: null, surfaceFinish_Ra_um: null,
    },
  },
  // ---- Spray Pumps ----
  {
    id: "CST-MSP-010",
    name: "MSP Fine Mist Spray Pump",
    type: "fine_mist",
    orificeDiameter_mm: 0.3,
    swirlChamberAngle_deg: 35,
    maxPressure_bar: 4,
    materialCompatibility: ["aqueous", "alcohol"],
    typicalApplications: ["Deodorant pump spray", "Hair spray", "Cosmetic mist", "Pharmaceutical nasal"],
    industries: ["personal_care", "cosmetics", "pharmaceutical"],
    price_usd: 0.22,
    leadTime_days: 21,
    sku: "CST-MSP",
    description: "Mono Spring Pre-compressed (MSP) fine mist spray pump. Combines high-quality spray with accurate dosing and fast priming. Superior pre-compression technology ensures consistent mist from first actuation. Available in dosages: 50, 80, 100, 130, 150 µL.",
    manufacturer: "Coster",
    productCategory: "spray_pump",
    technicalDesign: {
      bodyDiameter_mm: 20, bodyLength_mm: 50, connectionType: "Crimp-on 20mm",
      stemDiameter_mm: null, neckSize_mm: 20, weight_g: 6.5,
      swirlChannels: 4, swirlChannelWidth_mm: 0.08, chamberDiameter_mm: 1.6,
      chamberDepth_mm: 0.5, inletDiameter_mm: 1.2, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP (Polypropylene)", sealMaterial: "PE piston seal",
      springMaterial: "302 Stainless Steel", insertMaterial: "POM swirl insert",
      flowPathDescription: "Dip tube → one-way ball valve → piston chamber (pre-compression) → spring-loaded piston → swirl insert → fine mist orifice. Pre-compression ensures atomisation threshold is met before release.",
      internalVolume_uL: 40, dosage_uL: 100, surfaceFinish_Ra_um: null,
    },
  },
  {
    id: "CST-GMSP-011",
    name: "GMSP Metal-Free Spray Pump",
    type: "fine_mist",
    orificeDiameter_mm: 0.28,
    swirlChamberAngle_deg: 35,
    maxPressure_bar: 4,
    materialCompatibility: ["aqueous", "alcohol", "emulsion"],
    typicalApplications: ["Pharmaceutical spray", "Saline nasal spray", "Ophthalmic mist", "Cosmetic mist"],
    industries: ["pharmaceutical", "cosmetics"],
    price_usd: 0.38,
    leadTime_days: 28,
    sku: "CST-GMSP",
    description: "Metal-free variant of the MSP pump, designed for pharmaceutical and sensitive cosmetic applications. Glass ball valve, all-PP/PE fluid path. Compatible with preservative-free formulations. Clean-room assembled. Dosages: 50, 100 µL.",
    manufacturer: "Coster",
    productCategory: "spray_pump",
    technicalDesign: {
      bodyDiameter_mm: 20, bodyLength_mm: 52, connectionType: "Crimp-on 20mm",
      stemDiameter_mm: null, neckSize_mm: 20, weight_g: 6.0,
      swirlChannels: 4, swirlChannelWidth_mm: 0.07, chamberDiameter_mm: 1.4,
      chamberDepth_mm: 0.5, inletDiameter_mm: 1.0, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP (metal-free)", sealMaterial: "PE piston seal",
      springMaterial: "PP (plastic spring)", insertMaterial: "POM swirl insert",
      flowPathDescription: "Dip tube → glass ball check valve → PP piston chamber → plastic spring pre-compression → swirl insert → micro-orifice. Entire fluid path is metal-free.",
      internalVolume_uL: 35, dosage_uL: 50, surfaceFinish_Ra_um: null,
    },
  },
  {
    id: "CST-NSCP-012",
    name: "NSCP Dispensing Pump",
    type: "jet_stream",
    orificeDiameter_mm: 2.5,
    swirlChamberAngle_deg: 0,
    maxPressure_bar: 2,
    materialCompatibility: ["aqueous", "emulsion", "glycol"],
    typicalApplications: ["Liquid soap", "Hand sanitizer", "Lotion dispensing", "Shampoo"],
    industries: ["personal_care", "household"],
    price_usd: 0.28,
    leadTime_days: 21,
    sku: "CST-NSCP",
    description: "New Soap Coster Pump — latest-generation dispensing pump with metal-free pathway. Best-in-class anti-leakage performance, specifically designed for high-viscosity products. Amazon ISTA-6 certified for e-commerce shipment. Dosages: 200, 300 µL.",
    manufacturer: "Coster",
    productCategory: "dispenser",
    technicalDesign: {
      bodyDiameter_mm: 28, bodyLength_mm: 110, connectionType: "28/410 threaded neck",
      stemDiameter_mm: null, neckSize_mm: 28, weight_g: 18.0,
      swirlChannels: 0, swirlChannelWidth_mm: null, chamberDiameter_mm: null,
      chamberDepth_mm: null, inletDiameter_mm: 5.0, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP (metal-free)", sealMaterial: "PE piston + PP spring",
      springMaterial: "PP (plastic spring)", insertMaterial: null,
      flowPathDescription: "Dip tube → one-way valve → piston chamber → pump down: fills chamber. Pump up: piston compresses, opens exit valve → product dispenses through nozzle tip. Lock-down closure for shipping.",
      internalVolume_uL: 300, dosage_uL: 300, surfaceFinish_Ra_um: null,
    },
  },
  // ---- Perfumery Pumps ----
  {
    id: "CST-CPS-013",
    name: "CPS Crimp Perfumery Pump",
    type: "fine_mist",
    orificeDiameter_mm: 0.25,
    swirlChamberAngle_deg: 40,
    maxPressure_bar: 5,
    materialCompatibility: ["alcohol", "aqueous"],
    typicalApplications: ["Mass-market fragrance", "Eau de toilette", "Body mist", "Room spray"],
    industries: ["cosmetics", "personal_care", "household"],
    price_usd: 0.18,
    leadTime_days: 21,
    sku: "CST-CPS",
    description: "Long-running crimp-on perfumery pump with compact body. Simple conception with minimal components for cost-effectiveness and reliability. Plastic or metal-finish actuators for full customisation. Neck sizes: 13, 15, 17, 18, 20mm. Dosage: 70 µL.",
    manufacturer: "Coster",
    productCategory: "perfumery_pump",
    technicalDesign: {
      bodyDiameter_mm: 15, bodyLength_mm: 35, connectionType: "Crimp-on (13/15/17/18/20mm)",
      stemDiameter_mm: null, neckSize_mm: 15, weight_g: 3.5,
      swirlChannels: 4, swirlChannelWidth_mm: 0.06, chamberDiameter_mm: 1.2,
      chamberDepth_mm: 0.4, inletDiameter_mm: 0.8, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP (Polypropylene)", sealMaterial: "PE piston seal",
      springMaterial: "302 Stainless Steel", insertMaterial: "POM micro-swirl",
      flowPathDescription: "Dip tube → ball valve → piston chamber → spring pre-compression → 4-channel micro-swirl insert → ultra-fine perfume mist. Compact body fits small fragrance bottles.",
      internalVolume_uL: 25, dosage_uL: 70, surfaceFinish_Ra_um: null,
    },
  },
  {
    id: "CST-CPR-014",
    name: "CPR Low-Profile Perfumery Pump",
    type: "fine_mist",
    orificeDiameter_mm: 0.22,
    swirlChamberAngle_deg: 45,
    maxPressure_bar: 5,
    materialCompatibility: ["alcohol", "aqueous"],
    typicalApplications: ["Mid-market fragrance", "Designer perfume", "Fine fragrance", "Eau de parfum"],
    industries: ["cosmetics", "personal_care"],
    price_usd: 0.25,
    leadTime_days: 21,
    sku: "CST-CPR",
    description: "Low-profile crimp perfumery pump delivering selective-quality spray for mid-market positioning. Doses of 70 µL sprayed at angles between 30° and 80°. Available in 13, 15, 18, 20mm neck sizes. Small body guarantees compact design with plastic or metal-finish actuators.",
    manufacturer: "Coster",
    productCategory: "perfumery_pump",
    technicalDesign: {
      bodyDiameter_mm: 14, bodyLength_mm: 28, connectionType: "Crimp-on (13/15/18/20mm)",
      stemDiameter_mm: null, neckSize_mm: 15, weight_g: 3.0,
      swirlChannels: 4, swirlChannelWidth_mm: 0.05, chamberDiameter_mm: 1.0,
      chamberDepth_mm: 0.35, inletDiameter_mm: 0.8, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP (Polypropylene)", sealMaterial: "PE piston seal",
      springMaterial: "302 Stainless Steel", insertMaterial: "POM micro-swirl",
      flowPathDescription: "Dip tube → ball valve → low-profile piston chamber → spring pre-compression → precision micro-swirl → 30-80° adjustable spray angle. Reduced height for flush-mount bottle caps.",
      internalVolume_uL: 20, dosage_uL: 70, surfaceFinish_Ra_um: null,
    },
  },
  {
    id: "CST-GCPS-015",
    name: "GCPS Threaded Perfumery Pump",
    type: "fine_mist",
    orificeDiameter_mm: 0.25,
    swirlChamberAngle_deg: 40,
    maxPressure_bar: 5,
    materialCompatibility: ["alcohol", "aqueous"],
    typicalApplications: ["Mass-market fragrance", "Travel-size perfume", "Gift sets", "Sampler spray"],
    industries: ["cosmetics", "personal_care"],
    price_usd: 0.16,
    leadTime_days: 21,
    sku: "CST-GCPS",
    description: "Threaded-closure variant of the CPS perfumery pump for tool-free assembly. 20/400 G.C.M.I. thread standard. Simple conception with minimal components. Preferred for mass market where crimp machinery is unavailable. Dosage: 70 µL.",
    manufacturer: "Coster",
    productCategory: "perfumery_pump",
    technicalDesign: {
      bodyDiameter_mm: 16, bodyLength_mm: 38, connectionType: "20/400 G.C.M.I. threaded",
      stemDiameter_mm: null, neckSize_mm: 20, weight_g: 4.0,
      swirlChannels: 4, swirlChannelWidth_mm: 0.06, chamberDiameter_mm: 1.2,
      chamberDepth_mm: 0.4, inletDiameter_mm: 0.8, orificeGeometry: "round", orificeCount: 1,
      bodyMaterial: "PP (Polypropylene)", sealMaterial: "PE piston seal",
      springMaterial: "302 Stainless Steel", insertMaterial: "POM micro-swirl",
      flowPathDescription: "Dip tube → ball valve → piston chamber → spring pre-compression → micro-swirl → fine mist orifice. Screw-on collar for tool-free bottle assembly.",
      internalVolume_uL: 25, dosage_uL: 70, surfaceFinish_Ra_um: null,
    },
  },
];

// -----------------------------------------------------------
// Combined catalog
// -----------------------------------------------------------
export const ACTUATORS: Actuator[] = [...SPENCER_ACTUATORS, ...COSTER_ACTUATORS];

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
  household: "Household",
  personal_care: "Personal Care",
};

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  nozzle: "Industrial Nozzle",
  aerosol_actuator: "Aerosol Actuator",
  aerosol_valve: "Aerosol Valve",
  spray_pump: "Spray Pump",
  perfumery_pump: "Perfumery Pump",
  dispenser: "Dispenser",
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
