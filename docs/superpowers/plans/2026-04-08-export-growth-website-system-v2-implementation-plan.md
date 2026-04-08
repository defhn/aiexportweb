# Export Growth Website System V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 V1 外贸获客网站系统上补齐 V2 的 P0、P1、P2 功能，让后台具备更完整的运营、询盘、AI 辅助和报价能力，并保持可直接部署与可复制交付。

**Architecture:** 继续沿用 `Next.js App Router + Server Actions + Neon/Drizzle + R2` 的单体应用结构。V2 优先在现有数据模型上渐进扩展，统一通过 `features/*` 目录承载查询与写操作；优先选择服务端聚合查询、最小可用的 AI 接口和可直接点后台验证的界面。

**Tech Stack:** Next.js, React, TypeScript, Drizzle ORM, Neon, Cloudflare R2, Brevo, Turnstile, Vitest, Playwright

---

### Task 1: 规划 V2 数据模型和迁移

**Files:**
- Modify: `src/db/schema.ts`
- Create: `drizzle/0002_export_growth_v2.sql`
- Modify: `src/db/seed/index.ts`
- Test: `tests/unit/inquiries.test.ts`

- [ ] 为询盘、资料库、回复模板、报价、浏览日志补齐新增字段和表结构
- [ ] 生成并检查迁移 SQL，确保兼容当前 V1 数据
- [ ] 更新种子数据，让演示数据可覆盖新增字段默认值
- [ ] 补一组 unit test，验证核心 draft/build 函数能输出正确字段

### Task 2: 实现 P0 仪表盘和国家标准化

**Files:**
- Create: `src/features/dashboard/queries.ts`
- Create: `src/lib/country.ts`
- Modify: `src/features/inquiries/actions.ts`
- Modify: `src/features/inquiries/queries.ts`
- Modify: `src/app/admin/(protected)/page.tsx`
- Test: `tests/unit/dashboard.test.ts`

- [ ] 新增国家标准化工具，统一处理 `US/USA/United States` 这类输入
- [ ] 在询盘创建时写入 `countryCode/countryGroup/sourceType`
- [ ] 增加今日、本周、本月、未处理、7 天趋势、热门产品、国家分布查询
- [ ] 升级后台首页，展示统计卡片、趋势列表、热门产品、国家来源
- [ ] 先写 dashboard 查询测试，再补实现并跑通

### Task 3: 实现 P0 产品批量导入和图片替换

**Files:**
- Create: `src/features/products/import.ts`
- Modify: `src/features/products/actions.ts`
- Modify: `src/features/products/queries.ts`
- Modify: `src/components/admin/product-editor-form.tsx`
- Create: `src/app/admin/(protected)/products/import/page.tsx`
- Test: `tests/unit/products-import.test.ts`
- Test: `tests/e2e/admin-product-import.spec.ts`

- [ ] 先为 CSV 解析、字段映射、分类匹配写测试
- [ ] 实现 CSV 导入逻辑和导入页
- [ ] 在产品编辑页图库区域增加单图替换交互
- [ ] 替换时沿用现有上传与素材绑定，不直接删除旧图
- [ ] 验证新产品导入后能在产品列表和前台详情页看到

### Task 4: 实现 P0 询盘附件限制和真实 Turnstile

**Files:**
- Modify: `src/app/api/inquiries/route.ts`
- Modify: `src/components/public/inquiry-form.tsx`
- Modify: `src/lib/turnstile.ts`
- Create: `src/components/public/turnstile-box.tsx`
- Modify: `src/app/admin/(protected)/inquiries/page.tsx`
- Test: `tests/unit/inquiries.test.ts`
- Test: `tests/e2e/public-inquiry-form.spec.ts`

- [ ] 先补附件大小、类型、数量校验测试
- [ ] 实现后端白名单校验与友好错误提示
- [ ] 接入真实 Turnstile widget，开发态保留可测试回退
- [ ] 在后台询盘列表中显示附件下载入口
- [ ] 跑通公开表单提交和后台查看流程

### Task 5: 实现 P1 AI 产品文案生成

**Files:**
- Create: `src/lib/ai.ts`
- Create: `src/app/api/ai/generate-product-copy/route.ts`
- Modify: `src/env.ts`
- Modify: `src/components/admin/product-editor-form.tsx`
- Test: `tests/unit/ai-product-copy.test.ts`

