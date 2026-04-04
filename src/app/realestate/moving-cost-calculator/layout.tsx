import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】引越し費用 見積もり計算機｜距離・荷物・時期から引越し料金を自動計算 | 山田ツール",
  description: "引越し費用を距離・荷物量・時期・オプションから自動計算。繁忙期・閑散期の料金差、節約ポイントも表示。単身〜ファミリーまで対応。複数社比較で最安値を見つけましょう。",
  keywords: [
    "引越し費用 計算",
    "引越し料金 相場",
    "引越し 見積もり",
    "引越し 繁忙期",
    "単身 引越し費用",
    "ファミリー 引越し費用",
    "引越し 節約",
    "引越し 閑散期",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/realestate/moving-cost-calculator",
  },
  openGraph: {
    title: "【無料】引越し費用 見積もり計算機｜距離・荷物・時期から引越し料金を自動計算 | 山田ツール",
    description: "引越し費用を距離・荷物量・時期・オプションから自動計算。繁忙期・閑散期の料金差、節約ポイントも表示。単身〜ファミリーまで対応。",
    url: "https://yamada-tools.jp/realestate/moving-cost-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】引越し費用 見積もり計算機｜距離・荷物・時期から引越し料金を自動計算 | 山田ツール",
    description: "引越し費用を距離・荷物量・時期・オプションから自動計算。繁忙期・閑散期の料金差、節約ポイントも表示。単身〜ファミリーまで対応。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "引越し費用 見積もり計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": {
        "@type": "Organization",
        "name": "山田ツール",
        "url": "https://yamada-tools.jp",
      },
      "description":
        "引越し費用を距離・荷物量・時期・オプションから自動見積もり。繁忙期・閑散期の料金差、節約ポイントも表示。単身〜ファミリーまで対応。登録不要・無料。",
      "url": "https://yamada-tools.jp/realestate/moving-cost-calculator",
      "datePublished": "2026-03-31",
      "dateModified": "2026-03-31",
      "inLanguage": "ja",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "ホーム",
          "item": "https://yamada-tools.jp",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "不動産・住まい",
          "item": "https://yamada-tools.jp/realestate",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "引越し費用 見積もり計算機",
          "item": "https://yamada-tools.jp/realestate/moving-cost-calculator",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "引越し費用の相場はいくらですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "単身・近距離の場合は3〜6万円、ファミリー（3〜4人）・中距離の場合は15〜25万円が一般的な相場です。3月の繁忙期は通常の1.5〜2倍になることがあります。",
          },
        },
        {
          "@type": "Question",
          "name": "引越し費用を最も安くするにはどうすればいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "複数社から一括見積もりを取る、繁忙期を避ける、平日・時間おまかせを選ぶ、不用品を事前処分して荷物量を減らす、自分で梱包するの5つが効果的です。",
          },
        },
        {
          "@type": "Question",
          "name": "引越し業者の見積もりはいつ頃取ればいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "引越し希望日の1〜2ヶ月前が理想的です。繁忙期は早めに予約が必要です。閑散期は直前でも予約でき当日割引を交渉できる場合もあります。",
          },
        },
        {
          "@type": "Question",
          "name": "単身パックとはどんなサービスですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "荷物が少ない単身者向けの格安引越しプランで通常より30〜50%安くなります。荷物がボックス1〜2個に収まる場合に最適です。",
          },
        },
        {
          "@type": "Question",
          "name": "引越し費用は会社から補助が出ますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "転勤による引越しの場合、多くの企業で引越し費用の全額または一部を会社が負担します。転居を伴う転勤の場合は確定申告で引越し費用の一部が控除になる場合もあります。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "引越し費用の見積もり方法",
      "description": "出発地・目的地・荷物量・時期から引越し費用を計算する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "基本情報を入力",
          "text": "引越し元・先の都道府県・時期・希望日・時間帯を選択します。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "荷物・家族情報を入力",
          "text": "世帯人数・間取り・荷物量・大型家具数・エレベーターの有無を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "オプションを選択",
          "text": "エアコン工事・不用品処分・梱包資材などのオプションを選択します。",
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "計算ボタンを押す",
          "text": "「計算する」を押すと費用の目安・内訳・節約アドバイスが表示されます。",
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
