import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】単位変換 計算機｜坪・畳・尺・合・升など日本の単位に完全対応 ",
  description: "坪・畳・尺・合・升など日本独自の単位に完全対応。面積・長さ・重さ・体積・温度・データ容量をリアルタイム変換。地域別畳サイズ対応。登録不要・完全無料。",
  keywords: [
    "単位変換", "坪 平米 変換", "坪 畳 変換", "尺 センチ 変換",
    "合 ml 変換", "升 リットル 変換", "度量衡 変換", "尺貫法 換算",
    "面積 変換", "長さ 変換", "重さ 変換", "体積 変換", "温度 変換",
    "データ容量 変換", "畳 地域 サイズ", "単位換算表",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/utility/unit-converter",
  },
  openGraph: {
    title: "【無料】単位変換 計算機｜坪・畳・尺・合・升など日本の単位に完全対応 ",
    description: "坪・畳・尺・合・升など日本独自の単位に完全対応。面積・長さ・重さ・体積・温度・データ容量をリアルタイム変換。",
    url: "https://yamada-tools.jp/utility/unit-converter",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】単位変換 計算機｜坪・畳・尺・合・升など日本の単位に完全対応 ",
    description: "坪・畳・尺・合・升など日本独自の単位に完全対応。リアルタイム変換・地域別畳サイズ対応。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "単位変換 計算機",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "坪・畳・尺・合・升など日本独自の単位に完全対応した単位変換ツール。面積・長さ・重さ・体積・温度・データ容量をリアルタイム変換。登録不要・無料。",
      "url": "https://yamada-tools.jp/utility/unit-converter",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "日常生活・便利ツール", "item": "https://yamada-tools.jp/utility" },
        { "@type": "ListItem", "position": 3, "name": "単位変換 計算機", "item": "https://yamada-tools.jp/utility/unit-converter" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "坪と㎡はどっちが大きいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "1坪 = 約3.306㎡なので坪の方が大きい単位です。30坪の家は約99㎡に相当します。不動産広告では坪が使われることが多いですが公的書類では㎡が使われます。",
          },
        },
        {
          "@type": "Question",
          "name": "お米1合は何gですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "お米1合は体積で約180mLです。重さは一般的に約150〜160gで炊き上がりは約330〜340gになります。",
          },
        },
        {
          "@type": "Question",
          "name": "身長5フィート何インチは何センチですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "5フィート=152.4cm、5フィート5インチ=165.1cm、5フィート9インチ=175.3cm、6フィート=182.9cmです。インチは2.54cmで計算します。",
          },
        },
        {
          "@type": "Question",
          "name": "畳の広さは地域によって違うのですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい異なります。関東の江戸間は1畳≒1.548㎡、関西の京間は1畳≒1.824㎡です。同じ6畳でも関西の方が約17%広くなります。",
          },
        },
        {
          "@type": "Question",
          "name": "データ容量の単位（KB・MB・GB）の関係は？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "1KB=1,024バイト、1MB=1,024KB、1GB=1,024MB、1TB=1,024GBです。1,000ではなく1,024で計算する点に注意が必要です。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "単位変換の使い方",
      "description": "面積・長さ・重さ・体積・温度・データ容量を変換する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "カテゴリを選択", "text": "面積・長さ・重さ・体積・温度・データ容量から変換したいカテゴリを選びます。" },
        { "@type": "HowToStep", "position": 2, "name": "値と単位を入力", "text": "変換元の単位を選択して数値を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "結果を確認", "text": "リアルタイムで全単位への変換結果が表示されます。" },
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
