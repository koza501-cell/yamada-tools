"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

export default function VerticalTextClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("縦書き文書を作成しよう！");

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(2);
  const [fontFamily, setFontFamily] = useState("serif");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => {
    if (!text) {
      setMascotState("error");
      setMascotMessage("テキストを入力してね！");
      return;
    }
    window.print();
  };

  const sampleText = `吾輩は猫である。名前はまだ無い。
どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。
吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。`;

  const loadSample = () => {
    setTitle("吾輩は猫である");
    setAuthor("夏目漱石");
    setText(sampleText);
    setMascotState("success");
    setMascotMessage("サンプルを読み込んだよ！");
  };

  if (!mounted) return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center">読み込み中...</div></div>;

  return (
    <div className="min-h-screen py-12 print:py-0 print:bg-white">
      <div className="max-w-4xl mx-auto px-4 print:max-w-none">
        <nav className="mb-6 text-sm print:hidden">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/document" className="hover:text-kon">書類作成</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">縦書き文書</li>
          </ol>
        </nav>

        <header className="text-center mb-8 print:hidden">
          <div className="text-5xl mb-4">📜</div>
          <h1 className="text-3xl font-bold text-kon mb-2">縦書き文書作成</h1>
          <p className="text-gray-600 text-lg">小説・手紙・詩に</p>
        </header>

        <div className="print:hidden mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 print:hidden">
          <div className="flex gap-2 mb-4">
            <button onClick={loadSample} className="px-4 py-2 bg-sakura/30 text-kon rounded-lg hover:bg-sakura/50">
              サンプル読み込み
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
            <input type="text" placeholder="著者名" value={author} onChange={(e) => setAuthor(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4"
            placeholder="縦書きにしたいテキストを入力..."
          />

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">文字サイズ: {fontSize}px</label>
              <input type="range" min="12" max="24" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-kon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">行間: {lineHeight}</label>
              <input type="range" min="1.5" max="3" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="w-full accent-kon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">フォント</label>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                <option value="serif">明朝体</option>
                <option value="sans-serif">ゴシック体</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 print:shadow-none print:border-0 overflow-x-auto">
          <div
            className="min-h-96 p-8"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "upright",
              fontFamily: fontFamily,
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
            }}
          >
            {title && (
              <h2 className="text-xl font-bold mb-4" style={{ fontSize: `${fontSize + 4}px` }}>
                {title}
              </h2>
            )}
            {author && (
              <p className="text-sm opacity-70 mb-8">{author}</p>
            )}
            <div className="whitespace-pre-wrap">
              {text || "テキストを入力すると、ここに縦書きで表示されます。"}
            </div>
          </div>
        </div>

        <div className="print:hidden">
          <button onClick={handlePrint} className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg">
            印刷 / PDF保存
          </button>
        </div>

        <div className="mt-8 text-center print:hidden">
          <Link href="/document" className="text-kon hover:text-ai">← 書類作成一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
