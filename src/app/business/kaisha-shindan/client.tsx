'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================
// Inline SVG Icons
// ============================================================
const Icons = {
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Landmark: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Trophy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
  ),
  RotateCcw: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
  ),
};

// ============================================================
// Quiz Data
// ============================================================
interface QuizOption {
  label: string;
  scores: { kk: number; gk: number; shadan: number; kojin: number };
}

interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '事業の主な目的は？',
    subtitle: '活動の方向性を教えてください',
    options: [
      { label: '利益を追求するビジネス', scores: { kk: 3, gk: 3, shadan: 0, kojin: 2 } },
      { label: '非営利・社会貢献・業界団体', scores: { kk: 0, gk: 0, shadan: 5, kojin: 0 } },
      { label: 'フリーランス・個人の延長', scores: { kk: 1, gk: 2, shadan: 0, kojin: 4 } },
      { label: '副業・マイクロ法人', scores: { kk: 0, gk: 4, shadan: 0, kojin: 2 } },
    ],
  },
  {
    id: 2,
    question: '想定する年間売上はどのくらいですか？',
    subtitle: '現時点の見込みで構いません',
    options: [
      { label: '500万円未満', scores: { kk: 0, gk: 1, shadan: 1, kojin: 5 } },
      { label: '500万〜1,000万円', scores: { kk: 1, gk: 3, shadan: 1, kojin: 3 } },
      { label: '1,000万〜3,000万円', scores: { kk: 3, gk: 3, shadan: 1, kojin: 1 } },
      { label: '3,000万円以上', scores: { kk: 5, gk: 2, shadan: 1, kojin: 0 } },
    ],
  },
  {
    id: 3,
    question: '取引先は主にどこですか？',
    subtitle: '信用力の必要度に影響します',
    options: [
      { label: '大企業・官公庁との取引がある', scores: { kk: 5, gk: 1, shadan: 1, kojin: 0 } },
      { label: '中小企業が中心', scores: { kk: 3, gk: 3, shadan: 1, kojin: 1 } },
      { label: '個人のお客様が中心（BtoC）', scores: { kk: 1, gk: 3, shadan: 1, kojin: 3 } },
      { label: 'まだ決まっていない', scores: { kk: 2, gk: 2, shadan: 1, kojin: 2 } },
    ],
  },
  {
    id: 4,
    question: '将来、外部からの資金調達を考えていますか？',
    subtitle: 'VC・エンジェル投資・融資など',
    options: [
      { label: 'VCやエンジェル投資家から調達したい', scores: { kk: 5, gk: 0, shadan: 0, kojin: 0 } },
      { label: '銀行融資を考えている', scores: { kk: 3, gk: 2, shadan: 1, kojin: 1 } },
      { label: '補助金・助成金を活用したい', scores: { kk: 2, gk: 2, shadan: 3, kojin: 2 } },
      { label: '自己資金のみで運営', scores: { kk: 1, gk: 3, shadan: 1, kojin: 3 } },
    ],
  },
  {
    id: 5,
    question: '共同経営者・パートナーはいますか？',
    subtitle: '意思決定の構造に影響します',
    options: [
      { label: '1人で全て決めたい', scores: { kk: 2, gk: 4, shadan: 0, kojin: 4 } },
      { label: '2〜3人の共同経営', scores: { kk: 3, gk: 3, shadan: 2, kojin: 0 } },
      { label: '出資比率に応じた議決権がほしい', scores: { kk: 5, gk: 1, shadan: 0, kojin: 0 } },
      { label: '多くの関係者で運営（理事会等）', scores: { kk: 1, gk: 0, shadan: 5, kojin: 0 } },
    ],
  },
  {
    id: 6,
    question: '設立費用はどのくらい用意できますか？',
    subtitle: '法定費用＋初期費用の目安',
    options: [
      { label: 'できるだけ安く抑えたい（10万円以下）', scores: { kk: 0, gk: 4, shadan: 1, kojin: 5 } },
      { label: '20万円程度は用意できる', scores: { kk: 3, gk: 3, shadan: 2, kojin: 1 } },
      { label: '30万円以上かけてもよい', scores: { kk: 4, gk: 2, shadan: 3, kojin: 0 } },
      { label: '費用より信用力を優先', scores: { kk: 5, gk: 1, shadan: 2, kojin: 0 } },
    ],
  },
  {
    id: 7,
    question: '従業員を雇う予定はありますか？',
    subtitle: '社会保険・採用力に関係します',
    options: [
      { label: '当面は1人（自分のみ）', scores: { kk: 1, gk: 3, shadan: 1, kojin: 4 } },
      { label: '1〜5人程度雇いたい', scores: { kk: 3, gk: 3, shadan: 2, kojin: 1 } },
      { label: '将来は10人以上に拡大', scores: { kk: 5, gk: 1, shadan: 1, kojin: 0 } },
      { label: 'ボランティア・業務委託が中心', scores: { kk: 0, gk: 1, shadan: 4, kojin: 3 } },
    ],
  },
  {
    id: 8,
    question: '会社名のブランドイメージは重要ですか？',
    subtitle: '"株式会社" の肩書きの必要性',
    options: [
      { label: '「株式会社○○」の信用力が必要', scores: { kk: 5, gk: 0, shadan: 0, kojin: 0 } },
      { label: 'ブランド名が前面に出るので形態は気にしない', scores: { kk: 1, gk: 4, shadan: 1, kojin: 2 } },
      { label: '「一般社団法人」の公益イメージが有利', scores: { kk: 0, gk: 0, shadan: 5, kojin: 0 } },
      { label: '屋号（個人事業）で十分', scores: { kk: 0, gk: 1, shadan: 0, kojin: 5 } },
    ],
  },
];

