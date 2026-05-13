export type Service = 'houmon' | 'tsusho' | 'shisetsu';
export type Scene = 'shokuji' | 'nyuyoku' | 'haisetsu' | 'fukuyaku' | 'rec' | 'vital' | 'tento';
export type Format = 'soap' | 'gow1h' | 'simple';
export type Joukyou = 'jiritsu' | 'ichibu' | 'zenkai' | 'kyohi' | 'ryouko' | 'trouble';

export const SERVICE_LABELS: Record<Service, string> = {
  houmon: '訪問介護',
  tsusho: '通所介護 / デイ',
  shisetsu: '施設',
};

export const SCENE_LABELS: Record<Scene, string> = {
  shokuji: '食事',
  nyuyoku: '入浴',
  haisetsu: '排泄',
  fukuyaku: '服薬',
  rec: 'レクリエーション',
  vital: 'バイタル測定',
  tento: '転倒・ヒヤリ',
};

export const FORMAT_LABELS: Record<Format, string> = {
  soap: 'SOAP',
  gow1h: '5W1H',
  simple: 'シンプル',
};

export const JOUKYOU_LABELS: Record<Joukyou, string> = {
  jiritsu: '自立〜見守り',
  ichibu: '一部介助',
  zenkai: '全介助',
  kyohi: '拒否あり',
  ryouko: '良好',
  trouble: 'トラブルあり',
};

export type TemplateVariant = (ctx: {
  time: string;
  memo: string;
  service: Service;
}) => string;

type SceneTemplates = Record<Scene, Partial<Record<Joukyou, TemplateVariant[]>>>;

