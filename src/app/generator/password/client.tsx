"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function PasswordClient({ faq }: Props) {
  const [length, setLength] = useState(16);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("設定を選んでパスワードを生成してね！");
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = "";
    
    if (useLowercase) charset += LOWERCASE;
    if (useUppercase) charset += UPPERCASE;
    if (useNumbers) charset += NUMBERS;
    if (useSymbols) charset += SYMBOLS;

    if (excludeAmbiguous) {
      charset = charset.replace(/[0OIl1|]/g, "");
    }

    if (charset.length === 0) {
      setMascotState("error");
      setMascotMessage("文字種を1つ以上選んでね！");
      return;
    }

    // Use crypto API for secure random
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);
    setPasswordHistory(prev => [result, ...prev.slice(0, 9)]);
    setCopied(false);
    setMascotState("success");
    setMascotMessage("安全なパスワード生成完了！");
  }, [length, useLowercase, useUppercase, useNumbers, useSymbols, excludeAmbiguous]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setMascotMessage("コピーしました！");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMascotMessage("コピーに失敗しました...");
    }
  };

  const getStrengthLevel = (): { level: string; color: string; width: string } => {
    let score = 0;
    
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (useLowercase && useUppercase) score++;
    if (useNumbers) score++;
    if (useSymbols) score++;

    if (score <= 2) return { level: "弱い", color: "bg-red-500", width: "25%" };
    if (score <= 3) return { level: "普通", color: "bg-yellow-500", width: "50%" };
    if (score <= 4) return { level: "強い", color: "bg-blue-500", width: "75%" };
    return { level: "とても強い", color: "bg-green-500", width: "100%" };
  };

  const strength = getStrengthLevel();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm" aria-label="パンくずリスト">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/generator" className="hover:text-kon">計算・生成ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">パスワード生成</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-kon mb-2">パスワード生成</h1>
          <p className="text-gray-600 text-lg">安全なランダムパスワードを瞬時に作成</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">🎲 暗号学的乱数</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Mascot */}
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Password Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">生成されたパスワード</label>
            <div className="relative">
              <input
                type="text"
                value={password}
                readOnly
                placeholder="パスワードがここに表示されます"
                className="w-full p-4 pr-24 text-lg font-mono bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
              />
              <button
                onClick={() => copyToClipboard(password)}
                disabled={!password}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  password
                    ? copied
                      ? "bg-green-500 text-white"
                      : "bg-kon text-white hover:bg-ai"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {copied ? "✓ コピー済" : "コピー"}
              </button>
            </div>
          </div>

          {/* Strength Indicator */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">パスワード強度</span>
              <span className={`font-medium ${
                strength.level === "弱い" ? "text-red-500" :
                strength.level === "普通" ? "text-yellow-600" :
                strength.level === "強い" ? "text-blue-500" : "text-green-500"
              }`}>{strength.level}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
          </div>

          {/* Length Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">文字数</label>
              <span className="text-2xl font-bold text-kon">{length}</span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-kon"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">使用する文字</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                useLowercase ? "bg-kon/10 border-2 border-kon" : "bg-gray-50 border-2 border-transparent"
              }`}>
                <input
                  type="checkbox"
                  checked={useLowercase}
                  onChange={(e) => setUseLowercase(e.target.checked)}
                  className="sr-only"
                />
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                  useLowercase ? "bg-kon text-white" : "bg-gray-200"
                }`}>
                  {useLowercase && "✓"}
                </span>
                <div>
                  <div className="font-medium text-sm">小文字</div>
                  <div className="text-xs text-gray-500">a-z</div>
                </div>
              </label>

              <label className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                useUppercase ? "bg-kon/10 border-2 border-kon" : "bg-gray-50 border-2 border-transparent"
              }`}>
                <input
                  type="checkbox"
                  checked={useUppercase}
                  onChange={(e) => setUseUppercase(e.target.checked)}
                  className="sr-only"
                />
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                  useUppercase ? "bg-kon text-white" : "bg-gray-200"
                }`}>
                  {useUppercase && "✓"}
                </span>
                <div>
                  <div className="font-medium text-sm">大文字</div>
                  <div className="text-xs text-gray-500">A-Z</div>
                </div>
              </label>

              <label className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                useNumbers ? "bg-kon/10 border-2 border-kon" : "bg-gray-50 border-2 border-transparent"
              }`}>
                <input
                  type="checkbox"
                  checked={useNumbers}
                  onChange={(e) => setUseNumbers(e.target.checked)}
                  className="sr-only"
                />
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                  useNumbers ? "bg-kon text-white" : "bg-gray-200"
                }`}>
                  {useNumbers && "✓"}
                </span>
                <div>
                  <div className="font-medium text-sm">数字</div>
                  <div className="text-xs text-gray-500">0-9</div>
                </div>
              </label>

              <label className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                useSymbols ? "bg-kon/10 border-2 border-kon" : "bg-gray-50 border-2 border-transparent"
              }`}>
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={(e) => setUseSymbols(e.target.checked)}
                  className="sr-only"
                />
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                  useSymbols ? "bg-kon text-white" : "bg-gray-200"
                }`}>
                  {useSymbols && "✓"}
                </span>
                <div>
                  <div className="font-medium text-sm">記号</div>
                  <div className="text-xs text-gray-500">!@#$%...</div>
                </div>
              </label>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-6">
            <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              excludeAmbiguous ? "bg-orange-50 border-2 border-orange-300" : "bg-gray-50 border-2 border-transparent"
            }`}>
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="sr-only"
              />
              <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                excludeAmbiguous ? "bg-orange-500 text-white" : "bg-gray-200"
              }`}>
                {excludeAmbiguous && "✓"}
              </span>
              <div>
                <div className="font-medium text-sm">紛らわしい文字を除外</div>
                <div className="text-xs text-gray-500">0, O, I, l, 1, | を除外</div>
              </div>
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePassword}
            className="w-full py-4 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors text-lg"
          >
            🔐 パスワードを生成
          </button>
        </section>

        {/* Password History */}
        {passwordHistory.length > 0 && (
          <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-kon mb-4 text-lg">生成履歴（最新10件）</h2>
            <div className="space-y-2">
              {passwordHistory.map((pw, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1 font-mono text-sm truncate">{pw}</span>
                  <button
                    onClick={() => copyToClipboard(pw)}
                    className="px-3 py-1 bg-kon text-white rounded text-xs hover:bg-ai transition-colors"
                  >
                    コピー
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">※ 履歴はページを閉じると消えます</p>
          </section>
        )}

        {/* Tips */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-4 text-lg">💡 安全なパスワードのコツ</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>12文字以上を使用する（16文字以上が理想）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>大文字・小文字・数字・記号を組み合わせる</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>サービスごとに異なるパスワードを使用する</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>パスワードマネージャーで管理する</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">✗</span>
              <span>個人情報（誕生日、名前など）を含めない</span>
            </li>
          </ul>
        </section>

        {/* How to Use */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>パスワードの長さをスライダーで設定</li>
            <li>使用する文字種を選択</li>
            <li>「パスワードを生成」をクリック</li>
            <li>「コピー」ボタンでクリップボードにコピー</li>
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
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-bold text-sm mb-1">プライバシー保護</h3>
            <p className="text-xs text-gray-500">サーバーに送信されません</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🎲</div>
            <h3 className="font-bold text-sm mb-1">暗号学的乱数</h3>
            <p className="text-xs text-gray-500">安全な乱数生成</p>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai transition-colors">
            ← 計算・生成ツール一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
