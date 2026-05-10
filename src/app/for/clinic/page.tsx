import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "クリニック・士業向け 業務ツール集｜開業・経営・労務 | yamada-tools.jp",
  description:
    "クリニック・歯科・士業の経営者の方が必要なツールを集めました。開業損益分岐点、人件費率診断、医療スタッフ給与計算、介護報酬計算など、専門職向けの実務ツールをすべて無料で提供しています。",
  alternates: { canonical: "https://yamada-tools.jp/for/clinic" },
  openGraph: {
    title: "クリニック・士業向け 業務ツール集",
    description:
      "開業の損益分岐、スタッフ給与、医療報酬の計算まで。クリニック・歯科・士業向けの実務ツールを無料提供。",
    type: "website",
  },
};

interface ToolLink {
  name: string;
  url: string;
  desc: string;
}

const sections: { title: string; intro?: string; tools: ToolLink[] }[] = [
  {
    title: "クリニック経営・損益分析",
    tools: [
      { name: "クリニック損益分岐点・必要患者数シミュレーター", url: "/clinic/break-even-calculator", desc: "開業の損益分岐に必要な患者数を試算" },
      { name: "クリニック人件費率診断ツール", url: "/clinic/labor-cost-ratio-diagnosis", desc: "人件費率を業界平均と比較" },
      { name: "医療スタッフ給与計算機", url: "/clinic/medical-staff-payroll-calculator", desc: "夜勤・資格手当対応の給与計算" },
    ],
  },
  {
    title: "医療・介護報酬",
    tools: [
      { name: "介護報酬計算機", url: "/health/kaigo-hoshu-calculator", desc: "介護サービスの報酬概算" },
      { name: "整骨院・接骨院 療養費目安計算機", url: "/health/seikotsuin-ryoyohi-calculator", desc: "療養費の目安を算出" },
      { name: "ペット医療費計算機", url: "/health/doubutsu-iryo-calculator", desc: "動物病院の費用目安" },
      { name: "障害年金 受給額 簡易計算機", url: "/health/shogai-nenkin-calculator", desc: "障害年金の受給見込み額" },
    ],
  },
  {
    title: "法人情報・公的データ調査",
    tools: [
      { name: "法人検索 (gBizINFO)", url: "/business/houjin-search", desc: "会社名から法人の基本情報を検索" },
      { name: "法人財務情報", url: "/business/houjin-zaimu", desc: "売上高・利益・従業員数の推移" },
      { name: "法人認定情報", url: "/business/houjin-nintei", desc: "DX認定・健康経営優良法人など" },
      { name: "補助金検索 (Jグランツ)", url: "/business/hojokin-active", desc: "現在募集中の補助金を検索" },
      { name: "補助金履歴検索", url: "/business/hojokin-history", desc: "過去の交付決定実績を確認" },
    ],
  },
  {
    title: "法人税・労務・書類",
    tools: [
      { name: "法人税計算機", url: "/business/corporate-tax-calculator", desc: "法人税額の概算" },
      { name: "役員報酬最適化ツール", url: "/business/director-salary-optimizer", desc: "役員報酬の最適額を算出" },
      { name: "残業代計算機", url: "/finance/overtime-calculator", desc: "時間外手当を算出" },
      { name: "社会保険計算機", url: "/career/social-insurance-calculator", desc: "健康保険・厚生年金の保険料" },
      { name: "給与明細作成ツール", url: "/document/kyuyo-meisai", desc: "明細書をPDFで出力" },
      { name: "請求書作成", url: "/document/invoice", desc: "インボイス制度対応" },
      { name: "領収書作成", url: "/document/receipt", desc: "印紙税対応" },
    ],
  },
];

