"use client";
import AddressInput from "@/components/common/AddressInput";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";

import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api-backend";

interface RiskItem {
  detected: boolean;
  risk: "high" | "medium" | "low" | "none";
}

interface FloodResult extends RiskItem {
  depth_label: string | null;
  river: string | null;
  desc: string | null;
}

interface LandslideItem {
  level: string;
  risk: string;
  type: string;
  icon: string;
  desc: string;
  area: string;
}

interface LandslideResult extends RiskItem {
  items: LandslideItem[];
}

interface LiquefactionResult extends RiskItem {
  label: string | null;
  desc: string | null;
  terrain: string | null;
}

interface HazardResult {
  address: string;
  lat: number;
  lng: number;
  overall_risk: "high" | "medium" | "low" | "none";
  flood: FloodResult;
  landslide: LandslideResult;
  liquefaction: LiquefactionResult;
  tsunami: RiskItem;
  storm_surge: RiskItem;
}

const RISK_STYLE = {
  high:   { bg: "bg-gray-50",    border: "border-gray-200",    text: "text-danger",    badge: "bg-danger text-white",    label: "高リスク" },
  medium: { bg: "bg-gray-50",   border: "border-gray-200",  text: "text-kon",  badge: "bg-kon text-white",  label: "中リスク" },
  low:    { bg: "bg-green-50",   border: "border-green-300",  text: "text-green-800",  badge: "bg-green-600 text-white",  label: "低リスク" },
  none:   { bg: "bg-gray-50",    border: "border-gray-200",   text: "text-gray-500",   badge: "bg-gray-300 text-gray-700", label: "該当なし" },
};

function RiskBadge({ risk }: { risk: "high" | "medium" | "low" | "none" }) {
  const s = RISK_STYLE[risk];
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>;
}

