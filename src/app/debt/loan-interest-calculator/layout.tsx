import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】カードローン利息計算機｜複数ローンの利息・完済日・借り換え効果を一括計算 | 山田ツール",
  description: "複数のカードローンの利息・完済日を一括計算。日別・月別の利息内訳、借り換えによる節約額、追加借入の影響も自動表示。返済優先順位アドバイス付き。登録不要・無料。",
  keywords: [
    "カードローン 利息 計算機",
    "カードローン 比較",
    "カードローン 完済 いつ",
    "カードローン 借り換え",
    "消費者金融 金利 計算",
    "カードローン 返済 シミュレーション",
    "複数 ローン 比較",
    "おまとめローン 効果",
    "カードローン 総利息",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/debt/loan-interest-calculator",
  },
  openGraph: {
    title: "【無料】カードローン利息計算機｜複数ローンの利息・完済日・借り換え効果を一括計算 | 山田ツール",
    description: "複数のカードローンの利息・完済日を一括計算。日別・月別の利息内訳、借り換えによる節約額、追加借入の影響も自動表示。返済優先順位アドバイス付き。登録不要・無料。",
    url: "https://yamada-tools.jp/debt/loan-interest-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】カードローン利息計算機｜複数ローンの利息・完済日・借り換え効果を一括計算 | 山田ツール",
    description: "複数のカードローンの利息・完済日を一括計算。借り換え節約額・追加借入の影響・返済優先順位も自動表示。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "カードローン利息計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "複数のカードローンの利息・完済日を一括計算。借り換え効果・追加借入の影響・返済優先順位も自動表示。日別・月別・年別の利息内訳付き。登録不要・完全無料。",
      "url": "https://yamada-tools.jp/debt/loan-interest-calculator",
      "datePublished": "2026-03-31",
      "dateModified": "2026-03-31",
      "inLanguage": "ja",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "借金・債務整理", "item": "https://yamada-tools.jp/debt" },
        { "@type": "ListItem", "position": 3, "name": "カードローン利息計算機", "item": "https://yamada-tools.jp/debt/loan-interest-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "カードローンとクレジットカードのキャッシングはどう違いますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "カードローンはお金を借りることに特化した商品です。クレジットカードのキャッシングはカードの付帯機能です。金利は両者とも年15〜18%程度が多く大きな差はありません。カードローンの方が限度額が高い傾向があります。" },
        },
        {
          "@type": "Question",
          "name": "複数のカードローンを一本化するメリットは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "管理が楽になる・金利が下がることで総利息が減る可能性がある・毎月の返済額を整理できる、の3点がメリットです。ただしおまとめローンの金利が現在より高い場合はデメリットになります。" },
        },
        {
          "@type": "Question",
          "name": "カードローンの審査落ちを繰り返すとどうなりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "複数に短期間で申し込むと信用情報機関に多重申込として記録され審査に不利になります。審査落ちが続く場合は専門家に相談して借金全体の見直しを検討しましょう。" },
        },
        {
          "@type": "Question",
          "name": "カードローンの返済中に新たに借入することはできますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "限度額の範囲内であれば追加借入は可能です。ただし残高が増えると月々の利息も増え完済が遠のきます。追加借入シミュレーションで影響を確認してから判断することをお勧めします。" },
        },
        {
          "@type": "Question",
          "name": "カードローンの返済が苦しくなった場合の対処法は？",
          "acceptedAnswer": { "@type": "Answer", "text": "カード会社への返済条件の変更相談・低金利ローンへの借り換え・任意整理などの債務整理の検討が主な対処法です。早めに弁護士・司法書士に無料相談することをお勧めします。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "カードローン利息の計算方法",
      "description": "複数のカードローンの利息と完済日を一括計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "ローン情報を入力", "text": "各カードローンの残高・金利・月返済額を入力します（最大4件）。" },
        { "@type": "HowToStep", "position": 2, "name": "オプション設定", "text": "借り換えや追加借入を検討している場合は該当項目を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと各ローンの利息・完済日・借り換え効果が表示されます。" },
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
