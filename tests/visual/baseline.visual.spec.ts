/**
 * Phase 0 visual baseline snapshots.
 * Run BEFORE any code changes to establish the reference screenshots.
 * Run AFTER each phase to detect regressions.
 *
 * npx playwright test --config=playwright.visual.config.ts --update-snapshots
 */
import { test, expect } from '@playwright/test';

// Override per-test timeout — homepage is heavy
test.setTimeout(120000);

const PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'invoice', path: '/document/invoice' },
  { name: 'pdf-compress', path: '/pdf/compress' },
  { name: 'hanko', path: '/generator/hanko' },
  { name: 'bank-format', path: '/convert/bank-format' },
];

async function stabilise(pw: import('@playwright/test').Page) {
  // Wait for DOM content + major network requests
  await pw.waitForLoadState('domcontentloaded');
  // Give JS components 3.5 s to hydrate + settle animations
  await pw.waitForTimeout(3500);
  // Freeze ALL animations and dynamic content
  await pw.evaluate(() => {
    // 1. Pause CSS animations
    const style = document.createElement('style');
    style.id = '__pw_freeze';
    style.textContent = [
      '*, *::before, *::after {',
      '  animation-play-state: paused !important;',
      '  animation-duration: 0s !important;',
      '  animation-delay: 0s !important;',
      '  transition-duration: 0s !important;',
      '  transition-delay: 0s !important;',
      '}',
    ].join('\n');
    document.head.appendChild(style);

    // 2. Kill all timers (stops StatsCounter, carousels, etc.)
    const highId = window.setTimeout(() => {}, 0) as unknown as number;
    for (let i = 0; i <= highId; i++) {
      window.clearTimeout(i);
      window.clearInterval(i);
    }

    // 3. Hide floating/overlapping elements
    const hide = [
      '[data-testid="install-prompt"]',
      '.pwa-install-prompt',
      '.fixed.bottom-0.z-50',
      '[class*="pwa"]',
      '[class*="install"]',
    ];
    hide.forEach(s =>
      document.querySelectorAll(s).forEach(el => ((el as HTMLElement).style.display = 'none'))
    );
  });
  // Brief pause after freezing to let DOM settle
  await pw.waitForTimeout(500);
}

for (const page of PAGES) {
  test(`baseline: ${page.name} desktop`, async ({ page: pw }) => {
    await pw.goto(page.path, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await stabilise(pw);
    await expect(pw).toHaveScreenshot(`${page.name}-desktop.png`, {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.02,
      timeout: 15000,
    });
  });

  test(`baseline: ${page.name} mobile`, async ({ page: pw }) => {
    await pw.setViewportSize({ width: 375, height: 812 });
    await pw.goto(page.path, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await stabilise(pw);
    await expect(pw).toHaveScreenshot(`${page.name}-mobile.png`, {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.02,
      timeout: 15000,
    });
  });
}
