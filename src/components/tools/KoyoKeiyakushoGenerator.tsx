"use client";

import { useState, useCallback } from "react";
import { AdUnit } from "@/components/common/AdUnit";
import {
  generateSections, completionRate,
  type ContractInput, type EmploymentType,
} from "@/lib/koyo-keiyakusho-template";

const DAYS = ["月", "火", "水", "木", "金", "土", "日"];
const EMP_TYPES: { v: EmploymentType; l: string }[] = [
  { v: "seishain", l: "正社員" }, { v: "part", l: "パート・アルバイト" },
  { v: "keiyaku", l: "契約社員" }, { v: "haken", l: "派遣社員" },
];
const FAQ = [
  { q: "雇用契約書に必要な記載事項は？", a: "労働基準法第15条に基づき、賃金・労働時間・就業場所・業務内容・雇用期間・休日などの明示が義務付けられています。2024年4月からは裁量労働制・フレックス制の対象者についても明示が強化されました。" },
  { q: "パート・アルバイトにも雇用契約書は必要？", a: "はい。パート・アルバイトを含むすべての労働者に対して、主要な労働条件を書面で明示することが義務です。2024年改正で、短時間・有期雇用労働者へのより詳細な明示も義務化されました。" },
  { q: "試用期間中は解雇しやすいのですか？", a: "試用期間中でも、14日を超えた場合は解雇予告が必要です（労基法21条）。採用前から客観的に明白な不適格事由がある場合を除き、合理的理由なく解雇することは認められません。" },
  { q: "無料テンプレートの法的効力は？", a: "当ツールで作成した雇用契約書は法的効力を持つ文書として使用できます。ただし、業種・業態・個別の事情に応じた修正が必要な場合があります。重要な雇用については社会保険労務士や弁護士への相談をお勧めします。" },
  { q: "雇用契約書は電子化できますか？", a: "2024年の法改正で、労働者の同意を得れば電子メール・PDFなど電子的方法による交付が正式に認められました。電子署名を用いた契約書も法的効力を持ちます。" },
];

