import { Metadata } from "next";
import SeikotsuinRyoyohiClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "整骨院・接骨院 療養費目安計算機【保険適用チェック】| 山田ツール",
  description: "柔道整復師の療養費の仕組みを解説。施術部位・回数から保険適用の目安を計算。捻挫・打撲・挫傷・骨折の自己負担額を算出。",
  keywords: ["整骨院 療養費 計算", "接骨院 保険適用 費用", "柔道整復師 療養費", "整骨院 料金 相場", "捻挫 接骨院 費用"],
  alternates: { canonical: "https://yamada-tools.jp/health/seikotsuin-ryoyohi-calculator" },
  openGraph: {
    title: "整骨院・接骨院 療養費目安計算機【保険適用チェック】",
    description: "施術部位・回数から保険適用の目安を計算。捻挫・打撲・骨折の自己負担額を算出。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "整骨院・接骨院 療養費目安計算機",
      "url": "https://yamada-tools.jp/health/seikotsuin-ryoyohi-calculator",
      "description": "施術部位・回数から保険適用の目安を計算。",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "整骨院療養費計算機", "item": "https://yamada-tools.jp/health/seikotsuin-ryoyohi-calculator" }
      ]
    }
  ]
};

const tool = getToolById("seikotsuin-ryoyohi-calculator")!;

export default function SeikotsuinPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SeikotsuinRyoyohiClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
