# UX Specification: Pre-OTP Trust, Designer Response SLA & Failure Recovery

**Backlog Items:** `GAP-02`, `UX-01`, `UX-03`  
**Release:** 1.3 (Milestone 1)  
**Lead Designer:** Sophie (UX & Design System)  
**Reviewed By:** Sri (Traveller Experience Reviewer)  
**Approved By:** Vivek (Product Owner)  
**Status:** Approved Specification  

---

## 1. Design Intent & The Golden Experience Guardrail

The Search My Vacation **"Golden Experience"** is strictly preserved. All components specified here:
- Use existing visual tokens from `docs/04-UX/DESIGN-TOKENS.md` and `docs/04-UX/COLOR-SYSTEM.md`.
- Introduce zero abrupt layout shifts, zero garish colors, and zero aggressive sales pressure.
- Deliver an unhurried, respectful, editorial luxury tone that reassures travellers as they cross the phone-verification checkpoint.

---

## 2. Component Specifications

### 2.1. Pre-OTP Trust & SLA Value Card (`GAP-02`)

- **Surface Location:** Inside `web/components/journey-passport/JourneyPassport.tsx` (closure details stage) and `StepAboutYou.tsx`, positioned directly beneath the mobile number input.
- **Visual Container Tokens:**
  - Background: `#FFFDFC` (Warm Ivory) with subtle `border border-[#e4d2b5]/70`
  - Corner Radius: `rounded-2xl`
  - Padding: `p-5`
  - Shadow: Soft luxury elevation `shadow-[0_4px_16px_rgba(91,55,18,0.04)]`
- **Typography:**
  - Header: Serif `font-serif text-base font-semibold text-[#2A211C]`
  - Body: Utility `text-xs leading-5 text-[#80664d]`
  - SLA Highlight: `font-semibold text-[#2A211C]`
- **Approved Copy Structure:**

```html
<div class="mt-4 rounded-2xl border border-[#e4d2b5]/70 bg-[#FFFDFC]/90 p-4 text-left shadow-sm">
  <p class="font-serif text-sm font-semibold text-[#2A211C]">Why we verify your mobile number</p>
  <ul class="mt-2 space-y-1.5 text-xs text-[#80664d]">
    <li class="flex items-start gap-2">
      <span class="text-[#F5951C]" aria-hidden="true">✦</span>
      <span><strong>Private & Tailored:</strong> Unlocks your personalized Journey Synopsis and matches considered possibilities.</span>
    </li>
    <li class="flex items-start gap-2">
      <span class="text-[#F5951C]" aria-hidden="true">✦</span>
      <span><strong>Dedicated Human Designer:</strong> A real travel specialist reviews your preferences before reaching out.</span>
    </li>
    <li class="flex items-start gap-2">
      <span class="text-[#F5951C]" aria-hidden="true">✦</span>
      <span><strong>Zero Spam:</strong> Strictly one conversation about your travel vision. We never sell your contact details.</span>
    </li>
  </ul>
  
  <div class="mt-3 border-t border-[#e4d2b5]/50 pt-2.5 text-xs text-[#2A211C]">
    <span class="font-bold text-[#F5951C]">Expected Response:</span> 
    <span class="font-medium text-[#2A211C]">Same business day, or next morning if submitted after 7 PM IST.</span>
  </div>
</div>
```

---

### 2.2. OTP Verification Card Reassurance (`GAP-02`)

- **Surface Location:** `web/components/journey-passport/JourneyPassport.tsx` (OTP verification stage).
- **Positioning:** Directly beneath the 6-digit code input field.
- **Approved Copy:**
  > *"Verifying connects your Journey Passport with your advisor. Expected response: Same business day (or tomorrow morning if after 7 PM IST)."*
- **Tokens:** `text-xs text-[#80664d] text-center mt-2.5`

---

### 2.3. Resilient Lead Persistence Failure & WhatsApp Fallback (`UX-01`)

- **Surface Location:** Rendered if `submitJourneyPassportLead` encounters a network failure or database timeout after OTP verification succeeded.
- **Visual Container:**
  - Border: Soft terracotta border `#d8a49c` (warm warning, not alarming red).
  - Background: `#fff8f6`
  - Padding: `p-5`
- **Approved Copy & Hierarchy:**
  1. **Empathetic Heading:** *"Your number is verified, but we couldn't automatically save your passport just now."*
  2. **Reassurance:** *"Your travel preferences are safe in this window."*
  3. **Primary Action Button:**
     - Label: `Retry Connecting My Passport`
     - Style: `w-full rounded-full bg-[#2A211C] text-white py-3 font-bold`
  4. **Emergency Direct WhatsApp Fallback (Product Owner Approved):**
     - Label: `Continue Directly via WhatsApp →`
     - Style: `w-full mt-2.5 rounded-full border border-[#25D366] text-[#128C7E] bg-white py-3 font-bold hover:bg-[#25D366]/10`
     - Action: Launches WhatsApp deep-link with pre-populated Journey Synopsis so no lead data is lost.

---

### 2.4. Lost Challenge Response Recovery (`UX-03`)

- **Trigger Condition:** Server dispatched SMS, but client lost network connection before receiving 200 OK with challenge ID.
- **Recovery Prompt:**
  - Smoothly transitions client into the OTP stage with the retrieved challenge ID.
  - Notice text:  
    *"A code was already sent to your mobile number. Please enter it below, or request a new code when the countdown finishes."*
  - Resend delay timer syncs to remaining cooldown.
