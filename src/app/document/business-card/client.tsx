"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

const themes = [
  { id: "classic", name: "クラシック", bg: "#ffffff", text: "#1a1a1a", accent: "#1e3a5f" },
  { id: "modern", name: "モダン", bg: "#f8f9fa", text: "#212529", accent: "#0d6efd" },
  { id: "dark", name: "ダーク", bg: "#1a1a2e", text: "#ffffff", accent: "#e94560" },
  { id: "natural", name: "ナチュラル", bg: "#f5f1eb", text: "#3d3d3d", accent: "#7c9473" },
  { id: "corporate", name: "コーポレート", bg: "#ffffff", text: "#333333", accent: "#c41e3a" },
];

export default function BusinessCardClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("名刺を作成しよう！");

  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("");
  const [tel, setTel] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  
  const [theme, setTheme] = useState(themes[0]);
  const [layout, setLayout] = useState<"horizontal" | "vertical">("horizontal");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => {
    if (!name || !company) {
      setMascotState("error");
      setMascotMessage("氏名と会社名を入力してね！");
      return;
    }
    window.print();
  };

  if (!mounted) return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center">読み込み中...</div></div>;

  return (
    <div className="min-h-screen py-12 print:py-0 print:bg-white">
      <div className="max-w-4xl mx-auto px-4 print:max-w-none">
        <nav className="mb-6 text-sm print:hidden">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/document" className="hover:text-kon">書類作成</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">名刺作成</li>
          </ol>
        </nav>

        <header className="text-center mb-8 print:hidden">
          <div className="text-5xl mb-4">💳</div>
          <h1 className="text-3xl font-bold text-kon mb-2">名刺作成</h1>
          <p className="text-gray-600 text-lg">シンプルデザイン</p>
        </header>

        <div className="print:hidden mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 print:hidden">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input type="text" placeholder="氏名 *" value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
            <input type="text" placeholder="氏名（英語）" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
            <input type="text" placeholder="会社名 *" value={company} onChange={(e) => setCompany(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
            <input type="text" placeholder="部署・役職" value={department} onChange={(e) => setDepartment(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
            <input type="text" placeholder="肩書き" value={title} onChange={(e) => setTitle(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
            <input type="tel" placeholder="電話番号" value={tel} onChange={(e) => setTel(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
            <input type="tel" placeholder="携帯番号" value={mobile} onChange={(e) => setMobile(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
            <input type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
            <input type="text" placeholder="住所" value={address} onChange={(e) => setAddress(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg md:col-span-2" />
            <input type="text" placeholder="Webサイト" value={website} onChange={(e) => setWebsite(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg md:col-span-2" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">テーマ</label>
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    theme.id === t.id ? "border-kon" : "border-transparent"
                  }`}
                  style={{ backgroundColor: t.bg, color: t.text }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">レイアウト</label>
            <div className="flex gap-2">
              <button onClick={() => setLayout("horizontal")} className={`px-4 py-2 rounded-lg ${layout === "horizontal" ? "bg-kon text-white" : "bg-gray-100"}`}>横型</button>
              <button onClick={() => setLayout("vertical")} className={`px-4 py-2 rounded-lg ${layout === "vertical" ? "bg-kon text-white" : "bg-gray-100"}`}>縦型</button>
            </div>
          </div>
        </div>

        {/* Card Preview */}
        <div className="flex justify-center mb-6">
          <div
            className={`shadow-lg rounded-lg overflow-hidden print:shadow-none ${layout === "horizontal" ? "w-[91mm] h-[55mm]" : "w-[55mm] h-[91mm]"}`}
            style={{ backgroundColor: theme.bg, color: theme.text }}
          >
            {layout === "horizontal" ? (
              <div className="p-4 h-full flex flex-col justify-between">
                <div>
                  <p className="text-xs" style={{ color: theme.accent }}>{company}</p>
                  {department && <p className="text-xs opacity-70">{department}</p>}
                </div>
                <div>
                  {title && <p className="text-xs mb-1" style={{ color: theme.accent }}>{title}</p>}
                  <p className="text-xl font-bold">{name || "氏名"}</p>
                  {nameEn && <p className="text-xs opacity-70">{nameEn}</p>}
                </div>
                <div className="text-xs space-y-0.5">
                  {tel && <p>TEL: {tel}</p>}
                  {mobile && <p>Mobile: {mobile}</p>}
                  {email && <p>Email: {email}</p>}
                  {address && <p className="opacity-70">{address}</p>}
                  {website && <p style={{ color: theme.accent }}>{website}</p>}
                </div>
              </div>
            ) : (
              <div className="p-4 h-full flex flex-col justify-between text-center">
                <div>
                  <p className="text-xs" style={{ color: theme.accent }}>{company}</p>
                  {department && <p className="text-xs opacity-70">{department}</p>}
                </div>
                <div>
                  {title && <p className="text-xs mb-1" style={{ color: theme.accent }}>{title}</p>}
                  <p className="text-lg font-bold">{name || "氏名"}</p>
                  {nameEn && <p className="text-xs opacity-70">{nameEn}</p>}
                </div>
                <div className="text-xs space-y-0.5">
                  {tel && <p>TEL: {tel}</p>}
                  {email && <p>{email}</p>}
                  {website && <p style={{ color: theme.accent }}>{website}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="print:hidden">
          <button onClick={handlePrint} className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg">印刷 / PDF保存</button>
          <p className="text-center text-sm text-gray-500 mt-2">※ 印刷設定で用紙サイズを「名刺」に設定してください</p>
        </div>

        <div className="mt-8 text-center print:hidden">
          <Link href="/document" className="text-kon hover:text-ai">← 書類作成一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
