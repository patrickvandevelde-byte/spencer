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

  // Valve/pump stem interface
  stemProfile?: "male" | "female" | null;
  stemExternalDiameter_mm?: number;
  stemInternalDiameter_mm?: number;
  engagementDepth_mm?: number;

  // Kinematic limits
  actuationForce_N?: number;          // Max actuation force (ergonomic compliance)
  strokeLength_mm?: number;           // Piston/valve stroke
  returnSpeed_mm_s?: number;          // Valve return speed
  primeStrokes?: number;              // Required actuations to prime

  // Regulatory context
  childResistant?: boolean;           // CR mechanism present
  fdaCompliant?: boolean;             // FDA-approved materials
  cleanroomClass?: "ISO_5" | "ISO_6" | "ISO_7" | "ISO_8" | null;
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

export type RheologyType = "newtonian" | "power_law" | "bingham" | "herschel_bulkley";

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

  // Rheological profile (Non-Newtonian support)
  rheology: RheologyType;
  powerLawK?: number;               // Consistency index (Pa·s^n) — for power_law / herschel_bulkley
  powerLawN?: number;               // Flow behavior index (n<1 shear-thinning, n>1 shear-thickening)
  yieldStress_Pa?: number;          // For bingham / herschel_bulkley

  // Interfacial mechanics
  contactAngle_deg?: number;        // Wetting behavior on common substrates

  // Aerosol / volatile properties
  vaporPressure_kPa?: number;       // At 20°C — critical for propellant interaction
  boilingPoint_C?: number;

  // Particulate / suspension profile
  maxParticleSize_um?: number;      // Largest particle diameter — for clogging assessment
  suspensionConcentration_pct?: number; // Solid content by weight (%)
}

export type AtomizationRegime =
  | "Rayleigh"        // Oh > 1, low We — dripping / large drops
  | "Wind-induced"    // Oh < 1, moderate We — aerodynamic breakup
  | "Wind-stressed"   // Oh < 1, high We — ligament formation
  | "Atomization";    // Oh < 1, very high We — full atomization

export type ToolingRecommendation = "fdm_3d_print" | "soft_tool" | "hardened_steel";

export interface DropletDistribution {
  Dv10_um: number;   // 10% of volume below this size
  Dv50_um: number;   // Median (SMD)
  Dv90_um: number;   // 90% of volume below this size
  span: number;       // (Dv90 - Dv10) / Dv50 — polydispersity
}

export interface ToolingSpec {
  recommendation: ToolingRecommendation;
  cavityCount: number;
  estimatedLeadTime_days: number;
  estimatedToolCost_usd: number;
  costPerUnit_usd: number;
}

export interface PredictionResult {
  actuatorId: string;
  fluidId: string;
  coneAngle_deg: number;
  dropletSizeDv50_um: number;
  dropletDistribution: DropletDistribution;
  flowRate_mL_min: number;
  deliveryRate_g_s: number;       // Mass flow rate
  sprayWidth_mm_at_100mm: number;
  compatibilityScore: number;     // 0-100
  pressureRequired_bar: number;
  reynoldsNumber: number;
  weberNumber: number;
  ohnesorgeNumber: number;
  atomizationRegime: AtomizationRegime;
  velocityExit_m_s: number;
  safetyWarnings: string[];

