"use client";
import AddressInput from "@/components/common/AddressInput";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";

import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api-backend";

interface SchoolInfo {
  school_name: string;
  operator: string;
  address: string;
  city_code: string;
  maps_url: string;
}

interface SchoolDistrictResult {
  address: string;
  lat: number;
  lng: number;
  elementary: SchoolInfo | null;
  junior_high: SchoolInfo | null;
  note: string;
}

function SchoolCard({ icon, label, school, color }: {
  icon: string;
  label: string;
  school: SchoolInfo;
  color: string;
}) {


  return (
    <div className={`bg-white border rounded-xl p-5 shadow-sm border-${color}-200`}>
      <div className={`flex items-center gap-2 mb-3`}>
        <span className="text-xl">{icon}</span>
        <span className={`font-semibold text-sm text-${color}-700`}>{label}</span>
      </div>
      <p className="text-xl font-bold text-gray-900 mb-1">{school.school_name}</p>
      {school.operator && (
        <p className="text-sm text-gray-500 mb-3">{school.operator}</p>
      )}
      {school.address && (
        <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
          <span className="text-gray-400 mt-0.5">📍</span>
          <span>{school.address}</span>
        </div>
      )}
      <a
        href={school.maps_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 text-xs bg-${color}-50 hover:bg-${color}-100 text-${color}-700 border border-${color}-200 px-3 py-1.5 rounded-lg transition-colors print:hidden`}
      >
        🗺 Googleマップで確認
      </a>
    </div>
  );
}


const faqItems = [
  { question: "学区とは何ですか？", answer: "公立小学校・中学校に通う際に、住所によって指定される通学区域のことです。引越しや不動産購入の際に重要な情報です。" },
  { question: "学区は変わることがありますか？", answer: "はい。市区町村の教育委員会の判断により、学区は変更される場合があります。最新情報は必ず各市区町村の教育委員会にご確認ください。" },
  { question: "私立学校の学区は調べられますか？", answer: "このツールは公立学校の学区情報のみ対応しています。私立学校は通常学区制を採用していないため、各学校に直接お問い合わせください。" },
  { question: "学区データが見つからない場合は？", answer: "一部の自治体では学区データが国土交通省のデータベースに未登録の場合があります。お住まいの市区町村の教育委員会に直接お問い合わせください。" },
  { question: "このツールのデータはどこから来ていますか？", answer: "国土交通省「不動産情報ライブラリ API（XKT004・XKT005）」の小学校区・中学校区データを使用しています。参考情報としてご活用ください。" },
  { question: "無料で使えますか？", answer: "はい、山田ツール（yamada-tools.jp）の学区チェッカーは完全無料・登録不要でご利用いただけます。引越し先の候補を複数調べる際にも費用はかかりません。" },
];

export default function SchoolDistrictClient() {
  const tool = getToolById("school-district");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SchoolDistrictResult | null>(null);
  const [error, setError] = useState("");

  const printedAt = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

  async function handleSearch() {
    if (!address.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/school-district/check?address=${encodeURIComponent(address)}`);
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
          #school-print-area, #school-print-area * { visibility: visible; }
          #school-print-area { position: fixed; top: 0; left: 0; width: 100%; }
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
          <span>学区チェック</span>
        </nav>

        <div className="mb-6 print:hidden">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🏫 学区チェッカー</h1>
          <p className="text-gray-600">住所を入力するだけで、小学校・中学校の学区を即座に確認できます。引越しや住まい選びにお役立てください。</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm print:hidden">
          <label className="block text-sm font-medium text-gray-700 mb-2">調べたい住所を入力</label>
          <AddressInput
            value={address}
            onChange={setAddress}
            onSearch={handleSearch}
            loading={loading}
            placeholder="例: 東京都千代田区神田司町2-1-1"
            buttonIcon="🏫"
            buttonLabel="学区を調べる"
          />
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
            <span>✅ 国土交通省データ</span>
            <span>✅ 完全無料・登録不要</span>
            <span>✅ 小・中学校区を同時確認</span>
          </div>
        </div>

        {error && (
          <div className={`rounded-xl p-4 mb-6 text-sm ${error.includes("見つかりませんでした") ? "bg-amber-50 border border-amber-300 text-amber-800" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {error.includes("見つかりませんでした") ? "📭 " : "⚠️ "}{error}
            {error.includes("見つかりませんでした") && (
              <p className="mt-2 text-xs">一部の自治体では学区データが未整備の場合があります。市区町村の教育委員会にお問い合わせください。</p>
            )}
          </div>
        )}

        {result && (
          <div id="school-print-area">
            <div className="print-header hidden items-center justify-between px-4 py-3 border-b border-gray-200 mb-3">
              <div>
                <p className="text-lg font-bold text-blue-700">山田ツール</p>
                <p className="text-xs text-gray-500">yamada-tools.jp — 学区チェッカー</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">調査日: {printedAt}</p>
              </div>
            </div>

            <div className="bg-blue-600 text-white rounded-xl p-4 mb-4">
              <p className="text-xs opacity-75 mb-1">📍 {result.address}</p>
              <p className="text-sm opacity-90 font-medium">この住所の学区情報</p>
            </div>

            <div className="space-y-4">
              {result.elementary ? (
                <SchoolCard
                  icon="🏫"
                  label="小学校区"
                  school={result.elementary}
                  color="blue"
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-500">
                  🏫 <strong>小学校区:</strong> データが見つかりませんでした
                </div>
              )}

              {result.junior_high ? (
                <SchoolCard
                  icon="🏛"
                  label="中学校区"
                  school={result.junior_high}
                  color="green"
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-500">
                  🏛 <strong>中学校区:</strong> データが見つかりませんでした
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-800 mb-1">⚠️ ご注意</p>
                <p className="text-xs text-amber-700">{result.note}</p>
              </div>

              <div className="print:hidden">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-xs text-gray-500 leading-relaxed">
                  このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={`https://www.google.com/maps?q=${result.lat},${result.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors">
                    🗺 Googleマップで確認
                  </a>
                  <button type="button" onClick={() => window.print()}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                    🖨 印刷・PDF保存
                  </button>
                </div>
              </div>
            </div>

            <div className="print-footer hidden border-t border-gray-200 px-4 py-3 mt-4">
              <p className="text-xs text-gray-500">このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。</p>
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} 山田ツール — https://yamada-tools.jp/realestate/school-district</p>
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
