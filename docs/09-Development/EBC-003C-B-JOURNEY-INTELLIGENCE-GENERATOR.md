# EBC-003C-B — Journey Intelligence Generator

**Canonical Implementation Specification**

**Version:** 1.0

**Status:** Approved for Implementation

**Project:** Search My Vacation (SMV)

**Component:** Journey Director Intelligence Platform

**Phase:** Runtime Intelligence Generation

# Implementation Card: EBC-003C-B
## 1. Objective
Implement the Journey Intelligence Generator, a deterministic generation pipeline that converts the approved business-authored Journey Intelligence workbook into production-ready runtime intelligence consumed by the Journey Director.
This component establishes a strict separation between:
- Business Knowledge
- Generated Runtime Intelligence
- Traveller Experience
- The Journey Director runtime must never depend directly on Excel workbooks.
- Instead, the workbook becomes the single business-maintained source from which deterministic runtime artifacts are generated.

## 2. Repository
Work exclusively inside:
/Users/viveksophu/Documents/Projects/SearchMyVacation
Expected repository:
SearchMyVacation
Do not change repositories.
Do not commit.
Do not push.
Do not stash.
Do not restore.
Do not reset.
Do not overwrite unrelated work.
Preserve the existing working tree exactly as it exists before this task.

## 3. Inputs
Use the approved business workbook:
```text
Journey Director Intelligence Enriched.xlsx
```
This workbook is now the canonical Release 1 business intelligence source.
It must be treated as read-only.
The generator must never modify the workbook.
The workbook must never become a runtime dependency.

## 4. High-Level Architecture
   Business Team
   │
   ▼
   Journey Director Intelligence Enriched.xlsx
   │
   ▼
   Journey Intelligence Generator (EBC-003C-B)
   │
   ┌───────────────┼────────────────┐
   ▼               ▼                ▼
   Journey DNA     Compatibility      Constraints
   │               │                │
   └───────────────┼────────────────┘
   ▼
   Runtime JSON Artifacts
   │
   ▼
   Journey Director Decision Engine
   │
   ▼
   Narrative Intelligence (Future)
   │
   ▼
   Traveller Recommendation UI

## 5. Design Principles
The implementation shall satisfy the following architectural principles.
### 5.1 Deterministic
Given:
- identical workbook
- identical generator version
- the output must always be identical.
- No randomness.
- No AI-generated runtime content.
- No probabilistic generation.
### 5.2 Explainable
- Every recommendation must remain explainable.
- Every compatibility score must be traceable.
- Every contradiction must have a reason.
- Every runtime artifact must map back to workbook data.
### 5.3 Business Owned
Business users own:
- destinations
- traveller types
- emotional goals
- experiences
- Journey DNA
- compatibility
- constraints
Developers own:
- parsing
- validation
- generation
- runtime loading
- schemas
### 5.4 Runtime Independence
The production website must never read Excel files.
Runtime consumes generated JSON only.
### 5.5 Versioned
Every generated artifact must contain:
schema version
generator version
workbook checksum

## 6. Directory Structure
Create a dedicated generation structure.
web/

  generated/

      journey-dna.json

      compatibility-matrix.json

      constraint-library.json

      reason-library.json

      journey-seeds.json

      journey-templates.json

      metadata.json

      intelligence-manifest.json
Do not mix generated files with handwritten configuration.
Generated assets must live in one dedicated location.

## 7. Generator Structure
Implement a dedicated generation module.
Suggested structure:
web/

  scripts/

      journey-intelligence/

          loadWorkbook.ts

          validateWorkbook.ts

          generateJourneyDNA.ts

          generateCompatibility.ts

          generateConstraints.ts

          generateReasons.ts

          generateJourneySeeds.ts

          generateTemplates.ts

          generateMetadata.ts

          generateManifest.ts

          writeArtifacts.ts

          verifyArtifacts.ts

          index.ts
Names may vary slightly if existing project conventions require.
Responsibilities must remain separated.

