import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "家族の生活・将来設計向け 計算機・シミュレーター | yamada-tools.jp",
  description:
    "家計・住宅・教育・保険・相続まで、家族の生活と将来設計に必要な計算機・シミュレーターを集めました。住宅ローン、教育費、ふるさと納税、保険、相続税、葬儀費用など、すべて無料でご利用いただけます。",
  alternates: { canonical: "https://yamada-tools.jp/for/kazoku" },
  openGraph: {
    title: "家族の生活・将来設計向け 計算機・シミュレーター",
    description:
      "家計・住宅・教育・保険・相続まで。家族の生活と将来設計に必要な計算機を無料提供。",
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
    title: "家計・節約",
    tools: [
      { name: "家計簿 貯蓄シミュレーター", url: "/life/kakeibo-simulator", desc: "毎月の収支と貯蓄目標を管理" },
      { name: "引越し費用 見積もり計算機", url: "/life/hikkoshi-hiyou-calculator", desc: "荷物量・距離から引越し費用を試算" },
      { name: "引越し費用計算機", url: "/realestate/moving-cost-calculator", desc: "引越し費用の目安を確認" },
      { name: "ふるさと納税計算機", url: "/tax/furusato-nozei-calculator", desc: "自己負担2,000円で済む寄付上限額" },
    ],
  },
  {
    title: "住宅・賃貸",
    tools: [
      { name: "住宅ローン計算機", url: "/finance/jutaku-loan", desc: "月々の返済額と総返済額を試算" },
      { name: "賃貸vs購入シミュレーター", url: "/realestate/rent-vs-buy", desc: "生涯コストを比較" },
      { name: "不動産取得税計算機", url: "/realestate/acquisition-tax", desc: "取得税の概算を算出" },
      { name: "固定資産税計算機", url: "/realestate/property-tax-calculator", desc: "年間の固定資産税を試算" },
      { name: "家賃計算機", url: "/realestate/rental-cost-calculator", desc: "年収から適正家賃を算出" },
    ],
  },
  {
    title: "教育・子育て",
    tools: [
      { name: "教育費シミュレーター", url: "/education/education-cost-simulator", desc: "幼稚園〜大学の総額を試算" },
      { name: "塾費用計算機", url: "/education/cram-school-calculator", desc: "学年・通塾数から月謝を算出" },
      { name: "学習塾・習い事 月謝計算機", url: "/education/juku-ryokin-calculator", desc: "習い事の年間費用をまとめて計算" },
      { name: "偏差値計算機", url: "/education/deviation-score", desc: "テストの点数から偏差値を算出" },
      { name: "資格ROI計算機", url: "/education/certification-roi", desc: "資格取得の費用対効果を試算" },
      { name: "保育料・幼稚園費用 無償化判定計算機", url: "/health/hoikuryo-calculator", desc: "無償化の対象かを判定" },
      { name: "出産予定日計算機", url: "/health/pregnancy-calculator", desc: "最終月経日から出産予定日を計算" },
    ],
  },
  {
    title: "老後・年金・資産形成",
    tools: [
      { name: "老後資金シミュレーター", url: "/finance/retirement-simulator", desc: "老後の必要資金を試算" },
      { name: "年金 受給額 シミュレーター", url: "/finance/nenkin-simulator", desc: "将来の年金受給額を確認" },
      { name: "新NISAシミュレーター", url: "/finance/nisa-simulator", desc: "新NISA制度での資産形成" },
      { name: "iDeCo vs NISA 比較", url: "/finance/ideco-nisa-comparison", desc: "節税効果を比較" },
      { name: "iDeCo・NISA 節税効果計算機", url: "/finance/ideco-nisa-calculator", desc: "控除額・運用益を試算" },
    ],
  },
  {
    title: "健康・生活",
    tools: [
      { name: "BMI計算機", url: "/health/bmi-calculator", desc: "身長・体重からBMIを算出" },
      { name: "カロリー計算機", url: "/health/calorie-calculator", desc: "1日の必要カロリーを計算" },
      { name: "適正体重計算機", url: "/health/ideal-weight-calculator", desc: "身長から適正体重を算出" },
      { name: "睡眠計算機", url: "/health/sleep-calculator", desc: "起床時間から就寝時間を逆算" },
      { name: "アルコール計算機", url: "/health/alcohol-calculator", desc: "純アルコール量と分解時間を計算" },
    ],
  },
  {
    title: "借金・保険・相続",
    tools: [
      { name: "借金返済シミュレーター", url: "/debt/repayment-simulator", desc: "完済までの期間と総支払額を試算" },
      { name: "リボ払い計算機", url: "/debt/revolving-calculator", desc: "リボ払いの実質コストを可視化" },
      { name: "ローン利息計算機", url: "/debt/loan-interest-calculator", desc: "借入額・金利・期間から利息を計算" },
      { name: "借金診断ツール", url: "/debt/debt-diagnosis", desc: "返済困難度を診断" },
      { name: "債務整理チェッカー", url: "/debt/debt-restructuring-checker", desc: "おまとめ・任意整理・破産の選択肢を確認" },
      { name: "生命保険必要額計算機", url: "/insurance/life-insurance-calculator", desc: "必要保障額の目安を算出" },
      { name: "医療保険シミュレーター", url: "/insurance/medical-insurance-sim", desc: "入院日数・手術から給付額を試算" },
      { name: "相続税計算機", url: "/tax/inheritance-tax-calculator", desc: "相続税の概算を算出" },
      { name: "相続税 簡易シミュレーター", url: "/finance/sozokuzei-simulator", desc: "財産総額と相続人数から試算" },
      { name: "贈与税計算機", url: "/tax/gift-tax-calculator", desc: "贈与税額の概算を算出" },
      { name: "葬儀費用 見積もり計算機", url: "/life/sougi-calculator", desc: "葬儀の規模から費用の目安を算出" },
    ],
  },
];

