/**
 * TrustBar route-guard tests.
 * Verifies the component is absent on tool workspace paths and present on marketing pages.
 *
 * Run: npx playwright test --config=playwright.visual.config.ts tests/visual/trustbar.visual.spec.ts
 */
import { test, expect } from '@playwright/test';

test('TrustBar is absent on /document/invoice workspace', async ({ page }) => {
  await page.goto('/document/invoice', { waitUntil: 'domcontentloaded', timeout: 30000 });
  // The 500社 span carries data-citation-needed — present iff TrustBar rendered
  await expect(page.locator('[data-citation-needed]')).toHaveCount(0);
});

test('TrustBar is present on homepage', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  const el = page.locator('[data-citation-needed]');
  await expect(el).toHaveCount(1);
  await expect(el).toHaveText('法人500社以上が利用');
});

test('TrustBar is absent on /pdf/compress workspace', async ({ page }) => {
  await page.goto('/pdf/compress', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await expect(page.locator('[data-citation-needed]')).toHaveCount(0);
});
