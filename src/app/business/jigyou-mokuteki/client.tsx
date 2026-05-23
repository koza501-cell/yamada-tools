'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ExpertSupervision from '@/components/ExpertSupervision';

// ============================================================
// Inline SVG Icons
// ============================================================
const Icons = {
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  AlertTriangle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  Minus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  ),
};

// ============================================================
// Industry data
// ============================================================
interface IndustryCategory {
  name: string;
  industries: Industry[];
}

interface Industry {
  id: string;
  name: string;
  purposes: string[];
  license?: { name: string; authority: string; note: string };
}

const INDUSTRY_DATA: IndustryCategory[] = [
  {
    name: 'IT・Web・テクノロジー',
    industries: [
      { id: 'it-dev', name: 'システム開発・ソフトウェア', purposes: ['コンピュータシステムの企画、開発、設計、製造、販売及び保守', 'ソフトウェアの企画、開発、製造、販売及びライセンス供与', 'システムインテグレーション事業', 'ITに関するコンサルティング業'] },
      { id: 'web', name: 'Web制作・デジタルマーケティング', purposes: ['ウェブサイトの企画、デザイン、制作及び運営', 'インターネットを利用した広告業', 'デジタルマーケティングに関するコンサルティング業', 'SEO対策及びウェブ解析に関する業務'] },
      { id: 'saas', name: 'SaaS・クラウドサービス', purposes: ['クラウドコンピューティングサービスの提供', 'インターネットを利用した各種情報提供サービス', 'SaaS（Software as a Service）型サービスの企画、開発及び運営', 'データ分析及びデータ処理サービスの提供'] },
      { id: 'ai', name: 'AI・データサイエンス', purposes: ['人工知能（AI）に関する研究開発及びコンサルティング業', '機械学習及びデータ分析に関するサービスの提供', 'AI関連ソフトウェアの企画、開発及び販売', 'ビッグデータの収集、分析及び活用に関する事業'] },
      { id: 'ec', name: 'EC・ネットショップ', purposes: ['インターネットを利用した通信販売業', '電子商取引（EC）に関する企画及び運営', 'インターネットショッピングモールの運営', 'ECサイトの構築及び運営代行'] },
    ],
  },
  {
    name: '飲食・食品',
    industries: [
      { id: 'restaurant', name: '飲食店経営', purposes: ['飲食店の経営', '食料品及び飲料の製造、加工及び販売', 'ケータリングサービス及び出張料理に関する事業', 'フードデリバリーサービスの企画及び運営'], license: { name: '飲食店営業許可', authority: '保健所', note: '店舗営業開始前に取得必須。食品衛生責任者の配置が必要。' } },
      { id: 'food-mfg', name: '食品製造・加工', purposes: ['食料品の製造、加工及び販売', '菓子類の製造及び販売', '食品の輸出入及び卸売業', '食品に関する企画、開発及びコンサルティング'], license: { name: '食品衛生法に基づく営業許可', authority: '保健所', note: '製造する食品の種類により必要な許可が異なる。' } },
      { id: 'liquor', name: '酒類販売', purposes: ['酒類の販売業', '酒類の輸入及び卸売業', '飲食店の経営', '食料品の販売'], license: { name: '酒類販売業免許', authority: '税務署', note: '一般酒類小売業免許（店舗販売）または通信販売酒類小売業免許（EC販売）が必要。' } },
    ],
  },
  {
    name: '不動産',
    industries: [
      { id: 'fudosan-baikyaku', name: '不動産売買・仲介', purposes: ['不動産の売買、仲介及び斡旋', '不動産に関するコンサルティング業', '不動産の鑑定及び評価に関する業務', '不動産投資に関する助言業'], license: { name: '宅地建物取引業免許', authority: '都道府県知事または国土交通大臣', note: '事務所ごとに宅地建物取引士の設置が必要。営業保証金の供託が必要。' } },
      { id: 'fudosan-kanri', name: '不動産管理', purposes: ['不動産の管理及び運営', '不動産の賃貸及び管理に関する事業', 'マンション管理業', '建物の清掃及びメンテナンスに関する事業'], license: { name: 'マンション管理業者登録', authority: '国土交通大臣', note: 'マンション管理を行う場合に必要。管理業務主任者の設置義務。' } },
      { id: 'fudosan-chintai', name: '不動産賃貸業', purposes: ['不動産の賃貸及び管理', '駐車場の経営', '不動産の売買及び仲介', '不動産に関するコンサルティング業'] },
    ],
  },
  {
    name: '建設・工事',
    industries: [
      { id: 'kensetsu', name: '建設業（総合）', purposes: ['土木建築工事の設計、施工、監理及び請負', '建築物の増改築及びリフォーム工事の設計及び施工', '建設工事に関するコンサルティング業', '建設機械器具の賃貸業'], license: { name: '建設業許可', authority: '都道府県知事または国土交通大臣', note: '請負金額500万円以上（建築は1,500万円以上）の工事には許可が必要。' } },
      { id: 'denki-koji', name: '電気工事', purposes: ['電気工事の設計及び施工', '電気通信設備の設計、施工及び保守', '太陽光発電設備の設計、施工及び販売', '空調設備の設計、施工及び保守'], license: { name: '電気工事業者登録', authority: '都道府県知事', note: '電気工事士の資格者の配置が必要。' } },
    ],
  },
  {
    name: 'コンサルティング・士業',
    industries: [
      { id: 'keiei-consul', name: '経営コンサルティング', purposes: ['経営に関するコンサルティング業', '企業の経営戦略、事業計画の策定に関する助言及び指導', '人事労務に関するコンサルティング業', 'マーケティングに関する調査及びコンサルティング業'] },
      { id: 'zaimu-consul', name: '財務・会計コンサルティング', purposes: ['財務及び会計に関するコンサルティング業', '企業の資金調達に関する助言及び仲介', 'M&Aに関するアドバイザリー業務', '事業承継に関するコンサルティング業'] },
    ],
  },
  {
    name: '小売・物販',
    industries: [
      { id: 'retail', name: '物品販売（一般）', purposes: ['各種物品の販売及び輸出入', '日用品、雑貨及び衣料品の企画、製造及び販売', 'インターネットを利用した通信販売業', '卸売業及び小売業'] },
      { id: 'kobutsu', name: '中古品・リサイクル販売', purposes: ['古物の売買及び交換', '中古品のインターネット販売', 'リサイクル事業及び不用品の買取', '古物に関する鑑定及びコンサルティング'], license: { name: '古物商許可', authority: '公安委員会（警察署経由）', note: '中古品の売買には古物商許可が必要。ネットでの販売も含む。' } },
    ],
  },
  {
    name: '人材・教育',
    industries: [
      { id: 'jinzai-haken', name: '人材派遣', purposes: ['労働者派遣事業', '有料職業紹介事業', '人材に関するコンサルティング業', '人材の教育訓練及び研修の企画及び実施'], license: { name: '労働者派遣事業許可', authority: '厚生労働大臣', note: '資産要件あり（基準資産額2,000万円以上）。派遣元責任者の配置が必要。' } },
      { id: 'jinzai-shokai', name: '人材紹介', purposes: ['有料職業紹介事業', '求人情報の提供及び人材のマッチングに関する事業', '人事に関するコンサルティング業', 'キャリアカウンセリング及び就職支援に関する事業'], license: { name: '有料職業紹介事業許可', authority: '厚生労働大臣', note: '資産要件あり（基準資産額500万円以上）。' } },
      { id: 'kyoiku', name: '教育・スクール', purposes: ['各種教育及び研修の企画、運営及び実施', 'オンライン教育コンテンツの企画、制作及び配信', '学習塾及びカルチャースクールの経営', '教育に関するコンサルティング業'] },
    ],
  },
  {
    name: '美容・健康',
    industries: [
      { id: 'biyou', name: '美容室・エステ', purposes: ['美容業', 'エステティックサロンの経営', '化粧品の販売', '美容に関する教育及びコンサルティング業'], license: { name: '美容所開設届', authority: '保健所', note: '美容師免許を持つスタッフの配置が必要。' } },
      { id: 'fitness', name: 'フィットネス・ジム', purposes: ['フィットネスクラブ及びスポーツジムの経営', 'スポーツに関する教育及び指導', '健康増進に関するコンサルティング業', 'スポーツ用品の販売'] },
    ],
  },
  {
    name: '運送・物流',
    industries: [
      { id: 'unsou', name: '運送業', purposes: ['一般貨物自動車運送事業', '貨物利用運送事業', '引越サービスの提供', '倉庫業及び荷物の保管に関する事業'], license: { name: '一般貨物自動車運送事業許可', authority: '国土交通大臣', note: '車両5台以上、運行管理者・整備管理者の配置が必要。資金要件あり。' } },
      { id: 'takuhai', name: '軽貨物運送', purposes: ['貨物軽自動車運送事業', '配送代行サービスの提供', 'デリバリーサービスの企画及び運営', '倉庫業及び物流に関するコンサルティング'], license: { name: '貨物軽自動車運送事業届出', authority: '運輸支局', note: '届出制（許可ではない）。比較的容易に開始可能。' } },
    ],
  },
  {
    name: '旅行・観光',
    industries: [
      { id: 'ryokou', name: '旅行業', purposes: ['旅行業及び旅行代理店業', '観光に関する企画及びコンサルティング業', '宿泊施設の予約代行及び手配', '通訳案内及びガイドサービスの提供'], license: { name: '旅行業登録', authority: '都道府県知事または観光庁長官', note: '旅行業務取扱管理者の配置が必要。営業保証金の供託が必要。' } },
      { id: 'minpaku', name: '民泊・宿泊業', purposes: ['住宅宿泊事業', '旅館業', '不動産の賃貸及び管理', '観光に関する企画及びコンサルティング業'], license: { name: '住宅宿泊事業届出 または 旅館業許可', authority: '都道府県知事', note: '民泊は届出制（年間180日上限）。旅館業は許可制。' } },
    ],
  },
  {
    name: '広告・メディア・クリエイティブ',
    industries: [
      { id: 'koukoku', name: '広告・PR', purposes: ['広告の企画、制作及び代理業', '広報及びPRに関するコンサルティング業', 'イベントの企画、制作及び運営', 'マーケティングリサーチ及び市場調査'] },
      { id: 'design', name: 'デザイン事務所', purposes: ['グラフィックデザインの企画及び制作', '商品パッケージデザインの企画及び制作', 'ブランディングに関するコンサルティング業', '映像及び写真の企画、撮影及び制作'] },
      { id: 'content', name: 'コンテンツ制作・メディア', purposes: ['各種コンテンツの企画、制作及び配信', '出版業及び電子書籍の企画、制作及び販売', '映像、音楽及びエンターテインメントの企画、制作及び配信', 'メディア事業の企画及び運営'] },
    ],
  },
  {
    name: '介護・福祉',
    industries: [
      { id: 'kaigo', name: '介護事業', purposes: ['介護保険法に基づく居宅サービス事業', '介護保険法に基づく施設サービス事業', '障害者総合支援法に基づく障害福祉サービス事業', '高齢者向け住宅の運営及び管理'], license: { name: '介護事業者指定', authority: '都道府県知事または市区町村長', note: 'サービスの種類ごとに指定申請が必要。人員・設備・運営基準あり。' } },
    ],
  },
];

