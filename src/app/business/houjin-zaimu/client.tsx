"use client";

import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

type ManagementIndex = {
  period?: string;
  net_sales_summary_of_business_results?: number;
  operating_income_loss_summary_of_business_results?: number;
  net_income_loss_summary_of_business_results?: number;
  total_assets_summary_of_business_results?: number;
};

type MajorShareholder = {
  name_major_shareholders?: string;
  shareholding_ratio?: number;
};

type FinanceData = {
  accounting_standards?: string;
  fiscal_year_cover_page?: string;
  management_index?: ManagementIndex[];
  major_shareholders?: MajorShareholder[];
};

type HojinInfo = {
  corporate_number?: string;
  name?: string;
  name_en?: string;
  location?: string;
  capital_stock?: number;
  employee_number?: number;
  business_summary?: string;
  company_url?: string;
  date_of_establishment?: string;
  finance?: FinanceData;
};

type FinanceResponse = { "hojin-infos"?: HojinInfo[] };

const faqItems = [
  { question: "財務情報ツールはどんな情報が確認できますか？",
    answer: "経済産業省gBizINFOの公式データに基づき、売上高・営業利益・純利益・総資産などの経営指標（複数年分）、主要株主と持株比率が確認できます。yamada-tools.jpの法人検索ツールで法人番号を調べてから本ツールをご利用ください。" },
  { question: "法人番号が13桁でない場合はどうすればいいですか？",
    answer: "国税庁の法人番号は必ず13桁です。法人番号が不明な場合はyamada-tools.jpの法人検索ツールで調べることができます。" },
  { question: "経営指標が表示されない会社があるのはなぜですか？",
    answer: "gBizINFOへの財務情報開示は任意のため、非上場企業や中小企業では情報が登録されていない場合があります。" },
  { question: "データはいつ時点の情報ですか？",
    answer: "gBizINFO公式APIのデータを使用しており、最新の決算情報とは数ヶ月〜1年程度のラグがある場合があります。" },
  { question: "複数社の財務情報を比較できますか？",
    answer: "現在は1社ずつの検索となります。各社の法人番号を控えて順番に検索してください。" },
  { question: "このツールは無料で使えますか？",
    answer: "はい、完全無料・登録不要でご利用いただけます。yamada-tools.jpでは法人検索・補助金検索・入札情報・認定情報など企業調査ツールを一括提供しています。" },
];

function fmt(n: number | undefined, unit = "円"): string {
  if (n == null) return "—";
  const v = Number(n) || 0;
  if (Math.abs(v) >= 100000000) return `${(v / 100000000).toFixed(1)}億${unit}`;
  if (Math.abs(v) >= 10000) return `${(v / 10000).toFixed(0)}万${unit}`;
  return `${v.toLocaleString()}${unit}`;
}

export default function HoujinZaimuClient() {
  const [corpNum, setCorpNum] = useState("");
  const [data, setData] = useState<FinanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    const num = corpNum.replace(/\s|-/g, "");
    if (!/^\d{13}$/.test(num)) { setError("法人番号は13桌の数字で入力してください"); return; }
    setError(""); setLoading(true); setData(null);
    try {
      const res = await fetch(`${API_BASE}/api/gbiz/finance/${num}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: FinanceResponse = await res.json();
      setData(json);
    } catch (e) {
      setError("データ取得に失敗しました。しばらく経ってから再試行してください。");
    } finally { setLoading(false); }
  }

  function handleKeyDown(e: React.KeyboardEvent) { if (e.key === "Enter") handleSearch(); }

  const hojin = data?.["hojin-infos"]?.[0];
  const finance = hojin?.finance;
  const indices = finance?.management_index ?? [];
  const shareholders = finance?.major_shareholders ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">法人財務情報ツール</h1>
        <p className="text-sm text-gray-600">13桌の法人番号から売上高・利益・株主などの財務情報を確認。経済産業省gBizINFO公式データ。</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <label className="block text-sm font-medium text-gray-700">法人番号（13桌）</label>
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
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div><span className="text-gray-500">法人番号</span><span className="ml-2 font-mono">{hojin.corporate_number ?? "—"}</span></div>
              <div><span className="text-gray-500">設立</span><span className="ml-2">{hojin.date_of_establishment ?? "—"}</span></div>
              <div><span className="text-gray-500">資本金</span><span className="ml-2">{fmt(hojin.capital_stock)}</span></div>
              <div><span className="text-gray-500">従業員数</span><span className="ml-2">{hojin.employee_number != null ? `${Number(hojin.employee_number).toLocaleString()}人` : "—"}</span></div>
              {hojin.location && <div className="col-span-2"><span className="text-gray-500">所在地</span><span className="ml-2">{hojin.location}</span></div>}
              {hojin.business_summary && <div className="col-span-2"><span className="text-gray-500">事業概要</span><span className="ml-2">{hojin.business_summary}</span></div>}
            </div>
            {finance?.accounting_standards && <p className="mt-3 text-xs text-gray-500">会計基準: {finance.accounting_standards}</p>}
          </div>
          {indices.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">経営指標（年次推移）</h3>
              <div className="overflow-x-auto"><table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 text-gray-600 text-xs">
                  <th className="text-left py-2 pr-4 whitespace-nowrap">決算期</th>
                  <th className="text-right py-2 px-2 whitespace-nowrap">売上高</th>
                  <th className="text-right py-2 px-2 whitespace-nowrap">営業利益</th>
                  <th className="text-right py-2 px-2 whitespace-nowrap">純利益</th>
                  <th className="text-right py-2 px-2 whitespace-nowrap">総資産</th>
                </tr></thead>
                <tbody>{indices.map((idx, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 pr-4 whitespace-nowrap">{idx.period ?? "—"}</td>
                    <td className="text-right py-2 px-2 whitespace-nowrap">{fmt(idx.net_sales_summary_of_business_results)}</td>
                    <td className={`text-right py-2 px-2 whitespace-nowrap ${(Number(idx.operating_income_loss_summary_of_business_results)||0)<0?"text-danger":""}`}>
                      {fmt(idx.operating_income_loss_summary_of_business_results)}
                    </td>
                    <td className={`text-right py-2 px-2 whitespace-nowrap ${(Number(idx.net_income_loss_summary_of_business_results)||0)<0?"text-danger":""}`}>
                      {fmt(idx.net_income_loss_summary_of_business_results)}
                    </td>
                    <td className="text-right py-2 px-2 whitespace-nowrap">{fmt(idx.total_assets_summary_of_business_results)}</td>
                  </tr>
                ))}</tbody>
              </table></div>
            </div>
          )}
          {shareholders.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">主要株主</h3>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 text-xs text-gray-600"><th className="text-left py-2 pr-4">株主名</th><th className="text-right py-2">持株比率</th></tr></thead>
                <tbody>{shareholders.map((s, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 pr-4">{s.name_major_shareholders ?? "—"}</td>
                    <td className="text-right py-2">{s.shareholding_ratio != null ? `${s.shareholding_ratio}%` : "—"}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          {(indices.length === 0 && shareholders.length === 0) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">財務情報が登録されていません。</div>
          )}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
            <p className="font-medium text-gray-700 mb-2">関連ツール（yamada-tools.jp）</p>
            <ul className="space-y-1 text-kon">
              <li><a href="/business/houjin-search" className="hover:underline">→ 法人検索ツール（会社名から法人番号を調べる）</a></li>
              <li><a href="/business/houjin-nyusatsu" className="hover:underline">→ 入札・調達情報ツール</a></li>
              <li><a href="/business/houjin-nintei" className="hover:underline">→ 認定情報ツール</a></li>
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
