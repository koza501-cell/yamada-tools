import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】残業代計算機｜法定時間外・深夜・休日・固定残業を一括計算 2026年版",
  description: "残業代を種別ごとに正確計算。法定時間外(1.25倍)・月60時間超(1.50倍)・深夜(1.25倍)・休日(1.35倍)に対応。固定残業代の適正チェック機能付き。登録不要・完全無料。",
  alternates: {
    canonical: "https://yamada-tools.jp/career/overtime-calculator",
  },
  openGraph: {
    url: "https://yamada-tools.jp/career/overtime-calculator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E6%AE%8B%E6%A5%AD%E4%BB%A3%E8%A8%88%E7%AE%97%E6%A9%9F%EF%BD%9C%E6%B3%95%E5%AE%9A%E6%99%82%E9%96%93%E5%A4%96%E3%83%BB%E6%B7%B1%E5%A4%9C%E3%83%BB%E4%BC%91%E6%97%A5%E3%83%BB%E5%9B%BA%E5%AE%9A%E6%AE%8B%E6%A5%AD%E3%82%92%E4%B8%80%E6%8B%AC%E8%A8%88%E7%AE%97%202026%E5%B9%B4%E7%89%88" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "残業代計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "残業代を種別ごとに正確計算。法定時間外・月60時間超・深夜・休日・固定残業代の適正チェック対応。2026年最新版。",
      "url": "https://yamada-tools.jp/career/overtime-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "残業代計算機", "item": "https://yamada-tools.jp/career/overtime-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "残業代の計算方法を教えてください",
          "acceptedAnswer": { "@type": "Answer", "text": "残業代は「時間外労働時間数 × 時給 × 割増率」で計算します。法定時間外（月60時間以下）は1.25倍、月60時間超は1.50倍、深夜（22時〜5時）は1.25倍、法定休日は1.35倍です。これらが重複する場合は割増率が加算されます。" },
        },
        {
          "@type": "Question",
          "name": "固定残業代が適正かどうか確認できますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、本ツールの「固定残業代チェック」機能で確認できます。実際の残業代計算額と固定残業代を比較し、不足額があれば会社は追加支払義務があります。固定残業代は法定の割増賃金を下回ることはできません。" },
        },
        {
          "@type": "Question",
          "name": "管理職でも残業代は請求できますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "法律上の「管理監督者」に該当する場合は残業代請求権がありませんが、名ばかり管理職（実質的な管理権限がない場合）は請求できます。また管理監督者でも深夜割増賃金（22時〜5時）の請求権は残ります。" },
        },
        {
          "@type": "Question",
          "name": "残業代の時効はいつですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "2020年4月以降の賃金債権の時効は3年（それ以前は2年）です。退職後も3年以内であれば未払い残業代を請求できます。証拠として勤怠記録・タイムカード・メール等を保管しておくことが重要です。" },
        },
        {
          "@type": "Question",
          "name": "裁量労働制の場合、残業代はどうなりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "裁量労働制が適法に適用されている場合、みなし労働時間制となり残業代が発生しない場合があります。ただし深夜・休日労働の割増賃金は支払われます。裁量労働制は適用要件が厳しく、要件を満たさない場合は通常の残業代が発生します。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "残業代の計算方法",
      "description": "時給・残業時間・種別から残業代を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "雇用形態と給与を入力", "text": "月給・時給・日給を選択し、基本給と各種手当を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "残業時間を入力", "text": "法定時間外・月60時間超・深夜・法定休日・非法定休日の時間数を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと種別ごとの残業代と合計額が表示されます。" },
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
