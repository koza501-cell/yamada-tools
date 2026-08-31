import { NextResponse } from 'next/server';
import { generateSitemaps } from '../sitemap';

const baseUrl = 'https://yamada-tools.jp';

export async function GET() {
  const sitemapIds = generateSitemaps();

  const sitemapEntries = sitemapIds
    .map(({ id }) => `  <sitemap>\n    <loc>${baseUrl}/sitemap/${id}.xml</loc>\n  </sitemap>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
