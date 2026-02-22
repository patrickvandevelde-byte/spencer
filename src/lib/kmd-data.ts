// ============================================================
// Knowledge Monopoly Database (KMD)
// Validated formula/actuator/piston settings for the SFP system
//
// Contains: 11 IM parts, ITV specs, LPV specs, product category
// mappings, and actuator-piston compatibility rules.
// ============================================================

import type { ViscosityCategory } from './spenser-physics';

// --- Component Types (11 Injection-Molded Parts) ---

export type IMPartId =
  | 'actuator-cap'
  | 'actuator-button'
  | 'nozzle-insert'
  | 'integrated-valve'   // ITV
  | 'valve-seat'
  | 'piston-assembly'
  | 'piston-seal'
  | 'reference-chamber'
  | 'lpv-body'           // Low-Pressure Vessel (PET)
  | 'base-plate'
  | 'feed-channel';

export interface IMPart {
  id: IMPartId;
  name: string;
  material: string;
  materialOptions: string[];
  weight_g: number;
  description: string;
  recyclable: boolean;
  recyclabilityNote: string;
}

export interface ITVSpec {
  id: string;
  name: string;
  orifice_mm: number;
  flowRate_ml_min: number;
  maxPressure_bar: number;
  sprayAngle_deg: number;
  viscosityRange_cP: [number, number];
  categories: ViscosityCategory[];
  orientation360: boolean;
}

export interface LPVSpec {
  id: string;
  name: string;
  volume_ml: number;
  material: 'PET' | 'rPET' | 'PP';
  transparent: boolean;
  maxPressure_bar: number;
  printingSurface_cm2: number;
  weight_g: number;
  recyclingStream: 'single-stream-PET' | 'mixed-plastic' | 'multi-layer';
}

export interface ProductCategoryMapping {
  category: ViscosityCategory;
  label: string;
  viscosityRange_cP: [number, number];
  examples: string[];
  recommendedITV: string[];
  recommendedPiston: string[];
  recommendedLPV: string[];
  typicalPreload_bar: [number, number]; // min, max
}

export interface SFPRecipe {
  id: string;
  name: string;
  formulaCategory: ViscosityCategory;
  viscosity_cP: number;
  density_g_cm3: number;
  gasSensitive: boolean;
  fillVolume_ml: number;
  orientation360: boolean;
  components: {
    partId: IMPartId;
    variant: string;
    material: string;
  }[];
  itvId: string;
  pistonId: string;
  lpvId: string;
  referencePreload_bar: number;
  outputPressure_bar: number;
  ppwrGrade: string;
  line: 'Line38' | 'Line53';
}

// --- 11 Injection-Molded Parts ---

