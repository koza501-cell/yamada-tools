// 連絡帳 文例データ

export type Age = 'age0' | 'age1' | 'age2' | 'age3' | 'age4' | 'age5';
export type Scene =
  | 'asobi' | 'shokuji' | 'gosui' | 'seichou' | 'trouble'
  | 'taichou' | 'gyouji' | 'shonichi' | 'yasumiake' | 'birthday';
export type Yousu = 'genki' | 'shuchu' | 'guzuru' | 'tsukareta' | 'chosen' | 'tomodachi';

export const AGE_LABELS: Record<Age, string> = {
  age0: '0歳児', age1: '1歳児', age2: '2歳児',
  age3: '3歳児', age4: '4歳児', age5: '5歳児',
};

export const SCENE_LABELS: Record<Scene, string> = {
  asobi:     '遊び',
  shokuji:   '食事',
  gosui:     '睡眠・午睡',
  seichou:   '成長・できた',
  trouble:   'トラブル・けんか',
  taichou:   '体調',
  gyouji:    '行事・イベント',
  shonichi:  '入園初日',
  yasumiake: '休み明け',
  birthday:  '誕生日',
};

export const YOUSU_LABELS: Record<Yousu, string> = {
  genki:     '元気・活発',
  shuchu:    '集中',
  guzuru:    'ぐずる・甘え',
  tsukareta: '疲れた',
  chosen:    '新しい挑戦',
  tomodachi: '友達と',
};

export type TemplateVariant = (ctx: { memo: string }) => string;

