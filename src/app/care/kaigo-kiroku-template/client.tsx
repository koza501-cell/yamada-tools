"use client";

import { useState, useEffect } from "react";
import { FAQSection } from "@/components/FAQSection";
import {
  SERVICE_LABELS,
  SCENE_LABELS,
  FORMAT_LABELS,
  JOUKYOU_LABELS,
  TEMPLATES_BY_FORMAT,
  FORBIDDEN_WORDS,
  checkForbiddenWords,
} from "@/data/kaigo-kiroku";
import type { Service, Scene, Format, Joukyou, ForbiddenWord } from "@/data/kaigo-kiroku";

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  Refresh: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  ),
};

// ─── Constants ────────────────────────────────────────────────────────────────
const FAQ = [
  { question: "SOAPとは何ですか?", answer: "Subjective（主観的情報）、Objective（客観的情報）、Assessment（評価）、Plan（計画）の頭文字で、介護・医療現場で広く使われる記録形式です。利用者の発言と観察事実を分けて整理できます。" },
  { question: "介護記録に書いてはいけない言葉は?", answer: "侮蔑的表現（「ボケ」「徘徊」など）、命令的表現（「させる」「してやる」）、医学的診断、主観的評価（「かわいい」「可哀想」）は避けるべきとされています。本ツールには禁止用語チェック機能があります。" },
  { question: "利用者の個人情報を入力してもいい?", answer: "入力しないでください。本ツールはブラウザ上のみで動作し、入力内容はサーバーへ送信されませんが、念のため個人情報は伏せてご利用ください。" },
  { question: "法律で介護記録は何年保管が必要?", answer: "介護保険法に基づき、サービス完結日から原則2年間（自治体により5年）の保管義務があります。詳細は事業所所在の市町村にご確認ください。" },
  { question: "文例をそのまま使用していい?", answer: "文例は参考用です。実際の利用者の状況に応じて加筆・修正の上、事業所の記録基準に従ってご使用ください。" },
];

const SAMPLE_RECORDS = [
  { scene: "食事",         sample: "○時、昼食を提供。主食7割、副食5割摂取。むせ込みなく自力摂取できていた。" },
  { scene: "入浴",         sample: "○時、一般浴を実施。全身洗浄を一部介助で行う。湯温40度、入浴時間15分。" },
  { scene: "排泄",         sample: "○時、トイレへ誘導。立ち上がりを一部介助。排尿あり、性状異常なし。" },
  { scene: "服薬",         sample: "○時、朝食後の薬を手渡し。水でゆっくり服用確認。残薬なし。" },
  { scene: "レクリエーション", sample: "○時、体操レクに参加。30分間、自力で実施。表情穏やか。" },
  { scene: "バイタル測定", sample: "○時、バイタル測定。体温36.5℃、血圧128/78、脈拍72、SpO2 98%。異常なし。" },
  { scene: "転倒・ヒヤリ", sample: "○時、居室前でヒヤリ報告。立ち上がりのふらつき。外傷なし、バイタル正常。報告書作成。" },
];

