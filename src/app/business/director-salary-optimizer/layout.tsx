import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】役員報酬 最適化シミュレーター｜法人税と所得税の総負担を最小化する報酬額を自動計算 | 山田ツール",
  description: "法人税・個人所得税・社会保険料の総負担を最小化する最適役員報酬を自動計算。複数シナリオ比較・配偶者役員対応。2026年最新税制対応。登録不要・完全無料。",
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "役員報酬 最適化シミュレーター",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "法人税と個人所得税・社会保険料の総負担を最小化する最適役員報酬を自動計算。複数シナリオ比較・配偶者役員対応。2026年最新税制・社会保険料率対応。登録不要・無料。",
      "url": "https://yamada-tools.jp/business/director-salary-optimizer",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "ビジネス・法人", "item": "https://yamada-tools.jp/business" },
        { "@type": "ListItem", "position": 3, "name": "役員報酬 最適化シミュレーター", "item": "https://yamada-tools.jp/business/director-salary-optimizer" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "役員報酬の最適額はいくらですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "法人の利益規模によって異なりますが、一般的に法人利益（役員報酬支払前）の60〜80%を役員報酬に設定し、法人税と個人の所得税・社会保険料のバランスを最適化します。本ツールで実際の売上・経費を入力すると最適額を自動計算します。" },
        },
        {
          "@type": "Question",
          "name": "役員報酬はゼロにしてもいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "可能ですが推奨しません。役員報酬ゼロの場合、法人の利益に全額法人税がかかります。また社会保険に加入できないため、国民健康保険・国民年金の自己負担が増えます。生活費が必要な場合は適切な役員報酬を設定しましょう。" },
        },
        {
          "@type": "Question",
          "name": "配偶者を役員にするとどれくらい節税できますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "配偶者に役員報酬を支払うことで所得を分散し、個人の税率を下げる効果があります。夫婦各500万円に分散すると合計税負担が年間50〜100万円減少することがあります。ただし配偶者が実際に業務に従事していることが必要です。" },
        },
        {
          "@type": "Question",
          "name": "役員報酬を上げると社会保険料はどうなりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "役員報酬に応じて社会保険料も増加します。厚生年金は標準報酬月額65万円が上限のため、それ以上は保険料が増えません。健康保険は上限が高くさらに高額になります。" },
        },
        {
          "@type": "Question",
          "name": "役員報酬の変更はいつでもできますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "原則として事業年度開始後3ヶ月以内に決定し年度中は変更できません（定期同額給与）。変更した差額分は損金として認められず法人税の対象になります。ただし業績悪化や役員の職務変更があった場合は例外的に変更が認められる場合があります。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "役員報酬の最適額の計算方法",
      "description": "法人の売上・経費から最適な役員報酬額を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "法人情報を入力", "text": "年間売上・経費・資本金・都道府県を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "個人情報を入力", "text": "年齢・家族構成・配偶者役員の有無を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "自動最適化を実行", "text": "「自動最適化」を選択して「計算する」を押すと最適役員報酬額と税負担比較表が表示されます。" },
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
