"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface ValidationResult {
  isValid: boolean;
  formatted: string;
  messages: string[];
}

export default function TNumberClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("T番号を入力してね！");
  
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Validate T-Number (Japanese Invoice Registration Number)
  // Format: T + 13 digits (corporate number)
  // Check digit is calculated using modulus 9 with weights
  const validateTNumber = (value: string) => {
    const messages: string[] = [];
    
    // Remove spaces and convert to uppercase
    let cleaned = value.replace(/[\s\-ー−]/g, "").toUpperCase();
    
    // Check if starts with T
    const hasT = cleaned.startsWith("T");
    if (hasT) {
      cleaned = cleaned.substring(1);
    }
    
    // Remove any remaining non-digits
    const digits = cleaned.replace(/\D/g, "");
    
    // Check length
    if (digits.length !== 13) {
      messages.push(`桁数エラー: ${digits.length}桁（13桁必要）`);
      return {
        isValid: false,
        formatted: hasT ? `T${digits}` : digits,
        messages,
      };
    }
    
    // Validate check digit (法人番号のチェックディジット)
    // The check digit is the first digit
    // Calculation: 9 - (Σ(Pi × Qi) mod 9)
    // where Pi is digit at position i (from right, starting at 1)
    // Qi is weight: 1,2,1,2,1,2,1,2,1,2,1,2 for positions 1-12
    
    const checkDigit = parseInt(digits[0]);
    const bodyDigits = digits.substring(1);
    
    // Calculate check digit
    let sum = 0;
    const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(bodyDigits[11 - i]); // Right to left
      const product = digit * weights[i];
      // If product >= 10, sum the digits (e.g., 14 -> 1+4=5)
      sum += product >= 10 ? Math.floor(product / 10) + (product % 10) : product;
    }
    
    const calculatedCheck = (9 - (sum % 9)) % 9;
    // Special case: if result is 0, check digit is 9
    const expectedCheck = calculatedCheck === 0 ? 9 : calculatedCheck;
    
    // Alternative simpler calculation used by Japan
    // 9 - ((sum of (digit * (position is odd ? 1 : 2))) mod 9)
    let sum2 = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(bodyDigits[i]);
      const weight = ((12 - i) % 2 === 1) ? 2 : 1;
      sum2 += digit * weight;
    }
    const calculatedCheck2 = 9 - (sum2 % 9);
    const expectedCheck2 = calculatedCheck2 === 9 ? 0 : calculatedCheck2;
    
    // Try both calculation methods
    const isCheckValid = checkDigit === expectedCheck || checkDigit === expectedCheck2 || checkDigit === (9 - (sum2 % 9));
    
    if (!isCheckValid) {
      messages.push("チェックディジットエラー（形式が正しくない可能性）");
    }
    
    // Format check
    if (!hasT) {
      messages.push("注意: T が付いていません");
    }
    
    const isValid = digits.length === 13 && messages.length === 0;
    
    if (isValid) {
      messages.push("形式は正しいです");
      messages.push("※ 実際の登録状況は国税庁サイトでご確認ください");
    }
    
    return {
      isValid,
      formatted: `T${digits}`,
      messages,
    };
  };

  const handleValidate = () => {
    if (!input.trim()) {
      setMascotState("error");
      setMascotMessage("番号を入力してね！");
      return;
    }
    
    const validation = validateTNumber(input);
    setResult(validation);
    
    if (validation.isValid) {
      setMascotState("success");
      setMascotMessage("形式OKだよ！");
    } else {
      setMascotState("error");
      setMascotMessage("エラーがあるよ...");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleValidate();
    }
  };

  const openNTA = () => {
    if (result?.formatted) {
      const number = result.formatted.replace("T", "");
      window.open(`https://www.invoice-kohyo.nta.go.jp/regno-search/detail?selRegNo=${number}`, "_blank");
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
            <li><Link href="/generator" className="hover:text-kon">計算・生成</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">インボイス番号検証</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-kon mb-2">インボイス番号検証</h1>
          <p className="text-gray-600 text-lg">適格請求書発行事業者番号チェック</p>
        </header>

        <div className="mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              登録番号（T + 13桁）
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="T1234567890123 または 1234567890123"
              className="w-full px-4 py-3 text-xl font-mono border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
              maxLength={20}
            />
          </div>

          <button
            onClick={handleValidate}
            className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
          >
            検証する
          </button>
        </section>

        {result && (
          <section className={`rounded-2xl p-6 mb-6 ${result.isValid ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{result.isValid ? "✅" : "❌"}</span>
              <div>
                <p className="font-bold text-lg">{result.isValid ? "形式OK" : "エラー"}</p>
                <p className="font-mono text-xl">{result.formatted}</p>
              </div>
            </div>
            
            <ul className="space-y-1 mb-4">
              {result.messages.map((msg, i) => (
                <li key={i} className={`text-sm ${msg.includes("エラー") || msg.includes("注意") ? "text-red-600" : "text-gray-600"}`}>
                  {msg}
                </li>
              ))}
            </ul>

            {result.isValid && (
              <button
                onClick={openNTA}
                className="w-full py-3 bg-white border-2 border-kon text-kon rounded-xl font-bold hover:bg-kon hover:text-white transition-all"
              >
                国税庁サイトで登録状況を確認 →
              </button>
            )}
          </section>
        )}

        <section className="bg-sakura/20 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-kon mb-3">インボイス番号とは？</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>・2023年10月から始まったインボイス制度の登録番号</li>
            <li>・「T」＋13桁の数字で構成</li>
            <li>・法人は法人番号、個人は新規発番される番号</li>
            <li>・請求書に記載が必要（仕入税額控除の要件）</li>
          </ul>
        </section>

        <section className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-bold text-kon mb-3">サンプル番号（テスト用）</h3>
          <div className="space-y-2">
            <button
              onClick={() => setInput("T2021001052596")}
              className="block w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-100 font-mono text-sm"
            >
              T2021001052596（国税庁）
            </button>
            <button
              onClick={() => setInput("T6010001008844")}
              className="block w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-100 font-mono text-sm"
            >
              T6010001008844（トヨタ自動車）
            </button>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai">← 計算・生成ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
