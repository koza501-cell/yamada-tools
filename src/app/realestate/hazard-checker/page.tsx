import { Metadata } from "next";
import HazardClient from "./client";

export const metadata: Metadata = {
  title: "ハザードマップチェッカー — 住所で洪水・土砂・津波リスクを確認 | 山田ツール",
  description:
    "住所を入力するだけで洪水・土砂災害・液状化・津波・高潮の5つのリスクを一括確認。国土交通省データ使用。完全無料・登録不要。",
  keywords: [
    "ハザードマップ 調べ方",
    "洪水リスク 確認",
    "土砂災害 危険区域",
    "液状化 リスク",
    "津波 浸水",
    "ハザードマップ 住所検索",
    "防災 不動産",
  ],
  openGraph: {
    title: "ハザードマップチェッカー — 5つの災害リスクを一括確認",
    description: "住所だけで洪水・土砂・液状化・津波・高潮リスクを即座に確認。国土交通省データ使用、無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "ハザードマップチェッカー",
      "url": "https://yamada-tools.jp/realestate/hazard-checker",
      "description": "住所を入力するだけで5種類の災害リスクを一括確認できる無料ツール。",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "不動産", "item": "https://yamada-tools.jp/realestate" },
        { "@type": "ListItem", "position": 3, "name": "ハザードマップチェッカー", "item": "https://yamada-tools.jp/realestate/hazard-checker" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "ハザードマップとは？", "acceptedAnswer": { "@type": "Answer", "text": "自然災害（洪水・土砂災害・津波など）が発生した際に被害が想定される区域を示した地図です。不動産購入や賃貸の際に必ず確認すべき情報です。" } },
        { "@type": "Question", "name": "液状化とは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "地震の振動により地盤が液体のようになる現象です。砂地盤や埋立地で起きやすく、建物の傾きや沈下の原因になります。" } },
        { "@type": "Question", "name": "土砂災害警戒区域と特別警戒区域の違いは？", "acceptedAnswer": { "@type": "Answer", "text": "警戒区域（イエローゾーン）は住民への情報伝達・避難が必要な区域。特別警戒区域（レッドゾーン）はさらに危険で、建築制限があります。" } }
      ]
    }
  ]
};

export default function HazardPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HazardClient />
    </>
  );
}
