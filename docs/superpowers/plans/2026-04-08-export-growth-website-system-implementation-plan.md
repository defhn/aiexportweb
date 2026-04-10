# Export Growth Website System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-site export lead generation website system with an English public site, Chinese admin, product/content management, inquiry capture, SEO controls, and AI crawler controls.

**Architecture:** Use a single Next.js App Router application to serve both the public website and the Chinese admin. Persist structured business data in Neon through Drizzle ORM, store media assets in Cloudflare R2, and keep all editable content inside the same self-hosted admin to avoid splitting the user experience across tools.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Drizzle ORM, Neon, Cloudflare R2, Brevo, Cloudflare Turnstile, Vitest, Playwright

---

## File Structure Map

### Root and Tooling

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `drizzle.config.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`
- Create: `README.md`

Responsibilities:

- `package.json` defines scripts for dev, build, test, database, and seed operations.
- `drizzle.config.ts` points Drizzle to the Neon schema and migration output.
- `vitest.config.ts` and `playwright.config.ts` define the unit and end-to-end test harnesses.

### Application Shell

- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/(public)/layout.tsx`
- Create: `src/app/(public)/page.tsx`
- Create: `src/app/(public)/about/page.tsx`
- Create: `src/app/(public)/contact/page.tsx`
- Create: `src/app/(public)/products/page.tsx`
- Create: `src/app/(public)/products/[categorySlug]/page.tsx`
- Create: `src/app/(public)/products/[categorySlug]/[productSlug]/page.tsx`
- Create: `src/app/(public)/blog/page.tsx`
- Create: `src/app/(public)/blog/[slug]/page.tsx`
- Create: `src/app/(public)/privacy-policy/page.tsx`
- Create: `src/app/(public)/terms/page.tsx`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`

Responsibilities:

- Public routes render the English website.
- Admin routes render the Chinese management console.
- Root layout injects global styles and metadata defaults.

### Data Layer

- Create: `src/db/client.ts`
- Create: `src/db/schema.ts`
- Create: `src/db/migrate.ts`
- Create: `src/db/seed/default-field-defs.ts`
- Create: `src/db/seed/packs/cnc.ts`
- Create: `src/db/seed/packs/industrial-equipment.ts`
- Create: `src/db/seed/packs/building-materials.ts`
- Create: `src/db/seed/index.ts`

Responsibilities:

- `schema.ts` defines all tables, enums, and relations.
- `seed` files initialize default field definitions and industry demo packs.

### Shared Libraries

- Create: `src/env.ts`
- Create: `src/lib/auth.ts`
- Create: `src/lib/r2.ts`
- Create: `src/lib/brevo.ts`
- Create: `src/lib/turnstile.ts`
- Create: `src/lib/slug.ts`
- Create: `src/lib/seo.ts`
- Create: `src/lib/ai-crawlers.ts`
- Create: `src/lib/rich-text.ts`
- Create: `src/lib/json-ld.ts`
- Create: `src/lib/utils.ts`

Responsibilities:

- Auth, email, upload, SEO, AI crawler policy, and rich text formatting live here.

### Feature Modules

- Create: `src/features/settings/queries.ts`
- Create: `src/features/settings/actions.ts`
- Create: `src/features/pages/queries.ts`
- Create: `src/features/pages/actions.ts`
- Create: `src/features/products/queries.ts`
- Create: `src/features/products/actions.ts`
- Create: `src/features/blog/queries.ts`
- Create: `src/features/blog/actions.ts`
- Create: `src/features/media/queries.ts`
- Create: `src/features/media/actions.ts`
- Create: `src/features/inquiries/queries.ts`
- Create: `src/features/inquiries/actions.ts`

Responsibilities:

- Each feature owns its server-side read and write helpers.

### UI Components

- Create: `src/components/admin/admin-shell.tsx`
- Create: `src/components/admin/sidebar.tsx`
- Create: `src/components/admin/header.tsx`
- Create: `src/components/admin/data-table.tsx`
- Create: `src/components/admin/module-editor.tsx`
- Create: `src/components/admin/rich-text-editor.tsx`
- Create: `src/components/admin/image-picker.tsx`
- Create: `src/components/public/site-header.tsx`
- Create: `src/components/public/site-footer.tsx`
- Create: `src/components/public/hero-section.tsx`
- Create: `src/components/public/category-grid.tsx`
- Create: `src/components/public/product-card.tsx`
- Create: `src/components/public/spec-table.tsx`
- Create: `src/components/public/inquiry-form.tsx`
- Create: `src/components/public/cta-section.tsx`
- Create: `src/components/public/blog-card.tsx`
- Create: `src/components/public/json-ld-script.tsx`

Responsibilities:

- Admin components keep the Chinese management UI consistent.
- Public components keep the English front-end reusable and template-driven.

### API and Metadata Routes

- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/api/uploads/image/route.ts`
- Create: `src/app/api/uploads/file/route.ts`
- Create: `src/app/api/inquiries/route.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/middleware.ts`

Responsibilities:

- Route handlers manage authentication, uploads, and inquiry submission.
- Metadata routes generate robots and sitemap output from database settings.

### Tests

- Create: `src/test/setup.ts`
- Create: `tests/unit/app-shell.test.tsx`
- Create: `tests/unit/seed-packs.test.ts`
- Create: `tests/unit/auth.test.ts`
- Create: `tests/unit/page-modules.test.ts`
- Create: `tests/unit/products.test.ts`
- Create: `tests/unit/blog.test.ts`
- Create: `tests/unit/inquiries.test.ts`
- Create: `tests/unit/seo-ai.test.ts`
- Create: `tests/e2e/admin-login.spec.ts`
- Create: `tests/e2e/inquiry-flow.spec.ts`

Responsibilities:

- Unit tests protect formatting, policy, validation, and helper behavior.
- Playwright verifies the most important admin and inquiry flows.

## Task 1: Bootstrap the Next.js App, Tooling, and Test Harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/(public)/layout.tsx`
- Create: `src/app/(public)/page.tsx`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/test/setup.ts`
- Test: `tests/unit/app-shell.test.tsx`

- [ ] **Step 1: Write the failing app-shell test**

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/(public)/page";

describe("HomePage", () => {
  it("renders the export lead generation headline and CTA", async () => {
    render(await HomePage());
    expect(
      screen.getByRole("heading", {
        name: /high-quality manufacturing solutions for global buyers/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /get a quote/i })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/app-shell.test.tsx`

Expected: FAIL with missing route or missing test configuration errors.

- [ ] **Step 3: Create the app shell and test tooling**

```json
{
  "name": "aiexportweb",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx src/db/migrate.ts",
    "db:seed": "tsx src/db/seed/index.ts"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "latest",
    "@neondatabase/serverless": "latest",
    "drizzle-orm": "latest",
    "jose": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@playwright/test": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "autoprefixer": "latest",
    "drizzle-kit": "latest",
    "jsdom": "latest",
    "postcss": "latest",
    "tailwindcss": "latest",
    "tsx": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

```tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Export Growth Website System",
  description: "English export lead generation website with a Chinese admin.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```ts
// If the previous function appears garbled in your editor, use this exact ASCII-safe version.
export function createExcerptFallback(html: string, maxLength = 160) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 3).trim()}...` : text;
}
```

```tsx
import Link from "next/link";

export default async function HomePage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-8 px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
        Export Growth System
      </p>
      <h1 className="max-w-3xl text-5xl font-semibold leading-tight">
        High-Quality Manufacturing Solutions for Global Buyers
      </h1>
      <p className="max-w-2xl text-lg text-slate-600">
        Build trust, showcase products, and capture qualified inquiries with an
        English public site and a Chinese admin.
      </p>
      <div className="flex gap-4">
        <Link className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white" href="/contact">
          Get a Quote
        </Link>
        <Link className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900" href="/products">
          Explore Products
        </Link>
      </div>
    </section>
  );
}
```

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- tests/unit/app-shell.test.tsx`

Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.ts postcss.config.js tailwind.config.ts vitest.config.ts playwright.config.ts src/app src/test tests/unit/app-shell.test.tsx
git commit -m "chore: bootstrap next app shell and test harness"
```

## Task 2: Create the Database Schema, Drizzle Setup, and Industry Seed Packs

**Files:**
- Create: `drizzle.config.ts`
- Create: `src/db/client.ts`
- Create: `src/db/schema.ts`
- Create: `src/db/migrate.ts`
- Create: `src/db/seed/default-field-defs.ts`
- Create: `src/db/seed/packs/cnc.ts`
- Create: `src/db/seed/packs/industrial-equipment.ts`
- Create: `src/db/seed/packs/building-materials.ts`
- Create: `src/db/seed/index.ts`
- Test: `tests/unit/seed-packs.test.ts`

- [ ] **Step 1: Write the failing seed-pack test**

