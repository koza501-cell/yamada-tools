"use client";

import { useState, useEffect } from "react";
import { FAQSection } from "@/components/FAQSection";
import { checkAllergens, hasNuts, ALLERGENS } from "@/data/allergens";
import type { AllergenHit } from "@/data/allergens";

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  ),
  Printer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect width="12" height="8" x="6" y="14"/>
    </svg>
  ),
};

// ─── Static data ──────────────────────────────────────────────────────────────
const FAQ = [
  { question: "義務表示の9品目は何ですか?", answer: "えび・かに・くるみ・カシューナッツ・小麦・そば・卵・乳・落花生の9品目です(令和8年4月1日改正でカシューナッツが追加)。これらは食品表示法で必ず表示が義務付けられています。" },
  { question: "推奨表示の20品目は?", answer: "アーモンド、あわび、いか、いくら、オレンジ、キウイ、牛肉、ごま、さけ、さば、大豆、鶏肉、バナナ、ピスタチオ、豚肉、マカダミアナッツ、もも、やまいも、りんご、ゼラチンです(令和8年4月1日改正でピスタチオが追加、カシューナッツが義務に格上げされました)。" },
  { question: "このツールで命の安全は保証できますか?", answer: "いいえ。本ツールは原材料表示の概要チェック用です。実際の食品提供は必ず医師の生活管理指導表と現物の食品ラベルを確認してください。" },
  { question: "コンタミネーション(交差汚染)は検出できますか?", answer: "できません。原材料に直接記載のないコンタミネーションリスクは、製造元への問い合わせや「同じ製造ラインで○○を使用」の表記を確認してください。" },
  { question: "入力した情報はサーバーに送信されますか?", answer: "いいえ。本ツールはブラウザ上でのみ動作し、入力内容はサーバーへ送信されません。" },
];

