import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import SalaryCalcClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("salary-calc")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "計算結果は正確ですか？", answer: "概算値です。実際の金額は会社の規定や自治体によって異なります。" },
];

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】給与計算｜手取り額シミュレーション",
  tool,
  longDescription: "額面給与から手取り額を計算。社会保険料、所得税、住民税の概算を確認できます。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['給与計算', '手取り 計算', '年収 手取り', '社会保険料 計算'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SalaryCalcClient />
      {/* Direct Answer: 手取り早見表 */}
      <section className="max-w-4xl mx-auto px-4 mt-8 mb-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">年収別・手取り額の目安（2026年・会社員）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="py-3 px-4 text-left">年収（額面）</th>
                <th className="py-3 px-4 text-left">社会保険料（年）</th>
                <th className="py-3 px-4 text-left">所得税（年）</th>
                <th className="py-3 px-4 text-left">住民税（年）</th>
                <th className="py-3 px-4 text-left">手取り（年）</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["200万円", "約28万円", "約2万円", "約6万円", "約164万円"],
                ["300万円", "約43万円", "約5万円", "約11万円", "約241万円"],
                ["400万円", "約57万円", "約11万円", "約17万円", "約315万円"],
                ["500万円", "約71万円", "約19万円", "約23万円", "約387万円"],
                ["600万円", "約86万円", "約31万円", "約31万円", "約452万円"],
                ["700万円", "約100万円", "約49万円", "約39万円", "約512万円"],
                ["800万円", "約113万円", "約66万円", "約47万円", "約574万円"],
                ["1000万円", "約136万円", "約113万円", "約65万円", "約686万円"],
              ].map(([income, ins, it, res, takehome]) => (
                <tr key={income} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-bold">{income}</td>
                  <td className="py-2 px-4 text-kon">{ins}</td>
                  <td className="py-2 px-4 text-danger">{it}</td>
                  <td className="py-2 px-4 text-kon">{res}</td>
                  <td className="py-2 px-4 font-bold text-green-700">{takehome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※独身・給与所得者の概算。実際の金額は扶養・各種控除により異なります。</p>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
