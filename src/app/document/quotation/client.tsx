"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface QuotationItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export default function QuotationClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("見積書を作成しよう！");
  
  const [quotationNumber, setQuotationNumber] = useState("QT-001");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [validUntil, setValidUntil] = useState("");
  const [subject, setSubject] = useState("");
  
  const [sellerName, setSellerName] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [sellerTel, setSellerTel] = useState("");
  
  const [buyerName, setBuyerName] = useState("");
  
  const [items, setItems] = useState<QuotationItem[]>([
    { id: 1, name: "", quantity: 1, unit: "式", price: 0 },
  ]);
  
  const [taxRate, setTaxRate] = useState(10);
  const [notes, setNotes] = useState("・納期：ご発注後2週間程度\n・お支払い：納品後30日以内");

  useEffect(() => {
    setMounted(true);
    const valid = new Date();
    valid.setMonth(valid.getMonth() + 1);
    setValidUntil(valid.toISOString().split("T")[0]);
  }, []);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", quantity: 1, unit: "式", price: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof QuotationItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = Math.floor(subtotal * taxRate / 100);
  const total = subtotal + tax;

  const handlePrint = () => {
    if (!sellerName || !buyerName) {
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
        <nav className="mb-6 text-sm print:hidden">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/document" className="hover:text-kon">書類作成</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">見積書作成</li>
          </ol>
        </nav>

        <header className="text-center mb-8 print:hidden">
          <div className="text-5xl mb-4">📋</div>
          <h1 className="text-3xl font-bold text-kon mb-2">見積書作成</h1>
          <p className="text-gray-600 text-lg">PDF出力対応</p>
        </header>

        <div className="print:hidden mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 print:hidden">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">見積番号</label>
              <input type="text" value={quotationNumber} onChange={(e) => setQuotationNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">発行日</label>
              <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">有効期限</label>
              <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="○○のお見積り" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-kon mb-3">発行元</h3>
              <input type="text" placeholder="会社名 *" value={sellerName} onChange={(e) => setSellerName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2" />
              <input type="text" placeholder="住所" value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2" />
              <input type="text" placeholder="電話番号" value={sellerTel} onChange={(e) => setSellerTel(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <h3 className="font-bold text-kon mb-3">宛先</h3>
              <input type="text" placeholder="会社名・氏名 *" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </div>

          <h3 className="font-bold text-kon mb-3">明細</h3>
          <table className="w-full text-sm mb-4">
            <thead><tr className="bg-gray-50"><th className="px-2 py-2 text-left">品名</th><th className="px-2 py-2 w-20">数量</th><th className="px-2 py-2 w-16">単位</th><th className="px-2 py-2 w-28">単価</th><th className="px-2 py-2 w-28">金額</th><th className="w-10"></th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-2 py-2"><input type="text" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                  <td className="px-2 py-2"><input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} className="w-full px-2 py-1 border rounded text-center" /></td>
                  <td className="px-2 py-2"><input type="text" value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)} className="w-full px-2 py-1 border rounded text-center" /></td>
                  <td className="px-2 py-2"><input type="number" value={item.price} onChange={(e) => updateItem(item.id, "price", Number(e.target.value))} className="w-full px-2 py-1 border rounded text-right" /></td>
                  <td className="px-2 py-2 text-right">{(item.quantity * item.price).toLocaleString()}円</td>
                  <td className="px-2 py-2"><button onClick={() => removeItem(item.id)} className="text-red-500">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addItem} className="text-sm text-kon">+ 行を追加</button>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">備考</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Print Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-0">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">御見積書</h2>
          </div>

          <div className="flex justify-between mb-6">
            <div>
              <p className="font-bold text-lg">{buyerName || "宛先"} 御中</p>
              {subject && <p className="mt-2">件名: {subject}</p>}
            </div>
            <div className="text-right text-sm">
              <p>見積番号: {quotationNumber}</p>
              <p>発行日: {issueDate}</p>
              <p>有効期限: {validUntil}</p>
            </div>
          </div>

          <div className="bg-kon text-white text-center py-3 rounded-lg mb-6">
            <p className="text-sm">御見積金額</p>
            <p className="text-3xl font-bold">{total.toLocaleString()} 円（税込）</p>
          </div>

          <table className="w-full text-sm mb-6">
            <thead><tr className="border-b-2 border-kon"><th className="py-2 text-left">品名</th><th className="py-2 text-center w-20">数量</th><th className="py-2 text-center w-16">単位</th><th className="py-2 text-right w-24">単価</th><th className="py-2 text-right w-28">金額</th></tr></thead>
            <tbody>
              {items.filter(i => i.name).map((item) => (
                <tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-center">{item.quantity}</td><td className="py-2 text-center">{item.unit}</td><td className="py-2 text-right">{item.price.toLocaleString()}</td><td className="py-2 text-right">{(item.quantity * item.price).toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-1 border-b"><span>小計</span><span>{subtotal.toLocaleString()}円</span></div>
              <div className="flex justify-between py-1 border-b"><span>消費税（{taxRate}%）</span><span>{tax.toLocaleString()}円</span></div>
              <div className="flex justify-between py-2 font-bold text-lg"><span>合計</span><span>{total.toLocaleString()}円</span></div>
            </div>
          </div>

          {notes && <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">{notes}</div>}

          <div className="mt-8 pt-4 border-t text-sm">
            <p className="font-bold">{sellerName}</p>
            {sellerAddress && <p>{sellerAddress}</p>}
            {sellerTel && <p>TEL: {sellerTel}</p>}
          </div>
        </div>

        <div className="mt-6 print:hidden">
          <button onClick={handlePrint} className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg">印刷 / PDF保存</button>
        </div>

        <div className="mt-8 text-center print:hidden">
          <Link href="/document" className="text-kon hover:text-ai">← 書類作成一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
