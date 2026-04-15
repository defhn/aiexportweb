# 域名、Vercel、环境变量配置清单

更新时间：2026-04-15

这份文档回答 4 个问题：

- 你的域名 DNS 要配置哪些记录
- Vercel 里要添加哪些 Domains
- `.env.local` / Vercel Environment Variables 还要检查哪些变量
- 为什么打开 `?site=cnc-demo` 后点导航会跳回主站产品页

## 1. 推荐域名结构

主域名：

```text
aiexportweb.top
www.aiexportweb.top
```

管理后台：

```text
https://aiexportweb.top/admin
```

12 个行业演示子域名：

```text
cnc.aiexportweb.top
equipment.aiexportweb.top
building.aiexportweb.top
energy.aiexportweb.top
medical.aiexportweb.top
hvac.aiexportweb.top
lighting.aiexportweb.top
hardware.aiexportweb.top
furniture.aiexportweb.top
packaging.aiexportweb.top
electronics.aiexportweb.top
gifts.aiexportweb.top
```

未来客户正式域名：

```text
client-domain.com
www.client-domain.com
preview.client-domain.com
```

## 2. 你的域名 DNS 要配置什么

如果域名托管在 Cloudflare、阿里云、腾讯云或其他 DNS 平台，思路一样：让这些域名指向 Vercel。

### 2.1 主域名

在 DNS 里配置：

```text
Type: A
Name: @
Value: 76.76.21.21
```

或者按 Vercel 当前提示配置。如果 Vercel 后台给了不同提示，以 Vercel 后台为准。

### 2.2 www

在 DNS 里配置：

```text
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 2.3 12 个行业子域名

可以一条条配置：

```text
Type: CNAME
Name: cnc
Value: cname.vercel-dns.com

Type: CNAME
Name: equipment
Value: cname.vercel-dns.com

Type: CNAME
Name: building
Value: cname.vercel-dns.com

Type: CNAME
Name: energy
Value: cname.vercel-dns.com

Type: CNAME
Name: medical
Value: cname.vercel-dns.com

Type: CNAME
Name: hvac
Value: cname.vercel-dns.com

Type: CNAME
Name: lighting
Value: cname.vercel-dns.com

Type: CNAME
Name: hardware
Value: cname.vercel-dns.com

Type: CNAME
Name: furniture
Value: cname.vercel-dns.com

Type: CNAME
Name: packaging
Value: cname.vercel-dns.com

Type: CNAME
Name: electronics
Value: cname.vercel-dns.com

Type: CNAME
Name: gifts
Value: cname.vercel-dns.com
```

如果 DNS 平台支持通配符，也可以用一条：

```text
Type: CNAME
Name: *
Value: cname.vercel-dns.com
```

通配符更省事，但正式商用时我更建议重要域名单独配，方便排查。

## 3. Vercel 里要添加哪些 Domains

进入 Vercel 项目：

```text
Project -> Settings -> Domains
```

建议添加这些：

```text
aiexportweb.top
www.aiexportweb.top
cnc.aiexportweb.top
equipment.aiexportweb.top
building.aiexportweb.top
energy.aiexportweb.top
medical.aiexportweb.top
hvac.aiexportweb.top
lighting.aiexportweb.top
hardware.aiexportweb.top
furniture.aiexportweb.top
packaging.aiexportweb.top
electronics.aiexportweb.top
gifts.aiexportweb.top
```

未来客户域名也在这里加：

```text
client-domain.com
www.client-domain.com
```

如果客户要一个预览域名，也可以加：

```text
preview.client-domain.com
```

## 4. 后台 `/admin/sites` 要怎么配

Vercel 和 DNS 只是让域名能打到项目。

真正决定“这个域名属于哪个站点”的，是后台：

```text
https://aiexportweb.top/admin/sites
```

每个站点的 `Domain aliases` 要写入对应域名。

### 4.1 12 个行业站建议配置

| 行业 | slug | Domain aliases |
|---|---|---|
| CNC 精密加工 | `cnc-demo` | `cnc.aiexportweb.top` |
| 工业设备 | `equipment-demo` | `equipment.aiexportweb.top` |
| 建筑建材 | `building-demo` | `building.aiexportweb.top` |
| 能源电力 | `energy-demo` | `energy.aiexportweb.top` |
| 医疗健康 | `medical-demo` | `medical.aiexportweb.top` |
| 流体暖通 HVAC | `hvac-demo` | `hvac.aiexportweb.top` |
| 照明灯具 | `lighting-demo` | `lighting.aiexportweb.top` |
| 五金塑胶 | `hardware-demo` | `hardware.aiexportweb.top` |
| 家具户外 | `furniture-demo` | `furniture.aiexportweb.top` |
| 包装轻纺 | `packaging-demo` | `packaging.aiexportweb.top` |
| 消费电子 | `electronics-demo` | `electronics.aiexportweb.top` |
| 礼品文创 | `gifts-demo` | `gifts.aiexportweb.top` |

### 4.2 客户正式站建议配置

假设客户域名是：

```text
client-domain.com
```

后台对应站点建议这样写：

```text
Domain:
client-domain.com