## 8. Phase 1 — Workbook Loader
Implement a deterministic workbook loader.
Responsibilities:
- open workbook
- locate required sheets
- validate required sheets exist
- validate headers
- validate row integrity
- normalize values
- produce typed internal objects
The loader must fail immediately if:
- workbook missing
- sheet missing
- mandatory header missing
- duplicate IDs
- malformed rows
- incompatible schema
- No silent recovery.
- No ignored rows.

## 9. Required Workbook Sheets
Validate the existence of all required sheets.
Mandatory:
Traveller Types

Emotional Goals

Desired Experiences

Destination Catalogue

Destination Intelligence

Compatibility Matrix

Source Register

Review Register
If any sheet is missing:
Generation must stop.

## 10. Workbook Validation
Validate at minimum:
- Traveller Types
- unique names
- unique IDs
- no blanks
- Emotional Goals
- unique values
- required header
- no empty records
Desired Experiences
- unique values
- required header
Destination Catalogue
Validate:
- unique destination IDs
- unique region IDs
- destination names
- region names
- travel scope
Destination Intelligence
Validate:
- Journey Base classification
- Record Type
- Journey DNA
- Comfort
- Pace
- Suggested Duration
- Best Season
- Operational Confidence
Required fields must not be blank unless explicitly marked:
REVIEW_REQUIRED
Compatibility Matrix
Validate:
- traveller compatibility
- emotional compatibility
- experience compatibility
Score range:
0

1

2

3

4

5
Reject any other value.

## 11. Internal Runtime Models
Convert workbook rows into strongly typed runtime models.
Examples:
TravellerType

EmotionalGoal

DesiredExperience

Destination

Region

JourneyDNA

CompatibilityRule

ConstraintRule

ReasonCode

JourneySeed

JourneyTemplate
Avoid anonymous objects.
Avoid dynamic property access where practical.
Prefer typed interfaces.

## 12. Validation Report
Produce an internal validation report before generation begins.
Include:
workbook loaded
sheet count
row counts
duplicate checks
schema checks
validation warnings
validation failures
Generation proceeds only if:
Validation Status

PASS
Warnings are permitted.
Errors are not.

## 13. Phase 2 — Runtime Artifact Generation
After validation completes successfully:
Generate deterministic runtime artifacts.
Each artifact must be generated independently.
Failure in one artifact must fail the entire generation process.
Partial runtime generation is not permitted.

## 14. Generated Artifacts
Generate:
journey-dna.json

compatibility-matrix.json

constraint-library.json

reason-library.json

journey-seeds.json

journey-templates.json

metadata.json

intelligence-manifest.json
No additional undocumented runtime files.

## 15. Phase 3 — Journey DNA Generation
Generate one Journey DNA object for every Journey Base.
Each object shall include:
Identity
destination ID
region ID
destination
region
travel scope
record type
Journey Characteristics
journey identity
primary experiences
secondary experiences
signature experiences
emotional outcomes
strengths
avoidWhen
comfort range
journey pace
suggested duration
best season
shoulder season
seasonal cautions
operational confidence
Compatibility References
Reference IDs only.
Do not embed duplicated compatibility logic.
Journey DNA should remain compact and reusable.

## 16. Phase 4 — Compatibility Runtime Generation
Generate a deterministic compatibility runtime from the approved workbook.
This runtime becomes the primary lookup mechanism used by the Journey Director during recommendation scoring.
Compatibility must never be embedded directly inside the recommendation engine.
Compatibility Categories
Generate compatibility data for:
Traveller Types

Emotional Goals

Desired Experiences

Journey Comfort

Journey Pace
Each category must be independently addressable.
Compatibility Object
Each compatibility record shall include:
Region ID

Compatibility Category

Compatibility Key

Score

