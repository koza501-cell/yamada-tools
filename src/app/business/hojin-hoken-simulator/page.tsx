import { Metadata } from 'next';
import HojinHokenSimulatorClient from './client';
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: '法人保険 損金算入シミュレーター【2026年最新】最高解約返戻率から即計算｜無料',
  description: '年間保険料・最高解約返戻率を入力するだけで、法人保険（定期保険等）の損金算入額と資産計上額を即計算。2019年税制改正後の区分ルールに対応した無料ツール。',
  keywords: [
    '法人保険 損金算入 シミュレーション', '法人保険 損金割合 計算', '定期保険 損金算入ルール',
    '最高解約返戻率 計算', '法人保険 節税 2026', '逓増定期保険 損金',
    '法人保険 資産計上', '経営者保険 税務処理', '法人保険 税制改正 2019',
  ],
  openGraph: {
    title: '法人保険 損金算入シミュレーター【2026年最新】｜山田ツール',
    description: '年間保険料・最高解約返戻率から損金算入額と資産計上額を即計算。2019年税制改正の区分ルールに対応。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/hojin-hoken-simulator',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/hojin-hoken-simulator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '法人保険 損金算入シミュレーター',
  description: '年間保険料・最高解約返戻率から法人保険の損金算入額と資産計上額を計算する無料ツール。2019年税制改正後の区分ルールに対応。',
  url: 'https://yamada-tools.jp/business/hojin-hoken-simulator',
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
      name: '最高解約返戻率とは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '保険期間中に解約した場合の返戻金が支払保険料累計に対して最も高くなる割合のことです。保険会社が契約時に提示する設計書に記載されており、この数値によって税務上の損金算入割合が区分されます。',
      },
    },
    {
      '@type': 'Question',
      name: '2019年の税制改正で何が変わりましたか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '2019年7月8日以降に契約した定期保険・第三分野保険は、最高解約返戻率に応じて4段階（50%以下・50%超70%以下・70%超85%以下・85%超）で損金算入割合が決まる新ルールが適用されるようになりました。従来の「全額損金」「2分の1損金」といった単純な区分は使えなくなっています。',
      },
    },
    {
      '@type': 'Question',
      name: '最高解約返戻率が85%を超える保険はどう扱われますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '契約当初10年間は「支払保険料×最高解約返戻率×90%」、11年目以降は「支払保険料×最高解約返戻率×70%」を資産計上し、残額を損金算入します。返戻率が高いほど資産計上割合が大きくなり、節税効果は限定的になります。',
      },
    },
    {
      '@type': 'Question',
      name: '資産計上した保険料はどうなりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '資産計上期間が終了した後の一定期間（取崩期間）で均等に取り崩し、損金算入していきます。解約時に資産計上額と解約返戻金の差額は雑収入または雑損失として計上されます。',
      },
    },
    {
      '@type': 'Question',
      name: '法人保険は本当に節税になりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '損金算入は「課税の繰り延べ」であり、恒久的な節税ではありません。解約時に受け取る返戻金は雑収入として課税対象になるため、出口戦略（退職金支給等で相殺するタイミング）まで含めて検討する必要があります。',
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
      name: '法人保険 損金算入シミュレーター',
      item: 'https://yamada-tools.jp/business/hojin-hoken-simulator',
    },
  ],
};

const tool = getToolById("hojin-hoken-simulator")!;

export default function HojinHokenSimulatorPage() {
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
      <HojinHokenSimulatorClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
