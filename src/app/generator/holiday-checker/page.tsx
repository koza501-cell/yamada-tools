import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import HolidayCheckerClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("holiday-checker")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "指定した日付が祝日かどうかを確認。年間の祝日一覧や、営業日計算にも対応しています。",
  useCases: [
    { title: "📅 スケジュール", desc: "予定日が祝日か確認" },
    { title: "🏢 営業日計算", desc: "納期の営業日を計算" },
    { title: "📆 カレンダー", desc: "年間祝日の確認" },
    { title: "✈️ 旅行計画", desc: "連休の確認" },
  ],
  tips: "振替休日や国民の休日も自動で判定されます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】祝日判定｜日本の祝日チェック",
  tool,
  longDescription: "指定した日付が祝日かどうかを確認。年間の祝日一覧や、営業日計算にも対応しています。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['祝日 確認', '祝日 カレンダー', '営業日 計算', '祝日 一覧'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HolidayCheckerClient faq={faq} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
