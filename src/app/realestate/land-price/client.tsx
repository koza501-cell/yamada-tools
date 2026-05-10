"use client";
import AddressInput from "@/components/common/AddressInput";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";

import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api-backend";

interface PriceData {
  current: number | null;
  current_formatted: string | null;
  current_tsubo: string | null;
  last_year: number | null;
  last_year_formatted: string | null;
  last_year_tsubo: string | null;
  change_rate: number;
  change_direction: "up" | "down" | "flat";
}

interface LandPriceResult {
  address: string;
  lat: number;
  lng: number;
  nearest_point: {
    distance_m: number;
    location: string;
    standard_lot_number: string;
    target_year: string;
    land_price_type: string;
  };
  price: PriceData;
  land_use: {
    category: string;
    zone: string;
    surrounding: string;
  };
  access: {
    station: string;
    distance: string;
  };
  area_stats: {
    count: number;
    avg_formatted: string | null;
    avg_tsubo: string | null;
    min_formatted: string | null;
    max_formatted: string | null;
    radius_km: number;
  };
}


const faqItems = [
  { question: "地価公示とは何ですか？", answer: "国土交通省が毎年1月1日時点の土地価格を公示するものです。相続税・固定資産税の算定基準や、不動産売買の参考価格として使われます。全国約26,000地点で調査されています。" },
  { question: "地価公示と実際の売買価格は違いますか？", answer: "地価公示は公的な基準地価であり、実際の売買価格とは異なる場合があります。売買価格は需給や個別条件によって変動します。あくまで参考値としてご利用ください。" },
  { question: "前年比変動率の見方は？", answer: "プラスは地価上昇、マイナスは地価下落を示します。例えば+8.3%なら前年より8.3%土地価格が上がったことを意味します。" },
  { question: "地価データが見つからない場合は？", answer: "地価公示地点は全国に約26,000点あり、すべての住所に近接しているわけではありません。農村部や山間部では地点が少ない場合があります。" },
  { question: "このツールのデータはどこから来ていますか？", answer: "国土交通省「不動産情報ライブラリ API（XPT002）」の地価公示・地価調査データを使用しています。参考情報としてご活用ください。" },
  { question: "無料で使えますか？", answer: "はい、山田ツール（yamada-tools.jp）の地価チェッカーは完全無料・登録不要でご利用いただけます。内見時や購入検討時に手軽に周辺地価を確認できます。" },
];

