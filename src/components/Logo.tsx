import Image from "next/image";

const W = 1446;
const H = 857;

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
        alt="Eureka"
        width={W}
        height={H}
        priority={priority}
        className={`${className} block dark:hidden`}
      />
      <Image
        src="/logo-dark.png"
        alt="Eureka"
        width={W}
        height={H}
        priority={priority}
        className={`${className} hidden dark:block`}
      />
    </>
  );
}
