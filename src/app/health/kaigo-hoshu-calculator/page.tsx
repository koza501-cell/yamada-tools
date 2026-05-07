import { Metadata } from "next";
import KaigoClient from "./client";

export const metadata: Metadata = {
  title: "介護報酬計算機【2024年改定対応】— 利用者負担・給付額を自動計算 | 山田ツール",
  description: "介護サービスの報酬額を利用者負担と事業者受取額の両方で計算。地域区分・処遇改善加算・2024年改定に対応。登録不要・完全無料。",
  keywords: ["介護報酬 計算機", "介護報酬 2024 改定", "介護サービス 利用者負担 計算", "訪問介護 報酬 単位数", "通所介護 報酬計算", "地域区分 単価", "処遇改善加算 計算"],
  alternates: { canonical: "https://yamada-tools.jp/health/kaigo-hoshu-calculator" },
  openGraph: {
    title: "介護報酬計算機【2024年改定対応】",
    description: "介護サービスの利用者負担・事業者受取額を自動計算。地域区分・加算対応。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "介護報酬計算機",
      "url": "https://yamada-tools.jp/health/kaigo-hoshu-calculator",
      "description": "介護サービスの報酬額を利用者負担と事業者受取額の両方で計算する無料ツール。",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "健康・医療", "item": "https://yamada-tools.jp/health" },
        { "@type": "ListItem", "position": 3, "name": "介護報酬計算機", "item": "https://yamada-tools.jp/health/kaigo-hoshu-calculator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "介護報酬の単位数とは？", "acceptedAnswer": { "@type": "Answer", "text": "介護報酬は各サービスに定められた単位数に地域区分の単価（10〜11.40円）を乗じて計算します。地域ごとに人件費差を調整するために単価が異なります。" } },
        { "@type": "Question", "name": "自己負担割合はどうやって決まる？", "acceptedAnswer": { "@type": "Answer", "text": "原則1割負担ですが、一定以上の所得がある方は2割、特に高所得の方は3割負担となります。介護保険の認定通知書に記載されています。" } },
        { "@type": "Question", "name": "処遇改善加算とは？", "acceptedAnswer": { "@type": "Answer", "text": "介護職員の処遇（賃金）改善のために事業者に加算される報酬です。2024年改定では処遇改善加算（Ⅰ）が最大13.7%加算されます。" } }
      ]
    }
  ]
};

export default function KaigoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KaigoClient />
    </>
  );
}
