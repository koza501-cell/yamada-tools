// 介護職員配置基準データ (令和8年度現在)
// 令和6年4月: 生産性向上推進体制加算新設、特定施設3:0.9緩和、老健夜勤1.6人緩和
// 令和8年6月期中改定: 処遇改善加算 上位区分 Ⅰロ・Ⅱロ新設 (生産性向上推進体制加算が要件に)
// Source: 厚生労働省令、介護保険最新情報 Vol.1474 (令和8年3月4日)

export type KaigoShisetsu =
  | 'tokuyou'
  | 'roken'
  | 'yuryou'
  | 'sakouju_kaigo'
  | 'group_home'
  | 'day_service'
  | 'short_stay'
  | 'shoukibo_takinou';

export interface KaigoRole {
  id: string;
  label: string;
  ratio: string;
  note: string;
}

export interface KaigoYakan {
  person: number;
  relaxed: number | null;
  note: string;
}

export interface KaigoShisetsuRule {
  label: string;
  baseRatio: number;
  baseRatioRelaxed: number | null;
  staffingNote: string;
  yakan: KaigoYakan;
  roles: KaigoRole[];
  description: string;
  hasUnitkata: boolean;
  dayServiceSpecial?: boolean;
  groupHomeSpecial?: boolean;
}

export const SHISETSU_RULES: Record<KaigoShisetsu, KaigoShisetsuRule> = {
  tokuyou: {
    label: '特別養護老人ホーム',
    baseRatio: 3,
    baseRatioRelaxed: null,
    staffingNote: '介護職員+看護職員 合計で入居者3:1(常勤換算)。看護職員は入居者30人まで1人、50人ごとに1人追加',
    yakan: { person: 2, relaxed: 1.6, note: '夜勤2人以上。見守り機器100%導入等で1.6人以上に緩和可(令和6年改正)' },
    roles: [
      { id: 'kanri', label: '管理者', ratio: '1人', note: '常勤・専従' },
      { id: 'caremanager', label: 'ケアマネジャー', ratio: '入居者100人につき1人', note: '常勤・専従' },
      { id: 'seikatsu', label: '生活相談員', ratio: '入居者100人につき1人以上', note: '常勤' },
      { id: 'kinou', label: '機能訓練指導員', ratio: '1人以上', note: 'PT/OT/ST等の資格者' },
      { id: 'eiyoshi', label: '栄養士', ratio: '1人以上', note: '入所40人以上で必須' },
      { id: 'doctor', label: '医師', ratio: '必要数', note: '非常勤可(月数回訪問医療)' },
    ],
    description: '介護保険3施設の1つ。要介護3以上が入居資格。常駐医師不要。',
    hasUnitkata: true,
  },
  roken: {
    label: '介護老人保健施設(老健)',
    baseRatio: 3,
    baseRatioRelaxed: null,
    staffingNote: '介護+看護 合計で3:1。看護職員は全体の約2/7(入所者3人に対し介護1人+看護0.28人の割合)',
    yakan: { person: 2, relaxed: 1.6, note: '夜勤2人以上。見守り機器100%導入等で1.6人以上に緩和可(令和6年改正)' },
    roles: [
      { id: 'doctor', label: '医師', ratio: '入所100人につき1人', note: '常勤、老健の医療担当者' },
      { id: 'pt_ot_st', label: 'PT/OT/ST', ratio: '入所100人につき1人(合計)', note: 'リハビリ専門職' },
      { id: 'caremanager', label: 'ケアマネジャー', ratio: '入所100人につき1人', note: '常勤' },
      { id: 'seikatsu', label: '支援相談員', ratio: '入所100人につき1人', note: '生活相談員に相当' },
      { id: 'yakuzaishi', label: '薬剤師', ratio: '実情に応じた数', note: '医療型施設のため重要' },
      { id: 'eiyoshi', label: '栄養士', ratio: '1人以上', note: '入所100人以上で必須' },
    ],
    description: '在宅復帰を目指す中間施設。医療ケアとリハビリが中心。常勤医師必須。',
    hasUnitkata: true,
  },
  yuryou: {
    label: '介護付き有料老人ホーム(特定施設)',
    baseRatio: 3,
    baseRatioRelaxed: 3 / 0.9,
    staffingNote: '介護+看護 合計で要介護者3:1・要支援者10:1。テクノロジー導入施設は3:0.9緩和可(令和6年改正)',
    yakan: { person: 1, relaxed: null, note: '常時1人以上の夜勤体制' },
    roles: [
      { id: 'kanri', label: '管理者', ratio: '1人', note: '常勤・専従' },
      { id: 'keikaku', label: '計画作成担当者', ratio: '入居者100人につき1人', note: 'ケアマネ資格必須' },
      { id: 'seikatsu', label: '生活相談員', ratio: '入居者100人につき1人', note: '常勤' },
      { id: 'kango', label: '看護職員', ratio: '入居者30人まで1人、50人ごとに追加', note: '' },
      { id: 'kinou', label: '機能訓練指導員', ratio: '1人以上', note: '' },
    ],
    description: '民間の介護施設で特定施設指定を受けたもの。令和6年改正で3:0.9緩和が可能に。',
    hasUnitkata: false,
  },
  sakouju_kaigo: {
    label: 'サービス付き高齢者向け住宅(介護型)',
    baseRatio: 3,
    baseRatioRelaxed: 3 / 0.9,
    staffingNote: '特定施設指定の場合、介護付き有料老人ホームと同基準。テクノロジー導入で3:0.9緩和可',
    yakan: { person: 1, relaxed: null, note: '常時1人以上の夜勤体制' },
    roles: [
      { id: 'kanri', label: '管理者', ratio: '1人', note: '常勤' },
      { id: 'kango', label: '看護職員', ratio: '入居者30人まで1人、50人ごとに追加', note: '' },
      { id: 'shiken', label: '生活相談・状況把握担当', ratio: '日中1人以上', note: '資格要件あり' },
    ],
    description: '一般型と介護型があり、介護型は特定施設指定。令和6年改正で3:0.9緩和可能。',
    hasUnitkata: false,
  },
  group_home: {
    label: '認知症対応型共同生活介護(GH)',
    baseRatio: 3,
    baseRatioRelaxed: null,
    staffingNote: '介護従業者 日中3:1。1ユニット5〜9名、最大2ユニット。夜勤はユニットごとに1人以上',
    yakan: { person: 1, relaxed: null, note: 'ユニットごとに夜勤1人以上(ユニット数×1人)' },
    roles: [
      { id: 'kanri', label: '管理者', ratio: 'ユニットごとに1人', note: '認知症介護実践者研修修了+3年以上経験' },
      { id: 'keikaku', label: '計画作成担当者', ratio: 'ユニットごとに1人', note: 'うち1人以上はケアマネ資格' },
    ],
    description: '少人数共同生活。1ユニット5〜9名。看護師配置義務なし。管理者要件が厳しい。',
    hasUnitkata: false,
    groupHomeSpecial: true,
  },
  day_service: {
    label: '通所介護(デイサービス)',
    baseRatio: 5,
    baseRatioRelaxed: null,
    staffingNote: '介護職員：利用者15人まで1人、15人を超える部分は5:1で追加。通所型のため夜間配置なし',
    yakan: { person: 0, relaxed: null, note: '通所型のため夜間配置なし' },
    roles: [
      { id: 'kanri', label: '管理者', ratio: '1人', note: '常勤' },
      { id: 'seikatsu', label: '生活相談員', ratio: '1人以上', note: '常勤専従' },
      { id: 'kango', label: '看護職員', ratio: '1人以上', note: '看護師または准看護師' },
      { id: 'kinou', label: '機能訓練指導員', ratio: '1人以上', note: '兼務可' },
    ],
    description: '日帰り通所サービス。夜間配置なし。利用者15名超は5:1で追加が必要。',
    hasUnitkata: false,
    dayServiceSpecial: true,
  },
  short_stay: {
    label: '短期入所生活介護(ショートステイ)',
    baseRatio: 3,
    baseRatioRelaxed: null,
    staffingNote: '特養と同様に介護+看護 合計で3:1。最大30日連続利用可能な宿泊サービス',
    yakan: { person: 2, relaxed: 1.6, note: '夜勤2人以上(見守り機器導入で1.6人緩和可)' },
    roles: [
      { id: 'kanri', label: '管理者', ratio: '1人', note: '常勤' },
      { id: 'kango', label: '看護職員', ratio: '常時1人以上', note: '医療連携体制' },
      { id: 'seikatsu', label: '生活相談員', ratio: '1人以上', note: '' },
      { id: 'kinou', label: '機能訓練指導員', ratio: '1人以上', note: '' },
      { id: 'eiyoshi', label: '栄養士', ratio: '1人以上', note: '' },
    ],
    description: '家族介護負担軽減目的の宿泊サービス。多くは特養に併設。最大30日連続利用。',
    hasUnitkata: false,
  },
  shoukibo_takinou: {
    label: '小規模多機能型居宅介護',
    baseRatio: 3,
    baseRatioRelaxed: null,
    staffingNote: '通い・訪問・泊まりを一体提供。登録定員29名以下。日中は3:1で計算',
    yakan: { person: 2, relaxed: null, note: '宿泊利用者に対応する夜間配置が必要' },
    roles: [
      { id: 'kanri', label: '管理者', ratio: '1人', note: '常勤' },
      { id: 'caremanager', label: 'ケアマネジャー', ratio: '1人', note: '常勤' },
      { id: 'kango', label: '看護職員', ratio: '1人以上', note: '兼務可' },
    ],
    description: '地域密着型サービス。通い・訪問・泊まりを一体提供。登録定員29名以下。',
    hasUnitkata: false,
  },
};

export const SEISANSEI_KASAN = {
  ichi: {
    label: '生産性向上推進体制加算(Ⅰ)',
    unit: 100,
    requirements: [
      '加算(Ⅱ)の要件を満たし業務改善の成果確認',
      '複数のテクノロジー機器導入',
      '委員会設置・3ヶ月毎開催',
      'データ報告(年1回)',
    ],
  },
  ni: {
    label: '生産性向上推進体制加算(Ⅱ)',
    unit: 10,
    requirements: [
      '1つ以上のテクノロジー機器導入',
      '委員会設置(3年経過措置、令和8年度末で終了)',
      'データ提出',
    ],
  },
};
