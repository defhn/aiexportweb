# 全站模板一致性审计报告

## 审计目标

本报告用于检查当前多模板系统是否已经做到“全站页面类型 1:1”，并验证每个模板是否都能在以下维度保持行业一致性：

- 页面结构一致，但视觉与文案可按行业定制
- 首页、产品页、分类页、博客页、联系页、询盘页等都应具备模板感知能力
- 避免出现“首页是某行业，产品页却还是 CNC / 工业制造风格”的串味问题
- 种子数据需与模板行业保持一致，包括分类、产品、博客、站点信息与 CTA 语气

## 当前结论

当前系统已经在“首页模板化”方面取得较大进展，但**还没有完成真正的全站 1:1 模板化**。

换句话说：

- `src/templates/template-XX/home-page.tsx` 已经在明显行业化
- 但 `src/app/(public)/products/*`、`src/app/(public)/blog/*`、`src/app/(public)/contact/page.tsx` 等共享页面仍有较强的固定语境
- 因此，如果现在直接给客户看整站，仍有可能出现“首页行业正确，但其他页面串回默认工业/CNC 语境”的问题

## 审计范围

### 已检查页面

- `src/app/(public)/products/page.tsx`
- `src/app/(public)/products/[categorySlug]/page.tsx`
- `src/app/(public)/products/[categorySlug]/[productSlug]/page.tsx`
- `src/app/(public)/page.tsx`
- 现有模板入口与首页实现
- `src/db/seed/packs/*`
- `src/templates/index.ts`

### 已识别但尚未逐文件复核的页面

以下页面大概率也需要模板感知，但本次报告先按架构层面列出风险：

- `src/app/(public)/blog/page.tsx`
- `src/app/(public)/blog/[slug]/page.tsx`
- `src/app/(public)/about/page.tsx`
- `src/app/(public)/contact/page.tsx`
- `src/app/(public)/request-quote/page.tsx`
- `src/app/(public)/capabilities/page.tsx`
- `src/app/(public)/privacy-policy/page.tsx`
- `src/app/(public)/terms/page.tsx`

## 审计结论总览

### 已基本完成模板化

- `src/templates/template-01` ~ `src/templates/template-12`
  - 首页已具备明显行业差异
  - `template-11` / `template-12` 已补齐
  - `template-03` ~ `template-09` 已增强至接近销售型首页

### 仍然存在全站串味风险

- 产品列表页仍是固定工业/CNC 语境
- 分类页仍是固定工业/CNC 语境
- 产品详情页仍以固定工业 UI 和术语为主
- 博客、关于、联系、询盘页大概率仍未完全模板化
- 共享组件中存在不少默认文案和视觉写死点

## 重点问题清单

### 1. 产品列表页固定了 CNC 风格

文件：`src/app/(public)/products/page.tsx`

#### 问题点

- Hero 标题使用“Explore Our Manufacturing Capabilities”这类通用工业表达
- 主视觉采用深色石材/蓝色科技感，默认偏 CNC 工业风
- 产品页 CTA 与文案未根据模板行业切换
- 不同模板访问时，页面仍像同一套工业站

#### 影响

- 医疗模板打开产品列表页时不够像医疗
- 礼品、家居、电子模板进入后会显得风格错位
- 客户能明显看出“页面不是同一套行业系统”

### 2. 分类页仍是通用工业模板

文件：`src/app/(public)/products/[categorySlug]/page.tsx`

#### 问题点

- 页面标题和描述是通用的“Category Collection / high-precision components”语境
- 底部支持区域仍是通用工程询盘口吻
- 没有接入模板行业名称、色彩、行业 CTA 语气

#### 影响

- 行业切换后，分类页看起来仍是默认工业模板
- 不符合“全站 1:1”的目标

### 3. 产品详情页功能完整，但视觉和内容仍偏固定

文件：`src/app/(public)/products/[categorySlug]/[productSlug]/page.tsx`

#### 问题点

