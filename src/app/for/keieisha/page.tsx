import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "中小企業の経営者向け 業務ツール集｜法人検索・補助金・給与計算・請求書 | yamada-tools.jp",
  description:
    "中小企業の経営者の方が日常業務で必要なツールを集めました。法人検索、補助金検索、給与計算、請求書作成、入札情報、法人税計算など、すべて無料で利用できます。公的データに基づく信頼性の高い情報を提供しています。",
  alternates: { canonical: "https://yamada-tools.jp/for/keieisha" },
  openGraph: {
    title: "中小企業の経営者向け 業務ツール集",
    description:
      "法人検索・補助金・給与計算・請求書など、中小企業の経営者向けの業務ツールを無料で提供しています。",
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
    title: "取引先・法人情報の調査",
    intro: "経済産業省 gBizINFO と国税庁の公開データを直接活用しています。",
    tools: [
      { name: "法人検索 (gBizINFO)", url: "/business/houjin-search", desc: "会社名から法人の基本情報を検索" },
      { name: "法人番号検索・確認ツール", url: "/business/houjin-bangou-lookup", desc: "13桁の法人番号を確認・検証" },
      { name: "法人名×法人番号 クロス検証", url: "/business/houjin-cross-verify", desc: "取引先のKYC・反社チェックに" },
      { name: "法人財務情報", url: "/business/houjin-zaimu", desc: "売上高・利益・従業員数の推移" },
      { name: "入札・調達情報", url: "/business/houjin-nyusatsu", desc: "公共調達の落札実績を確認" },
      { name: "法人認定情報", url: "/business/houjin-nintei", desc: "DX認定・健康経営優良法人など" },
    ],
  },
  {
    title: "補助金・助成金",
    intro: "経済産業省 Jグランツの公開データを使用しています。",
    tools: [
      { name: "補助金検索 (Jグランツ)", url: "/business/hojokin-active", desc: "現在募集中の補助金を検索" },
      { name: "補助金履歴検索", url: "/business/hojokin-history", desc: "過去の交付決定実績を確認" },
    ],
  },
  {
    title: "給与・社会保険・労務",
    tools: [
      { name: "給与手取り計算機", url: "/finance/net-salary-calculator", desc: "額面から手取り額を計算" },
      { name: "給与明細作成ツール", url: "/document/kyuyo-meisai", desc: "明細書をPDFで出力" },
      { name: "残業代計算機", url: "/finance/overtime-calculator", desc: "時間外手当を算出" },
      { name: "社会保険計算機", url: "/career/social-insurance-calculator", desc: "健康保険・厚生年金の保険料" },
      { name: "退職金計算機", url: "/career/retirement-bonus-calculator", desc: "退職所得控除を含む計算" },
      { name: "年末調整計算", url: "/generator/nenmatsu-calc", desc: "年末調整の所得税額を算出" },
      { name: "建設業 法定福利費計算機", url: "/business/hofuku-calculator", desc: "建設業の法定福利費を算出" },
    ],
  },
  {
    title: "法人税・会計",
    tools: [
      { name: "法人税計算機", url: "/business/corporate-tax-calculator", desc: "法人税額の概算" },
      { name: "簡易課税計算機", url: "/business/simplified-tax-calculator", desc: "簡易課税制度の納税額" },
      { name: "減価償却計算機", url: "/finance/depreciation-calculator", desc: "定額法・定率法の計算" },
      { name: "インボイス番号検証", url: "/generator/t-number", desc: "適格請求書発行事業者の確認" },
      { name: "インボイス登録 損益判定", url: "/finance/invoice-soneki-calculator", desc: "登録要否のシミュレーション" },
      { name: "法人化シミュレーター", url: "/business/incorporation-simulator", desc: "個人事業から法人化の損益" },
      { name: "役員報酬最適化ツール", url: "/business/director-salary-optimizer", desc: "役員報酬の最適額を算出" },
    ],
  },
  {
    title: "請求書・見積書・領収書などの書類作成",
    tools: [
      { name: "請求書作成", url: "/document/invoice", desc: "インボイス制度対応" },
      { name: "見積書作成", url: "/document/quotation", desc: "PDFで保存・印刷" },
      { name: "領収書作成", url: "/document/receipt", desc: "印紙税対応" },
      { name: "納品書作成", url: "/document/delivery-slip", desc: "取引先への納品書" },
      { name: "送付状作成", url: "/document/cover-letter", desc: "ビジネス文書のカバーレター" },
      { name: "FAX送付状作成", url: "/document/fax-cover", desc: "FAX送信用のかがみ" },
      { name: "ビジネスメール作成", url: "/document/business-email", desc: "定型ビジネスメールを生成" },
      { name: "名刺作成", url: "/document/business-card", desc: "印刷用名刺データを作成" },
      { name: "封筒印刷・宛名印刷", url: "/generator/envelope-print", desc: "CSV一括印刷対応" },
      { name: "電子印鑑作成", url: "/generator/hanko", desc: "PDF・書類に押せる印鑑画像" },
    ],
  },
  {
    title: "銀行振込・データ変換",
    tools: [
      { name: "全銀フォーマット変換", url: "/convert/bank-format", desc: "総合振込のFBデータ作成" },
      { name: "和暦・西暦変換", url: "/convert/date-converter", desc: "令和・平成・西暦の相互変換" },
      { name: "ふりがな変換", url: "/convert/furigana", desc: "漢字をひらがな・カタカナに" },
    ],
  },
  {
    title: "市場・人口データ",
    tools: [
      { name: "都道府県別 平均年収検索", url: "/finance/heikin-nenshu", desc: "地域別の給与水準を確認" },
      { name: "都道府県別 人口推移", url: "/finance/jinko-suikei", desc: "市場規模の将来予測" },
      { name: "外国人採用 ビザ費用計算機", url: "/business/gaikokujin-visa-calculator", desc: "在留資格別の費用" },
    ],
  },
];

