import Link from "next/link";
import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import UnemploymentCalculatorClient from "./UnemploymentCalculatorClient";

const tool = getToolById("unemployment-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function UnemploymentCalculatorPage() {
  return (
    <>
      <UnemploymentCalculatorClient />
      <section className="max-w-4xl mx-auto px-4 py-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📊 よくある計算結果（早見表）
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          失業保険（基本手当）の給付日数と給付率の早見表
        </p>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">給付日数（自己都合退職・一般受給資格者）</h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">被保険者期間</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">～10年</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">10～20年</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">20年以上</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["全年齢共通", "90日", "120日", "150日"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4 text-kon dark:text-gray-300">{row[1]}</td>
                  <td className="py-2 px-4 text-kon dark:text-gray-300">{row[2]}</td>
                  <td className="py-2 px-4 text-kon dark:text-gray-300">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">給付日数（会社都合退職・特定受給資格者）</h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">年齢/被保険者期間</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">～1年</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">1～5年</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">5～10年</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">10～20年</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">20年以上</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["30歳未満", "90日", "90日", "120日", "180日", "—"],
                ["30～34歳", "90日", "120日", "180日", "210日", "240日"],
                ["35～44歳", "90日", "150日", "180日", "240日", "270日"],
                ["45～59歳", "90日", "180日", "240日", "270日", "330日"],
                ["60～64歳", "90日", "150日", "180日", "210日", "240日"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4">{row[1]}</td>
                  <td className="py-2 px-4">{row[2]}</td>
                  <td className="py-2 px-4">{row[3]}</td>
                  <td className="py-2 px-4 text-kon dark:text-gray-300">{row[4]}</td>
                  <td className="py-2 px-4 text-kon dark:text-gray-300">{row[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">賃金日額別 基本手当日額</h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">賃金日額（離職前6ヶ月平均）</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">給付率</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">1日あたり基本手当</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["2,869円～5,200円", "80%", "2,295円～4,160円"],
                ["5,200円～12,790円", "80%～50%", "段階的"],
                ["12,790円～16,210円", "50%", "6,395円～8,105円"],
                ["16,210円超", "上限あり", "8,490円（60歳未満上限）"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4 text-kon dark:text-gray-300">{row[1]}</td>
                  <td className="py-2 px-4">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※概算です。実際の金額は個別の控除・条件により異なります。<br/>
          出典: 厚生労働省「雇用保険制度」（令和7年/2025年）
        </p>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    
        {/* 関連ブログ記事 */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
          <Link
            href="/blog/shitsugyou-hoken-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-kon hover:border-ai hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-50 group-hover:bg-ai flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-kon group-hover:text-ai">【2026年最新】失業保険はいくらもらえる？受給額・期間シミュレーション</p>
              <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
            </div>
          </Link>
        </div>
      </>
  );
}
