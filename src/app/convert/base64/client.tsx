"use client";

import { useState } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

export default function Base64Client({
 faq }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("テキストを入力してね！");

  const encode = () => {
    if (!input.trim()) {
      setMascotState("error");
      setMascotMessage("テキストを入力してね！");
      return;
    }
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError("");
      setMascotState("success")
      triggerSuccess('base64');;
      setMascotMessage("エンコード完了！");
    } catch {
      setError("エンコードに失敗しました");
      setMascotState("error");
      setMascotMessage("エラーが発生したよ...");
    }
  };

  const decode = () => {
    if (!input.trim()) {
      setMascotState("error");
      setMascotMessage("Base64を入力してね！");
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(input.trim())));
      setOutput(decoded);
      setError("");
      setMascotState("success")
      triggerSuccess('base64');;
      setMascotMessage("デコード完了！");
    } catch {
      setError("無効なBase64文字列です");
      setMascotState("error");
      setMascotMessage("正しいBase64を入力してね...");
    }
  };

  const convert = () => {
    if (mode === "encode") encode();
    else decode();
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setMascotMessage("コピーしたよ！");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setMascotState("idle");
    setMascotMessage("テキストを入力してね！");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">


        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-kon mb-2">Base64変換</h1>
          <p className="text-gray-600 text-lg">エンコード・デコード</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">日本語対応</span>
          </div>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode("encode"); setOutput(""); setError(""); }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                mode === "encode" ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              エンコード
            </button>
            <button
              onClick={() => { setMode("decode"); setOutput(""); setError(""); }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                mode === "decode" ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              デコード
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === "encode" ? "テキスト" : "Base64"}
            </label>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setOutput(""); setError(""); }}
              placeholder={mode === "encode" ? "変換するテキストを入力..." : "Base64文字列を入力..."}
              className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon resize-none font-mono text-sm"
            />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={convert}
              className="flex-1 py-3 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold hover:shadow-lg"
            >
              {mode === "encode" ? "エンコード" : "デコード"}
            </button>
            <button onClick={swap} className="px-4 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">
              入れ替え
            </button>
            <button onClick={clearAll} className="px-4 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">
              クリア
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {output && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">結果</label>
                <button onClick={copyOutput} className="text-xs text-kon hover:text-ai">コピー</button>
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm"
              />
            </div>
          )}
        </section>

        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3">使用例</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>・データURIスキームの作成（画像をBase64化）</p>
            <p>・APIでのバイナリデータ送信</p>
            <p>・メールの添付ファイルエンコード</p>
            <p>・認証トークンの生成</p>
          </div>
        </section>

        {faq && faq.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問</h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <details key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
                  <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                    <span>Q. {item.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">A. {item.answer}</div>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 text-center">
          <Link href="/convert" className="text-kon hover:text-ai">← 変換ツール一覧に戻る</Link>
        </div>
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
