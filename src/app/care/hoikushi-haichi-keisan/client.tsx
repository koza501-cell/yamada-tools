"use client";

import { useState, useEffect } from "react";
import { FAQSection } from "@/components/FAQSection";
import { SHISETSU_RULES, KOTEI_KAKEN, type Shisetsu } from "@/data/hoikushi-haichi";

const Icons = {
  Calc: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="16" y1="10" y2="10"/><line x1="8" x2="12" y1="14" y2="14"/>
    </svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Printer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect width="12" height="8" x="6" y="14"/>
    </svg>
  ),
  Warning: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  ),
};

const SHISETSU_ORDER: Shisetsu[] = ['ninka', 'ninkagai', 'kodomoen', 'shoukibo_a', 'shoukibo_b', 'shoukibo_c', 'jigyousho'];

interface AgeInput {
  age0: number;
  age1: number;
  age2: number;
  age3: number;
  age4: number;
  age5: number;
}

interface BreakdownRow {
  label: string;
  count: number;
  ratio: number;
  required: number;
}

interface CalcResult {
  breakdown: BreakdownRow[];
  ageSubtotal: number;
  facilityAdd: number;
  koteiAdd: number;
  total: number;
  minApplied: boolean;
  shisetsuLabel: string;
  useTransitionAge3: boolean;
  useTransitionAge45: boolean;
  useIchijiKasan: boolean;
}

const AGE_LABELS = ['0歳', '1歳', '2歳', '3歳', '4歳', '5歳'];
const AGE_KEYS: (keyof AgeInput)[] = ['age0', 'age1', 'age2', 'age3', 'age4', 'age5'];

const FAQ = [
  {
    question: '3歳児の経過措置はいつ終わりますか？',
    answer: '令和9年度末（2028年3月31日）に終了します。令和10年度（2028年4月）から15:1が完全義務化されます。2026年3月にこども家庭庁が正式決定しました。',
  },
  {
    question: '1歳児配置改善加算の取得条件は？',
    answer: '①1歳児を5:1以上に改善、②処遇改善等加算Ⅰ・Ⅱ・Ⅲすべて取得、③ICT機器(登降園管理含む2機能以上)導入、④加算使途の職員周知、の4条件すべてを満たす必要があります。',
  },
  {
    question: '常時2名以上というのは何ですか？',
    answer: '年齢別計算の合計が1名以下でも、保育所は常時2名以上の保育士を配置しなければなりません。認可保育所・認可外・認定こども園などで共通のルールです。',
  },
  {
    question: '小規模C型の計算方法は他と違いますか？',
    answer: 'はい、C型は家庭的保育で、0〜2歳児一律「子ども3人につき職員1人」です。補助者がいれば5人まで対応可能。全員が保育士資格を持つ必要はありませんが、家庭的保育士の認定が必要です。',
  },
  {
    question: '計算結果はシフト人員と同じですか？',
    answer: '異なります。計算結果は「同時に必要な最低人数」です。開園12時間・1人8時間勤務なら1.5交代が必要なため、実際の雇用人数は計算結果の1.7〜2.0倍が目安となります。',
  },
];

const SEO_TABLE = [
  { age: '0歳', ninka: '3:1', shoukibo_a: '3:1 (+1加配)', shoukibo_c: '3:1', kodomoen: '3:1' },
  { age: '1歳', ninka: '6:1 (加算5:1)', shoukibo_a: '6:1 (+1加配)', shoukibo_c: '3:1', kodomoen: '6:1' },
  { age: '2歳', ninka: '6:1', shoukibo_a: '6:1 (+1加配)', shoukibo_c: '3:1', kodomoen: '6:1' },
  { age: '3歳', ninka: '15:1 ★', shoukibo_a: '15:1 (+1加配)', shoukibo_c: '対象外', kodomoen: '15:1 ★' },
  { age: '4歳', ninka: '25:1 ★', shoukibo_a: '25:1 (+1加配)', shoukibo_c: '対象外', kodomoen: '25:1 ★' },
  { age: '5歳', ninka: '25:1 ★', shoukibo_a: '25:1 (+1加配)', shoukibo_c: '対象外', kodomoen: '25:1 ★' },
];

