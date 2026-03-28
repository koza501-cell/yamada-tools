"use client";

import { useState } from "react";

interface SeatPickerToolProps {
  pageUrl: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseNames(input: string): string[] {
  return input
    .split(/[,、\n]/)
    .map((n) => n.trim())
    .filter((n) => n.length > 0);
}

const PRESET_40 = Array.from({ length: 40 }, (_, i) => String(i + 1)).join(",");

export default function SeatPickerTool({ pageUrl }: SeatPickerToolProps) {
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [columns, setColumns] = useState(6);
  const [results, setResults] = useState<string[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [resultsCopied, setResultsCopied] = useState(false);

  const handleDraw = () => {
    const names = parseNames(input);
    if (names.length < 2) {
      setError("2人以上の名前を入力してください");
      return;
    }
    setError("");
    setIsAnimating(true);
    setHasDrawn(false);
    setTimeout(() => {
      setResults(shuffleArray(names));
      setHasDrawn(true);
      setIsAnimating(false);
    }, 800);
  };

  const handleCopyResults = async () => {
    const text = results.map((name, i) => `${i + 1}番席 → ${name}`).join("\n");
    await navigator.clipboard.writeText(text);
    setResultsCopied(true);
    setTimeout(() => setResultsCopied(false), 2000);
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 18,
      padding: "28px 28px 32px",
      border: "1.5px solid rgba(29,53,87,0.12)",
      boxShadow: "0 4px 24px rgba(29,53,87,0.08)",
    }}>
      <style>{`
        .seat-grid-wrapper { margin: 0; }
        .blackboard-label { text-align:center; background:#2d6a4f; color:#fff; padding:8px; border-radius:4px 4px 0 0; font-weight:700; letter-spacing:.1em; }
        .back-label { text-align:center; background:#e9ecef; color:#666; padding:6px; border-radius:0 0 4px 4px; font-size:12px; }
        .seat-grid { display:grid; gap:6px; padding:12px; background:#f8f9fa; border:1px solid #dee2e6; }
        .seat-cell { display:flex; flex-direction:column; align-items:center; background:#fff; border:1px solid #adb5bd; border-radius:4px; padding:8px 4px; min-height:56px; }
        .seat-number { font-size:10px; color:#999; line-height:1; }
        .seat-name { font-size:13px; font-weight:600; color:#212529; text-align:center; word-break:break-all; margin-top:2px; }
        @media print {
          .no-print, .adsbygoogle, nav, footer, header, .share-section, .seat-controls-bar { display:none !important; }
          .seat-grid-wrapper { page-break-inside:avoid; }
          body { background:#fff; }
          .seat-cell { border:1px solid #000; }
        }
      `}</style>

      {/* Input area */}
      <div className="no-print">
        <label style={{
          fontWeight: 700,
          color: "#1d3557",
          fontSize: "0.95rem",
          display: "block",
          marginBottom: 8,
        }}>
          生徒・参加者の名前（カンマ区切りまたは改行で入力）
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"田中,山田,鈴木,佐藤\nまたは改行で1人ずつ入力"}
          rows={5}
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: "0.92rem",
            border: "1.5px solid rgba(29,53,87,0.2)",
            borderRadius: 10,
            resize: "vertical",
            outline: "none",
            fontFamily: "inherit",
            lineHeight: 1.6,
            boxSizing: "border-box",
          }}
        />

        {/* Preset button */}
        <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => setInput(PRESET_40)}
            style={{
              padding: "7px 16px",
              fontSize: "0.83rem",
              background: "#f0f4ff",
              border: "1px solid rgba(29,53,87,0.2)",
              borderRadius: 8,
              cursor: "pointer",
              color: "#1d3557",
              fontWeight: 600,
            }}
          >
            📋 出席番号1〜40
          </button>
        </div>

        {error && (
          <p style={{ color: "#dc2626", fontSize: "0.85rem", marginTop: 8 }}>{error}</p>
        )}

        {/* Draw button */}
        <button
          onClick={handleDraw}
          disabled={isAnimating}
          style={{
            marginTop: 18,
            width: "100%",
            padding: "16px",
            fontSize: "1.1rem",
            fontWeight: 800,
            background: isAnimating
              ? "linear-gradient(135deg, #94a3b8, #64748b)"
              : "linear-gradient(135deg, #1d3557 0%, #457b9d 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            cursor: isAnimating ? "not-allowed" : "pointer",
            letterSpacing: "0.03em",
            transition: "all 0.2s",
          }}
        >
          {isAnimating ? "🔀 シャッフル中..." : "🏫 席替えする！"}
        </button>
      </div>

      {/* Results */}
      {hasDrawn && (
        <div style={{ marginTop: 28 }}>
          {/* View mode + columns controls */}
          <div className="seat-controls-bar no-print" style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setViewMode("list")}
                style={{
                  padding: "8px 18px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  background: viewMode === "list" ? "#1d3557" : "#f0f4ff",
                  color: viewMode === "list" ? "#fff" : "#1d3557",
                  border: "1.5px solid rgba(29,53,87,0.2)",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                📋 リスト表示
              </button>
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  padding: "8px 18px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  background: viewMode === "grid" ? "#1d3557" : "#f0f4ff",
                  color: viewMode === "grid" ? "#fff" : "#1d3557",
                  border: "1.5px solid rgba(29,53,87,0.2)",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                🏫 教室グリッド
              </button>
            </div>

            {viewMode === "grid" && (
              <label style={{
                fontSize: "0.85rem",
                color: "#555",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                列数:
                <select
                  value={columns}
                  onChange={(e) => setColumns(Number(e.target.value))}
                  style={{
                    padding: "6px 10px",
                    border: "1.5px solid rgba(29,53,87,0.2)",
                    borderRadius: 6,
                    fontSize: "0.85rem",
                  }}
                >
                  {[4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n}列</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {/* List view */}
          {viewMode === "list" && (
            <div style={{
              background: "#f8faff",
              borderRadius: 12,
              padding: "16px 20px",
              border: "1px solid rgba(29,53,87,0.1)",
            }}>
              {results.map((name, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < results.length - 1 ? "1px solid rgba(29,53,87,0.07)" : "none",
                  gap: 14,
                }}>
                  <span style={{
                    width: 32,
                    height: 32,
                    background: "#1d3557",
                    color: "#fff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: "0.95rem", color: "#1d3557" }}>
                    <strong>{i + 1}番席</strong> → {name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Grid view */}
          {viewMode === "grid" && (
            <div className="seat-grid-wrapper">
              <div className="blackboard-label">⬛ 黒板・前</div>
              <div
                className="seat-grid"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
              >
                {results.map((name, i) => (
                  <div key={i} className="seat-cell">
                    <span className="seat-number">{i + 1}番</span>
                    <span className="seat-name">{name}</span>
                  </div>
                ))}
              </div>
              <div className="back-label">後ろ</div>
            </div>
          )}

          {/* Action buttons */}
          <div className="no-print share-section" style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 18,
          }}>
            <button
              onClick={handleCopyResults}
              style={{
                flex: 1,
                minWidth: 140,
                padding: "12px 16px",
                fontSize: "0.88rem",
                fontWeight: 700,
                background: resultsCopied ? "#16a34a" : "#f0f4ff",
                color: resultsCopied ? "#fff" : "#1d3557",
                border: "1.5px solid rgba(29,53,87,0.2)",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              {resultsCopied ? "✅ コピーしました" : "📋 結果をコピー"}
            </button>
            <button
              onClick={handlePrint}
              style={{
                flex: 1,
                minWidth: 140,
                padding: "12px 16px",
                fontSize: "0.88rem",
                fontWeight: 700,
                background: "#f0f4ff",
                color: "#1d3557",
                border: "1.5px solid rgba(29,53,87,0.2)",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              🖨️ 印刷する
            </button>
            <button
              onClick={handleCopyUrl}
              style={{
                flex: 1,
                minWidth: 140,
                padding: "12px 16px",
                fontSize: "0.88rem",
                fontWeight: 700,
                background: copied ? "#16a34a" : "#f0f4ff",
                color: copied ? "#fff" : "#1d3557",
                border: "1.5px solid rgba(29,53,87,0.2)",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              {copied ? "✅ URLコピー済み" : "🔗 URLをコピー"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
