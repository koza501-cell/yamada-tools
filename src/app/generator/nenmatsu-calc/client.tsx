"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Mascot, { type MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from "@/components/common/PricingTriggerProvider";
import FinancialDisclaimer from "@/components/common/FinancialDisclaimer";
import RelatedTools, { relatedToolSets } from "@/components/common/RelatedTools";
import { Field } from "@/components/forms/Field";
import { CurrencyInput } from "@/components/forms/CurrencyInput";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FAQ { question: string; answer: string; }
interface SeoContent { intro: string; useCases?: { title: string; desc: string }[]; tips?: string; }
interface NenmatsuClientProps { faq?: FAQ[]; seoContent?: SeoContent; }

interface CalcResult {
  grossIncome:    number;
  incomeDeduction: number;
  taxableIncome:  number;
  calculatedTax:  number;
  withheldTax:    number;
  difference:     number;
  isRefund:       boolean;
}

// ── Zod schema ────────────────────────────────────────────────────────────────

const nenmatsuSchema = z.object({
  annualIncome:        z.number().min(1, "年収を入力してください"),
  withheldTax:         z.number().min(0),
  socialInsurance:     z.number().min(0),
  lifeInsurance:       z.number().min(0),
  earthquakeInsurance: z.number().min(0),
  hasSpouse:           z.boolean(),
  spouseIncome:        z.number().min(0),
  dependents:          z.number().min(0),
  housingLoan:         z.number().min(0),
});

type NenmatsuForm = z.infer<typeof nenmatsuSchema>;

// ── Tax calculation helpers (unchanged from original) ─────────────────────────

const calcIncomeDeduction = (income: number): number => {
  if (income <= 1625000) return 550000;
  if (income <= 1800000) return income * 0.4 - 100000;
  if (income <= 3600000) return income * 0.3 + 80000;
  if (income <= 6600000) return income * 0.2 + 440000;
  if (income <= 8500000) return income * 0.1 + 1100000;
  return 1950000;
};

const calcLifeInsuranceDeduction = (premium: number): number => {
  if (premium <= 20000)  return premium;
  if (premium <= 40000)  return premium * 0.5 + 10000;
  if (premium <= 80000)  return premium * 0.25 + 20000;
  return 40000;
};

const calcSpouseDeduction = (taxpayerIncome: number, spouseIncome: number): number => {
  if (taxpayerIncome > 10000000) return 0;
  const spouseEarnedIncome = spouseIncome - Math.min(spouseIncome * 0.3 + 80000, 550000);
  if (spouseEarnedIncome <= 480000) {
    if (taxpayerIncome <= 9000000) return 380000;
    if (taxpayerIncome <= 9500000) return 260000;
    return 130000;
  } else if (spouseEarnedIncome <= 1330000) {
    return Math.max(0, 380000 - Math.floor((spouseEarnedIncome - 480000) / 50000) * 30000);
  }
  return 0;
};

