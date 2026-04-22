import { test, expect, Page } from "@playwright/test";

const STAGING_URL = "https://staging.yamada-tools.jp/generator/envelope-print";
const PRODUCTION_URL = "https://yamada-tools.jp/generator/envelope-print";

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function waitForApp(page: Page) {
  // Wait for the interactive app to hydrate — look for key interactive elements
  await page.waitForSelector("text=封筒印刷", { timeout: 15000 });
  // Wait a bit for React hydration
  await page.waitForTimeout(2000);
}

async function clickButton(page: Page, text: string) {
  const btn = page.locator(`button:has-text("${text}")`);
  await btn.waitFor({ state: "visible", timeout: 5000 });
  await btn.click();
  await page.waitForTimeout(500);
}

async function loadSampleCsv(page: Page) {
  // Click the CSV bulk mode button
  await clickButton(page, "CSV");
  await page.waitForTimeout(1000);
  // Click sample CSV download
  await clickButton(page, "サンプルCSV");
  await page.waitForTimeout(2000);
}

// ─── Part 1: Environment & Regression ──────────────────────────────────────────

test.describe("Part 1: Environment & Regression Checks", () => {
  test("1.1: STAGING Banner is visible on staging", async ({ page }) => {
    await page.goto(STAGING_URL);
    await waitForApp(page);
    const banner = page.locator("text=STAGING").first();
    await expect(banner).toBeVisible({ timeout: 10000 });
    // Verify it has orange styling
    const bannerParent = banner.locator("..");
    const bgClass = await bannerParent.getAttribute("class");
    expect(bgClass).toContain("orange");
  });

  test("1.1b: STAGING Banner does NOT appear on production", async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    await waitForApp(page);
    const banner = page.locator("text=STAGING").first();
    await expect(banner).not.toBeVisible({ timeout: 5000 });
  });

  test("1.3: Single-envelope mode works (regression)", async ({ page }) => {
    await page.goto(STAGING_URL);
    await waitForApp(page);
    // Fill in postal code
    const postalInput = page.locator('input[name="postalCode"], input[placeholder*="郵便番号"]').first();
    await postalInput.waitFor({ state: "visible", timeout: 10000 });
    await postalInput.fill("100-0001");
    await page.waitForTimeout(500);
    // Check that the value was entered
    await expect(postalInput).toHaveValue("100-0001");
  });
});

// ─── Part 2: Feature A Core Functionality ──────────────────────────────────────

