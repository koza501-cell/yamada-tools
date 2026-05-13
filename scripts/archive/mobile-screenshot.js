const { chromium, devices } = require('playwright');
const path = require('path');

const URL = 'http://localhost:3003/health/ideal-weight-calculator';
const OUT = path.join(__dirname, 'screenshots');

const DEVICES = [
  { name: 'iPhone SE',     device: devices['iPhone SE']     },
  { name: 'iPhone 14 Pro', device: devices['iPhone 14 Pro'] },
  { name: 'Pixel 7',       device: devices['Pixel 7']       },
];

(async () => {
  for (const { name, device } of DEVICES) {
    const vw = device.viewport.width;
    console.log(`\n=== ${name} (${vw}x${device.viewport.height}) ===`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ ...device });
    const page = await context.newPage();

    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1500);

    // ── Form screenshot (viewport only) ──
    const formFile = `${OUT}/mobile-form-${name.replace(/ /g, '_')}.png`;
    await page.screenshot({ path: formFile, fullPage: false });
    console.log(`  Form saved: ${formFile}`);

    // ── Layout checks BEFORE clicking (elements still in viewport) ──
    const checks = {
      '性別ボタン 均等幅・フルwidth': async () => {
        const btn = page.locator('button:has-text("男性")');
        const box = await btn.boundingBox();
        return box && box.width > vw * 0.35;
      },
      '入力フィールドが縦1列': async () => {
        const inputs = page.locator('input[type="number"]');
        const count = await inputs.count();
        if (count < 2) return false;
        const b0 = await inputs.nth(0).boundingBox();
        const b1 = await inputs.nth(1).boundingBox();
        return b0 && b1 && Math.abs(b0.y - b1.y) > 20;
      },
      'input幅がほぼフルwidth': async () => {
        const input = page.locator('input[type="number"]').first();
        const box = await input.boundingBox();
        return box && box.width > vw * 0.6;
      },
      '判定するボタン フルwidth': async () => {
        const btn = page.locator('button:has-text("判定する")');
        const box = await btn.boundingBox();
        return box && box.width > vw * 0.68;
      },
      '判定するボタン 高さ48px以上': async () => {
        const btn = page.locator('button:has-text("判定する")');
        const box = await btn.boundingBox();
        return box && box.height >= 48;
      },
    };

    let allPass = true;
    for (const [label, fn] of Object.entries(checks)) {
      let pass = false;
      let detail = '';
      try {
        // Get raw value for debug output
        if (label.includes('ボタン') && !label.includes('高さ')) {
          const selector = label.includes('性別') ? 'button:has-text("男性")' : 'button:has-text("判定する")';
          const box = await page.locator(selector).boundingBox();
          detail = box ? ` (width=${Math.round(box.width)}px, threshold=${Math.round(vw * (label.includes('性別') ? 0.35 : 0.75))}px)` : ' (null)';
        }
        pass = await fn();
      } catch(e) { detail = ` (${e.message.slice(0,40)})`; }
      const mark = pass ? '✓' : '✗';
      if (!pass) allPass = false;
      console.log(`  ${mark} ${label}${detail}`);
    }

    // ── Fill and submit ──
    await page.fill('input[placeholder="例: 165"]', '170');
    await page.fill('input[placeholder="例: 60"]',  '75');
    const waistInput = page.locator('input[placeholder="例: 80"]');
    if (await waistInput.count()) await waistInput.fill('90');
    const fatInput = page.locator('input[placeholder="例: 22"]');
    if (await fatInput.count()) await fatInput.fill('22');

    await page.click('button:has-text("判定する")');
    await page.waitForTimeout(1500);

    // ── Scroll to result section (instant, bypassing smooth animation) ──
    await page.evaluate(() => {
      const el = document.getElementById('ideal-result');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(300);

    // ── Result viewport screenshot (result section in view) ──
    const resultViewportFile = `${OUT}/mobile-result-viewport-${name.replace(/ /g, '_')}.png`;
    await page.screenshot({ path: resultViewportFile, fullPage: false });
    console.log(`  Result viewport saved: ${resultViewportFile}`);

    // ── Full-page result screenshot ──
    const resultFile = `${OUT}/mobile-result-${name.replace(/ /g, '_')}.png`;
    await page.screenshot({ path: resultFile, fullPage: true });
    console.log(`  Result saved: ${resultFile}`);

    if (allPass) console.log('  => ALL CHECKS PASSED');
    else console.log('  => SOME CHECKS FAILED');

    await browser.close();
  }
  console.log('\nDone.');
})();
