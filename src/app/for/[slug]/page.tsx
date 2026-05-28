import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  businessTools,
  documentTools,
  taxTools,
  clinicTools,
  realestateTools,
  foodTools,
  financeTools,
  lifeTools,
  Tool,
} from '@/config/tools';

// ============================================================
// NICHE DEFINITIONS
// ============================================================

interface ForNiche {
  slug: string;
  title: string;
  heading: string;
  description: string;
  metaDescription: string;
  keywords: string;
  emoji: string;
  tools: Tool[][];
  challenges: { icon: string; title: string; body: string }[];
  ctaText: string;
}

const niches: ForNiche[] = [
  {
    slug: 'keieisha',
    title: '中小企業の経営者向けツール｜法人検索・補助金・請求書・給与計算',
    heading: '中小企業の経営者向けツール',
    description:
      '法人検索・補助金申請・請求書作成・給与計算など、中小企業の経営者が日常業務で使える無料ツールをまとめました。登録不要・すべて無料でご利用いただけます。',
    metaDescription:
      '中小企業の経営者向け無料ツール集。法人番号検索・補助金検索・請求書作成・全銀フォーマット・給与計算など、経営に必要なツールを一箇所に。登録不要・完全無料。',
    keywords: '中小企業 経営者 ツール, 法人検索 無料, 補助金申請 ツール, 請求書作成 無料, 給与計算 無料',
    emoji: '🏢',
    tools: [businessTools, documentTools],
    challenges: [
      { icon: '🔍', title: '取引先の法人情報確認', body: '法人番号検索・gBizINFO法人検索でT番号・財務情報を瞬時に確認。インボイス対応にも。' },
      { icon: '💰', title: '補助金・助成金の活用', body: 'Jグランツ連携の補助金検索で、自社が対象の補助金を一括検索。申請漏れを防ぎます。' },
      { icon: '📋', title: '書類作成の効率化', body: '請求書・見積書・納品書を無料で作成。インボイス対応・PDF出力・メール送付まで対応。' },
    ],
    ctaText: '経営に役立つツールを今すぐ使う',
  },
  {
    slug: 'freelance',
    title: '個人事業主・フリーランス向けツール｜確定申告・インボイス・節税計算',
    heading: '個人事業主・フリーランス向けツール',
    description:
      '確定申告・消費税・インボイス対応・所得税計算など、フリーランスや個人事業主が必要な税務・書類ツールをまとめました。',
    metaDescription:
      'フリーランス・個人事業主向け無料ツール集。確定申告・消費税計算・インボイス対応・所得税計算・請求書作成。登録不要・完全無料で使えます。',
    keywords: 'フリーランス ツール, 個人事業主 確定申告, インボイス 計算, 消費税 計算 無料, 所得税 計算',
    emoji: '💼',
    tools: [taxTools, documentTools],
    challenges: [
      { icon: '🧾', title: '確定申告・税金計算', body: '所得税・消費税・ふるさと納税の控除額を無料でシミュレーション。副業収入の申告判断にも。' },
      { icon: '📄', title: 'インボイス対応の請求書', body: '適格請求書（インボイス）対応の請求書をPDFで無料作成。T番号の記載・消費税の自動計算も。' },
      { icon: '💡', title: '節税シミュレーション', body: '法人化のタイミング・iDeCoの節税効果・青色申告の控除額を事前にシミュレーション。' },
    ],
    ctaText: '確定申告・税金計算を今すぐ試す',
  },
  {
    slug: 'clinic',
    title: 'クリニック・士業向けツール｜損益分岐点・人件費率・給与計算',
    heading: 'クリニック・士業向けツール',
    description:
      'クリニック院長・歯科医・士業の先生向けに、損益分岐点・人件費率診断・医療スタッフ給与計算など経営支援ツールを提供しています。',
    metaDescription:
      'クリニック・士業向け無料経営支援ツール集。損益分岐点シミュレーター・人件費率診断・医療スタッフ給与計算。厚労省データ基準・登録不要・完全無料。',
    keywords: 'クリニック 経営 ツール, 開業医 損益分岐点, 人件費率 診断, 医療 給与計算 無料, 士業 経営',
    emoji: '🏥',
    tools: [clinicTools],
    challenges: [
      { icon: '📊', title: '経営数字の把握', body: '損益分岐点・必要患者数・1日あたりの目標診療単価を診療科別に計算。融資申請書類にも活用できます。' },
      { icon: '👥', title: 'スタッフの給与管理', body: '医療スタッフの給与計算・夜勤手当・社会保険料を自動計算。給与明細のPDF出力まで対応。' },
      { icon: '📋', title: '人件費率の最適化', body: '適正人件費率（医科・歯科・調剤別）と現状のギャップを診断。採用計画の根拠データに。' },
    ],
    ctaText: 'クリニック経営ツールを今すぐ使う',
  },
  {
    slug: 'fudousan',
    title: '不動産・建設関係者向けツール｜用途地域・ハザード・地価・取引価格',
    heading: '不動産・建設関係者向けツール',
    description:
      '用途地域チェック・ハザードマップ確認・地価調査・不動産取引価格・学区チェックなど、不動産調査に必要な情報を一箇所で確認できます。',
    metaDescription:
      '不動産・建設関係者向け無料調査ツール集。用途地域チェック・ハザードマップ・地価検索・不動産取引価格・学区確認。国土交通省・法務省データ連携。登録不要・無料。',
    keywords: '用途地域 調べ方, ハザードマップ 確認, 地価 検索 無料, 不動産 取引価格, 学区 チェック',
    emoji: '🏠',
    tools: [realestateTools],
    challenges: [
      { icon: '🗺️', title: '物件・土地の法規制確認', body: '用途地域・ハザードリスク・建蔽率・容積率を地図上で即確認。購入前の調査を効率化。' },
      { icon: '💹', title: '地価・取引価格の調査', body: '国土交通省の実勢データから周辺の地価・実際の不動産取引価格を無料で検索。査定の根拠に。' },
      { icon: '🏫', title: '学区・周辺環境の確認', body: '小学校・中学校の学区境界を地図で確認。ファミリー層への物件提案・説明資料作成に活用。' },
    ],
    ctaText: '不動産調査ツールを今すぐ使う',
  },
  {
    slug: 'inshoku',
    title: '飲食店経営者向けツール｜原価率・栄養成分表示・フードロス計算',
    heading: '飲食店経営者向けツール',
    description:
      '飲食店の原価率計算・栄養成分表示ラベルの作成・フードロスコスト計算など、飲食店経営に必要な無料ツールを提供しています。',
    metaDescription:
      '飲食店経営者向け無料ツール集。原価率計算機・栄養成分表示ラベル作成・フードロスコスト計算。食品表示法対応・補助金検索も。登録不要・完全無料。',
    keywords: '飲食店 原価率 計算, 栄養成分表示 作成 無料, フードロス コスト, 飲食店 経営 ツール, 食品表示 無料',
    emoji: '🍽️',
    tools: [foodTools],
    challenges: [
      { icon: '💰', title: '原価率の管理', body: '目標原価率から逆算した売価設定・食材コストの管理。メニュー改定の判断材料に。' },
      { icon: '📋', title: '栄養成分表示の作成', body: '食品表示法に対応した栄養成分表示ラベルを無料で作成。テイクアウト・デリバリー対応にも。' },
      { icon: '♻️', title: 'フードロスコストの把握', body: '食材廃棄によるコスト損失を数値化。月間・年間のフードロス削減効果をシミュレーション。' },
    ],
    ctaText: '飲食店経営ツールを今すぐ使う',
  },
  {
    slug: 'kazoku',
    title: '家族の生活・将来設計向けツール｜家計・住宅・教育・相続',
    heading: '家族の生活・将来設計向けツール',
    description:
      '家計シミュレーター・住宅ローン計算・教育費シミュレーター・引越し費用計算など、家族の将来設計に役立つ無料ツールをまとめました。',
    metaDescription:
      '家族の将来設計向け無料ツール集。家計簿シミュレーター・住宅ローン計算・教育費シミュレーター・引越し費用・葬儀費用計算。登録不要・完全無料。',
    keywords: '家計 シミュレーション 無料, 住宅ローン 計算, 教育費 シミュレーター, 引越し費用 計算, 将来設計 ツール',
    emoji: '👨‍👩‍👧‍👦',
    tools: [financeTools, lifeTools],
    challenges: [
      { icon: '🏠', title: '住宅購入vs賃貸の判断', body: '生涯コストを比較して賃貸か購入かを判断。ローン返済シミュレーター・固定資産税計算も。' },
      { icon: '🎓', title: '教育費の準備', body: '幼稚園から大学まで総額シミュレーション。学習塾・習い事のコスト計算も対応。' },
      { icon: '💴', title: '老後・相続の準備', body: 'iDeCo・NISAの積立シミュレーション・退職金の税金計算・相続税の試算まで対応。' },
    ],
    ctaText: '将来設計ツールを今すぐ使う',
  },
];

