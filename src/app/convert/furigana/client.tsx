"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import RelatedTools, { relatedToolSets } from "@/components/common/RelatedTools";

interface ConversionDetail {
  original: string;
  reading: string;
  katakana: string;
  hiragana: string;
  romaji: string;
}

interface ConversionResult {
  original: string;
  converted: string;
  details: ConversionDetail[];
}

export default function FuriganaClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("漢字を入力してね！");

  const [inputText, setInputText] = useState("");
  const [outputType, setOutputType] = useState<"hiragana" | "katakana" | "romaji">("hiragana");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConvert = async () => {
    if (!inputText.trim()) {
      setMascotState("error");
      setMascotMessage("テキストを入力してね！");
      return;
    }

    setIsLoading(true);
    setMascotState("working");
    setMascotMessage("変換中...");

    try {
      const response = await fetch("https://api.yamada-tools.jp/api/convert/furigana", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          output_type: outputType,
        }),
      });

      if (!response.ok) {
        throw new Error("変換に失敗しました");
      }

      const data = await response.json();
      setResult(data);
      setMascotState("success");
      setMascotMessage("変換完了！");
    } catch (error) {
      console.error(error);
      setMascotState("error");
      setMascotMessage("エラーが発生しました...");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.converted) {
      navigator.clipboard.writeText(result.converted);
      setCopied(true);
      setMascotMessage("コピーしたよ！");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSample = (text: string) => {
    setInputText(text);
    setResult(null);
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
            <li className="text-kon font-medium">ふりがな変換</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">あ</div>
          <h1 className="text-3xl font-bold text-kon mb-2">ふりがな変換</h1>
          <p className="text-gray-600 text-lg">漢字にふりがなを自動付与</p>
        </header>

        <div className="mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          {/* Output Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              出力形式
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setOutputType("hiragana")}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  outputType === "hiragana"
                    ? "bg-kon text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ひらがな
              </button>
              <button
                onClick={() => setOutputType("katakana")}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  outputType === "katakana"
                    ? "bg-kon text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                カタカナ
              </button>
              <button
                onClick={() => setOutputType("romaji")}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  outputType === "romaji"
                    ? "bg-kon text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ローマ字
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              変換するテキスト
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="漢字を含むテキストを入力してください..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon resize-none"
              maxLength={5000}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {inputText.length} / 5000
            </p>
          </div>

          <button
            onClick={handleConvert}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLoading ? "変換中..." : "ふりがなを付ける"}
          </button>
        </section>

        {/* Result */}
        {result && (
          <section className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-kon">変換結果</h3>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-kon text-white rounded-lg text-sm hover:bg-kon/90"
              >
                {copied ? "✓ コピー済み" : "コピー"}
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {result.converted}
              </p>
            </div>

            {/* Details */}
            {result.details.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">漢字の読み方</h4>
                <div className="flex flex-wrap gap-2">
                  {result.details.map((detail, index) => (
                    <div
                      key={index}
                      className="bg-white px-3 py-2 rounded-lg text-sm border"
                    >
                      <ruby>
                        <span className="font-medium">{detail.original}</span>
                        <rp>(</rp>
                        <rt className="text-xs text-gray-500">{detail.hiragana}</rt>
                        <rp>)</rp>
                      </ruby>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Sample Texts */}
        <section className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-kon mb-3">サンプルテキスト</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleSample("東京都渋谷区で働いています。")}
              className="block w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-100 text-sm"
            >
              東京都渋谷区で働いています。
            </button>
            <button
              onClick={() => handleSample("私は毎朝六時に起きて朝食を食べます。")}
              className="block w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-100 text-sm"
            >
              私は毎朝六時に起きて朝食を食べます。
            </button>
            <button
              onClick={() => handleSample("日本の四季は美しいです。春には桜が咲きます。")}
              className="block w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-100 text-sm"
            >
              日本の四季は美しいです。春には桜が咲きます。
            </button>
          </div>
        </section>

        {/* Usage Info */}
        <section className="bg-sakura/20 rounded-xl p-6">
          <h3 className="font-bold text-kon mb-3">使い方</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>・漢字を含むテキストを入力してください</li>
            <li>・出力形式（ひらがな/カタカナ/ローマ字）を選択</li>
            <li>・「ふりがなを付ける」ボタンをクリック</li>
            <li>・結果をコピーして使用できます</li>
          </ul>
        </section>

        {/* Related Tools */}
        <RelatedTools tools={relatedToolSets.furigana} title="あわせて使えるツール" />

        {/* SEO Content: Use Cases */}
        <section className="bg-white rounded-xl p-6 mb-6 border border-gray-200 mt-6">
          <h2 className="text-xl font-bold text-kon mb-4">🎯 こんな場面で便利</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-kon mb-2">📚 教育現場</h3>
              <p className="text-sm text-gray-600">小学校の教材作成、日本語学習者向けの資料にふりがなを追加。難読漢字も一瞬でルビ付けできます。</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-kon mb-2">👔 ビジネス文書</h3>
              <p className="text-sm text-gray-600">取引先の人名・社名の読み方確認。間違った読み方を防ぎ、ビジネスマナーを守れます。</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-kon mb-2">🗾 地名・住所</h3>
              <p className="text-sm text-gray-600">難読地名の読み方を確認。配送伝票や宛名書きの際に役立ちます。</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-kon mb-2">🌐 外国人向け資料</h3>
              <p className="text-sm text-gray-600">外国人従業員や観光客向けの案内文にふりがなを追加。多文化共生をサポートします。</p>
            </div>
          </div>
        </section>

        {/* SEO Content: FAQ */}
        <section className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-bold text-kon mb-4">❓ よくある質問</h2>
          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-bold cursor-pointer text-kon">人名も正確に変換できますか？</summary>
              <p className="mt-2 text-sm text-gray-600">一般的な読み方には対応していますが、珍しい読み方（「大輔」を「だいすけ」ではなく「ひろき」と読むなど）は異なる場合があります。重要な場面では本人に確認することをお勧めします。</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-bold cursor-pointer text-kon">ひらがな以外にも変換できますか？</summary>
              <p className="mt-2 text-sm text-gray-600">はい、ひらがな・カタカナ・ローマ字の3種類に変換可能です。用途に合わせて選択してください。</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-bold cursor-pointer text-kon">長文でも変換できますか？</summary>
              <p className="mt-2 text-sm text-gray-600">はい、文章全体を一括でふりがな変換できます。レポートや記事など、長い文章でも問題ありません。</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-bold cursor-pointer text-kon">入力したテキストは保存されますか？</summary>
              <p className="mt-2 text-sm text-gray-600">いいえ、入力されたテキストは変換処理後すぐに削除されます。日本国内サーバーで処理され、プライバシーは完全に保護されています。</p>
            </details>
          </div>
        </section>

        {/* SEO Content: Tips */}
        <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-kon mb-3">💡 ふりがな変換のコツ</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• <strong>人名の場合</strong>：複数の読み方がある漢字は、一般的な読み方で変換されます。「太郎」は「たろう」、「花子」は「はなこ」など。</li>
            <li>• <strong>専門用語</strong>：医学用語や法律用語など、専門的な読み方も多くカバーしています。</li>
            <li>• <strong>旧字体</strong>：「國」→「くに」、「會」→「かい」など旧字体にも対応しています。</li>
            <li>• <strong>一括変換</strong>：1文字ずつではなく、文章全体をコピペして一括変換すると効率的です。</li>
          </ul>
        </section>

        <div className="mt-8 text-center">
          <Link href="/convert" className="text-kon hover:text-ai">← 変換ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
