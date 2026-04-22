import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// Check staging
await page.goto('https://staging.yamada-tools.jp/generator/envelope-print', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/staging-page.png', fullPage: true });
const stagingTitle = await page.title();
const stagingBody = await page.evaluate(() => document.body?.innerText?.substring(0, 500));
console.log('=== STAGING ===');
console.log('Title:', stagingTitle);
console.log('Body:', stagingBody);
console.log('URL:', page.url());

// Check for key elements
const buttons = await page.locator('button').allTextContents();
console.log('Buttons:', buttons.slice(0, 20));

await browser.close();
