"use client";

import { useRef, useState } from "react";
import { useForm, useFieldArray, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Mascot, { type MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from "@/components/common/PricingTriggerProvider";
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

const deliverySlipSchema = z.object({
  slipNumber:    z.string().min(1, "納品書番号を入力してください"),
  deliveryDate:  z.string().min(1, "納品日を選択してください"),
  orderNumber:   z.string(),

  sellerName:    z.string().min(1, "会社名・氏名を入力してください"),
  sellerAddress: z.string(),
  sellerTel:     z.string(),

  buyerName:    z.string().min(1, "納品先を入力してください"),
  buyerAddress: z.string(),

  items:   z.array(itemSchema).min(1, "明細を1件以上入力してください"),
  taxRate: z.number(),
  notes:   z.string(),
});

type DeliverySlipForm = z.infer<typeof deliverySlipSchema>;

// ── Helper ────────────────────────────────────────────────────────────────────

const FORMAT = new Intl.NumberFormat("ja-JP");
const fmt = (n: number) => FORMAT.format(n);

// ── Component ─────────────────────────────────────────────────────────────────

export default function DeliverySlipClient() {
  const { triggerSuccess } = usePricingContext();

  const [mascotState, setMascotState]       = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage]   = useState("納品書を作成しよう！");
  const [mascotDismissed, setMascotDismissed] = useState(false);
  const [showPrice, setShowPrice]           = useState(true);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const methods = useForm<DeliverySlipForm>({
    resolver: zodResolver(deliverySlipSchema),
    defaultValues: {
      slipNumber:    "DLV-001",
      deliveryDate:  new Date().toISOString().split("T")[0],
      orderNumber:   "",
      sellerName:    "",
      sellerAddress: "",
      sellerTel:     "",
      buyerName:     "",
      buyerAddress:  "",
      items:         [{ name: "", quantity: 1, unit: "個", price: 0 }],
      taxRate:       10,
      notes:         "",
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
  const watchedDeliveryDate = watch("deliveryDate");
  const watchedTaxRate      = watch("taxRate");

  const subtotal = (watchedItems ?? []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0,
  );
  const tax   = Math.floor(subtotal * (watchedTaxRate / 100));
  const total = subtotal + tax;

  // ── Error banner ─────────────────────────────────────────────────────────────
  const errorFields: { id: string; label: string }[] = [];
  if (errors.slipNumber)   errorFields.push({ id: "slipNumber",   label: "納品書番号" });
  if (errors.deliveryDate) errorFields.push({ id: "deliveryDate", label: "納品日" });
  if (errors.sellerName)   errorFields.push({ id: "sellerName",   label: "納品元 会社名・氏名" });
  if (errors.buyerName)    errorFields.push({ id: "buyerName",    label: "納品先 会社名・氏名" });
  if ((errors.items as { message?: string } | undefined)?.message) {
    errorFields.push({ id: "item-0-name", label: "明細" });
  }
  ((errors.items ?? []) as any[]).forEach((e, i) => {
    if (e?.name) errorFields.push({ id: `item-${i}-name`, label: `明細 ${i + 1} 品名` });
  });

  const hasErrors = errorFields.length > 0;

  const onSubmit = () => {
    setMascotState("success");
    setMascotMessage("印刷画面を開くよ！");
    triggerSuccess("delivery-slip");
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
            <div className="text-5xl mb-4">📦</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">納品書作成</h1>
            <p className="text-gray-600">登録不要・無料で納品書を作成</p>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 print:hidden">
              <h2 className="font-bold text-gray-900 mb-4">基本情報</h2>

              {/* Header row */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Field
                  id="slipNumber"
                  label="納品書番号"
                  required
                  error={errors.slipNumber?.message}
                >
                  <input
                    {...register("slipNumber")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </Field>

                <Field
                  id="deliveryDate"
                  label="納品日"
                  required
                  error={errors.deliveryDate?.message}
                >
                  <JPDateInput
                    value={watchedDeliveryDate}
                    onChange={(v) => setValue("deliveryDate", v, { shouldValidate: true })}
                  />
                </Field>

                <Field id="orderNumber" label="注文番号" optional>
                  <input
                    {...register("orderNumber")}
                    type="text"
                    placeholder="ORD-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </Field>
              </div>

              {/* Seller / Buyer */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">納品元（自社）</h3>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                    <Field id="sellerAddress" label="住所" optional>
                      <input
                        {...register("sellerAddress")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                    <Field id="sellerTel" label="電話番号" optional>
                      <input
                        {...register("sellerTel")}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3">納品先</h3>
                  <div className="space-y-3">
                    <Field
                      id="buyerName"
                      label="会社名・氏名"
                      required
                      error={errors.buyerName?.message}
                    >
                      <input
                        {...register("buyerName")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                    <Field id="buyerAddress" label="住所" optional>
                      <input
                        {...register("buyerAddress")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Items table */}
              <h3 className="font-bold text-gray-900 mb-3">納品明細</h3>
              {(errors.items as { message?: string } | undefined)?.message && (
                <p role="alert" className="mb-2 text-xs text-danger">
                  {(errors.items as { message?: string }).message}
                </p>
              )}
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-2 text-left">
                        <FormLabel htmlFor="item-0-name" required>品名</FormLabel>
                      </th>
                      <th className="px-2 py-2 w-20 text-left">数量</th>
                      <th className="px-2 py-2 w-16 text-left">単位</th>
                      {showPrice && <th className="px-2 py-2 w-24 text-left">単価</th>}
                      {showPrice && <th className="px-2 py-2 w-28 text-right">金額</th>}
                      <th className="px-2 py-2 w-10"></th>
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
                              placeholder="品名"
                              aria-invalid={!!itemErrors?.name}
                              aria-describedby={itemErrors?.name ? `item-${index}-name-error` : undefined}
                              className="w-full px-2 py-1 border border-gray-200 rounded"
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
                              className="w-full px-2 py-1 border border-gray-200 rounded text-center"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              {...register(`items.${index}.unit`)}
                              type="text"
                              className="w-full px-2 py-1 border border-gray-200 rounded text-center"
                            />
                          </td>
                          {showPrice && (
                            <td className="px-2 py-2">
                              <CurrencyInput
                                value={watchedItems?.[index]?.price ?? ""}
                                onChange={(v) =>
                                  setValue(`items.${index}.price`, v === "" ? 0 : v, {
                                    shouldValidate: true,
                                  })
                                }
                                className="w-full px-2 py-1 border border-gray-200 rounded text-right"
                              />
                            </td>
                          )}
                          {showPrice && (
                            <td className="px-2 py-2 text-right font-medium">{fmt(lineTotal)}円</td>
                          )}
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => fields.length > 1 && remove(index)}
                              disabled={fields.length <= 1}
                              className="text-danger hover:text-danger disabled:opacity-30 p-1"
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
              </div>
              <button
                type="button"
                onClick={() => append({ name: "", quantity: 1, unit: "個", price: 0 })}
                className="text-sm text-kon hover:text-ai"
              >
                + 行を追加
              </button>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showPrice}
                    onChange={(e) => setShowPrice(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">金額を表示</span>
                </label>
                {showPrice && (
                  <>
                    <span className="text-sm">消費税率:</span>
                    <select
                      {...register("taxRate", { valueAsNumber: true })}
                      className="px-3 py-1 border border-gray-300 rounded-lg"
                    >
                      <option value={10}>10%</option>
                      <option value={8}>8%（軽減税率）</option>
                    </select>
                  </>
                )}
              </div>

              <div className="mt-4">
                <Field id="notes" label="備考" optional>
                  <textarea
                    {...register("notes")}
                    rows={2}
                    placeholder="ご確認の上、受領印をお願いいたします"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </Field>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6 print:hidden">
              <button
                type="submit"
                className="w-full py-4 bg-kon hover:bg-ai text-white rounded-xl font-bold text-lg"
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
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">納 品 書</h2>
            </div>

            <div className="flex justify-between mb-6">
              <div>
                <p className="font-bold text-lg">{watch("buyerName") || "納品先名"} 御中</p>
                {watch("buyerAddress") && (
                  <p className="text-sm text-gray-600">{watch("buyerAddress")}</p>
                )}
              </div>
              <div className="text-right text-sm">
                <p>納品書番号: {watch("slipNumber")}</p>
                <p>納品日: {watchedDeliveryDate}</p>
                {watch("orderNumber") && <p>注文番号: {watch("orderNumber")}</p>}
              </div>
            </div>

            <p className="mb-4 text-sm">下記の通り納品いたします。</p>

            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="py-2 text-left">品名</th>
                  <th className="py-2 text-center w-20">数量</th>
                  <th className="py-2 text-center w-16">単位</th>
                  {showPrice && <th className="py-2 text-right w-24">単価</th>}
                  {showPrice && <th className="py-2 text-right w-28">金額</th>}
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
                      {showPrice && <td className="py-2 text-right">{fmt(Number(item.price))}</td>}
                      {showPrice && (
                        <td className="py-2 text-right">
                          {fmt((Number(item.quantity) || 0) * (Number(item.price) || 0))}
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>

            {showPrice && (
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
            )}

            {watch("notes") && (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-1">備考</p>
                <p className="text-sm whitespace-pre-wrap">{watch("notes")}</p>
              </div>
            )}

            <div className="mt-8 flex justify-between items-end">
              <div className="text-sm">
                <p className="font-bold">{watch("sellerName") || "納品元名"}</p>
                {watch("sellerAddress") && <p>{watch("sellerAddress")}</p>}
                {watch("sellerTel") && <p>TEL: {watch("sellerTel")}</p>}
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">受領印</p>
                <div className="w-20 h-20 border border-gray-400"></div>
              </div>
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