// ───── SOAP templates ─────
const SOAP_TEMPLATES: SceneTemplates = {
  shokuji: {
    jiritsu: [
      ({ time, memo }) => `S: 「美味しい」と話される。\nO: ${time} 昼食を提供。主食10割、副食10割を自力で完食。むせ込みなし、姿勢保持良好。${memo ? '\n  ' + memo : ''}\nA: 食事摂取量・嚥下状態とも良好。\nP: 引き続き自力摂取を見守る。`,
      ({ time, memo }) => `S: 食事中、表情穏やか。\nO: ${time} 昼食。主食・副食ともに完食。水分300ml摂取。${memo ? '\n  ' + memo : ''}\nA: 食欲・摂取量に問題なし。\nP: 現状の食事形態を継続。`,
    ],
    ichibu: [
      ({ time, memo }) => `S: 「自分で食べたい」との発言あり。\nO: ${time} 昼食を提供。主食8割、副食6割を摂取。一部介助にて完了。${memo ? '\n  ' + memo : ''}\nA: 自力での意欲は維持。摂取量はやや少なめ。\nP: 自力摂取を促しつつ、必要時介助。摂取量の継続観察。`,
      ({ time, memo }) => `S: 介助時、笑顔あり。\nO: ${time} 昼食。スプーン操作の一部を介助、主食7割・副食7割を摂取。${memo ? '\n  ' + memo : ''}\nA: 上肢の疲労により後半介助量が増加。\nP: 食器の工夫を検討。`,
    ],
    zenkai: [
      ({ time, memo }) => `S: 介助時、頷きあり。\nO: ${time} 昼食を全介助にて提供。主食6割、副食5割を摂取。むせ込みなし。${memo ? '\n  ' + memo : ''}\nA: 嚥下状態は安定。摂取量は普通。\nP: 一口量と提供ペースに留意して継続。`,
    ],
    kyohi: [
      ({ time, memo }) => `S: 「いらない」と拒否あり。\nO: ${time} 昼食を提供したが、開口拒否。声かけ、間を置いての再提供で主食3割、副食2割摂取。${memo ? '\n  ' + memo : ''}\nA: 食欲低下傾向。原因の特定が必要。\nP: 体調確認、好みの確認、栄養士へ報告。`,
    ],
    ryouko: [
      ({ time, memo }) => `S: 「今日はおいしいね」と笑顔で話される。\nO: ${time} 昼食。全量摂取、表情穏やか。${memo ? '\n  ' + memo : ''}\nA: 食事への満足感あり。\nP: 引き続き観察。`,
    ],
    trouble: [
      ({ time, memo }) => `S: 食事中、咳込みあり。\nO: ${time} 昼食提供中、副食でむせ込み2回確認。すぐに食事を中断、水分摂取で落ち着く。バイタル測定 → SpO2 97%、呼吸音清音。${memo ? '\n  ' + memo : ''}\nA: 嚥下機能低下の可能性。\nP: 食事形態の見直しを看護師・栄養士と相談。`,
    ],
  },
  nyuyoku: {
    jiritsu: [
      ({ time, memo }) => `S: 「気持ちよかった」と発言。\nO: ${time} 一般浴。洗身・洗髪を自力で実施。湯温40度、入浴時間15分。バイタル測定 → 異常なし。${memo ? '\n  ' + memo : ''}\nA: 入浴前後の体調変化なし。\nP: 自力入浴を継続。`,
    ],
    ichibu: [
      ({ time, memo }) => `S: 「ありがとう」と発言。\nO: ${time} 一般浴。背中・足先の洗身を介助。洗髪は自力。湯温40度、15分。${memo ? '\n  ' + memo : ''}\nA: 入浴後の血圧変動なし、表情穏やか。\nP: 介助範囲を維持し継続。`,
    ],
    zenkai: [
      ({ time, memo }) => `S: 入浴中、リラックスした表情あり。\nO: ${time} 機械浴を全介助で実施。洗身・洗髪を全介助。湯温40度、10分。${memo ? '\n  ' + memo : ''}\nA: バイタル安定、皮膚状態異常なし。\nP: 体調観察を継続。`,
    ],
    kyohi: [
      ({ time, memo }) => `S: 「入りたくない」との発言。\nO: ${time} 入浴のお誘いをしたが拒否される。声かけを変え再度お誘いしたが、本日の入浴は希望されず。清拭にて対応。${memo ? '\n  ' + memo : ''}\nA: 拒否の理由は不明。気分・体調に留意。\nP: 翌日再度声かけ。清拭で清潔保持。`,
    ],
    ryouko: [
      ({ time, memo }) => `S: 「お風呂は気持ちいい」と話される。\nO: ${time} 一般浴。一部介助で完了、入浴後表情穏やか。${memo ? '\n  ' + memo : ''}\nA: 良好。\nP: 継続。`,
    ],
    trouble: [
      ({ time, memo }) => `S: 入浴中、ふらつきあり。\nO: ${time} 一般浴開始時、洗い場で立ち上がる際にふらつきを確認。即座に介助、椅子へ着座。バイタル測定 → 血圧100/60、脈拍90。${memo ? '\n  ' + memo : ''}\nA: 起立性の血圧変動の可能性。\nP: 看護師に報告、次回より体調確認の上対応を検討。`,
    ],
  },
  haisetsu: {
    jiritsu: [
      ({ time, memo }) => `S: 自らトイレへ向かわれる。\nO: ${time} トイレにて排尿。手すりを使用し移乗・着脱とも自立。性状異常なし。${memo ? '\n  ' + memo : ''}\nA: 排泄動作は自立を維持。\nP: 見守り継続。`,
    ],
    ichibu: [
      ({ time, memo }) => `S: 「お願いします」との発言。\nO: ${time} トイレへ誘導。立ち上がり・着脱を一部介助。排尿あり、性状異常なし。${memo ? '\n  ' + memo : ''}\nA: 排泄動作の一部に介助が必要。\nP: 定時誘導を継続。`,
    ],
    zenkai: [
      ({ time, memo }) => `S: 表情の変化なし。\nO: ${time} 居室にてオムツ交換を実施。排尿中等量、性状異常なし。皮膚状態に発赤等なし。${memo ? '\n  ' + memo : ''}\nA: 皮膚トラブルなし。\nP: 定時交換を継続。`,
    ],
    kyohi: [
      ({ time, memo }) => `S: 「行きたくない」と発言。\nO: ${time} 排泄誘導したが拒否される。15分後再度声かけしトイレへ誘導、排尿あり。${memo ? '\n  ' + memo : ''}\nA: タイミングが合わなかった可能性。\nP: 利用者のペースを尊重し声かけ。`,
    ],
    ryouko: [
      ({ time, memo }) => `S: 「すっきりした」と発言。\nO: ${time} トイレにて排尿。動作スムーズ。${memo ? '\n  ' + memo : ''}\nA: 排泄リズム良好。\nP: 継続。`,
    ],
    trouble: [
      ({ time, memo }) => `S: 不快感を訴えられる。\nO: ${time} オムツ交換時に発赤を確認。陰部・臀部に皮膚発赤あり、出血なし。${memo ? '\n  ' + memo : ''}\nA: 皮膚トラブル発生。\nP: 看護師へ報告、保湿剤等の対応を相談。`,
    ],
  },
  fukuyaku: {
    jiritsu: [
      ({ time, memo }) => `S: 「飲みました」と発言。\nO: ${time} 朝食後の薬を自己管理にて服用。残薬確認異常なし。${memo ? '\n  ' + memo : ''}\nA: 服薬管理自立。\nP: 継続。`,
    ],
    ichibu: [
      ({ time, memo }) => `S: 「ありがとう」と発言。\nO: ${time} 朝食後の薬を手渡し介助。水でゆっくり服用。残薬なし確認。${memo ? '\n  ' + memo : ''}\nA: 介助があれば確実な服薬可能。\nP: 手渡し介助を継続。`,
    ],
    zenkai: [
      ({ time, memo }) => `S: 表情穏やか。\nO: ${time} 朝食後の薬を口腔内に介助で投与。嚥下確認、口腔内残薬なし。${memo ? '\n  ' + memo : ''}\nA: 嚥下状態問題なし。\nP: 服薬時の体位・水分量に注意し継続。`,
    ],
    kyohi: [
      ({ time, memo }) => `S: 「飲みたくない」と発言。\nO: ${time} 朝食後の薬の服用を拒否。15分後再度声かけし服薬。${memo ? '\n  ' + memo : ''}\nA: 拒否はあるも最終的に服薬可能。\nP: 拒否の理由を看護師と共有。`,
    ],
    ryouko: [
      ({ time, memo }) => `S: 笑顔で「お薬の時間ね」と発言。\nO: ${time} 朝食後の薬を服用。${memo ? '\n  ' + memo : ''}\nA: 服薬意識が高い。\nP: 継続。`,
    ],
    trouble: [
      ({ time, memo }) => `S: 「のどに詰まった」と訴え。\nO: ${time} 朝食後の薬服用後、咽頭部の違和感を訴えられる。水分追加で症状改善。${memo ? '\n  ' + memo : ''}\nA: 嚥下に注意が必要。\nP: 服薬補助ゼリーの使用を看護師と相談。`,
    ],
  },
  rec: {
    jiritsu: [
      ({ time, memo }) => `S: 「楽しかった」との発言。\nO: ${time} 体操レクに参加。10分間、職員の動きに合わせて自力で参加された。${memo ? '\n  ' + memo : ''}\nA: 活動量・参加意欲ともに良好。\nP: 同様のレクへの参加を促す。`,
    ],
    ichibu: [
      ({ time, memo }) => `S: 笑顔で参加される。\nO: ${time} 塗り絵のレクに参加。声かけにて15分集中して取り組まれた。${memo ? '\n  ' + memo : ''}\nA: 集中力あり、達成感を感じている様子。\nP: 同種のレクを継続。`,
    ],
    zenkai: [
      ({ time, memo }) => `S: 周囲の様子を見ておられる。\nO: ${time} レク会場へ移動。座位保持し、他利用者の様子を見学。職員の声かけに頷きあり。${memo ? '\n  ' + memo : ''}\nA: 受動的だが参加意識あり。\nP: 視覚・聴覚で楽しめる内容を提供。`,
    ],
    kyohi: [
      ({ time, memo }) => `S: 「行かない」と発言。\nO: ${time} レクへのお誘いを拒否される。居室で過ごされる。${memo ? '\n  ' + memo : ''}\nA: 本日は気分が向かない様子。\nP: 翌日再度お誘いし、強要しない。`,
    ],
    ryouko: [
      ({ time, memo }) => `S: 「次もやりたい」と発言。\nO: ${time} 歌のレクに参加、最後まで笑顔。${memo ? '\n  ' + memo : ''}\nA: 満足度高い。\nP: 同種レクを継続。`,
    ],
    trouble: [
      ({ time, memo }) => `S: 「疲れた」と訴え。\nO: ${time} レク途中で疲労感を訴えられる。バイタル測定 → 異常なし。休憩を取り回復。${memo ? '\n  ' + memo : ''}\nA: 体調変化の可能性。\nP: レクの所要時間を短縮し対応。`,
    ],
  },
  vital: {
    jiritsu: [
      ({ time, memo }) => `S: 体調の訴えなし。\nO: ${time} バイタル測定。体温36.6℃、血圧128/78、脈拍72、SpO2 98%。${memo ? '\n  ' + memo : ''}\nA: 全項目基準値内。\nP: 継続観察。`,
    ],
    ichibu: [
      ({ time, memo }) => `S: 「変わりないよ」と発言。\nO: ${time} バイタル測定。体温36.8℃、血圧135/82、脈拍76、SpO2 97%。${memo ? '\n  ' + memo : ''}\nA: 軽度の血圧上昇あるも問題なし。\nP: 翌日の経過観察。`,
    ],
    zenkai: [
      ({ time, memo }) => `S: 発語なし、表情穏やか。\nO: ${time} バイタル測定。体温37.0℃、血圧130/80、脈拍80、SpO2 96%。${memo ? '\n  ' + memo : ''}\nA: 微熱傾向。\nP: 水分摂取量・室温調整、再検測定。`,
    ],
    ryouko: [
      ({ time, memo }) => `S: 「元気だよ」と発言。\nO: ${time} バイタル測定。すべて基準値内。${memo ? '\n  ' + memo : ''}\nA: 良好。\nP: 継続。`,
    ],
    kyohi: [
      ({ time, memo }) => `S: 「やらなくていい」と発言。\nO: ${time} バイタル測定を拒否される。声かけにて時間をおき、再度測定実施。すべて基準値内。${memo ? '\n  ' + memo : ''}\nA: 体調自体は良好。\nP: 利用者のタイミングを尊重。`,
    ],
    trouble: [
      ({ time, memo }) => `S: 「頭が痛い」と訴え。\nO: ${time} バイタル測定。体温37.4℃、血圧148/92、脈拍88、SpO2 97%。${memo ? '\n  ' + memo : ''}\nA: 発熱・血圧上昇あり。\nP: 看護師へ報告、家族・医師連絡を検討。`,
    ],
  },
  tento: {
    jiritsu: [
      ({ time, memo }) => `S: 「大丈夫、転んでないよ」と発言。\nO: ${time} 居室にてヒヤリ報告あり。本人より「立ち上がる際にふらついた」との情報。観察上、外傷・打撲なし。バイタル測定 → 異常なし。${memo ? '\n  ' + memo : ''}\nA: 転倒には至らず。リスク要因あり。\nP: ヒヤリハット報告書作成、環境整備。`,
    ],
    ichibu: [
      ({ time, memo }) => `S: 「ちょっと滑った」と発言。\nO: ${time} 食堂で発見。床に座り込んでおられる。意識清明、外傷確認なし。バイタル測定 → 安定。${memo ? '\n  ' + memo : ''}\nA: 軽度の転倒、外傷なし。\nP: 事故報告書作成、看護師・家族連絡。原因究明と再発防止策の検討。`,
    ],
    zenkai: [
      ({ time, memo }) => `S: 発語なし、痛みの訴えなし。\nO: ${time} ベッド脇で発見。床に横向きで臥位。意識清明、頭部・四肢に外傷なし。バイタル測定 → 安定。${memo ? '\n  ' + memo : ''}\nA: ベッドからの転落の可能性。\nP: 事故報告書作成、医師・家族連絡、ベッド周囲環境の見直し。`,
    ],
    trouble: [
      ({ time, memo }) => `S: 「痛い」と訴え。\nO: ${time} トイレ前で転倒。右膝に擦過傷確認、出血少量。バイタル → 異常なし。${memo ? '\n  ' + memo : ''}\nA: 軽度外傷あり、骨折等の疑いは観察上なし。\nP: 看護師処置、事故報告書作成、家族・医師へ連絡。`,
    ],
  },
};

