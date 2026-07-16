import { Metadata } from "next";
import OvertimeClient from "./client";

export const metadata: Metadata = {
  title: "残業代計算機 — 固定残業代・深夜・休日対応 | 山田ツール",
  description:
    "月給から残業代を即座に計算。固定残業代（みなし残業）・深夜残業・休日出勤・60時間超え50%割増（2023年法改正）に対応。登録不要・完全無料。",
  keywords: [
    "残業代 計算 月給",
    "固定残業代 超えた分 計算",
    "深夜残業 休日出勤 計算",
    "未払い残業代 確認",
    "60時間超え 残業代 50%",
    "残業代 計算機 無料",
    "割増賃金 計算",
  ],
  alternates: { canonical: "https://yamada-tools.jp/finance/overtime-calculator" },
  openGraph: {
    title: "残業代計算機 — 固定残業代・深夜・休日対応",
    description: "月給から残業代を即座に計算。固定残業代・60時間超え対応。登録不要・無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "残業代計算機",
      "url": "https://yamada-tools.jp/finance/overtime-calculator",
      "description": "固定残業代・深夜・休日・60時間超え50%割増に対応した残業代計算機。完全無料。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "金融・資産", "item": "https://yamada-tools.jp/finance" },
        { "@type": "ListItem", "position": 3, "name": "残業代計算機", "item": "https://yamada-tools.jp/finance/overtime-calculator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "残業代の計算式は？", "acceptedAnswer": { "@type": "Answer", "text": "残業代 = 基礎時給 × 残業時間 × 割増率です。基礎時給は「月給 ÷ 月平均所定労働時間」で求めます。月平均所定労働時間は「1日の所定労働時間 × 月平均所定労働日数」で計算します。" } },
        { "@type": "Question", "name": "固定残業代（みなし残業）を超えた場合の計算は？", "acceptedAnswer": { "@type": "Answer", "text": "固定残業代は所定の残業時間分を給与に含めた制度です。実際の残業時間が固定残業時間を超えた場合、超えた分の残業代は別途支払われる義務があります。固定残業時間を入力すると、超過分の残業代が自動でわかります。" } },
        { "@type": "Question", "name": "60時間を超える残業の割増率は？", "acceptedAnswer": { "@type": "Answer", "text": "2023年4月1日より、中小企業も含めて月60時間を超える時間外労働の割増賃金率は50%以上となりました（以前の中小企業猶予措置は終了）。このツールは2023年以降の法改正に対応しています。" } },
        { "@type": "Question", "name": "深夜残業と通常残業が重なる場合は？", "acceptedAnswer": { "@type": "Answer", "text": "法定時間外労働（残業）と深夜労働（22時〜翌5時）が重なる場合、それぞれの割増率が加算されます。具体的には時間外25%＋深夜25%＝50%の割増となります。" } },
        { "@type": "Question", "name": "法定休日と法定外休日の違いは？", "acceptedAnswer": { "@type": "Answer", "text": "法定休日は労働基準法で定められた週1日以上の休日（通常は日曜）で、割増率は35%以上です。法定外休日（会社規定の土曜など）は時間外労働として25%割増となります。このツールでは法定休日労働を別途入力できます。" } }
      ]
    }
  ]
};

export default function OvertimePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <OvertimeClient />
    </>
  );
}
