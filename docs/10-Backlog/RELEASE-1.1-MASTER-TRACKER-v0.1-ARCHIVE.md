# Release 1.1 Master Tracker

---

# Document Information

| Item | Value |
|------|-------|
| Document | Release 1.1 Master Tracker |
| Version | 0.1 |
| Status | In Progress |
| Product Owner | Vivek |
| Project | Search My Vacation Website |
| Purpose | Single source of truth for every Release 1.1 enhancement, bug fix, UX improvement, validation activity and business sign-off. |

---

# Release 1.1 Objectives

Release 1.1 focuses on improving the overall quality, credibility, usability and production readiness of the Search My Vacation website.

Primary objectives include:

- Improve Homepage visual polish
- Improve Journey Passport experience
- Increase customer trust and credibility
- Introduce Traveller Stories experience
- Improve navigation and discoverability
- Refine branding consistency
- Improve responsiveness
- Improve production readiness
- Address business feedback received after Release 1.0
- Prepare the website for wider customer usage

---

# Status Legend

| Status | Meaning |
|---------|---------|
| ✅ | Complete |
| 🔄 | In Progress |
| ⏳ | Awaiting QA / Business Validation |
| ❌ | Not Started |
| 🚫 | Blocked |

---

# Tracker Columns

| Column | Description |
|---------|-------------|
| ID | Unique Release Item |
| Area | Functional Area |
| Feature / Task | Individual enhancement or defect |
| Description | Short description |
| Priority | Critical / High / Medium / Low |
| EBC Ref | Engineering Backlog Card |
| Development | Implementation Status |
| QA | Functional Validation |
| Business | Product Owner Sign-off |
| Remarks | Additional Notes |

---

# Release Dashboard

| Metric | Count |
|---------|------:|
| Total Release Items | TBD |
| Development Complete | TBD |
| QA Complete | TBD |
| Business Approved | TBD |
| Outstanding | TBD |
| Blocked | TBD |
| Release Readiness | TBD |

---

# 1. Homepage

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-001 | Improve Hero readability | Improve readability of hero content using overlay and typography adjustments | High | EBC-015 | ✅ | ✅ | ✅ | Completed |
| R1.1-002 | Improve Hero overlay | Fine tune overlay opacity and contrast | Medium | EBC-015 | ✅ | ✅ | ✅ | Completed |
| R1.1-003 | Improve Hero typography hierarchy | Better balance between heading, subheading and CTA | Medium | EBC-015 | ✅ | ✅ | ✅ | Completed |
| R1.1-004 | Equalize Hero mood icon sizes | Ensure all six mood icons have consistent visual weight | High | EBC-015 | ✅ | ⏳ | ⏳ | Pending final visual validation |
| R1.1-005 | Equalize Hero mood icon spacing | Improve spacing and alignment between icons | High | EBC-015 | ✅ | ⏳ | ⏳ | Pending validation |
| R1.1-006 | Review Hero icon quality | Evaluate replacing current icons with higher-resolution artwork | Medium | New | ❌ | ❌ | ❌ | Preserve existing emotional meaning while improving visual quality |
| R1.1-007 | Validate Hero responsiveness | Review Hero layout across Desktop, Tablet and Mobile | High | New | ⏳ | ❌ | ❌ | Final release QA |
| R1.1-008 | Validate Hero CTA | Verify CTA alignment and responsiveness | Medium | New | ⏳ | ❌ | ❌ | |
| R1.1-009 | Validate Hero animation and hover states | Ensure smooth interaction behaviour | Low | New | ⏳ | ❌ | ❌ | |
| R1.1-010 | Final Homepage visual polish | Overall visual review after all Release 1.1 changes | High | New | ❌ | ❌ | ❌ | Final pre-release review |

---

# 2. Header & Navigation

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-011 | Correct logo alignment | Improve logo positioning | Medium | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-012 | Correct swoosh alignment | Align brand swoosh correctly | Medium | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-013 | Improve header spacing | Better spacing between logo, navigation and CTA | Medium | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-014 | Add Traveller Stories navigation | Introduce Traveller Stories in primary navigation | High | TS Listing | 🔄 | ⏳ | ❌ | Under implementation |
| R1.1-015 | Prevent navigation wrapping | Ensure desktop navigation remains single-line | High | TS Listing | 🔄 | ❌ | ❌ | Under refinement |
| R1.1-016 | Review navigation spacing | Rebalance menu spacing after new navigation item | Medium | TS Listing | 🔄 | ❌ | ❌ | |
| R1.1-017 | Preserve CTA prominence | Ensure "Plan My Experience" CTA remains visually dominant | High | TS Listing | ⏳ | ❌ | ❌ | |
| R1.1-018 | Validate responsive navigation | Verify hamburger menu behaviour | High | TS Listing | ⏳ | ❌ | ❌ | |
| R1.1-019 | Validate navigation hover states | Verify hover styling consistency | Low | New | ❌ | ❌ | ❌ | |
| R1.1-020 | Final header UX review | End-to-end navigation review | High | New | ❌ | ❌ | ❌ | |

