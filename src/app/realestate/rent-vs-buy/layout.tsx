import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】家賃 vs 購入 比較計算機｜賃貸・持ち家の生涯コストと損益分岐点を計算 2026年版 ",
  description: "賃貸と購入の生涯コストを中立的に比較。住宅ローン控除・固定資産税・管理費・頭金運用益まで考慮した本格シミュレーター。損益分岐点も自動計算。登録不要・完全無料。",
  keywords: ["家賃 購入 比較", "賃貸 持ち家 どちらがお得", "賃貸 購入 シミュレーター", "損益分岐点 計算", "住宅ローン控除 2026", "生涯コスト 比較"],
  alternates: {
    canonical: "https://yamada-tools.jp/realestate/rent-vs-buy",
  },
  openGraph: {
    title: "【無料】家賃 vs 購入 比較計算機｜賃貸・持ち家の生涯コストと損益分岐点を計算 2026年版 ",
    description: "賃貸と購入の生涯コストを中立的に比較。住宅ローン控除・固定資産税・管理費・頭金運用益まで考慮した本格シミュレーター。損益分岐点も自動計算。登録不要・完全無料。",
    url: "https://yamada-tools.jp/realestate/rent-vs-buy",
    siteName: "yamada-tools.jp",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】家賃 vs 購入 比較計算機｜賃貸・持ち家の生涯コストと損益分岐点を計算 2026年版 ",
    description: "賃貸と購入の生涯コストを中立的に比較。住宅ローン控除・固定資産税・管理費・頭金運用益まで考慮した本格シミュレーター。損益分岐点も自動計算。登録不要・完全無料。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "家賃 vs 購入 比較計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "賃貸と購入の生涯コストを中立的に比較。損益分岐点・住宅ローン控除・頭金運用益も考慮した総合シミュレーター。2026年税制対応。",
      "url": "https://yamada-tools.jp/realestate/rent-vs-buy",
      "datePublished": "2026-03-31",
      "dateModified": "2026-03-31",
      "inLanguage": "ja",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "不動産・住まい", "item": "https://yamada-tools.jp/realestate" },
        { "@type": "ListItem", "position": 3, "name": "家賃 vs 購入 比較計算機", "item": "https://yamada-tools.jp/realestate/rent-vs-buy" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "賃貸と購入、どちらが総合的にお得ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "一般的に同じ場所に15〜20年以上住む場合は購入が有利になることが多いです。転勤が多い方や10年以内に住み替える可能性がある方は賃貸の方が柔軟でコストも抑えられます。" },
        },
        {
          "@type": "Question",
          "name": "住宅ローン控除はいくら戻りますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "2026年現在、新築住宅は年末ローン残高の0.7%が最大35万円/年、13年間控除されます。3,000万円のローンを組んだ場合、1年目の控除額は約21万円です。" },
        },
        {
          "@type": "Question",
          "name": "マンションと一戸建てではどちらが維持費が安いですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "一戸建ては管理費・修繕積立金がない分毎月の費用は安くなりますが、外壁・屋根の修繕（10年ごとに100〜200万円）は自己負担です。マンションは修繕積立金として毎月1〜3万円かかります。" },
        },
        {
          "@type": "Question",
          "name": "頭金はいくら用意すべきですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "一般的に物件価格の10〜20%が目安です。頭金が多いほど借入額が減り金利負担も軽くなりますが、手元資金として生活費6ヶ月分は残すことをお勧めします。" },
        },
        {
          "@type": "Question",
          "name": "老後を考えると賃貸と購入どちらが安心ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "老後の安心感という点では購入に優位性があります。住宅ローンを完済すれば毎月の住居費が大幅に減ります。賃貸の場合、高齢になると入居審査が厳しくなる可能性もあります。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "賃貸と購入の比較計算方法",
      "description": "家賃と物件価格から生涯コストと損益分岐点を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "賃貸条件を入力", "text": "月額家賃・敷金礼金・更新料・居住年数を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "購入条件を入力", "text": "物件価格・頭金・ローン金利・返済期間・管理費等を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "個人条件を入力", "text": "年収・住宅ローン控除の有無・頭金の運用利回りを入力します。" },
        { "@type": "HowToStep", "position": 4, "name": "計算ボタンを押す", "text": "「計算する」を押すと生涯コスト比較表・損益分岐点・中立判定が表示されます。" },
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
