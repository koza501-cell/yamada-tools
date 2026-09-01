import { Metadata } from "next";
import SolarClient from "./client";

export const metadata: Metadata = {
  title: "太陽光発電 投資回収シミュレーター【中立・無料】全47都道府県対応",
  description: "設置費用・発電量・売電収入から投資回収年数を中立的に計算。全47都道府県の日照時間データ対応。業者の営業資料に頼らない判断を。FIT売電・20年収益試算。",
  keywords: ["太陽光発電 投資回収", "ソーラーパネル シミュレーション", "太陽光 元が取れる", "FIT 売電 計算", "太陽光発電 費用対効果", "発電量 計算"],
  alternates: { canonical: "https://yamada-tools.jp/realestate/solar-simulator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "太陽光発電 投資回収シミュレーター【中立・無料】",
    description: "全47都道府県対応。設置費用・発電量から投資回収年数を中立計算。完全無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "太陽光発電投資回収シミュレーター",
      "url": "https://yamada-tools.jp/realestate/solar-simulator",
      "description": "全47都道府県の日照時間データで太陽光発電の投資回収年数を中立計算。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "不動産", "item": "https://yamada-tools.jp/realestate" },
        { "@type": "ListItem", "position": 3, "name": "太陽光発電シミュレーター", "item": "https://yamada-tools.jp/realestate/solar-simulator" }
      ]
    }
  ]
};

export default function SolarPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SolarClient />
    </>
  );
}
