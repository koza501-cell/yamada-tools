import { Metadata } from "next";
import Link from "next/link";
import { themeColors } from "@/config/niches";
import { NicheIcon } from "@/components/home/NicheIcons";

// ============================================================
// /souzoku-touki — 相続・登記 hub (NAVY theme)
// ============================================================
// Custom layout (different from HubLayout) because this niche has
// unique elements: warning urgency box, step-by-step wizard,
// DIY vs professional comparison.
// All sub-routes (/souzoku-touki/wizard, /tax, etc.) UNCHANGED.
// ============================================================

export const metadata: Metadata = {
  title: "相続登記DIYガイド【無料】自分でできる相続登記ツール集 | 山田ツール",
  description:
    "2024年義務化された相続登記をDIYで進めるための無料ツール。ケース診断・必要書類チェックリスト・登録免許税計算機・管轄法務局検索まで。最大15万円節約。",
  keywords:
    "相続登記, 相続登記 自分で, 相続登記 義務化, 登録免許税 計算, 法務局 検索, 相続登記 必要書類, 無料",
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "相続登記、自分でできる。最大15万円節約 | 山田ツール",
    description:
      "ケース診断・書類チェック・税額計算・法務局検索まで、相続登記DIYに必要なツールをすべて無料で提供。",
    url: "https://yamada-tools.jp/souzoku-touki",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/souzoku-touki",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
    { "@type": "ListItem", position: 2, name: "相続・登記", item: "https://yamada-tools.jp/souzoku-touki" },
  ],
};

const tools = [
  {
    step: "STEP 01",
    iconName: "scroll",
    name: "ケース診断ウィザード",
    description: "10問の質問でDIY可否・必要書類・複雑度を自動判定",
    url: "/souzoku-touki/wizard",
    primary: true,
  },
  {
    step: "STEP 02",
    iconName: "document",
    name: "書類チェックリスト",
    description: "ケース別に必要書類を一覧表示。取得場所・費用・注意点付き",
    url: "/souzoku-touki/checklist",
  },
  {
    step: "STEP 03",
    iconName: "chart",
    name: "登録免許税計算機",
    description: "固定資産評価額を入力するだけで税額を自動計算",
    url: "/souzoku-touki/tax",
  },
  {
    step: "STEP 04",
    iconName: "home",
    name: "管轄法務局検索",
    description: "都道府県・市区町村から管轄法務局を検索",
    url: "/souzoku-touki/houmukyoku",
  },
];

const additionalTools = [
  {
    iconName: "book",
    name: "ガイド記事",
    description: "相続登記の基礎知識から申請の流れ・よくある失敗まで",
    url: "/souzoku-touki/guide",
  },
  {
    iconName: "users",
    name: "よくある質問",
    description: "30問以上のQ&Aで疑問を解消",
    url: "/souzoku-touki/faq",
  },
];

