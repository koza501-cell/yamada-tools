import { Metadata } from 'next';
import FactoringSimulatorClient from './client';
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: 'ファクタリング手数料シミュレーター【2026年最新】手取り額・実質年率を即計算｜無料',
  description: '売掛金額・手数料率を入力するだけで、ファクタリングの手取り額と実質年率換算コストを即計算。2社間・3社間の相場比較、銀行融資との実質コスト比較にも使える無料ツール。',
  keywords: [
    'ファクタリング シミュレーション', 'ファクタリング 手数料計算', '売掛金 現金化 計算',
    'ファクタリング 手取り額', '2社間ファクタリング 相場', '3社間ファクタリング 相場',
    'ファクタリング 実質年率', 'ファクタリング 銀行融資 比較', '資金繰り 売掛金 現金化',
    'ファクタリング デメリット', '請求書買取 手数料',
  ],
  openGraph: {
    title: 'ファクタリング手数料シミュレーター【2026年最新】｜山田ツール',
    description: '売掛金額・手数料率から手取り額と実質年率換算コストを即計算。2社間・3社間の相場比較付き。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/factoring-simulator',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/factoring-simulator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ファクタリング手数料シミュレーター',
  description: '売掛金額・手数料率からファクタリングの手取り額と実質年率換算コストを計算する無料ツール。2社間・3社間の相場比較に対応。',
  url: 'https://yamada-tools.jp/business/factoring-simulator',
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
      name: '2社間ファクタリングと3社間ファクタリングの違いは？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '2社間ファクタリングは利用者とファクタリング会社の2者間で契約し、売掛先（取引先）に知られずに資金化できますが、手数料は10〜20%程度と高めです。3社間ファクタリングは売掛先の承諾を得て契約するため手数料は1〜9%程度と低くなりますが、取引先にファクタリング利用の事実が伝わります。',
      },
    },
    {
      '@type': 'Question',
      name: 'ファクタリングの手数料は実質年率に換算するとどれくらいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '手数料率が同じでも、入金までの期間が短いほど年率換算コストは跳ね上がります。例えば手数料10%でも入金サイトが30日なら年率換算では100%を超えることがあり、銀行融資（年1〜3%程度）と比べて割高になりやすい点に注意が必要です。',
      },
    },
    {
      '@type': 'Question',
      name: 'ファクタリングは融資（借入）に該当しますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'いいえ、ファクタリングは売掛債権の売買であり、法律上は融資（貸付）ではありません。そのため貸金業登録は不要とされ、負債として計上されない場合が多く、決算書の見た目を悪化させずに資金調達できる点がメリットです。',
      },
    },
    {
      '@type': 'Question',
      name: '個人事業主やフリーランスでも利用できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、法人だけでなく個人事業主・フリーランスも利用可能なファクタリング会社が多くあります。ただし売掛先の信用力が審査の中心になるため、売掛先が個人（BtoC）の場合は利用できないケースもあります。',
      },
    },
    {
      '@type': 'Question',
      name: '悪質なファクタリング業者を見分けるポイントは？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '手数料が相場（2社間10〜20%、3社間1〜9%）を大幅に超える場合や、償還請求権（売掛先が倒産した場合に利用者が代わりに支払う義務）ありの契約を「償還請求権なし」と偽るケースには注意が必要です。契約書の内容を必ず確認し、金融庁・日本貸金業協会の注意喚起も参考にしてください。',
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
      name: 'ファクタリング手数料シミュレーター',
      item: 'https://yamada-tools.jp/business/factoring-simulator',
    },
  ],
};

const tool = getToolById("factoring-simulator")!;

export default function FactoringSimulatorPage() {
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
      <FactoringSimulatorClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
