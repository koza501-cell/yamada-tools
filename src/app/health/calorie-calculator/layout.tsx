import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】基礎代謝・カロリー計算機｜TDEE・目標カロリー・PFC比率を自動計算 ",
  description: "基礎代謝（BMR）・消費カロリー（TDEE）・目標カロリーを自動計算。ダイエット・増量・維持に対応。目標体重の達成予定日・PFCバランスも表示。登録不要・無料。",
  keywords: [
    "基礎代謝 計算",
    "カロリー計算機",
    "TDEE 計算",
    "BMR 計算",
    "消費カロリー 計算",
    "目標カロリー",
    "PFC バランス",
    "ダイエット カロリー",
    "体重管理 カロリー",
    "Mifflin-St Jeor",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/health/calorie-calculator",
  },
  openGraph: {
    title: "【無料】基礎代謝・カロリー計算機｜TDEE・目標カロリー・PFC比率を自動計算 ",
    description: "基礎代謝（BMR）・消費カロリー（TDEE）・目標カロリーを自動計算。ダイエット・増量・維持に対応。目標体重の達成予定日・PFCバランスも表示。登録不要・無料。",
    url: "https://yamada-tools.jp/health/calorie-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】基礎代謝・カロリー計算機｜TDEE・目標カロリー・PFC比率 ",
    description: "基礎代謝・消費カロリー・目標カロリーを自動計算。ダイエット・増量・維持に対応。登録不要・無料。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "基礎代謝・カロリー計算機",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "基礎代謝（BMR）・消費カロリー（TDEE）・目標カロリーを自動計算。目標体重達成日・PFCバランスも表示。ダイエット・増量・維持に対応。登録不要・無料。",
      "url": "https://yamada-tools.jp/health/calorie-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "健康・ウェルネス", "item": "https://yamada-tools.jp/health" },
        { "@type": "ListItem", "position": 3, "name": "基礎代謝・カロリー計算機", "item": "https://yamada-tools.jp/health/calorie-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "基礎代謝を上げる方法はありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "最も効果的な方法は筋肉量を増やすことです。筋力トレーニングを週2〜3回行うことで基礎代謝を長期的に高めることができます。十分な睡眠・タンパク質の摂取も重要です。",
          },
        },
        {
          "@type": "Question",
          "name": "カロリー計算だけで痩せられますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "カロリー収支が基本ですがPFCバランスも重要です。同じカロリーでもタンパク質・脂質・炭水化物の比率によって筋肉量維持やホルモンバランスが変わります。",
          },
        },
        {
          "@type": "Question",
          "name": "1日1,200kcal以下に減らしても大丈夫ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "女性で1,000kcal・男性で1,200kcal以下の極端な制限は推奨されません。栄養不足・筋肉量低下・代謝低下・リバウンドのリスクが高まります。",
          },
        },
        {
          "@type": "Question",
          "name": "運動しないで食事制限だけで痩せることはできますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "カロリー制限だけでも体重は減りますが筋肉量も減少しやすく痩せにくい体になるリスクがあります。有酸素運動と筋トレを組み合わせることが理想です。",
          },
        },
        {
          "@type": "Question",
          "name": "年齢とともに太りやすくなるのはなぜですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "加齢により基礎代謝が低下するためです。筋肉量は20代をピークに年間0.5〜1%減少します。対策として筋力トレーニングで筋肉量を維持することが最も効果的です。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "基礎代謝・目標カロリーの計算方法",
      "description": "性別・年齢・身長・体重・活動レベルから基礎代謝と目標カロリーを計算する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "基本情報を入力",
          "text": "性別・年齢・身長・体重を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "活動レベルと目標を選択",
          "text": "日常の活動レベルと体重の目標（減量・維持・増量）を選択します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "計算ボタンを押す",
          "text": "「計算する」を押すとBMR・TDEE・目標カロリー・PFCバランス・達成予定日が表示されます。",
        },
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
