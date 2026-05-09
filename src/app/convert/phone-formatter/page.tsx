import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import PhoneFormatterClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("phone-formatter")!;

const faq = [
  { question: "携帯電話にも対応していますか？", answer: "はい、090/080/070で始まる携帯番号に対応しています。" },
  { question: "市外局番は自動判定されますか？", answer: "はい、市外局番を自動判定して正しく区切ります。" },
  { question: "0120などのフリーダイヤルは？", answer: "フリーダイヤルやナビダイヤルにも対応しています。" },
];

const seoContent = {
  intro: "電話番号をハイフン付きの正しい形式に自動整形。市外局番と市内局番を正確に区切ります。",
  useCases: [
    { title: "📝 データ整理", desc: "バラバラな形式の電話番号を統一" },
    { title: "📊 Excel作業", desc: "電話番号リストの整形" },
    { title: "📱 連絡先整備", desc: "正しい形式で保存" },
    { title: "🏢 顧客管理", desc: "顧客データの電話番号整備" },
  ],
  tips: "携帯電話、固定電話、フリーダイヤルなど、日本の電話番号形式に対応しています。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】電話番号フォーマット｜ハイフン自動挿入",
  tool,
  longDescription: "電話番号をハイフン付きの正しい形式に自動整形。市外局番と市内局番を正確に区切ります。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['電話番号 フォーマット', '電話番号 ハイフン', '電話番号 整形', '電話番号 変換'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PhoneFormatterClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