export const IM_PARTS: IMPart[] = [
  {
    id: 'actuator-cap',
    name: 'Actuator Cap',
    material: 'PP',
    materialOptions: ['PP', 'rPP', 'PET'],
    weight_g: 3.2,
    description: 'Outer protective cap with snap-fit closure. Prevents accidental actuation.',
    recyclable: true,
    recyclabilityNote: 'Mono-material PP — single-stream recyclable',
  },
  {
    id: 'actuator-button',
    name: 'Actuator Button',
    material: 'PP',
    materialOptions: ['PP', 'POM'],
    weight_g: 2.8,
    description: 'Ergonomic actuation trigger. Translates finger force to valve opening.',
    recyclable: true,
    recyclabilityNote: 'PP compatible with cap for single-stream recycling',
  },
  {
    id: 'nozzle-insert',
    name: 'Nozzle Insert',
    material: 'POM',
    materialOptions: ['POM', 'PP', 'Ceramic'],
    weight_g: 0.8,
    description: 'Precision orifice insert that determines spray pattern and droplet size.',
    recyclable: true,
    recyclabilityNote: 'Small component — separable at recycling',
  },
  {
    id: 'integrated-valve',
    name: 'Integrated Valve (ITV)',
    material: 'POM',
    materialOptions: ['POM', 'PP'],
    weight_g: 4.5,
    description: 'Core valve mechanism. Combines traditional valve + gasket + spring in one moulded part. Zero-leak seal at rest.',
    recyclable: true,
    recyclabilityNote: 'Mono-material POM — mechanically separable',
  },
  {
    id: 'valve-seat',
    name: 'Valve Seat',
    material: 'POM',
    materialOptions: ['POM', 'PEEK'],
    weight_g: 1.2,
    description: 'Sealing surface for ITV. Precision-ground for leak-free closure.',
    recyclable: true,
    recyclabilityNote: 'Paired with ITV for recycling',
  },
  {
    id: 'piston-assembly',
    name: 'Piston Assembly',
    material: 'PP',
    materialOptions: ['PP', 'HDPE'],
    weight_g: 6.0,
    description: 'Mechanical piston that maintains constant pressure via spring preload. Replaces gas propellant.',
    recyclable: true,
    recyclabilityNote: 'PP mono-material — high recyclability',
  },
  {
    id: 'piston-seal',
    name: 'Piston Seal Ring',
    material: 'EPDM',
    materialOptions: ['EPDM', 'FKM', 'PTFE', 'Silicone'],
    weight_g: 0.5,
    description: 'Dynamic seal between piston and LPV wall. Material selected per formula compatibility.',
    recyclable: false,
    recyclabilityNote: 'Elastomer — must be separated before PET recycling',
  },
  {
    id: 'reference-chamber',
    name: 'Reference Chamber Body',
    material: 'PP',
    materialOptions: ['PP', 'PET'],
    weight_g: 5.5,
    description: 'Houses the spring/preload mechanism. Calibrated volume determines constant output pressure.',
    recyclable: true,
    recyclabilityNote: 'PP — single-stream compatible',
  },
  {
    id: 'lpv-body',
    name: 'Low-Pressure Vessel (LPV)',
    material: 'PET',
    materialOptions: ['PET', 'rPET', 'PP'],
    weight_g: 18.0,
    description: 'Transparent PET body. Main product container. Provides printing canvas and shelf visibility.',
    recyclable: true,
    recyclabilityNote: 'Mono-material PET — Grade A recyclability',
  },
  {
    id: 'base-plate',
    name: 'Base Plate',
    material: 'PP',
    materialOptions: ['PP', 'HDPE'],
    weight_g: 4.0,
    description: 'Structural base. Snap-fits to LPV body. Houses reference chamber mount point.',
    recyclable: true,
    recyclabilityNote: 'PP — mechanically separable',
  },
  {
    id: 'feed-channel',
    name: 'Feed Channel / Dip Tube',
    material: 'PP',
    materialOptions: ['PP', 'PE'],
    weight_g: 1.5,
    description: 'Internal channel directing product from piston face to ITV. Enables 360° operation when configured.',
    recyclable: true,
    recyclabilityNote: 'PP — lightweight, single-stream',
  },
];

// --- ITV Catalogue ---

export const ITV_CATALOG: ITVSpec[] = [
  {
    id: 'ITV-FM-08',
    name: 'Fine Mist ITV 0.8mm',
    orifice_mm: 0.8,
    flowRate_ml_min: 15,
    maxPressure_bar: 8,
    sprayAngle_deg: 60,
    viscosityRange_cP: [1, 200],
    categories: ['liquid'],
    orientation360: true,
  },
  {
    id: 'ITV-FM-12',
    name: 'Fine Mist ITV 1.2mm',
    orifice_mm: 1.2,
    flowRate_ml_min: 30,
    maxPressure_bar: 10,
    sprayAngle_deg: 55,
    viscosityRange_cP: [1, 500],
    categories: ['liquid', 'lotion'],
    orientation360: true,
  },
  {
    id: 'ITV-STD-15',
    name: 'Standard ITV 1.5mm',
    orifice_mm: 1.5,
    flowRate_ml_min: 50,
    maxPressure_bar: 10,
    sprayAngle_deg: 45,
    viscosityRange_cP: [50, 5000],
    categories: ['lotion', 'cream'],
    orientation360: true,
  },
  {
    id: 'ITV-STD-20',
    name: 'Standard ITV 2.0mm',
    orifice_mm: 2.0,
    flowRate_ml_min: 80,
    maxPressure_bar: 12,
    sprayAngle_deg: 40,
    viscosityRange_cP: [500, 15000],
    categories: ['cream', 'paste'],
    orientation360: false,
  },
  {
    id: 'ITV-WB-25',
    name: 'Wide Bore ITV 2.5mm',
    orifice_mm: 2.5,
    flowRate_ml_min: 120,
    maxPressure_bar: 15,
    sprayAngle_deg: 35,
    viscosityRange_cP: [5000, 80000],
    categories: ['paste', 'gel'],
    orientation360: false,
  },
  {
    id: 'ITV-XW-30',
    name: 'Extra Wide ITV 3.0mm',
    orifice_mm: 3.0,
    flowRate_ml_min: 180,
    maxPressure_bar: 18,
    sprayAngle_deg: 30,
    viscosityRange_cP: [20000, 500000],
    categories: ['gel'],
    orientation360: false,
  },
];

