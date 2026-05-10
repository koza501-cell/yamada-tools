import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "個人事業主・フリーランス向け 業務ツール集｜確定申告・インボイス・請求書 | yamada-tools.jp",
  description:
    "個人事業主・フリーランスの方の日常業務に必要なツールを集めました。確定申告、インボイス、請求書、給与シミュレーション、節税ツールなど、すべて無料で公的データに基づく信頼性の高い情報を提供しています。",
  alternates: { canonical: "https://yamada-tools.jp/for/freelance" },
  openGraph: {
    title: "個人事業主・フリーランス向け 業務ツール集",
    description:
      "確定申告・インボイス・請求書・節税まで、個人事業主・フリーランスに必要なツールを無料提供。",
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
    title: "確定申告・税金計算",
    tools: [
      { name: "フリーランス税金計算機", url: "/business/freelance-tax-calculator", desc: "所得税・住民税・国保の概算" },
      { name: "副業 確定申告 必要判定ツール", url: "/finance/fukugyou-shinkoku-checker", desc: "申告要否を自動判定" },
      { name: "副業税金計算機", url: "/career/side-income-tax-calculator", desc: "副業所得の税額を算出" },
      { name: "医療費控除 計算機", url: "/finance/iryouhi-koujo-calculator", desc: "医療費控除の還付額を試算" },
      { name: "配偶者控除・配偶者特別控除", url: "/finance/haigusha-kojo-calculator", desc: "控除額の確認と所得制限チェック" },
      { name: "扶養控除 判定・計算ツール", url: "/finance/fuyou-koujo-checker", desc: "扶養に入れるか判定" },
    ],
  },
  {
    title: "インボイス・適格請求書",
    tools: [
      { name: "インボイス番号検証", url: "/generator/t-number", desc: "適格請求書発行事業者の確認" },
      { name: "インボイス登録 損益判定", url: "/finance/invoice-soneki-calculator", desc: "登録要否のシミュレーション" },
      { name: "簡易課税計算機", url: "/business/simplified-tax-calculator", desc: "簡易課税制度の納税額" },
      { name: "請求書作成", url: "/document/invoice", desc: "インボイス制度対応" },
      { name: "領収書作成", url: "/document/receipt", desc: "印紙税対応" },
    ],
  },
  {
    title: "単価・収入のシミュレーション",
    tools: [
      { name: "フリーランス 適正単価・年収診断ツール", url: "/business/freelance-tanka-calculator", desc: "希望年収から必要単価を逆算" },
      { name: "年収交渉ツール", url: "/career/salary-negotiation", desc: "交渉材料を整理" },
      { name: "給与手取り計算機", url: "/finance/net-salary-calculator", desc: "額面から手取り額を計算" },
      { name: "残業代計算機", url: "/finance/overtime-calculator", desc: "時間外手当を算出" },
      { name: "年収の壁シミュレーター", url: "/finance/nennshu-kabe-simulator", desc: "手取りへの影響を確認" },
      { name: "年収の壁チェッカー", url: "/career/income-wall-checker", desc: "103万・130万の壁を判定" },
    ],
  },
  {
    title: "法人化・節税の検討",
    tools: [
      { name: "個人事業主 法人化 節税シミュレーター", url: "/finance/hojinka-simulator", desc: "法人化後の節税額を試算" },
      { name: "法人化シミュレーター", url: "/business/incorporation-simulator", desc: "個人事業から法人化の損益" },
      { name: "減価償却計算機", url: "/finance/depreciation-calculator", desc: "定額法・定率法の計算" },
    ],
  },
  {
    title: "老後・年金・将来設計",
    tools: [
      { name: "老後資金シミュレーター", url: "/finance/retirement-simulator", desc: "老後の必要資金を試算" },
      { name: "年金 受給額 シミュレーター", url: "/finance/nenkin-simulator", desc: "将来の年金受給額を確認" },
      { name: "iDeCo vs NISA 比較", url: "/finance/ideco-nisa-comparison", desc: "節税効果を比較" },
      { name: "iDeCo・NISA 節税効果計算機", url: "/finance/ideco-nisa-calculator", desc: "控除額・運用益を試算" },
      { name: "新NISAシミュレーター", url: "/finance/nisa-simulator", desc: "新NISA制度での資産形成" },
    ],
  },
  {
    title: "書類作成・その他",
    tools: [
      { name: "見積書作成", url: "/document/quotation", desc: "PDFで保存・印刷" },
      { name: "納品書作成", url: "/document/delivery-slip", desc: "取引先への納品書" },
      { name: "送付状作成", url: "/document/cover-letter", desc: "ビジネス文書のカバーレター" },
      { name: "ビジネスメール作成", url: "/document/business-email", desc: "定型ビジネスメールを生成" },
      { name: "電子印鑑作成", url: "/generator/hanko", desc: "PDF・書類に押せる印鑑画像" },
      { name: "フリマ仕入れ利益計算機", url: "/business/furima-profit-calculator", desc: "仕入れ・送料込みの利益を計算" },
    ],
  },
];