export default function HoikushiHaichiClient() {
  const [mounted, setMounted] = useState(false);
  const [shisetsu, setShisetsu] = useState<Shisetsu>('ninka');
  const [ages, setAges] = useState<AgeInput>({ age0: 0, age1: 0, age2: 0, age3: 0, age4: 0, age5: 0 });
  const [koteiSelected, setKoteiSelected] = useState<string[]>([]);
  const [useTransitionAge3, setUseTransitionAge3] = useState(false);
  const [useTransitionAge45, setUseTransitionAge45] = useState(false);
  const [useIchijiKasan, setUseIchijiKasan] = useState(false);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function setAge(key: keyof AgeInput, val: number) {
    setAges(prev => ({ ...prev, [key]: Math.max(0, Math.min(999, val)) }));
    setResult(null);
  }

  function toggleKotei(id: string) {
    setKoteiSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setResult(null);
  }

  function handleCalculate() {
    const rules = SHISETSU_RULES[shisetsu];
    const ratioSet = rules.baseRatio;

    const effectiveRatios: Record<keyof AgeInput, number> = {
      age0: ratioSet.age0.ratio,
      age1: useIchijiKasan ? (ratioSet.age1.kasanRatio ?? ratioSet.age1.ratio) : ratioSet.age1.ratio,
      age2: ratioSet.age2.ratio,
      age3: useTransitionAge3 ? (ratioSet.age3.transitionRatio ?? ratioSet.age3.ratio) : ratioSet.age3.ratio,
      age4: useTransitionAge45 ? (ratioSet.age4.transitionRatio ?? ratioSet.age4.ratio) : ratioSet.age4.ratio,
      age5: useTransitionAge45 ? (ratioSet.age5.transitionRatio ?? ratioSet.age5.ratio) : ratioSet.age5.ratio,
    };

    const breakdown: BreakdownRow[] = AGE_KEYS.map((key, i) => {
      const count = Number(ages[key]) || 0;
      const ratio = effectiveRatios[key];
      const required = count > 0 ? Math.ceil(count / ratio) : 0;
      return { label: AGE_LABELS[i], count, ratio, required };
    });

    const ageSubtotal = breakdown.reduce((sum, row) => sum + row.required, 0);
    const facilityAdd = rules.addCount;
    const koteiAdd = KOTEI_KAKEN
      .filter(k => koteiSelected.includes(k.id))
      .reduce((sum, k) => sum + k.addCount, 0);
    const computed = ageSubtotal + facilityAdd + koteiAdd;
    const total = Math.max(rules.minTotal, computed);
    const minApplied = total > computed;

    setResult({
      breakdown,
      ageSubtotal,
      facilityAdd,
      koteiAdd,
      total,
      minApplied,
      shisetsuLabel: rules.label,
      useTransitionAge3,
      useTransitionAge45,
      useIchijiKasan,
    });
  }

  function handleCopy() {
    if (!result) return;
    const lines = [
      '【保育士配置基準 計算結果】',
      '',
      `施設種別: ${result.shisetsuLabel}`,
      '',
      '年齢別内訳:',
      ...result.breakdown.map(r => `  ${r.label}児: ${r.count}人 → ${r.required}人 (${r.count > 0 ? r.ratio + ':1' : '—'})`),
      `年齢別合計: ${result.ageSubtotal}人`,
      ...(result.facilityAdd > 0 ? [`施設種別加配: +${result.facilityAdd}人`] : []),
      ...(result.koteiAdd > 0 ? [`公定価格加配: +${result.koteiAdd}人`] : []),
      '────────────',
      `必要保育士数: ${result.total}人`,
      ...(result.minApplied ? ['(常時2名以上ルールを適用)'] : []),
      '',
      '※本ツールの計算結果は目安です。正確な配置基準は市区町村または都道府県にご確認ください。',
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!mounted) return <div className="min-h-screen" />;

  const rules = SHISETSU_RULES[shisetsu];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 dark:text-gray-400 mb-4 print-hide">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/care" className="hover:underline">介護・保育</a>
        <span className="mx-1">&gt;</span>
        <span className="text-gray-900 dark:text-white">保育士配置基準 計算機</span>
      </nav>

      {/* Hero */}
      <div className="print-hide">
        <div className="mb-1">
          <span className="inline-block rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 text-xs font-medium px-2 py-0.5">保育園 経営者向け</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          保育士配置基準 計算機【令和8年度・最新改正対応】
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          年齢別園児数を入れるだけで必要保育士数を即算出。令和6年4月改正(3-5歳児)・令和7年度新設1歳児加算・経過措置対応。認可保育所・認定こども園・小規模A/B/C型・認可外・事業所内、7形態に完全対応。
        </p>
      </div>

      {/* Callout */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 print-hide">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          令和6年4月改正で3・4・5歳児の配置基準が変更。<strong>令和9年度末で3歳児の経過措置終了（令和10年度 15:1完全義務化）が2026年3月に決定</strong>。最新の基準で配置計画を見直しましょう。
        </p>
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
          ※令和8年度(2026年)現在の制度に基づきます。最新情報はこども家庭庁公式サイトをご確認ください。
        </p>
      </div>

      {/* Form */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 print-hide">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-5">必要保育士数を計算する</h2>

        {/* Q1: 施設種別 */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Q1. 施設種別</p>
          <div className="flex flex-wrap gap-2">
            {SHISETSU_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => { setShisetsu(key); setResult(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  shisetsu === key
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {SHISETSU_RULES[key].label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{rules.description}</p>
        </div>

        {/* Q2: 各年齢の園児数 */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Q2. 各年齢の園児数</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AGE_KEYS.map((key, i) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">{AGE_LABELS[i]}児</label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAge(key, (Number(ages[key]) || 0) - 1)}
                    className="w-7 h-7 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-base font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    aria-label="減らす"
                  >−</button>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={ages[key]}
                    onChange={(e) => setAge(key, Number(e.target.value) || 0)}
                    className="w-14 text-center border border-gray-300 dark:border-gray-600 rounded px-1 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setAge(key, (Number(ages[key]) || 0) + 1)}
                    className="w-7 h-7 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-base font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    aria-label="増やす"
                  >＋</button>
                  <span className="text-xs text-gray-400">人</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Q3: 公定価格加配 */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Q3. 公定価格 基本部分 加配（任意）</p>
          <div className="space-y-2">
            {KOTEI_KAKEN.map((k) => (
              <label key={k.id} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={koteiSelected.includes(k.id)}
                  onChange={() => toggleKotei(k.id)}
                  className="mt-0.5 rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-400"
                />
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{k.label}</span>
                  <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">+{k.addCount}名</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{k.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Q4: 経過措置 */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Q4. 経過措置の適用</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">3歳児: 旧基準(20:1)を適用</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">新基準15:1 ⇔ 旧基準20:1 ※経過措置は令和9年度末(2028年3月31日)で終了</p>
              </div>
              <button
                type="button"
                onClick={() => { setUseTransitionAge3(v => !v); setResult(null); }}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${useTransitionAge3 ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                aria-label="3歳児経過措置"
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${useTransitionAge3 ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">4・5歳児: 旧基準(30:1)を適用</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">新基準25:1 ⇔ 旧基準30:1 ※経過措置期限は未確定</p>
              </div>
              <button
                type="button"
                onClick={() => { setUseTransitionAge45(v => !v); setResult(null); }}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${useTransitionAge45 ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                aria-label="4・5歳児経過措置"
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${useTransitionAge45 ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Q5: 1歳児加算 */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Q5. 1歳児配置改善加算（令和7年度新設）</p>
          <div className="flex items-center justify-between gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">1歳児を加算適用(5:1)で計算</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">通常6:1 ⇔ 加算適用5:1 ※4条件すべて充足の場合のみ加算取得可</p>
            </div>
            <button
              type="button"
              onClick={() => { setUseIchijiKasan(v => !v); setResult(null); }}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${useIchijiKasan ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              aria-label="1歳児配置改善加算"
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${useIchijiKasan ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors text-base"
        >
          <Icons.Calc />
          必要保育士数を計算する
        </button>
      </section>

      {/* Result */}
      {result && (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <div className="hidden print:block mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1">保育士配置基準 計算結果</h2>
            <p className="text-xs text-gray-500">{result.shisetsuLabel}</p>
          </div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 print-hide">📊 必要保育士数</h2>

          <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-5 text-center">
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">必要保育士数（最低ライン）</p>
            <p className="text-5xl font-bold text-amber-700 dark:text-amber-300">
              {result.total}<span className="text-2xl ml-1">人</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.shisetsuLabel}</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="text-left px-3 py-2 text-gray-600 dark:text-gray-300 font-semibold text-xs">年齢</th>
                  <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-300 font-semibold text-xs">園児数</th>
                  <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-300 font-semibold text-xs">配置比率</th>
                  <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-300 font-semibold text-xs">必要人数</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {result.breakdown.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                      {row.label}
                      {i === 1 && result.useIchijiKasan && (
                        <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">(加算)</span>
                      )}
                      {i === 3 && result.useTransitionAge3 && (
                        <span className="ml-1 text-xs text-orange-600 dark:text-orange-400">(経過措置)</span>
                      )}
                      {(i === 4 || i === 5) && result.useTransitionAge45 && (
                        <span className="ml-1 text-xs text-orange-600 dark:text-orange-400">(経過措置)</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 dark:text-white">{row.count}人</td>
                    <td className="px-3 py-2 text-right text-gray-500 dark:text-gray-400">
                      {row.count > 0 ? `${row.ratio}:1` : '—'}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900 dark:text-white">{row.required}人</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-300" colSpan={3}>年齢別合計</td>
                  <td className="px-3 py-2 text-right font-bold text-gray-900 dark:text-white">{result.ageSubtotal}人</td>
                </tr>
                {result.facilityAdd > 0 && (
                  <tr>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400" colSpan={3}>施設種別加配（{result.shisetsuLabel}）</td>
                    <td className="px-3 py-2 text-right text-gray-900 dark:text-white">+{result.facilityAdd}人</td>
                  </tr>
                )}
                {result.koteiAdd > 0 && (
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400" colSpan={3}>公定価格加配</td>
                    <td className="px-3 py-2 text-right text-gray-900 dark:text-white">+{result.koteiAdd}人</td>
                  </tr>
                )}
                <tr className="bg-amber-50 dark:bg-amber-900/20">
                  <td className="px-3 py-2 font-bold text-gray-900 dark:text-white" colSpan={3}>
                    必要総数
                    {result.minApplied && (
                      <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">(常時2名以上を適用)</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-amber-700 dark:text-amber-300 text-base">
                    {result.total}人
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {result.useTransitionAge3 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex items-start gap-2">
              <span className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5">
                <Icons.Warning />
              </span>
              <div className="text-sm">
                <p className="font-semibold text-orange-800 dark:text-orange-300">⚠️ 3歳児 経過措置 終了のお知らせ</p>
                <p className="text-orange-700 dark:text-orange-400 mt-0.5">
                  令和9年度末（2028年3月31日）で3歳児の経過措置が終了します。令和10年度（2028年4月）から15:1が完全義務化。今から採用計画を見直してください。
                </p>
              </div>
            </div>
          )}

          <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-4">
            <p className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-1.5">💡 シフト計算メモ</p>
            <p className="text-sm text-sky-700 dark:text-sky-400">
              計算結果は「同時に必要な最低人数」です。開園12時間・1人8時間勤務の場合、約1.5交代が必要。<br />
              <strong>実際の雇用人数は計算結果の1.7〜2.0倍</strong>が目安（有給・産育休・研修等を考慮）。
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>※本ツールは目安算出です。実際の配置基準は施設の種別・自治体の上乗せ基準・公定価格の加配条件によって異なります。</p>
            <p>※令和8年度(2026年)の制度に基づきます。最新の通知・告示はこども家庭庁公式サイトをご確認ください。</p>
          </div>

          <div className="flex gap-2 print-hide">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? <Icons.Check /> : <Icons.Copy />}
              {copied ? 'コピー済み' : '結果をコピー'}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Icons.Printer />
              印刷
            </button>
          </div>
        </section>
      )}

      {/* Static SEO Table */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 print-hide">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">令和8年度 配置基準 早見表</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">★ = 令和6年4月改正（新基準）</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="text-left px-2 py-2 text-gray-700 dark:text-gray-300">年齢</th>
                <th className="text-center px-2 py-2 text-gray-700 dark:text-gray-300">認可保育所</th>
                <th className="text-center px-2 py-2 text-gray-700 dark:text-gray-300">認定こども園</th>
                <th className="text-center px-2 py-2 text-gray-700 dark:text-gray-300">小規模A型</th>
                <th className="text-center px-2 py-2 text-gray-700 dark:text-gray-300">小規模C型</th>
              </tr>
            </thead>
            <tbody>
              {SEO_TABLE.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                  <td className="px-2 py-2 font-semibold text-gray-900 dark:text-white">{row.age}児</td>
                  <td className="px-2 py-2 text-center text-gray-700 dark:text-gray-300">{row.ninka}</td>
                  <td className="px-2 py-2 text-center text-gray-700 dark:text-gray-300">{row.kodomoen}</td>
                  <td className="px-2 py-2 text-center text-gray-700 dark:text-gray-300">{row.shoukibo_a}</td>
                  <td className="px-2 py-2 text-center text-gray-700 dark:text-gray-300">{row.shoukibo_c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">小規模B型・事業所内保育は比率はA型と同様。認可外は11時間以内で認可と同等。</p>
      </section>

      {/* 計算式の解説 */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 print-hide">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">計算式の解説</h2>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 font-mono text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <p>各年齢の必要人数 = ceil(園児数 ÷ 配置比率)</p>
          <p>合計 = Σ(各年齢の必要人数)</p>
          <p>+ 施設種別加配 (小規模A/B型・事業所内: +1)</p>
          <p>+ 公定価格加配 (選択した加配の合計)</p>
          <p>最終値 = max(合計, 最低保育士数)</p>
          <p>最低保育士数 = 2名 (認可・認可外・認定こども園・小規模A/B型・事業所内)</p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">「ceil」は切り上げ演算。例: 園児7人 ÷ 3:1 = 2.33 → 3人に切り上げ</p>
      </section>

      {/* 経過措置の動向 */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 print-hide">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">改正・経過措置の動向</h2>
        <div className="space-y-3">
          {[
            { year: '令和6年4月', label: '3・4・5歳児 配置基準改正', detail: '3歳児: 20:1 → 15:1、4・5歳児: 30:1 → 25:1。約76年ぶりの大改正。経過措置あり。', color: 'blue' },
            { year: '令和7年度', label: '1歳児配置改善加算 新設', detail: '5:1配置を実現した園に追加費用を支給。4条件すべて充足が必要。令和8年度予算 109億円。', color: 'green' },
            { year: '令和9年度末', label: '3歳児 経過措置終了（2026年3月決定）', detail: '2028年3月31日で旧基準(20:1)による経過措置が終了。正式決定済み。', color: 'orange' },
            { year: '令和10年度〜', label: '15:1 完全義務化', detail: '2028年4月から3歳児に15:1が完全義務化。今から採用・ICT化の準備が必要。', color: 'red' },
          ].map((item) => (
            <div key={item.year} className="flex gap-3">
              <div className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded h-fit ${
                item.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                item.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                item.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' :
                'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
              }`}>{item.year}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog callout */}
      <section className="mt-4 print-hide">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/50">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">📖 もっと詳しく</p>
          <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            保育士配置基準の完全ガイド【令和8年度版】
          </h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            3層構造の解説、令和6年改正の背景、1歳児加算4条件の詳細分析、令和9年度末経過措置終了への準備、違反ペナルティのタイムラインまで完全解説。
          </p>
          <a
            href="/blog/hoikushi-haichi-kijun-guide"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            解説記事を読む →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <div className="print-hide">
        <FAQSection faq={FAQ} title="よくある質問" />
      </div>

    </div>
  );
}
