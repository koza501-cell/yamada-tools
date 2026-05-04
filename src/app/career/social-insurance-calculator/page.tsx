import Link from "next/link";
import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import SocialInsuranceCalculatorClient from "./SocialInsuranceCalculatorClient";

const tool = getToolById("social-insurance-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function SocialInsuranceCalculatorPage() {
  return (
    <>
      <SocialInsuranceCalculatorClient />
      {/* Direct Answer: 社会保険料早見表 */}
      <div className="max-w-4xl mx-auto px-4 mt-8 mb-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">月収別・社会保険料の目安（2026年・東京）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="py-3 px-4 text-left">月収（額面）</th>
                <th className="py-3 px-4 text-left">健康保険料（本人）</th>
                <th className="py-3 px-4 text-left">厚生年金（本人）</th>
                <th className="py-3 px-4 text-left">雇用保険</th>
                <th className="py-3 px-4 text-left">合計控除額</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["15万円", "約7,600円", "約13,700円", "約900円", "約22,200円"],
                ["20万円", "約10,200円", "約18,300円", "約1,200円", "約29,700円"],
                ["25万円", "約12,700円", "約22,900円", "約1,500円", "約37,100円"],
                ["30万円", "約15,200円", "約27,450円", "約1,800円", "約44,450円"],
                ["35万円", "約17,800円", "約32,000円", "約2,100円", "約51,900円"],
                ["40万円", "約20,300円", "約36,600円", "約2,400円", "約59,300円"],
                ["50万円", "約25,400円", "約45,750円", "約3,000円", "約74,150円"],
                ["60万円", "約30,500円", "約54,900円", "約3,600円", "約89,000円"],
              ].map(([salary, health, pension, employ, total]) => (
                <tr key={salary} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-bold">{salary}</td>
                  <td className="py-2 px-4">{health}</td>
                  <td className="py-2 px-4">{pension}</td>
                  <td className="py-2 px-4">{employ}</td>
                  <td className="py-2 px-4 font-bold text-teal-700">{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※協会けんぽ東京都2026年度保険料率（介護保険なし）で計算した目安。</p>
      </div>

      <section className="max-w-4xl mx-auto px-4 py-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📊 よくある計算結果（早見表）
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          社会保険料率（協会けんぽ・東京都・令和7年度/2025年）
        </p>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">保険料</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">料率（本人負担）</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">料率（会社負担）</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">合計</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["健康保険（40歳未満）", "4.99%", "4.99%", "9.98%"],
                ["健康保険（40歳以上・介護込）", "5.79%", "5.79%", "11.58%"],
                ["厚生年金", "9.15%", "9.15%", "18.30%"],
                ["雇用保険（一般）", "0.6%", "0.95%", "1.55%"],
                ["合計（40歳未満）", "約14.74%", "約15.09%", "約29.83%"],
                ["合計（40歳以上）", "約15.54%", "約15.89%", "約31.43%"],
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
          出典: 全国健康保険協会（協会けんぽ）・厚生労働省（令和7年/2025年・東京都基準）
        </p>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    
        {{/* 関連ブログ記事 */}}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
          <Link
            href="/blog/shakai-hoken-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】社会保険料の計算方法｜年収別早見表と手取り額</p>
              <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
            </div>
          </Link>
        </div>
      </>
  );
}
