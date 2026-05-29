import { Metadata } from 'next';
import KyoninkaCheckerClient from './client';
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: '許認可チェッカー【無料】業種別に必要な免許・届出を即判定｜届出先・費用・期間一覧',
  description: '事業内容を選ぶだけで必要な許認可・届出・免許を即判定。届出先・費用目安・取得期間・必要な資格者まで一覧表示。飲食・建設・不動産・人材派遣など50業種以上に対応。',
  keywords: [
    '許認可 一覧', '許認可 必要 業種', '許認可 チェック', '事業 許認可 必要',
    '飲食店 許可', '建設業 許可', '古物商 許可', '人材派遣 許可',
    '許認可 届出先', '許認可 費用', '開業 届出 一覧',
  ],
  openGraph: {
    title: '許認可チェッカー【無料】業種別に必要な免許・届出を即判定｜山田ツール',
    description: '事業内容を選ぶだけで必要な許認可を即判定。届出先・費用・期間まで一覧表示。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/kyoninka-checker',
  },
  alternates: { canonical: 'https://yamada-tools.jp/business/kyoninka-checker' },
};

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'WebApplication',
  name: '許認可チェッカー',
  description: '事業内容を選ぶだけで必要な許認可・届出・免許を即判定する無料ツール。50業種以上に対応。',
  url: 'https://yamada-tools.jp/business/kyoninka-checker',
  applicationCategory: 'BusinessApplication', operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  provider: { '@type': 'Organization', name: '山田ツール', url: 'https://yamada-tools.jp' },
};

const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '許認可なしで事業を始めるとどうなる？', acceptedAnswer: { '@type': 'Answer', text: '業種により罰金・懲役などの刑事罰が科される場合があります。例えば無許可の建設業は3年以下の懲役または300万円以下の罰金です。営業停止命令や事業の差止めを受ける可能性もあります。' } },
    { '@type': 'Question', name: '届出と許可の違いは？', acceptedAnswer: { '@type': 'Answer', text: '届出は書類を提出すれば受理される手続きで審査は形式的です。許可は行政機関が内容を審査し基準を満たした場合にのみ許可されます。許可のほうが要件が厳しく取得に時間がかかります。登録はその中間的な位置づけです。' } },
    { '@type': 'Question', name: '会社設立前に許認可を取れる？', acceptedAnswer: { '@type': 'Answer', text: '多くの許認可は法人設立後に申請します。重要なのは設立時の定款に該当する事業目的を記載しておくことです。記載がないと許認可申請が通らない場合があります。' } },
    { '@type': 'Question', name: '個人事業主でも許認可は必要？', acceptedAnswer: { '@type': 'Answer', text: 'はい、許認可は法人・個人問わず必要です。ただし一部の許認可（介護事業者指定等）は法人格が条件となっているため、個人事業主では取得できないものもあります。' } },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://yamada-tools.jp' },
    { '@type': 'ListItem', position: 2, name: 'ビジネス・法人ツール', item: 'https://yamada-tools.jp/business' },
    { '@type': 'ListItem', position: 3, name: '許認可チェッカー', item: 'https://yamada-tools.jp/business/kyoninka-checker' },
  ],
};

const tool = getToolById("kyoninka-checker")!;

export default function KyoninkaCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <KyoninkaCheckerClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
