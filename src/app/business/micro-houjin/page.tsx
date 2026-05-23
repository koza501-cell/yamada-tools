import { Metadata } from 'next';
import MicroHoujinClient from './client';

export const metadata: Metadata = {
  title: 'マイクロ法人シミュレーター【無料】個人事業主との社会保険料差額を即計算｜二刀流の節約効果',
  description: 'マイクロ法人を設立すると社会保険料がいくら節約できるか無料で即計算。個人事業主（国保＋国民年金）とマイクロ法人（協会けんぽ＋厚生年金）の保険料を比較し、法人維持費を差し引いた実質メリットを算出します。',
  keywords: [
    'マイクロ法人 シミュレーション', 'マイクロ法人 メリット', 'マイクロ法人 社会保険料',
    'マイクロ法人 節約', 'マイクロ法人 いくらから', '個人事業主 社会保険料 高い',
    'マイクロ法人 二刀流', '国保 高い 対策', 'マイクロ法人 設立 費用',
    'マイクロ法人 国保 比較', 'マイクロ法人 厚生年金', 'マイクロ法人 損益分岐点',
  ],
  openGraph: {
    title: 'マイクロ法人シミュレーター【無料】社会保険料の節約額を即計算｜山田ツール',
    description: '個人事業主 vs マイクロ法人二刀流。国保＋国民年金と協会けんぽ＋厚生年金の保険料差額を計算。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/micro-houjin',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/micro-houjin',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'マイクロ法人シミュレーター',
  description: 'マイクロ法人（二刀流）と個人事業主の社会保険料を比較し、法人維持費を考慮した実質節約額を計算する無料ツール。',
  url: 'https://yamada-tools.jp/business/micro-houjin',
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
      name: 'マイクロ法人とは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'マイクロ法人とは、主に社会保険料の最適化を目的として設立する小規模な法人です。個人事業主が別の業種でマイクロ法人を設立し、最低限の役員報酬を設定することで、国民健康保険＋国民年金から協会けんぽ＋厚生年金に切り替え、社会保険料の総額を大幅に削減できます。',
      },
    },
    {
      '@type': 'Question',
      name: 'マイクロ法人はいくらから得になりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '一般的に個人事業の年間所得（利益）が400〜500万円以上になると、マイクロ法人設立による社会保険料の節約額が法人の維持費を上回り、メリットが出始めます。所得が高いほど国保料との差額が大きくなるため、効果も大きくなります。',
      },
    },
    {
      '@type': 'Question',
      name: 'サラリーマンでもマイクロ法人は使えますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'サラリーマンは勤務先で既に社会保険に加入しているため、マイクロ法人を設立しても社会保険料の節約はできません。むしろ法人側でも社会保険料が発生し、負担が増加します。マイクロ法人の社会保険料メリットは個人事業主・フリーランス限定です。',
      },
    },
    {
      '@type': 'Question',
      name: 'マイクロ法人の役員報酬はいくらが最適ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '社会保険料を最小化するには、健康保険・厚生年金の最低等級となる月額約5.4万円〜6.3万円未満が最適です。この水準で協会けんぽ1等級が適用され、健康保険料（40歳未満）約6,000円/月＋厚生年金約16,000円/月の合計約22,000円/月（会社＋本人合計約44,000円/月）に抑えられます。',
      },
    },
    {
      '@type': 'Question',
      name: 'マイクロ法人のデメリットは？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '主なデメリットは、法人の維持費（法人住民税均等割7万円/年、会計ソフト代、税理士費用等）がかかること、確定申告が個人と法人の2つ必要になること、個人事業と法人で異なる業種にする必要があること、将来の制度改正リスクがあることです。',
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
    { '@type': 'ListItem', position: 3, name: 'マイクロ法人シミュレーター', item: 'https://yamada-tools.jp/business/micro-houjin' },
  ],
};

export default function MicroHoujinPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <MicroHoujinClient />
    </>
  );
}