Reason Code
Example:
{
  "regionId": "indonesia-bali-ubud",
  "category": "TravellerType",
  "key": "Couple",
  "score": 5,
  "reasonCode": "ROMANTIC_RETREAT"
}
The runtime must remain compact.
Do not duplicate Journey DNA information.
Compatibility Rules
Every compatibility score shall satisfy:
Integer only
Range: 0–5
Exactly one reason code
Stable deterministic output
Do not permit:
Null scores
Decimal scores
Multiple scores for the same key
Missing reason codes
Score Definitions
The generator shall preserve the controlled scoring model.
Score	Meaning
5	Exceptional Match
4	Strong Match
3	Suitable
2	Limited Match
1	Weak Match
0	Contradiction

Do not introduce additional score levels.

## 17. Phase 5 — Constraint Library Generation
Generate a structured constraint library.
The Journey Director will consult this library before ranking destinations.
Constraints are not recommendations.
They define deterministic exclusions and penalties.
Constraint Categories
Support at least:
Traveller Constraints

Emotional Constraints

Experience Constraints

Journey Pace Constraints

Comfort Constraints

Operational Constraints

Destination Scope Constraints
Constraint Object
Each constraint shall include:
Constraint ID

Constraint Type

Source

Target

Severity

Reason Code
Example:
{
  "constraintId": "CTR-001",
  "type": "Experience",
  "source": "Mountain Retreat",
  "target": "Beach Only",
  "severity": "Contradiction",
  "reasonCode": "NO_MOUNTAIN_EXPERIENCE"
}
Constraint Severity
Supported values:
Contradiction

Strong Penalty

Moderate Penalty

Soft Preference
Do not introduce arbitrary weighting.
The recommendation engine will map these to deterministic scoring.
Constraint Rules
Constraints must remain explainable.
Every constraint must reference:
a valid source
a valid target
an existing reason code
No orphan constraints.

## 18. Destination Scope Rules
Generate runtime rules supporting:
Domestic Only

International Only

Either

Operationally Restricted
Examples:
Traveller explicitly requests:
International
↓
Domestic destinations must not appear.
Traveller explicitly requests:
Domestic
↓
International destinations must not appear.
No preference
↓
Both may participate in scoring.

## 19. Region Hierarchy
Generate a reusable region hierarchy.
Support:
Country

State

Island

Region

Journey Base

Attraction

Experience Cluster
Each child shall reference exactly one parent.
Do not create circular references.

## 20. Journey Base Validation
Only Journey Bases shall participate directly in recommendation ranking.
Attractions may enrich recommendations later.
They must not become primary recommendations.
Example:
✔ Ubud
✔ Nusa Dua
✔ Munnar
✔ Gulmarg
✘ Golden Temple
✘ Jallianwala Bagh

## 21. Phase 6 — Reason Library Generation
Generate a reusable reason library.
The Journey Director and Narrative Intelligence will consume this library.
Reason codes must remain stable.
Avoid embedding traveller-facing prose.
Reason Object
Each reason shall include:
Reason Code

Category

Summary

Description

Applicable Context
Example:
{
  "reasonCode": "PREMIUM_BEACH",
  "category": "Experience",
  "summary": "Premium coastal relaxation.",
  "description": "Strong suitability for premium beachfront experiences.",
  "context": [
    "Experience",
    "Recommendation"
  ]
}
Reason Categories
Support at least:
Traveller

Emotion

Experience

Constraint

Comfort

Pace

Operational

Season

Journey DNA
Reason Code Standards
Reason codes shall:
remain immutable
use uppercase
use underscores
contain no spaces
be unique
Examples:
PREMIUM_BEACH

MOUNTAIN_RETREAT

SLOW_TRAVEL

HERITAGE_EXPLORATION

FAMILY_FRIENDLY

ROMANTIC_ESCAPE
Reason Validation
Validate:
no duplicates
no unused codes
no missing descriptions
no invalid references
Every reason code must be referenced at least once.

## 22. Cross-Reference Integrity
Before writing artifacts:
Validate that:
Journey DNA
↓
Compatibility
↓
Constraint Library
↓
Reason Library
forms a complete graph.
There must be:
no broken references
no orphan records
no dangling IDs
no duplicate IDs

