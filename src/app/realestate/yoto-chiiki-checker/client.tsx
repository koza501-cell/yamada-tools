"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://yamada-tools.jp/api-backend";

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
        className="text-blue-500 hover:text-blue-700 text-xs font-bold border border-blue-300 rounded-full w-4 h-4 inline-flex items-center justify-center leading-none"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        aria-label="詳細"
      >
        ?
      </button>
      {show && (
        <div className="absolute z-50 left-5 top-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-3 text-sm text-gray-700 leading-relaxed">
          {text}
        </div>
      )}
    </span>
  );
}

function ResultCard({ result, landSize }: { result: ZoneResult; landSize: string }) {
  const kenpeiVal = result.kenpei ?? null;
  const yousekiVal = result.youseki ?? null;
  const size = parseFloat(landSize);
  const maxBuildArea = kenpeiVal !== null && !isNaN(size) && size > 0 ? Math.floor(size * (kenpeiVal / 100)) : null;
  const maxFloorArea = yousekiVal !== null && !isNaN(size) && size > 0 ? Math.floor(size * (yousekiVal / 100)) : null;
  const floorCount = maxBuildArea && maxFloorArea ? (maxFloorArea / maxBuildArea).toFixed(1) : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <p className="text-xs opacity-75 mb-1">📍 {result.address}</p>
        <p className="text-lg font-bold">{result.zone_name}</p>
        <p className="text-blue-100 text-sm mt-0.5">
          {result.zone_friendly}
          <Tooltip text={result.zone_tooltip} />
        </p>
      </div>
      {result.confidence === "low" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 px-3 py-2 text-xs text-yellow-800">
          ⚠️ 境界付近の可能性あり。参考情報としてご利用ください。
        </div>
      )}
      <div className="p-4 space-y-4">
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs font-semibold text-green-700 mb-2">✅ 建てられるもの</p>
          <ul className="space-y-0.5">
            {result.allowed.map((item, i) => (
              <li key={i} className="text-xs text-gray-700 flex gap-1"><span className="text-green-500">●</span>{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <p className="text-xs font-semibold text-red-700 mb-2">❌ 建てられないもの</p>
          <ul className="space-y-0.5">
            {result.disallowed.map((item, i) => (
              <li key={i} className="text-xs text-gray-700 flex gap-1"><span className="text-red-400">●</span>{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">📐 建築制限</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">建ぺい率<Tooltip text={result.kenpei_tooltip} /></span>
              <p className="font-bold text-gray-900 mt-0.5">{kenpeiVal !== null ? `${kenpeiVal}%` : result.kenpei_typical}</p>
            </div>
            <div>
              <span className="text-gray-500">容積率<Tooltip text={result.youseki_tooltip} /></span>
              <p className="font-bold text-gray-900 mt-0.5">{yousekiVal !== null ? `${yousekiVal}%` : result.youseki_typical}</p>
            </div>
            <div>
              <span className="text-gray-500">高さ制限</span>
              <p className="font-bold text-gray-900 mt-0.5">{result.height_limit ? result.height_note : "なし"}</p>
            </div>
            <div>
              <span className="text-gray-500">日影規制</span>
              <p className="font-bold text-gray-900 mt-0.5">{result.shadow_regulation ? "あり" : "なし"}</p>
            </div>
          </div>
        </div>
        {maxBuildArea !== null && maxFloorArea !== null && (
          <div className="bg-blue-50 rounded-lg p-3 text-xs">
            <p className="font-semibold text-blue-800 mb-1">🏗 {landSize}㎡の土地の場合</p>
            <p className="text-gray-700">最大建築面積: <strong className="text-blue-700">{maxBuildArea}㎡</strong></p>
            <p className="text-gray-700">最大延床面積: <strong className="text-blue-700">{maxFloorArea}㎡</strong></p>
            {floorCount && <p className="text-gray-700">目安階数: <strong className="text-blue-700">約{floorCount}階建て</strong></p>}
          </div>
        )}
        {result.best_for.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">💡 おすすめ用途</p>
            <div className="flex flex-wrap gap-1">
              {result.best_for.map((item, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{item}</span>
              ))}
            </div>
          </div>
        )}
        <a
          href={`https://www.google.com/maps?q=${result.lat},${result.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors print:hidden"
        >
          🗺 Googleマップで確認
        </a>
      </div>
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  const isNoData = msg.includes("都市計画区域外") || msg.includes("見つかりませんでした");
  if (isNoData) {
    return (
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-4">
        <p className="font-semibold text-amber-800 mb-2 text-sm">📭 用途地域データが見つかりませんでした</p>
        <ul className="text-xs text-amber-700 space-y-1 mb-3">
          <li>● <strong>都市計画区域外</strong> — 農村・山間部・一部離島など</li>
          <li>● <strong>データ未整備</strong> — 国土交通省DBに未登録の自治体</li>
          <li>● <strong>住所の粒度</strong> — 番地まで入力するとより正確</li>
        </ul>
        <a href="https://www.reinfolib.mlit.go.jp/" target="_blank" rel="noopener noreferrer"
          className="text-xs bg-white border border-amber-400 text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors inline-block">
          🔗 国土交通省サイトで確認
        </a>
      </div>
    );
  }
  return <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">⚠️ {msg}</div>;
}

export default function YotoChiikiClient() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ZoneResult | null>(null);
  const [error, setError] = useState("");
  const [landSize, setLandSize] = useState("");

  const [compareMode, setCompareMode] = useState(false);
  const [addressB, setAddressB] = useState("");
  const [loadingB, setLoadingB] = useState(false);
  const [resultB, setResultB] = useState<ZoneResult | null>(null);
  const [errorB, setErrorB] = useState("");

  const printedAt = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

  async function fetchZone(addr: string): Promise<{ data?: ZoneResult; error?: string }> {
    const res = await fetch(`${API_BASE}/api/yoto-chiiki/check?address=${encodeURIComponent(addr)}`);
    const data = await res.json();
    if (!res.ok) return { error: data.detail || "エラーが発生しました。" };
    return { data };
  }

  async function handleSearch() {
    if (!address.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const { data, error: err } = await fetchZone(address);
      if (err) setError(err); else if (data) setResult(data);
    } catch { setError("通信エラーが発生しました。"); }
    finally { setLoading(false); }
  }

  async function handleSearchB() {
    if (!addressB.trim()) return;
    setLoadingB(true); setErrorB(""); setResultB(null);
    try {
      const { data, error: err } = await fetchZone(addressB);
      if (err) setErrorB(err); else if (data) setResultB(data);
    } catch { setErrorB("通信エラーが発生しました。"); }
    finally { setLoadingB(false); }
  }

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #yoto-print-area, #yoto-print-area * { visibility: visible; }
          #yoto-print-area { position: fixed; top: 0; left: 0; width: 100%; }
          @page { size: A4; margin: 15mm 18mm; }
          .print-header { display: flex !important; }
          .print-footer { display: block !important; }
          .print\\:hidden { display: none !important; }
          .print-blue-header { background-color: #1d4ed8 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-accent-bar { background-color: #2563eb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 print:hidden">
          <a href="/" className="hover:underline">ホーム</a>
          <span className="mx-1">&gt;</span>
          <a href="/realestate" className="hover:underline">不動産</a>
          <span className="mx-1">&gt;</span>
          <span>用途地域チェック</span>
        </nav>

        {/* Hero */}
        <div className="mb-6 print:hidden">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🏗 用途地域チェッカー</h1>
          <p className="text-gray-600">住所を入力するだけで、その土地に何が建てられるか即座にわかります。</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-5 print:hidden">
          <button
            type="button"
            onClick={() => { setCompareMode(false); setResultB(null); setErrorB(""); setAddressB(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!compareMode ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            🔍 1住所を調べる
          </button>
          <button
            type="button"
            onClick={() => setCompareMode(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${compareMode ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            ⚖ 2地点を比較する
          </button>
        </div>

        {/* Single mode search */}
        {!compareMode && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm print:hidden">
            <label className="block text-sm font-medium text-gray-700 mb-2">調べたい住所を入力</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 東京都渋谷区神宮前1-1-1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading || !address.trim()}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? "調べています..." : "🔍 用途地域を調べる"}
            </button>
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
              <span>✅ 国土交通省データ</span>
              <span>✅ 完全無料・登録不要</span>
              <span>✅ スマホ・PC対応</span>
            </div>
          </div>
        )}

        {/* Compare mode search */}
        {compareMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 print:hidden">
            <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-blue-700 mb-2">📍 土地A</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 東京都渋谷区神宮前1-1-1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={loading || !address.trim()}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
              >
                {loading ? "調べています..." : "調べる"}
              </button>
            </div>
            <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-green-700 mb-2">📍 土地B</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="例: 大阪府大阪市北区梅田1-1-1"
                value={addressB}
                onChange={(e) => setAddressB(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchB()}
              />
              <button
                type="button"
                onClick={handleSearchB}
                disabled={loadingB || !addressB.trim()}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
              >
                {loadingB ? "調べています..." : "調べる"}
              </button>
            </div>
          </div>
        )}

        {/* Land size input — shown when any result exists */}
        {(result || resultB) && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-3 print:hidden">
            <span className="text-sm text-blue-800 font-medium whitespace-nowrap">🏗 土地面積で計算:</span>
            <input
              type="number"
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="例: 100"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              min="1"
            />
            <span className="text-sm text-gray-500">㎡</span>
          </div>
        )}

        {/* Errors */}
        {error && <ErrorBox msg={error} />}
        {errorB && compareMode && <ErrorBox msg={errorB} />}

        {/* Single result */}
        {!compareMode && result && (
          <div id="yoto-print-area">
            <div className="print-header hidden items-center justify-between px-4 py-3 border-b border-gray-200 mb-3">
              <div>
                <p className="text-lg font-bold text-blue-700">山田ツール</p>
                <p className="text-xs text-gray-500">yamada-tools.jp — 用途地域チェッカー</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">調査日: {printedAt}</p>
              </div>
            </div>
            <div className="print-accent-bar hidden h-1 w-full mb-3" />
            <ResultCard result={result} landSize={landSize} />
            <div className="mt-4 print:hidden">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-xs text-gray-500 leading-relaxed">
                このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。
              </div>
              <p className="text-xs text-gray-400 mb-3">※ 最終判断は市区町村の都市計画部門にご確認ください。</p>
              <button type="button" onClick={() => window.print()}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                🖨 印刷・PDF保存
              </button>
            </div>
            <div className="print-footer hidden border-t border-gray-200 px-4 py-3 mt-4">
              <p className="text-xs text-gray-500">このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。</p>
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} 山田ツール — https://yamada-tools.jp/realestate/yoto-chiiki-checker</p>
            </div>
          </div>
        )}

        {/* Compare results */}
        {compareMode && (result || resultB) && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {result
                  ? <ResultCard result={result} landSize={landSize} />
                  : <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400 text-sm">土地Aを検索してください</div>
                }
              </div>
              <div>
                {resultB
                  ? <ResultCard result={resultB} landSize={landSize} />
                  : <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400 text-sm">土地Bを検索してください</div>
                }
              </div>
            </div>

            {/* Compare summary table */}
            {result && resultB && (
              <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">📊 比較まとめ</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 font-normal pb-2 w-1/3"></th>
                      <th className="text-center text-blue-700 font-semibold pb-2">土地A</th>
                      <th className="text-center text-green-700 font-semibold pb-2">土地B</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ["用途地域", result.zone_name, resultB.zone_name],
                      ["建ぺい率", result.kenpei !== null ? `${result.kenpei}%` : result.kenpei_typical, resultB.kenpei !== null ? `${resultB.kenpei}%` : resultB.kenpei_typical],
                      ["容積率", result.youseki !== null ? `${result.youseki}%` : result.youseki_typical, resultB.youseki !== null ? `${resultB.youseki}%` : resultB.youseki_typical],
                      ["高さ制限", result.height_limit ? "あり" : "なし", resultB.height_limit ? "あり" : "なし"],
                      ["日影規制", result.shadow_regulation ? "あり" : "なし", resultB.shadow_regulation ? "あり" : "なし"],
                    ].map(([label, a, b], i) => (
                      <tr key={i}>
                        <td className="py-2 text-gray-500">{label}</td>
                        <td className="py-2 text-center font-medium">{a}</td>
                        <td className="py-2 text-center font-medium">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-3 text-xs text-gray-400">
              このサービスは、国土交通省不動産情報ライブラリのAPI機能を使用していますが、提供情報の最新性、正確性、完全性等が保証されたものではありません。
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-10 print:hidden">
          <h2 className="text-lg font-bold text-gray-800 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {[
              { q: "用途地域とは何ですか？", a: "都市計画法に基づき、土地の使い方を13種類に分類したものです。住宅専用エリアから商業・工業エリアまで、建てられる建物の種類や規模が制限されています。" },
              { q: "建ぺい率とは何ですか？", a: "土地面積に対して、建物の1階部分（建築面積）が占める割合の上限です。例えば建ぺい率60%・土地100㎡なら、1階の建物は最大60㎡まで建てられます。" },
              { q: "容積率とは何ですか？", a: "土地面積に対する、全ての階の床面積の合計（延床面積）の割合の上限です。容積率200%・土地100㎡なら、全階合計200㎡まで建てられます（約3階建ての目安）。" },
              { q: "クリニック開業に向く用途地域は？", a: "第一種中高層住居専用地域・第二種中高層住居専用地域・第一種住居地域などが診療所・病院を許可しています。第一種低層住居専用地域では床面積に制限があります。" },
              { q: "このツールのデータはどこから来ていますか？", a: "国土交通省の「不動産情報ライブラリ API（XKT002）」と国土地理院のジオコーディングAPIを使用しています。参考情報としてご活用ください。" },
              { q: "用途地域が見つからない場合は？", a: "都市計画区域外（農村・山間部など）の住所は用途地域が設定されていない場合があります。市区町村の都市計画部門にお問い合わせください。" },
            ].map(({ q, a }, i) => (
              <details key={i} className="border border-gray-200 rounded-lg">
                <summary className="px-4 py-3 font-medium text-gray-800 cursor-pointer hover:bg-gray-50 text-sm">Q. {q}</summary>
                <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
