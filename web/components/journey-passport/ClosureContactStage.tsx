"use client";

import type { FormEvent } from "react";

import { sanitizeTravellerName } from "@/lib/journey-passport/validation-rules";
import type { JourneyPassportState } from "@/types/journey-passport.types";
import { JourneySynopsisTeaser } from "./JourneySynopsisTeaser";
import { PreOtpTrustCard } from "./PreOtpTrustCard";

export interface ClosureContactStageProps {
  name: string;
  mobile: string;
  contactError: string;
  otpStatus: "idle" | "sending" | "verifying";
  onNameChange: (value: string) => void;
  onMobileChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onReviewPassport: () => void;
  state?: Partial<JourneyPassportState>;
}

export function ClosureContactStage({
  name,
  mobile,
  contactError,
  otpStatus,
  onNameChange,
  onMobileChange,
  onSubmit,
  onReviewPassport,
  state,
}: ClosureContactStageProps) {
  return (
    <div className="mx-auto mt-6 max-w-xl text-left">
      {/* PO-01 & UX-08: Interactive Journey Synopsis Preview & Teaser Mode */}
      <JourneySynopsisTeaser state={state} className="mb-6" />

      <form onSubmit={onSubmit} className="journey-passport-reveal mx-auto max-w-md text-left" noValidate>
        <h2 className="text-center text-xl font-semibold text-[#2A211C]">Keep your journey connected</h2>
        <p className="mt-2 text-center text-sm leading-6 text-[#2A211C]">
          Confirm your details so your Journey Director can keep this Passport connected to you.
        </p>

      <label htmlFor="issued-passport-name" className="mt-5 block text-sm font-semibold text-[#2A211C]">
        Name
        <input
          id="issued-passport-name"
          type="text"
          autoComplete="name"
          maxLength={80}
          value={name}
          onChange={(event) => onNameChange(sanitizeTravellerName(event.target.value))}
          className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c4a7] bg-white px-4 text-base focus:outline-2 focus:outline-offset-2 focus:outline-[#2A211C]"
        />
      </label>

      <label htmlFor="issued-passport-mobile" className="mt-4 block text-sm font-semibold text-[#2A211C]">
        Mobile number
        <input
          id="issued-passport-mobile"
          type="tel"
          autoComplete="tel"
          inputMode="numeric"
          maxLength={10}
          value={mobile}
          onChange={(event) => onMobileChange(event.target.value.replace(/\D/g, ""))}
          aria-describedby="issued-passport-privacy issued-passport-error"
          className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c4a7] bg-white px-4 text-base focus:outline-2 focus:outline-offset-2 focus:outline-[#2A211C]"
          placeholder="e.g. 9876543210"
        />
      </label>

      {contactError ? (
        <p id="issued-passport-error" role="alert" className="mt-3 text-sm font-semibold text-[#a1463c]">
          {contactError}
        </p>
      ) : null}

      <PreOtpTrustCard />

      <button
        type="submit"
        className="w-full mt-5"
        disabled={otpStatus === "sending"}
        aria-busy={otpStatus === "sending"}
      >
        {otpStatus === "sending" ? "Sending your code…" : "Move to Journey Director"}
        {otpStatus === "idle" ? <span aria-hidden="true" className="ml-2">→</span> : null}
      </button>

      <button
        type="button"
        onClick={onReviewPassport}
        disabled={otpStatus !== "idle"}
        className="mx-auto block !mt-3 !bg-transparent !text-[#2A211C] !shadow-none"
      >
        Review my Passport
      </button>
    </form>
    </div>
  );
}
