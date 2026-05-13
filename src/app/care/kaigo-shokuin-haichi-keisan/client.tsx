"use client";

import { useState, useEffect } from "react";
import { FAQSection } from "@/components/FAQSection";
import { SHISETSU_RULES, type KaigoShisetsu } from "@/data/kaigo-shokuin-haichi";

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

const SHISETSU_ORDER: KaigoShisetsu[] = [
  'tokuyou', 'roken', 'yuryou', 'sakouju_kaigo',
  'group_home', 'day_service', 'short_stay', 'shoukibo_takinou',
];

interface CalcResult {
  shisetsuLabel: string;
  dayTotal: number;
  nurseEstimate: number | null;
  yakanPerson: number | null;
  usedTechRelaxation: boolean;
  usedYakanRelaxation: boolean;
  isGH: boolean;
  unitCount: number;
  isDayService: boolean;
  roles: Array<{ id: string; label: string; ratio: string; note: string }>;
  staffingNote: string;
  userCount: number;
}

const FAQ_ITEMS = [
  {
    question: '3:1は介護職員だけの比率ですか?',
    answer: 'いいえ。介護職員と看護職員の合計で3:1(常勤換算)です。例えば特養で利用者60名なら、介護+看護で20名以上の常勤換算が必要です。よくある誤解のため注意してください。',
  },
  {
    question: '令和6年の3:0.9緩和はどの施設で使えますか?',
    answer: '現時点では特定施設(介護付き有料老人ホーム・サ高住介護型)が主な対象です。テクノロジー機器導入・委員会設置・利用者安全確保・職員負担軽減の確認等、複数要件をすべて満たす必要があります。特養・老健は対象外です。',
  },
  {
    question: '夜勤1.6人緩和の具体的な要件は何ですか?',
    answer: '特養・老健・ショートステイで、入所者全員に対する見守り機器100%導入と職員間の適切な情報共有体制確保等の要件を充足することで、夜勤2名から常勤換算1.6名に緩和できます(令和6年4月改正)。',
  },
  {
    question: '処遇改善加算Ⅰロ・Ⅱロ取得に生産性向上加算が必要って本当ですか?',
    answer: 'はい。令和8年6月期中改定で、処遇改善加算の上位区分(ロ)取得には生産性向上推進体制加算(Ⅱ)以上の取得が要件に組み込まれました。ICT機器導入と委員会運営が事実上の前提条件です。',
  },
  {
    question: '常勤換算とは何ですか? 3名雇用していれば3人換算?',
    answer: '常勤換算 = 全職員の週総勤務時間 ÷ 常勤の所定労働時間。例えば週40h常勤+週20h非常勤の場合、常勤換算は(40+20)/40 = 1.5人です。3名雇用でも週30h勤務なら2.25人換算。人数ではなく時間で計算します。',
  },
  {
    question: '配置基準違反が見つかった場合のリスクは?',
    answer: '段階的に進みます(改善指導→勧告→命令→業務停止→指定取消)。指定取消後は原則5年(悪質な場合10年)は再指定不可。また行政処分前でも、介護報酬の減算・加算不支給・新規受入停止が即座に発生します。',
  },
];

const SEO_TABLE_DATA = [
  { shisetsu: '特別養護老人ホーム(特養)', ratio: '3:1', yakan: '2人以上(緩和:1.6人)', tech: 'なし', note: '看護師別途必須' },
  { shisetsu: '介護老人保健施設(老健)', ratio: '3:1(看護約2/7)', yakan: '2人以上(緩和:1.6人)', tech: 'なし', note: '常勤医師必須' },
  { shisetsu: '介護付き有料老人ホーム', ratio: '3:1(緩和:3:0.9可)', yakan: '1人以上', tech: '3:0.9緩和可', note: '特定施設指定' },
  { shisetsu: 'サ高住(介護型)', ratio: '3:1(緩和:3:0.9可)', yakan: '1人以上', tech: '3:0.9緩和可', note: '特定施設指定' },
  { shisetsu: 'グループホーム', ratio: '3:1(日中)', yakan: 'ユニットごと1人', tech: 'なし', note: '看護師不要' },
  { shisetsu: '通所介護(デイサービス)', ratio: '15名まで1人+5:1', yakan: 'なし(日帰り)', tech: 'なし', note: '通所型' },
  { shisetsu: 'ショートステイ', ratio: '3:1', yakan: '2人以上(緩和:1.6人)', tech: 'なし', note: '最大30日' },
  { shisetsu: '小規模多機能型居宅介護', ratio: '3:1', yakan: '宿泊利用者に対応', tech: 'なし', note: '登録定員29名以下' },
];

