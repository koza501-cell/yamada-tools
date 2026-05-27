export type ToolValue = {
  slug: string;
  toolName: string;
  manualTimeMinutes: number;
  toolTimeSeconds: number;
  monetaryValueYen?: number;
  category: 'pdf' | 'image' | 'finance' | 'document' | 'business' | 'convert' | 'other';
  methodology: string;
};

// Conservative benchmarks used throughout:
//   Manual hourly rate: ¥3,000（事務作業の相場）
//   Software reference: Adobe Acrobat Pro ¥1,628/月、Microsoft 365 ¥1,280/月
//   Outsourcing reference: クラウドワークス平均単価ベース
//
// manual time = competent non-expert, software already open, starting from blank
// tool time   = realistic UI time: drag + configure + click + download
//
// For conversion tools (pdf-to-word, pdf-to-excel, pdf-to-ppt):
//   tool time includes ~30 sec verification/cleanup overhead — output quality
//   is good but rarely perfect. Saved time reflects net benefit after cleanup.
//
// lastUpdated: 2026-05-26 — 計算基準: 2026年5月時点

export const TOOL_VALUE_TABLE: ToolValue[] = [

  // ─── PDF ─────────────────────────────────────────────────────────────────

  {
    slug: 'text-input',
    toolName: 'PDFテキスト入力',
    manualTimeMinutes: 5,
    toolTimeSeconds: 60,
    category: 'pdf',
    methodology: 'Adobe AcrobatなどのPDF編集ソフトでテキストフィールドを追加・入力し保存するまでに約5分かかります。本ツールではPDFをドラッグするだけで60秒以内に完了します。',
  },
  {
    slug: 'stamp',
    toolName: 'PDF印鑑・スタンプ',
    manualTimeMinutes: 8,
    toolTimeSeconds: 45,
    category: 'pdf',
    methodology: 'PDF上に印鑑画像を貼り付けて保存するには、Adobe Acrobat ProまたはWordへの変換が必要で約8分かかります。本ツールではブラウザ内で45秒以内に処理できます。',
  },
  {
    slug: 'combini-print',
    toolName: 'コンビニ印刷用PDF',
    manualTimeMinutes: 10,
    toolTimeSeconds: 45,
    category: 'pdf',
    methodology: 'コンビニ各社の印刷仕様（サイズ・解像度・ファイル形式）に合わせてファイルを準備・変換するのに約10分かかります。本ツールでは設定済みテンプレートで45秒以内に完了します。',
  },
  {
    slug: 'envelope-print',
    toolName: '封筒印刷',
    manualTimeMinutes: 15,
    toolTimeSeconds: 120,
    monetaryValueYen: 300,
    category: 'pdf',
    methodology: '封筒サイズに合わせたWordテンプレートの設定・住所入力・印刷設定に約15分かかります。一括印刷の場合はさらに時間が増えます。外注では1バッチ200〜500円程度かかりますが、本試算では控えめに¥300としています。本ツールでは2分以内に印刷用PDFを生成できます。',
  },
  {
    slug: 'word-to-pdf',
    toolName: 'Word→PDF変換',
    manualTimeMinutes: 3,
    toolTimeSeconds: 30,
    category: 'pdf',
    methodology: 'Microsoft Word（月額¥1,280〜）でファイルを開き「名前を付けて保存→PDF」を選択するのに約3分かかります。Wordがない場合はさらに時間がかかります。本ツールは登録不要で30秒以内に変換できます。',
  },
  {
    slug: 'pdf-to-word',
    toolName: 'PDF→Word変換',
    manualTimeMinutes: 7,
    toolTimeSeconds: 60,
    category: 'pdf',
    methodology: 'テキストの手動コピーペーストで約7分かかります。本ツールでは変換30秒＋出力確認30秒の計60秒で完了します。変換品質は良好ですが完璧ではないため、確認時間を含めた保守的な節約時間（約6分）を表示しています。',
  },
  {
    slug: 'excel-to-pdf',
    toolName: 'Excel→PDF変換',
    manualTimeMinutes: 3,
    toolTimeSeconds: 30,
    category: 'pdf',
    methodology: 'Microsoft Excel（月額¥1,280〜）でファイルを開き印刷範囲を設定してPDF保存するのに約3分かかります。本ツールでは30秒以内に変換できます。',
  },
  {
    slug: 'pdf-to-excel',
    toolName: 'PDF→Excel変換',
    manualTimeMinutes: 16,
    toolTimeSeconds: 90,
    category: 'pdf',
    methodology: 'PDFの表データをExcelに手動で転記する場合、1ページ分で約16分かかります。本ツールでは変換30秒＋数値検証60秒の計90秒で完了します。転記ミスの確認時間を含めた保守的な節約時間（約15分）を表示しています。',
  },
  {
    slug: 'image-to-pdf',
    toolName: '画像→PDF変換',
    manualTimeMinutes: 5,
    toolTimeSeconds: 20,
    category: 'pdf',
    methodology: '画像をWordやGoogleドキュメントに貼り付けてPDF保存する方法が一般的で約5分かかります。本ツールでは20秒以内に変換できます。',
  },
  {
    slug: 'pdf-to-image',
    toolName: 'PDF→画像変換',
    manualTimeMinutes: 5,
    toolTimeSeconds: 20,
    category: 'pdf',
    methodology: 'PDFをスクリーンショットして切り取り保存する方法で約5分かかります。Adobe Acrobatでの書き出しには有料ライセンスが必要です。本ツールでは20秒以内に変換できます。',
  },
  {
    slug: 'ppt-to-pdf',
    toolName: 'PowerPoint→PDF変換',
    manualTimeMinutes: 3,
    toolTimeSeconds: 25,
    category: 'pdf',
    methodology: 'PowerPoint（月額¥1,280〜）での「エクスポート→PDF」操作に約3分かかります。本ツールでは25秒以内に変換できます。',
  },
  {
    slug: 'pdf-to-ppt',
    toolName: 'PDF→PowerPoint変換',
    manualTimeMinutes: 16,
    toolTimeSeconds: 90,
    category: 'pdf',
    methodology: 'PDFをPowerPointに手動で再作成する場合、10枚で約16分かかります。本ツールでは変換30秒＋レイアウト確認60秒の計90秒で完了します。変換品質の確認時間を含めた保守的な節約時間（約15分）を表示しています。',
  },

  // ─── IMAGE ───────────────────────────────────────────────────────────────

  {
    slug: 'blur',
    toolName: '画像ぼかし',
    manualTimeMinutes: 3,
    toolTimeSeconds: 10,
    category: 'image',
    methodology: 'GIMPやPhotoshopでぼかしフィルターを適用・書き出しするのに約3分かかります。本ツールでは画像をドラッグして10秒以内に完了します。',
  },
  {
    slug: 'sepia',
    toolName: 'セピア加工',
    manualTimeMinutes: 3,
    toolTimeSeconds: 10,
    category: 'image',
    methodology: '画像編集ソフトでセピアトーンを適用・書き出しするのに約3分かかります。本ツールでは10秒以内に完了します。',
  },
  {
    slug: 'crop',
    toolName: '画像切り抜き',
    manualTimeMinutes: 2,
    toolTimeSeconds: 15,
    category: 'image',
    methodology: '画像編集ソフトでトリミング範囲を指定して保存するのに約2分かかります。本ツールでは15秒以内に完了します。',
  },
  {
    slug: 'brightness',
    toolName: '明度・コントラスト調整',
    manualTimeMinutes: 3,
    toolTimeSeconds: 15,
    category: 'image',
    methodology: '画像編集ソフトで明度・コントラストを調整して書き出しするのに約3分かかります。本ツールでは15秒以内に完了します。',
  },
  {
    slug: 'flip',
    toolName: '画像反転・鏡像',
    manualTimeMinutes: 2,
    toolTimeSeconds: 10,
    category: 'image',
    methodology: '画像編集ソフトで左右・上下反転して保存するのに約2分かかります。本ツールでは10秒以内に完了します。',
  },
  {
    slug: 'monochrome',
    toolName: 'モノクロ変換',
    manualTimeMinutes: 3,
    toolTimeSeconds: 10,
    category: 'image',
    methodology: '画像編集ソフトでグレースケール変換・書き出しするのに約3分かかります。本ツールでは10秒以内に完了します。',
  },
  {
    slug: 'mosaic',
    toolName: 'モザイク加工',
    manualTimeMinutes: 5,
    toolTimeSeconds: 15,
    category: 'image',
    methodology: 'GIMPでピクセル化フィルターを適用して目的の領域のみに適用するのに約5分かかります。本ツールでは15秒以内に完了します。',
  },
  {
    slug: 'text-overlay',
    toolName: '画像テキスト挿入',
    manualTimeMinutes: 8,
    toolTimeSeconds: 30,
    category: 'image',
    methodology: 'Canvaや画像編集ソフトでテキストレイヤーを追加・フォント設定・書き出しするのに約8分かかります。本ツールでは30秒以内に完了します。',
  },
  {
    slug: 'image-overlay',
    toolName: '画像合成',
    manualTimeMinutes: 8,
    toolTimeSeconds: 45,
    category: 'image',
    methodology: 'Photoshopなどで複数レイヤーを合成・不透明度調整・書き出しするのに約8分かかります。本ツールでは45秒以内に完了します。',
  },
  {
    slug: 'noise-reduction',
    toolName: 'ノイズ除去',
    manualTimeMinutes: 5,
    toolTimeSeconds: 20,
    category: 'image',
    methodology: 'GIMPのノイズ除去フィルターや専用ソフトで処理・書き出しするのに約5分かかります。本ツールでは20秒以内に完了します。',
  },
  {
    slug: 'banner-maker',
    toolName: 'バナーメーカー',
    manualTimeMinutes: 15,
    toolTimeSeconds: 90,
    category: 'image',
    methodology: 'Canvaやデザインソフトでバナーをゼロから作成するのに最低15分かかります。本ツールのテンプレートを使えば90秒以内に完了します。',
  },
  {
    slug: 'concentration-lines',
    toolName: '集中線',
    manualTimeMinutes: 15,
    toolTimeSeconds: 30,
    category: 'image',
    methodology: 'Photoshopのフィルター機能やIllustratorで集中線エフェクトを手動で作成するのに約15分かかります。本ツールでは30秒以内に完了します。',
  },
  {
    slug: 'decorative-frames',
    toolName: '装飾フレーム',
    manualTimeMinutes: 10,
    toolTimeSeconds: 30,
    category: 'image',
    methodology: 'Canvaや画像編集ソフトでフレームを検索・合成・書き出しするのに約10分かかります。本ツールでは30秒以内に完了します。',
  },
  {
    slug: 'grid-split',
    toolName: '画像グリッド分割',
    manualTimeMinutes: 10,
    toolTimeSeconds: 30,
    category: 'image',
    methodology: 'Photoshopで画像を格子状にトリミングして各ピースを個別に保存するのに約10分かかります。本ツールでは30秒以内に完了します。',
  },
  {
    slug: 'qr-code',
    toolName: 'QRコード生成',
    manualTimeMinutes: 5,
    toolTimeSeconds: 20,
    category: 'image',
    methodology: 'QRコード生成サイトを探して設定・ダウンロードするのに約5分かかります。本ツールでは20秒以内に生成できます。',
  },
  {
    slug: 'resize',
    toolName: '画像リサイズ',
    manualTimeMinutes: 3,
    toolTimeSeconds: 15,
    category: 'image',
    methodology: '画像編集ソフトで解像度・サイズを指定して書き出しするのに約3分かかります。本ツールでは15秒以内に完了します。',
  },
  {
    slug: 'rotate',
    toolName: '画像回転',
    manualTimeMinutes: 2,
    toolTimeSeconds: 10,
    category: 'image',
    methodology: '画像編集ソフトで角度を指定して回転・保存するのに約2分かかります。本ツールでは10秒以内に完了します。',
  },
  {
    slug: 'format-convert',
    toolName: '画像フォーマット変換',
    manualTimeMinutes: 5,
    toolTimeSeconds: 15,
    category: 'image',
    methodology: '画像編集ソフトで「形式を指定して保存」するか、オンラインコンバーターを探して変換するのに約5分かかります。本ツールでは15秒以内に完了します。',
  },
  {
    slug: 'compress',
    toolName: '画像圧縮',
    manualTimeMinutes: 5,
    toolTimeSeconds: 15,
    category: 'image',
    methodology: 'TinyPNGなどのサービスを探してアップロード・ダウンロードするのに約5分かかります。本ツールでは15秒以内に完了します。',
  },
  {
    slug: 'gif-maker',
    toolName: 'GIFアニメーション作成',
    manualTimeMinutes: 20,
    toolTimeSeconds: 90,
    category: 'image',
    methodology: 'GIMPのアニメーション機能や専用ツールで複数フレームを設定してGIF出力するのに約20分かかります。本ツールでは90秒以内に完了します。',
  },
  {
    slug: 'dpi-checker',
    toolName: 'DPIチェッカー',
    manualTimeMinutes: 3,
    toolTimeSeconds: 10,
    category: 'image',
    methodology: 'ファイルプロパティを確認しDPIを計算するのに約3分かかります。本ツールでは画像をドラッグするだけで10秒以内に確認できます。',
  },

  // ─── FINANCE ─────────────────────────────────────────────────────────────

  {
    slug: 'fx-calculator',
    toolName: 'FX計算機',
    manualTimeMinutes: 10,
    toolTimeSeconds: 60,
    category: 'finance',
    methodology: '為替レートを調べてExcelで計算・記録するのに約10分かかります。本ツールでは最新レートを取得しながら1分以内に計算できます。',
  },
  {
    slug: 'jutaku-loan',
    toolName: '住宅ローン計算機',
    manualTimeMinutes: 20,
    toolTimeSeconds: 90,
    category: 'finance',
    methodology: 'Excelで元利均等返済の計算式を組んで返済スケジュール表を作成するのに約20分かかります。本ツールでは数値入力だけで90秒以内に完了します。',
  },
  {
    slug: 'nisa-simulator',
    toolName: 'NISAシミュレーター',
    manualTimeMinutes: 20,
    toolTimeSeconds: 90,
    category: 'finance',
    methodology: 'Excelで複利運用のシミュレーション式を組むのに約20分かかります。本ツールでは入力90秒でグラフまで生成できます。',
  },
  {
    slug: 'ideco-nisa-comparison',
    toolName: 'iDeCo・NISA比較',
    manualTimeMinutes: 30,
    toolTimeSeconds: 120,
    category: 'finance',
    methodology: 'iDeCoとNISAの税制・運用益を正確に比較するためのExcel計算表を作成するのに約30分かかります。本ツールでは2分以内に比較結果を出力できます。',
  },
  {
    slug: 'retirement-simulator',
    toolName: '老後シミュレーター',
    manualTimeMinutes: 30,
    toolTimeSeconds: 120,
    category: 'finance',
    methodology: '年金・資産・インフレを考慮した老後資金シミュレーションをExcelで組むのに約30分かかります。本ツールでは2分以内に結果を確認できます。',
  },

  // ─── DOCUMENT ────────────────────────────────────────────────────────────

  {
    slug: 'invoice',
    toolName: '請求書作成',
    manualTimeMinutes: 15,
    toolTimeSeconds: 180,
    category: 'document',
    methodology: 'Wordテンプレートで請求書を作成する場合、フォーマット設定・項目入力・計算確認で約15分かかります。本ツールでは入力3分で自動計算・PDF化まで完了します。',
  },
  {
    slug: 'receipt',
    toolName: '領収書作成',
    manualTimeMinutes: 8,
    toolTimeSeconds: 90,
    category: 'document',
    methodology: 'Wordで領収書を作成・フォーマットするのに約8分かかります。本ツールでは90秒以内に作成できます。',
  },
  {
    slug: 'delivery-slip',
    toolName: '納品書作成',
    manualTimeMinutes: 10,
    toolTimeSeconds: 90,
    category: 'document',
    methodology: 'Wordテンプレートで納品書を作成するのに約10分かかります。本ツールでは90秒以内に完了します。',
  },
  {
    slug: 'quotation',
    toolName: '見積書作成',
    manualTimeMinutes: 15,
    toolTimeSeconds: 180,
    category: 'document',
    methodology: 'Wordまたは会計ソフトで見積書を作成するのに約15分かかります。本ツールでは入力3分で完了します。',
  },
  {
    slug: 'kyuyo-meisai',
    toolName: '給与明細作成',
    manualTimeMinutes: 15,
    toolTimeSeconds: 240,
    category: 'document',
    methodology: 'Excelで控除計算・社会保険料計算を含む給与明細を作成するのに約15分かかります。本ツールでは入力4分で計算済み明細を出力できます。',
  },
  {
    slug: 'business-card',
    toolName: '名刺デザイン',
    manualTimeMinutes: 20,
    toolTimeSeconds: 180,
    category: 'document',
    methodology: 'WordやCanvaで名刺レイアウトを調整・印刷設定するのに約20分かかります。本ツールでは3分以内でデザイン完了します。',
  },
  {
    slug: 'cover-letter',
    toolName: '送付状作成',
    manualTimeMinutes: 8,
    toolTimeSeconds: 60,
    category: 'document',
    methodology: 'ビジネス送付状をWordで作成するのに約8分かかります。本ツールでは1分以内に完了します。',
  },
  {
    slug: 'resume',
    toolName: '履歴書作成',
    manualTimeMinutes: 25,
    toolTimeSeconds: 600,
    category: 'document',
    methodology: 'JIS規格の履歴書テンプレートに全項目を入力・フォーマット調整するのに約25分かかります。本ツールでは入力10分で完成します。履歴書作成の大半は内容を考える時間のため、本ツールの節約時間はフォーマット作業分（約15分）を保守的に試算しています。',
  },
  {
    slug: 'fax-cover',
    toolName: 'FAX送付状作成',
    manualTimeMinutes: 5,
    toolTimeSeconds: 60,
    category: 'document',
    methodology: 'FAX送付状テンプレートを探して入力・印刷するのに約5分かかります。本ツールでは1分以内に完了します。',
  },
  {
    slug: 'business-email',
    toolName: 'ビジネスメール作成',
    manualTimeMinutes: 8,
    toolTimeSeconds: 60,
    category: 'document',
    methodology: 'ビジネスメールの定型文・敬語表現を考えながら1通書くのに約8分かかります。本ツールのテンプレートを使えば1分以内に下書き完成します。',
  },
  {
    slug: 'vertical-text',
    toolName: '縦書き・原稿用紙',
    manualTimeMinutes: 15,
    toolTimeSeconds: 120,
    category: 'document',
    methodology: 'Wordで縦書き設定・原稿用紙フォーマットを適用するのに約15分かかります（設定が複雑）。本ツールでは2分以内に完了します。',
  },
  {
    slug: 'hanko',
    toolName: '電子印鑑作成',
    manualTimeMinutes: 10,
    toolTimeSeconds: 30,
    category: 'document',
    methodology: '電子印鑑をPhotoshopや専用サービスで作成するのに約10分かかります。本ツールでは30秒以内に作成できます。',
  },
  // Souzoku: borderline legal tools — modest values, per policy
  // Note for methodology page: the alternative (judicial scrivener / 司法書士) costs
  // ¥50,000–¥100,000, which contextualises the value of the tool — but that figure
  // does NOT belong in the time-saved number as users still review the output carefully.
  {
    slug: 'souzoku-shinseisho',
    toolName: '相続登記申請書作成',
    manualTimeMinutes: 40,
    toolTimeSeconds: 600,
    category: 'document',
    methodology: '法務局の書式と記載要領をもとに相続登記申請書を自分で作成するのに約40分かかります。本ツールでは入力10分でフォームが完成します。ただし法的書類のため出力内容を必ず確認してください（申請手続きは別途必要です）。節約時間は出力確認を含む保守的な試算（約30分）です。',
  },
  {
    slug: 'souzoku-case',
    toolName: '相続登記ケース管理',
    manualTimeMinutes: 30,
    toolTimeSeconds: 120,
    category: 'document',
    methodology: '相続に必要な書類リストを整理・管理するのに約30分かかります。本ツールでは2分以内に必要書類を確認できます。',
  },

  // ─── BUSINESS ────────────────────────────────────────────────────────────

  {
    slug: 'houjin-bangou-lookup',
    toolName: '法人番号検索',
    manualTimeMinutes: 3,
    toolTimeSeconds: 5,
    category: 'business',
    methodology: '国税庁の法人番号公表サイトで1社ずつ検索するのに約3分かかります。本ツールでは名前・住所から5秒以内に検索できます。',
  },
  {
    slug: 'houjin-cross-verify',
    toolName: '法人番号クロス検証',
    manualTimeMinutes: 10,
    toolTimeSeconds: 30,
    category: 'business',
    methodology: '複数の法人情報を手動でクロスチェックするのに約10分かかります。本ツールでは30秒以内に一括検証できます。',
  },
  {
    slug: 'invoice-bulk-checker',
    toolName: 'インボイス番号一括チェック',
    manualTimeMinutes: 10,
    toolTimeSeconds: 30,
    category: 'business',
    methodology: '複数のインボイス登録番号を国税庁サイトで1件ずつ確認するのに約10分かかります（5件の場合）。本ツールでは30秒以内に一括確認できます。',
  },
  {
    slug: 't-number',
    toolName: 'T番号チェッカー',
    manualTimeMinutes: 3,
    toolTimeSeconds: 20,
    category: 'business',
    methodology: '適格請求書発行事業者番号を国税庁サイトで確認するのに約3分かかります。本ツールでは20秒以内に確認できます。',
  },

  // ─── CONVERT ─────────────────────────────────────────────────────────────

  {
    slug: 'bank-format',
    toolName: '全銀フォーマット変換',
    manualTimeMinutes: 30,
    toolTimeSeconds: 30,
    monetaryValueYen: 300,
    category: 'convert',
    methodology: '全銀フォーマットを仕様書をもとに手動作成する場合30分以上かかります。外注では1ファイル500〜1,000円程度ですが、本試算では控えめに¥300としています。本ツールでは30秒以内に変換できます。',
  },
  {
    slug: 'postcode',
    toolName: '郵便番号検索',
    manualTimeMinutes: 2,
    toolTimeSeconds: 5,
    category: 'convert',
    methodology: '日本郵便の郵便番号検索サイトにアクセスして住所を確認するのに約2分かかります。本ツールでは5秒以内に検索できます。',
  },
  {
    slug: 'furigana',
    toolName: 'フリガナ変換',
    manualTimeMinutes: 3,
    toolTimeSeconds: 5,
    category: 'convert',
    methodology: '名前や住所のフリガナを手動で入力・確認するのに約3分かかります。本ツールでは5秒以内に変換できます。',
  },
  {
    slug: 'wareki-seireki',
    toolName: '和暦西暦変換',
    manualTimeMinutes: 0,
    toolTimeSeconds: 0,
    category: 'convert',
    methodology: '利用回数としてカウントされますが、節約時間・金額には計上していません（1分未満の差のため信頼性を優先し省略）。',
  },
  {
    slug: 'unit',
    toolName: '単位変換',
    manualTimeMinutes: 2,
    toolTimeSeconds: 5,
    category: 'convert',
    methodology: '単位変換の係数を調べて計算するのに約2分かかります。本ツールでは5秒以内に変換できます。',
  },
  {
    slug: 'base64',
    toolName: 'Base64エンコード',
    manualTimeMinutes: 3,
    toolTimeSeconds: 10,
    category: 'convert',
    methodology: 'Base64エンコーダーをオンラインで探してアクセス・変換するのに約3分かかります。本ツールでは10秒以内に変換できます。',
  },
  {
    slug: 'date-converter',
    toolName: '日付変換',
    manualTimeMinutes: 0,
    toolTimeSeconds: 0,
    category: 'convert',
    methodology: '利用回数としてカウントされますが、節約時間・金額には計上していません（1分未満の差のため信頼性を優先し省略）。',
  },
  {
    slug: 'zenkaku-hankaku',
    toolName: '全角半角変換',
    manualTimeMinutes: 3,
    toolTimeSeconds: 5,
    category: 'convert',
    methodology: 'Wordの検索・置換で全角半角を一括変換するのに約3分かかります。本ツールでは5秒以内に変換できます。',
  },
  {
    slug: 'phone-formatter',
    toolName: '電話番号フォーマット',
    manualTimeMinutes: 2,
    toolTimeSeconds: 5,
    category: 'convert',
    methodology: '電話番号のハイフン区切りを手動で整形するのに約2分かかります。本ツールでは5秒以内に変換できます。',
  },
  {
    slug: 'url-encode',
    toolName: 'URLエンコード',
    manualTimeMinutes: 2,
    toolTimeSeconds: 10,
    category: 'convert',
    methodology: 'URLエンコードツールをオンラインで探してアクセス・変換するのに約2分かかります。本ツールでは10秒以内に変換できます。',
  },

  // ─── OTHER / GENERATOR ───────────────────────────────────────────────────

  {
    slug: 'text-diff',
    toolName: 'テキスト差分',
    manualTimeMinutes: 5,
    toolTimeSeconds: 10,
    category: 'other',
    methodology: '2つのテキストを目視で比較して差分を探すのに約5分かかります（文章量に依存）。本ツールでは10秒以内に差分を表示できます。',
  },
  {
    slug: 'password-zip',
    toolName: 'パスワードZIP作成',
    manualTimeMinutes: 5,
    toolTimeSeconds: 30,
    category: 'other',
    methodology: 'OSの標準機能でパスワード付きZIPを作成する手順を確認・実行するのに約5分かかります。本ツールでは30秒以内に完了します。',
  },
  {
    slug: 'nenmatsu-calc',
    toolName: '年末調整計算',
    manualTimeMinutes: 30,
    toolTimeSeconds: 300,
    category: 'other',
    methodology: '国税庁の計算表をもとに各種控除額・所得税額をExcelで手計算するのに約30分かかります（計算式のセットアップ込み）。本ツールでは入力5分で自動計算できます。比較対象は「Excelで一から計算する場合」であり、何もしない場合との比較ではありません。',
  },
  {
    slug: 'character-count',
    toolName: '文字数カウント',
    manualTimeMinutes: 2,
    toolTimeSeconds: 5,
    category: 'other',
    methodology: 'Wordに貼り付けて文字数を確認するのに約2分かかります。本ツールでは5秒以内に文字数・文字種別を確認できます。',
  },
  // Alias used in some tool files
  {
    slug: 'char-count',
    toolName: '文字数カウント',
    manualTimeMinutes: 2,
    toolTimeSeconds: 5,
    category: 'other',
    methodology: 'Wordに貼り付けて文字数を確認するのに約2分かかります。本ツールでは5秒以内に文字数・文字種別を確認できます。',
  },
  {
    slug: 'lorem-ipsum',
    toolName: 'ダミーテキスト生成',
    manualTimeMinutes: 2,
    toolTimeSeconds: 5,
    category: 'other',
    methodology: 'Lorem Ipsumサイトを検索してアクセス・コピーするのに約2分かかります。本ツールでは5秒以内に生成できます。',
  },
  {
    slug: 'text-case',
    toolName: 'テキストケース変換',
    manualTimeMinutes: 2,
    toolTimeSeconds: 5,
    category: 'other',
    methodology: 'ExcelのUPPER/LOWER関数またはプログラムで変換するのに約2分かかります。本ツールでは5秒以内に変換できます。',
  },
  {
    slug: 'json-format',
    toolName: 'JSONフォーマット',
    manualTimeMinutes: 3,
    toolTimeSeconds: 5,
    category: 'other',
    methodology: 'JSONフォーマッターをオンラインで探してアクセス・整形するのに約3分かかります。本ツールでは5秒以内に整形できます。',
  },
  {
    slug: 'hash',
    toolName: 'ハッシュ生成',
    manualTimeMinutes: 3,
    toolTimeSeconds: 10,
    category: 'other',
    methodology: 'オンラインのハッシュジェネレーターを探してアクセス・生成するのに約3分かかります。本ツールでは10秒以内に生成できます。',
  },
  {
    slug: 'password',
    toolName: 'パスワード生成',
    manualTimeMinutes: 2,
    toolTimeSeconds: 5,
    category: 'other',
    methodology: 'ランダムなパスワードを考案・記録するのに約2分かかります。本ツールでは5秒以内に安全なパスワードを生成できます。',
  },
  {
    slug: 'password-gen',
    toolName: 'パスワード生成',
    manualTimeMinutes: 2,
    toolTimeSeconds: 5,
    category: 'other',
    methodology: 'ランダムなパスワードを考案・記録するのに約2分かかります。本ツールでは5秒以内に安全なパスワードを生成できます。',
  },
  {
    slug: 'qr-reader',
    toolName: 'QRコード読み取り',
    manualTimeMinutes: 1,
    toolTimeSeconds: 10,
    category: 'other',
    methodology: 'スマートフォンのカメラアプリを起動してQRコードを読み取るのに約1分かかります。本ツールではPC上で10秒以内に読み取れます。',
  },
  {
    slug: 'random-picker',
    toolName: 'ランダム抽選',
    manualTimeMinutes: 5,
    toolTimeSeconds: 30,
    category: 'other',
    methodology: 'Excelでランダム関数を使った抽選シートを作成するのに約5分かかります。本ツールでは30秒以内に公平な抽選ができます。',
  },
];

// Lookup helper — O(1) after first call
const _cache = new Map<string, ToolValue>();
export function getToolValue(slug: string): ToolValue | undefined {
  if (_cache.size === 0) {
    TOOL_VALUE_TABLE.forEach(t => _cache.set(t.slug, t));
  }
  return _cache.get(slug);
}

// Time saved in whole minutes for one tool use
export function computeTimeSavedMinutes(slug: string): number {
  const tv = getToolValue(slug);
  if (!tv) return 1; // fallback: 1 min for unknown slugs
  const savedSec = tv.manualTimeMinutes * 60 - tv.toolTimeSeconds;
  return Math.max(0, Math.round(savedSec / 60));
}

// Monetary value in yen for one tool use
export function computeMoneyYen(slug: string): number {
  return getToolValue(slug)?.monetaryValueYen ?? 0;
}
