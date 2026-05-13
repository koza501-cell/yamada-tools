"use client";

import { useState, useEffect } from "react";
import { FAQSection } from "@/components/FAQSection";
import {
  SERVICE_META,
  HOUMON_UNITS,
  TSUSHO_UNITS,
  TSUSHO_TIME_LABELS,
  KYOTAKU_UNITS,
  KASAN,
  GENSAN,
} from "@/data/kaigo-units";
import type { KaigoService } from "@/data/kaigo-units";
import { calcTanka, KYUCHI_LABELS } from "@/data/kaigo-tanka";
import type { Kyuchi } from "@/data/kaigo-tanka";
import chiikiData from "@/data/kaigo-chiiki.json";

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  Print: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  ChevronUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  ),
  Calc: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="10" y2="14"/>
      <line x1="8" x2="8" y1="10" y2="14"/><line x1="8" x2="16" y1="18" y2="18"/><line x1="12" x2="12" y1="10" y2="14"/>
    </svg>
  ),
};

// ─── Types ────────────────────────────────────────────────────────────────────
type HoumonCategory = 'shintai' | 'seikatsu' | 'tsuin';

interface CalcResult {
  service: KaigoService;
  baseUnits: number;
  finalUnits: number;
  tanka: number;
  kyuchi: Kyuchi;
  pricePerSession: number;
  count: number;
  totalPrice: number;
  hokenFutan: number;
  jikoFutan: number;
  jikoRatio: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

const KYUCHI_KEYS = Object.keys(KYUCHI_LABELS) as Kyuchi[];

// ─── Sub-components ───────────────────────────────────────────────────────────
function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            value === opt.value
              ? "bg-sky-500 text-white border-sky-500"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-sky-400"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── SEO Static Tables ────────────────────────────────────────────────────────
function SeoTables({ active }: { active: KaigoService }) {
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">よくある計算結果</h2>

      {active === 'tsusho' && (
        <div className="overflow-x-auto">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">通所介護（通常規模型）7〜8時間・その他地域・1割負担</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-sky-50 dark:bg-sky-900/30 text-gray-700 dark:text-gray-300">
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">要介護度</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">利用時間</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right">単位数(1回)</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right">概算費用(1割負担)</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map((k, i) => {
                const units = TSUSHO_UNITS['7-8h'][i] || 0;
                return (
                  <tr key={k} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800/50">
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">要介護{k}</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">7〜8時間</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right">{fmt(units)}</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right">{fmt(units)}円</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {active === 'houmon' && (
        <div className="overflow-x-auto">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">訪問介護（身体介護）・その他地域・1割負担</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-sky-50 dark:bg-sky-900/30 text-gray-700 dark:text-gray-300">
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">サービス</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">時間区分</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right">単位数(1回)</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right">概算費用(1割負担)</th>
              </tr>
            </thead>
            <tbody>
              {HOUMON_UNITS.shintai.map((row) => (
                <tr key={row.label} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800/50">
                  <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">身体介護</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">{row.label}</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right">{fmt(row.units)}</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right">{fmt(row.units)}円</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {active === 'kyotaku' && (
        <div className="overflow-x-auto">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">居宅介護支援（月額）・その他地域・1割負担</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-sky-50 dark:bg-sky-900/30 text-gray-700 dark:text-gray-300">
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">要介護度</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">条件</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right">月額単位</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right">概算費用(1割負担)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '要介護1〜2', cond: '基本', units: 1086 },
                { label: '要介護3〜5', cond: '基本', units: 1411 },
                { label: '要介護1〜2', cond: '特定事業所加算(Ⅰ)', units: 1086 + 519 },
                { label: '要介護3〜5', cond: '特定事業所加算(Ⅰ)', units: 1411 + 519 },
                { label: '要介護1〜2', cond: '初回加算', units: 1086 + 300 },
              ].map((row, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800/50">
                  <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">{row.label}</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">{row.cond}</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right">{fmt(row.units)}</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-right">{fmt(row.units)}円</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const faqItems = [
  {
    question: "介護報酬はどうやって計算するの?",
    answer: "「サービスごとの単位数 × 1単位の単価」で計算します。1単位の単価は地域区分とサービスの人件費割合で10〜11.40円の範囲で変動します。",
  },
  {
    question: "1単位は何円ですか?",
    answer: "基本は10円ですが、東京23区など人件費の高い地域では最大11.40円になります。当ツールでは地域を選ぶと自動反映されます。",
  },
  {
    question: "令和6年改定に対応していますか?",
    answer: "はい。2024年4月・6月施行の最新介護報酬改定に対応しています。次回改定は令和9年度予定です。",
  },
  {
    question: "加算や減算も計算できますか?",
    answer: "処遇改善加算、特定事業所加算、入浴介助加算、同一建物減算など主要な加算・減算に対応しています。",
  },
  {
    question: "この計算は公式ですか?",
    answer: "厚生労働省告示に基づく概算計算です。正式な請求金額は所属事業所や市町村にご確認ください。",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function KaigoHoshuClient() {
  const [mounted, setMounted] = useState(false);

  // ── Service selection ──
  const [activeService, setActiveService] = useState<KaigoService>('houmon');

  // ── 訪問介護 inputs ──
  const [houmonCategory, setHoumonCategory] = useState<HoumonCategory>('shintai');
  const [houmonItemLabel, setHoumonItemLabel] = useState(HOUMON_UNITS.shintai[0].label);

  // ── 通所介護 inputs ──
  const [tsushoKaigo, setTsushoKaigo] = useState(1);
  const [tsushoTime, setTsushoTime] = useState('7-8h');

  // ── 居宅介護支援 inputs ──
  const [kyotakuHeavy, setKyotakuHeavy] = useState(false);

  // ── Common inputs ──
  const [kyuchi, setKyuchi] = useState<Kyuchi>('other');
  const [citySearch, setCitySearch] = useState('');
  const [showCityList, setShowCityList] = useState(false);
  const [count, setCount] = useState('4');
  const [jikoRatio, setJikoRatio] = useState(1);

  // ── 加算/減算 ──
  const [showKasan, setShowKasan] = useState(false);
  const [activeKasan, setActiveKasan] = useState<Record<string, boolean>>({});
  const [activeGensan, setActiveGensan] = useState<Record<string, boolean>>({});

  // ── Results ──
  const [results, setResults] = useState<CalcResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Reset results when service changes
  useEffect(() => {
    setResults(null);
    setActiveKasan({});
    setActiveGensan({});
    setShowKasan(false);
  }, [activeService]);

  // Reset houmon item when category changes
  useEffect(() => {
    if (houmonCategory === 'shintai') setHoumonItemLabel(HOUMON_UNITS.shintai[0].label);
    else if (houmonCategory === 'seikatsu') setHoumonItemLabel(HOUMON_UNITS.seikatsu[0].label);
    else setHoumonItemLabel(HOUMON_UNITS.tsuin[0].label);
  }, [houmonCategory]);

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400 dark:text-gray-600">
        読み込み中...
      </div>
    );
  }

  // ── City search filtered list ──
  const filteredCities = citySearch.length >= 1
    ? chiikiData.filter((c) => c.city.includes(citySearch)).slice(0, 10)
    : [];

  // ── Calculate ──────────────────────────────────────────────────────────────
  function handleCalculate() {
    let baseUnits = 0;

    if (activeService === 'houmon') {
      if (houmonCategory === 'shintai') {
        const item = HOUMON_UNITS.shintai.find((i) => i.label === houmonItemLabel);
        baseUnits = item?.units || 0;
      } else if (houmonCategory === 'seikatsu') {
        const item = HOUMON_UNITS.seikatsu.find((i) => i.label === houmonItemLabel);
        baseUnits = item?.units || 0;
      } else {
        baseUnits = HOUMON_UNITS.tsuin[0].units || 0;
      }
    } else if (activeService === 'tsusho') {
      const row = TSUSHO_UNITS[tsushoTime];
      baseUnits = row ? (row[tsushoKaigo - 1] || 0) : 0;
    } else if (activeService === 'kyotaku') {
      baseUnits = kyotakuHeavy ? KYOTAKU_UNITS.heavy.units : KYOTAKU_UNITS.light.units;
    }

    let units = baseUnits;

    // 減算: % first
    const gensanList = GENSAN[activeService] || [];
    for (const g of gensanList) {
      if (activeGensan[g.id] && g.type === 'percent') {
        units = units * (1 + (g.value || 0) / 100);
      }
    }
    // 減算: flat
    for (const g of gensanList) {
      if (activeGensan[g.id] && g.type === 'flat') {
        units = units + (g.value || 0);
      }
    }

    // 加算: flat first
    const kasanList = KASAN[activeService] || [];
    for (const k of kasanList) {
      if (activeKasan[k.id] && k.type === 'flat') {
        units = units + (k.value || 0);
      }
    }
    // 加算: % last
    for (const k of kasanList) {
      if (activeKasan[k.id] && k.type === 'percent') {
        units = units * (1 + (k.value || 0) / 100);
      }
    }

    const jinkenhi = SERVICE_META[activeService].jinkenhi;
    const tanka = calcTanka(kyuchi, jinkenhi);
    const pricePerSession = Math.floor(units * tanka);
    const c = activeService === 'kyotaku' ? 1 : (Number(count) || 1);
    const totalPrice = pricePerSession * c;
    const ratio = jikoRatio === 1 ? 0.1 : jikoRatio === 2 ? 0.2 : 0.3;
    const jikoFutan = Math.floor(totalPrice * ratio);
    const hokenFutan = totalPrice - jikoFutan;

    setResults({
      service: activeService,
      baseUnits: Math.round(baseUnits),
      finalUnits: units,
      tanka,
      kyuchi,
      pricePerSession,
      count: c,
      totalPrice,
      hokenFutan,
      jikoFutan,
      jikoRatio,
    });
  }

  function handleCopy() {
    if (!results) return;
    const text = [
      `【介護報酬計算結果】`,
      `サービス: ${SERVICE_META[results.service].label}`,
      `1回あたり単位数: ${Math.round(results.finalUnits)} 単位`,
      `1単位の単価: ${results.tanka.toFixed(2)} 円 (${KYUCHI_LABELS[results.kyuchi]})`,
      `1回あたり: ${fmt(results.pricePerSession)} 円`,
      ...(results.service !== 'kyotaku' ? [`月間 (${results.count}回): ${fmt(results.totalPrice)} 円`] : [`月額: ${fmt(results.totalPrice)} 円`]),
      `介護保険負担: ${fmt(results.hokenFutan)} 円`,
      `利用者負担 (${results.jikoRatio}割): ${fmt(results.jikoFutan)} 円`,
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const kasanList = KASAN[activeService] || [];
  const gensanList = GENSAN[activeService] || [];

  const houmonItems =
    houmonCategory === 'shintai' ? HOUMON_UNITS.shintai
    : houmonCategory === 'seikatsu' ? HOUMON_UNITS.seikatsu
    : HOUMON_UNITS.tsuin;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 flex-wrap print-hide">
        <a href="/" className="hover:text-sky-500 transition-colors">ホーム</a>
        <span>/</span>
        <span>介護・保育</span>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300">介護報酬 単位計算機</span>
      </nav>

      {/* Header */}
      <div className="print-hide">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full">令和6年改定対応</span>
          <span className="text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">無料</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          介護報酬 単位計算機
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          訪問介護・デイサービス・居宅介護支援の介護報酬を自動計算。地域区分対応、加算・減算込み。
        </p>
      </div>

      {/* Service tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 gap-0 print-hide">
        {(Object.keys(SERVICE_META) as KaigoService[]).map((svc) => (
          <button
            key={svc}
            type="button"
            onClick={() => setActiveService(svc)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeService === svc
                ? "border-sky-500 text-sky-600 dark:text-sky-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {SERVICE_META[svc].label}
          </button>
        ))}
      </div>

      {/* ── Input section ── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-5 print-hide">

        {/* 訪問介護 inputs */}
        {activeService === 'houmon' && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">サービス区分</label>
              <ChipGroup
                options={[
                  { label: '身体介護', value: 'shintai' as HoumonCategory },
                  { label: '生活援助', value: 'seikatsu' as HoumonCategory },
                  { label: '通院乗降', value: 'tsuin' as HoumonCategory },
                ]}
                value={houmonCategory}
                onChange={setHoumonCategory}
              />
            </div>
            {houmonCategory !== 'tsuin' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">時間区分</label>
                <ChipGroup
                  options={houmonItems.map((i) => ({ label: i.label, value: i.label }))}
                  value={houmonItemLabel}
                  onChange={setHoumonItemLabel}
                />
              </div>
            )}
            {houmonCategory === 'tsuin' && (
              <p className="text-sm text-gray-500 dark:text-gray-400">通院等乗降介助: 1回 97単位</p>
            )}
          </>
        )}

        {/* 通所介護 inputs */}
        {activeService === 'tsusho' && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">要介護度</label>
              <ChipGroup
                options={[1,2,3,4,5].map((k) => ({ label: `要介護${k}`, value: String(k) }))}
                value={String(tsushoKaigo)}
                onChange={(v) => setTsushoKaigo(Number(v) || 1)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">利用時間</label>
              <ChipGroup
                options={Object.entries(TSUSHO_TIME_LABELS).map(([k, v]) => ({ label: v, value: k }))}
                value={tsushoTime}
                onChange={setTsushoTime}
              />
            </div>
          </>
        )}

        {/* 居宅介護支援 inputs */}
        {activeService === 'kyotaku' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">要介護度</label>
            <ChipGroup
              options={[
                { label: '要介護1〜2', value: 'false' },
                { label: '要介護3〜5', value: 'true' },
              ]}
              value={String(kyotakuHeavy)}
              onChange={(v) => setKyotakuHeavy(v === 'true')}
            />
          </div>
        )}

        {/* 地域 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">地域</label>
          <div className="relative">
            <input
              type="text"
              value={citySearch}
              onChange={(e) => {
                setCitySearch(e.target.value);
                setShowCityList(true);
              }}
              onBlur={() => setTimeout(() => setShowCityList(false), 150)}
              placeholder="市区町村名を入力して検索..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            {showCityList && filteredCities.length > 0 && (
              <ul className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredCities.map((c) => (
                  <li key={c.city}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        setKyuchi(c.kyuchi as Kyuchi);
                        setCitySearch(c.city);
                        setShowCityList(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-sky-50 dark:hover:bg-sky-900/30 flex justify-between items-center"
                    >
                      <span>{c.city}</span>
                      <span className="text-xs text-gray-400 ml-2">{KYUCHI_LABELS[c.kyuchi as Kyuchi]?.split(' ')[0]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">わからない場合は級地を直接選択:</span>
            <select
              value={kyuchi}
              onChange={(e) => setKyuchi(e.target.value as Kyuchi)}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {KYUCHI_KEYS.map((k) => (
                <option key={k} value={k}>{KYUCHI_LABELS[k]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 利用回数/月 (居宅介護支援は非表示) */}
        {activeService !== 'kyotaku' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">利用回数/月</label>
            <input
              type="number"
              min="1"
              max="99"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-32 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">回</span>
          </div>
        )}

        {/* 自己負担割合 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">自己負担割合</label>
          <ChipGroup
            options={[
              { label: '1割', value: '1' },
              { label: '2割', value: '2' },
              { label: '3割', value: '3' },
            ]}
            value={String(jikoRatio)}
            onChange={(v) => setJikoRatio(Number(v) || 1)}
          />
        </div>

        {/* 加算/減算 collapsible */}
        {(kasanList.length > 0 || gensanList.length > 0) && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowKasan(!showKasan)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span>加算・減算を追加</span>
              {showKasan ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
            </button>
            {showKasan && (
              <div className="px-4 pb-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
                {kasanList.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-3 mb-2">加算</p>
                    <div className="space-y-1.5">
                      {kasanList.map((k) => (
                        <label key={k.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={activeKasan[k.id] || false}
                            onChange={(e) => setActiveKasan((prev) => ({ ...prev, [k.id]: e.target.checked }))}
                            className="rounded border-gray-300 dark:border-gray-600 text-sky-500 focus:ring-sky-400"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {k.label}
                            <span className="ml-1 text-xs text-sky-600 dark:text-sky-400">
                              ({k.type === 'percent' ? `+${k.value}%` : `+${k.value}単位`})
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {gensanList.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-3 mb-2">減算</p>
                    <div className="space-y-1.5">
                      {gensanList.map((g) => (
                        <label key={g.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={activeGensan[g.id] || false}
                            onChange={(e) => setActiveGensan((prev) => ({ ...prev, [g.id]: e.target.checked }))}
                            className="rounded border-gray-300 dark:border-gray-600 text-sky-500 focus:ring-sky-400"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {g.label}
                            <span className="ml-1 text-xs text-red-500 dark:text-red-400">
                              ({g.type === 'percent' ? `${g.value}%` : `${g.value}単位`})
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Calculate button */}
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          <Icons.Calc />
          計算する
        </button>
      </div>

      {/* ── Results card ── */}
      {results && (
        <div className="bg-white dark:bg-gray-900 border border-sky-200 dark:border-sky-800 rounded-xl p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">計算結果</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">1回あたり単位数</p>
              <p className="text-xl font-bold text-sky-600 dark:text-sky-400">{fmt(results.finalUnits)} <span className="text-sm font-normal">単位</span></p>
              {results.finalUnits !== results.baseUnits && (
                <p className="text-xs text-gray-400 mt-0.5">基本: {fmt(results.baseUnits)} 単位</p>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">1単位の単価</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.tanka.toFixed(2)} <span className="text-sm font-normal">円</span></p>
              <p className="text-xs text-gray-400 mt-0.5">{KYUCHI_LABELS[results.kyuchi]}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">1回あたり</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{fmt(results.pricePerSession)} <span className="text-sm font-normal">円</span></p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {results.service === 'kyotaku' ? '月額' : `月間 (${results.count}回)`}
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{fmt(results.totalPrice)} <span className="text-sm font-normal">円</span></p>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">介護保険負担</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{fmt(results.hokenFutan)} 円</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">利用者負担 ({results.jikoRatio}割)</span>
              <span className="font-bold text-sky-600 dark:text-sky-400 text-base">{fmt(results.jikoFutan)} 円</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              <Icons.Copy />
              {copied ? 'コピーしました' : 'コピー'}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              <Icons.Print />
              印刷
            </button>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <p>※本計算は概算です。実際の介護報酬は加算・減算、利用者の状況、事業所形態により変動します。正式な金額は所属事業所または市町村にご確認ください。</p>
            <p>※令和6年度介護報酬改定 (2024年4月・6月施行) に基づきます。</p>
          </div>
        </div>
      )}

      {/* ── SEO Tables ── */}
      <div className="print-hide"><SeoTables active={activeService} /></div>

      {/* ── 使い方 ── */}
      <section className="space-y-4 print-hide">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">使い方</h2>
        <ol className="space-y-3">
          {[
            { step: '1', title: 'サービスを選択', desc: '訪問介護・通所介護・居宅介護支援のタブを選び、サービス内容や要介護度を入力します。' },
            { step: '2', title: '地域を設定', desc: '市区町村名で検索するか、級地ドロップダウンから地域区分を直接選択します。' },
            { step: '3', title: '計算する', desc: '利用回数と自己負担割合を確認して「計算する」を押すと、介護報酬と利用者負担額が表示されます。' },
          ].map((item) => (
            <li key={item.step} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-sky-500 text-white text-sm font-bold flex items-center justify-center">{item.step}</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 介護報酬とは ── */}
      <section className="space-y-3 print-hide">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">介護報酬とは</h2>
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
          <p>介護報酬とは、介護保険サービスを提供した事業所に対して支払われる対価のことです。厚生労働大臣が定める公定価格で、原則として3年ごとに改定されます。</p>
          <p>料金は「単位数 × 1単位の単価」で計算されます。単位数はサービスの種類・提供時間・要介護度などによって決まり、単価は事業所の所在地域（地域区分）とサービスの人件費割合によって10〜11.40円の範囲で異なります。</p>
          <p>利用者の自己負担は原則1割ですが、一定以上の所得がある方は2割または3割となります。令和6年度改定では訪問介護・通所介護の基本報酬が見直され、処遇改善加算が新体系に一本化されました。</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <div className="print-hide"><FAQSection faq={faqItems} title="よくある質問" /></div>
    </div>
  );
}
