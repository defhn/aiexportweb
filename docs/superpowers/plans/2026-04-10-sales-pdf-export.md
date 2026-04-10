# Sales PDF Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Export the Douyin script markdown as a clean PDF where each article is rendered on its own page without raw Markdown symbols.

**Architecture:** Replace generic Markdown rendering in the existing exporter with a purpose-built parser for the sales script document. The script will extract article blocks from `### 选题 N`, generate structured HTML with print CSS, and export both `.print.html` and `.pdf` through the existing Chromium-based browser automation.

**Tech Stack:** Node.js, Playwright Chromium, filesystem HTML generation

---

### Task 1: Plan the article-oriented exporter

**Files:**
- Modify: `scripts/export-sales-pdf.mjs`
- Output: `docs/sales/2026-04-10-douyin-100-topic-plan.print.html`
- Output: `docs/sales/2026-04-10-douyin-100-topic-plan.pdf`

- [ ] **Step 1: Define the expected markdown structure**

The parser should recognize:

```txt
# Document title
### 选题 N
文章标题
建议时长：...
内容：
正文若干行
外贸询盘没着落，胡总局里帮你破。
```

- [ ] **Step 2: Decide the rendered PDF structure**

Each article page should contain:

```txt
页眉小标签（选题 N）
居中加粗标题
建议时长
正文段落
结尾 CTA
```

- [ ] **Step 3: Keep the export offline**

Do not depend on CDN CSS or browser-side Markdown libraries. Build the final HTML string entirely in Node.js so the export works in the restricted environment.

### Task 2: Implement the custom parser and page template

**Files:**
- Modify: `scripts/export-sales-pdf.mjs`

- [ ] **Step 1: Replace generic Markdown rendering with custom parsing**

Add helpers to:

```js
function parseSalesMarkdown(markdown) {}
function renderDocumentHtml(document) {}
```

- [ ] **Step 2: Generate article-per-page HTML**

Render each article as:

```html
<section class="article-page">
  <div class="topic-label">选题 1</div>
  <h1 class="article-title">...</h1>
  <p class="duration">建议时长：...</p>
  <div class="article-body">
    <p>...</p>
  </div>
  <p class="cta">外贸询盘没着落，胡总局里帮你破。</p>
</section>
```

- [ ] **Step 3: Add print-friendly CSS**

Use print CSS that guarantees:

```css
.article-page { page-break-after: always; break-after: page; }
.article-title { text-align: center; font-weight: 700; }
```

### Task 3: Generate and verify the final export

**Files:**
- Run: `scripts/export-sales-pdf.mjs`
- Verify: `docs/sales/2026-04-10-douyin-100-topic-plan.print.html`
- Verify: `docs/sales/2026-04-10-douyin-100-topic-plan.pdf`

- [ ] **Step 1: Run the exporter**

Run:

```bash
node scripts/export-sales-pdf.mjs docs/sales/2026-04-10-douyin-100-topic-plan.md
```

Expected: the script prints the generated HTML and PDF paths.

- [ ] **Step 2: Verify output files exist**

Run:

```bash
Get-Item docs\sales\2026-04-10-douyin-100-topic-plan.print.html
Get-Item docs\sales\2026-04-10-douyin-100-topic-plan.pdf
```

Expected: both files exist and have a recent write time.

- [ ] **Step 3: Spot-check the generated HTML structure**

Run:

```bash
Select-String -Path docs\sales\2026-04-10-douyin-100-topic-plan.print.html -Pattern "article-page|article-title|topic-label" -CaseSensitive
```

Expected: matching lines confirm the custom template, not raw Markdown headings.
