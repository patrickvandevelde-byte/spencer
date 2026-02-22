// ============================================================
// Spenser Financial Modeler
// CAPEX/OPEX comparison: SFP vs traditional aerosol infrastructure
// ============================================================

// --- Types ---

export interface CapexInput {
  annualVolume_units: number;   // Target annual production volume
  productCategory: string;      // For context in report
  lineType: 'Line38' | 'Line53'; // SFP line type
}

export interface CapexComparison {
  spenser: LineInvestment;
  traditional: LineInvestment;
  delta: {
    capexSaving_eur: number;
    capexSaving_pct: number;
    opexPerUnitDelta_eur: number;
    annualOpexSaving_eur: number;
    paybackMonths: number;
    fiveYearTCO_eur: number;
    fiveYearSaving_eur: number;
  };
}

export interface LineInvestment {
  label: string;
  capex_eur: number;
  installationCost_eur: number;
  annualMaintenance_eur: number;
  opexPerUnit_eur: number;
  requiredFloorSpace_m2: number;
  fillingSpeed_uph: number;      // Units per hour
  operatorCount: number;
  gasInfrastructure: boolean;
  regulatoryCompliance: string;
  leadTime_weeks: number;
}

export interface ROITimeline {
  months: ROIMonth[];
  breakEvenMonth: number;
  fiveYearROI_pct: number;
}

export interface ROIMonth {
  month: number;
  spenserCumulative_eur: number;
  traditionalCumulative_eur: number;
  savings_eur: number;
}

export interface OpexBreakdown {
  spenser: OpexDetail;
  traditional: OpexDetail;
}

export interface OpexDetail {
  rawMaterial_eur: number;
  propellantGas_eur: number;
  packaging_eur: number;
  labour_eur: number;
  energy_eur: number;
  maintenance_eur: number;
  waste_eur: number;
  regulatory_eur: number;
  total_eur: number;
}

// --- Constants ---

const SFP_LINE_38: LineInvestment = {
  label: 'Spenser SFP Line 38',
  capex_eur: 150000,
  installationCost_eur: 15000,
  annualMaintenance_eur: 8000,
  opexPerUnit_eur: 0.42,
  requiredFloorSpace_m2: 35,
  fillingSpeed_uph: 2400,
  operatorCount: 1,
  gasInfrastructure: false,
  regulatoryCompliance: 'Standard CE + PPWR Grade A',
  leadTime_weeks: 8,
};

const SFP_LINE_53: LineInvestment = {
  label: 'Spenser SFP Line 53',
  capex_eur: 220000,
  installationCost_eur: 22000,
  annualMaintenance_eur: 12000,
  opexPerUnit_eur: 0.38,
  requiredFloorSpace_m2: 50,
  fillingSpeed_uph: 4800,
  operatorCount: 1,
  gasInfrastructure: false,
  regulatoryCompliance: 'Standard CE + PPWR Grade A',
  leadTime_weeks: 10,
};

const TRADITIONAL_AEROSOL: LineInvestment = {
  label: 'Traditional Aerosol Line',
  capex_eur: 2000000,
  installationCost_eur: 250000,
  annualMaintenance_eur: 85000,
  opexPerUnit_eur: 0.52,
  requiredFloorSpace_m2: 300,
  fillingSpeed_uph: 6000,
  operatorCount: 4,
  gasInfrastructure: true,
  regulatoryCompliance: 'ATEX Zone 2 + Pressure Equipment Directive',
  leadTime_weeks: 26,
};

// --- Calculation Functions ---

/**
 * Get the SFP line spec for a given type.
 */
function getSFPLine(lineType: 'Line38' | 'Line53'): LineInvestment {
  return lineType === 'Line38' ? { ...SFP_LINE_38 } : { ...SFP_LINE_53 };
}

/**
 * Calculate CAPEX comparison between Spenser SFP and traditional aerosol.
 */
export function calculateCapexComparison(input: CapexInput): CapexComparison {
  const spenser = getSFPLine(input.lineType);
  const traditional = { ...TRADITIONAL_AEROSOL };

  // Scale traditional line costs if volume is very high
  if (input.annualVolume_units > 5000000) {
    traditional.capex_eur = 3500000;
    traditional.installationCost_eur = 400000;
    traditional.annualMaintenance_eur = 120000;
  }

  const capexSaving = traditional.capex_eur - spenser.capex_eur;
  const capexSavingPct = Math.round((capexSaving / traditional.capex_eur) * 100);
  const opexPerUnitDelta = traditional.opexPerUnit_eur - spenser.opexPerUnit_eur;
  const annualOpexSaving = opexPerUnitDelta * input.annualVolume_units;

  // Payback: months until SFP CAPEX is recovered via OPEX savings
  const spenserTotalCapex = spenser.capex_eur + spenser.installationCost_eur;
  const monthlyOpexSaving = annualOpexSaving / 12;
  const paybackMonths = monthlyOpexSaving > 0
    ? Math.ceil(spenserTotalCapex / monthlyOpexSaving)
    : 999;

  // 5-year TCO
  const spenserTCO = spenserTotalCapex + (spenser.annualMaintenance_eur * 5)
    + (spenser.opexPerUnit_eur * input.annualVolume_units * 5);
  const traditionalTCO = (traditional.capex_eur + traditional.installationCost_eur)
    + (traditional.annualMaintenance_eur * 5)
    + (traditional.opexPerUnit_eur * input.annualVolume_units * 5);

  return {
    spenser,
    traditional,
    delta: {
      capexSaving_eur: capexSaving,
      capexSaving_pct: capexSavingPct,
      opexPerUnitDelta_eur: Math.round(opexPerUnitDelta * 100) / 100,
      annualOpexSaving_eur: Math.round(annualOpexSaving),
      paybackMonths: Math.min(paybackMonths, 120),
      fiveYearTCO_eur: Math.round(spenserTCO),
      fiveYearSaving_eur: Math.round(traditionalTCO - spenserTCO),
    },
  };
}