export default function SouzokuToukiHubPage() {
  const colors = themeColors.navy;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="min-h-screen bg-stone-50 dark:bg-gray-900">
        {/* ============ Hero ============ */}
        <section
          className="relative border-b-4"
          style={{ background: colors.bg, borderColor: colors.accent }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
              {/* Left: Headline + CTAs */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.7)", color: colors.iconColor }}
                  >
                    <NicheIcon name="scroll" size={26} />
                  </div>
                  <span
                    className="inline-block text-[11px] font-medium px-3 py-1.5 rounded"
                    style={{ background: colors.accent, color: "#FEF3C7" }}
                  >
                    法務局公式書式準拠 · 2024年義務化対応
                  </span>
                </div>

                <p
                  className="text-[11px] tracking-widest uppercase font-medium mb-2"
                  style={{ color: colors.textMuted }}
                >
                  INHERITANCE & REGISTRATION
                </p>
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3"
                  style={{ color: colors.text }}
                >
                  相続登記、自分でできる。
                </h1>
                <p
                  className="text-base sm:text-lg mb-4"
                  style={{ color: colors.textMuted }}
                >
                  最大15万円節約
                </p>
                <p className="text-sm text-stone-700 dark:text-gray-300 leading-relaxed mb-6">
                  義務化された相続登記をDIYで進めるための診断・書類チェック・税額計算ツール。
                  <br className="hidden sm:block" />
                  ケース別に必要書類を確認し、登録免許税を計算、管轄法務局までワンストップで。
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/souzoku-touki/wizard"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: colors.accent }}
                  >
                    ケース診断スタート →
                  </Link>
                  <Link
                    href="/souzoku-touki/guide"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border transition-colors hover:bg-stone-50 dark:hover:bg-gray-700"
                    style={{ borderColor: colors.accent, color: colors.accent }}
                  >
                    ガイドを読む
                  </Link>
                </div>
              </div>

              {/* Right: Warning urgency box */}
              <div className="bg-white dark:bg-gray-800 border border-stone-200 dark:border-gray-700 rounded-2xl p-5">
                <div className="text-[11px] font-medium text-danger dark:text-danger mb-3">
                  ⚠️ 重要なお知らせ
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-danger/20 rounded-lg p-3">
                    <div className="text-sm font-medium text-danger dark:text-gin">
                      2024年4月から義務化
                    </div>
                    <div className="text-xs text-stone-600 dark:text-gray-400 mt-1">
                      相続登記が法律で義務化されました
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-kon/20 rounded-lg p-3">
                    <div className="text-sm font-medium text-kon dark:text-amber-200">
                      10万円以下の過料
                    </div>
                    <div className="text-xs text-stone-600 dark:text-gray-400 mt-1">
                      相続を知った日から3年以内。過去の相続は2027年3月31日まで
                    </div>
                  </div>

                  <div className="bg-stone-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-sm font-medium text-stone-800 dark:text-gray-200">
                      司法書士費用 5〜15万円
                    </div>
                    <div className="text-xs text-stone-600 dark:text-gray-400 mt-1">
                      単純なケースなら自分で申請可能
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ============ JSON-LD: SoftwareApplication / HowTo / FAQPage ============ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "相続登記DIYツール",
              "description": "2024年義務化された相続登記を自分で進めるための診断・書類チェック・登録免許税計算ツール",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "JPY"
              },
              "url": "https://yamada-tools.jp/souzoku-touki",
              "provider": {
                "@type": "Organization",
                "name": "合同会社山田トレード",
                "url": "https://yamada-tools.jp"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "相続登記を自分で申請する4ステップ",
              "description": "ケース診断から登録免許税計算、管轄法務局の確認まで",
              "totalTime": "PT7D",
              "estimatedCost": { "@type": "MonetaryAmount", "currency": "JPY", "value": "2000" },
              "step": [
                { "@type": "HowToStep", "name": "ケース診断ウィザード", "text": "10問の質問でDIY可否・必要書類・複雑度を自動判定", "url": "https://yamada-tools.jp/souzoku-touki/wizard" },
                { "@type": "HowToStep", "name": "書類チェックリスト", "text": "ケース別に必要書類を一覧表示", "url": "https://yamada-tools.jp/souzoku-touki/checklist" },
                { "@type": "HowToStep", "name": "登録免許税計算機", "text": "固定資産評価額から税額を自動計算", "url": "https://yamada-tools.jp/souzoku-touki/tax" },
                { "@type": "HowToStep", "name": "管轄法務局検索", "text": "都道府県・市区町村から管轄法務局を検索", "url": "https://yamada-tools.jp/souzoku-touki/houmukyoku" }
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "相続登記は本当に自分でできますか？", "acceptedAnswer": { "@type": "Answer", "text": "単純なケース（相続人が少数・不動産が1〜2件・遺産分割協議が成立済み）であれば、自分で申請可能です。本ツールの診断で適性を確認できます。" } },
                { "@type": "Question", "name": "相続登記をしないと罰則がありますか？", "acceptedAnswer": { "@type": "Answer", "text": "2024年4月から義務化されており、正当な理由なく3年以内に申請しないと10万円以下の過料の対象となります。過去の相続も2027年3月31日までに登記する必要があります。" } },
                { "@type": "Question", "name": "費用はどのくらいかかりますか？", "acceptedAnswer": { "@type": "Answer", "text": "自分で申請する場合は登録免許税（固定資産評価額×0.4%）+ 書類取得費用（2,000〜5,000円程度）のみ。司法書士に依頼すると5〜15万円が相場です。" } },
                { "@type": "Question", "name": "本ツールの利用料金は？", "acceptedAnswer": { "@type": "Answer", "text": "完全無料・登録不要でご利用いただけます。" } }
              ]
            })
          }}
        />
        {/* ============ Step-by-step journey ============ */}
        <section className="bg-white dark:bg-gray-800 border-b border-stone-100 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
            <p
              className="text-[11px] tracking-widest uppercase font-medium mb-1"
              style={{ color: colors.textMuted }}
            >
              STEP-BY-STEP
            </p>
            <h2
              className="text-xl sm:text-2xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              相続登記DIYの流れ
            </h2>
            <p className="text-sm text-stone-600 dark:text-gray-400 mb-6">
              4ステップで、相続登記を自分で進められます。
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <a href="/souzoku-touki/shinseisho" className="group bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">NEW</div>
                <div className="mb-3">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">登記申請書PDF作成</h3>
                <p className="text-sm text-blue-100 leading-relaxed">必要事項を入力するだけで法務局公式書式の登記申請書PDFを自動生成。完全無料。</p>
                <div className="mt-4 text-xs text-blue-200 font-semibold">PDFをダウンロード →</div>
              </a>
              {tools.map((tool) => (
                <Link
                  key={tool.url}
                  href={tool.url}
                  className="group block p-4 rounded-xl transition-transform hover:scale-[1.02]"
                  style={
                    tool.primary
                      ? { background: "#FEF7ED", border: "1px solid #FDE68A" }
                      : {
                          background: "white",
                          border: `1px solid ${colors.border}`,
                        }
                  }
                >
                  <div
                    className={`text-[10px] font-medium mb-2 ${
                      tool.primary ? "text-kon" : ""
                    }`}
                    style={!tool.primary ? { color: colors.textMuted } : undefined}
                  >
                    {tool.step}
                  </div>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                    style={{
                      background: tool.primary ? "#FEF3C7" : colors.iconBg,
                      color: tool.primary ? "#92400E" : colors.iconColor,
                    }}
                  >
                    <NicheIcon name={tool.iconName} size={20} />
                  </div>
                  <div
                    className="text-sm font-bold mb-1"
                    style={{ color: colors.text }}
                  >
                    {tool.name}
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-gray-400 leading-relaxed">
                    {tool.description}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ Self vs Professional comparison ============ */}
        <section className="bg-stone-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
            <p
              className="text-[11px] tracking-widest uppercase font-medium mb-1"
              style={{ color: colors.textMuted }}
            >
              COMPARE
            </p>
            <h2
              className="text-xl sm:text-2xl font-bold mb-6"
              style={{ color: colors.text }}
            >
              自分でできる？専門家に頼む？
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DIY */}
              <div
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2"
                style={{ borderColor: colors.accent }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="text-sm font-bold"
                    style={{ color: colors.text }}
                  >
                    自分で申請
                  </div>
                  <span
                    className="text-[10px] font-medium px-2 py-1 rounded"
                    style={{ background: "#FEF3C7", color: "#92400E" }}
                  >
                    おすすめ
                  </span>
                </div>
                <div className="space-y-2 text-sm text-stone-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>費用</span>
                    <span className="font-medium">登録免許税のみ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>時間</span>
                    <span className="font-medium">数日〜1週間</span>
                  </div>
                  <div className="flex justify-between">
                    <span>難易度</span>
                    <span className="font-medium">単純ケースなら可能</span>
                  </div>
                </div>
              </div>

              {/* Professional */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-stone-200 dark:border-gray-700">
                <div className="text-sm font-bold text-stone-700 dark:text-gray-300 mb-3">
                  司法書士に依頼
                </div>
                <div className="space-y-2 text-sm text-stone-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>費用</span>
                    <span className="font-medium">+ 5〜15万円</span>
                  </div>
                  <div className="flex justify-between">
                    <span>時間</span>
                    <span className="font-medium">2〜4週間</span>
                  </div>
                  <div className="flex justify-between">
                    <span>難易度</span>
                    <span className="font-medium">複雑ケース対応</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-gray-400 mt-4 text-center">
              まず{" "}
              <Link
                href="/souzoku-touki/wizard"
                className="font-medium hover:underline"
                style={{ color: colors.accent }}
              >
                ケース診断
              </Link>{" "}
              でDIY可否を確認しましょう
            </p>
          </div>
        </section>


        {/* ============ 監修者 + 累計診断件数 ============ */}
        <section className="py-12 px-4 bg-gradient-to-br from-blue-50 to-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 監修者 placeholder */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-blue-700 mb-3 tracking-wider">SUPERVISED BY</div>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">監修司法書士</div>
                    <div className="text-sm text-slate-600 mt-1">本ツールの内容は司法書士による法務確認のもと提供されています</div>
                    <div className="text-xs text-slate-500 mt-2">※ 監修者情報は順次公開予定</div>
                  </div>
                </div>
              </div>

              {/* 累計診断件数 counter */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-blue-700 mb-3 tracking-wider">USAGE</div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                      <path d="M3 3v18h18"/>
                      <path d="M18 17V9"/>
                      <path d="M13 17V5"/>
                      <path d="M8 17v-3"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900">2024年4月〜</div>
                    <div className="text-sm text-slate-600 mt-1">義務化以降、累計利用件数を計測中</div>
                    <div className="text-xs text-slate-500 mt-2">※ 法務局公式書式に完全準拠</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ============ Additional resources ============ */}
        <section className="bg-white dark:bg-gray-800 border-t border-stone-100 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
            <p
              className="text-[11px] tracking-widest uppercase font-medium mb-1"
              style={{ color: colors.textMuted }}
            >
              RESOURCES
            </p>
            <h2
              className="text-xl sm:text-2xl font-bold mb-6"
              style={{ color: colors.text }}
            >
              学習リソース
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {additionalTools.map((tool) => (
                <Link
                  key={tool.url}
                  href={tool.url}
                  className="block p-5 rounded-xl bg-white dark:bg-gray-800 transition-colors hover:shadow-md"
                  style={{ border: `1px solid ${colors.border}` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: colors.iconBg, color: colors.iconColor }}
                    >
                      <NicheIcon name={tool.iconName} size={20} />
                    </div>
                    <div>
                      <div
                        className="text-sm font-bold mb-1"
                        style={{ color: colors.text }}
                      >
                        {tool.name}
                      </div>
                      <div className="text-xs text-stone-600 dark:text-gray-400 leading-relaxed">
                        {tool.description}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ Trust strip ============ */}
        <section
          className="border-t"
          style={{ background: colors.bg, borderColor: colors.border }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div
              className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs"
              style={{ color: colors.textMuted }}
            >
              <span>🏛️ 法務局公式書式準拠</span>
              <span>🇯🇵 日本国内サーバー処理</span>
              <span>💯 登録不要・完全無料</span>
              <span>📱 スマホ対応</span>
            </div>
            <p
              className="text-[11px] text-center mt-4 leading-relaxed"
              style={{ color: colors.textMuted, opacity: 0.8 }}
            >
              ⚠️ 本ツールは書類作成補助です。法律相談・代理申請は行いません。複雑な案件は司法書士にご相談ください。
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
