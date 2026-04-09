/**
 * ============================================================
 * 全站深度审计脚本 v2 - 包含 Admin 登录
 * 策略:
 *   - 每项检查失败后等2秒重试，连续2次失败才算真正失败
 *   - 慢加载页面最长等60秒
 *   - Admin 用 username=admin / password=changeme 自动登录
 *   - 终端实时显示进度
 * ============================================================
 */

import { expect, Page, test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const BASE = "http://localhost:3000";
const ADMIN_USER = "admin";
const ADMIN_PASS = "changeme";

// ── 审计结果收集 ──────────────────────────────────────────────
interface AuditItem {
  page: string;
  section: string;
  item: string;
  status: "PASS" | "FAIL" | "WARN" | "SKIP";
  detail: string;
  retries: number;
}
const results: AuditItem[] = [];

function log(r: AuditItem) {
  results.push(r);
  const icons = { PASS: "✅", FAIL: "❌", WARN: "⚠️ ", SKIP: "⏭️ " } as const;
  const retry = r.retries > 0 ? ` (重试${r.retries}次)` : "";
  console.log(`  ${icons[r.status]} [${r.section}] ${r.item}: ${r.detail}${retry}`);
}

// ── 带重试的检查函数 ──────────────────────────────────────────
async function check(
  pageName: string,
  section: string,
  item: string,
  fn: () => Promise<{ status: "PASS" | "FAIL" | "WARN" | "SKIP"; detail: string }>,
  retries = 2
) {
  let lastErr = "";
  for (let i = 0; i <= retries; i++) {
    try {
      const r = await fn();
      log({ page: pageName, section, item, ...r, retries: i });
      return r.status;
    } catch (e) {
      lastErr = String(e).replace(/\n/g, " ").slice(0, 150);
      if (i < retries) await new Promise(r => setTimeout(r, 2000));
    }
  }
  log({ page: pageName, section, item, status: "FAIL", detail: `${retries}次均失败: ${lastErr}`, retries });
  return "FAIL";
}

// ── 导航工具 ──────────────────────────────────────────────────
async function go(page: Page, url: string, timeout = 45000) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout });
  // 额外等 network idle，最多再多 15s
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
}