  // Extended outputs from spec
  cloggingRisk: "none" | "low" | "moderate" | "high";
  apparentViscosity_cP: number;   // For non-Newtonian fluids at operating shear rate
  materialStress: {
    swellingRisk: boolean;
    stressCrackingRisk: boolean;
    leachingRisk: boolean;
  };
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
    rheology: "newtonian",
    contactAngle_deg: 20,
    vaporPressure_kPa: 2.34,
    boilingPoint_C: 100,
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
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
    rheology: "newtonian",
  },

  // ---- Non-Newtonian Fluids (5) ----
  {
    id: "FLD-026",
    name: "Latex Paint (Acrylic, 50% solids)",
    viscosity_cP: 120,
    density_kg_m3: 1200,
    surfaceTension_mN_m: 32.0,
    pH: 8.5,
    solventClass: "emulsion",
    flashPoint_C: null,
    cas: "9003-01-4",
    category: "Coating",
    hazards: ["irritant"],
    ppeRequired: ["goggles", "gloves", "respirator"],
    rheology: "power_law",
    powerLawK: 3.5,
    powerLawN: 0.45,
    maxParticleSize_um: 50,
    suspensionConcentration_pct: 50,
    contactAngle_deg: 35,
  },
  {
    id: "FLD-027",
    name: "Carbomer Gel (0.5%)",
    viscosity_cP: 5000,
    density_kg_m3: 1005,
    surfaceTension_mN_m: 65.0,
    pH: 6.5,
    solventClass: "aqueous",
    flashPoint_C: null,
    cas: "9003-01-4",
    category: "Pharmaceutical Gel",
    hazards: [],
    ppeRequired: ["gloves"],
    rheology: "herschel_bulkley",
    powerLawK: 12.0,
    powerLawN: 0.35,
    yieldStress_Pa: 15.0,
    contactAngle_deg: 25,
  },
  {
    id: "FLD-028",
    name: "Xanthan Gum Solution (1%)",
    viscosity_cP: 800,
    density_kg_m3: 1002,
    surfaceTension_mN_m: 55.0,
    pH: 7.0,
    solventClass: "aqueous",
    flashPoint_C: null,
    cas: "11138-66-2",
    category: "Food Thickener / Stabilizer",
    hazards: [],
    ppeRequired: ["gloves"],
    rheology: "power_law",
    powerLawK: 2.8,
    powerLawN: 0.28,
    contactAngle_deg: 30,
  },
  {
    id: "FLD-029",
    name: "Polyurethane Coating (2K)",
    viscosity_cP: 200,
    density_kg_m3: 1050,
    surfaceTension_mN_m: 30.0,
    pH: 7.0,
    solventClass: "ester",
    flashPoint_C: 27,
    cas: "9009-54-5",
    category: "Industrial Coating",
    hazards: ["flammable", "irritant", "sensitizer"],
    ppeRequired: ["goggles", "gloves", "respirator", "fume_hood"],
    rheology: "power_law",
    powerLawK: 1.2,
    powerLawN: 0.7,
    maxParticleSize_um: 20,
    contactAngle_deg: 40,
  },
  {
    id: "FLD-030",
    name: "Toothpaste Base (Silica)",
    viscosity_cP: 50000,
    density_kg_m3: 1300,
    surfaceTension_mN_m: 40.0,
    pH: 7.0,
    solventClass: "aqueous",
    flashPoint_C: null,
    cas: "14808-60-7",
    category: "Oral Care Base",
    hazards: [],
    ppeRequired: ["gloves"],
    rheology: "bingham",
    yieldStress_Pa: 200,
    maxParticleSize_um: 30,
    suspensionConcentration_pct: 25,
    contactAngle_deg: 50,
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
// Prediction Engine v2: Type-Specific Spray Physics
//
// Each actuator category has fundamentally different atomization
// mechanisms. A swirl pressure nozzle, an air-atomizing nozzle,
// an ultrasonic atomizer, and a metered-dose pump cannot share
// the same model. This engine dispatches to the correct physics
// based on actuator type and uses the actual internal geometry
// (swirl channel count, channel width, chamber dimensions) from
// the technical design specification.
//
// Key correlations:
//   Swirl nozzles:  Lefebvre (1989), Rizk & Lefebvre (1985)
//   Flat fan:       Dombrowski & Johns (1963) sheet breakup
//   Air-atomizing:  Nukiyama & Tanasawa (1939) twin-fluid
//   Ultrasonic:     Lang (1962) capillary wave
//   Pumps/aerosols: Metered-dose spring-piston model
// -----------------------------------------------------------

// Discharge coefficient by actuator type (empirical)
const DISCHARGE_COEFFICIENTS: Record<ActuatorType, number> = {
  full_cone: 0.55,       // Swirl loss reduces Cd
  hollow_cone: 0.45,     // High swirl = more loss, less Cd
  flat_fan: 0.65,        // Elliptical slot, moderate loss
  fine_mist: 0.40,       // Micro-orifice + high swirl = low Cd
  jet_stream: 0.82,      // Straight bore, minimal loss
  air_atomizing: 0.60,   // Moderate — liquid side only
  spiral: 0.70,          // Open passage, low restriction
  deflection: 0.75,      // Similar to jet but with deflection plate loss
  ultrasonic: 0.30,      // Gravity-fed, very low pressure
  multi_orifice: 0.50,   // Split flow across 8 holes
  adjustable_cone: 0.50, // Needle valve partially restricts
  impingement: 0.72,     // Two converging jets, good Cd per orifice
};

// Material interaction warnings: specific chemical attacks on specific materials
const MATERIAL_ATTACKS: Array<{
  solventClass: SolventClass;
  material: string;
  warning: string;
}> = [
  { solventClass: "ketone", material: "POM", warning: "MATERIAL: Ketones (acetone, MEK) attack POM/Delrin — causes swelling and cracking" },
  { solventClass: "ketone", material: "Buna-N", warning: "MATERIAL: Ketones rapidly degrade Buna-N/nitrile seals" },
  { solventClass: "ester", material: "Buna-N", warning: "MATERIAL: Esters degrade Buna-N seals — use FKM or PTFE" },
  { solventClass: "hydrocarbon", material: "EPDM", warning: "MATERIAL: Hydrocarbons swell EPDM seals — use FKM or Buna-N" },
  { solventClass: "silicone", material: "Silicone", warning: "MATERIAL: Silicone fluids dissolve silicone seals — use FKM or PTFE" },
  { solventClass: "caustic", material: "Aluminium", warning: "MATERIAL: Caustic solutions corrode aluminium — use stainless steel" },
  { solventClass: "caustic", material: "Buna-N", warning: "MATERIAL: Strong caustics degrade Buna-N over time — use EPDM" },
];

/**
 * Calculate the geometric swirl number from internal dimensions.
 * S = (π · D_chamber · n · w) / (4 · A_orifice)
 * Higher S → wider cone angle, finer droplets, lower Cd.
 */
function computeSwirlNumber(td: TechnicalDesign, orificeDia_mm: number): number {
  if (td.swirlChannels === 0 || !td.swirlChannelWidth_mm || !td.chamberDiameter_mm) {
    return 0; // No swirl
  }
  const A_orifice = Math.PI * (orificeDia_mm / 2) ** 2; // mm²
  const S =
    (Math.PI * td.chamberDiameter_mm * td.swirlChannels * td.swirlChannelWidth_mm) /
    (4 * A_orifice);
  return S;
}

/**
 * Cone angle from swirl number (Rizk & Lefebvre, 1985):
 *   half-angle ≈ 6 · S^0.5 · (ΔP/ρ)^0.11
 * Returns full cone angle in degrees.
 */
function swirlConeAngle(S: number, deltaP_Pa: number, rho: number, baseAngle_deg: number): number {
  if (S < 0.1) {
    // No meaningful swirl — return narrow jet angle
    return Math.max(5, baseAngle_deg * 0.3);
  }
  const halfAngle_rad = 6 * Math.pow(S, 0.5) * Math.pow(deltaP_Pa / rho, 0.11) * (Math.PI / 180);
  const fullAngle = 2 * halfAngle_rad * (180 / Math.PI);
  // Blend with the nominal design angle (which represents the manufacturer's target)
  return Math.min(150, Math.max(5, 0.4 * fullAngle + 0.6 * baseAngle_deg));
}

/**
 * Swirl-nozzle SMD (Lefebvre, 1989):
 *   SMD = 4.52 · (σ·μ²/(ρ²·ΔP))^0.25 · (t/d)^0.25 + 0.39 · (σ·ρ/(ΔP²))^0.25 · (t/d)^0.25
 * Simplified to dominant first term for pressure atomizers.
 * t = film thickness ≈ d/(2·S) for swirl nozzles.
 */
function swirlDropletSize(
  d_m: number, sigma: number, mu: number, rho: number, deltaP: number, S: number
): number {
  const effectiveS = Math.max(S, 0.3); // Floor to avoid division by zero for low-swirl
  const t = d_m / (2 * effectiveS); // Film thickness estimate
  const term1 = 4.52 * Math.pow((sigma * mu * mu) / (rho * rho * deltaP), 0.25) * Math.pow(t / d_m, 0.25);
  const term2 = 0.39 * Math.pow((sigma * rho) / (deltaP * deltaP), 0.25) * Math.pow(t / d_m, 0.25);
  return term1 + term2; // meters
}

/**
 * Flat fan sheet breakup (Dombrowski & Johns, 1963):
 *   SMD ≈ 1.9 · (σ/(ρ·v²))^(1/3) · (μ·v/σ)^(1/6) · d^(2/3)
 */
function flatFanDropletSize(d_m: number, sigma: number, mu: number, rho: number, v: number): number {
  return 1.9 * Math.pow(sigma / (rho * v * v), 1 / 3) * Math.pow((mu * v) / sigma, 1 / 6) * Math.pow(d_m, 2 / 3);
}

/**
 * Air-atomizing nozzle (Nukiyama & Tanasawa, 1939):
 *   SMD = 0.585·(σ/ρ)^0.5 / v_rel + 597·(μ/(σ·ρ)^0.5)^0.45 · (Q_L/Q_A)^1.5
 * v_rel = relative velocity between air and liquid.
 * Assumes ALR (air-to-liquid ratio) of 0.5 for external mix.
 */
function airAtomizingDropletSize(
  sigma: number, mu: number, rho: number, v_liquid: number, ALR: number
): number {
  const v_air = 100; // Typical compressed air velocity (m/s) at 2-4 bar gauge
  const v_rel = Math.abs(v_air - v_liquid);
  const rho_air = 1.2; // kg/m³
  const term1 = 0.585 * Math.sqrt(sigma / rho) / Math.max(v_rel, 1);
  const term2 = 597 * Math.pow(mu / Math.sqrt(sigma * rho), 0.45) * Math.pow(1 / Math.max(ALR, 0.1), 1.5);
  return term1 + term2; // meters
}

/**
 * Ultrasonic atomizer (Lang, 1962):
 *   D = 0.34 · (8·π·σ / (ρ·f²))^(1/3)
 * f = excitation frequency (48 kHz for our ultrasonic nozzle).
 */
function ultrasonicDropletSize(sigma: number, rho: number, freq_Hz: number): number {
  return 0.34 * Math.pow((8 * Math.PI * sigma) / (rho * freq_Hz * freq_Hz), 1 / 3);
}

/**
 * Metered-dose pump model:
 * Pumps don't spray continuously — they deliver a fixed volume per actuation.
 * The spring drives the piston, which pre-compresses the fluid above the
 * swirl insert's critical atomization pressure before releasing it.
 * Flow rate is expressed as µL/actuation rather than mL/min.
 */
function pumpFlowModel(td: TechnicalDesign, pressure_bar: number): {
  dosage_uL: number;
  effectivePressure_bar: number;
} {
  const dosage = td.dosage_uL || 100;
  // Pre-compression pumps have a built-in pressure (typically 2-4 bar)
  // Operating pressure input is less relevant — the spring sets it
  const springPressure = td.springMaterial ? 3.0 : 1.5; // Stainless spring → higher force
  const effectivePressure = Math.max(springPressure, pressure_bar);
  return { dosage_uL: dosage, effectivePressure_bar: effectivePressure };
}

/**
 * Compute apparent viscosity for non-Newtonian fluids at a given shear rate.
 * - Newtonian: constant viscosity
 * - Power-law: μ_app = K · γ̇^(n-1)
 * - Bingham: μ_app = τ_y/γ̇ + μ_p
 * - Herschel-Bulkley: μ_app = τ_y/γ̇ + K · γ̇^(n-1)
 */
function apparentViscosity(fluid: Fluid, shearRate_s: number): number {
  const gamma = Math.max(shearRate_s, 0.1); // Floor to avoid division by zero

  switch (fluid.rheology) {
    case "power_law": {
      const K = fluid.powerLawK ?? fluid.viscosity_cP / 1000;
      const n = fluid.powerLawN ?? 1;
      return K * Math.pow(gamma, n - 1) * 1000; // Convert Pa·s to cP
    }
    case "bingham": {
      const tau_y = fluid.yieldStress_Pa ?? 0;
      const mu_p = fluid.viscosity_cP / 1000; // Pa·s
      return (tau_y / gamma + mu_p) * 1000; // cP
    }
    case "herschel_bulkley": {
      const tau_y = fluid.yieldStress_Pa ?? 0;
      const K = fluid.powerLawK ?? fluid.viscosity_cP / 1000;
      const n = fluid.powerLawN ?? 1;
      return (tau_y / gamma + K * Math.pow(gamma, n - 1)) * 1000; // cP
    }
    default:
      return fluid.viscosity_cP;
  }
}

/**
 * Estimate shear rate inside the actuator orifice.
 * γ̇ ≈ 8·v / d for pipe flow (Newtonian approximation).
 */
function orificeShearRate(v_m_s: number, d_m: number): number {
  return 8 * v_m_s / Math.max(d_m, 1e-6);
}

/**
 * Compute droplet distribution from Dv50 using Rosin-Rammler spread parameter.
 * Spread depends on actuator type and atomization quality.
 */
function computeDistribution(Dv50_um: number, actuatorType: ActuatorType, regime: AtomizationRegime): DropletDistribution {
  // Typical spread (q) parameter by actuator category
  let q: number;
  switch (actuatorType) {
    case "hollow_cone":
    case "fine_mist":
      q = 3.5; // Narrow distribution
      break;
    case "full_cone":
    case "adjustable_cone":
      q = 2.5;
      break;
    case "flat_fan":
    case "deflection":
      q = 2.0;
      break;
    case "air_atomizing":
      q = 3.0;
      break;
    case "ultrasonic":
      q = 4.0; // Very uniform
      break;
    case "jet_stream":
      q = 1.5; // Wide variation
      break;
    default:
      q = 2.5;
  }

  // Regime affects uniformity
  if (regime === "Rayleigh") q *= 0.7; // Wider spread in dripping
  if (regime === "Atomization") q *= 1.2; // Tighter in full atomization

  // Rosin-Rammler: Dv_x = Dv50 * (-ln(1 - x/100))^(1/q) / (-ln(0.5))^(1/q)
  const lnHalf = Math.pow(-Math.log(0.5), 1 / q);
  const Dv10 = Dv50_um * Math.pow(-Math.log(0.9), 1 / q) / lnHalf;
  const Dv90 = Dv50_um * Math.pow(-Math.log(0.1), 1 / q) / lnHalf;
  const span = (Dv90 - Dv10) / Dv50_um;

  return {
    Dv10_um: Math.round(Dv10 * 10) / 10,
    Dv50_um: Math.round(Dv50_um * 10) / 10,
    Dv90_um: Math.round(Dv90 * 10) / 10,
    span: Math.round(span * 100) / 100,
  };
}

/**
 * Assess clogging risk: compare max particle size to orifice diameter.
 * Industry rule of thumb: particles should be < 1/3 of orifice.
 */
function assessCloggingRisk(fluid: Fluid, orificeDia_mm: number): "none" | "low" | "moderate" | "high" {
  if (!fluid.maxParticleSize_um) return "none";
  const orifice_um = orificeDia_mm * 1000;
  const ratio = fluid.maxParticleSize_um / orifice_um;
  if (ratio > 0.5) return "high";
  if (ratio > 0.33) return "moderate";
  if (ratio > 0.1) return "low";
  return "none";
}

/**
 * Assess material stress risks (swelling, stress cracking, leaching)
 * based on solvent class and material combinations.
 */
function assessMaterialStress(fluid: Fluid, td: TechnicalDesign): {
  swellingRisk: boolean;
  stressCrackingRisk: boolean;
  leachingRisk: boolean;
} {
  const body = td.bodyMaterial.toLowerCase();
  const seal = td.sealMaterial.toLowerCase();
  const sc = fluid.solventClass;

  // Swelling: elastomers in aggressive solvents
  const swellingRisk =
    (sc === "hydrocarbon" && seal.includes("epdm")) ||
    (sc === "ketone" && (seal.includes("buna") || body.includes("pom"))) ||
    (sc === "ester" && seal.includes("buna")) ||
    (sc === "silicone" && seal.includes("silicone"));

  // Stress cracking: polymers in certain solvents
  const stressCrackingRisk =
    (sc === "ketone" && body.includes("pom")) ||
    (sc === "ketone" && body.includes("pc")) || // Polycarbonate
    (sc === "ester" && body.includes("abs")) ||
    (sc === "alcohol" && body.includes("pc"));

  // Leaching: plasticizers extracted by aggressive solvents
  const leachingRisk =
    (body.includes("pvc") || body.includes("pp")) &&
    (sc === "ketone" || sc === "ester" || sc === "hydrocarbon");

  return { swellingRisk, stressCrackingRisk, leachingRisk };
}

/**
 * Recommend tooling based on production volume.
 */
export function recommendTooling(volume: number, actuator: Actuator): ToolingSpec {
  if (volume <= 10) {
    return {
      recommendation: "fdm_3d_print",
      cavityCount: 1,
      estimatedLeadTime_days: 3,
      estimatedToolCost_usd: 0,
      costPerUnit_usd: actuator.price_usd * 2.5, // Premium for prototyping
    };
  }
  if (volume <= 1000) {
    return {
      recommendation: "soft_tool",
      cavityCount: volume <= 100 ? 1 : 2,
      estimatedLeadTime_days: volume <= 100 ? 7 : 14,
      estimatedToolCost_usd: volume <= 100 ? 800 : 2500,
      costPerUnit_usd: actuator.price_usd * 0.8,
    };
  }
  // 1000+ units: hardened steel
  const cavities = volume <= 10000 ? 4 : volume <= 100000 ? 16 : 32;
  return {
    recommendation: "hardened_steel",
    cavityCount: cavities,
    estimatedLeadTime_days: cavities <= 4 ? 21 : 35,
    estimatedToolCost_usd: cavities * 8000,
    costPerUnit_usd: actuator.price_usd * 0.3,
  };
}

export function predict(actuator: Actuator, fluid: Fluid, pressure_bar: number): PredictionResult {
  const td = actuator.technicalDesign;
  const d = actuator.orificeDiameter_mm / 1000;          // m
  const rho = fluid.density_kg_m3;                        // kg/m³
  const sigma = fluid.surfaceTension_mN_m / 1000;        // N/m
  const P = pressure_bar * 1e5;                           // Pa

  // Non-Newtonian: compute apparent viscosity at estimated orifice shear rate
  // First pass: estimate velocity to get shear rate
  const Cd_est = DISCHARGE_COEFFICIENTS[actuator.type];
  const v_est = Cd_est * Math.sqrt((2 * P) / rho);
  const shearRate = orificeShearRate(v_est, d);
  const mu_app_cP = apparentViscosity(fluid, shearRate);
  const mu = mu_app_cP / 1000;                           // Pa·s

  // Type-specific discharge coefficient
  const Cd = DISCHARGE_COEFFICIENTS[actuator.type];

  // ---- Flow velocity & rate ----
  let v: number;      // Exit velocity (m/s)
  let flowRate_mL_min: number;
  let effectivePressure_bar = pressure_bar;

  const isPump = actuator.productCategory === "spray_pump" ||
                 actuator.productCategory === "perfumery_pump" ||
                 actuator.productCategory === "dispenser";

  if (isPump) {
    // Pumps: spring-driven, metered dose
    const pumpModel = pumpFlowModel(td, pressure_bar);
    effectivePressure_bar = pumpModel.effectivePressure_bar;
    const P_eff = effectivePressure_bar * 1e5;
    v = Cd * Math.sqrt((2 * P_eff) / rho);
    // Flow rate for pumps: dosage per actuation, assume ~1 actuation/sec for comparison
    flowRate_mL_min = (pumpModel.dosage_uL / 1000) * 60; // µL/actuation × 60 actuations/min
  } else if (actuator.type === "ultrasonic") {
    // Ultrasonic: gravity-fed, very low velocity
    v = Cd * Math.sqrt((2 * P) / rho);
    // Ultrasonic nozzles have very low flow — limited by feed rate
    const A = Math.PI * (d / 2) ** 2;
    flowRate_mL_min = Cd * A * Math.sqrt((2 * P) / rho) * 1e6 * 60;
    // Cap at typical ultrasonic max (~5 mL/min)
    flowRate_mL_min = Math.min(flowRate_mL_min, 5.0);
  } else if (actuator.type === "multi_orifice") {
    // Multi-orifice: flow splits across N orifices
    const n = td.orificeCount || 1;
    const A_single = Math.PI * (d / 2) ** 2;
    v = Cd * Math.sqrt((2 * P) / rho);
    flowRate_mL_min = n * Cd * A_single * Math.sqrt((2 * P) / rho) * 1e6 * 60;
  } else if (actuator.type === "impingement") {
    // Impingement: two converging jets
    const n = td.orificeCount || 2;
    const A_single = Math.PI * (d / 2) ** 2;
    v = Cd * Math.sqrt((2 * P) / rho);
    flowRate_mL_min = n * Cd * A_single * Math.sqrt((2 * P) / rho) * 1e6 * 60;
  } else {
    // Standard pressure nozzle: Bernoulli
    const A = Math.PI * (d / 2) ** 2;
    v = Cd * Math.sqrt((2 * P) / rho);
    flowRate_mL_min = Cd * A * Math.sqrt((2 * P) / rho) * 1e6 * 60;
  }

  // ---- Dimensionless numbers ----
  const Re = (rho * v * d) / mu;
  const We = (rho * v * v * d) / sigma;
  const Oh = mu / Math.sqrt(rho * sigma * d);

  // ---- Atomization regime (Ohnesorge diagram) ----
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

  // ---- Swirl number from actual geometry ----
  const S = computeSwirlNumber(td, actuator.orificeDiameter_mm);

  // ---- Cone angle: type-specific ----
  let coneAngle: number;
  switch (actuator.type) {
    case "jet_stream":
      // Jets have minimal spread — 3-8° divergence from turbulence
      coneAngle = 3 + 5 * Math.pow(mu / 0.001, 0.3); // Viscosity slightly widens jet
      break;
    case "flat_fan":
      // Flat fans: the "angle" is the fan width, controlled by slot aspect ratio
      coneAngle = actuator.swirlChamberAngle_deg; // Manufacturer-specified fan angle
      break;
    case "deflection":
      // Deflection nozzles: angle set by deflection plate geometry
      coneAngle = actuator.swirlChamberAngle_deg;
      break;
    case "spiral":
      // Spiral nozzles: full-cone set by helix geometry, typically wide
      coneAngle = Math.min(170, actuator.swirlChamberAngle_deg * 0.9 + 20);
      break;
    case "ultrasonic":
      // Ultrasonic: near-zero velocity → wide, gentle cloud
      coneAngle = 15 + 10 * Math.random(); // Essentially a diffuse cloud, ~15-25°
      break;
    case "air_atomizing":
      // Air cap geometry sets the angle
      coneAngle = actuator.swirlChamberAngle_deg * 0.85;
      break;
    case "impingement":
      // Impingement: sheet fans out from collision point
      coneAngle = actuator.swirlChamberAngle_deg + 30 * Math.pow(We / 1000, 0.2);
      coneAngle = Math.min(150, coneAngle);
      break;
    default:
      // Swirl-type nozzles (full_cone, hollow_cone, fine_mist, adjustable_cone, multi_orifice)
      coneAngle = swirlConeAngle(S, P, rho, actuator.swirlChamberAngle_deg);
      break;
  }

  // ---- Droplet size: type-specific correlations ----
  let Dv50_um: number;
  switch (actuator.type) {
    case "jet_stream":
      // Coherent jet — droplets only form at jet breakup (Rayleigh)
      // Dv50 ≈ 1.89 × jet diameter for Rayleigh breakup
      Dv50_um = 1.89 * actuator.orificeDiameter_mm * 1000 * Math.pow(Oh, 0.2);
      break;

    case "flat_fan":
      Dv50_um = flatFanDropletSize(d, sigma, mu, rho, v) * 1e6;
      break;

    case "air_atomizing": {
      const ALR = 0.5; // Air-to-liquid mass ratio (typical for external mix)
      Dv50_um = airAtomizingDropletSize(sigma, mu, rho, v, ALR) * 1e6;
      break;
    }

    case "ultrasonic":
      Dv50_um = ultrasonicDropletSize(sigma, rho, 48000) * 1e6;
      break;

    case "spiral":
      // Spiral nozzles produce coarse spray — larger drops
      Dv50_um = 3.5 * d * Math.pow(Re, -0.4) * Math.pow(We, -0.2) * 1e6;
      break;

    case "deflection":
      // Deflection plate shatters jet — sheet breakup model
      Dv50_um = flatFanDropletSize(d, sigma, mu, rho, v) * 1.3 * 1e6; // ~30% coarser than flat fan
      break;

    case "impingement":
      // Impingement: sheet from colliding jets, very fine
      Dv50_um = flatFanDropletSize(d, sigma, mu, rho, v) * 0.7 * 1e6; // ~30% finer due to high-energy collision
      break;

    case "multi_orifice":
      // Each orifice acts as a mini swirl nozzle
      Dv50_um = swirlDropletSize(d, sigma, mu, rho, P, Math.max(S, 1)) * 1e6;
      break;

    default:
      // Swirl pressure nozzles: full_cone, hollow_cone, fine_mist, adjustable_cone
      Dv50_um = swirlDropletSize(d, sigma, mu, rho, P, Math.max(S, 0.5)) * 1e6;
      // Hollow cone produces finer spray than full cone at same conditions
      if (actuator.type === "hollow_cone") {
        Dv50_um *= 0.75;
      }
      if (actuator.type === "fine_mist") {
        Dv50_um *= 0.6; // Micro-orifice + high swirl → very fine
      }
      break;
  }

  // Clamp droplet size to physically reasonable range
  Dv50_um = Math.max(1, Math.min(5000, Dv50_um));

  // ---- Spray width at 100mm standoff ----
  const sprayWidth = 2 * 100 * Math.tan((coneAngle * Math.PI) / 360);

  // ---- Safety warnings (expanded with material-specific checks) ----
  const safetyWarnings: string[] = [];

  // Flammability
  if (fluid.flashPoint_C !== null && fluid.flashPoint_C < 23) {
    safetyWarnings.push("FLAMMABLE: Flash point below 23°C — ensure ATEX/Ex-rated environment");
  }
  if (fluid.flashPoint_C !== null && fluid.flashPoint_C >= 23 && fluid.flashPoint_C < 60) {
    safetyWarnings.push("COMBUSTIBLE: Flash point below 60°C — avoid ignition sources");
  }

  // Chemical hazards
  if (fluid.hazards.includes("corrosive")) {
    safetyWarnings.push("CORROSIVE: Ensure wetted parts are chemically resistant");
  }
  if (fluid.hazards.includes("oxidizer")) {
    safetyWarnings.push("OXIDIZER: Keep away from organics and reducing agents");
  }

  // pH extremes
  if (fluid.pH < 3) {
    safetyWarnings.push("ACIDIC: pH below 3 — verify seal and body material compatibility");
  }
  if (fluid.pH > 12) {
    safetyWarnings.push("ALKALINE: pH above 12 — verify seal and body material compatibility");
  }

  // Overpressure
  if (pressure_bar > actuator.maxPressure_bar) {
    safetyWarnings.push(`OVERPRESSURE: Operating at ${pressure_bar} bar exceeds rated ${actuator.maxPressure_bar} bar`);
  }

  // Explosive mist formation
  if (Dv50_um < 30 && fluid.hazards.some(h => h.includes("flammable"))) {
    safetyWarnings.push("EXPLOSIVE MIST: Sub-30µm droplets of flammable liquid — explosive atmosphere risk");
  }

  // Inhalation risk
  if (fluid.ppeRequired.includes("respirator")) {
    safetyWarnings.push("INHALATION: Respiratory protection required — use in ventilated area");
  }
  if (Dv50_um < 10) {
    safetyWarnings.push("RESPIRABLE: Sub-10µm droplets enter deep lung — assess inhalation toxicity");
  }

  // Material-specific chemical attack warnings
  for (const attack of MATERIAL_ATTACKS) {
    if (fluid.solventClass === attack.solventClass) {
      const wetted = [td.bodyMaterial, td.sealMaterial, td.insertMaterial, td.springMaterial]
        .filter(Boolean)
        .join(" ");
      if (wetted.includes(attack.material)) {
        safetyWarnings.push(attack.warning);
      }
    }
  }

  // Viscosity warning for fine-mist actuators
  if (fluid.viscosity_cP > 20 && (actuator.type === "fine_mist" || actuator.type === "ultrasonic")) {
    safetyWarnings.push(`VISCOSITY: ${fluid.viscosity_cP} cP may exceed atomization threshold for this actuator — test at reduced viscosity first`);
  }

  // High-viscosity flow warning
  if (fluid.viscosity_cP > 30 && actuator.orificeDiameter_mm < 0.5) {
    safetyWarnings.push("BLOCKAGE RISK: High viscosity + small orifice — risk of clogging or insufficient flow");
  }

  // ---- Compatibility score (multi-factor weighted) ----
  const materialMatch = actuator.materialCompatibility.includes(fluid.solventClass);
  const pressureSafe = pressure_bar <= actuator.maxPressure_bar;

  // Material compatibility is the gate (0 or 1)
  let score = materialMatch ? 50 : 10;

  // Pressure safety (0-20 points)
  if (pressureSafe) {
    // Bonus for operating at 40-80% of max pressure (optimal range)
    const pressureRatio = pressure_bar / actuator.maxPressure_bar;
    if (pressureRatio >= 0.4 && pressureRatio <= 0.8) {
      score += 20; // Optimal operating window
    } else if (pressureRatio < 0.4) {
      score += 12; // Under-pressure — may not atomize well
    } else {
      score += 15; // High end but within spec
    }
  } else {
    score -= 15; // Over pressure
  }

  // Atomization quality (0-15 points)
  if (atomizationRegime === "Atomization") score += 15;
  else if (atomizationRegime === "Wind-stressed") score += 10;
  else if (atomizationRegime === "Wind-induced") score += 5;
  else score += 0; // Rayleigh = dripping, poor atomization

  // Viscosity suitability for actuator type (0-10 points)
  const vis = fluid.viscosity_cP;
  if (actuator.type === "jet_stream" || actuator.type === "spiral" || actuator.type === "deflection") {
    // These handle high viscosity well
    score += vis > 20 ? 8 : 10;
  } else if (actuator.type === "fine_mist" || actuator.type === "ultrasonic") {
    // These need low viscosity
    score += vis < 5 ? 10 : vis < 15 ? 5 : 0;
  } else {
    // General nozzles
    score += vis < 10 ? 10 : vis < 30 ? 5 : 0;
  }

  // Material attack penalty (-10 for each specific chemical incompatibility)
  const materialAttackCount = MATERIAL_ATTACKS.filter((attack) => {
    if (fluid.solventClass !== attack.solventClass) return false;
    const wetted = [td.bodyMaterial, td.sealMaterial, td.insertMaterial, td.springMaterial]
      .filter(Boolean).join(" ");
    return wetted.includes(attack.material);
  }).length;
  score -= materialAttackCount * 10;

  // Seal material bonus: PTFE and FKM are broadly compatible
  if (td.sealMaterial.includes("PTFE") || td.sealMaterial.includes("FKM")) {
    score += 5;
  }

  // Non-Newtonian penalty: yield stress fluids may not atomize
  if (fluid.yieldStress_Pa && fluid.yieldStress_Pa > 50) {
    score -= 15;
    safetyWarnings.push(`YIELD STRESS: ${fluid.yieldStress_Pa} Pa yield stress may prevent atomization — verify breakup at operating shear rate`);
  }

  // Suspension clogging penalty
  const cloggingRisk = assessCloggingRisk(fluid, actuator.orificeDiameter_mm);
  if (cloggingRisk === "high") {
    score -= 20;
    safetyWarnings.push(`CLOGGING: Particle size (${fluid.maxParticleSize_um} µm) exceeds 50% of orifice diameter — high clogging risk`);
  } else if (cloggingRisk === "moderate") {
    score -= 10;
    safetyWarnings.push(`CLOGGING: Particle size (${fluid.maxParticleSize_um} µm) near 33% of orifice — test with filtration`);
  }

  const compatibilityScore = Math.max(0, Math.min(100, Math.round(score)));

  // Compute extended outputs
  const dropletDistribution = computeDistribution(Dv50_um, actuator.type, atomizationRegime);
  const deliveryRate_g_s = (flowRate_mL_min / 60) * (rho / 1000); // mL/min → g/s
  const materialStress = assessMaterialStress(fluid, td);

  return {
    actuatorId: actuator.id,
    fluidId: fluid.id,
    coneAngle_deg: Math.round(coneAngle * 10) / 10,
    dropletSizeDv50_um: Math.round(Dv50_um * 10) / 10,
    dropletDistribution,
    flowRate_mL_min: Math.round(flowRate_mL_min * 10) / 10,
    deliveryRate_g_s: Math.round(deliveryRate_g_s * 100) / 100,
    sprayWidth_mm_at_100mm: Math.round(sprayWidth * 10) / 10,
    compatibilityScore,
    pressureRequired_bar: effectivePressure_bar,
    reynoldsNumber: Math.round(Re),
    weberNumber: Math.round(We),
    ohnesorgeNumber: Math.round(Oh * 10000) / 10000,
    atomizationRegime,
    velocityExit_m_s: Math.round(v * 100) / 100,
    safetyWarnings,
    cloggingRisk,
    apparentViscosity_cP: Math.round(mu_app_cP * 10) / 10,
    materialStress,
  };
}
