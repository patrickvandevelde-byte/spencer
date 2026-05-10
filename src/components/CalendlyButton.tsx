import Link from "next/link";

// Single source of truth for the placeholder Calendly URL.
// Replace before launch by setting NEXT_PUBLIC_CALENDLY_URL or
// editing the constant directly.
export const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ??
  "https://calendly.com/{{calendly_handle}}/30min";

type Props = {
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export function CalendlyButton({
  label = "Book 30 min",
  variant = "secondary",
  className = "",
}: Props) {
  // Prefer a real anchor (opens external Calendly in new tab once
  // wired). Until then it visibly degrades to the contact form
  // when clicked, because the placeholder URL won't resolve.
  const safeUrl = CALENDLY_URL.includes("{{") ? "/contact?topic=sales" : CALENDLY_URL;
  const isPlaceholder = CALENDLY_URL.includes("{{");

  const base =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium no-underline transition-all";
  const styles =
    variant === "primary"
      ? "bg-[var(--accent)] text-white hover:opacity-90"
      : "border border-[var(--border)] text-[var(--fg)] hover:border-[var(--border-hover)]";

  if (isPlaceholder) {
    return (
      <Link
        href={safeUrl}
        className={`${base} ${styles} ${className}`}
        title="Calendly URL not yet wired — falls back to contact form. Set NEXT_PUBLIC_CALENDLY_URL to enable."
      >
        {label} <span className="opacity-60">&rarr;</span>
      </Link>
    );
  }

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles} ${className}`}
    >
      {label} <span className="opacity-60">&rarr;</span>
    </a>
  );
}
