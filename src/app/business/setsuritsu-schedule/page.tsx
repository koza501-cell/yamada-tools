import { Metadata } from 'next';
import SetsuritsuScheduleClient from './client';
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: '設立スケジュールシミュレーター【無料】会社設立の逆算カレンダー｜土日祝を考慮した日程表',
  description: '設立希望日を入力するだけで、定款作成→公証役場→法務局→届出まで全ステップの日程を土日祝を考慮して自動逆算。株式会社・合同会社に対応。',
  keywords: [
    '会社設立 スケジュール', '会社設立 日程', '会社設立 何日かかる',
    '会社設立 流れ', '設立スケジュール シミュレーション', '会社設立 逆算',
    '株式会社 設立 期間', '合同会社 設立 期間', '定款認証 予約',
    '法務局 登記 日数', '会社設立 最短', '設立準備 チェックリスト',
  ],
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: '設立スケジュールシミュレーター【無料】逆算カレンダーを自動作成｜山田ツール',
    description: '設立希望日を入力 → 全ステップの日程を土日祝考慮で自動逆算。KK・GK対応。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/setsuritsu-schedule',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/setsuritsu-schedule',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '設立スケジュールシミュレーター',
  description: '会社設立希望日から全ステップの日程を土日祝考慮で逆算するスケジュール作成ツール。株式会社・合同会社対応。',
  url: 'https://yamada-tools.jp/business/setsuritsu-schedule',
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
      name: '会社設立にはどのくらいの期間がかかりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '株式会社は準備開始から登記完了まで約2〜4週間が目安です。合同会社は定款認証が不要なため、約1〜2週間で設立可能です。電子定款を利用し、専門家に依頼すればさらに短縮できます。',
      },
    },
    {
      '@type': 'Question',
      name: '設立日を大安にしたいのですが？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '設立日は法務局に登記申請した日になります。大安や記念日に合わせて登記申請することは一般的です。ただし法務局の営業日（平日）である必要があります。',
      },
    },
    {
      '@type': 'Question',
      name: '最短で何日で会社設立できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '合同会社なら最短1週間程度で設立可能です。株式会社は定款認証が必要なため、最短でも2週間程度かかります。オンラインサービスを利用し、専門家に依頼すれば短縮できます。',
      },
    },
    {
      '@type': 'Question',
      name: '年末年始やGWに会社設立はできますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '法務局が閉庁する年末年始（12月29日〜1月3日）は登記申請ができません。GWやお盆は祝日以外の平日であれば申請可能です。ただし公証役場も同様に閉庁するため、定款認証が必要な株式会社は注意が必要です。',
      },
    },
    {
      '@type': 'Question',
      name: '1月1日を会社の設立日にできますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '1月1日は祝日で法務局が閉庁しているため、1月1日を設立日にすることは原則できません。ただし12月下旬に登記申請し、登記完了が1月になっても、設立日は申請日（12月の平日）です。',
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
    { '@type': 'ListItem', position: 3, name: '設立スケジュールシミュレーター', item: 'https://yamada-tools.jp/business/setsuritsu-schedule' },
  ],
};

const tool = getToolById("setsuritsu-schedule")!;

export default function SetsuritsuSchedulePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <SetsuritsuScheduleClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
