"use client";

import type { FormEvent, RefObject } from "react";

import { maskPhoneForDisplay } from "@/lib/phone/phone-normalization";
import { ClosureSubmissionFallback } from "./ClosureSubmissionFallback";

export interface ClosureOtpStageProps {
  mobile: string;
  otpCode: string;
  otpError: string;
  otpNotice: string;
  otpStatus: "idle" | "sending" | "verifying";
  contactSubmission: "idle" | "submitting" | "success";
  otpResendExhausted: boolean;
  otpResendSecondsRemaining: number;
  leadSubmissionFailed: boolean;
  otpHeadingRef: RefObject<HTMLHeadingElement | null>;
  otpCodeInputRef: RefObject<HTMLInputElement | null>;
  onCodeChange: (value: string) => void;
  onEditMobileNumber: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onRequestResend: () => void;
  onRetrySubmission: () => void;
  onWhatsAppFallback: () => void;
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function ClosureOtpStage({
  mobile,
  otpCode,
  otpError,
  otpNotice,
  otpStatus,
  contactSubmission,
  otpResendExhausted,
  otpResendSecondsRemaining,
  leadSubmissionFailed,
  otpHeadingRef,
  otpCodeInputRef,
  onCodeChange,
  onEditMobileNumber,
  onSubmit,
  onRequestResend,
  onRetrySubmission,
  onWhatsAppFallback,
}: ClosureOtpStageProps) {
  return (
    <form onSubmit={onSubmit} className="journey-passport-reveal mx-auto mt-7 max-w-md text-left" noValidate>
      <h2 ref={otpHeadingRef} tabIndex={-1} className="text-center text-xl font-semibold text-[#2A211C]">
        Confirm your number
      </h2>
      <p className="mt-2 text-center text-sm leading-6 text-[#2A211C]">
        Code sent to {maskPhoneForDisplay(mobile)}. It should arrive within a minute.{" "}
        <button
          type="button"
          onClick={onEditMobileNumber}
          disabled={contactSubmission !== "idle"}
          className="!inline !bg-transparent !p-0 !text-[#2A211C] !underline !shadow-none"
        >
          Change number
        </button>
      </p>

      <label htmlFor="issued-passport-otp-code" className="mt-5 block text-sm font-semibold text-[#2A211C]">
        Code
        <input
          id="issued-passport-otp-code"
          ref={otpCodeInputRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={otpCode}
          onChange={(event) => onCodeChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
          aria-describedby="issued-passport-otp-status issued-passport-otp-error"
          className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c4a7] bg-white px-4 text-base focus:outline-2 focus:outline-offset-2 focus:outline-[#2A211C]"
        />
      </label>

      <p className="mt-2.5 text-center text-xs text-[#80664d]">
        Verifying connects your Journey Passport with your advisor. Expected response: Same business day (or tomorrow morning if after 7 PM IST).
      </p>

      {otpNotice ? (
        <p
          id="issued-passport-otp-notice"
          role="status"
          className="mt-3 text-center text-sm font-medium text-[#80664d] bg-[#f8eddd] rounded-xl p-3 border border-[#e4d2b5]"
        >
          {otpNotice}
        </p>
      ) : null}

      {otpError ? (
        <p id="issued-passport-otp-error" role="alert" className="mt-3 text-sm font-semibold text-[#a1463c]">
          {otpError}
        </p>
      ) : null}

      {contactSubmission === "success" ? (
        <p id="issued-passport-otp-status" role="status" className="mt-3 text-center text-sm font-semibold text-[#4d6b46]">
          Number confirmed. Your Passport is connected. Preparing your possibilities…
        </p>
      ) : null}

      {leadSubmissionFailed ? (
        <ClosureSubmissionFallback
          contactSubmission={contactSubmission}
          onRetry={onRetrySubmission}
          onWhatsAppFallback={onWhatsAppFallback}
        />
      ) : (
        <>
          <button
            type="submit"
            className="w-full"
            disabled={otpStatus === "verifying" || contactSubmission !== "idle"}
            aria-busy={otpStatus === "verifying" || contactSubmission === "submitting"}
          >
            {otpStatus === "verifying" || contactSubmission === "submitting"
              ? "Connecting your Journey Passport…"
              : "Verify code"}
          </button>
          {otpResendExhausted ? null : otpResendSecondsRemaining > 0 ? (
            <p className="mx-auto mt-3 text-center text-sm text-[#8a7a6a]">
              Resend available in {formatCountdown(otpResendSecondsRemaining)}
            </p>
          ) : (
            <button
              type="button"
              onClick={onRequestResend}
              disabled={otpStatus === "sending" || contactSubmission !== "idle"}
              className="mx-auto block !mt-3 !bg-transparent !text-[#2A211C] !shadow-none"
            >
              Resend code
            </button>
          )}
        </>
      )}
    </form>
  );
}
