'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ExpertSupervision from '@/components/ExpertSupervision';

// ============================================================
// Inline SVG Icons
// ============================================================
const Icons = {
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  ),
  CheckSquare: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>
  ),
  Square: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
  ),
  AlertTriangle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  ExternalLink: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
  ),
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
  ),
};

// ============================================================
// Date helpers
// ============================================================
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}年${Number(m)}月${Number(d)}日`;
}

function formatDateShort(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function getDaysUntil(deadline: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  return Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// ============================================================
// Filing definitions
// ============================================================
type UrgencyLevel = 'critical' | 'urgent' | 'normal' | 'optional';
type FilingCategory = 'tax' | 'social' | 'labor' | 'other';

interface Filing {
  id: string;
  category: FilingCategory;
  title: string;
  destination: string;
  deadlineLabel: string;
  deadlineDate: Date;
  documents: string[];
  note: string;
  urgency: UrgencyLevel;
  employeesOnly: boolean;
  link?: string;
}

function generateFilings(setsuritsuDate: Date, hasEmployees: boolean): Filing[] {
  const filings: Filing[] = [];

  // ── 税務署 ──

  filings.push({
    id: 'houjin-setsuritsu-todoke',
    category: 'tax',
    title: '法人設立届出書',
    destination: '管轄の税務署',
    deadlineLabel: '設立日から2か月以内',
    deadlineDate: addMonths(setsuritsuDate, 2),
    documents: ['法人設立届出書', '定款の写し', '登記事項証明書', '株主名簿', '設立時の貸借対照表'],
    note: '届出が遅れても罰則はありませんが、早めの提出を推奨。e-Taxで電子申告も可能。',
    urgency: 'normal',
    employeesOnly: false,
    link: 'https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/hojin/annai/1554_2.htm',
  });

  filings.push({
    id: 'aoiro-shinsei',
    category: 'tax',
    title: '青色申告承認申請書',
    destination: '管轄の税務署',
    deadlineLabel: '設立日から3か月以内',
    deadlineDate: addMonths(setsuritsuDate, 3),
    documents: ['青色申告の承認申請書'],
    note: '期限を過ぎると初年度は白色申告に。欠損金の繰越控除（10年）が使えなくなるため、必ず期限内に提出。',
    urgency: 'urgent',
    employeesOnly: false,
    link: 'https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/hojin/annai/1554_14.htm',
  });

  filings.push({
    id: 'kyuyo-jimusho',
    category: 'tax',
    title: '給与支払事務所等の開設届出書',
    destination: '管轄の税務署',
    deadlineLabel: '設立日から1か月以内',
    deadlineDate: addMonths(setsuritsuDate, 1),
    documents: ['給与支払事務所等の開設届出書'],
    note: '役員報酬を支払う場合は必ず提出。従業員がいなくても、役員への報酬があれば必要。',
    urgency: 'urgent',
    employeesOnly: false,
    link: 'https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/gensen/annai/1648_11.htm',
  });

  filings.push({
    id: 'gensen-tokurei',
    category: 'tax',
    title: '源泉所得税の納期の特例の承認に関する申請書',
    destination: '管轄の税務署',
    deadlineLabel: '設立後速やかに（任意）',
    deadlineDate: addMonths(setsuritsuDate, 3),
    documents: ['源泉所得税の納期の特例の承認に関する申請書'],
    note: '給与の支給人員が常時10人未満の場合に申請可能。源泉所得税の納付を年2回にまとめられる。',
    urgency: 'optional',
    employeesOnly: false,
    link: 'https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/gensen/annai/1648_14.htm',
  });

  // ── 都道府県・市区町村 ──

  filings.push({
    id: 'todofuken-todoke',
    category: 'tax',
    title: '法人設立届出書（都道府県）',
    destination: '都道府県税事務所',
    deadlineLabel: '設立日から15日〜2か月以内（都道府県により異なる）',
    deadlineDate: addMonths(setsuritsuDate, 2),
    documents: ['法人設立届出書（都道府県用）', '定款の写し', '登記事項証明書'],
    note: '東京都は設立日から15日以内。他の道府県は1〜2か月以内が一般的。各自治体のHPで確認。',
    urgency: 'normal',
    employeesOnly: false,
  });

  filings.push({
    id: 'shichoson-todoke',
    category: 'tax',
    title: '法人設立届出書（市区町村）',
    destination: '市区町村役場',
    deadlineLabel: '設立日から2か月以内（自治体により異なる）',
    deadlineDate: addMonths(setsuritsuDate, 2),
    documents: ['法人設立届出書（市区町村用）', '定款の写し', '登記事項証明書'],
    note: '東京23区は都税事務所への届出のみで市区町村への届出は不要。',
    urgency: 'normal',
    employeesOnly: false,
  });

  // ── 社会保険（年金事務所）──

  filings.push({
    id: 'shakai-hoken-shinki',
    category: 'social',
    title: '健康保険・厚生年金保険 新規適用届',
    destination: '管轄の年金事務所',
    deadlineLabel: '事実発生から5日以内',
    deadlineDate: addDays(setsuritsuDate, 5),
    documents: ['新規適用届', '登記事項証明書（原本）', '法人番号指定通知書のコピー'],
    note: '法人は役員1名でも加入義務あり。届出が遅れると設立日に遡って適用される。e-Govで電子申請可能。',
    urgency: 'critical',
    employeesOnly: false,
  });

  filings.push({
    id: 'hihokensha-shutoku',
    category: 'social',
    title: '被保険者資格取得届',
    destination: '管轄の年金事務所',
    deadlineLabel: '事実発生から5日以内',
    deadlineDate: addDays(setsuritsuDate, 5),
    documents: ['被保険者資格取得届', 'マイナンバー確認書類'],
    note: '新規適用届と同時に提出。役員・従業員それぞれについて届出が必要。',
    urgency: 'critical',
    employeesOnly: false,
  });

  filings.push({
    id: 'hifuyousha-todoke',
    category: 'social',
    title: '被扶養者（異動）届',
    destination: '管轄の年金事務所',
    deadlineLabel: '事実発生から5日以内',
    deadlineDate: addDays(setsuritsuDate, 5),
    documents: ['被扶養者（異動）届', '収入確認書類'],
    note: '扶養家族がいる場合のみ。配偶者・子どもなどの扶養認定手続き。',
    urgency: 'urgent',
    employeesOnly: false,
  });

  // ── 労働保険（労基署・ハローワーク）── 従業員ありのみ

  if (hasEmployees) {
    filings.push({
      id: 'roudou-hoken-seiritsu',
      category: 'labor',
      title: '保険関係成立届',
      destination: '管轄の労働基準監督署',
      deadlineLabel: '従業員雇用から10日以内',
      deadlineDate: addDays(setsuritsuDate, 10),
      documents: ['保険関係成立届', '登記事項証明書'],
      note: '従業員を1人でも雇用したら届出義務あり。労災保険の適用開始。',
      urgency: 'critical',
      employeesOnly: true,
    });

    filings.push({
      id: 'tekiyou-jigyousho',
      category: 'labor',
      title: '適用事業報告書',
      destination: '管轄の労働基準監督署',
      deadlineLabel: '従業員雇用後遅滞なく',
      deadlineDate: addDays(setsuritsuDate, 10),
      documents: ['適用事業報告書'],
      note: '保険関係成立届と同時に提出。労働条件の概要を報告。',
      urgency: 'urgent',
      employeesOnly: true,
    });

    filings.push({
      id: 'roudou-hoken-gaizan',
      category: 'labor',
      title: '概算保険料申告書',
      destination: '管轄の労働基準監督署 または 都道府県労働局',
      deadlineLabel: '保険関係成立から50日以内',
      deadlineDate: addDays(setsuritsuDate, 50),
      documents: ['概算保険料申告書'],
      note: '労働保険料の概算を申告・納付。保険関係成立届の後に提出。',
      urgency: 'normal',
      employeesOnly: true,
    });

    filings.push({
      id: 'koyou-hoken-setchi',
      category: 'labor',
      title: '雇用保険 適用事業所設置届',
      destination: '管轄のハローワーク',
      deadlineLabel: '従業員雇用から10日以内',
      deadlineDate: addDays(setsuritsuDate, 10),
      documents: ['雇用保険適用事業所設置届', '登記事項証明書', '保険関係成立届の控え'],
      note: '労基署への届出後にハローワークへ提出。',
      urgency: 'critical',
      employeesOnly: true,
    });

    filings.push({
      id: 'koyou-hoken-shutoku',
      category: 'labor',
      title: '雇用保険 被保険者資格取得届',
      destination: '管轄のハローワーク',
      deadlineLabel: '翌月10日まで',
      deadlineDate: addDays(setsuritsuDate, 40),
      documents: ['雇用保険被保険者資格取得届'],
      note: '従業員ごとに届出。適用事業所設置届と同時提出可能。',
      urgency: 'urgent',
      employeesOnly: true,
    });
  }

  // Sort by deadline
  filings.sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());
  return filings;
}

// ============================================================
// Urgency helpers
// ============================================================
function getUrgencyLabel(u: UrgencyLevel): string {
  switch (u) {
    case 'critical': return '最優先';
    case 'urgent': return '重要';
    case 'normal': return '通常';
    case 'optional': return '任意';
  }
}

function getUrgencyColor(u: UrgencyLevel): string {
  switch (u) {
    case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    case 'urgent': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    case 'normal': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    case 'optional': return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  }
}

function getCategoryLabel(c: FilingCategory): string {
  switch (c) {
    case 'tax': return '税務';
    case 'social': return '社会保険';
    case 'labor': return '労働保険';
    case 'other': return 'その他';
  }
}

function getCategoryColor(c: FilingCategory): string {
  switch (c) {
    case 'tax': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
    case 'social': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400';
    case 'labor': return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400';
    case 'other': return 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  }
}

function getDaysColor(days: number): string {
  if (days < 0) return 'text-red-600 dark:text-red-400';
  if (days <= 7) return 'text-red-600 dark:text-red-400';
  if (days <= 30) return 'text-amber-600 dark:text-amber-400';
  return 'text-gray-500 dark:text-gray-400';
}

// ============================================================
// Main Component
// ============================================================
export default function SetsuritsuTodokeClient() {
  const [mounted, setMounted] = useState(false);
  const [setsuritsuDate, setSetsuritsuDate] = useState<string>('');
  const [hasEmployees, setHasEmployees] = useState<boolean>(false);
  const [filings, setFilings] = useState<Filing[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Default to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setSetsuritsuDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleGenerate = () => {
    if (!setsuritsuDate) return;
    const date = new Date(setsuritsuDate + 'T00:00:00');
    if (isNaN(date.getTime())) return;
    const result = generateFilings(date, hasEmployees);
    setFilings(result);
    setChecked({});
    setGenerated(true);
  };

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const totalCount = filings.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group by urgency timeline
  const groupByDeadline = () => {
    const groups: { label: string; color: string; items: Filing[] }[] = [];
    const within5 = filings.filter((f) => getDaysUntil(f.deadlineDate) <= 5);
    const within10 = filings.filter((f) => getDaysUntil(f.deadlineDate) <= 10 && !within5.includes(f));
    const within1m = filings.filter((f) => getDaysUntil(f.deadlineDate) <= 30 && !within5.includes(f) && !within10.includes(f));
    const within2m = filings.filter((f) => getDaysUntil(f.deadlineDate) <= 60 && !within5.includes(f) && !within10.includes(f) && !within1m.includes(f));
    const within3m = filings.filter((f) => getDaysUntil(f.deadlineDate) <= 90 && !within5.includes(f) && !within10.includes(f) && !within1m.includes(f) && !within2m.includes(f));
    const rest = filings.filter((f) => !within5.includes(f) && !within10.includes(f) && !within1m.includes(f) && !within2m.includes(f) && !within3m.includes(f));

    if (within5.length > 0) groups.push({ label: '5日以内（最優先）', color: 'border-red-400 dark:border-red-600', items: within5 });
    if (within10.length > 0) groups.push({ label: '10日以内', color: 'border-amber-400 dark:border-amber-600', items: within10 });
    if (within1m.length > 0) groups.push({ label: '1か月以内', color: 'border-yellow-400 dark:border-yellow-600', items: within1m });
    if (within2m.length > 0) groups.push({ label: '2か月以内', color: 'border-blue-400 dark:border-blue-600', items: within2m });
    if (within3m.length > 0) groups.push({ label: '3か月以内', color: 'border-purple-400 dark:border-purple-600', items: within3m });
    if (rest.length > 0) groups.push({ label: 'その他', color: 'border-gray-300 dark:border-gray-600', items: rest });

    return groups;
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
          <span className="text-gray-900 dark:text-gray-100">設立後届出ナビゲーター</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          設立後届出ナビゲーター
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          会社の設立日を入力するだけで、<strong>全届出の期限・届出先・必要書類</strong>を自動表示。
          チェックリスト形式で進捗を管理できます。
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
                <span className="flex items-center gap-1.5"><Icons.Calendar /> 会社の設立日</span>
              </label>
              <input
                type="date"
                value={setsuritsuDate}
                onChange={(e) => setSetsuritsuDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-1.5"><Icons.Building /> 従業員の有無</span>
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setHasEmployees(false)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${!hasEmployees ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                  役員のみ（従業員なし）
                </button>
                <button type="button" onClick={() => setHasEmployees(true)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${hasEmployees ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                  従業員あり
                </button>
              </div>
            </div>
          </div>

          <button type="button" onClick={handleGenerate}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
            <Icons.CheckSquare />
            届出チェックリストを作成する
          </button>
        </div>

        {/* ============================================================ */}
        {/* RESULTS */}
        {/* ============================================================ */}
        {generated && filings.length > 0 && (
          <div className="space-y-6 mb-12">

            {/* Progress bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">届出の進捗</h3>
                <span className="text-sm font-bold text-pink-600 dark:text-pink-400">{completedCount} / {totalCount} 完了</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-pink-400 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {completedCount === totalCount && totalCount > 0 && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                  🎉 全ての届出が完了しました！
                </p>
              )}
            </div>

            {/* Filing groups */}
            {groupByDeadline().map((group) => (
              <div key={group.label} className={`bg-white dark:bg-gray-800 rounded-2xl border-l-4 ${group.color} border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm`}>
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-1.5">
                    <Icons.Clock />
                    {group.label}
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {group.items.map((filing) => {
                    const isChecked = checked[filing.id] || false;
                    const daysUntil = getDaysUntil(filing.deadlineDate);
                    return (
                      <div
                        key={filing.id}
                        className={`px-6 py-4 transition-all ${isChecked ? 'bg-emerald-50/50 dark:bg-emerald-900/5' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleCheck(filing.id)}
                            className={`mt-0.5 shrink-0 transition-colors ${isChecked ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600 hover:text-pink-400'}`}
                          >
                            {isChecked ? <Icons.CheckSquare /> : <Icons.Square />}
                          </button>

                          <div className="flex-1 min-w-0">
                            {/* Title row */}
                            <div className="flex items-center flex-wrap gap-2 mb-1">
                              <span className={`font-bold text-sm ${isChecked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                                {filing.title}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getUrgencyColor(filing.urgency)}`}>
                                {getUrgencyLabel(filing.urgency)}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(filing.category)}`}>
                                {getCategoryLabel(filing.category)}
                              </span>
                              {filing.employeesOnly && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium">従業員あり</span>
                              )}
                            </div>

                            {/* Destination */}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                              届出先: <span className="font-medium text-gray-700 dark:text-gray-300">{filing.destination}</span>
                            </p>

                            {/* Deadline */}
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                期限: <span className="font-medium text-gray-700 dark:text-gray-300">{formatDate(filing.deadlineDate)}</span>
                                <span className="ml-1">（{filing.deadlineLabel}）</span>
                              </span>
                              {!isChecked && (
                                <span className={`text-xs font-bold ${getDaysColor(daysUntil)}`}>
                                  {daysUntil < 0 ? `${Math.abs(daysUntil)}日超過` : daysUntil === 0 ? '本日期限' : `あと${daysUntil}日`}
                                </span>
                              )}
                            </div>

                            {/* Documents */}
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                              必要書類: {filing.documents.join('、')}
                            </div>

                            {/* Note */}
                            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{filing.note}</p>

                            {/* Link */}
                            {filing.link && (
                              <a
                                href={filing.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 mt-1.5 font-medium"
                              >
                                国税庁の様式ページ <Icons.ExternalLink />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Disclaimer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• 届出期限は一般的な規定に基づく目安です。自治体により異なる場合があります。</li>
                <li>• チェック状態はブラウザを閉じるとリセットされます。重要な期限はカレンダーに登録してください。</li>
                <li>• 業種により追加の届出（建設業許可、飲食店営業許可等）が必要な場合があります。</li>
                <li>• 消費税の届出（課税事業者選択届出書、簡易課税制度選択届出書等）は、事業内容に応じて別途検討が必要です。</li>
              </ul>
            </div>

            {/* Related tools */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/business/setsuritsu-hiyo', label: '会社設立費用シミュレーター', desc: '設立にかかる初期費用を計算' },
                  { href: '/business/houjin-iji-hiyo', label: '法人維持費シミュレーター', desc: '年間ランニングコストの全体像' },
                  { href: '/business/kesanki-sim', label: '決算期シミュレーター', desc: '最適な決算月を自動判定' },
                  { href: '/calculator/yakuin-hoshu', label: '役員報酬最適化', desc: '手取りを最大化する報酬額を計算' },
                  { href: '/business/houjin-search', label: '法人番号検索', desc: '設立済み法人の情報を検索' },
                  { href: '/document/invoice', label: '請求書作成', desc: '法人としての最初の請求書を作成' },
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
        {/* 監修・出典 */}
        <div className="max-w-4xl mx-auto px-4 mb-8" style={{maxWidth: '100%'}}>
          <ExpertSupervision
            sources={[{ name: '国税庁 法人設立届出書', url: 'https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/hojin/annai/1554_2.htm' }, { name: '日本年金機構 新規適用届', url: 'https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150518.html' }, { name: 'ハローワーク 雇用保険手続', url: 'https://www.hellowork.mhlw.go.jp/' }]}
            lastUpdated="2026年5月"
            nextReview="2026年度税制改正反映後"
            trustNote="本ツールの計算結果は概算です。正確な金額は税理士・社労士等の専門家にご確認ください。"
          />
        </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '届出が遅れたらどうなりますか？',
                a: '届出の種類によります。法人設立届出書は遅れても罰則はありませんが、青色申告承認申請書は期限を過ぎると初年度は白色申告となり、欠損金の繰越控除（10年間）ができなくなります。社会保険の届出は遅れても設立日に遡って適用されるため、遡及分の保険料が発生します。',
              },
              {
                q: '届出は全て自分でできますか？',
                a: 'はい、全ての届出は自分で行うことが可能です。国税庁のe-Tax（電子申告）や年金事務所のe-Gov（電子申請）を利用すれば、オンラインでの提出もできます。ただし不安な場合は税理士・社労士に依頼することを推奨します。',
              },
              {
                q: '従業員を後から雇う場合はどうする？',
                a: '従業員を雇用した時点で、労働基準監督署への保険関係成立届（10日以内）、ハローワークへの雇用保険適用事業所設置届（10日以内）の届出が必要になります。社会保険は法人設立時に加入済みなので、被保険者資格取得届の追加のみで済みます。',
              },
              {
                q: '東京23区の場合、市区町村への届出は必要？',
                a: '東京23区（特別区）の場合、都税事務所への届出のみで、市区町村への法人設立届出書は不要です。23区以外の東京都（市部）は通常通り市役所への届出が必要です。',
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
