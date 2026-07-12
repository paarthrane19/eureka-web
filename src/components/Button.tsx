import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

export function Button({
  children,
  variant = "primary",
  loading,
  className,
  type = "button",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
}) {
  const base =
    "inline-flex h-[52px] items-center justify-center gap-2 px-6 font-mono text-[15px] font-bold uppercase tracking-wider transition duration-fast disabled:opacity-50 disabled:cursor-not-allowed";
  const styles: Record<Variant, string> = {
    primary: "bg-accent text-accentText hover:brightness-105 active:brightness-95",
    secondary: "hairline text-text hover:border-accent",
    ghost: "text-text hover:text-accent",
  };
  return (
    <button
      type={type}
      disabled={loading || rest.disabled}
      className={cn(base, styles[variant], className)}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}
