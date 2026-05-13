"use client";

import { useState, useEffect } from "react";
import { FAQSection } from "@/components/FAQSection";
import {
  YOUKAIGODO_DATA,
  SERVICE_LABELS,
  FACILITY_LABELS,
  STATE_CHECKLIST,
} from "@/data/youkaigodo";
import type { YoukaigodoLevel, ServiceAvailability } from "@/data/youkaigodo";

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
    </svg>
  ),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

function AvailBadge({ val }: { val: ServiceAvailability }) {
  if (val === "ok") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
        ✅ 利用可
      </span>
    );
  }
  if (val === "limited") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
        ⚠️ 条件付き
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
      — 対象外
    </span>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ = [
  {
    question: "要介護度はどうやって決まるの?",
    answer: "市区町村に申請後、訪問調査と主治医意見書をもとに介護認定審査会が判定します。1次判定はコンピューターによる審査、2次判定は専門家による検討を経て決定されます。",
  },
  {
    question: "要支援と要介護の違いは?",
    answer: "要支援は「改善の可能性が高く、介護予防により悪化を防げる状態」、要介護は「継続的な介護が必要な状態」です。利用できるサービスや限度額が異なります。",
  },
  {
    question: "特別養護老人ホーム (特養) には誰でも入れるの?",
    answer: "原則として要介護3以上の方が対象です。要介護1〜2の方は、認知症や家族の介護困難など特例事由が認められる場合のみ入居可能です。",
  },
  {
    question: "限度額を超えるとどうなる?",
    answer: "限度額を超えた分は全額自己負担になります。ケアマネジャーと相談し、サービスを限度内に調整するのが一般的です。",
  },
  {
    question: "介護度は変更できる?",
    answer: "状態が変化した場合、区分変更申請ができます。また有効期間（新規6〜12か月、更新12〜48か月）ごとに更新審査があります。",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function YoukaigodoClient() {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<YoukaigodoLevel>("kaigo1");
  const [compareLeft, setCompareLeft] = useState<YoukaigodoLevel>("shien2");
  const [compareRight, setCompareRight] = useState<YoukaigodoLevel>("kaigo1");
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400 dark:text-gray-600">
        読み込み中...
      </div>
    );
  }

  const current = YOUKAIGODO_DATA.find((d) => d.id === selected)!;
  const leftData = YOUKAIGODO_DATA.find((d) => d.id === compareLeft)!;
  const rightData = YOUKAIGODO_DATA.find((d) => d.id === compareRight)!;

  const levelOptions = YOUKAIGODO_DATA.map((d) => ({ label: d.shortLabel, value: d.id }));

  function handleCompare() {
    setShowCompare(true);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4 print-hide">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-2">›</span>
        <a href="/care" className="hover:underline">介護・保育</a>
        <span className="mx-2">›</span>
        <span>要介護度 早見表</span>
      </nav>

      {/* H1 + lead */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 print-hide">
        要介護度 早見表<br className="sm:hidden" />
        <span className="text-lg sm:text-xl font-normal text-gray-600 dark:text-gray-400 ml-2 sm:ml-0 sm:block">
          【7段階の違い・限度額・利用可能サービス】
        </span>
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm sm:text-base print-hide">
        要支援1から要介護5まで、状態の目安・支給限度額・自己負担・利用できるサービスを一覧で比較。
        令和6年度介護保険制度に基づく最新版です。
      </p>

      {/* ── Section 1: 区分選択 + 詳細カード ── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 print-hide">区分を選んで詳細を確認</h2>

        {/* Chip selector */}
        <div className="flex flex-wrap gap-2 mb-6 print-hide">
          {levelOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelected(opt.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                selected === opt.value
                  ? "bg-sky-500 text-white border-sky-500"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-sky-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Detail card */}
        <div className="bg-white dark:bg-gray-800 border-l-4 border-sky-500 rounded-lg shadow-sm p-5">
          <h3 className="text-xl font-bold text-sky-600 dark:text-sky-400 mb-2">{current.label}</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{current.description}</p>

          {/* 限度額 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">月額支給限度額</div>
              {current.limitUnits ? (
                <>
                  <div className="text-base font-bold text-gray-900 dark:text-white">{fmt(current.limitUnits)} 単位</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">約 {fmt(current.limitYen!)} 円</div>
                </>
              ) : (
                <div className="text-base font-bold text-gray-400">対象外</div>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">1割負担の目安</div>
              <div className="text-base font-bold text-gray-900 dark:text-white">
                {current.burden1 ? `約 ${fmt(current.burden1)} 円` : "—"}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3 col-span-2 sm:col-span-1">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">2割 / 3割負担</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {current.burden2 ? `${fmt(current.burden2)} 円` : "—"}
                {" / "}
                {current.burden3 ? `${fmt(current.burden3)} 円` : "—"}
              </div>
            </div>
          </div>

          {/* サービス */}
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">主な利用可能サービス</div>
            <div className="flex flex-col gap-2">
              {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{label}</span>
                  <AvailBadge val={current.services[key] as ServiceAvailability} />
                </div>
              ))}
            </div>
          </div>

          {/* 施設 */}
          <div className="mb-5">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">入居可能な施設</div>
            <div className="flex flex-col gap-2">
              {Object.entries(FACILITY_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{label}</span>
                  <AvailBadge val={current.facilities[key] as ServiceAvailability} />
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 flex gap-2">
            <span className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"><Icons.Info /></span>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              ※支給限度額・自己負担額は概算です。1単位の単価は地域・サービス種別により10円〜11.40円で変動するため、実際の金額は異なります。
              ※令和6年度介護保険制度に基づきます。
              ※実際の認定区分は市区町村の介護認定審査会で決定されます。
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: 2区分比較 ── */}
      <section className="mb-10 print-hide">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">2つの区分を比較</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end mb-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">比較 左</label>
              <div className="relative">
                <select
                  value={compareLeft}
                  onChange={(e) => { setCompareLeft(e.target.value as YoukaigodoLevel); setShowCompare(false); }}
                  className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {levelOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><Icons.ChevronDown /></span>
              </div>
            </div>
            <div className="hidden sm:block text-gray-400 font-bold pb-2">vs</div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">比較 右</label>
              <div className="relative">
                <select
                  value={compareRight}
                  onChange={(e) => { setCompareRight(e.target.value as YoukaigodoLevel); setShowCompare(false); }}
                  className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {levelOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><Icons.ChevronDown /></span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCompare}
              className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              比較する
            </button>
          </div>

          {showCompare && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {leftData.label} と {rightData.label} の違い
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="px-3 py-2 text-left text-xs text-gray-500 dark:text-gray-400 font-medium w-28">項目</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-sky-600 dark:text-sky-400">{leftData.label}</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-sky-600 dark:text-sky-400">{rightData.label}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr>
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">状態の目安</td>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{leftData.description}</td>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{rightData.description}</td>
                    </tr>
                    <tr className="bg-gray-50/50 dark:bg-gray-700/20">
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">月額限度額</td>
                      <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                        {leftData.limitUnits ? `${fmt(leftData.limitUnits)} 単位` : "対象外"}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                        {rightData.limitUnits ? `${fmt(rightData.limitUnits)} 単位` : "対象外"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">1割負担</td>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                        {leftData.burden1 ? `約 ${fmt(leftData.burden1)} 円` : "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                        {rightData.burden1 ? `約 ${fmt(rightData.burden1)} 円` : "—"}
                      </td>
                    </tr>
                    <tr className="bg-gray-50/50 dark:bg-gray-700/20">
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">特養入居</td>
                      <td className="px-3 py-2"><AvailBadge val={leftData.facilities.tokuyou as ServiceAvailability} /></td>
                      <td className="px-3 py-2"><AvailBadge val={rightData.facilities.tokuyou as ServiceAvailability} /></td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">訪問介護</td>
                      <td className="px-3 py-2"><AvailBadge val={leftData.services.homon_kaigo as ServiceAvailability} /></td>
                      <td className="px-3 py-2"><AvailBadge val={rightData.services.homon_kaigo as ServiceAvailability} /></td>
                    </tr>
                    <tr className="bg-gray-50/50 dark:bg-gray-700/20">
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">デイサービス</td>
                      <td className="px-3 py-2"><AvailBadge val={leftData.services.tsusho_kaigo as ServiceAvailability} /></td>
                      <td className="px-3 py-2"><AvailBadge val={rightData.services.tsusho_kaigo as ServiceAvailability} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Section 3: 全区分一覧表 ── */}
      <section className="mb-10 print-hide">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">全区分 一覧表</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-sky-50 dark:bg-sky-900/30">
              <tr>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">区分</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">限度単位/月</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">概算円/月</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">1割負担</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {YOUKAIGODO_DATA.map((d, i) => (
                <tr
                  key={d.id}
                  onClick={() => setSelected(d.id)}
                  className={`cursor-pointer transition-colors ${
                    selected === d.id
                      ? "bg-sky-50 dark:bg-sky-900/20"
                      : i % 2 === 0 ? "hover:bg-gray-50 dark:hover:bg-gray-700/30" : "bg-gray-50/50 dark:bg-gray-700/10 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                  }`}
                >
                  <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{d.label}</td>
                  <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                    {d.limitUnits ? fmt(d.limitUnits) : "—"}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                    {d.limitYen ? `${fmt(d.limitYen)} 円` : "—"}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                    {d.burden1 ? `${fmt(d.burden1)} 円` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">行をクリックすると詳細カードに反映されます。</p>
      </section>

      {/* ── Section 4: 状態判定の目安 ── */}
      <section className="mb-10 print-hide">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">あなたのご家族はどの区分？</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">状態別の目安チェックリストです（実際の認定は審査会が決定します）。</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STATE_CHECKLIST.map((entry) => {
            const d = YOUKAIGODO_DATA.find((x) => x.id === entry.level)!;
            return (
              <div key={entry.level} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2">{d.label}</div>
                <ul className="space-y-1">
                  {entry.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-green-500 mt-0.5 flex-shrink-0"><Icons.Check /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 5: 認定の流れ ── */}
      <section className="mb-10 print-hide">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">認定の流れ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: 1, title: "市区町村に申請", desc: "本人または家族が窓口・郵送で申請。ケアマネや地域包括支援センターが代行可能。" },
            { step: 2, title: "訪問調査・主治医意見書", desc: "市区町村の調査員が自宅等を訪問。主治医が意見書を作成。" },
            { step: 3, title: "認定審査会", desc: "コンピューター1次判定後、医師・保健師などの専門家が2次判定。" },
            { step: 4, title: "結果通知", desc: "申請から原則30日以内に通知。有効期間内にサービス利用開始。" },
          ].map((s) => (
            <div key={s.step} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 relative">
              <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold mb-3">
                {s.step}
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{s.title}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 関連ツール ── */}
      <section className="mb-10 bg-sky-50 dark:bg-gray-800 rounded-lg p-5 print-hide">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">関連ツール</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/business/kaigo-hoshu-calc"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-sky-400 transition-colors"
          >
            🏥 介護報酬 単位計算機
          </a>
        </div>
      </section>

      {/* Blog callout */}
      <section className="mt-12 print-hide">
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 dark:border-sky-800 dark:bg-sky-950/50">
          <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">📖 もっと詳しく</p>
          <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            要支援と要介護の違いは?7段階を徹底解説
          </h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            認定の流れ、ケアマネ選び、特養入居の境目まで、家族目線で完全解説。
          </p>
          <a
            href="/blog/youkaigodo-chigai-wakariyasuku"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            解説記事を読む →
          </a>
        </div>
      </section>

      {/* ── FAQ ── */}
      <div className="print-hide"><FAQSection faq={FAQ} title="よくある質問" /></div>
    </main>
  );
}
