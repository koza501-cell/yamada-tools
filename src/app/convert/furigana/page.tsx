import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import FuriganaClient from "./client";

const tool = getToolById("furigana")!;

const faq = [
  { question: "人名も正確に変換できますか？", answer: "一般的な読み方は対応していますが、珍しい読み方は異なる場合があります。" },
  { question: "カタカナで出力できますか？", answer: "はい、ひらがな・カタカナ・ローマ字どれでも出力可能です。" },
  { question: "文章全体を一括変換できますか？", answer: "はい、長文でも一括でふりがなを振れます。" },
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、入力テキストは保存されません。" },
  { question: "ひらがなツールとして使えますか？", answer: "はい、漢字をひらがなに変換するツールとしてご利用いただけます。" },
  { question: "フリガナをカタカナで振れますか？", answer: "はい、出力形式でカタカナを選択すれば、フリガナをカタカナで表示できます。" },
];

// Target keywords (from Search Console data):
// - ふりがなツール (1,241 imp)
// - フリガナツール (302 imp)
// - ふりがなフリツール (110 imp)
// - ひらがなツール (94 imp)
// - ふりがなつーる (92 imp)
// - ふりがな 変換 (89 imp)
// Total: ~5,000+ impressions

export const metadata: Metadata = generateToolMetadata({
  customTitle: "ふりがな変換【瞬時変換】漢字→ひらがな・カタカナ・ローマ字｜無料",
  tool,
  longDescription: "漢字にふりがなを1秒で自動付与！ひらがな・カタカナ・ローマ字3種類に対応。コピペだけで即変換。教育現場・外国人向け資料・名簿作成に人気。無料・登録不要・国内サーバー処理で安心。",
  keywords: [
    'ふりがなツール',
    'フリガナツール', 
    'ふりがな変換',
    'ひらがなツール',
    'ふりがな 変換',
    '漢字 読み方',
    'ルビ 振る',
    '漢字 ふりがな',
    '読み仮名',
    'ふりがな 自動',
    'ルビ 自動付与',
    'カタカナ変換',
    '漢字 ひらがな 変換'
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FuriganaClient />
    </>
  );
}
