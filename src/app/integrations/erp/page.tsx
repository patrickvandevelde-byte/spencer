import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

export const metadata = {
  title: "ERP Punch-out — Ariba / Coupa / SAP — AeroSpec",
  description:
    "cXML 1.2 and OCI 4.0 punch-out support for Ariba, Coupa, SAP SRM, and Oracle Procurement.",
};

const PROTOCOLS = [
  {
    name: "cXML 1.2.045",
    vendors: "SAP Ariba, Jaggaer, Basware",
    direction:
      "PunchOutSetupRequest → AeroSpec catalog session → PunchOutOrderMessage → buyer ERP",
    status: "Stub endpoint live",
    statusColor: "var(--accent)",
  },
  {
    name: "OCI 4.0",
    vendors: "Coupa, SAP SRM, Oracle Procurement",
    direction:
      "HOOK_URL handshake → AeroSpec catalog session → SAP shopping-cart POST → buyer ERP",
    status: "Stub endpoint live",
    statusColor: "var(--accent)",
  },
  {
    name: "Punchout 2 Go",
    vendors: "SciQuest, Ivalua, Coupa (legacy)",
    direction: "Wrapped cXML — translated by middleware",
    status: "Available via cXML",
    statusColor: "var(--accent)",
  },
  {
    name: "OAGIS BOD",
    vendors: "Oracle EBS, JD Edwards",
    direction: "ProcessPurchaseOrder / AcknowledgePO — async",
    status: "Roadmap · Q2 2027",
    statusColor: "var(--warning)",
  },
];

const FAQ = [
  {
    q: "Can we test the endpoint before signing an Enterprise contract?",
    a: "Yes. GET /api/punchout returns a health-check JSON for protocol negotiation. POST a sample PunchOutSetupRequest and you'll get a signed session URL back. Production sessions are tenant-scoped and JWT-signed; the stub on this branch returns a 202 + traceable session id.",
  },
  {
    q: "How is the marketplace fee surfaced inside the punch-out cart?",
    a: "It's an explicit line item on the PunchOutOrderMessage (cXML) / SAP cart POST (OCI). Code: MARKETPLACE_FEE_2_5PCT or MARKETPLACE_FEE_4PCT. The PO that lands in your ERP shows the same breakdown — never hidden in the unit price.",
  },
  {
    q: "Which fields does AeroSpec require from our identity payload?",
    a: "fromIdentity (your DUNS or vendor code), buyerCookie (your session id), returnUrl (where to POST the order back). Tenant binding happens via the buyer-domain field; we'll work with your AP team to set this during onboarding.",
  },
  {
    q: "Do you handle 3-way match callbacks?",
    a: "ASN (EDI 856) emitted on shipment; 810 invoice emitted on GR (goods-received) timestamp from your ERP. Webhook callback + signed HMAC for state changes; replay-safe via the BuyerCookie.",
  },
  {
    q: "What about SSO inside the punch-out session?",
    a: "Punch-out itself is SSO — the catalog session is bound to the user identity passed in the original Setup request. SAML / SCIM is for the standalone AeroSpec login when buyers navigate in directly.",
  },
];

export default function ErpIntegrationsPage() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            ERP Punch-out
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Ariba, Coupa, SAP, Oracle &mdash;
          <br />
          we plug into the cart you already use.
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--fg-secondary)]">
          Persona P6 was unambiguous: &ldquo;Never a transactional middleman
          on production volume. We can be a price-discovery tool feeding our
          SAP Ariba.&rdquo; This is that integration.
        </p>
      </section>

      {/* Protocol matrix */}
      <section className="grid gap-4 md:grid-cols-2">
        {PROTOCOLS.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-[var(--fg-bright)]">
                {p.name}
              </h3>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `color-mix(in srgb, ${p.statusColor} 12%, transparent)`,
                  color: p.statusColor,
                }}
              >
                {p.status}
              </span>
            </div>
            <p className="mb-2 text-xs text-[var(--muted)]">
              Vendors: <span className="text-[var(--fg-secondary)]">{p.vendors}</span>
            </p>
            <p className="text-[11px] leading-relaxed text-[var(--fg-secondary)]">
              <span className="text-[var(--muted)]">Flow:</span> {p.direction}
            </p>
          </div>
        ))}
      </section>

      {/* Endpoint test card */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Test the endpoint
        </p>
        <h2 className="mb-4 text-base font-semibold text-[var(--fg-bright)]">
          Procurement IT can curl us before the architecture review
        </h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 font-mono text-[11px] leading-relaxed text-[var(--fg-secondary)]">
          <pre className="whitespace-pre">{`# Health check (no auth — public protocol negotiation)
curl https://{{your-tenant}}.aerospec.io/api/punchout

# Sample PunchOutSetupRequest (cXML dialect)
curl -X POST https://{{your-tenant}}.aerospec.io/api/punchout \\
  -H 'Content-Type: application/json' \\
  -d '{
    "protocol": "cxml",
    "buyerCookie": "buyer-session-9c4f2",
    "fromIdentity": "{{your-DUNS}}",
    "returnUrl": "https://erp.{{your-domain}}/punchout/return",
    "payloadId": "1718000000.abc@{{your-domain}}"
  }'

# Response shape (stub today, JWT-signed in production)
{
  "ok": true,
  "protocol": "cxml",
  "payloadId": "...",
  "buyerCookie": "buyer-session-9c4f2",
  "startPage": "https://...aerospec.io/catalog?punchout=punchout_abc123",
  "returnTo": "https://erp.{{your-domain}}/punchout/return"
}`}</pre>
        </div>
        <p className="mt-3 text-[11px] text-[var(--muted)]">
          The endpoint is rate-limited but unauthenticated for testing.
          Production sessions require tenant-bound JWT &mdash; provisioned
          during Enterprise onboarding.
        </p>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
          Integration FAQ
        </h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--border-hover)]"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-[var(--fg-bright)]">
                {item.q}
                <span className="text-[var(--muted)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--fg-secondary)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <p className="mb-3 text-sm text-[var(--fg-bright)]">
          Ready for an architecture review with your procurement IT?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact?topic=enterprise"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white no-underline hover:opacity-90"
          >
            Book a session
          </Link>
          <Link
            href="/billing/procurement"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Net-30 + invoicing terms
          </Link>
        </div>
      </section>
    </div>
  );
}
