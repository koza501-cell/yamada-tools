import Link from "next/link";
import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import IncomeTaxCalculatorClient from "./IncomeTaxCalculatorClient";

const tool = getToolById("income-tax-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function IncomeTaxCalculatorPage() {
  return (
    <>
      <IncomeTaxCalculatorClient />
      <section className="max-w-4xl mx-auto px-4 py-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📊 よくある計算結果（早見表）
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          課税所得金額に対する所得税額の早見表（令和7年/2025年分・速算表ベース）
        </p>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">課税所得金額</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">税率</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">控除額</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">所得税額（概算）</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["195万円以下", "5%", "0円", "課税所得 × 5%"],
                ["195万～330万円", "10%", "97,500円", "課税所得 × 10% − 97,500"],
                ["330万～695万円", "20%", "427,500円", "課税所得 × 20% − 427,500"],
                ["695万～900万円", "23%", "636,000円", "課税所得 × 23% − 636,000"],
                ["900万～1,800万円", "33%", "1,536,000円", "課税所得 × 33% − 1,536,000"],
                ["1,800万～4,000万円", "40%", "2,796,000円", "課税所得 × 40% − 2,796,000"],
                ["4,000万円超", "45%", "4,796,000円", "課税所得 × 45% − 4,796,000"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4 text-kon dark:text-gray-300">{row[1]}</td>
                  <td className="py-2 px-4">{row[2]}</td>
                  <td className="py-2 px-4">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3">年収別の所得税額目安（独身・2025年）</h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">年収</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">課税所得（目安）</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">所得税額（概算）</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["300万円", "約105万円", "約52,500円"],
                ["500万円", "約227万円", "約129,500円"],
                ["700万円", "約386万円", "約344,500円"],
                ["1,000万円", "約629万円", "約831,500円"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4">{row[1]}</td>
                  <td className="py-2 px-4 text-kon dark:text-gray-300">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※概算です。実際の金額は個別の控除・条件により異なります。復興特別所得税（2.1%）は含まず。<br/>
          出典: 国税庁 No.2260 所得税の税率（令和7年/2025年）
        </p>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    
        {/* 関連ブログ記事 */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
          <Link
            href="/blog/shotokuzei-keisan-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-kon hover:border-ai hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-50 group-hover:bg-ai flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-kon group-hover:text-ai">【2026年最新】所得税の計算方法｜年収別早見表と手取り額シミュレーション</p>
              <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
            </div>
          </Link>
        </div>
      </>
  );
}