// --- LPV Catalogue ---

export const LPV_CATALOG: LPVSpec[] = [
  {
    id: 'LPV-PET-75',
    name: 'PET 75ml Transparent',
    volume_ml: 75,
    material: 'PET',
    transparent: true,
    maxPressure_bar: 10,
    printingSurface_cm2: 45,
    weight_g: 12,
    recyclingStream: 'single-stream-PET',
  },
  {
    id: 'LPV-PET-150',
    name: 'PET 150ml Transparent',
    volume_ml: 150,
    material: 'PET',
    transparent: true,
    maxPressure_bar: 10,
    printingSurface_cm2: 75,
    weight_g: 18,
    recyclingStream: 'single-stream-PET',
  },
  {
    id: 'LPV-PET-250',
    name: 'PET 250ml Transparent',
    volume_ml: 250,
    material: 'PET',
    transparent: true,
    maxPressure_bar: 8,
    printingSurface_cm2: 110,
    weight_g: 24,
    recyclingStream: 'single-stream-PET',
  },
  {
    id: 'LPV-PET-400',
    name: 'PET 400ml Transparent',
    volume_ml: 400,
    material: 'PET',
    transparent: true,
    maxPressure_bar: 6,
    printingSurface_cm2: 150,
    weight_g: 32,
    recyclingStream: 'single-stream-PET',
  },
  {
    id: 'LPV-RPET-150',
    name: 'rPET 150ml Recycled',
    volume_ml: 150,
    material: 'rPET',
    transparent: false,
    maxPressure_bar: 9,
    printingSurface_cm2: 75,
    weight_g: 19,
    recyclingStream: 'single-stream-PET',
  },
  {
    id: 'LPV-RPET-250',
    name: 'rPET 250ml Recycled',
    volume_ml: 250,
    material: 'rPET',
    transparent: false,
    maxPressure_bar: 7,
    printingSurface_cm2: 110,
    weight_g: 26,
    recyclingStream: 'single-stream-PET',
  },
  {
    id: 'LPV-PP-150',
    name: 'PP 150ml Opaque',
    volume_ml: 150,
    material: 'PP',
    transparent: false,
    maxPressure_bar: 12,
    printingSurface_cm2: 75,
    weight_g: 16,
    recyclingStream: 'mixed-plastic',
  },
];

// --- Product Category Mappings ---

