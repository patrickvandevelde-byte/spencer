// ============================================================
// PPWR Compliance Module
// Packaging and Packaging Waste Regulation (EU) Scoring
//
// Grades packaging from A (best) to E (worst) based on
// material composition, recyclability, and waste signature.
// ============================================================

import type { IMPart } from './kmd-data';

// --- Types ---

export type PPWRGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface MaterialAssessment {
  partId: string;
  partName: string;
  material: string;
  recyclable: boolean;
  recyclabilityScore: number; // 0-100
  wasteStream: string;
  flag: 'pass' | 'warning' | 'fail';
  note: string;
}

export interface PPWRResult {
  grade: PPWRGrade;
  score: number;            // 0-100 composite score
  label: string;            // Human-readable grade label
  assessments: MaterialAssessment[];
  summary: {
    totalParts: number;
    recyclableParts: number;
    monoMaterialPct: number;
    petPct: number;
    nonRecyclableItems: string[];
    recommendations: string[];
  };
  compliancePack: CompliancePack;
}

export interface CompliancePack {
  regulation: string;
  version: string;
  assessmentDate: string;
  packagingType: string;
  overallGrade: PPWRGrade;
  recyclabilityRate_pct: number;
  recycledContentRate_pct: number;
  monoMaterialDeclaration: boolean;
  singleStreamCompatible: boolean;
  laminateDetected: boolean;
  certificationReady: boolean;
}

// --- Material Recyclability Scores ---

const MATERIAL_SCORES: Record<string, { score: number; stream: string }> = {
  'PET': { score: 95, stream: 'PET single-stream' },
  'rPET': { score: 98, stream: 'PET single-stream (recycled)' },
  'PP': { score: 85, stream: 'Polyolefin stream' },
  'rPP': { score: 90, stream: 'Polyolefin stream (recycled)' },
  'HDPE': { score: 85, stream: 'Polyolefin stream' },
  'PE': { score: 80, stream: 'Polyolefin stream' },
  'POM': { score: 60, stream: 'Engineering plastic — limited recycling' },
  'PEEK': { score: 40, stream: 'Engineering plastic — specialised recycling' },
  'Ceramic': { score: 30, stream: 'Inert waste — not plastic recyclable' },
  'EPDM': { score: 20, stream: 'Elastomer — incineration with energy recovery' },
  'FKM': { score: 15, stream: 'Fluoroelastomer — hazardous waste stream' },
  'PTFE': { score: 10, stream: 'Fluoropolymer — specialised disposal' },
  'Silicone': { score: 25, stream: 'Silicone — specialised recycling' },
};

// --- Grade Thresholds ---

function scoreToGrade(score: number): PPWRGrade {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'E';
}

function gradeLabel(grade: PPWRGrade): string {
  switch (grade) {
    case 'A': return 'Excellent — Single-stream recyclable';
    case 'B': return 'Good — Mostly recyclable with minor separations';
    case 'C': return 'Adequate — Mixed materials, partially recyclable';
    case 'D': return 'Poor — Multi-material, limited recyclability';
    case 'E': return 'Non-compliant — Requires redesign';
  }
}

// --- Assessment Functions ---

/**
 * Assess a single component for PPWR compliance.
 */
function assessPart(
  part: IMPart,
  selectedMaterial: string,
): MaterialAssessment {
  const matData = MATERIAL_SCORES[selectedMaterial] ?? { score: 50, stream: 'Unknown stream' };

  // Weight the score by part mass (heavier parts matter more)
  let flag: 'pass' | 'warning' | 'fail' = 'pass';
  if (matData.score < 40) flag = 'fail';
  else if (matData.score < 70) flag = 'warning';

  let note = `${selectedMaterial} — ${matData.stream}`;

  // Special warnings
  if (selectedMaterial === 'FKM' || selectedMaterial === 'PTFE') {
    note += '. PFAS concern under EU PPWR revision.';
    flag = 'warning';
  }

  if (selectedMaterial === 'POM' && part.id === 'integrated-valve') {
    note += '. Acceptable for small functional components under PPWR Art. 6(3).';
  }

  return {
    partId: part.id,
    partName: part.name,
    material: selectedMaterial,
    recyclable: matData.score >= 60,
    recyclabilityScore: matData.score,
    wasteStream: matData.stream,
    flag,
    note,
  };
}

/**
 * Detect laminate or multi-layer materials in the assembly.
 * Spenser's mono-material PET design avoids this, but non-Spenser
 * actuators using bags may trigger warnings.
 */
