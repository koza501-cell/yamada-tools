import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import DeliverySlipClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("delivery-slip")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "納品書を無料で作成。商品の納品時に同封する書類を、簡単な入力だけで作成できます。",
  useCases: [
    { title: "📦 商品納品", desc: "商品発送時の納品書" },
    { title: "🏢 取引先向け", desc: "BtoB取引の納品書" },
    { title: "📝 検収用", desc: "検収確認用の書類" },
    { title: "📁 記録用", desc: "納品履歴の記録" },
  ],
  tips: "請求書と納品書は別々に発行することで、経理処理がスムーズになります。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】納品書作成｜PDF出力対応",
  tool,
  longDescription: "納品書を無料で作成。商品の納品時に同封する書類を、簡単な入力だけで作成できます。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['納品書 作成', '納品書 テンプレート', '納品書 無料', '納品書 フォーマット'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DeliverySlipClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