- [ ] 为 prompt 组装和结果解析写测试
- [ ] 新增统一 AI 调用层，优先支持显式 API key，开发态提供 deterministic fallback
- [ ] 暴露产品英文标题、描述、SEO 的生成接口
- [ ] 在产品编辑页加入生成按钮和结果回填
- [ ] 验证无 AI key 时后台也能安全使用 fallback 返回

### Task 6: 实现 P1 询盘规则分类、详情页和回复模板

**Files:**
- Create: `src/features/inquiries/classification.ts`
- Create: `src/features/reply-templates/actions.ts`
- Create: `src/features/reply-templates/queries.ts`
- Create: `src/app/admin/(protected)/reply-templates/page.tsx`
- Create: `src/app/admin/(protected)/inquiries/[id]/page.tsx`
- Modify: `src/components/admin/sidebar.tsx`
- Test: `tests/unit/inquiry-classification.test.ts`
- Test: `tests/e2e/admin-inquiry-detail.spec.ts`

- [ ] 先为规则分类写测试，覆盖来源页、国家分组、关键词类型
- [ ] 在询盘创建时写入分类字段
- [ ] 新建回复模板表与后台管理页
- [ ] 新建询盘详情页，显示客户信息、产品信息、附件、内部备注、模板插入区
- [ ] 确保后台侧边栏能访问新页面

### Task 7: 实现 P1 AI 辅助回复和资料库增强

**Files:**
- Create: `src/app/api/ai/generate-inquiry-reply/route.ts`
- Modify: `src/app/admin/(protected)/inquiries/[id]/page.tsx`
- Modify: `src/features/media/actions.ts`
- Modify: `src/features/media/queries.ts`
- Modify: `src/app/admin/(protected)/files/page.tsx`
- Test: `tests/unit/ai-inquiry-reply.test.ts`

- [ ] 复用 AI 调用层，先为询盘回复草稿 prompt 写测试
- [ ] 在询盘详情页增加 AI 草稿生成区，但不自动发送
- [ ] 扩展下载文件的分类、语言、描述字段
- [ ] 升级资料库页面，支持搜索、分类筛选、语言筛选
- [ ] 验证文件资料中心与产品绑定仍然可用

### Task 8: 实现 P2 产品浏览日志和热度升级

**Files:**
- Modify: `src/app/(public)/products/[categorySlug]/[productSlug]/page.tsx`
- Create: `src/features/products/views.ts`
- Modify: `src/features/dashboard/queries.ts`
- Test: `tests/unit/product-views.test.ts`

- [ ] 先为浏览日志去重/写入逻辑写测试
- [ ] 在产品详情页写入最小浏览日志
- [ ] 升级仪表盘，展示浏览热度与询盘热度两个榜单
- [ ] 验证公开产品页访问不会阻塞页面渲染

### Task 9: 实现 P2 AI 询盘分类和报价系统

**Files:**
- Create: `src/app/api/ai/classify-inquiry/route.ts`
- Create: `src/features/quotes/actions.ts`
- Create: `src/features/quotes/queries.ts`
- Create: `src/app/admin/(protected)/quotes/page.tsx`
- Create: `src/app/(public)/request-quote/page.tsx`
- Modify: `src/components/admin/sidebar.tsx`
- Test: `tests/unit/quotes.test.ts`
- Test: `tests/e2e/public-quote-request.spec.ts`

- [ ] 在规则分类基础上增加 AI 分类增强接口，允许人工覆写
- [ ] 实现报价申请表和报价条目表
- [ ] 新建前台报价申请页和后台报价列表
- [ ] 支持从报价申请中查看客户、产品、数量和特殊要求
- [ ] 先不做 PDF 真生成，保留结构和后续扩展点

### Task 10: 全量验证、迁移和演示数据回填

**Files:**
- Modify: `.env.example`
- Modify: `README.md`
- Test: `tests/unit/*`
- Test: `tests/e2e/*`

- [ ] 更新环境变量示例，补 AI 配置说明
- [ ] 运行 `npm run db:migrate`
- [ ] 运行 `npm run db:seed -- cnc`
- [ ] 运行 `npm run test`
- [ ] 运行 `npm run test:e2e`
- [ ] 运行 `npm run build`
- [ ] 回写 README 中的 V2 测试入口和后台路径
