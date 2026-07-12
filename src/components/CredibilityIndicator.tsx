import { cn } from "@/lib/utils";

/** Dot-matrix gauge — a row of cells, filled proportional to the score. */
export function CredibilityDots({
  score,
  cells = 10,
  className,
  showScore = false,
}: {
  score: number;
  cells?: number;
  className?: string;
  showScore?: boolean;
}) {
  const filled = Math.round((score / 100) * cells);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-[3px]">
        {Array.from({ length: cells }).map((_, i) => (
          <span
            key={i}
            className={i < filled ? "bg-accent" : "bg-border"}
            style={{ width: 6, height: 6 }}
          />
        ))}
      </div>
      {showScore && (
        <span className="font-mono text-2xs text-muted">{score}/100</span>
      )}
    </div>
  );
}

/** Thin progress arc — the featured credibility visual (SVG ring). */
export function CredibilityArc({
  score,
  size = 120,
  stroke = 6,
}: {
  score: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / 100));
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold leading-none tabular-nums">
          {score}
        </span>
        <span className="mt-1 font-mono text-2xs tracking-widest text-faint">
          VERIFIED
        </span>
      </div>
    </div>
  );
}
