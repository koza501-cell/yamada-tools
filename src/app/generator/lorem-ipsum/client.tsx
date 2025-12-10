"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

const loremParagraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
];

const japaneseParagraphs = [
  "山田太郎は朝早く起きて、窓の外を眺めた。空は青く澄み渡り、小鳥たちが楽しそうにさえずっていた。",
  "今日は大切な会議がある。彼は急いで朝食を済ませ、駅に向かった。電車は予定通りに到着した。",
  "会社に着くと、同僚たちが既に準備を進めていた。プレゼンテーションの資料は完璧に仕上がっていた。",
  "会議は成功に終わった。クライアントからの評価も上々で、チーム全員が安堵の表情を浮かべた。",
  "仕事を終えた山田は、帰り道でお気に入りのカフェに立ち寄った。温かいコーヒーが心を癒してくれた。",
];

type Lang = "latin" | "japanese";
type Unit = "paragraphs" | "sentences" | "words";

export default function LoremIpsumClient() {
  const [lang, setLang] = useState<Lang>("japanese");
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [count, setCount] = useState(3);
  const [result, setResult] = useState("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("ダミーテキストを生成しよう！");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) generate();
  }, [lang, unit, count, mounted]);

  const generate = () => {
    const paragraphs = lang === "latin" ? loremParagraphs : japaneseParagraphs;
    let output = "";

    if (unit === "paragraphs") {
      const selected = [];
      for (let i = 0; i < count; i++) {
        selected.push(paragraphs[i % paragraphs.length]);
      }
      output = selected.join("\n\n");
    } else if (unit === "sentences") {
      const allSentences = paragraphs.join(" ").split(/[.。]/).filter(s => s.trim());
      const selected = [];
      for (let i = 0; i < count; i++) {
        selected.push(allSentences[i % allSentences.length]);
      }
      output = selected.join(lang === "latin" ? ". " : "。") + (lang === "latin" ? "." : "。");
    } else {
      const allWords = paragraphs.join(" ").split(/\s+/);
      output = allWords.slice(0, count).join(" ");
    }

    setResult(output);
    setMascotState("success");
    setMascotMessage("テキストを生成したよ！");
  };

  const copyResult = async () => {
    await navigator.clipboard.writeText(result);
    setMascotMessage("コピーしたよ！");
  };

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
            <li className="text-kon font-medium">ダミーテキスト</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-kon mb-2">ダミーテキスト生成</h1>
          <p className="text-gray-600 text-lg">Lorem Ipsum / 日本語</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">言語</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLang("japanese")}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    lang === "japanese" ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  日本語
                </button>
                <button
                  onClick={() => setLang("latin")}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    lang === "latin" ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Lorem
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">単位</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl"
              >
                <option value="paragraphs">段落</option>
                <option value="sentences">文</option>
                <option value="words">単語</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">数: {count}</label>
              <input
                type="range"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full accent-kon"
              />
            </div>
          </div>

          <div className="relative">
            <textarea
              value={result}
              readOnly
              className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none"
            />
            <button
              onClick={copyResult}
              className="absolute top-2 right-2 px-3 py-1 bg-kon text-white rounded-lg text-sm hover:bg-ai"
            >
              コピー
            </button>
          </div>

          <button
            onClick={generate}
            className="w-full mt-4 py-3 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold hover:shadow-lg"
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
