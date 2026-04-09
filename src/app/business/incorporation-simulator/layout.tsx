import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料・登録不要】個人事業主 vs 法人化 比較ツール｜税負担・節税額を自動計算 2026年版",
  description: "個人事業主と法人化の税負担を完全比較。所得税・事業税・社会保険料・法人税を一括計算。法人化が有利になる売上ラインも自動算出。登録不要・完全無料。2026年最新税制対応。",
  openGraph: {
    title: "【無料・登録不要】個人事業主 vs 法人化 比較ツール｜税負担・節税額を自動計算 2026年版",
    url: "https://yamada-tools.jp/business/incorporation-simulator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%83%BB%E7%99%BB%E9%8C%B2%E4%B8%8D%E8%A6%81%E3%80%91%E5%80%8B%E4%BA%BA%E4%BA%8B%E6%A5%AD%E4%B8%BB%20vs%20%E6%B3%95%E4%BA%BA%E5%8C%96%20%E6%AF%94%E8%BC%83%E3%83%84%E3%83%BC%E3%83%AB%EF%BD%9C%E7%A8%8E%E8%B2%A0%E6%8B%85%E3%83%BB%E7%AF%80%E7%A8%8E%E9%A1%8D%E3%82%92%E8%87%AA%E5%8B%95%E8%A8%88%E7%AE%97%202026%E5%B9%B4%E7%89%88" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "個人事業主 vs 法人化 比較ツール",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "個人事業主と法人化の税負担を完全比較。所得税・事業税・社会保険料・法人税を一括計算。法人化が有利になる売上ラインも自動算出。登録不要・完全無料。2026年最新税制対応。",
      "url": "https://yamada-tools.jp/business/incorporation-simulator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "ビジネス・法人", "item": "https://yamada-tools.jp/business" },
        { "@type": "ListItem", "position": 3, "name": "個人事業主 vs 法人化 比較ツール", "item": "https://yamada-tools.jp/business/incorporation-simulator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "法人化（法人成り）はいくらから有利ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "一般的に事業所得が600〜700万円を超えると法人化が有利になり始めます。ただし税理士顧問料などの法人維持コストも考慮する必要があります。" },
        },
        {
          "@type": "Question",
          "name": "個人事業主と法人ではどちらが社会保険料が安いですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "低い所得では国民健康保険+国民年金の方が安い場合があります。法人の場合は会社が保険料の半分を負担するため実質的な個人負担は同程度になることが多いです。" },
        },
        {
          "@type": "Question",
          "name": "合同会社と株式会社どちらで設立すべきですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "税金面での違いはありません。設立費用は合同会社約10万円、株式会社約25万円です。銀行融資や取引先からの信用を重視する場合は株式会社が有利な場合があります。" },
        },
        {
          "@type": "Question",
          "name": "法人化後に個人事業主に戻ることはできますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "法人を解散することは可能ですが、解散・清算の手続きに費用と時間がかかります。法人化は中長期的な視点で決断することが重要です。" },
        },
        {
          "@type": "Question",
          "name": "一人社長の場合も社会保険に加入しなければなりませんか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、一人会社でも役員報酬を支払う場合は社会保険への加入が義務です。ただし役員報酬をゼロにすれば加入義務はありません。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "個人事業主と法人化の税負担比較方法",
      "description": "売上・経費・個人情報から個人事業主と法人化の税負担を比較する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "事業情報を入力", "text": "年間売上・経費・事業種類を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "個人情報を入力", "text": "年齢・家族構成・希望手取り年収を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと個人と法人の税負担比較・節税額・法人化推奨判定が表示されます。" },
      ],
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