// ───── 5W1H templates ─────
const GOW1H_TEMPLATES: SceneTemplates = {
  shokuji: {
    jiritsu: [
      ({ time, memo }) => `When: ${time}\nWhere: 食堂\nWho: 利用者本人\nWhat: 昼食\nWhy: 通常の食事提供\nHow: 自力にて完食、むせ込みなし${memo ? '\n備考: ' + memo : ''}`,
    ],
    ichibu: [
      ({ time, memo }) => `When: ${time}\nWhere: 食堂\nWho: 利用者本人\nWhat: 昼食\nWhy: 通常の食事提供\nHow: 主食8割・副食6割を一部介助で摂取${memo ? '\n備考: ' + memo : ''}`,
    ],
    zenkai: [
      ({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: 昼食\nWhy: 食事介助\nHow: 全介助にて主食6割・副食5割を摂取${memo ? '\n備考: ' + memo : ''}`,
    ],
    kyohi: [
      ({ time, memo }) => `When: ${time}\nWhere: 食堂\nWho: 利用者本人\nWhat: 昼食拒否\nWhy: 食欲低下\nHow: 声かけ後再提供、主食3割摂取${memo ? '\n備考: ' + memo : ''}`,
    ],
    ryouko: [
      ({ time, memo }) => `When: ${time}\nWhere: 食堂\nWho: 利用者本人\nWhat: 昼食\nWhy: 通常提供\nHow: 全量完食、表情穏やか${memo ? '\n備考: ' + memo : ''}`,
    ],
    trouble: [
      ({ time, memo }) => `When: ${time}\nWhere: 食堂\nWho: 利用者本人\nWhat: 食事中のむせ込み\nWhy: 嚥下機能低下の疑い\nHow: 食事中断、水分摂取で改善${memo ? '\n備考: ' + memo : ''}`,
    ],
  },
  nyuyoku: {
    jiritsu: [({ time, memo }) => `When: ${time}\nWhere: 浴室\nWho: 利用者本人\nWhat: 一般浴\nWhy: 入浴日\nHow: 自力にて完了、湯温40度・15分${memo ? '\n備考: ' + memo : ''}`],
    ichibu: [({ time, memo }) => `When: ${time}\nWhere: 浴室\nWho: 利用者本人\nWhat: 一般浴\nWhy: 入浴日\nHow: 背中等を一部介助、洗髪は自力${memo ? '\n備考: ' + memo : ''}`],
    zenkai: [({ time, memo }) => `When: ${time}\nWhere: 浴室\nWho: 利用者本人\nWhat: 機械浴\nWhy: 入浴日\nHow: 全介助、湯温40度・10分${memo ? '\n備考: ' + memo : ''}`],
    kyohi: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: 入浴拒否\nWhy: 本人の希望\nHow: 清拭にて対応${memo ? '\n備考: ' + memo : ''}`],
    ryouko: [({ time, memo }) => `When: ${time}\nWhere: 浴室\nWho: 利用者本人\nWhat: 一般浴\nWhy: 入浴日\nHow: 良好に終了${memo ? '\n備考: ' + memo : ''}`],
    trouble: [({ time, memo }) => `When: ${time}\nWhere: 浴室\nWho: 利用者本人\nWhat: 入浴中のふらつき\nWhy: 起立性の血圧変動の疑い\nHow: 即座に介助、椅子へ着座${memo ? '\n備考: ' + memo : ''}`],
  },
  haisetsu: {
    jiritsu: [({ time, memo }) => `When: ${time}\nWhere: トイレ\nWho: 利用者本人\nWhat: 排尿\nWhy: 通常\nHow: 自力にて実施${memo ? '\n備考: ' + memo : ''}`],
    ichibu: [({ time, memo }) => `When: ${time}\nWhere: トイレ\nWho: 利用者本人\nWhat: 排尿\nWhy: 定時誘導\nHow: 立ち上がり・着脱を一部介助${memo ? '\n備考: ' + memo : ''}`],
    zenkai: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: オムツ交換\nWhy: 定時交換\nHow: 全介助にて実施${memo ? '\n備考: ' + memo : ''}`],
    kyohi: [({ time, memo }) => `When: ${time}\nWhere: トイレ\nWho: 利用者本人\nWhat: 排泄誘導拒否\nWhy: タイミング不一致\nHow: 15分後再度誘導${memo ? '\n備考: ' + memo : ''}`],
    ryouko: [({ time, memo }) => `When: ${time}\nWhere: トイレ\nWho: 利用者本人\nWhat: 排尿\nWhy: 通常\nHow: スムーズに実施${memo ? '\n備考: ' + memo : ''}`],
    trouble: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: 皮膚発赤確認\nWhy: 皮膚トラブル\nHow: 看護師へ報告${memo ? '\n備考: ' + memo : ''}`],
  },
  fukuyaku: {
    jiritsu: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: 朝食後の薬服用\nWhy: 処方\nHow: 自己管理にて服用${memo ? '\n備考: ' + memo : ''}`],
    ichibu: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: 朝食後の薬服用\nWhy: 処方\nHow: 手渡し介助${memo ? '\n備考: ' + memo : ''}`],
    zenkai: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: 朝食後の薬服用\nWhy: 処方\nHow: 口腔内へ介助投与${memo ? '\n備考: ' + memo : ''}`],
    kyohi: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: 服薬拒否\nWhy: 本人の意向\nHow: 15分後再度声かけ${memo ? '\n備考: ' + memo : ''}`],
    ryouko: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: 服薬\nWhy: 処方\nHow: 自発的に服用${memo ? '\n備考: ' + memo : ''}`],
    trouble: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: 服薬後の咽頭違和感\nWhy: 嚥下の不調\nHow: 水分追加で改善${memo ? '\n備考: ' + memo : ''}`],
  },
  rec: {
    jiritsu: [({ time, memo }) => `When: ${time}\nWhere: ホール\nWho: 利用者本人\nWhat: 体操レク\nWhy: 活動\nHow: 自力で10分参加${memo ? '\n備考: ' + memo : ''}`],
    ichibu: [({ time, memo }) => `When: ${time}\nWhere: ホール\nWho: 利用者本人\nWhat: 塗り絵レク\nWhy: 活動\nHow: 声かけにて15分集中${memo ? '\n備考: ' + memo : ''}`],
    zenkai: [({ time, memo }) => `When: ${time}\nWhere: ホール\nWho: 利用者本人\nWhat: レク見学\nWhy: 活動参加\nHow: 座位で他利用者を見学${memo ? '\n備考: ' + memo : ''}`],
    kyohi: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: レク不参加\nWhy: 本人の意向\nHow: 居室で過ごされる${memo ? '\n備考: ' + memo : ''}`],
    ryouko: [({ time, memo }) => `When: ${time}\nWhere: ホール\nWho: 利用者本人\nWhat: 歌のレク\nWhy: 活動\nHow: 最後まで笑顔で参加${memo ? '\n備考: ' + memo : ''}`],
    trouble: [({ time, memo }) => `When: ${time}\nWhere: ホール\nWho: 利用者本人\nWhat: レク中の疲労\nWhy: 体力低下\nHow: 中断・休憩${memo ? '\n備考: ' + memo : ''}`],
  },
  vital: {
    jiritsu: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: バイタル測定\nWhy: 日常チェック\nHow: 体温36.6℃、血圧128/78、脈拍72、SpO2 98%${memo ? '\n備考: ' + memo : ''}`],
    ichibu: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: バイタル測定\nWhy: 日常チェック\nHow: 体温36.8℃、血圧135/82${memo ? '\n備考: ' + memo : ''}`],
    zenkai: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: バイタル測定\nWhy: 微熱傾向の経過観察\nHow: 体温37.0℃、その他基準値内${memo ? '\n備考: ' + memo : ''}`],
    ryouko: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: バイタル測定\nWhy: 日常チェック\nHow: すべて基準値内${memo ? '\n備考: ' + memo : ''}`],
    kyohi: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: バイタル測定拒否\nWhy: 本人の意向\nHow: 時間を置き再実施${memo ? '\n備考: ' + memo : ''}`],
    trouble: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: 頭痛・発熱\nWhy: 体調不良\nHow: 看護師へ報告${memo ? '\n備考: ' + memo : ''}`],
  },
  tento: {
    jiritsu: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: ヒヤリ報告\nWhy: 立ち上がり時のふらつき\nHow: 観察、外傷なし、報告書作成${memo ? '\n備考: ' + memo : ''}`],
    ichibu: [({ time, memo }) => `When: ${time}\nWhere: 食堂\nWho: 利用者本人\nWhat: 軽度転倒\nWhy: 滑り\nHow: 観察、外傷なし、報告書作成${memo ? '\n備考: ' + memo : ''}`],
    zenkai: [({ time, memo }) => `When: ${time}\nWhere: 居室\nWho: 利用者本人\nWhat: ベッドからの転落\nWhy: 不明\nHow: 観察、医師連絡、報告書作成${memo ? '\n備考: ' + memo : ''}`],
    trouble: [({ time, memo }) => `When: ${time}\nWhere: トイレ前\nWho: 利用者本人\nWhat: 転倒、右膝擦過傷\nWhy: バランス不良\nHow: 看護師処置、家族・医師連絡${memo ? '\n備考: ' + memo : ''}`],
  },
};

