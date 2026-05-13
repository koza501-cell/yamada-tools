#!/usr/bin/env node
/**
 * Scan all live pages from sitemap to find short meta descriptions.
 * Reports any page where <meta name="description"> is under 120 chars.
 */

const https = require('https');

const SITEMAP_INDEX = 'https://staging.yamada-tools.jp/sitemap.xml';
const MIN_LENGTH = 120;
const MAX_LENGTH = 160;
const CONCURRENCY = 8; // parallel requests

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

function extractLocs(xml) {
  const matches = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
  return matches.map((m) => m.replace(/<\/?loc>/g, '').trim());
}

function extractMetaDescription(html) {
  // Match <meta name="description" content="..."> in any order
  const patterns = [
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i,
    /<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1];
  }
  return null;
}

async function checkUrl(url) {
  try {
    const html = await fetchUrl(url);
    const desc = extractMetaDescription(html);
    if (!desc) return { url, length: 0, desc: '(NO META DESCRIPTION FOUND)' };
    return { url, length: desc.length, desc };
  } catch (err) {
    return { url, length: -1, desc: `(ERROR: ${err.message})` };
  }
}

async function processInBatches(urls, batchSize, processor) {
  const results = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    process.stdout.write(`\r   Scanned ${Math.min(i + batchSize, urls.length)}/${urls.length}`);
  }
  console.log('');
  return results;
}

async function main() {
  console.log('=== Meta Description Scanner ===\n');
  console.log('1. Fetching sitemap...');
  const indexXml = await fetchUrl(SITEMAP_INDEX);
  const sitemapUrls = extractLocs(indexXml);

  const allUrls = [];
  for (const sitemapUrl of sitemapUrls) {
    const xml = await fetchUrl(sitemapUrl);
    allUrls.push(...extractLocs(xml));
  }
  const uniqueUrls = [...new Set(allUrls)];
  console.log(`   Total URLs to check: ${uniqueUrls.length}\n`);

  console.log(`2. Checking each page (concurrency: ${CONCURRENCY})...`);
  const results = await processInBatches(uniqueUrls, CONCURRENCY, checkUrl);

  // Categorize
  const tooShort = results.filter((r) => r.length > 0 && r.length < MIN_LENGTH);
  const missing = results.filter((r) => r.length === 0);
  const errors = results.filter((r) => r.length === -1);
  const good = results.filter((r) => r.length >= MIN_LENGTH && r.length <= MAX_LENGTH);
  const tooLong = results.filter((r) => r.length > MAX_LENGTH);

  console.log('\n=== Summary ===');
  console.log(`Good (${MIN_LENGTH}-${MAX_LENGTH} chars):  ${good.length}`);
  console.log(`Too long (>${MAX_LENGTH}):        ${tooLong.length}`);
  console.log(`Too short (<${MIN_LENGTH}):       ${tooShort.length}  ← FIX THESE`);
  console.log(`Missing entirely:        ${missing.length}  ← FIX THESE`);
  console.log(`Errors:                  ${errors.length}`);

  if (tooShort.length > 0) {
    console.log('\n=== TOO SHORT (sorted by length) ===');
    tooShort.sort((a, b) => a.length - b.length);
    tooShort.forEach((r) => {
      console.log(`[${r.length} chars] ${r.url}`);
      console.log(`   "${r.desc}"`);
    });
  }

  if (missing.length > 0) {
    console.log('\n=== MISSING META DESCRIPTION ===');
    missing.forEach((r) => console.log(`   ${r.url}`));
  }

  if (errors.length > 0) {
    console.log('\n=== ERRORS ===');
    errors.forEach((r) => console.log(`   ${r.url}: ${r.desc}`));
  }
}

main().catch((err) => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
