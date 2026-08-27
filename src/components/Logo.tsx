import Image from "next/image";

const W = 1785;
const H = 560;

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
        className={`${className} block dark:hidden`}
      />
      <Image
        src="/logo-dark.png"
        alt="Supasift"
        width={W}
        height={H}
        priority={priority}
        className={`${className} hidden dark:block`}
      />
    </>
  );
}
