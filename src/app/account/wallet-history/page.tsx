"use client";
import { useEffect, useState } from "react";

const API_PAYMENT = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/payment";

type Tx = { type: string; amount_jpy: number; related_tool: string; created_at: string };

const TYPE_LABEL: Record<string, string> = { topup: "チャージ", bonus: "ボーナス付与", spend: "利用" };

export default function WalletHistoryPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(API_PAYMENT + "/wallet/transactions", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json())
      .then((d) => setTxs(d.transactions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDateStr = (iso: string) =>
    new Date(iso.replace(" ", "T")).toLocaleString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">yamadaチャージ 利用履歴</h2>
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded" />
            ))}
          </div>
        ) : txs.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">利用履歴がありません</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="pb-3 font-medium">日時</th>
                  <th className="pb-3 font-medium">種別</th>
                  <th className="pb-3 font-medium">金額</th>
                  <th className="pb-3 font-medium">用途</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {txs.map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 text-gray-700">{formatDateStr(t.created_at)}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          t.type === "spend" ? "bg-gray-100 text-gray-600" : "bg-green-50 text-green-700"
                        }`}
                      >
                        {TYPE_LABEL[t.type] || t.type}
                      </span>
                    </td>
                    <td className={`py-3 font-semibold ${t.amount_jpy < 0 ? "text-gray-700" : "text-green-700"}`}>
                      {t.amount_jpy < 0 ? "-" : "+"}¥{Math.abs(t.amount_jpy).toLocaleString()}
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{t.related_tool || "—"}</td>
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
