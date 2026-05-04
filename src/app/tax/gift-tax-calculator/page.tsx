import Link from "next/link";
import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import GiftTaxCalculatorClient from "./GiftTaxCalculatorClient";

const tool = getToolById("gift-tax-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function GiftTaxCalculatorPage() {
  return (
    <>
      <GiftTaxCalculatorClient />
      <section className="max-w-4xl mx-auto px-4 py-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📊 よくある計算結果（早見表）
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          贈与税の速算表（令和7年/2025年）
        </p>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">一般贈与財産（兄弟姉妹・夫婦間など）</h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">基礎控除後の課税価格</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">税率</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">控除額</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["200万円以下", "10%", "—"],
                ["200万～300万円", "15%", "10万円"],
                ["300万～400万円", "20%", "25万円"],
                ["400万～600万円", "30%", "65万円"],
                ["600万～1,000万円", "40%", "125万円"],
                ["1,000万～1,500万円", "45%", "175万円"],
                ["1,500万～3,000万円", "50%", "250万円"],
                ["3,000万円超", "55%", "400万円"],
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
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">特例贈与財産（直系尊属から18歳以上の子・孫へ）</h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">基礎控除後の課税価格</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">税率</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">控除額</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["200万円以下", "10%", "—"],
                ["200万～400万円", "15%", "10万円"],
                ["400万～600万円", "20%", "30万円"],
                ["600万～1,000万円", "30%", "90万円"],
                ["1,000万～1,500万円", "40%", "190万円"],
                ["1,500万～3,000万円", "45%", "265万円"],
                ["3,000万～4,500万円", "50%", "415万円"],
                ["4,500万円超", "55%", "640万円"],
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
        <p className="text-xs text-gray-400 mt-3">
          ※概算です。実際の金額は個別の控除・条件により異なります。<br/>
          出典: 国税庁 No.4408 贈与税の計算と税率（令和7年/2025年）
        </p>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    
        {/* 関連ブログ記事 */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
          <Link
            href="/blog/zouyo-zei-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】贈与税はいくら？親からの援助・生前贈与の税金シミュレーション</p>
              <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
            </div>
          </Link>
        </div>
      </>
  );
}
