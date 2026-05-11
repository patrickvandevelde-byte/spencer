import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// cXML PunchOutSetupRequest (Ariba) and OCI v4 (Coupa / SAP SRM)
// share enough shape that we accept either dialect. This stub
// echoes a session URL + payload-id and logs the inbound; the
// production handler will sign + redirect into a tenant-scoped
// catalog session.
const PunchoutSchema = z.object({
  protocol: z.enum(['cxml', 'oci']),
  buyerCookie: z.string().min(1).max(200),
  fromIdentity: z.string().min(1).max(200),
  returnUrl: z.string().url().max(500),
  payloadId: z.string().optional(),
});

export async function GET() {
  // Used by procurement teams to test connectivity before
  // committing to the integration.
  return NextResponse.json({
    ok: true,
    service: 'AeroSpec PunchOut',
    protocols: ['cXML 1.2.045', 'OCI 4.0'],
    endpoint: '/api/punchout',
    documentation: '/integrations/erp',
    healthcheckTimestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = PunchoutSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Stub: log + return a signed-style session URL.
  // TODO(prod): mint signed JWT, persist BuyerCookie, redirect to
  // tenant-scoped catalog view with PunchOutOrderMessage callback.
  console.info('[punchout]', {
    protocol: data.protocol,
    from: data.fromIdentity,
    receivedAt: new Date().toISOString(),
  });

  const sessionId = `punchout_${Date.now().toString(36)}`;
  const startPage = new URL(
    request.nextUrl.origin + '/catalog?punchout=' + sessionId
  );
  return NextResponse.json(
    {
      ok: true,
      mode: 'stub',
      protocol: data.protocol,
      payloadId:
        data.payloadId ?? `${Date.now()}.${Math.random().toString(36).slice(2)}@aerospec.io`,
      buyerCookie: data.buyerCookie,
      startPage: startPage.toString(),
      returnTo: data.returnUrl,
      // Procurement teams test this with curl before the
      // architecture review meeting — keep the response shape stable.
      note:
        'Stub endpoint. Wire to the tenant catalog session with signed JWT before launch.',
    },
    { status: 202 }
  );
}