---

# 3. Journey Passport

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-021 | Simplify Journey Passport flow | Reduce journey flow complexity | High | JP | ✅ | ✅ | ✅ | |
| R1.1-022 | Merge Travel Style & Pace questions | Reduce one question from the flow | High | JP | ✅ | ✅ | ✅ | |
| R1.1-023 | Preserve Back button state | Maintain navigation state | Medium | JP | ✅ | ✅ | ✅ | |
| R1.1-024 | Preserve Continue button state | Maintain navigation state | Medium | JP | ✅ | ✅ | ✅ | |
| R1.1-025 | Preserve traveller selections | Persist selections while navigating | High | JP | ✅ | ✅ | ✅ | |
| R1.1-026 | Destination pre-population | Pre-fill destination where applicable | High | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-027 | Experience pre-population | Pre-fill experience selections | High | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-028 | Travel Inspiration pre-population | Launch Passport with contextual selections | High | R1.1 | ✅ | ⏳ | ⏳ | Validate all entry points |
| R1.1-029 | Limit selections to Top 3 | Restrict user selections appropriately | High | JP | ✅ | ✅ | ✅ | |
| R1.1-030 | Remove duplicate helper text | Eliminate repeated guidance | Medium | R1.1 | ✅ | ✅ | ✅ | |
| R1.1-031 | Validate 10-digit mobile number | Accept valid Indian mobile numbers | High | EBC-001 | ✅ | ✅ | ✅ | |
| R1.1-032 | Reject all-zero mobile number | Reject invalid placeholder number | High | EBC-001 | ✅ | ✅ | ✅ | |
| R1.1-033 | Improve Traveller Details page (Page 1) | Improve first impression, spacing and visual hierarchy | Critical | New | ❌ | ❌ | ❌ | Business requested enhancement |
| R1.1-034 | Review Name field UX | Improve layout and usability of traveller information section | High | New | ❌ | ❌ | ❌ | |
| R1.1-035 | Improve validation message presentation | Make validation clearer and visually consistent | Medium | New | ❌ | ❌ | ❌ | |

---

# 4. Journey Director

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-036 | Introduce Perfect Match recommendations | Primary recommendation category | High | Journey Director | ✅ | ✅ | ✅ | |
| R1.1-037 | Introduce Beautiful Puzzle recommendations | Secondary recommendation category | High | Journey Director | ✅ | ✅ | ✅ | |
| R1.1-038 | Introduce Hidden Gem recommendations | Discovery recommendation category | High | Journey Director | ✅ | ✅ | ✅ | |
| R1.1-039 | Restrict recommendations to SMV-served destinations | Prevent unsupported destinations | Critical | Journey Director | ✅ | ✅ | ✅ | |
| R1.1-040 | Improve destination intelligence | Better destination matching logic | High | Journey Director | ✅ | ⏳ | ⏳ | Ongoing review |
| R1.1-041 | Validate recommendation quality | Business review of recommendation output | High | New | ❌ | ❌ | ❌ | |

---

# 5. Destinations

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-042 | Improve destination categorisation | Refine destination grouping | Medium | R1.1 | ✅ | ✅ | ✅ | |
| R1.1-043 | Improve destination navigation | Improve usability of destination section | Medium | R1.1 | ✅ | ✅ | ✅ | |
| R1.1-044 | Connect Destinations to Journey Passport | Launch Passport with destination context | High | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-045 | Validate destination pre-population | Confirm all supported destinations populate correctly | High | New | ⏳ | ❌ | ❌ | |
| R1.1-046 | Final destination experience review | Review destination journeys end-to-end | Medium | New | ❌ | ❌ | ❌ | |

---

