"use client";

import { useRef, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Mascot, { type MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from "@/components/common/PricingTriggerProvider";
import { Field } from "@/components/forms/Field";
import { CurrencyInput } from "@/components/forms/CurrencyInput";
import { JPDateInput } from "@/components/forms/JPDateInput";

// ── Stamp tax lookup ──────────────────────────────────────────────────────────

const STAMP_TAX_INFO = [
  { min: 0,        max: 50000,     label: "非課税" },
  { min: 50001,    max: 1000000,   label: "200円" },
  { min: 1000001,  max: 2000000,   label: "400円" },
  { min: 2000001,  max: 3000000,   label: "600円" },
  { min: 3000001,  max: 5000000,   label: "1,000円" },
  { min: 5000001,  max: 10000000,  label: "2,000円" },
  { min: 10000001, max: Infinity,  label: "要確認" },
];

const getStampTax = (amt: number) =>
  STAMP_TAX_INFO.find((s) => amt >= s.min && amt <= s.max) ?? STAMP_TAX_INFO[0];

// ── Zod schema ────────────────────────────────────────────────────────────────

const receiptSchema = z.object({
  receiptNumber:  z.string().min(1, "領収書番号を入力してください"),
  issueDate:      z.string().min(1, "発行日を選択してください"),
  paymentMethod:  z.string(),

  receiverName:    z.string().min(1, "発行者名を入力してください"),
  receiverAddress: z.string(),
  receiverTel:     z.string(),

  payerName: z.string().min(1, "宛名を入力してください"),

  amount:      z.number().min(1, "金額を入力してください"),
  taxIncluded: z.boolean(),
  taxRate:     z.number(),
  description: z.string(),
});

type ReceiptForm = z.infer<typeof receiptSchema>;

// ── Helper ────────────────────────────────────────────────────────────────────

const FORMAT = new Intl.NumberFormat("ja-JP");
const fmt = (n: number) => FORMAT.format(n);

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReceiptClient() {
  const { triggerSuccess } = usePricingContext();

  const [mascotState, setMascotState]       = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage]   = useState("領収書を作成しよう！");
  const [mascotDismissed, setMascotDismissed] = useState(false);
  const [showStamp, setShowStamp]           = useState(true);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const methods = useForm<ReceiptForm>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      receiptNumber:  "RCP-001",
      issueDate:      new Date().toISOString().split("T")[0],
      paymentMethod:  "現金",
      receiverName:   "",
      receiverAddress:"",
      receiverTel:    "",
      payerName:      "",
      amount:         0,
      taxIncluded:    true,
      taxRate:        10,
      description:    "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = methods;

  const watchedIssueDate  = watch("issueDate");
  const watchedAmount     = useWatch({ control, name: "amount" });
  const watchedTaxRate    = watch("taxRate");
  const watchedTaxIncluded = watch("taxIncluded");
  const stampTax          = getStampTax(Number(watchedAmount) || 0);

  // ── Error banner ─────────────────────────────────────────────────────────────
  const errorFields: { id: string; label: string }[] = [];
  if (errors.receiptNumber)  errorFields.push({ id: "receiptNumber",  label: "領収書番号" });
  if (errors.issueDate)      errorFields.push({ id: "issueDate",      label: "発行日" });
  if (errors.receiverName)   errorFields.push({ id: "receiverName",   label: "発行者 会社名・氏名" });
  if (errors.payerName)      errorFields.push({ id: "payerName",      label: "宛名" });
  if (errors.amount)         errorFields.push({ id: "amount",         label: "金額" });

  const hasErrors = errorFields.length > 0;

  const onSubmit = () => {
    setMascotState("success");
    setMascotMessage("印刷画面を開くよ！");
    triggerSuccess("receipt");
    window.print();
  };

  const onError = () => {
    setMascotState("error");
    setMascotMessage("必須項目を確認してね！");
    setTimeout(() => {
      errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      const first = document.querySelector("[aria-invalid='true']") as HTMLElement | null;
      first?.focus();
    }, 50);
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 py-12 print:py-0 print:bg-white">
        <div className="max-w-4xl mx-auto px-4 print:max-w-none print:px-0">

          <header className="text-center mb-8 print:hidden">
            <div className="text-5xl mb-4">🧾</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">領収書作成</h1>
            <p className="text-gray-600">印紙税の案内付き・登録不要</p>
          </header>

          {/* Mascot */}
          {!mascotDismissed && (
            <div className="print:hidden mb-6 flex justify-center relative">
              <button
                type="button"
                aria-label="マスコットを閉じる"
                onClick={() => setMascotDismissed(true)}
                className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
              >
                ×
              </button>
              <Mascot state={mascotState} message={mascotMessage} />
            </div>
          )}

          {/* Error banner */}
          {hasErrors && (
            <div
              ref={errorBannerRef}
              role="alert"
              aria-live="assertive"
              className="print:hidden mb-4 p-4 bg-red-50 border border-red-300 rounded-lg"
            >
              <p className="font-bold text-red-700 mb-2">入力内容を確認してください</p>
              <ul className="list-disc list-inside space-y-1">
                {errorFields.map(({ id, label }) => (
                  <li key={id}>
                    <a href={`#${id}`} className="text-red-600 underline hover:text-red-800">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 print:hidden">
              <h2 className="font-bold text-gray-900 mb-4">基本情報</h2>

              {/* Header row */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Field
                  id="receiptNumber"
                  label="領収書番号"
                  required
                  error={errors.receiptNumber?.message}
                >
                  <input
                    {...register("receiptNumber")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </Field>

                <Field
                  id="issueDate"
                  label="発行日"
                  required
                  error={errors.issueDate?.message}
                >
                  <JPDateInput
                    value={watchedIssueDate}
                    onChange={(v) => setValue("issueDate", v, { shouldValidate: true })}
                  />
                </Field>

                <Field id="paymentMethod" label="支払方法" optional>
                  <select
                    {...register("paymentMethod")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="現金">現金</option>
                    <option value="銀行振込">銀行振込</option>
                    <option value="クレジットカード">クレジットカード</option>
                    <option value="小切手">小切手</option>
                    <option value="その他">その他</option>
                  </select>
                </Field>
              </div>

              {/* Issuer / Payer */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">発行者（自社）</h3>
                  <div className="space-y-3">
                    <Field
                      id="receiverName"
                      label="会社名・氏名"
                      required
                      error={errors.receiverName?.message}
                    >
                      <input
                        {...register("receiverName")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                    <Field id="receiverAddress" label="住所" optional>
                      <input
                        {...register("receiverAddress")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                    <Field id="receiverTel" label="電話番号" optional>
                      <input
                        {...register("receiverTel")}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3">宛先</h3>
                  <Field
                    id="payerName"
                    label="会社名・氏名"
                    required
                    error={errors.payerName?.message}
                  >
                    <input
                      {...register("payerName")}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </Field>
                </div>
              </div>

              {/* Amount */}
              <h3 className="font-bold text-gray-900 mb-3">金額</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <Field
                  id="amount"
                  label="金額（円）"
                  required
                  error={errors.amount?.message}
                >
                  <CurrencyInput
                    value={watchedAmount || ""}
                    onChange={(v) =>
                      setValue("amount", v === "" ? 0 : v, { shouldValidate: true })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right text-lg"
                  />
                </Field>

                <Field id="taxIncluded" label="税区分" optional>
                  <select
                    value={watchedTaxIncluded ? "included" : "excluded"}
                    onChange={(e) =>
                      setValue("taxIncluded", e.target.value === "included")
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="included">税込</option>
                    <option value="excluded">税抜</option>
                  </select>
                </Field>

                <Field id="taxRate" label="消費税率" optional>
                  <select
                    {...register("taxRate", { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value={10}>10%</option>
                    <option value={8}>8%（軽減税率）</option>
                    <option value={0}>非課税</option>
                  </select>
                </Field>
              </div>

              <div className="mb-4">
                <Field id="description" label="但し書き" optional>
                  <input
                    {...register("description")}
                    type="text"
                    placeholder="品代として"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </Field>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showStamp"
                  checked={showStamp}
                  onChange={(e) => setShowStamp(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="showStamp" className="text-sm text-gray-700">
                  印鑑欄を表示
                </label>
              </div>

              {/* Stamp tax warning */}
              {(Number(watchedAmount) || 0) > 50000 && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 font-medium">⚠️ 収入印紙が必要です</p>
                  <p className="text-amber-700 text-sm mt-1">
                    金額 {fmt(Number(watchedAmount))}円 → 印紙税:{" "}
                    <strong>{stampTax.label}</strong>
                  </p>
                  <p className="text-amber-600 text-xs mt-1">
                    ※ 電子発行の場合は印紙税不要です
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="mt-6 print:hidden">
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg"
              >
                印刷 / PDF保存
              </button>
              <p className="text-center text-sm text-gray-500 mt-2">
                ※ 印刷画面でPDFとして保存できます
              </p>
            </div>
          </form>

          {/* Print Preview ── identical to original, driven by watch() ────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-6 print:shadow-none print:border-0 print:rounded-none print:mt-0">
            <div className="border-2 border-gray-800 p-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold tracking-widest">領 収 書</h2>
              </div>

              <div className="flex justify-between mb-6">
                <div>
                  <p className="text-xl font-bold border-b-2 border-gray-800 pb-1 inline-block">
                    {watch("payerName") || "宛名"} 様
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>No. {watch("receiptNumber")}</p>
                  <p>{watchedIssueDate}</p>
                </div>
              </div>

              <div className="bg-gray-100 p-4 mb-6 text-center">
                <p className="text-sm text-gray-600 mb-1">金額</p>
                <p className="text-4xl font-bold">¥{fmt(Number(watchedAmount) || 0)}-</p>
                <p className="text-sm text-gray-600 mt-1">
                  {watchedTaxIncluded
                    ? `（税込・消費税${watchedTaxRate}%）`
                    : `（税抜・消費税${watchedTaxRate}%別途）`}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600">但し</p>
                <p className="border-b border-gray-400 py-2">
                  {watch("description") || "品代として"}
                </p>
              </div>

              <div className="mb-6 text-sm">
                <p>上記正に領収いたしました。</p>
                <p className="mt-2">支払方法: {watch("paymentMethod")}</p>
              </div>

              <div className="flex justify-between items-end">
                <div className="text-sm">
                  <p className="font-bold">{watch("receiverName") || "発行者名"}</p>
                  {watch("receiverAddress") && <p>{watch("receiverAddress")}</p>}
                  {watch("receiverTel") && <p>TEL: {watch("receiverTel")}</p>}
                </div>
                {showStamp && (
                  <div className="w-24 h-24 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-sm">
                    印
                  </div>
                )}
              </div>

              {(Number(watchedAmount) || 0) > 50000 && (
                <div className="mt-4 pt-4 border-t border-dashed text-xs text-gray-500">
                  ※ 収入印紙貼付欄（{stampTax.label}）
                </div>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-200 print:hidden">
            <h2 className="text-xl font-bold mb-4 text-gray-900">よくある質問</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-blue-600">Q: 印紙税はいつ必要？</h3>
                <p className="text-gray-600">
                  5万円以上の領収書には収入印紙が必要です。ただし、電子発行（PDF）の場合は不要です。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-blue-600">Q: クレジットカード払いの場合は？</h3>
                <p className="text-gray-600">
                  クレジットカード払いと明記すれば、印紙税は不要です。
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center print:hidden">
            <Link href="/document" className="text-blue-600 hover:text-blue-800">
              ← 書類作成一覧に戻る
            </Link>
          </div>
          <AdUnit slot="5612038947" format="horizontal" />
        </div>
      </div>
    </FormProvider>
  );
}
