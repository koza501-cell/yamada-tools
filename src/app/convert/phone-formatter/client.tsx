"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FormatResult {
  formatted: string;
  type: string;
  isValid: boolean;
}

export default function PhoneFormatterClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("電話番号を入力してね！");
  
  const [input, setInput] = useState("");
  const [result, setResult] = useState<FormatResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format Japanese phone number
  const formatPhoneNumber = (value: string): FormatResult => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Check length and patterns
    if (digits.length < 10 || digits.length > 11) {
      return { formatted: digits, type: "不明", isValid: false };
    }

    // Mobile phone: 070, 080, 090 (11 digits)
    if (/^0[789]0/.test(digits) && digits.length === 11) {
      return {
        formatted: `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`,
        type: "携帯電話",
        isValid: true,
      };
    }

    // IP phone: 050 (11 digits)
    if (/^050/.test(digits) && digits.length === 11) {
      return {
        formatted: `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`,
        type: "IP電話",
        isValid: true,
      };
    }

    // Free dial: 0120 (10 digits)
    if (/^0120/.test(digits) && digits.length === 10) {
      return {
        formatted: `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`,
        type: "フリーダイヤル",
        isValid: true,
      };
    }

    // Navi dial: 0570 (10 digits)
    if (/^0570/.test(digits) && digits.length === 10) {
      return {
        formatted: `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`,
        type: "ナビダイヤル",
        isValid: true,
      };
    }

    // Free dial: 0800 (11 digits)
    if (/^0800/.test(digits) && digits.length === 11) {
      return {
        formatted: `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`,
        type: "フリーダイヤル",
        isValid: true,
      };
    }

    // Fixed line phone - various area codes
    if (digits.length === 10 && digits.startsWith("0")) {
      // Tokyo/Osaka (2-digit area): 03, 06
      if (/^0[36]/.test(digits)) {
        return {
          formatted: `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`,
          type: "固定電話（2桁市外局番）",
          isValid: true,
        };
      }
      
      // 3-digit area codes: 011-019, 022-029, etc.
      const threeDigitAreas = ["011", "015", "017", "018", "019", "022", "023", "024", "025", "026", "027", "028", "029",
        "042", "043", "044", "045", "046", "047", "048", "049", "052", "053", "054", "055", "058", "059",
        "072", "073", "075", "076", "077", "078", "079", "082", "083", "084", "086", "087", "088", "089",
        "092", "093", "095", "096", "097", "098", "099"];
      
      const areaCode3 = digits.slice(0, 3);
      if (threeDigitAreas.includes(areaCode3)) {
        return {
          formatted: `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`,
          type: "固定電話（3桁市外局番）",
          isValid: true,
        };
      }
      
      // 4-digit area codes (default for remaining)
      return {
        formatted: `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`,
        type: "固定電話（4桁市外局番）",
        isValid: true,
      };
    }

    return { formatted: digits, type: "不明", isValid: false };
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setMascotState("error");
      setMascotMessage("番号を入力してね！");
      return;
    }
    
    const formatted = formatPhoneNumber(input);
    setResult(formatted);
    
    if (formatted.isValid) {
      setMascotState("success");
      setMascotMessage("整形完了！");
    } else {
      setMascotState("error");
      setMascotMessage("形式が不明だよ...");
    }
  };

  const handleCopy = () => {
    if (result?.formatted) {
      navigator.clipboard.writeText(result.formatted);
      setCopied(true);
      setMascotMessage("コピーしたよ！");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyNoHyphen = () => {
    if (result?.formatted) {
      navigator.clipboard.writeText(result.formatted.replace(/-/g, ""));
      setCopied(true);
      setMascotMessage("ハイフンなしでコピー！");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFormat();
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/convert" className="hover:text-kon">変換ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">電話番号整形</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📞</div>
          <h1 className="text-3xl font-bold text-kon mb-2">電話番号整形</h1>
          <p className="text-gray-600 text-lg">ハイフン自動挿入</p>
        </header>

        <div className="mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電話番号
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="09012345678 または 03-1234-5678"
              className="w-full px-4 py-3 text-xl font-mono border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
              maxLength={20}
            />
          </div>

          <button
            onClick={handleFormat}
            className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
          >
            整形する
          </button>
        </section>

        {result && (
          <section className={`rounded-2xl p-6 mb-6 ${result.isValid ? "bg-green-50 border-2 border-green-200" : "bg-yellow-50 border-2 border-yellow-200"}`}>
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500 mb-1">{result.type}</p>
              <p className="text-3xl font-mono font-bold">{result.formatted}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 py-3 bg-kon text-white rounded-xl font-bold hover:bg-kon/90 transition-all"
              >
                {copied ? "✓ コピー済み" : "コピー"}
              </button>
              <button
                onClick={handleCopyNoHyphen}
                className="flex-1 py-3 bg-white border-2 border-kon text-kon rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                ハイフンなし
              </button>
            </div>
          </section>
        )}

        <section className="bg-sakura/20 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-kon mb-3">対応形式</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white rounded-lg p-2">携帯: 090-XXXX-XXXX</div>
            <div className="bg-white rounded-lg p-2">IP電話: 050-XXXX-XXXX</div>
            <div className="bg-white rounded-lg p-2">東京: 03-XXXX-XXXX</div>
            <div className="bg-white rounded-lg p-2">大阪: 06-XXXX-XXXX</div>
            <div className="bg-white rounded-lg p-2">フリー: 0120-XXX-XXX</div>
            <div className="bg-white rounded-lg p-2">ナビ: 0570-XXX-XXX</div>
          </div>
        </section>

        <section className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-bold text-kon mb-3">サンプル番号</h3>
          <div className="space-y-2">
            <button
              onClick={() => setInput("09012345678")}
              className="block w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-100 font-mono text-sm"
            >
              09012345678（携帯）
            </button>
            <button
              onClick={() => setInput("0312345678")}
              className="block w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-100 font-mono text-sm"
            >
              0312345678（東京）
            </button>
            <button
              onClick={() => setInput("0120123456")}
              className="block w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-100 font-mono text-sm"
            >
              0120123456（フリーダイヤル）
            </button>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/convert" className="text-kon hover:text-ai">← 変換ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
