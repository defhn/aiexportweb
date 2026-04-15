import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { adminUsers, siteChangeLogs } from "@/db/schema";

export type SiteChangeLogItem = {
  id: number;
  siteId: number;
  actionType: string;
  summary: string;
  actorRole: string;
  actorLabel: string;
  createdAt: Date;
  previousValueJson: Record<string, unknown>;
  nextValueJson: Record<string, unknown>;
};

export async function listRecentSiteChangeLogs(limit = 8, siteId?: number | null) {
  if (!process.env.DATABASE_URL) {
    return [] as SiteChangeLogItem[];
  }

  const db = getDb();
  const baseQuery = db
    .select({
      id: siteChangeLogs.id,
      siteId: siteChangeLogs.siteId,
      actionType: siteChangeLogs.actionType,
      summary: siteChangeLogs.summary,
      actorRole: siteChangeLogs.actorRole,
      actorAdminUserId: siteChangeLogs.actorAdminUserId,
      actorUsername: adminUsers.username,
      createdAt: siteChangeLogs.createdAt,
      previousValueJson: siteChangeLogs.previousValueJson,
      nextValueJson: siteChangeLogs.nextValueJson,
    })
    .from(siteChangeLogs)
    .leftJoin(adminUsers, eq(siteChangeLogs.actorAdminUserId, adminUsers.id))
    .orderBy(desc(siteChangeLogs.createdAt))
    .limit(limit);

  const rows = siteId ? await baseQuery.where(eq(siteChangeLogs.siteId, siteId)) : await baseQuery;

  return rows.map((row) => ({
    id: row.id,
    siteId: row.siteId,
    actionType: row.actionType,
    summary: row.summary,
    actorRole: row.actorRole,
    actorLabel:
      row.actorRole === "super_admin"
        ? "Super admin"
        : row.actorUsername ?? `Admin #${row.actorAdminUserId ?? "unknown"}`,
    createdAt: row.createdAt,
    previousValueJson: (row.previousValueJson ?? {}) as Record<string, unknown>,
    nextValueJson: (row.nextValueJson ?? {}) as Record<string, unknown>,
  }));
}
