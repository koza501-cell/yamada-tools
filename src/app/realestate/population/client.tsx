"use client";
import AddressInput from "@/components/common/AddressInput";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";

import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api-backend";

interface TrendPoint {
  year: number;
  population: number;
  population_formatted: string;
  change_from_2020: number | null;
}

interface PopResult {
  address: string;
  lat: number;
  lng: number;
  trend_direction: string;
  trend_label: string;
  population_trend: TrendPoint[];
  summary: {
    base_year: number;
    base_population: number | null;
    base_formatted: string | null;
    pop_2050: number | null;
    pop_2050_formatted: string | null;
    change_to_2050_pct: number | null;
  };
  did: {
    in_did: boolean;
    info: {
      city: string;
      population: number;
      area_km2: number;
      density: number;
      year: number;
    } | null;
  };
}

const TREND_STYLE = {
  declining:     { bg: "bg-gray-50",    border: "border-gray-200",   text: "text-danger",   icon: "📉", badge: "bg-danger text-white" },
  slight_decline:{ bg: "bg-gray-50",  border: "border-gray-200", text: "text-kon", icon: "📊", badge: "bg-kon text-white" },
  stable:        { bg: "bg-gray-50",   border: "border-kon",  text: "text-kon",  icon: "➡️", badge: "bg-kon text-white" },
  growing:       { bg: "bg-green-50",  border: "border-green-300", text: "text-green-700", icon: "📈", badge: "bg-green-600 text-white" },
  unknown:       { bg: "bg-gray-50",   border: "border-gray-200",  text: "text-gray-600",  icon: "❓", badge: "bg-gray-400 text-white" },
};


const faqItems = [
  { question: "人口推計データとは何ですか？", answer: "国土交通省が提供する500mメッシュ単位の将来推計人口データです。2020年から2070年まで5年ごとの人口推計が含まれ、不動産・まちづくり・事業立地の参考として活用できます。" },
  { question: "人口集中地区（DID）とは何ですか？", answer: "人口密度が1km²あたり4,000人以上の地区が隣接し、合計人口が5,000人以上となる地区のことです。都市的な土地利用がなされているエリアの目安となります。" },
  { question: "データはどの単位で表示されますか？", answer: "500m×500mのメッシュ（約0.25km²）単位のデータです。住所が含まれるメッシュの推計人口を表示しています。" },
  { question: "人口が減少していると不動産価値は下がりますか？", answer: "一般的に人口減少エリアでは不動産需要が低下する傾向がありますが、立地条件や交通利便性など個別の条件によって異なります。参考情報としてご活用ください。" },
  { question: "このツールのデータはどこから来ていますか？", answer: "国土交通省「不動産情報ライブラリ API（XKT013・XKT031）」の将来推計人口・人口集中地区データを使用しています。参考情報としてご活用ください。" },
  { question: "無料で使えますか？", answer: "はい、山田ツール（yamada-tools.jp）の人口推計チェッカーは完全無料・登録不要でご利用いただけます。不動産投資・移住・事業立地の検討にお役立てください。" },
];

