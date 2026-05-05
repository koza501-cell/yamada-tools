"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://staging.yamada-tools.jp/api-backend";

interface ZoneResult {
  address: string;
  zone_code: number;
  zone_name: string;
  zone_friendly: string;
  zone_tooltip: string;
  kenpei: number | null;
  youseki: number | null;
  kenpei_typical: string;
  youseki_typical: string;
  height_limit: boolean;
  height_note: string;
  shadow_regulation: boolean;
  allowed: string[];
  disallowed: string[];
  best_for: string[];
  kenpei_tooltip: string;
  youseki_tooltip: string;
  lat: number;
  lng: number;
  confidence: "high" | "low";
}

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-1 print:hidden">
      <button
        type="button"
        className="text-blue-500 hover:text-blue-700 text-sm font-bold border border-blue-300 rounded-full w-5 h-5 inline-flex items-center justify-center leading-none"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        aria-label="詳細"
      >
        ?
      </button>
      {show && (
        <div className="absolute z-50 left-6 top-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-700 leading-relaxed">
          {text}
        </div>
      )}
    </span>
  );
}

export default function YotoChiikiClient() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ZoneResult | null>(null);
  const [error, setError] = useState("");
  const [landSize, setLandSize] = useState("");

  async function handleSearch() {
    if (!address.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/yoto-chiiki/check?address=${encodeURIComponent(address)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "エラーが発生しました。");
      } else {
        setResult(data);
      }
    } catch {
      setError("通信エラーが発生しました。しばらくしてから再試行してください。");
    } finally {
      setLoading(false);
    }
  }

  const kenpeiVal = result?.kenpei ?? null;
  const yousekiVal = result?.youseki ?? null;
  const size = parseFloat(landSize);
  const maxBuildArea =
    kenpeiVal !== null && !isNaN(size) ? Math.floor(size * (kenpeiVal / 100)) : null;
  const maxFloorArea =
    yousekiVal !== null && !isNaN(size) ? Math.floor(size * (yousekiVal / 100)) : null;
  const floorCount =
    kenpeiVal !== null && maxFloorArea !== null && maxBuildArea
      ? (maxFloorArea / maxBuildArea).toFixed(1)
      : null;

  const printedAt = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* ===== PRINT-ONLY STYLES ===== */}
      <style>{`
        @media print {
          /* Hide everything except the result card */
          body * { visibility: hidden; }
          #yoto-print-area, #yoto-print-area * { visibility: visible; }
          #yoto-print-area { position: fixed; top: 0; left: 0; width: 100%; }

          /* Page setup */
          @page { size: A4; margin: 15mm 18mm; }

          /* Print header */
          .print-header { display: flex !important; }

          /* Print footer */
          .print-footer { display: block !important; }

          /* Hide action buttons */
          .print\\:hidden { display: none !important; }

          /* Force colors */
          .print-blue-header {
            background-color: #1d4ed8 !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-green-bg {
            background-color: #f0fdf4 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-red-bg {
            background-color: #fff5f5 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-gray-bg {
            background-color: #f9fafb !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-accent-bar {
            background-color: #2563eb !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 print:hidden">
          <a href="/" className="hover:underline">ホーム</a>
          <span className="mx-1">&gt;</span>
          <a href="/realestate" className="hover:underline">不動産</a>
          <span className="mx-1">&gt;</span>
          <span>用途地域チェック</span>
        </nav>

        {/* Hero */}
        <div className="mb-8 print:hidden">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🏗 用途地域チェッカー</h1>
          <p className="text-gray-600">住所を入力するだけで、その土地に何が建てられるか即座にわかります。</p>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm print:hidden">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            調べたい住所を入力
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例: 東京都渋谷区神宮前1-1-1"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading || !address.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? "調べています..." : "🔍 用途地域を調べる"}
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
            <span>✅ 国土交通省データ使用</span>
            <span>✅ 完全無料・登録不要</span>
            <span>✅ スマホ・PC対応</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="print:hidden">
            {error.includes("都市計画区域外") || error.includes("見つかりませんでした") ? (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 mb-6">
                <p className="font-semibold text-amber-800 mb-2">📭 この住所の用途地域データが見つかりませんでした</p>
                <p className="text-sm text-amber-700 mb-2">考えられる理由：</p>
                <ul className="text-sm text-amber-700 space-y-1 mb-4">
                  <li>● <strong>都市計画区域外</strong> — 農村・山間部・一部離島など、用途地域が指定されていないエリア</li>
                  <li>● <strong>データ未整備</strong> — 国土交通省のデータベースに当該自治体のデータが未登録</li>
                  <li>● <strong>住所の粒度</strong> — 番地まで入力するとより正確に検索できます</li>
                </ul>
                <p className="text-sm text-amber-700 mb-3">正確な情報は、<strong>市区町村の都市計画部門</strong>にお問い合わせください。</p>
                <a
                  href="https://www.reinfolib.mlit.go.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm bg-white border border-amber-400 text-amber-800 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  🔗 国土交通省 不動産情報ライブラリで確認する
                </a>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>
        )}

        {/* Result — this div is the print target */}
        {result && (
          <div id="yoto-print-area" className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

            {/* ===== PRINT HEADER (hidden on screen) ===== */}
            <div className="print-header hidden items-center justify-between px-6 py-4 border-b border-gray-200 mb-2">
              <div>
                <p className="text-xl font-bold text-blue-700" style={{ letterSpacing: "0.05em" }}>
                  山田ツール
                </p>
                <p className="text-xs text-gray-500">yamada-tools.jp — 用途地域チェッカー</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">調査日: {printedAt}</p>
                <p className="text-xs text-gray-400">参考情報 — 詳細は市区町村窓口へご確認ください</p>
              </div>
            </div>

            {/* ===== PRINT ACCENT BAR ===== */}
            <div className="print-accent-bar hidden h-1 w-full" />

            {/* Zone Header */}
            <div className="print-blue-header bg-blue-600 text-white p-5">
              <p className="text-sm opacity-80 mb-1">📍 {result.address}</p>
              <h2 className="text-xl font-bold">{result.zone_name}</h2>
              <p className="text-blue-100 text-sm mt-1">
                {result.zone_friendly}
                <Tooltip text={result.zone_tooltip} />
              </p>
            </div>

  
            {/* Confidence Warning */}
            {result.confidence === "low" && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3 text-sm text-yellow-800 print:bg-yellow-50">
                ⚠️ <strong>注意：</strong> この住所は用途地域の境界付近にある可能性があります。表示結果は参考情報です。正確な情報は市区町村の都市計画部門にご確認ください。
              </div>
            )}
          <div className="p-5 space-y-6">
              {/* Allowed */}
              <div className="print-green-bg rounded-lg p-3">
                <h3 className="font-semibold text-green-700 mb-2">✅ 建てられるもの</h3>
                <ul className="space-y-1">
                  {result.allowed.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-0.5">●</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disallowed */}
              <div className="print-red-bg rounded-lg p-3">
                <h3 className="font-semibold text-red-700 mb-2">❌ 建てられないもの</h3>
                <ul className="space-y-1">
                  {result.disallowed.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-400 mt-0.5">●</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limits */}
              <div className="print-gray-bg bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">📐 建築制限</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">建ぺい率</span>
                    <Tooltip text={result.kenpei_tooltip} />
                    <p className="font-bold text-gray-900 mt-0.5">
                      {result.kenpei !== null ? `${result.kenpei}%` : result.kenpei_typical}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">容積率</span>
                    <Tooltip text={result.youseki_tooltip} />
                    <p className="font-bold text-gray-900 mt-0.5">
                      {result.youseki !== null ? `${result.youseki}%` : result.youseki_typical}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">高さ制限</span>
                    <p className="font-bold text-gray-900 mt-0.5">
                      {result.height_limit ? result.height_note : "なし"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">日影規制</span>
                    <p className="font-bold text-gray-900 mt-0.5">
                      {result.shadow_regulation ? "あり" : "なし"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Calculator */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">🏗 建築面積シミュレーター</h3>
                <label className="block text-sm text-gray-600 mb-1 print:hidden">土地面積を入力（㎡）</label>
                <div className="flex gap-2 print:hidden">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="例: 100"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    min="1"
                  />
                  <span className="text-sm text-gray-500 self-center">㎡</span>
                </div>
                {maxBuildArea !== null && maxFloorArea !== null && (
                  <div className="mt-3 space-y-1 text-sm">
                    {landSize && (
                      <p className="text-gray-500 text-xs mb-1">土地面積: {landSize} ㎡</p>
                    )}
                    <p>
                      <span className="text-gray-600">最大建築面積（1階）：</span>
                      <strong className="text-blue-700">{maxBuildArea} ㎡</strong>
                    </p>
                    <p>
                      <span className="text-gray-600">最大延床面積（全階合計）：</span>
                      <strong className="text-blue-700">{maxFloorArea} ㎡</strong>
                    </p>
                    {floorCount && (
                      <p>
                        <span className="text-gray-600">階数の目安：</span>
                        <strong className="text-blue-700">約 {floorCount} 階建て</strong>
                      </p>
                    )}
                  </div>
                )}
                {!isNaN(size) && size > 0 && (kenpeiVal === null || yousekiVal === null) && (
                  <p className="text-xs text-gray-500 mt-2">
                    ※ APIから建ぺい率・容積率の数値が取得できませんでした。一般的な目安値をご確認ください。
                  </p>
                )}
              </div>

              {/* Best For */}
              {result.best_for.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">💡 この地域がおすすめの用途</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.best_for.map((item, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t pt-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 text-xs text-gray-500 leading-relaxed">
                  このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  ※ 最終判断は市区町村の都市計画部門にご確認ください。
                </p>
                <div className="flex flex-wrap gap-2 print:hidden">
                  <a
                    href={`https://www.google.com/maps?q=${result.lat},${result.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    🗺 Googleマップで確認
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

            {/* ===== PRINT FOOTER (hidden on screen) ===== */}
            <div className="print-footer hidden border-t border-gray-200 px-6 py-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-700">山田ツール — 用途地域チェッカー</p>
                  <p className="text-xs text-gray-400">https://yamada-tools.jp/realestate/yoto-chiiki-checker</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。</p>
                  <p className="text-xs text-gray-400">© {new Date().getFullYear()} 山田ツール — 最終確認は市区町村窓口へ。</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* FAQ */}
        <div className="mt-10 print:hidden">
          <h2 className="text-lg font-bold text-gray-800 mb-4">よくある質問</h2>
          <div className="space-y-4">
            {[
              {
                q: "用途地域とは何ですか？",
                a: "都市計画法に基づき、土地の使い方を13種類に分類したものです。住宅専用エリアから商業・工業エリアまで、建てられる建物の種類や規模が制限されています。"
              },
              {
                q: "建ぺい率とは何ですか？",
                a: "土地面積に対して、建物の1階部分（建築面積）が占める割合の上限です。例えば建ぺい率60%・土地100㎡なら、1階の建物は最大60㎡まで建てられます。"
              },
              {
                q: "容積率とは何ですか？",
                a: "土地面積に対する、全ての階の床面積の合計（延床面積）の割合の上限です。容積率200%・土地100㎡なら、全階合計200㎡まで建てられます（約3階建ての目安）。"
              },
              {
                q: "このツールのデータはどこから来ていますか？",
                a: "国土交通省の「不動産情報ライブラリ API（XKT002）」と国土地理院のジオコーディングAPIを使用しています。参考情報としてご活用ください。"
              },
              {
                q: "用途地域が見つからない場合はどうすれば？",
                a: "都市計画区域外（農村・山間部など）の住所は用途地域が設定されていない場合があります。詳細はお住まいの市区町村の都市計画部門にお問い合わせください。"
              }
            ].map(({ q, a }, i) => (
              <details key={i} className="border border-gray-200 rounded-lg">
                <summary className="px-4 py-3 font-medium text-gray-800 cursor-pointer hover:bg-gray-50">
                  Q. {q}
                </summary>
                <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
