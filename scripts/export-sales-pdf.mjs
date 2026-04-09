import fs from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

const inputArg = process.argv[2];

if (!inputArg) {
  console.error("Usage: node scripts/export-sales-pdf.mjs <markdown-file>");
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputArg);
const outputHtmlPath = inputPath.replace(/\.md$/i, ".print.html");
const outputPdfPath = inputPath.replace(/\.md$/i, ".pdf");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildHtmlTemplate({ title, markdown }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.8.1/github-markdown.min.css" />
  <style>
    @page { size: A4; margin: 14mm 12mm 14mm 12mm; }
    html, body {
      background: #f5f5f4;
      color: #1c1917;
      font-family: 'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body { margin: 0; }
    .wrap {
      max-width: 210mm;
      margin: 0 auto;
      padding: 10mm 0;
    }
    .markdown-body {
      box-sizing: border-box;
      background: #ffffff;
      color: #1c1917;
      padding: 14mm 14mm 12mm;
      border-radius: 18px;
      box-shadow: 0 8px 32px rgba(0,0,0,.06);
      font-size: 12px;
      line-height: 1.72;
    }
    .markdown-body h1, .markdown-body h2, .markdown-body h3 {
      color: #111827;
      page-break-after: avoid;
    }
    .markdown-body h1 {
      font-size: 28px;
      border-bottom: 2px solid #f59e0b;
      padding-bottom: 10px;
      margin-bottom: 18px;
    }
    .markdown-body h2 {
      margin-top: 28px;
      padding-left: 10px;
      border-left: 4px solid #f59e0b;
    }
    .markdown-body table {
      display: table;
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      margin: 16px 0;
      page-break-inside: avoid;
    }
    .markdown-body table th,
    .markdown-body table td {
      border: 1px solid #d6d3d1;
      padding: 8px 10px;
      vertical-align: top;
      word-break: break-word;
    }
    .markdown-body table th {
      background: #111827;
      color: #ffffff;
      font-weight: 700;
    }
    .markdown-body tr:nth-child(even) td {
      background: #fafaf9;
    }
    .markdown-body ul, .markdown-body ol {
      padding-left: 1.4em;
    }
    .markdown-body blockquote {
      color: #44403c;
      border-left: 4px solid #f59e0b;
      background: #fffbeb;
      padding: 10px 14px;
      margin: 14px 0;
    }
    .markdown-body hr {
      border: 0;
      border-top: 1px solid #e7e5e4;
      margin: 24px 0;
    }
    @media print {
      html, body { background: #ffffff; }
      .wrap { padding: 0; }
      .markdown-body {
        box-shadow: none;
        border-radius: 0;
        padding: 0;
      }
      a { color: inherit; text-decoration: none; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <article id="article" class="markdown-body"></article>
  </div>
  <script id="source" type="text/plain">${escapeHtml(markdown)}</script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script>
    marked.setOptions({ gfm: true, breaks: false });
    const source = document.getElementById("source").textContent;
    document.getElementById("article").innerHTML = marked.parse(source);
  </script>
</body>
</html>`;
}

const markdown = await fs.readFile(inputPath, "utf8");
const title =
  markdown
    .split(/\r?\n/)
    .find((line) => line.trim().startsWith("# "))
    ?.replace(/^#\s+/, "")
    .trim() || path.basename(inputPath, ".md");

const html = buildHtmlTemplate({ title, markdown });
await fs.writeFile(outputHtmlPath, html, "utf8");

const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: outputPdfPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "14mm",
      right: "12mm",
      bottom: "14mm",
      left: "12mm",
    },
  });
} finally {
  await browser.close();
}

console.log(`HTML: ${outputHtmlPath}`);
console.log(`PDF: ${outputPdfPath}`);
