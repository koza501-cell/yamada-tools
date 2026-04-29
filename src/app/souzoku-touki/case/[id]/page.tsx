"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const API_SOUZOKU = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/souzoku";

type Prop = { type: "land" | "building"; location: string; chiban: string; chime: string; structure: string; area: string; assessed_value: string };
type Heir = { name: string; name_kana: string; relation: string; address: string; share: string; is_applicant: boolean };
type FormData = {
  houmukyoku: string;
  application_date: string;
  deceased: { name: string; name_kana: string; birth_date: string; death_date: string; address: string; family_register_address: string };
  applicant: { name: string; address: string; phone: string; share: string };
  heirs: Heir[];
  properties: Prop[];
  agreement_date: string;
  attachments: string[];
  assessed_total: number;
  tax_total: number;
};

const EMPTY_FORM: FormData = {
  houmukyoku: "",
  application_date: "",
  deceased: { name: "", name_kana: "", birth_date: "", death_date: "", address: "", family_register_address: "" },
  applicant: { name: "", address: "", phone: "", share: "" },
  heirs: [{ name: "", name_kana: "", relation: "配偶者", address: "", share: "1/1", is_applicant: true }],
  properties: [{ type: "land", location: "", chiban: "", chime: "宅地", structure: "", area: "", assessed_value: "" }],
  agreement_date: "",
  attachments: ["登記原因証明情報（戸籍謄本等）", "住所証明情報（住民票）"],
  assessed_total: 0,
  tax_total: 0,
};

const SECTIONS = ["申請先", "被相続人", "不動産", "相続人", "確認"] as const;
type Section = typeof SECTIONS[number];

const RELATIONS = ["配偶者", "長男", "長女", "次男", "次女", "三男", "三女", "父", "母", "兄", "姉", "弟", "妹", "その他"];
const CHIME_LAND = ["宅地", "田", "畑", "山林", "雑種地", "原野"];
const CHIME_BUILDING = ["居宅", "店舗", "事務所", "倉庫", "共同住宅", "その他"];

function calcTax(total: number): number {
  if (total <= 1_000_000) return 0;
  const raw = total * 0.004;
  const floored = Math.floor(raw / 100) * 100;
  return Math.max(floored, 1000);
}