function HazardCard({ icon, title, result, children }: {
  icon: string;
  title: string;
  result: RiskItem;
  children?: React.ReactNode;
}) {
  const risk = result.risk as keyof typeof RISK_STYLE;
  const s = RISK_STYLE[risk];


  return (
    <div className={`rounded-xl border p-4 ${s.bg} ${s.border}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className={`font-semibold text-sm ${s.text}`}>{title}</span>
        </div>
        <RiskBadge risk={risk} />
      </div>
      {children}
    </div>
  );
}


const faqItems = [
  { question: "ハザードマップとは？", answer: "自然災害（洪水・土砂災害・津波など）が発生した際に被害が想定される区域を示した地図です。不動産購入や賃貸の際に必ず確認すべき情報です。" },
  { question: "液状化とは何ですか？", answer: "地震の振動により地盤が液体のようになる現象です。砂地盤や埋立地で起きやすく、建物の傾きや沈下の原因になります。" },
  { question: "土砂災害警戒区域と特別警戒区域の違いは？", answer: "警戒区域（イエローゾーン）は住民への情報伝達・避難が必要な区域。特別警戒区域（レッドゾーン）はさらに危険で、建築制限があります。" },
  { question: "リスクなしでも安全ですか？", answer: "データが存在しない場合もリスクなしと表示されます。国土交通省のデータは全地域を網羅していない場合があります。必ず市区町村の公式ハザードマップもご確認ください。" },
  { question: "このツールのデータはどこから来ていますか？", answer: "国土交通省「不動産情報ライブラリ」のAPI（XKT026〜XKT029、XKT025）を使用しています。参考情報としてご活用ください。" },
  { question: "スマートフォンでも使えますか？", answer: "はい、山田ツール（yamada-tools.jp）のハザードマップチェッカーはスマートフォン・タブレット・PCのすべてに対応しています。内見・現地確認の際にその場でリスクを確認できます。" },
];

export default function HazardClient() {
  const tool = getToolById("hazard-checker");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HazardResult | null>(null);
  const [error, setError] = useState("");

  const printedAt = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

  async function handleSearch() {
    if (!address.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/hazard/check?address=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (!res.ok) setError(data.detail || "エラーが発生しました。");
      else setResult(data);
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  const overallStyle = result ? RISK_STYLE[result.overall_risk] : null;

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #hazard-print-area, #hazard-print-area * { visibility: visible; }
          #hazard-print-area { position: fixed; top: 0; left: 0; width: 100%; }
          @page { size: A4; margin: 15mm 18mm; }
          .print-header { display: flex !important; }
          .print-footer { display: block !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 print:hidden">
          <a href="/" className="hover:underline">ホーム</a>
          <span className="mx-1">&gt;</span>
          <a href="/realestate" className="hover:underline">不動産</a>
          <span className="mx-1">&gt;</span>
          <span>ハザードマップチェック</span>
        </nav>

        {/* Hero */}
        <div className="mb-6 print:hidden">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🌊 ハザードマップチェッカー</h1>
          <p className="text-gray-600">住所を入力するだけで、5つの災害リスクを一括確認できます。</p>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm print:hidden">
          <label className="block text-sm font-medium text-gray-700 mb-2">調べたい住所を入力</label>
          <AddressInput
            value={address}
            onChange={setAddress}
            onSearch={handleSearch}
            loading={loading}
            placeholder="例: 東京都江戸川区平井1-1-1"
            buttonIcon="🌊"
            buttonLabel="ハザードリスクを確認する"
          />
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
            <span>✅ 国土交通省データ</span>
            <span>✅ 完全無料・登録不要</span>
            <span>✅ 5種類の災害リスク</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-gray-50 border border-gray-200 text-danger rounded-lg p-4 mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div id="hazard-print-area">
            {/* Print header */}
            <div className="print-header hidden items-center justify-between px-4 py-3 border-b border-gray-200 mb-3">
              <div>
                <p className="text-lg font-bold text-kon">山田ツール</p>
                <p className="text-xs text-gray-500">yamada-tools.jp — ハザードマップチェッカー</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">調査日: {printedAt}</p>
              </div>
            </div>

            {/* Overall risk banner */}
            <div className={`rounded-xl p-5 mb-4 border ${overallStyle?.bg} ${overallStyle?.border}`}>
              <p className="text-xs text-gray-500 mb-1">📍 {result.address}</p>
              <div className="flex items-center justify-between">
                <p className={`text-lg font-bold ${overallStyle?.text}`}>総合災害リスク</p>
                <RiskBadge risk={result.overall_risk} />
              </div>
              {result.overall_risk === "none" && (
                <p className="text-sm text-gray-500 mt-2">この住所周辺で検出された災害リスクはありません。ただし、データの網羅性には限界があります。</p>
              )}
              {result.overall_risk !== "none" && (
                <p className="text-sm mt-2 text-gray-700">下記の詳細をご確認ください。避難経路や避難場所をあらかじめ確認しておくことをおすすめします。</p>
              )}
            </div>

            <div className="space-y-3">
              {/* Flood */}
              <HazardCard icon="🌊" title="洪水浸水想定区域" result={result.flood}>
                {result.flood.detected ? (
                  <div className="text-sm space-y-1">
                    <p className="text-danger font-medium">浸水深: {result.flood.depth_label}</p>
                    {result.flood.river && <p className="text-gray-600 text-xs">対象河川: {result.flood.river}</p>}
                    <p className="text-gray-700 text-xs">{result.flood.desc}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">洪水浸水想定区域の指定はありません。</p>
                )}
              </HazardCard>

              {/* Landslide */}
              <HazardCard icon="⛰" title="土砂災害警戒区域" result={result.landslide}>
                {result.landslide.detected ? (
                  <div className="space-y-2">
                    {result.landslide.items.map((item, i) => (
                      <div key={i} className="text-xs bg-white bg-opacity-60 rounded p-2">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span>{item.icon}</span>
                          <span className="font-semibold text-gray-800">{item.type}</span>
                          <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${item.risk === "high" ? "bg-gray-50 text-danger" : "bg-gray-50 text-kon"}`}>
                            {item.level}
                          </span>
                        </div>
                        <p className="text-gray-600">{item.desc}</p>
                        {item.area && <p className="text-gray-400">区域名: {item.area}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">土砂災害警戒区域の指定はありません。</p>
                )}
              </HazardCard>

              {/* Liquefaction */}
              <HazardCard icon="🌍" title="液状化リスク" result={result.liquefaction}>
                {result.liquefaction.detected ? (
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-gray-800">{result.liquefaction.label}</p>
                    {result.liquefaction.terrain && <p className="text-xs text-gray-500">地形分類: {result.liquefaction.terrain}</p>}
                    <p className="text-xs text-gray-700">{result.liquefaction.desc}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">液状化リスクデータが見つかりません。</p>
                )}
              </HazardCard>

              {/* Tsunami */}
              <HazardCard icon="🌏" title="津波浸水想定" result={result.tsunami}>
                {result.tsunami.detected ? (
                  <p className="text-sm text-danger font-medium">津波浸水想定区域に含まれています。海抜の高い場所への避難計画を確認してください。</p>
                ) : (
                  <p className="text-xs text-gray-500">津波浸水想定区域の指定はありません。</p>
                )}
              </HazardCard>

              {/* Storm surge */}
              <HazardCard icon="🌀" title="高潮浸水想定区域" result={result.storm_surge}>
                {result.storm_surge.detected ? (
                  <p className="text-sm text-danger font-medium">高潮浸水想定区域に含まれています。台風・大雨時の浸水リスクがあります。</p>
                ) : (
                  <p className="text-xs text-gray-500">高潮浸水想定区域の指定はありません。</p>
                )}
              </HazardCard>
            </div>

            {/* Actions */}
            <div className="mt-5 print:hidden">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-xs text-gray-500 leading-relaxed">
                このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。
              </div>
              <p className="text-xs text-gray-400 mb-3">※ 実際の避難行動は市区町村の公式ハザードマップをご確認ください。</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.google.com/maps?q=${result.lat},${result.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  🗺 Googleマップで確認
                </a>
                <a
                  href="https://disaportal.gsi.go.jp/"
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  🔗 国土地理院ハザードマップ
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-sm bg-kon hover:bg-ai text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  🖨 印刷・PDF保存
                </button>
              </div>
            </div>

            {/* Print footer */}
            <div className="print-footer hidden border-t border-gray-200 px-4 py-3 mt-4">
              <p className="text-xs text-gray-500">このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。</p>
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} 山田ツール — https://yamada-tools.jp/realestate/hazard-checker</p>
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
