import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】社会保険料計算機｜健康保険・厚生年金・雇用保険を一括計算 2026年版 ",
  description: "月給と都道府県を入力するだけで社会保険料（健康保険・厚生年金・雇用保険・介護保険）を一括計算。本人負担・会社負担の内訳、将来の年金受給額も表示。47都道府県対応。",
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "社会保険料計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "月給・都道府県・年齢から健康保険・厚生年金・雇用保険・介護保険を一括計算。本人負担・会社負担の内訳と将来の年金受給額も表示。2026年最新料率対応。",
      "url": "https://yamada-tools.jp/career/social-insurance-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "社会保険料計算機", "item": "https://yamada-tools.jp/career/social-insurance-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "社会保険料は毎月変わりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "原則として年1回（9月）改定されます。4〜6月の給与平均に基づいて標準報酬月額が決定し9月から翌8月まで適用されます。給与が大幅に変わった場合は随時改定の対象になることがあります。" },
        },
        {
          "@type": "Question",
          "name": "社会保険料は給与から天引きされますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、健康保険料・厚生年金・雇用保険料は毎月の給与から自動的に天引きされます。介護保険料（40歳以上）も同様です。" },
        },
        {
          "@type": "Question",
          "name": "扶養家族がいると社会保険料は変わりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "本人の社会保険料は扶養家族の人数に関わらず変わりません。扶養家族（年収130万円未満）は追加保険料なしで健康保険に加入できます。" },
        },
        {
          "@type": "Question",
          "name": "転職したら社会保険料はどうなりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "転職先で新たに標準報酬月額が設定され社会保険料が変わります。転職して給与が上がると標準報酬月額も上がり社会保険料が増加します。" },
        },
        {
          "@type": "Question",
          "name": "フリーランスになると社会保険はどうなりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "健康保険は国民健康保険または任意継続に、年金は国民年金に切り替わります。厚生年金・雇用保険には加入できなくなります。国民健康保険料は前年所得に基づくため退職翌年は高額になる場合があります。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "社会保険料の計算方法",
      "description": "月給・都道府県・年齢から社会保険料を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "基本情報を入力", "text": "雇用形態・月給・賞与・年齢・都道府県を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "詳細設定を選択", "text": "労働時間・雇用保険区分を選択します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと4種類の社会保険料の本人・会社負担内訳と年金受給見込みが表示されます。" },
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
