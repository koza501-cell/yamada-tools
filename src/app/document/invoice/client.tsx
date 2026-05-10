"use client";

import { useRef } from "react";
import { useForm, useFieldArray, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Mascot, { type MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from "@/components/common/PricingTriggerProvider";
import { useState } from "react";
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

const tNumberSchema = z
  .string()
  .refine((v) => v === "" || /^T\d{13}$/.test(v), "T + 13桁の数字で入力してください");

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "請求書番号を入力してください"),
  issueDate:     z.string().min(1, "発行日を選択してください"),
  dueDate:       z.string().min(1, "支払期限を選択してください"),
  tNumber:       tNumberSchema,

  sellerName:    z.string().min(1, "会社名・氏名を入力してください"),
  sellerAddress: z.string(),
  sellerTel:     z.string(),

  buyerName:     z.string().min(1, "会社名・氏名を入力してください"),
  buyerAddress:  z.string(),

  items:    z.array(itemSchema).min(1, "明細を1件以上入力してください"),
  taxRate:  z.number(),
  notes:    z.string(),
});

type InvoiceForm = z.infer<typeof invoiceSchema>;

// ── Helper ────────────────────────────────────────────────────────────────────

function getDefaultDueDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split("T")[0];
}

// ── Props ────────────────────────────────────────────────────────────────────

interface FAQ {
  question: string;
  answer: string;
}

interface SeoContent {
  intro: string;
  useCases?: { title: string; desc: string }[];
  tips?: string;
}