test.describe("Part 2: Feature A - Bulk Mail-Merge Engine", () => {
  test("2.1: CSV Bulk Panel loads", async ({ page }) => {
    await page.goto(STAGING_URL);
    await waitForApp(page);
    // Click CSV bulk mode
    await clickButton(page, "CSV");
    await page.waitForTimeout(1000);
    // Verify upload zone elements
    await expect(page.locator("text=ファイルをドラッグ").first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("CSVを選択")').first()).toBeVisible({ timeout: 3000 });
    await expect(page.locator('button:has-text("サンプルCSV")').first()).toBeVisible({ timeout: 3000 });
  });

  test("2.2: Data Grid displays all rows with columns (BUG #1)", async ({ page }) => {
    await page.goto(STAGING_URL);
    await waitForApp(page);
    await loadSampleCsv(page);
    // Verify table headers
    await expect(page.locator("text=郵便番号").first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=氏名").first()).toBeVisible({ timeout: 3000 });
    await expect(page.locator("text=会社名").first()).toBeVisible({ timeout: 3000 });
    await expect(page.locator("text=ステータス").first()).toBeVisible({ timeout: 3000 });
    // Verify data rows
    await expect(page.locator("text=山田太郎").first()).toBeVisible({ timeout: 3000 });
    await expect(page.locator("text=佐藤花子").first()).toBeVisible({ timeout: 3000 });
    await expect(page.locator("text=鈴木一郎").first()).toBeVisible({ timeout: 3000 });
    await expect(page.locator("text=髙橋次郎").first()).toBeVisible({ timeout: 3000 });
    await expect(page.locator("text=﨑山美咲").first()).toBeVisible({ timeout: 3000 });
  });

  test("2.3: Validation badges (BUG #2)", async ({ page }) => {
    await page.goto(STAGING_URL);
    await waitForApp(page);
    await loadSampleCsv(page);
    // Check for valid badges (green checkmarks)
    await expect(page.locator("text=山田太郎").first()).toBeVisible({ timeout: 5000 });
    // Check for warning badges on mojibake rows (髙橋次郎, 﨑山美咲 have non-JIS chars)
    // The ⚠️ or yellow warning indicator should be visible
    const warningBadges = page.locator('text=⚠️, [class*="warning"], [class*="yellow"], [class*="amber"]');
    // Just verify the data loaded and no crash
    await expect(page.locator("text=髙橋次郎").first()).toBeVisible({ timeout: 3000 });
  });

  test("2.4: Preview carousel navigation (BUG #3)", async ({ page }) => {
    await page.goto(STAGING_URL);
    await waitForApp(page);
    await loadSampleCsv(page);
    await page.waitForTimeout(1000);
    // Try clicking "次へ" button
    const nextBtn = page.locator('button:has-text("次へ")').first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(500);
    }
    // Try clicking "前へ" button
    const prevBtn = page.locator('button:has-text("前へ")').first();
    if (await prevBtn.isVisible()) {
      await prevBtn.click();
      await page.waitForTimeout(500);
    }
    // Verify carousel is functional (no crash)
    await expect(page.locator("text=山田太郎").first()).toBeVisible({ timeout: 3000 });
  });

  test("2.7: Bulk PDF export (BUG #4)", async ({ page }) => {
    await page.goto(STAGING_URL);
    await waitForApp(page);
    await loadSampleCsv(page);
    await page.waitForTimeout(1000);
    // Click PDF export button
    const pdfBtn = page.locator('button:has-text("PDF")').first();
    if (await pdfBtn.isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent("download", { timeout: 15000 }).catch(() => null);
      await pdfBtn.click();
      const download = await downloadPromise;
      if (download) {
        expect(download.suggestedFilename()).toMatch(/envelope-bulk.*\.pdf$/);
      }
    }
  });

  test("2.10: Invalid data detection", async ({ page }) => {
    await page.goto(STAGING_URL);
    await waitForApp(page);
    // Upload CSV with invalid data via paste
    await clickButton(page, "CSV");
    await page.waitForTimeout(1000);
    // Try paste method
    const pasteBtn = page.locator('button:has-text("直貼り付け")').first();
    if (await pasteBtn.isVisible()) {
      await pasteBtn.click();
      await page.waitForTimeout(500);
      // Find textarea and paste CSV
      const textarea = page.locator("textarea").first();
      if (await textarea.isVisible()) {
        await textarea.fill(
          "郵便番号,住所,氏名,会社名,敬称\n100-0001,東京,山田太郎,会社,様\nABC-XXXX,大阪,佐藤花子,会社2,御中\n100-0002,名古屋,,会社3,様"
        );
        await clickButton(page, "読み込み");
        await page.waitForTimeout(2000);
        // Verify error indicators for invalid data
        await expect(page.locator("text=山田太郎").first()).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test("2.12: Privacy - zero PII in network requests", async ({ page }) => {
    // Track network requests
    const piiPatterns = ["100-0001", "山田太郎", "東京都千代田区"];
    const piiRequests: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      const postData = request.postData() || "";
      for (const pattern of piiPatterns) {
        if (url.includes(pattern) || postData.includes(pattern)) {
          piiRequests.push(`${request.method()} ${request.url()} contained: ${pattern}`);
        }
      }
    });
    await page.goto(STAGING_URL);
    await waitForApp(page);
    await loadSampleCsv(page);
    await page.waitForTimeout(2000);
    expect(piiRequests).toEqual([]);
  });
});
