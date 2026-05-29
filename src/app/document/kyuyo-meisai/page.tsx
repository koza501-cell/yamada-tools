import { Metadata } from "next";
import KyuyoClient from "./client";
import { AdUnit } from "@/components/common/AdUnit";
import { LazyFAQ } from "@/components/common/LazyFAQ";

const faq = [
  {
    question: "給与明細はExcelで作成しても法的に問題ありませんか？",
    answer: "問題ありません。労働基準法は給与明細の交付を義務付けていますが、形式は紙・PDF・電子データのいずれでも有効です。Excelで作成しても、所得税法第231条で定める「支給額」「控除額」「差引支給額」が明記されていれば法的要件を満たします。本ツールは法令準拠のPDF出力が可能です。",
  },
  {
    question: "給与明細に必須項目は何ですか？",
    answer: "所得税法・社会保険諸法令により、(1)氏名、(2)支給期間、(3)支給日、(4)基本給・各種手当の内訳、(5)控除額の内訳（健康保険・厚生年金・雇用保険・源泉所得税・住民税）、(6)差引支給額の記載が必要です。本ツールは全ての必須項目を自動で含めます。",
  },
  {
    question: "社会保険料の計算ロジックは2026年の最新版ですか？",
    answer: "はい。健康保険料率・厚生年金保険料率・雇用保険料率は2026年4月時点の最新料率を反映しています。料率は都道府県（健保）や年度により変動するため、定期的にアップデートしています。協会けんぽ・組合健保いずれにも対応可能です。",
  },
  {
    question: "個人事業主が外注先に給与明細を発行する必要はありますか？",
    answer: "業務委託契約の外注先には給与明細の交付義務はありません。代わりに「支払調書」または「報酬支払明細書」を発行します。本ツールは雇用契約の従業員向けですが、フォーマットを応用して外注先向けの支払明細としても利用可能です。",
  },
  {
    question: "給与明細はいつまで保存する必要がありますか？",
    answer: "労働基準法施行規則により、雇用主は給与に関する書類を3年間保存する義務があります（労働基準法第109条）。電子データでの保存も可能です。電子帳簿保存法の要件を満たすには、改ざん防止措置とタイムスタンプが推奨されます。本ツールで作成したPDFはそのまま保管できます。",
  },
  {
    question: "残業代の計算式が分かりません。本ツールで自動計算できますか？",
    answer: "はい。法定時間外労働は通常賃金の25%増し、法定休日労働は35%増し、深夜労働（22:00〜5:00）は25%増しが法定です。本ツールに残業時間を入力すれば、これら割増率を自動適用して計算します。月60時間超の時間外は50%増しの選択も可能です。",
  },
  {
    question: "1人の事業主でも給与明細を作る必要がありますか？",
    answer: "個人事業主が自分自身に「給与」を支払うことはできません（事業主は給与所得者ではないため）。ただし、家族を専従者として雇用する場合や、法人化して自分が役員になる場合は給与明細の発行が必要です。クラス分け（給与所得者か個人事業主か）の判定は税理士に相談してください。",
  },
  {
    question: "給与明細の発行はオンラインで完結できますか？",
    answer: "はい。本ツールはブラウザ上で全処理が完結し、入力データは外部送信されません。生成したPDFは社内チャット・メール・クラウドストレージで従業員に共有できます。電子化された給与明細でも法的有効性は維持されます。",
  },
];

export const metadata: Metadata = {
  title: "給与明細作成ツール【無料・登録不要・PDF出力】社会保険料・所得税自動計算 | 山田ツール",
  description: "基本給を入力するだけで健康保険・厚生年金・雇用保険・所得税を自動計算。都道府県別保険料率2026年度対応。美しいA4明細をPDF出力。完全無料・登録不要。",
  keywords: ["給与明細 作成 無料", "給与明細 自動計算", "社会保険料 計算 自動", "健康保険料 都道府県別", "源泉徴収 所得税 計算", "給与明細 PDF 出力", "標準報酬月額 計算"],
  alternates: { canonical: "https://yamada-tools.jp/document/kyuyo-meisai" },
  openGraph: {
    title: "給与明細作成ツール【無料・登録不要・PDF出力】",
    description: "基本給を入力するだけで社会保険料・所得税を自動計算。美しいA4給与明細をPDF出力。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "給与明細作成ツール",
      "url": "https://yamada-tools.jp/document/kyuyo-meisai",
      "description": "社会保険料・所得税を自動計算してA4給与明細をPDF出力できる無料ツール。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "書類作成", "item": "https://yamada-tools.jp/document" },
        { "@type": "ListItem", "position": 3, "name": "給与明細作成ツール", "item": "https://yamada-tools.jp/document/kyuyo-meisai" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": faq.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    }
  ]
};

export default function KyuyoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KyuyoClient />
      <AdUnit slot="5612038947" format="horizontal" />

      {/* Educational Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-kon dark:text-gray-100 mb-6">給与明細の基本 — 何を記載すべきか</h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            給与明細は労働基準法第108条により雇用主に交付義務がある書類です。法的要件として、
            所得税法施行規則第100条で「支給額の内訳」「控除額の内訳」「差引支給額」の明記が求められます。
            本ツールは全ての法定要件を満たすPDF出力に対応しています。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">本ツールで自動計算される項目</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 mb-6">
            <li><strong>支給項目：</strong>基本給、役職手当、通勤手当、残業手当、休日手当、深夜手当</li>
            <li><strong>控除項目：</strong>健康保険料、厚生年金保険料、雇用保険料、源泉所得税、住民税</li>
            <li><strong>残業計算：</strong>法定時間外25%増、休日労働35%増、深夜労働25%増</li>
            <li><strong>差引支給額：</strong>支給合計から控除合計を自動計算</li>
            <li><strong>PDF出力：</strong>会社名・ロゴ入りの正式フォーマット</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">こんな場面で使われています</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 mb-6">
            <li><strong>従業員5〜30名の中小企業</strong>で月次給与明細を内製化</li>
            <li><strong>クリニック・歯科医院</strong>でパート従業員の給与明細を毎月作成</li>
            <li><strong>飲食店・小売店</strong>でアルバイト向けの明細を発行</li>
            <li><strong>士業事務所</strong>でスタッフの給与明細を効率化</li>
            <li><strong>建設業の協力会社</strong>で職人さんへの明細を統一フォーマットで発行</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">保存・電子化の運用</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            労働基準法施行規則第56条により、給与に関する書類は<strong>3年間の保存義務</strong>があります。
            電子データでの保存も認められており、本ツールで作成したPDFはクラウドストレージや
            社内ファイルサーバーで安全に保管できます。電子帳簿保存法の対応も視野に、
            タイムスタンプ・改ざん防止措置を併用するのが望ましいです。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">給与計算の関連法令</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            最新の社会保険料率・所得税源泉徴収税額表は毎年更新されます。本ツールは2026年4月時点の
            最新料率を反映していますが、税制改正・料率改定があった場合は速やかにアップデートします。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-kon dark:text-gray-100 mb-6">よくある質問（FAQ）</h2>
        <LazyFAQ faq={faq} />
      </section>
    </>
  );
}
