# Search My Vacation (SMV) — Resend Email Provider Operational Playbook (G-02)

**Document Reference:** `docs/50-Operations/SMV_Resend_Email_Operations_Playbook.md`  
**Governing Standard:** Release 1.5 Governance Deliverable `G-02`  
**Target Audience:** Engineering (Tiger), Operations Desk (Sri), Compliance & Audit (Archie)  
**Primary Domain:** `searchmyvacation.com`  
**Primary Email Service Provider:** Resend (`resend.com`)  
**Default Outbound Sender:** `bookings@searchmyvacation.com` / `concierge@searchmyvacation.com`  

---

## 1. Executive Summary & Purpose

This operational playbook governs the configuration, domain authentication, deliverability monitoring, template lifecycle, and incident triage for transactional and operational emails dispatched by Search My Vacation. It ensures 99.9%+ inbox delivery for traveller Passport confirmations, staff single-channel OTP challenges, and internal booking notifications while maintaining high sender reputation.

---

## 2. DNS Domain Authentication Baseline

To maintain strict DMARC alignment and prevent spoofing, the following DNS records must be verified active on the `searchmyvacation.com` Cloudflare / DNS zone:

| Record Type | Host / Name | Value / Target | Purpose & Policy |
| :--- | :--- | :--- | :--- |
| **TXT (SPF)** | `searchmyvacation.com` | `v=spf1 include:resend.com ~all` | Authorizes Resend MTA IP addresses to dispatch on behalf of the domain. |
| **CNAME (DKIM 1)** | `resend._domainkey` | `dkim.resend.com` | Cryptographically signs outbound message headers for authenticity. |
| **CNAME (DKIM 2)** | `resend2._domainkey` | `dkim2.resend.com` | Redundant secondary signing key for key rotation resilience. |
| **TXT (DMARC)** | `_dmarc.searchmyvacation.com` | `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@searchmyvacation.com; pct=100; sp=quarantine` | Enforces quarantine for unauthenticated mail with daily aggregate reporting. |
| **MX (Feedback)** | `feedback.searchmyvacation.com` | `feedback-smtp.resend.com` (Priority 10) | Captures asynchronous delivery status notifications and bounce signals. |

---

## 3. Sender Reputation & Deliverability Governance

1. **Suppression List Management:**
   * Resend automatically places hard bounces (5xx recipient non-existent) and spam complaints on a global domain suppression list.
   * Operations team members must **never** manually delete suppression records without explicit confirmation from the client via secondary telephone verification.
2. **Rate Limits & Throughput:**
   * Production API limits: 100 emails/second on standard tier.
   * Batch notifications (e.g. daily booking alerts) must use Resend Batch Endpoint (`/emails/batch`) with a maximum chunk size of 100 messages per request to avoid rate-limiting.
3. **Dedicated IP Allocation Threshold:**
   * Shared IP pool is used for transactional volume up to 50,000 emails/month.
   * When monthly outbound volume exceeds 50,000, operations must provision a dedicated sending IP (`G-02-IP-PROV`) with a 30-day warm-up schedule.

---

## 4. Template Lifecycle & Versioning Standard

1. **Template Location:**
   * All email templates are authored as TypeScript React components under `web/lib/email/templates/` using `@react-email/components`.
2. **Brand Tone Standard:**
   * Every template strictly adheres to the **Golden Sunset** design tokens (`#280336` aubergine, `#F36523` sunrise orange, `#FFFDFC` warm cream background).
   * **Strict Tone Invariant:** The word **"luxury"** must never appear in subject lines, preview text, body copy, or footer legals. High-touch curation is conveyed through artisanal narrative, verified partner credentials, and bespoke layout craftsmanship.
3. **Unsubscribe & Compliance:**
   * Marketing/inspirational notes include a 1-click unsubscribe header (`List-Unsubscribe`) conforming to RFC 8058.
   * Transactional OTP and booking confirmations do not contain marketing promotions, preserving their transactional delivery classification.

---

## 5. Incident Response & Troubleshooting Runbook

### Incident A: Staff OTP Challenge or Traveller Confirmation Delayed (> 30s)
1. Check Resend Status Dashboard (`status.resend.com`) for service degradation.
2. Inspect API response logs in Supabase / Vercel:
   ```bash
   npx vercel logs --filter="resend_error"
   ```
3. If Resend reports an error (e.g. `rate_limit_exceeded` or `domain_not_verified`):
   * Automated fallback dispatches via SMS single-channel route (`TD-03`).
   * Alert dispatched to `#ops-engineering` Slack channel.

### Incident B: Bounce Spike (> 2.0% within 24 hours)
1. Download bounce logs from Resend Console (`/api/reports/bounces`).
2. Identify bounce clusters (e.g. specific domain like `corporate-firewall.com`).
3. Check DMARC aggregate reports at `dmarc-reports@searchmyvacation.com`.
4. If DKIM alignment fails, verify DNS record status in Cloudflare via `dig`:
   ```bash
   dig TXT resend._domainkey.searchmyvacation.com +short
   ```

---

## 6. Audit & Access Governance

* Only the Administrator (Vivek) and designated CTO (Tiger) hold production Resend Admin credentials.
* API keys are restricted to `sending_only` for the application runtime and stored in Vercel environment variables as `RESEND_API_KEY`.
* Rotation cycle: `RESEND_API_KEY` is rotated every 90 days.
