'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ExpertSupervision from '@/components/ExpertSupervision';

const Icons = {
  Check: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  AlertTriangle: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>),
  ArrowRight: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>),
  Search: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>),
  Shield: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>),
};

interface LicenseInfo {
  id: string;
  category: string;
  business: string;
  licenseName: string;
  type: 'permit' | 'registration' | 'notification';
  authority: string;
  estimatedDays: string;
  estimatedCost: string;
  capitalReq: string;
  qualifications: string;
  penalty: string;
  teikanMokuteki: string;
  notes: string;
}

const LICENSE_DATA: LicenseInfo[] = [
  { id: 'inshoku', category: '飲食・食品', business: '飲食店の開業', licenseName: '飲食店営業許可', type: 'permit', authority: '保健所', estimatedDays: '約2週間', estimatedCost: '¥16,000〜19,000', capitalReq: 'なし', qualifications: '食品衛生責任者（1日講習で取得可）', penalty: '2年以下の懲役または200万円以下の罰金', teikanMokuteki: '飲食店の経営', notes: '店舗の設備基準（シンク2槽等）を満たす必要あり' },
  { id: 'shokuhin-seizou', category: '飲食・食品', business: '食品の製造・加工', licenseName: '食品製造業許可', type: 'permit', authority: '保健所', estimatedDays: '約2〜3週間', estimatedCost: '¥16,000〜21,000', capitalReq: 'なし', qualifications: '食品衛生責任者', penalty: '2年以下の懲役または200万円以下の罰金', teikanMokuteki: '食料品の製造、加工及び販売', notes: '製造する食品の種類ごとに許可が必要' },
  { id: 'shurui', category: '飲食・食品', business: '酒類の販売', licenseName: '酒類販売業免許', type: 'permit', authority: '税務署', estimatedDays: '約2か月', estimatedCost: '¥30,000（登録免許税）', capitalReq: 'なし', qualifications: 'なし（ただし酒類販売管理者の選任が必要）', penalty: '1年以下の懲役または50万円以下の罰金', teikanMokuteki: '酒類の販売業', notes: '通信販売は「通信販売酒類小売業免許」が別途必要' },
  { id: 'kensetsu', category: '建設', business: '建設工事の請負', licenseName: '建設業許可', type: 'permit', authority: '都道府県知事 / 国土交通大臣', estimatedDays: '約1〜3か月', estimatedCost: '¥90,000（知事許可）/ ¥150,000（大臣許可）', capitalReq: '500万円以上の自己資本', qualifications: '経営業務管理責任者 + 専任技術者', penalty: '3年以下の懲役または300万円以下の罰金', teikanMokuteki: '土木建築工事の設計、施工及び請負', notes: '請負金額500万円未満（建築は1,500万円未満）は不要。29業種ごとの許可' },
  { id: 'denki', category: '建設', business: '電気工事', licenseName: '電気工事業者登録', type: 'registration', authority: '都道府県知事', estimatedDays: '約2〜4週間', estimatedCost: '¥22,000', capitalReq: 'なし', qualifications: '第一種または第二種電気工事士', penalty: '1年以下の懲役または10万円以下の罰金', teikanMokuteki: '電気工事の設計及び施工', notes: '建設業許可がある場合は届出のみ（みなし登録）' },
  { id: 'takuchi', category: '不動産', business: '不動産の売買・仲介', licenseName: '宅地建物取引業免許', type: 'permit', authority: '都道府県知事 / 国土交通大臣', estimatedDays: '約1〜2か月', estimatedCost: '¥33,000（知事免許）', capitalReq: '営業保証金1,000万円（保証協会加入なら60万円）', qualifications: '宅地建物取引士（事務所ごとに5人に1人以上）', penalty: '3年以下の懲役または300万円以下の罰金', teikanMokuteki: '不動産の売買、仲介及び斡旋', notes: '賃貸管理のみなら不要（管理業者登録は別途）' },
  { id: 'mansion-kanri', category: '不動産', business: 'マンション管理業', licenseName: 'マンション管理業者登録', type: 'registration', authority: '国土交通大臣', estimatedDays: '約2〜3か月', estimatedCost: '¥90,000', capitalReq: 'なし', qualifications: '管理業務主任者', penalty: '1年以下の懲役または50万円以下の罰金', teikanMokuteki: 'マンション管理業', notes: '管理組合から委託を受けて管理する場合に必要' },
  { id: 'kobutsu', category: '小売・物販', business: '中古品の売買', licenseName: '古物商許可', type: 'permit', authority: '公安委員会（警察署経由）', estimatedDays: '約40日', estimatedCost: '¥19,000', capitalReq: 'なし', qualifications: 'なし', penalty: '3年以下の懲役または100万円以下の罰金', teikanMokuteki: '古物の売買及び交換', notes: 'ネットでの中古品販売（メルカリ仕入れ→転売等）も対象' },
  { id: 'haken', category: '人材', business: '人材派遣業', licenseName: '労働者派遣事業許可', type: 'permit', authority: '厚生労働大臣', estimatedDays: '約2〜3か月', estimatedCost: '¥210,000（許可手数料+登録免許税）', capitalReq: '基準資産額2,000万円以上', qualifications: '派遣元責任者（講習受講必須）', penalty: '1年以下の懲役または100万円以下の罰金', teikanMokuteki: '労働者派遣事業', notes: '事業所面積20㎡以上等の要件あり' },
  { id: 'shokai', category: '人材', business: '人材紹介業', licenseName: '有料職業紹介事業許可', type: 'permit', authority: '厚生労働大臣', estimatedDays: '約2〜3か月', estimatedCost: '¥55,000', capitalReq: '基準資産額500万円以上', qualifications: '職業紹介責任者（講習受講必須）', penalty: '1年以下の懲役または100万円以下の罰金', teikanMokuteki: '有料職業紹介事業', notes: '事業所面積20㎡以上等の要件あり' },
  { id: 'ryokou-1', category: '旅行・観光', business: '旅行業（第1種）', licenseName: '第1種旅行業登録', type: 'registration', authority: '観光庁長官', estimatedDays: '約2か月', estimatedCost: '¥90,000', capitalReq: '営業保証金7,000万円（保証協会加入なら1,400万円）', qualifications: '旅行業務取扱管理者', penalty: '1年以下の懲役または100万円以下の罰金', teikanMokuteki: '旅行業及び旅行代理店業', notes: '海外・国内の募集型企画旅行が可能' },
  { id: 'ryokou-3', category: '旅行・観光', business: '旅行業（第3種）', licenseName: '第3種旅行業登録', type: 'registration', authority: '都道府県知事', estimatedDays: '約1〜2か月', estimatedCost: '¥90,000', capitalReq: '営業保証金300万円（保証協会加入なら60万円）', qualifications: '旅行業務取扱管理者', penalty: '1年以下の懲役または100万円以下の罰金', teikanMokuteki: '旅行業及び旅行代理店業', notes: '国内の受注型企画旅行・手配旅行が可能' },
  { id: 'minpaku', category: '旅行・観光', business: '民泊（住宅宿泊事業）', licenseName: '住宅宿泊事業届出', type: 'notification', authority: '都道府県知事', estimatedDays: '約1〜2週間', estimatedCost: 'なし（届出無料）', capitalReq: 'なし', qualifications: 'なし', penalty: '6か月以下の懲役または100万円以下の罰金', teikanMokuteki: '住宅宿泊事業', notes: '年間180日の上限あり。自治体の条例で制限される場合もあり' },
  { id: 'biyou', category: '美容・健康', business: '美容室の開業', licenseName: '美容所開設届', type: 'notification', authority: '保健所', estimatedDays: '約1〜2週間', estimatedCost: '¥24,000前後', capitalReq: 'なし', qualifications: '美容師免許', penalty: '30万円以下の罰金', teikanMokuteki: '美容業', notes: '施設の構造設備基準（面積・衛生設備等）あり' },
  { id: 'yakkyoku', category: '医療・薬品', business: '薬局・ドラッグストア', licenseName: '薬局開設許可', type: 'permit', authority: '都道府県知事', estimatedDays: '約1〜2か月', estimatedCost: '¥30,000前後', capitalReq: 'なし', qualifications: '薬剤師', penalty: '3年以下の懲役または300万円以下の罰金', teikanMokuteki: '薬局の経営及び医薬品の販売', notes: '管理薬剤師の配置が必要' },
  { id: 'unsou', category: '運送・物流', business: '一般貨物運送業', licenseName: '一般貨物自動車運送事業許可', type: 'permit', authority: '国土交通大臣（地方運輸局）', estimatedDays: '約3〜6か月', estimatedCost: '¥120,000', capitalReq: '自己資金要件あり（車両費等の合計）', qualifications: '運行管理者 + 整備管理者', penalty: '3年以下の懲役または300万円以下の罰金', teikanMokuteki: '一般貨物自動車運送事業', notes: '車両5台以上・営業所・車庫の確保が必要' },
  { id: 'keikaku', category: '運送・物流', business: '軽貨物運送業', licenseName: '貨物軽自動車運送事業届出', type: 'notification', authority: '運輸支局', estimatedDays: '即日〜数日', estimatedCost: 'なし', capitalReq: 'なし', qualifications: 'なし', penalty: '100万円以下の罰金', teikanMokuteki: '貨物軽自動車運送事業', notes: '届出制のため比較的容易。軽バン1台から開始可能' },
  { id: 'keibi', category: 'サービス', business: '警備業', licenseName: '警備業認定', type: 'permit', authority: '公安委員会', estimatedDays: '約40日', estimatedCost: '¥23,000', capitalReq: 'なし', qualifications: '警備員指導教育責任者', penalty: '1年以下の懲役または100万円以下の罰金', teikanMokuteki: '警備業', notes: '欠格事由あり（破産者、暴力団員等は不可）' },
  { id: 'kaigo', category: '介護・福祉', business: '介護事業', licenseName: '介護事業者指定', type: 'permit', authority: '都道府県知事 / 市区町村長', estimatedDays: '約1〜3か月', estimatedCost: '無料〜数万円', capitalReq: 'なし（法人格が必要）', qualifications: 'サービス種類により異なる（介護福祉士等）', penalty: '指定取消・返還命令', teikanMokuteki: '介護保険法に基づく居宅サービス事業', notes: 'サービスの種類ごとに個別の指定が必要' },
  { id: 'sanpai', category: '環境', business: '産業廃棄物の収集・運搬', licenseName: '産業廃棄物収集運搬業許可', type: 'permit', authority: '都道府県知事', estimatedDays: '約2か月', estimatedCost: '¥81,000（新規）', capitalReq: 'なし（ただし財務要件あり）', qualifications: '産業廃棄物処理業の講習修了', penalty: '5年以下の懲役または1,000万円以下の罰金', teikanMokuteki: '産業廃棄物の収集、運搬及び処理', notes: '排出元と処理先の都道府県それぞれで許可が必要' },
];

