import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】転職年収シミュレーター｜転職前後の手取り・税金を比較計算 2026年版",
  description: "転職前後の手取り額を正確に比較。社会保険料・所得税・住民税の変化、試用期間の収入損失、損益分岐点まで自動計算。登録不要・完全無料の転職シミュレーター。",
  alternates: {
    canonical: "https://yamada-tools.jp/career/job-change-simulator",
  },
  openGraph: {
    url: "https://yamada-tools.jp/career/job-change-simulator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E8%BB%A2%E8%81%B7%E5%B9%B4%E5%8F%8E%E3%82%B7%E3%83%9F%E3%83%A5%E3%83%AC%E3%83%BC%E3%82%BF%E3%83%BC%EF%BD%9C%E8%BB%A2%E8%81%B7%E5%89%8D%E5%BE%8C%E3%81%AE%E6%89%8B%E5%8F%96%E3%82%8A%E3%83%BB%E7%A8%8E%E9%87%91%E3%82%92%E6%AF%94%E8%BC%83%E8%A8%88%E7%AE%97%202026%E5%B9%B4%E7%89%88" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "転職年収シミュレーター",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "転職前後の手取り額・税金・社会保険料の変化を正確に比較。損益分岐点・試用期間の収入損失も計算。2026年最新税制対応。",
      "url": "https://yamada-tools.jp/career/job-change-simulator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "転職年収シミュレーター", "item": "https://yamada-tools.jp/career/job-change-simulator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "年収が上がっても手取りが増えないことはありますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、いわゆる「年収の壁」を超えると社会保険料や税金が急増し、手取りが逆転することがあります。特に103万・106万・130万円の壁は注意が必要です。本ツールで転職後の正確な手取りを確認することをお勧めします。" },
        },
        {
          "@type": "Question",
          "name": "転職で年収が下がる場合のデメリットは？",
          "acceptedAnswer": { "@type": "Answer", "text": "年収が下がると社会保険料（翌年9月から改定）・住民税（翌年6月から改定）・雇用保険給付額・将来の厚生年金額が減少します。また退職金の基礎となる給与が下がります。本ツールでは短期的な手取り差だけでなく、回収期間まで計算できます。" },
        },
        {
          "@type": "Question",
          "name": "試用期間中の給与減額は考慮されますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、試用期間の月数と給与額を入力すると、試用期間中の収入損失と損益分岐点（何ヶ月後に転職が割に合うか）を計算します。" },
        },
        {
          "@type": "Question",
          "name": "転職後の住民税はいつから変わりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "住民税は前年の所得に基づいて計算されるため、転職後すぐには変わりません。転職した年の翌年6月から新しい給与に基づいた住民税が適用されます。転職直後は前職の高い年収に基づく住民税が続くため注意が必要です。" },
        },
        {
          "@type": "Question",
          "name": "年収以外に何を比較すべきですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "賞与の有無・退職金制度・社宅や通勤手当などの福利厚生・残業時間・有給消化率なども重要な比較ポイントです。見えない収入（フリンジベネフィット）を含めた実質的な待遇を比較することをお勧めします。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "転職後の手取り比較計算方法",
      "description": "現在の年収と転職先の年収から手取り変化を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "現職情報を入力", "text": "現在の年収・賞与・残業代・家族構成を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "転職先情報を入力", "text": "転職先の年収・試用期間・勤務地（都道府県）を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと手取り比較・税金変化・損益分岐点が表示されます。" },
      ],
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
