import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】債務整理 診断ツール｜5つの質問で最適な方法を診断 任意整理・個人再生・自己破産 ",
  description: "5つの質問に答えるだけで任意整理・個人再生・自己破産の最適な方法を診断。月々の返済削減額の目安と今すぐできる次のステップも表示。登録不要・完全無料。",
  keywords: [
    "債務整理 診断",
    "任意整理 診断",
    "個人再生 診断",
    "自己破産 診断",
    "借金 診断ツール",
    "債務整理 どれ",
    "任意整理 個人再生 自己破産 違い",
    "借金 減額 シミュレーション",
    "債務整理 無料診断",
    "借金 相談",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/debt/debt-diagnosis",
  },
  openGraph: {
    title: "【無料】債務整理 診断ツール｜5つの質問で最適な方法を診断 ",
    description: "5つの質問に答えるだけで任意整理・個人再生・自己破産の最適な方法を診断。月々の返済削減額の目安と次のステップも表示。登録不要・完全無料。",
    url: "https://yamada-tools.jp/debt/debt-diagnosis",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】債務整理 診断ツール｜5つの質問で最適な方法を診断 ",
    description: "5つの質問に答えるだけで任意整理・個人再生・自己破産の最適な方法を診断。登録不要・完全無料。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "債務整理 診断ツール",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "5つの質問に答えるだけで最適な債務整理方法（任意整理・個人再生・自己破産）を診断。月々の返済削減額の目安と次のステップも表示。登録不要・完全無料。",
      "url": "https://yamada-tools.jp/debt/debt-diagnosis",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "借金・債務整理", "item": "https://yamada-tools.jp/debt" },
        { "@type": "ListItem", "position": 3, "name": "債務整理 診断ツール", "item": "https://yamada-tools.jp/debt/debt-diagnosis" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "債務整理をすると会社にバレますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "任意整理・個人再生・自己破産いずれも原則として勤務先に通知されることはありません。官報への掲載がありますが一般の方が確認することはほとんどありません。",
          },
        },
        {
          "@type": "Question",
          "name": "債務整理後に就職・転職はできますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "任意整理・個人再生は職業制限がなくほぼすべての職業に就けます。自己破産は免責確定までの期間一部の職業に制限がありますが免責後は解除されます。",
          },
        },
        {
          "@type": "Question",
          "name": "借金を1社だけ任意整理することはできますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、任意整理は特定の債権者だけを選んで手続きできます。金利の高い消費者金融だけを整理して住宅ローンは整理しないことも可能です。",
          },
        },
        {
          "@type": "Question",
          "name": "弁護士への依頼費用はどう工面すればいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "法テラスの費用立替制度・弁護士事務所の分割払い・着手金不要の事務所選択などの方法があります。依頼後は債権者への返済を止められるためその分を費用に充てることもできます。",
          },
        },
        {
          "@type": "Question",
          "name": "債務整理の相談をしただけで手続きが始まりますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "いいえ、相談しただけでは手続きは始まりません。正式に依頼（委任契約）して初めて手続きが始まります。無料相談後に断ることも自由です。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "債務整理診断の使い方",
      "description": "5つの質問に答えて最適な債務整理方法を診断する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "返済状況を選択",
          "text": "現在の借金の返済状況を4つの選択肢から選びます。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "借金額・収入・資産を選択",
          "text": "借金総額・月収・住宅の有無を選択します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "診断結果を確認",
          "text": "5問回答後に最適な債務整理方法と次のステップが表示されます。",
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
