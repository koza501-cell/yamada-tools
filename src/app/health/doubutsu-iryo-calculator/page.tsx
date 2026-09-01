import { Metadata } from "next";
import DoubutsuIryoClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "ペット医療費計算機【動物病院 費用相場チェッカー】",
  description: "犬・猫の治療・手術費用の全国相場を確認。ペット保険の自己負担額も計算。初診から手術まで詳細な費用目安を算出。",
  keywords: ["ペット医療費 相場", "動物病院 費用", "ペット保険 計算", "犬 治療費", "猫 手術費用"],
  alternates: { canonical: "https://yamada-tools.jp/health/doubutsu-iryo-calculator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "ペット医療費計算機【動物病院 費用相場チェッカー】",
    description: "犬・猫の治療・手術費用の全国相場を確認。ペット保険の自己負担額も計算。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "ペット医療費計算機",
      "url": "https://yamada-tools.jp/health/doubutsu-iryo-calculator",
      "description": "犬・猫の治療・手術費用の全国相場を確認。ペット保険の自己負担額も計算。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "ペット医療費計算機", "item": "https://yamada-tools.jp/health/doubutsu-iryo-calculator" }
      ]
    }
  ]
};

const tool = getToolById("doubutsu-iryo-calculator")!;

export default function DoubutsuIryoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DoubutsuIryoClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
