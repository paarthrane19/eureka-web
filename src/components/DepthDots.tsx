import { cn } from "@/lib/utils";

export const LEVEL_LABELS = ["HOOK", "EXPLAIN", "DEEP DIVE"];

export function DepthDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          aria-label={`Level ${i + 1}`}
          onClick={() => onSelect?.(i)}
          className={cn(
            "h-[3px] transition-all duration-medium",
            i === active ? "w-6 bg-accent" : "w-3 bg-border hover:bg-faint",
          )}
        />
      ))}
    </div>
  );
}
