"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Mascot from "@/components/common/Mascot";

const zodiacSigns = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const birthstones = ["ガーネット", "アメシスト", "アクアマリン", "ダイヤモンド", "エメラルド", "真珠", "ルビー", "ペリドット", "サファイア", "オパール", "トパーズ", "トルコ石"];
const constellations = [
  { name: "山羊座", start: [1, 1], end: [1, 19] },
  { name: "水瓶座", start: [1, 20], end: [2, 18] },
  { name: "魚座", start: [2, 19], end: [3, 20] },
  { name: "牡羊座", start: [3, 21], end: [4, 19] },
  { name: "牡牛座", start: [4, 20], end: [5, 20] },
  { name: "双子座", start: [5, 21], end: [6, 21] },
  { name: "蟹座", start: [6, 22], end: [7, 22] },
  { name: "獅子座", start: [7, 23], end: [8, 22] },
  { name: "乙女座", start: [8, 23], end: [9, 22] },
  { name: "天秤座", start: [9, 23], end: [10, 23] },
  { name: "蠍座", start: [10, 24], end: [11, 22] },
  { name: "射手座", start: [11, 23], end: [12, 21] },
  { name: "山羊座", start: [12, 22], end: [12, 31] },
];

export default function AgeCalcClient() {
  const [birthDate, setBirthDate] = useState("");

  const result = useMemo(() => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();

    // Age calculation
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    // Days lived
    const daysLived = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    // Next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= today) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Zodiac (干支)
    const zodiacIndex = (birth.getFullYear() - 4) % 12;
    const zodiac = zodiacSigns[zodiacIndex];

    // Birthstone
    const birthstone = birthstones[birth.getMonth()];

    // Constellation
    const month = birth.getMonth() + 1;
    const day = birth.getDate();
    let constellation = "";
    for (const c of constellations) {
      if (
        (month === c.start[0] && day >= c.start[1]) ||
        (month === c.end[0] && day <= c.end[1])
      ) {
        constellation = c.name;
        break;
      }
    }

    // Wareki
    let wareki = "";
    const year = birth.getFullYear();
    if (year >= 2019) wareki = `令和${year - 2018}年`;
    else if (year >= 1989) wareki = `平成${year - 1988}年`;
    else if (year >= 1926) wareki = `昭和${year - 1925}年`;
    else if (year >= 1912) wareki = `大正${year - 1911}年`;
    else if (year >= 1868) wareki = `明治${year - 1867}年`;

    return { age, daysLived, daysUntilBirthday, zodiac, birthstone, constellation, wareki };
  }, [birthDate]);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/generator" className="hover:text-kon">計算・生成ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">年齢計算</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🎂</div>
          <h1 className="text-3xl font-bold text-kon mb-2">年齢計算</h1>
          <p className="text-gray-600 text-lg">生年月日から詳細情報を計算</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state="idle" message="生年月日を入力してね！" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">生年月日</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full md:w-64 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon"
            />
          </div>

          {result && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-kon to-ai p-6 rounded-xl text-white text-center">
                <div className="text-5xl font-bold mb-2">{result.age}</div>
                <div className="text-lg opacity-80">歳</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-kon">{result.daysLived.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">日生きた</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-kon">{result.daysUntilBirthday}</div>
                  <div className="text-sm text-gray-600">日後に誕生日</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-kon">{result.wareki}</div>
                  <div className="text-sm text-gray-600">和暦</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-kon">{result.zodiac}年</div>
                  <div className="text-sm text-gray-600">干支</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-kon">{result.constellation}</div>
                  <div className="text-sm text-gray-600">星座</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-kon">{result.birthstone}</div>
                  <div className="text-sm text-gray-600">誕生石</div>
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai">← 計算・生成ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
