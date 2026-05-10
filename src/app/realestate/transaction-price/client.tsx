"use client";
import AddressInput from "@/components/common/AddressInput";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";

import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api-backend";

interface Transaction {
  period: string;
  land_type: string;
  use_category: string;
  district: string;
  city: string;
  area: string;
  total_price: string | null;
  price_sqm: string | null;
  price_tsubo: string | null;
  land_use: string;
  floor_plan: string;
  construction_year: string;
  structure: string;
  building_area: string;
  land_shape: string;
  coverage_ratio: string;
  floor_area_ratio: string;
}

interface Stats {
  count: number;
  avg_sqm_formatted?: string;
  min_sqm_formatted?: string;
  max_sqm_formatted?: string;
  avg_tsubo_formatted?: string;
  avg_total_formatted?: string;
}

interface TransactionResult {
  address: string;
  lat: number;
  lng: number;
  period: string;
  total_transactions: number;
  most_common_type: string;
  overall_stats: Stats;
  type_stats: Stats;
  recent_transactions: Transaction[];
}


const faqItems = [
  { question: "取引価格情報とは何ですか？", answer: "国土交通省が収集・公表している実際の不動産売買取引価格のデータです。土地・建物・マンションなどの実取引に基づくため、売買価格の参考として活用できます。" },
  { question: "地価公示との違いは？", answer: "地価公示は国が定める基準地価（公示価格）であり、実際の取引価格とは異なる場合があります。取引価格情報は実際に売買された価格のため、より市場実態を反映しています。" },
  { question: "データはどの期間のものですか？", answer: "直近約1.5年分（2024年第1四半期〜2025年第2四半期）の取引データを表示しています。" },
  { question: "取引件数が少ない場合は？", answer: "地方や農村部など取引が少ないエリアではデータが見つからない場合があります。より広い範囲で検索するか、市区町村名のみで検索をお試しください。" },
  { question: "このツールのデータはどこから来ていますか？", answer: "国土交通省「不動産情報ライブラリ API（XPT001）」の不動産取引価格情報を使用しています。参考情報としてご活用ください。" },
  { question: "無料で使えますか？", answer: "はい、山田ツール（yamada-tools.jp）の不動産取引価格チェッカーは完全無料・登録不要でご利用いただけます。購入・売却価格の相場確認にお役立てください。" },
];

