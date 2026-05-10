"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

// ─── Calculation helpers ───────────────────────────────────────────────────

function calcTakeHome(annualIncome: number): number {
  const socialInsurance = annualIncome * 0.14;
  const taxableIncome = annualIncome - socialInsurance - 480000;
  let incomeTax = 0;
  if (taxableIncome <= 0) {
    incomeTax = 0;
  } else if (taxableIncome <= 1950000) {
    incomeTax = taxableIncome * 0.05;
  } else if (taxableIncome <= 3300000) {
    incomeTax = taxableIncome * 0.10 - 97500;
  } else if (taxableIncome <= 6950000) {
    incomeTax = taxableIncome * 0.20 - 427500;
  } else if (taxableIncome <= 9000000) {
    incomeTax = taxableIncome * 0.23 - 636000;
  } else {
    incomeTax = taxableIncome * 0.33 - 1536000;
  }
  const residentTax = taxableIncome > 0 ? taxableIncome * 0.10 : 0;
  return annualIncome - socialInsurance - incomeTax - residentTax;
}

function yearsToGoal(current: number, target: number, rate: number): number {
  if (rate <= 0) return 999;
  return Math.ceil(Math.log(target / current) / Math.log(1 + rate / 100));
}

function sideIncomeNetAnnual(monthlyIncome: number): number {
  return monthlyIncome * 12 * 0.80;
}

function calcROI(expectedIncrease: number, cost: number): number {
  if (cost <= 0) return 0;
  return ((expectedIncrease - cost) / cost) * 100;
}

function calcPaybackMonths(cost: number, annualIncrease: number): number {
  if (annualIncrease <= 0) return 999;
  return Math.ceil((cost / annualIncrease) * 12);
}

function fmtMan(yen: number): string {
  return Math.round(yen / 10000).toLocaleString() + "万円";
}

// ─── Types ────────────────────────────────────────────────────────────────

interface BaseForm {
  currentAnnual: string;
  targetAnnual: string;
  age: string;
}

interface TransferForm {
  expectedAnnual: string;
  isForeign: boolean;
}

interface RaiseForm {
  raiseRate: string;
}

interface SideForm {
  monthlyIncome: string;
}

interface SkillForm {
  skillName: string;
  cost: string;
  expectedIncrease: string;
}

interface StrategyResult {
  key: string;
  label: string;
  yearsToReach: number | null;
  summary: string;
}

interface CalcResult {
  transfer: {
    annual: number;
    takeHome: number;
  } | null;
  raise: {
    years: number;
  } | null;
  side: {
    annualNet: number;
  } | null;
  skill: {
    roi: number;
    paybackMonths: number;
  } | null;
  ranking: StrategyResult[];
}

// ─── Toggle Switch component ───────────────────────────────────────────────

