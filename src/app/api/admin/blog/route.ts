import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { topic, category } = await request.json();

    // Image prompts optimized for <1MB file size
    const imagePrompts = [
      {
        position: 'IMAGE_HERO',
        prompt: `Hero image for blog about: ${topic}. 
        Modern Japanese office setting, professional businesspeople, clean minimal style.
        NO TEXT in image - text will be added separately.
        
        TECHNICAL SPECS FOR GEMINI:
        - Resolution: 1200x675 pixels (16:9 ratio)
        - File size: MUST be under 1MB
        - Format: JPEG with medium compression
        - Quality: 80-85%
        
        Style: Photorealistic, bright, professional, minimal details to keep file size small.`
      },
      {
        position: 'IMAGE_1',
        prompt: `Simple infographic showing workflow/process for: ${topic}.
        Clean icons and arrows, professional Japanese business style.
        Minimal or NO Japanese text (text added separately).
        
        TECHNICAL SPECS FOR GEMINI:
        - Resolution: 800x800 pixels (square)
        - File size: MUST be under 1MB
        - Format: JPEG, medium compression
        - Quality: 80%
        
        Style: Flat design, simple colors (white/blue), minimal elements.`
      },
      {
        position: 'IMAGE_2',
        prompt: `Step-by-step visual guide for: ${topic}.
        Icons with numbers (1,2,3), arrows showing flow.
        Minimal text, focus on visual communication.
        
        TECHNICAL SPECS FOR GEMINI:
        - Resolution: 800x600 pixels
        - File size: MUST be under 1MB
        - Format: JPEG, medium compression
        - Quality: 80%
        
        Style: Clean infographic, simple icons, limited color palette.`
      },
      {
        position: 'IMAGE_3',
        prompt: `Results/benefits visualization for: ${topic}.
        Before/after comparison OR success metrics display.
        Clean infographic style, professional colors.
        
        TECHNICAL SPECS FOR GEMINI:
        - Resolution: 800x600 pixels
        - File size: MUST be under 1MB
        - Format: JPEG, medium compression
        - Quality: 80%
        
        Style: Minimal design, few elements, simple graphics to keep file size small.`
      }
    ];

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `あなたは日本の中小企業で10年働いているビジネスパーソンです。
実際の業務経験をもとに、同僚に教えるような親しみやすいブログ記事を書いてください。

テーマ：${topic}
カテゴリー：${category}

🎯 必須要素（これがないとAI臭くなる）:

1. **個人的な経験・体験を含める:**
   - 「実際に試してみたところ」
   - 「以前、取引先に送る資料で困ったことがあって」
   - 「編集部で検証したところ」
   - 具体的な数字（「5MBのファイルが1.2MBに」）

2. **日本のビジネス文脈:**
   - 日本企業の例（「取引先」「社内規定」「稟議書」「契約書」）
   - 日本特有の課題（「メール添付の容量制限」「社内サーバーの容量」）
   - 日本のツール・サービスも紹介
   - 必要に応じて：電子帳簿保存法、インボイス制度など

3. **会話的な表現:**
   - 「〜ですよね」「〜かもしれません」
   - 「ちなみに」「実は」「要するに」
   - 「意外と知られていないのですが」
   - 「おすすめは〜です」「個人的には〜」

4. **視覚的な要素:**
   - 適度に絵文字使用: ✅ ⚠️ 💡 📝 🔍
   - 💡Tips: ちょっとした補足情報
   - ⚠️注意: 気をつけるべきポイント
   - ✅おすすめ: 実際に試して良かったもの

5. **構成のバリエーション:**
   - セクションの長さを変える（短いもの、長いものを混ぜる）
   - 時々、箇条書きでなく段落で説明
   - 補足コラムを入れる

6. **具体例と数字:**
   - 抽象的 ❌「ファイルサイズを削減できます」
   - 具体的 ✅「5MBの見積書PDFが1.2MBに（約76%削減）」
   - Before/After、メリット・デメリットを実例で

7. **タイトルを魅力的に:**
   - 教科書的 ❌「PDFファイルの圧縮方法について」
   - 引きつける ✅「PDFが重すぎてメールNG！今すぐできる圧縮テク5選」

🚫 避けること:
- 教科書的・マニュアル的な表現
- 完璧すぎる構成（全セクション同じ長さ）
- 海外の例だけ（日本の文脈を必ず入れる）
- 淡々とした事実の羅列
- 「〜について説明します」のような堅い表現

📝 出力形式（JSON）:
{
  "title": "キャッチーで実用的なタイトル（60文字以内）",
  "description": "150文字程度のメタディスクリプション（検索結果に表示）",
  "content": "マークダウン形式の本文
  
  - [IMAGE_HERO]は導入部の後
  - [IMAGE_1]は最初の重要ポイント後
  - [IMAGE_2]は中盤の実践的な部分
  - [IMAGE_3]はまとめの前
  
  構成例:
  # タイトル
  [IMAGE_HERO]
  
  導入（個人的な経験、よくある困りごと）
  
  ## ○○の原因・背景
  具体例を交えて説明
  
  [IMAGE_1]
  
  ## 💡 実践テクニック
  
  ### 方法1: ○○
  実際に試した結果を具体的に
  
  ✅ メリット: ...
  ⚠️ 注意点: ...
  
  [IMAGE_2]
  
  ### 方法2: ○○
  
  ちょっとした補足やコラム
  
  [IMAGE_3]
  
  ## まとめ
  重要ポイント3つ + CTAへの自然な誘導",
  
  "tags": ["実用的なタグ3-4個"],
  "keywords": ["SEO用キーワード4-5個"],
  "readTime": "○分（実際の文字数から計算）",
  "toolLink": "関連ツールへのリンク（/${category}/ツール名）"
}

記事の長さ: 2000-3000文字程度（読みやすさ重視）
トーン: 親しみやすく、でもプロフェッショナル`
      }]
    });

    const contentBlock = message.content.find((block: any) => block.type === 'text') as any;
    let responseText = contentBlock.text;

    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) responseText = jsonMatch[1];

    const blogData = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      blogData,
      imagePrompts
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
