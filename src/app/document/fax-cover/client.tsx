"use client";

import { useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Mascot, { type MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from "@/components/common/PricingTriggerProvider";
import { Field } from "@/components/forms/Field";
import { JPDateInput } from "@/components/forms/JPDateInput";

// ── Constants ─────────────────────────────────────────────────────────────────

const GREETING_TEMPLATES = [
  { id: "standard", label: "標準",   text: "いつもお世話になっております。" },
  { id: "formal",   label: "丁寧",   text: "平素は格別のご高配を賜り、厚く御礼申し上げます。" },
  { id: "first",    label: "初回",   text: "突然のご連絡失礼いたします。" },
  { id: "reply",    label: "返信",   text: "ご連絡いただきありがとうございます。" },
  { id: "custom",   label: "カスタム", text: "" },
];

const ACTION_OPTIONS = [
  { id: "confirm", label: "ご確認ください" },
  { id: "reply",   label: "ご返信ください" },
  { id: "urgent",  label: "至急ご対応ください" },
  { id: "info",    label: "ご参考まで" },
  { id: "sign",    label: "ご署名・ご捺印ください" },
];

// ── Zod schema ────────────────────────────────────────────────────────────────

const faxCoverSchema = z.object({
  sendDate:   z.string().min(1, "送信日を選択してください"),
  totalPages: z.number().min(1, "1枚以上で入力してください"),
  subject:    z.string(),

  toCompany:    z.string().min(1, "宛先の会社名を入力してください"),
  toDepartment: z.string(),
  toName:       z.string(),
  toFax:        z.string(),

  fromCompany:    z.string().min(1, "差出人の会社名を入力してください"),
  fromDepartment: z.string(),
  fromName:       z.string(),
  fromTel:        z.string(),
  fromFax:        z.string(),

  greeting: z.string(),
  message:  z.string(),
  closing:  z.string(),
});

type FaxCoverForm = z.infer<typeof faxCoverSchema>;

// ── Component ─────────────────────────────────────────────────────────────────

export default function FaxCoverClient() {
  const { triggerSuccess } = usePricingContext();

  const [mascotState, setMascotState]       = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage]   = useState("FAX送付状を作成しよう！");
  const [mascotDismissed, setMascotDismissed] = useState(false);
  const [greetingType, setGreetingType]     = useState("standard");
  const [selectedActions, setSelectedActions] = useState<string[]>(["confirm"]);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const methods = useForm<FaxCoverForm>({
    resolver: zodResolver(faxCoverSchema),
    defaultValues: {
      sendDate:       new Date().toISOString().split("T")[0],
      totalPages:     1,
      subject:        "",
      toCompany:      "",
      toDepartment:   "",
      toName:         "",
      toFax:          "",
      fromCompany:    "",
      fromDepartment: "",
      fromName:       "",
      fromTel:        "",
      fromFax:        "",
      greeting:       GREETING_TEMPLATES[0].text,
      message:        "",
      closing:        "以上、よろしくお願いいたします。",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const watchedSendDate = watch("sendDate");
  const watchedGreeting = watch("greeting");

  const handleGreetingType = (id: string) => {
    setGreetingType(id);
    const template = GREETING_TEMPLATES.find((t) => t.id === id);
    if (template && id !== "custom") {
      setValue("greeting", template.text);
    }
  };

  const toggleAction = (id: string) => {
    setSelectedActions((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  // ── Error banner ─────────────────────────────────────────────────────────────
  const errorFields: { id: string; label: string }[] = [];
  if (errors.sendDate)   errorFields.push({ id: "sendDate",   label: "送信日" });
  if (errors.toCompany)  errorFields.push({ id: "toCompany",  label: "宛先 会社名" });
  if (errors.fromCompany) errorFields.push({ id: "fromCompany", label: "差出人 会社名" });

  const hasErrors = errorFields.length > 0;

  const onSubmit = () => {
    setMascotState("success");
    setMascotMessage("印刷画面を開くよ！");
    triggerSuccess("fax-cover");
    window.print();
  };

  const onError = () => {
    setMascotState("error");
    setMascotMessage("宛先と差出人を入力してね！");
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
            <div className="text-5xl mb-4">📠</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">FAX送付状作成</h1>
            <p className="text-gray-600">ビジネス用テンプレート・登録不要</p>
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

              {/* Header row */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Field
                  id="sendDate"
                  label="送信日"
                  required
                  error={errors.sendDate?.message}
                >
                  <JPDateInput
                    value={watchedSendDate}
                    onChange={(v) => setValue("sendDate", v, { shouldValidate: true })}
                  />
                </Field>

                <Field id="totalPages" label="送信枚数（本状含む）" optional>
                  <input
                    {...register("totalPages", { valueAsNumber: true })}
                    type="number"
                    min={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </Field>

                <Field id="subject" label="件名" optional>
                  <input
                    {...register("subject")}
                    type="text"
                    placeholder="書類送付の件"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </Field>
              </div>

              {/* TO / FROM */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">宛先（TO）</h3>
                  <div className="space-y-3">
                    <Field
                      id="toCompany"
                      label="会社名"
                      required
                      error={errors.toCompany?.message}
                    >
                      <input
                        {...register("toCompany")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                    <Field id="toDepartment" label="部署名" optional>
                      <input
                        {...register("toDepartment")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                    <Field id="toName" label="担当者名" optional>
                      <input
                        {...register("toName")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                    <Field id="toFax" label="FAX番号" optional>
                      <input
                        {...register("toFax")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3">差出人（FROM）</h3>
                  <div className="space-y-3">
                    <Field
                      id="fromCompany"
                      label="会社名"
                      required
                      error={errors.fromCompany?.message}
                    >
                      <input
                        {...register("fromCompany")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                    <Field id="fromDepartment" label="部署名" optional>
                      <input
                        {...register("fromDepartment")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                    <Field id="fromName" label="担当者名" optional>
                      <input
                        {...register("fromName")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Field id="fromTel" label="TEL" optional>
                        <input
                          {...register("fromTel")}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </Field>
                      <Field id="fromFax" label="FAX" optional>
                        <input
                          {...register("fromFax")}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <h3 className="font-bold text-gray-900 mb-3">本文</h3>

              <div className="mb-4">
                <Field id="greeting" label="挨拶文" optional>
                  <>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {GREETING_TEMPLATES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleGreetingType(t.id)}
                          className={`px-3 py-1 text-sm rounded-full ${
                            greetingType === t.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <input
                      {...register("greeting")}
                      type="text"
                      onChange={(e) => {
                        setValue("greeting", e.target.value);
                        setGreetingType("custom");
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </>
                </Field>
              </div>

              <div className="mb-4">
                <Field id="message" label="通信欄" optional>
                  <textarea
                    {...register("message")}
                    rows={3}
                    placeholder="下記書類をお送りいたします。ご査収のほどよろしくお願いいたします。"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </Field>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">対応区分</p>
                <div className="flex flex-wrap gap-2">
                  {ACTION_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleAction(opt.id)}
                      className={`px-3 py-1 text-sm rounded-lg border ${
                        selectedActions.includes(opt.id)
                          ? "bg-blue-100 border-blue-500 text-blue-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {selectedActions.includes(opt.id) ? "✓ " : ""}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Field id="closing" label="結び" optional>
                <input
                  {...register("closing")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
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
            <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
              <h2 className="text-3xl font-bold tracking-widest">FAX送付状</h2>
            </div>

            <div className="flex justify-between text-sm mb-6">
              <div>送信日: {watchedSendDate}</div>
              <div>送信枚数: {watch("totalPages")}枚（本状含む）</div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-300 p-4">
                <p className="text-xs text-gray-500 mb-2 font-bold">TO（宛先）</p>
                <p className="font-bold text-lg">{watch("toCompany") || "会社名"}</p>
                {watch("toDepartment") && <p>{watch("toDepartment")}</p>}
                {watch("toName") && <p>{watch("toName")} 様</p>}
                {watch("toFax") && <p className="mt-2 text-sm">FAX: {watch("toFax")}</p>}
              </div>
              <div className="border border-gray-300 p-4">
                <p className="text-xs text-gray-500 mb-2 font-bold">FROM（差出人）</p>
                <p className="font-bold">{watch("fromCompany") || "会社名"}</p>
                {watch("fromDepartment") && <p>{watch("fromDepartment")}</p>}
                {watch("fromName") && <p>{watch("fromName")}</p>}
                <div className="mt-2 text-sm">
                  {watch("fromTel") && <p>TEL: {watch("fromTel")}</p>}
                  {watch("fromFax") && <p>FAX: {watch("fromFax")}</p>}
                </div>
              </div>
            </div>

            {watch("subject") && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">件名</p>
                <p className="font-bold text-lg border-b border-gray-300 pb-1">{watch("subject")}</p>
              </div>
            )}

            <div className="mb-6">
              <p className="mb-2">
                {watch("toName") ? `${watch("toName")}様` : `${watch("toCompany") || ""}御中`}
              </p>
              <p className="mb-4">{watchedGreeting}</p>
              {watch("message") && <p className="whitespace-pre-wrap">{watch("message")}</p>}
            </div>

            {selectedActions.length > 0 && (
              <div className="mb-6 p-3 bg-gray-50 border border-gray-200">
                <p className="text-sm font-bold mb-2">ご対応のお願い:</p>
                <div className="flex flex-wrap gap-3">
                  {selectedActions.map((id) => {
                    const opt = ACTION_OPTIONS.find((o) => o.id === id);
                    return opt ? (
                      <span key={id} className="text-sm">☑ {opt.label}</span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <p className="text-right">{watch("closing")}</p>

            <div className="mt-8 pt-4 border-t border-dashed text-xs text-gray-500 text-center">
              ※ 本FAXが届かない場合は、上記連絡先までご一報ください。
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
