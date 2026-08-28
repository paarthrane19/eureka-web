import Image from "next/image";

const W = 1785;
const H = 560;

// The wordmark never renders wider than ~120 CSS px. Without this, Next falls
// back to the device-width breakpoints and ships the full-resolution source.
const SIZES = "160px";

export function Logo({
  className = "h-7 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src="/logo-light.png"
        alt="Supasift"
        width={W}
        height={H}
        priority={priority}
        sizes={SIZES}
        className={`${className} block dark:hidden`}
      />
      <Image
        src="/logo-dark.png"
        alt="Supasift"
        width={W}
        height={H}
        priority={priority}
        sizes={SIZES}
        className={`${className} hidden dark:block`}
      />
    </>
  );
}
