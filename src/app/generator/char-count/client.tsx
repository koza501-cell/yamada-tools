"use client";

interface FAQ {
  question: string;
  answer: string;
}

interface SeoContent {
  intro: string;
  useCases?: { title: string; desc: string }[];
  tips?: string;
}

interface Props {
  faq?: FAQ[];
  seoContent?: SeoContent;
}

import { useState, useMemo } from "react";
import Link from "next/link";
import Mascot from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";

export default function CharCountClient({ faq, seoContent }: Props) {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const bytes = new Blob([text]).size;
    const lines = text ? text.split("\n").length : 0;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const hiragana = (text.match(/[\u3040-\u309F]/g) || []).length;
    const katakana = (text.match(/[\u30A0-\u30FF]/g) || []).length;
    const kanji = (text.match(/[\u4E00-\u9FAF]/g) || []).length;
    const alphabet = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;

    return { chars, charsNoSpace, bytes, lines, words, paragraphs, hiragana, katakana, kanji, alphabet, numbers };
  }, [text]);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">


        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔢</div>
          <h1 className="text-3xl font-bold text-kon mb-2">文字数カウント</h1>
          <p className="text-gray-600 text-lg">リアルタイムで文字数をチェック</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state="idle" message="テキストを入力すると自動でカウントするよ！" />
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ここにテキストを入力..."
            className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon resize-none mb-6"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-kon to-ai p-4 rounded-xl text-white text-center">
              <div className="text-3xl font-bold">{stats.chars}</div>
              <div className="text-sm opacity-80">文字数</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-kon">{stats.charsNoSpace}</div>
              <div className="text-sm text-gray-600">空白除外</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-kon">{stats.lines}</div>
              <div className="text-sm text-gray-600">行数</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl text-center">
              <div className="text-3xl font-bold text-kon">{stats.bytes}</div>
              <div className="text-sm text-gray-600">バイト数</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-kon mb-3">詳細</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">単語数</span><span className="font-bold">{stats.words}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">段落数</span><span className="font-bold">{stats.paragraphs}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">ひらがな</span><span className="font-bold">{stats.hiragana}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">カタカナ</span><span className="font-bold">{stats.katakana}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">漢字</span><span className="font-bold">{stats.kanji}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">英字</span><span className="font-bold">{stats.alphabet}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">数字</span><span className="font-bold">{stats.numbers}</span></div>
            </div>
          </div>

          <button type="button" onClick={() => setText("")} className="mt-4 px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            クリア
          </button>
        </section>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai">← 計算・生成ツール一覧に戻る</Link>
        </div>
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
