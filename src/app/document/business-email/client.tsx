"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

const templates = [
  {
    id: "meeting",
    name: "会議日程調整",
    subject: "【日程調整のお願い】会議について",
    body: `○○株式会社
○○部 ○○様

お世話になっております。
株式会社△△の□□です。

会議の日程調整をさせていただきたく、ご連絡いたしました。

下記の日程でご都合のよろしい日時をお知らせいただけますでしょうか。

【候補日時】
・○月○日（○）○○:○○〜
・○月○日（○）○○:○○〜
・○月○日（○）○○:○○〜

ご多忙のところ恐れ入りますが、
ご検討のほどよろしくお願いいたします。`,
  },
  {
    id: "thanks",
    name: "お礼メール",
    subject: "【御礼】本日のお打ち合わせについて",
    body: `○○株式会社
○○部 ○○様

お世話になっております。
株式会社△△の□□です。

本日はお忙しい中、お時間をいただき誠にありがとうございました。

大変参考になるお話を伺うことができました。
いただいたご意見を踏まえ、社内で検討を進めてまいります。

今後とも何卒よろしくお願い申し上げます。`,
  },
  {
    id: "apology",
    name: "お詫びメール",
    subject: "【お詫び】○○の件について",
    body: `○○株式会社
○○部 ○○様

お世話になっております。
株式会社△△の□□です。

このたびは、○○の件につきまして、
多大なるご迷惑をおかけしましたこと、深くお詫び申し上げます。

原因を調査いたしましたところ、○○であることが判明いたしました。
今後このようなことがないよう、対策を講じてまいります。

重ねてお詫び申し上げますとともに、
今後とも変わらぬお引き立てを賜りますようお願い申し上げます。`,
  },
  {
    id: "request",
    name: "依頼メール",
    subject: "【ご依頼】○○のお願い",
    body: `○○株式会社
○○部 ○○様

お世話になっております。
株式会社△△の□□です。

○○の件につきまして、ご依頼させていただきたくご連絡いたしました。

【依頼内容】
○○

【期限】
○月○日（○）

ご多忙のところ誠に恐縮ではございますが、
ご検討いただけますと幸いです。

何卒よろしくお願い申し上げます。`,
  },
  {
    id: "inquiry",
    name: "問い合わせ",
    subject: "【お問い合わせ】○○について",
    body: `○○株式会社
ご担当者様

お世話になっております。
株式会社△△の□□と申します。

貴社の○○について、お問い合わせさせていただきます。

【お問い合わせ内容】
○○

お手数をおかけいたしますが、
ご回答いただけますと幸いです。

何卒よろしくお願いいたします。`,
  },
];

export default function BusinessEmailClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("テンプレートを選んでね！");

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [signature, setSignature] = useState("");

  useEffect(() => {
    setMounted(true);
    setSignature(`──────────────────
株式会社○○
○○部 ○○
Email: xxx@example.com
TEL: 03-xxxx-xxxx
──────────────────`);
  }, []);

  const loadTemplate = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      setSelectedTemplate(id);
      setSubject(template.subject);
      setBody(template.body);
      setMascotState("success");
      setMascotMessage("テンプレートを読み込んだよ！");
    }
  };

  const copyEmail = async () => {
    const fullEmail = `件名: ${subject}\n\n${body}\n\n${signature}`;
    await navigator.clipboard.writeText(fullEmail);
    setMascotMessage("コピーしたよ！");
  };

  const copyBody = async () => {
    const fullBody = `${body}\n\n${signature}`;
    await navigator.clipboard.writeText(fullBody);
    setMascotMessage("本文をコピーしたよ！");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/document" className="hover:text-kon">書類作成</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">ビジネスメール作成</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-3xl font-bold text-kon mb-2">ビジネスメール作成</h1>
          <p className="text-gray-600 text-lg">敬語テンプレート</p>
        </header>

        <div className="mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-kon mb-4">テンプレート選択</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => loadTemplate(t.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedTemplate === t.id ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="件名を入力..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm"
                placeholder="本文を入力..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">署名</label>
              <textarea
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={copyEmail}
              className="flex-1 py-3 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold hover:shadow-lg"
            >
              全体をコピー
            </button>
            <button
              onClick={copyBody}
              className="flex-1 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200"
            >
              本文のみコピー
            </button>
          </div>
        </section>

        <section className="bg-sakura/20 rounded-xl p-6">
          <h3 className="font-bold text-kon mb-3">ビジネスメールのポイント</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>・件名は具体的かつ簡潔に</li>
            <li>・宛名は「○○株式会社 ○○様」の形式で</li>
            <li>・「お世話になっております」で始める</li>
            <li>・結びは「よろしくお願いいたします」</li>
            <li>・署名を必ず入れる</li>
          </ul>
        </section>

        <div className="mt-8 text-center">
          <Link href="/document" className="text-kon hover:text-ai">← 書類作成一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