export default function TransactionPriceClient() {
  const tool = getToolById("transaction-price");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [error, setError] = useState("");

  const printedAt = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

  async function handleSearch() {
    if (!address.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/transaction-price/check?address=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (!res.ok) setError(data.detail || "エラーが発生しました。");
      else setResult(data);
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }



  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #txprice-print-area, #txprice-print-area * { visibility: visible; }
          #txprice-print-area { position: fixed; top: 0; left: 0; width: 100%; }
          @page { size: A4; margin: 15mm 18mm; }
          .print-header { display: flex !important; }
          .print-footer { display: block !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6 print:hidden">
          <a href="/" className="hover:underline">ホーム</a>
          <span className="mx-1">&gt;</span>
          <a href="/realestate" className="hover:underline">不動産</a>
          <span className="mx-1">&gt;</span>
          <span>不動産取引価格チェック</span>
        </nav>

        <div className="mb-6 print:hidden">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🏠 不動産取引価格チェッカー</h1>
          <p className="text-gray-600">住所を入力するだけで、近隣の実際の売買取引価格を確認できます。土地・マンション・一戸建ての相場把握に。</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm print:hidden">
          <label className="block text-sm font-medium text-gray-700 mb-2">調べたい住所を入力</label>
          <AddressInput
            value={address}
            onChange={setAddress}
            onSearch={handleSearch}
            loading={loading}
            placeholder="例: 東京都千代田区丸の内1-1-1"
            buttonIcon="🏠"
            buttonLabel="取引価格を調べる"
          />
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
            <span>✅ 国土交通省 実取引データ</span>
            <span>✅ 完全無料・登録不要</span>
            <span>✅ ㎡・坪単価表示</span>
          </div>
        </div>

        {error && (
          <div className={`rounded-xl p-4 mb-6 text-sm ${error.includes("見つかりませんでした") ? "bg-gray-50 border border-gray-200 text-kon" : "bg-gray-50 border border-gray-200 text-danger"}`}>
            {error.includes("見つかりませんでした") ? "📭 " : "⚠️ "}{error}
          </div>
        )}

        {result && (
          <div id="txprice-print-area">
            <div className="print-header hidden items-center justify-between px-4 py-3 border-b border-gray-200 mb-3">
              <div>
                <p className="text-lg font-bold text-kon">山田ツール</p>
                <p className="text-xs text-gray-500">yamada-tools.jp — 不動産取引価格チェッカー</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">調査日: {printedAt}</p>
              </div>
            </div>

            <div className="bg-kon text-white rounded-xl p-5 mb-4">
              <p className="text-xs opacity-75 mb-1">📍 {result.address}</p>
              <p className="text-sm opacity-90">対象期間: {result.period}</p>
              <p className="text-sm opacity-80">周辺取引件数: {result.total_transactions}件</p>
            </div>

            <div className="space-y-4">
              {result.overall_stats.count > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">📊 エリア取引価格（全種別・㎡単価）</h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">平均</p>
                      <p className="font-bold text-gray-900 text-sm">{result.overall_stats.avg_sqm_formatted ?? "-"}</p>
                      <p className="text-xs text-gray-400">/㎡</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">最安値</p>
                      <p className="font-bold text-kon text-sm">{result.overall_stats.min_sqm_formatted ?? "-"}</p>
                      <p className="text-xs text-gray-400">/㎡</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">最高値</p>
                      <p className="font-bold text-danger text-sm">{result.overall_stats.max_sqm_formatted ?? "-"}</p>
                      <p className="text-xs text-gray-400">/㎡</p>
                    </div>
                  </div>
                  {result.overall_stats.avg_tsubo_formatted && (
                    <p className="text-xs text-gray-500 mt-2 text-center">坪単価平均: {result.overall_stats.avg_tsubo_formatted}/坪</p>
                  )}
                </div>
              )}

              {result.type_stats.count > 0 && result.most_common_type && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">🏷 {result.most_common_type}の取引相場</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs">㎡単価 平均</span>
                      <p className="font-bold text-gray-900">{result.type_stats.avg_sqm_formatted ?? "-"}</p>
                    </div>
                    {result.type_stats.avg_tsubo_formatted && (
                      <div>
                        <span className="text-gray-500 text-xs">坪単価 平均</span>
                        <p className="font-bold text-gray-900">{result.type_stats.avg_tsubo_formatted}</p>
                      </div>
                    )}
                    {result.type_stats.avg_total_formatted && (
                      <div>
                        <span className="text-gray-500 text-xs">取引総額 平均</span>
                        <p className="font-bold text-gray-900">{result.type_stats.avg_total_formatted}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500 text-xs">サンプル数</span>
                      <p className="font-bold text-gray-900">{result.type_stats.count}件</p>
                    </div>
                  </div>
                </div>
              )}

              {result.recent_transactions.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">📋 近隣の取引事例</h3>
                  <div className="space-y-3">
                    {result.recent_transactions.map((tx, i) => (
                      <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-kon bg-gray-50 px-2 py-0.5 rounded-full">{tx.land_type}</span>
                          <span className="text-xs text-gray-400">{tx.period}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
                          {tx.total_price && (
                            <div><span className="text-gray-500">取引総額</span> <strong className="text-gray-900">{tx.total_price}</strong></div>
                          )}
                          {tx.price_sqm && (
                            <div><span className="text-gray-500">㎡単価</span> <strong className="text-gray-900">{tx.price_sqm}</strong></div>
                          )}
                          {tx.price_tsubo && (
                            <div><span className="text-gray-500">坪単価</span> <strong className="text-gray-900">{tx.price_tsubo}</strong></div>
                          )}
                          {tx.area && (
                            <div><span className="text-gray-500">面積</span> <strong className="text-gray-900">{tx.area}</strong></div>
                          )}
                          {tx.floor_plan && (
                            <div><span className="text-gray-500">間取り</span> <strong className="text-gray-900">{tx.floor_plan}</strong></div>
                          )}
                          {tx.construction_year && (
                            <div><span className="text-gray-500">築年</span> <strong className="text-gray-900">{tx.construction_year}</strong></div>
                          )}
                          {tx.land_use && (
                            <div><span className="text-gray-500">用途地域</span> <strong className="text-gray-900">{tx.land_use}</strong></div>
                          )}
                          {tx.district && (
                            <div><span className="text-gray-500">地区</span> <strong className="text-gray-900">{tx.district}</strong></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">※ 個人情報保護のため、詳細住所は非公開です。</p>
                </div>
              )}

              <div className="print:hidden">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-xs text-gray-500 leading-relaxed">
                  このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。
                </div>
                <p className="text-xs text-gray-400 mb-3">※ 取引価格は実際の売買価格の参考値です。個別の条件によって異なります。</p>
                <div className="flex flex-wrap gap-2">
                  <a href={`https://www.google.com/maps?q=${result.lat},${result.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors">
                    🗺 Googleマップで確認
                  </a>
                  <a href="https://www.reinfolib.mlit.go.jp/" target="_blank" rel="noopener noreferrer"
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors">
                    🔗 不動産情報ライブラリ
                  </a>
                  <button type="button" onClick={() => window.print()}
                    className="text-sm bg-kon hover:bg-ai text-white px-4 py-2 rounded-lg transition-colors font-medium">
                    🖨 印刷・PDF保存
                  </button>
                </div>
              </div>
            </div>

            <div className="print-footer hidden border-t border-gray-200 px-4 py-3 mt-4">
              <p className="text-xs text-gray-500">このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。</p>
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} 山田ツール — https://yamada-tools.jp/realestate/transaction-price</p>
            </div>
          </div>
        )}

        <div className="print:hidden">
          <FAQSection faq={faqItems} />
        </div>

        {tool && <RelatedTools currentTool={tool} maxItems={4} />}
            </div>
    </>
  );
}
