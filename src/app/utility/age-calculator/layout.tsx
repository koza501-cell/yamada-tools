import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】年齢計算機｜和暦（令和・平成・昭和）西暦対応 干支・次の誕生日も表示 ",
  description: "生年月日から正確な年齢を計算。和暦（令和・平成・昭和・大正・明治）完全対応。次の誕生日カウントダウン・干支・世代判定・定年/年金受給年齢も表示。登録不要・無料。",
  keywords: [
    "年齢計算機",
    "年齢計算",
    "和暦 年齢",
    "昭和 年齢計算",
    "平成 年齢計算",
    "令和 年齢計算",
    "生年月日 年齢",
    "誕生日 何日",
    "数え年 計算",
    "干支 生まれ年",
    "次の誕生日 何日",
    "和暦 西暦 変換",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/utility/age-calculator",
  },
  openGraph: {
    title: "【無料】年齢計算機｜和暦（令和・平成・昭和）西暦対応 ",
    description: "生年月日から正確な年齢を計算。和暦（令和・平成・昭和・大正・明治）完全対応。次の誕生日カウントダウン・干支・世代判定も表示。",
    url: "https://yamada-tools.jp/utility/age-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】年齢計算機｜和暦（令和・平成・昭和）西暦対応 ",
    description: "生年月日から正確な年齢を計算。和暦完全対応・干支・次の誕生日カウントダウン付き。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "年齢計算機（和暦・西暦対応）",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "生年月日から正確な年齢を計算。和暦（令和・平成・昭和・大正・明治）完全対応。次の誕生日カウントダウン・干支・世代判定・定年/年金受給年齢も表示。登録不要・無料。",
      "url": "https://yamada-tools.jp/utility/age-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "日常生活・便利ツール", "item": "https://yamada-tools.jp/utility" },
        { "@type": "ListItem", "position": 3, "name": "年齢計算機", "item": "https://yamada-tools.jp/utility/age-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "和暦と西暦の変換はどうやるのですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "令和は西暦から2018を引くと和暦年になります。平成は西暦から1988を引きます。昭和は西暦から1925を引きます。本ツールでは自動変換されます。",
          },
        },
        {
          "@type": "Question",
          "name": "数え年とは何ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "生まれた年を1歳として毎年1月1日に1歳加算する日本の伝統的な年齢の数え方です。現代では法律・公的書類では満年齢が使われますが年祝い等では数え年が使われます。",
          },
        },
        {
          "@type": "Question",
          "name": "誕生日の計算はいつ切り替わりますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "法律上は誕生日の前日の深夜0時に年齢が加算されます。4月1日生まれの方は3月31日に年齢が上がるため小学校入学が前年生まれの子と同じになります。",
          },
        },
        {
          "@type": "Question",
          "name": "満年齢で何歳になるか素早く計算するには？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "今年の誕生日が過ぎていれば今年の西暦から生まれ年を引いた数が満年齢です。誕生日がまだの場合はさらに1を引きます。",
          },
        },
        {
          "@type": "Question",
          "name": "平成から令和への切り替わりはいつですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "令和元年は2019年5月1日から始まりました。2019年1月〜4月は平成31年、5月1日以降が令和元年です。2019年生まれは生まれ月によって平成か令和かが変わります。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "年齢の計算方法",
      "description": "生年月日から正確な年齢と次の誕生日を計算する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "入力方式を選択",
          "text": "西暦または和暦（令和・平成・昭和等）のどちらかで生年月日を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "基準日を確認",
          "text": "今日の日付が自動設定されます。特定日時点の年齢を計算する場合は基準日を変更します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "計算ボタンを押す",
          "text": "「計算する」を押すと満年齢・次の誕生日・干支・世代・マイルストーンが表示されます。",
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