/**
 * Generate month-by-month ROI timeline.
 */
export function calculateROITimeline(input: CapexInput): ROITimeline {
  const comparison = calculateCapexComparison(input);
  const months: ROIMonth[] = [];

  const spenserCapex = comparison.spenser.capex_eur + comparison.spenser.installationCost_eur;
  const traditionalCapex = comparison.traditional.capex_eur + comparison.traditional.installationCost_eur;

  const monthlyVolume = input.annualVolume_units / 12;
  const spenserMonthlyOpex = comparison.spenser.opexPerUnit_eur * monthlyVolume
    + comparison.spenser.annualMaintenance_eur / 12;
  const traditionalMonthlyOpex = comparison.traditional.opexPerUnit_eur * monthlyVolume
    + comparison.traditional.annualMaintenance_eur / 12;

  let breakEvenMonth = 0;

  for (let m = 0; m <= 60; m++) {
    const spenserCum = spenserCapex + spenserMonthlyOpex * m;
    const tradCum = traditionalCapex + traditionalMonthlyOpex * m;
    const savings = tradCum - spenserCum;

    months.push({
      month: m,
      spenserCumulative_eur: Math.round(spenserCum),
      traditionalCumulative_eur: Math.round(tradCum),
      savings_eur: Math.round(savings),
    });

    if (savings > 0 && breakEvenMonth === 0 && m > 0) {
      breakEvenMonth = m;
    }
  }

  const fiveYearSpenserTotal = months[60].spenserCumulative_eur;
  const fiveYearTradTotal = months[60].traditionalCumulative_eur;
  const fiveYearROI = ((fiveYearTradTotal - fiveYearSpenserTotal) / spenserCapex) * 100;

  return {
    months,
    breakEvenMonth: breakEvenMonth || comparison.delta.paybackMonths,
    fiveYearROI_pct: Math.round(fiveYearROI),
  };
}

/**
 * Detailed OPEX breakdown per unit.
 */
export function calculateOpexBreakdown(annualVolume: number): OpexBreakdown {
  const spenserPerUnit = {
    rawMaterial_eur: 0.08,
    propellantGas_eur: 0,        // Zero gas
    packaging_eur: 0.15,
    labour_eur: 0.05,
    energy_eur: 0.03,
    maintenance_eur: 0.04,
    waste_eur: 0.02,
    regulatory_eur: 0.01,
  };

  const traditionalPerUnit = {
    rawMaterial_eur: 0.08,
    propellantGas_eur: 0.08,     // LPG/DME propellant
    packaging_eur: 0.12,
    labour_eur: 0.10,            // 4 operators vs 1
    energy_eur: 0.05,            // Gas compression
    maintenance_eur: 0.04,
    waste_eur: 0.03,             // Multi-material waste
    regulatory_eur: 0.02,        // ATEX compliance
  };

  const scale = annualVolume;
  const sTotal = Object.values(spenserPerUnit).reduce((a, b) => a + b, 0);
  const tTotal = Object.values(traditionalPerUnit).reduce((a, b) => a + b, 0);

  const spenserScaled: OpexDetail = {
    rawMaterial_eur: Math.round(spenserPerUnit.rawMaterial_eur * scale),
    propellantGas_eur: Math.round(spenserPerUnit.propellantGas_eur * scale),
    packaging_eur: Math.round(spenserPerUnit.packaging_eur * scale),
    labour_eur: Math.round(spenserPerUnit.labour_eur * scale),
    energy_eur: Math.round(spenserPerUnit.energy_eur * scale),
    maintenance_eur: Math.round(spenserPerUnit.maintenance_eur * scale),
    waste_eur: Math.round(spenserPerUnit.waste_eur * scale),
    regulatory_eur: Math.round(spenserPerUnit.regulatory_eur * scale),
    total_eur: Math.round(sTotal * scale),
  };

  const traditionalScaled: OpexDetail = {
    rawMaterial_eur: Math.round(traditionalPerUnit.rawMaterial_eur * scale),
    propellantGas_eur: Math.round(traditionalPerUnit.propellantGas_eur * scale),
    packaging_eur: Math.round(traditionalPerUnit.packaging_eur * scale),
    labour_eur: Math.round(traditionalPerUnit.labour_eur * scale),
    energy_eur: Math.round(traditionalPerUnit.energy_eur * scale),
    maintenance_eur: Math.round(traditionalPerUnit.maintenance_eur * scale),
    waste_eur: Math.round(traditionalPerUnit.waste_eur * scale),
    regulatory_eur: Math.round(traditionalPerUnit.regulatory_eur * scale),
    total_eur: Math.round(tTotal * scale),
  };

  return {
    spenser: spenserScaled,
    traditional: traditionalScaled,
  };
}

/**
 * Format EUR value for display.
 */
export function formatEur(value: number): string {
  if (value >= 1000000) {
    return `€${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `€${(value / 1000).toFixed(0)}K`;
  }
  return `€${value.toFixed(2)}`;
}
