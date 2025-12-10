"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Mascot from "@/components/common/Mascot";

const presets = [
  { name: "メールアドレス", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { name: "電話番号", pattern: "0\\d{1,4}-\\d{1,4}-\\d{4}" },
  { name: "郵便番号", pattern: "\\d{3}-\\d{4}" },
  { name: "URL", pattern: "https?://[\\w/:%#\\$&\\?\\(\\)~\\.=\\+\\-]+" },
  { name: "日付(YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
];

export default function RegexTestClient() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (!pattern || !testString) return { matches: [], highlighted: testString };

    try {
      const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("");
      const regex = new RegExp(pattern, flagStr);
      const matches: { match: string; index: number; groups?: string[] }[] = [];
      
      let match;
      const tempRegex = new RegExp(pattern, flagStr);
      
      if (flags.g) {
        while ((match = tempRegex.exec(testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match[0].length === 0) tempRegex.lastIndex++;
        }
      } else {
        match = tempRegex.exec(testString);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      // Create highlighted string
      let highlighted = testString;
      let offset = 0;
      matches.forEach((m) => {
        const start = m.index + offset;
        const end = start + m.match.length;
        const before = highlighted.slice(0, start);
        const matchPart = highlighted.slice(start, end);
        const after = highlighted.slice(end);
        const wrapped = `<mark class="bg-yellow-300 px-0.5 rounded">${matchPart}</mark>`;
        highlighted = before + wrapped + after;
        offset += wrapped.length - m.match.length;
      });

      setError("");
      return { matches, highlighted };
    } catch (e) {
      setError((e as Error).message);
      return { matches: [], highlighted: testString };
    }
  }, [pattern, testString, flags]);

  const loadPreset = (p: string) => {
    setPattern(p);
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
            <li className="text-kon font-medium">正規表現テスター</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">.*</div>
          <h1 className="text-3xl font-bold text-kon mb-2">正規表現テスター</h1>
          <p className="text-gray-600 text-lg">Regexパターンをリアルタイムテスト</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state={error ? "error" : result.matches.length > 0 ? "success" : "idle"} message={error || (result.matches.length > 0 ? `${result.matches.length}件マッチ！` : "パターンを入力してね！")} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">プリセット</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => loadPreset(p.pattern)}
                  className="px-3 py-1 bg-sakura/30 text-kon rounded-full text-sm hover:bg-sakura/50"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">正規表現パターン</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="[a-z]+"
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono"
              />
              <span className="text-gray-400">/</span>
              <div className="flex gap-1">
                {Object.entries(flags).map(([flag, enabled]) => (
                  <button
                    key={flag}
                    onClick={() => setFlags({ ...flags, [flag]: !enabled })}
                    className={`w-8 h-8 rounded font-mono text-sm ${
                      enabled ? "bg-kon text-white" : "bg-gray-100"
                    }`}
                  >
                    {flag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">テスト文字列</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="テストしたい文字列を入力..."
              className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">マッチ結果</label>
            <div 
              className="w-full min-h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: result.highlighted || '<span class="text-gray-400">結果がここに表示されます</span>' }}
            />
          </div>

          {result.matches.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-kon mb-2">マッチ詳細 ({result.matches.length}件)</h3>
              <div className="space-y-2 max-h-40 overflow-auto">
                {result.matches.map((m, i) => (
                  <div key={i} className="text-sm font-mono bg-white p-2 rounded">
                    <span className="text-gray-500">#{i + 1}</span>{" "}
                    <span className="text-kon">"{m.match}"</span>{" "}
                    <span className="text-gray-400">at index {m.index}</span>
                    {m.groups && m.groups.length > 0 && (
                      <span className="text-purple-600 ml-2">groups: [{m.groups.join(", ")}]</span>
                    )}
                  </div>
                ))}
              </div>
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