# 6. Experiences

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-047 | Review Experiences landing page | Review overall Experiences page usability | Medium | R1.1 | ✅ | ⏳ | ⏳ | Final UX validation pending |
| R1.1-048 | Connect Experiences to Journey Passport | Launch Journey Passport with contextual experience selection | High | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-049 | Preserve selected Experience in Passport | Ensure selected experience remains pre-selected | High | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-050 | Validate all Experience cards | Verify every Experience launches correctly | Medium | New | ⏳ | ❌ | ❌ | |
| R1.1-051 | Validate Experience responsiveness | Desktop, Tablet and Mobile review | Medium | New | ❌ | ❌ | ❌ | |
| R1.1-052 | Review Experience imagery | Ensure imagery matches premium branding | Medium | New | ❌ | ❌ | ❌ | |
| R1.1-053 | Review Experience copy | Verify wording aligns with SMV tone of voice | Medium | Business Feedback | ❌ | ❌ | ❌ | |
| R1.1-054 | Final Experiences UX review | End-to-end review before Release 1.1 sign-off | High | New | ❌ | ❌ | ❌ | |

---

# 7. Travel Inspiration

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-055 | Connect Travel Inspiration to Journey Passport | Launch Passport with contextual inspiration | High | R1.1 | ✅ | ✅ | ✅ | |
| R1.1-056 | Preserve selected inspiration | Ensure user selection flows into Passport | High | R1.1 | ✅ | ⏳ | ⏳ | Validate every inspiration card |
| R1.1-057 | Validate all inspiration cards | Verify every card launches correctly | Medium | New | ❌ | ❌ | ❌ | |
| R1.1-058 | Review Travel Inspiration imagery | Improve visual consistency | Medium | New | ❌ | ❌ | ❌ | |
| R1.1-059 | Review Travel Inspiration copy | Improve emotional storytelling | Medium | Business Feedback | ❌ | ❌ | ❌ | |
| R1.1-060 | Validate responsive behaviour | Desktop, Tablet and Mobile review | Medium | New | ❌ | ❌ | ❌ | |
| R1.1-061 | Review CTA consistency | Ensure CTA wording remains consistent | Low | New | ❌ | ❌ | ❌ | |
| R1.1-062 | Final Travel Inspiration review | Overall business review | High | New | ❌ | ❌ | ❌ | |

---

# 8. Traveller Stories

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-063 | Create canonical metadata structure | Traveller metadata architecture | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-064 | Create metadata for all travellers | Metadata for every traveller | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-065 | Validate traveller IDs | Verify unique traveller IDs | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-066 | Validate journey IDs | Verify unique journey IDs | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-067 | Validate titles | Ensure every journey has a final approved title | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-068 | Validate durations | Ensure every journey has a duration | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-069 | Validate destinations | Ensure destination naming consistency | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-070 | Validate traveller types | Family, Couple, Solo etc. | Medium | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-071 | Validate experience types | Ensure taxonomy consistency | Medium | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-072 | Validate tags | Traveller and journey tags | Medium | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-073 | Validate media references | Image references match repository | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-074 | Validate permissions | Story and image permissions | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-075 | Validate publication status | All approved travellers marked approved | High | TS Metadata | 🔄 | ⏳ | ❌ | Current EBC |
| R1.1-076 | Support multiple journeys per traveller | Repository supports repeat travellers | High | TS Listing | 🔄 | ❌ | ❌ | |
| R1.1-077 | Add journey-level hero image | Allow each journey its own hero image | High | TS Listing | 🔄 | ❌ | ❌ | |
| R1.1-078 | Preserve Hari Mangalore hero image | family-01.jpg | High | TS Listing | 🔄 | ❌ | ❌ | |
| R1.1-079 | Preserve Hari Amritsar hero image | family-02.jpg | High | TS Listing | 🔄 | ❌ | ❌ | |
| R1.1-080 | Build Traveller Stories listing page | New discovery page | Critical | TS Listing | 🔄 | ❌ | ❌ | |
| R1.1-081 | Add Traveller Stories navigation | Primary navigation entry | High | TS Listing | 🔄 | ❌ | ❌ | |
| R1.1-082 | Build dynamic journey detail page | One page per journey | High | TS Listing | 🔄 | ❌ | ❌ | |
| R1.1-083 | Remove placeholder messaging | Eliminate "Work in Progress" wording | Critical | TS Listing | ❌ | ❌ | ❌ | |
| R1.1-084 | Display authentic testimonials where available | Use only approved traveller content | High | TS Listing | ❌ | ❌ | ❌ | |
| R1.1-085 | Metadata-only fallback pages | Show factual journey details where testimonials don't exist | High | TS Listing | ❌ | ❌ | ❌ | |
| R1.1-086 | Verify Hari renders two cards | One card per journey | Critical | TS Listing | ❌ | ❌ | ❌ | |
| R1.1-087 | Verify Karthik renders two cards | One card per journey | High | TS Listing | ❌ | ❌ | ❌ | |
| R1.1-088 | Verify one card per approved journey | Prevent traveller-level deduplication | Critical | TS Listing | ❌ | ❌ | ❌ | |
| R1.1-089 | Audit listing image orientation | Ensure no sideways images | High | TS Listing | ❌ | ❌ | ❌ | |
| R1.1-090 | Correct rotated Hyderabad image | Fix Kohila Dev Arun Kumar hero image | High | TS Listing | ❌ | ❌ | ❌ | |
| R1.1-091 | Validate hero image hierarchy | Journey → Destination → Traveller → Monogram | High | TS Listing | ❌ | ❌ | ❌ | |
| R1.1-092 | Validate unique slugs | One route per journey | High | TS Listing | ❌ | ❌ | ❌ | |
| R1.1-093 | Validate detail routes | Every card opens correctly | High | TS Listing | ❌ | ❌ | ❌ | |
| R1.1-094 | Validate SEO metadata | Page and journey metadata | Medium | TS Listing | ❌ | ❌ | ❌ | |
| R1.1-095 | Final Traveller Stories UX review | Business acceptance review | Critical | New | ❌ | ❌ | ❌ | |

