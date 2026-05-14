// 介護休業給付金 データ (令和8年度現在)
// 令和7年8月1日改定 (賃金日額上限額の年次変動)
// 次回改定: 令和8年8月1日予定
// Source: 雇用保険法第61条の4、厚生労働省「雇用保険事務手続きの手引き 第11章」

export const KAIGO_KYUGYO_RATES = {
  shikyu_ritsu: 0.67,
  shikyu_jougen_jugyo_tani: 532200,
  chingin_jougaku: 17740,
  chingin_kagaku: 2869,
  shikyu_jissu_max_total: 93,
  shikyu_kaisu_max: 3,
  chingin_chosei: {
    no_adjustment_threshold: 0.13,
    full_pay_threshold: 0.80,
  },
} as const;

export const TAISHO_KAZOKU = [
  '配偶者 (事実婚を含む)',
  '父母 (養父母を含む)',
  '子 (養子を含む)',
  '配偶者の父母 (養父母を含む)',
  '祖父母',
  '兄弟姉妹',
  '孫',
] as const;

export interface JukyuYouken {
  label: string;
  detail: string;
}

export const JUKYU_YOUKEN: Record<string, JukyuYouken> = {
  hoken_period: {
    label: '雇用保険被保険者期間',
    detail: '休業開始日前2年間に賃金支払基礎日数11日以上の月が通算12か月以上',
  },
  yuki_koyou: {
    label: '有期雇用者の追加要件',
    detail: '休業開始予定日から93日経過日 + 6か月以内に労働契約満了が確定していないこと',
  },
  shugyo_nissu: {
    label: '休業中の就業日数',
    detail: '1支給単位 (30日) あたり10日以下',
  },
  taishoku_yotei: {
    label: '退職予定の制限',
    detail: '介護休業終了後の職場復帰を前提とする (退職予定者は支給対象外)',
  },
};

export const KAIGO_KYUGYO_VS_KYUKKA = {
  kyugyo: {
    label: '介護休業',
    duration: '通算93日 (最大3回分割)',
    benefit: '給付金あり (賃金日額×67%)',
    purpose: 'まとまった介護のため',
    application: '2週間前までに事業主に申し出',
  },
  kyukka: {
    label: '介護休暇',
    duration: '年5日 (対象家族2人以上は10日)',
    benefit: '給付金なし (会社規定により有給/無給)',
    purpose: '日々の通院付き添い等',
    application: '当日でも申請可',
  },
} as const;

export interface HayamiRow {
  monthly: number;
  daily: number;
  unit: number;
  total93: number;
  capped?: boolean;
}

export const HAYAMI_TABLE: HayamiRow[] = [
  { monthly: 150000, daily: 5000, unit: 100650, total93: 311515 },
  { monthly: 200000, daily: 6667, unit: 134007, total93: 415355 },
  { monthly: 300000, daily: 10000, unit: 201000, total93: 623100 },
  { monthly: 400000, daily: 13333, unit: 267993, total93: 830877 },
  { monthly: 500000, daily: 16667, unit: 334007, total93: 1035422 },
  { monthly: 800000, daily: 17740, unit: 356574, total93: 1085477, capped: true },
  { monthly: 1000000, daily: 17740, unit: 356574, total93: 1085477, capped: true },
];
