#!/usr/bin/env node
/**
 * Auto-IndexNow submission script for yamada-tools.jp
 * 
 * Fetches all URLs from sitemap and submits to IndexNow API.
 * Run after every deployment: node scripts/submit-indexnow.js
 */

const https = require('https');

const CONFIG = {
  host: 'yamada-tools.jp',
  key: '79e4093f1b05bc8b935a46a1d65621de30b2cf2820659df7cc6ff2016b4829c4',
  keyLocation: 'https://yamada-tools.jp/79e4093f1b05bc8b935a46a1d65621de30b2cf2820659df7cc6ff2016b4829c4.txt',
  sitemapIndex: 'https://yamada-tools.jp/sitemap.xml',
  indexnowEndpoint: 'https://api.indexnow.org/indexnow',
  batchSize: 10000, // IndexNow max per request
};

// Fetch URL and return body as string
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
      });
    }).on('error', reject);
  });
}

// Extract <loc> URLs from sitemap XML
function extractLocs(xml) {
  const matches = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
  return matches.map((m) => m.replace(/<\/?loc>/g, '').trim());
}

// Submit a batch of URLs to IndexNow
function submitBatch(urls) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: CONFIG.host,
      key: CONFIG.key,
      keyLocation: CONFIG.keyLocation,
      urlList: urls,
    });

    const req = https.request(
      CONFIG.indexnowEndpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({ status: res.statusCode, body: data });
        });
      }
    );

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('=== Auto-IndexNow Submission ===');
  console.log(`Host: ${CONFIG.host}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  try {
    // Step 1: Fetch sitemap index
    console.log('1. Fetching sitemap index...');
    const indexXml = await fetchUrl(CONFIG.sitemapIndex);
    const sitemapUrls = extractLocs(indexXml);
    console.log(`   Found ${sitemapUrls.length} sub-sitemaps`);

    // Step 2: Fetch each sub-sitemap and collect all URLs
    console.log('\n2. Fetching sub-sitemaps...');
    const allUrls = [];
    for (const sitemapUrl of sitemapUrls) {
      const xml = await fetchUrl(sitemapUrl);
      const urls = extractLocs(xml);
      console.log(`   ${sitemapUrl}: ${urls.length} URLs`);
      allUrls.push(...urls);
    }

    // Deduplicate
    const uniqueUrls = [...new Set(allUrls)];
    console.log(`\n   Total unique URLs: ${uniqueUrls.length}`);

    if (uniqueUrls.length === 0) {
      console.log('\nNo URLs found. Exiting.');
      process.exit(1);
    }

    // Step 3: Submit in batches
    console.log('\n3. Submitting to IndexNow...');
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < uniqueUrls.length; i += CONFIG.batchSize) {
      const batch = uniqueUrls.slice(i, i + CONFIG.batchSize);
      const batchNum = Math.floor(i / CONFIG.batchSize) + 1;
      const totalBatches = Math.ceil(uniqueUrls.length / CONFIG.batchSize);

      try {
        const result = await submitBatch(batch);
        if (result.status >= 200 && result.status < 300) {
          console.log(`   Batch ${batchNum}/${totalBatches}: ${batch.length} URLs - HTTP ${result.status} ✓`);
          successCount += batch.length;
        } else {
          console.log(`   Batch ${batchNum}/${totalBatches}: HTTP ${result.status} ✗`);
          console.log(`   Response: ${result.body}`);
          failCount += batch.length;
        }
      } catch (err) {
        console.log(`   Batch ${batchNum}/${totalBatches}: ERROR - ${err.message}`);
        failCount += batch.length;
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Submitted: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Done: ${new Date().toISOString()}`);

    process.exit(failCount > 0 ? 1 : 0);
  } catch (err) {
    console.error('\nFATAL ERROR:', err.message);
    process.exit(1);
  }
}

main();
