import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】標準体重・肥満度 判定ツール｜BMI式・ブローカ式・メタボ腹囲チェック | 山田ツール",
  description: "BMI式・ブローカ式など複数の方法で標準体重と肥満度を判定。腹囲によるメタボリックシンドロームチェック・体脂肪率判定も対応。登録不要・完全無料。",
  keywords: [
    "標準体重 計算",
    "肥満度 判定",
    "標準体重 計算機",
    "ブローカ式 標準体重",
    "BMI 標準体重",
    "メタボリックシンドローム 腹囲",
    "体脂肪率 判定",
    "ローレル指数",
    "肥満度 計算",
    "標準体重 男性",
    "標準体重 女性",
    "理想体重",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/health/ideal-weight-calculator",
  },
  openGraph: {
    title: "【無料】標準体重・肥満度 判定ツール｜BMI式・ブローカ式・メタボ腹囲チェック | 山田ツール",
    description: "BMI式・ブローカ式など複数の方法で標準体重と肥満度を判定。腹囲によるメタボリックシンドロームチェック・体脂肪率判定も対応。登録不要・完全無料。",
    url: "https://yamada-tools.jp/health/ideal-weight-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】標準体重・肥満度 判定ツール｜BMI式・ブローカ式・メタボ腹囲チェック | 山田ツール",
    description: "BMI式・ブローカ式など複数の方法で標準体重と肥満度を判定。腹囲メタボチェック・体脂肪率判定も対応。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "標準体重・肥満度 判定ツール",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "BMI式・ブローカ式など複数の計算方法で標準体重と肥満度を判定。腹囲によるメタボリックシンドロームチェック・体脂肪率判定も対応。登録不要・無料。",
      "url": "https://yamada-tools.jp/health/ideal-weight-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "健康・ウェルネス", "item": "https://yamada-tools.jp/health" },
        { "@type": "ListItem", "position": 3, "name": "標準体重・肥満度 判定ツール", "item": "https://yamada-tools.jp/health/ideal-weight-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "標準体重と適正体重はどう違いますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "一般的に同じ意味で使われますが計算方法によって若干異なります。医学的に最も推奨されるのはBMI式（身長m² × 22）による標準体重です。",
          },
        },
        {
          "@type": "Question",
          "name": "BMIと肥満度はどう違いますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "BMIは体重と身長から計算した絶対的な指標です。肥満度は標準体重（BMI22）からの偏差率（%）で標準体重からどれだけ乖離しているかを示します。",
          },
        },
        {
          "@type": "Question",
          "name": "メタボリックシンドロームの腹囲基準はなぜ男女で違うのですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "男性と女性では内臓脂肪のつき方が異なるためです。男性は内臓脂肪がつきやすく女性は皮下脂肪がつきやすいため同じ腹囲でも内臓脂肪量が異なり基準値が異なります。",
          },
        },
        {
          "@type": "Question",
          "name": "体脂肪率が高いのにBMIが正常な場合はどう考えればいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "隠れ肥満（内臓脂肪型肥満）の状態です。BMIだけでなく体脂肪率や腹囲も確認することが重要です。筋力トレーニングで筋肉量を増やすことが改善への近道です。",
          },
        },
        {
          "@type": "Question",
          "name": "子供の肥満度はどう計算しますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "子供の肥満度は主にローレル指数（体重kg÷身長cm³×10⁷）で評価します。115〜145が標準とされ学校の健康診断でも使われる指標です。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "標準体重・肥満度の判定方法",
      "description": "身長・体重・腹囲から標準体重と肥満度を判定する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "基本情報を入力", "text": "性別・年齢・身長・体重を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "任意情報を入力", "text": "腹囲や体脂肪率がわかれば入力するとより詳しい判定ができます。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「判定する」を押すと複数方式の標準体重・肥満度・メタボ判定・アドバイスが表示されます。" },
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
