import { Metadata } from "next";
import KyuyoClient from "./client";

export const metadata: Metadata = {
  title: "給与明細作成ツール【無料・登録不要・PDF出力】社会保険料・所得税自動計算 | 山田ツール",
  description: "基本給を入力するだけで健康保険・厚生年金・雇用保険・所得税を自動計算。都道府県別保険料率2025年度対応。美しいA4明細をPDF出力。完全無料・登録不要。",
  keywords: ["給与明細 作成 無料", "給与明細 自動計算", "社会保険料 計算 自動", "健康保険料 都道府県別", "源泉徴収 所得税 計算", "給与明細 PDF 出力", "標準報酬月額 計算"],
  alternates: { canonical: "https://yamada-tools.jp/document/kyuyo-meisai" },
  openGraph: {
    title: "給与明細作成ツール【無料・登録不要・PDF出力】",
    description: "基本給を入力するだけで社会保険料・所得税を自動計算。美しいA4給与明細をPDF出力。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "給与明細作成ツール",
      "url": "https://yamada-tools.jp/document/kyuyo-meisai",
      "description": "社会保険料・所得税を自動計算してA4給与明細をPDF出力できる無料ツール。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "書類作成", "item": "https://yamada-tools.jp/document" },
        { "@type": "ListItem", "position": 3, "name": "給与明細作成ツール", "item": "https://yamada-tools.jp/document/kyuyo-meisai" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "健康保険料はどうやって計算する？", "acceptedAnswer": { "@type": "Answer", "text": "健康保険料は標準報酬月額に都道府県の保険料率を掛けて計算します。保険料は事業主と被保険者で折半するため、控除額は計算額の半分になります。" } },
        { "@type": "Question", "name": "標準報酬月額とは？", "acceptedAnswer": { "@type": "Answer", "text": "標準報酬月額とは、給与額を一定の幅で区切った等級に当てはめた金額です。社会保険料の計算基準となり、4〜6月の給与平均をもとに年1回改定されます。" } },
        { "@type": "Question", "name": "通勤手当は課税される？", "acceptedAnswer": { "@type": "Answer", "text": "通勤手当は月150,000円までが非課税です。超過分は課税対象になります。このツールでは非課税上限を自動判定します。" } }
      ]
    }
  ]
};

export default function KyuyoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KyuyoClient />
    </>
  );
}
