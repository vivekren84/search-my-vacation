# Search My Vacation Website

# Release 1.1 Go-Live Checklist

---

## Document Information

| Item | Value |
|---|---|
| Document | Release 1.1 Go-Live Checklist |
| Version | 1.0 |
| Status | Release Candidate |
| Product Owner | Vivek |
| Release Manager | Tiger |
| Purpose | Operational checklist for deploying Release 1.1 safely to production |

---

# Overview

This checklist is intended to be followed on the day of the Release 1.1 deployment.

Every item should be explicitly verified before marking the release complete.

---

# Phase 1 – Release Readiness

## Product

- [ ] Product Owner approval received
- [ ] Functional QA approval received
- [ ] Release Manager approval received

## Documentation

- [ ] Master Tracker finalized
- [ ] Release Notes finalized
- [ ] Known Issues finalized
- [ ] Decision Log finalized
- [ ] Release 1.2 Roadmap finalized

---

# Phase 2 – Repository Readiness

## Git

- [ ] Working tree clean
- [ ] No Git lock files present
- [ ] All approved R1.1 branches merged
- [ ] Release branch verified
- [ ] Main branch updated
- [ ] Remote synchronized

## Build

- [ ] npm install completed successfully
- [ ] npm run lint passed
- [ ] npm run typecheck passed
- [ ] npm run build passed
- [ ] No unexpected warnings

---

# Phase 3 – Infrastructure

## Environment

- [ ] Production environment variables verified
- [ ] Supabase configuration verified
- [ ] Resend configuration verified
- [ ] Google Reviews URL verified
- [ ] Social links verified

## Hosting

- [ ] Vercel deployment completed
- [ ] Deployment successful
- [ ] SSL active
- [ ] Production URL accessible

---

# Phase 4 – Functional Smoke Test

## Homepage

- [ ] Hero renders correctly
- [ ] Journey Invitations functional
- [ ] Featured Destinations functional
- [ ] Traveller Stories (3 cards)
- [ ] Trust Strip visible
- [ ] Premium medallions visible
- [ ] Travel Inspiration visible
- [ ] Footer verified

---

## Journey Passport

Verify all entry paths:

- [ ] Direct
- [ ] Destination
- [ ] Experience
- [ ] Journey Invitation
- [ ] Travel Inspiration
- [ ] Mood (Journey Invitation) pre-population verified

Verify:

- [ ] Review page
- [ ] Mobile validation
- [ ] Submission

---

## Journey Director

- [ ] Recommendations generated
- [ ] Compatibility reasoning visible
- [ ] No unsupported destinations

---

## Traveller Stories

- [ ] Listing page
- [ ] Detail pages
- [ ] Multiple journeys
- [ ] Images
- [ ] Google Reviews CTA

---

## Contact

- [ ] Callback Request
- [ ] Contact details
- [ ] WhatsApp
- [ ] Footer social links

---

# Phase 5 – Device Validation

Desktop

- [ ] Chrome
- [ ] Safari
- [ ] Firefox

Tablet

- [ ] iPad

Mobile

- [ ] Android
- [ ] iPhone

---

# Phase 6 – SEO & Metadata

- [ ] Homepage metadata
- [ ] Traveller Stories metadata
- [ ] Canonical URLs
- [ ] Open Graph tags
- [ ] Favicon
- [ ] robots.txt
- [ ] sitemap.xml

---

# Phase 7 – Performance

- [ ] Homepage load
- [ ] Images optimized
- [ ] Browser console clean
- [ ] No broken links
- [ ] No layout regressions

---

# Phase 8 – Business Review

Confirm:

- [ ] Branding
- [ ] Copy
- [ ] Metrics
- [ ] Trust Strip
- [ ] Google Reviews opens correctly in a new tab
- [ ] Traveller Stories
- [ ] Homepage

---

# Phase 9 – Release

- [ ] Production deployment approved
- [ ] Release tag created
- [ ] Release pushed
- [ ] Deployment verified

---

# Phase 10 – Post Deployment

Within the first hour after deployment:

- [ ] Homepage accessible
- [ ] Journey Passport working
- [ ] Journey Director working
- [ ] Traveller Stories working
- [ ] Contact working
- [ ] No customer issues reported

---

# Rollback Criteria

Rollback should be initiated if:

- Production deployment fails.
- Homepage is unusable.
- Journey Passport cannot be completed.
- Journey Director fails.
- Contact submission fails.
- Critical navigation is broken.
- Severe production regression is identified.

---

# Release Summary

| Item | Status |
|---|---|
| Product Approval | |
| QA Approval | |
| Release Approval | |
| Deployment | |
| Smoke Test | |
| Final Outcome | |

---

# Final Decision

Release 1.1 is approved for production only after every mandatory checklist item has been successfully completed or explicitly accepted by the Product Owner.