export const CATEGORY_MAPPINGS: ProductCategoryMapping[] = [
  {
    category: 'liquid',
    label: 'Liquids',
    viscosityRange_cP: [1, 100],
    examples: ['Toners', 'Micellar water', 'Setting sprays', 'Room fresheners'],
    recommendedITV: ['ITV-FM-08', 'ITV-FM-12'],
    recommendedPiston: ['PST-PREC-25', 'PST-FINE-30'],
    recommendedLPV: ['LPV-PET-75', 'LPV-PET-150'],
    typicalPreload_bar: [2, 4],
  },
  {
    category: 'lotion',
    label: 'Lotions',
    viscosityRange_cP: [100, 1000],
    examples: ['Body lotions', 'Sunscreens', 'Leave-in conditioners', 'Light serums'],
    recommendedITV: ['ITV-FM-12', 'ITV-STD-15'],
    recommendedPiston: ['PST-FINE-30', 'PST-STD-35'],
    recommendedLPV: ['LPV-PET-150', 'LPV-PET-250'],
    typicalPreload_bar: [3, 6],
  },
  {
    category: 'cream',
    label: 'Creams',
    viscosityRange_cP: [1000, 10000],
    examples: ['Moisturizers', 'Shaving creams', 'Pharmaceutical creams', 'Thick conditioners'],
    recommendedITV: ['ITV-STD-15', 'ITV-STD-20'],
    recommendedPiston: ['PST-STD-35', 'PST-MED-40'],
    recommendedLPV: ['LPV-PET-150', 'LPV-PET-250', 'LPV-PET-400'],
    typicalPreload_bar: [5, 8],
  },
  {
    category: 'paste',
    label: 'Pastes',
    viscosityRange_cP: [10000, 50000],
    examples: ['Toothpaste', 'Hair wax', 'Thick sunscreen', 'Industrial pastes'],
    recommendedITV: ['ITV-STD-20', 'ITV-WB-25'],
    recommendedPiston: ['PST-MED-40', 'PST-LRG-50'],
    recommendedLPV: ['LPV-PET-250', 'LPV-PET-400', 'LPV-PP-150'],
    typicalPreload_bar: [7, 12],
  },
  {
    category: 'gel',
    label: 'Gels',
    viscosityRange_cP: [50000, 500000],
    examples: ['Hair gel', 'Shower gel', 'Medical gels', 'Adhesives'],
    recommendedITV: ['ITV-WB-25', 'ITV-XW-30'],
    recommendedPiston: ['PST-LRG-50', 'PST-XL-60'],
    recommendedLPV: ['LPV-PET-400', 'LPV-PP-150'],
    typicalPreload_bar: [10, 18],
  },
];

// --- Utility Functions ---

/**
 * Get compatible ITVs for a given viscosity and category.
 */
export function getCompatibleITVs(
  viscosity_cP: number,
  category: ViscosityCategory,
  orientation360: boolean,
): ITVSpec[] {
  return ITV_CATALOG.filter((itv) => {
    const viscOk = viscosity_cP >= itv.viscosityRange_cP[0] && viscosity_cP <= itv.viscosityRange_cP[1];
    const catOk = itv.categories.includes(category);
    const orientOk = !orientation360 || itv.orientation360;
    return viscOk && catOk && orientOk;
  });
}

/**
 * Get compatible LPVs for a given fill volume and required pressure.
 */
export function getCompatibleLPVs(
  fillVolume_ml: number,
  requiredPressure_bar: number,
): LPVSpec[] {
  return LPV_CATALOG.filter((lpv) => {
    const volumeOk = lpv.volume_ml >= fillVolume_ml;
    const pressureOk = lpv.maxPressure_bar >= requiredPressure_bar;
    return volumeOk && pressureOk;
  });
}

/**
 * Build the full list of 11 IM parts for a configuration,
 * selecting appropriate material variants based on formula.
 */
export function buildComponentList(
  category: ViscosityCategory,
  gasSensitive: boolean,
): { part: IMPart; selectedMaterial: string; note: string }[] {
  return IM_PARTS.map((part) => {
    let selectedMaterial = part.material;
    let note = 'Standard selection';

    // Piston seal material depends on formula category
    if (part.id === 'piston-seal') {
      if (category === 'liquid' || category === 'lotion') {
        selectedMaterial = 'PTFE';
        note = 'PTFE selected for low-viscosity chemical compatibility';
      } else if (category === 'cream') {
        selectedMaterial = 'EPDM';
        note = 'EPDM selected for cream-range viscosity sealing';
      } else if (category === 'paste' || category === 'gel') {
        selectedMaterial = 'Silicone';
        note = 'Silicone selected for high-viscosity applications';
      }
    }

    // Gas-sensitive formulas may prefer POM over PP for valve
    if (part.id === 'integrated-valve' && gasSensitive) {
      selectedMaterial = 'POM';
      note = 'POM selected — inert to gas-sensitive actives';
    }

    // LPV body: PET for transparency, rPET for sustainability claims
    if (part.id === 'lpv-body') {
      selectedMaterial = 'PET';
      note = 'Transparent PET — Grade A PPWR recyclability';
    }

    return { part, selectedMaterial, note };
  });
}

/**
 * Get category mapping for a viscosity category.
 */
export function getCategoryMapping(category: ViscosityCategory): ProductCategoryMapping | undefined {
  return CATEGORY_MAPPINGS.find((m) => m.category === category);
}
