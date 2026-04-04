import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】偏差値 計算機｜点数から偏差値・上位%・クラス順位を自動計算 | 山田ツール",
  description: "点数・平均点・標準偏差から偏差値を自動計算。上位%・クラス順位・大学合格難易度も表示。複数科目比較・偏差値から点数の逆算も対応。登録不要・完全無料。",
  keywords: [
    "偏差値 計算",
    "偏差値 計算機",
    "偏差値 出し方",
    "偏差値 求め方",
    "標準偏差 計算",
    "偏差値 上位 パーセント",
    "偏差値 逆算",
    "偏差値 大学",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/education/deviation-score",
  },
  openGraph: {
    title: "【無料】偏差値 計算機｜点数から偏差値・上位%・クラス順位を自動計算 | 山田ツール",
    description: "点数・平均点・標準偏差から偏差値を自動計算。上位%・クラス順位・大学合格難易度も表示。複数科目比較・偏差値から点数の逆算も対応。登録不要・完全無料。",
    url: "https://yamada-tools.jp/education/deviation-score",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】偏差値 計算機｜点数から偏差値・上位%・クラス順位を自動計算 | 山田ツール",
    description: "点数・平均点・標準偏差から偏差値を自動計算。上位%・クラス順位・大学合格難易度も表示。複数科目比較・偏差値から点数の逆算も対応。登録不要・完全無料。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "偏差値 計算機",
      "applicationCategory": "EducationApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "点数・平均点・標準偏差から偏差値を自動計算。上位%・クラス順位・大学合格難易度も表示。複数科目の比較・偏差値から点数の逆算も対応。登録不要・無料。",
      "url": "https://yamada-tools.jp/education/deviation-score",
      "datePublished": "2026-04-01",
      "dateModified": "2026-04-01",
      "inLanguage": "ja",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "教育・学習", "item": "https://yamada-tools.jp/education" },
        { "@type": "ListItem", "position": 3, "name": "偏差値 計算機", "item": "https://yamada-tools.jp/education/deviation-score" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "偏差値50は平均点ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、偏差値50はちょうど平均点に相当します。偏差値60は上位約16%、偏差値40は下位約16%に位置します。" },
        },
        {
          "@type": "Question",
          "name": "偏差値はどの模試でも同じですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "いいえ異なります。偏差値は受験した集団の中での相対的な位置を示すため受験者層によって大きく変わります。同じ模試・同じ母集団での比較が重要です。" },
        },
        {
          "@type": "Question",
          "name": "偏差値を10上げるのは難しいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "難しいですが不可能ではありません。弱点科目の克服と得意科目の強化を組み合わせることで3〜6ヶ月の集中学習で達成できることもあります。" },
        },
        {
          "@type": "Question",
          "name": "標準偏差がわからない場合はどうすればいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "本ツールの点数を入力して自動計算機能を使うとクラス全員の点数から平均・標準偏差を自動計算できます。一般的に標準偏差は平均点の約20〜30%程度が目安です。" },
        },
        {
          "@type": "Question",
          "name": "大学受験の合格に必要な偏差値はどう調べますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "河合塾・駿台・ベネッセなどの予備校が毎年更新しています。同じ予備校の模試を継続的に受けて比較することが重要です。合格可能性60〜80%の偏差値を目標の目安にします。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "偏差値の計算方法",
      "description": "点数・平均点・標準偏差から偏差値を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "計算方法を選択", "text": "点数から偏差値を計算するか、点数一覧から自動計算するかを選択します。" },
        { "@type": "HowToStep", "position": 2, "name": "点数情報を入力", "text": "自分の点数・平均点・標準偏差を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと偏差値・上位%・クラス順位・大学合格難易度が表示されます。" },
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
