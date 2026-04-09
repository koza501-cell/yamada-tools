import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】不動産取得税 計算機｜軽減措置を自動適用・土地・建物の税額を瞬時に計算 2026年版",
  description: "不動産取得税を軽減措置込みで自動計算。新築・中古・土地・建物に対応。宅地特例・住宅控除・築年数別控除を自動適用し、節税効果も表示。令和9年3月31日まで延長済み特例対応。",
  keywords: [
    "不動産取得税 計算",
    "不動産取得税 軽減措置",
    "不動産取得税 シミュレーター",
    "中古住宅 不動産取得税",
    "宅地 不動産取得税",
    "不動産取得税 いくら",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/realestate/acquisition-tax",
  },
  openGraph: {
    title: "【無料】不動産取得税 計算機｜軽減措置を自動適用・土地・建物の税額を瞬時に計算 2026年版",
    description: "不動産取得税を軽減措置込みで自動計算。新築・中古・土地・建物に対応。宅地特例・住宅控除・築年数別控除を自動適用し、節税効果も表示。",
    url: "https://yamada-tools.jp/realestate/acquisition-tax",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E4%B8%8D%E5%8B%95%E7%94%A3%E5%8F%96%E5%BE%97%E7%A8%8E%20%E8%A8%88%E7%AE%97%E6%A9%9F%EF%BD%9C%E8%BB%BD%E6%B8%9B%E6%8E%AA%E7%BD%AE%E3%82%92%E8%87%AA%E5%8B%95%E9%81%A9%E7%94%A8%E3%83%BB%E5%9C%9F%E5%9C%B0%E3%83%BB%E5%BB%BA%E7%89%A9%E3%81%AE%E7%A8%8E%E9%A1%8D%E3%82%92%E7%9E%AC%E6%99%82%E3%81%AB%E8%A8%88%E7%AE%97%202026%E5%B9%B4%E7%89%88" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】不動産取得税 計算機｜軽減措置を自動適用・土地・建物の税額を瞬時に計算 2026年版",
    description: "不動産取得税を軽減措置込みで自動計算。新築・中古・土地・建物に対応。宅地特例・住宅控除・築年数別控除を自動適用し、節税効果も表示。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "不動産取得税 計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": {
        "@type": "Organization",
        "name": "山田ツール",
        "url": "https://yamada-tools.jp",
      },
      "description":
        "不動産取得税を軽減措置込みで自動計算。新築・中古・土地・建物に対応。宅地特例・住宅控除・築年数別控除を自動適用。令和9年3月31日まで延長済み特例対応。",
      "url": "https://yamada-tools.jp/realestate/acquisition-tax",
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
          "name": "不動産取得税 計算機",
          "item": "https://yamada-tools.jp/realestate/acquisition-tax",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "不動産取得税はいつ払うのですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "不動産を取得してから数ヶ月〜半年後に、都道府県から納税通知書が届きます。通常、取得から6ヶ月〜1年以内に送付されます。",
          },
        },
        {
          "@type": "Question",
          "name": "新築住宅の不動産取得税の軽減措置とは？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "床面積50㎡以上240㎡以下の新築住宅は、固定資産税評価額から1,200万円（長期優良住宅は1,300万円）が控除されます。多くの新築住宅では税額がゼロになります。",
          },
        },
        {
          "@type": "Question",
          "name": "中古住宅の不動産取得税はいくらですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "自己居住用で床面積50㎡以上240㎡以下の中古住宅は、築年数に応じた控除額（100万〜1,200万円）が固定資産税評価額から差し引かれます。1997年以降の建物は1,200万円控除が適用されます。",
          },
        },
        {
          "@type": "Question",
          "name": "土地の不動産取得税はいくらですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "宅地の場合、固定資産税評価額の1/2を課税標準額とし、3%の税率を掛けた金額が基本税額です。住宅を建てる予定の土地は追加の軽減措置が適用される場合があります。",
          },
        },
        {
          "@type": "Question",
          "name": "不動産取得税の非課税（免税点）はいくらですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "土地は課税標準額10万円未満、建物（新築・増築）は23万円未満、建物（売買等）は12万円未満の場合は非課税となります。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "不動産取得税の計算方法",
      "description": "土地・建物の固定資産税評価額から不動産取得税を計算する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "土地の情報を入力",
          "text": "固定資産税評価額と宅地かどうか、住宅用途かを入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "建物の情報を入力",
          "text": "建物の種別（新築・中古・住宅・非住宅）と床面積、築年数を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "計算ボタンを押す",
          "text": "「計算する」を押すと軽減措置を自動適用した税額と節税効果が表示されます。",
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
