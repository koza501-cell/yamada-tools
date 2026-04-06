import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】アルコール分解時間計算機｜飲酒後いつ運転できる？翌朝の残存確認も ",
  description: "飲んだお酒の種類と量から血中アルコール濃度と完全分解時刻を計算。飲酒運転が可能になる時刻・翌朝の残存アルコールチェック付き。登録不要・完全無料。",
  keywords: [
    "アルコール分解時間",
    "飲酒運転 いつ運転できる",
    "血中アルコール濃度 計算",
    "BAC 計算",
    "お酒 抜ける時間",
    "飲酒 運転 計算機",
    "翌朝 アルコール残存",
    "純アルコール量 計算",
    "酒気帯び運転 基準",
    "飲酒 体重 計算",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/health/alcohol-calculator",
  },
  openGraph: {
    title: "【無料】アルコール分解時間計算機｜飲酒後いつ運転できる？翌朝の残存確認も ",
    description: "飲んだお酒の種類と量から血中アルコール濃度と完全分解時刻を計算。飲酒運転が可能になる時刻・翌朝の残存アルコールチェック付き。登録不要・完全無料。",
    url: "https://yamada-tools.jp/health/alcohol-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】アルコール分解時間計算機｜飲酒後いつ運転できる？翌朝残存確認付き ",
    description: "飲んだお酒の種類と量から血中アルコール濃度と完全分解時刻を計算。登録不要・無料。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "飲酒・アルコール分解 時間計算機",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "飲んだお酒の種類と量から血中アルコール濃度と完全分解時刻を計算。飲酒運転が可能になる時刻・翌朝の残存アルコールチェック付き。登録不要・完全無料。",
      "url": "https://yamada-tools.jp/health/alcohol-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "健康・ウェルネス", "item": "https://yamada-tools.jp/health" },
        { "@type": "ListItem", "position": 3, "name": "飲酒・アルコール分解 時間計算機", "item": "https://yamada-tools.jp/health/alcohol-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "アルコールを早く抜く方法はありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "残念ながらアルコールの分解を早める確実な方法はありません。時間だけが解決します。水を飲むことで脱水を防ぎ二日酔いの症状を和らげる効果はありますが血中アルコール濃度を下げる効果はありません。",
          },
        },
        {
          "@type": "Question",
          "name": "体重が重い人はお酒に強いですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "一般的に体重が重い方が同じ量のお酒での血中アルコール濃度は低くなります。ただし肝臓の分解酵素の量にも大きく影響されます。体重が重くても酵素量が少ない人は弱い場合があります。",
          },
        },
        {
          "@type": "Question",
          "name": "女性は男性より酔いやすいのはなぜですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "女性は体内の水分量が男性より少なく血中アルコール濃度が高くなること、アルコール分解酵素の活性が低い傾向があることが主な理由です。",
          },
        },
        {
          "@type": "Question",
          "name": "ちゃんぽんは酔いやすいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "同じ量の純アルコールであれば酔い方は変わりません。ただし飲んだ量を把握しにくくなり結果的に飲みすぎてしまうことが多いです。",
          },
        },
        {
          "@type": "Question",
          "name": "二日酔いを防ぐ方法はありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "飲む前に食事をする・水を一緒に飲む・純アルコール20g以下に抑える・週2日の休肝日を作る、などが効果的です。二日酔いは肝臓がアルコール処理で疲弊しているサインです。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "アルコール分解時間の計算方法",
      "description": "飲んだお酒の種類・量・体重から血中アルコール濃度と分解時刻を計算する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "基本情報を入力",
          "text": "性別・体重・飲み始めた時刻を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "飲んだお酒を入力",
          "text": "お酒の種類と量を入力します（最大6種類）。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "計算ボタンを押す",
          "text": "「計算する」を押すとBAC・完全分解時刻・運転可能時刻・翌朝チェックが表示されます。",
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
