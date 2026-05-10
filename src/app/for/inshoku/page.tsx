import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "飲食店経営者向け 業務ツール集｜原価率・栄養成分・収益計算 | yamada-tools.jp",
  description:
    "飲食店経営者の方向けに、メニュー原価率計算、栄養成分表示、フードロスコスト、給与計算、補助金検索など、飲食店の経営に必要なツールをすべて無料で提供しています。",
  alternates: { canonical: "https://yamada-tools.jp/for/inshoku" },
  openGraph: {
    title: "飲食店経営者向け 業務ツール集",
    description:
      "メニュー原価率・栄養成分表示・フードロスコスト・補助金検索まで。飲食店経営に必要なツールを無料提供。",
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
    title: "飲食店の経営計算",
    tools: [
      { name: "飲食店 メニュー原価率計算機", url: "/food/genka-calculator", desc: "メニューごとの原価率と利益を計算" },
      { name: "食品 栄養成分表示 計算機", url: "/food/nutrition-label-calculator", desc: "熱量・たんぱく質・脂質・塩分を算出" },
      { name: "フードロス コスト計算機", url: "/food/foodloss-calculator", desc: "廃棄コストの月間・年間損失を可視化" },
    ],
  },
  {
    title: "スタッフ・給与・労務",
    tools: [
      { name: "給与手取り計算機", url: "/finance/net-salary-calculator", desc: "額面から手取り額を計算" },
      { name: "給与明細作成ツール", url: "/document/kyuyo-meisai", desc: "明細書をPDFで出力" },
      { name: "残業代計算機", url: "/finance/overtime-calculator", desc: "時間外手当を算出" },
      { name: "社会保険計算機", url: "/career/social-insurance-calculator", desc: "健康保険・厚生年金の保険料" },
    ],
  },
  {
    title: "法人情報・補助金・書類",
    tools: [
      { name: "法人検索 (gBizINFO)", url: "/business/houjin-search", desc: "会社名から法人の基本情報を検索" },
      { name: "法人番号検索・確認ツール", url: "/business/houjin-bangou-lookup", desc: "13桁の法人番号を確認・検証" },
      { name: "補助金検索 (Jグランツ)", url: "/business/hojokin-active", desc: "現在募集中の補助金を検索" },
      { name: "法人税計算機", url: "/business/corporate-tax-calculator", desc: "法人税額の概算" },
      { name: "請求書作成", url: "/document/invoice", desc: "インボイス制度対応" },
      { name: "領収書作成", url: "/document/receipt", desc: "印紙税対応" },
    ],
  },
];

const faqItems = [
  {
    question: "飲食店の原価率はどのくらいが適正ですか？",
    answer:
      "業態によって異なりますが、一般的に飲食店全体の理想原価率は30%前後とされます。居酒屋・カフェは25〜30%、ラーメン店・定食屋は30〜35%、寿司・高級店は40%以上もあります。yamada-tools.jpの原価率計算機でメニューごとに原価率を算出し、価格設定の見直しに活用できます。",
  },
  {
    question: "食品の栄養成分表示は義務ですか？",
    answer:
      "食品表示法により、容器包装された加工食品は栄養成分表示が義務化されています。飲食店の店内提供メニューは原則対象外ですが、テイクアウト・販売を行う場合は表示が必要なケースがあります。yamada-tools.jpの栄養成分表示計算機で、原材料から熱量・たんぱく質・脂質・炭水化物・食塩相当量を自動算出できます。",
  },
  {
    question: "フードロスはどの程度コストに影響しますか？",
    answer:
      "飲食店のフードロス率は仕入額の5〜10%が目安と言われ、利益を直接圧迫します。yamada-tools.jpのフードロス コスト計算機で、廃棄量と仕入価格を入力すると、月間・年間の損失額が算出できます。発注量の見直し・メニュー改廃の判断材料にご活用ください。",
  },
  {
    question: "飲食店向けの補助金はありますか？",
    answer:
      "経済産業省 Jグランツには、飲食店向けの設備導入補助金、DX化補助金、衛生環境整備助成金など多数掲載されています。yamada-tools.jpの補助金検索ツールで「飲食」「外食」「フードサービス」などのキーワードで検索できます。地方自治体の独自補助金もあわせてご確認ください。",
  },
  {
    question: "アルバイトの給与計算はどうすればいい？",
    answer:
      "yamada-tools.jpの給与手取り計算機・残業代計算機で、時給ベースの月給・残業代・社会保険料の概算を算出できます。給与明細作成ツールでPDFの明細を発行すれば、紙の明細書としてそのまま渡すこともできます。学生バイトの扶養範囲（103万円・130万円の壁）も別ツールで確認可能です。",
  },
  {
    question: "飲食店の法人化はいつ検討すべき？",
    answer:
      "個人経営の飲食店が法人化を検討するタイミングは、所得が800万円〜1,000万円を超える頃が一般的です。yamada-tools.jpの法人税計算機で節税効果と社会保険負担を比較できます。複数店舗展開を計画されている場合は早期の法人化も有効です。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "飲食店経営者向け 業務ツール集",
  url: "https://yamada-tools.jp/for/inshoku",
  description:
    "飲食店経営者向けに、原価率・栄養成分・フードロス・補助金・給与計算など経営に必要なツールを集めたページです。",
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

export default function InshokuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-kon py-12 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-white/70 mb-2">ホーム / 役割別 / 飲食店経営者向け</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            飲食店経営者向け 業務ツール集
          </h1>
          <p className="text-white/80 text-base leading-relaxed">
            メニューの原価率、栄養成分表示、フードロスのコスト、補助金検索まで。飲食店経営に必要な実務ツールをまとめました。
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-12">

        {/* Use-case summary card */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">こんな業務に役立ちます</h2>
          <ul className="space-y-2 text-sumi text-sm">
            {[
              "メニューの原価率計算と価格設定の見直し",
              "食品の栄養成分表示の自動計算",
              "フードロスによるコストの把握と損失の可視化",
              "アルバイト・スタッフの給与計算と明細発行",
              "補助金・助成金の情報収集と申請支援",
              "請求書・領収書などの書類をPDFで無料作成",
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
