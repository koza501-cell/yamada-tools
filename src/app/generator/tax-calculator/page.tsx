import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("tax-calculator")!;

const faq = [
  { question: "軽減税率にも対応していますか？", answer: "はい、10%と8%の両方に対応しています。" },
  { question: "端数処理はどうなりますか？", answer: "切り捨て、切り上げ、四捨五入を選択できます。" },
  { question: "複数の金額を一度に計算できますか？", answer: "1つずつの計算となります。合計は手動で計算してください。" },
];

const seoContent = {
  intro: "税込価格から税抜価格、税抜価格から税込価格を計算。10%と8%（軽減税率）に対応しています。",
  useCases: [
    { title: "🛒 買い物", desc: "税込/税抜価格の確認" },
    { title: "📝 見積作成", desc: "消費税額の計算" },
    { title: "🧾 経理処理", desc: "仕入の税額計算" },
    { title: "🍽️ 軽減税率", desc: "8%適用商品の計算" },
  ],
  tips: "飲食料品（外食除く）と新聞は軽減税率8%が適用されます。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "税込価格から税抜価格、税抜価格から税込価格を計算。10%と8%（軽減税率）に対応しています。",
  keywords: ['消費税計算', '税込 税抜', '消費税 計算機', '10% 計算', '8% 計算'],
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
