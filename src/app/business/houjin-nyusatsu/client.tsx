"use client";

import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

type Procurement = {
  date_of_order?: string;
  title?: string;
  amount?: number;
  government_departments?: string;
  joint_signatures?: string;
};

type HojinInfo = { corporate_number?: string; name?: string; name_en?: string; procurement?: Procurement[]; };
type ProcurementResponse = { "hojin-infos"?: HojinInfo[]; };

const faqItems = [
  { question: "入札・調達情報ツールで何がわかりますか？",
    answer: "経済産業省gBizINFOに登録されている政府・自治体からの調達履歴（発注日・案件名・金額・発注機関）が確認できます。取引先の公共事業実績の把握に活用できます。yamada-tools.jpの法人検索ツールで法人番号を調べてからご利用ください。" },
  { question: "法人番号はどこで調べられますか？",
    answer: "yamada-tools.jpの法人検索ツール（/business/houjin-search）に会社名を入力すると法人番号が確認できます。" },
  { question: "調達金額が表示されない案件があるのはなぜですか？",
    answer: "gBizINFOへの情報登録は発注機関によって異なります。金額が非公開または未登録の場合は「—」と表示されます。" },
  { question: "何年分の入札データが見られますか？",
    answer: "gBizINFOに登録されているすべての期間のデータが表示されます。企業によって異なりますが、過去5〜10年分の実績が確認できる場合があります。" },
  { question: "地方自治体への入札実績も含まれますか？",
    answer: "gBizINFOは国の機関を中心としたデータベースです。地方自治体の調達は含まれない場合があります。" },
  { question: "このツールは無料で使えますか？",
    answer: "はい、完全無料・登録不要でご利用いただけます。yamada-tools.jpでは法人財務情報・認定情報・補助金検索など企業調査ツールを一括提供しています。" },
];

function fmtAmt(n: number | undefined): string {
  if (n == null) return "—";
  const v = Number(n) || 0;
  if (v >= 100000000) return `${(v / 100000000).toFixed(1)}億円`;
  if (v >= 10000) return `${(v / 10000).toFixed(0)}万円`;
  return `${v.toLocaleString()}円`;
}

export default function HoujinNyusatsuClient() {
  const [corpNum, setCorpNum] = useState("");
  const [data, setData] = useState<ProcurementResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    const num = corpNum.replace(/\s|-/g, "");
    if (!/^\d{13}$/.test(num)) { setError("法人番号は13桁の数字で入力してください"); return; }
    setError(""); setLoading(true); setData(null);
    try {
      const res = await fetch(`${API_BASE}/api/gbiz/procurement/${num}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) { setError("データ取得に失敗しました。しばらく経ってから再試行してください。"); }
    finally { setLoading(false); }
  }

  function handleKeyDown(e: React.KeyboardEvent) { if (e.key === "Enter") handleSearch(); }

  const hojin = data?.["hojin-infos"]?.[0];
  const procurements = hojin?.procurement ?? [];
  const totalAmt = procurements.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">入札・調達情報ツール</h1>
        <p className="text-sm text-gray-600">13桁の法人番号から政府・自治体への入札・調達実績を確認。経済産業省gBizINFO公式データ。</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <label className="block text-sm font-medium text-gray-700">法人番号（13桁）</label>
        <div className="flex gap-2">
          <input type="text" value={corpNum} onChange={(e) => setCorpNum(e.target.value)} onKeyDown={handleKeyDown} placeholder="例: 1180301018771" maxLength={13} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="button" onClick={handleSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50 transition-colors">
            {loading ? "検索中…" : "検索"}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
      {hojin && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-900">{hojin.name ?? "—"}</h2>
            {hojin.name_en && <p className="text-sm text-gray-500">{hojin.name_en}</p>}
            <div className="mt-2 text-sm text-gray-600">法人番号: <span className="font-mono">{hojin.corporate_number ?? "—"}</span></div>
          </div>
          {procurements.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">{procurements.length.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">調達件数</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-700">{fmtAmt(totalAmt)}</p>
                <p className="text-xs text-green-600 mt-1">調達総額（概算）</p>
              </div>
            </div>
          )}
          {procurements.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">調達履歴（{procurements.length}件）</h3>
              <div className="overflow-x-auto"><table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 text-gray-600 text-xs">
                  <th className="text-left py-2 pr-3 whitespace-nowrap">発注日</th>
                  <th className="text-left py-2 pr-3">案件名</th>
                  <th className="text-right py-2 pr-3 whitespace-nowrap">金額</th>
                  <th className="text-left py-2 whitespace-nowrap">発注機関</th>
                </tr></thead>
                <tbody>{procurements.map((p, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 pr-3 whitespace-nowrap text-gray-500">{p.date_of_order ?? "—"}</td>
                    <td className="py-2 pr-3">{p.title ?? "—"}
                      {p.joint_signatures && <span className="block text-xs text-gray-400">共同: {p.joint_signatures}</span>}
                    </td>
                    <td className="text-right py-2 pr-3 whitespace-nowrap">{fmtAmt(p.amount)}</td>
                    <td className="py-2 text-gray-600 text-xs">{p.government_departments ?? "—"}</td>
                  </tr>
                ))}</tbody>
              </table></div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">入札・調達情報が登録されていません。</div>
          )}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
            <p className="font-medium text-gray-700 mb-2">関連ツール（yamada-tools.jp）</p>
            <ul className="space-y-1 text-blue-700">
              <li><a href="/business/houjin-search" className="hover:underline">→ 法人検索ツール（会社名から法人番号を調べる）</a></li>
              <li><a href="/business/houjin-zaimu" className="hover:underline">→ 法人財務情報ツール（売上高・利益・株主）</a></li>
              <li><a href="/business/houjin-nintei" className="hover:underline">→ 認定情報ツール（認定・認証の取得状況）</a></li>
              <li><a href="/business/hojokin-active" className="hover:underline">→ 補助金検索ツール</a></li>
            </ul>
          </div>
        </div>
      )}
      {data && !hojin && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">該当する法人が見つかりませんでした。</div>}
      <div className="print:hidden"><FAQSection faq={faqItems} /></div>
    </div>
  );
}
