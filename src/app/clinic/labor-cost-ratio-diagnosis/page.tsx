import { Metadata } from "next";
import LaborCostRatioClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "クリニック人件費率診断ツール｜厚労省データと比較・改善提案つき | yamada-tools.jp",
  description: "クリニックの人件費率・労働分配率を厚生労働省「医療経済実態調査」のデータと比較。個人クリニック24.6%、医療法人49.0%の業界平均と即比較し改善提案を表示。完全無料。",
  keywords: ["クリニック 人件費率", "労働分配率 医療", "医療経済実態調査", "クリニック経営指標", "人件費 適正", "1人あたり給与費"],
  alternates: { canonical: "https://yamada-tools.jp/clinic/labor-cost-ratio-diagnosis" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "クリニック人件費率診断ツール",
      "description": "クリニックの人件費率・労働分配率を厚労省データと比較して診断",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "url": "https://yamada-tools.jp/clinic/labor-cost-ratio-diagnosis",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "クリニック経営", "item": "https://yamada-tools.jp/clinic" },
        { "@type": "ListItem", "position": 3, "name": "人件費率診断ツール", "item": "https://yamada-tools.jp/clinic/labor-cost-ratio-diagnosis" },
      ],
    },
    {
      "@type": "HowTo",
      "name": "クリニック人件費率の診断方法",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "クリニック形態を選択", "text": "個人クリニック・医療法人、有床・無床、処方形態を選択します" },
        { "@type": "HowToStep", "position": 2, "name": "月間医業収入と変動費を入力", "text": "月間医業収入と医薬品・材料費などの変動費を入力します" },
        { "@type": "HowToStep", "position": 3, "name": "スタッフ構成を入力", "text": "職種・人数・平均月給を入力します" },
        { "@type": "HowToStep", "position": 4, "name": "診断するをクリック", "text": "「診断する」ボタンをクリックして計算を実行します" },
        { "@type": "HowToStep", "position": 5, "name": "結果を確認", "text": "人件費率・労働分配率と厚労省データとの比較結果を確認します" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "クリニックの人件費率の適正値は？",
          "acceptedAnswer": { "@type": "Answer", "text": "厚生労働省「医療経済実態調査」によると、個人クリニック（入院なし）の人件費率は平均24.6%、医療法人（入院なし）は平均49.0%です。" },
        },
        {
          "@type": "Question",
          "name": "人件費率と労働分配率の違いは？",
          "acceptedAnswer": { "@type": "Answer", "text": "人件費率は「人件費÷医業収入×100」、労働分配率は「人件費÷限界利益×100」です。" },
        },
      ],
    },
  ],
};

const tool = getToolById("labor-cost-ratio")!;

export default function LaborCostRatioDiagnosisPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LaborCostRatioClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
