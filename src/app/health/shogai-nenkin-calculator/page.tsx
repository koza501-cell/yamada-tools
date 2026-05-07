import { Metadata } from "next";
import ShogaiNenkinClient from "./client";

export const metadata: Metadata = {
  title: "障害年金 受給額 簡易計算機【等級別・基礎年金・厚生年金対応】| 山田ツール",
  description:
    "障害基礎年金・障害厚生年金の受給額を障害等級・加入月数・子の人数から計算。申請前の目安確認に。非課税所得・初診日証明の注意事項も掲載。無料・登録不要。",
  keywords: [
    "障害年金 計算機",
    "障害基礎年金 受給額",
    "障害厚生年金 計算",
    "障害年金 等級別 金額",
    "障害年金 申請 目安",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/health/shogai-nenkin-calculator",
  },
  openGraph: {
    title: "障害年金 受給額 簡易計算機【等級別・基礎年金・厚生年金対応】",
    description:
      "障害等級・加入状況から障害年金の受給額を計算。申請前の目安確認に。無料・登録不要。",
    type: "website",
    url: "https://yamada-tools.jp/health/shogai-nenkin-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "障害年金 受給額 簡易計算機",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      url: "https://yamada-tools.jp/health/shogai-nenkin-calculator",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      description:
        "障害基礎年金・障害厚生年金の受給額を障害等級・加入状況から計算します。",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "健康・医療", item: "https://yamada-tools.jp/health" },
        { "@type": "ListItem", position: 3, name: "障害年金受給額簡易計算機", item: "https://yamada-tools.jp/health/shogai-nenkin-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "障害年金は非課税所得ですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい。障害年金（障害基礎年金・障害厚生年金）は所得税・住民税ともに非課税です。",
          },
        },
        {
          "@type": "Question",
          name: "障害年金の申請はいつからできますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "原則として初診日から1年6ヶ月後（障害認定日）以降に申請できます。申請には初診日の証明・診断書が必要です。",
          },
        },
      ],
    },
  ],
};

export default function ShogaiNenkinPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShogaiNenkinClient />
    </>
  );
}
