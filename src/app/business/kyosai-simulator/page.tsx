import { Metadata } from 'next';
import KyosaiSimulatorClient from './client';
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: '小規模企業共済シミュレーター【2026年最新】掛金・節税額・受取額を即計算｜無料',
  description: '小規模企業共済の掛金月額・加入年数を入力するだけで、節税効果・掛金累計・受取見込み額（共済金A/B・準共済金・解約手当金）を即計算。個人事業主・法人役員向け無料ツール。',
  keywords: [
    '小規模企業共済 シミュレーション', '小規模企業共済 節税効果', '小規模企業共済 受取額計算',
    '小規模企業共済 共済金A', '小規模企業共済 共済金B', '小規模企業共済 解約手当金',
    '小規模企業共済 掛金 いくら', '小規模企業共済 元本割れ', '個人事業主 節税 共済',
    '小規模企業共済 20年 受取額', '経営者 退職金 積立',
  ],
  openGraph: {
    title: '小規模企業共済シミュレーター【2026年最新】｜山田ツール',
    description: '掛金月額・加入年数から節税効果と受取見込み額を即計算。共済金A/B・準共済金・解約手当金に対応。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/kyosai-simulator',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/kyosai-simulator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '小規模企業共済シミュレーター',
  description: '小規模企業共済の掛金月額・加入年数から節税効果と受取見込み額を計算する無料ツール。共済金A・共済金B・準共済金・解約手当金に対応。',
  url: 'https://yamada-tools.jp/business/kyosai-simulator',
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
      name: '小規模企業共済の掛金はいくらまで所得控除できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '掛金は月額1,000円〜70,000円の範囲内で全額が「小規模企業共済等掛金控除」として所得控除の対象になります。年間最大84万円（月7万円×12ヶ月）まで控除でき、課税所得を大きく圧縮できます。',
      },
    },
    {
      '@type': 'Question',
      name: '共済金A・共済金B・準共済金・解約手当金の違いは？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '共済金Aは廃業や死亡時、共済金Bは65歳以上で180ヶ月以上納付した老齢給付時に受け取れます。準共済金は個人事業の法人成りで加入資格を失った場合、解約手当金は任意解約（自己都合）の場合に受け取ります。受取額はA・Bが最も有利で、任意解約の解約手当金が最も不利になります。',
      },
    },
    {
      '@type': 'Question',
      name: '20年未満で解約すると元本割れしますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '任意解約（解約手当金）の場合、掛金納付月数が240ヶ月（20年）未満だと支給率が80%〜99.25%となり、納付した掛金の合計額を下回ります。ただし廃業や死亡による共済金A・Bの場合は、5年程度の短期間でも掛金合計額を上回るケースが多くなります。',
      },
    },
    {
      '@type': 'Question',
      name: 'フリーランスでも加入できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。雇用関係がなく請負契約・準委任契約等で事業所得として申告しているフリーランスも加入対象です。商業・サービス業は従業員5人以下、建設業・製造業等は20人以下の個人事業主または会社役員が対象になります。',
      },
    },
    {
      '@type': 'Question',
      name: '受け取るときも税金はかかりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '一括受取りの場合は退職所得扱い、分割受取りの場合は公的年金等の雑所得扱いとなり、いずれも給与所得などと比べて税負担が軽くなる優遇があります。ただし任意解約（解約手当金）は一時所得扱いとなり、特別控除は最大50万円です。',
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
      name: '小規模企業共済シミュレーター',
      item: 'https://yamada-tools.jp/business/kyosai-simulator',
    },
  ],
};

const tool = getToolById("kyosai-simulator")!;

export default function KyosaiSimulatorPage() {
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
      <KyosaiSimulatorClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