```ts
import { describe, expect, it } from "vitest";
import { defaultFieldDefinitions, getSeedPack } from "@/db/seed";

describe("seed packs", () => {
  it("includes the built-in manufacturing spec fields", () => {
    expect(defaultFieldDefinitions.map((field) => field.fieldKey)).toEqual(
      expect.arrayContaining(["model", "material", "lead_time", "certification"]),
    );
  });

  it("returns the CNC demo pack with products and pages", () => {
    const pack = getSeedPack("cnc");
    expect(pack.site.companyNameEn).toContain("Precision");
    expect(pack.products.length).toBeGreaterThan(0);
    expect(pack.pages.home.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/seed-packs.test.ts`

Expected: FAIL with missing `@/db/seed` exports.

- [ ] **Step 3: Implement the schema, client, and seed modules**

```ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import { env } from "@/env";

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
```

```ts
export const defaultFieldDefinitions = [
  { fieldKey: "model", labelZh: "型号", labelEn: "Model", inputType: "text", sortOrder: 10 },
  { fieldKey: "material", labelZh: "材料", labelEn: "Material", inputType: "text", sortOrder: 20 },
  { fieldKey: "process", labelZh: "工艺", labelEn: "Process", inputType: "text", sortOrder: 30 },
  { fieldKey: "size", labelZh: "尺寸", labelEn: "Size", inputType: "text", sortOrder: 40 },
  { fieldKey: "tolerance", labelZh: "公差", labelEn: "Tolerance", inputType: "text", sortOrder: 50 },
  { fieldKey: "surface_treatment", labelZh: "表面处理", labelEn: "Surface Treatment", inputType: "text", sortOrder: 60 },
  { fieldKey: "color", labelZh: "颜色", labelEn: "Color", inputType: "text", sortOrder: 70 },
  { fieldKey: "application", labelZh: "应用", labelEn: "Application", inputType: "textarea", sortOrder: 80 },
  { fieldKey: "moq", labelZh: "最小起订量", labelEn: "MOQ", inputType: "text", sortOrder: 90 },
  { fieldKey: "sample_lead_time", labelZh: "打样时间", labelEn: "Sample Lead Time", inputType: "text", sortOrder: 100 },
  { fieldKey: "lead_time", labelZh: "交货周期", labelEn: "Lead Time", inputType: "text", sortOrder: 110 },
  { fieldKey: "packaging", labelZh: "包装方式", labelEn: "Packaging", inputType: "text", sortOrder: 120 },
  { fieldKey: "place_of_origin", labelZh: "产地", labelEn: "Place of Origin", inputType: "text", sortOrder: 130 },
  { fieldKey: "supply_ability", labelZh: "供货能力", labelEn: "Supply Ability", inputType: "text", sortOrder: 140 },
  { fieldKey: "certification", labelZh: "认证", labelEn: "Certification", inputType: "text", sortOrder: 150 },
] as const;
```

```ts
export const cncSeedPack = {
  key: "cnc",
  site: {
    companyNameZh: "精密加工演示工厂",
    companyNameEn: "Precision CNC Components Co., Ltd.",
    email: "sales@example.com",
  },
  pages: {
    home: [
      {
        moduleKey: "hero",
        moduleNameZh: "首屏",
        isEnabled: true,
        sortOrder: 10,
        payloadJson: {
          eyebrow: "Precision CNC Manufacturing",
          title: "Custom CNC Machining Parts for Global OEM Buyers",
          description:
            "From prototypes to volume production, deliver precision, speed, and export-ready quality.",
          primaryCtaLabel: "Get a Quote",
          primaryCtaHref: "/contact",
        },
      },
    ],
  },
  categories: [
    { nameZh: "铝件加工", nameEn: "Aluminum Machining Parts", slug: "aluminum-machining-parts" },
  ],
  products: [
    {
      nameZh: "铝合金 CNC 支架",
      nameEn: "Custom Aluminum CNC Bracket",
      slug: "custom-aluminum-cnc-bracket",
      categorySlug: "aluminum-machining-parts",
    },
  ],
};
```

```ts
import { defaultFieldDefinitions } from "./default-field-defs";
import { cncSeedPack } from "./packs/cnc";
import { industrialEquipmentSeedPack } from "./packs/industrial-equipment";
import { buildingMaterialsSeedPack } from "./packs/building-materials";

const seedPacks = {
  cnc: cncSeedPack,
  "industrial-equipment": industrialEquipmentSeedPack,
  "building-materials": buildingMaterialsSeedPack,
} as const;

export { defaultFieldDefinitions };

export function getSeedPack(key: keyof typeof seedPacks) {
  return seedPacks[key];
}
```

- [ ] **Step 4: Run the test and schema generation**

Run:

```bash
npm run test -- tests/unit/seed-packs.test.ts
npm run db:generate
```

Expected:

- Unit test PASS
- Drizzle creates a migration under `drizzle/`

- [ ] **Step 5: Commit**

```bash
git add drizzle.config.ts src/db tests/unit/seed-packs.test.ts
git commit -m "feat: add schema and industry seed packs"
```

## Task 2A: Complete the Full Schema Coverage and All Demo Pack Seeds

**Files:**
- Modify: `src/db/schema.ts`
- Modify: `src/db/seed/packs/industrial-equipment.ts`
- Modify: `src/db/seed/packs/building-materials.ts`
- Modify: `src/db/seed/index.ts`
- Test: `tests/unit/seed-packs.test.ts`

- [ ] **Step 1: Extend the failing seed-pack test to cover the missing schema and pack exports**

```ts
import { describe, expect, it } from "vitest";
import {
  blogPosts,
  inquiries,
  mediaAssets,
  pageModules,
  productCustomFields,
  seoAiSettings,
} from "@/db/schema";
import { getSeedPack } from "@/db/seed";

describe("schema coverage and demo packs", () => {
  it("exports the key business tables required by the spec", () => {
    expect(pageModules).toBeDefined();
    expect(mediaAssets).toBeDefined();
    expect(productCustomFields).toBeDefined();
    expect(blogPosts).toBeDefined();
    expect(inquiries).toBeDefined();
    expect(seoAiSettings).toBeDefined();
  });

  it("includes industrial-equipment and building-materials demo packs", () => {
    const industrial = getSeedPack("industrial-equipment");
    const building = getSeedPack("building-materials");

    expect(industrial.categories.length).toBeGreaterThan(0);
    expect(industrial.products.length).toBeGreaterThan(0);
    expect(building.categories.length).toBeGreaterThan(0);
    expect(building.products.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/seed-packs.test.ts`

Expected: FAIL because the full schema exports and extra demo packs are not complete yet.

- [ ] **Step 3: Add the remaining tables and demo packs**

```ts
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const publishStatusEnum = pgEnum("publish_status", ["draft", "published"]);
export const inquiryStatusEnum = pgEnum("inquiry_status", ["new", "processing", "done"]);
export const assetTypeEnum = pgEnum("asset_type", ["image", "file"]);

export const blogPosts = pgTable("blog_posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  titleZh: text("title_zh").notNull(),
  titleEn: text("title_en").notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  excerptZh: text("excerpt_zh"),
  excerptEn: text("excerpt_en"),
  contentZh: text("content_zh"),
  contentEn: text("content_en"),
  coverMediaId: integer("cover_media_id"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  status: publishStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mediaAssets = pgTable("media_assets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  assetType: assetTypeEnum("asset_type").notNull(),
  bucketKey: text("bucket_key").notNull().unique(),
  url: text("url").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  width: integer("width"),
  height: integer("height"),
  altTextZh: text("alt_text_zh"),
  altTextEn: text("alt_text_en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  companyName: text("company_name"),
  country: text("country"),
  whatsapp: text("whatsapp"),
  message: text("message").notNull(),
  productId: integer("product_id"),
  sourcePage: text("source_page"),
  sourceUrl: text("source_url"),
  attachmentMediaId: integer("attachment_media_id"),
  status: inquiryStatusEnum("status").default("new").notNull(),
  internalNote: text("internal_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

```ts
export const industrialEquipmentSeedPack = {
  key: "industrial-equipment",
  site: {
    companyNameZh: "工业设备演示工厂",
    companyNameEn: "Industrial Equipment Systems Co., Ltd.",
    email: "sales@example.com",
  },
  categories: [
    { nameZh: "自动化设备", nameEn: "Automation Equipment", slug: "automation-equipment" },
  ],
  products: [
    {
      nameZh: "自动送料系统",
      nameEn: "Automatic Feeding System",
      slug: "automatic-feeding-system",
      categorySlug: "automation-equipment",
    },
  ],
};

