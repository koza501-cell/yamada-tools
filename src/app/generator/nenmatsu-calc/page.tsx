import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import NenmatsuClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("nenmatsu-calc")!;

const faq = [
  {
    question: "年末調整でお金が戻ってくるのはなぜ？",
    answer: "毎月の給与から概算で源泉徴収された所得税と、年間の正確な所得税額との差額が還付されます。生命保険料控除や扶養控除などを申告することで、払いすぎた税金が戻ってきます。",
  },
  {
    question: "還付金はいつ振り込まれますか？",
    answer: "通常、12月または翌年1月の給与と一緒に支払われます。会社によって時期が異なるため、詳しくは経理担当者にご確認ください。",
  },
  {
    question: "このシミュレーションの結果は正確ですか？",
    answer: "あくまで概算です。実際の還付金額は、会社での計算や税務署の判断により異なる場合があります。参考値としてご利用ください。",
  },
  {
    question: "生命保険料控除の上限はいくらですか？",
    answer: "新制度では、一般生命保険・介護医療保険・個人年金保険それぞれ最大4万円、合計12万円が上限です。",
  },
  {
    question: "住宅ローン控除は年末調整で受けられますか？",
    answer: "2年目以降は年末調整で受けられます。初年度のみ確定申告が必要です。",
  },
  {
    question: "配偶者控除と配偶者特別控除の違いは？",
    answer: "配偶者の年収が103万円以下なら配偶者控除（最大38万円）、103万円超〜201万円以下なら配偶者特別控除が適用されます。",
  },
  {
    question: "扶養控除はいくら？",
    answer: "一般の扶養親族は38万円、19〜22歳の特定扶養親族は63万円、70歳以上の老人扶養親族は48万円の控除が受けられます。",
  },
  {
    question: "年末調整と確定申告の違いは？",
    answer: "年末調整は会社が従業員に代わって行う税金の精算手続きです。医療費控除やふるさと納税などは、別途確定申告が必要です。",
  },
  {
    question: "パート・アルバイトでも年末調整できますか？",
    answer: "はい、扶養控除等申告書を会社に提出していれば、パート・アルバイトでも年末調整の対象になります。",
  },
  {
    question: "転職した場合の年末調整は？",
    answer: "前職の源泉徴収票を現在の会社に提出すれば、現在の会社でまとめて年末調整してもらえます。",
  },
];

const seoContent = {
  intro: "「年末調整でいくら戻ってくる？」——毎年気になる還付金額を、このシミュレーターで簡単計算。生命保険料控除、扶養控除、住宅ローン控除など、各種控除を入力するだけで、おおよその還付金額がわかります。",
  useCases: [
    { title: "💰 還付金の予測", desc: "年末のボーナス計画の参考に" },
    { title: "📝 控除漏れチェック", desc: "申告し忘れている控除がないか確認" },
    { title: "🏠 住宅ローン控除", desc: "ローン控除の効果をシミュレーション" },
    { title: "👨‍👩‍👧‍👦 扶養控除", desc: "家族構成による控除額を確認" },
  ],
  tips: "生命保険料の控除証明書は10月頃届きます。届いたら金額をメモしておくと、年末調整の書類作成がスムーズです。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】年末調整計算｜還付金シミュレーター",
  tool,
  longDescription: "年末調整の還付金をシミュレーション。生命保険料控除、扶養控除、住宅ローン控除に対応。簡単入力で還付金額の目安がわかる無料ツール。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ["年末調整 計算", "年末調整 還付金", "年末調整 シミュレーション", "還付金 いくら", "生命保険料控除", "扶養控除 計算"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function NenmatsuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NenmatsuClient faq={faq} seoContent={seoContent} />
      {/* Direct Answer: 還付金の目安 */}
      <section className="max-w-4xl mx-auto px-4 mt-8 mb-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">年末調整 還付金の目安（控除別）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-kon text-white">
                <th className="py-3 px-4 text-left">控除の種類</th>
                <th className="py-3 px-4 text-left">控除額（上限）</th>
                <th className="py-3 px-4 text-left">年収400万の節税額目安</th>
                <th className="py-3 px-4 text-left">年収600万の節税額目安</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["生命保険料控除（一般）", "最大4万円", "約4,000円", "約8,000円"],
                ["生命保険料控除（医療）", "最大4万円", "約4,000円", "約8,000円"],
                ["生命保険料控除（年金）", "最大4万円", "約4,000円", "約8,000円"],
                ["地震保険料控除", "最大5万円", "約5,000円", "約10,000円"],
                ["配偶者控除（103万以下）", "最大38万円", "約38,000円", "約76,000円"],
                ["扶養控除（一般）", "38万円/人", "約38,000円/人", "約76,000円/人"],
                ["住宅ローン控除", "最大35万円/年", "最大35万円直接控除", "最大35万円直接控除"],
              ].map(([name, limit, tax400, tax600]) => (
                <tr key={name} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium">{name}</td>
                  <td className="py-2 px-4">{limit}</td>
                  <td className="py-2 px-4 text-kon">{tax400}</td>
                  <td className="py-2 px-4 text-kon">{tax600}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※所得税率10%・20%で概算。実際の還付額は詳細な所得計算が必要です。</p>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
