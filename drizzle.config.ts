import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  strict: true,
  verbose: true,
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/aiexportweb",
  },
});
