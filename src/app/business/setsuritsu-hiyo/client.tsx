'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================
// Inline SVG Icons (no lucide-react)
// ============================================================
const Icons = {
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Landmark: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
  ),
  Calculator: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  AlertTriangle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  Yen: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 L5 12 h14 L12 2z" fill="none"/><line x1="12" x2="12" y1="12" y2="22"/><line x1="8" x2="16" y1="15" y2="15"/><line x1="8" x2="16" y1="18" y2="18"/></svg>
  ),
};

// ============================================================
// Types
// ============================================================
type CompanyType = 'kk' | 'gk' | 'shadan';

interface CalculationResult {
  companyType: CompanyType;
  companyLabel: string;
  // 法定費用
  teikanNinsho: number;
  teikanInshi: number;
  tourokuMenkyozei: number;
  legalSubtotal: number;
  // 実費
  inkan: number;
  toukiboTohon: number;
  inkanShomeisho: number;
  furikomiTesuryo: number;
  senmonkaHoushu: number;
  jippiSubtotal: number;
  // 初期費用合計
  initialTotal: number;
  // 月間維持費
  houjinJuminzei: number;
  shakaihoken: number;
  zeirishiKomon: number;
  kaikeiSoft: number;
  houjinKozaIji: number;
  monthlySubtotal: number;
  yearlyMaintenance: number;
  // 1年目の真の総額
  firstYearTotal: number;
}

// ============================================================
// Helper: format yen
// ============================================================
function formatYen(n: number): string {
  return '¥' + n.toLocaleString('ja-JP');
}

