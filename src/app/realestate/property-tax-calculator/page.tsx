import Link from "next/link";
import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import PropertyTaxCalculatorClient from "./PropertyTaxCalculatorClient";

const tool = getToolById("property-tax-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function PropertyTaxCalculatorPage() {
  return (
    <>
      <PropertyTaxCalculatorClient />
      <section className="max-w-4xl mx-auto px-4 py-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📊 よくある計算結果（早見表）
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          固定資産税の税率と計算例（東京23区基準）
        </p>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">税目</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">税率</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["固定資産税", "1.4%（標準税率）"],
                ["都市計画税", "0.3%（上限）"],
                ["合計（市街化区域）", "1.7%"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4 text-blue-600 dark:text-blue-400">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">住宅用地の課税標準特例</h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">土地区分</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">固定資産税の課税標準</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">都市計画税の課税標準</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["小規模住宅用地（200m²以下）", "評価額 × 1/6", "評価額 × 1/3"],
                ["一般住宅用地（200m²超）", "評価額 × 1/3", "評価額 × 2/3"],
                ["商業地・更地", "評価額（特例なし）", "評価額（特例なし）"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4 text-blue-600 dark:text-blue-400">{row[1]}</td>
                  <td className="py-2 px-4">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">評価額別年間税額シミュレーション（200m²以下の住宅用地）</h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">土地評価額</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">建物評価額</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">固定資産税（年）</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">都市計画税（年）</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">合計（年）</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1,500万円", "1,000万円", "約4.5万円", "約2万円", "約6.5万円"],
                ["2,500万円", "1,500万円", "約7万円", "約3万円", "約10万円"],
                ["3,500万円", "2,000万円", "約9.5万円", "約4万円", "約13.5万円"],
                ["5,000万円", "3,000万円", "約13.5万円", "約6万円", "約19.5万円"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4">{row[1]}</td>
                  <td className="py-2 px-4 text-blue-600 dark:text-blue-400">{row[2]}</td>
                  <td className="py-2 px-4">{row[3]}</td>
                  <td className="py-2 px-4">{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※概算です。実際の金額は個別の控除・条件により異なります。<br/>
          出典: 総務省「固定資産税」・東京都主税局（令和7年/2025年）
        </p>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    
        {{/* 関連ブログ記事 */}}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
          <Link
            href="/blog/kotei-shisanzei-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】固定資産税の計算方法｜新築・中古・土地別シミュレーション</p>
              <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
            </div>
          </Link>
        </div>
      </>
  );
}