const calcIncomeTax = (taxableIncome: number): number => {
  if (taxableIncome <= 1950000)  return taxableIncome * 0.05;
  if (taxableIncome <= 3300000)  return taxableIncome * 0.1  - 97500;
  if (taxableIncome <= 6950000)  return taxableIncome * 0.2  - 427500;
  if (taxableIncome <= 9000000)  return taxableIncome * 0.23 - 636000;
  if (taxableIncome <= 18000000) return taxableIncome * 0.33 - 1536000;
  if (taxableIncome <= 40000000) return taxableIncome * 0.4  - 2796000;
  return taxableIncome * 0.45 - 4796000;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function NenmatsuCalcClient({ faq, seoContent }: NenmatsuClientProps) {
  const { triggerSuccess } = usePricingContext();

  const [mascotState, setMascotState]   = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("年末調整を計算するよ！");
  const [result, setResult]             = useState<CalcResult | null>(null);

  const methods = useForm<NenmatsuForm>({
    resolver: zodResolver(nenmatsuSchema),
    defaultValues: {
      annualIncome:        0,
      withheldTax:         0,
      socialInsurance:     0,
      lifeInsurance:       0,
      earthquakeInsurance: 0,
      hasSpouse:           false,
      spouseIncome:        0,
      dependents:          0,
      housingLoan:         0,
    },
  });

  const { handleSubmit, watch, setValue, register, formState: { errors } } = methods;

  const watchedHasSpouse = watch("hasSpouse");

  const onSubmit = (data: NenmatsuForm) => {
    const income     = data.annualIncome;
    const withheld   = data.withheldTax;
    const social     = data.socialInsurance;
    const life       = data.lifeInsurance;
    const earthquake = data.earthquakeInsurance;
    const spouseInc  = data.spouseIncome;
    const numDeps    = data.dependents;
    const housing    = data.housingLoan;

    const incomeDeduction  = calcIncomeDeduction(income);
    const earnedIncome     = income - incomeDeduction;
    const basicDeduction   = earnedIncome <= 24000000 ? 480000 : 0;
    const lifeDeduction    = calcLifeInsuranceDeduction(life);
    const earthquakeDed    = Math.min(earthquake, 50000);
    const spouseDeduction  = data.hasSpouse ? calcSpouseDeduction(earnedIncome, spouseInc) : 0;
    const dependentDed     = numDeps * 380000;
    const totalDeductions  = basicDeduction + social + lifeDeduction + earthquakeDed + spouseDeduction + dependentDed;
    const taxableIncome    = Math.max(0, earnedIncome - totalDeductions);

    let calculatedTax = calcIncomeTax(taxableIncome);
    const housingDed  = Math.min(housing * 0.007, 210000);
    calculatedTax = Math.max(0, calculatedTax - housingDed);
    calculatedTax = Math.floor(calculatedTax * 1.021);

    const difference = withheld - calculatedTax;

    setResult({
      grossIncome:    income,
      incomeDeduction,
      taxableIncome,
      calculatedTax,
      withheldTax:    withheld,
      difference:     Math.abs(difference),
      isRefund:       difference > 0,
    });

    if (difference > 0) {
      setMascotState("success");
      triggerSuccess("nenmatsu-calc");
      setMascotMessage(`${Math.abs(difference).toLocaleString()}円還付だね！`);
    } else if (difference < 0) {
      setMascotState("error");
      setMascotMessage(`${Math.abs(difference).toLocaleString()}円追加徴収...`);
    } else {
      setMascotState("success");
      triggerSuccess("nenmatsu-calc");
      setMascotMessage("ぴったりだね！");
    }
  };

  const onError = () => {
    setMascotState("error");
    setMascotMessage("年収を入力してね！");
  };

  const loadSample = () => {
    setValue("annualIncome",    5000000);
    setValue("withheldTax",     150000);
    setValue("socialInsurance", 750000);
    setValue("lifeInsurance",   120000);
    setValue("earthquakeInsurance", 30000);
    setValue("hasSpouse",       false);
    setValue("dependents",      0);
    setValue("housingLoan",     0);
    setMascotState("success");
    triggerSuccess("nenmatsu-calc");
    setMascotMessage("サンプルデータを入力したよ！計算ボタンを押してね");
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4">

          <header className="text-center mb-8">
            <div className="text-5xl mb-4">💴</div>
            <h1 className="text-3xl font-bold text-kon mb-2">年末調整計算</h1>
            <p className="text-gray-600 text-lg">還付金シミュレーター</p>
          </header>

          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Quick Demo Button */}
          <div className="mb-4 text-center">
            <button
              type="button"
              onClick={loadSample}
              className="px-6 py-2 bg-sakura/20 text-kon rounded-full text-sm font-medium hover:bg-sakura/30 transition-colors"
            >
              📝 サンプルデータで試す
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="font-bold text-kon mb-4">基本情報</h3>

              <div className="grid gap-4 mb-6">
                <Field
                  id="annualIncome"
                  label="年収（税込）"
                  required
                  helper="例：5,000,000"
                  error={errors.annualIncome?.message}
                >
                  <div className="relative">
                    <CurrencyInput
                      value={watch("annualIncome") || ""}
                      onChange={(v) => setValue("annualIncome", v === "" ? 0 : v, { shouldValidate: true })}
                      className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">円</span>
                  </div>
                </Field>

                <Field id="withheldTax" label="源泉徴収税額（1年間合計）" optional>
                  <div className="relative">
                    <CurrencyInput
                      value={watch("withheldTax") || ""}
                      onChange={(v) => setValue("withheldTax", v === "" ? 0 : v)}
                      className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">円</span>
                  </div>
                </Field>

                <Field id="socialInsurance" label="社会保険料（1年間合計）" optional>
                  <div className="relative">
                    <CurrencyInput
                      value={watch("socialInsurance") || ""}
                      onChange={(v) => setValue("socialInsurance", v === "" ? 0 : v)}
                      className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">円</span>
                  </div>
                </Field>
              </div>

              <h3 className="font-bold text-kon mb-4">保険料控除</h3>

              <div className="grid gap-4 mb-6">
                <Field id="lifeInsurance" label="生命保険料（年間支払額）" optional>
                  <div className="relative">
                    <CurrencyInput
                      value={watch("lifeInsurance") || ""}
                      onChange={(v) => setValue("lifeInsurance", v === "" ? 0 : v)}
                      className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">円</span>
                  </div>
                </Field>

                <Field id="earthquakeInsurance" label="地震保険料（年間支払額）" optional>
                  <div className="relative">
                    <CurrencyInput
                      value={watch("earthquakeInsurance") || ""}
                      onChange={(v) => setValue("earthquakeInsurance", v === "" ? 0 : v)}
                      className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">円</span>
                  </div>
                </Field>
              </div>

              <h3 className="font-bold text-kon mb-4">扶養控除</h3>

              <div className="grid gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <input
                    {...register("hasSpouse")}
                    type="checkbox"
                    id="hasSpouse"
                    className="w-5 h-5 rounded border-gray-300 text-kon focus:ring-kon"
                  />
                  <label htmlFor="hasSpouse" className="text-sm font-medium text-gray-700">
                    配偶者あり
                  </label>
                </div>

                {watchedHasSpouse && (
                  <Field id="spouseIncome" label="配偶者の年収" optional>
                    <div className="relative">
                      <CurrencyInput
                        value={watch("spouseIncome") || ""}
                        onChange={(v) => setValue("spouseIncome", v === "" ? 0 : v)}
                        className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">円</span>
                    </div>
                  </Field>
                )}

                <Field id="dependents" label="扶養親族の人数（16歳以上）" optional>
                  <select
                    {...register("dependents", { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                  >
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}人</option>
                    ))}
                  </select>
                </Field>
              </div>

              <h3 className="font-bold text-kon mb-4">住宅ローン控除</h3>

              <div className="mb-6">
                <Field
                  id="housingLoan"
                  label="住宅ローン年末残高"
                  optional
                  helper="※ 2022年以降入居の場合（控除率0.7%）"
                >
                  <div className="relative">
                    <CurrencyInput
                      value={watch("housingLoan") || ""}
                      onChange={(v) => setValue("housingLoan", v === "" ? 0 : v)}
                      className="w-full px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">円</span>
                  </div>
                </Field>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
              >
                計算する
              </button>
            </section>
          </form>

          {/* Result section ── identical to original ─────────────────────────── */}
          {result && (
            <section
              className={`rounded-2xl p-6 mb-6 ${
                result.isRefund
                  ? "bg-green-50 border-2 border-green-200"
                  : "bg-red-50 border-2 border-red-200"
              }`}
            >
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-1">
                  {result.isRefund ? "還付金額" : "追加徴収額"}
                </p>
                <p className={`text-4xl font-bold ${result.isRefund ? "text-green-600" : "text-red-600"}`}>
                  {result.isRefund ? "+" : "-"}{result.difference.toLocaleString()}円
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">年収</span>
                  <span>{result.grossIncome.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">給与所得控除</span>
                  <span>-{result.incomeDeduction.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">課税所得</span>
                  <span>{result.taxableIncome.toLocaleString()}円</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <span className="text-gray-600">計算上の所得税</span>
                  <span>{result.calculatedTax.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">源泉徴収済み</span>
                  <span>{result.withheldTax.toLocaleString()}円</span>
                </div>
              </div>
            </section>
          )}

          <section className="bg-yellow-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800">
              ⚠️ この計算結果は概算です。実際の年末調整は会社の計算が正式となります。
            </p>
          </section>

          <RelatedTools tools={relatedToolSets.nenmatsuCalc} title="あわせて使えるツール" />

          <div className="mt-8 text-center">
            <Link href="/generator" className="text-kon hover:text-ai">
              ← 計算・生成ツール一覧に戻る
            </Link>
          </div>

          {seoContent && (
            <section className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="font-bold text-kon mb-4 text-lg">年末調整計算について</h2>
              <p className="text-gray-600 mb-4">{seoContent.intro}</p>
              {seoContent.useCases && (
                <div className="grid sm:grid-cols-2 gap-3 my-4">
                  {seoContent.useCases.map((uc, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium text-gray-800">{uc.title}</p>
                      <p className="text-sm text-gray-600">{uc.desc}</p>
                    </div>
                  ))}
                </div>
              )}
              {seoContent.tips && (
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">💡 <strong>ヒント:</strong> {seoContent.tips}</p>
                </div>
              )}
            </section>
          )}

          {faq && faq.length > 0 && (
            <section className="mt-8">
              <h2 className="font-bold text-kon mb-4 text-lg">よくある質問</h2>
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <details key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
                    <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-kon">Q.</span>{item.question}
                      </span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">
                      <span className="text-kon font-medium">A.</span> {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section className="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-bold text-kon mb-4 text-lg">📊 年末調整の計算例</h2>
            <p className="text-gray-600 mb-4 text-sm">年収別の年末調整シミュレーション結果です（独身・扶養なしの場合）。</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">年収</th>
                    <th className="px-3 py-2 text-left">所得税</th>
                    <th className="px-3 py-2 text-left">還付/追徴</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr><td className="px-3 py-2">300万円</td><td className="px-3 py-2">約5.6万円</td><td className="px-3 py-2 text-green-600">還付 0〜2万円</td></tr>
                  <tr><td className="px-3 py-2">400万円</td><td className="px-3 py-2">約8.6万円</td><td className="px-3 py-2 text-green-600">還付 0〜3万円</td></tr>
                  <tr><td className="px-3 py-2">500万円</td><td className="px-3 py-2">約14万円</td><td className="px-3 py-2 text-green-600">還付 0〜5万円</td></tr>
                  <tr><td className="px-3 py-2">600万円</td><td className="px-3 py-2">約20万円</td><td className="px-3 py-2 text-green-600">還付 0〜8万円</td></tr>
                  <tr><td className="px-3 py-2">800万円</td><td className="px-3 py-2">約46万円</td><td className="px-3 py-2 text-green-600">還付 0〜15万円</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-4">※ 生命保険料控除・住宅ローン控除などを適用すると還付額が増えます。上記は概算値です。</p>
          </section>

          <AdUnit slot="5612038947" format="horizontal" />
        </div>
      </div>
    </FormProvider>
  );
}
