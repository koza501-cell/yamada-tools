import { Metadata } from 'next';
import SetsuritsuHiyoClient from './client';
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: '会社設立費用シミュレーター【2026年最新】株式会社・合同会社・社団法人の総額を即計算｜無料',
  description: '株式会社・合同会社・一般社団法人の設立費用を無料で即計算。法定費用だけでなく印鑑代・登記簿謄本・専門家報酬・設立後の維持費まで含めた「本当の総額」がわかるシミュレーター。登録不要。',
  keywords: [
    '会社設立費用', '会社設立費用シミュレーション', '株式会社設立費用',
    '合同会社設立費用', '一般社団法人設立費用', '会社設立いくら',
    '法人設立費用計算', '会社設立費用比較', '登録免許税計算',
    '電子定款費用', '会社設立総額', '法人化費用',
    'KK設立費用', 'GK設立費用', '会社設立コスト'
  ],
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: '会社設立費用シミュレーター【2026年最新】｜山田ツール',
    description: '株式会社・合同会社・社団法人の設立にかかる全費用を即計算。法定費用＋隠れコスト＋月間維持費まで一目でわかる。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/setsuritsu-hiyo',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/setsuritsu-hiyo',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '会社設立費用シミュレーター',
  description: '株式会社・合同会社・一般社団法人の設立費用を即計算。法定費用＋隠れコスト＋月間維持費まで含めた総額がわかる無料ツール。',
  url: 'https://yamada-tools.jp/business/setsuritsu-hiyo',
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
      name: '株式会社の設立費用はいくらですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '株式会社の設立には、電子定款の場合で最低約20万円（登録免許税15万円＋定款認証3〜5万円）の法定費用がかかります。紙の定款の場合は印紙代4万円が追加されます。さらに印鑑代（5,000円〜）、登記簿謄本取得費（1,800円）などの実費も必要です。',
      },
    },
    {
      '@type': 'Question',
      name: '合同会社の設立費用はいくらですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '合同会社は定款認証が不要なため、電子定款の場合は登録免許税6万円のみで設立できます。紙の定款の場合は印紙代4万円が追加され合計10万円です。株式会社より大幅に安く設立できます。',
      },
    },
    {
      '@type': 'Question',
      name: '会社設立後の維持費はどのくらいかかりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '赤字でも法人住民税均等割が最低約7万円/年かかります。さらに社会保険料（役員1名でも加入義務あり）、税理士顧問料（月額1〜5万円）、会計ソフト（月額2,000〜4,000円）などのランニングコストが発生します。',
      },
    },
    {
      '@type': 'Question',
      name: '電子定款と紙の定款の違いは？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '電子定款はPDFで作成するため、紙の定款に必要な収入印紙代4万円が不要です。freee会社設立やマネーフォワードなどの無料サービスを使えば電子定款で手続きできます。',
      },
    },
    {
      '@type': 'Question',
      name: '一般社団法人の設立費用は？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '一般社団法人の設立には、登録免許税6万円＋定款認証約5万円で合計約11万円の法定費用がかかります。株式会社と異なり資本金は不要ですが、設立時に社員（出資者ではなく構成員）が2名以上必要です。',
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
      name: '会社設立費用シミュレーター',
      item: 'https://yamada-tools.jp/business/setsuritsu-hiyo',
    },
  ],
};

const tool = getToolById("setsuritsu-hiyo")!;

export default function SetsuritsuHiyoPage() {
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
      <SetsuritsuHiyoClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
