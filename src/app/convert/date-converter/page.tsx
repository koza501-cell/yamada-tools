import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import DateConverterClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("wareki-seireki")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、データは保存されません。" },
];

const seoContent = {
  intro: "和暦（令和・平成・昭和など）と西暦を相互変換。年号の計算や、書類作成時の日付確認に便利です。",
  useCases: [
    { title: "📝 履歴書", desc: "学歴・職歴の日付変換" },
    { title: "📄 公的書類", desc: "役所への届出書類" },
    { title: "🎂 年齢計算", desc: "生年月日の変換" },
    { title: "📅 歴史確認", desc: "過去の出来事の日付" },
  ],
  tips: "令和は2019年5月1日から、平成は1989年1月8日から始まりました。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】日付変換｜和暦・西暦・曜日計算",
  tool,
  longDescription: "和暦（令和・平成・昭和など）と西暦を相互変換。年号の計算や、書類作成時の日付確認に便利です。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['和暦 西暦 変換', '令和 西暦', '平成 西暦', '年号 変換'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DateConverterClient faq={faq} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
