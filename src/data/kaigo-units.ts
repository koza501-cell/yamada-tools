export type KaigoService = 'houmon' | 'tsusho' | 'kyotaku';
export type JinkenhiPercent = 70 | 55 | 45;

export const SERVICE_META: Record<KaigoService, {
  label: string;
  jinkenhi: JinkenhiPercent;
  description: string;
}> = {
  houmon:  { label: '訪問介護',     jinkenhi: 70, description: 'ホームヘルプ' },
  tsusho:  { label: '通所介護',     jinkenhi: 45, description: 'デイサービス（通常規模型）' },
  kyotaku: { label: '居宅介護支援', jinkenhi: 70, description: 'ケアマネジャー' },
};

// 訪問介護: 身体介護 / 生活援助 / 通院乗降
export const HOUMON_UNITS = {
  shintai: [
    { label: '20分未満',              units: 163 },
    { label: '20分〜30分未満',        units: 244 },
    { label: '30分〜1時間未満',       units: 387 },
    { label: '1時間〜1時間30分未満',  units: 567 },
    { label: '1時間30分〜2時間未満',  units: 649 },
    { label: '2時間〜2時間30分未満',  units: 731 },
  ],
  seikatsu: [
    { label: '20分〜45分未満', units: 179 },
    { label: '45分以上',       units: 220 },
  ],
  tsuin: [
    { label: '通院等乗降介助 1回', units: 97 },
  ],
};

// 通所介護 通常規模型 (1回につき) [要介護1, 2, 3, 4, 5]
export const TSUSHO_UNITS: Record<string, number[]> = {
  '3-4h':  [370, 423, 479, 533, 588],
  '4-5h':  [388, 444, 502, 560, 617],
  '5-6h':  [570, 673, 777, 880, 984],
  '6-7h':  [584, 689, 796, 901, 1008],
  '7-8h':  [658, 777, 900, 1023, 1148],
  '8-9h':  [669, 791, 915, 1041, 1168],
};

export const TSUSHO_TIME_LABELS: Record<string, string> = {
  '3-4h': '3〜4時間',
  '4-5h': '4〜5時間',
  '5-6h': '5〜6時間',
  '6-7h': '6〜7時間',
  '7-8h': '7〜8時間',
  '8-9h': '8〜9時間',
};

// 居宅介護支援 (1月につき)
export const KYOTAKU_UNITS = {
  light: { label: '要介護1〜2', units: 1086 },
  heavy: { label: '要介護3〜5', units: 1411 },
};

// 加算 (令和8年6月期中改定対応)
// ※処遇改善加算ⅠイとⅠロは併用不可。Ⅰロは生産性向上要件を満たす事業所向け上乗せ区分。
export const KASAN: Record<KaigoService, { id: string; label: string; type: 'percent' | 'flat'; value: number }[]> = {
  houmon: [
    { id: 'shogu_ia', label: '処遇改善加算(Ⅰイ) ※令和8年6月改定', type: 'percent', value: 27.0 },
    { id: 'shogu_ib', label: '処遇改善加算(Ⅰロ) ※生産性向上要件',  type: 'percent', value: 28.7 },
    { id: 'tokutei',  label: '特定事業所加算(Ⅰ)',                  type: 'percent', value: 20 },
    { id: 'shoki',    label: '初回加算',                            type: 'flat',    value: 200 },
  ],
  tsusho: [
    { id: 'shogu_ia', label: '処遇改善加算(Ⅰイ) ※令和8年6月改定', type: 'percent', value: 10.4 },
    { id: 'shogu_ib', label: '処遇改善加算(Ⅰロ) ※生産性向上要件',  type: 'percent', value: 12.0 },
    { id: 'nyuyoku1', label: '入浴介助加算(Ⅰ)',                    type: 'flat',    value: 40 },
    { id: 'kobetsu',  label: '個別機能訓練加算(Ⅰ)イ',              type: 'flat',    value: 56 },
    { id: 'kuchi',    label: '口腔機能向上加算(Ⅰ)',                type: 'flat',    value: 150 },
  ],
  kyotaku: [
    // 令和8年6月新設: 居宅介護支援が処遇改善加算の対象に
    { id: 'shogu',    label: '処遇改善加算 ※令和8年6月新設',        type: 'percent', value: 2.1 },
    { id: 'shokai',   label: '初回加算',                            type: 'flat',    value: 300 },
    { id: 'tokutei',  label: '特定事業所加算(Ⅰ)',                  type: 'flat',    value: 519 },
  ],
};

// 減算 (common, V1)
export const GENSAN: Record<KaigoService, { id: string; label: string; type: 'percent' | 'flat'; value: number }[]> = {
  houmon: [
    { id: 'doitsu',  label: '同一建物減算 10%',                    type: 'percent', value: -10 },
    { id: 'gyakutai',label: '高齢者虐待防止措置未実施減算 1%',      type: 'percent', value: -1 },
  ],
  tsusho: [
    { id: 'doitsu',  label: '同一建物減算 94単位/日',               type: 'flat',    value: -94 },
    { id: 'gyakutai',label: '高齢者虐待防止措置未実施減算 1%',      type: 'percent', value: -1 },
  ],
  kyotaku: [
    { id: 'gyakutai',label: '高齢者虐待防止措置未実施減算 1%',      type: 'percent', value: -1 },
  ],
};
