import { NextResponse } from "next/server";

import { withAdminAuth } from "@/lib/admin-auth";
import {
  batchComputeMissingEmbeddings,
  computeAndStoreProductEmbedding,
} from "@/lib/rag-utils";

export const runtime = "nodejs";

/**
 * POST /api/ai/reindex-embeddings
 * 管理员触发：为产品批量计算并存储 embedding 向量
 *
 * body:
 *   { mode: "all" }              → 批量重算所有缺失/过期的产品（最多20个/次）
 *   { mode: "single", id: 123 } → 重算指定产品
 */
export const POST = withAdminAuth(async (request) => {
  const body = (await request.json()) as {
    mode?: "all" | "single";
    id?: number;
  };

  try {
    if (body.mode === "single" && body.id) {
      await computeAndStoreProductEmbedding(body.id);
      return NextResponse.json({
        ok: true,
        message: `产品 ${body.id} embedding 已更新`,
      });
    }

    // 默认：批量处理缺失/过期的产品
    const { computed, skipped } = await batchComputeMissingEmbeddings(20);

    return NextResponse.json({
      ok: true,
      computed,
      skipped,
      message: `完成！已计算 ${computed} 个产品的 embedding，${skipped} 个失败跳过`,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 },
    );
  }
});

/**
 * GET /api/ai/reindex-embeddings
 * 查询当前 embedding 覆盖情况
 */
export const GET = withAdminAuth(async () => {
  try {
    const { getDb } = await import("@/db/client");
    const { products } = await import("@/db/schema");
    const { sql } = await import("drizzle-orm");

    const db = getDb();
    const stats = await db
      .select({
        total: sql<number>`count(*)`,
        withEmbedding: sql<number>`count(case when embedding_json is not null then 1 end)`,
        outdated: sql<number>`count(case when embedding_updated_at < now() - interval '30 days' then 1 end)`,
      })
      .from(products);

    const { total, withEmbedding, outdated } = stats[0] ?? {
      total: 0,
      withEmbedding: 0,
      outdated: 0,
    };

    return NextResponse.json({
      total: Number(total),
      withEmbedding: Number(withEmbedding),
      withoutEmbedding: Number(total) - Number(withEmbedding),
      outdated: Number(outdated),
      coveragePercent:
        total > 0
          ? Math.round((Number(withEmbedding) / Number(total)) * 100)
          : 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 },
    );
  }
});
