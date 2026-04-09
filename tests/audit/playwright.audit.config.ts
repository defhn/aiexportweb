import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./",
  testMatch: "**/site-audit.spec.ts",
  workers: 1,
  retries: 0,           // spec 内部自己重试，Playwright层不重试
  timeout: 180_000,     // 每个 test 最长3分钟
  reporter: [
    // list reporter = 每个 test 完成立刻打印一行，最直观
    ["list", { printSteps: true }],
  ],
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "off",
    trace: "off",
    navigationTimeout: 60_000,
    actionTimeout: 30_000,
  },
  projects: [
    {
      name: "chromium-audit",
      use: {
        ...devices["Desktop Chrome"],
        headless: false,           // ← 有头，你能看到浏览器在操作
        viewport: { width: 1440, height: 900 },
        // 浏览器窗口慢一点，方便观察
        launchOptions: { slowMo: 100 },
      },
    },
  ],
});
