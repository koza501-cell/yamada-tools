'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================
// Inline SVG Icons
// ============================================================
const Icons = {
  Calculator: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  AlertTriangle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  ArrowDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  ),
};

// ============================================================
// Constants — 2026年度概算 (東京都・協会けんぽ)
// ============================================================

// 国民年金 月額 (2026年度)
const KOKUMIN_NENKIN_MONTHLY = 17510;

// 国保料率 (東京都区部の概算 — 所得割のみ簡略化)
// 医療分 + 支援金分 + 介護分(40歳以上)
const KOKUHO_RATE_UNDER40 = 0.1135; // 医療7.13% + 支援金2.57% + 均等割按分1.45%
const KOKUHO_RATE_40PLUS = 0.1395; // 上記 + 介護2.6%
const KOKUHO_KINTOUWARI = 66600; // 均等割(1人分) 医療+支援金
const KOKUHO_KAIGO_KINTOU = 17400; // 均等割(介護分)
const KOKUHO_CAP_UNDER40 = 880000 + 280000; // 医療89万+支援金29万 = 上限合計
const KOKUHO_CAP_40PLUS = 880000 + 280000 + 240000; // + 介護24万

// 協会けんぽ 1等級 (月額報酬 58,000円 — 63,000円未満で適用)
// 東京都 2026年度概算
const KENPO_1_UNDER40_HALF = 2903; // 健康保険 本人負担 (約5.0% × 58,000)
const KENPO_1_40PLUS_HALF = 3383; // 健康保険 本人負担 + 介護
const KOUSEI_NENKIN_1_HALF = 16104; // 厚生年金 本人負担 (9.15% × 報酬月額上限?)
// 実際は標準報酬月額88,000円(1等級) × 9.15% = 8,052... 
// 正確な1等級: 標準報酬月額 88,000円
const HYOUJUN_HOUSHU_1 = 88000;
const KENPO_RATE_TOKYO = 0.09980; // 健康保険料率 東京都 2026
const KAIGO_RATE = 0.01600; // 介護保険料率
const KOUSEI_NENKIN_RATE = 0.18300; // 厚生年金保険料率

// 法人維持費 (最低限)
const HOUJIN_KINTOUWARI = 70000; // 法人住民税均等割
const KAIKEI_SOFT = 2680 * 12; // 会計ソフト年額
const TOUKIBO_ETC = 3600; // 登記簿等

function formatYen(n: number): string {
  return '\u00a5' + Math.round(n).toLocaleString('ja-JP');
}

// ============================================================
// Types
// ============================================================
interface ComparisonResult {
  // 個人事業主のみ
  kokuhoYearly: number;
  kokuminNenkinYearly: number;
  kojinTotalInsurance: number;

  // マイクロ法人 二刀流
  kenpoYearly: number; // 会社+本人の合計
  kouseiNenkinYearly: number; // 会社+本人の合計
  microInsuranceTotal: number;
  houjinIjihi: number; // 法人維持費
  zeirishiCost: number;
  microTotalCost: number; // 社保+維持費

  // 差額
  insuranceSaving: number; // 社会保険料の差
  netSaving: number; // 維持費差し引き後の実質節約額
  isWorth: boolean;

  // inputs echo
  shotoku: number;
  age: string;
  dependents: number;
  useZeirishi: boolean;
}

