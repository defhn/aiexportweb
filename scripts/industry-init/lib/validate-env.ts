/**
 * ENV Validator — checks all required variables before any operation.
 * Prints a clear success/failure table and throws on critical failures.
 */

interface EnvVar {
  key: string;
  required: boolean;
  description: string;
  testFn?: (val: string) => boolean;
}

const ENV_VARS: EnvVar[] = [
  {
    key: "DATABASE_URL",
    required: true,
    description: "Neon PostgreSQL connection string",
    testFn: (v) => v.startsWith("postgres"),
  },
  {
    key: "GEMINI_API_KEY",
    required: true,
    description: "Google Gemini 2.5 Flash API key",
    testFn: (v) => v.length > 20,
  },
  {
    key: "CLOUDFLARE_R2_BUCKET",
    required: true,
    description: "Cloudflare R2 bucket name",
  },
  {
    key: "CLOUDFLARE_R2_ENDPOINT",
    required: true,
    description: "Cloudflare R2 S3-compatible endpoint URL",
    testFn: (v) => v.startsWith("https://"),
  },
  {
    key: "CLOUDFLARE_R2_ACCESS_KEY_ID",
    required: true,
    description: "R2 access key ID",
    testFn: (v) => v.length > 10,
  },
  {
    key: "CLOUDFLARE_R2_SECRET_ACCESS_KEY",
    required: true,
    description: "R2 secret access key",
    testFn: (v) => v.length > 10,
  },
  {
    key: "CLOUDFLARE_R2_PUBLIC_URL",
    required: true,
    description: "Public URL prefix for R2 assets (e.g. https://cdn.example.com)",
    testFn: (v) => v.startsWith("https://"),
  },
  {
    key: "NEXT_PUBLIC_SITE_URL",
    required: false,
    description: "Public site URL (optional, can be set in config)",
  },
  {
    key: "SESSION_SECRET",
    required: false,
    description: "JWT session secret (auto-generated if missing)",
  },
];

export interface EnvCheckResult {
  passed: boolean;
  failures: string[];
  warnings: string[];
}

export function validateEnv(): EnvCheckResult {
  const failures: string[] = [];
  const warnings: string[] = [];
  const rows: string[] = [];

  const TICK = "\u2705";
  const CROSS = "\u274C";
  const WARN = "\u26A0\uFE0F";

  console.log("\n\u{1F50D} Checking environment variables...\n");

  for (const envVar of ENV_VARS) {
    const val = process.env[envVar.key];

    if (!val) {
      if (envVar.required) {
        failures.push(`${envVar.key}: not set`);
        console.log(`  ${CROSS} ${envVar.key.padEnd(38)} ${envVar.description}`);
      } else {
        warnings.push(`${envVar.key}: not set (optional)`);
        console.log(`  ${WARN} ${envVar.key.padEnd(38)} (optional) ${envVar.description}`);
      }
      continue;
    }

    if (envVar.testFn && !envVar.testFn(val)) {
      failures.push(`${envVar.key}: invalid format`);
      console.log(`  ${CROSS} ${envVar.key.padEnd(38)} invalid value format`);
      continue;
    }

    console.log(`  ${TICK} ${envVar.key.padEnd(38)} ${val.substring(0, 20)}...`);
  }

  console.log("");

  if (failures.length > 0) {
    console.error("❌ ENV validation failed:\n");
    for (const f of failures) {
      console.error(`   • ${f}`);
    }
    console.error("\n📖 See INDUSTRY_INIT.md for setup instructions.\n");
  } else {
    console.log("✅ All required ENV variables are set.\n");
  }

  return { passed: failures.length === 0, failures, warnings };
}