// Universal closing purpose
const CLOSING_PURPOSE = '前各号に附帯関連する一切の事業';

// ============================================================
// Main Component
// ============================================================
export default function JigyouMokutekiClient() {
  const [mounted, setMounted] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [customPurpose, setCustomPurpose] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => { setMounted(true); }, []);

  // Get all industries flat
  const allIndustries = INDUSTRY_DATA.flatMap((cat) => cat.industries);

  const toggleCategory = (catName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const toggleIndustry = (industryId: string) => {
    const industry = allIndustries.find((i) => i.id === industryId);
    if (!industry) return;

    if (selectedIndustries.includes(industryId)) {
      // Remove industry and its purposes
      setSelectedIndustries((prev) => prev.filter((id) => id !== industryId));
      setSelectedPurposes((prev) => prev.filter((p) => !industry.purposes.includes(p)));
    } else {
      // Add industry and all its purposes
      setSelectedIndustries((prev) => [...prev, industryId]);
      setSelectedPurposes((prev) => {
        const newPurposes = industry.purposes.filter((p) => !prev.includes(p));
        return [...prev, ...newPurposes];
      });
    }
  };

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(purpose) ? prev.filter((p) => p !== purpose) : [...prev, purpose]
    );
  };

  const addCustomPurpose = () => {
    const trimmed = customPurpose.trim();
    if (trimmed && !selectedPurposes.includes(trimmed)) {
      setSelectedPurposes((prev) => [...prev, trimmed]);
      setCustomPurpose('');
    }
  };

  const removePurpose = (purpose: string) => {
    setSelectedPurposes((prev) => prev.filter((p) => p !== purpose));
  };

  const movePurpose = (index: number, direction: 'up' | 'down') => {
    const newPurposes = [...selectedPurposes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPurposes.length) return;
    [newPurposes[index], newPurposes[targetIndex]] = [newPurposes[targetIndex], newPurposes[index]];
    setSelectedPurposes(newPurposes);
  };

  // Get licenses for selected industries
  const selectedLicenses = allIndustries
    .filter((i) => selectedIndustries.includes(i.id) && i.license)
    .map((i) => ({ industry: i.name, ...i.license! }));

  // Generate output text
  const generateOutput = (): string => {
    const purposes = [...selectedPurposes, CLOSING_PURPOSE];
    return purposes.map((p, i) => `${i + 1}. ${p}`).join('\n');
  };

  const handleCopy = () => {
    const text = generateOutput();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!mounted) {
    return <div className="min-h-screen py-12 flex items-center justify-center text-gray-500 dark:text-gray-400">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-pink-500 transition-colors">ホーム</Link>
          <span className="mx-2">{'>'}</span>
          <Link href="/business" className="hover:text-pink-500 transition-colors">ビジネス・法人</Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-gray-900 dark:text-gray-100">事業目的ジェネレーター</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          事業目的ジェネレーター
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          業種を選ぶだけで、定款に記載する<strong>事業目的</strong>を自動生成します。
          複数業種の選択可能。許認可が必要な業種には警告を表示します。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ============================================================ */}
          {/* LEFT: Industry selector */}
          {/* ============================================================ */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm">業種を選択（複数可）</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{selectedIndustries.length}業種選択中 → {selectedPurposes.length}個の事業目的</p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {INDUSTRY_DATA.map((category) => {
                  const isExpanded = expandedCategories.includes(category.name);
                  const hasSelected = category.industries.some((i) => selectedIndustries.includes(i.id));
                  return (
                    <div key={category.name} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.name)}
                        className={`w-full text-left px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${hasSelected ? 'bg-pink-50/50 dark:bg-pink-900/10' : ''}`}
                      >
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          {category.name}
                          {hasSelected && <span className="w-2 h-2 rounded-full bg-pink-400" />}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-3 space-y-1">
                          {category.industries.map((industry) => {
                            const isSelected = selectedIndustries.includes(industry.id);
                            return (
                              <button
                                key={industry.id}
                                type="button"
                                onClick={() => toggleIndustry(industry.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  {isSelected ? <Icons.Check /> : <Icons.Plus />}
                                  {industry.name}
                                </span>
                                {industry.license && (
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0">許認可</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom purpose input */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mt-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                カスタム事業目的を追加
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomPurpose(); } }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none"
                  placeholder="例: ペット関連用品の販売"
                />
                <button type="button" onClick={addCustomPurpose}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1 shrink-0">
                  <Icons.Plus /> 追加
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: Generated output */}
          {/* ============================================================ */}
          <div>
            {/* License warnings */}
            {selectedLicenses.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-4">
                <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-1.5 mb-3">
                  <Icons.AlertTriangle />
                  許認可が必要な業種が含まれています
                </h3>
                <div className="space-y-3">
                  {selectedLicenses.map((lic, i) => (
                    <div key={i} className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200">{lic.industry}</p>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                        必要な許認可: <strong>{lic.name}</strong>
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400/80">
                        届出先: {lic.authority}
                      </p>
                      <p className="text-xs text-amber-600/70 dark:text-amber-400/60 mt-0.5">{lic.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purpose list */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-1.5">
                  <Icons.Sparkles />
                  生成された事業目的
                </h2>
                <span className="text-xs text-gray-400">{selectedPurposes.length + 1}件（包括目的含む）</span>
              </div>

              {selectedPurposes.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                  <p className="text-sm">左の業種リストから業種を選択してください</p>
                  <p className="text-xs mt-1">選択した業種の事業目的が自動的に表示されます</p>
                </div>
              ) : (
                <div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {selectedPurposes.map((purpose, index) => (
                      <div key={`${purpose}-${index}`} className="px-6 py-3 flex items-center gap-3 group hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <span className="text-xs text-gray-400 dark:text-gray-500 w-6 text-right shrink-0">{index + 1}.</span>
                        <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{purpose}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          {index > 0 && (
                            <button type="button" onClick={() => movePurpose(index, 'up')}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs">↑</button>
                          )}
                          {index < selectedPurposes.length - 1 && (
                            <button type="button" onClick={() => movePurpose(index, 'down')}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs">↓</button>
                          )}
                          <button type="button" onClick={() => removePurpose(purpose)}
                            className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300">
                            <Icons.Trash />
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Closing purpose (always shown) */}
                    <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/30">
                      <span className="text-xs text-gray-400 dark:text-gray-500 inline-block w-6 text-right mr-3">{selectedPurposes.length + 1}.</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 italic">{CLOSING_PURPOSE}</span>
                    </div>
                  </div>

                  {/* Copy button */}
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={handleCopy}
                      className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        copied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                      }`}>
                      {copied ? <><Icons.Check /> コピーしました！</> : <><Icons.Copy /> 事業目的をコピーする</>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mt-4">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-2">事業目的の書き方のポイント</h4>
              <ul className="space-y-1.5 text-xs text-blue-700/80 dark:text-blue-300/80">
                <li className="flex items-start gap-1.5"><span className="text-blue-400 mt-0.5 shrink-0"><Icons.Check /></span>主要な事業を最初に、将来やりたい事業を後に記載</li>
                <li className="flex items-start gap-1.5"><span className="text-blue-400 mt-0.5 shrink-0"><Icons.Check /></span>5〜15個が適切（多すぎると銀行口座開設で不利）</li>
                <li className="flex items-start gap-1.5"><span className="text-blue-400 mt-0.5 shrink-0"><Icons.Check /></span>「前各号に附帯関連する一切の事業」は最後に必ず入れる</li>
                <li className="flex items-start gap-1.5"><span className="text-blue-400 mt-0.5 shrink-0"><Icons.Check /></span>許認可が必要な業種は、許認可の要件に合致する表現にする</li>
                <li className="flex items-start gap-1.5"><span className="text-blue-400 mt-0.5 shrink-0"><Icons.Check /></span>変更には登録免許税3万円かかるため、将来の事業も最初から含めると経済的</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Related tools */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mt-8 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { href: '/business/setsuritsu-hiyo', label: '会社設立費用シミュレーター', desc: '設立にかかる費用を計算' },
              { href: '/business/kaisha-shindan', label: '会社形態診断ツール', desc: 'KK vs GK — 最適な形態を診断' },
              { href: '/business/setsuritsu-todoke', label: '設立後届出ナビゲーター', desc: '届出先・期限・書類を自動表示' },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all group">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{tool.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{tool.desc}</p>
                </div>
                <span className="text-gray-300 dark:text-gray-600 group-hover:text-pink-400 transition-colors"><Icons.ArrowRight /></span>
              </Link>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* FAQ */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mt-8 mb-8 shadow-sm">
        {/* 監修・出典 */}
        <div className="max-w-4xl mx-auto px-4 mb-8" style={{maxWidth: '100%'}}>
          <ExpertSupervision
            sources={[{ name: '法務省 定款の記載事項', url: 'https://www.moj.go.jp/MINJI/minji35.html' }, { name: '各許認可の根拠法令（業種別）' }]}
            lastUpdated="2026年5月"
            nextReview="2026年度税制改正反映後"
            trustNote="本ツールの計算結果は概算です。正確な金額は税理士・社労士等の専門家にご確認ください。"
          />
        </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '事業目的はいくつ書くべきですか？',
                a: '5〜15個が一般的です。少なすぎると事業拡大時に定款変更が必要になり、多すぎると銀行口座開設や融資審査で「何の会社かわからない」と判断されるリスクがあります。メインの事業を2〜3個＋将来の拡張分で合計10個前後が理想的です。',
              },
              {
                q: '定款に書いていない事業をしたらどうなる？',
                a: '定款に記載のない事業を行っても直接的な罰則はありませんが、取引先や銀行から信用を失う可能性があります。また、許認可が必要な業種で事業目的に記載がない場合、許認可の申請が通らないことがあります。',
              },
              {
                q: '許認可が必要な業種の事業目的はどう書く？',
                a: '許認可の要件で定められた表現と一致させる必要があります。例えば建設業許可を取る場合は「土木建築工事の設計、施工及び請負」のように具体的に記載します。不安な場合は、許認可の申請を行う行政書士に事業目的の文言を確認してもらうことを推奨します。',
              },
              {
                q: '「前各号に附帯関連する一切の事業」は本当に必要？',
                a: 'ほぼ全ての法人が記載しています。この一文があることで、列挙した事業目的に直接関連する付随業務も広くカバーできます。記載しないデメリットはあってもメリットはないため、必ず最後に入れることを推奨します。',
              },
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
