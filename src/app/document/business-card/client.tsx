"use client";

import { useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Mascot, { type MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { Field } from "@/components/forms/Field";

// ── Constants ─────────────────────────────────────────────────────────────────

const themes = [
  { id: "classic",    name: "クラシック",    bg: "#ffffff", text: "#1a1a1a", accent: "#1e3a5f" },
  { id: "modern",     name: "モダン",       bg: "#f8f9fa", text: "#212529", accent: "#0d6efd" },
  { id: "dark",       name: "ダーク",       bg: "#1a1a2e", text: "#ffffff", accent: "#e94560" },
  { id: "natural",    name: "ナチュラル",    bg: "#f5f1eb", text: "#3d3d3d", accent: "#7c9473" },
  { id: "corporate",  name: "コーポレート", bg: "#ffffff", text: "#333333", accent: "#c41e3a" },
];

// ── Zod schema ────────────────────────────────────────────────────────────────

const businessCardSchema = z.object({
  name:       z.string().min(1, "氏名を入力してください"),
  nameEn:     z.string(),
  title:      z.string(),
  company:    z.string().min(1, "会社名を入力してください"),
  department: z.string(),
  tel:        z.string(),
  mobile:     z.string(),
  email:      z.string(),
  address:    z.string(),
  website:    z.string(),
});

type BusinessCardForm = z.infer<typeof businessCardSchema>;

// ── Component ─────────────────────────────────────────────────────────────────

export default function BusinessCardClient() {
  const [mascotState, setMascotState]       = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage]   = useState("名刺を作成しよう！");
  const [mascotDismissed, setMascotDismissed] = useState(false);
  const [theme, setTheme]   = useState(themes[0]);
  const [layout, setLayout] = useState<"horizontal" | "vertical">("horizontal");
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const methods = useForm<BusinessCardForm>({
    resolver: zodResolver(businessCardSchema),
    defaultValues: {
      name:       "",
      nameEn:     "",
      title:      "",
      company:    "",
      department: "",
      tel:        "",
      mobile:     "",
      email:      "",
      address:    "",
      website:    "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const w = watch();

  // ── Error banner ─────────────────────────────────────────────────────────────
  const errorFields: { id: string; label: string }[] = [];
  if (errors.name)    errorFields.push({ id: "name",    label: "氏名" });
  if (errors.company) errorFields.push({ id: "company", label: "会社名" });

  const hasErrors = errorFields.length > 0;

  const onSubmit = () => {
    window.print();
  };

  const onError = () => {
    setMascotState("error");
    setMascotMessage("氏名と会社名を入力してね！");
    setTimeout(() => {
      errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      const first = document.querySelector("[aria-invalid='true']") as HTMLElement | null;
      first?.focus();
    }, 50);
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen py-12 print:py-0 print:bg-white">
        <div className="max-w-4xl mx-auto px-4 print:max-w-none">

          <header className="text-center mb-8 print:hidden">
            <div className="text-5xl mb-4">💳</div>
            <h1 className="text-3xl font-bold text-kon mb-2">名刺作成</h1>
            <p className="text-gray-600 text-lg">シンプルデザイン</p>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 print:hidden">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Field id="name" label="氏名" required error={errors.name?.message}>
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </Field>

                <Field id="nameEn" label="氏名（英語）" optional>
                  <input
                    {...register("nameEn")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </Field>

                <Field id="company" label="会社名" required error={errors.company?.message}>
                  <input
                    {...register("company")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </Field>

                <Field id="department" label="部署・役職" optional>
                  <input
                    {...register("department")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </Field>

                <Field id="title" label="肩書き" optional>
                  <input
                    {...register("title")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </Field>

                <Field id="tel" label="電話番号" optional>
                  <input
                    {...register("tel")}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </Field>

                <Field id="mobile" label="携帯番号" optional>
                  <input
                    {...register("mobile")}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </Field>

                <Field id="email" label="メールアドレス" optional>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field id="address" label="住所" optional>
                    <input
                      {...register("address")}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field id="website" label="Webサイト" optional>
                    <input
                      {...register("website")}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </Field>
                </div>
              </div>

              {/* Theme selector — pure UI state */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">テーマ</p>
                <div className="flex flex-wrap gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        theme.id === t.id ? "border-kon" : "border-transparent"
                      }`}
                      style={{ backgroundColor: t.bg, color: t.text }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout toggle — pure UI state */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">レイアウト</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLayout("horizontal")}
                    className={`px-4 py-2 rounded-lg ${
                      layout === "horizontal" ? "bg-kon text-white" : "bg-gray-100"
                    }`}
                  >
                    横型
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout("vertical")}
                    className={`px-4 py-2 rounded-lg ${
                      layout === "vertical" ? "bg-kon text-white" : "bg-gray-100"
                    }`}
                  >
                    縦型
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="print:hidden">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg"
              >
                印刷 / PDF保存
              </button>
              <p className="text-center text-sm text-gray-500 mt-2">
                ※ 印刷設定で用紙サイズを「名刺」に設定してください
              </p>
            </div>
          </form>

          {/* Card Preview ── identical to original, driven by watch() ─────────── */}
          <div className="flex justify-center mb-6 mt-6">
            <div
              className={`shadow-lg rounded-lg overflow-hidden print:shadow-none ${
                layout === "horizontal" ? "w-[91mm] h-[55mm]" : "w-[55mm] h-[91mm]"
              }`}
              style={{ backgroundColor: theme.bg, color: theme.text }}
            >
              {layout === "horizontal" ? (
                <div className="p-4 h-full flex flex-col justify-between">
                  <div>
                    <p className="text-xs" style={{ color: theme.accent }}>{w.company}</p>
                    {w.department && <p className="text-xs opacity-70">{w.department}</p>}
                  </div>
                  <div>
                    {w.title && <p className="text-xs mb-1" style={{ color: theme.accent }}>{w.title}</p>}
                    <p className="text-xl font-bold">{w.name || "氏名"}</p>
                    {w.nameEn && <p className="text-xs opacity-70">{w.nameEn}</p>}
                  </div>
                  <div className="text-xs space-y-0.5">
                    {w.tel && <p>TEL: {w.tel}</p>}
                    {w.mobile && <p>Mobile: {w.mobile}</p>}
                    {w.email && <p>Email: {w.email}</p>}
                    {w.address && <p className="opacity-70">{w.address}</p>}
                    {w.website && <p style={{ color: theme.accent }}>{w.website}</p>}
                  </div>
                </div>
              ) : (
                <div className="p-4 h-full flex flex-col justify-between text-center">
                  <div>
                    <p className="text-xs" style={{ color: theme.accent }}>{w.company}</p>
                    {w.department && <p className="text-xs opacity-70">{w.department}</p>}
                  </div>
                  <div>
                    {w.title && <p className="text-xs mb-1" style={{ color: theme.accent }}>{w.title}</p>}
                    <p className="text-lg font-bold">{w.name || "氏名"}</p>
                    {w.nameEn && <p className="text-xs opacity-70">{w.nameEn}</p>}
                  </div>
                  <div className="text-xs space-y-0.5">
                    {w.tel && <p>TEL: {w.tel}</p>}
                    {w.email && <p>{w.email}</p>}
                    {w.website && <p style={{ color: theme.accent }}>{w.website}</p>}
                  </div>
                </div>
              )}
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