// ============================================================
// STATIC PARAMS
// ============================================================

export function generateStaticParams() {
  return niches.map((n) => ({ slug: n.slug }));
}

// ============================================================
// METADATA
// ============================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const niche = niches.find((n) => n.slug === slug);
  if (!niche) return {};
  return {
    title: niche.title + ' | yamada-tools.jp',
    description: niche.metaDescription,
    keywords: niche.keywords,
  };
}

// ============================================================
// PAGE
// ============================================================

export default async function ForSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const niche = niches.find((n) => n.slug === slug);
  if (!niche) notFound();

  const allTools = niche.tools
    .flat()
    .filter((t) => t.available);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">›</span>
        <Link href="/for" className="hover:underline">役割別ツール</Link>
        <span className="mx-2">›</span>
        <span>{niche.heading}</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="text-4xl mb-3">{niche.emoji}</div>
        <h1 className="text-3xl font-bold text-kon dark:text-white mb-3">{niche.heading}</h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-3xl">{niche.description}</p>
      </div>

      {/* Challenges */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-kon dark:text-white mb-4">こんなお悩みを解決します</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {niche.challenges.map((c, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <div className="text-2xl mb-2">{c.icon}</div>
              <h3 className="font-semibold text-kon dark:text-white mb-1">{c.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools grid */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-kon dark:text-white mb-4">
          利用できるツール一覧（{allTools.length}件）
        </h2>
        {allTools.length === 0 ? (
          <p className="text-gray-500">ツールは近日公開予定です。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-ai dark:hover:border-ai rounded-xl p-5 transition-all hover:shadow-md group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-2xl">{tool.icon}</div>
                  {tool.isNew && (
                    <span className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded">NEW</span>
                  )}
                </div>
                <h3 className="font-semibold text-kon dark:text-white group-hover:text-ai text-sm mb-1 line-clamp-2">{tool.nameJa}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{tool.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">すべて無料・登録不要・データ保存なし</p>
        <h2 className="text-xl font-bold text-kon dark:text-white mb-4">{niche.ctaText}</h2>
        <Link
          href="/"
          className="inline-block bg-ai text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          全ツール一覧を見る
        </Link>
      </section>
    </main>
  );
}
