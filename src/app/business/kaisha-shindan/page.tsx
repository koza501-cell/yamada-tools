import { Metadata } from 'next';
import KaishaShindanClient from './client';
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: '会社形態診断ツール【無料】株式会社・合同会社・社団法人・個人事業 あなたに最適な形態は？',
  description: '8つの質問に答えるだけで、株式会社・合同会社・一般社団法人・個人事業主のどれが最適かを診断。設立費用・信用力・運営の自由度・税金の観点から、あなたの状況に合った会社形態を無料で提案します。',
  keywords: [
    '会社形態診断', '株式会社 合同会社 どっち', '会社設立 どの形態',
    'KK GK 違い 比較', '法人化 どれがいい', '合同会社 メリット デメリット',
    '株式会社 合同会社 比較', '一般社団法人 設立', '個人事業主 法人化',
    '会社形態 選び方', '会社設立 診断', '法人成り 判断',
  ],
  openGraph: {
    title: '会社形態診断ツール【無料】あなたに最適な法人形態は？｜山田ツール',
    description: '8つの質問に答えるだけ。株式会社・合同会社・社団法人・個人事業から最適な形態を診断。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/kaisha-shindan',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/kaisha-shindan',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '会社形態診断ツール',
  description: '8つの質問に答えるだけで最適な会社形態（株式会社・合同会社・一般社団法人・個人事業主）を診断する無料ツール。',
  url: 'https://yamada-tools.jp/business/kaisha-shindan',
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
      name: '株式会社と合同会社の違いは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '株式会社は定款認証が必要で設立費用が約20万円、社会的信用が高く、株式による資金調達が可能です。合同会社は定款認証不要で設立費用が約6万円、経営の自由度が高い一方、知名度がやや低いです。Apple Japan、Amazon Japanなどは合同会社です。',
      },
    },
    {
      '@type': 'Question',
      name: '個人事業主と法人、どちらが良いですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '年間利益が500〜800万円以下なら個人事業主の方が税負担が軽いケースが多いです。それ以上になると法人化のメリット（法人税率の上限、経費計上の幅、社会保険、信用力）が大きくなります。',
      },
    },
    {
      '@type': 'Question',
      name: '一般社団法人はどんな場合に適していますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '業界団体、資格認定、学会、地域活動など非営利目的の組織に適しています。資本金が不要で、設立時に2名以上の社員が必要です。収益事業を行う場合は法人税が課税されます。',
      },
    },
    {
      '@type': 'Question',
      name: '合同会社から株式会社に変更できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、合同会社から株式会社への組織変更は可能です。費用は登録免許税6万円＋官報公告費用約3万円＋専門家報酬で、合計10〜20万円程度です。まず合同会社で始めて後から変更する方も多いです。',
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
    { '@type': 'ListItem', position: 3, name: '会社形態診断ツール', item: 'https://yamada-tools.jp/business/kaisha-shindan' },
  ],
};

const tool = getToolById("kaisha-shindan")!;

export default function KaishaShindanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <KaishaShindanClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