const faqItems = [
  {
    question: "新規開業の損益分岐点はどのように計算しますか？",
    answer:
      "月間の固定費（家賃・人件費・リース・借入返済）を1患者あたりの平均診療単価で割ると、損益分岐に必要な月間患者数が算出できます。yamada-tools.jpのクリニック損益分岐点シミュレーターで、これらの数値を入力するだけで自動計算されます。開業前の事業計画書作成にもご活用いただけます。",
  },
  {
    question: "クリニックの適正な人件費率はどのくらいですか？",
    answer:
      "一般的に医科クリニックは売上の40〜50%、歯科クリニックは35〜45%が目安とされます。yamada-tools.jpのクリニック人件費率診断ツールで、ご自身の人件費率を入力すると業界平均との比較が表示されます。50%を超える場合は経営見直しの検討が必要です。",
  },
  {
    question: "医療スタッフの給与計算で注意することは？",
    answer:
      "医療機関では夜勤手当、待機手当、各種資格手当、社会保険料（健康保険・厚生年金・雇用保険・労災）の計算が必要です。yamada-tools.jpの医療スタッフ給与計算機は、これらの医療現場特有の手当に対応しています。常勤・非常勤の切り替えも可能です。",
  },
  {
    question: "介護報酬・整骨院の療養費は本ツールで正確に計算できますか？",
    answer:
      "本ツールは介護報酬・整骨院の療養費の概算を提供するもので、最終的な保険請求には保険者・国保連の最新ガイドラインの確認が必要です。yamada-tools.jpの計算結果は、内部の損益試算・スタッフ説明用としてご活用ください。",
  },
  {
    question: "クリニックでも法人化のメリットはありますか？",
    answer:
      "一般的に医療法人化は年間所得2,000万円超で節税メリットが出始めますが、医療法人は配当禁止・剰余金分配制限など特殊な規制があります。yamada-tools.jpの法人税計算機・役員報酬最適化ツールは一般的な株式会社・合同会社想定です。医療法人化は税理士・行政書士へのご相談が必須です。",
  },
  {
    question: "補助金検索は医療機関も使えますか？",
    answer:
      "はい、yamada-tools.jpの補助金検索（Jグランツ）では、医療機関向けのDX化補助金、医療機器導入補助金、人材育成助成金など、業種を問わず幅広く検索できます。経済産業省 Jグランツの公開データを直接利用しています。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "クリニック・士業向け 業務ツール集",
  url: "https://yamada-tools.jp/for/clinic",
  description:
    "クリニック・歯科・士業向けに、開業損益分岐点・人件費率・医療報酬計算など実務に必要なツールを集めたページです。",
  isPartOf: {
    "@type": "WebSite",
    name: "yamada-tools.jp",
    url: "https://yamada-tools.jp",
  },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: sections.reduce((sum, s) => sum + s.tools.length, 0),
    itemListElement: sections.flatMap((s, si) =>
      s.tools.map((t, ti) => ({
        "@type": "ListItem",
        position: si * 20 + ti + 1,
        item: {
          "@type": "SoftwareApplication",
          name: t.name,
          url: "https://yamada-tools.jp" + t.url,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
        },
      }))
    ),
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function ClinicPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-kon py-12 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-white/70 mb-2">ホーム / 役割別 / クリニック・士業向け</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            クリニック・士業向け 業務ツール集
          </h1>
          <p className="text-white/80 text-base leading-relaxed">
            開業の損益分岐、スタッフの給与、各種医療報酬の計算まで。クリニック・歯科・士業の経営者の方が必要とするツールをまとめました。
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-12">

        {/* Use-case summary card */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">こんな業務に役立ちます</h2>
          <ul className="space-y-2 text-sumi text-sm">
            {[
              "クリニック開業の損益分岐点と必要患者数の計算",
              "スタッフ人件費率の診断と業界平均との比較",
              "医療スタッフの給与計算（夜勤・各種手当対応）",
              "介護報酬・整骨院療養費の概算計算",
              "法人税・役員報酬の最適化シミュレーション",
              "補助金・助成金の情報収集と請求書・給与明細の作成",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-kon font-bold mt-0.5">・</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tool sections */}
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{section.title}</h2>
            {section.intro && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{section.intro}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.tools.map((tool) => (
                <Link
                  key={tool.url}
                  href={tool.url}
                  className="flex flex-col gap-0.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 hover:border-kon hover:shadow-sm transition-all"
                >
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{tool.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{tool.desc}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">よくある質問</h2>
          <div className="space-y-4">
            {faqItems.map((f) => (
              <details key={f.question} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 group">
                <summary className="font-semibold text-kon cursor-pointer">{f.question}</summary>
                <p className="mt-3 text-sm text-sumi dark:text-gray-300 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related identity pages */}
        <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-4">他の役割別ページ</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "中小企業の経営者向け", href: "/for/keieisha" },
              { label: "フリーランス・個人事業主向け", href: "/for/freelance" },
              { label: "不動産・建設関係者向け", href: "/for/fudousan" },
              { label: "飲食店経営者向け", href: "/for/inshoku" },
              { label: "家族の生活・将来設計向け", href: "/for/kazoku" },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="text-sm text-kon hover:underline border border-kon/30 rounded-full px-4 py-1.5"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </section>

      </main>
    </>
  );
}
