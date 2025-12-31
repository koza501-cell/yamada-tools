import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("quotation")!;

const faq = [
  { question: "消費税は自動計算されますか？", answer: "はい、10%と8%（軽減税率）に対応し、自動計算されます。" },
  { question: "会社のロゴは入れられますか？", answer: "はい、ロゴ画像をアップロードして見積書に配置できます。" },
  { question: "見積番号は自動で振られますか？", answer: "自動採番と手動入力の両方に対応しています。" },
];

const seoContent = {
  intro: "見積書を無料で作成。商品名、数量、単価を入力するだけで、消費税も自動計算。PDF出力でそのまま印刷・メール送信できます。",
  useCases: [
    { title: "💼 営業活動", desc: "商談後すぐに見積書を作成" },
    { title: "🏢 取引先対応", desc: "見積依頼に迅速に回答" },
    { title: "📧 メール送信", desc: "PDFでそのまま添付" },
    { title: "🖨️ 印刷提出", desc: "紙で提出する場合も対応" },
  ],
  tips: "会社情報や振込先はブラウザに保存されるので、2回目以降は自動入力されます。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "見積書を無料で作成。商品名、数量、単価を入力するだけで、消費税も自動計算。PDF出力でそのまま印刷・メール送信できます。",
  keywords: ['見積書 作成', '見積書 無料', '見積書 テンプレート', '見積書 PDF', '見積書 フォーマット'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPage tool={tool} faq={faq} seoContent={seoContent} />
    </>
  );
}
