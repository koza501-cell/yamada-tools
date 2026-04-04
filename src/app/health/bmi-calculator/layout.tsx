import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】BMI計算機｜適正体重・肥満度を日本基準で判定 体重管理に | 山田ツール",
  description: "身長・体重を入力するだけでBMIと適正体重を計算。日本肥満学会基準の肥満度判定・健康リスク・アドバイス付き。ビジュアルゲージで一目でわかる無料BMI計算機。",
  keywords: [
    "BMI 計算機",
    "BMI 計算",
    "適正体重 計算",
    "肥満度 判定",
    "BMI 日本基準",
    "標準体重 計算",
    "美容体重",
    "BMI 肥満",
    "体重管理",
    "日本肥満学会 基準",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/health/bmi-calculator",
  },
  openGraph: {
    title: "【無料】BMI計算機｜適正体重・肥満度を日本基準で判定 | 山田ツール",
    description: "身長・体重を入力するだけでBMIと適正体重を計算。日本肥満学会基準の肥満度判定・健康リスク・アドバイス付き。ビジュアルゲージで一目でわかる無料BMI計算機。",
    url: "https://yamada-tools.jp/health/bmi-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】BMI計算機｜適正体重・肥満度を日本基準で判定 | 山田ツール",
    description: "身長・体重を入力するだけでBMIと適正体重を計算。日本肥満学会基準で判定・健康アドバイス付き。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "BMI・適正体重 計算機",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "身長・体重を入力するだけでBMIと適正体重を計算。日本肥満学会基準の判定・健康リスク・アドバイス付き。ビジュアルゲージで一目でわかる無料BMI計算機。",
      "url": "https://yamada-tools.jp/health/bmi-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "健康・ウェルネス", "item": "https://yamada-tools.jp/health" },
        { "@type": "ListItem", "position": 3, "name": "BMI・適正体重 計算機", "item": "https://yamada-tools.jp/health/bmi-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "BMIが25以上になると何か問題がありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "BMI25以上（肥満1度）になると2型糖尿病・高血圧・脂質異常症・心臓病などの生活習慣病リスクが高まります。定期的な健康診断を受け気になる場合は医師にご相談ください。",
          },
        },
        {
          "@type": "Question",
          "name": "BMIが低すぎる場合のリスクは何ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "BMI18.5未満のやせは栄養不足・貧血・骨粗しょう症・免疫機能低下のリスクがあります。無理なダイエットは避け栄養バランスの良い食事を心がけましょう。",
          },
        },
        {
          "@type": "Question",
          "name": "適正体重と美容体重はどう違いますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "適正体重（BMI=22）は医学的に最も疾病リスクが低い体重です。美容体重（BMI=20）は見た目がスリムに見えるとされる体重ですが医学的根拠はありません。健康面では適正体重を目指すことが推奨されます。",
          },
        },
        {
          "@type": "Question",
          "name": "BMIは年齢によって基準が変わりますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "基準自体は変わりませんが高齢者（65歳以上）については少し高めのBMI（21.5〜24.9）が推奨されています。加齢により筋肉量が減少するためやせすぎると転倒・骨折リスクが高まります。",
          },
        },
        {
          "@type": "Question",
          "name": "1ヶ月で何kgまで減量するのが健康的ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "月1〜2kg（週0.5kg以下）が健康的な減量ペースとされています。急激な減量は筋肉量低下・栄養不足・リバウンドのリスクがあります。食事制限と運動を組み合わせた無理のない計画を立てましょう。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "BMI・適正体重の計算方法",
      "description": "身長・体重・性別・年齢からBMIと適正体重を計算する手順",
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
          "name": "目標体重を入力（任意）",
          "text": "目標体重がある場合は入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "計算ボタンを押す",
          "text": "「計算する」を押すとBMI・判定・適正体重・健康アドバイスが表示されます。",
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
