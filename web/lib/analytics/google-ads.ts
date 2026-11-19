/**
 * Google Ads Conversion Tracking Module (P-01)
 *
 * Implements client-side conversion tracking for completed Journey Passport leads.
 * Uses Google Ads Conversion ID ('AW-11281740116') and Conversion Label ('zQBNCI3wycoYENTixoMq')
 * associated with the primary conversion action 'Submit lead form'.
 *
 * Architecture & Safety Invariants:
 * 1. PII Redaction: Strictly ZERO PII (no guest names, phone numbers, or emails) is sent.
 *    Only the opaque, canonical reference ID (e.g. 'SMV-XXXXXXXX') is passed as 'transaction_id'.
 * 2. Deduplication: Employs sessionStorage to ensure a conversion fires at most ONCE per unique passport reference.
 * 3. Safe Degradation: If environment variables are unset (e.g. local development or test suites),
 *    the module logs a diagnostic trace and exits cleanly without throwing.
 */

export interface GoogleAdsConversionPayload {
  send_to: string;
  transaction_id: string;
  value?: number;
  currency?: string;
}

export type GoogleAdsTrackResult =
  | { status: "fired"; transactionId: string; sendTo: string }
  | { status: "already_fired"; transactionId: string }
  | { status: "skipped_missing_credentials" }
  | { status: "skipped_non_browser" };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getGoogleAdsConfig(): { adsId?: string; conversionLabel?: string } {
  return {
    adsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || undefined,
    conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim() || undefined,
  };
}

export function buildGoogleAdsConversionPayload(
  adsId: string,
  conversionLabel: string,
  passportReference: string,
  options?: { value?: number; currency?: string },
): GoogleAdsConversionPayload {
  return {
    send_to: `${adsId}/${conversionLabel}`,
    transaction_id: passportReference,
    value: options?.value ?? 1.0,
    currency: options?.currency ?? "INR",
  };
}

export function trackGoogleAdsLeadConversion(
  passportReference: string,
  options?: { value?: number; currency?: string },
): GoogleAdsTrackResult {
  if (typeof window === "undefined") {
    return { status: "skipped_non_browser" };
  }

  const { adsId, conversionLabel } = getGoogleAdsConfig();
  if (!adsId || !conversionLabel) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[Google Ads] Tracking skipped for ${passportReference}: NEXT_PUBLIC_GOOGLE_ADS_ID or NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL not set.`,
      );
    }
    return { status: "skipped_missing_credentials" };
  }

  const storageKey = `smv:gads:conversion:${passportReference}`;
  try {
    if (sessionStorage.getItem(storageKey) === "fired") {
      return { status: "already_fired", transactionId: passportReference };
    }
  } catch {
    // Continue even if sessionStorage is blocked
  }

  const payload = buildGoogleAdsConversionPayload(adsId, conversionLabel, passportReference, options);

  // Initialize dataLayer and gtag queue if not already present
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }

  // Fire conversion event
  window.gtag("event", "conversion", payload);

  try {
    sessionStorage.setItem(storageKey, "fired");
  } catch {
    // Non-fatal if storage write fails
  }

  return {
    status: "fired",
    transactionId: passportReference,
    sendTo: payload.send_to,
  };
}
