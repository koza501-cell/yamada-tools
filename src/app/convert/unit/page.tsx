import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import UnitConverterClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("unit-converter")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、データは保存されません。" },
];

const seoContent = {
  intro: "長さ、重さ、面積、体積など様々な単位を相互変換。坪・畳など日本独自の単位にも対応しています。",
  useCases: [
    { title: "🏠 不動産", desc: "坪から平米への変換" },
    { title: "📏 長さ", desc: "cm、inch、尺の変換" },
    { title: "⚖️ 重さ", desc: "kg、ポンドの変換" },
    { title: "🧊 体積", desc: "リットル、ガロンの変換" },
  ],
  tips: "1坪 = 約3.306㎡、1畳 = 約1.62㎡です。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】単位変換｜長さ・重さ・面積を一発変換",
  tool,
  longDescription: "長さ、重さ、面積、体積など様々な単位を相互変換。坪・畳など日本独自の単位にも対応しています。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['単位変換', '坪 平米', '単位 計算', '長さ 変換'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UnitConverterClient faq={faq} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