const CATEGORIES = [...new Set(LICENSE_DATA.map((l) => l.category))];

function getTypeLabel(t: 'permit' | 'registration' | 'notification'): string {
  return t === 'permit' ? '許可' : t === 'registration' ? '登録' : '届出';
}

function getTypeColor(t: 'permit' | 'registration' | 'notification'): string {
  return t === 'permit' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    : t === 'registration' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
}

export default function KyoninkaCheckerClient() {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => { setMounted(true); }, []);

  const toggleItem = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const filtered = filterCategory === 'all' ? LICENSE_DATA : LICENSE_DATA.filter((l) => l.category === filterCategory);
  const selectedItems = LICENSE_DATA.filter((l) => selected.includes(l.id));

  if (!mounted) return <div className="min-h-screen py-12 flex items-center justify-center text-gray-500 dark:text-gray-400">読み込み中...</div>;

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-pink-500 transition-colors">ホーム</Link>
          <span className="mx-2">{'>'}</span>
          <Link href="/business" className="hover:text-pink-500 transition-colors">ビジネス・法人</Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-gray-900 dark:text-gray-100">許認可チェッカー</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">許認可チェッカー</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          予定している事業を選ぶだけで、<strong>必要な許認可・届出・免許</strong>を判定します。届出先・費用・期間・必要な資格者まで一覧表示。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button type="button" onClick={() => setFilterCategory('all')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filterCategory === 'all' ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}>全て</button>
          {CATEGORIES.map((cat) => (
            <button key={cat} type="button" onClick={() => setFilterCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filterCategory === cat ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}>{cat}</button>
          ))}
        </div>

        {/* Business selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-1.5"><Icons.Search /> 事業内容を選択（複数可）</h2>
            <p className="text-xs text-gray-400 mt-0.5">{selected.length}件選択中</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
            {filtered.map((lic) => {
              const isSelected = selected.includes(lic.id);
              return (
                <button key={lic.id} type="button" onClick={() => toggleItem(lic.id)}
                  className={`text-left px-6 py-3 flex items-center justify-between transition-all ${isSelected ? 'bg-pink-50/50 dark:bg-pink-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
                  <div>
                    <span className={`text-sm font-medium ${isSelected ? 'text-pink-700 dark:text-pink-400' : 'text-gray-700 dark:text-gray-300'}`}>{lic.business}</span>
                    <span className="text-xs text-gray-400 ml-2">{lic.category}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(lic.type)}`}>{getTypeLabel(lic.type)}</span>
                    {isSelected && <span className="text-pink-500"><Icons.Check /></span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {selectedItems.length > 0 && (
          <div className="space-y-6 mb-12">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 text-white shadow-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2"><Icons.Shield /><span className="text-sm text-slate-300">必要な許認可</span></div>
              <p className="text-3xl font-black">{selectedItems.length}件</p>
              <p className="text-sm text-slate-400 mt-1">
                許可 {selectedItems.filter((l) => l.type === 'permit').length}件 / 登録 {selectedItems.filter((l) => l.type === 'registration').length}件 / 届出 {selectedItems.filter((l) => l.type === 'notification').length}件
              </p>
            </div>

            {selectedItems.map((lic) => (
              <div key={lic.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className={`px-6 py-3 border-b ${lic.type === 'permit' ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800' : lic.type === 'registration' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{lic.licenseName}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getTypeColor(lic.type)}`}>{getTypeLabel(lic.type)}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{lic.business}</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">届出先</span><span className="text-gray-900 dark:text-gray-100">{lic.authority}</span></div>
                  <div><span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">取得期間</span><span className="text-gray-900 dark:text-gray-100">{lic.estimatedDays}</span></div>
                  <div><span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">費用目安</span><span className="text-gray-900 dark:text-gray-100">{lic.estimatedCost}</span></div>
                  <div><span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">資本金要件</span><span className="text-gray-900 dark:text-gray-100">{lic.capitalReq}</span></div>
                  <div><span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">必要な資格者</span><span className="text-gray-900 dark:text-gray-100">{lic.qualifications}</span></div>
                  <div><span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">無許可の罰則</span><span className="text-red-600 dark:text-red-400 font-medium">{lic.penalty}</span></div>
                  <div className="md:col-span-2"><span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">定款の事業目的（推奨）</span><span className="text-pink-600 dark:text-pink-400 font-medium">「{lic.teikanMokuteki}」</span></div>
                  <div className="md:col-span-2"><span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">備考</span><span className="text-gray-600 dark:text-gray-400">{lic.notes}</span></div>
                </div>
              </div>
            ))}

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/business/jigyou-mokuteki', label: '事業目的ジェネレーター', desc: '許認可に対応した事業目的を自動生成' },
                  { href: '/business/shihonkin-guide', label: '資本金決定ガイド', desc: '許認可の資本金要件を考慮して算出' },
                  { href: '/business/setsuritsu-hiyo', label: '会社設立費用シミュレーター', desc: '設立にかかる費用を計算' },
                  { href: '/business/setsuritsu-todoke', label: '設立後届出ナビゲーター', desc: '届出先・期限・書類を自動表示' },
                ].map((tool) => (
                  <Link key={tool.href} href={tool.href} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all group">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{tool.label}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{tool.desc}</p>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600 group-hover:text-pink-400 transition-colors"><Icons.ArrowRight /></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
        {/* 監修・出典 */}
        <div className="max-w-4xl mx-auto px-4 mb-8" style={{maxWidth: '100%'}}>
          <ExpertSupervision
            sources={[{ name: '各許認可の根拠法令' }, { name: '国土交通省 建設業許可', url: 'https://www.mlit.go.jp/totikensangyo/const/1_6_bt_000080.html' }, { name: '厚生労働省 労働者派遣事業', url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/haken-shoukai/' }]}
            lastUpdated="2026年5月"
            nextReview="2026年度税制改正反映後"
            trustNote="本ツールの計算結果は概算です。正確な金額は税理士・社労士等の専門家にご確認ください。"
          />
        </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              { q: '許認可なしで事業を始めるとどうなる？', a: '業種により罰金・懲役などの刑事罰が科される場合があります。例えば無許可の建設業は3年以下の懲役または300万円以下の罰金です。営業停止命令や事業の差止めを受ける可能性もあります。' },
              { q: '届出と許可の違いは？', a: '届出は書類を提出すれば受理される手続きで審査は形式的です。許可は行政機関が内容を審査し基準を満たした場合にのみ許可されます。許可のほうが要件が厳しく取得に時間がかかります。登録はその中間的な位置づけです。' },
              { q: '会社設立前に許認可を取れる？', a: '多くの許認可は法人設立後に申請します。重要なのは設立時の定款に該当する事業目的を記載しておくことです。記載がないと許認可申請が通らない場合があります。' },
              { q: '個人事業主でも許認可は必要？', a: 'はい、許認可は法人・個人問わず必要です。ただし一部の許認可（介護事業者指定等）は法人格が条件となっているため、個人事業主では取得できないものもあります。' },
            ].map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2">Q. {faq.q}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-4 border-l-2 border-pink-200 dark:border-pink-800">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