const HIDDEN_TABLE = [
  { allergen: "卵",   examples: "マヨネーズ、ハム、かまぼこ、洋菓子" },
  { allergen: "乳",   examples: "バター、チーズ、ホエイ、カゼイン、生クリーム、ホットケーキミックス" },
  { allergen: "小麦", examples: "醤油、味噌、麦茶、麩、麺類、パン粉" },
  { allergen: "大豆", examples: "醤油、味噌、豆腐、きなこ、油揚げ、大豆油" },
  { allergen: "ごま", examples: "ごま油、ごま和え、ごまだれ、タヒニ、シリアル" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AllergyCheckerClient() {
  const [mounted, setMounted]         = useState(false);
  const [input, setInput]             = useState('');
  const [hits, setHits]               = useState<AllergenHit[] | null>(null);
  const [copied, setCopied]           = useState(false);
  const [emptyError, setEmptyError]   = useState(false);
  const [allergenTab, setAllergenTab] = useState<'gimu' | 'suishou'>('gimu');

  useEffect(() => { setMounted(true); }, []);

  function handleCheck() {
    if (!input.trim()) { setEmptyError(true); return; }
    setEmptyError(false);
    setHits(checkAllergens(input));
  }

  function handleClear() {
    setInput('');
    setHits(null);
    setEmptyError(false);
  }

  function handleCopy() {
    if (!hits) return;
    const gimuHits = hits.filter(h => h.allergen.severity === 'gimu');
    const suishouHits = hits.filter(h => h.allergen.severity === 'suishou');
    const lines: string[] = ['【食物アレルギー チェッカー 結果】', ''];
    if (gimuHits.length > 0) {
      lines.push('■ 義務表示8品目 検出: ' + gimuHits.map(h => h.allergen.mainLabel).join('、'));
    }
    if (suishouHits.length > 0) {
      lines.push('■ 推奨表示20品目 検出: ' + suishouHits.map(h => h.allergen.mainLabel).join('、'));
    }
    if (hits.length === 0) {
      lines.push('検出されたアレルゲンはありません');
    }
    lines.push('');
    hits.forEach(h => {
      lines.push('[' + h.allergen.mainLabel + '] 検出箇所: ' + h.matches.slice(0, 5).join('、'));
    });
    lines.push('');
    lines.push('※本ツールは概要チェック用です。必ず現物の食品ラベルと医師の生活管理指導表を確認してください。');
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!mounted) return <div className="min-h-screen" />;

  const gimuHits     = hits?.filter(h => h.allergen.severity === 'gimu')    ?? [];
  const suishouHits  = hits?.filter(h => h.allergen.severity === 'suishou') ?? [];
  const gimuAllergens    = ALLERGENS.filter(a => a.severity === 'gimu');
  const suishouAllergens = ALLERGENS.filter(a => a.severity === 'suishou');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 dark:text-gray-400 mb-4 print-hide">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/care" className="hover:underline">介護・保育</a>
        <span className="mx-1">&gt;</span>
        <span className="text-gray-900 dark:text-white">食物アレルギー チェッカー</span>
      </nav>

      {/* H1 */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 print-hide">
        食物アレルギー チェッカー【29品目対応・無料】
      </h1>

      {/* Lead */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 print-hide">
        原材料を貼り付けるだけで義務9品目・推奨20品目(計29品目)を自動チェック。令和8年4月1日改正対応(カシューナッツ義務化・ピスタチオ追加)。
      </p>

      {/* Disclaimer banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg p-4 print-hide">
        <div className="flex items-start gap-2">
          <span className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"><Icons.Alert /></span>
          <div className="text-sm">
            <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">重要な免責事項</p>
            <p className="text-amber-700 dark:text-amber-400">本ツールは原材料表示の概要チェック用です。食物アレルギーをお持ちの方への食品提供は、必ず医師の生活管理指導表と現物の食品ラベルを確認してください。生命に関わる判断には使用しないでください。</p>
            <p className="text-amber-600 dark:text-amber-500 mt-1 text-xs">※令和8年4月1日改正対応（カシューナッツ義務化・ピスタチオ追加） ※ブラウザ上のみで動作、入力内容はサーバーへ送信されません。</p>
          </div>
        </div>
      </div>

      {/* Section 1: Input */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 print-hide">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">食品の原材料を入力</h2>
        <textarea
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="例: 小麦粉, 卵, 砂糖, バター, 醤油, ナッツ類"
          value={input}
          onChange={e => { setInput(e.target.value); if (emptyError) setEmptyError(false); }}
          rows={4}
        />
        {emptyError && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1">原材料を入力してください</p>
        )}
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={handleCheck}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            <Icons.Search />
            チェックする
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            クリア
          </button>
        </div>
      </section>

      {/* Section 2: Results — NO print-hide (this section prints) */}
      {hits !== null && (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">チェック結果</h2>

          {/* Print-only disclaimer */}
          <div className="hidden print:block bg-amber-50 border border-amber-300 rounded p-3 text-xs text-amber-800">
            ⚠️ 本ツールは概要チェック用です。必ず現物の食品ラベルと医師の生活管理指導表を確認してください。
          </div>

          {gimuHits.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="font-bold text-red-700 dark:text-red-400 text-sm mb-2">🔴 義務表示 8品目 検出</p>
              <div className="flex flex-wrap gap-2">
                {gimuHits.map(h => (
                  <span key={h.allergen.id} className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {h.allergen.mainLabel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {suishouHits.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="font-bold text-yellow-700 dark:text-yellow-400 text-sm mb-2">🟡 推奨表示 20品目 検出</p>
              <div className="flex flex-wrap gap-2">
                {suishouHits.map(h => (
                  <span key={h.allergen.id} className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {h.allergen.mainLabel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hits.length === 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="font-bold text-green-700 dark:text-green-400 text-sm">✅ 検出されたアレルゲンはありません</p>
              <p className="text-green-600 dark:text-green-500 text-xs mt-1">注意: 本ツールは概要チェック用です。現物の食品ラベルも必ずご確認ください。</p>
            </div>
          )}

          {hits.length > 0 && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400">検出詳細</div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {hits.map(h => (
                  <div key={h.allergen.id} className="px-4 py-3 flex items-start gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ${h.allergen.severity === 'gimu' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'}`}>
                      {h.allergen.severity === 'gimu' ? '義務' : '推奨'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{h.allergen.mainLabel}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">
                        検出箇所: {h.matches.slice(0, 5).join('、')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hits.length > 0 && hasNuts(hits) && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-sm text-orange-700 dark:text-orange-400">
              ⚠️ コンタミネーション注意: 複数のナッツ類が検出されました。他のナッツ類との交差感作にも注意してください。
            </div>
          )}

          <div className="flex gap-2 mt-2 print-hide">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? <Icons.Check /> : <Icons.Copy />}
              {copied ? 'コピー済み' : '結果をコピー'}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Icons.Printer />
              印刷
            </button>
          </div>
        </section>
      )}

      {/* Section 3: 29品目一覧 */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 print-hide">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">29品目 一覧</h2>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setAllergenTab('gimu')}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${allergenTab === 'gimu' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            義務 9品目
          </button>
          <button
            type="button"
            onClick={() => setAllergenTab('suishou')}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${allergenTab === 'suishou' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            推奨 20品目
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(allergenTab === 'gimu' ? gimuAllergens : suishouAllergens).map(a => (
            <div key={a.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{a.mainLabel}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{a.aliases.slice(0, 3).join('・')}</p>
              {a.note && <p className="text-xs text-sky-600 dark:text-sky-400 mt-0.5">{a.note}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: 解説 */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 print-hide">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">アレルゲン解説</h2>
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">義務表示と推奨表示の違い</h3>
            <p>食品表示法では、特にアレルギー症状が重篤になりやすい9品目を「義務表示」として必ず食品ラベルへの記載を義務付けています。推奨表示の20品目は、可能な限り表示することが推奨されていますが法律上の義務ではありません。</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">改正履歴</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>令和8年4月1日：カシューナッツが推奨から義務に格上げ、ピスタチオが推奨に追加</li>
              <li>令和5年3月：くるみが推奨から義務に格上げ</li>
              <li>令和6年3月：マカダミアナッツが推奨に追加、まつたけが推奨から削除</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">「特定原材料を含む」表示の見方</h3>
            <p>「醤油（大豆・小麦を含む）」のように、加工品の原材料に括弧書きで表示されることがあります。代替表記（例：卵→玉子、乳→バター）にも注意が必要です。</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">コンタミネーションとは</h3>
            <p>同一製造ラインや同一工場で異なるアレルゲンを含む食品が製造される場合、微量のアレルゲンが混入するリスクがあります。「同じ設備で〇〇を含む製品を製造しています」といった注意書きを確認してください。</p>
          </div>
        </div>
      </section>

      {/* Section 5: 隠れ場所テーブル */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 print-hide">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">よくあるアレルゲンの隠れ場所</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="text-left px-3 py-2 text-gray-700 dark:text-gray-300 font-semibold w-1/4">アレルゲン</th>
                <th className="text-left px-3 py-2 text-gray-700 dark:text-gray-300 font-semibold">含まれる加工品の例</th>
              </tr>
            </thead>
            <tbody>
              {HIDDEN_TABLE.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                  <td className="px-3 py-2 font-semibold text-gray-900 dark:text-white">{row.allergen}</td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{row.examples}</td>
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
            食物アレルギー表示の完全ガイド【令和8年4月1日改正対応】
          </h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            義務9品目・推奨20品目の隠れた成分、改正履歴、コンタミネーション対策まで完全解説。
          </p>
          <a
            href="/blog/shokumotsu-allergy-28hinmoku"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            解説記事を読む →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <div className="print-hide">
        <FAQSection faq={FAQ} title="よくある質問" />
      </div>

    </div>
  );
}
