// 保育士配置基準データ (令和8年度現在)
// 令和6年4月: 3・4・5歳児 改正 (15:1, 25:1)
// 令和7年度: 1歳児配置改善加算 新設 (5:1)
// 令和9年度末: 3歳児経過措置終了 → 令和10年度 15:1 完全義務化 (2026年3月決定)
// Source: 児童福祉施設の設備及び運営に関する基準 第33条、こども家庭庁告示

export type Shisetsu =
  | 'ninka'
  | 'ninkagai'
  | 'kodomoen'
  | 'shoukibo_a'
  | 'shoukibo_b'
  | 'shoukibo_c'
  | 'jigyousho';

export interface AgeRatio {
  ratio: number;
  kasanRatio?: number;
  kasanLabel?: string;
  transitionRatio?: number;
  transitionEnd?: string;
  note: string;
}

export interface RatioSet {
  age0: AgeRatio;
  age1: AgeRatio;
  age2: AgeRatio;
  age3: AgeRatio;
  age4: AgeRatio;
  age5: AgeRatio;
}

export const RATIO_NINKA: RatioSet = {
  age0: { ratio: 3, note: '園児3人に保育士1人' },
  age1: { ratio: 6, kasanRatio: 5, kasanLabel: '1歳児配置改善加算で5:1', note: '園児6人に保育士1人' },
  age2: { ratio: 6, note: '園児6人に保育士1人' },
  age3: { ratio: 15, transitionRatio: 20, transitionEnd: '令和10年3月31日', note: '園児15人に保育士1人 (令和6年4月改正)' },
  age4: { ratio: 25, transitionRatio: 30, note: '園児25人に保育士1人 (令和6年4月改正)' },
  age5: { ratio: 25, transitionRatio: 30, note: '園児25人に保育士1人 (令和6年4月改正)' },
};

export const RATIO_SHOUKIBO_C: RatioSet = {
  age0: { ratio: 3, note: '0〜2歳児 一律 子ども3人:職員1人' },
  age1: { ratio: 3, note: '0〜2歳児 一律 子ども3人:職員1人' },
  age2: { ratio: 3, note: '0〜2歳児 一律 子ども3人:職員1人' },
  age3: { ratio: 15, transitionRatio: 20, transitionEnd: '令和10年3月31日', note: 'C型は0〜2歳専門(参考値)' },
  age4: { ratio: 25, transitionRatio: 30, note: 'C型は0〜2歳専門(参考値)' },
  age5: { ratio: 25, transitionRatio: 30, note: 'C型は0〜2歳専門(参考値)' },
};

export interface ShisetsuRule {
  label: string;
  baseRatio: RatioSet;
  addCount: number;
  minTotal: number;
  description: string;
}

export const SHISETSU_RULES: Record<Shisetsu, ShisetsuRule> = {
  ninka: {
    label: '認可保育所',
    baseRatio: RATIO_NINKA,
    addCount: 0,
    minTotal: 2,
    description: '国の最低基準。常時2名以上の保育士が必要。',
  },
  ninkagai: {
    label: '認可外保育施設',
    baseRatio: RATIO_NINKA,
    addCount: 0,
    minTotal: 2,
    description: '11時間以内は認可と同等。職員の1/3以上が保育士または看護師。',
  },
  kodomoen: {
    label: '幼保連携型認定こども園',
    baseRatio: RATIO_NINKA,
    addCount: 0,
    minTotal: 2,
    description: '保育時間は認可基準と同様。教育時間は学級編成が必要。',
  },
  shoukibo_a: {
    label: '小規模保育 A型',
    baseRatio: RATIO_NINKA,
    addCount: 1,
    minTotal: 2,
    description: '認可基準+1名。職員全員が保育士資格必須。0〜2歳児対象。',
  },
  shoukibo_b: {
    label: '小規模保育 B型',
    baseRatio: RATIO_NINKA,
    addCount: 1,
    minTotal: 2,
    description: '認可基準+1名。半数以上が保育士。0〜2歳児対象。',
  },
  shoukibo_c: {
    label: '小規模保育 C型',
    baseRatio: RATIO_SHOUKIBO_C,
    addCount: 0,
    minTotal: 1,
    description: '家庭的保育者1人につき子ども3人(補助者ありなら5人まで)。0〜2歳児対象。',
  },
  jigyousho: {
    label: '事業所内保育 (定員19人以下)',
    baseRatio: RATIO_NINKA,
    addCount: 1,
    minTotal: 2,
    description: '小規模保育A・B型と同等。定員20名以上は認可保育所基準が適用。',
  },
};

export const KOTEI_KAKEN = [
  { id: 'teiin90', label: '利用定員90人以下の施設', addCount: 1, description: '常勤保育士を1名加配' },
  { id: 'hyojun_jikan', label: '保育標準時間認定(11h)受け入れ', addCount: 1, description: '常勤保育士を1名加配' },
  { id: 'hijoukin', label: '非常勤保育士の加配', addCount: 1, description: '上記2加配がある場合、非常勤保育士1名も加配' },
];

export const ICHIIJI_KASAN_CONDITIONS = [
  '1歳児の配置を「5:1以上」に改善している',
  '処遇改善等加算 旧Ⅰ・Ⅱ・Ⅲのすべてを取得している',
  'ICT機器を導入し、登降園管理を含む2つ以上の機能を活用している',
  '加算の使途を職員に周知している',
];
