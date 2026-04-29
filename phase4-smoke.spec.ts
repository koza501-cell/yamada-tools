import { test, expect } from "@playwright/test";

// Smoke tests for all 10 Phase 4 migrated routes.
// Each test: load the page, assert a key interactive element is visible.
// If a route crashes (React error, 500, blank page), the assertion will fail.

const BASE = "https://yamada-tools.jp";

const ROUTES: { path: string; label: string; heading: string }[] = [
  { path: "/document/invoice",              label: "invoice",       heading: "請求書作成" },
  { path: "/document/quotation",            label: "quotation",     heading: "見積書作成" },
  { path: "/document/delivery-slip",        label: "delivery-slip", heading: "納品書作成" },
  { path: "/document/receipt",              label: "receipt",       heading: "領収書作成" },
  { path: "/document/cover-letter",         label: "cover-letter",  heading: "送付状作成" },
  { path: "/document/fax-cover",            label: "fax-cover",     heading: "FAX" },
  { path: "/document/business-card",        label: "business-card", heading: "名刺作成" },
  { path: "/generator/nenmatsu-calc",       label: "nenmatsu-calc", heading: "年末調整" },
  { path: "/tax/furusato-nozei-calculator", label: "furusato-nozei", heading: "ふるさと納税" },
  { path: "/generator/envelope-print",      label: "envelope-print", heading: "封筒印刷" },
];

for (const route of ROUTES) {
  test(`smoke: ${route.label} renders without crash`, async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(`${BASE}${route.path}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Page must not return 4xx/5xx
    expect(
      response?.status(),
      `${route.label}: HTTP ${response?.status()}`
    ).toBeLessThan(400);

    // h1 heading must be visible — proves the page rendered (not an error page)
    await expect(
      page.locator(`h1:has-text("${route.heading}")`).first()
    ).toBeVisible({ timeout: 15000 });

    // No React error #31
    const reactChildError = errors.find((e) =>
      e.includes("Objects are not valid as a React child") ||
      e.includes("Minified React error #31")
    );
    expect(
      reactChildError,
      `${route.label}: React error #31 detected`
    ).toBeUndefined();
  });
}
