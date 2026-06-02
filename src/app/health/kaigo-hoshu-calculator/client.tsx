
"use client";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import { useState, useMemo } from "react";

const SERVICES = [
  { label: "訪問介護（身体介護）20分未満", units: 167 },
  { label: "訪問介護（身体介護）20〜30分未満", units: 250 },
  { label: "訪問介護（身体介護）30〜60分未満", units: 396 },
  { label: "訪問介護（生活援助）20〜45分未満", units: 183 },
  { label: "訪問介護（生活援助）45〜60分未満", units: 225 },
  { label: "通所介護（要介護1）3〜4時間", units: 385 },
  { label: "通所介護（要介護2）3〜4時間", units: 441 },
  { label: "通所介護（要介護3）3〜4時間", units: 496 },
  { label: "通所介護（要介護4）3〜4時間", units: 550 },
  { label: "通所介護（要介護5）3〜4時間", units: 604 },
  { label: "短期入所生活介護（要介護1）", units: 596 },
  { label: "短期入所生活介護（要介護3）", units: 775 },
  { label: "訪問看護（30分未満）", units: 470 },
  { label: "訪問看護（30〜60分未満）", units: 821 },
  { label: "居宅介護支援（要介護1・2）", units: 1076 },
  { label: "居宅介護支援（要介護3・4・5）", units: 1398 },
];

const GRADE_UNIT_PRICE = [0, 11.40, 11.12, 11.05, 10.84, 10.70, 10.42, 10.21, 10.00];
const GRADE_LABELS = ["", "1級地（東京特別区等）", "2級地（横浜市等）", "3級地（大阪市等）", "4級地（千葉市等）", "5級地（さいたま市等）", "6級地（中規模都市）", "7級地（小都市）", "その他"];

const PREF_GRADE: Record<string, number> = {
  "北海道": 7, "青森県": 8, "岩手県": 8, "宮城県": 7, "秋田県": 8,
  "山形県": 8, "福島県": 8, "茨城県": 7, "栃木県": 7, "群馬県": 7,
  "埼玉県": 4, "千葉県": 4, "東京都": 1, "神奈川県": 2, "新潟県": 8,
  "富山県": 8, "石川県": 8, "福井県": 8, "山梨県": 8, "長野県": 8,
  "岐阜県": 7, "静岡県": 7, "愛知県": 4, "三重県": 7, "滋賀県": 6,
  "京都府": 5, "大阪府": 3, "兵庫県": 6, "奈良県": 7, "和歌山県": 8,
  "鳥取県": 8, "島根県": 8, "岡山県": 7, "広島県": 7, "山口県": 8,
  "徳島県": 8, "香川県": 8, "愛媛県": 8, "高知県": 8, "福岡県": 6,
  "佐賀県": 8, "長崎県": 8, "熊本県": 8, "大分県": 8, "宮崎県": 8,
  "鹿児島県": 8, "沖縄県": 8,
};
const PREFS = Object.keys(PREF_GRADE);

const PERCENT_ADDONS = [
  { key: "shogai", label: "処遇改善加算（Ⅰ）", rate: 13.7 },
  { key: "tokuShogai", label: "特定処遇改善加算（Ⅰ）", rate: 2.5 },
  { key: "base", label: "ベースアップ等支援加算", rate: 1.2 },
];
const UNIT_ADDONS = [
  { key: "shokai", label: "初回加算", units: 200, perUse: false },
  { key: "kyukyu", label: "緊急時訪問看護加算", units: 265, perUse: true },
];

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP") + "円"; }

