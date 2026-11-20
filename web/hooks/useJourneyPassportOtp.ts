"use client";

import { useEffect, useState } from "react";

import { JOURNEY_LEAD_FAILURE_MESSAGE } from "@/lib/journey-leads/client";
import { sendJourneyPassportOtp, verifyJourneyPassportOtp } from "@/lib/journey-passport-otp/client";
import {
  PASSPORT_VALIDATION_MESSAGES,
  validateTravellerMobile,
  validateTravellerName,
} from "@/lib/journey-passport/validation-rules";

export interface JourneyPassportOtpState {
  contactStage: "details" | "otp";
  otpStatus: "idle" | "sending" | "verifying";
  otpChallengeId: string;
  otpCode: string;
  otpError: string;
  otpNotice: string;
  otpNextResendAt: number;
  otpResendNow: number;
  otpResendExhausted: boolean;
  leadSubmissionFailed: boolean;
  lastVerifiedToken: string;
  contactError: string;
  contactSubmission: "idle" | "submitting" | "success";
}

export function useJourneyPassportOtp() {
  const [contactStage, setContactStage] = useState<"details" | "otp">("details");
  const [otpStatus, setOtpStatus] = useState<"idle" | "sending" | "verifying">("idle");
  const [otpChallengeId, setOtpChallengeId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpNotice, setOtpNotice] = useState("");
  const [otpNextResendAt, setOtpNextResendAt] = useState(0);
  const [otpResendNow, setOtpResendNow] = useState(0);
  const [otpResendExhausted, setOtpResendExhausted] = useState(false);
  const [leadSubmissionFailed, setLeadSubmissionFailed] = useState(false);
  const [lastVerifiedToken, setLastVerifiedToken] = useState("");
  const [contactError, setContactError] = useState("");
  const [contactSubmission, setContactSubmission] = useState<"idle" | "submitting" | "success">("idle");

  // Live countdown timer effect for OTP resend (React Compiler purity compliance)
  useEffect(() => {
    if (contactStage !== "otp" || otpNextResendAt <= Date.now()) return;
    const interval = window.setInterval(() => setOtpResendNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [contactStage, otpNextResendAt]);

  const requestOtp = async (mobile: string, name: string): Promise<boolean> => {
    if (otpStatus === "sending") return false;

    const nameValidation = validateTravellerName(name);
    if (!nameValidation.isValid) {
      setContactError(nameValidation.error ?? PASSPORT_VALIDATION_MESSAGES.NAME_REQUIRED);
      return false;
    }

    const mobileValidation = validateTravellerMobile(mobile);
    if (!mobileValidation.isValid) {
      setContactError(mobileValidation.error ?? PASSPORT_VALIDATION_MESSAGES.MOBILE_INVALID);
      return false;
    }

    setContactError("");
    setOtpNotice("");
    setOtpStatus("sending");

    try {
      const result = await sendJourneyPassportOtp(mobile.trim());
      if (result.outcome === "sent" && result.challengeId) {
        setOtpChallengeId(result.challengeId);
        setOtpCode("");
        setOtpError("");
        setOtpNotice("");
        setOtpResendExhausted(false);
        setOtpNextResendAt(Date.now() + (result.resendDelaySeconds ?? 30) * 1000);
        setOtpResendNow(Date.now());
        setContactStage("otp");
        return true;
      } else if (result.outcome === "resend_too_soon") {
        if (result.challengeId) {
          setOtpChallengeId(result.challengeId);
        }
        if (result.resendDelaySeconds) {
          setOtpNextResendAt(Date.now() + result.resendDelaySeconds * 1000);
          setOtpResendNow(Date.now());
        }
        setContactStage("otp");
        setOtpNotice(
          "A code was already sent to your mobile number. Please enter it below, or request a new code when the countdown finishes.",
        );
        return true;
      } else if (result.outcome === "resend_limit_exceeded") {
        setOtpResendExhausted(true);
        setContactStage("otp");
        setOtpError(
          "You’ve reached the resend limit for this number. Please check the number below, or try again in a few minutes.",
        );
        return false;
      } else if (result.outcome === "rate_limit_exceeded") {
        setContactError(
          "This mobile number has reached the maximum daily verification limit. Please reach out to us directly via WhatsApp.",
        );
        return false;
      } else if (result.outcome === "cooldown_lockout") {
        setContactError(
          "Hourly verification limit reached for this number. Please wait 15 minutes before trying again.",
        );
        return false;
      } else {
        setContactError(JOURNEY_LEAD_FAILURE_MESSAGE);
        return false;
      }
    } catch {
      setContactError(JOURNEY_LEAD_FAILURE_MESSAGE);
      return false;
    } finally {
      setOtpStatus("idle");
    }
  };

  const verifyOtp = async (
    mobile: string,
    code: string,
    onSuccess: (verificationToken: string) => Promise<void>,
  ): Promise<boolean> => {
    if (otpStatus === "verifying" || contactSubmission !== "idle") return false;

    if (!/^\d{6}$/.test(code)) {
      setOtpError("That code doesn’t match — please check and try again.");
      return false;
    }

    setOtpError("");
    setOtpStatus("verifying");

    try {
      const result = await verifyJourneyPassportOtp(mobile.trim(), otpChallengeId, code);
      if (result.outcome === "verified" && result.verificationToken) {
        await onSuccess(result.verificationToken);
        return true;
      } else if (result.outcome === "incorrect") {
        setOtpCode("");
        setOtpError("That code doesn’t match — please check and try again.");
        return false;
      } else if (result.outcome === "expired") {
        setOtpError("This code has expired. Send a new one to continue.");
        return false;
      } else if (result.outcome === "exhausted") {
        setOtpError("You’ve used all your attempts for this code. Send a new one to continue.");
        return false;
      } else {
        setOtpError(JOURNEY_LEAD_FAILURE_MESSAGE);
        return false;
      }
    } catch {
      setOtpError(JOURNEY_LEAD_FAILURE_MESSAGE);
      return false;
    } finally {
      setOtpStatus((current) => (current === "verifying" ? "idle" : current));
    }
  };

  const editMobileNumber = () => {
    setContactStage("details");
    setOtpChallengeId("");
    setOtpCode("");
    setOtpError("");
    setOtpNotice("");
    setLeadSubmissionFailed(false);
    setLastVerifiedToken("");
    setOtpResendExhausted(false);
    setOtpNextResendAt(0);
  };

  const resetOtp = () => {
    setContactStage("details");
    setOtpStatus("idle");
    setOtpChallengeId("");
    setOtpCode("");
    setOtpError("");
    setOtpNotice("");
    setLeadSubmissionFailed(false);
    setLastVerifiedToken("");
    setContactError("");
    setContactSubmission("idle");
    setOtpResendExhausted(false);
    setOtpNextResendAt(0);
  };

  return {
    contactStage,
    setContactStage,
    otpStatus,
    setOtpStatus,
    otpChallengeId,
    setOtpChallengeId,
    otpCode,
    setOtpCode,
    otpError,
    setOtpError,
    otpNotice,
    setOtpNotice,
    otpNextResendAt,
    setOtpNextResendAt,
    otpResendNow,
    setOtpResendNow,
    otpResendExhausted,
    setOtpResendExhausted,
    leadSubmissionFailed,
    setLeadSubmissionFailed,
    lastVerifiedToken,
    setLastVerifiedToken,
    contactError,
    setContactError,
    contactSubmission,
    setContactSubmission,
    requestOtp,
    verifyOtp,
    editMobileNumber,
    resetOtp,
  };
}
