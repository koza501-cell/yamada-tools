import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】日付・日数 計算機｜営業日計算・祝日対応・和暦表示 日数差・日数加算 ",
  description: "2つの日付の差・日数の加減算・営業日計算を一括対応。日本の祝日（2024〜2027年）完全対応。和暦表示・期間内訳・ショートカットボタン付き。登録不要・完全無料。",
  keywords: [
    "日付計算",
    "日数計算",
    "営業日計算",
    "祝日",
    "和暦",
    "日付差",
    "日数加算",
    "ビジネスデー",
    "日付計算機",
    "日数計算機",
    "営業日計算機",
    "日本祝日",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/utility/date-calculator",
  },
  openGraph: {
    title: "【無料】日付・日数 計算機｜営業日計算・祝日対応・和暦表示 ",
    description: "2つの日付の差・日数の加減算・営業日計算を一括対応。日本の祝日完全対応。和暦表示・期間内訳付き。",
    url: "https://yamada-tools.jp/utility/date-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】日付・日数 計算機｜営業日計算・祝日対応・和暦表示 ",
    description: "2つの日付の差・日数の加減算・営業日計算を一括対応。日本の祝日完全対応・和暦表示付き。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "日付・日数 計算機",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "2つの日付の差・日数の加減算・営業日計算を一括対応。日本の祝日完全対応。和暦表示・期間内訳・ショートカットボタン付き。登録不要・完全無料。",
      "url": "https://yamada-tools.jp/utility/date-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "日常生活・便利ツール", "item": "https://yamada-tools.jp/utility" },
        { "@type": "ListItem", "position": 3, "name": "日付・日数 計算機", "item": "https://yamada-tools.jp/utility/date-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "「3営業日以内」とは何日以内ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "申込日の翌日から土日祝日を除いてカウントします。月曜日に申し込んだ場合、3営業日後は木曜日が期限です。祝日が挟まる場合はその分後ろにずれます。",
          },
        },
        {
          "@type": "Question",
          "name": "うるう年の計算はどうなりますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "本ツールは自動的にうるう年を考慮して計算します。うるう年は4年に1度ですが100で割り切れる年は除外、400で割り切れる年は例外的にうるう年になります。",
          },
        },
        {
          "@type": "Question",
          "name": "契約期間「3年間」の満了日はいつですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "契約開始日が2024年4月1日の場合、3年後の満了日は2027年3月31日となります。本ツールで開始日に3年を加算して計算できます。",
          },
        },
        {
          "@type": "Question",
          "name": "「翌月末日」はどうやって計算しますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "本ツールの日数加算モードで1ヶ月後を計算しその月の末日を確認できます。2月末日は年によって28日か29日が変わります。",
          },
        },
        {
          "@type": "Question",
          "name": "日本の祝日はどうやって計算していますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "2024〜2027年の日本の祝日データが組み込まれています。国民の祝日・振替休日を含めて正確に計算します。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "日付・日数の計算方法",
      "description": "2つの日付の差・日数の加減算・営業日を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "計算モードを選択", "text": "日数差の計算・日数の加減算・営業日計算の3モードから選択します。" },
        { "@type": "HowToStep", "position": 2, "name": "日付を入力", "text": "開始日・終了日または基準日と日数を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと日数・営業日数・期間内訳が表示されます。" },
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