## 23. Artifact Serialization
All runtime artifacts shall:
use UTF-8
use consistent indentation
use deterministic key ordering
use stable array ordering
The same workbook must always generate byte-identical JSON (except timestamp fields where explicitly permitted).

## 24. Error Handling
Generation must stop immediately if:
workbook validation fails
duplicate IDs exist
invalid compatibility values exist
required Journey DNA is missing
malformed constraints exist
serialization fails
Do not write partial artifacts.
Rollback incomplete generation if necessary.

## 25. Logging
Produce structured generation logs.
Include:
Workbook Loaded

Validation Started

Validation Passed

Generating Journey DNA

Generating Compatibility

Generating Constraints

Generating Reasons

Writing Artifacts

Verification Started

Verification Passed

Generation Complete
Errors must include:
component
record identifier
sheet name (where applicable)
validation message

## 26. Phase 7 — Journey Seed Generation
Generate structured journey seeds for each eligible Journey Base.
Journey seeds are factual, destination-specific building blocks that will later support Narrative Intelligence.
They are not final traveller-facing copy.
They must remain concise, reusable, and grounded in the approved workbook.
Required Journey Seed Fields
Generate at least:
Arrival

First Impression

Shared Moment

Signature Experience

Relaxation Moment

Local Discovery

Food or Cultural Moment

Journey High Point

Journey Ending

Why This Region

Worth Considering

Potential Trade-off
Journey Seed Object
Example:
{
  "regionId": "indonesia-bali-ubud",
  "arrival": "A transfer inland from Bali's southern arrival gateways.",
  "firstImpression": "Green valleys, temple architecture, and a slower inland rhythm.",
  "sharedMoment": "A quiet morning overlooking rice terraces.",
  "signatureExperience": "A culture-and-wellness day centred around Ubud.",
  "relaxationMoment": "Time at a retreat or spa surrounded by tropical greenery.",
  "localDiscovery": "Exploring artisan villages, markets, and nearby temples.",
  "foodOrCulturalMoment": "A Balinese meal paired with a traditional performance.",
  "journeyHighPoint": "A sunrise, temple, or landscape experience in central Bali.",
  "journeyEnding": "A slower final evening before continuing to the coast or returning home.",
  "whyThisRegion": "It combines culture, wellness, nature, and a reflective pace.",
  "worthConsidering": "It works particularly well when the traveller values depth over beach time.",
  "potentialTradeOff": "It is not the strongest fit for a beach-first holiday."
}
Journey Seed Rules
Journey seeds must:
be specific to the destination-region
remain factual
avoid exaggerated claims
avoid generic luxury language
avoid final recommendation paragraphs
avoid unresolved placeholders
preserve REVIEW_REQUIRED where source data is incomplete
Do not invent story details not supported by the workbook.
Seed Eligibility
Generate journey seeds for:
Journey Bases
Islands that function as Journey Bases
Region records explicitly approved for recommendation use
Do not generate full journey seeds for:
Attractions
Experience Clusters
Operationally restricted records
Records marked unsuitable for primary recommendation
Attractions may later appear inside a Journey Base's supporting experience data.

## 27. Phase 8 — Journey Template Generation
Generate flexible journey templates for every eligible Journey Base.
Templates are not fixed packages.
They describe a suggested rhythm that the Journey Director can use when explaining how a journey might unfold.
Required Journey Template Fields
Include:
Region ID

Minimum Duration

Ideal Duration

Journey Rhythm

Arrival Phase

Discovery Phase

Signature Phase

Slow or Recovery Phase

Optional Extension