const faqItems = [
  {
    question: "住宅ローンの返済額はどうやって決めますか？",
    answer:
      "一般的に手取り月収の20〜25%以内が安心とされます。yamada-tools.jpの住宅ローン計算機で、借入額・金利・返済期間を入力すると、毎月の返済額と総返済額が即座に確認できます。賃貸vs購入シミュレーターと組み合わせれば、賃貸との生涯コスト比較も可能です。",
  },
  {
    question: "ふるさと納税はいくらまでお得ですか？",
    answer:
      "年収・家族構成・他の控除によって上限額が変わります。yamada-tools.jpのふるさと納税計算機で、年収・配偶者控除・扶養人数を入力すると、自己負担2,000円で済む寄付上限額の目安が算出できます。複数自治体への寄付計画にご活用ください。",
  },
  {
    question: "子供1人の教育費はいくらかかりますか？",
    answer:
      "一般的に幼稚園から大学卒業まで、すべて公立で約1,000万円、すべて私立で約2,500万円が目安です。yamada-tools.jpの教育費シミュレーターで、進学計画（公立/私立）・大学（国立/私立）・習い事費用を入力すると、卒業までの総額を試算できます。",
  },
  {
    question: "NISA・iDeCoはどちらを優先すべき？",
    answer:
      "一般的に、まずiDeCoで節税（所得控除）、余力があればNISAで運用枠を増やすのが基本戦略です。yamada-tools.jpのiDeCo vs NISA 比較ツールで、年収・運用期間別に節税効果を比較できます。iDeCoは60歳まで引き出せない点、NISAは引き出し自由な点も考慮が必要です。",
  },
  {
    question: "親が亡くなった時、相続税はどのくらいかかりますか？",
    answer:
      "基礎控除（3,000万円 + 600万円 × 法定相続人数）以下なら相続税はかかりません。yamada-tools.jpの相続税計算機・相続税 簡易シミュレーターで、財産総額と相続人数を入力すると概算が確認できます。実際の申告には税理士へのご相談が必須です。",
  },
  {
    question: "借金・リボ払いの返済はどうすれば楽になりますか？",
    answer:
      "まず現状把握が重要です。yamada-tools.jpの借金返済シミュレーター・リボ払い計算機で、現在の借入残高・金利・返済額を入力すると、完済までの期間と総支払額が算出できます。yamada-tools.jpの債務整理チェッカーで、おまとめローン・任意整理・自己破産の選択肢の検討も可能です。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "家族の生活・将来設計向け 計算機・シミュレーター",
  url: "https://yamada-tools.jp/for/kazoku",
  description:
    "家族向けに、住宅・教育・老後・借金・相続など生活と将来設計に必要なツールを集めたページです。",
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

export default function KazokuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-kon py-12 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-white/70 mb-2">ホーム / 役割別 / 家族の生活・将来設計向け</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            家族の生活・将来設計向け 計算機・シミュレーター
          </h1>
          <p className="text-white/80 text-base leading-relaxed">
            家計・住宅・教育・保険・相続まで。家族の毎日の生活と将来設計に必要な計算機・シミュレーターをまとめました。
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-12">

        {/* Use-case summary card */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">こんなシーンで役立ちます</h2>
          <ul className="space-y-2 text-sumi text-sm">
            {[
              "住宅ローンの月額・総額シミュレーションと賃貸vs購入の比較",
              "ふるさと納税の上限額と節税効果の確認",
              "子供の幼稚園から大学までの教育費の試算",
              "老後資金・年金・NISA・iDeCoの将来設計",
              "借金・リボ払いの返済計画と債務整理の検討",
              "相続税・贈与税・葬儀費用の概算計算",
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
              { label: "クリニック・士業向け", href: "/for/clinic" },
              { label: "不動産・建設関係者向け", href: "/for/fudousan" },
              { label: "飲食店経営者向け", href: "/for/inshoku" },
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
