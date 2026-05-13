import { Metadata } from 'next';
import Link from 'next/link';
import { careTools } from '@/config/tools';

export const metadata: Metadata = {
  title: '介護・保育 事業者向けツール&ガイド完全集【令和8年度対応・無料】',
  description:
    '介護施設・保育園の業務効率化ツール6種類と完全解説ガイドを無料提供。介護報酬計算・要介護度早見表・介護記録・連絡帳・食物アレルギーチェッカー・デイサービス料金試算など、令和8年度最新対応。登録不要・完全無料・事業者から介護家族まで利用可能。',
  keywords: [
    '介護報酬計算',
    '業務効率化',
    '介護記録',
    '連絡帳',
    '保育園',
    '介護施設',
    '無料ツール',
    '令和8年度',
    '要介護度',
    '食物アレルギー',
    'デイサービス料金',
  ],
  alternates: { canonical: 'https://yamada-tools.jp/care' },
};

const careEnrichments: Record<
  string,
  { audience: string; audienceColor: string; richDescription: string; blogPath: string }
> = {
  'kaigo-hoshu-calc': {
    audience: '事業所・ケアマネ',
    audienceColor: 'blue',
    richDescription:
      '訪問介護・通所介護・居宅介護支援の3サービスに対応。80市区町村の地域区分自動反映、令和8年6月期中改定の処遇改善加算（Ⅰイ/Ⅰロ）対応。加算・減算を選択するだけで請求単価を即算出。',
    blogPath: '/blog/kaigo-hoshu-keisan-howto',
  },
  'youkaigodo-hayami': {
    audience: '介護家族・ケアマネ',
    audienceColor: 'green',
    richDescription:
      '要支援1〜要介護5の7区分を一覧比較。区分支給限度額・自己負担額（1〜3割）・利用できるサービス種別を横断的に確認。家族説明・ケアプラン作成の補助資料として活用できます。',
    blogPath: '/blog/youkaigodo-chigai-wakariyasuku',
  },
  'kaigo-kiroku-template': {
    audience: '介護職員',
    audienceColor: 'purple',
    richDescription:
      '場面（食事・排泄・入浴・移動など）を選ぶだけで記録文例を即生成。SOAP・5W1H・シンプルの3形式から選択可能。禁止用語チェッカー搭載で記録品質を向上。',
    blogPath: '/blog/kaigo-kiroku-kakikata-soap',
  },
  'renrakucho-bunrei': {
    audience: '保育士',
    audienceColor: 'amber',
    richDescription:
      '0歳〜5歳児・10シーン（食事・睡眠・排泄・遊び・体調など）に対応した文例を即生成。保護者に伝わる自然な文体でNG表現を自動チェック。毎日の連絡帳記入時間を大幅に短縮。',
    blogPath: '/blog/hoikuen-renrakucho-kakikata',
  },
  'allergy-checker': {
    audience: '給食室・保育園',
    audienceColor: 'red',
    richDescription:
      '原材料テキストを貼るだけで28品目のアレルゲンを自動検出。令和8年4月1日改正（カシューナッツ義務化・ピスタチオ追加）対応。代替表記・含有表現も検出し、給食アレルギー事故を防止。',
    blogPath: '/blog/shokumotsu-allergy-28hinmoku',
  },
  'dayservice-cost-sim': {
    audience: '介護家族',
    audienceColor: 'green',
    richDescription:
      '要介護度・利用時間・月利用回数を選ぶだけで月額費用を試算。食費込み・自己負担1〜3割・限度額警告付き。介護家族が施設選びや月の予算を立てるためのシンプルシミュレーター。',
    blogPath: '/blog/dayservice-ryoukin-guide',
  },
};

const audienceBadgeClass: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
};

const blogPosts = [
  {
    path: '/blog/kaigo-hoshu-keisan-howto',
    title: '介護報酬の計算方法ガイド',
    audience: '事業所・ケアマネ',
    audienceColor: 'blue',
    summary:
      '令和8年6月期中改定に対応した介護報酬の計算手順を、訪問介護・通所介護・居宅介護支援別に解説。',
  },
  {
    path: '/blog/youkaigodo-chigai-wakariyasuku',
    title: '要支援と要介護の違いをわかりやすく解説',
    audience: '介護家族',
    audienceColor: 'green',
    summary:
      '要支援1〜2・要介護1〜5の7区分の違い、支給限度額、受けられるサービスを図解でわかりやすく説明。',
  },
  {
    path: '/blog/kaigo-kiroku-kakikata-soap',
    title: '介護記録 SOAP書き方ガイド',
    audience: '介護職員',
    audienceColor: 'purple',
    summary:
      'SOAP・5W1H・シンプル形式の書き方と禁止用語一覧。法的義務と記録品質向上のポイントを解説。',
  },
  {
    path: '/blog/hoikuen-renrakucho-kakikata',
    title: '保育園 連絡帳の書き方ガイド',
    audience: '保育士',
    audienceColor: 'amber',
    summary:
      '年齢別・シーン別の文例集と、保護者との信頼関係を築く連絡帳記入の実践テクニック。',
  },
  {
    path: '/blog/shokumotsu-allergy-28hinmoku',
    title: '食物アレルギー 義務9品目+推奨20品目ガイド',
    audience: '給食室・保育園',
    audienceColor: 'red',
    summary:
      '令和8年4月1日改正（カシューナッツ義務化・ピスタチオ追加）対応。28品目の特定と対応方法を解説。',
  },
  {
    path: '/blog/dayservice-ryoukin-guide',
    title: 'デイサービス料金ガイド',
    audience: '介護家族',
    audienceColor: 'green',
    summary:
      '通所介護の基本報酬・加算・食費・自己負担額の計算方法と、月額費用の目安を要介護度別に解説。',
  },
];

