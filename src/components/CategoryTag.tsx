import { categoryColor } from "@/lib/colors";
import { cn } from "@/lib/utils";

export function CategoryTag({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className="inline-block"
        style={{ width: 8, height: 8, backgroundColor: categoryColor(category) }}
      />
      <span className="font-mono text-2xs font-medium uppercase tracking-widest text-text">
        {category}
      </span>
    </span>
  );
}
