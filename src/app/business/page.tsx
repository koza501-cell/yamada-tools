import { Metadata } from "next";
import Link from "next/link";
import { businessTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "ビジネス・法人ツール【無料35種】会社設立・法人税・社会保険・補助金シミュレーション",
  description: "会社設立費用シミュレーター・法人化判定・役員報酬最適化・法人税計算・補助金検索・許認可チェッカーなど35種のビジネスツールを無料提供。中小企業・個人事業主・フリーランスの経営判断に。登録不要・日本国内サーバー処理。",
  keywords: [
    "会社設立 費用", "法人化 シミュレーター", "役員報酬 最適化", "法人税 計算",
    "フリーランス 税金", "簡易課税 計算", "補助金 検索", "法人番号 検索",
    "マイクロ法人", "許認可 チェック", "決算期 シミュレーション",
  ],
  alternates: { canonical: "https://yamada-tools.jp/business" },
  openGraph: {
    title: "ビジネス・法人ツール【無料35種】会社設立・法人税・社会保険・補助金",
    description: "会社設立から税務シミュレーション、公的データ照会まで。中小企業・フリーランスの経営判断を支える無料ツール集。",
    url: "https://yamada-tools.jp/business",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
    { "@type": "ListItem", position: 2, name: "ビジネス・法人ツール", item: "https://yamada-tools.jp/business" },
  ],
};

// Intent-based tool grouping
const TOOL_GROUPS: { id: string; title: string; description: string; color: string; colorDark: string; toolIds: string[] }[] = [
  {
    id: 'formation',
    title: '🏢 会社設立・法人化',
    description: '会社設立の費用・形態・資本金・届出・許認可・スケジュールを事前にシミュレーション。設立前の意思決定に必要な情報を網羅。',
    color: 'border-pink-200 bg-pink-50/30',
    colorDark: 'dark:border-pink-800 dark:bg-pink-900/5',
    toolIds: [
      'setsuritsu-hiyo', 'kaisha-shindan', 'shihonkin-guide', 'kesanki-sim',
      'setsuritsu-schedule', 'jigyou-mokuteki', 'kyoninka-checker',
      'setsuritsu-todoke', 'incorporation-simulator', 'micro-houjin',
    ],
  },
  {
    id: 'tax',
    title: '💰 税務シミュレーション',
    description: '法人税・役員報酬・フリーランスの所得税・簡易課税の消費税を計算。年間の税負担を事前に把握し、節税対策の判断材料に。',
    color: 'border-blue-200 bg-blue-50/30',
    colorDark: 'dark:border-blue-800 dark:bg-blue-900/5',
    toolIds: [
      'director-salary-optimizer', 'corporate-tax-calculator',
      'freelance-tax-calculator', 'simplified-tax-calculator',
      'houjin-iji-hiyo',
    ],
  },
  {
    id: 'data',
    title: '🔍 公的データ照会',
    description: '経済産業省gBizINFO・国税庁法人番号・デジタル庁Jグランツの公式データを無料で検索。取引先の与信確認や補助金調査に。',
    color: 'border-emerald-200 bg-emerald-50/30',
    colorDark: 'dark:border-emerald-800 dark:bg-emerald-900/5',
    toolIds: [
      'houjin-search', 'houjin-bangou-lookup', 'houjin-cross-verify',
      'houjin-zaimu', 'houjin-nyusatsu', 'houjin-nintei',
      'hojokin-active', 'hojokin-history',
    ],
  },
  {
    id: 'industry',
    title: '🏗️ 業種別計算機',
    description: '建設業・美容室・民泊・運送業・小売業など、業種固有の計算ニーズに対応した専門ツール。',
    color: 'border-amber-200 bg-amber-50/30',
    colorDark: 'dark:border-amber-800 dark:bg-amber-900/5',
    toolIds: [
      'hofuku-calculator', 'keishin-calculator', 'kensetsu-mitsumori-calculator',
      'biyoshitsu-buai-calculator', 'minpaku-calculator', 'unchin-calculator',
      'eikaiwa-kakaku-calculator', 'furima-profit-calculator',
      'retail-markup-calculator', 'freelance-tanka-calculator',
    ],
  },
  {
    id: 'hr',
    title: '👥 人材・採用',
    description: '外国人採用のビザ費用や特定技能の採用コストを計算。',
    color: 'border-purple-200 bg-purple-50/30',
    colorDark: 'dark:border-purple-800 dark:bg-purple-900/5',
    toolIds: [
      'tokutei-gino-calculator', 'gaikokujin-visa-calculator',
    ],
  },
];

