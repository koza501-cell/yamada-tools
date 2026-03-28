"use client";

import { useState, useCallback } from "react";

export interface PickerPreset {
  label: string;
  names: string; // comma-separated names to fill textarea
}

interface RandomPickerToolProps {
  presets?: PickerPreset[];
  pageUrl: string;
  shareMessage?: string; // message shown in the share section
  shareTextPrefix?: string; // prepended to winner names in LINE/X share
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseNames(text: string): string[] {
  return text.split(/[,、,\n\r]/).map((n) => n.trim()).filter(Boolean);
}

export default function RandomPickerTool({
  presets = [],
  pageUrl,
  shareMessage = "🎉 抽選結果が決まりました！みんなにシェアしよう",
  shareTextPrefix = "抽選結果：",
}: RandomPickerToolProps) {
  const [input, setInput] = useState("");
  const [count, setCount] = useState(1);
  const [winners, setWinners] = useState<string[]>([]);
  const [allOrdered, setAllOrdered] = useState<string[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handlePreset = (names: string) => {
    setInput(names);
    setHasDrawn(false);
    setWinners([]);
    setAllOrdered([]);
    setError("");
  };

  const handleDraw = useCallback(() => {
    const names = parseNames(input);
    setError("");

    if (names.length === 0) {
      setError("参加者の名前を入力してください。");
      return;
    }
    if (count > names.length) {
      setError(
        `参加者は${names.length}人しかいないため、${count}人を抽選できません。抽選人数を減らしてください。`
      );
      return;
    }

    setIsAnimating(true);
    setHasDrawn(false);
    setWinners([]);

    setTimeout(() => {
      const shuffled = shuffleArray(names);
      setAllOrdered(shuffled);
      setWinners(shuffled.slice(0, count));
      setHasDrawn(true);
      setIsAnimating(false);
    }, 800);
  }, [input, count]);

  const handleReset = () => {
    setHasDrawn(false);
    setWinners([]);
    setAllOrdered([]);
    setError("");
  };

  const getShareText = () => {
    if (winners.length === 0) return "";
    if (winners.length === 1) return `${shareTextPrefix}${winners[0]}`;
    return `${shareTextPrefix}\n${winners.map((w, i) => `${i + 1}位: ${w}`).join("\n")}`;
  };

  const handleCopyUrl = async () => {
    const text = getShareText();
    const shareUrl = `${pageUrl}`;
    const full = `${text}\n${shareUrl}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = full;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const lineShareUrl = () => {
    const text = `${getShareText()}\n${pageUrl}`;
    return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(getShareText())}`;
  };

  const xShareUrl = () => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(pageUrl)}`;
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "32px 28px",
      boxShadow: "0 4px 28px rgba(34,58,112,0.10)",
      border: "1px solid rgba(34,58,112,0.09)",
      maxWidth: 640,
      margin: "0 auto",
    }}>
      {/* Quick presets */}
      {presets.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: "0.78rem", color: "#888", fontWeight: 700, marginBottom: 10, letterSpacing: "0.5px", textTransform: "uppercase" }}>
            クイック入力
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => handlePreset(p.names)}
                style={{
                  background: "rgba(34,58,112,0.06)",
                  border: "1.5px solid rgba(34,58,112,0.18)",
                  borderRadius: 8,
                  padding: "7px 14px",
                  fontSize: "0.82rem",
                  color: "#223A70",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Name input */}
      <div style={{ marginBottom: 22 }}>
        <label htmlFor="picker-names" style={{
          display: "block",
          fontWeight: 700,
          color: "#223A70",
          marginBottom: 8,
          fontSize: "0.95rem",
        }}>
          参加者の名前を入力
          <span style={{ fontWeight: 400, color: "#aaa", fontSize: "0.78rem", marginLeft: 8 }}>
            カンマ（,）または改行で区切る
          </span>
        </label>
        <textarea
          id="picker-names"
          value={input}
          onChange={(e) => { setInput(e.target.value); handleReset(); }}
          placeholder={"例：田中, 山田, 鈴木, 佐藤\n（カンマか改行で区切ってください）"}
          rows={4}
          style={{
            width: "100%",
            borderRadius: 10,
            border: "1.5px solid rgba(34,58,112,0.22)",
            padding: "12px 14px",
            fontSize: "0.95rem",
            fontFamily: "inherit",
            color: "#343434",
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
            lineHeight: 1.6,
          }}
        />
      </div>

      {/* Count selector */}
      <div style={{ marginBottom: 28 }}>
        <label style={{
          display: "block",
          fontWeight: 700,
          color: "#223A70",
          marginBottom: 10,
          fontSize: "0.95rem",
        }}>
          抽選人数（当選者数）
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            aria-label="抽選人数を減らす"
            onClick={() => setCount((c) => Math.max(1, c - 1))}
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              border: "1.5px solid rgba(34,58,112,0.22)",
              background: "#fff",
              fontSize: "1.4rem",
              color: "#223A70",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            −
          </button>
          <span style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#223A70",
            minWidth: 72,
            textAlign: "center",
            letterSpacing: "-0.5px",
          }}>
            {count}人
          </span>
          <button
            aria-label="抽選人数を増やす"
            onClick={() => setCount((c) => c + 1)}
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              border: "1.5px solid rgba(34,58,112,0.22)",
              background: "#fff",
              fontSize: "1.4rem",
              color: "#223A70",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            ＋
          </button>
        </div>
      </div>

      {/* Validation error */}
      {error && (
        <div style={{
          background: "#fff5f5",
          border: "1px solid #fca5a5",
          borderRadius: 8,
          padding: "10px 14px",
          color: "#b91c1c",
          fontSize: "0.88rem",
          marginBottom: 16,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Draw button */}
      <button
        onClick={handleDraw}
        disabled={isAnimating}
        style={{
          width: "100%",
          background: isAnimating
            ? "rgba(34,58,112,0.45)"
            : "linear-gradient(135deg, #1e3a8a 0%, #223A70 50%, #1a56db 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          padding: "18px 32px",
          fontSize: "1.2rem",
          fontWeight: 800,
          cursor: isAnimating ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          letterSpacing: "0.5px",
          boxShadow: isAnimating ? "none" : "0 4px 18px rgba(34,58,112,0.38)",
          transition: "all 0.2s",
          marginBottom: 0,
        }}
      >
        {isAnimating ? "🎲 抽選中..." : "🎲 抽選する！"}
      </button>

      {/* Results */}
      {hasDrawn && !isAnimating && (
        <div style={{
          marginTop: 24,
          background: "linear-gradient(135deg, #eff6ff 0%, #e8f0fe 100%)",
          borderRadius: 14,
          padding: "24px",
          border: "1px solid rgba(34,58,112,0.12)",
        }}>
          <p style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            color: "#223A70",
            marginBottom: 16,
            textAlign: "center",
          }}>
            🎉 抽選結果
          </p>

          {winners.map((name, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#fff",
              borderRadius: 10,
              padding: "13px 16px",
              marginBottom: i < winners.length - 1 ? 8 : 0,
              boxShadow: "0 2px 10px rgba(34,58,112,0.08)",
            }}>
              <span style={{
                background: "#223A70",
                color: "#fff",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: "0.78rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}>
                {count > 1 ? `${i + 1}位` : "当選 🎉"}
              </span>
              <span style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#1e3a8a",
              }}>
                {name}
              </span>
            </div>
          ))}

          {/* Show all ordered if count matches total */}
          {allOrdered.length > count && (
            <details style={{ marginTop: 14 }}>
              <summary style={{ color: "#666", fontSize: "0.84rem", cursor: "pointer", userSelect: "none" }}>
                全員の順番を見る（クリックで展開）
              </summary>
              <ol style={{ margin: "10px 0 0 20px", padding: 0, fontSize: "0.88rem", color: "#555", lineHeight: 2 }}>
                {allOrdered.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ol>
            </details>
          )}

          {/* Share section */}
          <div style={{
            marginTop: 20,
            paddingTop: 18,
            borderTop: "1px solid rgba(34,58,112,0.12)",
          }}>
            <p style={{
              fontSize: "0.9rem",
              color: "#555",
              marginBottom: 12,
              textAlign: "center",
              fontWeight: 500,
            }}>
              {shareMessage}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={handleCopyUrl}
                style={{
                  background: copied ? "#16a34a" : "#fff",
                  border: "1.5px solid " + (copied ? "#16a34a" : "rgba(34,58,112,0.2)"),
                  borderRadius: 8,
                  padding: "9px 18px",
                  fontSize: "0.88rem",
                  color: copied ? "#fff" : "#223A70",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                {copied ? "✅ コピーしました" : "🔗 結果URLをコピー"}
              </button>
              <a
                href={lineShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#06C755",
                  borderRadius: 8,
                  padding: "9px 18px",
                  fontSize: "0.88rem",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                💬 LINEでシェア
              </a>
              <a
                href={xShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#000",
                  borderRadius: 8,
                  padding: "9px 18px",
                  fontSize: "0.88rem",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                𝕏 ポスト
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
