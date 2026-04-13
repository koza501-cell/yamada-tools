import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】塾・予備校費用 比較計算機｜最大3校の総費用を一括比較",
  description: "月謝・入会金・季節講習・交通費まで含めた通塾期間の総費用を自動計算。最大3校を同時比較・1時間単価・コスト削減アドバイス付き。2026年最新データ対応。登録不要・無料。",
  keywords: [
    "塾 費用",
    "予備校 費用比較",
    "塾 月謝 相場",
    "塾 費用 シミュレーター",
    "塾 費用 計算",
    "個別指導 費用",
    "集団塾 費用",
    "オンライン塾 比較",
    "塾 1時間 単価",
    "予備校 月謝",
    "塾代 総額",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/education/cram-school-calculator",
  },
  openGraph: {
    title: "【無料】塾・予備校費用 比較計算機｜最大3校の総費用を一括比較",
    description: "月謝・入会金・季節講習・交通費まで含めた通塾期間の総費用を自動計算。最大3校を同時比較・1時間単価・コスト削減アドバイス付き。2026年最新データ対応。",
    url: "https://yamada-tools.jp/education/cram-school-calculator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E5%A1%BE%E3%83%BB%E4%BA%88%E5%82%99%E6%A0%A1%E8%B2%BB%E7%94%A8%20%E6%AF%94%E8%BC%83%E8%A8%88%E7%AE%97%E6%A9%9F%EF%BD%9C%E6%9C%80%E5%A4%A73%E6%A0%A1%E3%81%AE%E7%B7%8F%E8%B2%BB%E7%94%A8%E3%82%92%E4%B8%80%E6%8B%AC%E6%AF%94%E8%BC%83" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】塾・予備校費用 比較計算機｜最大3校の総費用を一括比較",
    description: "月謝・入会金・季節講習・交通費まで含めた通塾期間の総費用を自動計算。最大3校を同時比較・1時間単価・コスト削減アドバイス付き。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "塾・予備校費用 比較計算機",
      "applicationCategory": "EducationApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "月謝・入会金・季節講習・交通費まで含めた通塾期間の総費用を自動計算。最大3校を同時比較・1時間単価・コスト削減アドバイス付き。登録不要・完全無料。",
      "url": "https://yamada-tools.jp/education/cram-school-calculator",
      "datePublished": "2026-04-01",
      "dateModified": "2026-04-01",
      "inLanguage": "ja",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "教育・学習", "item": "https://yamada-tools.jp/education" },
        { "@type": "ListItem", "position": 3, "name": "塾・予備校費用 比較計算機", "item": "https://yamada-tools.jp/education/cram-school-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "塾の費用は月謝以外に何がかかりますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "月謝以外に、入会金（1〜3万円）・年間教材費（テキスト代・プリント代、年間1〜5万円）・季節講習費（春夏冬、年間10〜30万円）・交通費（月数千円〜1万円以上）が主な費用です。月謝だけで比較すると実際の総費用を大幅に見誤る場合があります。",
          },
        },
        {
          "@type": "Question",
          "name": "個別指導と集団塾、どちらがコスパが良いですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "1時間あたりの費用で比較すると集団塾が安いことが多いです（1,500〜3,000円/時間）。個別指導（1対1）は3,000〜8,000円/時間と高めですが、苦手科目の集中対策や授業ペース調整など集団塾にないメリットがあります。目的と予算で選択しましょう。",
          },
        },
        {
          "@type": "Question",
          "name": "オンライン塾は対面塾より本当に安いですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、一般的にオンライン塾の方が安いです。対面個別指導が月3〜6万円のところ、オンライン個別は月1.5〜3万円程度が相場です。さらに交通費が不要になるため、年間で数万円の節約になります。ただし自己管理能力が必要です。",
          },
        },
        {
          "@type": "Question",
          "name": "季節講習は必ず受ける必要がありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "必須ではありません。季節講習は年間費用の20〜40%を占める場合があり、家計への影響が大きいです。苦手科目や受験学年は有効ですが、通常学年では必要な科目・講座のみ選択的に受講することでコストを抑えられます。",
          },
        },
        {
          "@type": "Question",
          "name": "中学受験・高校受験・大学受験で塾費用の相場は違いますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、大きく異なります。中学受験対策塾（小4〜6年）は月3〜7万円・3年間で200〜400万円、高校受験塾（中1〜3年）は月2〜4万円・3年間で100〜200万円、大学受験予備校（高1〜3年・浪人）は月4〜10万円・1〜3年間で100〜400万円が目安です。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "塾・予備校費用の比較計算方法",
      "description": "複数の塾・予備校の総費用を正確に比較する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "お子様の情報を入力", "text": "対象者（小学生〜大学受験生）・学年・通塾予定期間・目的を選択します。" },
        { "@type": "HowToStep", "position": 2, "name": "塾の情報を入力（最大3校）", "text": "各塾の月謝・授業形式・入会金・教材費・季節講習費・交通費を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算・比較する", "text": "「計算する」を押すと費用サマリー・比較表・内訳グラフ・コスト削減アドバイスが表示されます。" },
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
