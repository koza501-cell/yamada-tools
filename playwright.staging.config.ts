import { defineConfig } from "@playwright/test";

// Staging health check config.
// Usage: npx playwright test --config=playwright.staging.config.ts
// Run from: frontend/

export default defineConfig({
  testMatch: "tests/staging-health.spec.ts",
  use: {
    headless: true,
    viewport: { width: 1280, height: 900 },
    actionTimeout: 15000,
    // Do not follow auth redirects automatically — we handle auth via headers
    ignoreHTTPSErrors: false,
  },
  timeout: 60000,
  retries: 1,
  workers: 2,
  reporter: [["list"], ["json", { outputFile: "staging-smoke-results.json" }]],
});
