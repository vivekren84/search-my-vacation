# Search My Vacation Website

# Release 1.1 Known Issues

---

## Document Information

| Item | Value |
|---|---|
| Document | Release 1.1 Known Issues |
| Version | 1.0 |
| Status | Release Candidate |
| Product Owner | Vivek |
| Release Manager | Tiger |
| Purpose | Record known observations consciously accepted for Release 1.1 |

---

# Overview

This document records known observations that are intentionally accepted as part of Release 1.1.

These items:

- do **not** block production release,
- have agreed workarounds where appropriate,
- have been reviewed during release readiness,
- may be revisited in a future release.

Items deferred to Release 1.2 are **not** repeated here unless they have a direct operational impact on Release 1.1.

---

# Known Observations

## KI-001 — Sandbox Production Build Limitation

### Status

Accepted

### Description

Production builds executed inside certain sandboxed AI environments are unable to download Google Fonts due to outbound network restrictions.

This is an environment limitation rather than an application defect.

### Impact

None in production.

Local builds and production deployments are unaffected.

### Workaround

Use a local development environment to execute the final production build.

---

## KI-002 — Cross-Browser Validation Evidence

### Status

Pending Final Evidence

### Description

The application has been functionally validated throughout development.

A final documented regression pass across Chrome, Safari and Firefox remains part of the release readiness activities.

### Impact

No known browser-specific defects currently exist.

### Workaround

Complete the final browser validation before production deployment.

---

## KI-003 — Real Device Validation Evidence

### Status

Pending Final Evidence

### Description

The website has been exercised on desktop and selected tablet/mobile devices during development.

Formal release evidence for final Android, iPhone and iPad validation will be completed before production deployment.

### Impact

No known device-specific functional defects currently exist.

### Workaround

Complete the planned device validation prior to production release.

---

## KI-004 — Documentation Alignment

### Status

Accepted

### Description

A small number of historical EBC documents reference superseded Product decisions.

Examples include:

- earlier Trust Strip wording
- Contact/Footer wording prior to final Product approval

The shipped implementation reflects the latest approved Product decisions.

### Impact

Documentation only.

No impact on application behaviour.

### Workaround

Release documentation has been updated to reflect the final approved behaviour.

---

# Summary

| Category | Count |
|---|---:|
| Functional defects | **0** |
| Release blockers | **0** |
| Accepted observations | **4** |

---

# Release Recommendation

No known functional defects currently prevent Release 1.1 from proceeding.

Release recommendation remains:

> **GO WITH MINOR OBSERVATIONS**

---

# Exit Criteria

This document should contain only observations consciously accepted for Release 1.1.

Items representing enhancements, feature requests or future improvements belong in the Release 1.2 backlog rather than this document.