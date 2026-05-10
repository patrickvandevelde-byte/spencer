import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";

export const metadata = {
  title: "Procurement-Grade Billing — AeroSpec",
  description:
    "Net-30 terms, PO-driven checkout, tax-exempt handling, and invoice-by-email for buyers who can't checkout with a corporate card.",
};

const TERMS = [
  {
    label: "Payment terms",
    body: "Net-30, Net-60 (Enterprise), or pre-paid by wire. Net-15 default on first order for new tenants.",
    detail: "Late-payment grace: 7 days; thereafter 1.5%/mo per US-UCC §2-201 or local equivalent (EU/UK pages localised).",
  },
  {
    label: "Tax handling",
    body: "VAT / GST / sales-tax computed at line; exemption certificates accepted at signup or per-PO.",
    detail: "Stripe Tax for standard rates; manual review for exemption certs within 1 business day.",
  },
  {
    label: "PO-first checkout",
    body: "Submit PO number at checkout; cart freezes pricing for 14 days while AP processes the PO.",
    detail: "Auto-conversion to invoice on PO confirmation; no card capture required.",
  },
  {
    label: "Invoice delivery",
    body: "PDF + structured CSV via email + S/FTP for SAP / Oracle ingestion.",
    detail: "Optional Peppol / e-invoicing for EU tenants (PINT BIS Billing 3.0).",
  },
  {
    label: "Approved Vendor onboarding",
    body: "We respond to security questionnaires + Vendor Master forms within 5 business days.",
    detail: "W-9 / W-8BEN-E, banking details, SOC 2 (Q4 2026), insurance certificates available on request.",
  },
  {
    label: "Credit application",
    body: "Up to $50k trade credit on Pro tier; up to $250k on Enterprise after credit check.",
    detail: "Reference checks; D&B number required for >$50k. Pharma SaaS unsecured up to $100k.",
  },
];

const FAQ = [
  {
    q: "Can we pay by wire / ACH / SEPA instead of card?",
    a: "Yes — wire, ACH, and SEPA are all supported. Card is fine for Sample / Pilot orders but unsuitable for the production-PO marketplace where AP teams own the budget line.",
  },
  {
    q: "Do you support per-PO invoicing rather than monthly statements?",
    a: "Yes. Every production order generates a discrete invoice with PO reference, ship-to, and line-item breakdown (including the 2–4% marketplace fee as a separate line). Monthly statement is a parallel summary; the per-PO invoice is the legal document.",
  },
  {
    q: "How do you handle our 3-way match (PO / receipt / invoice)?",
    a: "Each invoice includes the PO number, shipment tracking, and goods-received timestamp. ASN (Advance Ship Notice) export available for SAP integration. EDI 856 supported on Enterprise via Ariba or Coupa punch-out.",
  },
  {
    q: "What about Stripe Tax for international VAT?",
    a: "Yes — VAT MOSS for EU, GST for AU/CA, JCT for Japan. Reverse-charge handled automatically for B2B EU invoices. Exemption certs override Stripe Tax when on file.",
  },
  {
    q: "We're a non-profit / educational institution. Do you offer tax-exempt treatment?",
    a: "Yes. Upload your 501(c)(3) determination letter (US), VAT exemption certificate (EU), or equivalent at signup. Exemption applies tenant-wide.",
  },
  {
    q: "What happens at end-of-term if we churn?",
    a: "30-day data-export window, then production tenant wipe per the DPA. Outstanding invoices remain payable per the original terms; no clawback of paid-in subscription.",
  },
];

