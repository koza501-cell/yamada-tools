import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { revalidatePath } from 'next/cache';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      topic,
      category = 'PDF',
      style = 'professional',
      status = 'published',
      scheduledDate,
      uploadedImages = {}
    } = body;

    // 🎯 GENERATE FIXED IMAGE PROMPTS (always works!)
    const imagePrompts = [
      {
        position: 'IMAGE_HERO',
        prompt: `Create a professional hero image for a blog about: ${topic}. Style: Modern Japanese business, clean design, photorealistic`
      },
      {
        position: 'IMAGE_1',
        prompt: `Create an infographic or diagram illustrating key concepts of: ${topic}. Include Japanese text labels, clean layout, professional colors`
      },
      {
        position: 'IMAGE_2',
        prompt: `Create a detailed workflow or process visualization for: ${topic}. Show step-by-step progression, use icons and arrows`
      },
      {
        position: 'IMAGE_3',
        prompt: `Create a results-focused summary image for: ${topic}. Show benefits, statistics, or before/after comparison`
      }
    ];

    // Generate blog content
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `あなたはyamada-tools.jpのブログライターです。以下のトピックについて、SEOに最適化された日本語のブログ記事を作成してください。

トピック: ${topic}
カテゴリー: ${category}
スタイル: ${style}

【重要】画像配置について:
- 記事の冒頭に [IMAGE_HERO] を配置（ヒーロー画像）
- 記事の途中、自然な位置に [IMAGE_1], [IMAGE_2], [IMAGE_3] を配置
- 各画像の直前に、その画像で表現すべき内容を説明する文章を書く

記事の構成:
1. タイトル（SEOキーワードを含む、魅力的な見出し）
2. メタディスクリプション（150文字以内）
3. 本文（2000-3000文字、適切な見出し構造、具体例を含む）
4. 読了時間の目安

yamada-tools.jpで提供しているPDFツールへの自然なリンクも含めてください。
利用可能なツール: /pdf/compress, /pdf/merge, /pdf/split, /pdf/protect, /pdf/watermark, /pdf/sign, /pdf/ocr, /pdf/rotate, /pdf/delete-pages, /pdf/reorder, /pdf/page-numbers, /pdf/word-to-pdf, /pdf/excel-to-pdf, /pdf/ppt-to-pdf, /pdf/image-to-pdf, /pdf/pdf-to-word, /pdf/pdf-to-excel, /pdf/pdf-to-image

JSON形式で以下の構造で返してください:
{
  "title": "記事タイトル",
  "description": "メタディスクリプション",
  "content": "マークダウン形式の本文（[IMAGE_HERO], [IMAGE_1], [IMAGE_2], [IMAGE_3]のマーカーを含む）",
  "tags": ["タグ1", "タグ2", "タグ3"],
  "keywords": ["キーワード1", "キーワード2"],
  "readTime": "5分",
  "toolLink": "/pdf/compress"
}`
      }]
    });

    const contentBlock = message.content.find((block: any) => block.type === 'text') as any;
    if (!contentBlock || typeof contentBlock.text !== 'string') {
      throw new Error('No content generated');
    }

    let responseText = contentBlock.text;

    // Extract JSON from markdown code blocks
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
                     responseText.match(/```\n([\s\S]*?)\n```/);

    if (jsonMatch) {
      responseText = jsonMatch[1];
    }

    const blogData = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      content: blogData.content,
      imagePrompts,  // 🎯 Always returns prompts!
      blogData
    });

  } catch (error: any) {
    console.error('Blog API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug, updates } = body;

    const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');

    if (!fs.existsSync(blogsPath)) {
      return NextResponse.json({
        success: false,
        error: 'No blogs found'
      }, { status: 404 });
    }

    const fileContent = fs.readFileSync(blogsPath, 'utf-8');
    let blogs = JSON.parse(fileContent);

    const blogIndex = blogs.findIndex((b: any) => b.slug === slug);

    if (blogIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Blog not found'
      }, { status: 404 });
    }

    blogs[blogIndex] = { ...blogs[blogIndex], ...updates };
    fs.writeFileSync(blogsPath, JSON.stringify(blogs, null, 2));

    revalidatePath('/blog');
    revalidatePath('/');
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({ success: true, blog: blogs[blogIndex] });

  } catch (error: any) {
    console.error('Blog update error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Slug required'
      }, { status: 400 });
    }

    const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');

    if (!fs.existsSync(blogsPath)) {
      return NextResponse.json({
        success: false,
        error: 'No blogs found'
      }, { status: 404 });
    }

    const fileContent = fs.readFileSync(blogsPath, 'utf-8');
    let blogs = JSON.parse(fileContent);

    const filteredBlogs = blogs.filter((b: any) => b.slug !== slug);

    if (filteredBlogs.length === blogs.length) {
      return NextResponse.json({
        success: false,
        error: 'Blog not found'
      }, { status: 404 });
    }

    fs.writeFileSync(blogsPath, JSON.stringify(filteredBlogs, null, 2));

    revalidatePath('/blog');
    revalidatePath('/');

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Blog delete error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
