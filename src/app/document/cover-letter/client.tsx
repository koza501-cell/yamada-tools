"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";

interface Document {
  id: number;
  name: string;
  quantity: number;
}

export default function CoverLetterClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("送付状を作成しよう！");

  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [recipientCompany, setRecipientCompany] = useState("");
  const [recipientDept, setRecipientDept] = useState("");
  const [recipientName, setRecipientName] = useState("");
  
  const [senderCompany, setSenderCompany] = useState("");
  const [senderDept, setSenderDept] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [senderTel, setSenderTel] = useState("");
  
  const [subject, setSubject] = useState("書類送付のご案内");
  const [greeting, setGreeting] = useState("拝啓　時下ますますご清栄のこととお慶び申し上げます。\n平素は格別のご高配を賜り、厚く御礼申し上げます。");
  const [body, setBody] = useState("下記の書類をお送りいたしますので、ご査収のほどよろしくお願い申し上げます。");
  const [closing, setClosing] = useState("敬具");
  
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, name: "", quantity: 1 },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addDocument = () => setDocuments([...documents, { id: Date.now(), name: "", quantity: 1 }]);
  const removeDocument = (id: number) => {
    if (documents.length > 1) setDocuments(documents.filter(d => d.id !== id));
  };
  const updateDocument = (id: number, field: string, value: string | number) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handlePrint = () => {
    if (!recipientCompany || !senderName) {
      setMascotState("error");
      setMascotMessage("必須項目を入力してね！");
      return;
    }
    window.print();
  };

  if (!mounted) return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center">読み込み中...</div></div>;

  return (
    <div className="min-h-screen py-12 print:py-0">
      <div className="max-w-4xl mx-auto px-4 print:max-w-none">


        <header className="text-center mb-8 print:hidden">
          <div className="text-5xl mb-4">📨</div>
          <h1 className="text-3xl font-bold text-kon mb-2">送付状作成</h1>
          <p className="text-gray-600 text-lg">ビジネス送付状</p>
        </header>

        <div className="print:hidden mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 print:hidden space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-kon mb-3">送付先</h3>
              <input type="text" placeholder="会社名 *" value={recipientCompany} onChange={(e) => setRecipientCompany(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2" />
              <input type="text" placeholder="部署名" value={recipientDept} onChange={(e) => setRecipientDept(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2" />
              <input type="text" placeholder="担当者名" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <h3 className="font-bold text-kon mb-3">差出人</h3>
              <input type="text" placeholder="会社名" value={senderCompany} onChange={(e) => setSenderCompany(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2" />
              <input type="text" placeholder="部署名" value={senderDept} onChange={(e) => setSenderDept(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2" />
              <input type="text" placeholder="氏名 *" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2" />
              <input type="text" placeholder="住所" value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2" />
              <input type="text" placeholder="電話番号" value={senderTel} onChange={(e) => setSenderTel(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">件名</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">前文</label>
            <textarea value={greeting} onChange={(e) => setGreeting(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">本文</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>

          <div>
            <h3 className="font-bold text-kon mb-3">送付書類</h3>
            {documents.map((doc) => (
              <div key={doc.id} className="flex gap-2 mb-2">
                <input type="text" placeholder="書類名" value={doc.name} onChange={(e) => updateDocument(doc.id, "name", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg" />
                <input type="number" value={doc.quantity} onChange={(e) => updateDocument(doc.id, "quantity", Number(e.target.value))} className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center" />
                <span className="py-2">部</span>
                <button onClick={() => removeDocument(doc.id)} className="text-red-500 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-red-50">×</button>
              </div>
            ))}
            <button onClick={addDocument} className="text-sm text-kon py-2 px-3 rounded hover:bg-gray-50">+ 追加</button>
          </div>
        </div>

        {/* Print Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-0">
          <div className="text-right mb-8">{issueDate.replace(/-/g, "年").replace(/年(\d+)$/, "月$1日")}</div>

          <div className="mb-8">
            <p className="font-bold">{recipientCompany} 御中</p>
            {recipientDept && <p>{recipientDept}</p>}
            {recipientName && <p>{recipientName} 様</p>}
          </div>

          <div className="text-right mb-8">
            {senderCompany && <p>{senderCompany}</p>}
            {senderDept && <p>{senderDept}</p>}
            <p>{senderName}</p>
            {senderAddress && <p className="text-sm">{senderAddress}</p>}
            {senderTel && <p className="text-sm">TEL: {senderTel}</p>}
          </div>

          <h2 className="text-center text-lg font-bold mb-6 border-b pb-2">{subject}</h2>

          <div className="mb-6 whitespace-pre-wrap leading-relaxed">{greeting}</div>
          <div className="mb-8 whitespace-pre-wrap leading-relaxed">{body}</div>
          <div className="text-right mb-8">{closing}</div>

          <div className="border-t pt-4">
            <p className="text-center font-bold mb-4">記</p>
            <table className="mx-auto">
              <tbody>
                {documents.filter(d => d.name).map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-4 py-1">{doc.name}</td>
                    <td className="px-4 py-1 text-right">{doc.quantity}部</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-right mt-4">以上</p>
          </div>
        </div>

        <div className="mt-6 print:hidden">
          <button onClick={handlePrint} className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg">印刷 / PDF保存</button>
        </div>

        <div className="mt-8 text-center print:hidden">
          <Link href="/document" className="text-kon hover:text-ai">← 書類作成一覧に戻る</Link>
        </div>
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
