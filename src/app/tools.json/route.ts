import { NextResponse } from 'next/server';
import { allTools } from '@/config/tools';

export async function GET() {
  const availableTools = allTools.filter(t => t.available);
  
  const toolsData = {
    name: "山田ツール",
    description: "日本国内サーバーで安全に使える無料オンラインツール集",
    url: "https://yamada-tools.jp",
    total_tools: availableTools.length,
    last_updated: new Date().toISOString().split('T')[0],
    categories: [
      { id: "pdf", name: "PDFツール", path: "/pdf" },
      { id: "document", name: "書類作成", path: "/document" },
      { id: "convert", name: "変換ツール", path: "/convert" },
      { id: "image", name: "画像ツール", path: "/image" },
      { id: "generator", name: "計算・生成", path: "/generator" }
    ],
    tools: availableTools.map(tool => ({
      id: tool.id,
      name_ja: tool.nameJa,
      name_en: tool.nameEn,
      description: tool.description,
      category: tool.category,
      url: `https://yamada-tools.jp${tool.path}`,
      icon: tool.icon,
      features: [
        "完全無料",
        "登録不要",
        "日本国内サーバー処理",
        "60分で自動削除"
      ]
    }))
  };

  return NextResponse.json(toolsData, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