Domain aliases:
client-domain.com
www.client-domain.com
preview.client-domain.com
```

## 5. `.env.local` / Vercel 环境变量要检查哪些

本地 `.env.local` 不要提交到 GitHub。

Vercel 线上环境要在这里配置：

```text
Project -> Settings -> Environment Variables
```

### 5.1 必须配置

这些是生产环境必须认真配置的：

```text
DATABASE_URL
SESSION_SECRET
NEXT_PUBLIC_SITE_URL
ADMIN_USERNAME
ADMIN_PASSWORD
```

建议值：

```text
NEXT_PUBLIC_SITE_URL=https://aiexportweb.top
```

`SESSION_SECRET` 必须是 32 位以上随机字符串。

`ADMIN_PASSWORD` 不要用默认密码，也不要用 `changeme`。

### 5.2 图片和文件上传必须配置

如果你要上传图片、产品资料、附件，必须配置 Cloudflare R2：

```text
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_URL
```

`R2_PUBLIC_URL` 应该是可公开访问资源的 URL，例如：

```text
https://assets.yourdomain.com
```

或你当前 R2 public/custom domain。

### 5.3 询盘邮件通知必须配置

如果要收到询盘邮件：

```text
BREVO_API_KEY
BREVO_TO_EMAIL
```

### 5.4 Turnstile 人机验证

如果表单启用 Turnstile：

```text
TURNSTILE_SECRET_KEY
NEXT_PUBLIC_TURNSTILE_SITE_KEY
```

如果你给多个正式域名用 Turnstile，需要在 Cloudflare Turnstile 里允许这些域名：

```text
aiexportweb.top
www.aiexportweb.top
cnc.aiexportweb.top
medical.aiexportweb.top
client-domain.com
www.client-domain.com
```

### 5.5 套餐和销售页配置

```text
SITE_PLAN=ai_sales
ENABLE_PRICING_PAGE=true
SALES_CONTACT_URL=/contact
```

说明：

- `SITE_PLAN` 是没有数据库站点上下文时的兜底套餐。
- 真实客户站主要看 `/admin/sites` 里的站点套餐。
- `ENABLE_PRICING_PAGE=true` 才能打开 `/pricing`。
- `SALES_CONTACT_URL` 可以是 `/contact`，也可以是外部 WhatsApp / 表单链接。

### 5.6 AI 功能变量

AI 相关变量不是所有客户都必须开，但如果你要用 AI 文案、AI 回复、RAG，就需要至少配置一种 AI provider。

推荐优先配置 Google Vertex Service Account：

```text
GOOGLE_APPLICATION_CREDENTIALS_JSON
VERTEX_PROJECT_ID
VERTEX_LOCATION
```

可选 fallback：

```text
GEMINI_API_KEY
VERTEX_EXPRESS_API_KEY
DEEPSEEK_API_KEY
```

注意：

当前 `.env.example` 里还没有完整列出这些 AI 变量，但 `src/env.ts` 和代码里已经读取它们。建议后续把 `.env.example` 补齐。

### 5.7 其他可选变量

```text
FIRECRAWL_API_KEY
```

这不是核心功能必需项。

## 6. 你刚才点 `?site=cnc-demo` 后为什么产品页回主站

你访问：

```text
https://aiexportweb.top/?site=cnc-demo
```

首页能切到 CNC demo，是因为这一页 URL 里带了：

```text
?site=cnc-demo
```

但你点击导航里的 Products 后，链接是：

```text
/products
```

不是：

```text
/products?site=cnc-demo
```

系统原本设计是：第一次访问 `?site=cnc-demo` 时，把 `cnc-demo` 写进 `preview_site` cookie。后面即使 URL 没有 `?site=`，也能从 cookie 继续识别当前预览站点。

问题是之前 `src/proxy.ts` 里公开页面分支没有把 `previewSiteFromQuery` 传给写 cookie 的函数，所以 cookie 没写成功。

结果就是：

1. 首页通过 `?site=cnc-demo` 正确显示 CNC demo。
2. 点击 `/products` 后 URL 里没有 `?site=cnc-demo`。
3. cookie 也没有保存成功。
4. 系统找不到预览站点，于是回到默认主站/默认站点。

已经修复：

```text
src/proxy.ts
```

现在公开页面访问 `?site=xxx` 时会写入：

```text
preview_site=xxx
```

以后你打开：

```text
https://aiexportweb.top/?site=cnc-demo
```

再点导航里的：

```text
Products
Blog
About
Contact
```

应该会继续停留在 `cnc-demo` 这个行业站上下文。

## 7. 你现在测试切站的推荐方式

### 7.1 还没配子域名时

用：

```text
https://aiexportweb.top/?site=cnc-demo
```

然后直接点导航测试。

如果之前浏览器缓存了旧 cookie，建议先用无痕窗口测试一次。

### 7.2 配好子域名后

用：

```text
https://cnc.aiexportweb.top
https://medical.aiexportweb.top
https://equipment.aiexportweb.top
```

这种方式最像正式客户演示，不依赖 `?site=`。

### 7.3 正式客户上线后

用客户自己的域名：

```text
https://client-domain.com
https://www.client-domain.com
```

## 8. 最终检查清单

上线前检查：

1. Neon 已执行到最新迁移，包括：

```text
0003_add_sites_multitenancy.sql
0004_feature_usage_per_site.sql
0005_site_change_logs.sql
0006_site_commercial_fields.sql
0007_site_domain_aliases.sql
```

2. Vercel 环境变量完整。
3. Vercel Domains 添加完成。
4. DNS 指向 Vercel。
5. `/admin/sites` 的 `Domain aliases` 写好。
6. 打开行业子域名或客户域名测试：

```text
/
/products
/blog
/contact
/request-quote
/privacy-policy
/terms
```

7. 提交一条询盘，确认后台只进入对应站点。

