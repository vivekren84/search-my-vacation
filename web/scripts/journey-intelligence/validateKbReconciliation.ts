/**
 * GOVERNANCE BOUNDARY — KB → Operational Reconciliation Check (Generation Layer).
 *
 * Implements WP-4 of `EBC-R1.2-03.05-RAD-Destination-Intelligence-Implementation-Planning.md`:
 * "A new validation step in the generation pipeline ... that compares every
 * KB §10/§11 ACTIVE destination/region against the operational layer's row
 * set and reports any KB-approved item with no corresponding row."
 *
 * This is deliberately a one-directional check (Knowledge Base → Operational
 * Layer only) — it does not flag operational rows with no KB counterpart
 * (e.g. a destination present in the workbook under a name the KB does not
 * use). That reverse direction was observed during implementation (see the
 * WP-4 implementation report) and is recorded there as a follow-up
 * recommendation, not implemented here, per this EBC's explicit scope.
 *
 * Operating mode: **Warn Mode**, ratified by `DEC-R1.2-015`
 * (`docs/09-Development/DEC-R1.2-015-Ratification-Warn-Mode-First.md`).
 * Findings are reported; they never throw and never fail generation. Block
 * Mode is not approved for Release 1.2 Phase 2.
 *
 * Ownership: Engineering (Rad), Destination Operational Steward (Rad).
 * Governed by `docs/20-Architecture/ADR-R1.2-WS3-001-Destination-Knowledge-Governance.md`
 * Section 7 (Source of Truth Model, first row) and Section 9 (Change
 * Authority Matrix — generator promotion approval).
 *
 * Added under `R1.2-WS3-IMP-01A-EBC-RAD` (WP-4). No prior generator
 * behaviour changed — this module is additive only.
 */

import {
  KB_APPROVED_PORTFOLIO,
  type KbApprovedDestination,
} from "./kbApprovedPortfolio.js";
import type { WorkbookModel } from "./types.js";

export type KbReconciliationFindingCode =
  | "KB_DESTINATION_ABSENT"
  | "KB_MEMBER_REGION_ABSENT";

export interface KbReconciliationFinding {
  code: KbReconciliationFindingCode;
  kbSection: string;
  destination: string;
  member: string | null;
  message: string;
}

export interface KbReconciliationReport {
  /** Ratified operating mode for Release 1.2 Phase 2 — see DEC-R1.2-015. Findings never block generation. */
  mode: "WARN";
  destinationsChecked: number;
  memberRegionsChecked: number;
  findings: KbReconciliationFinding[];
}

function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function reconcileKbToOperational(
  model: WorkbookModel,
): KbReconciliationReport {
  const findings: KbReconciliationFinding[] = [];
  let memberRegionsChecked = 0;

  const operationalDestinations = new Map<string, string>();
  const operationalRegionsByDestination = new Map<string, Set<string>>();

  for (const record of model.destinationIntelligence) {
    const destKey = normalise(record.destination);
    operationalDestinations.set(destKey, record.destination);
    if (!operationalRegionsByDestination.has(destKey)) {
      operationalRegionsByDestination.set(destKey, new Set());
    }
    operationalRegionsByDestination.get(destKey)!.add(normalise(record.region));
  }

  const checkDestination = (kb: KbApprovedDestination): boolean => {
    const present = operationalDestinations.has(normalise(kb.name));
    if (!present) {
      findings.push({
        code: "KB_DESTINATION_ABSENT",
        kbSection: kb.kbSection,
        destination: kb.name,
        member: null,
        message: `${kb.name} (KB §${kb.kbSection}, ${kb.scope}, ${kb.recordType}) is ACTIVE in the Destination Knowledge Base but has no corresponding row in the operational workbook's Destination Intelligence sheet.`,
      });
    }
    return present;
  };

  for (const kb of KB_APPROVED_PORTFOLIO) {
    const destinationPresent = checkDestination(kb);

    if (!kb.members) continue;

    const regions = destinationPresent
      ? (operationalRegionsByDestination.get(normalise(kb.name)) ?? new Set<string>())
      : new Set<string>();

    for (const member of kb.members) {
      memberRegionsChecked += 1;
      const memberKey = normalise(member);
      const hasMatchingRegion = Array.from(regions).some(
        (region) => region === memberKey || region.includes(memberKey),
      );
      if (!hasMatchingRegion) {
        findings.push({
          code: "KB_MEMBER_REGION_ABSENT",
          kbSection: kb.kbSection,
          destination: kb.name,
          member,
          message: `${kb.name} — ${member} (KB §${kb.kbSection}) is a named member region of the "${kb.name}" Collection in the Destination Knowledge Base but has no corresponding row in the operational workbook under the "${kb.name}" destination.`,
        });
      }
    }
  }

  return {
    mode: "WARN",
    destinationsChecked: KB_APPROVED_PORTFOLIO.length,
    memberRegionsChecked,
    findings,
  };
}
