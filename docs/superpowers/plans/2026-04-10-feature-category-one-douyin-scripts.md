# Feature Category One Douyin Scripts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the first feature category from the website video title pool into full Douyin scripts using the approved spoken format.

**Architecture:** Use the existing 160-title feature pool as source material, extract category one (`首页与前台展示`), and write a dedicated markdown document with 16 complete scripts. Each script will follow the previously approved structure and spoken-line formatting for later PDF export.

**Tech Stack:** Markdown authoring, local docs workflow

---

### Task 1: Define the source and target files

**Files:**
- Read: `docs/sales/2026-04-10-website-feature-video-title-pool.md`
- Create: `docs/sales/2026-04-10-feature-category-1-douyin-scripts.md`

- [ ] **Step 1: Use category one as the only source scope**

The source section is:

```txt
## 一、首页与前台展示
1-16
```

- [ ] **Step 2: Keep the output separate from the title pool**

The target should be a dedicated script document so later categories can be added without mixing titles and scripts.

### Task 2: Write the 16 approved-format scripts

**Files:**
- Create: `docs/sales/2026-04-10-feature-category-1-douyin-scripts.md`

- [ ] **Step 1: Keep the approved script shell**

Each entry must follow:

```txt
### 选题 N
标题
建议时长：2 分钟到 4 分钟
内容：
```

- [ ] **Step 2: Use the approved spoken formatting**

Each script body must:

```txt
- use one sentence per line
- keep a blank line between spoken lines
- stay in the ~18-22 non-empty line range
- sound like spoken delivery instead of a product spec
```

- [ ] **Step 3: Keep each topic tied to implemented functionality**

The script can be sales-oriented, but it must be grounded in what the site already supports on the homepage and public-facing modules.

### Task 3: Verify the output file

**Files:**
- Verify: `docs/sales/2026-04-10-feature-category-1-douyin-scripts.md`

- [ ] **Step 1: Confirm the file was created**

Run:

```bash
Get-Item docs\sales\2026-04-10-feature-category-1-douyin-scripts.md
```

Expected: file exists with a fresh timestamp.

- [ ] **Step 2: Spot-check the heading structure**

Run:

```bash
Select-String -Path docs\sales\2026-04-10-feature-category-1-douyin-scripts.md -Pattern "^### 选题 "
```

Expected: 16 matches.