interface InvoiceClientProps {
  faq?: FAQ[];
  seoContent?: SeoContent;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function InvoiceClient({ faq, seoContent }: InvoiceClientProps) {
  const { triggerSuccess } = usePricingContext();
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("請求書を作成しよう！");
  const [mascotDismissed, setMascotDismissed] = useState(false);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const methods = useForm<InvoiceForm>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: "INV-001",
      issueDate:     new Date().toISOString().split("T")[0],
      dueDate:       getDefaultDueDate(),
      tNumber:       "",
      sellerName:    "",
      sellerAddress: "",
      sellerTel:     "",
      buyerName:     "",
      buyerAddress:  "",
      items: [{ name: "", quantity: 1, unit: "個", price: 0 }],
      taxRate: 10,
      notes:   "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = useWatch({ control, name: "items" });
  const watchedTaxRate = watch("taxRate");
  const watchedSellerName = watch("sellerName");
  const watchedSellerAddress = watch("sellerAddress");
  const watchedSellerTel = watch("sellerTel");
  const watchedBuyerName = watch("buyerName");
  const watchedBuyerAddress = watch("buyerAddress");
  const watchedInvoiceNumber = watch("invoiceNumber");
  const watchedIssueDate = watch("issueDate");
  const watchedDueDate = watch("dueDate");
  const watchedTNumber = watch("tNumber");
  const watchedNotes = watch("notes");

  const subtotal = (watchedItems ?? []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0
  );
  const tax   = Math.floor(subtotal * (watchedTaxRate ?? 10) / 100);
  const total = subtotal + tax;

  const tNumberError = errors.tNumber?.message;
  const hasErrors = Object.keys(errors).length > 0;

  const onSubmit = () => {
    setMascotState("success");
    triggerSuccess("invoice");
    setMascotMessage("印刷画面を開くよ！");
    window.print();
  };

  const onError = () => {
    setMascotState("error");
    setMascotMessage("必須項目を入力してね！");
    // Focus first invalid field
    setTimeout(() => {
      errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInvalid = document.querySelector<HTMLElement>("[aria-invalid='true']");
      firstInvalid?.focus();
    }, 50);
  };

  // Collect top-level field errors for the error banner
  const topErrors: { label: string; id: string }[] = [];
  if (errors.invoiceNumber) topErrors.push({ label: "請求書番号",   id: "invoice-invoiceNumber" });
  if (errors.issueDate)     topErrors.push({ label: "発行日",       id: "invoice-issueDate" });
  if (errors.dueDate)       topErrors.push({ label: "支払期限",     id: "invoice-dueDate" });
  if (errors.sellerName)    topErrors.push({ label: "請求元 会社名・氏名", id: "invoice-sellerName" });
  if (errors.buyerName)     topErrors.push({ label: "請求先 会社名・氏名", id: "invoice-buyerName" });
  if (errors.items)         topErrors.push({ label: "明細",         id: "invoice-item-0-name" });

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen py-12 print:py-0 print:bg-white">
        <div className="max-w-4xl mx-auto px-4 print:max-w-none print:px-0">

          <header className="text-center mb-8 print:hidden">
            <div className="text-5xl mb-4">📑</div>
            <h1 className="text-3xl font-bold text-kon mb-2">請求書作成</h1>
            <p className="text-gray-600 text-lg">インボイス制度対応</p>
          </header>

          {/* Mascot */}
          {!mascotDismissed && (
            <div className="print:hidden mb-6 relative">
              <Mascot state={mascotState} message={mascotMessage} />
              <button
                type="button"
                aria-label="メッセージを閉じる"
                onClick={() => setMascotDismissed(true)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
          )}

          {/* Error banner */}
          {hasErrors && (
            <div
              ref={errorBannerRef}
              role="alert"
              aria-live="assertive"
              className="print:hidden mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4"
            >
              <p className="font-bold text-danger mb-2">入力エラーがあります。以下を確認してください：</p>
              <ul className="list-disc list-inside space-y-1">
                {topErrors.map(({ label, id }) => (
                  <li key={id}>
                    <a href={`#${id}`} className="text-danger underline hover:text-danger text-sm">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Input form */}
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            noValidate
            className="space-y-6 print:hidden"
          >
            {/* 基本情報 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-kon mb-4">基本情報</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Field id="invoice-invoiceNumber" label="請求書番号" required error={errors.invoiceNumber?.message}>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    {...register("invoiceNumber")}
                  />
                </Field>
                <Field id="invoice-issueDate" label="発行日" required error={errors.issueDate?.message}>
                  <JPDateInput
                    id="invoice-issueDate"
                    value={watchedIssueDate ?? ""}
                    onChange={(v) => setValue("issueDate", v, { shouldValidate: true })}
                    aria-invalid={!!errors.issueDate}
                    aria-describedby={errors.issueDate ? "invoice-issueDate-error" : undefined}
                  />
                </Field>
                <Field id="invoice-dueDate" label="支払期限" required error={errors.dueDate?.message}>
                  <JPDateInput
                    id="invoice-dueDate"
                    value={watchedDueDate ?? ""}
                    onChange={(v) => setValue("dueDate", v, { shouldValidate: true })}
                    aria-invalid={!!errors.dueDate}
                    aria-describedby={errors.dueDate ? "invoice-dueDate-error" : undefined}
                  />
                </Field>
              </div>

              {/* 請求元 / 請求先 */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-kon mb-3">請求元（自社）</h3>
                  <div className="space-y-3">
                    <Field id="invoice-sellerName" label="会社名・氏名" required error={errors.sellerName?.message}>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        {...register("sellerName")}
                      />
                    </Field>
                    <Field id="invoice-sellerAddress" label="住所" optional>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        {...register("sellerAddress")}
                      />
                    </Field>
                    <Field id="invoice-sellerTel" label="電話番号" optional>
                      <input
                        type="text"
                        inputMode="tel"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        {...register("sellerTel")}
                      />
                    </Field>
                    <div>
                      <Field
                        id="invoice-tNumber"
                        label="適格請求書発行事業者番号"
                        optional
                        helper="T + 13桁の数字"
                        error={tNumberError}
                      >
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg ${
                            tNumberError
                              ? "border-danger"
                              : watchedTNumber && /^T\d{13}$/.test(watchedTNumber)
                              ? "border-green-400"
                              : "border-gray-200"
                          }`}
                          placeholder="T1234567890123"
                          {...register("tNumber")}
                        />
                      </Field>
                      {watchedTNumber && /^T\d{13}$/.test(watchedTNumber) && !tNumberError && (
                        <p className="mt-1 text-xs text-green-600">✓ 正しい形式です</p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-kon mb-3">請求先</h3>
                  <div className="space-y-3">
                    <Field id="invoice-buyerName" label="会社名・氏名" required error={errors.buyerName?.message}>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        {...register("buyerName")}
                      />
                    </Field>
                    <Field id="invoice-buyerAddress" label="住所" optional>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        {...register("buyerAddress")}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* 明細 */}
              <h3 className="font-bold text-kon mb-3">明細</h3>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-2 text-left">
                        品名 <span className="ml-1 text-[11px] text-white bg-danger px-1 rounded-[3px]">必須</span>
                      </th>
                      <th className="px-2 py-2 w-20">数量</th>
                      <th className="px-2 py-2 w-16">単位</th>
                      <th className="px-2 py-2 w-28">単価</th>
                      <th className="px-2 py-2 w-28">金額</th>
                      <th className="px-2 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.id} className="border-b">
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            id={`invoice-item-${index}-name`}
                            aria-label={`品名 ${index + 1}`}
                            aria-invalid={!!errors.items?.[index]?.name}
                            className="w-full px-2 py-1 border border-gray-200 rounded"
                            {...register(`items.${index}.name`)}
                          />
                          {errors.items?.[index]?.name && (
                            <p role="alert" className="text-xs text-danger mt-0.5">
                              {errors.items[index]?.name?.message}
                            </p>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            aria-label={`数量 ${index + 1}`}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-center"
                            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            aria-label={`単位 ${index + 1}`}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-center"
                            {...register(`items.${index}.unit`)}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <CurrencyInput
                            aria-label={`単価 ${index + 1}`}
                            value={watchedItems?.[index]?.price ?? ""}
                            onChange={(v) =>
                              setValue(`items.${index}.price`, v === "" ? 0 : v, {
                                shouldValidate: true,
                              })
                            }
                          />
                        </td>
                        <td className="px-2 py-2 text-right font-medium">
                          {(
                            (Number(watchedItems?.[index]?.quantity) || 0) *
                            (Number(watchedItems?.[index]?.price) || 0)
                          ).toLocaleString()}円
                        </td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() => fields.length > 1 && remove(index)}
                            disabled={fields.length === 1}
                            aria-label={`明細 ${index + 1} を削除`}
                            className="text-danger hover:text-danger disabled:opacity-30"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={() => append({ name: "", quantity: 1, unit: "個", price: 0 })}
                className="text-sm text-kon hover:text-ai py-2 px-3 rounded hover:bg-gray-50"
              >
                + 行を追加
              </button>

              {/* 消費税率 */}
              <div className="flex items-center gap-4 mt-4">
                <FormLabel htmlFor="invoice-taxRate">消費税率:</FormLabel>
                <select
                  id="invoice-taxRate"
                  className="px-3 py-1 border border-gray-200 rounded-lg"
                  {...register("taxRate", { valueAsNumber: true })}
                >
                  <option value={10}>10%</option>
                  <option value={8}>8%（軽減税率）</option>
                </select>
              </div>

              {/* 備考 */}
              <div className="mt-4">
                <Field id="invoice-notes" label="備考" optional>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="振込先口座など"
                    {...register("notes")}
                  />
                </Field>
              </div>
            </div>

            {/* Print button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg"
            >
              印刷 / PDF保存
            </button>
            <p className="text-center text-sm text-gray-500">※ 印刷画面でPDFとして保存できます</p>
          </form>

          {/* Preview / Print Area — identical output to pre-migration */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-0 print:rounded-none mt-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">請求書</h2>
            </div>

            <div className="flex justify-between mb-6">
              <div>
                <p className="font-bold text-lg">{watchedBuyerName || "請求先名"} 御中</p>
                {watchedBuyerAddress && <p className="text-sm text-gray-600">{watchedBuyerAddress}</p>}
              </div>
              <div className="text-right text-sm">
                <p>請求書番号: {watchedInvoiceNumber}</p>
                <p>発行日: {watchedIssueDate}</p>
                <p>支払期限: {watchedDueDate}</p>
              </div>
            </div>

            <div className="bg-kon text-white text-center py-3 rounded-lg mb-6">
              <p className="text-sm">ご請求金額</p>
              <p className="text-3xl font-bold">{total.toLocaleString()} 円</p>
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
                {(watchedItems ?? []).filter((i) => i.name).map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-center">{item.unit}</td>
                    <td className="py-2 text-right">{Number(item.price).toLocaleString()}</td>
                    <td className="py-2 text-right">
                      {((Number(item.quantity) || 0) * (Number(item.price) || 0)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-1 border-b">
                  <span>小計</span><span>{subtotal.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>消費税（{watchedTaxRate}%）</span><span>{tax.toLocaleString()}円</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-lg">
                  <span>合計</span><span>{total.toLocaleString()}円</span>
                </div>
              </div>
            </div>

            {watchedNotes && (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-1">備考</p>
                <p className="text-sm whitespace-pre-wrap">{watchedNotes}</p>
              </div>
            )}

            <div className="mt-8 pt-4 border-t text-sm">
              <p className="font-bold">{watchedSellerName || "請求元名"}</p>
              {watchedSellerAddress && <p>{watchedSellerAddress}</p>}
              {watchedSellerTel && <p>TEL: {watchedSellerTel}</p>}
              {watchedTNumber && <p>登録番号: {watchedTNumber}</p>}
            </div>
          </div>

          <div className="mt-8 text-center print:hidden">
            <Link href="/document" className="text-kon hover:text-ai">← 書類作成一覧に戻る</Link>
          </div>

          {/* SEO Content */}
          {seoContent && (
            <section className="mt-8 bg-white rounded-xl p-6 border border-gray-100 print:hidden">
              <h2 className="font-bold text-kon mb-4 text-lg">請求書作成について</h2>
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
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-kon">
                    💡 <strong>ヒント:</strong> {seoContent.tips}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* FAQ */}
          {faq && faq.length > 0 && (
            <section className="mt-8 print:hidden">
              <h2 className="font-bold text-kon mb-4 text-lg">よくある質問</h2>
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <details
                    key={index}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden group"
                  >
                    <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-kon">Q.</span>
                        {item.question}
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

          <AdUnit slot="5612038947" format="horizontal" />
        </div>
      </div>
    </FormProvider>
  );
}
