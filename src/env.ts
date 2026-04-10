import { z } from "zod";

const nonProductionDefaults = {
  DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:5432/aiexportweb",
  SESSION_SECRET: "dev-session-secret-please-change-me-1234567890",
  R2_ACCOUNT_ID: "local-account",
  R2_ACCESS_KEY_ID: "local-access-key",
  R2_SECRET_ACCESS_KEY: "local-secret-key",
  R2_BUCKET_NAME: "aiexportweb-dev",
  R2_PUBLIC_URL: "https://assets.example.com",
  BREVO_API_KEY: "dev-brevo-key",
  BREVO_TO_EMAIL: "sales@example.com",
  TURNSTILE_SECRET_KEY: "dev-turnstile-secret",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
  ADMIN_USERNAME: "admin",
  ADMIN_PASSWORD: "changeme",
  NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
  SITE_PLAN: "ai_sales",
  ENABLE_PRICING_PAGE: "true",
  SALES_CONTACT_URL: "/contact",
} as const;

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(32),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  R2_PUBLIC_URL: z.string().url(),
  BREVO_API_KEY: z.string().min(1),
  BREVO_TO_EMAIL: z.string().email(),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(6),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  SITE_PLAN: z.enum(["basic", "growth", "ai_sales"]).default("ai_sales"),
  ENABLE_PRICING_PAGE: z.enum(["true", "false", "1", "0"]).default("true"),
  SALES_CONTACT_URL: z.string().min(1).default("/contact"),
});

function buildRuntimeEnv() {
  const shouldRequireExplicitEnv =
    process.env.CI === "true" || process.env.VERCEL === "1";

  if (shouldRequireExplicitEnv) {
    return process.env;
  }

  return {
    ...nonProductionDefaults,
    ...process.env,
  };
}

const parsedEnv = envSchema.safeParse(buildRuntimeEnv());

if (!parsedEnv.success) {
  throw new Error(
    `Invalid environment variables: ${parsedEnv.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ")}`,
  );
}

export const env = parsedEnv.data;