export default function BillingProcurementPage() {
  return (
    <div className="space-y-12 py-8">
      <BetaBanner />

      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            Procurement-grade billing
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Built for AP teams,
          <br />
          not for corporate cards.
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--fg-secondary)]">
          Net-30 terms, PO-driven checkout, structured invoices, tax
          exemption, EDI / Peppol &mdash; the pieces a procurement manager
          (Persona P7) explicitly told us were &ldquo;non-negotiable.&rdquo;
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {TERMS.map((t) => (
          <div
            key={t.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              {t.label}
            </p>
            <p className="mb-2 text-sm font-semibold text-[var(--fg-bright)]">
              {t.body}
            </p>
            <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
              {t.detail}
            </p>
          </div>
        ))}
      </section>

      {/* Sample invoice mock */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Sample invoice
        </p>
        <h2 className="mb-4 text-base font-semibold text-[var(--fg-bright)]">
          What an AeroSpec production-PO invoice looks like
        </h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 font-mono text-[11px] leading-relaxed text-[var(--fg-secondary)]">
          <pre className="whitespace-pre">{`AeroSpec Marketplace                          INVOICE INV-2026-04217
Bill to:    {{customer.legal_name}}            Issued: 2026-05-10
            {{customer.bill_to_address}}        Due:    2026-06-09 (Net-30)
PO ref:     {{customer.po_number}}              Terms:  Net-30 wire / ACH

LINE  SKU            QTY     UNIT     EXTENDED
1     SP-MBU-018     50,000  $ 0.082  $ 4,100.00     [supplier: Coster — pass-through]
2     SP-FAN-035     20,000  $ 0.094  $ 1,880.00     [supplier: Coster — pass-through]
                                       --------
                              Subtotal $ 5,980.00

      Marketplace fee (2.5%)           $   149.50     ← line-item, never hidden
      VAT (0% — B2B reverse charge)    $     0.00
                                       --------
                              TOTAL    $ 6,129.50

Remit to:  AeroSpec, Inc.  ·  ABA / SWIFT / IBAN on file
Reference: INV-2026-04217  ·  PO {{customer.po_number}}
Questions: /contact?topic=trust`}</pre>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-[var(--muted)]">
          Marketplace fee is a discrete line. Supplier unit price is the
          actual pass-through cost &mdash; never marked up internally.
          Production POs use 2&ndash;4% &middot; Sample / pilot uses
          10&ndash;15% baked into list (see{" "}
          <Link
            href="/pricing"
            className="text-[var(--accent)] underline-offset-2 hover:underline"
          >
            pricing
          </Link>
          ).
        </p>
      </section>

      {/* Integration matrix */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Integration matrix
        </p>
        <h2 className="mb-4 text-base font-semibold text-[var(--fg-bright)]">
          AP workflow plumbing per tier
        </h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Capability
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Indie
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Starter
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Pro
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Card / SEPA / ACH", "✓", "✓", "✓", "✓"],
                ["Wire transfer", "—", "✓", "✓", "✓"],
                ["Net-15 / Net-30", "—", "Net-15", "Net-30", "Net-30 / Net-60"],
                ["PO-driven checkout", "—", "✓", "✓", "✓"],
                ["Tax-exempt handling", "✓", "✓", "✓", "✓"],
                ["Per-PO invoicing (CSV+PDF)", "—", "—", "✓", "✓"],
                ["Peppol / e-invoicing (EU)", "—", "—", "—", "✓"],
                ["EDI 810 / 856 / 850", "—", "—", "—", "✓"],
                ["Ariba / Coupa punch-out", "—", "—", "—", "✓"],
                ["3-way match (PO / GR / Invoice)", "—", "—", "✓", "✓"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-[var(--border)]">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-4 py-2 ${j === 0 ? "text-[var(--fg-bright)] font-medium" : "text-center text-[var(--fg-secondary)]"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[var(--fg-bright)]">
          Procurement FAQ
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
          Vendor Master form or AP setup paperwork to file?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact?topic=enterprise"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white no-underline hover:opacity-90"
          >
            Send us your AP packet
          </Link>
          <Link
            href="/trust"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Trust &amp; Compliance
          </Link>
          <Link
            href="/integrations/erp"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--fg)] no-underline hover:border-[var(--border-hover)]"
          >
            Ariba / Coupa punch-out
          </Link>
        </div>
        <p className="mt-3 text-[11px] text-[var(--muted)]">
          Last updated 2026-05-10 &middot; terms apply to new tenants from
          this date; existing tenants migrate at renewal.
        </p>
      </section>
    </div>
  );
}
