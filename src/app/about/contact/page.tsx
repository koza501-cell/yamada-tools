"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SUBJECTS = [
  "一般的なお問い合わせ",
  "バグ・不具合の報告",
  "機能のご要望",
  "セキュリティに関するご報告",
  "ビジネス・提携について",
  "その他",
];

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "送信に失敗しました。しばらく後でお試しください。");
        return;
      }

      router.push(`/about/contact/thanks?ref=${encodeURIComponent(data.ref)}`);
    } catch {
      setError("ネットワークエラーが発生しました。しばらく後でお試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-kon mb-2">お問い合わせ</h1>
      <p className="text-gray-600 text-sm mb-8">
        ご質問・ご要望・バグ報告などをお気軽にお送りください。
        通常 2〜3 営業日以内にご返信いたします。
      </p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
            お名前 <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            maxLength={100}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="山田 太郎"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon/30 focus:border-kon"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            メールアドレス <span className="text-danger">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            maxLength={254}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="taro@example.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon/30 focus:border-kon"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subject">
            件名 <span className="text-danger">*</span>
          </label>
          <select
            id="subject"
            required
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon/30 focus:border-kon bg-white"
          >
            <option value="">選択してください</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
            お問い合わせ内容 <span className="text-danger">*</span>
          </label>
          <textarea
            id="message"
            required
            maxLength={5000}
            rows={7}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="お問い合わせ内容をご記入ください（10文字以上）"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon/30 focus:border-kon resize-y"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{form.message.length} / 5000</p>
        </div>

        {error && (
          <div role="alert" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-kon text-white font-medium py-2.5 rounded-lg text-sm hover:bg-kon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "送信中..." : "送信する"}
        </button>
      </form>

      <div className="mt-10 text-sm text-gray-500 border-t pt-6">
        <p className="mb-2">お急ぎの場合はメールでもご連絡いただけます：</p>
        <a href="mailto:support@yamadatrade.jp" className="text-kon underline hover:text-ai">
          support@yamadatrade.jp
        </a>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-gray-400 hover:text-kon">
          ← ホームに戻る
        </Link>
      </div>
    </main>
  );
}
