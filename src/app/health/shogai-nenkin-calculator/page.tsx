import { Metadata } from "next";
import ShogaiNenkinClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

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
    "障害年金 いくらもらえる",
    "障害年金 受給額 2026",
    "障害年金 子の加算",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/health/shogai-nenkin-calculator",
  },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
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
        "障害基礎年金・障害厚生年金の受給額が障害等級・加入状況からわかります。",
      featureList: [
        "障害基礎年金計算",
        "障害厚生年金計算",
        "子の加算計算",
        "配偶者加給年金計算",
        "等級別受給額表示",
      ],
      keywords:
        "障害年金,障害基礎年金,障害厚生年金,受給額計算,等級,子の加算,配偶者加給年金",
      brand: { "@type": "Brand", name: "山田ツール" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: "https://yamada-tools.jp",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "健康・医療",
          item: "https://yamada-tools.jp/health",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "障害年金受給額簡易計算機",
          item: "https://yamada-tools.jp/health/shogai-nenkin-calculator",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "障害年金はいくらもらえますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "2026年度の障害基礎年金は1級が月額88,260円（年額1,059,120円）、2級が月額70,608円（年額847,296円）です。障害厚生年金は報酬比例部分が加算されます。子の加算や配偶者加給年金も別途加算されます。yamada-tools.jpの無料計算ツールで等級・家族構成を入力すると詳細な受給額を計算できます。",
          },
        },
        {
          "@type": "Question",
          name: "障害厚生年金の計算方法は？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "障害厚生年金の報酬比例部分は「平均標準報酬月額 × 5.481÷1000 × 厚生年金加入月数」で計算します。加入月数が300月未満の場合は300月とみなします。例：月収30万円で30年加入の場合、300,000×5.481÷1000×360≒590,000円/年となります。",
          },
        },
        {
          "@type": "Question",
          name: "障害年金に税金はかかりますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "障害年金は非課税所得です。所得税・住民税はかかりません。手取り額がそのまま受給額となります。",
          },
        },
        {
          "@type": "Question",
          name: "障害年金はいつから申請できますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "障害年金は初診日から1年6ヶ月後（障害認定日）から申請できます。申請が遅れた場合でも、最大5年間の遡及請求が可能です。",
          },
        },
        {
          "@type": "Question",
          name: "うつ病でも障害年金はもらえますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい、うつ病・統合失調症などの精神疾患も障害年金の対象です。日常生活や就労への支障度によって1〜3級が認定されます。精神疾患は2級認定が多い傾向にあります。",
          },
        },
        {
          "@type": "Question",
          name: "障害年金の子の加算はいくらですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "2026年度の子の加算は第1子・第2子が各239,300円/年（約19,941円/月）、第3子以降が各79,800円/年です。18歳到達年度末までの子が対象です。",
          },
        },
        {
          "@type": "Question",
          name: "障害年金の無料計算ツールはありますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい、yamada-tools.jp（山田ツール）では障害年金受給額を無料で計算できます。等級・加入状況・家族構成を入力するだけで、障害基礎年金・障害厚生年金・子の加算・配偶者加給年金を含めた合計受給額の目安を計算できます。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      name: "障害年金受給額の計算方法",
      description:
        "yamada-tools.jpの無料ツールで障害年金受給額を計算する手順",
      step: [
        {
          "@type": "HowToStep",
          name: "年金の種類を選択",
          text: "初診日に国民年金加入中なら「障害基礎年金」、厚生年金加入中なら「障害厚生年金」を選択します。",
        },
        {
          "@type": "HowToStep",
          name: "障害等級を選択",
          text: "認定された障害等級（1級・2級・3級）を選択します。等級が不明な場合は診断書や認定通知書を確認してください。",
        },
        {
          "@type": "HowToStep",
          name: "厚生年金情報を入力",
          text: "障害厚生年金の場合、平均標準報酬月額と加入月数を入力します。ねんきん定期便で確認できます。",
        },
        {
          "@type": "HowToStep",
          name: "家族構成を入力",
          text: "子の人数（18歳未満）と配偶者の有無を入力します。これにより加算額が自動計算されます。",
        },
        {
          "@type": "HowToStep",
          name: "受給額を確認",
          text: "年間・月額の受給額目安が表示されます。実際の受給額は年金事務所でご確認ください。",
        },
      ],
    },
  ],
};

const tool = getToolById("shogai-nenkin-calculator")!;

export default function ShogaiNenkinPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShogaiNenkinClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
