import Link from "next/link";
import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import LifeInsuranceCalculatorClient from "./LifeInsuranceCalculatorClient";

const tool = getToolById("life-insurance-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function LifeInsuranceCalculatorPage() {
  return (
    <>
      <LifeInsuranceCalculatorClient />
      <section className="max-w-4xl mx-auto px-4 py-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📊 よくある計算結果（早見表）
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          家族構成別の必要生命保険額の目安
        </p>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">家族構成</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">子の年齢</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">推奨保険金額</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">月額保険料目安（30代）</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["独身", "—", "200～500万円（葬儀費用）", "1,000～2,000円"],
                ["夫婦のみ（共働き）", "—", "500～1,000万円", "2,000～3,000円"],
                ["子1人（未就学児）", "0～6歳", "2,500～3,500万円", "3,000～5,000円"],
                ["子1人（小学生）", "7～12歳", "2,000～3,000万円", "3,000～5,000円"],
                ["子2人（未就学児）", "0～6歳", "3,500～5,000万円", "5,000～8,000円"],
                ["子2人（小中学生）", "7～15歳", "3,000～4,000万円", "4,000～6,000円"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4">{row[1]}</td>
                  <td className="py-2 px-4 text-blue-600 dark:text-blue-400">{row[2]}</td>
                  <td className="py-2 px-4">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-sm mt-4">
          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">必要保障額の計算式</p>
          <p className="text-gray-600 dark:text-gray-300">必要保障額 = （遺族の生活費 + 教育費 + 住居費）− （遺族年金 + 配偶者収入 + 預貯金）</p>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※概算です。実際の金額は個別の控除・条件により異なります。<br/>
          出典: 公益財団法人 生命保険文化センター「生活保障に関する調査（令和7年）」
        </p>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    
        {/* 関連ブログ記事 */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
          <Link
            href="/blog/seimei-hoken-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】生命保険の必要保障額｜家族構成別の目安</p>
              <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
            </div>
          </Link>
        </div>
      </>
  );
}