const TEMPLATES: Record<Age, Partial<Record<Scene, Partial<Record<Yousu, TemplateVariant[]>>>>> = {
  age0: {
    asobi: {
      genki: [
        ({ memo }) => `今日は音のなる玩具を両手で握り、カチカチと音を楽しんでいました。保育士の歌に合わせて手足を動かし、にこにこと笑顔を見せてくれましたよ。${memo ? '\n' + memo : ''}`,
        ({ memo }) => `ハイハイで好きなおもちゃのところまで進んでいき、嬉しそうに遊んでいました。新しい音や色に興味津々の様子で、目を輝かせていました。${memo ? '\n' + memo : ''}`,
        ({ memo }) => `今日は布絵本に興味を示し、保育士と一緒にページをめくって楽しみました。動物のページで「あー」と声を出し、満足そうな表情でしたよ。${memo ? '\n' + memo : ''}`,
      ],
      shuchu: [
        ({ memo }) => `お気に入りの玩具を見つけると、じっと見つめながら手を伸ばしていました。集中している姿が頼もしく、成長を感じる瞬間でした。${memo ? '\n' + memo : ''}`,
      ],
      guzuru: [
        ({ memo }) => `今日は少しぐずる場面がありましたが、抱っこで安心するとすぐに笑顔になりました。お母さん・お父さんのことを思い出していたのかもしれませんね。${memo ? '\n' + memo : ''}`,
      ],
    },
    shokuji: {
      genki: [
        ({ memo }) => `離乳食をよく食べてくれました。今日のメニューは特に気に入ったようで、もっとほしいと口を開けてアピールしてくれましたよ。${memo ? '\n' + memo : ''}`,
        ({ memo }) => `スプーンに興味を持ち、自分でつかもうとする仕草が見られました。食事への意欲が高まっている様子です。${memo ? '\n' + memo : ''}`,
      ],
      guzuru: [
        ({ memo }) => `離乳食の固さに少し戸惑う様子でしたが、保育士と一緒にゆっくり食べると完食できました。今日もよく頑張りましたね。${memo ? '\n' + memo : ''}`,
      ],
    },
    gosui: {
      genki: [
        ({ memo }) => `今日のお昼寝は12時から14時まで、ぐっすり眠ることができました。起きたあとも機嫌よく過ごしていました。${memo ? '\n' + memo : ''}`,
      ],
      guzuru: [
        ({ memo }) => `お昼寝になかなか入れず、保育士が背中をトントンするとリラックスして眠りについていました。途中で目を覚ましましたが、また安心して眠ることができました。${memo ? '\n' + memo : ''}`,
      ],
    },
    seichou: {
      chosen: [
        ({ memo }) => `今日はずりばいで前に進む様子が見られました! ゆっくりですが、確実に進んでいて、見ていてとても嬉しくなりました。これからの成長が楽しみですね。${memo ? '\n' + memo : ''}`,
        ({ memo }) => `保育士の「いただきます」の声かけに合わせて、両手を合わせる仕草を見せてくれました。少しずつ言葉と動作がつながってきているのを感じます。${memo ? '\n' + memo : ''}`,
      ],
    },
    taichou: {
      genki: [
        ({ memo }) => `今日は機嫌よく1日過ごせました。鼻水もなく、よく遊び・よく食べ・よく眠るリズムができていました。${memo ? '\n' + memo : ''}`,
      ],
      tsukareta: [
        ({ memo }) => `午前中は元気に遊んでいましたが、午後は少しお疲れの様子でした。早めに横になって体を休めました。お家でもゆっくり休んでくださいね。${memo ? '\n' + memo : ''}`,
      ],
    },
  },

  age1: {
    asobi: {
      genki: [
        ({ memo }) => `今日は園庭で砂遊びを楽しみました。スコップで砂をすくってお皿に入れる動作を繰り返し、「できた!」という表情を何度も見せてくれました。${memo ? '\n' + memo : ''}`,
        ({ memo }) => `お友達と並んでブロック遊びをしました。同じ色のブロックを集めるのに夢中で、しばらく集中して取り組んでいました。${memo ? '\n' + memo : ''}`,
      ],
      tomodachi: [
        ({ memo }) => `お友達がしている遊びをじっと見つめ、真似をする姿が見られました。同じことをすると嬉しそうに笑い、心が通い合っている様子でした。${memo ? '\n' + memo : ''}`,
      ],
    },
    shokuji: {
      chosen: [
        ({ memo }) => `スプーンを持って自分で食べたい気持ちが強くなってきているようです。少しずつこぼしながらも、自分で口に運ぶ姿がたくましく見えました。${memo ? '\n' + memo : ''}`,
        ({ memo }) => `今日のごはんはお野菜が苦手な様子でしたが、保育士が「美味しいよ」と声をかけると、頑張って一口食べることができました。${memo ? '\n' + memo : ''}`,
      ],
      guzuru: [
        ({ memo }) => `今日のお昼は野菜があまり進まず、ぐずってしまう場面もありました。スプーンを持って自分で食べたい気持ちが強くなってきているようです。${memo ? '\n' + memo : ''}`,
      ],
    },
    seichou: {
      chosen: [
        ({ memo }) => `今日、初めて自分で靴を脱いで靴箱に入れることができました! 「できた!」と嬉しそうに保育士に見せてくれましたよ。${memo ? '\n' + memo : ''}`,
      ],
    },
    trouble: {
      tomodachi: [
        ({ memo }) => `お友達と玩具の取り合いになる場面がありましたが、「順番ね」と声をかけると、保育士の手をそっと押さえて待つことができました。少しずつ気持ちを言葉や行動で伝えられるようになってきています。${memo ? '\n' + memo : ''}`,
      ],
    },
    taichou: {
      tsukareta: [
        ({ memo }) => `今日は午前中に少し疲れた様子で、いつもより早めにお昼寝に入りました。起きたあとは元気に遊んでいましたが、お家でも様子を見てあげてください。${memo ? '\n' + memo : ''}`,
      ],
    },
  },

  age2: {
    asobi: {
      genki: [
        ({ memo }) => `今日は園庭で「先生、見て!」と何度も呼んでくれ、できたことを嬉しそうに伝えてくれました。やりたいことが増えてきて、毎日が発見の連続です。${memo ? '\n' + memo : ''}`,
      ],
      shuchu: [
        ({ memo }) => `今日は積み木に集中して取り組み、高く高く積み上げることに挑戦していました。倒れても何度もやり直す姿に、成長を感じました。${memo ? '\n' + memo : ''}`,
      ],
    },
    trouble: {
      tomodachi: [
        ({ memo }) => `お友達と砂場道具の取り合いになる場面がありましたが、保育士が間に入ると「どうぞ」と渡してくれました。お友達の気持ちを少しずつ考えられるようになってきています。${memo ? '\n' + memo : ''}`,
        ({ memo }) => `今日は思い通りにならず泣いてしまうことが2回ありました。気持ちを言葉にできず悔しかったようです。少しずつ「いや」「やりたい」と言葉で伝えられるよう、保育士もサポートしていきます。${memo ? '\n' + memo : ''}`,
      ],
    },
    seichou: {
      chosen: [
        ({ memo }) => `今日のおむつ替えのとき、「自分でやる!」と言って、ズボンを自分で脱ぐことができました。少しずつ「自分でやりたい」という気持ちが育ってきています。${memo ? '\n' + memo : ''}`,
      ],
    },
    shokuji: {
      genki: [
        ({ memo }) => `今日はモリモリ食べてくれました! お友達と並んで食べる楽しさも感じている様子で、笑顔で会話するように声を出していました。${memo ? '\n' + memo : ''}`,
      ],
    },
  },

  age3: {
    asobi: {
      tomodachi: [
        ({ memo }) => `今日はお友達とごっこ遊びを楽しみました。「お母さん役」を選び、お料理を作る真似をして、お友達に「どうぞ」と渡していました。役を演じる楽しさを味わっています。${memo ? '\n' + memo : ''}`,
      ],
      chosen: [
        ({ memo }) => `三輪車に挑戦し、最初はうまくペダルが回せませんでしたが、何度も諦めず練習する姿が見られました。最後には少し前に進むことができ、満面の笑みでしたよ。${memo ? '\n' + memo : ''}`,
      ],
    },
    seichou: {
      chosen: [
        ({ memo }) => `今日初めて自分でボタンを留めることができました! ゆっくりと指先を動かして、できたときの「やった!」という表情が忘れられません。${memo ? '\n' + memo : ''}`,
      ],
    },
    trouble: {
      tomodachi: [
        ({ memo }) => `今日はお友達と意見が合わずに口げんかになる場面がありました。保育士が話を聞くと、お互いの気持ちを伝え合うことができ、最後は仲直りして遊んでいました。${memo ? '\n' + memo : ''}`,
      ],
    },
  },

  age4: {
    asobi: {
      shuchu: [
        ({ memo }) => `今日は折り紙でツルを折ることに挑戦しました。途中で難しいところもありましたが、保育士の手元を見ながら最後まで集中して完成させました。${memo ? '\n' + memo : ''}`,
      ],
      tomodachi: [
        ({ memo }) => `今日は4人で鬼ごっこを楽しみました。ルールを話し合って決め、自分たちで遊びを進めることができていました。お友達との関係性が深まっています。${memo ? '\n' + memo : ''}`,
      ],
    },
    gyouji: {
      genki: [
        ({ memo }) => `運動会の練習でかけっこを頑張りました。今日は2位でしたが、「次は1位を目指す!」とやる気いっぱいでした。本番が楽しみですね。${memo ? '\n' + memo : ''}`,
        ({ memo }) => `今日のお遊戯の練習で、振り付けを最後まで覚えることができました。お友達と息を合わせて踊る姿がとても素敵でしたよ。${memo ? '\n' + memo : ''}`,
      ],
    },
    seichou: {
      chosen: [
        ({ memo }) => `今日は自分で給食の用意ができるようになりました! 配膳台までお盆を運ぶ姿が、お兄さん・お姉さんのようでした。${memo ? '\n' + memo : ''}`,
      ],
    },
  },

  age5: {
    asobi: {
      tomodachi: [
        ({ memo }) => `年下のお友達に優しく接する姿が見られました。お絵かきのとき、3歳児クラスのお友達に「こうやって描くんだよ」とそっと教えてあげていました。お兄さん・お姉さんとしての自覚が育っています。${memo ? '\n' + memo : ''}`,
      ],
      shuchu: [
        ({ memo }) => `今日はルールのある椅子取りゲームを楽しみました。負けても「次は頑張る!」と気持ちを切り替える姿に成長を感じました。${memo ? '\n' + memo : ''}`,
      ],
    },
    gyouji: {
      genki: [
        ({ memo }) => `生活発表会の練習で、自分の役を堂々と演じることができました。台詞も覚えて、お友達と協力する姿が立派でした。本番が楽しみです。${memo ? '\n' + memo : ''}`,
      ],
    },
    seichou: {
      chosen: [
        ({ memo }) => `今日は「ありがとう」「ごめんなさい」を自分から言える場面が増えてきました。年長児として、心の成長を感じる瞬間でした。${memo ? '\n' + memo : ''}`,
      ],
    },
  },
};

