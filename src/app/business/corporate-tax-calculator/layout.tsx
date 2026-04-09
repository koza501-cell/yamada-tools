import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】法人税 計算機｜法人税・住民税・事業税を一括計算 2026年版",
  description: "法人税・地方法人税・法人住民税・法人事業税を一括計算。中小法人の軽減税率・賃上げ促進税制・繰越欠損金に完全対応。実効税率も自動表示。登録不要・無料。",
  openGraph: {
    title: "【無料】法人税 計算機｜法人税・住民税・事業税を一括計算 2026年版",
    url: "https://yamada-tools.jp/business/corporate-tax-calculator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E6%B3%95%E4%BA%BA%E7%A8%8E%20%E8%A8%88%E7%AE%97%E6%A9%9F%EF%BD%9C%E6%B3%95%E4%BA%BA%E7%A8%8E%E3%83%BB%E4%BD%8F%E6%B0%91%E7%A8%8E%E3%83%BB%E4%BA%8B%E6%A5%AD%E7%A8%8E%E3%82%92%E4%B8%80%E6%8B%AC%E8%A8%88%E7%AE%97%202026%E5%B9%B4%E7%89%88" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "法人税 計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "法人税・地方法人税・法人住民税・法人事業税・特別法人事業税を一括計算。中小法人の軽減税率・賃上げ促進税制・繰越欠損金に対応。2026年最新税制。登録不要・無料。",
      "url": "https://yamada-tools.jp/business/corporate-tax-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "ビジネス・法人", "item": "https://yamada-tools.jp/business" },
        { "@type": "ListItem", "position": 3, "name": "法人税 計算機", "item": "https://yamada-tools.jp/business/corporate-tax-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "法人税の申告・納付期限はいつですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "法人税の申告・納付期限は事業年度終了後2ヶ月以内です。3月決算なら5月末が期限です。申告期限の延長申請で1ヶ月延長できます（納付は延長不可）。" },
        },
        {
          "@type": "Question",
          "name": "赤字の場合も法人税はかかりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "課税所得がゼロ以下の場合、法人税・事業税・法人税割はかかりません。ただし法人住民税の均等割（最低7万円/年）は赤字でも課税されます。赤字は翌年以降10年間繰り越せます。" },
        },
        {
          "@type": "Question",
          "name": "消費税と法人税は別々に計算しますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、消費税と法人税は別々に計算・申告します。消費税は預かり消費税から支払消費税を引いた差額を納付します。法人税は消費税を除いた所得に対して課税されます。" },
        },
        {
          "@type": "Question",
          "name": "法人税の節税で最も効果的な方法は何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "代表的な節税方法は役員報酬の適正化、小規模企業共済・経営セーフティ共済の活用、賃上げ促進税制の活用、設備投資の即時償却・税額控除などです。" },
        },
        {
          "@type": "Question",
          "name": "法人税の実効税率は何%ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "中小法人の実効税率は課税所得800万円以下で約23〜25%、800万円超で約30〜35%です。個人の最高税率（55%）と比べると法人の税率が有利なケースが多いです。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "法人税の計算方法",
      "description": "課税所得から法人税等を一括計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "法人情報を入力", "text": "資本金・従業員数・法人種類・都道府県を選択します。" },
        { "@type": "HowToStep", "position": 2, "name": "損益情報を入力", "text": "当期の課税所得・繰越欠損金・各種税額控除を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと法人税等の内訳・合計・実効税率・節税アドバイスが表示されます。" },
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
