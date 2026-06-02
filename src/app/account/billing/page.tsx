"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { PlanStatusCard } from "../_components/PlanStatusCard";

const API_PAYMENT = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/payment";
const API_SOUZOKU = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/souzoku";

type Invoice = {
  id: string; number: string; amount_paid: number; currency: string;
  status: string; created: number; invoice_pdf: string | null;
  hosted_invoice_url: string | null; subtotal: number | null; tax: number | null;
};
type Receipt = {
  id: number; receipt_number: string; issued_at: string;
  amount: number; tax_amount: number; payer_name: string; pass_type: string;
};
type SouzokuCase = {
  id: number; name: string; case_type: string; status: string;
  tier: string | null; expires_at: string | null; created_at: string;
};

const TIER_LABEL: Record<string, string> = { basic: "Basic", standard: "Standard", premium: "Premium" };

export default function BillingPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [souzokuCases, setSouzokuCases] = useState<SouzokuCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [receiptsLoading, setReceiptsLoading] = useState(true);
  const [souzokuLoading, setSouzokuLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [atenaMap, setAtenaMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (!token) { setLoading(false); setReceiptsLoading(false); setSouzokuLoading(false); return; }

    fetch(API_PAYMENT + "/billing-history", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json()).then((d) => setInvoices(d.invoices || [])).catch(() => {}).finally(() => setLoading(false));

    fetch(API_PAYMENT + "/receipts", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json()).then((d) => {
        const list = d.receipts || [];
        setReceipts(list);
        const m: Record<number, string> = {};
        list.forEach((r: Receipt) => { m[r.id] = r.payer_name; });
        setAtenaMap(m);
      }).catch(() => {}).finally(() => setReceiptsLoading(false));

    fetch(API_SOUZOKU + "/cases", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json()).then((d) => setSouzokuCases(d.cases || [])).catch(() => {}).finally(() => setSouzokuLoading(false));
  }, []);

  if (!user) return null;

  const formatDate = (ts: number) => new Date(ts * 1000).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  const formatDateStr = (iso: string) => new Date(iso).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  const formatAmount = (amount: number, currency: string) =>
    currency === "jpy" ? `¥${amount.toLocaleString()}` : `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  const getTaxBreakdown = (inv: Invoice) => {
    if (inv.currency !== "jpy") return null;
    const total = inv.amount_paid;
    const tax = inv.tax ?? Math.round(total - total / 1.1);
    return { subtotal: total - tax, tax, total };
  };

  const handleDownloadReceipt = async (receipt: Receipt) => {
    const token = localStorage.getItem("session_token");
    if (!token) return;
    setDownloadingId(receipt.id);
    try {
      const atena = atenaMap[receipt.id] ?? receipt.payer_name;
      const dlUrl = `${API_PAYMENT}/receipts/${receipt.id}/download${atena ? "?atena=" + encodeURIComponent(atena) : ""}`;
      const res = await fetch(dlUrl, { headers: { Authorization: "Bearer " + token } });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${receipt.receipt_number}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { alert("ダウンロードに失敗しました"); }
    finally { setDownloadingId(null); }
  };

  const paidCases = souzokuCases.filter((c) => c.status === "paid");
  const draftCases = souzokuCases.filter((c) => c.status !== "paid");
  const souzokuReceipts = receipts.filter((r) => r.pass_type.startsWith("souzoku_"));
  const dayPassReceipts = receipts.filter((r) => !r.pass_type.startsWith("souzoku_"));

  return (
    <div className="space-y-6">
      <PlanStatusCard />

      {/* 相続登記 cases */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">相続登記 書類作成ケース</h2>
          <Link href="/souzoku-touki/case/new" className="text-xs px-3 py-1.5 bg-ai text-white rounded-lg hover:bg-ai transition-colors">
            + 新規ケース
          </Link>
        </div>
        {souzokuLoading ? (
          <div className="animate-pulse space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded" />)}</div>
        ) : souzokuCases.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">
            相続登記ケースがありません。
            <Link href="/souzoku-touki/case/new" className="text-ai underline ml-1">新規作成 →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {paidCases.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">購入済み</p>
                {paidCases.map((sc) => {
                  const expired = sc.expires_at ? new Date(sc.expires_at) < new Date() : false;
                  return (
                    <Link key={sc.id} href={`/souzoku-touki/case/${sc.id}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:shadow-md transition-shadow bg-green-50/50">
                      <div>
                        <div className="font-medium text-sm text-gray-900">{sc.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {TIER_LABEL[sc.tier || ""] || sc.tier}プラン
                          {sc.expires_at && ` · ${expired ? "期限切れ" : `${formatDateStr(sc.expires_at)}まで`}`}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${expired ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"}`}>
                        {expired ? "期限切れ" : "利用可能"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
            {draftCases.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">下書き（未購入）</p>
                {draftCases.map((sc) => (
                  <Link key={sc.id} href={`/souzoku-touki/case/${sc.id}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{sc.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">作成日: {formatDateStr(sc.created_at)}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">下書き</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>


      {/* 相続登記DIY purchase history */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">相続登記DIY 購入履歴</h2>
        {receiptsLoading ? (
          <div className="animate-pulse space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded" />)}</div>
        ) : souzokuReceipts.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">相続登記DIYの購入履歴がありません</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="pb-3 font-medium">購入日</th><th className="pb-3 font-medium">領収書番号</th>
                  <th className="pb-3 font-medium">金額</th><th className="pb-3 font-medium">領収書</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {souzokuReceipts.map((r) => {
                  const tax = r.tax_amount; const subtotal = r.amount - tax;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="py-3 text-gray-700">{formatDateStr(r.issued_at)}</td>
                      <td className="py-3 text-gray-500 font-mono text-xs">{r.receipt_number}</td>
                      <td className="py-3">
                        <div className="space-y-0.5 text-xs">
                          <div className="text-gray-500">税抜: ¥{subtotal.toLocaleString()}</div>
                          <div className="text-gray-500">消費税(10%): ¥{tax.toLocaleString()}</div>
                          <div className="font-semibold text-gray-900">合計: ¥{r.amount.toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400 whitespace-nowrap">宛名:</span>
                            <input type="text" value={atenaMap[r.id] ?? r.payer_name}
                              onChange={(e) => setAtenaMap((m) => ({ ...m, [r.id]: e.target.value }))}
                              className="text-xs border border-gray-200 rounded px-1.5 py-0.5 w-32 focus:outline-none focus:border-ai"
                              placeholder="お客様" />
                          </div>
                          <button type="button" onClick={() => handleDownloadReceipt(r)} disabled={downloadingId === r.id}
                            className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50">
                            {downloadingId === r.id ? "処理中..." : "領収書PDF"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Day pass receipts */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">1日パス 購入履歴</h2>
        {receiptsLoading ? (
          <div className="animate-pulse space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded" />)}</div>
        ) : dayPassReceipts.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">1日パスの購入履歴がありません</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="pb-3 font-medium">購入日</th><th className="pb-3 font-medium">領収書番号</th>
                  <th className="pb-3 font-medium">金額</th><th className="pb-3 font-medium">領収書</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dayPassReceipts.map((r) => {
                  const tax = r.tax_amount; const subtotal = r.amount - tax;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="py-3 text-gray-700">{formatDateStr(r.issued_at)}</td>
                      <td className="py-3 text-gray-500 font-mono text-xs">{r.receipt_number}</td>
                      <td className="py-3">
                        <div className="space-y-0.5 text-xs">
                          <div className="text-gray-500">税抜: ¥{subtotal.toLocaleString()}</div>
                          <div className="text-gray-500">消費税(10%): ¥{tax.toLocaleString()}</div>
                          <div className="font-semibold text-gray-900">合計: ¥{r.amount.toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400 whitespace-nowrap">宛名:</span>
                            <input type="text" value={atenaMap[r.id] ?? r.payer_name}
                              onChange={(e) => setAtenaMap((m) => ({ ...m, [r.id]: e.target.value }))}
                              className="text-xs border border-gray-200 rounded px-1.5 py-0.5 w-32 focus:outline-none focus:border-ai"
                              placeholder="お客様" />
                          </div>
                          <button type="button" onClick={() => handleDownloadReceipt(r)} disabled={downloadingId === r.id}
                            className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50">
                            {downloadingId === r.id ? "処理中..." : "領収書PDF"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Subscription invoice history */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">請求履歴（サブスク）</h2>
        {loading ? (
          <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded" />)}</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">請求履歴がありません</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="pb-3 font-medium">日付</th><th className="pb-3 font-medium">請求書番号</th>
                  <th className="pb-3 font-medium">金額</th><th className="pb-3 font-medium">ステータス</th>
                  <th className="pb-3 font-medium">ダウンロード</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="py-3 text-gray-700">{formatDate(inv.created)}</td>
                    <td className="py-3 text-gray-500 font-mono text-xs">{inv.number || "—"}</td>
                    <td className="py-3">
                      {(() => {
                        const tb = getTaxBreakdown(inv);
                        if (!tb) return <span className="font-medium text-gray-900">{formatAmount(inv.amount_paid, inv.currency)}</span>;
                        return (
                          <div className="space-y-0.5 text-xs">
                            <div className="text-gray-500">税抜: ¥{tb.subtotal.toLocaleString()}</div>
                            <div className="text-gray-500">消費税(10%): ¥{tb.tax.toLocaleString()}</div>
                            <div className="font-semibold text-gray-900">合計: ¥{tb.total.toLocaleString()}</div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${inv.status === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                        {inv.status === "paid" ? "支払済" : "未払い"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {inv.invoice_pdf && <a href={inv.invoice_pdf} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors">請求書PDF</a>}
                        {inv.hosted_invoice_url && <a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors">領収書</a>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
