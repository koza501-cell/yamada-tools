import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import TaxCalculatorClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("tax-calculator")!;

const faq = [
  { question: "軽減税率にも対応していますか？", answer: "はい、10%と8%の両方に対応しています。" },
  { question: "端数処理はどうなりますか？", answer: "切り捨て、切り上げ、四捨五入を選択できます。" },
  { question: "複数の金額を一度に計算できますか？", answer: "1つずつの計算となります。合計は手動で計算してください。" },
];

const seoContent = {
  intro: "税込価格から税抜価格、税抜価格から税込価格を計算。10%と8%（軽減税率）に対応しています。",
  useCases: [
    { title: "🛒 買い物", desc: "税込/税抜価格の確認" },
    { title: "📝 見積作成", desc: "消費税額の計算" },
    { title: "🧾 経理処理", desc: "仕入の税額計算" },
    { title: "🍽️ 軽減税率", desc: "8%適用商品の計算" },
  ],
  tips: "飲食料品（外食除く）と新聞は軽減税率8%が適用されます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】税金計算｜消費税・所得税計算",
  tool,
  longDescription: "税込価格から税抜価格、税抜価格から税込価格を計算。10%と8%（軽減税率）に対応しています。",
  keywords: ['消費税計算', '税込 税抜', '消費税 計算機', '10% 計算', '8% 計算'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TaxCalculatorClient faq={faq} />
      {/* Direct Answer: よくある計算結果 */}
      <section className="max-w-4xl mx-auto px-4 mt-8 mb-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">よくある消費税計算結果（10%）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="py-3 px-4 text-left">税抜価格</th>
                <th className="py-3 px-4 text-left">消費税（10%）</th>
                <th className="py-3 px-4 text-left">税込価格</th>
                <th className="py-3 px-4 text-left">消費税（8%・軽減）</th>
                <th className="py-3 px-4 text-left">税込（8%）</th>
              </tr>
            </thead>
            <tbody>
              {[
                [100, 10, 110, 8, 108],
                [500, 50, 550, 40, 540],
                [1000, 100, 1100, 80, 1080],
                [3000, 300, 3300, 240, 3240],
                [5000, 500, 5500, 400, 5400],
                [10000, 1000, 11000, 800, 10800],
                [30000, 3000, 33000, 2400, 32400],
                [50000, 5000, 55000, 4000, 54000],
                [100000, 10000, 110000, 8000, 108000],
              ].map(([ex, t10, inc10, t8, inc8]) => (
                <tr key={ex} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4">{ex.toLocaleString()}円</td>
                  <td className="py-2 px-4 text-danger">+{t10.toLocaleString()}円</td>
                  <td className="py-2 px-4 font-bold">{inc10.toLocaleString()}円</td>
                  <td className="py-2 px-4 text-kon">+{t8.toLocaleString()}円</td>
                  <td className="py-2 px-4 font-bold">{inc8.toLocaleString()}円</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