const UNIVERSAL_TEMPLATES: Record<Scene, TemplateVariant[]> = {
  shonichi: [
    ({ memo }) => `今日は入園初日、お母さん・お父さんと離れるときに少し涙が出ましたが、保育士に抱っこされるとすぐに泣き止みました。お部屋に慣れてくると、玩具に興味を示し、笑顔で遊ぶ場面もありました。${memo ? '\n' + memo : ''}`,
    ({ memo }) => `入園初日、新しいお友達や先生に少し戸惑う様子でしたが、お気に入りの絵本を見つけると安心したように見入っていました。これからゆっくり園生活に慣れていけたらと思います。${memo ? '\n' + memo : ''}`,
  ],
  yasumiake: [
    ({ memo }) => `お休み明けの登園、最初は少し甘えてくる様子でしたが、お友達の顔を見ると徐々に笑顔に。お休み中の楽しかったお話を保育士にもしてくれましたよ。${memo ? '\n' + memo : ''}`,
    ({ memo }) => `久しぶりの登園、朝は少し涙が出ましたが、お部屋に入ると好きな遊びを見つけて元気に過ごせました。${memo ? '\n' + memo : ''}`,
  ],
  birthday: [
    ({ memo }) => `お誕生日おめでとうございます! 今日はクラスのお友達みんなで「ハッピーバースデー」を歌ってお祝いしました。冠をかぶった姿がとても誇らしげで、素敵な笑顔がたくさん見られましたよ。素晴らしい1年になりますように。${memo ? '\n' + memo : ''}`,
    ({ memo }) => `本日はお誕生日のお祝いをしました。お友達からのプレゼントカードを大事そうに抱えていました。「大きくなったね」とお伝えすると、誇らしげに頷いていました。${memo ? '\n' + memo : ''}`,
  ],
  asobi:     [],
  shokuji:   [],
  gosui: [
    ({ memo }) => `今日のお昼寝はぐっすり眠ることができました。起きたあとは機嫌よく、午後の活動にも元気に取り組んでいました。${memo ? '\n' + memo : ''}`,
  ],
  seichou:   [],
  trouble:   [],
  taichou: [
    ({ memo }) => `今日は鼻水が少し出ていましたが、咳や熱はなく、元気に過ごせました。お家でもゆっくり休んで様子を見てください。${memo ? '\n' + memo : ''}`,
  ],
  gyouji: [
    ({ memo }) => `今日は行事の練習を楽しみました。みんなと一緒に取り組む様子が生き生きとしていて、本番がとても楽しみです。${memo ? '\n' + memo : ''}`,
  ],
};

