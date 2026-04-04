import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】睡眠時間 最適化ツール｜90分サイクルで最適な就寝・起床時刻を計算 | 山田ツール",
  description: "90分の睡眠サイクルに基づいて最適な就寝・起床時刻を計算。睡眠負債チェック・ソーシャルジェットラグ診断・年齢別推奨睡眠時間も表示。登録不要・完全無料。",
  keywords: [
    "睡眠時間 計算",
    "就寝時刻 計算",
    "起床時刻 計算",
    "睡眠サイクル 90分",
    "睡眠負債 チェック",
    "ソーシャルジェットラグ",
    "最適 睡眠時間",
    "何時に寝れば",
    "何時に起きれば",
    "睡眠 最適化",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/health/sleep-calculator",
  },
  openGraph: {
    title: "【無料】睡眠時間 最適化ツール｜90分サイクルで最適な就寝・起床時刻を計算 | 山田ツール",
    description: "90分の睡眠サイクルに基づいて最適な就寝・起床時刻を計算。睡眠負債チェック・ソーシャルジェットラグ診断・年齢別推奨睡眠時間も表示。登録不要・完全無料。",
    url: "https://yamada-tools.jp/health/sleep-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】睡眠時間 最適化ツール｜90分サイクルで最適な就寝・起床時刻を計算 | 山田ツール",
    description: "90分の睡眠サイクルに基づいて最適な就寝・起床時刻を計算。睡眠負債チェック・ソーシャルジェットラグ診断付き。登録不要・無料。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "睡眠時間 最適化ツール",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "90分の睡眠サイクルに基づいて最適な就寝・起床時刻を計算。睡眠負債チェック・ソーシャルジェットラグ診断・年齢別推奨睡眠時間も表示。登録不要・無料。",
      "url": "https://yamada-tools.jp/health/sleep-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "健康・ウェルネス", "item": "https://yamada-tools.jp/health" },
        { "@type": "ListItem", "position": 3, "name": "睡眠時間 最適化ツール", "item": "https://yamada-tools.jp/health/sleep-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "何時間寝れば十分ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "成人（20〜60代）は6〜8時間が推奨です。睡眠サイクル（90分×5回＝7.5時間）を意識すると目覚めがスッキリします。昼間に眠気を感じず集中力が維持できる時間が個人の適正睡眠時間です。",
          },
        },
        {
          "@type": "Question",
          "name": "休日に寝溜めをしても大丈夫ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "平日と休日で2時間以上ずれると社会的時差ぼけが起きます。月曜朝がつらい原因になります。毎日同じ時間に起きることが体内時計を整える最善の方法です。",
          },
        },
        {
          "@type": "Question",
          "name": "短時間睡眠でも大丈夫な人がいるのはなぜですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "遺伝的なショートスリーパーは人口の1〜3%程度です。多くの人は睡眠不足に慣れているだけで認知機能が低下していることを自覚できていないケースが多いです。",
          },
        },
        {
          "@type": "Question",
          "name": "昼寝はどのくらいの時間が理想ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "15〜30分（最長45分以内）が理想です。30分以上眠ると深い睡眠に入り目覚めが悪くなります。正午〜午後3時の間に取ることをお勧めします。",
          },
        },
        {
          "@type": "Question",
          "name": "寝つきが悪い場合の対策はありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "就寝1〜2時間前のぬるめのお風呂・スマートフォンのブルーライトを避ける・部屋を18〜22℃に保つ・午後2時以降のカフェインを控える、などが効果的です。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "最適な睡眠時刻の計算方法",
      "description": "起床時刻または就寝時刻から90分サイクルに基づく最適な睡眠時刻を計算する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "モードを選択",
          "text": "起きたい時刻から就寝時刻を計算するか、寝る時刻から起床時刻を計算するかを選択します。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "時刻と入眠時間を入力",
          "text": "起床または就寝予定時刻と、布団に入ってから眠るまでの時間を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "計算ボタンを押す",
          "text": "「計算する」を押すと4〜6サイクル分の最適時刻・睡眠負債チェック・アドバイスが表示されます。",
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