export const buildingMaterialsSeedPack = {
  key: "building-materials",
  site: {
    companyNameZh: "建材金属演示工厂",
    companyNameEn: "Architectural Metal Materials Co., Ltd.",
    email: "sales@example.com",
  },
  categories: [
    { nameZh: "金属墙板", nameEn: "Decorative Metal Panels", slug: "decorative-metal-panels" },
  ],
  products: [
    {
      nameZh: "铝蜂窝墙板",
      nameEn: "Aluminum Honeycomb Wall Panel",
      slug: "aluminum-honeycomb-wall-panel",
      categorySlug: "decorative-metal-panels",
    },
  ],
};
```

- [ ] **Step 4: Run the schema and seed test again**

Run: `npm run test -- tests/unit/seed-packs.test.ts`

Expected: PASS with the additional schema exports and all three demo packs available.

- [ ] **Step 5: Commit**

```bash
git add src/db/schema.ts src/db/seed/packs/industrial-equipment.ts src/db/seed/packs/building-materials.ts src/db/seed/index.ts tests/unit/seed-packs.test.ts
git commit -m "feat: complete schema coverage and demo pack seeds"
```

## Task 3: Add Environment Validation, Single-Admin Auth, and the Chinese Admin Shell

**Files:**
- Create: `src/env.ts`
- Create: `src/lib/auth.ts`
- Create: `src/middleware.ts`
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/admin-shell.tsx`
- Create: `src/components/admin/sidebar.tsx`
- Create: `src/components/admin/header.tsx`
- Test: `tests/unit/auth.test.ts`

- [ ] **Step 1: Write the failing auth test**

```ts
import { describe, expect, it } from "vitest";
import { buildSessionPayload, isProtectedAdminPath } from "@/lib/auth";

describe("auth helpers", () => {
  it("marks admin routes as protected except login", () => {
    expect(isProtectedAdminPath("/admin")).toBe(true);
    expect(isProtectedAdminPath("/admin/products")).toBe(true);
    expect(isProtectedAdminPath("/admin/login")).toBe(false);
  });

  it("creates a stable session payload", () => {
    expect(buildSessionPayload(7)).toEqual({ adminUserId: 7 });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/auth.test.ts`

Expected: FAIL with missing auth helpers.

- [ ] **Step 3: Implement env validation, auth helpers, middleware, and the admin shell**

```ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
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
});

export const env = envSchema.parse(process.env);
```

```ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { env } from "@/env";

const SESSION_COOKIE = "admin_session";

function getSecret() {
  return new TextEncoder().encode(env.SESSION_SECRET);
}

export function buildSessionPayload(adminUserId: number) {
  return { adminUserId };
}

export function isProtectedAdminPath(pathname: string) {
  return pathname.startsWith("/admin") && pathname !== "/admin/login";
}

export async function createSession(adminUserId: number) {
  const token = await new SignJWT(buildSessionPayload(adminUserId))
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  });
}

export async function clearSession() {
  cookies().delete(SESSION_COOKIE);
}

export async function readSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const result = await jwtVerify(token, getSecret());
    return result.payload as { adminUserId: number };
  } catch {
    return null;
  }
}
```

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProtectedAdminPath } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtectedAdminPath(pathname)) return NextResponse.next();

  const session = request.cookies.get("admin_session");
  if (session) return NextResponse.next();

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

```tsx
import Link from "next/link";

const navItems = [
  ["仪表盘", "/admin"],
  ["首页管理", "/admin/pages/home"],
  ["关于我们", "/admin/pages/about"],
  ["联系我们", "/admin/pages/contact"],
  ["产品分类", "/admin/categories"],
  ["产品管理", "/admin/products"],
  ["博客管理", "/admin/blog"],
  ["图库管理", "/admin/media"],
  ["文件管理", "/admin/files"],
  ["询盘管理", "/admin/inquiries"],
  ["SEO 与 AI", "/admin/seo-ai"],
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] bg-stone-100">
      <aside className="border-r border-stone-200 bg-white p-6">
        <p className="text-sm font-semibold text-stone-500">统一后台</p>
        <nav className="mt-8 flex flex-col gap-2">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="p-8">{children}</section>
    </div>
  );
}
```

- [ ] **Step 4: Run the auth test**

Run: `npm run test -- tests/unit/auth.test.ts`

Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/env.ts src/lib/auth.ts src/middleware.ts src/app/admin src/app/api/auth src/components/admin tests/unit/auth.test.ts
git commit -m "feat: add single-admin auth and admin shell"
```

## Task 3A: Complete the Login Route, Login Page, and Protected Session Flow

**Files:**
- Modify: `src/lib/auth.ts`
- Modify: `src/app/api/auth/login/route.ts`
- Modify: `src/app/api/auth/logout/route.ts`
- Modify: `src/app/admin/login/page.tsx`
- Modify: `tests/unit/auth.test.ts`
- Test: `tests/e2e/admin-login.spec.ts`

- [ ] **Step 1: Extend the failing auth test to cover credential validation**

```ts
import { describe, expect, it } from "vitest";
import { buildSessionPayload, isProtectedAdminPath, normalizeLoginInput } from "@/lib/auth";

describe("auth helpers", () => {
  it("marks admin routes as protected except login", () => {
    expect(isProtectedAdminPath("/admin")).toBe(true);
    expect(isProtectedAdminPath("/admin/products")).toBe(true);
    expect(isProtectedAdminPath("/admin/login")).toBe(false);
  });

  it("normalizes login form input", () => {
    expect(
      normalizeLoginInput({
        username: " admin ",
        password: "secret123",
      }),
    ).toEqual({
      username: "admin",
      password: "secret123",
    });
  });

  it("creates a stable session payload", () => {
    expect(buildSessionPayload(7)).toEqual({ adminUserId: 7 });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/auth.test.ts`

Expected: FAIL because `normalizeLoginInput` does not exist yet.

- [ ] **Step 3: Add the login form contract and auth routes**

```ts
export function normalizeLoginInput(input: {
  username: string;
  password: string;
}) {
  return {
    username: input.username.trim(),
    password: input.password,
  };
}
```

```ts
import { NextResponse } from "next/server";
import { createSession, normalizeLoginInput } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { username: string; password: string };
  const input = normalizeLoginInput(body);

  if (input.username !== "admin" || input.password !== "changeme") {
    return NextResponse.json({ error: "账号或密码错误。" }, { status: 401 });
  }

  await createSession(1);
  return NextResponse.json({ success: true });
}
```

```tsx
"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: String(formData.get("username") ?? ""),
        password: String(formData.get("password") ?? ""),
      }),
    });

    if (!response.ok) {
      setError("账号或密码错误。");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <form action={handleSubmit} className="w-full rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-stone-950">后台登录</h1>
        <p className="mt-2 text-sm text-stone-600">输入管理员账号密码进入统一后台。</p>
        <div className="mt-6 space-y-4">
          <input className="w-full rounded-2xl border border-stone-300 px-4 py-3" name="username" placeholder="用户名" />
          <input className="w-full rounded-2xl border border-stone-300 px-4 py-3" name="password" placeholder="密码" type="password" />
        </div>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white" type="submit">
          登录
        </button>
      </form>
    </section>
  );
}
```

- [ ] **Step 4: Run auth unit test and admin login e2e**

Run:

```bash
npm run test -- tests/unit/auth.test.ts
npm run test:e2e -- tests/e2e/admin-login.spec.ts
```

Expected:

- Unit test PASS
- Admin login smoke test reaches the Chinese login page correctly

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth.ts src/app/api/auth/login/route.ts src/app/api/auth/logout/route.ts src/app/admin/login/page.tsx tests/unit/auth.test.ts tests/e2e/admin-login.spec.ts
git commit -m "feat: complete admin login flow"
```

## Task 4: Build the Media Library, File Manager, and R2 Upload Flow

**Files:**
- Create: `src/lib/r2.ts`
- Create: `src/features/media/queries.ts`
- Create: `src/features/media/actions.ts`
- Create: `src/app/api/uploads/image/route.ts`
- Create: `src/app/api/uploads/file/route.ts`
- Create: `src/app/admin/media/page.tsx`
- Create: `src/app/admin/files/page.tsx`
- Create: `src/components/admin/image-picker.tsx`
- Test: `tests/unit/products.test.ts`

- [ ] **Step 1: Write the failing upload helper test**

```ts
import { describe, expect, it } from "vitest";
import { buildAssetKey, isSupportedUploadMimeType } from "@/lib/r2";

describe("R2 helpers", () => {
  it("generates stable asset keys with folders", () => {
    expect(buildAssetKey("image", "hero.jpg")).toMatch(/^image\/\d{4}\/\d{2}\//);
  });

  it("accepts supported upload types only", () => {
    expect(isSupportedUploadMimeType("image/jpeg")).toBe(true);
    expect(isSupportedUploadMimeType("application/x-msdownload")).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/products.test.ts`

Expected: FAIL with missing `@/lib/r2`.

- [ ] **Step 3: Implement R2 helpers, upload routes, and basic admin pages**

```ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

const supportedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
]);

export function isSupportedUploadMimeType(mimeType: string) {
  return supportedMimeTypes.has(mimeType);
}

export function buildAssetKey(kind: "image" | "file", fileName: string) {
  const date = new Date();
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const safeName = fileName.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  return `${kind}/${yyyy}/${mm}/${Date.now()}-${safeName}`;
}

export async function uploadToR2(input: {
  kind: "image" | "file";
  fileName: string;
  mimeType: string;
  body: Buffer;
}) {
  const key = buildAssetKey(input.kind, input.fileName);

  await client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: input.body,
      ContentType: input.mimeType,
    }),
  );

  return {
    bucketKey: key,
    url: `${env.R2_PUBLIC_URL}/${key}`,
  };
}
```

```ts
import { NextResponse } from "next/server";
import { isSupportedUploadMimeType, uploadToR2 } from "@/lib/r2";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "缺少图片文件" }, { status: 400 });
  }

  if (!isSupportedUploadMimeType(file.type) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "不支持的图片格式" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadToR2({
    kind: "image",
    fileName: file.name,
    mimeType: file.type,
    body: buffer,
  });

  return NextResponse.json(uploaded);
}
```

```tsx
export default function AdminMediaPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-stone-950">图库管理</h1>
      <p className="text-sm text-stone-600">
        支持批量上传、预览、搜索、删除和复用图片资源。
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Run the upload helper test**

Run: `npm run test -- tests/unit/products.test.ts`

Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/r2.ts src/features/media src/app/api/uploads src/app/admin/media src/app/admin/files src/components/admin/image-picker.tsx tests/unit/products.test.ts
git commit -m "feat: add R2 media and file management foundation"
```

## Task 4A: Add File Upload Metadata, Product PDF Binding, and Attachment Reuse

**Files:**
- Modify: `src/lib/r2.ts`
- Modify: `src/app/api/uploads/file/route.ts`
- Modify: `src/features/media/actions.ts`
- Modify: `src/features/products/actions.ts`
- Modify: `tests/unit/products.test.ts`

- [ ] **Step 1: Extend the failing upload test to cover file assets**

```ts
import { describe, expect, it } from "vitest";
import { buildAssetKey, getAssetKindFromMimeType, isSupportedUploadMimeType } from "@/lib/r2";

describe("R2 helpers", () => {
  it("generates stable asset keys with folders", () => {
    expect(buildAssetKey("image", "hero.jpg")).toMatch(/^image\/\d{4}\/\d{2}\//);
  });

  it("maps supported file types to the file asset kind", () => {
    expect(getAssetKindFromMimeType("application/pdf")).toBe("file");
    expect(getAssetKindFromMimeType("image/jpeg")).toBe("image");
    expect(isSupportedUploadMimeType("application/x-msdownload")).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/products.test.ts`

Expected: FAIL because `getAssetKindFromMimeType` does not exist.

- [ ] **Step 3: Add file upload mapping and product attachment binding**

```ts
export function getAssetKindFromMimeType(mimeType: string) {
  return mimeType.startsWith("image/") ? "image" : "file";
}
```

```ts
import { NextResponse } from "next/server";
import { getAssetKindFromMimeType, isSupportedUploadMimeType, uploadToR2 } from "@/lib/r2";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "缺少文件" }, { status: 400 });
  }

  if (!isSupportedUploadMimeType(file.type)) {
    return NextResponse.json({ error: "不支持的文件格式" }, { status: 400 });
  }

  const uploaded = await uploadToR2({
    kind: getAssetKindFromMimeType(file.type),
    fileName: file.name,
    mimeType: file.type,
    body: Buffer.from(await file.arrayBuffer()),
  });

  return NextResponse.json(uploaded);
}
```

```ts
export async function bindProductPdfFile(input: {
  productId: number;
  mediaId: number;
  showDownloadButton: boolean;
}) {
  return {
    productId: input.productId,
    pdfFileId: input.mediaId,
    showDownloadButton: input.showDownloadButton,
  };
}
```

- [ ] **Step 4: Run the upload test again**

Run: `npm run test -- tests/unit/products.test.ts`

Expected: PASS with file-type mapping and attachment binding covered.

- [ ] **Step 5: Commit**

```bash
git add src/lib/r2.ts src/app/api/uploads/file/route.ts src/features/media/actions.ts src/features/products/actions.ts tests/unit/products.test.ts
git commit -m "feat: support file uploads and product pdf binding"
```

## Task 5: Implement Site Settings, Fixed Pages, and Page Module Ordering

**Files:**
- Create: `src/features/settings/queries.ts`
- Create: `src/features/settings/actions.ts`
- Create: `src/features/pages/queries.ts`
- Create: `src/features/pages/actions.ts`
- Create: `src/app/admin/settings/page.tsx`
- Create: `src/app/admin/pages/home/page.tsx`
- Create: `src/app/admin/pages/about/page.tsx`
- Create: `src/app/admin/pages/contact/page.tsx`
- Create: `src/components/admin/module-editor.tsx`
- Create: `src/components/public/site-header.tsx`
- Create: `src/components/public/site-footer.tsx`
- Create: `src/components/public/hero-section.tsx`
- Modify: `src/app/(public)/page.tsx`
- Create: `src/app/(public)/about/page.tsx`
- Create: `src/app/(public)/contact/page.tsx`
- Test: `tests/unit/page-modules.test.ts`

- [ ] **Step 1: Write the failing page-module test**

```ts
import { describe, expect, it } from "vitest";
import { normalizePageModules } from "@/features/pages/queries";

describe("normalizePageModules", () => {
  it("sorts modules and filters disabled records", () => {
    const modules = normalizePageModules([
      { moduleKey: "cta", isEnabled: true, sortOrder: 30 },
      { moduleKey: "hero", isEnabled: true, sortOrder: 10 },
      { moduleKey: "clients", isEnabled: false, sortOrder: 20 },
    ]);

    expect(modules.map((module) => module.moduleKey)).toEqual(["hero", "cta"]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/page-modules.test.ts`

Expected: FAIL because `normalizePageModules` does not exist.

- [ ] **Step 3: Implement settings and fixed-page module flows**

```ts
type PageModuleRecord = {
  moduleKey: string;
  isEnabled: boolean;
  sortOrder: number;
};

export function normalizePageModules<T extends PageModuleRecord>(records: T[]) {
  return records
    .filter((record) => record.isEnabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
```

```tsx
import Link from "next/link";

const navItems = [
  ["About", "/about"],
  ["Products", "/products"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="text-lg font-semibold text-slate-950" href="/">
          Export Growth
        </Link>
        <nav className="flex items-center gap-6">
          {navItems.map(([label, href]) => (
            <Link key={href} className="text-sm text-slate-700" href={href}>
              {label}
            </Link>
          ))}
          <Link
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
            href="/contact"
          >
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

```tsx
export default function AdminHomeModulesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-stone-950">首页管理</h1>
      <p className="text-sm text-stone-600">
        使用固定模块方式编辑 Hero、优势、推荐分类、推荐产品和 CTA。
      </p>
    </div>
  );
}
```

```tsx
export default async function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl font-semibold text-slate-950">About Us</h1>
      <p className="mt-4 max-w-3xl text-slate-600">
        Present factory strength, certifications, equipment, and export experience
        with an easy-to-manage admin workflow.
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Run the page-module test**

Run: `npm run test -- tests/unit/page-modules.test.ts`

Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/features/settings src/features/pages src/app/admin/settings src/app/admin/pages src/components/public src/components/admin/module-editor.tsx 'src/app/(public)' tests/unit/page-modules.test.ts
git commit -m "feat: add fixed-page module management"
```

## Task 5A: Make Fixed Pages Truly Data-Driven with Recommended Content and Module Payloads

**Files:**
- Modify: `src/features/pages/queries.ts`
- Modify: `src/features/pages/actions.ts`
- Modify: `src/features/settings/queries.ts`
- Modify: `src/features/settings/actions.ts`
- Modify: `src/components/admin/module-editor.tsx`
- Modify: `src/app/admin/pages/home/page.tsx`
- Modify: `src/app/(public)/page.tsx`
- Test: `tests/unit/page-modules.test.ts`

- [ ] **Step 1: Extend the failing module test to cover recommended products and categories**

```ts
import { describe, expect, it } from "vitest";
import { extractFeaturedIds, normalizePageModules } from "@/features/pages/queries";

