'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('ツールについて');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `お名前: ${name}\nメールアドレス: ${email}\n件名: ${subject}\n\n${message}`;
    const mailtoUrl = `mailto:support@yamada-tools.jp?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-kon focus:border-kon dark:bg-gray-700 dark:text-white"
          placeholder="山田 太郎"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-kon focus:border-kon dark:bg-gray-700 dark:text-white"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          件名
        </label>
        <select
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-kon focus:border-kon dark:bg-gray-700 dark:text-white"
        >
          <option value="ツールについて">ツールについて</option>
          <option value="不具合報告">不具合報告</option>
          <option value="機能リクエスト">機能リクエスト</option>
          <option value="法人のお問い合わせ">法人のお問い合わせ</option>
          <option value="その他">その他</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          メッセージ <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-kon focus:border-kon dark:bg-gray-700 dark:text-white resize-y"
          placeholder="お問い合わせ内容をご記入ください"
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors"
      >
        送信する
      </button>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        ※ お使いのメールアプリが起動します
      </p>
    </form>
  );
}