Departure Phase
Journey Template Object
Example:
{
  "regionId": "india-kerala-munnar",
  "minimumDurationDays": 2,
  "idealDurationDays": 3,
  "journeyRhythm": "Balanced with slow scenic periods.",
  "arrivalPhase": "Travel into the hills and settle into the landscape.",
  "discoveryPhase": "Explore plantations, viewpoints, and local nature.",
  "signaturePhase": "Spend a focused day around Munnar's defining mountain experiences.",
  "slowPhase": "Allow unstructured time at the stay or in the surrounding hills.",
  "optionalExtension": "Combine with Thekkady, Alleppey, or another Kerala journey base.",
  "departurePhase": "Leave with sufficient transfer time for the onward gateway."
}
Journey Template Rules
Templates must:
reflect workbook duration guidance
use region-level intelligence
remain flexible
avoid exact hotel or vendor references
avoid mandatory commercial inclusions
avoid package pricing
avoid pretending the itinerary has been booked
remain suitable for later narrative composition
If duration data is incomplete, preserve REVIEW_REQUIRED rather than estimating silently.

## 28. Metadata Generation
Generate:
generated/metadata.json
Metadata shall describe the generated intelligence package at a high level.
Required Metadata Fields
Include at minimum:
{
  "schemaVersion": "1.0",
  "generatorVersion": "1.0.0",
  "generatedFrom": "Journey Director Intelligence Enriched.xlsx",
  "generatedAt": "ISO-8601 timestamp",
  "recordCounts": {
    "destinationRegions": 0,
    "journeyBases": 0,
    "attractions": 0,
    "experienceClusters": 0,
    "islands": 0,
    "travellerTypes": 0,
    "emotionalGoals": 0,
    "desiredExperiences": 0,
    "journeyDNARecords": 0,
    "compatibilityRecords": 0,
    "constraintRecords": 0,
    "reasonCodes": 0,
    "journeySeedRecords": 0,
    "journeyTemplateRecords": 0
  },
  "validation": {
    "status": "PASS",
    "warnings": 0,
    "reviewRequiredRecords": 0
  }
}
Metadata is descriptive.
The Intelligence Manifest defined in Phase 9 remains the authoritative integrity record.

## 29. Phase 9 — Intelligence Manifest
Generate:
generated/intelligence-manifest.json
This manifest is mandatory.
It records exactly how the runtime intelligence package was produced and verified.
It provides:
traceability
reproducibility
version auditing
integrity checking
future CI/CD support
runtime startup verification
Manifest Requirements
The manifest must contain at least:
{
  "schemaVersion": "1.0",
  "generatorVersion": "1.0.0",
  "generatedAt": "ISO-8601 timestamp",
  "generatedFromWorkbook": "Journey Director Intelligence Enriched.xlsx",
  "workbookChecksum": "sha256-value",
  "workbookMetadata": {
    "filename": "Journey Director Intelligence Enriched.xlsx",
    "version": null,
    "createdAt": null,
    "modifiedAt": null
  },
  "recordCounts": {
    "destinationRegions": 0,
    "journeyBases": 0,
    "attractions": 0,
    "experienceClusters": 0,
    "islands": 0,
    "travellerTypes": 0,
    "emotionalGoals": 0,
    "desiredExperiences": 0,
    "journeyDNARecords": 0,
    "compatibilityRecords": 0,
    "constraintRecords": 0,
    "reasonCodes": 0,
    "journeySeedRecords": 0,
    "journeyTemplateRecords": 0
  },
  "artifacts": {
    "journeyDNA": {
      "path": "generated/journey-dna.json",
      "checksum": "sha256-value"
    },
    "compatibilityMatrix": {
      "path": "generated/compatibility-matrix.json",
      "checksum": "sha256-value"
    },
    "constraintLibrary": {
      "path": "generated/constraint-library.json",
      "checksum": "sha256-value"
    },
    "reasonLibrary": {
      "path": "generated/reason-library.json",
      "checksum": "sha256-value"
    },
    "journeySeeds": {
      "path": "generated/journey-seeds.json",
      "checksum": "sha256-value"
    },
    "journeyTemplates": {
      "path": "generated/journey-templates.json",
      "checksum": "sha256-value"
    },
    "metadata": {
      "path": "generated/metadata.json",
      "checksum": "sha256-value"
    }
  },
  "generation": {
    "recordsProcessed": 0,
    "compatibilityRulesGenerated": 0,
    "contradictionsGenerated": 0,
    "validationRulesExecuted": 0,
    "durationMilliseconds": 0
  },
  "validation": {
    "status": "PASS",
    "checksExecuted": 0,
    "checksPassed": 0,
    "checksFailed": 0,
    "warnings": 0,
    "reviewRequiredRecords": 0
  }
}

