import "../env";
import { migrate } from "drizzle-orm/neon-http/migrator";

import { getDb } from "./client";

async function main() {
  const db = getDb();
  await migrate(db, { migrationsFolder: "drizzle" });
}

main().catch((error) => {
  console.error("Database migration failed.", error);
  process.exitCode = 1;
});
