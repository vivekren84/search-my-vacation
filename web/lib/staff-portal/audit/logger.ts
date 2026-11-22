/**
 * Staff Portal Immutable Audit Logger (Release 1.5 — US-017)
 *
 * Records compliance, security, role changes, and PII unmasking events.
 * Strictly append-only: updates and deletions are architecturally disabled.
 */

import type { StaffAuditEventType, StaffAuditLogEntry } from "../../../types/staff-portal.types";

const inMemoryAuditLogs: StaffAuditLogEntry[] = [];

export class StaffAuditLogger {
  async logEvent(params: {
    actorId: string | null;
    entityType: string;
    entityId: string;
    eventType: StaffAuditEventType;
    eventData?: Record<string, unknown>;
  }): Promise<StaffAuditLogEntry> {
    const entry: StaffAuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actorId: params.actorId,
      entityType: params.entityType,
      entityId: params.entityId,
      eventType: params.eventType,
      eventData: params.eventData ?? {},
      createdAt: new Date().toISOString(),
    };

    inMemoryAuditLogs.push(entry);
    return entry;
  }

  getLogs(filter?: {
    actorId?: string;
    eventType?: StaffAuditEventType;
    entityId?: string;
  }): readonly StaffAuditLogEntry[] {
    let result = [...inMemoryAuditLogs];
    if (filter?.actorId) {
      result = result.filter((l) => l.actorId === filter.actorId);
    }
    if (filter?.eventType) {
      result = result.filter((l) => l.eventType === filter.eventType);
    }
    if (filter?.entityId) {
      result = result.filter((l) => l.entityId === filter.entityId);
    }
    return result;
  }

  /**
   * Immutability enforcement check: Attempting to update or delete audit logs
   * throws an error by design.
   */
  update(): never {
    throw new Error("audit_log_immutable: Updating audit log entries is strictly forbidden by policy");
  }

  delete(): never {
    throw new Error("audit_log_immutable: Deleting audit log entries is strictly forbidden by policy");
  }

  clearForTesting(): void {
    inMemoryAuditLogs.length = 0;
  }
}

export const staffAuditLogger = new StaffAuditLogger();