## 30. Manifest Determinism
Use deterministic key ordering and stable artifact ordering.
The manifest must be reproducible from the same workbook and generator version.
The following fields may legitimately vary between runs:
generatedAt

durationMilliseconds
All other content must remain identical when inputs and generator code are unchanged.
For deterministic comparison testing, either:
exclude volatile fields from the comparison, or
support a deterministic test mode with fixed values
Do not weaken the production manifest merely to simplify testing.

## 31. Workbook Traceability
Capture:
workbook filename
workbook SHA-256 checksum
workbook version, if explicitly present
workbook creation timestamp, if reliably available
workbook modification timestamp, if reliably available
Do not infer a workbook version from the filesystem filename unless the project explicitly defines that convention.
Unavailable values may be stored as:
null
Do not fabricate metadata.

## 32. Artifact Checksums
Calculate SHA-256 checksums for every generated runtime artifact.
Checksums must be calculated from the final written file bytes.
Do not calculate checksums from in-memory objects before serialization.
The manifest itself must not contain its own checksum unless a separate packaging mechanism is introduced later.

## 33. Manifest Write Order
To avoid circular dependencies, use this order:
1. Validate workbook
2. Generate all runtime artifact objects
3. Write non-manifest artifacts to a temporary output directory
4. Calculate artifact checksums
5. Generate metadata
6. Write metadata
7. Calculate metadata checksum
8. Generate intelligence manifest
9. Write intelligence manifest
10. Verify the complete generated package
11. Atomically replace the active generated directory
Do not overwrite the active runtime package until the new package has passed validation.

## 34. Atomic Generation
Generation must be atomic.
Suggested model:
generated-temp/
        ↓
validate
        ↓
verify checksums
        ↓
rename or replace
        ↓
generated/
If generation fails:
preserve the existing valid generated package
remove or isolate incomplete temporary files
report the failure clearly
do not leave a partially updated runtime directory

## 35. Runtime Integrity Verification
Implement a lightweight runtime verification mechanism.
Before the Journey Director loads generated intelligence, verify:
manifest exists
all expected artifacts exist
artifact paths match the manifest
artifact checksums match
supported schema version is used
supported generator version range is used
required record counts are non-zero
validation status is PASS
If verification fails:
do not load a partial intelligence package
emit a clear error
preserve the existing UI where possible
do not silently fall back to incomplete generated data

## 36. Runtime Failure Behaviour
When integrity verification fails in development:
fail loudly
include the failed artifact
include expected and actual checksum where relevant
provide regeneration guidance
When integrity verification fails in production:
prevent the invalid intelligence package from being used
log a concise diagnostic
use an approved safe fallback only if one already exists in the repository
do not create a new hidden fallback in this task
Do not silently bypass manifest validation.

## 37. Generator Command
Add a clear project command.
Example:
{
  "scripts": {
    "generate:journey-intelligence": "tsx scripts/journey-intelligence/index.ts",
    "verify:journey-intelligence": "tsx scripts/journey-intelligence/verifyArtifacts.ts"
  }
}
Adapt the command to existing project tooling.
Do not introduce an unnecessary runtime dependency when existing tooling can support the generator.

## 38. Generator Inputs
The generator command must accept the workbook path explicitly or through a clearly documented configuration.
Example:
npm run generate:journey-intelligence -- \
  --workbook "../outputs/ebc-003c-a/Journey Director Intelligence Enriched.xlsx"
Avoid hard-coding a user-specific absolute path inside source code.
The repository may provide a documented default path only if that default is stable and project-relative.

## 39. Generator Exit Codes
Use meaningful process exit behaviour.
0 — Generation and verification succeeded

1 — Validation, generation, serialization, or verification failed
Do not report success when warnings have become blocking errors.

