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
];

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】ふりがなツール｜漢字にルビを一瞬で自動付与｜コピペOK",
  tool,
  longDescription: "漢字にふりがな（ルビ）を自動で振る無料ツール。文章をコピペするだけで一瞬でルビ付き文章に変換。教育現場・外国人向け資料作成に最適。登録不要・日本国内処理で安心。",
  keywords: ['ふりがなツール', 'ふりがな変換', '漢字 読み方', 'ルビ 振る', '漢字 ふりがな', '読み仮名', 'ふりがな 自動', 'ルビ 自動付与'],
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
