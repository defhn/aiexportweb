import { afterEach, describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";

import { downloadFiles, inquiries } from "@/db/schema";

const redirectMock = vi.fn((url: string) => {
  throw new Error(`REDIRECT:${url}`);
});

const getCurrentSiteFromRequestMock = vi.fn();
const revalidatePathMock = vi.fn();
const getDbMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("@/features/sites/queries", () => ({
  getCurrentSiteFromRequest: getCurrentSiteFromRequestMock,
}));

vi.mock("@/db/client", () => ({
  getDb: getDbMock,
}));

function toSql(condition: unknown) {
  return new PgDialect().sqlToQuery(condition as Parameters<PgDialect["sqlToQuery"]>[0]);
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("site isolation", () => {
  it("scopes pipeline list queries to the current site", async () => {
    const whereConditions: unknown[] = [];
    getCurrentSiteFromRequestMock.mockResolvedValue({ id: 42 });

    getDbMock.mockReturnValue({
      select() {
        return {
          from() {
            const chain = {
              where(condition: unknown) {
                whereConditions.push(condition);
                return chain;
              },
              orderBy() {
                return chain;
              },
              limit: vi.fn(async () => []),
            };

            return chain;
          },
        };
      },
    });

    const { getPipelineData } = await import("@/features/pipeline/queries");
    await getPipelineData();

    expect(whereConditions).toHaveLength(1);
    const query = toSql(whereConditions[0]);
    expect(query.sql).toContain("\"inquiries\".\"site_id\"");
    expect(query.params).toContain(42);
  });

  it("scopes pipeline stage updates to the current site", async () => {
    let capturedWhere: unknown;
    getCurrentSiteFromRequestMock.mockResolvedValue({ id: 42 });

    getDbMock.mockReturnValue({
      update() {
        return {
          set() {
            return {
              where(condition: unknown) {
                capturedWhere = condition;
                return Promise.resolve();
              },
            };
          },
        };
      },
    });

    const { updatePipelineStage } = await import("@/features/pipeline/queries");
    await updatePipelineStage(9, "won");

    const query = toSql(capturedWhere);
    expect(query.sql).toContain("\"inquiries\".\"id\"");
    expect(query.sql).toContain("\"inquiries\".\"site_id\"");
    expect(query.params).toContain(9);
    expect(query.params).toContain(42);
  });

  it("scopes attribution summary queries to the current site", async () => {
    const queryLogs: Array<{ whereCondition?: unknown }> = [];
    getCurrentSiteFromRequestMock.mockResolvedValue({ id: 42 });

    getDbMock.mockReturnValue({
      select() {
        return {
          from() {
            const log: { whereCondition?: unknown } = {};
            queryLogs.push(log);

            const chain = {
              where(condition: unknown) {
                log.whereCondition = condition;
                return chain;
              },
              groupBy() {
                return chain;
              },
              orderBy() {
                return chain;
              },
              limit: vi.fn(async () => []),
              then(resolve: (value: Array<{ count: number }>) => void) {
                resolve([{ count: 0 }]);
              },
            };

            return chain;
          },
        };
      },
    });

    const { getUtmAttributionSummary } = await import("@/features/tracking/queries");
    await getUtmAttributionSummary();

    expect(queryLogs.length).toBeGreaterThanOrEqual(6);
    for (const log of queryLogs) {
      expect(log.whereCondition).toBeDefined();
      const query = toSql(log.whereCondition);
      expect(query.sql).toContain("\"inquiries\".\"site_id\"");
      expect(query.params).toContain(42);
    }
  });

  it("deletes download files through a site-scoped SQL guard", async () => {
    const executedQueries: Array<{ sql: string; params: unknown[] }> = [];
    getCurrentSiteFromRequestMock.mockResolvedValue({ id: 42 });

    getDbMock.mockReturnValue({
      select() {
        return {
          from() {
            return {
              innerJoin() {
                return {
                  where() {
                    return {
                      limit: vi.fn(async () => [{ id: 7 }]),
                    };
                  },
                };
              },
            };
          },
        };
      },
      execute(statement: unknown) {
        executedQueries.push(toSql(statement));
        return Promise.resolve();
      },
      delete() {
        return {
          where() {
            throw new Error("delete() should not be used for scoped download deletion");
          },
        };
      },
    });

    const { deleteDownloadFile } = await import("@/features/media/actions");

    const formData = new FormData();
    formData.set("id", "7");

    await expect(deleteDownloadFile(formData)).rejects.toThrow("REDIRECT:/admin/files?deleted=1");

    expect(executedQueries).toHaveLength(1);
    expect(executedQueries[0]?.sql).toContain("delete from");
    expect(executedQueries[0]?.sql).toContain("\"download_files\"");
    expect(executedQueries[0]?.sql).toContain("\"media_assets\"");
    expect(executedQueries[0]?.sql).toContain("\"site_id\"");
    expect(executedQueries[0]?.params).toContain(42);
    expect(executedQueries[0]?.params).toContain(7);
  });
});
