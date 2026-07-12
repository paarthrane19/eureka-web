import { cn } from "@/lib/utils";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  color,
  src,
  size = 40,
  className,
}: {
  name: string;
  color: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={cn("shrink-0 object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center font-mono font-medium text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </div>
  );
}