const DEFAULT: ContractInput = {
  employmentType: "seishain", companyName: "", companyAddress: "", representativeName: "",
  employeeName: "", employeeAddress: "", employeeDOB: "", startDate: "", hasFixedTerm: false,
  contractEndDate: "", workLocation: "", jobDescription: "", workStartTime: "09:00",
  workEndTime: "18:00", breakMinutes: 60, workDays: [true,true,true,true,true,false,false],
  holidays: "土曜・日曜・祝日・年末年始", hasOvertime: true, wageType: "monthly",
  baseWage: 220000, allowances: [], paymentClosingDay: "末", paymentDay: "25",
  paymentMethodTransfer: true, healthInsurance: true, pension: true,
  employmentInsurance: true, workersAccident: true, hasProbationPeriod: true,
  probationPeriodMonths: 3,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

function TextIn({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
  );
}

function Circle() {
  return <div className="w-12 h-12 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center text-xs text-gray-400 mx-auto mt-1">印</div>;
}

export default function KoyoKeiyakushoGenerator() {
  const [inp, setInp] = useState<ContractInput>(DEFAULT);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const upd = useCallback(<K extends keyof ContractInput>(k: K, v: ContractInput[K]) =>
    setInp(p => ({ ...p, [k]: v })), []);

  const sections = generateSections(inp);
  const pct = completionRate(inp);
  const today = new Date();
  const dateStr = `令和${today.getFullYear() - 2018}年${today.getMonth() + 1}月${today.getDate()}日`;

  let uid = 0;
  function newAlId() { return `a${++uid}`; }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">雇用契約書作成ツール 2026</h1>
      <p className="text-sm text-gray-500 mb-2">必要事項を入力 → 右のプレビューを確認 → PDF出力</p>
      <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400 mb-6">入力完了率: {pct}%</p>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* ── FORM ── */}
        <div className="flex-1 space-y-4 print:hidden">

          {/* 雇用形態 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 mb-3 text-sm">雇用形態</h2>
            <div className="flex flex-wrap gap-2">
              {EMP_TYPES.map(t => (
                <button key={t.v} onClick={() => upd("employmentType", t.v)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${inp.employmentType === t.v ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:border-blue-400"}`}>
                  {t.l}
                </button>
              ))}
            </div>
          </div>

          {/* 当事者情報 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h2 className="font-semibold text-gray-700 text-sm">当事者情報</h2>
            <div className="grid grid-cols-2 gap-3">
              <Field label="会社名（甲）"><TextIn value={inp.companyName} onChange={v => upd("companyName", v)} placeholder="株式会社○○" /></Field>
              <Field label="代表者名"><TextIn value={inp.representativeName} onChange={v => upd("representativeName", v)} placeholder="代表取締役　山田太郎" /></Field>
            </div>
            <Field label="会社住所"><TextIn value={inp.companyAddress} onChange={v => upd("companyAddress", v)} placeholder="東京都渋谷区○○1-2-3" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="従業員氏名（乙）"><TextIn value={inp.employeeName} onChange={v => upd("employeeName", v)} placeholder="山田花子" /></Field>
              <Field label="生年月日"><input type="date" value={inp.employeeDOB} onChange={e => upd("employeeDOB", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" /></Field>
            </div>
            <Field label="従業員住所"><TextIn value={inp.employeeAddress} onChange={v => upd("employeeAddress", v)} placeholder="東京都新宿区○○4-5-6" /></Field>
          </div>

          {/* 雇用期間 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h2 className="font-semibold text-gray-700 text-sm">雇用期間</h2>
            <Field label="雇用開始日"><input type="date" value={inp.startDate} onChange={e => upd("startDate", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" /></Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={inp.hasFixedTerm} onChange={e => upd("hasFixedTerm", e.target.checked)} className="accent-blue-600 w-4 h-4" />
              <span className="text-sm text-gray-700">契約期間あり（有期雇用）</span>
            </label>
            {inp.hasFixedTerm && (
              <Field label="契約終了日"><input type="date" value={inp.contractEndDate} onChange={e => upd("contractEndDate", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" /></Field>
            )}
          </div>

          {/* 就業場所・業務 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h2 className="font-semibold text-gray-700 text-sm">就業場所・業務内容</h2>
            <Field label="就業場所"><TextIn value={inp.workLocation} onChange={v => upd("workLocation", v)} placeholder="本社（東京都渋谷区○○）" /></Field>
            <Field label="業務内容">
              <textarea value={inp.jobDescription} onChange={e => upd("jobDescription", e.target.value)}
                placeholder="営業事務、データ入力、来客対応など" rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
            </Field>
          </div>

          {/* 労働時間 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h2 className="font-semibold text-gray-700 text-sm">労働時間・休日</h2>
            <div className="grid grid-cols-3 gap-3">
              <Field label="始業時刻"><input type="time" value={inp.workStartTime} onChange={e => upd("workStartTime", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" /></Field>
              <Field label="終業時刻"><input type="time" value={inp.workEndTime} onChange={e => upd("workEndTime", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" /></Field>
              <Field label="休憩（分）">
                <input type="number" value={inp.breakMinutes} onChange={e => upd("breakMinutes", parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </Field>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">所定労働日</p>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map((d, i) => (
                  <button key={d} onClick={() => { const w = [...inp.workDays]; w[i] = !w[i]; upd("workDays", w); }}
                    className={`w-9 h-9 rounded-full text-sm font-medium border transition-colors ${inp.workDays[i] ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-500"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <Field label="休日"><TextIn value={inp.holidays} onChange={v => upd("holidays", v)} /></Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={inp.hasOvertime} onChange={e => upd("hasOvertime", e.target.checked)} className="accent-blue-600 w-4 h-4" />
              <span className="text-sm text-gray-700">時間外労働あり（36協定の範囲内）</span>
            </label>
          </div>

          {/* 賃金 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h2 className="font-semibold text-gray-700 text-sm">賃金</h2>
            <div className="flex gap-2">
              {(["monthly", "daily", "hourly"] as const).map(t => (
                <button key={t} onClick={() => upd("wageType", t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${inp.wageType === t ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600"}`}>
                  {t === "monthly" ? "月給" : t === "daily" ? "日給" : "時給"}
                </button>
              ))}
            </div>
            <Field label={`基本給（${inp.wageType === "monthly" ? "月額" : inp.wageType === "daily" ? "日額" : "時給"}）`}>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">¥</span>
                <input type="number" value={inp.baseWage} onChange={e => upd("baseWage", parseInt(e.target.value) || 0)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </Field>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">諸手当</p>
              {inp.allowances.map((a, i) => (
                <div key={a.id} className="flex gap-2 mb-1">
                  <input type="text" value={a.name} placeholder="手当名" onChange={e => { const arr = [...inp.allowances]; arr[i] = { ...a, name: e.target.value }; upd("allowances", arr); }}
                    className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <input type="number" value={a.amount} onChange={e => { const arr = [...inp.allowances]; arr[i] = { ...a, amount: parseInt(e.target.value) || 0 }; upd("allowances", arr); }}
                    className="w-28 border border-gray-300 rounded-lg px-2 py-1.5 text-right font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <button onClick={() => upd("allowances", inp.allowances.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-1">×</button>
                </div>
              ))}
              <button onClick={() => upd("allowances", [...inp.allowances, { id: newAlId(), name: "", amount: 0 }])}
                className="text-sm text-blue-600 hover:text-blue-800 mt-1">＋ 手当を追加</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="締め日"><TextIn value={inp.paymentClosingDay} onChange={v => upd("paymentClosingDay", v)} placeholder="末" /></Field>
              <Field label="支払日"><TextIn value={inp.paymentDay} onChange={v => upd("paymentDay", v)} placeholder="25" /></Field>
            </div>
            <div className="flex gap-3">
              {[true, false].map(t => (
                <button key={String(t)} onClick={() => upd("paymentMethodTransfer", t)}
                  className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${inp.paymentMethodTransfer === t ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600"}`}>
                  {t ? "銀行振込" : "現金手渡し"}
                </button>
              ))}
            </div>
          </div>

          {/* 社会保険 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 text-sm mb-3">社会保険・労働保険</h2>
            <div className="grid grid-cols-2 gap-2">
              {([["healthInsurance", "健康保険"], ["pension", "厚生年金"], ["employmentInsurance", "雇用保険"], ["workersAccident", "労災保険"]] as [keyof ContractInput, string][]).map(([k, l]) => (
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={inp[k] as boolean} onChange={e => upd(k, e.target.checked as ContractInput[typeof k])} className="accent-blue-600 w-4 h-4" />
                  <span className="text-sm text-gray-700">{l}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 試用期間 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={inp.hasProbationPeriod} onChange={e => upd("hasProbationPeriod", e.target.checked)} className="accent-blue-600 w-4 h-4" />
              <span className="font-semibold text-gray-700 text-sm">試用期間あり</span>
            </label>
            {inp.hasProbationPeriod && (
              <Field label="試用期間（ヶ月）">
                <input type="number" min={1} max={6} value={inp.probationPeriodMonths} onChange={e => upd("probationPeriodMonths", parseInt(e.target.value) || 3)}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </Field>
            )}
          </div>
          <AdUnit slot="5612038947" format="rectangle" className="my-4" />
        </div>

        {/* ── PREVIEW ── */}
        <div className="xl:w-[520px] xl:sticky xl:top-4 self-start">
          <div className="flex gap-2 mb-3 print:hidden">
            <button onClick={() => window.print()}
              className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors">
              🖨️ PDF出力
            </button>
            <button onClick={() => navigator.clipboard.writeText(sections.map(s => `第${s.article}条（${s.title}）\n${s.content}`).join("\n\n"))}
              className="px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
              コピー
            </button>
          </div>

          <div id="contract-preview" className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 print:shadow-none print:border-none print:rounded-none">
            <div className="font-serif text-gray-900">
              <h2 className="text-center text-2xl font-bold tracking-widest mb-6">雇用契約書</h2>
              <p className="text-right text-sm mb-6">{dateStr}</p>

              <div className="text-sm mb-2 font-semibold">甲（使用者）</div>
              <div className="text-sm mb-1 pl-4">会社名：{inp.companyName || "　　　　　　　　　　"}</div>
              <div className="text-sm mb-1 pl-4">住所：{inp.companyAddress || "　　　　　　　　　　"}</div>
              <div className="text-sm mb-4 pl-4">代表者：{inp.representativeName || "　　　　　　　　　　"} <Circle /></div>

              <div className="text-sm mb-2 font-semibold mt-6">乙（労働者）</div>
              <div className="text-sm mb-1 pl-4">氏名：{inp.employeeName || "　　　　　　　　　　"} <Circle /></div>
              <div className="text-sm mb-1 pl-4">住所：{inp.employeeAddress || "　　　　　　　　　　"}</div>
              <div className="text-sm mb-6 pl-4">生年月日：{inp.employeeDOB || "　　年　　月　　日"}</div>

              <p className="text-sm mb-6 border-t border-b border-gray-300 py-3">
                甲と乙は、以下の条件により雇用契約を締結する。
              </p>

              {sections.map(s => (
                <div key={s.article} className="mb-5">
                  <div className="text-sm font-bold mb-1">第{s.article}条（{s.title}）</div>
                  <div className="text-sm pl-3 whitespace-pre-line text-gray-700 leading-relaxed">{s.content}</div>
                </div>
              ))}

              <p className="text-sm mt-8 pt-4 border-t border-gray-300">
                本契約の成立を証するため、本書2通を作成し、甲乙各1通を保有する。
              </p>

              <div className="grid grid-cols-2 gap-8 mt-8">
                <div className="text-center text-sm">
                  <p className="font-semibold">甲（会社）</p>
                  <Circle />
                  <p className="mt-1">{inp.companyName || "会社名"}</p>
                </div>
                <div className="text-center text-sm">
                  <p className="font-semibold">乙（従業員）</p>
                  <Circle />
                  <p className="mt-1">{inp.employeeName || "氏名"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50">
                <span className="font-medium text-gray-800 pr-4">{item.q}</span>
                <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${faqOpen === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {faqOpen === i && <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
      <AdUnit slot="5612038947" format="horizontal" className="mt-8 print:hidden" />

      <style>{`@media print { body * { visibility: hidden; } #contract-preview, #contract-preview * { visibility: visible; } #contract-preview { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}
