export type YoukaigodoLevel = 'jiritsu' | 'shien1' | 'shien2' | 'kaigo1' | 'kaigo2' | 'kaigo3' | 'kaigo4' | 'kaigo5';

export type ServiceAvailability = 'ok' | 'limited' | 'no';

export interface YoukaigodoData {
  id: YoukaigodoLevel;
  label: string;
  shortLabel: string;
  description: string;
  limitUnits: number | null;
  limitYen: number | null;
  burden1: number | null;
  burden2: number | null;
  burden3: number | null;
  services: Record<string, ServiceAvailability>;
  facilities: Record<string, ServiceAvailability>;
}

export const SERVICE_LABELS: Record<string, string> = {
  homon_kaigo:   '訪問介護',
  homon_kango:   '訪問看護',
  homon_nyuyoku: '訪問入浴',
  homon_riha:    '訪問リハビリ',
  tsusho_kaigo:  '通所介護 (デイサービス)',
  tsusho_riha:   '通所リハビリ',
  short_stay:    'ショートステイ',
  fukushi_yogu:  '福祉用具貸与',
  jutaku_kaishu: '住宅改修',
  yobou:         '介護予防サービス',
};

export const FACILITY_LABELS: Record<string, string> = {
  group_home:     'グループホーム',
  yuryo:          '有料老人ホーム',
  service_kourei: 'サ高住 (サービス付き高齢者向け住宅)',
  tokuyou:        '特別養護老人ホーム (特養)',
  roken:          '介護老人保健施設 (老健)',
  kaigo_iryoin:   '介護医療院',
};

