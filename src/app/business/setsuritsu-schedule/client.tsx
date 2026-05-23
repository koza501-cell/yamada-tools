'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================
// Inline SVG Icons
// ============================================================
const Icons = {
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  AlertTriangle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
};

// ============================================================
// Japanese holidays (2025-2027)
// ============================================================
const HOLIDAYS: string[] = [
  // 2025
  '2025-01-01','2025-01-02','2025-01-03','2025-01-13','2025-02-11','2025-02-23','2025-02-24',
  '2025-03-20','2025-04-29','2025-05-03','2025-05-04','2025-05-05','2025-05-06',
  '2025-07-21','2025-08-11','2025-09-15','2025-09-23',
  '2025-10-13','2025-11-03','2025-11-23','2025-11-24',
  '2025-12-29','2025-12-30','2025-12-31',
  // 2026
  '2026-01-01','2026-01-02','2026-01-03','2026-01-12','2026-02-11','2026-02-23',
  '2026-03-20','2026-04-29','2026-05-03','2026-05-04','2026-05-05','2026-05-06',
  '2026-07-20','2026-08-11','2026-09-21','2026-09-22','2026-09-23',
  '2026-10-12','2026-11-03','2026-11-23',
  '2026-12-29','2026-12-30','2026-12-31',
  // 2027
  '2027-01-01','2027-01-02','2027-01-03','2027-01-11','2027-02-11','2027-02-23',
  '2027-03-21','2027-03-22','2027-04-29','2027-05-03','2027-05-04','2027-05-05',
  '2027-07-19','2027-08-11','2027-09-20','2027-09-23',
  '2027-10-11','2027-11-03','2027-11-23',
];

function isHoliday(date: Date): boolean {
  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return HOLIDAYS.includes(key);
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isBusinessDay(date: Date): boolean {
  return !isWeekend(date) && !isHoliday(date);
}

// Get previous business day (or same if already business day)
function ensureBusinessDay(date: Date): Date {
  const d = new Date(date);
  while (!isBusinessDay(d)) {
    d.setDate(d.getDate() - 1);
  }
  return d;
}

// Subtract N business days
function subtractBusinessDays(date: Date, days: number): Date {
  const d = new Date(date);
  let count = 0;
  while (count < days) {
    d.setDate(d.getDate() - 1);
    if (isBusinessDay(d)) count++;
  }
  return d;
}

// Subtract N calendar days
function subtractCalendarDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}

const WEEKDAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

function formatDateJP(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = WEEKDAY_NAMES[date.getDay()];
  return `${y}年${m}月${d}日（${w}）`;
}

