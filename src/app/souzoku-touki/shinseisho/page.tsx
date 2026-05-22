'use client';

import { useState } from 'react';

type FormData = {
  deceased_name: string;
  deceased_death_date: string;
  deceased_honseki: string;
  deceased_last_address: string;
  heir_name: string;
  heir_address: string;
  heir_phone: string;
  heir_birth_date: string;
  property_type: '土地' | '建物';
  property_address: string;
  property_chiban: string;
  property_kaoku_number: string;
  property_chimoku: string;
  property_menseki: string;
  property_structure: string;
  property_value: string;
  registration_tax: string;
  application_date: string;
  houmukyoku_name: string;
  cause_date: string;
};

const initialForm: FormData = {
  deceased_name: '',
  deceased_death_date: '',
  deceased_honseki: '',
  deceased_last_address: '',
  heir_name: '',
  heir_address: '',
  heir_phone: '',
  heir_birth_date: '',
  property_type: '土地',
  property_address: '',
  property_chiban: '',
  property_kaoku_number: '',
  property_chimoku: '宅地',
  property_menseki: '',
  property_structure: '木造',
  property_value: '',
  registration_tax: '',
  application_date: new Date().toISOString().split('T')[0],
  houmukyoku_name: '',
  cause_date: '',
};

const Icons = {
  Download: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Doc: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Warn: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yamada-tools.jp';

export default function ShinseishoPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof FormData, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleGenerate = async () => {
    setError(null);
    const required: (keyof FormData)[] = [
      'deceased_name', 'deceased_death_date', 'deceased_honseki', 'deceased_last_address',
      'heir_name', 'heir_address',
      'property_address', 'property_menseki',
      'property_value', 'registration_tax',
      'application_date', 'houmukyoku_name', 'cause_date',
    ];
    const missing = required.filter((k) => !form[k] || String(form[k]).trim() === '');
    if (missing.length > 0) {
      setError('必須項目が未入力です。赤い印の項目をご確認ください。');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        property_value: Number(form.property_value) || 0,
        registration_tax: Number(form.registration_tax) || 0,
        heir_phone: form.heir_phone || null,
        heir_birth_date: form.heir_birth_date || null,
        property_chiban: form.property_chiban || null,
        property_kaoku_number: form.property_kaoku_number || null,
        property_chimoku: form.property_chimoku || null,
        property_structure: form.property_structure || null,
      };
      const res = await fetch(`${API_BASE}/api/souzoku-touki/shinseisho/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `生成失敗 (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `souzoku-touki-shinseisho-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'PDF生成中にエラーが発生しました';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1";
  const reqMark = <span className="text-red-500 ml-0.5">*</span>;

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <a href="/souzoku-touki" className="text-sm text-blue-600 hover:underline">← 相続登記DIYトップへ戻る</a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-blue-600"><Icons.Doc /></div>
            <h1 className="text-2xl font-bold text-slate-900">登記申請書 自動作成</h1>
          </div>
          <p className="text-sm text-slate-600">
            必要事項を入力すると、法務局公式書式に準拠した登記申請書のPDFがダウンロードできます。
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
          <div className="text-amber-600 flex-shrink-0 mt-0.5"><Icons.Warn /></div>
          <div className="text-sm text-amber-900">
            <strong>ご利用前に：</strong> 本ツールは法務局公式書式に基づく参考用テンプレートです。申請前に必ず管轄法務局または司法書士にご確認ください。記載漏れや誤りについて当社は責任を負いません。
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* 被相続人 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">1. 被相続人（亡くなった方）の情報</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>氏名{reqMark}</label>
                <input type="text" className={inputCls} value={form.deceased_name} onChange={(e) => update('deceased_name', e.target.value)} placeholder="山田 太郎" />
              </div>
              <div>
                <label className={labelCls}>死亡年月日{reqMark}</label>
                <input type="date" className={inputCls} value={form.deceased_death_date} onChange={(e) => update('deceased_death_date', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>本籍{reqMark}</label>
                <input type="text" className={inputCls} value={form.deceased_honseki} onChange={(e) => update('deceased_honseki', e.target.value)} placeholder="東京都〇〇区〇〇1-2-3" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>最後の住所{reqMark}</label>
                <input type="text" className={inputCls} value={form.deceased_last_address} onChange={(e) => update('deceased_last_address', e.target.value)} placeholder="東京都〇〇区〇〇1-2-3" />
              </div>
            </div>
          </section>

          {/* 相続人 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">2. 相続人（あなた）の情報</h2>
            <div className="text-xs text-slate-500 mb-3">※ v1は単独相続のみ対応。共同相続は順次対応予定。</div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>氏名{reqMark}</label>
                <input type="text" className={inputCls} value={form.heir_name} onChange={(e) => update('heir_name', e.target.value)} placeholder="山田 花子" />
              </div>
              <div>
                <label className={labelCls}>生年月日</label>
                <input type="date" className={inputCls} value={form.heir_birth_date} onChange={(e) => update('heir_birth_date', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>住所{reqMark}</label>
                <input type="text" className={inputCls} value={form.heir_address} onChange={(e) => update('heir_address', e.target.value)} placeholder="東京都〇〇区〇〇1-2-3" />
              </div>
              <div>
                <label className={labelCls}>電話番号</label>
                <input type="tel" className={inputCls} value={form.heir_phone} onChange={(e) => update('heir_phone', e.target.value)} placeholder="03-1234-5678" />
              </div>
            </div>
          </section>

          {/* 原因日 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">3. 相続の原因</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>相続原因日付（通常は死亡日）{reqMark}</label>
                <input type="date" className={inputCls} value={form.cause_date} onChange={(e) => update('cause_date', e.target.value)} />
              </div>
            </div>
          </section>

          {/* 不動産 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">4. 不動産の情報</h2>
            <div className="text-xs text-slate-500 mb-3">※ v1は1物件のみ対応。複数物件は順次対応予定。</div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>種別{reqMark}</label>
                <select className={inputCls} value={form.property_type} onChange={(e) => update('property_type', e.target.value as '土地' | '建物')}>
                  <option value="土地">土地</option>
                  <option value="建物">建物</option>
                </select>
              </div>
              <div></div>
              <div className="md:col-span-2">
                <label className={labelCls}>所在{reqMark}</label>
                <input type="text" className={inputCls} value={form.property_address} onChange={(e) => update('property_address', e.target.value)} placeholder="東京都〇〇区〇〇" />
              </div>
              {form.property_type === '土地' ? (
                <>
                  <div>
                    <label className={labelCls}>地番</label>
                    <input type="text" className={inputCls} value={form.property_chiban} onChange={(e) => update('property_chiban', e.target.value)} placeholder="1番2" />
                  </div>
                  <div>
                    <label className={labelCls}>地目</label>
                    <input type="text" className={inputCls} value={form.property_chimoku} onChange={(e) => update('property_chimoku', e.target.value)} placeholder="宅地" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className={labelCls}>家屋番号</label>
                    <input type="text" className={inputCls} value={form.property_kaoku_number} onChange={(e) => update('property_kaoku_number', e.target.value)} placeholder="1番2" />
                  </div>
                  <div>
                    <label className={labelCls}>構造</label>
                    <input type="text" className={inputCls} value={form.property_structure} onChange={(e) => update('property_structure', e.target.value)} placeholder="木造瓦葺2階建" />
                  </div>
                </>
              )}
              <div>
                <label className={labelCls}>{form.property_type === '土地' ? '地積' : '床面積'}（m²）{reqMark}</label>
                <input type="text" className={inputCls} value={form.property_menseki} onChange={(e) => update('property_menseki', e.target.value)} placeholder="123.45" />
              </div>
              <div>
                <label className={labelCls}>固定資産評価額（円）{reqMark}</label>
                <input type="number" className={inputCls} value={form.property_value} onChange={(e) => update('property_value', e.target.value)} placeholder="10000000" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>登録免許税（円）{reqMark}</label>
                <input type="number" className={inputCls} value={form.registration_tax} onChange={(e) => update('registration_tax', e.target.value)} placeholder="40000" />
                <p className="text-xs text-slate-500 mt-1">※ 評価額 × 0.4%（小数点以下切捨て、100円未満切捨て）。<a href="/souzoku-touki/tax" className="text-blue-600 hover:underline">税額計算ツール</a>で算出できます。</p>
              </div>
            </div>
          </section>

          {/* 申請日・管轄 */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">5. 申請日・提出先</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>申請年月日{reqMark}</label>
                <input type="date" className={inputCls} value={form.application_date} onChange={(e) => update('application_date', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>管轄法務局名{reqMark}</label>
                <input type="text" className={inputCls} value={form.houmukyoku_name} onChange={(e) => update('houmukyoku_name', e.target.value)} placeholder="東京法務局〇〇出張所" />
                <p className="text-xs text-slate-500 mt-1"><a href="/souzoku-touki/houmukyoku" className="text-blue-600 hover:underline">管轄法務局検索</a>で確認できます。</p>
              </div>
            </div>
          </section>

          {/* エラー */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* CTA */}
          <div className="sticky bottom-4">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
            >
              <Icons.Download />
              {loading ? 'PDF生成中...' : '登記申請書PDFをダウンロード'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-xs text-slate-500 text-center">
          生成されたPDFは法務局公式書式に基づく参考用です。最終確認は司法書士または管轄法務局へお願いします。
        </div>
      </div>
    </main>
  );
}
