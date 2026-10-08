EBC-R1.3-WS13-025
Phase 1 – Milestone B Engineering Implementation Authorisation
Release: Release 1.3
Workstream: WS13 – Journey Workspace
Phase: Phase 1 – Journey Core
Milestone: Milestone B – Journey Workspace User Experience
Document Type: Engineering Baseline Confirmation (EBC)
Prepared By: Tiger – Delivery Manager
Assigned To: Radha – Engineering Lead
Decision Authority: Vivek – Product Owner
1. Background
Milestone A has been successfully completed.
Checkpoint 1 has passed.
The following governance gates have been completed:
- Product Baseline approved
- UX Baseline approved
- Architecture Baseline approved
- Engineering Readiness approved
- Engineering Execution Plan approved
- Engineering Baseline frozen
- Milestone A completed
- Checkpoint 1 passed
- Milestone B authorised by the Product Owner
Engineering is now authorised to begin Milestone B implementation.
2. Objective
Implement the first complete user-facing Journey Workspace experience using the backend services delivered during Milestone A.
Milestone B is expected to deliver a functional Journey Workspace suitable for engineering validation before Phase 1 QA.
3. Scope
Milestone B shall implement the following capabilities.
Workspace
- Journey Workspace shell
- Workspace routing
- Workspace loading behaviour
- Workspace error handling
Overview
Implement:
- Journey summary
- Status indicators
- Journey metadata
- Service Category
- Assigned Consultant
- Traveller summary
- Journey lifecycle status
- Operational information
Itinerary
Implement:
- Itinerary display
- Timeline presentation
- Read-only itinerary rendering
- Empty-state handling
History
Implement:
- Complete History timeline
- Audit events
- Event ordering
- Labels approved by Sophie
- Timestamp presentation
Journey Lifecycle Actions
Implement:
- Start Preparation
- Hold Journey
- Resume Journey
- Complete Journey
- Cancel Journey
- Reassign Journey
Each action shall integrate with the Milestone A APIs.
Contact Management
Implement:
- Contact editing
- Validation
- Error handling
Do not introduce functionality outside the approved Product scope.
Legacy Journey Adoption
Implement:
- Adoption workflow
- Administrator-only behaviour
- Nights calculation
- Audit history
- Error handling
Security
Implement:
- Role-based visibility
- Administrator override
- Ownership enforcement
- UI restrictions
- Error presentation
Phase 1 UX
Implement only UX approved for Phase 1.
Hide all Phase 2 and Phase 3 functionality.
Do not display "Coming Soon" placeholders.
4. Explicitly Out of Scope
The following remain outside Milestone B:
- Vendor Management
- Tasks
- Notifications
- Documents
- Readiness checklist content
- Template Management
- User Administration
- Replacement Journey workflow
- Phase 2 modules
- Phase 3 modules
- Performance optimisation
- Infrastructure changes
5. Engineering Constraints
Radha shall continue following the approved Engineering Baseline.
Specifically:
- No schema changes beyond approved M11.
- No Product scope expansion.
- No UX deviations.
- No Architecture deviations without approval.
- No shared database migration.
- No Preview deployment.
- No Production deployment.
Engineering shall remain local until the deployment checkpoint authorises progression.
6. Engineering Expectations
Engineering should emphasise:
- Maintainability
- Readability
- Incremental delivery
- Strong typing
- Error handling
- Clear component separation
- Reusable services
- Clean API integration
Document engineering observations immediately.
7. Deliverables
Milestone B shall produce:
A
Journey Workspace UI
B
Overview tab
C
Itinerary tab
D
History tab
E
Journey lifecycle actions
F
Legacy Adoption workflow
G
Contact Management
H
Updated engineering documentation
I
Engineering validation results
8. Exit Criteria
Milestone B shall be considered complete when:
- All approved Phase 1 UI is implemented.
- Backend integration is complete.
- Lifecycle actions operate correctly.
- History behaves correctly.
- Legacy Adoption operates correctly.
- Security behaviour is implemented.
- Local engineering validation passes.
- No unauthorised scope has been introduced.
- Engineering documentation is complete.
9. Engineering Principles
During Milestone B:
- Engineering shall not redesign approved Product behaviour.
- Engineering shall not redesign UX.
- Engineering shall not redesign Architecture.
- Engineering shall prefer incremental implementation.
- Engineering shall validate locally before requesting governance review.
- Engineering shall immediately document any new engineering risks.
10. Completion Package
Upon completion of Milestone B, prepare:
EBC-R1.3-WS13-026
Phase 1 – Milestone B Engineering Completion & Review
The completion package shall include:
- Implementation summary
- Engineering validation
- Local testing summary
- Known issues
- Engineering observations
- Risks
- Architecture impacts
- Deployment readiness assessment
- Recommendations for Checkpoint 3
11. Success Criteria
Milestone B will be considered successful when:
- Journey Workspace is fully functional for the approved Phase 1 scope.
- User experience aligns with the approved UX baseline.
- Backend integration is complete.
- Engineering quality meets Release 1.3 standards.
- No governance deviations occur.
- The solution is ready for Checkpoint 3 and deployment preparation.
Engineering Lead Statement
Radha,
Milestone A established the engineering foundation.
Milestone B transforms that foundation into the first complete Journey Workspace experience.
Continue following the engineering discipline demonstrated during Milestone A.
Maintain strict alignment with the approved Product, UX and Architecture baselines.
Do not optimise prematurely.
Do not introduce functionality from future phases.
Document engineering findings as they occur.
Raise Product or Architecture questions immediately if implementation reveals ambiguity rather than making assumptions.
Your objective is to produce a stable, maintainable and governance-compliant implementation that is ready for Checkpoint 3.
Tiger's Authorisation
Radha,
Checkpoint 1 has formally passed.
Milestone B is authorised.
Engineering now has the authority to proceed with implementation in accordance with the approved Engineering Execution Plan.
No further governance approval is required until Milestone B reaches completion or unless a material Product, UX or Architecture issue is identified during implementation.
Upon completion, return with EBC-R1.3-WS13-026 – Phase 1 Milestone B Engineering Completion & Review for governance review.
Engineering is authorised to begin immediately.
— Tiger
Delivery Manager
Release 1.3 – WS13 Journey Workspace





  


























    To pick up a draggable item, press the space bar.
    While dragging, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.