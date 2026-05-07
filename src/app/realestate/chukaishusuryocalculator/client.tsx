"use client";
import { useState, useMemo } from "react";

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmtPrice(n: number) { return fmt(n) + "円"; }

const QUICK_TABLE = [1000, 2000, 3000, 4000, 5000, 7000, 10000].map(n => ({
  price: n * 10000,
  fee: Math.round((n * 10000 * 0.03 + 60000) * 1.1),
}));

export default function ChukaiClient() {
  const [txType, setTxType] = useState<"売買" | "賃貸">("売買");
  const [price, setPrice] = useState("30000000");
  const [includeTax, setIncludeTax] = useState(true);
  const [role, setRole] = useState<"買主" | "売主" | "両方">("買主");
  const [rent, setRent] = useState("80000");
  const [tenantRole, setTenantRole] = useState<"借主" | "貸主">("借主");
  const [tenantConsent, setTenantConsent] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const result = useMemo(() => {
    if (txType === "売買") {
      const p = parseFloat(price) || 0;
      const base = p * 0.03 + 60000;
      const tax = base * 0.1;
      const total = base + tax;
      const bothTotal = base * 2 * 1.1;
      let note = "";
      if (p <= 4000000) note = "400万円以下の空き家等特例: 売主一方から最大33万円（税込）まで受領可（2024年改正）";
      return { base, tax, total, bothTotal, note };
    } else {
      const r = parseFloat(rent) || 0;
      let base = 0;
      let note = "";
      if (tenantRole === "借主") {
        base = tenantConsent ? r : r * 0.5;
        note = tenantConsent
          ? "借主の承諾あり: 賃料1ヶ月分+消費税が上限"
          : "借主の承諾なし: 賃料0.5ヶ月分+消費税が上限";
      } else {
        base = r * 0.5;
        note = "貸主側: 賃料0.5ヶ月分+消費税が上限（借主と合計で賃料1ヶ月分）";
      }
      const tax = base * 0.1;
      const total = base + tax;
      return { base, tax, total, bothTotal: r * 1.1, note };
    }
  }, [txType, price, includeTax, role, rent, tenantRole, tenantConsent]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/realestate" className="hover:underline">不動産</a>
        <span className="mx-1">&gt;</span>
        <span>仲介手数料計算機</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🏠 不動産 仲介手数料計算機</h1>
        <p className="text-gray-600 text-sm">売買・賃貸の仲介手数料の法定上限を自動計算。2024年改正（400万円以下特例）対応。早見表付き。</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">取引種別</label>
          <div className="flex gap-3">
            {(["売買", "賃貸"] as const).map(t => (
              <button key={t} onClick={() => setTxType(t)}
                className={"px-6 py-2 rounded-lg border text-sm font-medium transition-colors " + (txType === t ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:border-blue-400")}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {txType === "売買" ? (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-1">物件価格（円）</label>
              <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={price} onChange={e => setPrice(e.target.value)} placeholder="30000000" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeTax} onChange={e => setIncludeTax(e.target.checked)} className="w-4 h-4 accent-blue-600" />
              <span className="text-sm text-gray-700">消費税込みで表示</span>
            </label>
            <div>
              <label className="block text-sm text-gray-600 mb-1">自分の立場</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={role} onChange={e => setRole(e.target.value as "買主" | "売主" | "両方")}>
                <option value="買主">買主</option>
                <option value="売主">売主</option>
                <option value="両方">両方（両手仲介の総額確認）</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-1">月額賃料（円）</label>
              <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={rent} onChange={e => setRent(e.target.value)} placeholder="80000" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">自分の立場</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={tenantRole} onChange={e => setTenantRole(e.target.value as "借主" | "貸主")}>
                <option value="借主">借主（入居者）</option>
                <option value="貸主">貸主（オーナー）</option>
              </select>
            </div>
            {tenantRole === "借主" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={tenantConsent} onChange={e => setTenantConsent(e.target.checked)} className="w-4 h-4 accent-blue-600" />
                <span className="text-sm text-gray-700">賃料1ヶ月分の手数料に承諾した</span>
              </label>
            )}
          </>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="bg-blue-600 text-white p-4">
          <p className="text-sm opacity-80 mb-1">法定上限{txType === "売買" ? "（一方当事者分）" : ""}</p>
          <p className="text-3xl font-bold">{fmtPrice(result.total)}</p>
          {includeTax && <p className="text-blue-200 text-sm mt-1">（消費税 {fmtPrice(result.tax)} 含む）</p>}
        </div>
        <div className="p-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">手数料（税抜）</span>
            <span className="text-sm font-medium">{fmtPrice(result.base)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">消費税（10%）</span>
            <span className="text-sm font-medium">{fmtPrice(result.tax)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">合計（税込）</span>
            <span className="text-sm font-bold text-blue-700">{fmtPrice(result.total)}</span>
          </div>
          {txType === "売買" && role === "両方" && (
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">両手仲介 合計（税込）</span>
              <span className="text-sm font-medium text-orange-600">{fmtPrice(result.bothTotal)}</span>
            </div>
          )}
          {txType === "賃貸" && (
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">借主＋貸主 合計上限</span>
              <span className="text-sm font-medium">{fmtPrice(result.bothTotal)}</span>
            </div>
          )}
        </div>
        {result.note && (
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-3 text-xs text-amber-700">
            ℹ️ {result.note}
          </div>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-green-800 mb-1">💡 この金額は法定の「上限」です</p>
        <p className="text-xs text-green-700">仲介手数料は上限額であり、交渉で減額できる場合があります。複数の不動産会社に見積もりを取り比較しましょう。</p>
      </div>

      {txType === "売買" && (
        <div className="mb-4">
          <button onClick={() => setShowTable(s => !s)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
            <span>📊 主要価格帯の仲介手数料 早見表（税込）</span>
            <span>{showTable ? "▲" : "▼"}</span>
          </button>
          {showTable && (
            <div className="border border-gray-200 border-t-0 rounded-b-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-2 px-4 text-gray-600 font-medium">物件価格</th>
                    <th className="text-right py-2 px-4 text-gray-600 font-medium">上限手数料（税込）</th>
                  </tr>
                </thead>
                <tbody>
                  {QUICK_TABLE.map(row => (
                    <tr key={row.price} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-4">{(row.price / 10000).toLocaleString()}万円</td>
                      <td className="py-2 px-4 text-right font-medium">{fmt(row.fee)}円</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="mb-6">
        <button onClick={() => setShowTips(s => !s)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
          <span>💰 仲介手数料を節約するコツ</span>
          <span>{showTips ? "▲" : "▼"}</span>
        </button>
        {showTips && (
          <div className="border border-gray-200 border-t-0 rounded-b-xl p-4 space-y-3 text-sm text-gray-700">
            <p><strong>複数社に依頼する：</strong>専属専任媒介でなければ複数社に査定依頼し、手数料を比較できます。</p>
            <p><strong>交渉のタイミング：</strong>売買契約前（仲介依頼時）に手数料の合意を取り付けるのが効果的です。契約後では交渉しにくくなります。</p>
            <p><strong>手数料無料業者の注意点：</strong>「手数料無料」は片方から受け取る両手仲介で成立しているケースが多く、必ずしも中立ではありません。</p>
            <p><strong>2024年改正（400万円以下）：</strong>低廉な空き家等は売主一方から最大33万円（税込）まで受領可能になりました。</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mb-8">
        ※ 本ツールは参考値を提供するものです。実際の仲介手数料は不動産会社との契約内容によります。
      </p>

      <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        山田ツール | yamada-tools.jp — 無料計算ツール集
      </div>
    </div>
  );
}
