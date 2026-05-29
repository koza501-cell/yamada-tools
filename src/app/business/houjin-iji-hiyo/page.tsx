import { Metadata } from 'next';
import HoujinIjiHiyoClient from './client';
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: '法人維持費シミュレーター【無料】会社の年間ランニングコストを即計算｜赤字でもかかる固定費一覧',
  description: '法人の年間維持費を無料で即計算。法人住民税均等割・社会保険料・税理士顧問料・会計ソフトなど、赤字でも必ずかかるランニングコストの全体像がわかります。',
  keywords: [
    '法人維持費', '法人 年間コスト', '法人 ランニングコスト', '会社 維持費 いくら',
    '法人住民税 均等割', '法人 固定費', '会社 赤字 かかる費用',
    '法人 社会保険 コスト', '税理士 顧問料 相場', '会社設立後 費用',
    '法人 最低限 コスト', '会社維持費 シミュレーション',
  ],
  openGraph: {
    title: '法人維持費シミュレーター【無料】年間ランニングコストを即計算｜山田ツール',
    description: '赤字でも必ずかかる法人住民税・社会保険・税理士費用まで。会社の年間維持費の全体像を無料で計算。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/houjin-iji-hiyo',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/houjin-iji-hiyo',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '法人維持費シミュレーター',
  description: '法人の年間維持費を即計算。法人住民税均等割・社会保険料・税理士顧問料・会計ソフトなど、赤字でもかかるランニングコストの全体像がわかる無料ツール。',
  url: 'https://yamada-tools.jp/business/houjin-iji-hiyo',
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
      name: '法人の維持費は年間いくらかかりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '最低でも法人住民税均等割の約7万円/年が赤字でも発生します。役員1名の小規模法人でも、社会保険料・会計ソフト・税理士費用を含めると年間100〜200万円程度のランニングコストが一般的です。',
      },
    },
    {
      '@type': 'Question',
      name: '赤字でもかかる法人の固定費は何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '法人住民税の均等割（最低約7万円/年）は利益に関係なく必ず発生します。また社会保険料（役員報酬がある場合）、会計ソフト代、法人口座維持費なども赤字でも継続的にかかります。',
      },
    },
    {
      '@type': 'Question',
      name: '法人住民税の均等割はいくらですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '資本金1,000万円以下・従業員50人以下の法人の場合、都道府県民税2万円＋市町村民税5万円の合計7万円/年が最低額です。資本金や従業員数が増えると段階的に増加します。',
      },
    },
    {
      '@type': 'Question',
      name: '税理士の顧問料の相場はいくらですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '小規模法人（年商1,000万円以下）の場合、月額1〜3万円が相場です。年商3,000万円程度で月額3〜5万円、1億円以上で月額5〜10万円が目安です。決算申告料は月額顧問料の4〜6か月分が別途かかることが一般的です。',
      },
    },
    {
      '@type': 'Question',
      name: '法人の社会保険料はいくらかかりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '法人は役員1名でも社会保険（健康保険＋厚生年金）への加入が義務です。会社負担分は役員報酬の約15%で、例えば月額30万円の報酬なら会社負担は約4.5万円/月（年間約54万円）です。',
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
    { '@type': 'ListItem', position: 3, name: '法人維持費シミュレーター', item: 'https://yamada-tools.jp/business/houjin-iji-hiyo' },
  ],
};

const tool = getToolById("houjin-iji-hiyo")!;

export default function HoujinIjiHiyoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <HoujinIjiHiyoClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
