# iGrowSpike RAG 知识库系统 — 实战操作全指南

> **RAG = Retrieval-Augmented Generation（检索增强生成）**
> 简单说：先把你的企业知识存入向量数据库，AI 生成内容时先检索相关片段，再基于真实知识库回答，而不是凭空"幻觉"。

---

## 目录

1. [系统架构总览](#1-系统架构总览)
2. [支持的摄入方式](#2-支持的摄入方式)
3. [操作流程：文件上传](#3-操作流程文件上传)
4. [操作流程：URL 单页抓取](#4-操作流程url-单页抓取)
5. [操作流程：纯文本录入](#5-操作流程纯文本录入)
6. [操作流程：全站爬取（Full-Site Crawl）](#6-操作流程全站爬取full-site-crawl)
7. [三级瀑布爬取策略（核心）](#7-三级瀑布爬取策略核心)
8. [图片 OCR：Gemini Vision 解析](#8-图片-ocrgemini-vision-解析)
9. [语义检索：AI 生成时如何调用 RAG](#9-语义检索ai-生成时如何调用-rag)
10. [多租户隔离安全机制](#10-多租户隔离安全机制)
11. [配额与套餐限制](#11-配额与套餐限制)
12. [数据同步：增量 Sync Now](#12-数据同步增量-sync-now)
13. [BYOK Firecrawl Key（自带密钥）](#13-byok-firecrawl-key自带密钥)
14. [常见问题 FAQ](#14-常见问题-faq)

---

## 1. 系统架构总览

```
用户上传内容
     │
     ▼
┌─────────────────────────────────────────────────────┐
│              RAG Controller (NestJS)                │
│  – 权限检查（Clerk Auth）                            │
│  – 套餐配额门控（plan-limits）                        │
│  – 多格式解析分发                                    │
└──────────────────┬──────────────────────────────────┘
                   │
     ┌─────────────┼────────────────┐
     │             │                │
     ▼             ▼                ▼
 文件解析      URL 抓取          图片 OCR
(pdf-parse,  (Firecrawl +      (Gemini 2.5
 mammoth,     axios 降级)        Flash Vision)
 xlsx)
     │             │                │
     └─────────────┴────────────────┘
                   │
                   ▼
        纯净 Markdown 文本（"洗髓"）
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│        Google Vertex AI Discovery Engine            │
│  – 文档存储 + 自动向量化（Embedding）                 │
│  – 语义搜索（Semantic Search）                       │
│  – 多租户过滤（Document ID Filter）                  │
└─────────────────────────────────────────────────────┘
                   │
                   ▼
        Prisma (PostgreSQL / Neon)
        – KnowledgeSource 状态跟踪
        – 多租户项目隔离记录
```

**技术选型说明：**

| 组件 | 技术 | 作用 |
|------|------|------|
| 后端框架 | NestJS | API 路由、权限守卫 |
| 向量数据库 | Google Vertex AI Discovery Engine | 文档向量化 + 语义检索 |
| 页面抓取 | Firecrawl（三级降级） | 将网页转为 Markdown |
| 图片解析 | Gemini 2.5 Flash Vision | 从图片提取结构化文本 |
| 数据库 | PostgreSQL (Neon) via Prisma | 知识源状态记录 |
| 认证 | Clerk | 多租户用户隔离 |

---

## 2. 支持的摄入方式

| 方式 | 支持格式 | 最小套餐 | 说明 |
|------|----------|----------|------|
| 📄 文件上传 | PDF, DOCX, XLSX, TXT, MD | Starter | 自动解析为纯文本 |
| 🖼️ 图片上传 | PNG, JPG, JPEG, WEBP | Pro | Gemini OCR 提取文字 |
| 🔗 URL 单页 | 任意公开网页 | Starter | Firecrawl 抓取正文 |
| ✏️ 纯文本 | 任意文本内容 | Free | 直接录入 Markdown |
| 🌐 全站爬取 | 整个网站 | Pro | 三级瀑布策略，后台异步 |

---

## 3. 操作流程：文件上传

### 操作步骤

1. 进入 **Workspace → Knowledge** 标签页
2. 选择 **File** 模式（默认）
3. 点击或拖拽文件到上传区域
4. 等待进度条完成，页面出现绿色 "Indexed" 徽章

### 后台处理逻辑

```
用户上传文件
     │
     ├── PDF → pdf-parse 提取纯文本
     │         ↓ 如果解析失败
     │         → Gemini 2.5 Flash 兜底 OCR
     │
     ├── DOCX → mammoth.extractRawText()
     │
     ├── XLSX / CSV → xlsx.utils.sheet_to_csv()
     │              （每个 Sheet 单独提取）
     │
     ├── PNG/JPG → Gemini Vision API（扣月度 OCR 额度）
     │
     └── TXT / MD → 直接 UTF-8 读取
                   │
                   ▼
         "洗髓"：所有格式最终统一为 text/plain 或 text/markdown
                   │
                   ▼
         上传到 Vertex AI Discovery Engine
         存入 Prisma KnowledgeSource（status: indexing → ingested）
```

> **为什么要"洗髓"？**
> Google Vertex AI Discovery Engine 对直传文件有 1MB 限制，且格式兼容性差。
> 系统会先把 PDF/DOCX/XLSX 转为纯文本，体积缩小 90%+，规避 API 限制，同时提升检索精度。

### 实际示例

**场景：** 上传一份 50 页的公司产品手册（PDF）

```
原始文件：product-manual.pdf（8.3 MB）
  ↓ pdf-parse
提取文本：product-manual.txt（约 85 KB）
  ↓ 压缩率 ~99%
上传到 Vertex AI → 自动 Embedding 向量化
状态变为：✅ Indexed
```

---

## 4. 操作流程：URL 单页抓取

### 操作步骤

1. 切换到 **URL** 模式
2. 粘贴目标网页 URL（例如：`https://yoursite.com/about`）
3. 可选填写自定义标题
4. 点击 **Scrape & Ingest**

### 后台处理逻辑

```
POST /rag/ingest { sourceUrl: "https://..." }
     │
     ▼
Firecrawl.scrapeUrl() 抓取页面
（配置：waitFor: 5000ms，去掉 nav/header/footer/sidebar）
     │
     ▼
返回结构化 Markdown 正文
     │
     ▼
Vertex AI 摄入
     │
     ▼
KnowledgeSource 记录状态 → ingested
```

**Firecrawl 抓取配置（代码中实际配置）：**

```javascript
const SCRAPE_OPTIONS = {
  formats: ['markdown'],
  onlyMainContent: false,   // 保留更多内容，防止误删正文
  excludeTags: [
    'nav', 'header', 'footer',
    '.nav', '.navbar', '.sidebar', '.menu',
    '.cookie-banner', '.ad'
  ],
  waitFor: 5000,            // 等待 SPA/React 渲染完成
  removeBase64Images: true, // 防止 base64 图片撑爆 Token
};
```

---

## 5. 操作流程：纯文本录入

### 适用场景

- 手动粘贴一段产品说明
- 录入销售话术、FAQ 问答
- 粘贴竞品分析报告
- 录入自定义政策文档

### 操作步骤

1. 切换到 **Text** 模式
2. 填写标题（可选）
3. 在文本框粘贴内容（支持 Markdown）
4. 点击 **Ingest Text**

---

## 6. 操作流程：全站爬取（Full-Site Crawl）

> 适用于把整个公司官网、产品文档站、博客全部摄入知识库。

### 操作步骤

1. 切换到 **Full Site** 模式
2. 填写目标域名（如：`https://yourcompany.com`）
3. 设置参数：
   - **Max Crawl Pages（Layer 1）**：最多发现的 URL 数量（默认100）
   - **Max Ingest Pages（Layer 2）**：最多实际摄入的页面数（默认50）
4. 点击 **Start Full-Site Crawl**
5. 观察实时进度（每3秒轮询一次后台状态）

### 自动过滤的页面类型（黑名单）

系统内置黑名单，以下页面**自动跳过，不会被摄入**：

| 类型 | 路径示例 |
|------|----------|
| 认证页 | `/login` `/signup` `/register` `/auth` `/oauth` |
| 管理后台 | `/admin/*` `/dashboard/*` `/settings` `/billing` |
| API 内部路由 | `/api/*` `/_next/*` `/_nuxt/*` |
| 法律页面 | `/privacy` `/terms` `/tos` `/legal` `/gdpr` |
| 搜索页 | `/search?*` |
| 空白/无效页 | 词数 < 20 的页面 |
| 认证检测页 | 含大量登录关键词且词数 < 200 |

### 异步任务机制

全站爬取是**后台异步任务**，不会阻塞 UI：

```
用户点击 Start
  ↓
服务器创建 CrawlJob（内存 Map 存储）
  ↓
立即返回 jobId 给前端
  ↓
后台并发执行三级瀑布爬取（不 await）
  ↓
前端每 3 秒轮询 GET /rag/crawl-job/:jobId
  ↓
实时显示 crawled / ingested / skipped 计数
  ↓
status=done → 提示 "Crawl complete!"
```

---

## 7. 三级瀑布爬取策略（核心）

这是系统最重要的工程设计之一，保证在不同网站类型下都能成功获取内容：

```
┌────────────────────────────────────────────────────┐
│ Stage 1: Map API（URL 发现阶段）                     │
│ Firecrawl.mapUrl() → 发现站点所有 URL               │
│  ↓ 成功 → 进入 Stage 2                              │
│  ↓ 失败 → 直接跳 Stage 3                            │
└────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────┐
│ Stage 2: Batch Scrape（批量高效抓取）                │
│ 1. 过滤黑名单 URL                                   │
│ 2. 截取前 maxPages 条                               │
│ 3. Firecrawl.batchScrapeUrls() 并发抓取             │
│ 4. 过滤内容质量（去空页、认证页）                    │
│  ↓ 成功 → 返回有效页面 ✅                            │
│  ↓ 失败 → 进入 Stage 3                              │
└────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────┐
│ Stage 3: Traditional Crawl（传统降级）               │
│ Firecrawl.crawlUrl() 逐页爬取                       │
│（兼容 WordPress 等遗留 CMS 站点）                    │
└────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────┐
│ 最终降级: axios 直接抓取（无 Firecrawl 时）          │
│ 提取 HTML → 去掉 script/style/head → 纯文本         │
└────────────────────────────────────────────────────┘
```

**为什么要三级瀑布？**

| 网站类型 | 最优策略 |
|----------|----------|
| Next.js / React SPA | Map + Batch（Stage 1+2） |
| 传统 WordPress 站 | Traditional Crawl（Stage 3） |
| 小型静态网站 | 任何 Stage 都可以 |
| 无 Firecrawl Key | axios 直接抓取（降级） |

**全站爬取结果合并机制：**

多个页面不是分别存入，而是**合并成一个大 Markdown 文档**再推送到 Vertex AI：

```markdown
# Full Site Crawl: https://example.com
> Crawled at: 2025-01-15T10:30:00.000Z

---

## Page 1: About Us
> Source: https://example.com/about

[正文内容...]

---

## Page 2: Products
> Source: https://example.com/products

[正文内容...]
```

---

## 8. 图片 OCR：Gemini Vision 解析

> **Pro 及以上套餐专属功能**，每月有额度限制（默认1000次/月）。

### 解析规则（实际 Prompt 逻辑）

Gemini 2.5 Flash 会根据图片类型自动选择最佳解析策略：

| 图片类型 | 解析策略 |
|----------|----------|
| 社交媒体截图 | 提取文案 + 描述视觉结构和情绪锚点 |
| 读书笔记 / 手写 | 全量 OCR + Markdown 层级重构 |
| 仪表盘 / 数据图 | 描述数据走势和极值点 |
| 思维导图 | 还原分支层级为 Markdown 嵌套 |
| 分镜脚本 | 识别脚本结构和关键帧信息 |
| 普通照片 | 描述主体物体 + 色调 + 残留文字 |

### 降级机制

```
Gemini 2.5 Flash
  ↓ 如果模型在当前 GCP 区域不可用
Gemini 1.5 Flash（自动降级）
```

---

## 9. 语义检索：AI 生成时如何调用 RAG

当 AI 生成内容时，系统自动执行以下流程：

```
用户请求 AI 生成内容（如：写一篇博客）
         │
         ▼
提取关键查询词（从用户意图中）
         │
         ▼
RagService.searchKnowledgeBase(projectId, query, pageSize=5)
         │
         ▼
1. 从 Prisma 查出该项目所有 status='ingested' 的文档 ID
2. 构建 Vertex AI 过滤器：
   id: ANY("doc_1", "doc_2", "doc_3", ...)
3. 调用 Vertex AI SearchService（语义向量检索）
4. 提取 Snippets + ExtractiveAnswers 片段
         │
         ▼
返回最相关的 3-5 条文本片段（上下文）
         │
         ▼
注入 AI Prompt（作为 System Context）
         │
         ▼
AI 基于真实知识库内容生成结果
```

**检索配置：**

```typescript
contentSearchSpec: {
  snippetSpec: { returnSnippet: true },
  extractiveContentSpec: {
    maxExtractiveAnswerCount: 2   // 每个文档最多取 2 段精华
  }
}
```

---

### 🎬 完整实战案例：用 iGrowSpike 给护肤品独立站生成爆款博客

> **背景：** 你在 iGrowSpike 上管理一个护肤品牌项目 **"GlowLab"**。
> 你已经通过知识库上传了以下内容：
> - `product-catalog.pdf`（产品成分说明书，30页）
> - `brand-voice.md`（品牌调性手册：极简主义，科学导向，拒绝过度包装）
> - URL 抓取了 `https://glowlab.com/ingredients`（成分科普页）

**用户在 Workbench 发出指令：**

```
写一篇关于烟酰胺对皮肤屏障修复作用的博客，
要突出 GlowLab 专利配方的优势，语气专业但不晦涩。
```

---

**RAG 在后台做了什么（第1步 → 第6步）：**

```
第1步：提取查询词
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI 服务从用户指令中提炼出检索关键词：
  query = "烟酰胺 皮肤屏障修复 GlowLab 配方"

第2步：查数据库，锁定该项目的合法文档
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prisma 查询：
  WHERE projectId = "glowlab_proj_001"
  AND status = "ingested"

结果：找到 3 个文档 ID：
  doc_a1b2c3  ← product-catalog.pdf
  doc_d4e5f6  ← brand-voice.md
  doc_g7h8i9  ← glowlab.com/ingredients 页面

第3步：构建 Vertex AI 过滤器（多租户安全屏障）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
filter = 'id: ANY("doc_a1b2c3", "doc_d4e5f6", "doc_g7h8i9")'
（确保永远不会检索到其他品牌的内容）

第4步：Vertex AI 语义向量检索
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
在这 3 个文档的向量空间中，
找出语义最接近"烟酰胺 皮肤屏障"的段落

第5步：返回最相关的 5 个片段（Snippets）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
片段1（来自 product-catalog.pdf）：
  "GlowLab 烟酰胺精华采用第三代稳定化技术，
   浓度精准锁定在 5%，避免超过 10% 引发的潮红反应..."

片段2（来自 product-catalog.pdf）：
  "临床实验数据显示，连续使用 28 天后，
   受试者皮肤屏障 TEWL 值（经皮水分散失）平均下降 34%..."

片段3（来自 glowlab.com/ingredients）：
  "烟酰胺（Vitamin B3）通过促进神经酰胺合成，
   直接强化细胞间脂质层的完整性..."

片段4（来自 brand-voice.md）：
  "GlowLab 的品牌承诺：每一个成分都有文献支撑，
   拒绝任何未经验证的营销话术..."

片段5（来自 glowlab.com/ingredients）：
  "与市售同类产品不同，GlowLab 专利配方加入了
   海藻糖作为屏障协同因子，增强锁水效果..."

第6步：将 5个片段 注入 AI Prompt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
System Context：
  [以上5个片段作为背景知识]

User Instruction：
  写一篇关于烟酰胺对皮肤屏障修复作用的博客...

AI 生成输出 ↓
```

**最终 AI 生成的博客（节选）：**

> *"为什么你的皮肤屏障一直修不好？可能差在这 5% 上*
>
> 很多人知道烟酰胺好，但不知道浓度是个精密游戏。低于 3% 效果微弱，超过 10% 反而刺激泛红。GlowLab 的研发团队在第三代稳定化技术上攻关了整整两年，才把浓度精准锁定在黄金区间的 5%。
>
> 数据不说谎：在我们的 28 天临床实验中，受试者皮肤的 TEWL 值（经皮水分散失，衡量屏障完整性的核心指标）平均下降了 34%。配合专利配方中的海藻糖协同因子，屏障修复效率比市售同类产品高出 40%..."*

---

**对比：没有知识库时 AI 会怎么写？**

```
❌ 没有 RAG（AI 凭空生成）：
  "烟酰胺是一种有效的皮肤成分，能够改善皮肤状态，
   建议选择含有烟酰胺的产品..."
  → 完全通用，毫无品牌特色，数据空洞

✅ 有 RAG（基于知识库生成）：
  → 自动引用"5% 黄金浓度"、"TEWL 下降 34%"、
    "海藻糖协同因子"等 GlowLab 独有信息
  → 内容精准、有数据支撑、符合品牌调性
```

> **💡 核心结论：** RAG 让 AI 不再是一个"万能但空洞"的写手，而是变成一个**深度熟悉你品牌的专属内容专家**。知识库越扎实，生成内容的竞争壁垒越高。

---

## 10. 多租户隔离安全机制

**核心安全设计：每个项目的知识库数据完全隔离，无法互相访问。**

```typescript
// 安全屏障：只搜索属于该 Project 且已成功索引的文档
const validSources = await this.prisma.knowledgeSource.findMany({
  where: {
    projectId: tenantProjectId,   // ← 强制项目隔离
    status: 'ingested',
  },
});

// 将合法 Document ID 转为 Vertex AI 过滤条件
const filter = `id: ANY(${docIds.map(id => `"${id}"`).join(', ')})`;
```

即使在同一个 Google Cloud Data Store 中，不同租户的文档也通过 Document ID 过滤器在查询层面隔离，**A 项目永远不可能搜到 B 项目的知识库内容**。

---

## 11. 配额与套餐限制

| 功能 | Free | Starter | Pro | Agency |
|------|------|---------|-----|--------|
| 文档数量上限 | 10 | 100 | 500 | ∞ |
| 单文件大小 | 5 MB | 20 MB | 50 MB | 100 MB |
| 文件上传 | ❌ | ✅ | ✅ | ✅ |
| URL 抓取 | ❌ | ✅ | ✅ | ✅ |
| 全站爬取 | ❌ | ❌ | ✅ | ✅ |
| 图片 OCR | ❌ | ❌ | 1000次/月 | 无限 |
| 爬取页数/月 | — | 500 | 2000 | BYOK 无限 |
| BYOK Key | ❌ | ❌ | ❌ | ✅ |

**配额说明：**
- **文档数量**：全站爬取的结果**不计入**文档数量（由爬取页数额度单独控制）
- **爬取页数**：每月重置，有 BYOK Key 则豁免月度限制
- **图片 OCR**：每次上传图片消耗1次额度，每月重置

---

## 12. 数据同步：增量 Sync Now

已摄入的 URL 来源或全站爬取，可以**一键同步最新内容**：

```
点击 Sync Now
  │
  ├── isFullCrawl=true → 重新执行三级瀑布爬取全站
  │                    → 替换 Vertex AI 中的原文档（updateDocument）
  │
  └── isFullCrawl=false（URL 单页）→ 重新 Firecrawl 抓取该 URL
                                   → 替换 Vertex AI 中的原文档

更新 lastSyncedAt 时间戳
状态恢复为 ingested
```

---

## 13. BYOK Firecrawl Key（自带密钥）

**Agency 套餐专属功能：** 接入自己的 Firecrawl API Key，彻底解除月度爬取页数限制。

**配置方式：**

1. 前往 [firecrawl.dev](https://firecrawl.dev) 获取你的 API Key
2. 进入 **Settings → Integrations**
3. 填入 Firecrawl API Key 并保存

**降级逻辑：**

```
BYOK Key 存在 → 使用 BYOK Key（无页数限制）
     ↓ 不存在
平台默认 Key → 走月度配额限制
     ↓ 也不存在
axios 直接抓取（降级模式）
```

---

## 14. 常见问题 FAQ

### Q: 上传 PDF 失败，提示 "encrypted or corrupted"？

PDF 有密码保护时，`pdf-parse` 无法解析。系统会自动降级到 Gemini 2.5 Flash 视觉解析，但若 PDF 是低分辨率扫描件，可能识别率不高。**建议**用 Adobe Acrobat 导出为 Word 后上传 DOCX。

### Q: 全站爬取某些页面没有被摄入？

系统内置黑名单会过滤认证页、管理后台、API 路由、法律页面。如果正常内容页被误过滤，检查路径是否匹配了黑名单（如 `/legal-services` 会被 `/legal` 规则误杀）。

### Q: 知识库内容和 AI 生成有什么关系？

AI 每次生成内容时，会先用查询词在知识库中语义搜索，取最相关的 3-5 个片段作为上下文，然后才生成内容。知识库内容越丰富、越精准，AI 输出质量越高。

### Q: 图片上传消耗 OCR 额度后，提取内容很少？

对于低分辨率图片、纯装饰性图片或无文字的照片，提取内容会较少。建议只上传包含文字信息的截图、笔记类图片。

### Q: 全站爬取很慢怎么办？

爬取速度受目标网站响应速度和页面数量影响（SPA 需等 5 秒 JS 渲染）。建议将 Max Crawl Pages 控制在 50-100 以内，超大站点可分批爬取。

---

*文档基于 `server/src/rag/rag.service.ts` 和 `server/src/rag/rag.controller.ts` 实际代码生成*
*最后更新：2026-04-13*
