"use client";

import { useState, useEffect } from "react";
import { FAQSection } from "@/components/FAQSection";
import {
  AGE_LABELS,
  SCENE_LABELS,
  YOUSU_LABELS,
  getTemplates,
  checkNgWords,
} from "@/data/renrakucho";
import type { Age, Scene, Yousu, NgWord } from "@/data/renrakucho";

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

// ─── Static data ──────────────────────────────────────────────────────────────
const FAQ = [
  { question: "連絡帳はどんな構成で書けばいい?", answer: "「事実(what happened) → 子どもの内面(how they felt) → 保育士からの一言」の3要素が基本です。具体的な観察事実と子どもの感情、保育士の温かい受けとめがバランスよく入っていると、保護者に伝わりやすくなります。" },
  { question: "ネガティブな出来事をどう書けばいい?", answer: "「できなかった」ではなく「これから挑戦していきます」と前向きに、具体的な状況と保育士のサポート姿勢を伝えるのがコツです。本ツールにはNG表現チェック機能があります。" },
  { question: "個人情報を入力してもいい?", answer: "入力しないでください。本ツールはブラウザ上でのみ動作し、入力内容はサーバーに送信されませんが、お子さまの個人情報は伏せてご利用ください。" },
  { question: "文例をそのまま使っても大丈夫?", answer: "あくまで参考用の文例です。実際のお子さまの様子に合わせて加筆・修正の上、園の連絡帳基準に従ってご使用ください。" },
  { question: "0歳児と5歳児で書き方を変えるべき?", answer: "年齢に応じた発達段階を意識した観察事実が大切です。0歳児は身体的発達や情緒の安定、5歳児は社会性や役割意識など、発達課題に沿った視点で書くと保護者にも伝わりやすくなります。" },
];

const SAMPLE_ROWS = [
  { age: "0歳児", scene: "遊び",     sample: "今日は音のなる玩具を両手で握り、カチカチと音を楽しんでいました。保育士の歌に合わせて手足を動かし、にこにこと笑顔を見せてくれました。" },
  { age: "1歳児", scene: "食事",     sample: "スプーンに興味を持ち、自分でつかもうとする仕草が見られました。少しこぼしながらも、一生懸命口に運ぶ姿が頼もしかったです。" },
  { age: "2歳児", scene: "トラブル", sample: "お友達と砂場道具の取り合いになる場面がありましたが、保育士が間に入ると「どうぞ」と渡してくれました。" },
  { age: "3歳児", scene: "成長",     sample: "今日初めて自分でボタンを留めることができました! ゆっくりと指先を動かして、できたときの「やった!」という表情が忘れられません。" },
  { age: "4歳児", scene: "行事",     sample: "運動会の練習でかけっこを頑張りました。「次は1位を目指す!」とやる気いっぱいでした。本番が楽しみですね。" },
  { age: "5歳児", scene: "友達と",   sample: "年下のお友達に優しく接する姿が見られました。「こうやって描くんだよ」とそっと教えてあげていました。お兄さん・お姉さんとしての自覚が育っています。" },
];