export const YOUKAIGODO_DATA: YoukaigodoData[] = [
  {
    id: 'jiritsu',
    label: '自立 (非該当)',
    shortLabel: '自立',
    description: '介護を必要としない状態。介護保険サービスは原則利用できませんが、市区町村の総合事業（介護予防・日常生活支援）を利用できる場合があります。',
    limitUnits: null,
    limitYen: null,
    burden1: null, burden2: null, burden3: null,
    services: {
      homon_kaigo: 'no', homon_kango: 'no', homon_nyuyoku: 'no', homon_riha: 'no',
      tsusho_kaigo: 'no', tsusho_riha: 'no', short_stay: 'no',
      fukushi_yogu: 'no', jutaku_kaishu: 'no',
      yobou: 'limited',
    },
    facilities: { group_home: 'no', yuryo: 'ok', service_kourei: 'ok', tokuyou: 'no', roken: 'no', kaigo_iryoin: 'no' },
  },
  {
    id: 'shien1',
    label: '要支援1',
    shortLabel: '要支援1',
    description: '日常生活の基本はほぼ自分でできるが、立ち上がりや歩行に時々支援が必要。介護予防サービスを利用して状態の改善・維持を目指す段階。',
    limitUnits: 5032,
    limitYen: 50320,
    burden1: 5032, burden2: 10064, burden3: 15096,
    services: {
      homon_kaigo: 'limited', homon_kango: 'ok', homon_nyuyoku: 'limited', homon_riha: 'ok',
      tsusho_kaigo: 'limited', tsusho_riha: 'ok', short_stay: 'limited',
      fukushi_yogu: 'limited', jutaku_kaishu: 'ok',
      yobou: 'ok',
    },
    facilities: { group_home: 'no', yuryo: 'ok', service_kourei: 'ok', tokuyou: 'no', roken: 'no', kaigo_iryoin: 'no' },
  },
  {
    id: 'shien2',
    label: '要支援2',
    shortLabel: '要支援2',
    description: '立ち上がり・歩行に支援が必要。要介護の手前の段階で、適切な介護予防により改善が期待できる。',
    limitUnits: 10531,
    limitYen: 105310,
    burden1: 10531, burden2: 21062, burden3: 31593,
    services: {
      homon_kaigo: 'limited', homon_kango: 'ok', homon_nyuyoku: 'limited', homon_riha: 'ok',
      tsusho_kaigo: 'limited', tsusho_riha: 'ok', short_stay: 'limited',
      fukushi_yogu: 'limited', jutaku_kaishu: 'ok',
      yobou: 'ok',
    },
    facilities: { group_home: 'ok', yuryo: 'ok', service_kourei: 'ok', tokuyou: 'no', roken: 'no', kaigo_iryoin: 'no' },
  },
  {
    id: 'kaigo1',
    label: '要介護1',
    shortLabel: '要介護1',
    description: '排泄・食事はほぼ自立しているが、立ち上がり・歩行・入浴などに部分的な介助が必要。認知機能の低下が見られる場合もある。',
    limitUnits: 16765,
    limitYen: 167650,
    burden1: 16765, burden2: 33530, burden3: 50295,
    services: {
      homon_kaigo: 'ok', homon_kango: 'ok', homon_nyuyoku: 'ok', homon_riha: 'ok',
      tsusho_kaigo: 'ok', tsusho_riha: 'ok', short_stay: 'ok',
      fukushi_yogu: 'ok', jutaku_kaishu: 'ok',
      yobou: 'no',
    },
    facilities: { group_home: 'ok', yuryo: 'ok', service_kourei: 'ok', tokuyou: 'no', roken: 'ok', kaigo_iryoin: 'limited' },
  },
  {
    id: 'kaigo2',
    label: '要介護2',
    shortLabel: '要介護2',
    description: '立ち上がり・歩行に介助が必要。排泄や入浴に部分的な介助、認知症の症状が出始める場合がある。',
    limitUnits: 19705,
    limitYen: 197050,
    burden1: 19705, burden2: 39410, burden3: 59115,
    services: {
      homon_kaigo: 'ok', homon_kango: 'ok', homon_nyuyoku: 'ok', homon_riha: 'ok',
      tsusho_kaigo: 'ok', tsusho_riha: 'ok', short_stay: 'ok',
      fukushi_yogu: 'ok', jutaku_kaishu: 'ok',
      yobou: 'no',
    },
    facilities: { group_home: 'ok', yuryo: 'ok', service_kourei: 'ok', tokuyou: 'no', roken: 'ok', kaigo_iryoin: 'ok' },
  },
  {
    id: 'kaigo3',
    label: '要介護3',
    shortLabel: '要介護3',
    description: '立ち上がり・歩行が自力で困難。排泄・入浴・着替えに全面介助。認知症症状で24時間の見守りが必要な場合もある。特養への入居資格を得る段階。',
    limitUnits: 27048,
    limitYen: 270480,
    burden1: 27048, burden2: 54096, burden3: 81144,
    services: {
      homon_kaigo: 'ok', homon_kango: 'ok', homon_nyuyoku: 'ok', homon_riha: 'ok',
      tsusho_kaigo: 'ok', tsusho_riha: 'ok', short_stay: 'ok',
      fukushi_yogu: 'ok', jutaku_kaishu: 'ok',
      yobou: 'no',
    },
    facilities: { group_home: 'ok', yuryo: 'ok', service_kourei: 'ok', tokuyou: 'ok', roken: 'ok', kaigo_iryoin: 'ok' },
  },
  {
    id: 'kaigo4',
    label: '要介護4',
    shortLabel: '要介護4',
    description: 'ほぼすべての日常生活に介助が必要。寝たきりに近い状態で、認知症の症状も進行している場合が多い。',
    limitUnits: 30938,
    limitYen: 309380,
    burden1: 30938, burden2: 61876, burden3: 92814,
    services: {
      homon_kaigo: 'ok', homon_kango: 'ok', homon_nyuyoku: 'ok', homon_riha: 'ok',
      tsusho_kaigo: 'ok', tsusho_riha: 'ok', short_stay: 'ok',
      fukushi_yogu: 'ok', jutaku_kaishu: 'ok',
      yobou: 'no',
    },
    facilities: { group_home: 'ok', yuryo: 'ok', service_kourei: 'ok', tokuyou: 'ok', roken: 'ok', kaigo_iryoin: 'ok' },
  },
  {
    id: 'kaigo5',
    label: '要介護5',
    shortLabel: '要介護5',
    description: '寝たきり、意思疎通も困難な最重度の状態。全面的な介護が必要で、医療的ケアを要する場合も多い。',
    limitUnits: 36217,
    limitYen: 362170,
    burden1: 36217, burden2: 72434, burden3: 108651,
    services: {
      homon_kaigo: 'ok', homon_kango: 'ok', homon_nyuyoku: 'ok', homon_riha: 'ok',
      tsusho_kaigo: 'ok', tsusho_riha: 'ok', short_stay: 'ok',
      fukushi_yogu: 'ok', jutaku_kaishu: 'ok',
      yobou: 'no',
    },
    facilities: { group_home: 'ok', yuryo: 'ok', service_kourei: 'ok', tokuyou: 'ok', roken: 'ok', kaigo_iryoin: 'ok' },
  },
];

export const STATE_CHECKLIST = [
  { level: 'shien1' as YoukaigodoLevel, items: ['歩行はおおむね自立', '時々支援が必要', '物忘れが時々ある'] },
  { level: 'shien2' as YoukaigodoLevel, items: ['立ち上がりに支援が必要', '掃除など家事の一部に支援', '介護予防サービスで改善可能'] },
  { level: 'kaigo1' as YoukaigodoLevel, items: ['歩行・入浴に部分介助', '排泄はほぼ自立', '見守り・声かけが必要'] },
  { level: 'kaigo2' as YoukaigodoLevel, items: ['歩行・排泄・入浴に介助', '認知症症状が出始める', '見守りの時間が増える'] },
  { level: 'kaigo3' as YoukaigodoLevel, items: ['立ち上がりが自力で困難', '排泄・入浴・着替えに全面介助', '24時間の見守りが必要'] },
  { level: 'kaigo4' as YoukaigodoLevel, items: ['ほぼ寝たきり', '食事も介助が必要', '意思疎通が難しい場面あり'] },
  { level: 'kaigo5' as YoukaigodoLevel, items: ['完全に寝たきり', '意思疎通困難', '医療ケアが必要な場合あり'] },
];
