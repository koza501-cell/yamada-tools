import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】借金返済シミュレーター｜完済日・総利息・繰り上げ返済効果を自動計算",
  description: "借金の残高・金利・月返済額を入力するだけで完済予定日と総利息を自動計算。複数の借金に対応。リボ払い危険度判定・繰り上げ返済効果も表示。登録不要・完全無料。",
  keywords: [
    "借金返済 シミュレーター",
    "借金返済 計算機",
    "借金 完済 いつ",
    "リボ払い 危険",
    "繰り上げ返済 効果",
    "借金 総利息 計算",
    "消費者金融 返済",
    "債務整理 相談",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/debt/repayment-simulator",
  },
  openGraph: {
    title: "【無料】借金返済シミュレーター｜完済日・総利息・繰り上げ返済効果を自動計算",
    description: "借金の残高・金利・月返済額を入力するだけで完済予定日と総利息を自動計算。複数の借金に対応。リボ払い危険度判定・繰り上げ返済効果も表示。登録不要・完全無料。",
    url: "https://yamada-tools.jp/debt/repayment-simulator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E5%80%9F%E9%87%91%E8%BF%94%E6%B8%88%E3%82%B7%E3%83%9F%E3%83%A5%E3%83%AC%E3%83%BC%E3%82%BF%E3%83%BC%EF%BD%9C%E5%AE%8C%E6%B8%88%E6%97%A5%E3%83%BB%E7%B7%8F%E5%88%A9%E6%81%AF%E3%83%BB%E7%B9%B0%E3%82%8A%E4%B8%8A%E3%81%92%E8%BF%94%E6%B8%88%E5%8A%B9%E6%9E%9C%E3%82%92%E8%87%AA%E5%8B%95%E8%A8%88%E7%AE%97" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】借金返済シミュレーター｜完済日・総利息・繰り上げ返済効果を自動計算",
    description: "借金の残高・金利・月返済額を入力するだけで完済予定日と総利息を自動計算。複数の借金に対応。リボ払い危険度判定・繰り上げ返済効果も表示。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "借金返済シミュレーター",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "複数の借金の返済期間・総利息・完済日を自動計算。リボ払い危険度判定・繰り上げ返済効果・返済優先順位の最適化も対応。登録不要・完全無料。",
      "url": "https://yamada-tools.jp/debt/repayment-simulator",
      "datePublished": "2026-03-31",
      "dateModified": "2026-03-31",
      "inLanguage": "ja",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "借金・債務整理", "item": "https://yamada-tools.jp/debt" },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "借金返済シミュレーター",
          "item": "https://yamada-tools.jp/debt/repayment-simulator",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "毎月の最低返済額しか払えない場合どうなりますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "最低返済額が利息を下回っている場合、返済しても借金が減らず増え続けます。リボ払いや複数の借金を抱えている場合は特に注意が必要です。危険判定が出た場合は専門家への相談を検討してください。",
          },
        },
        {
          "@type": "Question",
          "name": "借金の繰り上げ返済はどれくらい効果がありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "非常に大きな効果があります。残高100万円・年利18%・月3万円返済の場合、月1万円の繰り上げ返済で返済期間が約1年10ヶ月短縮され、利息を約22万円節約できます。",
          },
        },
        {
          "@type": "Question",
          "name": "複数の借金がある場合、どれから返せばいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "金利が高い借金から返済するアバランチ法が総利息最小化に有効です。残高が少ない順のスノーボール法は達成感を得やすく継続しやすい方法です。",
          },
        },
        {
          "@type": "Question",
          "name": "借金の時効はありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "民事上の借金の消滅時効は原則5年です（2020年4月改正）。時効完成には返済や債務承認がなく時効援用の意思表示が必要です。安易に時効を期待せず返済計画を立てることを優先しましょう。",
          },
        },
        {
          "@type": "Question",
          "name": "借金が返せない場合の選択肢は何がありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "主に任意整理・個人再生・自己破産の3つの債務整理方法があります。任意整理は金利カット、個人再生は借金を最大1/5に減額、自己破産は借金をゼロにする方法です。弁護士・司法書士への無料相談をお勧めします。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "借金返済シミュレーションの使い方",
      "description": "借金残高・金利・月返済額から完済日と総利息を計算する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "借金情報を入力",
          "text": "借入先の種類・残高・金利・月々の返済額を入力します（最大5件）。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "繰り上げ返済を設定",
          "text": "毎月追加で返済できる金額があれば入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "計算ボタンを押す",
          "text": "「計算する」を押すと完済予定日・総利息・危険度判定が表示されます。",
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