const CATEGORY_LABELS: Record<string, string> = {
  bubetsu: '侮蔑的',
  meirei:  '命令的',
  igaku:   '医学的判断',
  shukan:  '主観的',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function KaigoKirokuClient() {
  const [mounted, setMounted]         = useState(false);
  const [service, setService]         = useState<Service>('houmon');
  const [scene, setScene]             = useState<Scene>('shokuji');
  const [format, setFormat]           = useState<Format>('soap');
  const [joukyou, setJoukyou]         = useState<Joukyou | null>(null);
  const [memo, setMemo]               = useState('');
  const [time, setTime]               = useState('');
  const [generated, setGenerated]     = useState('');
  const [variantIdx, setVariantIdx]   = useState(0);
  const [copied, setCopied]           = useState(false);
  const [checkInput, setCheckInput]   = useState('');
  const [checkResult, setCheckResult] = useState<ForbiddenWord[] | null>(null);
  const [checkDone, setCheckDone]     = useState(false);

  useEffect(() => {
    const now = new Date();
    const hh  = String(now.getHours()).padStart(2, '0');
    const mm  = String(now.getMinutes()).padStart(2, '0');
    setTime(`${hh}:${mm}`);
    setMounted(true);
  }, []);

  function getVariants(idx: number) {
    const jKey = joukyou ?? 'jiritsu';
    const sceneMap = TEMPLATES_BY_FORMAT[format][scene];
    return sceneMap[jKey] ?? sceneMap['jiritsu'] ?? [];
  }

  function handleGenerate() {
    const variants = getVariants(0);
    const newIdx = 0;
    setVariantIdx(newIdx);
    if (variants.length === 0) {
      setGenerated('この組み合わせの文例はまだ準備中です。');
      return;
    }
    setGenerated(variants[newIdx]({ time: time || '00:00', memo, service }));
  }

  function handleNextVariant() {
    const variants = getVariants(variantIdx);
    if (variants.length === 0) return;
    const nextIdx = (variantIdx + 1) % variants.length;
    setVariantIdx(nextIdx);
    setGenerated(variants[nextIdx]({ time: time || '00:00', memo, service }));
  }

  function handleCopy() {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleCheckForbidden() {
    setCheckResult(checkForbiddenWords(checkInput));
    setCheckDone(true);
  }

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 dark:text-gray-400 mb-4 print-hide">
          <a href="/" className="hover:underline">ホーム</a>
          <span className="mx-1">&gt;</span>
          <a href="/care" className="hover:underline">介護・保育</a>
          <span className="mx-1">&gt;</span>
          <span>介護記録 テンプレート</span>
        </nav>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 print-hide">
          介護記録 テンプレート ジェネレーター【SOAP・5W1H対応】
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 print-hide">
          場面を選ぶだけで、適切な介護記録の文例を即生成。SOAP形式・5W1H・シンプル形式に対応。禁止用語チェッカー付き。
        </p>

        {/* ── Section 1: Settings ─────────────────────────────────────────── */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 print-hide">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">設定</h2>

          {/* Service */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">サービス種別</p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(SERVICE_LABELS) as [Service, string][]).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setService(k)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    service === k
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-900/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Scene */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">場面</p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(SCENE_LABELS) as [Scene, string][]).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setScene(k)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    scene === k
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-900/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">形式</p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(FORMAT_LABELS) as [Format, string][]).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFormat(k)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    format === k
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Joukyou */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              利用者状況 <span className="font-normal text-xs text-gray-400">（任意・クリックで解除）</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(JOUKYOU_LABELS) as [Joukyou, string][]).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setJoukyou(joukyou === k ? null : k)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    joukyou === k
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">時刻</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Memo */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              状況メモ <span className="font-normal text-xs text-gray-400">（任意）</span>
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={2}
              placeholder="例: 食事中にむせ込みあり、水分を追加"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            📝 記録を生成
          </button>
        </section>

        {/* ── Section 2: Generated Result ──────────────────────────────────── */}
        {generated && (
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 border-sky-500 border border-gray-200 dark:border-gray-700 p-5 mb-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">生成された記録</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono leading-relaxed mb-3">
              {generated}
            </pre>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              ※生成された文例は参考用です。実際の利用者の状況に応じて加筆・修正の上、事業所の記録基準に従ってご使用ください。<br />
              ※個人情報は入力しないでください。本ツールはブラウザ上のみで動作します。
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <Icons.Copy />
                {copied ? 'コピーしました ✓' : '📋 コピー'}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
              >
                🖨️ 印刷
              </button>
              <button
                type="button"
                onClick={handleNextVariant}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-sky-100 hover:bg-sky-200 dark:bg-sky-900/30 dark:hover:bg-sky-800/40 text-sky-700 dark:text-sky-300 transition-colors"
              >
                <Icons.Refresh />
                別パターンを見る
              </button>
            </div>
          </section>
        )}

        {/* ── Section 3: Forbidden Word Checker ───────────────────────────── */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 print-hide">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">禁止用語チェック</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            あなたの記録に侮蔑的・命令的・医学的断定・主観的表現が含まれていないかチェックします。
          </p>
          <textarea
            value={checkInput}
            onChange={(e) => { setCheckInput(e.target.value); setCheckDone(false); }}
            rows={3}
            placeholder="チェックしたい記録文を貼り付けてください"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none mb-3"
          />
          <button
            type="button"
            onClick={handleCheckForbidden}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          >
            チェックする
          </button>
          {checkDone && checkResult !== null && (
            <div className="mt-4">
              {checkResult.length === 0 ? (
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-medium">
                  <Icons.Check />
                  ✅ 問題のある表現は見つかりませんでした。
                </div>
              ) : (
                <div className="space-y-2">
                  {checkResult.map((f, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <span className="text-red-600 dark:text-red-400 font-medium flex items-center gap-1 flex-shrink-0">
                        <Icons.Alert />
                        🔴 {CATEGORY_LABELS[f.category]}: 「{f.word}」
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 sm:ml-2">→ {f.suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── Section 4: Writing Guide ─────────────────────────────────────── */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 print-hide">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">介護記録の書き方ガイド</h2>

          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">SOAP形式とは</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-50 dark:bg-sky-900/30">
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 w-10">記号</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 w-28">項目</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">内容</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">例</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: 'S', name: 'Subjective', desc: '利用者・家族の発言・訴え',   ex: '「足が痛い」との訴えあり' },
                  { k: 'O', name: 'Objective',  desc: '観察・測定できる客観的事実', ex: '右足首に腫脹あり、バイタル正常' },
                  { k: 'A', name: 'Assessment', desc: '情報を分析した評価・判断',   ex: '転倒の影響が疑われる' },
                  { k: 'P', name: 'Plan',        desc: '今後の対応・計画',          ex: '看護師へ報告、冷却処置' },
                ].map((row) => (
                  <tr key={row.k} className="even:bg-gray-50 dark:even:bg-gray-750">
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 font-bold text-sky-600 dark:text-sky-400">{row.k}</td>
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300">{row.name}</td>
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-600 dark:text-gray-400">{row.desc}</td>
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-500 dark:text-gray-500 text-xs hidden sm:table-cell">{row.ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">5W1H形式とは</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {[
              { w: 'When',  j: 'いつ',     ex: '○時' },
              { w: 'Where', j: 'どこで',   ex: '食堂・居室' },
              { w: 'Who',   j: 'だれが',   ex: '利用者本人' },
              { w: 'What',  j: 'なにを',   ex: '昼食' },
              { w: 'Why',   j: 'なぜ',     ex: '通常の食事提供' },
              { w: 'How',   j: 'どのように', ex: '一部介助で摂取' },
            ].map((item) => (
              <div key={item.w} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                <p className="font-bold text-indigo-700 dark:text-indigo-400 text-sm">
                  {item.w} <span className="font-normal text-gray-500 dark:text-gray-400 text-xs">({item.j})</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.ex}</p>
              </div>
            ))}
          </div>

          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">書く際の3つのポイント</h3>
          <ol className="space-y-2 mb-6">
            {[
              { title: '客観的に書く',         desc: '「〜だった」「〜と思う」ではなく、見た・聞いた・測定した事実を記録する。' },
              { title: '5W1Hを意識する',        desc: 'いつ・どこで・だれが・なにを・なぜ・どのようにを明確にする。' },
              { title: '利用者の言葉を引用する', desc: '発言は「」で囲み、評価や解釈は分けて記録する。' },
            ].map((p, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                <span><strong>{p.title}</strong> — {p.desc}</span>
              </li>
            ))}
          </ol>

          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">避けるべき表現</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-red-50 dark:bg-red-900/20">
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">カテゴリ</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">NG例</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">推奨表現</th>
                </tr>
              </thead>
              <tbody>
                {FORBIDDEN_WORDS.slice(0, 6).map((f, i) => (
                  <tr key={i} className="even:bg-gray-50 dark:even:bg-gray-750">
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-xs text-gray-500 dark:text-gray-400">{CATEGORY_LABELS[f.category]}</td>
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-red-600 dark:text-red-400">「{f.word}」</td>
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-green-700 dark:text-green-400">{f.suggestion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 5: Sample Records ────────────────────────────────────── */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 print-hide">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">よくある場面別 文例</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-50 dark:bg-sky-900/30">
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 w-28">場面</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">シンプル文例</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_RECORDS.map((r, i) => (
                  <tr key={i} className="even:bg-gray-50 dark:even:bg-gray-750">
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{r.scene}</td>
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-600 dark:text-gray-400">{r.sample}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Blog callout */}
        <section className="mt-12 print-hide">
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 dark:border-sky-800 dark:bg-sky-950/50">
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">📖 もっと詳しく</p>
            <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
              介護記録の書き方 — SOAP形式と避けたい表現の完全ガイド
            </h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              SOAP・5W1Hの違いから、絶対NG用語の代替表現、法的保存期間まで完全解説。
            </p>
            <a
              href="/blog/kaigo-kiroku-kakikata-soap"
              className="mt-4 inline-flex items-center gap-1 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              解説記事を読む →
            </a>
          </div>
        </section>

        {/* FAQ */}
        <div className="print-hide"><FAQSection faq={FAQ} title="よくある質問" /></div>

      </div>
    </main>
  );
}
