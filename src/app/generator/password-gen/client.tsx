"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

export default function PasswordGenClient() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("パスワードを生成しよう！");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) generatePassword();
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous, mounted]);

  const generatePassword = () => {
    let chars = "";
    if (useUpper) chars += excludeAmbiguous ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) chars += excludeAmbiguous ? "abcdefghjkmnpqrstuvwxyz" : "abcdefghijklmnopqrstuvwxyz";
    if (useNumbers) chars += excludeAmbiguous ? "23456789" : "0123456789";
    if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      setPassword("");
      setStrength(0);
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);

    // Calculate strength
    let score = 0;
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (useUpper && useLower) score += 1;
    if (useNumbers) score += 1;
    if (useSymbols) score += 1;
    setStrength(Math.min(score, 5));

    setMascotState("success");
    setMascotMessage("新しいパスワードを生成したよ！");
  };

  const copyPassword = async () => {
    await navigator.clipboard.writeText(password);
    setMascotMessage("コピーしたよ！");
  };

  const strengthLabels = ["非常に弱い", "弱い", "普通", "強い", "非常に強い", "最強"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500", "bg-emerald-500"];

  if (!mounted) {
    return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center">読み込み中...</div></div>;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/generator" className="hover:text-kon">計算・生成ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">パスワード生成</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-kon mb-2">パスワード生成</h1>
          <p className="text-gray-600 text-lg">安全なランダムパスワード</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2">
              <code className="flex-1 text-green-400 font-mono text-lg break-all">{password || "---"}</code>
              <button onClick={copyPassword} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm">
                コピー
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">強度</span>
              <span className="text-sm font-medium">{strengthLabels[strength]}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${strengthColors[strength]} transition-all`} style={{ width: `${(strength + 1) * 16.66}%` }} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">長さ: {length}文字</label>
              <input
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-kon"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "大文字 (A-Z)", state: useUpper, setter: setUseUpper },
                { label: "小文字 (a-z)", state: useLower, setter: setUseLower },
                { label: "数字 (0-9)", state: useNumbers, setter: setUseNumbers },
                { label: "記号 (!@#$...)", state: useSymbols, setter: setUseSymbols },
              ].map((opt) => (
                <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={opt.state}
                    onChange={(e) => opt.setter(e.target.checked)}
                    className="w-5 h-5 accent-kon"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="w-5 h-5 accent-kon"
              />
              <span className="text-sm">紛らわしい文字を除外 (0,O,l,1,I)</span>
            </label>
          </div>

          <button
            onClick={generatePassword}
            className="w-full mt-6 py-3 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold hover:shadow-lg"
          >
            再生成
          </button>
        </section>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai">← 計算・生成ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