export default function PopulationClient() {
  const tool = getToolById("population");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PopResult | null>(null);
  const [error, setError] = useState("");

  const printedAt = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

  async function handleSearch() {
    if (!address.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/population/check?address=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (!res.ok) setError(data.detail || "エラーが発生しました。");
      else setResult(data);
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  const trendStyle = result ? (TREND_STYLE[result.trend_direction as keyof typeof TREND_STYLE] ?? TREND_STYLE.unknown) : null;

  const maxPop = result ? Math.max(...result.population_trend.map(t => t.population)) : 1;



  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #pop-print-area, #pop-print-area * { visibility: visible; }
          #pop-print-area { position: fixed; top: 0; left: 0; width: 100%; }
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
          <span>人口推計チェック</span>
        </nav>

        <div className="mb-6 print:hidden">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">👥 人口推計チェッカー</h1>
          <p className="text-gray-600">住所を入力するだけで、2050年までの人口変化を確認できます。不動産購入・移住・事業立地の参考にどうぞ。</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm print:hidden">
          <label className="block text-sm font-medium text-gray-700 mb-2">調べたい住所を入力</label>
          <AddressInput
            value={address}
            onChange={setAddress}
            onSearch={handleSearch}
            loading={loading}
            placeholder="例: 東京都千代田区丸の内1-1-1"
            buttonIcon="👥"
            buttonLabel="人口推計を調べる"
          />
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
            <span>✅ 国土交通省データ</span>
            <span>✅ 2020〜2070年推計</span>
            <span>✅ 完全無料・登録不要</span>
          </div>
        </div>

        {error && (
          <div className={`rounded-xl p-4 mb-6 text-sm ${error.includes("見つかりませんでした") ? "bg-gray-50 border border-gray-200 text-kon" : "bg-gray-50 border border-gray-200 text-danger"}`}>
            {error.includes("見つかりませんでした") ? "📭 " : "⚠️ "}{error}
          </div>
        )}

        {result && trendStyle && (
          <div id="pop-print-area">
            <div className="print-header hidden items-center justify-between px-4 py-3 border-b border-gray-200 mb-3">
              <div>
                <p className="text-lg font-bold text-kon">山田ツール</p>
                <p className="text-xs text-gray-500">yamada-tools.jp — 人口推計チェッカー</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">調査日: {printedAt}</p>
              </div>
            </div>

            <div className="bg-kon text-white rounded-xl p-4 mb-4">
              <p className="text-xs opacity-75 mb-1">📍 {result.address}</p>
              <p className="text-sm opacity-90">500mメッシュ単位の将来推計人口</p>
            </div>

            <div className="space-y-4">
              <div className={`rounded-xl p-5 border ${trendStyle.bg} ${trendStyle.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{trendStyle.icon}</span>
                    <span className={`font-bold text-lg ${trendStyle.text}`}>{result.trend_label}</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${trendStyle.badge}`}>
                    {result.trend_direction === "declining" ? "要注意" :
                     result.trend_direction === "slight_decline" ? "注意" :
                     result.trend_direction === "growing" ? "成長" : "安定"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">2020年 人口（推計）</p>
                    <p className={`text-xl font-bold ${trendStyle.text}`}>{result.summary.base_formatted ?? "-"}</p>
                  </div>
                  {result.summary.pop_2050_formatted && (
                    <div>
                      <p className="text-gray-500 text-xs mb-1">2050年 推計人口</p>
                      <p className={`text-xl font-bold ${trendStyle.text}`}>{result.summary.pop_2050_formatted}</p>
                      {result.summary.change_to_2050_pct !== null && (
                        <p className="text-xs text-gray-500">
                          ({result.summary.change_to_2050_pct > 0 ? "+" : ""}{result.summary.change_to_2050_pct}%)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm">📊 人口推移グラフ（500mメッシュ）</h3>
                <div className="space-y-2">
                  {result.population_trend.map((point) => {
                    const barWidth = maxPop > 0 ? Math.round((point.population / maxPop) * 100) : 0;
                    const isBase = point.year === 2020;
                    const change = point.change_from_2020;
                    const barColor = change === null ? "bg-kon" :
                                     change >= 0 ? "bg-green-500" : "bg-danger";
                    return (
                      <div key={point.year} className="flex items-center gap-2">
                        <span className={`text-xs w-10 text-right font-medium ${isBase ? "text-kon" : "text-gray-500"}`}>
                          {point.year}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${barColor}`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className="text-xs w-20 text-right text-gray-700 font-medium">
                          {point.population_formatted}
                        </span>
                        {change !== null && point.year !== 2020 && (
                          <span className={`text-xs w-14 text-right ${change >= 0 ? "text-green-600" : "text-danger"}`}>
                            {change > 0 ? "+" : ""}{change}%
                          </span>
                        )}
                        {point.year === 2020 && (
                          <span className="text-xs w-14 text-right text-kon">基準年</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-3">※ 500m×500mメッシュ単位の推計値です</p>
              </div>

              <div className={`rounded-xl p-4 border ${result.did.in_did ? "bg-gray-50 border-gray-200" : "bg-gray-50 border-gray-200"}`}>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">🏙 人口集中地区（DID）</h3>
                {result.did.in_did && result.did.info ? (
                  <div className="text-sm space-y-1">
                    <p className="text-kon font-medium">✅ 人口集中地区に含まれています</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                      {result.did.info.city && <div><span className="text-gray-400">地区:</span> {result.did.info.city}</div>}
                      {result.did.info.density && <div><span className="text-gray-400">人口密度:</span> {result.did.info.density.toLocaleString()}人/km²</div>}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">人口集中地区（DID）には含まれていません。</p>
                )}
                <p className="text-xs text-gray-400 mt-2">DID: 人口密度4,000人/km²以上が隣接し合計5,000人以上の地区</p>
              </div>

              <div className="print:hidden">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-xs text-gray-500 leading-relaxed">
                  このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。
                </div>
                <p className="text-xs text-gray-400 mb-3">※ 500mメッシュ単位の推計値です。実際の人口と異なる場合があります。</p>
                <div className="flex flex-wrap gap-2">
                  <a href={`https://www.google.com/maps?q=${result.lat},${result.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors">
                    🗺 Googleマップで確認
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
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} 山田ツール — https://yamada-tools.jp/realestate/population</p>
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
