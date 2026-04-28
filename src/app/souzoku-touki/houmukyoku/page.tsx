"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { HOUMUKYOKU_DATA, DISCLAIMER } from "../data";

export default function HoumukyokuPage() {
  const [selectedPref, setSelectedPref] = useState("");
  const [search, setSearch] = useState("");

  const prefs = HOUMUKYOKU_DATA.map((d) => d.pref);

  const results = useMemo(() => {
    if (search.trim().length >= 2) {
      const q = search.trim();
      const matched: Array<{pref: string; city: string; office: string; address: string; phone: string; mapUrl: string}> = [];
      HOUMUKYOKU_DATA.forEach((d) => {
        d.cities.forEach((c) => {
          if (c.city.includes(q) || c.office.includes(q) || d.pref.includes(q)) {
            matched.push({ pref: d.pref, ...c });
          }
        });
      });
      return matched;
    }
    if (selectedPref) {
      const found = HOUMUKYOKU_DATA.find((d) => d.pref === selectedPref);
      return found ? found.cities.map((c) => ({ pref: found.pref, ...c })) : [];
    }
    return [];
  }, [selectedPref, search]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-kon to-ai text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-white/70 mb-2">
            <Link href="/souzoku-touki" className="hover:text-white">相続登記DIYガイド</Link> &rsaquo; 管轄法務局検索
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">🏛️ 管轄法務局検索</h1>
          <p className="text-gray-200 mt-2 text-sm">都道府県または市区町村名から管轄法務局を検索</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">市区町村名で検索</label>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelectedPref(""); }}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ai"
              placeholder="例：名古屋市、川崎市、松江市..."
            />
          </div>

          <div className="relative flex items-center my-4">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-600" />
            <span className="px-3 text-xs text-gray-400">または都道府県から選択</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-600" />
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
            {prefs.map((pref) => (
              <button
                key={pref}
                onClick={() => { setSelectedPref(pref); setSearch(""); }}
                className={`text-xs rounded-lg py-1.5 px-1 font-medium transition-all ${
                  selectedPref === pref
                    ? "bg-ai text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-ai"
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{results.length}件の法務局が見つかりました</p>
            {results.map((r, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">{r.pref}</div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{r.office}</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className="font-medium text-gray-600 dark:text-gray-300">管轄区域：</span>{r.city}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                        <span>📍</span>
                        <span>{r.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 mt-1">
                      <span>📞</span>
                      <a href={`tel:${r.phone}`} className="text-ai hover:underline font-medium">{r.phone}</a>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <a
                    href={r.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    🗺️ 地図で見る
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center text-gray-400">
            {search.length > 0 && search.length < 2 ? (
              <p className="text-sm">2文字以上入力してください</p>
            ) : selectedPref || search.length >= 2 ? (
              <>
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-sm">該当する法務局が見つかりませんでした</p>
                <p className="text-xs mt-1">別のキーワードで検索してみてください</p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3">🏛️</div>
                <p className="text-sm">都道府県を選択するか、市区町村名で検索してください</p>
              </>
            )}
          </div>
        )}

        {/* Note */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm text-yellow-800 dark:text-yellow-300">
          <p className="font-bold mb-1">ご注意</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>申請先は不動産の所在地を管轄する法務局です（相続人の住所地ではありません）</li>
            <li>管轄区域は変更される場合があります。最新情報は法務局HPまたは電話でご確認ください</li>
            <li>複数の不動産が異なる管轄にある場合は、それぞれの管轄法務局に申請が必要です</li>
          </ul>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">⚠️ {DISCLAIMER}</p>
      </div>
    </div>
  );
}
