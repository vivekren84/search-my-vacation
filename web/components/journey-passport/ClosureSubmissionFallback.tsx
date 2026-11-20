"use client";

export interface ClosureSubmissionFallbackProps {
  contactSubmission: "idle" | "submitting" | "success";
  onRetry: () => void;
  onWhatsAppFallback: () => void;
}

export function ClosureSubmissionFallback({
  contactSubmission,
  onRetry,
  onWhatsAppFallback,
}: ClosureSubmissionFallbackProps) {
  return (
    <div className="mt-4 rounded-2xl border border-[#d8a49c] bg-[#fff8f6] p-5 text-left shadow-sm">
      <p className="font-serif text-base font-semibold text-[#2A211C]">
        Your number is verified, but we couldn’t automatically save your passport just now.
      </p>
      <p className="mt-1.5 text-xs leading-5 text-[#80664d]">
        Your travel preferences are safe in this window. You can retry connecting, or continue directly with your advisor
        via WhatsApp so not a single detail is lost.
      </p>
      <div className="mt-4 space-y-2.5">
        <button
          type="button"
          onClick={onRetry}
          disabled={contactSubmission === "submitting"}
          className="w-full rounded-full bg-[#2A211C] py-3 text-sm font-bold text-white transition hover:bg-[#3d312a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A211C]"
        >
          {contactSubmission === "submitting" ? "Connecting your Journey Passport…" : "Retry Connecting My Passport"}
        </button>
        <button
          type="button"
          onClick={onWhatsAppFallback}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366] bg-white py-3 text-sm font-bold text-[#128C7E] transition hover:bg-[#25D366]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
        >
          <span>Continue Directly via WhatsApp</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