export default function LandPriceClient() {
  const tool = getToolById("land-price");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LandPriceResult | null>(null);
  const [error, setError] = useState("");

  const printedAt = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

  async function handleSearch() {
    if (!address.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/land-price/check?address=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (!res.ok) setError(data.detail || "エラーが発生しました。");
      else setResult(data);
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  const changeColor = result?.price.change_direction === "up"
    ? "text-red-600"
    : result?.price.change_direction === "down"
    ? "text-blue-600"
    : "text-gray-600";

  const changeIcon = result?.price.change_direction === "up" ? "▲" : result?.price.change_direction === "down" ? "▼" : "━";



  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #landprice-print-area, #landprice-print-area * { visibility: visible; }
          #landprice-print-area { position: fixed; top: 0; left: 0; width: 100%; }
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
          <span>地価チェック</span>
        </nav>

        <div className="mb-6 print:hidden">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">💰 地価チェッカー</h1>
          <p className="text-gray-600">住所を入力するだけで、近隣の地価公示・地価調査データを確認できます。相続・売買・税金計算の参考にどうぞ。</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm print:hidden">
          <label className="block text-sm font-medium text-gray-700 mb-2">調べたい住所を入力</label>
          <AddressInput
            value={address}
            onChange={setAddress}
            onSearch={handleSearch}
            loading={loading}
            placeholder="例: 東京都渋谷区神宮前1-1-1"
            buttonIcon="💰"
            buttonLabel="地価を調べる"
          />
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
            <span>✅ 国土交通省 地価公示データ</span>
            <span>✅ 完全無料・登録不要</span>
            <span>✅ 前年比変動率表示</span>
          </div>
        </div>

        {error && (
          <div className={`rounded-xl p-4 mb-6 text-sm ${error.includes("見つかりませんでした") ? "bg-amber-50 border border-amber-300 text-amber-800" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {error.includes("見つかりませんでした") ? "📭 " : "⚠️ "}{error}
            {error.includes("見つかりませんでした") && (
              <p className="mt-2 text-xs">地価公示地点は全国約26,000点のため、農村部・山間部では近隣に地点がない場合があります。</p>
            )}
          </div>
        )}

        {result && (
          <div id="landprice-print-area">
            <div className="print-header hidden items-center justify-between px-4 py-3 border-b border-gray-200 mb-3">
              <div>
                <p className="text-lg font-bold text-blue-700">山田ツール</p>
                <p className="text-xs text-gray-500">yamada-tools.jp — 地価チェッカー</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">調査日: {printedAt}</p>
              </div>
            </div>

            <div className="bg-blue-600 text-white rounded-xl p-5 mb-4">
              <p className="text-xs opacity-75 mb-1">📍 {result.address}</p>
              <p className="text-sm opacity-80">最寄り地価公示地点: {result.nearest_point.distance_m}m先 ({result.nearest_point.land_price_type})</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{result.nearest_point.target_year}時点 · {result.land_use.category}</p>
                    <p className="text-3xl font-bold text-gray-900">{result.price.current_formatted ?? "データなし"}</p>
                {result.price.current_tsubo && (
                  <p className="text-sm text-gray-500 mt-0.5">({result.price.current_tsubo})</p>
                )}
                  </div>
                  <div className={`text-right ${changeColor}`}>
                    <p className="text-lg font-bold">{changeIcon} {Math.abs(result.price.change_rate)}%</p>
                    <p className="text-xs">前年比</p>
                  </div>
                </div>
                {result.price.last_year_formatted && (
                  <p className="text-sm text-gray-500">前年: {result.price.last_year_formatted}
                    {result.price.last_year_tsubo && <span className="ml-1 text-xs">({result.price.last_year_tsubo})</span>}
                  </p>
                )}
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <p>地点番号: {result.nearest_point.standard_lot_number}</p>
                  <p>所在: {result.nearest_point.location}</p>
                </div>
              </div>

              {result.area_stats.count > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">📊 半径{result.area_stats.radius_km}km以内の{result.land_use.category}地価</h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">平均</p>
                      <p className="font-bold text-gray-900 text-sm">{result.area_stats.avg_formatted ?? "-"}</p>
                      {result.area_stats.avg_tsubo && <p className="text-xs text-gray-400">({result.area_stats.avg_tsubo})</p>}
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">最安値</p>
                      <p className="font-bold text-blue-700 text-sm">{result.area_stats.min_formatted ?? "-"}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">最高値</p>
                      <p className="font-bold text-red-600 text-sm">{result.area_stats.max_formatted ?? "-"}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">※ {result.area_stats.count}地点のデータを集計</p>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">🏗 土地・周辺情報</h3>
                <div className="space-y-2 text-sm">
                  {result.land_use.zone && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-24 shrink-0">用途地域</span>
                      <span className="text-gray-800">{result.land_use.zone}</span>
                    </div>
                  )}
                  {result.access.station && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-24 shrink-0">最寄り駅</span>
                      <span className="text-gray-800">{result.access.station}駅 {result.access.distance}</span>
                    </div>
                  )}
                  {result.land_use.surrounding && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-24 shrink-0">周辺状況</span>
                      <span className="text-gray-700 text-xs leading-relaxed">{result.land_use.surrounding}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="print:hidden">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-xs text-gray-500 leading-relaxed">
                  このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。
                </div>
                <p className="text-xs text-gray-400 mb-3">※ 地価公示は参考値です。実際の売買価格とは異なる場合があります。</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://www.google.com/maps?q=${result.lat},${result.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    🗺 Googleマップで確認
                  </a>
                  <a
                    href="https://www.chikamap.jp/"
                    target="_blank" rel="noopener noreferrer"
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    🔗 全国地価マップ
                  </a>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    🖨 印刷・PDF保存
                  </button>
                </div>
              </div>
            </div>

            <div className="print-footer hidden border-t border-gray-200 px-4 py-3 mt-4">
              <p className="text-xs text-gray-500">このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。</p>
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} 山田ツール — https://yamada-tools.jp/realestate/land-price</p>
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