// ============================================================
// Main Component
// ============================================================
export default function SetsuritsuHiyoClient() {
  const [mounted, setMounted] = useState(false);

  // Form state
  const [companyType, setCompanyType] = useState<CompanyType>('kk');
  const [shihonkin, setShihonkin] = useState<string>('1000000');
  const [denshiTeikan, setDenshiTeikan] = useState<boolean>(true);
  const [useSenmonka, setUseSenmonka] = useState<boolean>(false);
  const [hasEmployees, setHasEmployees] = useState<boolean>(false);
  const [yakuinHoshu, setYakuinHoshu] = useState<string>('300000');

  // Results
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ============================================================
  // Calculate handler
  // ============================================================
  const handleCalculate = () => {
    const shihonkinNum = Number(shihonkin) || 0;
    const yakuinHoshuNum = Number(yakuinHoshu) || 0;

    const companyLabels: Record<CompanyType, string> = {
      kk: '株式会社',
      gk: '合同会社',
      shadan: '一般社団法人',
    };

    // --- 法定費用 ---
    let teikanNinsho = 0;
    if (companyType === 'kk') {
      // 2022年改正: 資本金額による段階制
      if (shihonkinNum <= 1000000) teikanNinsho = 30000;
      else if (shihonkinNum <= 3000000) teikanNinsho = 40000;
      else teikanNinsho = 50000;
    } else if (companyType === 'shadan') {
      teikanNinsho = 50000;
    }
    // GK: 定款認証不要 = 0

    let teikanInshi = 0;
    if (!denshiTeikan && companyType !== 'shadan') {
      teikanInshi = 40000;
    }
    if (!denshiTeikan && companyType === 'shadan') {
      teikanInshi = 40000;
    }

    let tourokuMenkyozei = 0;
    if (companyType === 'kk') {
      const calculated = Math.floor(shihonkinNum * 0.007);
      tourokuMenkyozei = Math.max(calculated, 150000);
    } else if (companyType === 'gk') {
      const calculated = Math.floor(shihonkinNum * 0.007);
      tourokuMenkyozei = Math.max(calculated, 60000);
    } else {
      tourokuMenkyozei = 60000;
    }

    const legalSubtotal = teikanNinsho + teikanInshi + tourokuMenkyozei;

    // --- 実費 ---
    const inkan = 8000; // 3本セット平均
    const toukiboTohon = 1800; // 3通 × ¥600
    const inkanShomeisho = 900; // 3通 × ¥300
    const furikomiTesuryo = companyType === 'shadan' ? 0 : 440;
    const senmonkaHoushu = useSenmonka
      ? companyType === 'kk'
        ? 50000
        : companyType === 'gk'
          ? 30000
          : 80000
      : 0;

    const jippiSubtotal = inkan + toukiboTohon + inkanShomeisho + furikomiTesuryo + senmonkaHoushu;

    const initialTotal = legalSubtotal + jippiSubtotal;

    // --- 月間維持費 ---
    // 法人住民税均等割 (最低: 都道府県2万+市町村5万=7万/年)
    const houjinJuminzei = 70000;

    // 社会保険 (健康保険+厚生年金, 会社負担分, 役員報酬ベース)
    // 概算: 役員報酬 × 約15%（会社負担分）
    const shakaihokenRate = 0.15;
    const monthlyShakaihoken = Math.round(yakuinHoshuNum * shakaihokenRate);

    // 税理士顧問料
    const zeirishiKomon = useSenmonka ? 25000 : 0;

    // 会計ソフト
    const kaikeiSoft = 2500;

    // 法人口座維持費
    const houjinKozaIji = 0; // 多くの銀行は無料

    const monthlySubtotal = monthlyShakaihoken + zeirishiKomon + kaikeiSoft + houjinKozaIji;
    const yearlyMaintenance = houjinJuminzei + monthlySubtotal * 12;

    const firstYearTotal = initialTotal + yearlyMaintenance;

    setResult({
      companyType,
      companyLabel: companyLabels[companyType],
      teikanNinsho: teikanNinsho,
      teikanInshi: teikanInshi,
      tourokuMenkyozei,
      legalSubtotal,
      inkan,
      toukiboTohon,
      inkanShomeisho,
      furikomiTesuryo,
      senmonkaHoushu,
      jippiSubtotal,
      initialTotal,
      houjinJuminzei,
      shakaihoken: monthlyShakaihoken,
      zeirishiKomon,
      kaikeiSoft,
      houjinKozaIji,
      monthlySubtotal,
      yearlyMaintenance,
      firstYearTotal,
    });
  };

  // ============================================================
  // SSR loading shell
  // ============================================================
  if (!mounted) {
    return <div className="min-h-screen py-12 flex items-center justify-center text-gray-500 dark:text-gray-400">読み込み中...</div>;
  }

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-pink-500 transition-colors">ホーム</Link>
          <span className="mx-2">{'>'}</span>
          <Link href="/business" className="hover:text-pink-500 transition-colors">ビジネス・法人</Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-gray-900 dark:text-gray-100">会社設立費用シミュレーター</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          会社設立費用シミュレーター
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          株式会社・合同会社・一般社団法人の設立にかかる<strong>本当の総額</strong>を計算します。
          法定費用だけでなく、印鑑代・専門家報酬・設立後の維持費まで含めた「1年目の全コスト」がわかります。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* ============================================================ */}
        {/* INPUT FORM */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">

          {/* Company Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              会社の種類を選択
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {([
                { value: 'kk' as CompanyType, label: '株式会社', sub: '信用力が高い・最も一般的', icon: <Icons.Building /> },
                { value: 'gk' as CompanyType, label: '合同会社', sub: '設立費用が安い・運営が柔軟', icon: <Icons.Users /> },
                { value: 'shadan' as CompanyType, label: '一般社団法人', sub: '非営利活動・資本金不要', icon: <Icons.Landmark /> },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCompanyType(opt.value)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    companyType === opt.value
                      ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20 dark:border-pink-500 shadow-md'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  {companyType === opt.value && (
                    <span className="absolute top-2 right-2 text-pink-500"><Icons.Check /></span>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <span className={companyType === opt.value ? 'text-pink-500' : 'text-gray-400 dark:text-gray-500'}>{opt.icon}</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{opt.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Capital */}
          {companyType !== 'shadan' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                資本金
                <span className="ml-2 text-xs font-normal text-gray-400">（登録免許税の計算に使用）</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
                <input
                  type="number"
                  value={shihonkin}
                  onChange={(e) => setShihonkin(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                  placeholder="1000000"
                  min="1"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { label: '1円', value: '1' },
                  { label: '100万', value: '1000000' },
                  { label: '300万', value: '3000000' },
                  { label: '500万', value: '5000000' },
                  { label: '1,000万', value: '10000000' },
                  { label: '3,000万', value: '30000000' },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setShihonkin(preset.value)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      shihonkin === preset.value
                        ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500'
                        : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Options row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Denshi teikan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">定款の形式</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDenshiTeikan(true)}
                  className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    denshiTeikan
                      ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  電子定款（印紙代0円）
                </button>
                <button
                  type="button"
                  onClick={() => setDenshiTeikan(false)}
                  className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    !denshiTeikan
                      ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  紙の定款（+4万円）
                </button>
              </div>
            </div>

            {/* Senmonka */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">専門家に依頼</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUseSenmonka(false)}
                  className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    !useSenmonka
                      ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  自分で手続き
                </button>
                <button
                  type="button"
                  onClick={() => setUseSenmonka(true)}
                  className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    useSenmonka
                      ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  司法書士等に依頼
                </button>
              </div>
            </div>
          </div>

          {/* Yakuin hoshu for maintenance calc */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              想定する役員報酬（月額）
              <span className="ml-2 text-xs font-normal text-gray-400">（社会保険料の概算に使用）</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
              <input
                type="number"
                value={yakuinHoshu}
                onChange={(e) => setYakuinHoshu(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                placeholder="300000"
                min="0"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: '20万', value: '200000' },
                { label: '30万', value: '300000' },
                { label: '40万', value: '400000' },
                { label: '50万', value: '500000' },
                { label: '80万', value: '800000' },
              ].map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setYakuinHoshu(preset.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    yakuinHoshu === preset.value
                      ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculate button */}
          <button
            type="button"
            onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Icons.Calculator />
            設立費用を計算する
          </button>
        </div>

        {/* ============================================================ */}
        {/* RESULTS */}
        {/* ============================================================ */}
        {result && (
          <div className="space-y-6 mb-12">
            {/* 1年目の総額ヘッダー */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl">
              <div className="text-center">
                <p className="text-sm text-slate-300 mb-1">{result.companyLabel}の1年目にかかる全費用</p>
                <p className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                  {formatYen(result.firstYearTotal)}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-300 mt-4">
                  <span>初期費用 {formatYen(result.initialTotal)}</span>
                  <span className="text-slate-500">+</span>
                  <span>年間維持費 {formatYen(result.yearlyMaintenance)}</span>
                </div>
              </div>
            </div>

            {/* 法定費用 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 border-b border-blue-100 dark:border-blue-800">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm">法定費用（必ずかかる費用）</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <ResultRow label="定款認証手数料" value={result.teikanNinsho} note={companyType === 'gk' ? '合同会社は不要' : undefined} />
                <ResultRow label="定款印紙代" value={result.teikanInshi} note={denshiTeikan ? '電子定款のため不要' : undefined} />
                <ResultRow label="登録免許税" value={result.tourokuMenkyozei} note={companyType === 'kk' ? `資本金×0.7% (最低15万円)` : companyType === 'gk' ? `資本金×0.7% (最低6万円)` : '一律6万円'} />
                <ResultRow label="法定費用 小計" value={result.legalSubtotal} isBold />
              </div>
            </div>

            {/* 実費・その他 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-3 border-b border-amber-100 dark:border-amber-800">
                <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-1.5">
                  <Icons.AlertTriangle />
                  見落としがちな実費
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <ResultRow label="印鑑3本セット（代表印・銀行印・角印）" value={result.inkan} note="ネット注文の平均価格" />
                <ResultRow label="登記簿謄本（3通）" value={result.toukiboTohon} note="銀行口座開設・届出用" />
                <ResultRow label="印鑑証明書（3通）" value={result.inkanShomeisho} />
                {companyType !== 'shadan' && <ResultRow label="資本金振込手数料" value={result.furikomiTesuryo} />}
                {useSenmonka && <ResultRow label="専門家報酬（司法書士等）" value={result.senmonkaHoushu} note="電子定款対応込の相場" />}
                <ResultRow label="実費 小計" value={result.jippiSubtotal} isBold />
              </div>
            </div>

            {/* 初期費用合計 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-pink-200 dark:border-pink-800 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">初期費用 合計</span>
                <span className="text-2xl font-black text-pink-600 dark:text-pink-400">{formatYen(result.initialTotal)}</span>
              </div>
            </div>

            {/* 月間維持費 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 px-6 py-3 border-b border-emerald-100 dark:border-emerald-800">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-1.5">
                  <Icons.Info />
                  設立後の維持費（年間）
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <ResultRow label="法人住民税 均等割（年額）" value={result.houjinJuminzei} note="赤字でも必ず発生" isYearly />
                <ResultRow label="社会保険料 会社負担（月額）" value={result.shakaihoken} note={`役員報酬${formatYen(Number(yakuinHoshu) || 0)}×約15%`} />
                {useSenmonka && <ResultRow label="税理士顧問料（月額）" value={result.zeirishiKomon} note="記帳代行含む相場" />}
                <ResultRow label="会計ソフト（月額）" value={result.kaikeiSoft} note="freee/MF等のスターター" />
                <ResultRow label="月間維持費 合計" value={result.monthlySubtotal} isBold note="（法人住民税除く）" />
                <ResultRow label="年間維持費 合計" value={result.yearlyMaintenance} isBold isHighlight />
              </div>
            </div>

            {/* 注意事項 */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">ご注意</h4>
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• 本シミュレーションは2026年5月時点の法令に基づく概算です。実際の費用は地域・条件により異なります。</li>
                <li>• 社会保険料は協会けんぽ（東京都）の概算料率を使用しています。</li>
                <li>• 資本金1,000万円以上の場合、設立初年度から消費税の課税事業者になる可能性があります。</li>
                <li>• 正確な費用は税理士・司法書士にご相談ください。</li>
              </ul>
            </div>

            {/* 関連ツール */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/calculator/houjinka-sim', label: '法人化シミュレーター', desc: '個人事業 vs 法人の税金比較' },
                  { href: '/calculator/yakuin-hoshu', label: '役員報酬最適化', desc: '手取りを最大化する報酬額を計算' },
                  { href: '/calculator/houjinzei', label: '法人税計算機', desc: '法人税・事業税・住民税を算出' },
                  { href: '/calculator/shakaihoken', label: '社会保険計算機', desc: '健康保険・厚生年金の保険料を計算' },
                  { href: '/business/houjin-search', label: '法人番号検索', desc: '設立済み法人の情報を検索' },
                  { href: '/document/invoice', label: '請求書作成', desc: '法人としての最初の請求書を作成' },
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
          </div>
        )}

        {/* ============================================================ */}
        {/* PRE-COMPUTED EXAMPLES (for SEO / GEO) */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">よくある設立パターンの費用一覧</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">パターン</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">初期費用</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">年間維持費</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">1年目総額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-2 text-gray-900 dark:text-gray-100">株式会社（資本金100万・電子定款・自分で）</td>
                  <td className="py-3 px-2 text-right font-medium text-gray-900 dark:text-gray-100">¥201,140</td>
                  <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">¥880,000</td>
                  <td className="py-3 px-2 text-right font-bold text-pink-600 dark:text-pink-400">¥1,081,140</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-2 text-gray-900 dark:text-gray-100">株式会社（資本金100万・電子定款・専門家）</td>
                  <td className="py-3 px-2 text-right font-medium text-gray-900 dark:text-gray-100">¥251,140</td>
                  <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">¥1,180,000</td>
                  <td className="py-3 px-2 text-right font-bold text-pink-600 dark:text-pink-400">¥1,431,140</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-2 text-gray-900 dark:text-gray-100">合同会社（資本金100万・電子定款・自分で）</td>
                  <td className="py-3 px-2 text-right font-medium text-gray-900 dark:text-gray-100">¥71,140</td>
                  <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">¥880,000</td>
                  <td className="py-3 px-2 text-right font-bold text-pink-600 dark:text-pink-400">¥951,140</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-2 text-gray-900 dark:text-gray-100">合同会社（資本金1円・電子定款・自分で）</td>
                  <td className="py-3 px-2 text-right font-medium text-gray-900 dark:text-gray-100">¥71,140</td>
                  <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">¥880,000</td>
                  <td className="py-3 px-2 text-right font-bold text-pink-600 dark:text-pink-400">¥951,140</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-2 text-gray-900 dark:text-gray-100">一般社団法人（電子定款・自分で）</td>
                  <td className="py-3 px-2 text-right font-medium text-gray-900 dark:text-gray-100">¥121,140</td>
                  <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">¥880,000</td>
                  <td className="py-3 px-2 text-right font-bold text-pink-600 dark:text-pink-400">¥1,001,140</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">※ 維持費は役員報酬月額30万円、税理士なし、会計ソフト月額2,500円で計算</p>
        </div>

        {/* ============================================================ */}
        {/* FAQ */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '株式会社と合同会社、どちらが安いですか？',
                a: '合同会社のほうが大幅に安く設立できます。電子定款・自分で手続きした場合、合同会社は約7万円、株式会社は約20万円です。合同会社は定款認証が不要で、登録免許税も6万円（株式会社は15万円）と低く設定されています。',
              },
              {
                q: '電子定款と紙の定款、どちらを選ぶべきですか？',
                a: '電子定款をおすすめします。紙の定款には4万円の収入印紙が必要ですが、電子定款なら不要です。freee会社設立やマネーフォワードなどの無料サービスを使えば、電子定款で手続きできます。',
              },
              {
                q: '資本金1円でも会社設立できますか？',
                a: 'はい、法律上は資本金1円でも設立可能です。ただし、登録免許税は最低額（株式会社15万円、合同会社6万円）が適用されるため、設立費用は変わりません。また、取引先や銀行の信用面で不利になる場合があるため、一般的には100万円以上が推奨されています。',
              },
              {
                q: '会社設立後、毎月いくらかかりますか？',
                a: '最低でも法人住民税均等割7万円/年（月約5,800円）が赤字でも発生します。加えて社会保険料（役員報酬の約15%が会社負担）、会計ソフト代（月2,000〜4,000円）、税理士を使う場合は顧問料（月1〜5万円）がかかります。',
              },
              {
                q: '一般社団法人と株式会社の違いは？',
                a: '一般社団法人は資本金が不要で、非営利活動に適しています。設立には2名以上の社員（構成員）が必要です。法人税は収益事業のみに課税されます。一方、株式会社は出資者（株主）が所有し、利益を配当できます。',
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

// ============================================================
// Result Row Component
// ============================================================
function ResultRow({
  label,
  value,
  note,
  isBold = false,
  isHighlight = false,
  isYearly = false,
}: {
  label: string;
  value: number;
  note?: string;
  isBold?: boolean;
  isHighlight?: boolean;
  isYearly?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-6 py-3 ${isHighlight ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}`}>
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${isBold ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
          {label}
        </span>
        {note && (
          <span className="block text-xs text-gray-400 dark:text-gray-500 mt-0.5">{note}</span>
        )}
      </div>
      <div className="ml-4 text-right shrink-0">
        {value === 0 ? (
          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
        ) : (
          <span className={`text-sm ${isBold ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-900 dark:text-gray-100'} ${isHighlight ? 'text-emerald-700 dark:text-emerald-400 font-bold text-base' : ''}`}>
            {formatYen(value)}
            {isYearly && <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">/年</span>}
          </span>
        )}
      </div>
    </div>
  );
}
