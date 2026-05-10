
"use client";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import { useState, useCallback } from "react";

const KOKUSEKI_FEES: Record<string, number> = {
  "ベトナム": 0,
  "フィリピン": 50000,
  "インドネシア": 80000,
  "タイ": 60000,
  "ミャンマー": 100000,
  "カンボジア": 80000,
  "中国": 80000,
  "ネパール": 80000,
  "モンゴル": 80000,
  "その他": 120000,
};
const KOKUSEKI_LIST = Object.keys(KOKUSEKI_FEES);

const SHOKUSHU_LIST = [
  "介護", "ビルクリーニング", "素形材・産業機械", "建設",
  "造船・舶用", "自動車整備", "航空", "宿泊",
  "農業", "漁業", "飲食料品製造", "外食業", "特定技能2号",
];

const SUPPORT_MONTHLY = 36000;

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP") + "円"; }

export default function TokuteiClient() {
  const tool = getToolById("tokutei-gino-calculator");
  const [ninzu, setNinzu] = useState("1");
  const [shokushu, setShokushu] = useState("介護");
  const [kokuseki, setKokuseki] = useState("ベトナム");
  const [hoho, setHoho] = useState<"kaigai"|"kokunai">("kaigai");
  const [useSupport, setUseSupport] = useState(true);
  const [supportPeriod, setSupportPeriod] = useState<1|2|3>(1);
  const [supportMonthly, setSupportMonthly] = useState(String(SUPPORT_MONTHLY));

  const calc = useCallback(() => {
    const n = Math.max(1, parseInt(ninzu) || 1);
    const sm = parseInt(supportMonthly) || SUPPORT_MONTHLY;
    const months = supportPeriod * 12;

    const okuriDashiFee = hoho === "kaigai" ? KOKUSEKI_FEES[kokuseki] ?? 80000 : 0;
    const nihongoFee = 7000;
    const ginoFee = 15000;
    const zairyuFee = hoho === "kaigai" ? 150000 : 100000;
    const tokoBi = hoho === "kaigai" ? 100000 : 0;
    const jukyoFee = hoho === "kaigai" ? 200000 : 150000;

    const initialPerPerson = okuriDashiFee + nihongoFee + ginoFee + zairyuFee + tokoBi + jukyoFee;
    const initialTotal = initialPerPerson * n;
    const monthlyRunning = useSupport ? sm : 0;
    const supportTotal = monthlyRunning * months * n;
    const grandTotal = initialTotal + supportTotal;

    return {
      n, okuriDashiFee, nihongoFee, ginoFee, zairyuFee, tokoBi, jukyoFee,
      initialPerPerson, initialTotal, monthlyRunning, supportTotal, grandTotal, months,
    };
  }, [ninzu, kokuseki, hoho, useSupport, supportPeriod, supportMonthly]);

  const r = calc();
  const ic = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon";
  const lc = "block text-sm font-medium text-gray-700 mb-1";

  const breakdown = [
    { label: "送り出し機関手数料", value: r.okuriDashiFee, note: kokuseki === "ベトナム" ? "ベトナムは法律上徴収禁止" : "現地エージェント費用" },
    { label: "日本語試験受験料", value: r.nihongoFee, note: "JFT-Basic等" },
    { label: "技能試験受験料", value: r.ginoFee, note: "特定技能評価試験" },
    { label: "在留資格申請費（行政書士）", value: r.zairyuFee, note: "申請取次費用" },
    { label: "渡航費", value: r.tokoBi, note: hoho === "kokunai" ? "国内変更のため不要" : "航空券等" },
    { label: "住居初期費用", value: r.jukyoFee, note: "敷金・礼金・家財等" },
  ];

  const TIMELINE = hoho === "kaigai"
    ? ["求人票作成・マッチング (1〜2ヶ月)", "現地面接・内定 (2〜3ヶ月)", "技能・日本語試験 (3〜5ヶ月)", "在留資格申請 (4〜6ヶ月)", "VISA発給・渡航準備 (5〜7ヶ月)", "入社・支援開始 (6〜8ヶ月)"]
    : ["求人票作成・マッチング (1ヶ月)", "面接・内定 (1〜2ヶ月)", "在留資格変更申請 (2〜4ヶ月)", "入社・支援開始 (3〜5ヶ月)"];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">特定技能 在留資格 費用計算機</h1>
      <p className="text-sm text-gray-500 mb-6">採用人数・国籍・職種別に総費用を自動計算</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lc}>採用人数</label>
            <input type="number" min="1" className={ic} value={ninzu} onChange={e => setNinzu(e.target.value)} />
          </div>
          <div>
            <label className={lc}>職種</label>
            <select className={ic} value={shokushu} onChange={e => setShokushu(e.target.value)}>
              {SHOKUSHU_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lc}>国籍</label>
            <select className={ic} value={kokuseki} onChange={e => setKokuseki(e.target.value)}>
              {KOKUSEKI_LIST.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className={lc}>採用方法</label>
            <select className={ic} value={hoho} onChange={e => setHoho(e.target.value as "kaigai"|"kokunai")}>
              <option value="kaigai">海外からの招へい</option>
              <option value="kokunai">国内在留者からの変更</option>
            </select>
          </div>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={useSupport} onChange={e => setUseSupport(e.target.checked)} className="accent-blue-600 w-4 h-4" />
            登録支援機関を利用する
          </label>
          {useSupport && (
            <div className="ml-6 grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>月額費用（円/人）</label>
                <input type="number" className={ic} value={supportMonthly} onChange={e => setSupportMonthly(e.target.value)} />
              </div>
              <div>
                <label className={lc}>支援期間</label>
                <select className={ic} value={supportPeriod} onChange={e => setSupportPeriod(Number(e.target.value) as 1|2|3)}>
                  <option value={1}>1年</option>
                  <option value={2}>2年</option>
                  <option value={3}>3年</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-kon text-white rounded-t-xl px-6 py-4">
        <div className="text-sm opacity-80">支援期間合計費用（{r.n}人）</div>
        <div className="text-3xl font-bold mt-1">{fmt(r.grandTotal)}</div>
        <div className="text-xs opacity-70 mt-1">初期費用 {fmt(r.initialTotal)} + 支援費用 {fmt(r.supportTotal)}</div>
      </div>
      <div className="bg-white border border-gray-200 rounded-b-xl mb-4 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2 text-gray-600 font-medium">費用項目（1人あたり）</th>
              <th className="text-right px-4 py-2 text-gray-600 font-medium">金額</th>
              <th className="text-right px-4 py-2 text-gray-600 font-medium hidden sm:table-cell">備考</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {breakdown.map(row => (
              <tr key={row.label}>
                <td className="px-4 py-2 text-gray-700">{row.label}</td>
                <td className="px-4 py-2 text-right font-medium">{fmt(row.value)}</td>
                <td className="px-4 py-2 text-right text-gray-400 text-xs hidden sm:table-cell">{row.note}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-2 text-kon">初期費用合計（1人）</td>
              <td className="px-4 py-2 text-right text-kon">{fmt(r.initialPerPerson)}</td>
              <td className="hidden sm:table-cell" />
            </tr>
            {useSupport && (
              <tr>
                <td className="px-4 py-2 text-gray-700">登録支援機関費（{r.months}ヶ月×{r.n}人）</td>
                <td className="px-4 py-2 text-right font-medium">{fmt(r.supportTotal)}</td>
                <td className="px-4 py-2 text-right text-gray-400 text-xs hidden sm:table-cell">月額{fmt(parseInt(supportMonthly)||36000)}/人</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm">
        <p className="font-medium text-kon mb-1">人材派遣との比較</p>
        <p className="text-kon">人材派遣（紹介予定）は一般的に <strong>50〜80万円/人</strong> の紹介手数料がかかります。特定技能は初期費用は類似しますが、長期在籍・直接雇用のメリットがあります。</p>
      </div>

      {kokuseki === "ベトナム" && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm">
          <p className="font-semibold text-danger mb-1">注意：ベトナム国籍の場合</p>
          <p className="text-danger">ベトナム政府通達により、送り出し機関が特定技能の受入れ機関または外国人から手数料を徴収することは禁止されています（2019年施行）。</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8">
        <p className="text-sm font-medium text-gray-700 mb-3">手続きの流れ（{hoho === "kaigai" ? "海外招へい" : "国内変更"}）</p>
        <div className="space-y-2">
          {TIMELINE.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-kon text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-sm text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </div>


      <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="text-gray-400 text-xs">山田ツール | yamada-tools.jp で無料作成</p>
        <p className="text-gray-300 text-xs mt-1">透かしなし・高品質PDFはPROプランで → yamada-tools.jp/pricing</p>
      </div>
      {tool && <RelatedTools currentTool={tool} maxItems={4} />}
    </div>
  );
}
