import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】失業給付金計算機｜給付日数・受給額を自動計算 2026年版",
  description: "離職理由・年齢・雇用保険加入期間を入力するだけで失業給付金の給付日数と総受給額を自動計算。自己都合・会社都合・特定受給資格者に完全対応。登録不要・無料。",
  alternates: {
    canonical: "https://yamada-tools.jp/career/unemployment-calculator",
  },
  openGraph: {
    url: "https://yamada-tools.jp/career/unemployment-calculator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E5%A4%B1%E6%A5%AD%E7%B5%A6%E4%BB%98%E9%87%91%E8%A8%88%E7%AE%97%E6%A9%9F%EF%BD%9C%E7%B5%A6%E4%BB%98%E6%97%A5%E6%95%B0%E3%83%BB%E5%8F%97%E7%B5%A6%E9%A1%8D%E3%82%92%E8%87%AA%E5%8B%95%E8%A8%88%E7%AE%97%202026%E5%B9%B4%E7%89%88" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "失業給付金計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "離職理由・年齢・被保険者期間から失業給付金の給付日数と総受給額を自動計算。自己都合・会社都合・特定受給資格者に対応。2026年最新版。",
      "url": "https://yamada-tools.jp/career/unemployment-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "失業給付金計算機", "item": "https://yamada-tools.jp/career/unemployment-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "自己都合退職と会社都合退職で給付はどう違いますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "自己都合では2ヶ月の給付制限があり給付日数も少なくなります。会社都合（特定受給資格者）は給付制限なしで、年齢・勤続年数に応じた手厚い給付日数が適用されます。" },
        },
        {
          "@type": "Question",
          "name": "失業給付をもらいながらアルバイトはできますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "条件付きで可能です。ハローワークへの申告が必須で、週20時間未満かつ31日以上雇用される予定がないことが条件です。申告せずに働いた場合は不正受給となり給付金の3倍返還が求められます。" },
        },
        {
          "@type": "Question",
          "name": "雇用保険に何年加入していれば失業給付がもらえますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "自己都合退職は離職前2年間で12ヶ月以上、会社都合・特定受給資格者は離職前1年間で6ヶ月以上の被保険者期間が必要です。" },
        },
        {
          "@type": "Question",
          "name": "失業給付に税金はかかりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "いいえ、雇用保険の基本手当（失業給付）は非課税です。所得税・住民税の課税対象外であり、確定申告も不要です。" },
        },
        {
          "@type": "Question",
          "name": "再就職手当とは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "所定給付日数の3分の1以上を残して再就職した場合に受け取れる一時金です。残日数が3分の2以上なら残日数×日額×70%、3分の1以上なら残日数×日額×60%が支給されます。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "失業給付金の計算方法",
      "description": "離職理由・年齢・被保険者期間から給付日数と総受給額を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "基本情報を入力", "text": "年齢・離職理由・被保険者期間を選択します。" },
        { "@type": "HowToStep", "position": 2, "name": "賃金情報を入力", "text": "直近6ヶ月の総支給額を入力するか、賃金日額を直接入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと給付日数・日額・総受給額・受給スケジュールが表示されます。" },
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
