import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】教育費 積立シミュレーター｜幼稚園〜大学の総費用と必要積立額を計算 | 山田ツール",
  description: "幼稚園から大学まで教育費総額を自動計算。公立・私立の選択別費用比較・必要月積立額・学資保険vsNISA比較も表示。2026年最新データ対応。登録不要・無料。",
  keywords: [
    "教育費 積立",
    "教育費 シミュレーター",
    "学資保険 必要額",
    "教育費 計算",
    "子供 教育費 総額",
    "大学費用 積立",
    "NISA 教育費",
    "学資保険 NISA 比較",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/education/education-cost-simulator",
  },
  openGraph: {
    title: "【無料】教育費 積立シミュレーター｜幼稚園〜大学の総費用と必要積立額を計算 | 山田ツール",
    description: "幼稚園から大学まで教育費総額を自動計算。公立・私立の選択別費用比較・必要月積立額・学資保険vsNISA比較も表示。2026年最新データ対応。登録不要・無料。",
    url: "https://yamada-tools.jp/education/education-cost-simulator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】教育費 積立シミュレーター｜幼稚園〜大学の総費用と必要積立額を計算 | 山田ツール",
    description: "幼稚園から大学まで教育費総額を自動計算。公立・私立の選択別費用比較・必要月積立額・学資保険vsNISA比較も表示。2026年最新データ対応。登録不要・無料。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "教育費 積立シミュレーター",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "幼稚園から大学まで教育費総額を自動計算。公立・私立の選択別費用比較・必要月積立額・学資保険vsNISAの比較も表示。登録不要・完全無料。",
      "url": "https://yamada-tools.jp/education/education-cost-simulator",
      "datePublished": "2026-04-01",
      "dateModified": "2026-04-01",
      "inLanguage": "ja",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "教育・学習", "item": "https://yamada-tools.jp/education" },
        { "@type": "ListItem", "position": 3, "name": "教育費 積立シミュレーター", "item": "https://yamada-tools.jp/education/education-cost-simulator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "教育費はいつから準備し始めればいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "早ければ早いほど良いです。0歳から始めれば18年間の積立期間があり複利効果を最大限活用できます。月3万円を年利5%で18年積み立てると約1,000万円になります。" },
        },
        {
          "@type": "Question",
          "name": "学資保険とNISAはどちらが良いですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "積立期間によって異なります。学資保険は元本保証で確実ですが返戻率が低めです。NISAは長期で年利4〜6%が期待できますが元本保証はありません。10年以上ある場合はNISAが有利な場合が多いです。" },
        },
        {
          "@type": "Question",
          "name": "私立中学受験を考えています。費用はどのくらいかかりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "受験準備費用（塾代）は3年間で100〜300万円、私立中高の学費が6年間で430〜600万円程度かかります。合計500〜900万円程度を目安に準備することをお勧めします。" },
        },
        {
          "@type": "Question",
          "name": "大学進学時に奨学金を借りる予定ですが貯蓄は必要ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "必要です。奨学金は費用の一部しかカバーしないことが多く入学金等は事前準備が必要です。また奨学金は卒業後に子供の返済負担になります。できる範囲で準備することが理想です。" },
        },
        {
          "@type": "Question",
          "name": "教育費の不足分はどう対処すればいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "教育ローン・給付型奨学金の活用・大学でのアルバイト・進学先のコスト見直しなどが選択肢です。日本政策金融公庫の教育ローンは低金利でお勧めです。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "教育費積立額の計算方法",
      "description": "子供の年齢・教育プランから必要な積立額を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "子供の情報を入力", "text": "現在の年齢・人数・現在の貯蓄額を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "教育プランを選択", "text": "幼稚園から大学まで公立・私立を選択します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと教育費総額・必要月積立額・積立方法比較・ギャップ分析が表示されます。" },
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