const NG_CATEGORY_LABELS: Record<string, string> = {
  negative:  'ネガティブ表現',
  kimetsuke: '決めつけ表現',
  shukan:    '主観的評価',
  meirei:    '命令的表現',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function RenrakuchoClient() {
  const [mounted, setMounted]         = useState(false);
  const [age, setAge]                 = useState<Age>('age3');
  const [scene, setScene]             = useState<Scene>('asobi');
  const [yousu, setYousu]             = useState<Yousu | null>(null);
  const [memo, setMemo]               = useState('');
  const [results, setResults]         = useState<string[]>([]);
  const [variantIdx, setVariantIdx]   = useState(0);
  const [copied, setCopied]           = useState(false);
  const [checkInput, setCheckInput]   = useState('');
  const [checkResult, setCheckResult] = useState<NgWord[] | null>(null);
  const [checkDone, setCheckDone]     = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function handleGenerate() {
    const variants = getTemplates(age, scene, yousu);
    if (variants.length === 0) {
      setResults(['この組み合わせの文例はまだ準備中です。']);
      setVariantIdx(0);
      return;
    }
    const shown = variants.slice(0, 3).map((fn) => fn({ memo }));
    setResults(shown);
    setVariantIdx(0);
  }

  function handleNextVariant() {
    if (results.length === 0) return;
    setVariantIdx((prev) => (prev + 1) % results.length);
  }

  function handleCopy() {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results[variantIdx]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleCheckNg() {
    setCheckResult(checkNgWords(checkInput));
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
          <span>連絡帳 文例ジェネレーター</span>
        </nav>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 print-hide">
          連絡帳 文例ジェネレーター【0歳〜5歳・シーン別】
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 print-hide">
          保育園・こども園の連絡帳に使える文例を年齢・シーン別に即生成。コピー1タップで時短。
        </p>

        {/* ── Section 1: Settings ─────────────────────────────────────────── */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 print-hide">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">設定</h2>

          {/* Age */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">年齢</p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(AGE_LABELS) as [Age, string][]).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setAge(k)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    age === k
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
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">シーン</p>
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

          {/* Yousu */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              子どもの様子 <span className="font-normal text-xs text-gray-400">（任意・クリックで解除）</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(YOUSU_LABELS) as [Yousu, string][]).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setYousu(yousu === k ? null : k)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    yousu === k
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Memo */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              メモ <span className="font-normal text-xs text-gray-400">（任意）</span>
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={2}
              placeholder="例: 砂場でお団子を作って嬉しそうでした"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            📝 文例を生成
          </button>
        </section>

        {/* ── Section 2: Generated Results ──────────────────────────────────── */}
        {results.length > 0 && (
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">生成された文例</h2>

            <div className="space-y-3 mb-4">
              {results.map((text, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-4 border-l-4 transition-colors ${
                    i === variantIdx
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/40'
                  }`}
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{text}</p>
                  {i === variantIdx && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Icons.Copy />
                      {copied ? 'コピーしました ✓' : '📋 コピー'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              ※文例は参考用です。実際のお子さまの様子に応じて加筆・修正の上、園の連絡帳基準に従ってご使用ください。<br />
              ※お子さまの個人情報は入力しないでください。本ツールはブラウザ上のみで動作します。
            </p>

            <div className="flex flex-wrap gap-2">
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

        {/* ── Section 3: NG Checker ────────────────────────────────────────── */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 print-hide">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">NG表現チェッカー</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            あなたの連絡帳にネガティブ表現・決めつけ・主観的評価・命令的表現が含まれていないかチェックします。
          </p>
          <textarea
            value={checkInput}
            onChange={(e) => { setCheckInput(e.target.value); setCheckDone(false); }}
            rows={3}
            placeholder="チェックしたい連絡帳の文を貼り付けてください"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none mb-3"
          />
          <button
            type="button"
            onClick={handleCheckNg}
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
                        🔴 {NG_CATEGORY_LABELS[f.category]}: 「{f.word}」
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
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">連絡帳の書き方ガイド</h2>

          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">連絡帳とは</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            連絡帳は保育士と保護者が毎日子どもの様子を共有するための記録ツールです。「事実 → 内面の考察 → 受けとめ」の3要素を意識すると、温かみのある伝わる文章になります。
          </p>

          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">書く際の5W1Hポイント</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {[
              { w: 'When',  j: 'いつ',           ex: '午前10時の自由遊び中' },
              { w: 'Where', j: 'どこで',          ex: '砂場・ホール・お部屋' },
              { w: 'Who',   j: 'だれが',          ex: 'お子さま・お友達と' },
              { w: 'What',  j: 'なにを',          ex: 'ブロック・絵本・砂遊び' },
              { w: 'Why',   j: 'どのような気持ちで', ex: '楽しそうに・集中して' },
              { w: 'How',   j: 'どのように',      ex: '自分でやり遂げた' },
            ].map((item) => (
              <div key={item.w} className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3">
                <p className="font-bold text-sky-700 dark:text-sky-400 text-sm">
                  {item.w} <span className="font-normal text-gray-500 dark:text-gray-400 text-xs">({item.j})</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.ex}</p>
              </div>
            ))}
          </div>

          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">良い文例 vs 避けたい文例</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-50 dark:bg-sky-900/30">
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">避けたい例</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">良い例</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { bad: '今日は食事ができませんでした。', good: '今日は食事に時間がかかりましたが、最後まで座っていることができました。' },
                  { bad: 'いつもおとなしいです。',        good: '今日は積み木遊びに集中して、じっくり取り組んでいました。' },
                  { bad: 'お友達と仲良くできない子です。', good: 'お友達と玩具の取り合いになる場面があり、気持ちを言葉で伝える練習をしています。' },
                ].map((row, i) => (
                  <tr key={i} className="even:bg-gray-50 dark:even:bg-gray-750">
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-red-600 dark:text-red-400">{row.bad}</td>
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-green-700 dark:text-green-400">{row.good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">保護者に伝わる言葉選び</h3>
          <ol className="space-y-2">
            {[
              { title: '肯定的・前向きに書く',         desc: '困った行動も「〜しようとしています」「〜の練習をしています」と成長の文脈で伝える。' },
              { title: '観察事実と評価を分ける',        desc: '「走り回っていた（事実）」「元気に過ごしていました（評価）」のように区別する。' },
              { title: '保護者の気持ちに寄り添う一言', desc: '「明日も元気に待っています」「ご家庭でも楽しかったことを聞いてみてください」を添えると温かみが増す。' },
            ].map((p, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                <span><strong>{p.title}</strong> — {p.desc}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Section 5: Age-based samples ─────────────────────────────────── */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 print-hide">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">年齢別 よくある文例</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-50 dark:bg-sky-900/30">
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 w-16">年齢</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 w-20">シーン</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">文例</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_ROWS.map((r, i) => (
                  <tr key={i} className="even:bg-gray-50 dark:even:bg-gray-750">
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{r.age}</td>
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{r.scene}</td>
                    <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-600 dark:text-gray-400">{r.sample}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <div className="print-hide"><FAQSection faq={FAQ} title="よくある質問" /></div>

      </div>
    </main>
  );
}
