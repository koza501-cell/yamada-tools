"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export default function InvoiceClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("請求書を作成しよう！");
  
  // Invoice data
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [tNumber, setTNumber] = useState("");
  
  // Seller info
  const [sellerName, setSellerName] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [sellerTel, setSellerTel] = useState("");
  
  // Buyer info
  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  
  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, name: "", quantity: 1, unit: "個", price: 0 },
  ]);
  
  const [taxRate, setTaxRate] = useState(10);
  const [notes, setNotes] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const due = new Date();
    due.setMonth(due.getMonth() + 1);
    setDueDate(due.toISOString().split("T")[0]);
  }, []);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", quantity: 1, unit: "個", price: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = Math.floor(subtotal * taxRate / 100);
  const total = subtotal + tax;

  const handlePrint = () => {
    if (!sellerName || !buyerName || items.every(i => !i.name)) {
      setMascotState("error");
      setMascotMessage("必須項目を入力してね！");
      return;
    }
    setMascotState("success");
    setMascotMessage("印刷画面を開くよ！");
    window.print();
  };

  if (!mounted) {
    return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center">読み込み中...</div></div>;
  }

  return (
    <div className="min-h-screen py-12 print:py-0 print:bg-white">
      <div className="max-w-4xl mx-auto px-4 print:max-w-none print:px-0">
        <nav className="mb-6 text-sm print:hidden">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/document" className="hover:text-kon">書類作成</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">請求書作成</li>
          </ol>
        </nav>

        <header className="text-center mb-8 print:hidden">
          <div className="text-5xl mb-4">📑</div>
          <h1 className="text-3xl font-bold text-kon mb-2">請求書作成</h1>
          <p className="text-gray-600 text-lg">インボイス制度対応</p>
        </header>

        <div className="print:hidden mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        {/* Input Form - Hidden when printing */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 print:hidden">
          <h2 className="font-bold text-kon mb-4">基本情報</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">請求書番号</label>
              <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">発行日</label>
              <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">支払期限</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-kon mb-3">請求元（自社）</h3>
              <div className="space-y-3">
                <input type="text" placeholder="会社名・氏名 *" value={sellerName} onChange={(e) => setSellerName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                <input type="text" placeholder="住所" value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                <input type="text" placeholder="電話番号" value={sellerTel} onChange={(e) => setSellerTel(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                <input type="text" placeholder="適格請求書発行事業者番号 (T + 13桁)" value={tNumber} onChange={(e) => setTNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-kon mb-3">請求先</h3>
              <div className="space-y-3">
                <input type="text" placeholder="会社名・氏名 *" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                <input type="text" placeholder="住所" value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
            </div>
          </div>

          <h3 className="font-bold text-kon mb-3">明細</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-left">品名</th>
                  <th className="px-2 py-2 w-20">数量</th>
                  <th className="px-2 py-2 w-16">単位</th>
                  <th className="px-2 py-2 w-28">単価</th>
                  <th className="px-2 py-2 w-28">金額</th>
                  <th className="px-2 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-2 py-2">
                      <input type="text" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded" placeholder="品名" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded text-center" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="text" value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-center" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" value={item.price} onChange={(e) => updateItem(item.id, "price", Number(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded text-right" />
                    </td>
                    <td className="px-2 py-2 text-right font-medium">{(item.quantity * item.price).toLocaleString()}円</td>
                    <td className="px-2 py-2">
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addItem} className="text-sm text-kon hover:text-ai">+ 行を追加</button>

          <div className="flex items-center gap-4 mt-4">
            <label className="text-sm">消費税率:</label>
            <select value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="px-3 py-1 border border-gray-200 rounded-lg">
              <option value={10}>10%</option>
              <option value={8}>8%（軽減税率）</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="振込先口座など" />
          </div>
        </div>

        {/* Preview / Print Area */}
        <div ref={printRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-0 print:rounded-none">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">請求書</h2>
          </div>

          <div className="flex justify-between mb-6">
            <div>
              <p className="font-bold text-lg">{buyerName || "請求先名"} 御中</p>
              {buyerAddress && <p className="text-sm text-gray-600">{buyerAddress}</p>}
            </div>
            <div className="text-right text-sm">
              <p>請求書番号: {invoiceNumber}</p>
              <p>発行日: {issueDate}</p>
              <p>支払期限: {dueDate}</p>
            </div>
          </div>

          <div className="bg-kon text-white text-center py-3 rounded-lg mb-6">
            <p className="text-sm">ご請求金額</p>
            <p className="text-3xl font-bold">{total.toLocaleString()} 円</p>
          </div>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b-2 border-kon">
                <th className="py-2 text-left">品名</th>
                <th className="py-2 text-center w-20">数量</th>
                <th className="py-2 text-center w-16">単位</th>
                <th className="py-2 text-right w-24">単価</th>
                <th className="py-2 text-right w-28">金額</th>
              </tr>
            </thead>
            <tbody>
              {items.filter(i => i.name).map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-center">{item.unit}</td>
                  <td className="py-2 text-right">{item.price.toLocaleString()}</td>
                  <td className="py-2 text-right">{(item.quantity * item.price).toLocaleString()}</td>
                </tr>
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

          {notes && (
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-1">備考</p>
              <p className="text-sm whitespace-pre-wrap">{notes}</p>
            </div>
          )}

          <div className="mt-8 pt-4 border-t text-sm">
            <p className="font-bold">{sellerName || "請求元名"}</p>
            {sellerAddress && <p>{sellerAddress}</p>}
            {sellerTel && <p>TEL: {sellerTel}</p>}
            {tNumber && <p>登録番号: {tNumber}</p>}
          </div>
        </div>

        <div className="mt-6 print:hidden">
          <button onClick={handlePrint} className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg">
            印刷 / PDF保存
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">※ 印刷画面でPDFとして保存できます</p>
        </div>

        <div className="mt-8 text-center print:hidden">
          <Link href="/document" className="text-kon hover:text-ai">← 書類作成一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
