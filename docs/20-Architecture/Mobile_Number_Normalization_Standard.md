# Mobile Number Normalization & Canonical Format Standard

**Document ID:** ARCH-R1.4-TD-03  
**Release:** Release 1.4 — Destination Intelligence, Trip Anchors & Passport Experience  
**Task Association:** `TD-03` (Centralize mobile number normalization & canonical docs, absorbs `TD-06`)  
**Status:** Canonical Architectural Standard  
**Authors:** SMV Core Engineering & Architecture  
**Governing Module:** `web/lib/phone/phone-normalization.ts`

---

## 1. Executive Summary

Search My Vacation handles mobile phone numbers across multiple distinct touchpoints:
1. **Traveller UI Input:** Controlled inputs on the Journey Passport closure screen and the contact callback form.
2. **OTP Verification:** Short-lived challenges stored in the Supabase `challenges` table and delivered via SMS gateways.
3. **Lead Capture & Storage:** Persistent records in the Supabase `leads` and `callbacks` tables.
4. **Advisor Routing & Notifications:** WhatsApp deep links, transactional email alerts, and CRM handoff.
5. **Observability & Diagnostics:** Structured logs, error telemetry, and diagnostic traces.

Prior to Release 1.4, ad-hoc digit stripping (`.replace(/\D/g, "")`) was scattered across multiple UI components and server files. This standard establishes a **single authoritative normalization pipeline** centered in `web/lib/phone/phone-normalization.ts`.

---

## 2. Canonical Format Matrix

| Tier / Context | Format Specification | Example | Governing Function |
| :--- | :--- | :--- | :--- |
| **Database Storage** | Strict E.164 (`^\+[1-9][0-9]{7,18}$`) | `+919876543210` | `normalizeE164()` |
| **OTP SMS Gateways** | International E.164 without spaces | `+919876543210` | `normalizeE164()` |
| **Traveller UI Input** | 10-digit clean national digits | `9876543210` | `normalizeNationalDigits()` |
| **Traveller Display Mask** | Country code + leading 5 + masked middle + trailing 3 | `+91 98765 ••210` | `maskPhoneForDisplay()` |
| **Diagnostic Logging** | Country code + 6 stars + trailing 2 digits | `+91 ****** 10` | `maskPhoneForDiagnostics()` |

---

## 3. Parsing & Validation Rules

### 3.1 Mobile vs. Landline Enforcement
- The system exclusively uses the **`libphonenumber-js/max`** metadata bundle.
- Structural length validity (`isValid()`) alone is **insufficient** because it accepts fixed-line / landline numbers (e.g., Delhi `011-xxxxxxx`).
- The parser verifies:
  ```ts
  const type = parsed.getType();
  return type === "MOBILE" || type === "FIXED_LINE_OR_MOBILE";
  ```
- Any fixed-line number is rejected immediately with `invalid_mobile_number`, preventing wasted SMS credits and failed OTP deliveries.

### 3.2 Default Country Code & Internationalization
- Default country code is set to **`IN` (+91)** (`DEFAULT_PHONE_COUNTRY`).
- If an international prefix (`+`) is supplied by the user, `libphonenumber-js` parses according to the explicit country calling code.
- If no country prefix is supplied, the 10-digit national number is resolved against `IN`.
- Zeroed numbers (e.g., `0000000000`) and repetitive dummy numbers are rejected at the parsing boundary.

---

## 4. UI Masking & Reassurance Standard

When displaying a verified or pending mobile number back to the traveller during the OTP step:
- **Pattern:** `+91 98765 ••210`
- **Specification:**
  - Country calling code displayed with leading `+`.
  - Leading 5 digits visible.
  - Middle digits replaced by bullet character (`•`, Unicode `U+2022`).
  - Trailing 3 digits visible.
- **Fallbacks:** If unparseable or malformed, gracefully returns `"your number"` without crashing.

---

## 5. Diagnostic Log Masking (PII Protection)

Per **DEC-R1.2-005** and **TD-08 Observability Invariants**, raw mobile numbers must **NEVER** appear in production log sinks, CloudWatch/Vercel log streams, or error traces:
- **E.164 inputs (`+919876543210`):** Masked to `+91 ****** 10`.
- **National 10-digit inputs (`9876543210`):** Masked to `****** 10`.
- **Empty / Null values:** Output as `[empty]`.
- Implemented via `maskPhoneForDiagnostics()` and integrated into `web/lib/observability/diagnostics.ts`.

---

## 6. Implementation Reference

All client and server modules must import from `web/lib/phone/phone-normalization.ts`:
```ts
import {
  normalizeE164,
  normalizeNationalDigits,
  parseMobileNumber,
  isValidMobileNumber,
  maskPhoneForDisplay,
  maskPhoneForDiagnostics,
} from "@/lib/phone/phone-normalization";
```
