"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const API_PAYMENT = "https://api.yamada-tools.jp/api/payment";

type Invoice = {
  id: string;
  number: string;
  amount_paid: number;
  currency: string;
  status: string;
  created: number;
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
  subtotal: number | null;
  tax: number | null;
};

export default function BillingPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (!token) { setLoading(false); return; }
    fetch(API_PAYMENT + "/billing-history", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((d) => setInvoices(d.invoices || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const formatDate = (ts: number) =>
    new Date(ts * 1000).toLocaleDateString("ja-JP", {
      year: "numeric", month: "long", day: "numeric",
    });

  const formatAmount = (amount: number, currency: string) => {
    if (currency === "jpy") return `¥${amount.toLocaleString()}`;
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  };

  const getTaxBreakdown = (inv: Invoice) => {
    if (inv.currency !== "jpy") return null;
    const total = inv.amount_paid;
    const tax = inv.tax ?? Math.round(total - total / 1.1);
    const subtotal = total - tax;
    return { subtotal, tax, total };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-5">請求履歴</h2>
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-500">
          請求履歴がありません
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                <th className="pb-3 font-medium">日付</th>
                <th className="pb-3 font-medium">請求書番号</th>
                <th className="pb-3 font-medium">金額</th>
                <th className="pb-3 font-medium">ステータス</th>
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
                      {inv.invoice_pdf && (
                        <a href={inv.invoice_pdf} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors">
                          請求書PDF
                        </a>
                      )}
                      {inv.hosted_invoice_url && (
                        <a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors">
                          領収書
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