const faqItems = [
  {
    question: "yamada-tools.jpはどのような中小企業に向いていますか？",
    answer:
      "1人会社から従業員50名規模までの中小企業の経営者・事務担当者を主な対象としています。法人検索や補助金検索、給与計算、請求書作成など、日常業務に必要なツールを200種類以上提供しています。すべて無料でご利用いただけます。",
  },
  {
    question: "法人検索や補助金検索のデータはどこから来ていますか？",
    answer:
      "経済産業省 gBizINFO、経済産業省 Jグランツ、国税庁 法人番号公表サイトなど、すべて公的機関が公開している正規のAPIを直接利用しています。データの最新性・正確性は元APIに準拠します。",
  },
  {
    question: "請求書や給与明細を作成する際、データは保存されますか？",
    answer:
      "基本的に処理はご利用者のブラウザ内で完結します。サーバー側で一時保管が必要なファイルも、60分後に自動削除されます。個人情報・取引先情報の長期保存は行っていません。詳細はセキュリティ情報のページで公開しています。",
  },
  {
    question: "法人税や役員報酬の計算結果は税務申告に使えますか？",
    answer:
      "本ツールの計算結果は概算であり、実際の税務申告にはご利用いただけません。個別の状況に応じた正確な税額は、税理士・会計士にご相談ください。本ツールは事前検討・社内検討用としてご活用ください。",
  },
  {
    question: "従業員の給与明細を発行できますか？",
    answer:
      "はい、給与明細作成ツールで複数従業員の明細をまとめて作成できます。所得税・社会保険料・住民税の自動計算に対応しています。封筒印刷・宛名印刷ツールと組み合わせれば、CSV一括で郵送準備まで完結します。",
  },
  {
    question: "サブスクリプションプランはありますか？",
    answer:
      "基本機能はすべて無料でご利用いただけます。利用回数の多い方や、広告のない快適な利用環境をご希望の法人のお客様向けに、サブスクリプションプランをご用意しています。1人会社からでも導入できる価格帯です。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "中小企業の経営者向け 業務ツール集",
  url: "https://yamada-tools.jp/for/keieisha",
  description:
    "中小企業の経営者向けに、法人検索・補助金・給与計算・請求書作成など日常業務に必要なツールを集めたページです。",
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

export default function KeieishaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-kon py-12 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-white/70 mb-2">ホーム / 役割別 / 中小企業の経営者向け</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            中小企業の経営者向け 業務ツール集
          </h1>
          <p className="text-white/80 text-base leading-relaxed">
            日々の経営判断と事務作業をスムーズに。法人取引先の調査、補助金の検索、給与計算、請求書の作成まで、中小企業の経営者の方が必要とするツールをまとめました。すべて公的データに基づく信頼性の高い情報です。
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-12">

        {/* Use-case summary card */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">こんな業務に役立ちます</h2>
          <ul className="space-y-2 text-sumi text-sm">
            {[
              "新規取引先の信用調査（法人検索・財務情報・入札実績の確認）",
              "補助金・助成金の情報収集と申請前シミュレーション",
              "従業員の給与計算・社会保険料の算出・給与明細の発行",
              "請求書・見積書・領収書の作成とPDF出力",
              "法人税・インボイス制度・役員報酬の事前試算",
              "総合振込用の全銀フォーマットデータの作成",
              "市場・人口データを使った出店エリアや採用の検討",
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
              { label: "フリーランス・個人事業主向け", href: "/for/freelance" },
              { label: "不動産オーナー向け", href: "/for/fudousan" },
              { label: "クリニック経営者向け", href: "/for/clinic" },
              { label: "飲食店経営者向け", href: "/for/inshoku" },
              { label: "家族向け", href: "/for/kazoku" },
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