export function getTemplates(age: Age, scene: Scene, yousu: Yousu | null): TemplateVariant[] {
  const ageBlock = TEMPLATES[age];
  const sceneBlock = ageBlock?.[scene];
  if (yousu) {
    const exact = sceneBlock?.[yousu];
    if (exact && exact.length > 0) return exact;
  }
  if (sceneBlock) {
    const anyYousu = Object.values(sceneBlock).flat().filter((v): v is TemplateVariant => !!v);
    if (anyYousu.length > 0) return anyYousu;
  }
  if (UNIVERSAL_TEMPLATES[scene]?.length > 0) return UNIVERSAL_TEMPLATES[scene];
  return [
    ({ memo }) => `今日も園で元気に過ごすことができました。${memo ? '\n' + memo : ''}保育士もお子さまの一日に寄り添えて嬉しく思います。`,
  ];
}

export interface NgWord {
  word: string;
  category: 'negative' | 'kimetsuke' | 'shukan' | 'meirei';
  reason: string;
  suggestion: string;
}

export const NG_WORDS: NgWord[] = [
  { word: 'できない',    category: 'negative',   reason: 'ネガティブ断定',     suggestion: 'これから挑戦していきます／少しずつ覚えています' },
  { word: 'ダメ',        category: 'negative',   reason: 'ネガティブ表現',     suggestion: '次は◯◯してみようね と前向きに' },
  { word: 'いつも',      category: 'kimetsuke',  reason: '決めつけ表現',       suggestion: '今日は◯◯でした と具体的に' },
  { word: '悪い子',      category: 'kimetsuke',  reason: '人格への決めつけ',   suggestion: '具体的な行動を客観的に記載' },
  { word: 'かわいそう',  category: 'shukan',     reason: '主観的評価',         suggestion: 'お子さまの様子を客観的に' },
  { word: 'かわいい',    category: 'shukan',     reason: '主観的評価',         suggestion: '具体的な行動・表情を記載' },
  { word: 'やっぱり',    category: 'shukan',     reason: '推測表現',           suggestion: '具体的な根拠を記載' },
  { word: 'してください', category: 'meirei',    reason: '保護者への命令調',   suggestion: 'お家でも◯◯していただけると嬉しいです' },
];

export function checkNgWords(text: string): NgWord[] {
  const hits: NgWord[] = [];
  for (const f of NG_WORDS) {
    if (text.includes(f.word)) hits.push(f);
  }
  return hits;
}
