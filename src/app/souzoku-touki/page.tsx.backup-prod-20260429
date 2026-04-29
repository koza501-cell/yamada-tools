import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "相続登記DIYガイド【無料】自分でできる相続登記ツール集",
  description: "相続登記を自分でできる無料ツール集。ケース診断・書類チェックリスト・登録免許税計算・法務局検索・ガイド記事を提供。2024年義務化対応。法務局公式書式準拠。",
  keywords: ["相続登記 自分で", "相続登記 申請書", "登録免許税 計算", "相続登記 書類", "相続登記 義務化"],
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki" },
  openGraph: {
    title: "相続登記DIYガイド【無料】自分でできる相続登記ツール集",
    description: "相続登記を自分でできる無料ツール集。ケース診断・書類チェックリスト・登録免許税計算・法務局検索。2024年義務化対応。",
    url: "https://yamada-tools.jp/souzoku-touki",
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
    { "@type": "ListItem", position: 2, name: "相続登記DIYガイド", item: "https://yamada-tools.jp/souzoku-touki" },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "相続登記の義務化はいつから？", acceptedAnswer: { "@type": "Answer", text: "2024年（令和6年）4月1日から義務化されました。相続を知った日から3年以内に申請が必要です。" } },
    { "@type": "Question", name: "登録免許税はいくらかかりますか？", acceptedAnswer: { "@type": "Answer", text: "固定資産税評価額の0.4%です。100円未満切り捨て、最低1,000円です。" } },
    { "@type": "Question", name: "相続登記は自分でできますか？", acceptedAnswer: { "@type": "Answer", text: "配偶者・子への単純な相続であれば自分で申請できます。本ツールで必要書類とステップを無料で確認できます。" } },
  ],
};

const tools = [
  { name: "ケース診断ウィザード", url: "/souzoku-touki/wizard", description: "10問の質問に答えるだけで自分のケースを判定。DIY可否・必要書類・複雑度がわかる", icon: "🧭", badge: "まずはここから" },
  { name: "書類チェックリスト", url: "/souzoku-touki/checklist", description: "ケース別に必要書類を一覧表示。取得場所・費用・注意点付き。印刷対応", icon: "📋", badge: null },
  { name: "登録免許税計算機", url: "/souzoku-touki/tax", description: "固定資産評価額を入力するだけで税額を自動計算。計算式の内訳も表示", icon: "🧮", badge: null },
  { name: "管轄法務局検索", url: "/souzoku-touki/houmukyoku", description: "都道府県・市区町村から管轄法務局の名称・住所・電話番号を検索", icon: "🏛️", badge: null },
  { name: "ガイド記事", url: "/souzoku-touki/guide", description: "相続登記の基礎知識から申請の流れ・よくある失敗まで6テーマを詳説", icon: "📖", badge: null },
  { name: "よくある質問", url: "/souzoku-touki/faq", description: "30問以上のQ&Aで疑問を解消。義務化・罰則・書類・費用・期限を網羅", icon: "❓", badge: null },
];

const painPoints = [
  { icon: "⚠️", title: "2024年4月から義務化", desc: "相続登記が法律で義務化。怠ると10万円以下の過料" },
  { icon: "⏰", title: "3年以内の期限", desc: "相続を知った日から3年以内。過去の相続は2027年3月31日まで" },
  { icon: "💰", title: "司法書士費用5〜15万円", desc: "専門家に頼むと高額。単純なケースなら自分で十分できる" },
];

export default function SouzokuToukiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, faqJsonLd]) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-kon to-ai text-white py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span>📜</span> 法務局公式書式準拠 · 2024年義務化対応
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            相続登記、自分でできる。<br className="hidden md:block" />
            <span className="text-yellow-300">最大15万円節約</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            ケース診断・書類チェックリスト・登録免許税計算・法務局検索まで<br className="hidden md:block" />
            相続登記DIYに必要なツールをすべて無料で提供
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/souzoku-touki/wizard"
              className="bg-white text-kon font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              🧭 ケース診断スタート
            </Link>
            <Link
              href="/souzoku-touki/tax"
              className="bg-white/20 border border-white/50 text-white font-bold py-4 px-8 rounded-xl hover:bg-white/30 transition-colors text-lg"
            >
              🧮 税額を計算する
            </Link>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-10 bg-red-50 dark:bg-red-950/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {painPoints.map((p) => (
              <div key={p.title} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-red-100 dark:border-red-900">
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{p.title}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm mt-0.5">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">無料ツール一覧</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-10">登録不要・完全無料。すべてのツールを今すぐ使えます</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tools.map((tool) => (
              <Link
                key={tool.url}
                href={tool.url}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{tool.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-ai transition-colors">{tool.name}</h3>
                        {tool.badge && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">{tool.badge}</span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{tool.description}</p>
                      <div className="mt-3">
                        <span className="text-sm text-ai font-medium group-hover:translate-x-1 transition-transform inline-block">使ってみる →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Professional */}
      <section className="py-14 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">自分でできる？専門家に頼む？</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">項目</th>
                  <th className="py-3 px-4 font-semibold text-ai text-center">自分で（本ツール）</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-300 text-center">司法書士依頼</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  ["費用", "登録免許税のみ（評価額×0.4%）", "登録免許税＋報酬5〜15万円"],
                  ["時間", "数日〜1週間（書類収集含む）", "2〜4週間（依頼後）"],
                  ["難易度", "単純ケースなら初心者でも可能", "複雑なケースに対応"],
                  ["適したケース", "遺産分割協議・法定相続の単純相続", "数次相続・遺贈・相続放棄が絡む場合"],
                  ["安心感", "自分でチェックしながら進められる", "プロに任せられる"],
                ].map(([item, diy, pro]) => (
                  <tr key={item} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{item}</td>
                    <td className="py-3 px-4 text-center text-green-700 dark:text-green-400">{diy}</td>
                    <td className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">{pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            まず<Link href="/souzoku-touki/wizard" className="text-ai underline">ケース診断</Link>でDIY可否を確認しましょう
          </p>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-10 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: "🏛️", label: "法務局公式書式準拠" },
              { icon: "🔒", label: "日本国内サーバー処理" },
              { icon: "💯", label: "登録不要・完全無料" },
              { icon: "📱", label: "スマホ対応" },
            ].map((t) => (
              <div key={t.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="text-3xl mb-2">{t.icon}</div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-300">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 bg-yellow-50 dark:bg-yellow-950/30 border-t border-yellow-200 dark:border-yellow-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            ⚠️ 本ツールは書類作成補助です。法律相談・代理申請は行いません。複雑な案件は司法書士にご相談ください。
          </p>
        </div>
      </section>
    </>
  );
}