const faqItems = [
  {
    q: 'これらのツールは本当に無料で使えますか？',
    a: 'はい、すべて完全無料・登録不要・広告少なめでご利用いただけます。法人向けのPRO版もありますが、本ページのツールは個人・事業者を問わず誰でも自由に使えます。',
  },
  {
    q: '令和8年度の改定には対応していますか？',
    a: 'はい。令和8年6月期中改定（処遇改善加算拡充）および令和8年4月1日食物アレルギー改正（カシューナッツ義務化・ピスタチオ追加）に対応済みです。今後も法改正に応じて随時更新します。',
  },
  {
    q: 'スマートフォンでも使えますか？',
    a: 'はい、すべてのツールはスマートフォン・タブレット・PCに対応しています。職場のPC、訪問先のスマホ、在宅勤務のタブレットなど、シーンを問わずご利用ください。',
  },
  {
    q: '計算結果や記録の正確性は保証されますか？',
    a: '公式情報に基づいて計算・テンプレート作成していますが、最終的な数字・記録は事業所・市区町村・医療機関にご確認ください。法的判断・医療判断には使用しないでください。',
  },
  {
    q: '法人向けのまとめ利用や、API連携はできますか？',
    a: '個別にご相談ください。法人向けのPRO版では、CSV書き出し、複数アカウント、API連携などの機能をご提供しています。',
  },
];

const collectionPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: '介護・保育 事業者向けツール&ガイド完全集',
  description: '介護施設・保育園の業務効率化ツール6種類と解説ガイド。令和8年度対応・無料。',
  inLanguage: 'ja-JP',
  publisher: {
    '@type': 'Organization',
    name: 'Yamada Tools',
    url: 'https://yamada-tools.jp',
  },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '介護報酬 単位計算機', url: 'https://yamada-tools.jp/business/kaigo-hoshu-calc' },
      { '@type': 'ListItem', position: 2, name: '要介護度 早見表', url: 'https://yamada-tools.jp/care/youkaigodo-hayami' },
      { '@type': 'ListItem', position: 3, name: '介護記録 テンプレート', url: 'https://yamada-tools.jp/care/kaigo-kiroku-template' },
      { '@type': 'ListItem', position: 4, name: '連絡帳 文例ジェネレーター', url: 'https://yamada-tools.jp/care/renrakucho-bunrei' },
      { '@type': 'ListItem', position: 5, name: '食物アレルギー チェッカー', url: 'https://yamada-tools.jp/care/allergy-checker' },
      { '@type': 'ListItem', position: 6, name: 'デイサービス 利用料 試算', url: 'https://yamada-tools.jp/care/dayservice-cost-sim' },
    ],
  },
};

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://yamada-tools.jp' },
    { '@type': 'ListItem', position: 2, name: '介護・保育', item: 'https://yamada-tools.jp/care' },
  ],
};

