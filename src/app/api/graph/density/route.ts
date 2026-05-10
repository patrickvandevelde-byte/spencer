import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/db/client';
import { graphContributions } from '@/db/contributions-schema';
import { GRAPH_SEED, type GraphDensity } from '@/lib/graph-seed';

export const dynamic = 'force-dynamic';

// Live counters layered on top of the Sprint-1 seed baseline.
// Until contribution volume catches up to the seed numbers the
// public-facing figures are seed + delta — this keeps the
// narrative honest without resetting the headline to zero on
// the day the schema ships.
export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(GRAPH_SEED);
  }

  try {
    const [counts] = await db
      .select({
        total: sql<number>`count(*)::int`,
        validated: sql<number>`count(*) filter (where ${graphContributions.benchTested} = 'yes')::int`,
        last7d: sql<number>`count(*) filter (where ${graphContributions.createdAt} > now() - interval '7 days')::int`,
        last30d: sql<number>`count(*) filter (where ${graphContributions.createdAt} > now() - interval '30 days')::int`,
        contributors: sql<number>`count(distinct coalesce(${graphContributions.userId}::text, ${graphContributions.ipHash}))::int`,
      })
      .from(graphContributions);

    const augmented: GraphDensity = {
      ...GRAPH_SEED,
      validatedTriples: GRAPH_SEED.validatedTriples + (counts?.validated ?? 0),
      unvalidatedPairs: Math.max(
        0,
        GRAPH_SEED.unvalidatedPairs - (counts?.validated ?? 0)
      ),
      contributors: GRAPH_SEED.contributors + (counts?.contributors ?? 0),
      contributionsLast7d: GRAPH_SEED.contributionsLast7d + (counts?.last7d ?? 0),
      contributionsLast30d:
        GRAPH_SEED.contributionsLast30d + (counts?.last30d ?? 0),
      live: true,
      augmented: (counts?.total ?? 0) > 0,
    };

    return NextResponse.json(augmented);
  } catch (error) {
    console.error('graph density query failed', error);
    return NextResponse.json(GRAPH_SEED);
  }
}
