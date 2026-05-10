import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { z } from 'zod';
import { db } from '@/db/client';
import { graphContributions } from '@/db/contributions-schema';

const ContributionSchema = z.object({
  source: z.enum(['aerospec', 'spenser']),
  configKey: z.string().min(1).max(255),
  configSummary: z.record(z.string(), z.unknown()),
  benchTested: z.enum(['yes', 'no', 'planned']),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  predictionMatch: z.enum(['matched', 'partial', 'mismatch', 'n/a']),
  notes: z.string().max(2000).optional().nullable(),
});

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT ?? 'aerospec-graph-v1';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = ContributionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    null;
  const userAgent = request.headers.get('user-agent');

  // Graceful fallback: when DATABASE_URL isn't configured we
  // accept the contribution so the UI loop is exercisable, but
  // signal demo-mode so callers can show appropriate copy.
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        ok: true,
        mode: 'demo',
        message:
          'Contribution accepted in demo mode — connect DATABASE_URL to persist.',
      },
      { status: 202 }
    );
  }

  try {
    const [row] = await db
      .insert(graphContributions)
      .values({
        source: data.source,
        configKey: data.configKey,
        configSummary: data.configSummary,
        benchTested: data.benchTested,
        rating: data.rating ?? null,
        predictionMatch: data.predictionMatch,
        notes: data.notes ?? null,
        ipHash: hashIp(ip),
        userAgent: userAgent?.slice(0, 500) ?? null,
      })
      .returning({ id: graphContributions.id, createdAt: graphContributions.createdAt });

    return NextResponse.json({ ok: true, mode: 'live', id: row.id }, { status: 201 });
  } catch (error) {
    console.error('contribution insert failed', error);
    return NextResponse.json(
      { error: 'Failed to record contribution' },
      { status: 500 }
    );
  }
}
