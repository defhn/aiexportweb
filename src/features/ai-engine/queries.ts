/**
 * ai_engine_config 相关操作
 */
import { eq, and } from "drizzle-orm";
import { getDb } from "@/db/client";
import { aiEngineConfig } from "@/db/schema";

export async function getAiEngineConfig(siteId: number | null, configKey: string): Promise<string | null> {
  const db = getDb();
  
  // 优先取站点具体配置，否则取 null (global 暂退化为 siteId 关联)
  const condition = siteId
    ? and(eq(aiEngineConfig.configKey, configKey), eq(aiEngineConfig.siteId, siteId))
    : eq(aiEngineConfig.configKey, configKey);

  const [row] = await db.select().from(aiEngineConfig).where(condition).limit(1);
  return row?.configValue ?? null;
}

export async function setAiEngineConfig(
  siteId: number | null,
  configKey: string,
  configValue: string,
  description?: string
): Promise<void> {
  const db = getDb();

  // Upsert (冲突时更新)
  await db
    .insert(aiEngineConfig)
    .values({
      siteId,
      configKey,
      configValue,
      description,
      isGlobal: siteId === null,
    })
    .onConflictDoUpdate({
      target: [aiEngineConfig.siteId, aiEngineConfig.configKey],
      set: {
        configValue,
        description,
        updatedAt: new Date(),
      },
    });
}

export async function getAllConfigsForSite(siteId: number | null) {
  const db = getDb();
  const query = db.select().from(aiEngineConfig);
  if (siteId) {
    query.where(eq(aiEngineConfig.siteId, siteId));
  }
  return query;
}
