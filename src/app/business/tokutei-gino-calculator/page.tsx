import { Metadata } from "next";
import TokuteiClient from "./client";

export const metadata: Metadata = {
  title: "特定技能 在留資格 費用計算機 — 採用総費用を職種・国籍別に計算 | 山田ツール",
  description: "特定技能外国人の採用にかかる総費用を職種・国籍別に計算。送り出し機関費・登録支援機関費・在留申請費など費用内訳を一覧表示。登録不要・無料。",
  keywords: ["特定技能 費用 計算", "特定技能 採用費用", "特定技能 登録支援機関 費用", "特定技能外国人 雇用 費用", "在留資格 特定技能 申請費", "送り出し機関 手数料"],
  alternates: { canonical: "https://yamada-tools.jp/business/tokutei-gino-calculator" },
  openGraph: {
    title: "特定技能 在留資格 費用計算機",
    description: "特定技能外国人採用の総費用を職種・国籍別に自動計算。費用内訳・手続き期間も確認。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "特定技能 在留資格 費用計算機",
      "url": "https://yamada-tools.jp/business/tokutei-gino-calculator",
      "description": "特定技能外国人採用の総費用を職種・国籍別に計算する無料ツール。",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "ビジネス・法人", "item": "https://yamada-tools.jp/business" },
        { "@type": "ListItem", "position": 3, "name": "特定技能費用計算機", "item": "https://yamada-tools.jp/business/tokutei-gino-calculator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "特定技能の採用費用はいくらかかる？", "acceptedAnswer": { "@type": "Answer", "text": "海外からの招へいの場合、1人あたり初期費用として概ね40〜80万円程度かかります。これに登録支援機関の費用（月2〜5万円）が加わります。国籍・職種・採用方法によって大きく異なります。" } },
        { "@type": "Question", "name": "ベトナム人の送り出し機関費用はなぜ0円？", "acceptedAnswer": { "@type": "Answer", "text": "ベトナム政府の規制により、特定技能での来日に際して送り出し機関が外国人労働者または日本の受入れ機関から手数料を徴収することは禁止されています。" } },
        { "@type": "Question", "name": "登録支援機関は必須？", "acceptedAnswer": { "@type": "Answer", "text": "登録支援機関への委託は必須ではありませんが、受入れ機関が自ら支援計画を実施する能力・体制を持つ必要があります。多くの企業は登録支援機関に委託します。" } }
      ]
    }
  ]
};

export default function TokuteiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TokuteiClient />
    </>
  );
}