---

# 9. About Us

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-096 | Refresh About Us content | Improve storytelling | High | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-097 | Replace "Holiday" with "Vacation" where appropriate | Brand terminology alignment | Medium | Business Feedback | ✅ | ⏳ | ⏳ | Review complete page |
| R1.1-098 | Improve brand positioning | Emphasise personalised experiences | High | Business Feedback | ✅ | ⏳ | ⏳ | |
| R1.1-099 | Validate About Us responsiveness | Desktop, Tablet and Mobile | Medium | New | ❌ | ❌ | ❌ | |
| R1.1-100 | Final About Us review | Product Owner sign-off | Medium | New | ❌ | ❌ | ❌ | |

---

# 10. Contact & Footer

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-101 | Add Instagram icon | Footer social link | High | R1.1 | ✅ | ✅ | ✅ | |
| R1.1-102 | Add Facebook icon | Footer social link | High | R1.1 | ✅ | ✅ | ✅ | |
| R1.1-103 | Add YouTube icon | Footer social link | High | R1.1 | ✅ | ✅ | ✅ | |
| R1.1-104 | Remove text beside social icons | Icons only | Medium | Business Feedback | ✅ | ✅ | ✅ | |
| R1.1-105 | Validate footer responsiveness | Desktop, Tablet and Mobile | Medium | New | ❌ | ❌ | ❌ | |
| R1.1-106 | Review Contact page layout | Improve spacing and readability | Medium | New | ❌ | ❌ | ❌ | |
| R1.1-107 | Add office visit note | Office visits by prior appointment only | Medium | Business Feedback | ❌ | ❌ | ❌ | Confirm current wording |
| R1.1-108 | Verify all social links | Check destination URLs | Medium | New | ❌ | ❌ | ❌ | |
| R1.1-109 | Validate WhatsApp links | Open in new tab consistently | High | R1.1 | ✅ | ⏳ | ⏳ | Final regression |
| R1.1-110 | Final Contact & Footer review | Business acceptance | Medium | New | ❌ | ❌ | ❌ | |

---

# 11. Branding & Visual Identity

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-111 | Standardize brand identity | Apply official branding across website | High | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-112 | Use official horizontal logo | Replace temporary logo assets | High | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-113 | Use official circular avatar | Use approved social avatar | Medium | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-114 | Rebuild explorer silhouette | Replace temporary explorer artwork | Medium | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-115 | Add official swoosh | Apply final brand swoosh | Medium | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-116 | Standardize typography | Baskerville, Poppins and Inter usage | High | EBC-014 | ✅ | ⏳ | ⏳ | Final typography audit |
| R1.1-117 | Standardize favicon | Replace default favicon | Medium | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-118 | Standardize app icons | Replace default application icons | Medium | EBC-014 | ✅ | ✅ | ✅ | |
| R1.1-119 | Update Open Graph images | Improve social sharing preview | Medium | EBC-014 | ✅ | ⏳ | ⏳ | |
| R1.1-120 | Brand email templates | Apply official branding to emails | Medium | EBC-014 | ✅ | ⏳ | ⏳ | |
| R1.1-121 | Footer branding review | Validate footer lockup | Medium | EBC-014 | ⏳ | ❌ | ❌ | |
| R1.1-122 | Watermark review | Verify opacity and placement | Low | EBC-014 | ⏳ | ❌ | ❌ | |
| R1.1-123 | Visual consistency audit | End-to-end branding consistency | High | New | ❌ | ❌ | ❌ | |

