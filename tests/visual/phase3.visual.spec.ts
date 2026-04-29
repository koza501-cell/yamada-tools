/**
 * Phase 3 visual tests: H1 compression, popular tools grid, returning-user reorder, category nav.
 * Run: npx playwright test --config=playwright.visual.config.ts tests/visual/phase3.visual.spec.ts
 */
import { test, expect } from '@playwright/test';

test('H1 renders at most 2 lines at 1440px', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  const h1 = page.locator('h1').first();
  await expect(h1).toBeVisible();
  const box = await h1.boundingBox();
  expect(box).not.toBeNull();
  // text-jp-h1 max = 2.5rem = 40px; line-height 1.4 => 2 lines = 112px; allow small rounding
  expect(box!.height).toBeLessThanOrEqual(120);
});

test('H1 renders at most 2 lines at 375px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  const h1 = page.locator('h1').first();
  await expect(h1).toBeVisible();
  const box = await h1.boundingBox();
  expect(box).not.toBeNull();
  // text-jp-h1 min = 1.75rem = 28px; 2 lines = 78px; allow generous rounding
  expect(box!.height).toBeLessThanOrEqual(90);
});

test('Popular tools grid shows 8 cards above SearchBar at 1280px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  // Desktop grid (hidden sm:grid) has 8 link cards
  const grid = page.locator('.hidden.sm\\:grid');
  await expect(grid).toBeVisible();
  const cards = grid.locator('a[href]');
  await expect(cards).toHaveCount(8);
});

test('Category rail visible and shows categories at lg viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  const rail = page.locator('aside nav');
  await expect(rail).toBeVisible();
  await expect(rail.locator('text=PDF')).toBeVisible();
});

test('Category chips visible at 375px (mobile)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  // The chip strip should be visible (lg:hidden)
  await expect(page.locator('text=PDF').first()).toBeVisible();
});

test('Returning user sees recent tools section above hero H1', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  // Seed localStorage with a recent tool
  await page.evaluate(() => {
    localStorage.setItem(
      'yamada_recent_tools',
      JSON.stringify([{ path: '/pdf/compress', name: 'PDF\u5727\u7e2e', icon: '\ud83d\udcc4', timestamp: Date.now() }])
    );
  });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
  const recentHeading = page.locator('text=\u6700\u8fd1\u4f7f\u3063\u305f\u30c4\u30fc\u30eb');
  const h1 = page.locator('h1').first();
  await expect(recentHeading).toBeVisible();
  const recentBox = await recentHeading.boundingBox();
  const h1Box = await h1.boundingBox();
  expect(recentBox).not.toBeNull();
  expect(h1Box).not.toBeNull();
  expect(recentBox!.y).toBeLessThan(h1Box!.y);
});
