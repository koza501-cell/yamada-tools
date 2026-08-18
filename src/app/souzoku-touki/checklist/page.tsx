"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DOCUMENTS_BY_CASE, DISCLAIMER } from "../data";

const API_SOUZOKU = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/souzoku";

const CASE_OPTIONS = [
  { value: "isan_bunkatsu", label: "遺産分割協議", icon: "📋" },
  { value: "hotei_souzoku", label: "法定相続", icon: "⚖️" },
  { value: "yuigon", label: "遺言書", icon: "📜" },
  { value: "kazoku_kouku", label: "相続人申告登記", icon: "📝" },
];

const VALID_CASES = new Set(CASE_OPTIONS.map((o) => o.value));

export default function ChecklistPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [selectedCase, setSelectedCase] = useState("isan_bunkatsu");
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [gated, setGated] = useState(true);
  const printingRef = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login?redirect=/souzoku-touki/checklist");
      return;
    }

    const raw = typeof window !== "undefined" ? sessionStorage.getItem("souzoku_wizard_session") : null;
    const caseId = raw ? parseInt(raw, 10) : NaN;

    if (!caseId || isNaN(caseId)) {
      router.push("/souzoku-touki/wizard");
      return;
    }

    let cancelled = false;
    const token = typeof window !== "undefined" ? localStorage.getItem("session_token") || "" : "";

    fetch(`${API_SOUZOKU}/cases/${caseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("not_found");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data.status !== "paid") {
          router.push(`/souzoku-touki/case/${caseId}`);
          return;
        }
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          router.push(`/souzoku-touki/case/${caseId}`);
          return;
        }
        if (VALID_CASES.has(data.case_type)) {
          setSelectedCase(data.case_type);
        }
        setGated(false);
      })
      .catch(() => {
        if (cancelled) return;
        router.push("/souzoku-touki");
      });

    return () => { cancelled = true; };
  }, [user, authLoading, router]);

  useEffect(() => {
    setChecked({});
  }, [selectedCase]);

  const docs = DOCUMENTS_BY_CASE[selectedCase] ?? [];
  const checkedCount = Object.values(checked).filter(Boolean).length;

  function toggleCheck(i: number) {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  function handlePrint() {
    if (printingRef.current) return;
    printingRef.current = true;
    setTimeout(() => {
      window.print();
      printingRef.current = false;
    }, 50);
  }

  if (gated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 text-sm">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-kon to-ai text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-white/70 mb-2">
            <Link href="/souzoku-touki" className="hover:text-white">相続登記DIYガイド</Link> &rsaquo; 書類チェックリスト
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">📋 必要書類チェックリスト</h1>
          <p className="text-gray-200 mt-2 text-sm">ケースを選択すると必要書類が一覧表示されます</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Case selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">相続のケースを選択</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CASE_OPTIONS.map((opt) => (
              <button type="button"
                key={opt.value}
                onClick={() => setSelectedCase(opt.value)}
                className={`rounded-xl border-2 py-3 px-2 text-sm font-medium transition-all ${
                  selectedCase === opt.value
                    ? "border-ai bg-gray-50 dark:bg-kon/30 text-ai"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-ai"
                }`}
              >
                <div className="text-2xl mb-1">{opt.icon}</div>
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            ケースがわからない場合は <Link href="/souzoku-touki/wizard" className="text-ai underline">ケース診断</Link> を先に行ってください
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              収集済み: <span className="text-ai font-bold">{checkedCount}</span> / {docs.length} 書類
            </span>
            <div className="flex gap-2">
              <button type="button"
                onClick={handlePrint}
                className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                🖨️ 印刷
              </button>
              <button type="button"
                onClick={() => setChecked({})}
                className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-3 py-1.5"
              >
                リセット
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-ai rounded-full h-2 transition-all duration-300"
              style={{ width: docs.length > 0 ? `${(checkedCount / docs.length) * 100}%` : "0%" }}
            />
          </div>
        </div>

        {/* Document list */}
        <div className="space-y-3">
          {docs.map((doc, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all ${
                checked[i] ? "border-green-300 dark:border-green-700 opacity-70" : "border-gray-100 dark:border-gray-700"
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <button type="button"
                    onClick={() => toggleCheck(i)}
                    className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded border-2 flex items-center justify-center transition-colors ${
                      checked[i]
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 dark:border-gray-500 hover:border-ai"
                    }`}
                  >
                    {checked[i] && <span className="text-xs">✓</span>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className={`font-bold text-sm ${checked[i] ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}`}>
                        {doc.doc}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <div><span className="font-medium text-gray-600 dark:text-gray-300">取得場所：</span>{doc.where}</div>
                      <div><span className="font-medium text-gray-600 dark:text-gray-300">費用目安：</span>{doc.cost}</div>
                      <div><span className="font-medium text-gray-600 dark:text-gray-300">注意：</span>{doc.note}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Links to other tools */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/souzoku-touki/tax" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">🧮</div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">登録免許税を計算する</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">固定資産評価額×0.4%を自動計算</div>
          </Link>
          <Link href="/souzoku-touki/houmukyoku" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">🏛️</div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">管轄法務局を調べる</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">都道府県・市区町村から検索</div>
          </Link>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">⚠️ {DISCLAIMER}</p>
      </div>
    </div>
  );
}
