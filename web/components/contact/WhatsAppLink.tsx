import type { ReactNode } from "react";

import { siteContact } from "@/config/contact.config";

type WhatsAppLinkProps = {
  children?: ReactNode;
  className?: string;
  compact?: boolean;
  href?: string;
};

export default function WhatsAppLink({
  children = "WhatsApp",
  className = "",
  compact = false,
  href = siteContact.whatsappHref,
}: WhatsAppLinkProps) {
  const presentation = compact
    ? "min-h-11 px-4 py-2 text-sm"
    : "min-h-12 px-6 py-3 text-sm";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open a WhatsApp conversation with Search My Vacation in a new tab"
      className={`inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#25d366] font-bold text-[#102217] shadow-[0_8px_22px_rgba(37,211,102,.2)] transition hover:-translate-y-0.5 hover:bg-[#4ade80] hover:shadow-[0_12px_28px_rgba(37,211,102,.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25d366] active:translate-y-0 active:bg-[#20bd5a] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${presentation} ${className}`}
    >
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
