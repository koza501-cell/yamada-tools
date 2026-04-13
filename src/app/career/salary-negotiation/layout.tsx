import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】給与交渉シミュレーター｜業界・職種別の市場年収と交渉レンジを計算",
  description: "業界・職種・経験・スキルから市場適正年収と給与交渉レンジ（最低ライン〜ストレッチ目標）を自動計算。交渉トーキングポイントも自動生成。転職・昇給交渉を成功させる無料ツール。",
  alternates: {
    canonical: "https://yamada-tools.jp/career/salary-negotiation",
  },
  openGraph: {
    url: "https://yamada-tools.jp/career/salary-negotiation",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E7%B5%A6%E4%B8%8E%E4%BA%A4%E6%B8%89%E3%82%B7%E3%83%9F%E3%83%A5%E3%83%AC%E3%83%BC%E3%82%BF%E3%83%BC%EF%BD%9C%E6%A5%AD%E7%95%8C%E3%83%BB%E8%81%B7%E7%A8%AE%E5%88%A5%E3%81%AE%E5%B8%82%E5%A0%B4%E5%B9%B4%E5%8F%8E%E3%81%A8%E4%BA%A4%E6%B8%89%E3%83%AC%E3%83%B3%E3%82%B8%E3%82%92%E8%A8%88%E7%AE%97" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "給与交渉シミュレーター",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "業界・職種・経験から市場適正年収と給与交渉レンジを算出。交渉トーキングポイント自動生成付き。",
      "url": "https://yamada-tools.jp/career/salary-negotiation",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "給与交渉シミュレーター", "item": "https://yamada-tools.jp/career/salary-negotiation" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "給与交渉で何%アップを要求するのが現実的ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "昇給交渉では現在の給与から5〜15%増が現実的なレンジです。転職時は10〜30%増を要求するケースも珍しくありません。業界水準や自身の希少性、会社の業績によって大きく変わります。" },
        },
        {
          "@type": "Question",
          "name": "給与交渉で失敗しないためのポイントは？",
          "acceptedAnswer": { "@type": "Answer", "text": "市場データに基づいた根拠を示すこと、感情ではなく実績・スキルを数字で示すこと、交渉のタイミングを見計らうこと、最低ラインと理想額の両方を準備することが重要です。" },
        },
        {
          "@type": "Question",
          "name": "転職オファーを他社交渉に使っても大丈夫ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "競合オファーを提示することは一般的な交渉手法ですが、実際に転職する意思があることを前提にすべきです。虚偽のオファーを使うと信頼関係を損なうリスクがあります。" },
        },
        {
          "@type": "Question",
          "name": "市場年収を調べるにはどうすればよいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "OpenWork（旧Vorkers）、転職サイト（リクナビ・doda）の年収目安、厚生労働省の賃金構造基本統計調査などが参考になります。本ツールでも業界・職種・経験年数から市場年収レンジを算出できます。" },
        },
        {
          "@type": "Question",
          "name": "給与交渉は書面でするべきですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "まず口頭で意向を伝え、合意後に書面で確認するのが一般的です。交渉内容はメールで証拠を残すことをお勧めします。内定後の給与交渉はオファーレターを書面で受け取ってから行うとトラブルが減ります。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "給与交渉レンジの計算方法",
      "description": "業界・職種・経験から市場年収と交渉レンジを計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "基本情報を入力", "text": "業界・職種・経験年数・現在の年収・スキルレベルを入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "交渉目標を設定", "text": "現在の職場か転職先か、交渉の種類（昇給・転職・昇格）を選択します。" },
        { "@type": "HowToStep", "position": 3, "name": "交渉レンジを確認", "text": "「計算する」を押すと最低ライン・目標額・ストレッチ目標と交渉ポイントが表示されます。" },
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
