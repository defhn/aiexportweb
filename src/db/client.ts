import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/env";
import * as schema from "./schema";

export function getDb(databaseUrl = env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }

  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof getDb>;

export { schema };
