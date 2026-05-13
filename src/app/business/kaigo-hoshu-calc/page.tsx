import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import KaigoHoshuClient from "./client";

export const metadata: Metadata = {
  title: "介護報酬計算機｜訪問介護・デイサービス料金を自動計算【令和6年+令和8年6月改定対応・無料】",
  description: "令和6年改定+令和8年6月期中改定対応の無料計算ツール。訪問介護、通所介護（デイサービス）、居宅介護支援の単位数から介護報酬と自己負担額をワンタッチで計算。地域区分・加算減算対応。",
  keywords: ["介護報酬", "介護報酬計算", "訪問介護", "デイサービス", "通所介護", "居宅介護支援", "地域区分", "令和6年改定", "単位数", "無料"],
  openGraph: {
    title: "介護報酬計算機【令和6年+令和8年6月改定対応・無料】",
    description: "訪問介護・デイサービス・居宅介護支援の介護報酬を地域区分・加算減算込みで自動計算。",
    type: "website",
  },
  alternates: { canonical: "https://yamada-tools.jp/business/kaigo-hoshu-calc" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "介護報酬単位計算機",
      url: "https://yamada-tools.jp/business/kaigo-hoshu-calc",
      description: "訪問介護・通所介護・居宅介護支援の介護報酬を地域区分・加算減算込みで自動計算する無料ツール",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム",       item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "介護・保育",   item: "https://yamada-tools.jp/business" },
        { "@type": "ListItem", position: 3, name: "介護報酬 単位計算機", item: "https://yamada-tools.jp/business/kaigo-hoshu-calc" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "介護報酬はどうやって計算するの?",
          acceptedAnswer: { "@type": "Answer", text: "「サービスごとの単位数 × 1単位の単価」で計算します。1単位の単価は地域区分とサービスの人件費割合で10〜11.40円の範囲で変動します。" },
        },
        {
          "@type": "Question",
          name: "1単位は何円ですか?",
          acceptedAnswer: { "@type": "Answer", text: "基本は10円ですが、東京23区など人件費の高い地域では最大11.40円になります。当ツールでは地域を選ぶと自動反映されます。" },
        },
        {
          "@type": "Question",
          name: "令和6年改定に対応していますか?",
          acceptedAnswer: { "@type": "Answer", text: "はい。令和6年度改定(2024年4月・6月施行)および令和8年6月期中改定(処遇改善加算拡充)に対応しています。次回の通常改定は令和9年度予定です。" },
        },
        {
          "@type": "Question",
          name: "加算や減算も計算できますか?",
          acceptedAnswer: { "@type": "Answer", text: "処遇改善加算、特定事業所加算、入浴介助加算、同一建物減算など主要な加算・減算に対応しています。" },
        },
        {
          "@type": "Question",
          name: "この計算は公式ですか?",
          acceptedAnswer: { "@type": "Answer", text: "厚生労働省告示に基づく概算計算です。正式な請求金額は所属事業所や市町村にご確認ください。" },
        },
      ],
    },
  ],
};

const tool = getToolById("kaigo-hoshu-calc");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KaigoHoshuClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
