/**
 * GOVERNANCE BOUNDARY — Business Layer reference data (read-only).
 *
 * A mechanical transcription of the Destination Knowledge Base's approved
 * portfolio (`docs/02-Product/DESTINATION-KNOWLEDGE-BASE.md`, Sections 10–11,
 * "all destinations in this section are `ACTIVE` for Release 1"), used only
 * as the comparison target for the KB → Operational Reconciliation Check
 * (WP-4, `docs/09-Development/EBC-R1.2-03.05-RAD-Destination-Intelligence-Implementation-Planning.md`).
 *
 * This module does not decide business scope — it restates a decision the
 * Knowledge Base has already made. Any change to which destinations are
 * `ACTIVE`, or to a Collection's named member regions, must happen in the
 * Knowledge Base first (KB §12.2 Activation Checklist; ADR-R1.2-WS3-001 §9
 * Change Authority Matrix — "Destination/region status change" requires
 * Product & Experience, with Operations approval). This file is then updated
 * to match, as a documentation-alignment change, not a business decision.
 *
 * `members` is populated only for the two record types the KB itself calls
 * a "Collection" (KB §7.3) with an explicit "Member region" table (Northeast,
 * §10.11; Wildlife, §10.18) — the member names are the leading place-name
 * token of each KB member-region row (e.g. "Meghalaya — Shillong / Sohra"
 * and "Meghalaya — Dawki / Mawlynnong belt" both group under "Meghalaya"),
 * since the operational layer does not currently sub-divide within a member
 * place. Plain `Destination`-type KB entries are reconciled at destination
 * level only, even where a KB section additionally lists named areas (e.g.
 * Assam §10.13 "Region or area", Pondicherry §10.12) — extending
 * member-level reconciliation to those is a documented follow-up (see the
 * WP-4 implementation report), not silently assumed complete here.
 *
 * Governance boundary added under `R1.2-WS3-IMP-01A-EBC-RAD` (WP-4).
 */

export type KbRecordType = "Destination" | "Collection";
export type KbScope = "Domestic" | "International";

export interface KbApprovedDestination {
  /** Exact destination/collection name as it appears in KB §10.1 / §11.1. */
  readonly name: string;
  readonly recordType: KbRecordType;
  readonly scope: KbScope;
  readonly kbSection: string;
  /**
   * Named member regions for the two KB-documented Collections only.
   * `null` means this entry is reconciled at destination level only.
   */
  readonly members: readonly string[] | null;
}

/**
 * KB §10 — Domestic Destination Portfolio (17 entries, KB §10.1 table).
 * KB §11 — International Destination Portfolio (7 entries, KB §11.1 table).
 * 24 entries total — matches the count both Rad audits (`R1.2-03.02`,
 * `R1.2-03.03`) and the ADR (Appendix A) independently converged on.
 */
export const KB_APPROVED_PORTFOLIO: readonly KbApprovedDestination[] = [
  { name: "Agra", recordType: "Destination", scope: "Domestic", kbSection: "10.2", members: null },
  { name: "Amritsar", recordType: "Destination", scope: "Domestic", kbSection: "10.3", members: null },
  { name: "Andaman", recordType: "Destination", scope: "Domestic", kbSection: "10.4", members: null },
  { name: "Goa", recordType: "Destination", scope: "Domestic", kbSection: "10.5", members: null },
  { name: "Gujarat", recordType: "Destination", scope: "Domestic", kbSection: "10.6", members: null },
  { name: "Himachal Pradesh", recordType: "Destination", scope: "Domestic", kbSection: "10.7", members: null },
  { name: "Karnataka", recordType: "Destination", scope: "Domestic", kbSection: "10.8", members: null },
  { name: "Kashmir", recordType: "Destination", scope: "Domestic", kbSection: "10.9", members: null },
  { name: "Kerala", recordType: "Destination", scope: "Domestic", kbSection: "10.10", members: null },
  {
    name: "Northeast",
    recordType: "Collection",
    scope: "Domestic",
    kbSection: "10.11",
    members: ["Meghalaya", "Sikkim", "Darjeeling"],
  },
  { name: "Pondicherry", recordType: "Destination", scope: "Domestic", kbSection: "10.12", members: null },
  { name: "Assam", recordType: "Destination", scope: "Domestic", kbSection: "10.13", members: null },
  { name: "Rajasthan", recordType: "Destination", scope: "Domestic", kbSection: "10.14", members: null },
  { name: "Tamil Nadu", recordType: "Destination", scope: "Domestic", kbSection: "10.15", members: null },
  { name: "Hyderabad", recordType: "Destination", scope: "Domestic", kbSection: "10.16", members: null },
  { name: "Vizag", recordType: "Destination", scope: "Domestic", kbSection: "10.17", members: null },
  {
    name: "Wildlife",
    recordType: "Collection",
    scope: "Domestic",
    kbSection: "10.18",
    members: ["Kabini", "Corbett", "Bandipur", "Masinagudi"],
  },
  { name: "Dubai", recordType: "Destination", scope: "International", kbSection: "11.2", members: null },
  { name: "Bali", recordType: "Destination", scope: "International", kbSection: "11.3", members: null },
  { name: "Malaysia", recordType: "Destination", scope: "International", kbSection: "11.4", members: null },
  { name: "Singapore", recordType: "Destination", scope: "International", kbSection: "11.5", members: null },
  { name: "Sri Lanka", recordType: "Destination", scope: "International", kbSection: "11.6", members: null },
  { name: "Thailand", recordType: "Destination", scope: "International", kbSection: "11.7", members: null },
  { name: "Vietnam", recordType: "Destination", scope: "International", kbSection: "11.8", members: null },
];
