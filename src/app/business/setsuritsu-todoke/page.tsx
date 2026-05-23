import { Metadata } from 'next';
import SetsuritsuTodokeClient from './client';

export const metadata: Metadata = {
  title: '設立後届出ナビゲーター【無料】会社設立後にやることチェックリスト｜届出先・期限・書類一覧',
  description: '会社設立日を入力するだけで、税務署・年金事務所・労基署・ハローワークなど全届出の期限を自動計算。提出先・必要書類・ダウンロードリンク付きのインタラクティブチェックリスト。',
  keywords: [
    '会社設立後 届出', '会社設立後 やること', '法人設立届出書 期限',
    '会社設立後 チェックリスト', '会社設立 届出先 一覧', '法人設立 手続き',
    '青色申告承認申請書 期限', '給与支払事務所 届出', '社会保険 新規適用届 期限',
    '雇用保険 適用事業所設置届', '法人設立後 税務署', '会社設立後 届出 いつまで',
  ],
  openGraph: {
    title: '設立後届出ナビゲーター【無料】会社設立後にやること完全チェックリスト｜山田ツール',
    description: '設立日を入力 → 届出先・期限・書類が自動表示。税務署から年金事務所まで全手続きをカバー。',
    type: 'website',
    url: 'https://yamada-tools.jp/business/setsuritsu-todoke',
  },
  alternates: {
    canonical: 'https://yamada-tools.jp/business/setsuritsu-todoke',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '設立後届出ナビゲーター',
  description: '会社設立日を入力するだけで全届出の期限を自動計算。税務署・年金事務所・労基署・ハローワークへの届出をチェックリスト形式で管理できる無料ツール。',
  url: 'https://yamada-tools.jp/business/setsuritsu-todoke',
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
      name: '会社設立後にやることは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '会社設立後は、税務署への法人設立届出書（2か月以内）、青色申告承認申請書（3か月以内）、給与支払事務所等の開設届出書（1か月以内）、都道府県・市区町村への届出、年金事務所への社会保険新規適用届（5日以内）、従業員がいる場合は労基署・ハローワークへの届出が必要です。',
      },
    },
    {
      '@type': 'Question',
      name: '法人設立届出書の提出期限はいつですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '税務署への法人設立届出書の提出期限は、設立の日以後2か月以内です。同時に都道府県税事務所（設立後の届出期限は都道府県により異なる）と市区町村への届出も必要です。',
      },
    },
    {
      '@type': 'Question',
      name: '青色申告承認申請書はいつまでに出す？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '設立の日以後3か月を経過した日と、最初の事業年度終了の日のいずれか早い日の前日までに提出する必要があります。青色申告を選択すると、欠損金の繰越控除や少額減価償却資産の特例などのメリットがあります。',
      },
    },
    {
      '@type': 'Question',
      name: '社会保険の届出はいつまで？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '年金事務所への健康保険・厚生年金保険の新規適用届は、事実発生から5日以内が原則です。法人は役員1名でも社会保険への加入が義務付けられています。',
      },
    },
    {
      '@type': 'Question',
      name: '届出を出し忘れたらどうなる？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '青色申告承認申請書の期限を過ぎると、その事業年度は白色申告となり、欠損金の繰越控除ができません。社会保険の届出遅れは遡って加入手続きが必要になる場合があります。ただし法人設立届出書は遅れても罰則はありません（早めの提出を推奨）。',
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
    { '@type': 'ListItem', position: 3, name: '設立後届出ナビゲーター', item: 'https://yamada-tools.jp/business/setsuritsu-todoke' },
  ],
};

export default function SetsuritsuTodokePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <SetsuritsuTodokeClient />
    </>
  );
}