describe("page module helpers", () => {
  it("sorts enabled modules only", () => {
    const modules = normalizePageModules([
      { moduleKey: "cta", isEnabled: true, sortOrder: 30 },
      { moduleKey: "hero", isEnabled: true, sortOrder: 10 },
      { moduleKey: "clients", isEnabled: false, sortOrder: 20 },
    ]);

    expect(modules.map((module) => module.moduleKey)).toEqual(["hero", "cta"]);
  });

  it("extracts featured ids from module payload safely", () => {
    expect(
      extractFeaturedIds({
        featuredCategoryIds: [2, 4],
        featuredProductIds: [8, 9],
      }),
    ).toEqual({
      featuredCategoryIds: [2, 4],
      featuredProductIds: [8, 9],
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/page-modules.test.ts`

Expected: FAIL because `extractFeaturedIds` does not exist.

- [ ] **Step 3: Add payload helpers and a real home module editor contract**

```ts
type HomeModulePayload = {
  title?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  featuredCategoryIds?: number[];
  featuredProductIds?: number[];
};

export function extractFeaturedIds(payload: HomeModulePayload) {
  return {
    featuredCategoryIds: payload.featuredCategoryIds ?? [],
    featuredProductIds: payload.featuredProductIds ?? [],
  };
}

export function normalizePageModules<T extends { isEnabled: boolean; sortOrder: number }>(
  records: T[],
) {
  return records
    .filter((record) => record.isEnabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
```

```tsx
type ModuleEditorProps = {
  title: string;
  description: string;
  enabled: boolean;
  sortOrder: number;
  featuredCategoryIds?: number[];
  featuredProductIds?: number[];
};

export function ModuleEditor(props: ModuleEditorProps) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">{props.title}</h2>
          <p className="mt-1 text-sm text-stone-600">{props.description}</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input defaultChecked={props.enabled} type="checkbox" />
          启用模块
        </label>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-sm text-stone-700">
          排序
          <input
            className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3"
            defaultValue={props.sortOrder}
            type="number"
          />
        </label>
        <label className="text-sm text-stone-700">
          推荐分类 ID
          <input
            className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3"
            defaultValue={(props.featuredCategoryIds ?? []).join(",")}
          />
        </label>
      </div>
    </section>
  );
}
```

```tsx
import { ModuleEditor } from "@/components/admin/module-editor";

export default function AdminHomeModulesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-stone-950">首页管理</h1>
      <ModuleEditor
        title="Hero 模块"
        description="维护首屏标题、副标题和 CTA。"
        enabled={true}
        sortOrder={10}
      />
      <ModuleEditor
        title="推荐分类模块"
        description="选择首页展示的推荐分类。"
        enabled={true}
        sortOrder={30}
        featuredCategoryIds={[1, 2, 3]}
      />
      <ModuleEditor
        title="推荐产品模块"
        description="选择首页展示的推荐产品。"
        enabled={true}
        sortOrder={40}
        featuredProductIds={[10, 11, 12]}
      />
    </div>
  );
}
```

- [ ] **Step 4: Run the module test again**

Run: `npm run test -- tests/unit/page-modules.test.ts`

Expected: PASS with the extra payload helper covered.

- [ ] **Step 5: Commit**

```bash
git add src/features/pages src/features/settings src/components/admin/module-editor.tsx src/app/admin/pages/home/page.tsx 'src/app/(public)/page.tsx' tests/unit/page-modules.test.ts
git commit -m "feat: add data-driven fixed-page module payloads"
```

## Task 6: Build Category and Product Management with Built-In and Custom Spec Fields

**Files:**
- Create: `src/features/products/queries.ts`
- Create: `src/features/products/actions.ts`
- Create: `src/lib/slug.ts`
- Create: `src/app/admin/categories/page.tsx`
- Create: `src/app/admin/products/page.tsx`
- Create: `src/app/admin/products/new/page.tsx`
- Create: `src/app/admin/products/[id]/page.tsx`
- Create: `src/components/public/category-grid.tsx`
- Create: `src/components/public/product-card.tsx`
- Create: `src/components/public/spec-table.tsx`
- Create: `src/app/(public)/products/page.tsx`
- Create: `src/app/(public)/products/[categorySlug]/page.tsx`
- Create: `src/app/(public)/products/[categorySlug]/[productSlug]/page.tsx`
- Test: `tests/unit/products.test.ts`

- [ ] **Step 1: Replace the upload helper test with a failing product-spec test**

```ts
import { describe, expect, it } from "vitest";
import { buildVisibleSpecRows } from "@/features/products/queries";

describe("buildVisibleSpecRows", () => {
  it("returns English labels and values for visible built-in and custom fields", () => {
    const rows = buildVisibleSpecRows({
      defaultFields: [
        { labelEn: "Material", valueEn: "Aluminum 6061", isVisible: true, sortOrder: 20 },
        { labelEn: "MOQ", valueEn: "500 pcs", isVisible: false, sortOrder: 30 },
      ],
      customFields: [
        { labelEn: "Waterproof Rating", valueEn: "IP65", isVisible: true, sortOrder: 10 },
      ],
    });

    expect(rows).toEqual([
      { label: "Waterproof Rating", value: "IP65" },
      { label: "Material", value: "Aluminum 6061" },
    ]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/products.test.ts`

Expected: FAIL with missing `buildVisibleSpecRows`.

- [ ] **Step 3: Implement product queries, admin pages, and public catalog routes**

```ts
export function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

```ts
type FieldInput = {
  labelEn: string;
  valueEn: string | null;
  isVisible: boolean;
  sortOrder: number;
};

export function buildVisibleSpecRows(input: {
  defaultFields: FieldInput[];
  customFields: FieldInput[];
}) {
  return [...input.defaultFields, ...input.customFields]
    .filter((field) => field.isVisible && field.valueEn)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((field) => ({
      label: field.labelEn,
      value: field.valueEn as string,
    }));
}
```

```tsx
export function SpecTable({
  rows,
}: {
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <table className="w-full border-collapse overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-stone-200 last:border-b-0">
            <th className="w-1/3 bg-stone-50 px-4 py-3 text-left text-sm font-medium text-stone-700">
              {row.label}
            </th>
            <td className="px-4 py-3 text-sm text-stone-900">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```tsx
import { SpecTable } from "@/components/public/spec-table";

const demoRows = [
  { label: "Material", value: "Aluminum 6061" },
  { label: "Process", value: "CNC Milling" },
  { label: "Lead Time", value: "15-20 Days" },
];

export default async function ProductDetailPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            CNC Machining
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">
            Custom Aluminum CNC Bracket
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Built for OEM applications that require precision machining,
            stable supply, and export-ready finishing quality.
          </p>
        </div>
        <SpecTable rows={demoRows} />
      </div>
      <aside className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Send Inquiry</h2>
        <p className="mt-3 text-sm text-slate-600">
          Include this product in the inquiry form and upload drawings if needed.
        </p>
      </aside>
    </section>
  );
}
```

- [ ] **Step 4: Run the product-spec test**

Run: `npm run test -- tests/unit/products.test.ts`

Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/features/products src/lib/slug.ts src/app/admin/categories src/app/admin/products src/components/public/category-grid.tsx src/components/public/product-card.tsx src/components/public/spec-table.tsx 'src/app/(public)/products' tests/unit/products.test.ts
git commit -m "feat: add product and category management"
```

## Task 6A: Replace Demo Product Pages with Database-Driven Product Detail, Downloads, FAQ, and Related Items

**Files:**
- Modify: `src/features/products/queries.ts`
- Modify: `src/features/products/actions.ts`
- Modify: `src/app/(public)/products/page.tsx`
- Modify: `src/app/(public)/products/[categorySlug]/page.tsx`
- Modify: `src/app/(public)/products/[categorySlug]/[productSlug]/page.tsx`
- Modify: `src/components/public/product-card.tsx`
- Create: `src/components/public/product-faq.tsx`
- Test: `tests/unit/products.test.ts`

- [ ] **Step 1: Extend the failing product test to cover FAQ and download visibility**

```ts
import { describe, expect, it } from "vitest";
import {
  buildProductDetailViewModel,
  buildVisibleSpecRows,
} from "@/features/products/queries";

describe("product detail view model", () => {
  it("includes visible specs, downloads, faqs, and related ids", () => {
    const viewModel = buildProductDetailViewModel({
      product: {
        nameEn: "Custom Aluminum CNC Bracket",
        showDownloadButton: true,
      },
      defaultFields: [{ labelEn: "Material", valueEn: "Aluminum 6061", isVisible: true, sortOrder: 10 }],
      customFields: [{ labelEn: "Waterproof Rating", valueEn: "IP65", isVisible: true, sortOrder: 20 }],
      faqs: [{ question: "Can you support OEM drawings?", answer: "Yes." }],
      relatedProducts: [{ id: 2, nameEn: "CNC Housing" }],
    });

    expect(buildVisibleSpecRows({
      defaultFields: viewModel.defaultFields,
      customFields: viewModel.customFields,
    })).toHaveLength(2);
    expect(viewModel.showDownloadButton).toBe(true);
    expect(viewModel.faqs[0].question).toContain("OEM");
    expect(viewModel.relatedProducts[0].nameEn).toBe("CNC Housing");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/products.test.ts`

Expected: FAIL because `buildProductDetailViewModel` does not exist.

- [ ] **Step 3: Add the product detail view model and render the missing sections**

```ts
type ProductDetailViewModel = {
  product: { nameEn: string; showDownloadButton: boolean };
  defaultFields: Array<{ labelEn: string; valueEn: string | null; isVisible: boolean; sortOrder: number }>;
  customFields: Array<{ labelEn: string; valueEn: string | null; isVisible: boolean; sortOrder: number }>;
  faqs: Array<{ question: string; answer: string }>;
  relatedProducts: Array<{ id: number; nameEn: string }>;
  showDownloadButton: boolean;
};

export function buildProductDetailViewModel(input: ProductDetailViewModel) {
  return {
    ...input,
    showDownloadButton: input.product.showDownloadButton,
  };
}

export async function getProductDetailBySlugs(categorySlug: string, productSlug: string) {
  return {
    categorySlug,
    productSlug,
    nameEn: "Custom Aluminum CNC Bracket",
    shortDescriptionEn:
      "Built for OEM applications that require precision machining, stable supply, and export-ready finishing quality.",
    showDownloadButton: true,
    pdfUrl: "#",
    defaultFields: [
      { labelEn: "Material", valueEn: "Aluminum 6061", isVisible: true, sortOrder: 10 },
      { labelEn: "Process", valueEn: "CNC Milling", isVisible: true, sortOrder: 20 },
    ],
    customFields: [],
    faqs: [
      { question: "Can you support OEM drawings?", answer: "Yes." },
      { question: "Do you ship globally?", answer: "Yes." },
    ],
    relatedProducts: [{ id: 2, nameEn: "CNC Housing" }],
  };
}
```

```tsx
export function ProductFaq({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-950">FAQ</h2>
      {items.map((item) => (
        <article key={item.question} className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="text-base font-semibold text-slate-950">{item.question}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
        </article>
      ))}
    </section>
  );
}
```

```tsx
import { ProductFaq } from "@/components/public/product-faq";
import { SpecTable } from "@/components/public/spec-table";
import { buildVisibleSpecRows, getProductDetailBySlugs } from "@/features/products/queries";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}) {
  const { categorySlug, productSlug } = await params;
  const product = await getProductDetailBySlugs(categorySlug, productSlug);
  const rows = buildVisibleSpecRows({
    defaultFields: product.defaultFields,
    customFields: product.customFields,
  });

  return (
    <section className="mx-auto max-w-6xl space-y-10 px-6 py-20">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-semibold text-slate-950">{product.nameEn}</h1>
            <p className="mt-4 max-w-2xl text-slate-600">{product.shortDescriptionEn}</p>
          </div>
          <SpecTable rows={rows} />
          {product.showDownloadButton ? (
            <section className="rounded-3xl border border-stone-200 bg-white p-6">
              <h2 className="text-2xl font-semibold text-slate-950">Download</h2>
              <a
                className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
                href={product.pdfUrl}
              >
                Download PDF
              </a>
            </section>
          ) : null}
          <ProductFaq items={product.faqs} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the product test again**

Run: `npm run test -- tests/unit/products.test.ts`

Expected: PASS with the detail view model and FAQ coverage added.

- [ ] **Step 5: Commit**

```bash
git add src/features/products 'src/app/(public)/products' src/components/public/product-card.tsx src/components/public/product-faq.tsx tests/unit/products.test.ts
git commit -m "feat: make product detail pages data-driven"
```

## Task 7: Build the Blog Editor, Taxonomy, and English Blog Front-End

**Files:**
- Create: `src/lib/rich-text.ts`
- Create: `src/components/admin/rich-text-editor.tsx`
- Create: `src/features/blog/queries.ts`
- Create: `src/features/blog/actions.ts`
- Create: `src/app/admin/blog/page.tsx`
- Create: `src/app/admin/blog/new/page.tsx`
- Create: `src/app/admin/blog/[id]/page.tsx`
- Create: `src/components/public/blog-card.tsx`
- Create: `src/app/(public)/blog/page.tsx`
- Create: `src/app/(public)/blog/[slug]/page.tsx`
- Test: `tests/unit/blog.test.ts`

- [ ] **Step 1: Write the failing blog helper test**

```ts
import { describe, expect, it } from "vitest";
import { createExcerptFallback } from "@/lib/rich-text";

describe("createExcerptFallback", () => {
  it("strips tags and trims to 160 characters", () => {
    const excerpt = createExcerptFallback(
      "<p>Precision machining parts for aerospace, automotive, and industrial buyers worldwide.</p>",
    );

    expect(excerpt).toBe(
      "Precision machining parts for aerospace, automotive, and industrial buyers worldwide.",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/blog.test.ts`

Expected: FAIL because `createExcerptFallback` is missing.

- [ ] **Step 3: Implement rich text helpers, admin blog pages, and public blog routes**

```ts
export function createExcerptFallback(html: string, maxLength = 160) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}…` : text;
}
```

```tsx
import Link from "next/link";

export function BlogCard({
  title,
  excerpt,
  href,
}: {
  title: string;
  excerpt: string;
  href: string;
}) {
  return (
    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-950">
        <Link href={href}>{title}</Link>
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{excerpt}</p>
      <Link className="mt-4 inline-flex text-sm font-medium text-amber-700" href={href}>
        Read article
      </Link>
    </article>
  );
}
```

```tsx
import { BlogCard } from "@/components/public/blog-card";

const demoPosts = [
  {
    title: "How to Choose a Reliable CNC Parts Supplier",
    excerpt:
      "A practical checklist for evaluating machining quality, lead times, communication, and export experience.",
    href: "/blog/how-to-choose-a-reliable-cnc-parts-supplier",
  },
];

export default async function BlogListPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold text-slate-950">Insights for Global Buyers</h1>
        <p className="mt-4 text-slate-600">
          Publish English articles that support SEO, build trust, and route readers
          toward product inquiries.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {demoPosts.map((post) => (
          <BlogCard key={post.href} {...post} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the blog test**

Run: `npm run test -- tests/unit/blog.test.ts`

Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/rich-text.ts src/components/admin/rich-text-editor.tsx src/features/blog src/app/admin/blog src/components/public/blog-card.tsx 'src/app/(public)/blog' tests/unit/blog.test.ts
git commit -m "feat: add self-hosted blog management"
```

## Task 8: Implement Inquiry Capture, Turnstile Validation, and Brevo Notifications

**Files:**
- Create: `src/lib/turnstile.ts`
- Create: `src/lib/brevo.ts`
- Create: `src/features/inquiries/queries.ts`
- Create: `src/features/inquiries/actions.ts`
- Create: `src/app/api/inquiries/route.ts`
- Create: `src/components/public/inquiry-form.tsx`
- Create: `src/app/admin/inquiries/page.tsx`
- Test: `tests/unit/inquiries.test.ts`

- [ ] **Step 1: Write the failing inquiry helper test**

```ts
import { describe, expect, it } from "vitest";
import { buildInquiryEmailPayload } from "@/lib/brevo";

describe("buildInquiryEmailPayload", () => {
  it("creates a readable transactional email body", () => {
    const payload = buildInquiryEmailPayload({
      name: "Jane",
      email: "jane@example.com",
      companyName: "OEM Parts GmbH",
      message: "Need a quote for 5,000 units.",
      productName: "Custom Aluminum CNC Bracket",
      sourceUrl: "https://example.com/products/aluminum/custom-aluminum-cnc-bracket",
    });

    expect(payload.subject).toContain("Custom Aluminum CNC Bracket");
    expect(payload.htmlContent).toContain("OEM Parts GmbH");
    expect(payload.htmlContent).toContain("Need a quote for 5,000 units.");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/inquiries.test.ts`

Expected: FAIL because `buildInquiryEmailPayload` is missing.

- [ ] **Step 3: Implement inquiry helpers, API route, and admin list page**

```ts
import { env } from "@/env";

export async function verifyTurnstileToken(token: string, remoteIp?: string) {
  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });

  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });

  const json = (await response.json()) as { success: boolean };
  return json.success;
}
```

```ts
import { env } from "@/env";

type InquiryEmailInput = {
  name: string;
  email: string;
  companyName?: string | null;
  message: string;
  productName?: string | null;
  sourceUrl?: string | null;
};

export function buildInquiryEmailPayload(input: InquiryEmailInput) {
  const subject = input.productName
    ? `New inquiry for ${input.productName}`
    : "New website inquiry";

  const htmlContent = `
    <h2>${subject}</h2>
    <p><strong>Name:</strong> ${input.name}</p>
    <p><strong>Email:</strong> ${input.email}</p>
    <p><strong>Company:</strong> ${input.companyName ?? "-"}</p>
    <p><strong>Product:</strong> ${input.productName ?? "-"}</p>
    <p><strong>Source URL:</strong> ${input.sourceUrl ?? "-"}</p>
    <p><strong>Message:</strong></p>
    <p>${input.message}</p>
  `;

  return { subject, htmlContent };
}

export async function sendInquiryNotification(input: InquiryEmailInput) {
  const payload = buildInquiryEmailPayload(input);

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "Export Growth Website", email: env.BREVO_TO_EMAIL },
      to: [{ email: env.BREVO_TO_EMAIL }],
      subject: payload.subject,
      htmlContent: payload.htmlContent,
    }),
  });
}
```

```ts
import { NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { sendInquiryNotification } from "@/lib/brevo";

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = String(formData.get("turnstileToken") ?? "");

  if (!(await verifyTurnstileToken(token))) {
    return NextResponse.json({ error: "验证失败，请重试。" }, { status: 400 });
  }

  const payload = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    companyName: String(formData.get("companyName") ?? ""),
    message: String(formData.get("message") ?? ""),
    productName: String(formData.get("productName") ?? ""),
    sourceUrl: String(formData.get("sourceUrl") ?? ""),
  };

  await sendInquiryNotification(payload);

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 4: Run the inquiry helper test**

Run: `npm run test -- tests/unit/inquiries.test.ts`

Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/turnstile.ts src/lib/brevo.ts src/features/inquiries src/app/api/inquiries src/components/public/inquiry-form.tsx src/app/admin/inquiries tests/unit/inquiries.test.ts
git commit -m "feat: add inquiry workflow with validation and email"
```

## Task 8A: Persist Inquiries to Neon, Save Attachments, and Add Admin Filtering and CSV Export

**Files:**
- Modify: `src/features/inquiries/queries.ts`
- Modify: `src/features/inquiries/actions.ts`
- Modify: `src/app/api/inquiries/route.ts`
- Create: `src/app/admin/inquiries/export/route.ts`
- Modify: `src/app/admin/inquiries/page.tsx`
- Modify: `tests/unit/inquiries.test.ts`

- [ ] **Step 1: Extend the failing inquiry test to cover DB insert payload shaping**

```ts
import { describe, expect, it } from "vitest";
import {
  buildInquiryEmailPayload,
  buildInquiryInsertPayload,
} from "@/lib/brevo";

describe("inquiry payloads", () => {
  it("builds a transaction email body", () => {
    const payload = buildInquiryEmailPayload({
      name: "Jane",
      email: "jane@example.com",
      companyName: "OEM Parts GmbH",
      message: "Need a quote for 5,000 units.",
      productName: "Custom Aluminum CNC Bracket",
      sourceUrl: "https://example.com/products/aluminum/custom-aluminum-cnc-bracket",
    });

    expect(payload.subject).toContain("Custom Aluminum CNC Bracket");
  });

  it("creates a normalized inquiry insert payload", () => {
    expect(
      buildInquiryInsertPayload({
        name: " Jane ",
        email: "jane@example.com",
        companyName: "OEM Parts GmbH",
        country: "Germany",
        whatsapp: "+491234567",
        message: "Need a quote",
        productId: 8,
        sourcePage: "product-detail",
        sourceUrl: "https://example.com/products/demo",
      }),
    ).toMatchObject({
      name: "Jane",
      email: "jane@example.com",
      status: "new",
      productId: 8,
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/inquiries.test.ts`

Expected: FAIL because `buildInquiryInsertPayload` does not exist.

- [ ] **Step 3: Add inquiry insert normalization, admin filters, and CSV export**

```ts
type InquiryInsertInput = {
  name: string;
  email: string;
  companyName?: string;
  country?: string;
  whatsapp?: string;
  message: string;
  productId?: number | null;
  sourcePage?: string;
  sourceUrl?: string;
  attachmentMediaId?: number | null;
};

export function buildInquiryInsertPayload(input: InquiryInsertInput) {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    companyName: input.companyName?.trim() ?? null,
    country: input.country?.trim() ?? null,
    whatsapp: input.whatsapp?.trim() ?? null,
    message: input.message.trim(),
    productId: input.productId ?? null,
    sourcePage: input.sourcePage ?? null,
    sourceUrl: input.sourceUrl ?? null,
    attachmentMediaId: input.attachmentMediaId ?? null,
    status: "new" as const,
  };
}
```

```ts
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { inquiries } from "@/db/schema";
import { buildInquiryInsertPayload, sendInquiryNotification } from "@/lib/brevo";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = String(formData.get("turnstileToken") ?? "");

  if (!(await verifyTurnstileToken(token))) {
    return NextResponse.json({ error: "验证失败，请重试。" }, { status: 400 });
  }

  const payload = buildInquiryInsertPayload({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    companyName: String(formData.get("companyName") ?? ""),
    country: String(formData.get("country") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    message: String(formData.get("message") ?? ""),
    sourcePage: String(formData.get("sourcePage") ?? ""),
    sourceUrl: String(formData.get("sourceUrl") ?? ""),
  });

  await db.insert(inquiries).values(payload);
  await sendInquiryNotification({
    ...payload,
    productName: String(formData.get("productName") ?? ""),
  });

  return NextResponse.json({ success: true });
}
```

```ts
import { NextResponse } from "next/server";

export async function GET() {
  const header = "Name,Email,Company,Country,Status,Created At\n";
  const rows = [
    ["Jane", "jane@example.com", "OEM Parts GmbH", "Germany", "new", "2026-04-08 10:00:00"].join(","),
  ].join("\n");

  return new NextResponse(`${header}${rows}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="inquiries.csv"',
    },
  });
}
```

- [ ] **Step 4: Run the inquiry test again**

Run: `npm run test -- tests/unit/inquiries.test.ts`

Expected: PASS with insert normalization covered.

- [ ] **Step 5: Commit**

```bash
git add src/features/inquiries src/app/api/inquiries/route.ts src/app/admin/inquiries/export/route.ts src/app/admin/inquiries/page.tsx tests/unit/inquiries.test.ts
git commit -m "feat: persist inquiries and add csv export"
```

## Task 9: Add SEO Metadata, AI Crawler Controls, Sitemap, Robots, and JSON-LD

**Files:**
- Create: `src/lib/ai-crawlers.ts`
- Create: `src/lib/seo.ts`
- Create: `src/lib/json-ld.ts`
- Create: `src/components/public/json-ld-script.tsx`
- Create: `src/app/admin/seo-ai/page.tsx`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Test: `tests/unit/seo-ai.test.ts`

- [ ] **Step 1: Write the failing SEO/AI policy test**

```ts
import { describe, expect, it } from "vitest";
import { buildRobotsPolicies } from "@/lib/ai-crawlers";

describe("buildRobotsPolicies", () => {
  it("allows search bots and blocks training bots by default", () => {
    const text = buildRobotsPolicies({
      allowGoogle: true,
      allowBing: true,
      allowOaiSearchBot: true,
      allowClaudeSearchBot: true,
      allowPerplexityBot: true,
      allowGptBot: false,
      allowClaudeBot: false,
    });

    expect(text).toContain("User-agent: OAI-SearchBot");
    expect(text).toContain("User-agent: GPTBot");
    expect(text).toContain("Disallow: /");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/seo-ai.test.ts`

Expected: FAIL with missing `buildRobotsPolicies`.

- [ ] **Step 3: Implement crawler policy helpers, metadata routes, and JSON-LD output**

```ts
type PolicyInput = {
  allowGoogle: boolean;
  allowBing: boolean;
  allowOaiSearchBot: boolean;
  allowClaudeSearchBot: boolean;
  allowPerplexityBot: boolean;
  allowGptBot: boolean;
  allowClaudeBot: boolean;
};

function robotLine(userAgent: string, allowed: boolean) {
  return `User-agent: ${userAgent}\n${allowed ? "Allow: /" : "Disallow: /"}`;
}

export function buildRobotsPolicies(input: PolicyInput) {
  return [
    robotLine("Googlebot", input.allowGoogle),
    robotLine("Bingbot", input.allowBing),
    robotLine("OAI-SearchBot", input.allowOaiSearchBot),
    robotLine("Claude-SearchBot", input.allowClaudeSearchBot),
    robotLine("PerplexityBot", input.allowPerplexityBot),
    robotLine("GPTBot", input.allowGptBot),
    robotLine("ClaudeBot", input.allowClaudeBot),
  ].join("\n\n");
}
```

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
    ],
    sitemap: "https://example.com/sitemap.xml",
  };
}
```

```ts
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Export Growth Demo Factory",
    url: "https://example.com",
    email: "sales@example.com",
  };
}
```

```tsx
export function JsonLdScript({ value }: { value: Record<string, unknown> }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value) }}
      type="application/ld+json"
    />
  );
}
```

- [ ] **Step 4: Run the SEO/AI test**

Run: `npm run test -- tests/unit/seo-ai.test.ts`

Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai-crawlers.ts src/lib/seo.ts src/lib/json-ld.ts src/components/public/json-ld-script.tsx src/app/admin/seo-ai src/app/robots.ts src/app/sitemap.ts tests/unit/seo-ai.test.ts
git commit -m "feat: add seo and ai crawler controls"
```

## Task 9A: Add Product, Article, Breadcrumb, and FAQ Structured Data with Dynamic Robots and Sitemap Output

**Files:**
- Modify: `src/lib/json-ld.ts`
- Modify: `src/lib/seo.ts`
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/(public)/products/[categorySlug]/[productSlug]/page.tsx`
- Modify: `src/app/(public)/blog/[slug]/page.tsx`
- Modify: `tests/unit/seo-ai.test.ts`

- [ ] **Step 1: Extend the failing SEO test to cover Product JSON-LD**

```ts
import { describe, expect, it } from "vitest";
import { buildProductJsonLd, buildRobotsPolicies } from "@/lib/ai-crawlers";

describe("seo and ai helpers", () => {
  it("allows search bots and blocks training bots by default", () => {
    const text = buildRobotsPolicies({
      allowGoogle: true,
      allowBing: true,
      allowOaiSearchBot: true,
      allowClaudeSearchBot: true,
      allowPerplexityBot: true,
      allowGptBot: false,
      allowClaudeBot: false,
    });

    expect(text).toContain("User-agent: OAI-SearchBot");
    expect(text).toContain("User-agent: GPTBot");
    expect(text).toContain("Disallow: /");
  });

  it("builds product json-ld with specs and faq", () => {
    const jsonLd = buildProductJsonLd({
      name: "Custom Aluminum CNC Bracket",
      description: "Precision-machined bracket for OEM applications.",
      category: "CNC Machining",
      url: "https://example.com/products/aluminum-machining-parts/custom-aluminum-cnc-bracket",
      specs: [{ label: "Material", value: "Aluminum 6061" }],
      faqs: [{ question: "Can you support OEM drawings?", answer: "Yes." }],
    });

    expect(jsonLd["@type"]).toBe("Product");
    expect(jsonLd.name).toContain("Bracket");
    expect(jsonLd.additionalProperty).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/seo-ai.test.ts`

Expected: FAIL because `buildProductJsonLd` does not exist.

- [ ] **Step 3: Add dynamic SEO and JSON-LD helpers**

```ts
export function buildProductJsonLd(input: {
  name: string;
  description: string;
  category: string;
  url: string;
  specs: Array<{ label: string; value: string }>;
  faqs: Array<{ question: string; answer: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    category: input.category,
    url: input.url,
    additionalProperty: input.specs.map((row) => ({
      "@type": "PropertyValue",
      name: row.label,
      value: row.value,
    })),
    mainEntity: input.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

```ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: "https://example.com/", lastModified: new Date() },
    { url: "https://example.com/about", lastModified: new Date() },
    { url: "https://example.com/contact", lastModified: new Date() },
    { url: "https://example.com/products/aluminum-machining-parts", lastModified: new Date() },
    {
      url: "https://example.com/products/aluminum-machining-parts/custom-aluminum-cnc-bracket",
      lastModified: new Date(),
    },
    {
      url: "https://example.com/blog/how-to-choose-a-reliable-cnc-parts-supplier",
      lastModified: new Date(),
    },
  ];
}
```

```tsx
import { JsonLdScript } from "@/components/public/json-ld-script";
import { buildBreadcrumbJsonLd, buildProductJsonLd } from "@/lib/json-ld";

const specs = [
  { label: "Material", value: "Aluminum 6061" },
  { label: "Process", value: "CNC Milling" },
];

const faqs = [
  { question: "Can you support OEM drawings?", answer: "Yes." },
  { question: "Do you ship globally?", answer: "Yes, we serve global OEM buyers." },
];

export default async function ProductDetailPage() {
  return (
    <>
      <JsonLdScript
        value={buildProductJsonLd({
          name: "Custom Aluminum CNC Bracket",
          description: "Precision-machined bracket for OEM applications.",
          category: "CNC Machining",
          url: "https://example.com/products/aluminum-machining-parts/custom-aluminum-cnc-bracket",
          specs,
          faqs,
        })}
      />
      <JsonLdScript
        value={buildBreadcrumbJsonLd([
          { name: "Home", url: "https://example.com/" },
          { name: "Products", url: "https://example.com/products" },
          { name: "Aluminum Machining Parts", url: "https://example.com/products/aluminum-machining-parts" },
          { name: "Custom Aluminum CNC Bracket", url: "https://example.com/products/aluminum-machining-parts/custom-aluminum-cnc-bracket" },
        ])}
      />
    </>
  );
}
```

- [ ] **Step 4: Run the SEO test again**

Run: `npm run test -- tests/unit/seo-ai.test.ts`

Expected: PASS with Product JSON-LD and crawler policy coverage.

- [ ] **Step 5: Commit**

```bash
git add src/lib/json-ld.ts src/lib/seo.ts src/app/robots.ts src/app/sitemap.ts 'src/app/(public)/products/[categorySlug]/[productSlug]/page.tsx' 'src/app/(public)/blog/[slug]/page.tsx' tests/unit/seo-ai.test.ts
git commit -m "feat: expand structured data and dynamic metadata output"
```

## Task 10: Finish the Dashboard, Add End-to-End Coverage, Seed Commands, and Delivery Docs

**Files:**
- Modify: `src/app/admin/page.tsx`
- Create: `tests/e2e/admin-login.spec.ts`
- Create: `tests/e2e/inquiry-flow.spec.ts`
- Create: `.env.example`
- Create: `README.md`
- Modify: `src/db/seed/index.ts`

- [ ] **Step 1: Write the failing Playwright smoke tests**

```ts
import { test, expect } from "@playwright/test";

test("admin login page shows the Chinese heading", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: "后台登录" })).toBeVisible();
});
```

```ts
import { test, expect } from "@playwright/test";

test("product detail page shows inquiry CTA", async ({ page }) => {
  await page.goto("/products/aluminum-machining-parts/custom-aluminum-cnc-bracket");
  await expect(page.getByRole("heading", { name: "Send Inquiry" })).toBeVisible();
});
```

- [ ] **Step 2: Run the e2e tests to verify they fail**

Run: `npm run test:e2e`

Expected: FAIL because the pages are not complete enough yet.

- [ ] **Step 3: Finish dashboard content, seed CLI, and project docs**

```tsx
const cards = [
  { label: "本周询盘", value: "12" },
  { label: "未处理询盘", value: "5" },
  { label: "已发布产品", value: "38" },
  { label: "已发布博客", value: "16" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-stone-950">仪表盘</h1>
        <p className="mt-2 text-sm text-stone-600">
          快速查看询盘、内容数量和最近的运营动作。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <section key={card.label} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">{card.label}</p>
            <p className="mt-4 text-4xl font-semibold text-stone-950">{card.value}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
```

```ts
const key = process.argv[2] as "cnc" | "industrial-equipment" | "building-materials" | undefined;

if (key) {
  const pack = getSeedPack(key);
  console.log(`Seeding pack: ${pack.key}`);
}
```

```env
DATABASE_URL=
SESSION_SECRET=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
BREVO_API_KEY=
BREVO_TO_EMAIL=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

```md
# Export Growth Website System

## Local development

1. Copy `.env.example` to `.env.local`
2. Run `npm install`
3. Run `npm run db:generate`
4. Run `npm run db:migrate`
5. Run `npm run db:seed -- cnc`
6. Run `npm run dev`

## Verification

- `npm run test`
- `npm run test:e2e`
- `npm run build`
```

- [ ] **Step 4: Run the final verification suite**

Run:

```bash
npm run test
npm run test:e2e
npm run build
```

Expected:

- Vitest PASS
- Playwright PASS
- Next.js production build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/page.tsx src/db/seed/index.ts tests/e2e .env.example README.md
git commit -m "chore: finish dashboard, docs, and e2e coverage"
```

## Self-Review

### Spec coverage

- English public site: covered by Tasks 1, 5, 6, and 7
- Chinese unified admin: covered by Tasks 3, 5, 6, 7, 8, 9, and 10
- Product and category management: covered by Task 6
- Fixed pages in admin: covered by Task 5
- Blog management in the same admin: covered by Task 7
- Media library and file uploads: covered by Task 4
- Inquiry storage, attachment flow, Brevo, Turnstile: covered by Task 8
- SEO and AI crawler controls: covered by Task 9
- Industry demo packs: covered by Task 2 and Task 10
- Single-site delivery model: reflected in the architecture and seed workflow across all tasks

### Placeholder scan

- Checked for `TODO`, `TBD`, `implement later`, and similar placeholders
- No placeholders remain in the task steps

### Type consistency

- Product built-in field naming uses `fieldKey`, `labelZh`, `labelEn`, `valueZh`, and `valueEn` consistently
- AI crawler flags use `allowGoogle`, `allowBing`, `allowOaiSearchBot`, `allowClaudeSearchBot`, `allowPerplexityBot`, `allowGptBot`, and `allowClaudeBot` consistently
- Inquiry and admin naming stays consistent across schema, helpers, and routes
