import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import SalaryCalcClient from "./client";

const tool = getToolById("salary-calc")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "計算結果は正確ですか？", answer: "概算値です。実際の金額は会社の規定や自治体によって異なります。" },
];

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】給与計算｜手取り額シミュレーション",
  tool,
  longDescription: "額面給与から手取り額を計算。社会保険料、所得税、住民税の概算を確認できます。",
  keywords: ['給与計算', '手取り 計算', '年収 手取り', '社会保険料 計算'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SalaryCalcClient />
    </>
  );
}
