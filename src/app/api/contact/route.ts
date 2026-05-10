import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ContactSchema = z.object({
  topic: z.enum([
    'sales',
    'pharma',
    'enterprise',
    'partners',
    'trust',
    'design-partner',
    'support',
    'other',
  ]),
  name: z.string().min(1).max(120),
  workEmail: z.string().email().max(255),
  company: z.string().max(160).optional().nullable(),
  message: z.string().min(10).max(5000),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Stub: log to server stdout. Replace with a Resend / Slack /
  // CRM webhook before launch — schema is stable, swap is local.
  // TODO(prod): wire to {{contact_inbox}} when contact email is set.
  console.info('[contact]', {
    topic: data.topic,
    name: data.name,
    email: data.workEmail,
    company: data.company ?? null,
    messageLen: data.message.length,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json(
    {
      ok: true,
      mode: 'stub',
      message:
        'Received. A human will reply within 1 business day at the email provided.',
    },
    { status: 202 }
  );
}