- 页面整体为固定白底/石材/蓝色风格
- Breadcrumb、询盘表单、相关产品、技术区块、PDF 下载按钮均使用统一默认风格
- 详情页没有读取模板主题（颜色、行业描述、行业术语）
- 虽然功能丰富，但行业感不够强

#### 影响

- 医疗/电子/礼品/家居等模板的详情页会“回到工业站语境”
- 是目前最容易被客户察觉的串味区域之一

### 4. 共享组件需要主题化，而不是只做结构复用

潜在受影响组件包括：

- `CategoryGrid`
- `ProductCard`
- `InquiryForm`
- `SpecTable`
- `SiteHeader`
- `SiteFooter`
- `LatestInsights`
- `ProductFaq`
- `HeroSection`
- `FactoryEquipment`
- `QualityCertifications`
- `StrengthsSection`

#### 问题点

这些组件可能在结构上是复用的，但如果不支持主题参数，就会默认泄露 CNC 风格的：

- 主色
- 文案语气
- 图标语义
- 默认标签
- 默认 CTA

## 全站页面类型审计结论

### A. 必须优先模板化

1. `src/app/(public)/products/page.tsx`
2. `src/app/(public)/products/[categorySlug]/page.tsx`
3. `src/app/(public)/products/[categorySlug]/[productSlug]/page.tsx`

这是“客户最容易直接看到”的三类页面。

### B. 应尽快模板化

4. `src/app/(public)/blog/page.tsx`
5. `src/app/(public)/blog/[slug]/page.tsx`
6. `src/app/(public)/about/page.tsx`
7. `src/app/(public)/contact/page.tsx`
8. `src/app/(public)/request-quote/page.tsx`
9. `src/app/(public)/capabilities/page.tsx`

### C. 可共享，但必须主题化

10. 所有产品、分类、询盘、内容卡片组件
11. Header / Footer
12. 表单文案
13. 默认 JSON-LD 文案
14. 页面标题与 meta 描述生成逻辑

## 种子数据审计结论

### 已较完整的部分

- 每个模板都有独立的 `seed pack`
- `template-11`、`template-12` 已新增对应 seed pack
- 各行业的站点信息、分类、产品、博客主题已经开始行业化

### 仍需继续完善的部分

- 某些模板的产品图片、FAQ、博客主题可能仍不够行业化
- 部分行业文案仍偏“通用工业说明”
- 某些产品名称和分类名需要进一步符合客户实际行业习惯

## 整改建议

### 第一阶段：优先修复产品相关公共页面

目标：彻底解决“首页对了，产品页还是 CNC 风格”的问题。

建议改造：

- 让产品列表页读取当前模板主题
- 让分类页使用模板行业文案和颜色
- 让产品详情页支持模板化布局、按钮、标签和默认文案

### 第二阶段：博客 / 关于 / 联系 / 询盘页模板化

目标：让客户从任意页面进入都能感知行业一致性。

### 第三阶段：共享组件主题参数化

建议给共享组件增加统一主题输入，例如：

- `themeName`
- `accentColor`
- `industryLabel`
- `ctaCopy`
- `surfaceVariant`

这样同一套结构可以根据行业产生不同视觉与语言。

### 第四阶段：补齐模板级数据映射

建议建立模板到 seed pack 的自动映射，使预览与数据始终一致。

## 当前最容易出问题的地方

如果现在直接交付给客户，最容易暴露问题的是：

1. `/products`
2. `/products/[categorySlug]`
3. `/products/[categorySlug]/[productSlug]`
4. `/blog/*`
5. `/contact`
6. `/request-quote`

因为这些页面还没有跟模板视觉和文案完全绑定。

## 结论

当前系统的多模板能力已经具备基础，但还没有完成你真正要求的目标：

> 所有模板在全站页面类型上都要 1:1，且每个行业的 UI、文案和种子数据都必须保持行业一致，不能出现首页是医疗、产品页还是 CNC 风格的串味问题。

下一步最重要的工作，不是继续只补首页，而是把**共享公共页面和共享组件模板化**，先修复产品页链路，再扩展到博客和联系页。
