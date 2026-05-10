// Supplier intelligence — deterministic seeded data so the
// /intel page tells a consistent story before the live feed
// goes online. Persona P6 (Helmut Krause, Tier-1 CPG sourcing)
// flagged supplier capacity + geopolitical risk as the real
// budget line; this is the surface for it.

export type RiskBand = "low" | "moderate" | "elevated" | "high";

export interface SupplierSignal {
  manufacturer: string;
  region: string;
  capacityUtilizationPct: number;
  leadTimeWeeks: number;
  leadTimeTrend: "down" | "flat" | "up";
  geopoliticalRisk: RiskBand;
  rawMaterialRisk: RiskBand;
  esgGrade: "A" | "B" | "C";
  notes: string;
  lastUpdated: string;
}

export const RISK_COLOR: Record<RiskBand, string> = {
  low: "var(--success)",
  moderate: "var(--accent)",
  elevated: "var(--warning)",
  high: "var(--danger)",
};

export const RISK_LABEL: Record<RiskBand, string> = {
  low: "Low",
  moderate: "Moderate",
  elevated: "Elevated",
  high: "High",
};

// Anchor date matches the validation pass + STATE so we don't
// drift visibly between deploys.
const STAMP = "2026-05-08";

export const SUPPLIER_SIGNALS: SupplierSignal[] = [
  {
    manufacturer: "Coster",
    region: "EU (Italy)",
    capacityUtilizationPct: 78,
    leadTimeWeeks: 6,
    leadTimeTrend: "flat",
    geopoliticalRisk: "low",
    rawMaterialRisk: "moderate",
    esgGrade: "A",
    notes: "PET resin pricing up 4% MoM; passes through at quote re-issue.",
    lastUpdated: STAMP,
  },
  {
    manufacturer: "Spencer",
    region: "US (Wisconsin)",
    capacityUtilizationPct: 91,
    leadTimeWeeks: 9,
    leadTimeTrend: "up",
    geopoliticalRisk: "low",
    rawMaterialRisk: "low",
    esgGrade: "B",
    notes:
      "Capacity tight through Q3 — recommend 10-week lead on new SKUs.",
    lastUpdated: STAMP,
  },
  {
    manufacturer: "Lindal",
    region: "DE",
    capacityUtilizationPct: 64,
    leadTimeWeeks: 5,
    leadTimeTrend: "down",
    geopoliticalRisk: "low",
    rawMaterialRisk: "low",
    esgGrade: "A",
    notes: "Capacity freed Q2 after stable-actives line transfer.",
    lastUpdated: STAMP,
  },
  {
    manufacturer: "Aptar",
    region: "US + EU (multi)",
    capacityUtilizationPct: 83,
    leadTimeWeeks: 7,
    leadTimeTrend: "flat",
    geopoliticalRisk: "low",
    rawMaterialRisk: "moderate",
    esgGrade: "A",
    notes: "Pharma SKUs prioritised — non-pharma lead-times extending.",
    lastUpdated: STAMP,
  },
  {
    manufacturer: "Mitani (sample)",
    region: "JP",
    capacityUtilizationPct: 87,
    leadTimeWeeks: 11,
    leadTimeTrend: "up",
    geopoliticalRisk: "moderate",
    rawMaterialRisk: "elevated",
    esgGrade: "B",
    notes: "JPY volatility + raw-aluminium tariff exposure (~6%).",
    lastUpdated: STAMP,
  },
  {
    manufacturer: "Silgan Dispensing (sample)",
    region: "US",
    capacityUtilizationPct: 88,
    leadTimeWeeks: 8,
    leadTimeTrend: "up",
    geopoliticalRisk: "low",
    rawMaterialRisk: "moderate",
    esgGrade: "B",
    notes: "Cleanroom capacity for pharma fills booked through Q4 2026.",
    lastUpdated: STAMP,
  },
];

export interface MaterialAlert {
  material: string;
  status: RiskBand;
  movementPct: number;
  driver: string;
}

export const MATERIAL_ALERTS: MaterialAlert[] = [
  {
    material: "Polypropylene (homopolymer)",
    status: "moderate",
    movementPct: 4.2,
    driver: "Propylene contracts up; pass-through expected on Q3 quotes.",
  },
  {
    material: "Aluminium can stock",
    status: "elevated",
    movementPct: 6.8,
    driver: "Section-232 tariff renewal + EU CBAM phase-in.",
  },
  {
    material: "Brass (valve stems)",
    status: "low",
    movementPct: -1.1,
    driver: "Copper softening 1.1% MoM; brass alloy follows with 30-day lag.",
  },
  {
    material: "PET resin",
    status: "moderate",
    movementPct: 3.6,
    driver: "European recycled-content quota tightening.",
  },
  {
    material: "Nitrile rubber (NBR) seals",
    status: "elevated",
    movementPct: 5.4,
    driver: "Acrylonitrile supply tight; pharma-grade allocation prioritised.",
  },
];
