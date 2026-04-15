# 多模板架构使用指南

## 你现在拥有的结构

```
src/
  app/
    (public)/
      page.tsx     ← 纯数据层，不写 UI，所有模板共用
      layout.tsx   ← 纯布局分发器，不写 UI，所有模板共用
  
  features/        ← 业务功能（询盘/博客/产品/SEO AI）
  lib/             ← 工具函数
  
  templates/       ← 所有模板在这里
    types.ts       ← 模板接口定义（TypeScript 合约）
    index.ts       ← 模板注册表（新增模板在这里加一行）
    
    template-01/   ← 工业 CNC 风格（已完成）
      home-page.tsx
      layout.tsx
      index.ts
    
    template-02/   ← 工业设备风格（已完成）
    template-03/   ← 建材建筑风格（已完成）
    template-04~12/← 预留（待建设）
```

---

## 开发规则（最重要的 3 条）

| 你想做什么 | 改哪里 | 会影响谁 |
|-----------|--------|---------|
| 改功能（询盘逻辑、博客查询） | `src/features/` | 所有已接入模板（目标 12 套）✅ |
| 改 template-01 的 UI | `src/templates/template-01/` | 只有 template-01 ✅ |
| 改 template-02 的 UI | `src/templates/template-02/` | 只有 template-02 ✅ |

---

## 如何新增下一套模板（以 template-04 为例）

### 第 1 步：复制目录
```bash
cp -r src/templates/template-03 src/templates/template-04
```

### 第 2 步：改 UI
打开 `src/templates/template-04/home-page.tsx`，改配色、改布局、改组件。
> ⚠️ 不要改其它模板目录，确保每套模板相互隔离。

### 第 3 步：在注册表里登记
在 `src/templates/index.ts` 里新增并注册：
```ts
import { template04 } from "./template-04";

const TEMPLATE_REGISTRY = {
  "template-01": template01,
  "template-02": template02,
  "template-03": template03,
  "template-04": template04,  // 新增这一行
};
```

### 第 4 步：改环境变量预览
在 `.env.local` 里：
```env
SITE_TEMPLATE=template-04
```
重启 `pnpm dev`，就能看到 template-04 的效果。

---

## 给不同客户部署

### 单仓库，多 Vercel 项目
给每个客户在 Vercel 建一个独立的部署项目，都指向同一个 GitHub 仓库，然后设置不同的环境变量：

| 客户 | Vercel 环境变量 |
|------|---------------|
| ABC 机械厂 | `SITE_TEMPLATE=template-01` |
| XYZ 自动化设备 | `SITE_TEMPLATE=template-02` |
| 888 建材出口 | `SITE_TEMPLATE=template-03` |

这样一套代码，可扩展到 12 个站点。改功能 → 一次提交，所有模板共享。改 UI → 只改对应模板目录。

---

## 环境变量一览

| 变量 | 说明 | 示例值 |
|------|------|--------|
| `SITE_TEMPLATE` | 当前前台模板 ID | `template-01` |
| `SITE_PLAN` | 功能套餐 | `ai_sales` |
| `NEXT_PUBLIC_SITE_URL` | 站点域名 | `https://abc-machinery.com` |

---

## 文件修改红绿灯

🟢 **只改这些 = 只影响当前模板**
- `src/templates/template-XX/home-page.tsx`
- `src/templates/template-XX/layout.tsx`
- `src/templates/template-XX/theme.ts`（如果你创建了）

🔴 **改这些 = 影响所有模板（要小心）**
- `src/features/**`
- `src/lib/**`
- `src/components/shared/**`（如果你放公共底层组件在这里）
- `src/app/(public)/page.tsx`（数据获取逻辑）
- `src/app/(public)/layout.tsx`（布局分发逻辑）
