"use client";

import { useState } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

type CaseType = "upper" | "lower" | "title" | "sentence" | "toggle" | "capitalize";

const caseOptions: { id: CaseType; label: string; desc: string }[] = [
  { id: "upper", label: "UPPERCASE", desc: "すべて大文字" },
  { id: "lower", label: "lowercase", desc: "すべて小文字" },
  { id: "title", label: "Title Case", desc: "各単語の先頭を大文字" },
  { id: "sentence", label: "Sentence case", desc: "文頭のみ大文字" },
  { id: "toggle", label: "tOGGLE cASE", desc: "大小文字を反転" },
  { id: "capitalize", label: "Capitalize", desc: "先頭のみ大文字" },
];

export default function TextCaseClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("テキストを入力してね！");

  const convert = (type: CaseType) => {
    if (!input.trim()) {
      setMascotState("error");
      setMascotMessage("テキストを入力してね！");
      return;
    }

    let result = "";
    switch (type) {
      case "upper":
        result = input.toUpperCase();
        break;
      case "lower":
        result = input.toLowerCase();
        break;
      case "title":
        result = input.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        break;
      case "sentence":
        result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case "toggle":
        result = input.split("").map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
        break;
      case "capitalize":
        result = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
        break;
    }

    setOutput(result);
    setMascotState("success");
    setMascotMessage("変換完了！");
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setMascotMessage("コピーしたよ！");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/generator" className="hover:text-kon">計算・生成ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">大文字・小文字変換</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">Aa</div>
          <h1 className="text-3xl font-bold text-kon mb-2">大文字・小文字変換</h1>
          <p className="text-gray-600 text-lg">テキストのケースを変換</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">入力テキスト</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="変換したいテキストを入力..."
              className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-kon"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {caseOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => convert(opt.id)}
                className="p-3 bg-gray-100 hover:bg-kon hover:text-white rounded-xl transition-all text-left"
              >
                <div className="font-bold text-sm">{opt.label}</div>
                <div className="text-xs opacity-70">{opt.desc}</div>
              </button>
            ))}
          </div>

          {output && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">変換結果</label>
                <button onClick={copyOutput} className="text-xs text-kon hover:text-ai">コピー</button>
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none"
              />
            </div>
          )}
        </section>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai">← 計算・生成ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
