import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  snapshotDir: './tests/visual/__snapshots__',
  // Existing e2e tests remain on the original config
  testMatch: '**/*.visual.spec.ts',
  use: {
    baseURL: 'http://localhost:3002',
    headless: true,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 15000,
    // Stabilise animations before screenshots
    launchOptions: {
      args: ['--force-prefers-reduced-motion'],
    },
  },
  timeout: 60000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'docs/audits/playwright-report', open: 'never' }]],
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'], viewport: { width: 375, height: 812 } },
    },
  ],
});
