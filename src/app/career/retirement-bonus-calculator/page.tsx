import Link from "next/link";
import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import RetirementBonusCalculatorClient from "./RetirementBonusCalculatorClient";

const tool = getToolById("retirement-bonus-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function RetirementBonusCalculatorPage() {
  return (
    <>
      <RetirementBonusCalculatorClient />
      {/* Direct Answer: 退職金早見表 */}
      <div className="max-w-4xl mx-auto px-4 mt-8 mb-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">勤続年数別・退職金相場（大企業・大卒）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="py-3 px-4 text-left">勤続年数</th>
                <th className="py-3 px-4 text-left">定年退職（相場）</th>
                <th className="py-3 px-4 text-left">自己都合退職（相場）</th>
                <th className="py-3 px-4 text-left">退職所得控除額</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["10年", "—", "約100〜200万円", "200万円"],
                ["15年", "—", "約200〜350万円", "350万円"],
                ["20年", "約500〜800万円", "約300〜500万円", "800万円"],
                ["25年", "約800〜1,200万円", "約500〜800万円", "1,150万円"],
                ["30年", "約1,500〜2,000万円", "約800〜1,200万円", "1,500万円"],
                ["35年", "約2,000〜2,500万円", "約1,000〜1,500万円", "1,850万円"],
                ["40年（定年）", "約2,000〜3,000万円", "—", "2,200万円"],
              ].map(([years, teinen, jiko, deduction]) => (
                <tr key={years} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-bold">{years}</td>
                  <td className="py-2 px-4">{teinen}</td>
                  <td className="py-2 px-4">{jiko}</td>
                  <td className="py-2 px-4 text-purple-600">{deduction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※厚生労働省「就労条件総合調査」をもとにした目安。会社の規定・業種により大きく異なります。</p>
      </div>

      <section className="max-w-4xl mx-auto px-4 py-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📊 よくある計算結果（早見表）
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          退職金の税制優遇（退職所得控除額）
        </p>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">勤続年数</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">退職所得控除額の計算式</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["20年以下", "40万円 × 勤続年数（最低80万円）"],
                ["20年超", "800万円 + 70万円 × （勤続年数 - 20年）"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{row[0]}</td>
                  <td className="py-2 px-4 text-blue-600 dark:text-blue-400">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">勤続年数別退職所得控除額の例（退職金1,000万円の場合）</h3>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">勤続年数</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">控除額</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200">退職金1,000万円の課税対象</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["10年", "400万円", "(1000−400)÷2 = 300万円"],
                ["20年", "800万円", "(1000−800)÷2 = 100万円"],
                ["25年", "1,150万円", "0円（非課税）"],
                ["30年", "1,500万円", "0円（非課税）"],
                ["35年", "1,850万円", "0円（非課税）"],
                ["40年", "2,200万円", "0円（非課税）"],
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
          出典: 国税庁 No.1420 退職所得控除（令和7年/2025年）
        </p>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    
        {/* 関連ブログ記事 */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
          <Link
            href="/blog/taishokukin-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】退職金の計算方法と相場｜勤続年数別シミュレーション</p>
              <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
            </div>
          </Link>
        </div>
      </>
  );
}
