import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】資格取得 費用対効果 計算機｜ROI・投資回収期間を自動計算 宅建・中小企業診断士・AWS ",
  description: "資格取得のROIと投資回収期間を自動計算。受験料・教材費・勉強時間コストと年収アップ効果を比較。宅建・診断士・公認会計士・AWS等9資格のプリセット付き。登録不要・無料。",
  keywords: [
    "資格 費用対効果",
    "資格 ROI 計算",
    "資格取得 コスパ",
    "宅建 費用対効果",
    "中小企業診断士 コスパ",
    "AWS 資格 費用対効果",
    "資格 投資回収期間",
    "資格 年収アップ",
    "資格取得 メリット 計算",
    "資格 勉強時間 コスト",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/education/certification-roi",
  },
  openGraph: {
    title: "【無料】資格取得 費用対効果 計算機｜ROI・投資回収期間を自動計算 ",
    description: "資格取得のROIと投資回収期間を自動計算。受験料・教材費・勉強時間コストと年収アップ効果を比較。宅建・診断士・公認会計士・AWS等9資格のプリセット付き。登録不要・無料。",
    url: "https://yamada-tools.jp/education/certification-roi",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】資格取得 費用対効果 計算機｜ROI・投資回収期間を自動計算 ",
    description: "資格取得のROIと投資回収期間を自動計算。受験料・教材費・勉強時間コストと年収アップ効果を比較。宅建・診断士・公認会計士・AWS等9資格のプリセット付き。登録不要・無料。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "資格取得 費用対効果 計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "資格取得のROI（費用対効果）を自動計算。受験料・教材費・勉強時間コストと年収アップ効果を比較。投資回収期間・10年間の累計リターンも表示。登録不要・無料。",
      "url": "https://yamada-tools.jp/education/certification-roi",
      "datePublished": "2026-04-01",
      "dateModified": "2026-04-01",
      "inLanguage": "ja",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "教育・学習", "item": "https://yamada-tools.jp/education" },
        { "@type": "ListItem", "position": 3, "name": "資格取得 費用対効果 計算機", "item": "https://yamada-tools.jp/education/certification-roi" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "資格を取っても年収が上がるとは限りませんか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "資格取得だけで自動的に年収が上がるわけではありません。転職・社内昇進・独立などのアクションが必要です。本ツールの年収アップ額はこれらのアクションを取った場合の目安です。",
          },
        },
        {
          "@type": "Question",
          "name": "勉強時間の目安はどうやって決めればいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "プリセット値は合格者の平均的な勉強時間の目安です。未経験者は目安の1.5倍、関連知識がある場合は0.7倍程度で見積もると良いでしょう。",
          },
        },
        {
          "@type": "Question",
          "name": "複数の資格を取る場合のROIはどう考えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "資格の組み合わせによってシナジー効果があります。FP+宅建は不動産・金融分野で、税理士+中小企業診断士は経営コンサルとして有利です。単純な足し算より効果が大きい場合があります。",
          },
        },
        {
          "@type": "Question",
          "name": "資格スクールと独学ではどちらがいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "難関資格（公認会計士・税理士等）はスクールが有利です。IT資格やFP2級程度は独学でも十分合格可能です。スクール費用を含めたROIを計算して比較することをお勧めします。",
          },
        },
        {
          "@type": "Question",
          "name": "資格取得のための学費は税控除できますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "現在の職業に直接必要と認められる場合、特定支出控除として所得控除できる可能性があります。ただし適用基準が厳しく確定申告が必要です。詳細は税務署または税理士にご相談ください。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "資格取得ROIの計算方法",
      "description": "資格の取得コストと年収アップ効果からROIと回収期間を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "資格を選択", "text": "プリセットから資格を選択するか手動で資格名を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "コストと効果を入力", "text": "受験料・教材費・勉強時間・想定年収アップ額を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すとROI・回収期間・総リターン・アドバイスが表示されます。" },
      ],
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
