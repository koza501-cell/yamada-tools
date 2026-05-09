import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import PostcodeClient from "./client";
import AdFreeZone from "@/components/AdFreeZone";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("postcode")!;

const faq = [
  { question: "最新のデータですか？", answer: "日本郵便の公開データを定期的に更新しています。" },
  { question: "番地まで検索できますか？", answer: "町名までの検索となります。番地は郵便番号に影響しません。" },
  { question: "事業所の個別番号も検索できますか？", answer: "大口事業所の個別郵便番号にも対応しています。" },
];

const seoContent = {
  intro: "郵便番号から住所を検索、または住所から郵便番号を検索。日本郵便のデータを使用した正確な情報を提供します。",
  useCases: [
    { title: "📝 書類作成", desc: "請求書や送付状の住所入力" },
    { title: "📦 発送業務", desc: "配送先の郵便番号確認" },
    { title: "🏠 住所確認", desc: "引越し先の郵便番号を検索" },
    { title: "📊 データ整備", desc: "住所データの郵便番号補完" },
  ],
  tips: "番地まで入力すると、より正確な郵便番号が検索できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】郵便番号検索｜住所から番号を逆引き",
  tool,
  longDescription: "郵便番号から住所を検索、または住所から郵便番号を検索。日本郵便のデータを使用した正確な情報を提供します。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ['郵便番号検索', '郵便番号 住所', '住所 郵便番号', '〒検索', '郵便番号 調べる'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AdFreeZone><PostcodeClient faq={faq} /></AdFreeZone>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
