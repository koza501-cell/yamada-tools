"use client";

import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

type Certification = {
  date_of_approval?: string;
  title?: string;
  target?: string;
  category?: string;
  enterprise_scale?: string;
  expiration_date?: string;
  government_departments?: string;
};

type HojinInfo = { corporate_number?: string; name?: string; name_en?: string; certification?: Certification[]; };
type CertificationResponse = { "hojin-infos"?: HojinInfo[]; };

const faqItems = [
  { question: "認定情報ツールで何が確認できますか？",
    answer: "経済産業省gBizINFOに登録されている国の認定・認証・承認の取得状況が確認できます。認定名・取得日・有効期限・認定機関などの情報が含まれます。yamada-tools.jpの法人検索ツールで法人番号を調べてからご利用ください。" },
  { question: "どのような認定・認証が含まれますか？",
    answer: "中小企業優良法人認定、ISO認証、くるみん・えるぼし認定、事業継続力強化計画認定、IT導入補助金認定事業者など、国が関与する各種認定が含まれます。" },
  { question: "有効期限が切れた認定も表示されますか？",
    answer: "gBizINFOに登録されているデータがすべて表示されます。有効期限が記録されている認定については期限が確認できます。" },
  { question: "法人番号はどこで調べられますか？",
    answer: "yamada-tools.jpの法人検索ツール（/business/houjin-search）に会社名を入力すると法人番号が確認できます。" },
  { question: "認定が0件と表示される会社があるのはなぜですか？",
    answer: "gBizINFOへの登録がない、または現時点で認定を取得していない場合は0件と表示されます。" },
  { question: "このツールは無料で使えますか？",
    answer: "はい、完全無料・登録不要でご利用いただけます。yamada-tools.jpでは法人財務情報・入札情報・補助金検索など企業調査ツールを一括提供しています。" },
];

const CATEGORY_COLORS: Record<string, string> = {
  認定: "bg-green-100 text-green-800",
  認証: "bg-gray-50 text-kon",
  承認: "bg-gray-50 text-kon",
};

function categoryBadge(cat?: string) {
  const label = cat ?? "その他";
  const cls = CATEGORY_COLORS[label] ?? "bg-gray-100 text-gray-700";
  return <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>;
}

export default function HoujinNinteiClient() {
  const [corpNum, setCorpNum] = useState("");
  const [data, setData] = useState<CertificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    const num = corpNum.replace(/\s|-/g, "");
    if (!/^\d{13}$/.test(num)) { setError("法人番号は13桁の数字で入力してください"); return; }
    setError(""); setLoading(true); setData(null);
    try {
      const res = await fetch(`${API_BASE}/api/gbiz/certification/${num}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) { setError("データ取得に失敗しました。しばらく経ってから再試行してください。"); }
    finally { setLoading(false); }
  }

  function handleKeyDown(e: React.KeyboardEvent) { if (e.key === "Enter") handleSearch(); }

  const hojin = data?.["hojin-infos"]?.[0];
  const certifications = hojin?.certification ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">法人認定情報ツール</h1>
        <p className="text-sm text-gray-600">13桁の法人番号から国の認定・認証・承認の取得状況を確認。経済産業省gBizINFO公式データ。</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <label className="block text-sm font-medium text-gray-700">法人番号（13桁）</label>
        <div className="flex gap-2">
          <input type="text" value={corpNum} onChange={(e) => setCorpNum(e.target.value)} onKeyDown={handleKeyDown} placeholder="例: 1180301018771" maxLength={13} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
          <button type="button" onClick={handleSearch} disabled={loading} className="bg-kon hover:bg-ai text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50 transition-colors">
            {loading ? "検索中…" : "検索"}
          </button>
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
      </div>
      {hojin && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-900">{hojin.name ?? "—"}</h2>
            {hojin.name_en && <p className="text-sm text-gray-500">{hojin.name_en}</p>}
            <div className="mt-2 text-sm text-gray-600">法人番号: <span className="font-mono">{hojin.corporate_number ?? "—"}</span></div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-kon">{certifications.length}</p>
            <p className="text-sm text-kon mt-1">認定・認証件数</p>
          </div>
          {certifications.length > 0 ? (
            <div className="space-y-3">
              {certifications.map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {categoryBadge(c.category)}
                        {c.enterprise_scale && <span className="text-xs text-gray-500">{c.enterprise_scale}</span>}
                      </div>
                      <p className="font-medium text-gray-900 text-sm">{c.title ?? "—"}</p>
                      {c.target && <p className="text-xs text-gray-500 mt-0.5">対象: {c.target}</p>}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                    {c.date_of_approval && <span>認定日: {c.date_of_approval}</span>}
                    {c.expiration_date && <span>有効期限: {c.expiration_date}</span>}
                    {c.government_departments && <span>認定機関: {c.government_departments}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">認定・認証情報が登録されていません。</div>
          )}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
            <p className="font-medium text-gray-700 mb-2">関連ツール（yamada-tools.jp）</p>
            <ul className="space-y-1 text-kon">
              <li><a href="/business/houjin-search" className="hover:underline">→ 法人検索ツール（会社名から法人番号を調べる）</a></li>
              <li><a href="/business/houjin-zaimu" className="hover:underline">→ 法人財務情報ツール（売上高・利益・株主）</a></li>
              <li><a href="/business/houjin-nyusatsu" className="hover:underline">→ 入札・調達情報ツール（政府調達履歴）</a></li>
              <li><a href="/business/hojokin-active" className="hover:underline">→ 補助金検索ツール</a></li>
            </ul>
          </div>
        </div>
      )}
      {data && !hojin && <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-danger">該当する法人が見つかりませんでした。</div>}
      <div className="print:hidden"><FAQSection faq={faqItems} /></div>
    </div>
  );
}