// ============================================================
// Result data
// ============================================================
type FormType = 'kk' | 'gk' | 'shadan' | 'kojin';

interface ResultData {
  type: FormType;
  label: string;
  tagline: string;
  color: string;
  bgColor: string;
  darkBgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  setupCost: string;
  annualMaintenance: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  nextStep: string;
  nextStepLink: string;
}

const RESULT_DATA: Record<FormType, ResultData> = {
  kk: {
    type: 'kk',
    label: '株式会社',
    tagline: '信用力と成長性を重視するなら',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-50',
    darkBgColor: 'dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: <Icons.Building />,
    setupCost: '約20〜25万円',
    annualMaintenance: '約80〜150万円',
    pros: [
      '社会的信用力が最も高い',
      '株式発行による資金調達が可能',
      '大企業・官公庁との取引で有利',
      '優秀な人材を採用しやすい',
      '将来のIPO（上場）が可能',
    ],
    cons: [
      '設立費用が最も高い（約20万円〜）',
      '毎年の決算公告義務がある',
      '役員の任期があり、変更登記が必要',
      '運営コストが高い',
    ],
    bestFor: [
      'BtoB取引が中心の事業',
      'VC・投資家からの資金調達を予定',
      '将来10人以上に拡大予定',
      '大企業・官公庁が取引先',
    ],
    nextStep: '設立費用を計算する',
    nextStepLink: '/business/setsuritsu-hiyo',
  },
  gk: {
    type: 'gk',
    label: '合同会社',
    tagline: 'コストを抑えて柔軟に運営するなら',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-50',
    darkBgColor: 'dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    icon: <Icons.Users />,
    setupCost: '約7〜10万円',
    annualMaintenance: '約80〜120万円',
    pros: [
      '設立費用が安い（約6万円〜）',
      '定款認証が不要で手続きが簡単',
      '利益配分を自由に決められる',
      '決算公告義務がない',
      '役員の任期制限がない',
    ],
    cons: [
      '「合同会社」の知名度がやや低い',
      '株式による資金調達ができない',
      'IPO（上場）はできない',
      '社員（出資者）全員の同意が必要な場合がある',
    ],
    bestFor: [
      'コストを最小限にしたい',
      '1人〜少人数での運営',
      '副業・マイクロ法人',
      'IT・コンサル・クリエイティブ系',
      'Apple Japan・Amazon Japanも合同会社',
    ],
    nextStep: '設立費用を計算する',
    nextStepLink: '/business/setsuritsu-hiyo',
  },
  shadan: {
    type: 'shadan',
    label: '一般社団法人',
    tagline: '非営利活動・団体運営に最適',
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-50',
    darkBgColor: 'dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    icon: <Icons.Landmark />,
    setupCost: '約11〜15万円',
    annualMaintenance: '約80〜120万円',
    pros: [
      '資本金が不要',
      '公益的なイメージがある',
      '収益事業以外は法人税非課税',
      '補助金・助成金で有利な場合がある',
      '理事会による組織的な意思決定',
    ],
    cons: [
      '設立時に2名以上の社員が必要',
      '利益の分配ができない',
      '株式発行ができない',
      '営利目的だと税制上のメリットが少ない',
    ],
    bestFor: [
      '業界団体・協会の運営',
      '資格認定・検定事業',
      '地域活動・社会貢献',
      '学術研究・学会',
    ],
    nextStep: '設立費用を計算する',
    nextStepLink: '/business/setsuritsu-hiyo',
  },
  kojin: {
    type: 'kojin',
    label: '個人事業主',
    tagline: 'まずは小さく始めるなら',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-50',
    darkBgColor: 'dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: <Icons.User />,
    setupCost: '¥0（開業届のみ）',
    annualMaintenance: '約5〜30万円',
    pros: [
      '設立費用ゼロ（開業届を出すだけ）',
      '確定申告が法人より簡単',
      '青色申告で最大65万円控除',
      '赤字を3年間繰り越せる',
      '事業をやめるのも簡単',
    ],
    cons: [
      '社会的信用が法人より低い',
      '所得が増えると税率が高い（最大45%+住民税10%）',
      '法人向け融資・補助金が使えない場合がある',
      '事業用資産と個人資産が法的に分離されない',
    ],
    bestFor: [
      '年間利益500万円未満の見込み',
      'フリーランス・個人事業',
      '初期費用をかけたくない',
      'まず試してから法人化を検討したい',
    ],
    nextStep: '法人化のタイミングを計算する',
    nextStepLink: '/calculator/houjinka-sim',
  },
};

