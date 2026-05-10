"use client";

import { useRef, useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Mascot, { type MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { Field } from "@/components/forms/Field";
import { JPDateInput } from "@/components/forms/JPDateInput";

// ── Zod schema ────────────────────────────────────────────────────────────────

const documentSchema = z.object({
  name:     z.string(),
  quantity: z.number().min(1),
});

const coverLetterSchema = z.object({
  issueDate:         z.string().min(1, "日付を選択してください"),

  recipientCompany: z.string().min(1, "会社名を入力してください"),
  recipientDept:    z.string(),
  recipientName:    z.string(),

  senderCompany:  z.string(),
  senderDept:     z.string(),
  senderName:     z.string().min(1, "差出人の氏名を入力してください"),
  senderAddress:  z.string(),
  senderTel:      z.string(),

  subject:  z.string().min(1, "件名を入力してください"),
  greeting: z.string(),
  body:     z.string(),
  closing:  z.string(),

  documents: z.array(documentSchema),
});

type CoverLetterForm = z.infer<typeof coverLetterSchema>;

// ── Helper ────────────────────────────────────────────────────────────────────

function formatJapaneseDate(iso: string) {
  return iso.replace(/-/g, "年").replace(/年(\d+)$/, "月$1日");
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CoverLetterClient() {
  const [mascotState, setMascotState]       = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage]   = useState("送付状を作成しよう！");
  const [mascotDismissed, setMascotDismissed] = useState(false);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const methods = useForm<CoverLetterForm>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      issueDate:        new Date().toISOString().split("T")[0],
      recipientCompany: "",
      recipientDept:    "",
      recipientName:    "",
      senderCompany:    "",
      senderDept:       "",
      senderName:       "",
      senderAddress:    "",
      senderTel:        "",
      subject:          "書類送付のご案内",
      greeting:         "拝啓　時下ますますご清栄のこととお慶び申し上げます。\n平素は格別のご高配を賜り、厚く御礼申し上げます。",
      body:             "下記の書類をお送りいたしますので、ご査収のほどよろしくお願い申し上げます。",
      closing:          "敬具",
      documents:        [{ name: "", quantity: 1 }],
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

  const { fields, append, remove } = useFieldArray({ control, name: "documents" });

  const watchedIssueDate = watch("issueDate");

  // ── Error banner ─────────────────────────────────────────────────────────────
  const errorFields: { id: string; label: string }[] = [];
  if (errors.issueDate)         errorFields.push({ id: "issueDate",         label: "日付" });
  if (errors.recipientCompany)  errorFields.push({ id: "recipientCompany",  label: "送付先 会社名" });
  if (errors.senderName)        errorFields.push({ id: "senderName",        label: "差出人 氏名" });
  if (errors.subject)           errorFields.push({ id: "subject",           label: "件名" });

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
            <div className="text-5xl mb-4">📨</div>
            <h1 className="text-3xl font-bold text-kon mb-2">送付状作成</h1>
            <p className="text-gray-600 text-lg">ビジネス送付状</p>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 print:hidden space-y-6">

              {/* Date */}
              <Field
                id="issueDate"
                label="日付"
                required
                error={errors.issueDate?.message}
              >
                <JPDateInput
                  value={watchedIssueDate}
                  onChange={(v) => setValue("issueDate", v, { shouldValidate: true })}
                />
              </Field>

              {/* Recipient / Sender */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-kon mb-3">送付先</h3>
                  <div className="space-y-3">
                    <Field
                      id="recipientCompany"
                      label="会社名"
                      required
                      error={errors.recipientCompany?.message}
                    >
                      <input
                        {...register("recipientCompany")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </Field>
                    <Field id="recipientDept" label="部署名" optional>
                      <input
                        {...register("recipientDept")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </Field>
                    <Field id="recipientName" label="担当者名" optional>
                      <input
                        {...register("recipientName")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </Field>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-kon mb-3">差出人</h3>
                  <div className="space-y-3">
                    <Field id="senderCompany" label="会社名" optional>
                      <input
                        {...register("senderCompany")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </Field>
                    <Field id="senderDept" label="部署名" optional>
                      <input
                        {...register("senderDept")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </Field>
                    <Field
                      id="senderName"
                      label="氏名"
                      required
                      error={errors.senderName?.message}
                    >
                      <input
                        {...register("senderName")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </Field>
                    <Field id="senderAddress" label="住所" optional>
                      <input
                        {...register("senderAddress")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </Field>
                    <Field id="senderTel" label="電話番号" optional>
                      <input
                        {...register("senderTel")}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <Field
                id="subject"
                label="件名"
                required
                error={errors.subject?.message}
              >
                <input
                  {...register("subject")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </Field>

              {/* Greeting */}
              <Field id="greeting" label="前文" optional>
                <textarea
                  {...register("greeting")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </Field>

              {/* Body */}
              <Field id="body" label="本文" optional>
                <textarea
                  {...register("body")}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </Field>

              {/* Documents list */}
              <div>
                <h3 className="font-bold text-kon mb-3">送付書類</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 mb-2">
                    <input
                      {...register(`documents.${index}.name`)}
                      type="text"
                      placeholder="書類名"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                    />
                    <input
                      {...register(`documents.${index}.quantity`, { valueAsNumber: true })}
                      type="number"
                      min={1}
                      className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center"
                    />
                    <span className="py-2">部</span>
                    <button
                      type="button"
                      onClick={() => fields.length > 1 && remove(index)}
                      disabled={fields.length <= 1}
                      className="text-danger p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-gray-50 disabled:opacity-30"
                      aria-label={`書類 ${index + 1} を削除`}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append({ name: "", quantity: 1 })}
                  className="text-sm text-kon py-2 px-3 rounded hover:bg-gray-50"
                >
                  + 追加
                </button>
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
            <div className="text-right mb-8">
              {watchedIssueDate ? formatJapaneseDate(watchedIssueDate) : ""}
            </div>

            <div className="mb-8">
              <p className="font-bold">{watch("recipientCompany") || "会社名"} 御中</p>
              {watch("recipientDept") && <p>{watch("recipientDept")}</p>}
              {watch("recipientName") && <p>{watch("recipientName")} 様</p>}
            </div>

            <div className="text-right mb-8">
              {watch("senderCompany") && <p>{watch("senderCompany")}</p>}
              {watch("senderDept") && <p>{watch("senderDept")}</p>}
              <p>{watch("senderName")}</p>
              {watch("senderAddress") && <p className="text-sm">{watch("senderAddress")}</p>}
              {watch("senderTel") && <p className="text-sm">TEL: {watch("senderTel")}</p>}
            </div>

            <h2 className="text-center text-lg font-bold mb-6 border-b pb-2">
              {watch("subject")}
            </h2>

            <div className="mb-6 whitespace-pre-wrap leading-relaxed">{watch("greeting")}</div>
            <div className="mb-8 whitespace-pre-wrap leading-relaxed">{watch("body")}</div>
            <div className="text-right mb-8">{watch("closing")}</div>

            <div className="border-t pt-4">
              <p className="text-center font-bold mb-4">記</p>
              <table className="mx-auto">
                <tbody>
                  {(watch("documents") ?? [])
                    .filter((d) => d.name)
                    .map((doc, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-1">{doc.name}</td>
                        <td className="px-4 py-1 text-right">{doc.quantity}部</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <p className="text-right mt-4">以上</p>
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