## 40. Generation Report
Create a machine-readable or Markdown generation report.
Suggested location:
outputs/ebc-003c-b/JOURNEY-INTELLIGENCE-GENERATION-REPORT.md
Include:
workbook filename
workbook checksum
generator version
schema version
records processed
artifacts created
artifact checksums
validation results
warnings
REVIEW_REQUIRED counts
generation duration
runtime integration status
determinism test result
Do not modify the approved enriched workbook.

## 41. Runtime Integration
Integrate the generated runtime artifacts into the existing Journey Director.
The objective of this phase is not to redesign or enhance recommendation logic.
Instead, replace the existing hard-coded destination intelligence with the generated runtime intelligence.
Runtime Responsibilities
The Journey Director shall:
Load generated artifacts.
Verify the Intelligence Manifest.
Build in-memory lookup structures.
Execute the existing deterministic recommendation engine.
Return the same recommendations for the same inputs.
The recommendation logic itself should remain functionally unchanged.
Only the intelligence source changes.
Runtime Loading Order
Use the following startup sequence:
Application Startup
        │
        ▼
Locate generated artifacts
        │
        ▼
Load intelligence-manifest.json
        │
        ▼
Verify checksums
        │
        ▼
Verify schema version
        │
        ▼
Load metadata
        │
        ▼
Load Journey DNA
        │
        ▼
Load Compatibility Matrix
        │
        ▼
Load Constraint Library
        │
        ▼
Load Reason Library
        │
        ▼
Load Journey Seeds
        │
        ▼
Load Journey Templates
        │
        ▼
Create runtime lookup indexes
        │
        ▼
Journey Director Ready
The application must never partially load runtime intelligence.

## 42. Runtime Lookup Indexes
During application startup, construct efficient lookup structures.
Suggested indexes:
JourneyDNAByRegionId

CompatibilityByRegionId

ConstraintBySource

ConstraintByTarget

ReasonByCode

JourneySeedByRegionId

JourneyTemplateByRegionId
These indexes are runtime optimisations only.
Do not serialize them.

## 43. Performance Requirements
The generator is expected to run infrequently.
The Journey Director runtime executes continuously.
Therefore:
optimise runtime reads,
not workbook parsing.
Target goals:
Operation	Target
Workbook generation	< 10 seconds
Runtime loading	< 1 second
Runtime recommendation lookup	Near constant time

The exact numbers are guidelines, not hard acceptance limits.

## 44. Backward Compatibility
This implementation must not change:
Journey Passport flow
Journey Director UI
Recommendation screens
Existing traveller inputs
Existing deterministic scoring philosophy
Existing navigation
Existing route structure
Only the underlying intelligence source changes.

## 45. Validation Suite
Create automated validation covering:
Workbook Validation
Required sheets
Required headers
Duplicate IDs
Missing Journey Bases
Invalid compatibility scores
Missing mandatory fields
Invalid record types
Artifact Validation
Validate:
JSON syntax
Schema compliance
Duplicate IDs
Broken references
Missing reason codes
Missing constraints
Invalid Journey DNA references
Manifest Validation
Verify:
Workbook checksum
Artifact checksums
Schema version
Generator version
Manifest completeness
Runtime Validation
Verify:
All artifacts load successfully.
Runtime indexes build successfully.
Recommendation engine starts successfully.
No orphan runtime records exist.
Determinism Validation
Run the generator twice using the identical workbook.
Validate:
Identical Journey DNA
Identical Compatibility Matrix
Identical Constraints
Identical Reason Library
Identical Journey Seeds
Identical Journey Templates
The only permissible differences are:
generatedAt

durationMilliseconds
No other differences are acceptable.

## 46. Documentation
Update the project documentation.
Create:
docs/09-Development/JOURNEY-INTELLIGENCE-GENERATOR.md
Document:
Purpose
Architecture
Folder structure
Workbook requirements
Generation workflow
Manifest schema
Runtime verification
Regeneration process
Validation workflow
Troubleshooting guide
Include diagrams where appropriate.

