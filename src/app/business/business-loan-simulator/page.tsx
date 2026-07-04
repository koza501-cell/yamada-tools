import { Metadata } from 'next';
import BusinessLoanSimulatorClient from './client';
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: 'ビジネスローン返済シミュレーター【2026年最新】月々の返済額・総利息を即計算｜無料',
  description: '事業資金の融資額・金利・返済期間を入力するだけで、月々の返済額と総利息額を即計算。元利均等・元金均等の両方に対応。日本政策金融公庫・銀行融資・ビジネスローンの比較にも使える無料ツール。',
  keywords: [
    'ビジネスローン シミュレーション', '事業資金 返済 計算', '事業性融資 返済額',
    '日本政策金融公庫 返済シミュレーション', '銀行融資 返済計算', '元利均等 元金均等 比較',
    'ビジネスローン 金利 比較', '運転資金 借入 返済', '創業融資 返済シミュレーター',
    '法人 借入 月々いくら', 'ビジネスローン 総返済額', '事業資金調達 返済計算',
  ],
  openGraph: {
    title: 'ビジネスローン返済シミュレーター【2026年最新】｜山田ツール',
    description: '融資額・金利・返済期間から月々の返済額と総利息を即計算。元利均等・元金均等対応。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/business-loan-simulator',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/business-loan-simulator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ビジネスローン返済シミュレーター',
  description: '事業資金の融資額・金利・返済期間から月々の返済額と総利息を計算する無料ツール。元利均等・元金均等の両方式に対応。',
  url: 'https://yamada-tools.jp/business/business-loan-simulator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
  },
  provider: {
    '@type': 'Organization',
    name: '山田ツール',
    url: 'https://yamada-tools.jp',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '元利均等返済と元金均等返済の違いは？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '元利均等返済は毎月の返済額（元金+利息）が一定になる方式で、返済計画が立てやすいのが特徴です。元金均等返済は毎月の元金部分が一定で、返済初期の利息負担が大きく、返済が進むにつれて月々の返済額が減っていきます。総支払利息は元金均等のほうが少なくなります。',
      },
    },
    {
      '@type': 'Question',
      name: 'ビジネスローンの金利相場はどれくらいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '融資元によって大きく異なります。日本政策金融公庫は年2%台、銀行のプロパー融資は年1〜3%台、信用保証協会の保証付き融資は年2%台後半が目安です。一方、ノンバンク系のビジネスローンは年8〜15%程度と高めに設定されていることが多く、審査スピードとのトレードオフになります。',
      },
    },
    {
      '@type': 'Question',
      name: '返済期間を長くすると総利息はどう変わりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '返済期間を長くすると月々の返済額は下がりますが、総支払利息は増加します。資金繰りに余裕を持たせたい場合は期間を長めに、総コストを抑えたい場合は期間を短めに設定するのが基本的な考え方です。',
      },
    },
    {
      '@type': 'Question',
      name: '日本政策金融公庫の融資は個人事業主でも受けられますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、個人事業主・フリーランスでも新創業融資制度などを利用できます。無担保・無保証人で利用できる制度もあり、創業初期の資金調達先として広く使われています。',
      },
    },
    {
      '@type': 'Question',
      name: 'DSCR（債務償還年数）とは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '借入金を事業のキャッシュフローで返済するのに何年かかるかを示す指標です。金融機関の審査でも重視される考え方で、月々の返済額が事業の資金繰りに見合っているかを確認する目安になります。',
      },
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'ホーム',
      item: 'https://yamada-tools.jp',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'ビジネス・法人ツール',
      item: 'https://yamada-tools.jp/business',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'ビジネスローン返済シミュレーター',
      item: 'https://yamada-tools.jp/business/business-loan-simulator',
    },
  ],
};

const tool = getToolById("business-loan-simulator")!;

export default function BusinessLoanSimulatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BusinessLoanSimulatorClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