function ToggleSwitch({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-kon focus:ring-offset-2 ${
        checked ? "bg-kon" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function SalaryIncreaseSimulatorPage() {
  const [base, setBase] = useState<BaseForm>({ currentAnnual: "", targetAnnual: "", age: "" });
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [toggles, setToggles] = useState({ transfer: false, raise: false, side: false, skill: false });
  const [transfer, setTransfer] = useState<TransferForm>({ expectedAnnual: "", isForeign: false });
  const [raise, setRaise] = useState<RaiseForm>({ raiseRate: "3" });
  const [side, setSide] = useState<SideForm>({ monthlyIncome: "" });
  const [skill, setSkill] = useState<SkillForm>({ skillName: "", cost: "", expectedIncrease: "" });

  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  function handleToggle(key: keyof typeof toggles) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    setResult(null);
    setError("");
  }

  function handleCalculate() {
    const current = parseFloat(base.currentAnnual);
    const target = parseFloat(base.targetAnnual);
    const age = parseInt(base.age);

    if (!base.currentAnnual || current <= 0 || current > 10000) {
      setError("現在の年収を正しく入力してください（万円）");
    setMascotState("error");
      return;
    }
    if (!base.targetAnnual || target <= 0 || target > 10000) {
      setError("目標年収を正しく入力してください（万円）");
    setMascotState("error");
      return;
    }
    if (target <= current) {
      setError("目標年収は現在の年収より高く設定してください");
    setMascotState("error");
      return;
    }
    if (!base.age || isNaN(age) || age < 18 || age > 65) {
      setError("現在の年齢を18〜65歳の範囲で入力してください");
    setMascotState("error");
      return;
    }
    if (!toggles.transfer && !toggles.raise && !toggles.side && !toggles.skill) {
      setError("少なくとも1つの戦略を有効にしてください");
    setMascotState("error");
      return;
    }

    const currentYen = current * 10000;
    const targetYen = target * 10000;

    // Transfer
    let transferResult: CalcResult["transfer"] = null;
    if (toggles.transfer) {
      const exp = parseFloat(transfer.expectedAnnual);
      if (!transfer.expectedAnnual || exp <= 0) {
        setError("転職後の想定年収を入力してください");
    setMascotState("error");
        return;
      }
      const annualYen = exp * 10000;
      transferResult = { annual: annualYen, takeHome: calcTakeHome(annualYen) };
    }

    // Raise
    let raiseResult: CalcResult["raise"] = null;
    if (toggles.raise) {
      const rate = parseFloat(raise.raiseRate);
      if (isNaN(rate) || rate <= 0 || rate > 30) {
        setError("昇給率を0〜30%の範囲で入力してください");
    setMascotState("error");
        return;
      }
      raiseResult = { years: yearsToGoal(currentYen, targetYen, rate) };
    }

    // Side
    let sideResult: CalcResult["side"] = null;
    if (toggles.side) {
      const mo = parseFloat(side.monthlyIncome);
      if (!side.monthlyIncome || mo <= 0) {
        setError("副業月収を入力してください");
    setMascotState("error");
        return;
      }
      sideResult = { annualNet: sideIncomeNetAnnual(mo * 10000) };
    }

    // Skill
    let skillResult: CalcResult["skill"] = null;
    if (toggles.skill) {
      const cost = parseFloat(skill.cost);
      const inc = parseFloat(skill.expectedIncrease);
      if (!skill.cost || cost < 0) {
        setError("取得費用を入力してください");
    setMascotState("error");
        return;
      }
      if (!skill.expectedIncrease || inc <= 0) {
        setError("期待年収増加額を入力してください");
    setMascotState("error");
        return;
      }
      skillResult = {
        roi: calcROI(inc * 10000, cost * 10000) ,
        paybackMonths: calcPaybackMonths(cost * 10000, inc * 10000),
      };
    }

    // Build ranking
    const strategies: StrategyResult[] = [];

    if (transferResult) {
      const gap = targetYen - transferResult.annual;
      const yearsToReach = transferResult.annual >= targetYen ? 0 : null;
      strategies.push({
        key: "transfer",
        label: "転職（" + (transfer.isForeign ? "外資系" : "一般") + "）",
        yearsToReach,
        summary:
          yearsToReach === 0
            ? `転職で目標年収を即達成（${fmtMan(transferResult.annual)}）`
            : `転職後年収${fmtMan(transferResult.annual)}（目標まであと${fmtMan(gap)}）`,
      });
    }

    if (raiseResult) {
      strategies.push({
        key: "raise",
        label: "昇給",
        yearsToReach: raiseResult.years,
        summary: `${raise.raiseRate}%昇給で目標まで${raiseResult.years}年`,
      });
    }

    if (sideResult) {
      // Estimate years to close gap with side income
      const gap = targetYen - currentYen;
      const yearsToReach = gap > 0 ? Math.ceil(gap / sideResult.annualNet) : 0;
      strategies.push({
        key: "side",
        label: "副業",
        yearsToReach,
        summary: `副業で年間${fmtMan(sideResult.annualNet)}の収入増（税引後概算）`,
      });
    }

    if (skillResult) {
      const paybackYears = skillResult.paybackMonths / 12;
      strategies.push({
        key: "skill",
        label: `スキルアップ（${skill.skillName || "資格"}）`,
        yearsToReach: Math.ceil(paybackYears),
        summary: `ROI ${Math.round(skillResult.roi)}%・回収${Math.floor(skillResult.paybackMonths / 12)}年${skillResult.paybackMonths % 12}ヶ月`,
      });
    }

    // Sort: null (can't reach alone) last, then by years ascending
    const ranked = [...strategies].sort((a, b) => {
      if (a.yearsToReach === null && b.yearsToReach === null) return 0;
      if (a.yearsToReach === null) return 1;
      if (b.yearsToReach === null) return -1;
      return a.yearsToReach - b.yearsToReach;
    });

    setResult({
      transfer: transferResult,
      raise: raiseResult,
      side: sideResult,
      skill: skillResult,
      ranking: ranked,
    });
    setMascotState("success");
    setError("");
  }

  function handleReset() {
    setBase({ currentAnnual: "", targetAnnual: "", age: "" });
    setToggles({ transfer: false, raise: false, side: false, skill: false });
    setTransfer({ expectedAnnual: "", isForeign: false });
    setRaise({ raiseRate: "3" });
    setSide({ monthlyIncome: "" });
    setSkill({ skillName: "", cost: "", expectedIncrease: "" });
    setResult(null);
    setError("");
  }

  const rankEmoji = ["🥇", "🥈", "🥉", "🏅"];
  const allOn = toggles.transfer && toggles.raise && toggles.side && toggles.skill;


  const faqItems = [
    { question: "年収を100万円上げるのに何年かかりますか？", answer: "昇給のみでは一般的に5〜10年かかりますが、転職を活用すれば1〜3年で達成できる場合があります。転職による年収アップの平均は初回で約10〜20%とされています。本ツールで具体的なシナリオを計算してみてください。" },
    { question: "スキルアップ投資のROIはどう計算しますか？", answer: "スキルアップ投資のROIは「(年収アップ額 × 年数 - 投資額) ÷ 投資額 × 100%」で計算できます。例えば50万円の資格取得費用で年収が20万円上がった場合、5年で投資回収（ROI 100%）できます。" },
    { question: "副業と本業の年収アップ、どちらが効率的ですか？", answer: "短期的には副業が効率的ですが、副業収入は雑所得として高率課税されるため実質手取りは低くなります。長期的には本業の昇給・転職による年収アップのほうが社会保険・退職金・将来の年金受給額にも好影響を与えます。" },
    { question: "年収600万円を目指すために最も効果的な方法は？", answer: "日本の中央値年収（約450万円）から600万円を目指す場合、転職が最も効果的なケースが多いです。業界・職種によって年収レンジが大きく異なるため、まず市場相場を確認し、需要の高いスキルを身につけながら転職を検討することをお勧めします。" },
    { question: "昇給交渉のタイミングはいつが最適ですか？", answer: "成果が出た直後、評価サイクルの前（多くは9〜10月または3〜4月）、転職オファーを持っているときが交渉しやすいタイミングです。市場価値データを示した根拠ある交渉が成功率を高めます。" }
  ];
  const useCases = [
    { icon: "🎯", persona: "年収アップを目指す会社員", title: "転職・昇給・副業どれが最も効果的?", benefit: "戦略ごとの達成年数とROIを比較" },
    { icon: "📚", persona: "資格・スキルアップ投資を検討中", title: "勉強や資格取得が割に合うか知りたい", benefit: "投資額と年収アップの回収期間を自動計算" },
    { icon: "🚀", persona: "30代・年収500万円の壁を超えたい", title: "600万円達成の現実的なシナリオを知りたい", benefit: "年齢別・職種別の達成パスをシミュレーション" }
  ];
  return (
    <>
      <IntroSection title="年収アップシミュレーター" paragraphs={["転職・昇給・副業・スキルアップの組み合わせで年収600万円・800万円達成まで何年かかるか試算します。", "各戦略のROI（投資回収率）と損益分岐点を可視化。スキルアップへの投資が何年後に回収できるかも計算できます。", "登録不要・完全無料。年収目標への最短ルートを数字で確認したい方に最適です。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">年収アップシミュレーター</h1>
          <p className="text-gray-600 text-sm">
            転職・昇給・副業・スキルアップの4戦略を組み合わせて、目標年収への最短ルートを計算します。
          </p>
        </div>

        {/* ── Base Inputs ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
          <h2 className="text-base font-semibold text-gray-800 mb-4">基本情報</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                現在の年収 <span className="text-danger">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={100}
                  max={10000}
                  value={base.currentAnnual}
                  onChange={(e) => { setBase((p) => ({ ...p, currentAnnual: e.target.value })); setResult(null); setError(""); }}
                  placeholder="例: 400"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent"
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目標年収 <span className="text-danger">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={100}
                  max={10000}
                  value={base.targetAnnual}
                  onChange={(e) => { setBase((p) => ({ ...p, targetAnnual: e.target.value })); setResult(null); setError(""); }}
                  placeholder="例: 600"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent"
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                現在の年齢 <span className="text-danger">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={18}
                  max={65}
                  value={base.age}
                  onChange={(e) => { setBase((p) => ({ ...p, age: e.target.value })); setResult(null); setError(""); }}
                  placeholder="例: 30"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent"
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">歳</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Strategy Toggles ── */}
        <div className="space-y-3 mb-5">

          {/* Toggle 1: 転職 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer"
              onClick={() => handleToggle("transfer")}
            >
              <div>
                <span className="text-base font-semibold text-gray-800">戦略①　転職（外資系）</span>
                <p className="text-xs text-gray-500 mt-0.5">転職後の年収と手取りを試算</p>
              </div>
              <ToggleSwitch checked={toggles.transfer} onChange={() => handleToggle("transfer")} id="toggle-transfer" />
            </div>
            {toggles.transfer && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    転職後の想定年収 <span className="text-danger">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={100}
                      max={10000}
                      value={transfer.expectedAnnual}
                      onChange={(e) => { setTransfer((p) => ({ ...p, expectedAnnual: e.target.value })); setResult(null); }}
                      placeholder="例: 550"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transfer.isForeign}
                    onChange={(e) => setTransfer((p) => ({ ...p, isForeign: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-kon focus:ring-kon"
                  />
                  <span className="text-sm text-gray-700">外資系への転職（高年収帯・インセンティブ含む）</span>
                </label>
              </div>
            )}
          </div>

          {/* Toggle 2: 昇給 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer"
              onClick={() => handleToggle("raise")}
            >
              <div>
                <span className="text-base font-semibold text-gray-800">戦略②　昇給</span>
                <p className="text-xs text-gray-500 mt-0.5">毎年の昇給で目標年収に到達する年数を計算</p>
              </div>
              <ToggleSwitch checked={toggles.raise} onChange={() => handleToggle("raise")} id="toggle-raise" />
            </div>
            {toggles.raise && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">年間昇給率</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0.1}
                    max={30}
                    step={0.1}
                    value={raise.raiseRate}
                    onChange={(e) => { setRaise({ raiseRate: e.target.value }); setResult(null); }}
                    className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                  />
                  <span className="text-sm text-gray-500">%　（日本平均：2〜3%）</span>
                </div>
              </div>
            )}
          </div>

          {/* Toggle 3: 副業 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer"
              onClick={() => handleToggle("side")}
            >
              <div>
                <span className="text-base font-semibold text-gray-800">戦略③　副業</span>
                <p className="text-xs text-gray-500 mt-0.5">副業収入の年間手取り増加額を試算</p>
              </div>
              <ToggleSwitch checked={toggles.side} onChange={() => handleToggle("side")} id="toggle-side" />
            </div>
            {toggles.side && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  副業月収 <span className="text-danger">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={side.monthlyIncome}
                    onChange={(e) => { setSide({ monthlyIncome: e.target.value }); setResult(null); }}
                    placeholder="例: 10"
                    className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                  />
                  <span className="text-sm text-gray-500">万円 / 月</span>
                </div>
              </div>
            )}
          </div>

          {/* Toggle 4: スキルアップ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer"
              onClick={() => handleToggle("skill")}
            >
              <div>
                <span className="text-base font-semibold text-gray-800">戦略④　スキルアップ</span>
                <p className="text-xs text-gray-500 mt-0.5">資格取得のROIと回収期間を計算</p>
              </div>
              <ToggleSwitch checked={toggles.skill} onChange={() => handleToggle("skill")} id="toggle-skill" />
            </div>
            {toggles.skill && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">資格・スキル名</label>
                  <input
                    type="text"
                    value={skill.skillName}
                    onChange={(e) => { setSkill((p) => ({ ...p, skillName: e.target.value })); setResult(null); }}
                    placeholder="例: AWS認定"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      取得費用 <span className="text-danger">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={1000}
                        value={skill.cost}
                        onChange={(e) => { setSkill((p) => ({ ...p, cost: e.target.value })); setResult(null); }}
                        placeholder="例: 20"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                      />
                      <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      期待年収増加額 <span className="text-danger">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        value={skill.expectedIncrease}
                        onChange={(e) => { setSkill((p) => ({ ...p, expectedIncrease: e.target.value })); setResult(null); }}
                        placeholder="例: 100"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                      />
                      <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 text-danger text-sm bg-gray-50 rounded-lg px-4 py-3">{error}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleReset}
            className="py-3 px-6 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            リセット
          </button>
          <button
            onClick={handleCalculate}
            className="flex-1 py-3 rounded-lg bg-kon text-white text-sm font-semibold hover:bg-ai transition-colors shadow-sm"
          >
            計算する
          </button>
        </div>

        {/* ── Results ── */}
        {result && (
          <div className="space-y-4 mb-10">

            {/* Transfer result */}
            {result.transfer && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-50 text-kon text-xs flex items-center justify-center font-bold">①</span>
                  転職{transfer.isForeign ? "（外資系）" : ""}の試算結果
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-kon font-medium mb-1">転職後の年収</p>
                    <p className="text-2xl font-bold text-kon">{fmtMan(result.transfer.annual)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">推定手取り（年間）</p>
                    <p className="text-2xl font-bold text-gray-800">{fmtMan(result.transfer.takeHome)}</p>
                  </div>
                </div>
                {result.transfer.annual >= parseFloat(base.targetAnnual) * 10000 ? (
                  <p className="mt-3 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 font-medium">
                    ✓ 転職だけで目標年収を達成できます
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                    目標年収まであと {fmtMan(parseFloat(base.targetAnnual) * 10000 - result.transfer.annual)} 不足
                  </p>
                )}
              </div>
            )}

            {/* Raise result */}
            {result.raise && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-50 text-kon text-xs flex items-center justify-center font-bold">②</span>
                  昇給の試算結果
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-kon mb-1">
                    {raise.raiseRate}%昇給を続けると、目標{base.targetAnnual}万円まで
                  </p>
                  <p className="text-3xl font-bold text-kon">
                    {result.raise.years}年
                    <span className="text-base font-normal ml-1">かかります</span>
                  </p>
                  <p className="text-xs text-kon mt-1">
                    （{base.currentAnnual}万円 → {base.targetAnnual}万円、年率{raise.raiseRate}%で複利計算）
                  </p>
                </div>
              </div>
            )}

            {/* Side income result */}
            {result.side && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-50 text-kon text-xs flex items-center justify-center font-bold">③</span>
                  副業の試算結果
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">年間副業収入（税前）</p>
                    <p className="text-2xl font-bold text-gray-800">{fmtMan(parseFloat(side.monthlyIncome) * 10000 * 12)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-kon font-medium mb-1">年間手取り増加額（概算）</p>
                    <p className="text-2xl font-bold text-kon">{fmtMan(result.side.annualNet)}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-400">※ 副業収入に対し20%課税を想定した概算値です</p>
              </div>
            )}

            {/* Skill result */}
            {result.skill && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-50 text-kon text-xs flex items-center justify-center font-bold">④</span>
                  スキルアップ{skill.skillName ? `（${skill.skillName}）` : ""}の試算結果
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-kon font-medium mb-1">投資対効果（ROI）</p>
                    <p className="text-2xl font-bold text-kon">{Math.round(result.skill.roi)}%</p>
                    {result.skill.roi > 300 && (
                      <span className="inline-block mt-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold">高ROI</span>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">回収期間</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {Math.floor(result.skill.paybackMonths / 12)}年{result.skill.paybackMonths % 12}ヶ月
                    </p>
                    {result.skill.paybackMonths < 12 && (
                      <span className="inline-block mt-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold">1年以内に回収</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500">
                  取得費用 {skill.cost}万円 ÷ 年収増加 {skill.expectedIncrease}万円 で回収期間を計算
                </div>
              </div>
            )}

            {/* 最短達成ルートカード — shown when all 4 are ON */}
            {allOn && result.ranking.length === 4 && (
              <div className="rounded-xl overflow-hidden shadow-md"
                style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #0ea5e9 100%)" }}>
                <div className="px-5 py-4">
                  <h3 className="text-white font-bold text-lg mb-1">
                    目標{base.targetAnnual}万円 最短達成ルート
                  </h3>
                  <p className="text-gin text-xs mb-4">4戦略を速度順にランキング</p>
                  <div className="space-y-2">
                    {result.ranking.map((s, i) => (
                      <div key={s.key} className="flex items-center gap-3 bg-white/15 rounded-lg px-4 py-3">
                        <span className="text-xl shrink-0">{rankEmoji[i]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{s.label}</p>
                          <p className="text-gin text-xs">{s.summary}</p>
                        </div>
                        {s.yearsToReach !== null && (
                          <div className="shrink-0 text-right">
                            <p className="text-white font-bold text-base leading-none">{s.yearsToReach}年</p>
                            <p className="text-gin text-xs">で達成</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Combination advice */}
                  <div className="mt-4 bg-white/20 rounded-lg px-4 py-3">
                    <p className="text-white text-sm font-medium">
                      💡 おすすめの組み合わせ
                    </p>
                    {(() => {
                      const fastest = result.ranking[0];
                      const second = result.ranking[1];
                      const minYears = fastest.yearsToReach ?? 99;
                      return (
                        <p className="text-gin text-xs mt-1">
                          {fastest.label}＋{second.label}の組み合わせで最短
                          <span className="text-white font-bold mx-1">{minYears === 0 ? "即" : `${minYears}年`}</span>
                          で目標達成が見込めます。
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* If not all 4 ON but result exists — smaller hint */}
            {!allOn && result.ranking.length > 0 && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 px-5 py-4">
                <p className="text-kon text-sm font-semibold mb-2">戦略ランキング</p>
                <div className="space-y-1.5">
                  {result.ranking.map((s, i) => (
                    <div key={s.key} className="flex items-center gap-2 text-sm text-gray-700">
                      <span>{rankEmoji[i]}</span>
                      <span className="font-medium">{s.label}</span>
                      <span className="text-gray-500 text-xs">{s.summary}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-kon">
                  ✦ 4つの戦略をすべてONにすると「最短達成ルート」アドバイスが表示されます
                </p>
              </div>
            )}
          </div>
        )}

        {/* GEO: 昇給シミュレーション早見表 */}
        <section className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">昇給シミュレーション早見表</h2>
          <p className="text-sm text-gray-600 mb-4">
            よくある年収アップのパターンと手取りの変化を事前計算した早見表です。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-3 py-2 text-left">現在の年収</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">目標年収</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">現在の手取り</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">目標手取り</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">手取り増加額</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">月換算</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cur: "300万円", tgt: "400万円", curTH: "約245万円", tgtTH: "約295万円", diff: "+50万円", monthly: "+4.2万円/月" },
                  { cur: "400万円", tgt: "500万円", curTH: "約295万円", tgtTH: "約363万円", diff: "+68万円", monthly: "+5.7万円/月" },
                  { cur: "500万円", tgt: "600万円", curTH: "約363万円", tgtTH: "約418万円", diff: "+55万円", monthly: "+4.6万円/月" },
                  { cur: "500万円", tgt: "700万円", curTH: "約363万円", tgtTH: "約479万円", diff: "+116万円", monthly: "+9.7万円/月" },
                  { cur: "600万円", tgt: "800万円", curTH: "約418万円", tgtTH: "約539万円", diff: "+121万円", monthly: "+10.1万円/月" },
                  { cur: "700万円", tgt: "1,000万円", curTH: "約479万円", tgtTH: "約656万円", diff: "+177万円", monthly: "+14.8万円/月" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-200 px-3 py-2">{row.cur}</td>
                    <td className="border border-gray-200 px-3 py-2 font-medium text-kon">{row.tgt}</td>
                    <td className="border border-gray-200 px-3 py-2">{row.curTH}</td>
                    <td className="border border-gray-200 px-3 py-2">{row.tgtTH}</td>
                    <td className="border border-gray-200 px-3 py-2 font-medium text-green-600">{row.diff}</td>
                    <td className="border border-gray-200 px-3 py-2 text-green-600">{row.monthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ※ 独身・社会保険料14%・基礎控除48万円として概算。実際の金額は個人の状況により異なります。
          </p>
        </section>

        {/* ── Related Tools ── */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/career/job-change-simulator", label: "転職年収シミュレーター", desc: "転職前後の手取り・税金を比較計算" },
              { href: "/career/salary-negotiation", label: "昇給交渉シミュレーター", desc: "昇給交渉の効果と市場相場を試算" },
              { href: "/career/side-income-tax-calculator", label: "副業税金計算機", desc: "副業収入に対する税金を計算" },
              { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "年収から税負担をシミュレーション" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 hover:border-ai hover:shadow-md transition-all p-4 group"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-50 group-hover:bg-ai flex items-center justify-center shrink-0 transition-colors">
                  <svg className="w-5 h-5 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-kon group-hover:text-ai">{tool.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    <UseCasesSection cases={useCases} />
    <FAQSection faq={faqItems} />
      {/* 広告 */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <AdUnit slot="5612038947" format="horizontal" />
      </div>

  </>
  );
}