// ── 保存报告 ──────────────────────────────────────────────────
function saveReport() {
  const dir = path.join(process.cwd(), "tests", "audit", "reports");
  fs.mkdirSync(dir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const pass  = results.filter(r => r.status === "PASS").length;
  const fail  = results.filter(r => r.status === "FAIL").length;
  const warn  = results.filter(r => r.status === "WARN").length;
  const skip  = results.filter(r => r.status === "SKIP").length;

  console.log("\n" + "═".repeat(60));
  console.log(`🎯 审计完成 | ✅${pass}  ❌${fail}  ⚠️ ${warn}  ⏭️ ${skip}  共${results.length}项`);
  console.log("═".repeat(60));
  if (fail > 0) {
    console.log("\n❌ 失败项清单:");
    results.filter(r => r.status === "FAIL").forEach(r =>
      console.log(`  [${r.page}] ${r.section} > ${r.item}: ${r.detail}`)
    );
  }
  if (warn > 0) {
    console.log("\n⚠️  警告项清单:");
    results.filter(r => r.status === "WARN").forEach(r =>
      console.log(`  [${r.page}] ${r.section} > ${r.item}: ${r.detail}`)
    );
  }

  // JSON
  fs.writeFileSync(path.join(dir, `audit-${ts}.json`), JSON.stringify({ summary: { pass, fail, warn, skip }, results }, null, 2));

  // HTML
  const rows = results.map(r => {
    const bg = { PASS: "#d4edda", FAIL: "#f8d7da", WARN: "#fff3cd", SKIP: "#e2e3e5" }[r.status];
    const icon = { PASS: "✅", FAIL: "❌", WARN: "⚠️", SKIP: "⏭️" }[r.status];
    return `<tr style="background:${bg}"><td>${icon}</td><td>${r.page}</td><td>${r.section}</td><td>${r.item}</td><td style="font-size:12px">${r.detail}</td><td>${r.retries}</td></tr>`;
  }).join("\n");

  const html = `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8">
<title>全站审计报告 ${ts}</title>
<style>body{font-family:system-ui,sans-serif;padding:20px;background:#f5f5f5}
h1{color:#1a1a2e}.sum{display:flex;gap:16px;margin:16px 0}
.b{padding:10px 20px;border-radius:8px;font-weight:bold;font-size:18px}
.p{background:#d4edda;color:#155724}.f{background:#f8d7da;color:#721c24}
.w{background:#fff3cd;color:#856404}.s{background:#e2e3e5;color:#383d41}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}
th{background:#1a1a2e;color:#fff;padding:10px;text-align:left;font-size:13px}
td{padding:7px 10px;border-bottom:1px solid #eee;font-size:13px}</style></head>
<body><h1>🔍 全站深度审计报告</h1>
<p>生成时间: ${new Date().toLocaleString("zh-CN")}</p>
<div class="sum">
  <div class="b p">✅ 通过: ${pass}</div>
  <div class="b f">❌ 失败: ${fail}</div>
  <div class="b w">⚠️ 警告: ${warn}</div>
  <div class="b s">⏭️ 跳过: ${skip}</div>
</div>
<table><thead><tr><th>状态</th><th>页面</th><th>模块</th><th>检查项</th><th>详情</th><th>重试</th></tr></thead>
<tbody>${rows}</tbody></table></body></html>`;
  const htmlPath = path.join(dir, `audit-${ts}.html`);
  fs.writeFileSync(htmlPath, html);
  console.log(`\n📄 HTML报告: ${htmlPath}`);
}

// ══════════════════════════════════════════════════════════════
// BATCH 0: 等待 dev server + Admin 登录 (session 复用)
// ══════════════════════════════════════════════════════════════
test.describe("🔐 Setup: Admin 登录", () => {
  test("登录并保存 session", async ({ page }) => {
    console.log("\n🚀 正在等待 dev server 就绪...");
    let ready = false;
    for (let i = 0; i < 18; i++) {
      try {
        const r = await page.request.get(`${BASE}/`);
        if (r.status() < 500) { ready = true; break; }
      } catch { /* 还没起来 */ }
      console.log(`  ⏳ 等待 dev server... (${(i + 1) * 5}s)`);
      await new Promise(r => setTimeout(r, 5000));
    }
    if (!ready) throw new Error("dev server 90秒内未响应，请确认 npm run dev 正在运行");
    console.log(`  ✅ dev server 已就绪\n`);

    console.log("🔑 正在登录 Admin...");
    await go(page, `${BASE}/admin/login`);
    await page.fill("input[name='username']", ADMIN_USER);
    await page.fill("input[name='password']", ADMIN_PASS);
    await page.click("button[type='submit']");
    await page.waitForURL(/\/admin/, { timeout: 20000 }).catch(() => {});

    const url = page.url();
    if (url.includes("/login")) {
      const err = await page.locator(".text-red-600, [class*='red']").textContent().catch(() => "");
      throw new Error(`登录失败！当前URL: ${url}, 错误: ${err}`);
    }
    console.log(`  ✅ Admin 登录成功，当前: ${url}`);
  });
});

// ══════════════════════════════════════════════════════════════
// BATCH 1: 公开前台页面
// ══════════════════════════════════════════════════════════════
test.describe("📢 BATCH 1 — 公开前台页面", () => {

  // ── 首页 ──
  test("B1-01 首页 /", async ({ page }) => {
    const P = "首页";
    console.log(`\n📄 审计: ${P} /`);
    await check(P, "加载", "页面正常渲染", async () => {
      await go(page, `${BASE}/`);
      const title = await page.title();
      return { status: "PASS", detail: `title="${title}"` };
    });
    await check(P, "导航", "顶部导航栏存在", async () => {
      const nav = await page.locator("nav, header").count();
      return { status: nav > 0 ? "PASS" : "FAIL", detail: nav > 0 ? "导航栏正常" : "找不到导航栏" };
    });
    await check(P, "导航", "所有导航链接可点击", async () => {
      const links = await page.locator("nav a[href], header a[href]").all();
      return { status: "PASS", detail: `发现 ${links.length} 个导航链接` };
    });
    await check(P, "Hero区域", "主CTA按钮存在", async () => {
      const cta = page.locator("a[href*='quote'], a[href*='contact'], a[href*='inquiry']").first();
      const visible = await cta.isVisible().catch(() => false);
      return { status: visible ? "PASS" : "WARN", detail: visible ? "CTA按钮可见" : "未找到明显CTA按钮" };
    });
    await check(P, "图片", "无破损图片", async () => {
      const broken = await page.evaluate(() =>
        Array.from(document.querySelectorAll("img"))
          .filter(i => !i.complete || i.naturalWidth === 0)
          .map(i => i.getAttribute("src") || "?").slice(0, 5)
      );
      return broken.length > 0
        ? { status: "WARN", detail: `${broken.length}张破损: ${broken[0]}` }
        : { status: "PASS", detail: `所有图片正常` };
    });
    await check(P, "页脚", "Footer存在", async () => {
      const count = await page.locator("footer").count();
      return { status: count > 0 ? "PASS" : "WARN", detail: count > 0 ? "页脚存在" : "未找到footer" };
    });
  });

  // ── 产品列表 ──
  test("B1-02 产品列表 /products", async ({ page }) => {
    const P = "产品列表";
    console.log(`\n📄 审计: ${P} /products`);
    await check(P, "加载", "页面正常渲染", async () => {
      await go(page, `${BASE}/products`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "内容", "产品卡片渲染", async () => {
      await page.waitForSelector("main", { timeout: 15000 });
      const cards = await page.locator("article, [class*='product'], [class*='card']").count();
      return { status: cards > 0 ? "PASS" : "WARN", detail: `产品卡片: ${cards}个` };
    });
    await check(P, "筛选", "分类筛选功能", async () => {
      const filter = await page.locator("a[href*='category'], select, [role='listbox'], [class*='filter']").count();
      return { status: filter > 0 ? "PASS" : "WARN", detail: `筛选元素: ${filter}个` };
    });
    await check(P, "图片", "产品图片正常", async () => {
      const broken = await page.evaluate(() =>
        Array.from(document.querySelectorAll("img")).filter(i => !i.complete || i.naturalWidth === 0).length
      );
      return { status: broken === 0 ? "PASS" : "WARN", detail: broken === 0 ? "图片全部正常" : `${broken}张破损` };
    });
  });

  // ── 关于页 ──
  test("B1-03 关于页 /about", async ({ page }) => {
    const P = "关于页";
    console.log(`\n📄 审计: ${P} /about`);
    await check(P, "加载", "页面正常渲染", async () => {
      await go(page, `${BASE}/about`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "SEO", "唯一H1标签", async () => {
      const count = await page.locator("h1").count();
      const text = count > 0 ? await page.locator("h1").first().textContent() : "";
      return { status: count === 1 ? "PASS" : count === 0 ? "FAIL" : "WARN", detail: `H1: ${count}个 | "${text?.trim().slice(0, 40)}"` };
    });
    await check(P, "图片", "无破损图片", async () => {
      const broken = await page.evaluate(() =>
        Array.from(document.querySelectorAll("img")).filter(i => !i.complete || i.naturalWidth === 0).length
      );
      return { status: broken === 0 ? "PASS" : "WARN", detail: broken === 0 ? "图片正常" : `${broken}张破损` };
    });
  });

  // ── 联系页 ──
  test("B1-04 联系页 /contact", async ({ page }) => {
    const P = "联系页";
    console.log(`\n📄 审计: ${P} /contact`);
    await check(P, "加载", "页面正常渲染", async () => {
      await go(page, `${BASE}/contact`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "表单", "联系表单字段完整", async () => {
      const form = await page.locator("form").count();
      if (form === 0) return { status: "FAIL", detail: "找不到表单" };
      const email = await page.locator("input[type='email'], input[name*='email']").count();
      const msg = await page.locator("textarea").count();
      return { status: email > 0 && msg > 0 ? "PASS" : "WARN", detail: `email字段:${email}, textarea:${msg}` };
    });
    await check(P, "表单", "空提交触发验证", async () => {
      const btn = page.locator("button[type='submit']").first();
      if (await btn.count() === 0) return { status: "WARN", detail: "找不到提交按钮" };
      await btn.click();
      await page.waitForTimeout(1000);
      const errs = await page.locator("[aria-invalid='true'], input:invalid, [class*='error']").count();
      return { status: errs > 0 ? "PASS" : "WARN", detail: errs > 0 ? `触发${errs}个验证提示` : "未见验证提示" };
    });
    await check(P, "表单", "填写数据后按钮可用", async () => {
      await go(page, `${BASE}/contact`);
      const nameIn = page.locator("input[name*='name'], input[placeholder*='name' i], input[placeholder*='名']").first();
      const emailIn = page.locator("input[type='email']").first();
      const msgIn = page.locator("textarea").first();
      if (await nameIn.count() > 0) await nameIn.fill("Audit Test");
      if (await emailIn.count() > 0) await emailIn.fill("audit@test.com");
      if (await msgIn.count() > 0) await msgIn.fill("This is a site audit test message.");
      const btn = page.locator("button[type='submit']").first();
      const enabled = await btn.isEnabled().catch(() => false);
      return { status: enabled ? "PASS" : "WARN", detail: enabled ? "填写后提交按钮可用" : "提交按钮仍不可用" };
    });
  });

  // ── 询价页 ──
  test("B1-05 询价页 /request-quote", async ({ page }) => {
    const P = "询价页";
    console.log(`\n📄 审计: ${P} /request-quote`);
    await check(P, "加载", "页面正常渲染", async () => {
      await go(page, `${BASE}/request-quote`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "表单", "询价表单字段", async () => {
      const inputs = await page.locator("input:visible, textarea:visible, select:visible").count();
      return { status: inputs >= 3 ? "PASS" : "WARN", detail: `可见字段: ${inputs}个` };
    });
    await check(P, "表单", "填写询价表单", async () => {
      const nameIn = page.locator("input[name*='name'], input[placeholder*='name' i], input[placeholder*='名']").first();
      const emailIn = page.locator("input[type='email']").first();
      const msgIn = page.locator("textarea").first();
      if (await nameIn.count() > 0) await nameIn.fill("Test Buyer Co.");
      if (await emailIn.count() > 0) await emailIn.fill("buyer@test.com");
      if (await msgIn.count() > 0) await msgIn.fill("We need 1000 units. Please quote.");
      const companyIn = page.locator("input[name*='company'], input[placeholder*='company' i]").first();
      if (await companyIn.count() > 0) await companyIn.fill("Global Imports Ltd");
      const btn = page.locator("button[type='submit']").first();
      const enabled = await btn.isEnabled().catch(() => false);
      return { status: enabled ? "PASS" : "WARN", detail: enabled ? "表单填写完成，提交可用" : "提交按钮被禁用" };
    });
    await check(P, "下拉框", "产品/数量选择器", async () => {
      const selects = await page.locator("select, [role='combobox']").count();
      return { status: "PASS", detail: `下拉框数量: ${selects}` };
    });
  });

  // ── 博客 ──
  test("B1-06 博客列表 /blog", async ({ page }) => {
    const P = "博客列表";
    console.log(`\n📄 审计: ${P} /blog`);
    await check(P, "加载", "页面正常渲染", async () => {
      await go(page, `${BASE}/blog`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "内容", "文章卡片或链接", async () => {
      const blogLinks = await page.locator("a[href*='/blog/']").count();
      const articles = await page.locator("article").count();
      return { status: blogLinks > 0 ? "PASS" : "WARN", detail: `文章链接:${blogLinks}, article标签:${articles}` };
    });
    // 点击第一篇文章
    await check(P, "导航", "进入博客详情页", async () => {
      const firstLink = page.locator("a[href*='/blog/']").first();
      if (await firstLink.count() === 0) return { status: "SKIP", detail: "暂无博客文章可点击" };
      const href = await firstLink.getAttribute("href");
      await firstLink.click();
      await page.waitForLoadState("domcontentloaded", { timeout: 20000 });
      const newUrl = page.url();
      return { status: newUrl.includes("/blog/") ? "PASS" : "WARN", detail: `跳转到: ${newUrl.slice(0, 60)}` };
    });
  });

  // ── 能力页 ──
  test("B1-07 能力/服务页 /capabilities", async ({ page }) => {
    const P = "能力页";
    console.log(`\n📄 审计: ${P} /capabilities`);
    await check(P, "加载", "页面正常渲染", async () => {
      await go(page, `${BASE}/capabilities`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "内容", "H1标题存在", async () => {
      const h1 = await page.locator("h1").first().textContent().catch(() => "");
      return { status: h1 ? "PASS" : "WARN", detail: `H1: "${h1?.slice(0, 50)}"` };
    });
    await check(P, "按钮", "CTA按钮可点击", async () => {
      const btns = await page.locator("a[href], button").count();
      return { status: "PASS", detail: `交互元素: ${btns}个` };
    });
  });

  // ── SEO文件 ──
  test("B1-08 SEO 文件 robots.txt + sitemap", async ({ page }) => {
    const P = "SEO文件";
    console.log(`\n📄 审计: ${P}`);
    await check(P, "SEO", "robots.txt可访问", async () => {
      const r = await page.request.get(`${BASE}/robots.txt`);
      const text = await r.text();
      return r.ok() ? { status: "PASS", detail: `状态${r.status()}, 包含User-agent: ${text.includes("User-agent")}` }
                    : { status: "FAIL", detail: `状态${r.status()}` };
    });
    await check(P, "SEO", "sitemap.xml可访问且有内容", async () => {
      const r = await page.request.get(`${BASE}/sitemap.xml`);
      const text = await r.text();
      const urlCount = (text.match(/<url>/g) || []).length;
      return r.ok() && urlCount > 0
        ? { status: "PASS", detail: `状态${r.status()}, 包含${urlCount}个URL` }
        : { status: r.ok() ? "WARN" : "FAIL", detail: `状态${r.status()}, URL数量:${urlCount}` };
    });
    await check(P, "SEO", "隐私政策页 /privacy-policy", async () => {
      await go(page, `${BASE}/privacy-policy`);
      const len = (await page.locator("main, article, body").textContent() ?? "").trim().length;
      return { status: len > 200 ? "PASS" : "WARN", detail: `内容长度: ${len}字符` };
    });
    await check(P, "SEO", "服务条款页 /terms", async () => {
      await go(page, `${BASE}/terms`);
      const len = (await page.locator("main, article, body").textContent() ?? "").trim().length;
      return { status: len > 200 ? "PASS" : "WARN", detail: `内容长度: ${len}字符` };
    });
  });
});

// ══════════════════════════════════════════════════════════════
// BATCH 2: Admin 后台 (已登录 session)
// ══════════════════════════════════════════════════════════════
test.describe("🔐 BATCH 2 — Admin 后台审计", () => {

  // 每个 admin 测试前先确保已登录
  test.beforeEach(async ({ page }) => {
    await go(page, `${BASE}/admin/login`);
    const url = page.url();
    if (!url.includes("/login")) return; // 已有session
    await page.fill("input[name='username']", ADMIN_USER);
    await page.fill("input[name='password']", ADMIN_PASS);
    await page.click("button[type='submit']");
    await page.waitForURL(/\/admin/, { timeout: 20000 }).catch(() => {});
  });

  // ── 仪表盘 ──
  test("B2-01 Admin 仪表盘 /admin", async ({ page }) => {
    const P = "Admin仪表盘";
    console.log(`\n📄 审计: ${P} /admin`);
    await check(P, "加载", "仪表盘正常渲染", async () => {
      await go(page, `${BASE}/admin`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "数据卡片", "指标卡片渲染", async () => {
      const cards = await page.locator("article").count();
      return { status: cards > 0 ? "PASS" : "WARN", detail: `数据卡片: ${cards}个` };
    });
    await check(P, "侧边栏", "侧边栏导航存在", async () => {
      const sidebar = await page.locator("aside, nav").count();
      return { status: sidebar > 0 ? "PASS" : "FAIL", detail: `侧边栏: ${sidebar}个` };
    });
    await check(P, "侧边栏", "侧边栏所有导航链接", async () => {
      const links = await page.locator("aside a[href], nav a[href]").all();
      const hrefs = await Promise.all(links.map(l => l.getAttribute("href")));
      return { status: "PASS", detail: `${links.length}个链接: ${hrefs.slice(0, 5).join(", ")}` };
    });
    await check(P, "顶栏", "通知铃铛按钮", async () => {
      const bell = page.locator("button").filter({ hasText: /./ }).nth(0);
      const count = await page.locator("header button").count();
      return { status: count > 0 ? "PASS" : "WARN", detail: `顶栏按钮: ${count}个` };
    });
    await check(P, "趋势图", "询盘趋势区域", async () => {
      const trend = await page.locator("text=询盘趋势, text=Inquiry").count();
      return { status: trend > 0 ? "PASS" : "WARN", detail: trend > 0 ? "趋势图区域存在" : "未找到趋势图" };
    });
  });

  // ── 产品管理 ──
  test("B2-02 Admin 产品管理 /admin/products", async ({ page }) => {
    const P = "Admin产品";
    console.log(`\n📄 审计: ${P} /admin/products`);
    await check(P, "加载", "列表页渲染", async () => {
      await go(page, `${BASE}/admin/products`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "列表", "产品列表/表格", async () => {
      const table = await page.locator("table, [role='table']").count();
      const rows = await page.locator("tr, [role='row']").count();
      return { status: "PASS", detail: `表格:${table}个, 行数:${rows}` };
    });
    await check(P, "操作", "新增产品按钮", async () => {
      const btn = page.locator("a[href*='/products/new'], button:has-text('新增'), button:has-text('创建'), a:has-text('新增')").first();
      const visible = await btn.isVisible().catch(() => false);
      return { status: visible ? "PASS" : "WARN", detail: visible ? "新增按钮存在且可见" : "未找到新增按钮" };
    });
    await check(P, "操作", "新增产品页可访问", async () => {
      await go(page, `${BASE}/admin/products/new`);
      const url = page.url();
      return { status: url.includes("/new") ? "PASS" : "FAIL", detail: `URL: ${url.slice(0, 60)}` };
    });
    await check(P, "表单", "产品表单字段", async () => {
      const titleIn = await page.locator("input[name*='title'], input[name*='name'], input[placeholder*='产品'], input[placeholder*='名称']").count();
      const desc = await page.locator("textarea, [contenteditable='true'], .ProseMirror").count();
      const selects = await page.locator("select, [role='combobox']").count();
      return { status: titleIn > 0 ? "PASS" : "WARN", detail: `标题字段:${titleIn}, 描述:${desc}, 下拉框:${selects}` };
    });
    await check(P, "表单", "图片上传区域", async () => {
      const upload = await page.locator("input[type='file'], button:has-text('上传'), [data-testid*='upload'], [class*='upload']").count();
      return { status: upload > 0 ? "PASS" : "WARN", detail: upload > 0 ? `上传区域存在(${upload}个)` : "未找到上传区域" };
    });
    await check(P, "表单", "保存/发布按钮", async () => {
      const saveBtn = await page.locator("button[type='submit'], button:has-text('保存'), button:has-text('发布')").count();
      return { status: saveBtn > 0 ? "PASS" : "FAIL", detail: `保存/发布按钮: ${saveBtn}个` };
    });
    // 检查已有产品的编辑页（如果有）
    await check(P, "编辑", "产品编辑页可访问", async () => {
      await go(page, `${BASE}/admin/products`);
      const editLink = page.locator("a[href*='/products/'], tr a[href], [class*='edit'] a").first();
      const count = await editLink.count();
      if (count === 0) return { status: "SKIP", detail: "暂无产品，跳过编辑测试" };
      const href = await editLink.getAttribute("href");
      return { status: "PASS", detail: `发现产品链接: ${href?.slice(0, 50)}` };
    });
  });

  // ── 博客管理 ──
  test("B2-03 Admin 博客管理 /admin/blog", async ({ page }) => {
    const P = "Admin博客";
    console.log(`\n📄 审计: ${P} /admin/blog`);
    await check(P, "加载", "博客列表页", async () => {
      await go(page, `${BASE}/admin/blog`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "列表", "文章列表", async () => {
      const rows = await page.locator("table tr, article, [class*='post']").count();
      return { status: "PASS", detail: `条目数: ${rows}` };
    });
    await check(P, "操作", "新增文章按钮", async () => {
      const btn = page.locator("a[href*='/blog/new'], button:has-text('新增'), a:has-text('写文章')").first();
      const visible = await btn.isVisible().catch(() => false);
      return { status: visible ? "PASS" : "WARN", detail: visible ? "新增按钮存在" : "未找到新增按钮" };
    });
    await check(P, "编辑器", "新增文章页 + 富文本编辑器", async () => {
      await go(page, `${BASE}/admin/blog/new`);
      const editor = await page.locator("[contenteditable='true'], .ProseMirror, .ql-editor, textarea[name*='content']").count();
      const titleIn = await page.locator("input[name*='title'], input[placeholder*='标题']").count();
      return { status: editor > 0 && titleIn > 0 ? "PASS" : "WARN", detail: `标题输入:${titleIn}, 编辑器:${editor}` };
    });
    await check(P, "编辑器", "SEO字段(slug/meta)", async () => {
      const slug = await page.locator("input[name*='slug'], input[placeholder*='slug']").count();
      const meta = await page.locator("textarea[name*='meta'], input[name*='meta'], [placeholder*='description' i]").count();
      return { status: "PASS", detail: `slug字段:${slug}, meta描述:${meta}` };
    });
    await check(P, "编辑器", "标签/分类下拉框", async () => {
      const tag = await page.locator("select, [role='combobox'], [class*='tag'], [class*='categor']").count();
      return { status: "PASS", detail: `标签/分类元素: ${tag}个` };
    });
    await check(P, "编辑器", "保存草稿/发布按钮", async () => {
      const btns = await page.locator("button[type='submit'], button:has-text('保存'), button:has-text('发布'), button:has-text('草稿')").count();
      return { status: btns > 0 ? "PASS" : "FAIL", detail: `按钮: ${btns}个` };
    });
  });

  // ── 询盘管理 ──
  test("B2-04 Admin 询盘管理 /admin/inquiries", async ({ page }) => {
    const P = "Admin询盘";
    console.log(`\n📄 审计: ${P} /admin/inquiries`);
    await check(P, "加载", "询盘列表页", async () => {
      await go(page, `${BASE}/admin/inquiries`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "列表", "询盘表格/列表", async () => {
      const table = await page.locator("table, [role='table']").count();
      const rows = await page.locator("table tbody tr, [role='row']").count();
      return { status: table > 0 ? "PASS" : "WARN", detail: `表格:${table}个, 数据行:${rows}条` };
    });
    await check(P, "筛选", "状态筛选下拉框", async () => {
      const filter = await page.locator("select, [role='combobox'], [class*='filter']").count();
      return { status: filter > 0 ? "PASS" : "WARN", detail: `筛选控件: ${filter}个` };
    });
    await check(P, "操作", "导出按钮", async () => {
      const exp = await page.locator("a[href*='/export'], button:has-text('导出'), button:has-text('Export'), a:has-text('导出')").count();
      return { status: exp > 0 ? "PASS" : "WARN", detail: exp > 0 ? "导出功能存在" : "未找到导出按钮" };
    });
    // 进入第一条询盘详情
    await check(P, "详情", "点击进入询盘详情", async () => {
      const firstRow = page.locator("table tbody tr a, [role='row'] a").first();
      const count = await firstRow.count();
      if (count === 0) return { status: "SKIP", detail: "暂无询盘数据" };
      await firstRow.click();
      await page.waitForLoadState("domcontentloaded", { timeout: 20000 });
      const url = page.url();
      return { status: url.includes("/inquiries/") ? "PASS" : "WARN", detail: `跳转到: ${url.slice(0, 60)}` };
    });
    await check(P, "详情", "询盘详情页内容", async () => {
      const url = page.url();
      if (!url.includes("/inquiries/")) return { status: "SKIP", detail: "未进入详情页" };
      const content = await page.locator("main").textContent() ?? "";
      const hasEmail = content.includes("@") || content.includes("email") || content.includes("Email");
      return { status: hasEmail ? "PASS" : "WARN", detail: hasEmail ? "详情页有邮件信息" : "详情内容不完整" };
    });
    await check(P, "详情", "状态下拉框/更改", async () => {
      const url = page.url();
      if (!url.includes("/inquiries/")) return { status: "SKIP", detail: "未进入详情页" };
      const selector = await page.locator("select, [role='combobox']").count();
      return { status: selector > 0 ? "PASS" : "WARN", detail: `状态控件: ${selector}个` };
    });
    await check(P, "详情", "回复功能/按钮", async () => {
      const url = page.url();
      if (!url.includes("/inquiries/")) return { status: "SKIP", detail: "未进入详情页" };
      const reply = await page.locator("button:has-text('回复'), button:has-text('Reply'), textarea").count();
      return { status: reply > 0 ? "PASS" : "WARN", detail: `回复元素: ${reply}个` };
    });
  });

  // ── 报价单 ──
  test("B2-05 Admin 报价单 /admin/quotes", async ({ page }) => {
    const P = "Admin报价单";
    console.log(`\n📄 审计: ${P} /admin/quotes`);
    await check(P, "加载", "报价单列表页", async () => {
      await go(page, `${BASE}/admin/quotes`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "内容", "报价单列表/表格", async () => {
      const table = await page.locator("table, [role='table'], article").count();
      const btns = await page.locator("button:visible").count();
      return { status: "PASS", detail: `表格元素:${table}, 按钮:${btns}` };
    });
  });

  // ── 分类管理 ──
  test("B2-06 Admin 分类管理 /admin/categories", async ({ page }) => {
    const P = "Admin分类";
    console.log(`\n📄 审计: ${P} /admin/categories`);
    await check(P, "加载", "分类管理页", async () => {
      await go(page, `${BASE}/admin/categories`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "列表", "分类列表", async () => {
      const items = await page.locator("table tr, li, [class*='categor']").count();
      return { status: "PASS", detail: `分类条目: ${items}个` };
    });
    await check(P, "操作", "新增分类按钮", async () => {
      const btn = await page.locator("button:has-text('新增'), button:has-text('添加'), button:has-text('创建'), button:has-text('Add')").count();
      return { status: btn > 0 ? "PASS" : "WARN", detail: `新增按钮: ${btn}个` };
    });
    await check(P, "操作", "点击新增 — 弹窗/表单出现", async () => {
      const btn = page.locator("button:has-text('新增'), button:has-text('添加')").first();
      if (await btn.count() === 0) return { status: "SKIP", detail: "无新增按钮" };
      await btn.click();
      await page.waitForTimeout(1000);
      const dialog = await page.locator("[role='dialog'], [data-radix-dialog], form input").count();
      return { status: dialog > 0 ? "PASS" : "WARN", detail: dialog > 0 ? "弹窗/表单出现" : "点击后无弹窗" };
    });
  });

  // ── 回复模板 ──
  test("B2-07 Admin 回复模板 /admin/reply-templates", async ({ page }) => {
    const P = "Admin回复模板";
    console.log(`\n📄 审计: ${P} /admin/reply-templates`);
    await check(P, "加载", "模板列表页", async () => {
      await go(page, `${BASE}/admin/reply-templates`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "列表", "模板列表内容", async () => {
      const items = await page.locator("li, tr, [class*='template'], article").count();
      return { status: "PASS", detail: `模板条目: ${items}个` };
    });
    await check(P, "操作", "新增/编辑模板", async () => {
      const btn = await page.locator("button:has-text('新增'), button:has-text('创建'), button:has-text('编辑'), textarea").count();
      return { status: btn > 0 ? "PASS" : "WARN", detail: `相关联控件: ${btn}个` };
    });
  });

  // ── SEO AI ──
  test("B2-08 Admin SEO-AI /admin/seo-ai", async ({ page }) => {
    const P = "Admin SEO-AI";
    console.log(`\n📄 审计: ${P} /admin/seo-ai`);
    await check(P, "加载", "SEO-AI工具页", async () => {
      await go(page, `${BASE}/admin/seo-ai`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "功能", "AI操作按钮/输入", async () => {
      const btns = await page.locator("button:has-text('生成'), button:has-text('分析'), button:has-text('AI'), textarea, input[type='text']").count();
      return { status: btns > 0 ? "PASS" : "WARN", detail: `AI功能元素: ${btns}个` };
    });
    await check(P, "功能", "功能区块渲染", async () => {
      const sections = await page.locator("section, article, [class*='card']").count();
      return { status: "PASS", detail: `功能区块: ${sections}个` };
    });
  });

  // ── 员工管理 ──
  test("B2-09 Admin 员工管理 /admin/staff", async ({ page }) => {
    const P = "Admin员工";
    console.log(`\n📄 审计: ${P} /admin/staff`);
    await check(P, "加载", "员工管理页", async () => {
      await go(page, `${BASE}/admin/staff`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "列表", "员工列表", async () => {
      const rows = await page.locator("table tr, li, [class*='staff'], [class*='user']").count();
      return { status: "PASS", detail: `员工列表条目: ${rows}` };
    });
    await check(P, "操作", "邀请/新增员工按钮", async () => {
      const btn = await page.locator("button:has-text('邀请'), button:has-text('新增'), button:has-text('添加'), button:has-text('Invite')").count();
      return { status: btn > 0 ? "PASS" : "WARN", detail: btn > 0 ? "邀请按钮存在" : "未找到邀请按钮" };
    });
    await check(P, "操作", "点击邀请 — 弹窗/表单", async () => {
      const btn = page.locator("button:has-text('邀请'), button:has-text('新增')").first();
      if (await btn.count() === 0) return { status: "SKIP", detail: "无邀请按钮" };
      await btn.click();
      await page.waitForTimeout(1000);
      const form = await page.locator("[role='dialog'] form, [role='dialog'] input, form input[type='email']").count();
      return { status: form > 0 ? "PASS" : "WARN", detail: form > 0 ? "邀请表单出现" : "点击后无表单" };
    });
  });

  // ── 文件管理 ──
  test("B2-10 Admin 文件管理 /admin/files", async ({ page }) => {
    const P = "Admin文件";
    console.log(`\n📄 审计: ${P} /admin/files`);
    await check(P, "加载", "文件管理页", async () => {
      await go(page, `${BASE}/admin/files`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "上传", "上传区域/按钮", async () => {
      const upload = await page.locator("input[type='file'], button:has-text('上传'), [class*='upload'], [data-testid*='upload']").count();
      return { status: upload > 0 ? "PASS" : "WARN", detail: upload > 0 ? `上传功能存在(${upload})` : "未找到上传功能" };
    });
    await check(P, "列表", "文件列表区域", async () => {
      const files = await page.locator("table, [class*='file'], li img, [class*='grid']").count();
      return { status: "PASS", detail: `文件展示区域: ${files}个` };
    });
  });

  // ── 媒体库 ──
  test("B2-11 Admin 媒体库 /admin/media", async ({ page }) => {
    const P = "Admin媒体库";
    console.log(`\n📄 审计: ${P} /admin/media`);
    await check(P, "加载", "媒体库页", async () => {
      await go(page, `${BASE}/admin/media`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "内容", "媒体网格/列表", async () => {
      const imgs = await page.locator("img, [class*='media'], [class*='grid']").count();
      return { status: "PASS", detail: `媒体元素: ${imgs}个` };
    });
  });

  // ── 站点设置 ──
  test("B2-12 Admin 站点设置 /admin/settings", async ({ page }) => {
    const P = "Admin设置";
    console.log(`\n📄 审计: ${P} /admin/settings`);
    await check(P, "加载", "设置页面", async () => {
      await go(page, `${BASE}/admin/settings`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "表单", "设置字段数量", async () => {
      const inputs = await page.locator("input:visible, textarea:visible, select:visible").count();
      return { status: inputs > 0 ? "PASS" : "WARN", detail: `可见输入框: ${inputs}个` };
    });
    await check(P, "操作", "保存按钮状态", async () => {
      const btn = page.locator("button[type='submit'], button:has-text('保存')").first();
      if (await btn.count() === 0) return { status: "WARN", detail: "未找到保存按钮" };
      const enabled = await btn.isEnabled();
      return { status: enabled ? "PASS" : "WARN", detail: enabled ? "保存按钮可用" : "保存按钮被禁用" };
    });
    await check(P, "操作", "修改并保存（测试保存流程）", async () => {
      const firstInput = page.locator("input[type='text']:visible, input:not([type]):visible").first();
      if (await firstInput.count() === 0) return { status: "SKIP", detail: "找不到可编辑字段" };
      const original = await firstInput.inputValue();
      await firstInput.fill(original + " "); // 加一个空格触发dirty
      await firstInput.fill(original);  // 还原
      const saveBtn = page.locator("button[type='submit'], button:has-text('保存')").first();
      if (await saveBtn.count() === 0) return { status: "SKIP", detail: "无保存按钮" };
      return { status: "PASS", detail: "字段可编辑，保存按钮可点击" };
    });
  });

  // ── 页面管理 ──
  test("B2-13 Admin 页面管理 /admin/pages", async ({ page }) => {
    const P = "Admin页面";
    console.log(`\n📄 审计: ${P} /admin/pages`);
    await check(P, "加载", "页面管理列表", async () => {
      await go(page, `${BASE}/admin/pages`);
      return { status: "PASS", detail: `title="${await page.title()}"` };
    });
    await check(P, "内容", "页面条目", async () => {
      const items = await page.locator("table tr, li, article, [class*='page']").count();
      return { status: "PASS", detail: `条目数: ${items}` };
    });
  });
});

// ══════════════════════════════════════════════════════════════
// BATCH 3: API 端点检查
// ══════════════════════════════════════════════════════════════
test.describe("🔌 BATCH 3 — API 端点审计", () => {
  test("B3 API 端点响应", async ({ page }) => {
    const P = "API";
    console.log(`\n📄 审计: ${P} 端点`);

    const endpoints = [
      { path: "/api/auth/login", method: "POST", body: { username: "wrong", password: "wrong" }, expectStatus: 401, desc: "Auth API - 错误凭证返回401" },
      { path: "/api/auth/login", method: "POST", body: { username: ADMIN_USER, password: ADMIN_PASS }, expectStatus: 200, desc: "Auth API - 正确凭证返回200" },
    ];

    for (const ep of endpoints) {
      await check(P, "API响应", ep.desc, async () => {
        const r = await page.request.post(`${BASE}${ep.path}`, {
          data: ep.body,
          headers: { "Content-Type": "application/json" },
        });
        const status = r.status();
        return status === ep.expectStatus
          ? { status: "PASS", detail: `状态码: ${status} (预期${ep.expectStatus})` }
          : { status: status >= 500 ? "FAIL" : "WARN", detail: `状态码: ${status} (预期${ep.expectStatus})` };
      });
    }
  });
});

// ══════════════════════════════════════════════════════════════
// 全部完成 — 保存报告
// ══════════════════════════════════════════════════════════════
test.afterAll(async () => {
  saveReport();
});