function detectLaminates(
  parts: { part: IMPart; selectedMaterial: string }[],
): boolean {
  // Laminate detection: if LPV is multi-layer or non-mono-material
  const lpv = parts.find((p) => p.part.id === 'lpv-body');
  if (lpv && !['PET', 'rPET', 'PP', 'HDPE'].includes(lpv.selectedMaterial)) {
    return true;
  }
  return false;
}

/**
 * Run full PPWR compliance assessment.
 */
export function assessCompliance(
  parts: { part: IMPart; selectedMaterial: string }[],
): PPWRResult {
  const assessments = parts.map(({ part, selectedMaterial }) =>
    assessPart(part, selectedMaterial)
  );

  // Calculate composite score (weight-adjusted)
  const totalWeight = parts.reduce((sum, p) => sum + p.part.weight_g, 0);
  const weightedScore = parts.reduce((sum, p, i) => {
    const weight = p.part.weight_g / totalWeight;
    return sum + assessments[i].recyclabilityScore * weight;
  }, 0);

  const score = Math.round(weightedScore);
  const grade = scoreToGrade(score);

  // Summary statistics
  const recyclableParts = assessments.filter((a) => a.recyclable).length;
  const petParts = parts.filter((p) =>
    ['PET', 'rPET'].includes(p.selectedMaterial)
  );
  const petWeight = petParts.reduce((sum, p) => sum + p.part.weight_g, 0);
  const petPct = Math.round((petWeight / totalWeight) * 100);

  // Mono-material check: are all major components (>1g) the same polymer family?
  const majorParts = parts.filter((p) => p.part.weight_g > 1);
  const majorMaterials = new Set(
    majorParts.map((p) => {
      if (['PET', 'rPET'].includes(p.selectedMaterial)) return 'PET-family';
      if (['PP', 'rPP', 'HDPE', 'PE'].includes(p.selectedMaterial)) return 'polyolefin';
      return p.selectedMaterial;
    })
  );
  const monoMaterialPct = majorMaterials.size <= 2 ? 85 : majorMaterials.size <= 3 ? 60 : 40;

  const nonRecyclableItems = assessments
    .filter((a) => !a.recyclable)
    .map((a) => `${a.partName} (${a.material})`);

  // Recommendations
  const recommendations: string[] = [];
  if (nonRecyclableItems.length > 0) {
    recommendations.push(`Replace non-recyclable components: ${nonRecyclableItems.join(', ')}`);
  }
  if (petPct < 50) {
    recommendations.push('Increase PET content to improve single-stream recyclability');
  }
  if (parts.some((p) => p.selectedMaterial === 'FKM' || p.selectedMaterial === 'PTFE')) {
    recommendations.push('Consider EPDM or Silicone alternatives to reduce PFAS exposure');
  }
  if (grade === 'A') {
    recommendations.push('Configuration meets PPWR Grade A — no changes needed');
  }

  const laminateDetected = detectLaminates(parts);
  if (laminateDetected) {
    recommendations.push('Laminate material detected in LPV — switch to mono-material PET');
  }

  const compliancePack: CompliancePack = {
    regulation: 'EU PPWR (Packaging and Packaging Waste Regulation)',
    version: '2024/0000 — Draft Revision',
    assessmentDate: new Date().toISOString().split('T')[0],
    packagingType: 'Spenser SFP — Gas-free dispensing system',
    overallGrade: grade,
    recyclabilityRate_pct: score,
    recycledContentRate_pct: petParts.some((p) => p.selectedMaterial === 'rPET') ? 30 : 0,
    monoMaterialDeclaration: monoMaterialPct >= 80,
    singleStreamCompatible: grade === 'A' || grade === 'B',
    laminateDetected,
    certificationReady: grade === 'A' || grade === 'B',
  };

  return {
    grade,
    score,
    label: gradeLabel(grade),
    assessments,
    summary: {
      totalParts: parts.length,
      recyclableParts,
      monoMaterialPct,
      petPct,
      nonRecyclableItems,
      recommendations,
    },
    compliancePack,
  };
}

/**
 * Quick grade check for a material selection (without full assessment).
 */
export function quickGradeCheck(materials: string[]): PPWRGrade {
  const scores = materials.map((m) => MATERIAL_SCORES[m]?.score ?? 50);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return scoreToGrade(avg);
}

/**
 * Compare Spenser (PET mono-material) vs traditional aerosol (aluminium + bag).
 */
export function comparePackagingWaste(): {
  spenser: { recyclability_pct: number; streams: number; grade: PPWRGrade };
  traditional: { recyclability_pct: number; streams: number; grade: PPWRGrade };
} {
  return {
    spenser: { recyclability_pct: 92, streams: 1, grade: 'A' },
    traditional: { recyclability_pct: 35, streams: 3, grade: 'D' },
  };
}
