// 高額介護サービス費 + 高額医療・高額介護合算療養費 データ (令和8年度現在)
// 令和3年8月改正以降の負担限度額が継続。令和8年5月時点で改正予定なし。
// Source: 厚生労働省告示、介護保険法施行令22の2、29の2

export type ShotokuKubun =
  | 'seikatsu_hogo'
  | 'hikazei_low'
  | 'hikazei_general'
  | 'kazei_ippan'
  | 'kazei_380'
  | 'kazei_690';

export const SHOTOKU_KUBUN: Record<
  ShotokuKubun,
  {
    label: string;
    description: string;
    individual_limit: number | null;
    household_limit: number;
    note: string;
  }
> = {
  seikatsu_hogo: {
    label: '生活保護受給者',
    description: '生活保護を受給している方',
    individual_limit: 15000,
    household_limit: 15000,
    note: '世帯・個人ともに月額15,000円',
  },
  hikazei_low: {
    label: '住民税非課税 (年金80万以下)',
    description: '世帯全員が住民税非課税で、本人の前年合計所得+公的年金収入が年間80万円以下',
    individual_limit: 15000,
    household_limit: 24600,
    note: '個人15,000円・世帯24,600円。両方の上限が適用される',
  },
  hikazei_general: {
    label: '住民税非課税 (年金80万超)',
    description: '世帯全員が住民税非課税で、80万円超または老齢福祉年金受給',
    individual_limit: null,
    household_limit: 24600,
    note: '世帯24,600円のみ',
  },
  kazei_ippan: {
    label: '一般課税世帯',
    description: '住民税課税世帯 (現役並み所得未満)',
    individual_limit: null,
    household_limit: 44400,
    note: '世帯44,400円。多数の方がこの区分',
  },
  kazei_380: {
    label: '課税所得380万円以上 (年収約770万円以上)',
    description: '同一世帯に課税所得380万円以上の第1号被保険者がいる',
    individual_limit: null,
    household_limit: 93000,
    note: '世帯93,000円。令和3年8月改正で新設',
  },
  kazei_690: {
    label: '課税所得690万円以上 (年収約1,160万円以上)',
    description: '同一世帯に課税所得690万円以上の第1号被保険者がいる',
    individual_limit: null,
    household_limit: 140100,
    note: '世帯140,100円。令和3年8月改正で新設',
  },
};

export type GassanKubun =
  | 'teisotokuI'
  | 'teisotokuII'
  | 'ippan'
  | 'genekiI'
  | 'genekiII'
  | 'genekiIII';

export const GASSAN_75: Record<
  GassanKubun,
  {
    label: string;
    yearly_limit: number;
    note: string;
  }
> = {
  teisotokuI: {
    label: '低所得Ⅰ (年金80万以下)',
    yearly_limit: 190000,
    note: '住民税非課税で年金80万以下。介護サービス利用者複数の場合31万円',
  },
  teisotokuII: {
    label: '低所得Ⅱ (住民税非課税)',
    yearly_limit: 310000,
    note: '住民税非課税 (Ⅰ以外)',
  },
  ippan: {
    label: '一般 (Ⅰ・Ⅱ)',
    yearly_limit: 560000,
    note: '住民税課税で現役並み未満',
  },
  genekiI: {
    label: '現役並みⅠ (課税所得145万以上)',
    yearly_limit: 670000,
    note: '課税所得145万円以上',
  },
  genekiII: {
    label: '現役並みⅡ (課税所得380万以上)',
    yearly_limit: 1410000,
    note: '課税所得380万円以上',
  },
  genekiIII: {
    label: '現役並みⅢ (課税所得690万以上)',
    yearly_limit: 2120000,
    note: '課税所得690万円以上',
  },
};

export const TAISHO_GAI = [
  '福祉用具購入費の自己負担分',
  '住宅改修費の自己負担分',
  '施設サービスの食費・居住費',
  '日常生活費 (差額ベッド代等)',
  '支給限度額超過分の全額自己負担分',
];
