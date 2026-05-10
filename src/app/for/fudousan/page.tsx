import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "不動産・建設関係者向け 業務ツール集｜物件調査・経審・収益計算 | yamada-tools.jp",
  description:
    "不動産業・建設業の事業者向けに、用途地域チェック、ハザードマップ、地価、取引価格、経審P点、駐車場・民泊収益計算など、業務に必要なツールをすべて無料で提供しています。国土交通省の公的データに直結しています。",
  alternates: { canonical: "https://yamada-tools.jp/for/fudousan" },
  openGraph: {
    title: "不動産・建設関係者向け 業務ツール集",
    description:
      "物件調査・経審P点・収益計算まで。不動産業・建設業の実務に必要なツールを国土交通省データで無料提供。",
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
    title: "物件・立地の調査",
    intro: "国土交通省「不動産情報ライブラリ」のAPIを直接利用しています。",
    tools: [
      { name: "用途地域チェッカー", url: "/realestate/yoto-chiiki-checker", desc: "建ぺい率・容積率を確認" },
      { name: "ハザードマップチェッカー", url: "/realestate/hazard-checker", desc: "洪水・土砂・地震リスクを確認" },
      { name: "地価チェッカー", url: "/realestate/land-price", desc: "公示地価・基準地価・路線価" },
      { name: "不動産取引価格チェッカー", url: "/realestate/transaction-price", desc: "国交省の取引事例を検索" },
      { name: "学区チェッカー", url: "/realestate/school-district", desc: "住所から学区を確認" },
      { name: "人口推計チェッカー", url: "/realestate/population", desc: "エリアの人口動態を確認" },
    ],
  },
  {
    title: "不動産取引・税金",
    tools: [
      { name: "賃貸vs購入シミュレーター", url: "/realestate/rent-vs-buy", desc: "生涯コストを比較" },
      { name: "賃貸 vs 購入 比較", url: "/realestate/chintai-vs-kounyu", desc: "トータルコストの詳細比較" },
      { name: "不動産取得税計算機", url: "/realestate/acquisition-tax", desc: "取得税の概算を算出" },
      { name: "固定資産税計算機", url: "/realestate/property-tax-calculator", desc: "年間の固定資産税を試算" },
      { name: "不動産 仲介手数料計算機", url: "/realestate/chukaishusuryocalculator", desc: "売買・賃貸の仲介手数料" },
      { name: "引越し費用計算機", url: "/realestate/moving-cost-calculator", desc: "引越し費用の目安" },
    ],
  },
  {
    title: "不動産投資・収益事業",
    tools: [
      { name: "駐車場収益計算機", url: "/realestate/parking-revenue-calculator", desc: "月極・コインパーキングの収益" },
      { name: "太陽光発電 投資回収シミュレーター", url: "/realestate/solar-simulator", desc: "FIT制度での回収年数を試算" },
      { name: "民泊・Airbnb 収益計算機", url: "/business/minpaku-calculator", desc: "180日制限対応の収益試算" },
      { name: "軽貨物・運送業 運賃計算機", url: "/business/unchin-calculator", desc: "距離・重量別の運賃目安" },
    ],
  },
  {
    title: "建設業の専門ツール",
    tools: [
      { name: "経審P点計算機【建設業】", url: "/business/keishin-calculator", desc: "総合評定値の概算を確認" },
      { name: "建設業 法定福利費計算機", url: "/business/hofuku-calculator", desc: "見積書に明示する法定福利費" },
      { name: "建設・内装工事 材料費見積もり計算機", url: "/business/kensetsu-mitsumori-calculator", desc: "工事材料費の概算見積もり" },
    ],
  },
];

const faqItems = [
  {
    question: "物件の用途地域・ハザードマップはどこから情報を取得していますか？",
    answer:
      "yamada-tools.jpの不動産情報ツールは、国土交通省「不動産情報ライブラリ」のAPIを直接利用しています。住所を入力するだけで、用途地域、建ぺい率、容積率、洪水・土砂・地震ハザード、地価、取引事例まで即座に確認できます。情報源は国土交通省・国土地理院です。",
  },
  {
    question: "経審P点とは何ですか？",
    answer:
      "経営事項審査（経審）で算出される総合評定値です。公共工事の入札参加資格を決める指標で、経営状況・経営規模・技術力・社会性などを点数化したものです。yamada-tools.jpの経審P点計算機で、各項目を入力するだけでP点の概算を確認できます。",
  },
  {
    question: "民泊事業の収益はどのくらい見込めますか？",
    answer:
      "立地・物件タイプ・運営方法によって大きく異なります。yamada-tools.jpの民泊・Airbnb 収益計算機で、宿泊単価・稼働率・運営コストを入力すると、月間・年間の手取り収益を試算できます。住宅宿泊事業法の180日制限にも対応しています。",
  },
  {
    question: "太陽光発電の投資回収期間はどのくらい？",
    answer:
      "現行のFIT/FIP制度・売電単価では、住宅用で約10〜12年、産業用で約12〜15年が目安です。yamada-tools.jpの太陽光発電 投資回収シミュレーターで、設置費用・発電量・売電単価を入力すると、年間収支と回収年数を自動計算します。",
  },
  {
    question: "取引価格・地価データはどこまで信頼できますか？",
    answer:
      "国土交通省「不動産情報ライブラリ」が公開している正規データを使用しています。実際の取引価格（国交省への報告ベース）、地価公示・基準地価・路線価が含まれます。ただし、最新の市場価格や個別物件の評価には、不動産業者・鑑定士へのご相談が必要です。",
  },
  {
    question: "建設業の法定福利費の計算は本ツールで完結しますか？",
    answer:
      "yamada-tools.jpの建設業 法定福利費計算機は、見積書に明示すべき法定福利費（健康保険・厚生年金・雇用保険・労災・建退共）の概算を算出します。実際の積算には国交省ガイドラインの最新版確認が必要です。発注者への提出書類の事前準備にご活用ください。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "不動産・建設関係者向け 業務ツール集",
  url: "https://yamada-tools.jp/for/fudousan",
  description:
    "不動産業・建設業向けに、物件調査・経審P点・収益計算など実務に必要なツールを集めたページです。国土交通省の公的データを直接活用しています。",
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

export default function FudousanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-kon py-12 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-white/70 mb-2">ホーム / 役割別 / 不動産・建設関係者向け</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            不動産・建設関係者向け 業務ツール集
          </h1>
          <p className="text-white/80 text-base leading-relaxed">
            物件の用途地域・ハザード・地価から、建設業の経審P点、駐車場・民泊の収益計算まで。不動産業・建設業の実務に必要なツールをまとめました。国土交通省の公的データを直接活用しています。
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-12">

        {/* Use-case summary card */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">こんな業務に役立ちます</h2>
          <ul className="space-y-2 text-sumi text-sm">
            {[
              "物件の用途地域・ハザードマップ・地価の調査（国土交通省データ）",
              "不動産取引価格・学区・人口推計の確認",
              "不動産取得税・固定資産税・仲介手数料の計算",
              "駐車場・太陽光・民泊の収益シミュレーション",
              "建設業経審P点の概算と法定福利費の計算",
              "工事材料費の見積もり計算",
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
