import { Metadata } from 'next';
import JigyouMokutekiClient from './client';
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: '事業目的ジェネレーター【無料】定款の事業目的を自動作成｜業種別テンプレート付き',
  description: '業種を選ぶだけで定款に記載する事業目的を自動生成。飲食・IT・不動産・建設・小売など30以上の業種に対応。許認可が必要な業種には警告表示付き。コピーしてそのまま定款に使えます。',
  keywords: [
    '事業目的 書き方', '定款 事業目的', '事業目的 テンプレート', '事業目的 例文',
    '事業目的 一覧', '定款 目的 書き方', '会社設立 事業目的', '事業目的 ジェネレーター',
    '定款 目的 例', '事業目的 許認可', '法人 事業目的 サンプル',
  ],
  openGraph: {
    title: '事業目的ジェネレーター【無料】定款の事業目的を業種から自動作成｜山田ツール',
    description: '業種を選ぶだけで定款の事業目的を自動生成。許認可警告付き。コピーしてそのまま使える。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/jigyou-mokuteki',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/jigyou-mokuteki',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '事業目的ジェネレーター',
  description: '業種を選ぶだけで定款に記載する事業目的を自動生成する無料ツール。30以上の業種に対応。許認可警告付き。',
  url: 'https://yamada-tools.jp/business/jigyou-mokuteki',
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
      name: '定款の事業目的はいくつ書けますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '法律上の上限はありませんが、一般的には5〜15個程度が適切です。多すぎると銀行口座開設時に「何の会社かわからない」と判断される可能性があります。主要な事業を前に、将来やりたい事業を後ろに記載するのが一般的です。',
      },
    },
    {
      '@type': 'Question',
      name: '事業目的に「前各号に附帯する一切の事業」は必要？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、最後に「前各号に附帯関連する一切の事業」を入れるのが一般的です。これにより、記載した事業目的に関連する業務を幅広くカバーできます。ほぼ全ての法人が記載しています。',
      },
    },
    {
      '@type': 'Question',
      name: '事業目的を後から変更できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、株主総会の特別決議と定款変更、法務局への変更登記（登録免許税3万円）で変更可能です。最初から将来やりたい事業も含めて記載しておくと、変更の手間と費用を節約できます。',
      },
    },
    {
      '@type': 'Question',
      name: '許認可が必要な事業の目的はどう書く？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '許認可が必要な事業（飲食業、建設業、不動産業、人材派遣業など）は、許認可申請時に定款の事業目的が審査されます。許認可の要件に合致する表現で記載する必要があるため、該当する業種の場合は行政書士や司法書士に確認することを推奨します。',
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
    { '@type': 'ListItem', position: 3, name: '事業目的ジェネレーター', item: 'https://yamada-tools.jp/business/jigyou-mokuteki' },
  ],
};

const tool = getToolById("jigyou-mokuteki")!;

export default function JigyouMokutekiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <JigyouMokutekiClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
