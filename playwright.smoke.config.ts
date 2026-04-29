import { defineConfig } from "@playwright/test";

export default defineConfig({
  testMatch: "phase4-smoke.spec.ts",
  use: {
    headless: true,
    viewport: { width: 1280, height: 900 },
    actionTimeout: 15000,
  },
  timeout: 60000,
  retries: 0,
  workers: 3,
  reporter: [["list"], ["json", { outputFile: "smoke-results.json" }]],
});
