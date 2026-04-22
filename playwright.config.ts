import { defineConfig } from '@playwright/test';
export default defineConfig({
  testMatch: 'feature-a-e2e-test.spec.ts',
  use: {
    headless: true,
    viewport: { width: 1280, height: 900 },
    actionTimeout: 10000,
  },
  timeout: 60000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results.json' }]],
});
