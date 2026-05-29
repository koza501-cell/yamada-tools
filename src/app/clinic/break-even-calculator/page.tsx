import { Metadata } from "next";
import BreakEvenCalculatorClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "クリニック損益分岐点・必要患者数シミュレーター｜診療科別に1日の必要患者数を計算 | yamada-tools.jp",
  description: "内科・歯科・整形外科など診療科別の平均診療単価から、損益分岐点売上高と1日に必要な患者数を即計算。クリニック開業医・院長の経営判断と融資申請に。完全無料・登録不要。",
  keywords: ["クリニック 損益分岐点", "必要患者数 計算", "開業医 シミュレーション", "損益分岐点比率", "限界利益率", "診療科別 単価"],
  alternates: { canonical: "https://yamada-tools.jp/clinic/break-even-calculator" },
  openGraph: {
    title: "クリニック損益分岐点・必要患者数シミュレーター",
    description: "診療科別の平均診療単価から損益分岐点と1日に必要な患者数を即計算。完全無料・登録不要。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "クリニック損益分岐点・必要患者数シミュレーター",
      "url": "https://yamada-tools.jp/clinic/break-even-calculator",
      "description": "診療科別の平均診療単価から損益分岐点売上高と1日に必要な患者数を計算。",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "クリニック経営", "item": "https://yamada-tools.jp/clinic" },
        { "@type": "ListItem", "position": 3, "name": "損益分岐点シミュレーター", "item": "https://yamada-tools.jp/clinic/break-even-calculator" }
      ]
    },
    {
      "@type": "HowTo",
      "name": "クリニック損益分岐点の計算方法",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "診療科を選択", "text": "診療科を選択すると業界平均値が自動入力されます。" },
        { "@type": "HowToStep", "position": 2, "name": "月間固定費を入力", "text": "家賃・スタッフ給与・リース料・光熱費などを入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "診療単価を確認", "text": "平均診療単価と月間診療日数を確認・調整します。" },
        { "@type": "HowToStep", "position": 4, "name": "計算する", "text": "「計算する」ボタンをクリックします。" },
        { "@type": "HowToStep", "position": 5, "name": "結果を確認", "text": "損益分岐点売上高と1日必要患者数を確認し、必要に応じて印刷します。" }
      ]
    }
  ]
};

const tool = getToolById("break-even-calculator")!;

export default function BreakEvenCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BreakEvenCalculatorClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