function formatDateShort(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}（${WEEKDAY_NAMES[date.getDay()]}）`;
}

// ============================================================
// Schedule step definition
// ============================================================
interface ScheduleStep {
  id: string;
  phase: string;
  title: string;
  date: Date;
  duration: string;
  detail: string;
  tip: string;
  isKey: boolean; // highlight as key milestone
}

type CompanyType = 'kk' | 'gk';

function generateSchedule(targetDate: Date, companyType: CompanyType): ScheduleStep[] {
  // Target = 法務局への登記申請日 = 設立日 (must be business day)
  const registrationDay = ensureBusinessDay(targetDate);

  const steps: ScheduleStep[] = [];

  if (companyType === 'kk') {
    // ── 株式会社 schedule ──
    // Day 0: 登記申請（設立日）
    steps.push({
      id: 'touki-shinsei', phase: '登記', title: '法務局へ登記申請（＝設立日）',
      date: registrationDay, duration: '当日',
      detail: '登記申請書・定款・払込証明書・印鑑届出書等を提出。オンライン申請も可能。',
      tip: 'この日が会社の「設立日」になります。大安を選ぶ方も多いです。',
      isKey: true,
    });

    // -1 BD: 資本金の払込み
    const paymentDay = subtractBusinessDays(registrationDay, 1);
    steps.push({
      id: 'shihonkin-harai', phase: '登記準備', title: '資本金の払込み',
      date: paymentDay, duration: '1日',
      detail: '発起人の個人口座に資本金を振り込み。通帳コピーまたはネットバンキングの明細を証明書として用意。',
      tip: '振込名義が発起人名と一致していることを確認。残高ではなく「振込」の記録が必要。',
      isKey: false,
    });

    // -2 BD: 登記書類の最終準備
    const docPrepDay = subtractBusinessDays(registrationDay, 2);
    steps.push({
      id: 'touki-shorui', phase: '登記準備', title: '登記書類の最終準備',
      date: docPrepDay, duration: '1〜2日',
      detail: '登記申請書、払込証明書、就任承諾書、印鑑届出書等の最終チェック・製本。',
      tip: 'freee会社設立やマネーフォワードを使えば書類を自動生成できます。',
      isKey: false,
    });

    // -5 BD: 定款認証（公証役場）
    const teikanNinshoDay = subtractBusinessDays(registrationDay, 5);
    steps.push({
      id: 'teikan-ninsho', phase: '定款認証', title: '公証役場で定款認証',
      date: teikanNinshoDay, duration: '当日（30分〜1時間）',
      detail: '公証人による定款の認証。電子定款の場合はオンライン認証も可能。本店所在地の都道府県内の公証役場で手続き。',
      tip: '事前に公証人と定款内容の事前チェック（FAX・メール）を済ませておくとスムーズ。',
      isKey: true,
    });

    // -7 BD: 公証役場への予約
    const koushouYoyakuDay = subtractBusinessDays(registrationDay, 7);
    steps.push({
      id: 'koushou-yoyaku', phase: '定款認証', title: '公証役場の予約',
      date: koushouYoyakuDay, duration: '電話5分',
      detail: '公証役場に電話で認証の予約を入れる。定款のドラフトをFAX/メールで事前送付。',
      tip: '3月・4月は混み合います。早めの予約を推奨。',
      isKey: false,
    });

    // -8 BD: 定款の作成完了
    const teikanCompleteDay = subtractBusinessDays(registrationDay, 8);
    steps.push({
      id: 'teikan-sakusei', phase: '定款作成', title: '定款の作成完了',
      date: teikanCompleteDay, duration: '2〜3日',
      detail: '商号・事業目的・本店所在地・資本金・発起人・取締役等を記載した定款を作成。',
      tip: '事業目的ジェネレーターで事業目的を作成できます。',
      isKey: false,
    });

    // -9 BD: 印鑑の発注
    const inkanDay = subtractBusinessDays(registrationDay, 9);
    steps.push({
      id: 'inkan-hacchuu', phase: '準備', title: '法人印鑑の発注',
      date: inkanDay, duration: '到着まで3〜5営業日',
      detail: '代表印（実印）・銀行印・角印の3本セットを発注。ネット注文が安い（5,000〜15,000円）。',
      tip: '急ぎの場合は即日出荷対応のショップを利用。',
      isKey: false,
    });

    // -10 BD: 商号調査・事業目的の確定
    const shougouDay = subtractBusinessDays(registrationDay, 10);
    steps.push({
      id: 'shougou-chousa', phase: '準備', title: '商号調査・事業目的の確定',
      date: shougouDay, duration: '1日',
      detail: '法務局のオンライン検索で同一商号がないか確認。事業目的・本店所在地を確定。',
      tip: '同一住所に同一商号の法人がなければOK。類似商号は2006年の改正で問題なくなりました。',
      isKey: false,
    });

    // -12 BD: 準備開始
    const startDay = subtractBusinessDays(registrationDay, 12);
    steps.push({
      id: 'junbi-kaishi', phase: '準備', title: '準備開始（全体計画）',
      date: startDay, duration: '—',
      detail: '会社形態・資本金額・事業目的・本店所在地・決算期を決定。必要書類の一覧を確認。',
      tip: '会社形態診断ツール・資本金決定ガイド・決算期シミュレーターで事前に決めておくとスムーズ。',
      isKey: true,
    });

  } else {
    // ── 合同会社 schedule （定款認証不要で短い）──
    steps.push({
      id: 'touki-shinsei', phase: '登記', title: '法務局へ登記申請（＝設立日）',
      date: registrationDay, duration: '当日',
      detail: '登記申請書・定款・払込証明書・印鑑届出書等を提出。',
      tip: 'この日が会社の「設立日」になります。',
      isKey: true,
    });

    const paymentDay = subtractBusinessDays(registrationDay, 1);
    steps.push({
      id: 'shihonkin-harai', phase: '登記準備', title: '資本金の払込み',
      date: paymentDay, duration: '1日',
      detail: '社員（出資者）の個人口座に資本金を振り込み。',
      tip: '合同会社は「社員」＝出資者です（従業員ではない）。',
      isKey: false,
    });

    const docPrepDay = subtractBusinessDays(registrationDay, 2);
    steps.push({
      id: 'touki-shorui', phase: '登記準備', title: '登記書類の最終準備',
      date: docPrepDay, duration: '1〜2日',
      detail: '登記申請書、定款、払込証明書、代表社員就任承諾書、印鑑届出書の最終チェック。',
      tip: '合同会社は定款認証不要のため、書類が少なくシンプル。',
      isKey: false,
    });

    const teikanDay = subtractBusinessDays(registrationDay, 4);
    steps.push({
      id: 'teikan-sakusei', phase: '定款作成', title: '定款の作成完了',
      date: teikanDay, duration: '1〜2日',
      detail: '合同会社の定款を作成。公証役場での認証は不要。電子定款にすれば印紙代4万円が不要。',
      tip: '電子定款の作成はfreee会社設立などの無料サービスが便利。',
      isKey: true,
    });

    const inkanDay = subtractBusinessDays(registrationDay, 5);
    steps.push({
      id: 'inkan-hacchuu', phase: '準備', title: '法人印鑑の発注',
      date: inkanDay, duration: '到着まで3〜5営業日',
      detail: '代表印（実印）・銀行印・角印の3本セットを発注。',
      tip: '合同会社は「合同会社○○ 代表社員之印」となります。',
      isKey: false,
    });

    const shougouDay = subtractBusinessDays(registrationDay, 6);
    steps.push({
      id: 'shougou-chousa', phase: '準備', title: '商号調査・事業目的の確定',
      date: shougouDay, duration: '1日',
      detail: '法務局で同一商号チェック。事業目的・本店所在地・決算期を確定。',
      tip: '「合同会社」は会社名の前後どちらにも付けられます。',
      isKey: false,
    });

    const startDay = subtractBusinessDays(registrationDay, 7);
    steps.push({
      id: 'junbi-kaishi', phase: '準備', title: '準備開始（全体計画）',
      date: startDay, duration: '—',
      detail: '資本金額・事業目的・本店所在地・決算期を決定。',
      tip: '合同会社は最短1週間程度で設立可能です。',
      isKey: true,
    });
  }

  // Sort chronologically (earliest first)
  steps.sort((a, b) => a.date.getTime() - b.date.getTime());
  return steps;
}

// ============================================================
// Main Component
// ============================================================
export default function SetsuritsuScheduleClient() {
  const [mounted, setMounted] = useState(false);
  const [targetDate, setTargetDate] = useState<string>('');
  const [companyType, setCompanyType] = useState<CompanyType>('kk');
  const [steps, setSteps] = useState<ScheduleStep[]>([]);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Default: 1 month from today
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setTargetDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleGenerate = () => {
    if (!targetDate) return;
    const date = new Date(targetDate + 'T00:00:00');
    if (isNaN(date.getTime())) return;
    const result = generateSchedule(date, companyType);
    setSteps(result);
    setGenerated(true);
  };

  // Check if target date is a business day
  const targetDateObj = targetDate ? new Date(targetDate + 'T00:00:00') : null;
  const isTargetBusinessDay = targetDateObj ? isBusinessDay(targetDateObj) : true;
  const adjustedDate = targetDateObj ? ensureBusinessDay(targetDateObj) : null;

  if (!mounted) {
    return <div className="min-h-screen py-12 flex items-center justify-center text-gray-500 dark:text-gray-400">読み込み中...</div>;
  }

  // Compute total calendar days
  const totalDays = generated && steps.length >= 2
    ? Math.ceil((steps[steps.length - 1].date.getTime() - steps[0].date.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-pink-500 transition-colors">ホーム</Link>
          <span className="mx-2">{'>'}</span>
          <Link href="/business" className="hover:text-pink-500 transition-colors">ビジネス・法人</Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-gray-900 dark:text-gray-100">設立スケジュールシミュレーター</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          設立スケジュールシミュレーター
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          設立希望日を入力するだけで、<strong>準備開始から登記申請までの全ステップの日程</strong>を
          土日祝日を考慮して自動逆算します。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* ============================================================ */}
        {/* INPUT */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-1.5"><Icons.Calendar /> 設立希望日</span>
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none"
              />
              {targetDateObj && !isTargetBusinessDay && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                  <Icons.AlertTriangle />
                  {formatDateJP(targetDateObj)}は{isWeekend(targetDateObj) ? '土日' : '祝日'}のため、直前の営業日
                  <strong className="ml-1">{adjustedDate ? formatDateShort(adjustedDate) : ''}</strong>に調整されます
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">会社の種類</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setCompanyType('kk')}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${companyType === 'kk' ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                  <span className="block font-bold">株式会社</span>
                  <span className="block text-xs text-gray-400 mt-0.5">約2〜3週間</span>
                </button>
                <button type="button" onClick={() => setCompanyType('gk')}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${companyType === 'gk' ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                  <span className="block font-bold">合同会社</span>
                  <span className="block text-xs text-gray-400 mt-0.5">約1〜2週間</span>
                </button>
              </div>
            </div>
          </div>

          <button type="button" onClick={handleGenerate}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
            <Icons.Calendar />
            スケジュールを作成する
          </button>
        </div>

        {/* ============================================================ */}
        {/* RESULTS */}
        {/* ============================================================ */}
        {generated && steps.length > 0 && (
          <div className="space-y-6 mb-12">

            {/* Summary */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-400 mb-1">準備開始日</p>
                  <p className="text-lg font-bold">{formatDateShort(steps[0].date)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">設立日（登記申請）</p>
                  <p className="text-lg font-bold text-pink-400">{formatDateShort(steps[steps.length - 1].date)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">全体期間</p>
                  <p className="text-lg font-bold">{totalDays}日間</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-1.5">
                  <Icons.Clock />
                  {companyType === 'kk' ? '株式会社' : '合同会社'}の設立スケジュール（{steps.length}ステップ）
                </h3>
              </div>

              <div className="relative">
                {steps.map((step, idx) => {
                  const isLast = idx === steps.length - 1;
                  const isFirst = idx === 0;
                  return (
                    <div key={step.id} className={`relative ${step.isKey ? 'bg-pink-50/50 dark:bg-pink-900/5' : ''}`}>
                      {/* Timeline line */}
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" style={{ display: isLast ? 'none' : 'block' }} />

                      <div className="flex gap-4 px-6 py-5">
                        {/* Timeline dot */}
                        <div className="relative z-10 shrink-0">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            step.isKey
                              ? 'border-pink-400 bg-pink-500'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                          }`}>
                            {step.isKey && <span className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <div>
                              <span className={`text-sm font-bold ${step.isKey ? 'text-pink-700 dark:text-pink-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                {step.title}
                              </span>
                              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                {step.phase}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{step.duration}</span>
                          </div>

                          {/* Date */}
                          <p className={`text-sm font-medium mb-1.5 ${step.isKey ? 'text-pink-600 dark:text-pink-400' : 'text-blue-600 dark:text-blue-400'}`}>
                            {formatDateJP(step.date)}
                          </p>

                          {/* Detail */}
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-1">{step.detail}</p>

                          {/* Tip */}
                          <p className="text-xs text-gray-400 dark:text-gray-500 italic flex items-start gap-1">
                            <span className="shrink-0 mt-0.5"><Icons.Info /></span>
                            {step.tip}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* KK vs GK comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-sm">株式会社 vs 合同会社 — 設立期間の比較</h3>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-2 text-gray-500 dark:text-gray-400 font-semibold text-xs">項目</th>
                      <th className="text-center py-2 px-2 text-blue-600 dark:text-blue-400 font-bold text-xs">株式会社</th>
                      <th className="text-center py-2 px-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">合同会社</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr>
                      <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300">全体期間（目安）</td>
                      <td className="py-2.5 px-2 text-center">2〜3週間</td>
                      <td className="py-2.5 px-2 text-center font-medium text-emerald-600 dark:text-emerald-400">1〜2週間</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300">定款認証</td>
                      <td className="py-2.5 px-2 text-center">必要（公証役場）</td>
                      <td className="py-2.5 px-2 text-center font-medium text-emerald-600 dark:text-emerald-400">不要</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300">ステップ数</td>
                      <td className="py-2.5 px-2 text-center">9</td>
                      <td className="py-2.5 px-2 text-center font-medium text-emerald-600 dark:text-emerald-400">7</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300">最短設立</td>
                      <td className="py-2.5 px-2 text-center">約10営業日</td>
                      <td className="py-2.5 px-2 text-center font-medium text-emerald-600 dark:text-emerald-400">約5営業日</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300">費用</td>
                      <td className="py-2.5 px-2 text-center">約20万円</td>
                      <td className="py-2.5 px-2 text-center font-medium text-emerald-600 dark:text-emerald-400">約6万円</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• スケジュールは標準的な手続き期間に基づく目安です。専門家への依頼や個別の事情により短縮・延長する場合があります。</li>
                <li>• 法務局での登記処理には申請後1〜2週間かかりますが、設立日は申請日です。</li>
                <li>• 祝日データは2025〜2027年の日本の国民の祝日を含みます。法務局の年末年始閉庁（12/29〜1/3）も考慮しています。</li>
                <li>• 登記完了後の届出（税務署・年金事務所等）は設立後届出ナビゲーターで確認できます。</li>
              </ul>
            </div>

            {/* Related tools */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/business/setsuritsu-hiyo', label: '会社設立費用シミュレーター', desc: '設立にかかる費用を計算' },
                  { href: '/business/kaisha-shindan', label: '会社形態診断ツール', desc: 'KK vs GK — 最適な形態を診断' },
                  { href: '/business/kesanki-sim', label: '決算期シミュレーター', desc: '最適な決算月を判定' },
                  { href: '/business/setsuritsu-todoke', label: '設立後届出ナビゲーター', desc: '届出先・期限・書類を自動表示' },
                  { href: '/business/shihonkin-guide', label: '資本金決定ガイド', desc: '最適な資本金額を算出' },
                  { href: '/business/jigyou-mokuteki', label: '事業目的ジェネレーター', desc: '定款の事業目的を自動生成' },
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
        {/* FAQ */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '設立日を「大安」にしたいのですが？',
                a: '設立日は法務局に登記申請した日になります。大安や記念日に合わせて登記申請することは一般的です。ただし法務局の営業日（平日）である必要があります。',
              },
              {
                q: '最短で何日で設立できますか？',
                a: '合同会社なら最短1週間程度で設立可能です。株式会社は定款認証が必要なため、最短でも2週間程度かかります。オンラインサービス（freee会社設立等）を利用し、専門家に依頼すれば短縮できます。',
              },
              {
                q: '年末年始・GW・お盆は設立できる？',
                a: '法務局が閉庁する年末年始（12/29〜1/3）は登記申請ができません。GWやお盆は祝日以外の平日であれば申請可能です。ただし公証役場も同様に閉庁するため、定款認証が必要な株式会社は注意が必要です。',
              },
              {
                q: '1月1日を設立日にできる？',
                a: '1月1日は祝日で法務局が閉庁しているため、1月1日を設立日にすることは原則できません。ただし12月下旬に登記申請し、登記完了が1月になっても、設立日は申請日（12月の平日）です。',
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
