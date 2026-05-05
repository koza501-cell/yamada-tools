import { Metadata } from "next";
import TransactionPriceClient from "./client";

export const metadata: Metadata = {
  title: "不動産取引価格チェッカー — 住所で実際の売買価格を確認 | 山田ツール",
  description:
    "住所を入力するだけで近隣の不動産取引価格（実際の売買価格）を確認。土地・マンション・一戸建ての取引相場を㎡単価・坪単価・総額で表示。国土交通省データ使用、完全無料。",
  keywords: [
    "不動産 取引価格 相場",
    "土地 売買価格 調べ方",
    "マンション 相場 確認",
    "不動産 坪単価",
    "取引価格 住所検索",
    "不動産 売却 相場",
    "国土交通省 取引価格",
  ],
  openGraph: {
    title: "不動産取引価格チェッカー — 住所で実際の売買相場を確認",
    description: "住所だけで近隣の不動産実取引価格を確認。㎡単価・坪単価・総額表示。国土交通省データ使用、無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "不動産取引価格チェッカー",
      "url": "https://yamada-tools.jp/realestate/transaction-price",
      "description": "住所を入力するだけで近隣の不動産取引価格を確認できる無料ツール。",
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
        { "@type": "ListItem", "position": 3, "name": "不動産取引価格チェッカー", "item": "https://yamada-tools.jp/realestate/transaction-price" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "取引価格情報とは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "国土交通省が収集・公表している実際の不動産売買取引価格のデータです。土地・建物・マンションなどの実取引に基づくため、売買価格の参考として活用できます。" } },
        { "@type": "Question", "name": "地価公示との違いは？", "acceptedAnswer": { "@type": "Answer", "text": "地価公示は国が定める基準地価（公示価格）であり、実際の取引価格とは異なる場合があります。取引価格情報は実際に売買された価格のため、より市場実態を反映しています。" } },
        { "@type": "Question", "name": "データはどの期間のものですか？", "acceptedAnswer": { "@type": "Answer", "text": "直近約1.5年分（2024年第1四半期〜2025年第2四半期）の取引データを表示しています。" } }
      ]
    }
  ]
};

export default function TransactionPricePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TransactionPriceClient />
    </>
  );
}