const faqItems = [
  {
    question: "フリーランスの確定申告はいつ・どのように行いますか？",
    answer:
      "毎年2月16日から3月15日までの期間に、前年の所得を税務署に申告します。yamada-tools.jpのフリーランス税金計算機で年間の所得税・住民税・国保・国民年金の概算を確認できます。実際の申告には税理士へのご相談、またはfreee・マネーフォワード等の確定申告ソフトの利用をおすすめします。",
  },
  {
    question: "インボイス登録は本当に必要ですか？",
    answer:
      "取引先が課税事業者か免税事業者か、自分の年商規模、業種によって判断が分かれます。yamada-tools.jpのインボイス登録 損益判定ツールで、登録した場合・しなかった場合の損益を比較できます。1,000万円以下の免税事業者の方は、必ず登録前にシミュレーションすることをおすすめします。",
  },
  {
    question: "個人事業主から法人化するメリット・タイミングは？",
    answer:
      "一般的に年間所得800万円〜1,000万円を超えると、法人化による節税効果が出始めます。yamada-tools.jpの個人事業主 法人化 節税シミュレーターで、現在の所得から法人化後の納税額を試算できます。社会保険料・役員報酬の設定も考慮した損益試算が可能です。",
  },
  {
    question: "副業の確定申告はいくらから必要ですか？",
    answer:
      "給与所得者の場合、副業所得が年間20万円を超えると確定申告が必要です。yamada-tools.jpの副業 確定申告 必要判定ツールで、ご自身の状況を入力するだけで申告要否を判定できます。20万円以下でも住民税の申告は必要なため、自治体への申告も忘れずに。",
  },
  {
    question: "年収の壁とは何ですか？",
    answer:
      "配偶者の扶養に入っている方が、自身の年収によって税金・社会保険料の負担が大きく変わる境界線のことです。103万円、106万円、130万円、150万円など複数の壁があります。yamada-tools.jpの年収の壁シミュレーターで、希望年収における手取り額を確認できます。",
  },
  {
    question: "請求書や領収書のテンプレートを無料で使えますか？",
    answer:
      "はい、yamada-tools.jpでは請求書作成・領収書作成・見積書作成のすべてが無料でご利用いただけます。インボイス制度に対応した適格請求書フォーマットで、PDFとして保存・印刷可能です。登録不要・データ保存なしで、その場で作成できます。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "個人事業主・フリーランス向け 業務ツール集",
  url: "https://yamada-tools.jp/for/freelance",
  description:
    "個人事業主・フリーランス向けに、確定申告・インボイス・請求書・節税など日常業務に必要なツールを集めたページです。",
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

export default function FreelancePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-kon py-12 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-white/70 mb-2">ホーム / 役割別 / 個人事業主・フリーランス向け</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            個人事業主・フリーランス向け 業務ツール集
          </h1>
          <p className="text-white/80 text-base leading-relaxed">
            確定申告・インボイス・請求書・節税まで。個人事業主・フリーランスの方が必要とするツールを業務別にまとめました。すべて無料で利用できます。
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-12">

        {/* Use-case summary card */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">こんな業務に役立ちます</h2>
          <ul className="space-y-2 text-sumi text-sm">
            {[
              "確定申告と税金の概算計算（所得税・住民税・国保・国民年金）",
              "インボイス制度への対応判定と適格請求書の作成",
              "フリーランスの適正単価・希望年収のシミュレーション",
              "個人事業主から法人化した場合の節税効果の試算",
              "老後資金・年金・NISAの将来設計シミュレーション",
              "請求書・見積書・領収書などの書類を無料作成",
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
              { label: "クリニック・士業向け", href: "/for/clinic" },
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
