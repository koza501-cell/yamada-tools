import { test, expect } from "@playwright/test";

// Staging health smoke test.
// Verifies that staging.yamada-tools.jp is reachable, the auth gate works correctly,
// and key Phase 5 trust surfaces render without error.
//
// Run: npx playwright test --config=playwright.staging.config.ts
// Or via cron: see docs/STAGING.md

const BASE = "https://staging.yamada-tools.jp";

// Basic auth credentials for staging (yamada:staging2026)
const AUTH_HEADER = "Basic eWFtYWRhOnN0YWdpbmcyMDI2";

// Helper: craft an authorized URL using standard HTTP Basic Auth header
// We pass auth as a custom header rather than in the URL (Chrome dropped user:pass@host support)
async function authorizedGoto(page: import("@playwright/test").Page, path: string) {
  await page.setExtraHTTPHeaders({ Authorization: AUTH_HEADER });
  return page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 30000 });
}

// --- Auth gate ---

test("staging: unauthenticated request returns 401", async ({ page }) => {
  const res = await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
  expect(res?.status(), "staging must require auth").toBe(401);
});

// --- Core pages ---
// heading: first visible text inside h1. Confirmed against actual SSR HTML 2026-04-29.
// - homepage h1: "日本のビジネスに特化した..." (SEO title with tool count)
// - business h1: "情報システム部門も安心の..." (not "運営会社" — that is an h2 in the body)
// - transparency/contact h1 confirmed correct.

const ROUTES: { path: string; label: string; heading: string }[] = [
  { path: "/",                      label: "homepage",      heading: "日本のビジネスに特化" },
  { path: "/about/contact",         label: "contact",       heading: "お問い合わせ" },
  { path: "/about/transparency",    label: "transparency",  heading: "運営方針とセキュリティ" },
  { path: "/about/business",        label: "business",      heading: "情報システム部門" },
];

for (const route of ROUTES) {
  test(`staging: ${route.label} renders without crash`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
    page.on("pageerror", (err) => errors.push(err.message));

    const res = await authorizedGoto(page, route.path);

    expect(
      res?.status(),
      `${route.label}: expected HTTP 2xx, got ${res?.status()}`
    ).toBeLessThan(400);

    await expect(
      page.locator(`h1:has-text("${route.heading}")`).first()
    ).toBeVisible({ timeout: 15000 });

    const reactErr = errors.find((e) =>
      e.includes("Objects are not valid as a React child") ||
      e.includes("Minified React error #31")
    );
    expect(reactErr, `${route.label}: React error #31 detected`).toBeUndefined();
  });
}

// --- Phase 5 specific assertions ---

test("staging: homepage TrustBar shows updated wording", async ({ page }) => {
  await authorizedGoto(page, "/");
  await expect(page.locator("text=多くの法人様にご利用いただいています").first()).toBeVisible({ timeout: 10000 });
});

test("staging: contact form inputs are visible", async ({ page }) => {
  await authorizedGoto(page, "/about/contact");
  await expect(page.locator("#name")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#email")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#subject")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("#message")).toBeVisible({ timeout: 10000 });
  await expect(page.locator("button[type=submit]")).toBeVisible({ timeout: 10000 });
});

test("staging: transparency page has TrustBadges and CompanyLogosWall", async ({ page }) => {
  await authorizedGoto(page, "/about/transparency");
  // Use element-specific selector — "text=SSL" also matches RSC JSON script tags (not visible)
  await expect(page.locator("span:has-text('SSL/TLS暗号化')").first()).toBeVisible({ timeout: 10000 });
  // CompanyLogosWall placeholder (empty state)
  await expect(page.locator("text=掲載企業募集中").first()).toBeVisible({ timeout: 10000 });
});
