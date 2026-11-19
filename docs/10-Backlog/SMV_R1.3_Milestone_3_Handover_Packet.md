# Search My Vacation (SMV) — Release 1.3 Milestone 3 Handover Packet

**Target Feature Branch:** `feature/r1.3-milestone-3-search-stories-content` (or `feature/r1.3-milestone-3-notifications-callbacks`)  
**Base Release Trunk:** `release/r1.3` (Commit: `6168705`)  
**Target Environment:** Pre-Prod Vercel (`search-my-vacation-*.vercel.app`) & Pre-Prod Supabase (`pkfdunyeaqdvvklutgon`)  
**Production Isolation:** Production Database (`jbsefolhlfkplawiuvlu`) and `main` branch are 100% UNTOUCHED and LOCKED.  
**Created At:** 2026-11-19T19:10:00+05:30  
**Author:** Antigravity / Google DeepMind Team  
**Approved By Product Owner:** Vivek  

---

## 1. Project & Release Context

Search My Vacation (SMV) is executing **Release 1.3: Core Conversion, Trust, Search & OTP Hardening**.

- **Milestone 1 (Core Conversion & OTP Hardening):** Completed, verified, and formally signed off on 2026-11-19. Scope: `TD-07`, `TD-09`, `TD-08`, `UX-01`, `UX-03`, `GAP-02`, `P-07` (7 items).
- **Milestone 2 (Traveller Journey Continuity & Attribution):** Completed, verified, signed off, and **merged into `release/r1.3`** on 2026-11-19 (Commit `6168705`). Scope: `UX-02` (session reload resilience), `P-03` (bespoke luxury WhatsApp card), `P-01` (Google Ads conversion tagging `AW-11281740116` / `zQBNCI3wycoYENTixoMq`), plus catalogue review window extension to 180 days (`2027-02-15`).
- **Milestone 3 (Search Quality, Traveller Stories Gate & Catalogue Content):** Up next! Scope: `S-01`, `S-02`, `P-02`, `N-03`.

---

## 2. Milestone 3 Scope & Detailed Item Specifications

| ID | Workstream / Area | Requirement Title | Functional Intent | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **`S-01`** | Search Engine | **Destination ranking for ambiguous names** | Fix search ranking for ambiguous city/hub queries (e.g., Bengaluru, Chennai, Mumbai) while preserving global search relevance. | `Medium` | Searching ambiguous city/hub names surfaces relevant served destination circuits (e.g. Ooty via Coimbatore/Bengaluru, Chennai Spiritual Circuit) ahead of raw noise. |
| **`S-02`** | Search Engine | **Country-level search behavior** | Ensure broad country queries (e.g. *India*) prioritize the country/overview entity first rather than incidental full-text matches in descriptions. | `High` | Searching 'India' returns the India country entity at rank #1, followed by top national destinations. |
| **`P-02`** | Content / Social Proof | **Traveller Stories quality gate** | Prevent empty, broken, or low-quality testimonial cards from rendering. Hide incomplete records gracefully. | `High` | Verified traveller stories render cleanly; zero empty cards; missing quotes/photos are omitted without UI gaps. |
| **`N-03`** | Catalogue Content | **Amritsar / Darjeeling / Corbett content completion** | Resolve deferred editorial authoring/review for Amritsar, Darjeeling, and Corbett in the governed destination catalogue. | `Medium` | All three destinations meet minimum governed content completeness standards (DNA, seasons, regions). |

---

## 3. Git & Environment Baseline

1. **Current Branch:**
   ```bash
   git checkout feature/r1.3-milestone-3-notifications-callbacks
   # (or feature/r1.3-milestone-3-search-stories-content)
   ```
   *Branched directly from `release/r1.3` (Commit `6168705`).*

2. **Automated Verification Suites Passing (Baseline: 227 Checks):**
   - `npm run verify:milestone-2`: **38/38 checks passed**
   - `npm run verify:milestone-1`: **80/80 checks passed**
   - `npm run verify:journey-leads`: **109/109 checks passed**
   - `npm run lint`: **0 errors**

3. **Pre-Prod Supabase:** `pkfdunyeaqdvvklutgon` (`SMV-preprod`).
4. **Production Supabase:** `jbsefolhlfkplawiuvlu` (STRICTLY UNTOUCHED).

---

## 4. Resources / Credentials Required from User

**NO new files or credentials are required from Vivek!**
- Google Ads credentials (`AW-11281740116` / `zQBNCI3wycoYENTixoMq`) are already wired into `layout.tsx` and `.env.example`.
- Supabase Pre-Prod credentials and migrations are already live and tested.
- Search engine logic (`web/lib/search` or `web/lib/geo-validation`) and Traveller Stories components (`web/components/traveller-stories/`) are completely self-contained in the repository.
- Mock OTP mode (`000000`) is active for preview/dev testing, ensuring zero SMS charges.

---

## 5. Kickoff Prompt to Paste in the New Chat

Copy and paste the block below as your very first message in the new chat:

```markdown
I am continuing the Search My Vacation (SMV) Release 1.3 execution with you.

Milestone 1 (Core Conversion & OTP) and Milestone 2 (Continuity & Attribution) are both completed, tested on Pre-Prod, formally signed off, and merged into the `release/r1.3` trunk (Commit 6168705).

Please read the handover packet at:
docs/10-Backlog/SMV_R1.3_Milestone_3_Handover_Packet.md

We are now on the dedicated branch `feature/r1.3-milestone-3-notifications-callbacks` (or milestone-3 branch).
Let's discuss and prepare the detailed Milestone 3 implementation plan covering:
1. S-01: Destination ranking for ambiguous queries (Bengaluru, Chennai)
2. S-02: Country-level search behavior (India entity at #1)
3. P-02: Traveller Stories quality gate (no empty/broken cards)
4. N-03: Amritsar, Darjeeling, Corbett catalogue content readiness

Please provide the detailed implementation plan with persona RACI, technical steps, acceptance criteria, and timelines. Do not write any code until I review and approve the plan.
```