export default function KaigoClient() {
  const tool = getToolById("kaigo-hoshu-calculator");
  const [svcIdx, setSvcIdx] = useState(0);
  const [count, setCount] = useState("4");
  const [pref, setPref] = useState("東京都");
  const [futan, setFutan] = useState<1|2|3>(1);
  const [pct, setPct] = useState<Record<string, boolean>>({ shogai: false, tokuShogai: false, base: false });
  const [unitAdd, setUnitAdd] = useState<Record<string, boolean>>({ shokai: false, kyukyu: false });
  const [explain, setExplain] = useState(false);

  const grade = PREF_GRADE[pref] ?? 8;
  const unitPrice = GRADE_UNIT_PRICE[grade];

  const r = useMemo(() => {
    const n = Math.max(1, parseFloat(count) || 1);
    const baseUnits = SERVICES[svcIdx].units;
    const unitAddonTotal = UNIT_ADDONS.reduce((sum, a) => {
      if (!unitAdd[a.key]) return sum;
      return sum + (a.perUse ? a.units * n : a.units);
    }, 0);
    const totalUnitsRaw = baseUnits * n + unitAddonTotal;
    const pctBonus = PERCENT_ADDONS.reduce((sum, a) => pct[a.key] ? sum + a.rate : sum, 0);
    const totalUnits = totalUnitsRaw * (1 + pctBonus / 100);
    const totalReward = totalUnits * unitPrice;
    const userBurden = totalReward * futan / 10;
    const insurance = totalReward - userBurden;
    const perUse = n > 0 ? userBurden / n : 0;
    return { totalUnits, totalReward, userBurden, insurance, perUse, n, baseUnits };
  }, [svcIdx, count, futan, pct, unitAdd, unitPrice]);
  const ic = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon";
  const lc = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">介護報酬計算機</h1>
      <p className="text-sm text-gray-500 mb-6">2024年改定対応・地域区分・加算込みで利用者負担と事業者受取額を計算</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 mb-6">
        <div>
          <label className={lc}>サービス種別</label>
          <select className={ic} value={svcIdx} onChange={e => setSvcIdx(Number(e.target.value))}>
            {SERVICES.map((s, i) => <option key={i} value={i}>{s.label}（{s.units}単位）</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lc}>月間利用回数・日数</label>
            <input type="number" min="1" className={ic} value={count} onChange={e => setCount(e.target.value)} />
          </div>
          <div>
            <label className={lc}>都道府県</label>
            <select className={ic} value={pref} onChange={e => setPref(e.target.value)}>
              {PREFS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="text-xs text-kon bg-gray-50 rounded-lg px-3 py-2">
          地域区分: {GRADE_LABELS[grade]}（1単位 = {unitPrice.toFixed(2)}円）
        </div>
        <div>
          <label className={lc}>自己負担割合</label>
          <div className="flex gap-6">
            {([1, 2, 3] as const).map(v => (
              <label key={v} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="radio" name="futan" checked={futan === v} onChange={() => setFutan(v)} className="accent-blue-600" />
                {v}割
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className={lc}>加算（複数選択可）</p>
          <div className="space-y-2">
            {PERCENT_ADDONS.map(a => (
              <label key={a.key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={pct[a.key]} onChange={e => setPct(p => ({ ...p, [a.key]: e.target.checked }))} className="accent-blue-600 w-4 h-4" />
                {a.label}（+{a.rate}%）
              </label>
            ))}
            {UNIT_ADDONS.map(a => (
              <label key={a.key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={unitAdd[a.key]} onChange={e => setUnitAdd(p => ({ ...p, [a.key]: e.target.checked }))} className="accent-blue-600 w-4 h-4" />
                {a.label}（+{a.units}単位{a.perUse ? "/回" : "/月1回"}）
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-kon text-white rounded-t-xl px-6 py-4">
        <div className="text-sm font-medium opacity-80">月額総報酬額（事業者受取）</div>
        <div className="text-3xl font-bold mt-1">{fmt(r.totalReward)}</div>
        <div className="text-xs opacity-70 mt-1">{Math.round(r.totalUnits).toLocaleString()}単位 × {unitPrice.toFixed(2)}円</div>
      </div>
      <div className="bg-white border border-gray-200 rounded-b-xl divide-y divide-gray-100 mb-4">
        {[
          { label: `利用者負担額（${futan}割）`, value: fmt(r.userBurden), hi: true },
          { label: `保険給付額（${10 - futan}割）`, value: fmt(r.insurance) },
          { label: "1回あたり利用者負担額", value: fmt(r.perUse) },
        ].map(row => (
          <div key={row.label} className={`flex justify-between items-center px-6 py-3 text-sm ${row.hi ? "font-semibold text-kon" : "text-gray-700"}`}>
            <span>{row.label}</span><span>{row.value}</span>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => setExplain(e => !e)} className="text-sm text-kon underline mb-4 print:hidden">
        {explain ? "▲ 説明を閉じる" : "▼ わかりやすく説明"}
      </button>
      {explain && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-gray-700 space-y-2">
          <p>「{SERVICES[svcIdx].label}」は <strong>{SERVICES[svcIdx].units}単位/回</strong> です。</p>
          <p>{r.n}回利用で基本単位数は <strong>{(r.baseUnits * r.n).toLocaleString()}単位</strong>。</p>
          <p>{pref}は{GRADE_LABELS[grade]}のため1単位 = <strong>{unitPrice.toFixed(2)}円</strong>。</p>
          <p>事業者受取総額 <strong>{fmt(r.totalReward)}</strong> のうち{futan}割があなたの負担 = <strong>{fmt(r.userBurden)}</strong>。</p>
          <p>残り{10 - futan}割は介護保険から給付（<strong>{fmt(r.insurance)}</strong>）されます。</p>
        </div>
      )}

      <button type="button" onClick={() => window.print()} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg text-sm transition mb-8 print:hidden">
        印刷・PDF保存
      </button>

      <details className="mb-8">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">よくある質問</summary>
        <div className="mt-3 space-y-3 text-sm text-gray-700">
          <div><p className="font-medium">介護報酬の単位数とは？</p><p className="mt-1 text-gray-500">各サービスに厚生労働省が定めた基準単位数に地域区分の単価を乗じて報酬額を算出します。地域ごとに人件費格差を補正するために単価が異なります（10.00〜11.40円）。</p></div>
          <div><p className="font-medium">この計算は概算ですか？</p><p className="mt-1 text-gray-500">はい、概算です。実際の報酬は体制加算・減算・個別の算定要件によって変わります。正確な請求は国保連または事業所システムをご確認ください。</p></div>
        </div>
      </details>


      <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="text-gray-400 text-xs">山田ツール | yamada-tools.jp で無料作成</p>
        <p className="text-gray-300 text-xs mt-1">透かしなし・高品質PDFはPROプランで → yamada-tools.jp/pricing</p>
      </div>
      {tool && <RelatedTools currentTool={tool} maxItems={4} />}
    </div>
  );
}