## 47. Repository Deliverables
The implementation shall create or update only the files required for the generator.
Expected additions include:
web/scripts/journey-intelligence/

web/generated/

docs/09-Development/JOURNEY-INTELLIGENCE-GENERATOR.md

outputs/ebc-003c-b/

JOURNEY-INTELLIGENCE-GENERATION-REPORT.md
Do not introduce unrelated refactoring.
Do not move existing Journey Director components unless technically required.

## 48. Repository Restrictions
During this task:
Do NOT:
redesign the Journey Director UI
change Journey Passport
alter recommendation behaviour
regenerate the enriched workbook
modify the canonical workbook
introduce AI-generated runtime recommendations
create live web lookups
add authentication
introduce backend persistence
commit
push
reset
stash
restore unrelated work
This EBC is limited to deterministic runtime intelligence generation.

## 49. Acceptance Criteria
The implementation is complete only if all of the following are satisfied.
Workbook
Approved workbook loads successfully.
Workbook remains unchanged.
Workbook checksum is preserved.
Runtime Artifacts
Successfully generate:
journey-dna.json

compatibility-matrix.json

constraint-library.json

reason-library.json

journey-seeds.json

journey-templates.json

metadata.json

intelligence-manifest.json
Validation
Workbook validation passes.
Artifact validation passes.
Runtime validation passes.
Manifest validation passes.
Determinism validation passes.
Runtime
Journey Director consumes generated intelligence.
Existing recommendation behaviour remains deterministic.
Existing recommendation quality is preserved or improved.
Runtime startup succeeds.
Runtime verification succeeds.
Documentation
Generator documentation completed.
Generation report completed.
Manifest documented.
Quality
No orphan IDs.
No broken references.
No duplicate IDs.
No invalid compatibility scores.
No invalid reason codes.
No partial runtime generation.

## 50. Completion Report
At completion, provide a detailed implementation report.
Include:
Repository
Repository path
Current branch
Git status
Workbook
Workbook filename
Workbook checksum
Workbook schema version (if applicable)
Generation Summary
Report:
Destination-region records processed
Journey Bases generated
Attractions processed
Experience Clusters processed
Islands processed
Traveller Types processed
Emotional Goals processed
Desired Experiences processed
Runtime Artifacts
For each artifact report:
filename
record count
file size
SHA-256 checksum
Validation Summary
Include:
validation checks executed
validation checks passed
validation warnings
validation failures
REVIEW_REQUIRED records inherited
runtime verification result
Determinism Summary
Report:
number of generator executions
comparison result
deterministic status
Runtime Integration
Confirm:
runtime integration completed
Journey Director loads generated artifacts
no UI changes introduced
no recommendation engine redesign performed
Documentation
List all documentation created or updated.
Known Limitations
Document any remaining limitations that are intentionally deferred to future EBCs.
Examples include:
Narrative Intelligence (EBC-003D)
Explainable Recommendation Experience
Journey Story Composition
Dynamic Traveller Narratives
Multi-destination journey composition
Future CI/CD automation
Final Confirmation
Explicitly confirm:
Canonical workbook remained unchanged.
Runtime intelligence generated successfully.
Intelligence Manifest generated successfully.
Runtime verification passed.
Repository contains no unrelated changes introduced by this task.
No commits or pushes performed.

## 51. Success Definition
EBC-003C-B is considered successfully completed when:
The approved business workbook can be transformed into a complete runtime intelligence package through a single deterministic generation command.
The Journey Director consumes only the generated runtime artifacts.
Every runtime artifact is versioned, validated, traceable, and reproducible.
The Intelligence Manifest provides end-to-end integrity verification for the generated package.
The implementation establishes the permanent foundation for all future Journey Director enhancements, including Narrative Intelligence, Explainable Recommendations, and Journey Story Generation.
End of Specification
Document: EBC-003C-B — Journey Intelligence Generator
Version: 1.0
Status: Approved for Implementation
Project: Search My Vacation
Component: Journey Director Intelligence Platform