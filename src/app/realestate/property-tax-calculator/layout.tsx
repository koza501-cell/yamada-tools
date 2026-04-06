import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】固定資産税 計算機｜住宅用地特例・新築軽減を自動適用して計算 2026年版 ",
  description: "固定資産税・都市計画税を軽減措置込みで自動計算。住宅用地特例（1/6・1/3）・新築住宅1/2軽減を自動適用。年間・月額・軽減期間シミュレーション表示。登録不要・無料。",
  keywords: [
    "固定資産税 計算",
    "固定資産税 シミュレーター",
    "固定資産税 軽減措置",
    "都市計画税 計算",
    "住宅用地特例",
    "新築住宅 固定資産税",
    "固定資産税 いくら",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/realestate/property-tax-calculator",
  },
  openGraph: {
    title: "【無料】固定資産税 計算機｜住宅用地特例・新築軽減を自動適用して計算 2026年版 ",
    description: "固定資産税・都市計画税を軽減措置込みで自動計算。住宅用地特例（1/6・1/3）・新築住宅1/2軽減を自動適用。年間・月額・軽減期間シミュレーション表示。",
    url: "https://yamada-tools.jp/realestate/property-tax-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】固定資産税 計算機｜住宅用地特例・新築軽減を自動適用して計算 2026年版 ",
    description: "固定資産税・都市計画税を軽減措置込みで自動計算。住宅用地特例（1/6・1/3）・新築住宅1/2軽減を自動適用。年間・月額・軽減期間シミュレーション表示。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "固定資産税 計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": {
        "@type": "Organization",
        "name": "山田ツール",
        "url": "https://yamada-tools.jp",
      },
      "description":
        "固定資産税・都市計画税を自動計算。住宅用地特例（1/6・1/3）・新築住宅軽減（1/2）を自動適用。年間・月額・軽減期間シミュレーション付き。2026年最新対応。",
      "url": "https://yamada-tools.jp/realestate/property-tax-calculator",
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
          "name": "固定資産税 計算機",
          "item": "https://yamada-tools.jp/realestate/property-tax-calculator",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "固定資産税はいつ払うのですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "毎年4〜6月頃に市区町村から納税通知書が届きます。年4回（4月・7月・12月・翌2月）に分けて納付するか一括払いを選べます。",
          },
        },
        {
          "@type": "Question",
          "name": "固定資産税評価額と購入価格はどう違いますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "固定資産税評価額は市区町村が決定する価格で購入価格とは異なります。一般的に土地は公示地価の約70%、建物は建築費の50〜60%が目安です。",
          },
        },
        {
          "@type": "Question",
          "name": "マンションの固定資産税は一戸建てより安いですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "一般的に同じ規模であればマンションの方が安くなる傾向があります。土地を区分所有するため一人当たりの土地面積が小さく小規模住宅用地特例がフルに適用されやすいためです。",
          },
        },
        {
          "@type": "Question",
          "name": "固定資産税はずっと同じ金額ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "いいえ、3年ごとの評価替えで変わります。新築住宅の軽減期間終了後は税額が倍増することも覚えておきましょう。次回の評価替えは2027年の予定です。",
          },
        },
        {
          "@type": "Question",
          "name": "空き家にも固定資産税はかかりますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "はい、空き家でも所有している限り固定資産税はかかります。特定空き家に指定されると住宅用地特例が外れ固定資産税が最大6倍になる場合があります。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "固定資産税の計算方法",
      "description": "土地・建物の評価額から固定資産税・都市計画税を計算する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "土地情報を入力",
          "text": "土地の評価額・用途・都市計画区域内かどうかを入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "建物情報を入力",
          "text": "建物の評価額・種別・新築からの経過年数を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "計算ボタンを押す",
          "text": "「計算する」を押すと固定資産税・都市計画税・年間合計・軽減シミュレーションが表示されます。",
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
