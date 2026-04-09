import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】年収アップシミュレーター｜転職・昇給・副業で年収600万円達成 2026年版",
  description: "現在の年収と目標を入力し、転職・昇給・副業・スキルアップの4つの戦略を組み合わせて最短達成ルートをシミュレーション。手取り・ROI・回収期間まで自動計算。",
  alternates: {
    canonical: "https://yamada-tools.jp/career/salary-increase-simulator",
  },
  openGraph: {
    url: "https://yamada-tools.jp/career/salary-increase-simulator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E5%B9%B4%E5%8F%8E%E3%82%A2%E3%83%83%E3%83%97%E3%82%B7%E3%83%9F%E3%83%A5%E3%83%AC%E3%83%BC%E3%82%BF%E3%83%BC%EF%BD%9C%E8%BB%A2%E8%81%B7%E3%83%BB%E6%98%87%E7%B5%A6%E3%83%BB%E5%89%AF%E6%A5%AD%E3%81%A7%E5%B9%B4%E5%8F%8E600%E4%B8%87%E5%86%86%E9%81%94%E6%88%90%202026%E5%B9%B4%E7%89%88" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "年収アップシミュレーター",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "転職・昇給・副業・スキルアップの4戦略を組み合わせて目標年収の最短達成ルートを計算。手取り・ROI・回収期間も算出。",
      "url": "https://yamada-tools.jp/career/salary-increase-simulator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "年収アップシミュレーター", "item": "https://yamada-tools.jp/career/salary-increase-simulator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "年収を100万円上げるのに何年かかりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "昇給のみでは一般的に5〜10年かかりますが、転職を活用すれば1〜3年で達成できる場合があります。転職による年収アップの平均は初回で約10〜20%とされています。本ツールで具体的なシナリオを計算してみてください。" },
        },
        {
          "@type": "Question",
          "name": "スキルアップ投資のROIはどう計算しますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "スキルアップ投資のROIは「(年収アップ額 × 年数 - 投資額) ÷ 投資額 × 100%」で計算できます。例えば50万円の資格取得費用で年収が20万円上がった場合、5年で投資回収（ROI 100%）できます。" },
        },
        {
          "@type": "Question",
          "name": "副業と本業の年収アップ、どちらが効率的ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "短期的には副業が効率的ですが、副業収入は雑所得として高率課税されるため実質手取りは低くなります。長期的には本業の昇給・転職による年収アップのほうが社会保険・退職金・将来の年金受給額にも好影響を与えます。" },
        },
        {
          "@type": "Question",
          "name": "年収600万円を目指すために最も効果的な方法は？",
          "acceptedAnswer": { "@type": "Answer", "text": "日本の中央値年収（約450万円）から600万円を目指す場合、転職が最も効果的なケースが多いです。業界・職種によって年収レンジが大きく異なるため、まず市場相場を確認し、需要の高いスキルを身につけながら転職を検討することをお勧めします。" },
        },
        {
          "@type": "Question",
          "name": "昇給交渉のタイミングはいつが最適ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "成果が出た直後、評価サイクルの前（多くは9〜10月または3〜4月）、転職オファーを持っているときが交渉しやすいタイミングです。市場価値データを示した根拠ある交渉が成功率を高めます。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "年収アップシミュレーションの使い方",
      "description": "現在の年収と目標年収から最短達成戦略を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "現在の年収と目標を入力", "text": "現在の年収・目標年収・年齢・職種を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "戦略を選択", "text": "転職・昇給・副業・スキルアップの組み合わせとパラメータを設定します。" },
        { "@type": "HowToStep", "position": 3, "name": "結果を確認", "text": "「計算する」を押すと達成年数・手取り変化・ROI・回収期間が表示されます。" },
      ],
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
