import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】リボ払い恐怖計算機｜完済まで何年？総利息はいくら？衝撃の現実を計算 | 山田ツール",
  description: "リボ払いの残高・金利・月返済額を入力するだけで完済日・総利息・毎月の利息割合を計算。一括払いとの比較・繰り上げ返済効果も表示。リボ地獄からの脱出をサポート。",
  keywords: [
    "リボ払い 計算機",
    "リボ払い 総利息",
    "リボ払い 完済 いつ",
    "リボ払い 危険",
    "リボ払い 恐怖",
    "リボ払い 繰り上げ返済",
    "リボ払い 一括返済",
    "リボ地獄 脱出",
    "クレジットカード リボ払い 金利",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/debt/revolving-calculator",
  },
  openGraph: {
    title: "【無料】リボ払い恐怖計算機｜完済まで何年？総利息はいくら？衝撃の現実を計算 | 山田ツール",
    description: "リボ払いの残高・金利・月返済額を入力するだけで完済日・総利息・毎月の利息割合を計算。一括払いとの比較・繰り上げ返済効果も表示。リボ地獄からの脱出をサポート。",
    url: "https://yamada-tools.jp/debt/revolving-calculator",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】リボ払い恐怖計算機｜完済まで何年？総利息はいくら？衝撃の現実を計算 | 山田ツール",
    description: "リボ払いの残高・金利・月返済額を入力するだけで完済日・総利息・毎月の利息割合を計算。一括払いとの比較・繰り上げ返済効果も表示。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "リボ払い恐怖計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "リボ払いの完済まで何年かかるか・総利息はいくらかを自動計算。毎月の返済で利息に消える割合・一括払いとの比較・繰り上げ返済効果も表示。登録不要・完全無料。",
      "url": "https://yamada-tools.jp/debt/revolving-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "借金・債務整理", "item": "https://yamada-tools.jp/debt" },
        { "@type": "ListItem", "position": 3, "name": "リボ払い恐怖計算機", "item": "https://yamada-tools.jp/debt/revolving-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "リボ払いの金利は何%が多いですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "多くのクレジットカードのリボ払い金利は年12〜15%程度です。一般的な銀行ローン（年3〜7%）と比べると非常に高い金利です。カードの明細書や会員サイトで確認できます。",
          },
        },
        {
          "@type": "Question",
          "name": "リボ払いの毎月の返済額を増やすにはどうすればいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "カード会社のフリーダイヤルまたは会員サイトから変更できます。多くのカード会社では翌月から反映されます。返済額を増やすことがリボ地獄脱出の最速の方法です。",
          },
        },
        {
          "@type": "Question",
          "name": "リボ払いを完済したら信用情報に影響がありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "正常な返済であれば信用情報には悪影響はありません。むしろ返済実績として記録されます。問題になるのは返済を滞納した場合です。",
          },
        },
        {
          "@type": "Question",
          "name": "リボ払いを一括返済する方法はありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "カード会社に連絡して一括返済を申し込めます。一括返済後の翌月から利息が発生しなくなります。手元に資金がない場合は低金利の借り換えローンを検討しましょう。",
          },
        },
        {
          "@type": "Question",
          "name": "リボ払いの利息に気づかなかった場合、過払い金はありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "2010年6月以降の契約に基づくリボ払いは法定金利内で運用されているため通常は過払い金は発生しません。過払い金は主に2010年以前のグレーゾーン金利が適用されていた消費者金融との取引が対象です。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "リボ払いの危険度チェック方法",
      "description": "リボ残高と金利から完済日と総利息を計算する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "リボ残高と金利を入力",
          "text": "現在のリボ払い残高と適用金利を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "月返済額を入力",
          "text": "カード会社に設定している毎月の返済額を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "計算ボタンを押す",
          "text": "「計算する」を押すと完済年月・総利息・毎月の利息割合・衝撃の事実が表示されます。",
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
