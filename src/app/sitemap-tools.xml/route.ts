import { NextResponse } from 'next/server';
import { pdfTools, documentTools, convertTools, imageTools, generatorTools } from '@/config/tools';

export async function GET() {
  const baseUrl = 'https://yamada-tools.jp';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const allTools = [
    ...pdfTools.filter(t => t.available),
    ...documentTools.filter(t => t.available),
    ...convertTools.filter(t => t.available),
    ...imageTools.filter(t => t.available),
    ...generatorTools.filter(t => t.available),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allTools.map(tool => `  <url>
    <loc>${baseUrl}${tool.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