// ───── Simple templates ─────
const SIMPLE_TEMPLATES: SceneTemplates = {
  shokuji: {
    jiritsu: [({ time, memo }) => `${time} 昼食を提供。主食10割、副食10割を自力で完食。むせ込みなし。${memo ? ' ' + memo : ''}`],
    ichibu: [({ time, memo }) => `${time} 昼食を提供。一部介助にて主食8割、副食6割を摂取。${memo ? ' ' + memo : ''}`],
    zenkai: [({ time, memo }) => `${time} 昼食を全介助にて提供。主食6割、副食5割を摂取。むせ込みなし。${memo ? ' ' + memo : ''}`],
    kyohi: [({ time, memo }) => `${time} 昼食を提供したが開口拒否。声かけ後、主食3割を摂取。${memo ? ' ' + memo : ''}`],
    ryouko: [({ time, memo }) => `${time} 昼食。全量摂取、表情穏やか。${memo ? ' ' + memo : ''}`],
    trouble: [({ time, memo }) => `${time} 昼食中、副食でむせ込み2回。中断し水分摂取で改善。SpO2 97%、呼吸音清音。${memo ? ' ' + memo : ''}`],
  },
  nyuyoku: {
    jiritsu: [({ time, memo }) => `${time} 一般浴。自力にて洗身・洗髪を実施、湯温40度・15分。バイタル異常なし。${memo ? ' ' + memo : ''}`],
    ichibu: [({ time, memo }) => `${time} 一般浴。背中・足先の洗身を介助、洗髪は自力。湯温40度・15分。${memo ? ' ' + memo : ''}`],
    zenkai: [({ time, memo }) => `${time} 機械浴を全介助で実施。湯温40度・10分。バイタル安定。${memo ? ' ' + memo : ''}`],
    kyohi: [({ time, memo }) => `${time} 入浴をお誘いしたが拒否。清拭にて対応。${memo ? ' ' + memo : ''}`],
    ryouko: [({ time, memo }) => `${time} 一般浴、一部介助で完了。表情穏やか。${memo ? ' ' + memo : ''}`],
    trouble: [({ time, memo }) => `${time} 入浴開始時、立ち上がり時にふらつき確認。即座に介助。バイタル → 血圧100/60。${memo ? ' ' + memo : ''}`],
  },
  haisetsu: {
    jiritsu: [({ time, memo }) => `${time} トイレにて排尿。移乗・着脱とも自立、性状異常なし。${memo ? ' ' + memo : ''}`],
    ichibu: [({ time, memo }) => `${time} トイレへ誘導。立ち上がり・着脱を一部介助、排尿あり。${memo ? ' ' + memo : ''}`],
    zenkai: [({ time, memo }) => `${time} 居室にてオムツ交換。排尿中等量、皮膚異常なし。${memo ? ' ' + memo : ''}`],
    kyohi: [({ time, memo }) => `${time} 排泄誘導を拒否される。15分後再度声かけ、トイレにて排尿。${memo ? ' ' + memo : ''}`],
    ryouko: [({ time, memo }) => `${time} トイレにて排尿、動作スムーズ。${memo ? ' ' + memo : ''}`],
    trouble: [({ time, memo }) => `${time} オムツ交換時、陰部・臀部に発赤確認。看護師へ報告。${memo ? ' ' + memo : ''}`],
  },
  fukuyaku: {
    jiritsu: [({ time, memo }) => `${time} 朝食後の薬を自己管理にて服用。残薬確認異常なし。${memo ? ' ' + memo : ''}`],
    ichibu: [({ time, memo }) => `${time} 朝食後の薬を手渡し介助。水でゆっくり服用、残薬なし。${memo ? ' ' + memo : ''}`],
    zenkai: [({ time, memo }) => `${time} 朝食後の薬を口腔内に介助で投与。嚥下確認、残薬なし。${memo ? ' ' + memo : ''}`],
    kyohi: [({ time, memo }) => `${time} 服薬を拒否。15分後再度声かけし服薬。${memo ? ' ' + memo : ''}`],
    ryouko: [({ time, memo }) => `${time} 朝食後の薬を自発的に服用。${memo ? ' ' + memo : ''}`],
    trouble: [({ time, memo }) => `${time} 服薬後、咽頭部の違和感を訴え。水分追加で改善。${memo ? ' ' + memo : ''}`],
  },
  rec: {
    jiritsu: [({ time, memo }) => `${time} 体操レクに参加。10分間、職員の動きに合わせて自力で実施。${memo ? ' ' + memo : ''}`],
    ichibu: [({ time, memo }) => `${time} 塗り絵のレクに参加。声かけにて15分集中。${memo ? ' ' + memo : ''}`],
    zenkai: [({ time, memo }) => `${time} レク会場へ移動、座位で見学。声かけに頷きあり。${memo ? ' ' + memo : ''}`],
    kyohi: [({ time, memo }) => `${time} レクへのお誘いを拒否、居室で過ごされる。${memo ? ' ' + memo : ''}`],
    ryouko: [({ time, memo }) => `${time} 歌のレクに参加、最後まで笑顔。${memo ? ' ' + memo : ''}`],
    trouble: [({ time, memo }) => `${time} レク途中で疲労感を訴えられ、休憩。バイタル → 異常なし。${memo ? ' ' + memo : ''}`],
  },
  vital: {
    jiritsu: [({ time, memo }) => `${time} バイタル測定。体温36.6℃、血圧128/78、脈拍72、SpO2 98%。${memo ? ' ' + memo : ''}`],
    ichibu: [({ time, memo }) => `${time} バイタル測定。体温36.8℃、血圧135/82、脈拍76、SpO2 97%。${memo ? ' ' + memo : ''}`],
    zenkai: [({ time, memo }) => `${time} バイタル測定。体温37.0℃、その他は基準値内。${memo ? ' ' + memo : ''}`],
    ryouko: [({ time, memo }) => `${time} バイタル測定。すべて基準値内、体調良好。${memo ? ' ' + memo : ''}`],
    kyohi: [({ time, memo }) => `${time} バイタル測定を拒否。時間を置き再度実施、基準値内。${memo ? ' ' + memo : ''}`],
    trouble: [({ time, memo }) => `${time} バイタル測定。体温37.4℃、血圧148/92。看護師へ報告。${memo ? ' ' + memo : ''}`],
  },
  tento: {
    jiritsu: [({ time, memo }) => `${time} 居室にてヒヤリ報告。立ち上がり時のふらつき、外傷なし、バイタル異常なし。ヒヤリハット報告書作成。${memo ? ' ' + memo : ''}`],
    ichibu: [({ time, memo }) => `${time} 食堂で発見。床に座り込み、意識清明、外傷なし、バイタル安定。事故報告書作成、看護師・家族連絡。${memo ? ' ' + memo : ''}`],
    zenkai: [({ time, memo }) => `${time} ベッド脇で発見。意識清明、外傷なし、バイタル安定。事故報告書作成、医師・家族連絡。${memo ? ' ' + memo : ''}`],
    trouble: [({ time, memo }) => `${time} トイレ前で転倒。右膝擦過傷、出血少量、バイタル異常なし。看護師処置、家族・医師連絡。${memo ? ' ' + memo : ''}`],
  },
};

