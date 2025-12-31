"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface SeoContent {
  intro: string;
  useCases?: { title: string; desc: string }[];
  tips?: string;
}

interface ResumeClientProps {
  faq?: FAQ[];
  seoContent?: SeoContent;
}

interface HistoryItem {
  id: number;
  year: string;
  month: string;
  content: string;
}

export default function ResumeClient({ faq, seoContent }: ResumeClientProps) {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("履歴書を作成しよう！");

  // Personal Info
  const [name, setName] = useState("");
  const [furigana, setFurigana] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");

  // Education & Work History
  const [education, setEducation] = useState<HistoryItem[]>([
    { id: 1, year: "", month: "", content: "" },
  ]);
  const [work, setWork] = useState<HistoryItem[]>([
    { id: 1, year: "", month: "", content: "" },
  ]);

  // Qualifications & PR
  const [qualifications, setQualifications] = useState("");
  const [selfPR, setSelfPR] = useState("");
  const [motivation, setMotivation] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const addEducation = () => setEducation([...education, { id: Date.now(), year: "", month: "", content: "" }]);
  const addWork = () => setWork([...work, { id: Date.now(), year: "", month: "", content: "" }]);

  const updateEducation = (id: number, field: string, value: string) => {
    setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  const updateWork = (id: number, field: string, value: string) => {
    setWork(work.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const calculateAge = () => {
    if (!birthDate) return "";
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return `${age}歳`;
  };

  const handlePrint = () => {
    if (!name) {
      setMascotState("error");
      setMascotMessage("氏名を入力してね！");
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
            <li className="text-kon font-medium">履歴書作成</li>
          </ol>
        </nav>

        <header className="text-center mb-8 print:hidden">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-kon mb-2">履歴書作成</h1>
          <p className="text-gray-600 text-lg">JIS規格対応</p>
        </header>

        <div className="print:hidden mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 print:hidden space-y-6">
          <div>
            <h3 className="font-bold text-kon mb-3">基本情報</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="氏名 *" value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
              <input type="text" placeholder="ふりがな" value={furigana} onChange={(e) => setFurigana(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
                <option value="">性別</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
              <input type="text" placeholder="住所" value={address} onChange={(e) => setAddress(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg md:col-span-2" />
              <input type="tel" placeholder="電話番号" value={tel} onChange={(e) => setTel(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
              <input type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-kon mb-3">学歴</h3>
            {education.map((e, i) => (
              <div key={e.id} className="flex gap-2 mb-2">
                <input type="text" placeholder="年" value={e.year} onChange={(ev) => updateEducation(e.id, "year", ev.target.value)} className="w-20 px-2 py-1 border rounded" />
                <input type="text" placeholder="月" value={e.month} onChange={(ev) => updateEducation(e.id, "month", ev.target.value)} className="w-16 px-2 py-1 border rounded" />
                <input type="text" placeholder="学校名・卒業/入学" value={e.content} onChange={(ev) => updateEducation(e.id, "content", ev.target.value)} className="flex-1 px-2 py-1 border rounded" />
              </div>
            ))}
            <button onClick={addEducation} className="text-sm text-kon">+ 追加</button>
          </div>

          <div>
            <h3 className="font-bold text-kon mb-3">職歴</h3>
            {work.map((w) => (
              <div key={w.id} className="flex gap-2 mb-2">
                <input type="text" placeholder="年" value={w.year} onChange={(ev) => updateWork(w.id, "year", ev.target.value)} className="w-20 px-2 py-1 border rounded" />
                <input type="text" placeholder="月" value={w.month} onChange={(ev) => updateWork(w.id, "month", ev.target.value)} className="w-16 px-2 py-1 border rounded" />
                <input type="text" placeholder="会社名・入社/退社" value={w.content} onChange={(ev) => updateWork(w.id, "content", ev.target.value)} className="flex-1 px-2 py-1 border rounded" />
              </div>
            ))}
            <button onClick={addWork} className="text-sm text-kon">+ 追加</button>
          </div>

          <div>
            <h3 className="font-bold text-kon mb-3">資格・免許</h3>
            <textarea value={qualifications} onChange={(e) => setQualifications(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="普通自動車第一種運転免許&#10;日商簿記2級" />
          </div>

          <div>
            <h3 className="font-bold text-kon mb-3">自己PR</h3>
            <textarea value={selfPR} onChange={(e) => setSelfPR(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>

          <div>
            <h3 className="font-bold text-kon mb-3">志望動機</h3>
            <textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Print Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-0 print:p-4">
          <h2 className="text-2xl font-bold text-center mb-6 border-b-2 border-kon pb-2">履 歴 書</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
            <div className="col-span-2">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border">
                    <td className="border px-2 py-1 bg-gray-50 w-24">ふりがな</td>
                    <td className="border px-2 py-1">{furigana}</td>
                  </tr>
                  <tr className="border">
                    <td className="border px-2 py-1 bg-gray-50">氏名</td>
                    <td className="border px-2 py-1 text-lg font-bold">{name}</td>
                  </tr>
                  <tr className="border">
                    <td className="border px-2 py-1 bg-gray-50">生年月日</td>
                    <td className="border px-2 py-1">{birthDate} （{calculateAge()}） {gender}</td>
                  </tr>
                  <tr className="border">
                    <td className="border px-2 py-1 bg-gray-50">住所</td>
                    <td className="border px-2 py-1">{address}</td>
                  </tr>
                  <tr className="border">
                    <td className="border px-2 py-1 bg-gray-50">電話</td>
                    <td className="border px-2 py-1">{tel}</td>
                  </tr>
                  <tr className="border">
                    <td className="border px-2 py-1 bg-gray-50">Email</td>
                    <td className="border px-2 py-1">{email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border-2 border-gray-300 flex items-center justify-center text-gray-400 text-sm">
              写真
            </div>
          </div>

          <table className="w-full border-collapse text-sm mb-4">
            <thead>
              <tr><th colSpan={3} className="border px-2 py-1 bg-gray-50 text-left">学歴・職歴</th></tr>
              <tr className="bg-gray-50"><th className="border px-2 py-1 w-16">年</th><th className="border px-2 py-1 w-12">月</th><th className="border px-2 py-1">学歴・職歴</th></tr>
            </thead>
            <tbody>
              <tr><td colSpan={3} className="border px-2 py-1 text-center font-bold">学歴</td></tr>
              {education.filter(e => e.content).map((e) => (
                <tr key={e.id}><td className="border px-2 py-1 text-center">{e.year}</td><td className="border px-2 py-1 text-center">{e.month}</td><td className="border px-2 py-1">{e.content}</td></tr>
              ))}
              <tr><td colSpan={3} className="border px-2 py-1 text-center font-bold">職歴</td></tr>
              {work.filter(w => w.content).map((w) => (
                <tr key={w.id}><td className="border px-2 py-1 text-center">{w.year}</td><td className="border px-2 py-1 text-center">{w.month}</td><td className="border px-2 py-1">{w.content}</td></tr>
              ))}
              <tr><td colSpan={3} className="border px-2 py-1 text-right">以上</td></tr>
            </tbody>
          </table>

          <table className="w-full border-collapse text-sm mb-4">
            <tbody>
              <tr><td className="border px-2 py-1 bg-gray-50 w-24">資格・免許</td><td className="border px-2 py-1 whitespace-pre-wrap">{qualifications}</td></tr>
            </tbody>
          </table>

          <table className="w-full border-collapse text-sm mb-4">
            <tbody>
              <tr><td className="border px-2 py-1 bg-gray-50 w-24">自己PR</td><td className="border px-2 py-1 whitespace-pre-wrap min-h-20">{selfPR}</td></tr>
              <tr><td className="border px-2 py-1 bg-gray-50">志望動機</td><td className="border px-2 py-1 whitespace-pre-wrap min-h-20">{motivation}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 print:hidden">
          <button onClick={handlePrint} className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg">印刷 / PDF保存</button>
        </div>

        <div className="mt-8 text-center print:hidden">
          <Link href="/document" className="text-kon hover:text-ai">← 書類作成一覧に戻る</Link>
        </div>

        {/* SEO Content */}
        {seoContent && (
          <section className="mt-8 bg-white rounded-xl p-6 border border-gray-100 print:hidden">
            <h2 className="font-bold text-kon mb-4 text-lg">履歴書作成について</h2>
            <p className="text-gray-600 mb-4">{seoContent.intro}</p>
            {seoContent.useCases && (
              <div className="grid sm:grid-cols-2 gap-3 my-4">
                {seoContent.useCases.map((uc, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-800">{uc.title}</p>
                    <p className="text-sm text-gray-600">{uc.desc}</p>
                  </div>
                ))}
              </div>
            )}
            {seoContent.tips && (
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">💡 <strong>ヒント:</strong> {seoContent.tips}</p>
              </div>
            )}
          </section>
        )}

        {/* FAQ */}
        {faq && faq.length > 0 && (
          <section className="mt-8 print:hidden">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問</h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <details key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
                  <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-kon">Q.</span>
                      {item.question}
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">
                    <span className="text-kon font-medium">A.</span> {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
