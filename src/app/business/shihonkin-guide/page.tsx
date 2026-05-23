import { Metadata } from 'next';
import ShihonkinGuideClient from './client';

export const metadata: Metadata = {
  title: '資本金決定ガイド【無料】最適な資本金額を自動計算｜消費税・許認可・融資の観点から',
  description: '業種・月間経費・融資予定・許認可要件から最適な資本金額を自動算出。消費税免税の1,000万円ラインや、許認可に必要な最低資本金額も考慮した推奨額を無料で提案します。',
  keywords: [
    '資本金 いくら', '資本金 決め方', '資本金 最適', '会社設立 資本金',
    '資本金 1000万円', '資本金 消費税', '資本金 許認可', '資本金 融資',
    '資本金 目安', '合同会社 資本金', '株式会社 資本金 最低',
  ],
  openGraph: {
    title: '資本金決定ガイド【無料】最適な資本金額を自動計算｜山田ツール',
    description: '業種・経費・融資・許認可から最適な資本金額を算出。消費税免税ラインも考慮。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/shihonkin-guide',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/shihonkin-guide',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '資本金決定ガイド',
  description: '業種・月間経費・融資予定・許認可要件から最適な資本金額を自動算出する無料ツール。',
  url: 'https://yamada-tools.jp/business/shihonkin-guide',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  provider: { '@type': 'Organization', name: '山田ツール', url: 'https://yamada-tools.jp' },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '資本金はいくらが最適ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '一般的には月間経費の3〜6か月分が目安です。消費税の免税メリットを受けるには1,000万円未満にする必要があります。許認可が必要な業種（建設業は500万円以上、人材派遣は2,000万円以上等）は最低基準も考慮してください。融資を受ける場合は、自己資金として資本金の2〜3倍が借入の目安になります。',
      },
    },
    {
      '@type': 'Question',
      name: '資本金1円でも会社設立できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、法律上は1円でも設立可能です。ただし取引先や銀行からの信用面で不利になり、法人口座の開設審査に通りにくくなる可能性があります。実務上は最低でも50万〜100万円が推奨されます。',
      },
    },
    {
      '@type': 'Question',
      name: '資本金1,000万円以上にすると何が変わる？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '資本金1,000万円以上の法人は、設立初年度から消費税の課税事業者になります。また法人住民税の均等割が増加します（都道府県2万円→5万円、市町村5万円→13万円）。特別な理由がない限り、999万円以下にするのが一般的です。',
      },
    },
    {
      '@type': 'Question',
      name: '資本金は後から増やせますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、増資（資本金の増額）は株主総会の決議と法務局への変更登記で可能です。登録免許税は増資額の0.7%（最低3万円）がかかります。まず少額で設立し、事業が軌道に乗ったら増資する戦略も一般的です。',
      },
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://yamada-tools.jp' },
    { '@type': 'ListItem', position: 2, name: 'ビジネス・法人ツール', item: 'https://yamada-tools.jp/business' },
    { '@type': 'ListItem', position: 3, name: '資本金決定ガイド', item: 'https://yamada-tools.jp/business/shihonkin-guide' },
  ],
};

export default function ShihonkinGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ShihonkinGuideClient />
    </>
  );
}
