# INDUSTRY_INIT - Industry Initialization Script Guide

Three-phase automation: Gemini generates content, Antigravity creates images, script uploads to R2.

---

## Quick Start

  1. Edit config: scripts/industry-init/configs/_template.ts
  2. Phase 1: npx tsx scripts/industry-init/run.ts --config my-industry
  3. Phase 2: Tell Antigravity to generate images from image-manifest.json
  4. Phase 3: npx tsx scripts/industry-init/upload-images.ts
---

## Required ENV Variables

| Variable | Required | Description |
|---|---|---|
| DATABASE_URL | YES | Neon PostgreSQL connection string |
| GEMINI_API_KEY | YES | Google Gemini 2.5 Flash key (aistudio.google.com) |
| CLOUDFLARE_R2_BUCKET | YES | R2 bucket name |
| CLOUDFLARE_R2_ENDPOINT | YES | https://<account-id>.r2.cloudflarestorage.com |
| CLOUDFLARE_R2_ACCESS_KEY_ID | YES | R2 API token access key |
| CLOUDFLARE_R2_SECRET_ACCESS_KEY | YES | R2 API token secret key |
| CLOUDFLARE_R2_PUBLIC_URL | YES | Public CDN URL (e.g. https://cdn.yourdomain.com) |

---

## Creating a New Industry Config

  Copy: scripts/industry-init/configs/_template.ts
  Rename and fill in:
    - industry: short keyword (ecommerce, healthcare, logistics...)
    - businessDescription: one sentence about the business
    - company: nameEn, country, email
    - domain: public URL
    - adminPassword: change after first login!

---

## Three-Phase Architecture

### Phase 1 - run.ts (~2 min)
  1. Validates all ENV variables - fails fast with clear messages
  2. Clears existing demo data from DB
  3. Gemini generates: site settings, categories, 10 products, 3 blogs, 8 FAQs, page modules
  4. Seeds all content to Neon DB via Drizzle ORM
  5. Gemini generates image-manifest.json (prompts + styles + sizes for every image)
  6. Gemini generates FRONTEND_ADAPTATION_GUIDE.md (full visual redesign prompt)

### Phase 2 - Antigravity Image Generation (~5-8 min, resumable)
  Tell Antigravity: Press image-manifest.json help me generate all images from #1
  - Reads image-manifest.json for each image spec (prompt, style, dimensions)
  - Reads image-progress.json to skip already-done images (resume support)
  - Calls generate_image for each pending image
  - Saves to generated-images/ folder on local disk
  - Updates image-progress.json after each image
  - Waits 7 seconds between images (rate limit)
  Resume: just say continue generating images - picks up from last done

### Phase 3 - upload-images.ts (~30 sec)
  npx tsx scripts/industry-init/upload-images.ts
  - Reads all files in generated-images/
  - Uploads each to Cloudflare R2
  - Creates mediaAssets DB record
  - Links URL to product / category / blog / pageModule record
  - Frontend displays real images immediately after reload
---

## What Gemini Generates

| Content | Count | Details |
|---|---|---|
| Product categories | 5 (configurable) | nameEn, nameCn, slug, SEO desc, featured flag |
| Products | 10 (configurable) | Full copy, specs, SEO title/desc, category link |
| Blog posts | 3 (configurable) | Full HTML (500-700 words), title, excerpt, tags |
| FAQ items | 8 (configurable) | Question + answer pairs |
| Page modules | ~8 | Hero, Strengths, Trust, Process, About, Contact |
| Image prompts | 15-25 | Per image: style, dimensions, detailed Midjourney-style prompt |
| Frontend guide | 1 | Full visual redesign prompt for Antigravity |

---

## File Structure

  scripts/industry-init/
    run.ts                     Phase 1 main entry
    upload-images.ts           Phase 3 upload script
    types.ts                   TypeScript interfaces
    .gitignore                 excludes all generated files
    configs/
      _template.ts             blank template
      ecommerce.ts             example config
    lib/
      gemini.ts                Gemini API wrapper
      generate.ts              all AI generation functions
      db-seed.ts               Drizzle DB insert operations
      r2.ts                    R2 upload helper
      progress.ts              image resume tracker
      validate-env.ts          ENV checker
    generated-images/          Phase 2 output (git-ignored)
    image-manifest.json        Phase 1 output (git-ignored)
    image-progress.json        Phase 2 output (git-ignored)
    output/
      FRONTEND_ADAPTATION_GUIDE.md  AI visual redesign prompt

---

## Troubleshooting

  DATABASE_URL not set -> check .env.local is in project root
  Gemini returns bad JSON -> retry the script, it happens rarely
  Images not showing -> check CLOUDFLARE_R2_PUBLIC_URL and R2 public access
  DB insert fails -> run: npx drizzle-kit push to sync schema
  Phase 2 starts from #1 again -> check image-progress.json exists

---

## Total Time from Blank Repo to Production

  Phase 1 (text content): ~2 minutes
  Phase 2 (image gen):    ~5-8 minutes
  Phase 3 (upload):       ~30 seconds
  Frontend adaptation:    ~10 minutes (AI agent)
  TOTAL:                  ~20-25 minutes