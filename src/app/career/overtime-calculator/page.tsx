import Link from "next/link";
import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import OvertimeCalculatorClient from "./OvertimeCalculatorClient";

const tool = getToolById("overtime-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function OvertimeCalculatorPage() {
  return (
    <>
      <OvertimeCalculatorClient />
      <section className="max-w-4xl mx-auto px-4 py-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📊 よくある計算結果（早見表）
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          残業代の割増率と時給ベースの計算例（労働基準法準拠）
        </p>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">労働区分</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">割増率</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["平日残業（月60時間以下）", "25%以上"],
                ["平日残業（月60時間超）", "50%以上（中小企業含む）"],
                ["休日労働（法定休日）", "35%以上"],
                ["深夜労働（22時～5時）", "25%以上"],
                ["深夜＋残業（22時以降の残業）", "50%以上（25+25）"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4 text-blue-600 dark:text-blue-400">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">時給別残業代1時間あたり</h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">時給</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">通常残業（125%）</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">深夜残業（150%）</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">法定休日（135%）</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1,000円", "1,250円", "1,500円", "1,350円"],
                ["1,500円", "1,875円", "2,250円", "2,025円"],
                ["2,000円", "2,500円", "3,000円", "2,700円"],
                ["2,500円", "3,125円", "3,750円", "3,375円"],
                ["3,000円", "3,750円", "4,500円", "4,050円"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4 text-blue-600 dark:text-blue-400">{row[1]}</td>
                  <td className="py-2 px-4">{row[2]}</td>
                  <td className="py-2 px-4">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※概算です。実際の金額は個別の控除・条件により異なります。<br/>
          出典: 厚生労働省「労働基準法第37条 割増賃金」（令和7年/2025年）
        </p>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    
        {/* 関連ブログ記事 */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
          <Link
            href="/blog/zangyoudai-keisan-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】残業代の計算方法｜時給換算・割増率・未払い請求まで</p>
              <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
            </div>
          </Link>
        </div>
      </>
  );
}
