import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】任意整理 vs 個人再生 vs 自己破産 比較ツール｜あなたに最適な債務整理を判定 ",
  description: "借金の状況・資産・職業から任意整理・個人再生・自己破産の最適な方法を中立的に判定。財産・信用情報・職業・保証人への影響も詳細表示。登録不要・完全無料。",
  keywords: [
    "任意整理 自己破産 比較",
    "債務整理 どれがいい",
    "任意整理 個人再生 自己破産 違い",
    "債務整理 判定",
    "借金 整理 方法",
    "任意整理 メリット デメリット",
    "自己破産 条件",
    "個人再生 住宅ローン",
    "債務整理 無料相談",
    "借金 解決",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/debt/debt-restructuring-checker",
  },
  openGraph: {
    title: "【無料】任意整理 vs 個人再生 vs 自己破産 比較ツール｜あなたに最適な債務整理を判定 ",
    description: "借金の状況・資産・職業から任意整理・個人再生・自己破産の最適な方法を中立的に判定。財産・信用情報・職業・保証人への影響も詳細表示。登録不要・完全無料。",
    url: "https://yamada-tools.jp/debt/debt-restructuring-checker",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】任意整理 vs 個人再生 vs 自己破産 比較ツール｜あなたに最適な債務整理を判定 ",
    description: "借金の状況・資産・職業から任意整理・個人再生・自己破産の最適な方法を中立的に判定。財産・信用情報・職業・保証人への影響も詳細表示。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "任意整理 vs 自己破産 比較ツール",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "借金の状況・資産・職業から任意整理・個人再生・自己破産の最適な方法を中立的に判定。財産・信用情報・職業への影響も詳細表示。登録不要・完全無料。",
      "url": "https://yamada-tools.jp/debt/debt-restructuring-checker",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "借金・債務整理", "item": "https://yamada-tools.jp/debt" },
        { "@type": "ListItem", "position": 3, "name": "任意整理 vs 自己破産 比較ツール", "item": "https://yamada-tools.jp/debt/debt-restructuring-checker" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "債務整理をすると家族にバレますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "任意整理は最も家族に知られにくい方法です。個人再生・自己破産は官報に掲載されますが一般の方が確認することはほとんどありません。ただし保証人がいる借金の場合は保証人に影響が出ます。",
          },
        },
        {
          "@type": "Question",
          "name": "借金の保証人になっている家族への影響はありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "債務整理をすると連帯保証人には借金全額の請求が行きます。保証人への影響を最小化するためには早めに専門家に相談し保証人も含めた解決策を検討することが重要です。",
          },
        },
        {
          "@type": "Question",
          "name": "税金の滞納がある場合、債務整理できますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "税金・社会保険料などの公租公課は自己破産でも免除されません。消費者金融などの民事上の借金と一緒に手続きすることは可能です。税金の滞納については税務署への分割払い相談を並行して進めましょう。",
          },
        },
        {
          "@type": "Question",
          "name": "債務整理の費用はどのくらいかかりますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "任意整理は1社につき3〜5万円、個人再生・自己破産は30〜50万円程度が相場です。収入が少ない場合は法テラスの費用立替制度を利用できます。",
          },
        },
        {
          "@type": "Question",
          "name": "債務整理後は普通の生活に戻れますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、戻れます。信用情報への影響は5〜10年で解除されます。その間はローンやクレジットカードが使えませんが日常生活は普通に送れます。多くの方が債務整理後に生活を立て直しています。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "債務整理の最適な方法の判定方法",
      "description": "借金の状況・資産・生活状況から最適な債務整理方法を判定する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "借金の状況を入力",
          "text": "借金総額・月収・返済可能額・借入先数を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "資産・生活状況を入力",
          "text": "持ち家・自動車・職業・保証人の有無を選択します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "判定ボタンを押す",
          "text": "「判定する」を押すと任意整理・個人再生・自己破産の比較と推奨方法が表示されます。",
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
