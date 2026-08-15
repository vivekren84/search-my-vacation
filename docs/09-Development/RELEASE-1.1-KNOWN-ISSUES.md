# Search My Vacation Website

# Release 1.1 Known Issues

---

## Document Information

| Item | Value |
|---|---|
| Document | Release 1.1 Known Issues |
| Version | 1.1 |
| Status | Released |
| Product Owner | Vivek |
| Release Manager | Tiger |
| Purpose | Historical record of observations reviewed and resolved for Release 1.1 |
| Closure Update | 15-Aug-2026 — updated from Release Candidate to Released; all observations resolved as historical record (EBC R1.1-001) |

---

# Overview

This document records known observations that were reviewed as part of Release 1.1.

These items:

- did **not** block production release,
- were resolved or had agreed workarounds where appropriate,
- were reviewed during release readiness and confirmed resolved at release closure,
- are retained here as the historical record of accepted release-time observations.

Items deferred to Release 1.2 are **not** repeated here unless they had a direct operational impact on Release 1.1.

---

# Known Observations

## KI-001 — Sandbox Production Build Limitation

### Status

Historical / Resolved

### Description

Production builds executed inside certain sandboxed AI environments are unable to download Google Fonts due to outbound network restrictions.

This is an environment limitation rather than an application defect.

### Impact

None in production.

Local builds and the Release 1.1 production deployment were unaffected.

### Resolution

The Release 1.1 production build was executed from a local development environment, as planned. This remains the standing approach for future releases; no application-level fix was required.

---

## KI-002 — Cross-Browser Validation Evidence

### Status

Resolved

### Description

The application was functionally validated throughout development.

A final documented regression pass across Chrome, Safari and Firefox was completed as part of release readiness activities, prior to production deployment.

### Impact

No browser-specific defects were identified.

### Resolution

Final cross-browser validation (Chrome, Safari, Firefox) was completed before production deployment.

---

## KI-003 — Real Device Validation Evidence

### Status

Resolved

### Description

The website was exercised on desktop and selected tablet/mobile devices throughout development.

Formal release evidence for Android, iPhone and iPad validation was completed before production deployment.

### Impact

No device-specific functional defects were identified.

### Resolution

Real-device validation (Android, iPhone, iPad) was completed before production deployment.

---

## KI-004 — Documentation Alignment

### Status

Resolved

### Description

A small number of historical EBC documents referenced superseded Product decisions.

Examples include:

- earlier Trust Strip wording
- Contact/Footer wording prior to final Product approval

The shipped implementation reflects the latest approved Product decisions.

### Impact

Documentation only.

No impact on application behaviour.

### Resolution

Release documentation was updated to reflect the final approved behaviour prior to release closure.

---

# Summary

| Category | Count |
|---|---:|
| Functional defects | **0** |
| Release blockers | **0** |
| Outstanding accepted observations | **0** |
| Historical resolved observations | **4** |

---

# Release Recommendation

Release 1.1 was successfully completed and deployed to production with zero functional defects and zero release blockers. All four accepted observations (KI-001 through KI-004) were resolved prior to or as part of release closure.

Final release outcome:

> **RELEASED — GO WITH MINOR OBSERVATIONS (Historical Gate-6 Recommendation, Accepted)**

---

# Exit Criteria

This document should contain only observations consciously accepted for Release 1.1.

Items representing enhancements, feature requests or future improvements belong in the Release 1.2 backlog rather than this document.