"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface FAQ { question: string; answer: string; }
interface Props { faq: FAQ[]; }
type Mode = "normal" | "weighted" | "team" | "tournament";
type AnimMode = "default" | "slot" | "roulette";

export default function RandomPickerClient({ faq }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [items, setItems] = useState<string[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [inputValue, setInputValue] = useState("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("抽選する項目を追加してね！");
  const [mode, setMode] = useState<Mode>("normal");
  const [animMode, setAnimMode] = useState<AnimMode>("default");
  const [pickCount, setPickCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<string[][]>([]);
  const [shareVisible, setShareVisible] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [sharedResult, setSharedResult] = useState<{ w: string[]; c: number } | null>(null);
  const [isSpinningWheel, setIsSpinningWheel] = useState(false);
  const [wheelAngle, setWheelAngle] = useState(0);
  const [teamCount, setTeamCount] = useState(2);
  const [teamDistribution, setTeamDistribution] = useState<"equal" | "random">("equal");
  const [teamResult, setTeamResult] = useState<string[][]>([]);
  const [bracketRounds, setBracketRounds] = useState<(string | null)[][]>([]);
  const [bracketComplete, setBracketComplete] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultParam = params.get("result");
    const itemsParam = params.get("items");
    if (resultParam) {
      try { const d = JSON.parse(decodeURIComponent(atob(resultParam))); setSharedResult(d); } catch { /* ignore */ }
    }
    if (itemsParam) {
      try { const d = JSON.parse(decodeURIComponent(atob(itemsParam))); if (Array.isArray(d)) setItems(d); } catch { /* ignore */ }
    }
  }, []);

  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  const getWeight = (item: string) => weights[item] ?? 1;

  const weightedRandom = (pool: string[]): string => {
    const total = pool.reduce((s, it) => s + getWeight(it), 0);
    let r = Math.random() * total;
    for (const it of pool) { r -= getWeight(it); if (r <= 0) return it; }
    return pool[pool.length - 1];
  };

  const getPercentage = (item: string) => {
    const total = items.reduce((s, it) => s + getWeight(it), 0);
    return total === 0 ? 0 : Math.round(getWeight(item) / total * 100);
  };

  const addItem = useCallback(() => {
    const t = inputValue.trim();
    if (t && !items.includes(t)) {
      setItems(p => [...p, t]);
      setWeights(p => ({ ...p, [t]: 1 }));
      setInputValue("");
      setMascotMessage(`「${t}」を追加したよ！`);
    }
  }, [inputValue, items]);

  const addMultipleItems = useCallback((text: string) => {
    const newItems = text.split(/[\n,、\s]+/).map(i => i.trim()).filter(i => i && !items.includes(i));
    if (newItems.length > 0) {
      setItems(p => [...p, ...newItems]);
      setWeights(p => { const n = { ...p }; newItems.forEach(i => { n[i] = 1; }); return n; });
      setMascotMessage(`${newItems.length}件追加したよ！`);
    }
  }, [items]);

  const removeItem = (idx: number) => {
    const item = items[idx];
    setItems(p => p.filter((_, i) => i !== idx));
    setWeights(p => { const n = { ...p }; delete n[item]; return n; });
  };

  const setItemWeight = (item: string, w: number) => setWeights(p => ({ ...p, [item]: Math.max(1, w) }));

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === "Enter") addItem(); };
  const handlePaste = (e: React.ClipboardEvent) => {
    const t = e.clipboardData.getData("text");
    if (t.includes("\n") || t.includes(",") || t.includes("、")) { e.preventDefault(); addMultipleItems(t); }
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => addMultipleItems(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = "";
  };

  const showShare = (winners: string[], all: string[]) => {
    const enc = btoa(encodeURIComponent(JSON.stringify({ w: winners, t: Date.now(), c: all.length })));
    const url = `${window.location.origin}${window.location.pathname}?result=${enc}`;
    window.history.pushState({}, "", `?result=${enc}`);
    setShareUrl(url);
    setShareVisible(true);
  };

  const copyItemsUrl = () => {
    const enc = btoa(encodeURIComponent(JSON.stringify(items)));
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?items=${enc}`);
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const getShareText = () => results.length === 0 ? "" : `抽選結果：${results.join("、")} が当選しました！ #ランダム抽選 #山田ツール`;

  const doPickComplete = (selected: string[]) => {
    setResults(selected);
    setHistory(p => [selected, ...p.slice(0, 9)]);
    setMascotState("success");
    triggerSuccess("random-picker");
    setMascotMessage(selected.length === 1 ? `「${selected[0]}」に決定！🎉` : `${selected.length}人選ばれたよ！🎉`);
    showShare(selected, items);
  };

  const pickRandom = () => {
    if (animMode === "roulette") { pickRoulette(); return; }
    if (items.length === 0) { setMascotState("error"); setMascotMessage("項目を追加してね！"); return; }
    if (pickCount > items.length) { setMascotState("error"); setMascotMessage(`項目が${items.length}個しかないよ！`); return; }
    setIsSpinning(true);
    setMascotState("working");
    setMascotMessage("抽選中...");
    setResults([]);
    setShareVisible(false);
    let elapsed = 0;
    const iv = setInterval(() => {
      elapsed += 100;
      setResults([items[Math.floor(Math.random() * items.length)]]);
      if (elapsed >= 2000) {
        clearInterval(iv);
        let selected: string[];
        if (mode === "weighted") {
          const pool = [...items];
          selected = [];
          for (let i = 0; i < pickCount; i++) {
            const picked = weightedRandom(pool.filter(p => !selected.includes(p)));
            selected.push(picked);
          }
        } else {
          selected = shuffle(items).slice(0, pickCount);
        }
        setIsSpinning(false);
        doPickComplete(selected);
      }
    }, 100);
  };

  const pickRoulette = async () => {
    if (items.length === 0) { setMascotState("error"); setMascotMessage("項目を追加してね！"); return; }
    setIsSpinningWheel(true);
    setMascotState("working");
    setMascotMessage("ルーレット回転中...");
    setResults([]);
    setShareVisible(false);
    const selected = mode === "weighted" ? weightedRandom(items) : shuffle(items)[0];
    const segAngle = 360 / items.length;
    const itemIdx = items.indexOf(selected);
    const targetAngle = wheelAngle + (5 + Math.random() * 5) * 360 + (360 - itemIdx * segAngle - segAngle / 2);
    setWheelAngle(targetAngle);
    await new Promise(r => setTimeout(r, 4000));
    setIsSpinningWheel(false);
    doPickComplete([selected]);
  };

  const clearAll = () => {
    setItems([]); setWeights({}); setResults([]); setTeamResult([]); setBracketRounds([]);
    setShareVisible(false); setMascotState("idle"); setMascotMessage("抽選する項目を追加してね！");
  };

  const formTeams = () => {
    if (items.length < 2) { setMascotState("error"); setMascotMessage("2人以上追加してね！"); return; }
    const shuffled = shuffle(items);
    const teams: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((item, i) => {
      teams[teamDistribution === "equal" ? i % teamCount : Math.floor(Math.random() * teamCount)].push(item);
    });
    setTeamResult(teams);
    setMascotState("success");
    setMascotMessage(`${teamCount}チームに分けたよ！🎉`);
    triggerSuccess("random-picker");
  };

  const initBracket = () => {
    if (items.length < 2) { setMascotState("error"); setMascotMessage("2人以上追加してね！"); return; }
    const shuffled = shuffle(items);
    const size = Math.pow(2, Math.ceil(Math.log2(Math.max(shuffled.length, 2))));
    const padded: (string | null)[] = [...shuffled];
    while (padded.length < size) padded.push(null);
    const round1: (string | null)[] = [];
    for (let i = 0; i < padded.length; i += 2) {
      const a = padded[i], b = padded[i + 1];
      round1.push(a === null ? b : b === null ? a : null);
    }
    setBracketRounds([padded, round1]);
    setBracketComplete(false);
    setMascotState("working");
    setMascotMessage("トーナメント開始！勝者をクリックして進めよう！");
  };

  const advanceBracket = (roundIdx: number, matchIdx: number, winner: string) => {
    setBracketRounds(prev => {
      const next = prev.map(r => [...r]);
      next[roundIdx][matchIdx] = winner;
      const round = next[roundIdx];
      if (round.every(w => w !== null)) {
        if (round.length === 1) {
          setBracketComplete(true);
          setMascotState("success");
          setMascotMessage(`優勝：「${round[0]}」🏆`);
          triggerSuccess("random-picker");
        } else {
          const nextRound: (string | null)[] = [];
          for (let i = 0; i < round.length; i += 2) {
            const a = round[i], b = round[i + 1] ?? null;
            nextRound.push(a === null ? b : b === null ? a : null);
          }
          if (next.length <= roundIdx + 1) next.push(nextRound);
          else next[roundIdx + 1] = nextRound;
        }
      }
      return next;
    });
  };

  const presets = [
    { name: "じゃんけん", items: ["グー", "チョキ", "パー"] },
    { name: "曜日", items: ["月曜", "火曜", "水曜", "木曜", "金曜"] },
    { name: "数字1-10", items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
  ];

  const WHEEL_COLORS = ["#1a237e","#c62828","#2e7d32","#f57f17","#6a1b9a","#00695c","#1565c0","#ad1457","#4e342e","#00838f"];

  const renderRoulette = () => {
    const size = 280, cx = 140, cy = 140, r = 130;
    const n = items.length;
    if (n === 0) return (
      <div className="w-[280px] h-[280px] flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-full mx-auto">
        項目を追加してね
      </div>
    );
    const segAngle = 360 / n;
    const toRad = (d: number) => d * Math.PI / 180;
    return (
      <div className="flex flex-col items-center">
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-red-500 mb-[-2px] z-10 relative" />
        <svg
          width={size}
          height={size}
          style={{
            display: "block",
            transform: `rotate(${wheelAngle}deg)`,
            transformOrigin: "140px 140px",
            transition: isSpinningWheel ? "transform 4s cubic-bezier(0.17,0.67,0.12,0.99)" : "none",
          }}
        >
          {items.map((item, i) => {
            const startDeg = i * segAngle - 90;
            const endDeg = (i + 1) * segAngle - 90;
            const x1 = cx + r * Math.cos(toRad(startDeg)), y1 = cy + r * Math.sin(toRad(startDeg));
            const x2 = cx + r * Math.cos(toRad(endDeg)), y2 = cy + r * Math.sin(toRad(endDeg));
            const midDeg = (i + 0.5) * segAngle - 90;
            const tr = r * 0.65;
            const tx = cx + tr * Math.cos(toRad(midDeg)), ty = cy + tr * Math.sin(toRad(midDeg));
            const large = segAngle > 180 ? 1 : 0;
            const label = item.length > 7 ? item.slice(0, 6) + "…" : item;
            const fontSize = n > 8 ? 9 : n > 4 ? 11 : 13;
            return (
              <g key={i}>
                <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={WHEEL_COLORS[i % WHEEL_COLORS.length]} stroke="white" strokeWidth="2" />
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={fontSize} fontWeight="bold" transform={`rotate(${(i + 0.5) * segAngle - 90}, ${tx}, ${ty})`}>{label}</text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={14} fill="white" stroke="#ddd" strokeWidth="2" />
        </svg>
      </div>
    );
  };

  const renderBracket = () => {
    if (bracketRounds.length === 0) return null;
    const totalResultRounds = bracketRounds.length - 1;
    const getRoundLabel = (rIdxFromLeft: number) => {
      const fromRight = totalResultRounds - rIdxFromLeft - 1;
      if (fromRight === 0) return "優勝";
      if (fromRight === 1) return "決勝";
      if (fromRight === 2) return "準決勝";
      if (fromRight === 3) return "準々決勝";
      return `${rIdxFromLeft + 2}回戦`;
    };

    return (
      <div className="overflow-x-auto mt-4">
        <div className="flex gap-6 min-w-max pb-2">
          {/* Column 0: first-round matchups */}
          <div className="flex flex-col">
            <div className="text-xs font-bold text-gray-500 text-center mb-2">1回戦</div>
            <div className="flex flex-col gap-3">
              {(() => {
                const participants = bracketRounds[0];
                const results1 = bracketRounds[1] ?? [];
                const el = [];
                for (let i = 0; i < participants.length; i += 2) {
                  const a = participants[i], b = participants[i + 1] ?? null;
                  const matchIdx = i / 2;
                  const winner = results1[matchIdx] ?? null;
                  el.push(
                    <div key={matchIdx} className="flex flex-col gap-1">
                      {([a, b] as (string | null)[]).map((p, pi) => p && (
                        <button key={pi}
                          onClick={() => { if (!winner && a && b) advanceBracket(1, matchIdx, p); }}
                          disabled={!!winner || !a || !b}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border text-left min-w-[90px] transition-colors ${winner === p ? "bg-green-500 text-white border-green-500" : winner ? "bg-gray-100 text-gray-400 border-gray-200" : (a && b) ? "bg-white border-kon text-kon hover:bg-kon/10 cursor-pointer" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                        >
                          {p}{(!a || !b) ? " (不戦勝)" : ""}
                        </button>
                      ))}
                      <div className="border-t border-gray-100 mt-1" />
                    </div>
                  );
                }
                return el;
              })()}
            </div>
          </div>

          {/* Subsequent result rounds */}
          {bracketRounds.slice(1).map((round, rIdx) => {
            const isChampion = round.length === 1;
            const nextRound = bracketRounds[rIdx + 2];
            const label = getRoundLabel(rIdx);

            if (isChampion) {
              return (
                <div key={rIdx} className="flex flex-col">
                  <div className="text-xs font-bold text-gray-500 text-center mb-2">{label}</div>
                  <div className="flex items-center justify-center flex-1">
                    <div className={`px-4 py-3 rounded-xl text-sm font-bold text-center min-w-[90px] border-2 ${round[0] ? "bg-yellow-400 border-yellow-500 text-white" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
                      {round[0] ?? "—"}{round[0] ? " 🏆" : ""}
                    </div>
                  </div>
                </div>
              );
            }

            const pairs: [string | null, string | null][] = [];
            for (let i = 0; i < round.length; i += 2) pairs.push([round[i] ?? null, round[i + 1] ?? null]);

            return (
              <div key={rIdx} className="flex flex-col">
                <div className="text-xs font-bold text-gray-500 text-center mb-2">{label}</div>
                <div className="flex flex-col gap-3">
                  {pairs.map(([a, b], matchIdx) => {
                    const winner = nextRound?.[matchIdx] ?? null;
                    return (
                      <div key={matchIdx} className="flex flex-col gap-1">
                        {([a, b] as (string | null)[]).map((p, pi) => (
                          <button key={pi}
                            onClick={() => { if (p && a && b && !winner) advanceBracket(rIdx + 2, matchIdx, p); }}
                            disabled={!p || !a || !b || !!winner}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border text-left min-w-[90px] transition-colors ${winner === p ? "bg-green-500 text-white border-green-500" : winner ? "bg-gray-100 text-gray-400 border-gray-200" : (a && b) ? "bg-white border-kon text-kon hover:bg-kon/10 cursor-pointer" : "bg-gray-50 text-gray-300 border-gray-100"}`}
                          >
                            {p ?? "—"}
                          </button>
                        ))}
                        <div className="border-t border-gray-100 mt-1" />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {sharedResult && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold text-kon mb-2">🎉 共有された抽選結果</h2>
            <p className="text-gray-700 mb-1">当選者：<strong className="text-2xl text-kon">{sharedResult.w.join("、")}</strong></p>
            <p className="text-sm text-gray-500 mb-4">（{sharedResult.c}人から抽選）</p>
            <Link href="/generator/random-picker" className="text-kon underline text-sm">自分でも抽選してみる →</Link>
          </div>
        )}

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🎲</div>
          <h1 className="text-3xl font-bold text-kon mb-2">ランダム抽選ツール</h1>
          <p className="text-gray-600 text-lg">公平にランダムで選ぼう</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🎯 公平な抽選</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">📝 履歴機能</span>
            <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">🔒 登録不要</span>
          </div>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6"><Mascot state={mascotState} message={mascotMessage} /></div>

          {/* Mode Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
            {([ ["normal","🎲 通常抽選"], ["weighted","⚖️ 重み付き"], ["team","👥 チーム分け"], ["tournament","🏆 トーナメント"] ] as [Mode, string][]).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? "bg-kon text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{label}</button>
            ))}
          </div>

          {/* Items input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">項目を追加（名前、アイテムなど）</label>
            <div className="flex gap-2">
              <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={handleKeyPress} onPaste={handlePaste} placeholder="入力してEnter（複数ペースト可）" className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent" />
              <button onClick={addItem} className="px-6 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors">追加</button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <p className="text-xs text-gray-400">💡 カンマ区切りや改行でまとめて追加</p>
              <label className="text-xs text-kon cursor-pointer hover:underline">
                📂 CSV読込
                <input type="file" accept=".csv,.txt" className="hidden" onChange={handleCsvImport} />
              </label>
              {items.length > 0 && (
                <button onClick={copyItemsUrl} className="text-xs text-gray-500 hover:text-kon">🔗 リストを共有</button>
              )}
            </div>
          </div>

          {/* Presets */}
          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-2">クイック追加</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, i) => (
                <button key={i} onClick={() => { setItems(p.items); setWeights({}); setMascotMessage(`「${p.name}」を読み込んだよ！`); }} className="px-3 py-1 bg-sakura/30 text-kon rounded-full text-sm hover:bg-sakura/50 transition-colors">{p.name}</button>
              ))}
            </div>
          </div>

          {/* Items list */}
          {items.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">登録済み（{items.length}件）</label>
                <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700">すべて削除</button>
              </div>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl max-h-48 overflow-y-auto">
                {items.map((item, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm">
                    {item}
                    {mode === "weighted" && <span className="text-xs text-gray-400">({getPercentage(item)}%)</span>}
                    <button onClick={() => removeItem(idx)} className="text-gray-400 hover:text-red-500 ml-1">×</button>
                  </span>
                ))}
              </div>
              {mode === "weighted" && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 font-medium mb-2">重み設定（数値が大きいほど選ばれやすい）</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                        <span className="text-sm flex-1 truncate">{item}</span>
                        <input type="number" min={1} value={getWeight(item)} onChange={e => setItemWeight(item, parseInt(e.target.value) || 1)} className="w-14 text-center border border-gray-200 rounded p-1 text-sm" />
                        <span className="text-xs text-gray-400">{getPercentage(item)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Normal / Weighted mode */}
          {(mode === "normal" || mode === "weighted") && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">アニメーション</label>
                <div className="flex flex-wrap gap-2">
                  {([ ["default","🎯 デフォルト"], ["slot","🎰 スロット"], ["roulette","🎡 ルーレット"] ] as [AnimMode, string][]).map(([a, label]) => (
                    <button key={a} onClick={() => setAnimMode(a)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${animMode === a ? "bg-ai text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{label}</button>
                  ))}
                </div>
              </div>

              {animMode === "roulette" && (
                <div className="mb-6">{renderRoulette()}</div>
              )}

              {animMode !== "roulette" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">抽選人数</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setPickCount(Math.max(1, pickCount - 1))} className="w-10 h-10 bg-gray-100 rounded-full text-xl font-bold hover:bg-gray-200">-</button>
                    <span className="text-2xl font-bold text-kon w-16 text-center">{pickCount}</span>
                    <button onClick={() => setPickCount(Math.min(items.length || 10, pickCount + 1))} className="w-10 h-10 bg-gray-100 rounded-full text-xl font-bold hover:bg-gray-200">+</button>
                    <span className="text-gray-500 text-sm">人を選ぶ</span>
                  </div>
                </div>
              )}

              {animMode === "slot" && isSpinning && results.length > 0 && (
                <div className="mb-4 h-20 border-4 border-kon rounded-xl flex items-center justify-center bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                  <span className="text-3xl font-bold text-kon">{results[0]}</span>
                </div>
              )}

              <button onClick={pickRandom} disabled={isSpinning || isSpinningWheel || items.length === 0} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${(isSpinning || isSpinningWheel) ? "bg-gradient-to-r from-kon via-ai to-kon animate-pulse text-white cursor-wait" : items.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-kon to-ai text-white hover:shadow-lg hover:scale-[1.02]"}`}>
                {(isSpinning || isSpinningWheel) ? "🎲 抽選中..." : "🎲 抽選する！"}
              </button>

              {results.length > 0 && !isSpinning && !isSpinningWheel && (
                <div className="mt-6">
                  <div className="bg-gradient-to-br from-sakura/30 to-kon/10 rounded-xl p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">🎉 結果発表！</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {results.map((result, i) => (
                        <div key={i} className="px-6 py-3 bg-white rounded-xl shadow-md border-2 border-kon text-xl font-bold text-kon animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>{result}</div>
                      ))}
                    </div>
                    <button onClick={() => { setResults([]); setShareVisible(false); setMascotState("idle"); setMascotMessage("もう一度抽選してみよう！"); window.history.replaceState({}, "", window.location.pathname); }} className="mt-4 text-sm text-kon hover:text-ai underline">もう一度抽選する</button>
                  </div>
                  {shareVisible && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-600 mb-3 font-medium text-center">この結果をシェア</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button onClick={handleCopyUrl} className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-900">🔗 {copyFeedback ? "コピーしました！" : "URLをコピー"}</button>
                        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800">𝕏 ポスト</a>
                        <a href={`https://line.me/R/msg/text/?${encodeURIComponent(getShareText() + " " + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">💬 LINE</a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {history.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">履歴（最新10件）</label>
                  <div className="space-y-2">
                    {history.map((result, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-gray-400">#{history.length - i}</span>
                        <span>{result.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Team mode */}
          {mode === "team" && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">チーム数（2〜10）</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setTeamCount(Math.max(2, teamCount - 1))} className="w-10 h-10 bg-gray-100 rounded-full text-xl font-bold hover:bg-gray-200">-</button>
                  <span className="text-2xl font-bold text-kon w-16 text-center">{teamCount}</span>
                  <button onClick={() => setTeamCount(Math.min(10, teamCount + 1))} className="w-10 h-10 bg-gray-100 rounded-full text-xl font-bold hover:bg-gray-200">+</button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">分け方</label>
                <div className="flex gap-2">
                  <button onClick={() => setTeamDistribution("equal")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${teamDistribution === "equal" ? "bg-kon text-white" : "bg-gray-100 text-gray-600"}`}>均等分配</button>
                  <button onClick={() => setTeamDistribution("random")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${teamDistribution === "random" ? "bg-kon text-white" : "bg-gray-100 text-gray-600"}`}>ランダム</button>
                </div>
              </div>
              <button onClick={formTeams} disabled={items.length < 2} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${items.length < 2 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-kon to-ai text-white hover:shadow-lg hover:scale-[1.02]"}`}>👥 チーム分けする！</button>
              {teamResult.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">チーム分け結果</p>
                  <div className={`grid gap-4 ${teamResult.length <= 2 ? "grid-cols-2" : teamResult.length <= 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
                    {teamResult.map((team, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="font-bold text-kon text-sm mb-2 text-center">チーム{i + 1}</p>
                        <div className="space-y-1">
                          {team.map((m, j) => (
                            <div key={j} className="bg-white rounded-lg px-3 py-1 text-sm text-center border border-gray-100">{m}</div>
                          ))}
                          {team.length === 0 && <div className="text-xs text-gray-400 text-center">（なし）</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tournament mode */}
          {mode === "tournament" && (
            <div>
              <p className="text-sm text-gray-600 mb-4">登録済みの参加者でトーナメントを開始。勝者をクリックして進めましょう。</p>
              <button onClick={initBracket} disabled={items.length < 2} className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-4 ${items.length < 2 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-kon to-ai text-white hover:shadow-lg hover:scale-[1.02]"}`}>🏆 トーナメント開始！</button>
              {bracketComplete && (
                <div className="text-center mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-2xl font-bold text-yellow-700">🏆 優勝！</p>
                  <p className="text-3xl font-bold text-kon mt-1">{bracketRounds[bracketRounds.length - 1]?.[0]}</p>
                </div>
              )}
              {renderBracket()}
              {bracketRounds.length > 0 && !bracketComplete && (
                <p className="text-xs text-gray-400 mt-3 text-center">勝者のボタンをクリックして次のラウンドへ進めよう</p>
              )}
            </div>
          )}
        </section>

        <section className="mt-8 bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-kon mb-3 text-xl">ランダム抽選ツールとは</h2>
          <p className="text-gray-600 mb-3">このランダム抽選ツールは、名前・アイテムのリストから公平にランダムで1人または複数名を選ぶ無料のWebツールです。インストール不要・会員登録不要で、ブラウザからすぐに使えます。忘年会の幹事決め、プレゼント交換の相手決め、クラスの席替え、会議の発表順番決め、チーム分け・グループ分けなど、あらゆる「公平に決めたい」場面でご活用いただけます。</p>
          <p className="text-gray-600">すべての処理は日本国内サーバーで行われ、入力した名前データが外部に送信されることはありません。SSL暗号化通信により、安心してお使いいただけます。</p>
        </section>

        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-4 text-xl">こんな時に使えます</h2>
          <div className="space-y-4">
            {[
              ["🎉 忘年会・新年会・飲み会の幹事決め", "飲み会の幹事や仕切り役をランダムに決めるのに最適です。参加者の名前を入力してボタンを押すだけで、その場で公平に幹事を選べます。スマホからもすぐに使えるので、集まりの席でそのまま実施できます。"],
              ["🎁 プレゼント交換・シークレットサンタ", "クリスマスパーティーや忘年会でのプレゼント交換（シークレットサンタ）の相手決めに。重み付きモードで特定の人の当選確率を調整することもできます。"],
              ["📋 会議・授業の発表順番決め", "会議での発表順、授業での当てる順番、朝礼スピーチの順番などをランダムに決めるのに使えます。名前リストを入力して全員分を一度に抽選することで、公平な順番を瞬時に決定できます。"],
              ["🧹 掃除当番・当直の割り当て", "会社や学校での掃除当番、日直・週番などの割り当てをランダムに決めるのに活用できます。毎回同じ人に偏らないよう、公平にローテーションを決めることができます。"],
              ["👥 チーム分け・グループ分け", "「チーム分け」タブで人数を指定するだけで自動振り分け。均等配分・ランダム配分を選べます。スポーツやゲームのチーム分け、ワークショップのグループ分けに最適です。"],
              ["🏆 トーナメント・大会運営", "「トーナメント」タブで参加者を登録するだけでブラケット自動生成。クリックで勝者を進めていけます。スポーツ大会やゲームの組み合わせ決めに便利です。"],
              ["🍽️ ランチのお店・メニュー選び", "「今日のランチどこにする？」という悩みも解決。候補のお店やメニューを入力してランダムに1つを選ぶことができます。全員が候補を出し合って公平に選べるので、誰も不満が出ません。"],
              ["🎮 ゲーム・罰ゲームの順番決め", "パーティーゲームやボードゲームの先攻・後攻決め、罰ゲームを受ける人の決定などにも使えます。楽しいイベントをより盛り上げるためのツールとして活躍します。"],
            ].map(([t, d], i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-100">
                <h3 className="font-bold text-kon mb-1">{t}</h3>
                <p className="text-gray-600 text-sm">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-4 text-xl">使い方</h2>
          <div className="space-y-4">
            {[
              ["ステップ1：項目を追加する", "テキストボックスに名前やアイテムを入力。カンマ区切り・改行でまとめて追加できます。CSVファイルの読込も対応しています。「リストを共有」ボタンでURLに変換して他のメンバーと共有することもできます。"],
              ["ステップ2：モードを選ぶ", "通常抽選・重み付き抽選・チーム分け・トーナメントの4モード。重み付きでは各項目に重みを設定し、出やすさを数値で調整できます。"],
              ["ステップ3：アニメーションを選ぶ（通常/重み付きモード）", "デフォルト・スロット・ルーレットの3種類のアニメーションから選べます。ルーレットはSVGで描画したホイールが回転します。"],
              ["ステップ4：結果をシェアする", "結果URLやX（Twitter）・LINEでシェアできます。過去の抽選結果は画面下部の履歴から確認できます。"],
            ].map(([t, d], i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-100">
                <h3 className="font-bold text-kon mb-1">{t}</h3>
                <p className="text-gray-600 text-sm">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-bold text-kon mb-4 text-xl">よくある質問（FAQ）</h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-medium text-kon mb-2 flex items-start gap-2"><span className="font-bold flex-shrink-0">Q.</span>{item.question}</h3>
                <p className="text-gray-600 text-sm flex items-start gap-2"><span className="font-bold flex-shrink-0">A.</span>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center"><div className="text-2xl mb-2">🆓</div><h3 className="font-bold text-sm mb-1">完全無料・登録不要</h3><p className="text-xs text-gray-500">制限なし、すぐ使える</p></div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center"><div className="text-2xl mb-2">🎯</div><h3 className="font-bold text-sm mb-1">公平な抽選</h3><p className="text-xs text-gray-500">暗号論的乱数で偏りなし</p></div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center"><div className="text-2xl mb-2">🔒</div><h3 className="font-bold text-sm mb-1">安心・安全</h3><p className="text-xs text-gray-500">日本国内サーバー処理</p></div>
        </section>

        <section className="mt-8">
          <h2 className="font-bold text-kon mb-4 text-xl">用途別の専用ページ</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="/generator/random-picker/nenkai" className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow no-underline"><div className="text-3xl mb-2">🎊</div><p className="font-bold text-kon text-sm mb-1">忘年会・新年会 抽選ツール</p><p className="text-xs text-gray-500">幹事決め・景品抽選・プレゼント交換に対応</p></a>
            <a href="/generator/random-picker/christmas" className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow no-underline"><div className="text-3xl mb-2">🎄</div><p className="font-bold text-kon text-sm mb-1">クリスマス プレゼント交換</p><p className="text-xs text-gray-500">シークレットサンタの相手決めに特化</p></a>
            <a href="/generator/random-picker/seat" className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow no-underline"><div className="text-3xl mb-2">🏫</div><p className="font-bold text-kon text-sm mb-1">席替えランダム決めツール</p><p className="text-xs text-gray-500">クラス・職場の座席をシャッフル。印刷対応</p></a>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai transition-colors">← 計算・生成ツール一覧に戻る</Link>
        </div>
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
