/**
 * Pre-OTP Trust & SLA Value Card (Release 1.3 Milestone 1 — GAP-02)
 *
 * Implements Sophie's UX specification for reassuring travellers before
 * OTP verification, communicating response times, and reinforcing SMV's
 * zero-spam / human-designer commitment.
 */

export function PreOtpTrustCard() {
  return (
    <div className="mt-4 rounded-2xl border border-[#e4d2b5]/70 bg-[#FFFDFC]/90 p-4 text-left shadow-sm">
      <p className="font-serif text-sm font-semibold text-[#2A211C]">Why we verify your mobile number</p>
      <ul className="mt-2 space-y-1.5 text-xs text-[#80664d]">
        <li className="flex items-start gap-2">
          <span className="text-[#F5951C]" aria-hidden="true">✦</span>
          <span><strong>Private &amp; Tailored:</strong> Unlocks your personalized Journey Synopsis and matches considered possibilities.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#F5951C]" aria-hidden="true">✦</span>
          <span><strong>Dedicated Human Designer:</strong> A real travel specialist reviews your preferences before reaching out.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-[#F5951C]" aria-hidden="true">✦</span>
          <span><strong>Zero Spam:</strong> Strictly one conversation about your travel vision. We never sell your contact details.</span>
        </li>
      </ul>

      <div className="mt-3 border-t border-[#e4d2b5]/50 pt-2.5 text-xs text-[#2A211C]">
        <span className="font-bold text-[#F5951C]">Expected Response:</span>{" "}
        <span className="font-medium text-[#2A211C]">Same business day, or next morning if submitted after 7 PM IST.</span>
      </div>
    </div>
  );
}
