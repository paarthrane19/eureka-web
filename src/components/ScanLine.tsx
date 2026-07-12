import { cn } from "@/lib/utils";

/**
 * Eureka's signature motif: a thin accent hairline with a bright segment that
 * scans across it, like a lab instrument sweeping a sample. Used under the
 * active tab, hero wordmark, and section headers.
 */
export function ScanLine({
  className,
  height = 2,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <div
      className={cn("relative w-full overflow-hidden bg-border", className)}
      style={{ height }}
    >
      <div
        className="absolute inset-y-0 left-0 w-1/4 animate-scan bg-accent"
        style={{ boxShadow: "0 0 8px var(--accent)" }}
      />
    </div>
  );
}
