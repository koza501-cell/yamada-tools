import type { Metadata } from "next";
import FukugyouShinkokuClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "副業 確定申告 必要判定ツール【会社員向け・20万円ルール】| 山田ツール",
  description:
    "副業収入・所得から確定申告が必要かを瞬時に判定。会社員の20万円ルール・住民税申告も完全対応。フリーランス・アルバイト・不動産収入など複数副業に対応。",
  keywords: [
    "副業 確定申告 必要",
    "副業 20万円 ルール",
    "確定申告 不要 判定",
    "会社員 副業 税金",
    "メルカリ 確定申告",
    "アフィリエイト 確定申告",
    "副業 住民税 申告",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/finance/fukugyou-shinkoku-checker",
  },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "副業 確定申告 必要判定ツール【会社員向け・20万円ルール】",
    description:
      "副業収入・所得から確定申告が必要かを瞬時に判定。会社員の20万円ルール対応。無料・登録不要。",
    type: "website",
    url: "https://yamada-tools.jp/finance/fukugyou-shinkoku-checker",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "副業 確定申告 必要判定ツール",
      description:
        "副業収入・所得から確定申告が必要かを瞬時に判定。会社員の20万円ルール対応。",
      url: "https://yamada-tools.jp/finance/fukugyou-shinkoku-checker",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      featureList: [
        "確定申告要否判定",
        "20万円ルール自動判定",
        "住民税申告要否判定",
        "複数副業合算判定",
        "源泉徴収還付可能性チェック",
      ],
      keywords:
        "副業,確定申告,20万円ルール,会社員,住民税,メルカリ,アフィリエイト,フリーランス,所得税",
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
          name: "ファイナンス・税金",
          item: "https://yamada-tools.jp/finance",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "副業確定申告必要判定ツール",
          item: "https://yamada-tools.jp/finance/fukugyou-shinkoku-checker",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "副業の確定申告はいくらから必要ですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "会社員（給与1か所）の場合、副業の所得（収入-経費）が年間20万円を超えると確定申告が必要です。収入ではなく所得が基準です。例：副業収入30万円・経費12万円の場合、所得18万円で申告不要。yamada-tools.jpの無料判定ツールで今すぐ確認できます。",
          },
        },
        {
          "@type": "Question",
          name: "副業が20万円以下でも確定申告が必要なケースはありますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい、①源泉徴収されている場合（還付を受けられる可能性）、②医療費控除・住宅ローン控除を受けたい場合は、20万円以下でも確定申告した方が有利です。また住民税は20万円以下でも別途申告が必要です。",
          },
        },
        {
          "@type": "Question",
          name: "副業を会社にバレないようにする方法はありますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "確定申告時に住民税の徴収方法を「普通徴収（自分で納付）」に設定することで、会社の給与天引き（特別徴収）と分離でき、会社に副業収入が知られにくくなります。",
          },
        },
        {
          "@type": "Question",
          name: "メルカリやせどりの副業は確定申告が必要ですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "メルカリ・せどりの利益（売上-仕入れ-手数料-送料などの経費）が年間20万円を超える場合、確定申告が必要です。生活用品の売却は基本的に非課税ですが、転売目的の場合は課税対象です。",
          },
        },
        {
          "@type": "Question",
          name: "アフィリエイト・YouTubeの収入はいくらから確定申告が必要ですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "アフィリエイト・YouTube収益も副業所得として扱われ、年間所得（収入-経費）が20万円を超えると確定申告が必要です。サーバー代・ドメイン代・機材費なども経費として計上できます。",
          },
        },
        {
          "@type": "Question",
          name: "副業の確定申告不要を判定できる無料ツールはありますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい、yamada-tools.jp（山田ツール）では副業収入・経費・源泉徴収額を入力するだけで確定申告が必要か不要かを無料で判定できます。複数の副業も合算して判定可能です。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      name: "副業の確定申告必要判定の方法",
      description:
        "yamada-tools.jpの無料ツールで副業の確定申告要否を判定する手順",
      step: [
        {
          "@type": "HowToStep",
          name: "本業の形態を選択",
          text: "会社員（給与1か所）・会社員（給与2か所以上）・個人事業主から選択します。",
        },
        {
          "@type": "HowToStep",
          name: "副業の種類を選択",
          text: "フリーランス・アルバイト・メルカリ・アフィリエイトなど副業の種類を選択します。",
        },
        {
          "@type": "HowToStep",
          name: "収入・経費を入力",
          text: "副業の年間収入と経費を入力します。所得＝収入-経費で自動計算されます。",
        },
        {
          "@type": "HowToStep",
          name: "源泉徴収額を入力",
          text: "副業から源泉徴収されている税額を入力します（不明な場合は0）。還付可能性が判定されます。",
        },
        {
          "@type": "HowToStep",
          name: "判定結果を確認",
          text: "確定申告が必要・不要・任意（還付の可能性あり）の判定と、住民税申告の必要性が表示されます。",
        },
      ],
    },
  ],
};

const tool = getToolById("fukugyou-shinkoku-checker")!;

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FukugyouShinkokuClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
