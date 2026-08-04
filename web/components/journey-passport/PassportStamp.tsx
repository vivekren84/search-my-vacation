import Image from "next/image";

const APPROVED_PASSPORT_STAMP = "/brand/master/smv-passport-stamp-master.png";

export function PassportStamp({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      className={className}
      src={APPROVED_PASSPORT_STAMP}
      alt=""
      width={640}
      height={640}
      priority={priority}
      unoptimized
    />
  );
}
