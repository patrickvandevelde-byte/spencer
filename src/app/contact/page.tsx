"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CALENDLY_URL } from "@/components/CalendlyButton";

type Topic =
  | "sales"
  | "pharma"
  | "enterprise"
  | "partners"
  | "trust"
  | "design-partner"
  | "support"
  | "other";

const TOPIC_LABELS: Record<Topic, string> = {
  sales: "Sales — Indie / Starter / Pro",
  pharma: "Pharma SaaS validation",
  enterprise: "Enterprise — VPC / SSO / ERP punch-out",
  partners: "Supplier or partnership inquiry",
  trust: "Security questionnaire / DPA / sub-processors",
  "design-partner": "Become a design partner (open beta)",
  support: "Technical support",
  other: "Other",
};

const VALID_TOPICS = Object.keys(TOPIC_LABELS) as Topic[];

function ContactForm() {
  const params = useSearchParams();
  const incoming = params.get("topic");
  const initialTopic: Topic = VALID_TOPICS.includes(incoming as Topic)
    ? (incoming as Topic)
    : "sales";

  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [name, setName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ ok: boolean; msg: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          name: name.trim(),
          workEmail: workEmail.trim(),
          company: company.trim() || null,
          message: message.trim(),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok && res.status !== 202) {
        setDone({ ok: false, msg: json.error ?? "Submission failed" });
      } else {
        setDone({
          ok: true,
          msg:
            json.message ??
            "Received. A human will reply within 1 business day.",
        });
      }
    } catch {
      setDone({ ok: false, msg: "Network error — please retry." });
    } finally {
      setSubmitting(false);
    }
  }

  if (done?.ok) {
    return (
      <div
        className="rounded-2xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)]/10 text-2xl text-[var(--success)]">
          ✓
        </div>
        <h2 className="mb-2 text-xl font-semibold text-[var(--fg-bright)]">
          Thanks — we&rsquo;ve got it.
        </h2>
        <p className="mx-auto max-w-md text-sm text-[var(--fg-secondary)]">
          {done.msg}
        </p>
        <p className="mt-4 text-xs text-[var(--muted)]">
          Want to skip the queue?{" "}
          <a
            href={CALENDLY_URL}
            className="text-[var(--accent)] no-underline hover:underline"
          >
            Book 30 minutes &rarr;
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
      <div>
        <label htmlFor="topic" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          What&rsquo;s this about?
        </label>
        <select
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value as Topic)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none"
        >
          {VALID_TOPICS.map((t) => (
            <option key={t} value={t}>
              {TOPIC_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Your name
          </label>
          <input
            id="name"
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="workEmail" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Work email
          </label>
          <input
            id="workEmail"
            type="email"
            required
            maxLength={255}
            value={workEmail}
            onChange={(e) => setWorkEmail(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Company <span className="text-[var(--muted)] normal-case">(optional)</span>
        </label>
        <input
          id="company"
          type="text"
          maxLength={160}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          What do you want us to know?
        </label>
        <textarea
          id="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="A few sentences on the use case, fluid class, volume range, or specific question."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      {done && !done.ok && (
        <p className="text-xs text-[var(--danger)]">{done.msg}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-[var(--muted)]">
          We reply within 1 business day. No newsletter, no drip, no resale.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="space-y-12 py-8">
      <section className="mx-auto max-w-2xl text-center animate-in">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--fg-secondary)]">
            Contact
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--fg-bright)]">
          Get a real reply.
        </h1>
        <p className="mx-auto max-w-md text-base leading-relaxed text-[var(--fg-secondary)]">
          One inbox, one human queue. Pick the topic that fits and we&rsquo;ll
          route it. For Enterprise / Pharma evaluations,{" "}
          <a
            href={CALENDLY_URL}
            className="text-[var(--accent)] no-underline hover:underline"
          >
            book 30 minutes
          </a>{" "}
          instead.
        </p>
      </section>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-sm text-[var(--muted)]">Loading form…</p>
          </div>
        }
      >
        <ContactForm />
      </Suspense>

      <section className="mx-auto max-w-3xl">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Security & DPA",
              body:
                "Questionnaires, sub-processors, data residency. See /trust first; ping us via the form (topic = Trust) for anything not covered.",
              href: "/trust",
              cta: "Read the trust page",
            },
            {
              title: "Pricing & seats",
              body:
                "Six tiers from Free to Enterprise. Configurations are unmetered on every tier.",
              href: "/pricing",
              cta: "See pricing",
            },
            {
              title: "Become a design partner",
              body:
                "Open-beta program: free Pro-tier access, weekly office hours, direct line to the founders.",
              href: "/contact?topic=design-partner",
              cta: "Apply",
            },
          ].map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 no-underline transition-all hover:border-[var(--border-hover)]"
            >
              <p className="mb-2 text-sm font-semibold text-[var(--fg-bright)]">
                {c.title}
              </p>
              <p className="mb-3 text-xs leading-relaxed text-[var(--fg-secondary)]">
                {c.body}
              </p>
              <p className="text-[11px] font-medium text-[var(--accent)]">
                {c.cta} &rarr;
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