export default function CaseIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [section, setSection] = useState<Section>("申請先");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [caseStatus, setCaseStatus] = useState<{ status: string; tier: string | null; expires_at: string | null; name: string }>({
    status: "draft", tier: null, expires_at: null, name: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [paymentMsg, setPaymentMsg] = useState("");

  const token = () => (typeof window !== "undefined" ? localStorage.getItem("session_token") || "" : "");

  const loadCase = useCallback(async () => {
    try {
      const res = await fetch(`${API_SOUZOKU}/cases/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) { router.push("/souzoku-touki"); return; }
      const data = await res.json();
      setCaseStatus({ status: data.status, tier: data.tier, expires_at: data.expires_at, name: data.name });
      if (data.form_data && Object.keys(data.form_data).length > 0) {
        setForm({ ...EMPTY_FORM, ...data.form_data });
      }
    } catch {
      router.push("/souzoku-touki");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push(`/auth/login?redirect=/souzoku-touki/case/${id}`); return; }
    loadCase();
  }, [user, authLoading, id, loadCase, router]);

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      setPaymentMsg("✅ ご購入ありがとうございます！書類の生成が可能になりました。");
      loadCase();
    } else if (payment === "cancelled") {
      setPaymentMsg("購入がキャンセルされました。");
    }
  }, [searchParams, loadCase]);

  // Autosave every 30s
  useEffect(() => {
    const interval = setInterval(() => { if (caseStatus.status !== "loading") save(true); }, 30000);
    return () => clearInterval(interval);
  });

  // Recalculate tax when properties change
  useEffect(() => {
    const total = form.properties.reduce((s, p) => s + (parseInt(String(p.assessed_value)) || 0), 0);
    const tax = calcTax(total);
    setForm((f) => ({ ...f, assessed_total: total, tax_total: tax }));
  }, [form.properties]);

  const save = async (silent = false) => {
    if (!silent) setSaving(true);
    try {
      await fetch(`${API_SOUZOKU}/cases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ form_data: form }),
      });
      if (!silent) { setSaveMsg("保存しました"); setTimeout(() => setSaveMsg(""), 3000); }
    } catch {
      if (!silent) setSaveMsg("保存に失敗しました");
    } finally {
      if (!silent) setSaving(false);
    }
  };

  const handleBuyPlan = async (tier: string) => {
    try {
      await save(true);
      const res = await fetch(`${API_SOUZOKU}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ case_id: parseInt(id), tier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      window.location.href = data.checkout_url;
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "エラーが発生しました");
    }
  };

  const setDec = (key: keyof FormData["deceased"], val: string) =>
    setForm((f) => ({ ...f, deceased: { ...f.deceased, [key]: val } }));
  const setAppl = (key: keyof FormData["applicant"], val: string) =>
    setForm((f) => ({ ...f, applicant: { ...f.applicant, [key]: val } }));
  const setProp = (i: number, key: keyof Prop, val: string) =>
    setForm((f) => { const ps = [...f.properties]; ps[i] = { ...ps[i], [key]: val as never }; return { ...f, properties: ps }; });
  const addProp = () => setForm((f) => ({ ...f, properties: [...f.properties, { type: "land", location: "", chiban: "", chime: "宅地", structure: "", area: "", assessed_value: "" }] }));
  const removeProp = (i: number) => setForm((f) => ({ ...f, properties: f.properties.filter((_, idx) => idx !== i) }));
  const setHeir = (i: number, key: keyof Heir, val: string | boolean) =>
    setForm((f) => { const hs = [...f.heirs]; hs[i] = { ...hs[i], [key]: val as never }; return { ...f, heirs: hs }; });
  const addHeir = () => setForm((f) => ({ ...f, heirs: [...f.heirs, { name: "", name_kana: "", relation: "長男", address: "", share: "", is_applicant: false }] }));
  const removeHeir = (i: number) => setForm((f) => ({ ...f, heirs: f.heirs.filter((_, idx) => idx !== i) }));

  const isPaid = caseStatus.status === "paid";
  const isExpired = isPaid && caseStatus.expires_at ? new Date(caseStatus.expires_at) < new Date() : false;
  const canGenerate = isPaid && !isExpired;
  const tier = caseStatus.tier;

  const fi = (label: string, value: string, onChange: (v: string) => void, opts?: { type?: string; placeholder?: string; required?: boolean }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        type={opts?.type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={opts?.placeholder}
        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ai text-sm"
      />
    </div>
  );

  const sel = (label: string, value: string, onChange: (v: string) => void, options: string[]) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ai text-sm"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 text-sm">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-kon to-ai text-white py-8">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-sm text-white/70 mb-1">
            <Link href="/souzoku-touki" className="hover:text-white">相続登記DIYガイド</Link> &rsaquo; 書類作成
          </p>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-xl font-bold">{caseStatus.name || "書類作成フォーム"}</h1>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${isPaid ? "bg-green-500/30 text-green-100" : "bg-white/20 text-white/80"}`}>
              {isPaid ? `${tier?.toUpperCase()} 購入済` : "未購入"}
            </span>
          </div>
        </div>
      </div>

      {paymentMsg && (
        <div className={`text-center py-2 text-sm font-medium ${paymentMsg.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {paymentMsg}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Section tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-1 overflow-x-auto">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`flex-1 min-w-0 py-2 px-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                section === s ? "bg-ai text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
          {/* ── 申請先 ── */}
          {section === "申請先" && (
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">申請先・申請日</h2>
              {fi("管轄法務局", form.houmukyoku, (v) => setForm((f) => ({ ...f, houmukyoku: v })), { placeholder: "例：東京法務局新宿出張所" })}
              {fi("申請日", form.application_date, (v) => setForm((f) => ({ ...f, application_date: v })), { type: "date" })}
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300 mt-2">
                💡 管轄法務局は <Link href="/souzoku-touki/houmukyoku" className="underline" target="_blank">法務局検索</Link> で確認できます。
              </div>
            </div>
          )}

          {/* ── 被相続人 ── */}
          {section === "被相続人" && (
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">被相続人情報</h2>
              {fi("氏名", form.deceased.name, (v) => setDec("name", v), { placeholder: "山田太郎" })}
              {fi("氏名（フリガナ）", form.deceased.name_kana, (v) => setDec("name_kana", v), { placeholder: "ヤマダタロウ" })}
              {fi("生年月日", form.deceased.birth_date, (v) => setDec("birth_date", v), { type: "date" })}
              {fi("死亡日", form.deceased.death_date, (v) => setDec("death_date", v), { type: "date" })}
              {fi("最後の住所", form.deceased.address, (v) => setDec("address", v), { placeholder: "東京都渋谷区..." })}
              {fi("本籍地", form.deceased.family_register_address, (v) => setDec("family_register_address", v), { placeholder: "東京都渋谷区..." })}
            </div>
          )}

          {/* ── 不動産 ── */}
          {section === "不動産" && (
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">不動産情報</h2>
              {form.properties.map((prop, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">不動産 {i + 1}</span>
                    {form.properties.length > 1 && (
                      <button onClick={() => removeProp(i)} className="text-xs text-red-500 hover:text-red-700">削除</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {(["land", "building"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setProp(i, "type", t)}
                        className={`py-2 rounded-lg text-xs font-medium transition-all ${prop.type === t ? "bg-ai text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
                      >
                        {t === "land" ? "土地" : "建物"}
                      </button>
                    ))}
                  </div>
                  {fi("所在", prop.location, (v) => setProp(i, "location", v), { placeholder: prop.type === "land" ? "東京都渋谷区恵比寿一丁目" : "東京都渋谷区恵比寿一丁目1番地" })}
                  {fi(prop.type === "land" ? "地番" : "家屋番号", prop.chiban, (v) => setProp(i, "chiban", v), { placeholder: prop.type === "land" ? "123番4" : "123番4の5" })}
                  {sel(prop.type === "land" ? "地目" : "種類", prop.chime, (v) => setProp(i, "chime", v), prop.type === "land" ? CHIME_LAND : CHIME_BUILDING)}
                  {prop.type === "building" && fi("構造", prop.structure, (v) => setProp(i, "structure", v), { placeholder: "木造かわらぶき2階建" })}
                  {fi(prop.type === "land" ? "地積（㎡）" : "床面積（㎡）", prop.area, (v) => setProp(i, "area", v), { placeholder: "123.45" })}
                  {fi("固定資産評価額（円）", prop.assessed_value, (v) => setProp(i, "assessed_value", v), { type: "number", placeholder: "5000000" })}
                </div>
              ))}
              <button
                onClick={addProp}
                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 transition-colors"
              >
                + 不動産を追加
              </button>
              {form.assessed_total > 0 && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">課税価格合計</span><span className="font-medium">¥{form.assessed_total.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">登録免許税</span><span className="font-bold text-ai">{form.tax_total === 0 ? "免税（100万円以下）" : `¥${form.tax_total.toLocaleString()}`}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── 相続人 ── */}
          {section === "相続人" && (
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">相続人情報</h2>
              {form.heirs.map((heir, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">相続人 {i + 1}</span>
                    {form.heirs.length > 1 && (
                      <button onClick={() => removeHeir(i)} className="text-xs text-red-500 hover:text-red-700">削除</button>
                    )}
                  </div>
                  {fi("氏名", heir.name, (v) => setHeir(i, "name", v), { placeholder: "山田花子" })}
                  {fi("氏名（フリガナ）", heir.name_kana, (v) => setHeir(i, "name_kana", v), { placeholder: "ヤマダハナコ" })}
                  {sel("続柄", heir.relation, (v) => setHeir(i, "relation", v), RELATIONS)}
                  {fi("住所", heir.address, (v) => setHeir(i, "address", v), { placeholder: "東京都新宿区..." })}
                  {fi("持分", heir.share, (v) => setHeir(i, "share", v), { placeholder: "例：1/2" })}
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={heir.is_applicant} onChange={(e) => setHeir(i, "is_applicant", e.target.checked)} className="rounded" />
                    申請人（不動産を取得する相続人）
                  </label>
                </div>
              ))}
              <button
                onClick={addHeir}
                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                + 相続人を追加
              </button>
              {fi("遺産分割協議日", form.agreement_date, (v) => setForm((f) => ({ ...f, agreement_date: v })), { type: "date" })}
            </div>
          )}

          {/* ── 確認 ── */}
          {section === "確認" && (
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">入力内容の確認</h2>
              <div className="space-y-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="font-medium mb-2 text-gray-700 dark:text-gray-300">申請先</div>
                  <div className="text-gray-600 dark:text-gray-400">{form.houmukyoku || "未入力"}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="font-medium mb-2 text-gray-700 dark:text-gray-300">被相続人</div>
                  <div className="text-gray-600 dark:text-gray-400">{form.deceased.name || "未入力"}</div>
                  <div className="text-gray-500 text-xs mt-1">死亡日: {form.deceased.death_date || "未入力"}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="font-medium mb-2 text-gray-700 dark:text-gray-300">不動産 ({form.properties.length}件)</div>
                  {form.properties.map((p, i) => (
                    <div key={i} className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                      {i + 1}. {p.type === "land" ? "土地" : "建物"} {p.location} {p.chiban}
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="font-medium mb-2 text-gray-700 dark:text-gray-300">相続人 ({form.heirs.length}名)</div>
                  {form.heirs.map((h, i) => (
                    <div key={i} className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                      {h.name || "未入力"}（{h.relation}）{h.is_applicant ? " ★申請人" : ""}
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="font-medium mb-2 text-gray-700 dark:text-gray-300">課税価格・登録免許税</div>
                  <div className="text-gray-600 dark:text-gray-400">課税価格: ¥{form.assessed_total.toLocaleString()}</div>
                  <div className="text-gray-600 dark:text-gray-400">登録免許税: {form.tax_total === 0 ? "免税" : `¥${form.tax_total.toLocaleString()}`}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save bar */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-gray-400">{saveMsg || "30秒ごとに自動保存されます"}</span>
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="text-sm px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "保存中..." : "今すぐ保存"}
          </button>
        </div>

        {/* Generate / Buy section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">📄 書類を生成</h3>
          {canGenerate ? (
            <div className="space-y-3">
              {[
                { type: "shinseisho", label: "登記申請書 PDF", available: true, icon: "📋" },
                { type: "kyogisho", label: "遺産分割協議書 PDF", available: tier !== "basic", icon: "🤝" },
                { type: "setsumeizu", label: "相続関係説明図 PDF", available: tier !== "basic", icon: "🌳" },
              ].map((doc) => (
                <a
                  key={doc.type}
                  href={doc.available ? `#` : undefined}
                  onClick={async (e) => {
                    if (!doc.available) return;
                    e.preventDefault();
                    await save(true);
                    const token2 = localStorage.getItem("session_token") || "";
                    const res = await fetch(`${API_SOUZOKU}/cases/${id}/generate`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token2}` },
                      body: JSON.stringify({ form_type: doc.type }),
                    });
                    if (!res.ok) { alert("生成に失敗しました"); return; }
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${doc.label}_${id}.pdf`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    doc.available
                      ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 hover:shadow-md cursor-pointer"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span className="text-2xl">{doc.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900 dark:text-white">{doc.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {doc.available ? "クリックしてダウンロード" : "Standard以上のプランが必要です"}
                    </div>
                  </div>
                  {doc.available && <span className="text-green-600 dark:text-green-400 font-bold text-sm">↓</span>}
                </a>
              ))}
              {caseStatus.expires_at && (
                <p className="text-xs text-gray-400 mt-2">
                  アクセス期限: {new Date(caseStatus.expires_at).toLocaleDateString("ja-JP")}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                書類生成にはプランの購入が必要です。入力データは保存済みです。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { tier: "basic", label: "Basic", price: "¥1,980", note: "登記申請書のみ" },
                  { tier: "standard", label: "Standard", price: "¥3,980", note: "全3書類 90日間" },
                  { tier: "premium", label: "Premium", price: "¥7,980", note: "全3書類 1年間" },
                ].map((p) => (
                  <button
                    key={p.tier}
                    onClick={() => handleBuyPlan(p.tier)}
                    className="border-2 border-ai rounded-xl p-3 text-center hover:bg-ai hover:text-white transition-all group"
                  >
                    <div className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-white">{p.label}</div>
                    <div className="text-ai font-bold group-hover:text-white">{p.price}</div>
                    <div className="text-xs text-gray-500 group-hover:text-white/80">{p.note}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-3">
                ⚠️ 本ツールは書類作成補助です。法律相談・代理申請は行いません。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
