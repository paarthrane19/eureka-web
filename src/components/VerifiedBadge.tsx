import { cn } from "@/lib/utils";

/**
 * The official @eureka verification mark. A filled acid-green node with a
 * hairline check, tuned to read as a scientific-instrument indicator rather
 * than a generic social checkmark.
 */
export function VerifiedBadge({
  size = 14,
  className,
  title = "Verified official account",
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      aria-label={title}
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 1.5l2.6 1.9 3.2-.3 1.3 3 2.6 1.9-1 3 1 3-2.6 1.9-1.3 3-3.2-.3L12 22.5l-2.6-1.9-3.2.3-1.3-3L2.3 15l1-3-1-3 2.6-1.9 1.3-3 3.2.3L12 1.5z"
          fill="var(--accent)"
        />
        <path
          d="M8 12.2l2.7 2.7L16 9.5"
          stroke="var(--accent-text)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
