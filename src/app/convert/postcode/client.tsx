"use client";

import { useState } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

interface AddressResult {
  zipcode: string;
  prefcode: string;
  address1: string; // Prefecture
  address2: string; // City
  address3: string; // Town
  kana1: string;
  kana2: string;
  kana3: string;
}

export default function PostcodeClient({ faq }: Props) {
  const [postcode, setPostcode] = useState("");
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("郵便番号を入力してね！");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const formatPostcode = (value: string): string => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    // Format as XXX-XXXX
    if (digits.length > 3) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}`;
    }
    return digits;
  };

  const handlePostcodeChange = (value: string) => {
    const formatted = formatPostcode(value);
    setPostcode(formatted);
    
    // Auto-search when 7 digits entered
    const digits = formatted.replace(/\D/g, "");
    if (digits.length === 7) {
      searchByPostcode(digits);
    }
  };

  const searchByPostcode = async (digits?: string) => {
    const searchDigits = digits || postcode.replace(/\D/g, "");
    
    if (searchDigits.length !== 7) {
      setMascotState("error");
      setMascotMessage("7桁の郵便番号を入力してね！");
      return;
    }

    setIsLoading(true);
    setMascotState("working");
    setMascotMessage("検索中...");
    setResults([]);

    try {
      // Using zipcloud API (free, no registration required)
      const response = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${searchDigits}`
      );
      const data = await response.json();

      if (data.status === 200 && data.results) {
        setResults(data.results);
        setMascotState("success");
        setMascotMessage(`${data.results.length}件見つかったよ！`);
        
        // Add to history
        const formattedCode = `${searchDigits.slice(0, 3)}-${searchDigits.slice(3)}`;
        if (!searchHistory.includes(formattedCode)) {
          setSearchHistory(prev => [formattedCode, ...prev.slice(0, 4)]);
        }
      } else {
        setResults([]);
        setMascotState("error");
        setMascotMessage("該当する住所が見つからなかったよ...");
      }
    } catch (error) {
      console.error("Search error:", error);
      setMascotState("error");
      setMascotMessage("検索に失敗しました。もう一度試してね。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    searchByPostcode();
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMascotMessage("コピーしました！");
    } catch {
      setMascotMessage("コピーに失敗しました...");
    }
  };

  const handleClear = () => {
    setPostcode("");
    setResults([]);
    setMascotState("idle");
    setMascotMessage("郵便番号を入力してね！");
  };

  const handleHistoryClick = (code: string) => {
    setPostcode(code);
    const digits = code.replace(/\D/g, "");
    searchByPostcode(digits);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Common postcodes for quick access
  const commonPostcodes = [
    { code: "100-0001", label: "千代田区" },
    { code: "150-0001", label: "渋谷区" },
    { code: "530-0001", label: "大阪市北区" },
    { code: "460-0001", label: "名古屋市中区" },
    { code: "812-0001", label: "福岡市博多区" },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm" aria-label="パンくずリスト">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/convert" className="hover:text-kon">変換ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">郵便番号検索</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">〒</div>
          <h1 className="text-3xl font-bold text-kon mb-2">郵便番号検索</h1>
          <p className="text-gray-600 text-lg">郵便番号から住所を瞬時に検索</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🗾 全国対応</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">⚡ 自動検索</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Mascot */}
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Input Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">郵便番号</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">〒</span>
              <input
                type="text"
                value={postcode}
                onChange={(e) => handlePostcodeChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="000-0000"
                maxLength={8}
                className="w-full p-4 pl-12 text-2xl font-mono bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">7桁入力で自動検索されます</p>
          </div>

          {/* Quick Access */}
          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-2">クイック検索</label>
            <div className="flex flex-wrap gap-2">
              {commonPostcodes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(item.code)}
                  className="px-3 py-1 bg-kon/10 text-kon rounded-full text-sm hover:bg-kon/20 transition-colors"
                >
                  〒{item.code} {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs text-gray-500 mb-2">最近の検索</label>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((code, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(code)}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    〒{code}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`flex-1 py-4 rounded-xl font-bold transition-colors ${
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-kon text-white hover:bg-ai"
              }`}
            >
              {isLoading ? "検索中..." : "🔍 検索する"}
            </button>
            <button
              onClick={handleClear}
              className="py-4 px-6 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              クリア
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-700">検索結果</h3>
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-kon/5 to-ai/5 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-kon">
                          〒{result.zipcode.slice(0, 3)}-{result.zipcode.slice(3)}
                        </span>
                      </div>
                      <p className="text-lg font-medium text-gray-800">
                        {result.address1}{result.address2}{result.address3}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {result.kana1}{result.kana2}{result.kana3}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleCopy(`${result.zipcode.slice(0, 3)}-${result.zipcode.slice(3)}`)}
                        className="px-3 py-1 bg-kon text-white rounded text-xs hover:bg-ai transition-colors"
                      >
                        〒コピー
                      </button>
                      <button
                        onClick={() => handleCopy(`${result.address1}${result.address2}${result.address3}`)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        住所コピー
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* How to Use */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>郵便番号を入力（7桁入力で自動検索）</li>
            <li>または「検索する」をクリック</li>
            <li>結果をコピーして利用</li>
          </ol>
        </section>

        {/* FAQ */}
        {faq && faq.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問（FAQ）</h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <details 
                  key={index} 
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden group"
                >
                  <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-kon">Q.</span>
                      {item.question}
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">
                    <span className="text-kon font-medium">A.</span> {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        <section className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🆓</div>
            <h3 className="font-bold text-sm mb-1">完全無料</h3>
            <p className="text-xs text-gray-500">登録不要、制限なし</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🗾</div>
            <h3 className="font-bold text-sm mb-1">全国対応</h3>
            <p className="text-xs text-gray-500">日本全国の郵便番号に対応</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-bold text-sm mb-1">自動検索</h3>
            <p className="text-xs text-gray-500">7桁入力で自動で検索</p>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/convert" className="text-kon hover:text-ai transition-colors">
            ← 変換ツール一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
