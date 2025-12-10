"use client";

import { useState } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

export default function JsonFormatClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("JSONを入力してね！");

  const format = () => {
    if (!input.trim()) {
      setError("JSONを入力してください");
      setMascotState("error");
      setMascotMessage("JSONを入力してね！");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
      setMascotState("success");
      setMascotMessage("整形完了！");
    } catch (e) {
      setError(`無効なJSON: ${(e as Error).message}`);
      setOutput("");
      setMascotState("error");
      setMascotMessage("JSONの形式が正しくないよ...");
    }
  };

  const minify = () => {
    if (!input.trim()) {
      setError("JSONを入力してください");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
      setMascotState("success");
      setMascotMessage("圧縮完了！");
    } catch (e) {
      setError(`無効なJSON: ${(e as Error).message}`);
      setOutput("");
      setMascotState("error");
      setMascotMessage("JSONの形式が正しくないよ...");
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setMascotMessage("コピーしたよ！");
  };

  const loadSample = () => {
    setInput(JSON.stringify({
      name: "山田太郎",
      age: 30,
      email: "yamada@example.com",
      skills: ["JavaScript", "Python", "React"],
      address: {
        city: "東京",
        zip: "100-0001"
      }
    }));
    setOutput("");
    setError("");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/generator" className="hover:text-kon">計算・生成ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">JSON整形</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">{ }</div>
          <h1 className="text-3xl font-bold text-kon mb-2">JSON整形</h1>
          <p className="text-gray-600 text-lg">フォーマット・圧縮・バリデーション</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={loadSample} className="px-4 py-2 bg-sakura/30 text-kon rounded-lg hover:bg-sakura/50">
              サンプル
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm text-gray-600">インデント:</label>
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="px-2 py-1 border border-gray-200 rounded-lg"
              >
                <option value={2}>2スペース</option>
                <option value={4}>4スペース</option>
                <option value={1}>タブ</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">入力</label>
              <textarea
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(""); }}
                placeholder='{"key": "value"}'
                className="w-full h-80 p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-xl resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">出力</label>
              <div className="relative">
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-80 p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-xl resize-none"
                />
                {output && (
                  <button
                    onClick={copyOutput}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
                  >
                    コピー
                  </button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={format}
              className="flex-1 py-3 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold hover:shadow-lg"
            >
              整形（Format）
            </button>
            <button
              onClick={minify}
              className="flex-1 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200"
            >
              圧縮（Minify）
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
