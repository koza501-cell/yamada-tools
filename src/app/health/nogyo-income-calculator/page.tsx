import { Metadata } from "next";
import NogyoClient from "./client";

export const metadata: Metadata = {
  title: "農業所得計算機 — 確定申告・青色申告控除対応 | 山田ツール",
  description:
    "農業の売上・経費から農業所得と確定申告の目安を計算。青色申告65万・10万控除、農業共済金対応。所得税の簡易計算・確定申告必要判定付き。登録不要・完全無料。",
  keywords: [
    "農業所得 計算機",
    "農業 確定申告 計算",
    "青色申告 農業 65万控除",
    "農業収入 経費 所得税",
    "農家 確定申告 必要",
    "農業 所得税 計算機 無料",
    "農業共済 確定申告",
  ],
  alternates: { canonical: "https://yamada-tools.jp/health/nogyo-income-calculator" },
  openGraph: {
    title: "農業所得計算機 — 確定申告・青色申告控除対応",
    description: "農業の売上・経費から所得と所得税を自動計算。青色申告控除・確定申告必要判定付き。無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "農業所得計算機",
      url: "https://yamada-tools.jp/health/nogyo-income-calculator",
      description: "農業の売上・経費から農業所得と所得税を自動計算。青色申告控除・確定申告必要判定対応。",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      provider: { "@type": "Organization", name: "山田ツール", url: "https://yamada-tools.jp" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "農業・暮らし", item: "https://yamada-tools.jp/health" },
        { "@type": "ListItem", position: 3, name: "農業所得計算機", item: "https://yamada-tools.jp/health/nogyo-income-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "農業所得はどう計算しますか？", acceptedAnswer: { "@type": "Answer", text: "農業所得 = 農業収入 + 農業共済金 - 農業経費（種苗費・肥料費・農薬費・動力光熱費・農機具費など）で計算します。青色申告の場合はさらに65万円または10万円の特別控除が受けられます。" } },
        { "@type": "Question", name: "農業所得が48万円を超えると確定申告が必要ですか？", acceptedAnswer: { "@type": "Answer", text: "原則として農業所得が基礎控除（48万円）を超える場合は確定申告が必要です。ただし給与収入などがある場合は別途判断が必要です。" } },
      ],
    },
  ],
};

export default function NogyoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NogyoClient />
    </>
  );
}
