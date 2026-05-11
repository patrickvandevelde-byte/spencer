"use client";

import { useState } from "react";

type Source = "aerospec" | "spenser";
type BenchTested = "yes" | "no" | "planned";
type PredictionMatch = "matched" | "partial" | "mismatch" | "n/a";

interface FeedbackWidgetProps {
  source: Source;
  configKey: string;
  configSummary: Record<string, unknown>;
  // Compact variant hides the headline / blurb for embedding
  // inside larger result panels.
  compact?: boolean;
}

interface SubmitState {
  ok: boolean;
  mode?: "live" | "demo";
  error?: string;
}

export function FeedbackWidget({
  source,
  configKey,
  configSummary,
  compact = false,
}: FeedbackWidgetProps) {
  const [benchTested, setBenchTested] = useState<BenchTested | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [predictionMatch, setPredictionMatch] =
    useState<PredictionMatch | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<SubmitState | null>(null);

  // The flow is intentionally short-circuitable: the moment a
  // user clicks a thumb/star or a bench-test option we already
  // have a useful signal. Submit is enabled as soon as one of
  // the two primary controls has a value.
  const canSubmit = benchTested !== null || rating !== null;

  async function submit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          configKey,
          configSummary,
          benchTested: benchTested ?? "planned",
          rating,
          predictionMatch:
            predictionMatch ?? (benchTested === "yes" ? "matched" : "n/a"),
          notes: notes.trim() || null,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as SubmitState & {
        message?: string;
      };
      if (!res.ok && res.status !== 202) {
        setSubmitted({ ok: false, error: json.error ?? "Submission failed" });
      } else {
        setSubmitted({ ok: true, mode: json.mode });
      }
    } catch {
      setSubmitted({ ok: false, error: "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted?.ok) {
    return (
      <div
        className="rounded-2xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-5"
        role="status"
        aria-live="polite"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--success)]">
          Contribution recorded
        </p>
        <p className="mt-1 text-sm text-[var(--fg-bright)]">
          Thanks — the graph just got a little denser.
          {submitted.mode === "demo" && (
            <span className="ml-1 text-[var(--muted)]">
              (Demo mode: not persisted yet.)
            </span>
          )}
        </p>
        <p className="mt-2 text-xs text-[var(--fg-secondary)]">
          See aggregated impact on the{" "}
          <a
            href="/graph"
            className="text-[var(--accent)] underline-offset-2 hover:underline"
          >
            graph density page
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/[0.04] p-5">
      {!compact && (
        <div className="mb-4">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
            Help the graph learn
          </p>
          <h3 className="text-base font-semibold text-[var(--fg-bright)]">
            Did you bench-test this configuration?
          </h3>
          <p className="mt-1 text-xs text-[var(--fg-secondary)]">
            One click is enough. Every signal — even &ldquo;not yet&rdquo; —
            sharpens predictions for the next user.
          </p>
        </div>
      )}

      {/* Bench-test capture */}
      <fieldset className="mb-4">
        <legend className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Bench-tested
        </legend>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "yes" as const, label: "Yes — tested it" },
            { value: "planned" as const, label: "Plan to" },
            { value: "no" as const, label: "Won’t test" },
          ].map((opt) => {
            const active = benchTested === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setBenchTested(opt.value)}
                aria-pressed={active}
                className={
                  active
                    ? "rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white"
                    : "rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--fg)] hover:border-[var(--border-hover)]"
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 1-click rating */}
      <fieldset className="mb-4">
        <legend className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Rate the recommendation
        </legend>
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = rating !== null && n <= rating;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                className="text-xl leading-none transition-transform hover:scale-110"
              >
                <span style={{ color: active ? "var(--accent)" : "var(--border)" }}>
                  ★
                </span>
              </button>
            );
          })}
          {rating !== null && (
            <button
              type="button"
              onClick={() => setRating(null)}
              className="ml-2 text-[10px] text-[var(--muted)] underline-offset-2 hover:underline"
            >
              clear
            </button>
          )}
        </div>
      </fieldset>

      {/* Prediction match — only shows when bench-tested = yes */}
      {benchTested === "yes" && (
        <fieldset className="mb-4">
          <legend className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Did the prediction match the bench?
          </legend>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "matched" as const, label: "Matched" },
              { value: "partial" as const, label: "Close" },
              { value: "mismatch" as const, label: "Off" },
            ].map((opt) => {
              const active = predictionMatch === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPredictionMatch(opt.value)}
                  aria-pressed={active}
                  className={
                    active
                      ? "rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white"
                      : "rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--fg)] hover:border-[var(--border-hover)]"
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Optional free-text */}
      <details className="mb-4 group">
        <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--fg)]">
          Add a note (optional)
        </summary>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything off? Surprising? A correction we should know?"
          maxLength={2000}
          rows={3}
          className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </details>

      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] leading-relaxed text-[var(--muted)]">
          Submissions are anonymous unless you&rsquo;re signed in. No PII; just
          rheology, hardware, outcome.
        </p>
        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={submit}
          className={
            canSubmit && !submitting
              ? "shrink-0 rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white hover:opacity-90"
              : "shrink-0 cursor-not-allowed rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--muted)]"
          }
        >
          {submitting ? "Sending…" : "Submit"}
        </button>
      </div>

      {submitted && !submitted.ok && (
        <p className="mt-3 text-xs text-[var(--danger)]">
          {submitted.error ?? "Submission failed — try again."}
        </p>
      )}
    </div>
  );
}