export default function KaigoShokuinHaichiClient() {
  const [mounted, setMounted] = useState(false);
  const [shisetsu, setShisetsu] = useState<KaigoShisetsu>('tokuyou');
  const [userCount, setUserCount] = useState(60);
  const [unitCount, setUnitCount] = useState(1);
  const [useTechRelaxation, setUseTechRelaxation] = useState(false);
  const [useYakanRelaxation, setUseYakanRelaxation] = useState(false);
  const [showKangoInternals, setShowKangoInternals] = useState(false);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function setCount(val: number) {
    setUserCount(Math.max(0, Math.min(9999, val)));
    setResult(null);
  }

  function handleCalculate() {
    const rule = SHISETSU_RULES[shisetsu];
    const count = Number(userCount) || 0;

    let dayTotal = 0;

    if (rule.dayServiceSpecial) {
      if (count <= 0) dayTotal = 0;
      else if (count <= 15) dayTotal = 1;
      else dayTotal = 1 + Math.ceil((count - 15) / rule.baseRatio);
    } else {
      const effectiveRatio =
        useTechRelaxation && rule.baseRatioRelaxed !== null
          ? rule.baseRatioRelaxed
          : rule.baseRatio;
      dayTotal = count > 0 ? Math.ceil(count / effectiveRatio) : 0;
    }

    let yakanPerson: number | null = null;
    if (rule.yakan.person > 0) {
      if (rule.groupHomeSpecial) {
        yakanPerson = unitCount;
      } else if (useYakanRelaxation && rule.yakan.relaxed !== null) {
        yakanPerson = rule.yakan.relaxed;
      } else {
        yakanPerson = rule.yakan.person;
      }
    }

    const nurseEstimate =
      shisetsu === 'roken' && showKangoInternals && dayTotal > 0
        ? Math.ceil(dayTotal * 2 / 7)
        : null;

    setResult({
      shisetsuLabel: rule.label,
      dayTotal,
      nurseEstimate,
      yakanPerson,
      usedTechRelaxation: useTechRelaxation && rule.baseRatioRelaxed !== null,
      usedYakanRelaxation: useYakanRelaxation && rule.yakan.relaxed !== null,
      isGH: rule.groupHomeSpecial === true,
      unitCount,
      isDayService: rule.dayServiceSpecial === true,
      roles: rule.roles,
      staffingNote: rule.staffingNote,
      userCount: count,
    });
  }

  function handleCopy() {
    if (!result) return;
    const lines = [
      '【介護職員配置基準 計算結果】',
      '',
      `施設種別: ${result.shisetsuLabel}`,
      `利用者数: ${result.userCount}名`,
      ...(result.isGH ? [`ユニット数: ${result.unitCount}ユニット`] : []),
      '',
      `日中 介護+看護 合計: ${result.dayTotal}人 (常勤換算)`,
      ...(result.nurseEstimate !== null ? [`  うち看護職員(老健目安 約2/7): ${result.nurseEstimate}人`] : []),
      ...(result.yakanPerson !== null
        ? [
            result.isGH
              ? `夜勤: ${result.yakanPerson}人 (ユニットごとに1人)`
              : result.usedYakanRelaxation
                ? `夜勤: ${result.yakanPerson}人 (夜勤緩和1.6人適用)`
                : `夜勤: ${result.yakanPerson}人以上`,
          ]
        : ['夜勤: なし(通所型)']),
      ...(result.usedTechRelaxation ? ['[テクノロジー緩和 3:0.9 適用]'] : []),
      '',
      '※本ツールの計算結果は目安です。正確な基準は都道府県・市区町村にご確認ください。',
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!mounted) return <div className="min-h-screen" />;

  const rule = SHISETSU_RULES[shisetsu];
  const showTechToggle = rule.baseRatioRelaxed !== null;
  const showYakanToggle = rule.yakan.relaxed !== null;
  const showUnitSelect = rule.groupHomeSpecial === true;
  const showKangoToggle = shisetsu === 'roken';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 dark:text-gray-400 mb-4 print-hide">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/care" className="hover:underline">介護・保育</a>
        <span className="mx-1">&gt;</span>
        <span className="text-gray-900 dark:text-white">介護職員配置基準 計算機</span>
      </nav>

      {/* Hero */}
      <div className="print-hide">
        <div className="mb-1">
          <span className="inline-block rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 text-xs font-medium px-2 py-0.5">介護事業所 経営者向け</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          介護職員配置基準 計算機【令和8年度・最新改正対応】
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          利用者数を入れるだけで必要な介護職員数（介護+看護 合計・常勤換算）を即算出。特養・老健・有料老人ホーム・サ高住・グループホーム・デイサービス・ショートステイ・小規模多機能、8施設種別に対応。令和6年4月改正（3:0.9緩和・夜勤1.6人緩和）・令和8年6月期中改定（処遇改善加算Ⅰロ・Ⅱロ新設）対応。
        </p>
      </div>

      {/* Callout */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 print-hide">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          ⚠️ <strong>3:1は「介護職員+看護職員 合計」の比率</strong>です。介護職員だけで3:1と誤解されるケースが多いため注意が必要です。
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          令和8年6月期中改定で処遇改善加算Ⅰロ・Ⅱロ新設。上位区分取得には生産性向上推進体制加算が前提条件となりました。
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          ※令和8年度(2026年)現在の制度に基づきます。最新情報は厚生労働省「介護保険最新情報」でご確認ください。
        </p>
      </div>

      {/* Form */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 print-hide">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-5">必要介護職員数を計算する</h2>

        {/* Q1: 施設種別 */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Q1. 施設種別</p>
          <div className="flex flex-wrap gap-2">
            {SHISETSU_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setShisetsu(key);
                  setResult(null);
                  setUseTechRelaxation(false);
                  setUseYakanRelaxation(false);
                  setShowKangoInternals(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  shisetsu === key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {SHISETSU_RULES[key].label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{rule.description}</p>
        </div>

        {/* Q2: 利用者数 */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Q2. 利用者数（入所・通所）</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCount((Number(userCount) || 0) - 1)}
              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-base font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              aria-label="減らす"
            >−</button>
            <input
              type="number"
              min="0"
              max="9999"
              value={userCount}
              onChange={(e) => setCount(Number(e.target.value) || 0)}
              className="w-20 text-center border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setCount((Number(userCount) || 0) + 1)}
              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-base font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              aria-label="増やす"
            >＋</button>
            <span className="text-sm text-gray-500 dark:text-gray-400">名</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{rule.staffingNote}</p>
        </div>

        {/* Q3: ユニット数 (GHのみ) */}
        {showUnitSelect && (
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Q3. ユニット数（グループホーム）</p>
            <div className="flex gap-2">
              {[1, 2].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setUnitCount(n); setResult(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    unitCount === n
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {n}ユニット
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1ユニット5〜9名。夜勤はユニットごとに1人以上必要です。</p>
          </div>
        )}

        {/* Q4: オプション */}
        {(showTechToggle || showYakanToggle || showKangoToggle) && (
          <div className="mb-5 space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {showUnitSelect ? 'Q4.' : 'Q3.'} 特例・緩和オプション
            </p>

            {showTechToggle && (
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => { setUseTechRelaxation(!useTechRelaxation); setResult(null); }}
                  className={`relative mt-0.5 w-9 h-5 rounded-full transition-colors flex-shrink-0 ${useTechRelaxation ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  role="switch"
                  aria-checked={useTechRelaxation}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${useTechRelaxation ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">テクノロジー導入による 3:0.9 緩和を適用</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">特定施設・サ高住(介護型)のみ。テクノロジー機器導入+委員会設置等の要件が必要(令和6年4月改正)</p>
                </div>
              </div>
            )}

            {showYakanToggle && (
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => { setUseYakanRelaxation(!useYakanRelaxation); setResult(null); }}
                  className={`relative mt-0.5 w-9 h-5 rounded-full transition-colors flex-shrink-0 ${useYakanRelaxation ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  role="switch"
                  aria-checked={useYakanRelaxation}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${useYakanRelaxation ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">夜勤 1.6人緩和を適用</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">特養・老健・ショートステイ。見守り機器100%導入等の要件が必要(令和6年4月改正)</p>
                </div>
              </div>
            )}

            {showKangoToggle && (
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => { setShowKangoInternals(!showKangoInternals); setResult(null); }}
                  className={`relative mt-0.5 w-9 h-5 rounded-full transition-colors flex-shrink-0 ${showKangoInternals ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  role="switch"
                  aria-checked={showKangoInternals}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${showKangoInternals ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">看護職員の目安人数（老健 約2/7）を表示</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">老健の看護職員は介護+看護合計の約2/7が目安</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculate Button */}
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <Icons.Calc />
          必要介護職員数を計算する
        </button>
      </section>

      {/* Result Card */}
      {result && (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-5 space-y-4">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">計算結果</h2>

          {/* Main number */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">日中 介護+看護 合計（常勤換算）</p>
            <p className="text-6xl font-bold text-blue-600 dark:text-blue-400">
              {result.dayTotal}<span className="text-2xl ml-2 text-gray-600 dark:text-gray-400">人</span>
            </p>
            {result.usedTechRelaxation && (
              <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full px-2 py-0.5">
                テクノロジー緩和 3:0.9 適用済
              </span>
            )}
          </div>

          {/* Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400 font-medium text-xs">項目</th>
                  <th className="text-right py-2 px-2 text-gray-600 dark:text-gray-400 font-medium text-xs">人数</th>
                  <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400 font-medium text-xs">備考</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                <tr>
                  <td className="py-2 px-2 text-gray-700 dark:text-gray-300">日中 介護+看護 合計</td>
                  <td className="py-2 px-2 text-right font-semibold text-gray-900 dark:text-white">{result.dayTotal}人</td>
                  <td className="py-2 px-2 text-gray-500 dark:text-gray-400 text-xs">
                    {result.isDayService
                      ? result.userCount <= 15
                        ? `${result.userCount}名(15名以内)→1人`
                        : `1+ceil((${result.userCount}-15)÷5)=${result.dayTotal}人`
                      : result.usedTechRelaxation
                        ? `ceil(${result.userCount}÷${(3 / 0.9).toFixed(2)})=${result.dayTotal}人`
                        : `ceil(${result.userCount}÷3)=${result.dayTotal}人`
                    }
                  </td>
                </tr>
                {result.nurseEstimate !== null && (
                  <tr>
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300 pl-5">└ うち看護職員 約2/7</td>
                    <td className="py-2 px-2 text-right font-semibold text-gray-900 dark:text-white">約{result.nurseEstimate}人</td>
                    <td className="py-2 px-2 text-gray-500 dark:text-gray-400 text-xs">老健の目安(ceil({result.dayTotal}×2÷7))</td>
                  </tr>
                )}
                {result.yakanPerson !== null ? (
                  <tr>
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300">夜勤</td>
                    <td className="py-2 px-2 text-right font-semibold text-gray-900 dark:text-white">
                      {result.isGH ? `${result.yakanPerson}人` : `${result.yakanPerson}人以上`}
                    </td>
                    <td className="py-2 px-2 text-gray-500 dark:text-gray-400 text-xs">
                      {result.isGH
                        ? `${result.unitCount}ユニット×1人`
                        : result.usedYakanRelaxation
                          ? '夜勤緩和1.6人適用'
                          : '基本夜勤体制'
                      }
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300">夜勤</td>
                    <td className="py-2 px-2 text-right text-gray-500 dark:text-gray-400">—</td>
                    <td className="py-2 px-2 text-gray-500 dark:text-gray-400 text-xs">通所型のため夜間配置なし</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Other roles */}
          {result.roles.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">その他の必要職種</p>
              <div className="space-y-1">
                {result.roles.map((r) => (
                  <div key={r.id} className="flex items-start gap-1 text-xs">
                    <span className="text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">•</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300 shrink-0">{r.label}:</span>
                    <span className="text-gray-600 dark:text-gray-400">{r.ratio}</span>
                    {r.note && <span className="text-gray-400 dark:text-gray-500">({r.note})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shift memo */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">💡 シフト計算の目安</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              24時間運営 ÷ 1人8時間勤務 = 約3交代必要。<strong>実際の雇用人数は計算結果の2.0〜2.5倍</strong>が現実的な目安です（有給・病欠・研修等を加味）。
            </p>
          </div>

          {/* R8年6月改定 warning */}
          <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <Icons.Warning />
            <div>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">令和8年6月期中改定</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                処遇改善加算 Ⅰロ・Ⅱロ（上位区分）取得には、<strong>生産性向上推進体制加算(Ⅱ)以上が前提条件</strong>です。ICT機器導入+委員会設置が必要になります。
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 print-hide">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {copied ? <><Icons.Check /><span>コピー済み</span></> : <><Icons.Copy /><span>結果をコピー</span></>}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Icons.Printer /><span>印刷</span>
            </button>
          </div>
        </section>
      )}

      {/* SEO Table */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">令和8年度 介護施設配置基準 早見表</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-blue-50 dark:bg-blue-900/30 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">施設種別</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">介護+看護比率</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">夜勤</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">テクノロジー緩和</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {SEO_TABLE_DATA.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-700/30'}>
                  <td className="py-2 px-3 font-medium text-gray-800 dark:text-gray-200">{row.shisetsu}</td>
                  <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{row.ratio}</td>
                  <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{row.yakan}</td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{row.tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">令和8年度現在。テクノロジー導入要件あり。</p>
      </section>

      {/* 計算式の解説 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">計算式の解説</h2>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">基本計算式（特養・老健・有料老人ホーム等）</p>
            <code className="text-sm text-blue-700 dark:text-blue-300">必要人数 = ceil(利用者数 ÷ 3)</code>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">介護職員+看護職員 合計の常勤換算で計算。</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">デイサービス（通所介護）</p>
            <code className="text-sm text-blue-700 dark:text-blue-300">15名まで1人 + ceil((利用者数 - 15) ÷ 5)</code>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">利用者15名以内は1人、超過分は5:1で追加。</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">テクノロジー緩和適用時（特定施設・サ高住介護型）</p>
            <code className="text-sm text-blue-700 dark:text-blue-300">必要人数 = ceil(利用者数 × 0.9 ÷ 3)</code>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3:0.9 = 1人あたり3÷0.9 ≈ 3.33名を担当。60名なら18人。</p>
          </div>
        </div>
      </section>

      {/* 改正タイムライン */}
      <section className="print-hide">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">令和6年/令和8年改定の影響</h2>
        <div className="space-y-3">
          {[
            { date: '令和6年4月', title: '特定施設 3:0.9 緩和新設', desc: 'テクノロジー機器導入+委員会設置等で、有料老人ホーム・サ高住の配置を実質10%減に緩和可能に。' },
            { date: '令和6年4月', title: '老健・特養・ショートステイ 夜勤 1.6人緩和新設', desc: '見守り機器100%導入等の要件充足で夜勤2名→1.6名(常勤換算)に緩和可能に。' },
            { date: '令和6年4月', title: '生産性向上推進体制加算 新設', desc: '加算(Ⅰ)月100単位・加算(Ⅱ)月10単位。テクノロジー導入+委員会+データ報告が要件。' },
            { date: '令和8年6月', title: '処遇改善加算 Ⅰロ・Ⅱロ 新設', desc: '上位区分取得に生産性向上推進体制加算(Ⅱ)が前提条件に。介護従事者全体への賃上げ拡大。' },
            { date: '令和8年度末', title: '生産性向上委員会 経過措置終了', desc: '委員会設置の3年努力義務終了。全事業所で委員会設置が完全義務化。' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 w-24 text-xs text-blue-700 dark:text-blue-400 font-semibold pt-0.5">{item.date}</div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Callout */}
      <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl p-5 print-hide">
        <p className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-1">📖 詳しい解説記事はこちら</p>
        <p className="text-xs text-sky-700 dark:text-sky-400 mb-3">
          3:1の正確な意味・常勤換算の計算方法・全8施設の詳細・令和8年6月期中改定・生産性向上推進体制加算の取得要件・指定取消ペナルティまで完全網羅。
        </p>
        <a
          href="/blog/kaigo-shokuin-haichi-kijun-guide"
          className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 dark:text-sky-300 hover:underline"
        >
          介護職員配置基準の完全ガイド【令和8年度版】を読む →
        </a>
      </div>

      {/* FAQ */}
      <section className="print-hide">
        <FAQSection faq={FAQ_ITEMS} title="よくある質問" />
      </section>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center print-hide pb-4">
        ※本ツールの計算結果は参考値です。正確な配置基準は都道府県・市区町村・国の指定機関にご確認ください。
      </p>
    </div>
  );
}
