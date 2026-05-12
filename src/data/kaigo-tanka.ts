import type { JinkenhiPercent } from './kaigo-units';

export type Kyuchi = '1' | '2' | '3' | '4' | '5' | '6' | '7' | 'other';

// Per-unit prices [級地][人件費%]
// Source: 令和6年〜8年介護報酬改定
export const TANKA_TABLE: Record<Kyuchi, Record<JinkenhiPercent, number>> = {
  '1':     { 70: 11.40, 55: 11.10, 45: 10.90 },
  '2':     { 70: 11.12, 55: 10.88, 45: 10.72 },
  '3':     { 70: 11.05, 55: 10.83, 45: 10.68 },
  '4':     { 70: 10.84, 55: 10.66, 45: 10.54 },
  '5':     { 70: 10.70, 55: 10.55, 45: 10.45 },
  '6':     { 70: 10.42, 55: 10.33, 45: 10.27 },
  '7':     { 70: 10.21, 55: 10.17, 45: 10.14 },
  'other': { 70: 10.00, 55: 10.00, 45: 10.00 },
};

export const KYUCHI_LABELS: Record<Kyuchi, string> = {
  '1':     '1級地 (東京23区など)',
  '2':     '2級地 (横浜・大阪市など)',
  '3':     '3級地 (名古屋・京都市など)',
  '4':     '4級地 (さいたま・千葉市など)',
  '5':     '5級地 (神戸・福岡市など)',
  '6':     '6級地 (札幌・仙台市など)',
  '7':     '7級地 (地方中核都市)',
  'other': 'その他の地域',
};

export function calcTanka(kyuchi: Kyuchi, jinkenhi: JinkenhiPercent): number {
  return TANKA_TABLE[kyuchi]?.[jinkenhi] ?? 10.0;
}