export default function CareHubPage() {
  const availableTools = careTools.filter((t) => t.available);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 dark:text-gray-400 mb-4" aria-label="パンくずリスト">
        <Link href="/" className="hover:underline">
          ホーム
        </Link>
        <span className="mx-2">›</span>
        <span>介護・保育</span>
      </nav>

      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          介護・保育 事業者向けツール&amp;ガイド完全集
        </h1>
        <p className="mt-2 text-lg text-sky-700 dark:text-sky-300 font-semibold">
          令和8年度対応 / 6ツール + 6解説ガイド / 完全無料・登録不要
        </p>
        <p className="mt-6 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          介護施設・保育園・デイサービス・ケアマネ事務所・給食室の業務効率化を支援する、6つの無料ツールと6つの解説ガイドを公開しています。
          介護報酬の計算、要介護度の早見、介護記録テンプレート、保育園連絡帳の文例、食物アレルギーチェック、デイサービス料金試算 —
          業務でよく使う計算・記録・確認作業をワンクリックで完結。全ツールは令和8年6月期中改定および令和8年4月1日
          食物アレルギー改正に対応しています。事業所職員から介護家族まで、誰でも無料でご利用いただけます。
        </p>
      </section>

      {/* Problem Section */}
      <section className="mb-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          なぜ介護・保育の業務効率化ツールが必要か
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          介護現場・保育現場の人手不足は深刻です。令和7年度 厚生労働省の介護労働実態調査では、介護職員の
          <strong>約8割が「事務作業の負担が大きい」</strong>
          と回答しています。保育士もまた、令和8年度 こども家庭庁の調査で
          <strong>「持ち帰り業務」が常態化</strong>
          していることが報告されています。
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          書類作成・連絡帳記入・料金計算・アレルギー確認 — これらの作業は、利用者・保護者にとって重要ですが、専門職の貴重な時間を奪っています。介護報酬の計算ミスは請求エラーや返戻につながり、アレルギー対応の漏れは深刻な事故リスクを生みます。
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          当サイトは、こうした
          <strong>「やらなければならないが時間がかかる作業」</strong>
          をワンクリックで完結できる無料ツールを提供します。事業者の生産性向上、職員の負担軽減、家族の安心感向上 — すべての関係者にメリットを生み出すことを目指しています。
        </p>
      </section>

      {/* Tools Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🛠️ 介護・保育 無料ツール 全6種類
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          すべて令和8年度対応・登録不要・完全無料。業務に合わせてお使いください。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTools.map((tool) => {
            const extra = careEnrichments[tool.id];
            return (
              <article
                key={tool.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{tool.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{tool.nameJa}</h3>
                </div>
                {extra && (
                  <span
                    className={`inline-block w-fit rounded-full px-2 py-0.5 text-xs font-medium mb-3 ${
                      audienceBadgeClass[extra.audienceColor]
                    }`}
                  >
                    {extra.audience}
                  </span>
                )}
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-grow">
                  {extra?.richDescription ?? tool.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={tool.path}
                    className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
                  >
                    ツールを使う →
                  </Link>
                  {extra && (
                    <Link
                      href={extra.blogPath}
                      className="inline-flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                    >
                      解説記事を読む
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          📖 詳しい解説記事（全6本）
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          各ツールに対応した完全ガイドを公開しています。ツール利用の前後にお読みください。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Link
              key={post.path}
              href={post.path}
              className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-md transition-shadow flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
                  {post.title}
                </h3>
                <span
                  className={`shrink-0 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    audienceBadgeClass[post.audienceColor]
                  }`}
                >
                  {post.audience}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{post.summary}</p>
              <span className="text-sm text-sky-600 dark:text-sky-400 group-hover:underline mt-auto">
                解説記事を読む →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Educational Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          介護・保育 業務効率化 の基本
        </h2>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              介護報酬の理解と請求業務の正確性
            </h3>
            <p className="leading-relaxed">
              介護報酬は「単位数 × 地域単価 × 自己負担割合」で算出されますが、加算・減算・地域区分の組み合わせは複雑です。令和8年6月期中改定では処遇改善加算の区分が見直され、計算ロジックが変更されています。請求ミスは国保連審査での返戻に直結し、事業所の資金繰りに影響します。計算機ツールを使うことで、担当者の経験年数を問わず正確な単価を算出できます。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              介護記録の法的義務と質
            </h3>
            <p className="leading-relaxed">
              介護保険法では、サービス提供記録の作成・保存が事業者に義務づけられています（保存期間2年）。記録は利用者の状態変化を継続的に把握するための医療・介護連携ツールでもあり、訴訟リスクへの備えにもなります。SOAP形式の記録は「主観/客観/評価/計画」の4項目で構成され、ケアの根拠を明確に残すことができます。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              保育連絡帳の役割と負担軽減
            </h3>
            <p className="leading-relaxed">
              保育連絡帳は保護者と保育士をつなぐ重要なコミュニケーション手段です。毎日の記入は保育士の大きな業務負担となっており、文例ジェネレーターを使うことで1件あたり数分の記入時間を大幅に短縮できます。年齢・場面に応じた自然な文体で、保護者との信頼関係も維持できます。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              アレルギー対応と事故防止
            </h3>
            <p className="leading-relaxed">
              令和8年4月1日の食物アレルギー改正により、カシューナッツが義務表示品目に追加され、ピスタチオが推奨表示品目に加わりました。給食・おやつの原材料確認は毎日の作業ですが、見落としは重篤な事故につながります。アレルギーチェッカーを使うことで、原材料テキストから28品目を自動検出し、代替表記・含有表現の見落としを防ぎます。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              公的助成制度の活用
            </h3>
            <p className="leading-relaxed">
              介護保険の区分支給限度額は要介護度によって異なり、限度額を超えた分は全額自己負担となります。デイサービスの利用料試算ツールを使えば、限度額内に収まるか事前確認でき、家族の介護計画立案をサポートします。要介護度早見表と合わせて使うことで、要介護認定後すぐに現実的なサービス計画を立てることができます。
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5"
            >
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Q. {item.q}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">A. {item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-12 rounded-2xl border border-sky-200 bg-sky-50 p-6 dark:border-sky-800 dark:bg-sky-950/50">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          介護・保育の業務効率化を、今日から
        </h2>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          登録不要・完全無料。お気に入りのツールから今すぐ使い始められます。法改正への対応も継続的にアップデートしますので、ブックマークしてお使いください。
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/business/kaigo-hoshu-calc"
            className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
          >
            介護報酬計算機 →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            ホームへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