export default function BusinessPage() {
  const available = businessTools.filter((t) => t.available);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd]) }} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

        {/* Hero */}
        <section className="bg-gradient-to-br from-kon to-ai text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">ビジネス・法人ツール</h1>
            <p className="text-xl md:text-2xl mb-4 text-gray-200 max-w-3xl mx-auto">
              会社設立・法人税・社会保険・補助金を無料でシミュレーション。
            </p>
            <p className="text-base text-gray-300 max-w-2xl mx-auto">
              起業・独立を検討中の方から法人経営者まで。全{available.length}ツール、登録不要・完全無料。
            </p>
          </div>
        </section>

        {/* Trust badges */}
        <section className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                公的データに基づく計算
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                入力データ非保存
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                2026年度税制対応
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                日本国内サーバー処理
              </div>
            </div>
          </div>
        </section>

        {/* Tool groups */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 space-y-12">
            {TOOL_GROUPS.map((group) => {
              const groupTools = group.toolIds
                .map((id) => available.find((t) => t.id === id))
                .filter(Boolean) as typeof available;

              if (groupTools.length === 0) return null;

              return (
                <div key={group.id}>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{group.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm max-w-3xl">{group.description}</p>
                  </div>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6 rounded-2xl border ${group.color} ${group.colorDark}`}>
                    {groupTools.map((tool) => (
                      <Link
                        key={tool.path}
                        href={tool.path}
                        className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-700"
                      >
                        <div className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl flex-shrink-0">{tool.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-ai transition-colors">{tool.nameJa}</h3>
                                {tool.isNew && (
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-bold">NEW</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* About section with expanded content */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">yamada-tools.jpのビジネスツールについて</h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                個人事業主・フリーランス・法人経営者が必要とする税金・社会保険・会社設立の計算を、日本の制度に完全対応した形で無料提供しています。
                国税庁・経済産業省・デジタル庁の公式データを活用し、正確な計算結果をお届けします。
              </p>
              <p>
                2026年度の税制改正・社会保険料率に対応済み。法人化の判断、役員報酬の最適化、会社設立の準備にお役立てください。
                すべてのツールは登録不要・入力データ非保存で安心してご利用いただけます。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-sm">会社設立を検討中の方</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">設立費用・会社形態・資本金・届出・許認可をシミュレーション。設立前に必要な判断材料を一括取得。</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-sm">法人経営者の方</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">役員報酬の最適額・法人税・簡易課税の消費税・法人維持費を計算し、経営判断に活用。</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-sm">フリーランスの方</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">所得税・住民税・国民健康保険料の見積もり。法人化のタイミング判断やマイクロ法人の検討に。</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-sm">経理・法務担当の方</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">法人番号検索・取引先の財務情報確認・補助金調査など、日常業務の効率化ツール。</p>
                </div>
              </div>
            </div>

            {/* Sources */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">計算根拠・データソース</h3>
              <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <li>• <a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-pink-500">国税庁 タックスアンサー</a> — 法人税・所得税の税率・控除額</li>
                <li>• <a href="https://www.kyoukaikenpo.or.jp/g7/cat330/sb3150/r06/r6ryougakuhyou3gatukara/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-pink-500">全国健康保険協会（協会けんぽ）</a> — 健康保険・厚生年金保険料率</li>
                <li>• <a href="https://info.gbiz.go.jp/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-pink-500">経済産業省 gBizINFO</a> — 法人基本情報・財務・入札・認定データ</li>
                <li>• <a href="https://www.jgrants-portal.go.jp/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-pink-500">デジタル庁 Jグランツ</a> — 補助金・助成金情報</li>
                <li>• <a href="https://www.houjin-bangou.nta.go.jp/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-pink-500">国税庁 法人番号公表サイト</a> — 法人番号・商号・所在地</li>
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 text-xs text-gray-400 dark:text-gray-500">
              <p><time dateTime="2026-05-23">最終更新: 2026年5月</time></p>
              <p>次回見直し: 2026年度税制改正反映後</p>
              <p>全{available.length}ツール収録</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