---

# 12. SEO & Discoverability

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-124 | Homepage SEO review | Validate homepage metadata | High | SEO | ⏳ | ❌ | ❌ | |
| R1.1-125 | Traveller Stories metadata | Page title, description and canonical | High | TS Listing | 🔄 | ❌ | ❌ | |
| R1.1-126 | Journey detail metadata | Dynamic metadata per journey | Medium | TS Listing | 🔄 | ❌ | ❌ | |
| R1.1-127 | Open Graph validation | Validate previews across key pages | Medium | SEO | ❌ | ❌ | ❌ | |
| R1.1-128 | Structured data review | Assess schema markup opportunities | Low | New | ❌ | ❌ | ❌ | |
| R1.1-129 | Canonical URL validation | Verify canonical tags | Medium | SEO | ❌ | ❌ | ❌ | |
| R1.1-130 | Broken link audit | Validate internal navigation | High | QA | ❌ | ❌ | ❌ | |

---

# 13. Technical Improvements & Performance

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-131 | Validate metadata JSON schema | Verify all metadata files | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-132 | Validate duplicate journey IDs | Repository integrity check | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-133 | Validate duplicate traveller IDs | Repository integrity check | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-134 | Validate media references | Ensure referenced media exists | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-135 | Validate image permissions | Honour approved media only | High | TS Metadata | ✅ | ✅ | ✅ | |
| R1.1-136 | Validate lint | Ensure lint passes cleanly | High | QA | ✅ | ✅ | ✅ | |
| R1.1-137 | Validate production build | Ensure build completes successfully | Critical | QA | ⏳ | ❌ | ❌ | Re-run before release |
| R1.1-138 | Validate responsive layouts | Cross-device verification | High | QA | ❌ | ❌ | ❌ | |
| R1.1-139 | Validate loading performance | Review perceived performance | Medium | QA | ❌ | ❌ | ❌ | |
| R1.1-140 | Validate image optimisation | Verify Next.js image handling | Medium | QA | ❌ | ❌ | ❌ | |
| R1.1-141 | Validate accessibility basics | Keyboard, focus and contrast review | Medium | QA | ❌ | ❌ | ❌ | |
| R1.1-142 | Review Turbopack development issue | Confirm development environment stability | Low | Investigation | 🔄 | ❌ | ❌ | Non-release blocker unless reproducible outside dev |

---

# 14. Release QA & Production Readiness

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-143 | Homepage regression test | Validate homepage after all changes | Critical | QA | ❌ | ❌ | ❌ | |
| R1.1-144 | Journey Passport regression | End-to-end Passport validation | Critical | QA | ❌ | ❌ | ❌ | |
| R1.1-145 | Destination flow regression | Validate all destination entry points | High | QA | ❌ | ❌ | ❌ | |
| R1.1-146 | Experiences regression | Validate Experience journeys | High | QA | ❌ | ❌ | ❌ | |
| R1.1-147 | Travel Inspiration regression | Validate inspiration journeys | High | QA | ❌ | ❌ | ❌ | |
| R1.1-148 | Traveller Stories regression | Validate listing and detail pages | Critical | QA | ❌ | ❌ | ❌ | |
| R1.1-149 | Contact flow regression | Validate enquiry and contact experience | High | QA | ❌ | ❌ | ❌ | |
| R1.1-150 | Cross-browser validation | Chrome, Safari, Firefox | High | QA | ❌ | ❌ | ❌ | |
| R1.1-151 | Mobile device validation | Android and iPhone review | High | QA | ❌ | ❌ | ❌ | |
| R1.1-152 | Tablet validation | iPad and tablet layouts | Medium | QA | ❌ | ❌ | ❌ | |
| R1.1-153 | Business acceptance review | Product Owner walkthrough | Critical | Release | ❌ | ❌ | ❌ | |
| R1.1-154 | Pre-production verification | Validate Vercel deployment before release | Critical | Release | ❌ | ❌ | ❌ | |
| R1.1-155 | Production go-live readiness | Confirm release checklist complete | Critical | Release | ❌ | ❌ | ❌ | |

