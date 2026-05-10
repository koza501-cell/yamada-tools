"use client";

import { useRef, useState } from "react";
import { useForm, useFieldArray, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Mascot, { type MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { Field } from "@/components/forms/Field";
import { FormLabel } from "@/components/forms/FormLabel";
import { CurrencyInput } from "@/components/forms/CurrencyInput";
import { JPDateInput } from "@/components/forms/JPDateInput";

// ── Zod schema ────────────────────────────────────────────────────────────────

const itemSchema = z.object({
  name:     z.string().min(1, "品名を入力してください"),
  quantity: z.number().min(0, "0以上で入力してください"),
  unit:     z.string(),
  price:    z.number().min(0, "0以上で入力してください"),
});

const quotationSchema = z.object({
  quotationNumber: z.string().min(1, "見積番号を入力してください"),
  issueDate:       z.string().min(1, "発行日を選択してください"),
  validUntil:      z.string(),
  subject:         z.string(),

  sellerName:    z.string().min(1, "会社名・氏名を入力してください"),
  sellerAddress: z.string(),
  sellerTel:     z.string(),

  buyerName: z.string().min(1, "宛先を入力してください"),

  items:   z.array(itemSchema).min(1, "明細を1件以上入力してください"),
  taxRate: z.number(),
  notes:   z.string(),
});

type QuotationForm = z.infer<typeof quotationSchema>;

// ── Helper ────────────────────────────────────────────────────────────────────

const FORMAT = new Intl.NumberFormat("ja-JP");
const fmt = (n: number) => FORMAT.format(n);

function defaultValidUntil() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split("T")[0];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuotationClient() {
  const [mascotState, setMascotState]     = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("見積書を作成しよう！");
  const [mascotDismissed, setMascotDismissed] = useState(false);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const methods = useForm<QuotationForm>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      quotationNumber: "QT-001",
      issueDate:       new Date().toISOString().split("T")[0],
      validUntil:      defaultValidUntil(),
      subject:         "",
      sellerName:      "",
      sellerAddress:   "",
      sellerTel:       "",
      buyerName:       "",
      items:           [{ name: "", quantity: 1, unit: "式", price: 0 }],
      taxRate:         10,
      notes:           "・納期：ご発注後2週間程度\n・お支払い：納品後30日以内",
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

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const watchedItems = useWatch({ control, name: "items" });
  const watchedIssueDate  = watch("issueDate");
  const watchedValidUntil = watch("validUntil");
  const watchedTaxRate    = watch("taxRate");

  const subtotal = (watchedItems ?? []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0,
  );
  const tax   = Math.floor(subtotal * (watchedTaxRate / 100));
  const total = subtotal + tax;

  // ── Error banner field list ──────────────────────────────────────────────────
  const errorFields: { id: string; label: string }[] = [];
  if (errors.quotationNumber)       errorFields.push({ id: "quotationNumber", label: "見積番号" });
  if (errors.issueDate)             errorFields.push({ id: "issueDate",       label: "発行日" });
  if (errors.sellerName)            errorFields.push({ id: "sellerName",      label: "発行元 会社名・氏名" });
  if (errors.buyerName)             errorFields.push({ id: "buyerName",       label: "宛先 会社名・氏名" });
  if (errors.items?.root || errors.items?.message) {
    errorFields.push({ id: "item-0-name", label: "明細" });
  }
  ((errors.items ?? []) as any[]).forEach((e, i) => {
    if (e?.name) errorFields.push({ id: `item-${i}-name`, label: `明細 ${i + 1} 品名` });
  });

  const hasErrors = errorFields.length > 0;

  const onSubmit = () => {
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
      <div className="min-h-screen py-12 print:py-0">
        <div className="max-w-4xl mx-auto px-4 print:max-w-none">

          <header className="text-center mb-8 print:hidden">
            <div className="text-5xl mb-4">📋</div>
            <h1 className="text-3xl font-bold text-kon mb-2">見積書作成</h1>
            <p className="text-gray-600 text-lg">PDF出力対応</p>
          </header>

          {/* Mascot */}
          {!mascotDismissed && (
            <div className="print:hidden mb-6 relative">
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
              className="print:hidden mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <p className="font-bold text-danger mb-2">入力内容を確認してください</p>
              <ul className="list-disc list-inside space-y-1">
                {errorFields.map(({ id, label }) => (
                  <li key={id}>
                    <a href={`#${id}`} className="text-danger underline hover:text-danger">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 print:hidden">

              {/* Header row */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Field
                  id="quotationNumber"
                  label="見積番号"
                  required
                  error={errors.quotationNumber?.message}
                >
                  <input
                    {...register("quotationNumber")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
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

                <Field
                  id="validUntil"
                  label="有効期限"
                  optional
                  error={errors.validUntil?.message}
                >
                  <JPDateInput
                    value={watchedValidUntil}
                    onChange={(v) => setValue("validUntil", v, { shouldValidate: true })}
                  />
                </Field>

                <Field
                  id="subject"
                  label="件名"
                  optional
                  error={errors.subject?.message}
                >
                  <input
                    {...register("subject")}
                    type="text"
                    placeholder="○○のお見積り"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </Field>
              </div>

              {/* Seller / Buyer */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-kon mb-3">発行元</h3>
                  <div className="space-y-3">
                    <Field
                      id="sellerName"
                      label="会社名・氏名"
                      required
                      error={errors.sellerName?.message}
                    >
                      <input
                        {...register("sellerName")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </Field>
                    <Field id="sellerAddress" label="住所" optional>
                      <input
                        {...register("sellerAddress")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </Field>
                    <Field id="sellerTel" label="電話番号" optional>
                      <input
                        {...register("sellerTel")}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </Field>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-kon mb-3">宛先</h3>
                  <Field
                    id="buyerName"
                    label="会社名・氏名"
                    required
                    error={errors.buyerName?.message}
                  >
                    <input
                      {...register("buyerName")}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </Field>
                </div>
              </div>

              {/* Items table */}
              <h3 className="font-bold text-kon mb-3">明細</h3>
              {(errors.items as { message?: string } | undefined)?.message && (
                <p role="alert" className="mb-2 text-xs text-danger">
                  {(errors.items as { message?: string }).message}
                </p>
              )}
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-2 py-2 text-left">
                      <FormLabel htmlFor="item-0-name" required>品名</FormLabel>
                    </th>
                    <th className="px-2 py-2 w-20 text-left">数量</th>
                    <th className="px-2 py-2 w-16 text-left">単位</th>
                    <th className="px-2 py-2 w-28 text-left">単価</th>
                    <th className="px-2 py-2 w-28 text-right">金額</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => {
                    const itemErrors = errors.items?.[index];
                    const lineTotal =
                      (Number(watchedItems?.[index]?.quantity) || 0) *
                      (Number(watchedItems?.[index]?.price) || 0);
                    return (
                      <tr key={field.id} className="border-b">
                        <td className="px-2 py-2">
                          <input
                            {...register(`items.${index}.name`)}
                            id={`item-${index}-name`}
                            type="text"
                            aria-invalid={!!itemErrors?.name}
                            aria-describedby={itemErrors?.name ? `item-${index}-name-error` : undefined}
                            className="w-full px-2 py-1 border rounded"
                          />
                          {itemErrors?.name && (
                            <p id={`item-${index}-name-error`} role="alert" className="text-xs text-danger mt-0.5">
                              {itemErrors.name.message}
                            </p>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          <input
                            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                            type="number"
                            min={0}
                            className="w-full px-2 py-1 border rounded text-center"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            {...register(`items.${index}.unit`)}
                            type="text"
                            className="w-full px-2 py-1 border rounded text-center"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <CurrencyInput
                            value={watchedItems?.[index]?.price ?? ""}
                            onChange={(v) =>
                              setValue(`items.${index}.price`, v === "" ? 0 : v, {
                                shouldValidate: true,
                              })
                            }
                            className="w-full px-2 py-1 border rounded text-right"
                          />
                        </td>
                        <td className="px-2 py-2 text-right">{fmt(lineTotal)}円</td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() => fields.length > 1 && remove(index)}
                            disabled={fields.length <= 1}
                            className="text-danger p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-gray-50 disabled:opacity-30"
                            aria-label={`明細 ${index + 1} を削除`}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button
                type="button"
                onClick={() => append({ name: "", quantity: 1, unit: "式", price: 0 })}
                className="text-sm text-kon py-2 px-3 rounded hover:bg-gray-50"
              >
                + 行を追加
              </button>

              {/* Notes */}
              <div className="mt-4">
                <Field id="notes" label="備考" optional>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </Field>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6 print:hidden">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg"
              >
                印刷 / PDF保存
              </button>
            </div>
          </form>

          {/* Print Preview ── identical to original, driven by watch() ────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6 print:shadow-none print:border-0 print:mt-0">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">御見積書</h2>
            </div>

            <div className="flex justify-between mb-6">
              <div>
                <p className="font-bold text-lg">{watch("buyerName") || "宛先"} 御中</p>
                {watch("subject") && <p className="mt-2">件名: {watch("subject")}</p>}
              </div>
              <div className="text-right text-sm">
                <p>見積番号: {watch("quotationNumber")}</p>
                <p>発行日: {watchedIssueDate}</p>
                <p>有効期限: {watchedValidUntil}</p>
              </div>
            </div>

            <div className="bg-kon text-white text-center py-3 rounded-lg mb-6">
              <p className="text-sm">御見積金額</p>
              <p className="text-3xl font-bold">{fmt(total)} 円（税込）</p>
            </div>

            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-b-2 border-kon">
                  <th className="py-2 text-left">品名</th>
                  <th className="py-2 text-center w-20">数量</th>
                  <th className="py-2 text-center w-16">単位</th>
                  <th className="py-2 text-right w-24">単価</th>
                  <th className="py-2 text-right w-28">金額</th>
                </tr>
              </thead>
              <tbody>
                {(watchedItems ?? [])
                  .filter((i) => i.name)
                  .map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-center">{item.unit}</td>
                      <td className="py-2 text-right">{fmt(Number(item.price))}</td>
                      <td className="py-2 text-right">
                        {fmt((Number(item.quantity) || 0) * (Number(item.price) || 0))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-1 border-b">
                  <span>小計</span><span>{fmt(subtotal)}円</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>消費税（{watchedTaxRate}%）</span><span>{fmt(tax)}円</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-lg">
                  <span>合計</span><span>{fmt(total)}円</span>
                </div>
              </div>
            </div>

            {watch("notes") && (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">
                {watch("notes")}
              </div>
            )}

            <div className="mt-8 pt-4 border-t text-sm">
              <p className="font-bold">{watch("sellerName")}</p>
              {watch("sellerAddress") && <p>{watch("sellerAddress")}</p>}
              {watch("sellerTel") && <p>TEL: {watch("sellerTel")}</p>}
            </div>
          </div>

          <div className="mt-8 text-center print:hidden">
            <Link href="/document" className="text-kon hover:text-ai">
              ← 書類作成一覧に戻る
            </Link>
          </div>
          <AdUnit slot="5612038947" format="horizontal" />
        </div>
      </div>
    </FormProvider>
  );
}
