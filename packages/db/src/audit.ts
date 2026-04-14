import { db } from "./index";
import { auditLog } from "./schema/app";
import { isNull, eq } from "drizzle-orm";

export type AuditAction = "create" | "update" | "delete";

interface AuditContext {
  userId: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  diff?: any;
}

/**
 * Records an entry in the audit_log table.
 */
export async function recordAuditLog(ctx: AuditContext) {
  const database = db ?? (await import("./index")).createDb();

  await database.insert(auditLog).values({
    id: crypto.randomUUID(),
    actorId: ctx.userId,
    entityType: ctx.entityType,
    entityId: ctx.entityId,
    action: ctx.action,
    diff: ctx.diff ? JSON.stringify(ctx.diff) : null,
  });
}

/**
 * Helper to build a "not deleted" filter.
 */
export function notDeleted(table: { deletedAt: any }) {
  return isNull(table.deletedAt);
}

/**
 * Standardized soft-delete operation with auditing.
 */
export async function performSoftDelete(params: {
  userId: string;
  table: any;
  entityId: string;
  entityType: string;
}) {
  const database = db ?? (await import("./index")).createDb();

  // Perform soft-delete
  await database
    .update(params.table)
    .set({ deletedAt: new Date() })
    .where(eq(params.table.id, params.entityId));

  // Log the action
  await recordAuditLog({
    userId: params.userId,
    entityType: params.entityType,
    entityId: params.entityId,
    action: "delete",
  });
}