---

# 15. Release Operations & Future Enhancements

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-156 | Update Release 1.1 documentation | Keep release documentation current | Medium | Documentation | ⏳ | ❌ | ❌ | |
| R1.1-157 | Maintain Release Decision Log | Record major release decisions | Medium | Documentation | ⏳ | ❌ | ❌ | |
| R1.1-158 | Review deferred enhancements | Identify items for Release 1.2 | Medium | Backlog | ❌ | ❌ | ❌ | |
| R1.1-159 | Archive completed EBCs | Ensure all EBCs are linked and archived | Low | Documentation | ❌ | ❌ | ❌ | |
| R1.1-160 | Final Release 1.1 retrospective | Capture lessons learned | Medium | EBC-029 | ❌ | ❌ | ❌ | |
| R1.1-161 | Create Release 1.2 backlog | Seed next release from outstanding items | Medium | Backlog | ❌ | ❌ | ❌ | |
| R1.1-162 | Freeze Release 1.1 scope | Prevent uncontrolled scope changes before go-live | High | Release | ❌ | ❌ | ❌ | |

---

# 16. Business Feedback, Trust & Customer Experience

| ID | Feature / Task | Description | Priority | EBC Ref | Dev | QA | Business | Remarks |
|----|----------------|-------------|----------|---------|:---:|:--:|:--------:|---------|
| R1.1-163 | Display "300+ Holidays Planned" | Showcase SMV's experience through key business metrics | High | Business Feedback | ❌ | ❌ | ❌ | Final wording and placement to be confirmed |
| R1.1-164 | Display "800+ Happy Travellers" | Reinforce customer trust using traveller count | High | Business Feedback | ❌ | ❌ | ❌ | Display alongside other trust metrics |
| R1.1-165 | Display Google Rating | Show Google rating and current review count | High | Business Feedback | ❌ | ❌ | ❌ | Review count to remain current |
| R1.1-166 | Add "Trusted by Real Travellers" messaging | Reinforce authenticity using real customer experiences | High | Business Feedback | ⏳ | ❌ | ❌ | Placement to be finalized |
| R1.1-167 | Improve credibility across the website | Review all pages for stronger trust messaging | High | Business Feedback | ❌ | ❌ | ❌ | End-to-end review |
| R1.1-168 | Replace "Package" terminology | Prefer "Experience" or similar customer-friendly wording | High | Business Feedback | ⏳ | ❌ | ❌ | Validate all pages |
| R1.1-169 | Standardize "Vacation" terminology | Replace "Holiday" where appropriate | Medium | Business Feedback | ⏳ | ❌ | ❌ | Avoid changing destination-specific names where inappropriate |
| R1.1-170 | Review About Us storytelling | Ensure the brand story reflects SMV's personalised approach | Medium | Business Feedback | ⏳ | ❌ | ❌ | Final editorial review |
| R1.1-171 | Display office visit note | Mention that office visits are by prior appointment only | Medium | Business Feedback | ❌ | ❌ | ❌ | Placement to be confirmed |
| R1.1-172 | Evaluate MSME/Udyam display | Assess whether MSME/Udyam registration should be displayed | Low | Business Feedback | ❌ | ❌ | ❌ | Decision pending |
| R1.1-173 | Exclude GST details from public website | Keep GST information off customer-facing pages | Medium | Business Feedback | ✅ | ⏳ | ⏳ | Validate during final content review |
| R1.1-174 | Review overall website tone | Ensure the website feels warm, premium and conversational | High | Business Feedback | ❌ | ❌ | ❌ | Final business walkthrough |
| R1.1-175 | Review emotional consistency | Ensure every section reinforces "More Than a Trip. It's an Experience." | High | Business Feedback | ❌ | ❌ | ❌ | Complete end-to-end content review |
| R1.1-176 | Validate customer trust journey | Confirm that trust-building elements appear naturally throughout the customer journey | High | Business Feedback | ❌ | ❌ | ❌ | Final UX validation |
| R1.1-177 | Final Business Experience Review | Complete holistic review of branding, credibility, storytelling and customer experience before Release 1.1 sign-off | Critical | Business Review | ❌ | ❌ | ❌ | Final Product Owner approval required |

---