// ============================================================
// Main Component
// ============================================================
export default function KaishaShindanClient() {
  const [mounted, setMounted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [scores, setScores] = useState({ kk: 0, gk: 0, shadan: 0, kojin: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnswer = (optionIndex: number) => {
    const question = QUESTIONS[currentQuestion];
    const option = question.options[optionIndex];

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    // Recalculate scores from scratch to handle back-and-change
    const newScores = { kk: 0, gk: 0, shadan: 0, kojin: 0 };
    for (let i = 0; i < QUESTIONS.length; i++) {
      const ansIdx = i === currentQuestion ? optionIndex : newAnswers[i];
      if (ansIdx !== undefined && ansIdx !== null && !isNaN(ansIdx)) {
        const opt = QUESTIONS[i].options[ansIdx];
        if (opt) {
          newScores.kk += opt.scores.kk;
          newScores.gk += opt.scores.gk;
          newScores.shadan += opt.scores.shadan;
          newScores.kojin += opt.scores.kojin;
        }
      }
    }
    setScores(newScores);

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 400);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setScores({ kk: 0, gk: 0, shadan: 0, kojin: 0 });
  };

  const getWinner = (): FormType => {
    const entries = Object.entries(scores) as [FormType, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  };

  const getRanked = (): { type: FormType; score: number; percent: number }[] => {
    const maxPossible = QUESTIONS.length * 5; // max 5 per question
    const entries = Object.entries(scores) as [FormType, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries.map(([type, score]) => ({
      type,
      score,
      percent: Math.round((score / maxPossible) * 100),
    }));
  };

  // SSR shell
  if (!mounted) {
    return <div className="min-h-screen py-12 flex items-center justify-center text-gray-500 dark:text-gray-400">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-pink-500 transition-colors">ホーム</Link>
          <span className="mx-2">{'>'}</span>
          <Link href="/business" className="hover:text-pink-500 transition-colors">ビジネス・法人</Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-gray-900 dark:text-gray-100">会社形態診断</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          会社形態診断ツール
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          8つの質問に答えるだけで、あなたに最適な会社形態を診断します。
          株式会社・合同会社・一般社団法人・個人事業主のどれが合っているか、すぐにわかります。
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* ============================================================ */}
        {/* QUIZ MODE */}
        {/* ============================================================ */}
        {!showResult && (
          <div>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>質問 {currentQuestion + 1} / {QUESTIONS.length}</span>
                <span>{Math.round(((currentQuestion) / QUESTIONS.length) * 100)}% 完了</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-pink-400 to-pink-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestion) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs font-semibold rounded-full mb-3">
                  Q{QUESTIONS[currentQuestion].id}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {QUESTIONS[currentQuestion].question}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {QUESTIONS[currentQuestion].subtitle}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {QUESTIONS[currentQuestion].options.map((option, idx) => {
                  const isSelected = answers[currentQuestion] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20 dark:border-pink-500 shadow-md'
                          : 'border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
                          isSelected
                            ? 'border-pink-400 bg-pink-500 text-white'
                            : 'border-gray-300 dark:border-gray-500 text-gray-400 dark:text-gray-500'
                        }`}>
                          {isSelected ? <Icons.Check /> : String.fromCharCode(65 + idx)}
                        </span>
                        <span className={`text-sm md:text-base ${isSelected ? 'text-pink-700 dark:text-pink-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                          {option.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Back button */}
              {currentQuestion > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="mt-6 flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Icons.ArrowLeft />
                  前の質問に戻る
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* RESULT MODE */}
        {/* ============================================================ */}
        {showResult && (() => {
          const winner = getWinner();
          const ranked = getRanked();
          const winnerData = RESULT_DATA[winner];
          const topScore = ranked[0].score;

          return (
            <div className="space-y-6">
              {/* Winner card */}
              <div className={`${winnerData.bgColor} ${winnerData.darkBgColor} rounded-2xl border-2 ${winnerData.borderColor} p-6 md:p-8 shadow-lg`}>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/70 dark:bg-gray-800/70 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    <Icons.Trophy />
                    あなたにおすすめの会社形態
                  </div>
                  <div className={`flex items-center justify-center gap-3 mb-3 ${winnerData.color}`}>
                    {winnerData.icon}
                    <h2 className="text-3xl md:text-4xl font-black">{winnerData.label}</h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{winnerData.tagline}</p>
                </div>

                {/* Score bars */}
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 mb-6">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">適合度スコア</p>
                  <div className="space-y-3">
                    {ranked.map((item) => {
                      const data = RESULT_DATA[item.type];
                      const barWidth = topScore > 0 ? Math.round((item.score / topScore) * 100) : 0;
                      return (
                        <div key={item.type} className="flex items-center gap-3">
                          <span className={`w-28 text-sm font-medium ${item.type === winner ? data.color + ' font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                            {data.label}
                          </span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-700 ease-out ${
                                item.type === 'kk' ? 'bg-blue-500' :
                                item.type === 'gk' ? 'bg-emerald-500' :
                                item.type === 'shadan' ? 'bg-purple-500' :
                                'bg-amber-500'
                              }`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                          <span className="w-12 text-right text-sm font-bold text-gray-700 dark:text-gray-300">{item.score}pt</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Setup cost + maintenance */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">設立費用の目安</p>
                    <p className={`text-lg font-bold ${winnerData.color}`}>{winnerData.setupCost}</p>
                  </div>
                  <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">年間維持費の目安</p>
                    <p className={`text-lg font-bold ${winnerData.color}`}>{winnerData.annualMaintenance}</p>
                  </div>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mb-3 flex items-center gap-1.5">
                    <Icons.Sparkles />
                    メリット
                  </h3>
                  <ul className="space-y-2">
                    {winnerData.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-emerald-500 mt-0.5 flex-shrink-0"><Icons.Check /></span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h3 className="font-bold text-red-500 dark:text-red-400 text-sm mb-3">注意点</h3>
                  <ul className="space-y-2">
                    {winnerData.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-red-400 mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best for */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-3">こんな方に最適</h3>
                <div className="flex flex-wrap gap-2">
                  {winnerData.bestFor.map((item, i) => (
                    <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium ${winnerData.bgColor} ${winnerData.darkBgColor} ${winnerData.color}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={winnerData.nextStepLink}
                  className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-center rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {winnerData.nextStep}
                  <Icons.ArrowRight />
                </Link>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-4 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all flex items-center justify-center gap-2"
                >
                  <Icons.RotateCcw />
                  もう一度診断する
                </button>
              </div>

              {/* Comparison table */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-4">4つの形態を比較</h3>
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-semibold w-28" />
                        <th className="py-3 px-2 text-blue-600 dark:text-blue-400 font-bold">株式会社</th>
                        <th className="py-3 px-2 text-emerald-600 dark:text-emerald-400 font-bold">合同会社</th>
                        <th className="py-3 px-2 text-purple-600 dark:text-purple-400 font-bold">一般社団</th>
                        <th className="py-3 px-2 text-amber-600 dark:text-amber-400 font-bold">個人事業</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {[
                        { label: '設立費用', kk: '約20万円', gk: '約6万円', shadan: '約11万円', kojin: '¥0' },
                        { label: '定款認証', kk: '必要', gk: '不要', shadan: '必要', kojin: '不要' },
                        { label: '資本金', kk: '1円〜', gk: '1円〜', shadan: '不要', kojin: '不要' },
                        { label: '設立人数', kk: '1人〜', gk: '1人〜', shadan: '2人〜', kojin: '1人' },
                        { label: '信用力', kk: '◎ 最高', gk: '○ 中程度', shadan: '○ 公益的', kojin: '△ 低い' },
                        { label: '資金調達', kk: '◎ 株式可', gk: '△ 融資のみ', shadan: '△ 補助金', kojin: '△ 融資のみ' },
                        { label: '運営自由度', kk: '△ 制約多', gk: '◎ 柔軟', shadan: '○ 理事会', kojin: '◎ 最も自由' },
                        { label: '税率上限', kk: '約30%', gk: '約30%', shadan: '約30%', kojin: '最大55%' },
                        { label: '決算公告', kk: '義務あり', gk: 'なし', shadan: 'なし', kojin: 'なし' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                          <td className="py-2.5 px-2 font-medium text-gray-700 dark:text-gray-300">{row.label}</td>
                          <td className="py-2.5 px-2 text-center text-gray-600 dark:text-gray-400">{row.kk}</td>
                          <td className="py-2.5 px-2 text-center text-gray-600 dark:text-gray-400">{row.gk}</td>
                          <td className="py-2.5 px-2 text-center text-gray-600 dark:text-gray-400">{row.shadan}</td>
                          <td className="py-2.5 px-2 text-center text-gray-600 dark:text-gray-400">{row.kojin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Related tools */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">次のステップ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { href: '/business/setsuritsu-hiyo', label: '会社設立費用シミュレーター', desc: 'KK・GK・社団法人の設立費用を即計算' },
                    { href: '/calculator/houjinka-sim', label: '法人化シミュレーター', desc: '個人事業 vs 法人の税金比較' },
                    { href: '/calculator/yakuin-hoshu', label: '役員報酬最適化', desc: '手取りを最大化する報酬額' },
                    { href: '/business/houjin-search', label: '法人番号検索', desc: '既存法人の情報を検索' },
                  ].map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all group"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{tool.label}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{tool.desc}</p>
                      </div>
                      <span className="text-gray-300 dark:text-gray-600 group-hover:text-pink-400 transition-colors"><Icons.ArrowRight /></span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                  ※ この診断結果は参考情報です。最終的な会社形態の決定は、税理士・司法書士等の専門家にご相談のうえ、ご自身の状況に合わせてご判断ください。
                  合同会社から株式会社への組織変更は後からでも可能です（費用約10〜20万円）。
                </p>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* FAQ (always visible) */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mt-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '株式会社と合同会社、どちらが人気ですか？',
                a: '新設法人の約8割が株式会社、約2割が合同会社です。ただし合同会社の割合は年々増加しています。Apple Japan、Amazon Japan、Google合同会社など、大手外資系企業が合同会社を選ぶケースも多く、知名度は上がっています。',
              },
              {
                q: '合同会社から株式会社に変更できますか？',
                a: 'はい、可能です。組織変更の手続きには登録免許税6万円＋官報公告費用約3万円＋専門家報酬で、合計10〜20万円程度かかります。「まず安い合同会社で始めて、成長したら株式会社に変更」という戦略も一般的です。',
              },
              {
                q: '個人事業主から法人化するタイミングは？',
                a: '一般的には年間利益が500〜800万円を超えたあたりで法人化のメリットが出始めます。法人税率は最大約30%に対し、個人の所得税+住民税は最大約55%です。詳しくは法人化シミュレーターで計算できます。',
              },
              {
                q: '一般社団法人でも利益を出せますか？',
                a: 'はい、一般社団法人でも収益事業を行うことは可能です。ただし利益を社員（構成員）に分配することはできません。収益事業には法人税が課税されます。非営利型の一般社団法人は、収益事業以外の所得は非課税です。',
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
