import { Metadata } from 'next';
import KesankiSimClient from './client';
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: '決算期シミュレーター【無料】最適な決算月を即判定｜消費税免税を最大化する設立月の選び方',
  description: '会社設立月から最適な決算期を自動計算。消費税免税期間の最大化、届出期限の逆算、繁忙期との重なり回避まで考慮した決算月を無料で提案します。',
  keywords: [
    '決算期 シミュレーション', '決算期 いつがいい', '決算月 決め方',
    '会社設立 決算期', '決算期 おすすめ', '消費税免税 最大化 決算期',
    '決算月 変更', '事業年度 決め方', '法人 決算期 選び方',
    '会社設立月 決算期 関係', '決算期 届出期限',
  ],
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: '決算期シミュレーター【無料】最適な決算月を即判定｜山田ツール',
    description: '設立月から最適な決算期を自動計算。消費税免税の最大化、届出期限、繁忙期回避まで考慮。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/kesanki-sim',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/kesanki-sim',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '決算期シミュレーター',
  description: '会社設立月から最適な決算期を自動計算する無料ツール。消費税免税期間の最大化、届出期限の逆算、繁忙期回避まで考慮。',
  url: 'https://yamada-tools.jp/business/kesanki-sim',
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
      name: '決算期はいつがいいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '消費税の免税期間を最大化するには、設立月の前月を決算月にするのが最も有利です。例えば4月設立なら3月決算にすると、最大23か月間の免税期間を確保できます。ただし繁忙期との重なりや届出期限も考慮する必要があります。',
      },
    },
    {
      '@type': 'Question',
      name: '決算期は後から変更できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい、株主総会の決議と定款変更で決算期は変更可能です。変更届出書を税務署・都道府県税事務所・市区町村に提出します。登記変更は不要で、費用は専門家報酬のみ（自分で行えば無料）です。',
      },
    },
    {
      '@type': 'Question',
      name: '消費税の免税期間を最大化するには？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '資本金1,000万円未満の法人は設立後最大2事業年度が消費税免税です。第1期を最長（設立月の前月を決算月）にすることで、最大23か月間の免税期間を確保できます。設立月と同じ月を決算月にすると第1期が最短1か月になり、免税期間を大幅に損します。',
      },
    },
    {
      '@type': 'Question',
      name: '3月決算と12月決算、どちらが多いですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '日本の法人は3月決算が最も多く全体の約20%を占めます。次いで9月、12月が多いです。ただし3月・12月は税理士の繁忙期と重なるため、税理士費用が高くなる傾向があります。6月・7月・8月決算は税理士に余裕があり、丁寧な対応を受けやすいメリットがあります。',
      },
    },
    {
      '@type': 'Question',
      name: '決算月から届出の期限はいつまでですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '法人税の確定申告期限は決算日から2か月以内です。例えば3月31日決算なら5月31日が申告・納税期限です。消費税も同じく2か月以内です。届出が間に合わない場合は、1か月の申告期限延長の特例を事前申請できます。',
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
    { '@type': 'ListItem', position: 3, name: '決算期シミュレーター', item: 'https://yamada-tools.jp/business/kesanki-sim' },
  ],
};

const tool = getToolById("kesanki-sim")!;

export default function KesankiSimPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <KesankiSimClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