export const TEMPLATES_BY_FORMAT: Record<Format, SceneTemplates> = {
  soap: SOAP_TEMPLATES,
  gow1h: GOW1H_TEMPLATES,
  simple: SIMPLE_TEMPLATES,
};

export interface ForbiddenWord {
  word: string;
  category: 'bubetsu' | 'meirei' | 'igaku' | 'shukan';
  reason: string;
  suggestion: string;
}

export const FORBIDDEN_WORDS: ForbiddenWord[] = [
  { word: 'ボケ',     category: 'bubetsu', reason: '侮蔑的表現',             suggestion: '認知症の方／物忘れがある' },
  { word: '徘徊',     category: 'bubetsu', reason: '本人の意思を否定する表現', suggestion: '歩き回られる／一人で外出される' },
  { word: '問題行動', category: 'bubetsu', reason: '原因を本人に帰す表現',     suggestion: 'BPSD／不安からの行動' },
  { word: '寝たきり', category: 'bubetsu', reason: '状態を断定的に表現',       suggestion: 'ベッド上で過ごす時間が長い' },
  { word: 'させる',   category: 'meirei',  reason: '命令的表現',               suggestion: 'していただく／促す' },
  { word: 'やらせる', category: 'meirei',  reason: '命令的表現',               suggestion: 'していただく／お声かけする' },
  { word: 'してやる', category: 'meirei',  reason: '見下す表現',               suggestion: 'させていただく／お手伝いする' },
  { word: '診断',     category: 'igaku',   reason: '介護職による医学的判断は不可', suggestion: '〜の可能性／〜と思われる症状' },
  { word: '治療',     category: 'igaku',   reason: '介護職による医学的判断は不可', suggestion: '看護師・医師へ報告' },
  { word: 'かわいい', category: 'shukan',  reason: '主観的表現',               suggestion: '客観的な観察事実を記録' },
  { word: '可哀想',   category: 'shukan',  reason: '主観的表現',               suggestion: '本人の表情・発言など事実を記載' },
  { word: 'やっぱり', category: 'shukan',  reason: '推測表現',                 suggestion: '具体的な根拠を記載' },
];

export function checkForbiddenWords(text: string): ForbiddenWord[] {
  const hits: ForbiddenWord[] = [];
  for (const f of FORBIDDEN_WORDS) {
    if (text.includes(f.word)) hits.push(f);
  }
  return hits;
}
