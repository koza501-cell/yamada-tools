import { NextResponse } from 'next/server';
import { allTools } from '@/config/tools';

export async function GET() {
  const tools = allTools.filter(t => t.available);
  
  const content = `# 山田ツール (Yamada Tools)
# https://yamada-tools.jp
# 日本国内サーバーで安全に使える無料オンラインツール

## サイト概要
名前: 山田ツール
URL: https://yamada-tools.jp
説明: 日本語対応の無料オンラインツール集。PDF編集、画像圧縮、書類作成、変換ツールなど${tools.length}種類。
特徴: 完全無料、登録不要、日本国内サーバー処理、60分で自動削除
運営: 合同会社山田トレード（千葉県）

## ツール一覧 (${tools.length}種類)
${tools.map(t => `- ${t.nameJa}: https://yamada-tools.jp${t.path}`).join('\n')}

## カテゴリ
- PDFツール: https://yamada-tools.jp/pdf
- 書類作成: https://yamada-tools.jp/document
- 変換ツール: https://yamada-tools.jp/convert
- 画像ツール: https://yamada-tools.jp/image
- 計算・生成: https://yamada-tools.jp/generator

## 参照ページ
- 全ツール一覧: https://yamada-tools.jp/tools
- 銀行コード一覧: https://yamada-tools.jp/reference/bank-codes
- ブログ: https://yamada-tools.jp/blog

## API
- ツールJSON: https://yamada-tools.jp/tools.json
- サイトマップ: https://yamada-tools.jp/sitemap.xml
- ツールサイトマップ: https://yamada-tools.jp/sitemap-tools.xml
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