// ============================================================
// Main Component
// ============================================================
export default function MicroHoujinClient() {
  const [mounted, setMounted] = useState(false);
  const [shotoku, setShotoku] = useState<string>('5000000');
  const [age, setAge] = useState<string>('under40');
  const [dependents, setDependents] = useState<string>('1');
  const [useZeirishi, setUseZeirishi] = useState<boolean>(true);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleCalculate = () => {
    const shotokuNum = Number(shotoku) || 0;
    const depNum = Number(dependents) || 1;
    const is40plus = age === '40plus';

    // ── A. 個人事業主のみ（国保＋国民年金）──
    // 国保: 所得割 + 均等割 (簡易モデル)
    // 算定基礎所得 = 事業所得 - 基礎控除43万
    const kokuhoKiso = Math.max(0, shotokuNum - 430000);
    const kokuhoShotokuWari = kokuhoKiso * (is40plus ? KOKUHO_RATE_40PLUS : KOKUHO_RATE_UNDER40);
    const kokuhoKintou = (KOKUHO_KINTOUWARI + (is40plus ? KOKUHO_KAIGO_KINTOU : 0)) * depNum;
    const kokuhoCap = is40plus ? KOKUHO_CAP_40PLUS : KOKUHO_CAP_UNDER40;
    const kokuhoYearly = Math.min(kokuhoShotokuWari + kokuhoKintou, kokuhoCap);

    const kokuminNenkinYearly = KOKUMIN_NENKIN_MONTHLY * 12 * depNum; // 配偶者も各自払い

    const kojinTotalInsurance = kokuhoYearly + kokuminNenkinYearly;

    // ── B. マイクロ法人 二刀流（協会けんぽ＋厚生年金 1等級）──
    // 標準報酬月額 88,000円（1等級）
    const kenpoRate = KENPO_RATE_TOKYO + (is40plus ? KAIGO_RATE : 0);
    const kenpoMonthlyTotal = Math.round(HYOUJUN_HOUSHU_1 * kenpoRate); // 会社+本人合計
    const kouseiNenkinMonthlyTotal = Math.round(HYOUJUN_HOUSHU_1 * KOUSEI_NENKIN_RATE); // 会社+本人合計

    const kenpoYearly = kenpoMonthlyTotal * 12;
    const kouseiNenkinYearly = kouseiNenkinMonthlyTotal * 12;
    const microInsuranceTotal = kenpoYearly + kouseiNenkinYearly;

    // 法人維持費
    const zeirishiCost = useZeirishi ? 15000 * 12 + 15000 * 5 : 0; // 月1.5万 + 決算5か月分
    const houjinIjihi = HOUJIN_KINTOUWARI + KAIKEI_SOFT + TOUKIBO_ETC + zeirishiCost;

    const microTotalCost = microInsuranceTotal + houjinIjihi;

    const insuranceSaving = kojinTotalInsurance - microInsuranceTotal;
    const netSaving = kojinTotalInsurance - microTotalCost;
    const isWorth = netSaving > 0;

    setResult({
      kokuhoYearly,
      kokuminNenkinYearly,
      kojinTotalInsurance,
      kenpoYearly,
      kouseiNenkinYearly,
      microInsuranceTotal,
      houjinIjihi,
      zeirishiCost,
      microTotalCost,
      insuranceSaving,
      netSaving,
      isWorth,
      shotoku: shotokuNum,
      age: is40plus ? '40歳以上' : '40歳未満',
      dependents: depNum,
      useZeirishi,
    });
  };

  if (!mounted) {
    return <div className="min-h-screen py-12 flex items-center justify-center text-gray-500 dark:text-gray-400">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-pink-500 transition-colors">ホーム</Link>
          <span className="mx-2">{'>'}</span>
          <Link href="/business" className="hover:text-pink-500 transition-colors">ビジネス・法人</Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-gray-900 dark:text-gray-100">マイクロ法人シミュレーター</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          マイクロ法人シミュレーター
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          個人事業主がマイクロ法人を設立した場合の<strong>社会保険料の節約額</strong>を計算します。
          国保＋国民年金と、協会けんぽ＋厚生年金（最低等級）の保険料を比較し、法人維持費を差し引いた<strong>実質メリット</strong>を算出します。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* ============================================================ */}
        {/* INPUT FORM */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">

          {/* 所得 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              個人事業の年間所得（利益）
              <span className="ml-1 text-xs font-normal text-gray-400">売上ではなく経費控除後の所得</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'\u00a5'}</span>
              <input type="number" value={shotoku} onChange={(e) => setShotoku(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none" placeholder="5000000" min="0" />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { l: '300万', v: '3000000' }, { l: '400万', v: '4000000' },
                { l: '500万', v: '5000000' }, { l: '700万', v: '7000000' },
                { l: '1,000万', v: '10000000' }, { l: '1,500万', v: '15000000' },
              ].map((p) => (
                <button key={p.v} type="button" onClick={() => setShotoku(p.v)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${shotoku === p.v ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'}`}>{p.l}</button>
              ))}
            </div>
          </div>

          {/* Age + Dependents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                年齢
                <span className="ml-1 text-xs font-normal text-gray-400">介護保険料の判定</span>
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setAge('under40')}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${age === 'under40' ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                  40歳未満
                </button>
                <button type="button" onClick={() => setAge('40plus')}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${age === '40plus' ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                  40歳以上
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                国保加入者数
                <span className="ml-1 text-xs font-normal text-gray-400">本人＋配偶者（扶養なし）</span>
              </label>
              <div className="flex gap-3">
                {[{ l: '1人（本人のみ）', v: '1' }, { l: '2人（配偶者あり）', v: '2' }].map((p) => (
                  <button key={p.v} type="button" onClick={() => setDependents(p.v)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${dependents === p.v ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                    {p.l}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                マイクロ法人なら配偶者は扶養に入れるため追加保険料なし
              </p>
            </div>
          </div>

          {/* 税理士 */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">マイクロ法人に税理士を使う</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setUseZeirishi(true)}
                className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${useZeirishi ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                依頼する（月1.5万円）
              </button>
              <button type="button" onClick={() => setUseZeirishi(false)}
                className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${!useZeirishi ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                自分で記帳
              </button>
            </div>
          </div>

          {/* サラリーマン警告 */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <span className="mt-0.5 shrink-0"><Icons.AlertTriangle /></span>
              <span>サラリーマン（会社員）の方は、勤務先で社会保険に加入済みのため、マイクロ法人による社会保険料の節約はできません。本ツールは<strong>個人事業主・フリーランス</strong>の方が対象です。</span>
            </p>
          </div>

          <button type="button" onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
            <Icons.Calculator />
            節約額を計算する
          </button>
        </div>

        {/* ============================================================ */}
        {/* RESULTS */}
        {/* ============================================================ */}
        {result && (
          <div className="space-y-6 mb-12">

            {/* Verdict header */}
            <div className={`rounded-2xl p-6 md:p-8 shadow-xl ${result.isWorth ? 'bg-gradient-to-br from-emerald-600 to-emerald-700' : 'bg-gradient-to-br from-amber-600 to-amber-700'} text-white`}>
              <div className="text-center">
                <p className="text-sm opacity-80 mb-1">マイクロ法人の実質メリット（年間）</p>
                <p className="text-4xl md:text-5xl font-black tracking-tight">
                  {result.netSaving >= 0 ? '+' : ''}{formatYen(result.netSaving)}
                </p>
                <p className="text-sm opacity-80 mt-2">
                  {result.isWorth
                    ? '法人維持費を差し引いても、マイクロ法人の方がお得です'
                    : '法人維持費が社会保険料の節約額を上回るため、現状では個人事業主のままが有利です'}
                </p>
              </div>
            </div>

            {/* Side by side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 個人事業主のみ */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-red-200 dark:border-red-800 overflow-hidden shadow-sm">
                <div className="bg-red-50 dark:bg-red-900/20 px-6 py-3 border-b border-red-100 dark:border-red-800">
                  <h3 className="font-bold text-red-800 dark:text-red-300 text-sm">現状：個人事業主のみ</h3>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70">国保＋国民年金</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">国民健康保険</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatYen(result.kokuhoYearly)}/年</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">国民年金</span>
                      {result.dependents > 1 && <span className="text-xs text-gray-400 ml-1">× {result.dependents}人</span>}
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatYen(result.kokuminNenkinYearly)}/年</span>
                  </div>
                  <div className="border-t-2 border-red-200 dark:border-red-800 pt-3 flex justify-between items-center">
                    <span className="font-bold text-red-700 dark:text-red-400">合計</span>
                    <span className="text-xl font-black text-red-700 dark:text-red-400">{formatYen(result.kojinTotalInsurance)}/年</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">月額換算: {formatYen(Math.round(result.kojinTotalInsurance / 12))}/月</p>
                </div>
              </div>

              {/* マイクロ法人 二刀流 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 overflow-hidden shadow-sm">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-6 py-3 border-b border-emerald-100 dark:border-emerald-800">
                  <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">二刀流：マイクロ法人＋個人事業</h3>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">協会けんぽ＋厚生年金（1等級）</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">健康保険（協会けんぽ）</span>
                      <span className="text-xs text-gray-400 block">会社＋本人の合計</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatYen(result.kenpoYearly)}/年</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">厚生年金</span>
                      <span className="text-xs text-gray-400 block">会社＋本人の合計</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatYen(result.kouseiNenkinYearly)}/年</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">社会保険料 合計</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatYen(result.microInsuranceTotal)}/年</span>
                  </div>

                  {/* 法人維持費 */}
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">＋ 法人維持費</p>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>法人住民税 均等割</span><span>{formatYen(HOUJIN_KINTOUWARI)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>会計ソフト</span><span>{formatYen(KAIKEI_SOFT)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>登記簿謄本等</span><span>{formatYen(TOUKIBO_ETC)}</span>
                    </div>
                    {result.useZeirishi && (
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>税理士（顧問＋決算）</span><span>{formatYen(result.zeirishiCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-600 pt-1.5">
                      <span>維持費 小計</span><span>{formatYen(result.houjinIjihi)}</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-emerald-200 dark:border-emerald-800 pt-3 flex justify-between items-center">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">合計（社保＋維持費）</span>
                    <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">{formatYen(result.microTotalCost)}/年</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">月額換算: {formatYen(Math.round(result.microTotalCost / 12))}/月</p>
                </div>
              </div>
            </div>

            {/* Savings breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">節約額の内訳</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                  <span className="text-sm text-gray-700 dark:text-gray-300">社会保険料の差額</span>
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    {result.insuranceSaving >= 0 ? '+' : ''}{formatYen(result.insuranceSaving)}/年
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
                  <span className="text-sm text-gray-700 dark:text-gray-300">法人維持費（マイナス要素）</span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">-{formatYen(result.houjinIjihi)}/年</span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-xl ${result.isWorth ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'bg-amber-50 dark:bg-amber-900/10'}`}>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">実質節約額</span>
                  <span className={`text-lg font-black ${result.isWorth ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                    {result.netSaving >= 0 ? '+' : ''}{formatYen(result.netSaving)}/年
                  </span>
                </div>
              </div>
            </div>

            {/* Additional benefits note */}
            {result.dependents > 1 && result.isWorth && (
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-1.5 mb-2">
                  <Icons.Check />
                  配偶者の扶養メリット
                </h4>
                <p className="text-sm text-emerald-900/80 dark:text-emerald-200/80">
                  個人事業主の国保では配偶者にも均等割が別途かかりますが、マイクロ法人の協会けんぽなら配偶者を<strong>扶養に入れられる</strong>ため、追加の保険料負担なしで健康保険に加入できます。
                  さらに配偶者は国民年金の第3号被保険者となり、<strong>年金保険料も0円</strong>になります。
                </p>
              </div>
            )}

            {/* Warnings */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-1.5 mb-3">
                <Icons.AlertTriangle />
                マイクロ法人の注意点
              </h4>
              <ul className="space-y-2 text-sm text-amber-900/80 dark:text-amber-200/80">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 shrink-0"><Icons.X /></span>
                  個人事業とマイクロ法人は<strong>異なる業種</strong>にする必要があります（同業種は租税回避とみなされるリスク）
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 shrink-0"><Icons.X /></span>
                  確定申告が個人と法人の<strong>2つ必要</strong>になります
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 shrink-0"><Icons.X /></span>
                  役員報酬を最低限にすると<strong>将来の厚生年金受給額も最低限</strong>になります
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 shrink-0"><Icons.X /></span>
                  住宅ローン審査等で<strong>役員報酬が低いと不利</strong>になる場合があります
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 shrink-0"><Icons.X /></span>
                  将来の<strong>制度改正リスク</strong>があります（社会保険料の算定方法変更等）
                </li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• 国保料率は東京都区部（2026年度概算）を使用。自治体により大きく異なります。</li>
                <li>• 協会けんぽは東京都の料率を使用。都道府県により異なります。</li>
                <li>• マイクロ法人の役員報酬は最低等級（標準報酬月額88,000円）を想定しています。</li>
                <li>• 国保の軽減措置（7割・5割・2割軽減）は考慮していません。低所得の場合は国保が軽減される可能性があります。</li>
                <li>• 所得税・住民税の差異、法人税、消費税は本計算に含まれていません。</li>
                <li>• マイクロ法人の設立・運営は専門家（税理士・社労士）に相談のうえ判断してください。</li>
              </ul>
            </div>

            {/* Related tools */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/business/setsuritsu-hiyo', label: '会社設立費用シミュレーター', desc: 'マイクロ法人の設立にかかる費用を計算' },
                  { href: '/business/houjin-iji-hiyo', label: '法人維持費シミュレーター', desc: '年間ランニングコストの全体像' },
                  { href: '/business/kaisha-shindan', label: '会社形態診断ツール', desc: 'KK vs GK — マイクロ法人はGKが人気' },
                  { href: '/business/kesanki-sim', label: '決算期シミュレーター', desc: '最適な決算月を自動判定' },
                  { href: '/calculator/houjinka-sim', label: '法人化シミュレーター', desc: '個人事業 vs 法人の税金比較' },
                  { href: '/calculator/yakuin-hoshu', label: '役員報酬最適化', desc: '手取りを最大化する報酬額を計算' },
                ].map((tool) => (
                  <Link key={tool.href} href={tool.href}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all group">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{tool.label}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{tool.desc}</p>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600 group-hover:text-pink-400 transition-colors"><Icons.ArrowRight /></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PRE-COMPUTED EXAMPLES */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">所得別 マイクロ法人の節約効果</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">40歳未満・1人・税理士あり・東京都の概算</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">年間所得</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">国保＋国民年金</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">マイクロ法人<br /><span className="text-xs font-normal">（社保＋維持費）</span></th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">実質節約額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  { s: '300万円', k: '約57万円', m: '約66万円', d: '-約9万円', neg: true },
                  { s: '400万円', k: '約68万円', m: '約66万円', d: '+約2万円', neg: false },
                  { s: '500万円', k: '約80万円', m: '約66万円', d: '+約14万円', neg: false },
                  { s: '700万円', k: '約102万円', m: '約66万円', d: '+約36万円', neg: false },
                  { s: '1,000万円', k: '約136万円', m: '約66万円', d: '+約70万円', neg: false },
                  { s: '1,500万円', k: '約137万円', m: '約66万円', d: '+約71万円', neg: false },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 px-2 font-medium text-gray-900 dark:text-gray-100">{row.s}</td>
                    <td className="py-3 px-2 text-right text-red-600 dark:text-red-400 font-medium">{row.k}</td>
                    <td className="py-3 px-2 text-right text-emerald-600 dark:text-emerald-400 font-medium">{row.m}</td>
                    <td className={`py-3 px-2 text-right font-bold ${row.neg ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>{row.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">※ 国保料率は東京都区部概算。自治体により大きく異なります。マイクロ法人は協会けんぽ1等級＋税理士月1.5万円想定。</p>
        </div>

        {/* ============================================================ */}
        {/* FAQ */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: 'マイクロ法人はいくらから得になりますか？',
                a: '個人事業の年間所得が400〜500万円を超えると、国保料が高くなりマイクロ法人のメリットが出始めます。所得が高いほど国保料との差額が大きくなり、節約効果も大きくなります。ただし法人維持費（最低7万円/年＋会計ソフト代）を差し引いた「実質メリット」で判断してください。',
              },
              {
                q: 'マイクロ法人に最適な業種は？',
                a: '個人事業と異なる業種にする必要があります。人気の選択肢は、ITコンサルティング、ウェブ制作、動画制作、アフィリエイト、不動産管理、コンテンツ販売などです。実態のある事業にすることが重要です。',
              },
              {
                q: 'マイクロ法人の役員報酬はいくらがベスト？',
                a: '社会保険料を最小化するには、協会けんぽの最低等級（1等級）が適用される月額約5.4万円が一般的です。標準報酬月額88,000円が適用され、社会保険料が最小になります。',
              },
              {
                q: 'マイクロ法人は違法ですか？',
                a: '適切に運営すれば合法です。ただし、実態のない法人（ペーパーカンパニー）として社会保険料逃れと認定されるリスクはあります。事業実態のある運営、適切な帳簿管理、税務申告を行うことが重要です。',
              },
            ].map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2">Q. {faq.q}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-4 border-l-2 border-pink-200 dark:border-pink-800">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
