import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】妊娠週数・出産予定日 計算機｜健診スケジュール・安定期・マイルストーンも表示 ",
  description: "最終月経日または排卵日から出産予定日・現在の妊娠週数を自動計算。安定期入り・健診スケジュール・週数別マイルストーン一覧付き。登録不要・完全無料。",
  keywords: [
    "妊娠週数 計算",
    "出産予定日 計算",
    "妊娠週数 計算機",
    "出産予定日 計算機",
    "妊娠 いつ産まれる",
    "妊婦健診 スケジュール",
    "安定期 いつ",
    "ネーゲレ概算法",
    "最終月経日 計算",
    "妊娠 トリメスター",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/health/pregnancy-calculator",
  },
  openGraph: {
    title: "【無料】妊娠週数・出産予定日 計算機｜健診スケジュール・マイルストーン付き ",
    description: "最終月経日または排卵日から出産予定日・現在の妊娠週数を自動計算。安定期入り・健診スケジュール・週数別マイルストーン一覧付き。登録不要・完全無料。",
    url: "https://yamada-tools.jp/health/pregnancy-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】妊娠週数・出産予定日 計算機｜健診スケジュール付き ",
    description: "最終月経日または排卵日から出産予定日・妊娠週数を自動計算。健診スケジュール・マイルストーン一覧付き。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "妊娠週数・出産予定日 計算機",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "最終月経日または排卵日から出産予定日・現在の妊娠週数を自動計算。安定期・健診スケジュール・週数別マイルストーン一覧付き。登録不要・完全無料。",
      "url": "https://yamada-tools.jp/health/pregnancy-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "健康・ウェルネス", "item": "https://yamada-tools.jp/health" },
        { "@type": "ListItem", "position": 3, "name": "妊娠週数・出産予定日 計算機", "item": "https://yamada-tools.jp/health/pregnancy-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "出産予定日は必ず正確ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "出産予定日はあくまで目安です。実際には予定日±2週間（37〜42週）の正産期に生まれることが多く、予定日通りに生まれる確率は約5%程度です。産婦人科での超音波検査により、より正確な出産予定日が算出されます。",
          },
        },
        {
          "@type": "Question",
          "name": "安定期とはいつですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "妊娠14週以降（第2三半期）を安定期と呼びます。胎盤が完成し流産リスクが大幅に下がります。つわりが和らぐ方も多く比較的体調が安定する時期です。",
          },
        },
        {
          "@type": "Question",
          "name": "妊娠初期に葉酸が必要な理由は何ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "葉酸は胎児の神経管の正常な発達に必要な栄養素です。神経管は妊娠4〜6週に形成されるため妊娠が分かる前から摂取することが推奨されています。厚生労働省は1日400μgの葉酸摂取を推奨しています。",
          },
        },
        {
          "@type": "Question",
          "name": "妊娠週数と胎児の大きさはどのくらいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "妊娠10週：約3cm、妊娠20週：約25cm、妊娠30週：約40cm・約1.5kg、妊娠40週：約50cm・約3kgが目安です。個人差が大きく超音波検査での確認が最も正確です。",
          },
        },
        {
          "@type": "Question",
          "name": "妊婦健診は何回受けるのが一般的ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "妊娠期間全体で14回程度が推奨されています。〜23週は4週に1回、24〜35週は2週に1回、36週以降は毎週1回が目安です。多くの自治体で14回分の費用補助があります。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "出産予定日・妊娠週数の計算方法",
      "description": "最終月経日または排卵日から出産予定日と妊娠週数を計算する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "計算方法を選択",
          "text": "最終月経日から計算するか排卵日から計算するかを選択します。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "日付を入力",
          "text": "最終月経開始日または排卵日をカレンダーから選択します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "計算ボタンを押す",
          "text": "「計算する」を押すと出産予定日・現在の週数・健診スケジュール・マイルストーンが表示されます。",
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
