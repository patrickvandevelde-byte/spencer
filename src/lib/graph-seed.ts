// Seed data for the graph — used as the fallback shape when
// DATABASE_URL is unset and as the additive baseline on top of
// live contributions. Sprint 1 shipped these as static numbers
// on `/graph`; Sprint 2 promotes them to a single source of
// truth that the live-density API can extend.

export type GraphDensity = {
  validatedTriples: number;
  unvalidatedPairs: number;
  catalogActuators: number;
  catalogFluids: number;
  catalogTarget6mo: number;
  catalogTarget18mo: number;
  contributors: number;
  contributionsLast7d: number;
  contributionsLast30d: number;
  predictiveConsensusRate: number;
  densityHistory: number[];
  topFluids: { name: string; validations: number; trend: string }[];
  topActuators: { sku: string; name: string; validations: number }[];
  // True when figures came from the database; false for seeded baseline.
  live: boolean;
  // True when at least one contribution has been added on top.
  augmented: boolean;
};

export const GRAPH_SEED: GraphDensity = {
  validatedTriples: 247,
  unvalidatedPairs: 428,
  catalogActuators: 27,
  catalogFluids: 25,
  catalogTarget6mo: 200,
  catalogTarget18mo: 2000,
  contributors: 18,
  contributionsLast7d: 31,
  contributionsLast30d: 124,
  predictiveConsensusRate: 0.62,
  densityHistory: [142, 148, 156, 161, 169, 178, 185, 198, 209, 221, 234, 247],
  topFluids: [
    { name: 'Ethanol (anhydrous)', validations: 38, trend: '+4' },
    { name: 'Isopropyl alcohol 70%', validations: 31, trend: '+2' },
    { name: 'Deionized water', validations: 27, trend: '+3' },
    { name: 'Propylene glycol', validations: 21, trend: '+1' },
    { name: 'Glycerin (anhydrous)', validations: 18, trend: '+2' },
    { name: 'Hexylene glycol', validations: 14, trend: '0' },
    { name: 'Cyclomethicone D5', validations: 12, trend: '+1' },
    { name: 'Acetone', validations: 11, trend: '0' },
  ],
  topActuators: [
    { sku: 'SP-MBU-018', name: 'Mechanical Break-Up · 0.018″', validations: 29 },
    { sku: 'SP-MBU-022', name: 'Mechanical Break-Up · 0.022″', validations: 24 },
    { sku: 'SP-FAN-035', name: 'Flat Fan · 0.035″', validations: 21 },
    { sku: 'SP-FOAM-040', name: 'Foam Generator · 0.040″', validations: 18 },
    { sku: 'SP-MIST-014', name: 'Fine Mist · 0.014″', validations: 16 },
    { sku: 'SP-CONE-028', name: 'Hollow Cone · 0.028″', validations: 14 },
  ],
  live: false,
  augmented: false,
};
