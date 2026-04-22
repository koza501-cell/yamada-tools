import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// Check production
await page.goto('https://yamada-tools.jp/generator/envelope-print', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(5000);
const prodTitle = await page.title();
const prodBody = await page.evaluate(() => document.body?.innerText?.substring(0, 800));
console.log('=== PRODUCTION ===');
console.log('Title:', prodTitle);
console.log('Body text starts:', prodBody?.substring(0, 200));
console.log('URL:', page.url());

// Check for staging banner
const hasStaging = await page.locator('text=STAGING').count();
console.log('STAGING text count:', hasStaging);

const buttons = await page.locator('button').allTextContents();
console.log('Button count:', buttons.length);
console.log('First 5 buttons:', buttons.slice(0, 5));

await browser.close();
