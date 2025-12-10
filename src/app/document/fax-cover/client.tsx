"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

const GREETING_TEMPLATES = [
  { id: "standard", label: "標準", text: "いつもお世話になっております。" },
  { id: "formal", label: "丁寧", text: "平素は格別のご高配を賜り、厚く御礼申し上げます。" },
  { id: "first", label: "初回", text: "突然のご連絡失礼いたします。" },
  { id: "reply", label: "返信", text: "ご連絡いただきありがとうございます。" },
  { id: "custom", label: "カスタム", text: "" },
];

const ACTION_OPTIONS = [
  { id: "confirm", label: "ご確認ください" },
  { id: "reply", label: "ご返信ください" },
  { id: "urgent", label: "至急ご対応ください" },
  { id: "info", label: "ご参考まで" },
  { id: "sign", label: "ご署名・ご捺印ください" },
];

export default function FaxCoverClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("FAX送付状を作成しよう！");

  const [sendDate, setSendDate] = useState(new Date().toISOString().split("T")[0]);
  const [totalPages, setTotalPages] = useState(1);
  const [subject, setSubject] = useState("");

  const [toCompany, setToCompany] = useState("");
  const [toDepartment, setToDepartment] = useState("");
  const [toName, setToName] = useState("");
  const [toFax, setToFax] = useState("");

  const [fromCompany, setFromCompany] = useState("");
  const [fromDepartment, setFromDepartment] = useState("");
  const [fromName, setFromName] = useState("");
  const [fromTel, setFromTel] = useState("");
  const [fromFax, setFromFax] = useState("");

  const [greetingType, setGreetingType] = useState("standard");
  const [greeting, setGreeting] = useState(GREETING_TEMPLATES[0].text);
  const [message, setMessage] = useState("");
  const [selectedActions, setSelectedActions] = useState<string[]>(["confirm"]);
  const [closing, setClosing] = useState("以上、よろしくお願いいたします。");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const template = GREETING_TEMPLATES.find(t => t.id === greetingType);
    if (template && greetingType !== "custom") {
      setGreeting(template.text);
    }
  }, [greetingType]);

  const toggleAction = (id: string) => {
    setSelectedActions(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    if (!toCompany || !fromCompany) {
      setMascotState("error");
      setMascotMessage("宛先と差出人を入力してね！");
      return;
    }
    setMascotState("success");
    setMascotMessage("印刷画面を開くよ！");
    window.print();
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 print:py-0 print:bg-white">
      <div className="max-w-4xl mx-auto px-4 print:max-w-none print:px-0">
        <nav className="mb-6 text-sm print:hidden">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/document" className="hover:text-blue-600">書類作成</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">FAX送付状</li>
          </ol>
        </nav>

        <header className="text-center mb-8 print:hidden">
          <div className="text-5xl mb-4">📠</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FAX送付状作成</h1>
          <p className="text-gray-600">ビジネス用テンプレート・登録不要</p>
        </header>

        <div className="print:hidden mb-6 flex justify-center">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 print:hidden">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">送信日</label>
              <input type="date" value={sendDate} onChange={(e) => setSendDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">送信枚数（本状含む）</label>
              <input type="number" min={1} value={totalPages} onChange={(e) => setTotalPages(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="書類送付の件" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">宛先（TO）</h3>
              <div className="space-y-3">
                <input type="text" placeholder="会社名 *" value={toCompany} onChange={(e) => setToCompany(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="部署名" value={toDepartment} onChange={(e) => setToDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="担当者名" value={toName} onChange={(e) => setToName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="FAX番号" value={toFax} onChange={(e) => setToFax(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">差出人（FROM）</h3>
              <div className="space-y-3">
                <input type="text" placeholder="会社名 *" value={fromCompany} onChange={(e) => setFromCompany(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="部署名" value={fromDepartment} onChange={(e) => setFromDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="担当者名" value={fromName} onChange={(e) => setFromName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="TEL" value={fromTel} onChange={(e) => setFromTel(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="FAX" value={fromFax} onChange={(e) => setFromFax(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 mb-3">本文</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">挨拶文</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {GREETING_TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setGreetingType(t.id)} className={`px-3 py-1 text-sm rounded-full ${greetingType === t.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <input type="text" value={greeting} onChange={(e) => { setGreeting(e.target.value); setGreetingType("custom"); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">通信欄</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="下記書類をお送りいたします。ご査収のほどよろしくお願いいたします。" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">対応区分</label>
            <div className="flex flex-wrap gap-2">
              {ACTION_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => toggleAction(opt.id)} className={`px-3 py-1 text-sm rounded-lg border ${selectedActions.includes(opt.id) ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                  {selectedActions.includes(opt.id) ? "✓ " : ""}{opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">結び</label>
            <input type="text" value={closing} onChange={(e) => setClosing(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>

        {/* Preview / Print Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 print:shadow-none print:border-0 print:rounded-none">
          <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
            <h2 className="text-3xl font-bold tracking-widest">FAX送付状</h2>
          </div>

          <div className="flex justify-between text-sm mb-6">
            <div>送信日: {sendDate}</div>
            <div>送信枚数: {totalPages}枚（本状含む）</div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-300 p-4">
              <p className="text-xs text-gray-500 mb-2 font-bold">TO（宛先）</p>
              <p className="font-bold text-lg">{toCompany || "会社名"}</p>
              {toDepartment && <p>{toDepartment}</p>}
              {toName && <p>{toName} 様</p>}
              {toFax && <p className="mt-2 text-sm">FAX: {toFax}</p>}
            </div>
            <div className="border border-gray-300 p-4">
              <p className="text-xs text-gray-500 mb-2 font-bold">FROM（差出人）</p>
              <p className="font-bold">{fromCompany || "会社名"}</p>
              {fromDepartment && <p>{fromDepartment}</p>}
              {fromName && <p>{fromName}</p>}
              <div className="mt-2 text-sm">
                {fromTel && <p>TEL: {fromTel}</p>}
                {fromFax && <p>FAX: {fromFax}</p>}
              </div>
            </div>
          </div>

          {subject && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">件名</p>
              <p className="font-bold text-lg border-b border-gray-300 pb-1">{subject}</p>
            </div>
          )}

          <div className="mb-6">
            <p className="mb-2">{toName ? `${toName}様` : `${toCompany}御中`}</p>
            <p className="mb-4">{greeting}</p>
            {message && <p className="whitespace-pre-wrap">{message}</p>}
          </div>

          {selectedActions.length > 0 && (
            <div className="mb-6 p-3 bg-gray-50 border border-gray-200">
              <p className="text-sm font-bold mb-2">ご対応のお願い:</p>
              <div className="flex flex-wrap gap-3">
                {selectedActions.map(id => {
                  const opt = ACTION_OPTIONS.find(o => o.id === id);
                  return opt ? (
                    <span key={id} className="text-sm">☑ {opt.label}</span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <p className="text-right">{closing}</p>

          <div className="mt-8 pt-4 border-t border-dashed text-xs text-gray-500 text-center">
            ※ 本FAXが届かない場合は、上記連絡先までご一報ください。
          </div>
        </div>

        <div className="mt-6 print:hidden">
          <button onClick={handlePrint} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg">
            印刷 / PDF保存
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">※ 印刷画面でPDFとして保存できます</p>
        </div>

        <div className="mt-8 text-center print:hidden">
          <Link href="/document" className="text-blue-600 hover:text-blue-800">← 書類作成一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
