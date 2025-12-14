#!/bin/bash

echo "🏗️ BUILDING MODERN BLOG SYSTEM - COMPLETE SOLUTION"

# 1. Fix image upload API (save to correct location)
cat > src/app/api/upload/route.ts << 'EOFUPLOAD'
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/blog-images/
    const uploadsDir = path.join(process.cwd(), 'public/blog-images');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `blog-${Date.now()}.${file.name.split('.').pop()}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    console.log('Image saved:', filename);

    return NextResponse.json({
      success: true,
      url: `/blog-images/${filename}`
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
EOFUPLOAD

# 2. Fix blog generation API (return proper data)
cat > src/app/api/admin/blog/route.ts << 'EOFGEN'
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { topic, category } = await request.json();

    // Generate fixed image prompts
    const imagePrompts = [
      {
        position: 'IMAGE_HERO',
        prompt: `Professional hero image for: ${topic}. Modern Japanese business style, clean, photorealistic`
      },
      {
        position: 'IMAGE_1',
        prompt: `Infographic illustrating: ${topic}. Japanese text labels, professional colors`
      },
      {
        position: 'IMAGE_2',
        prompt: `Workflow visualization for: ${topic}. Step-by-step with icons and arrows`
      },
      {
        position: 'IMAGE_3',
        prompt: `Results summary for: ${topic}. Show benefits and statistics`
      }
    ];

    // Generate blog content
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `日本語で${category}カテゴリーの「${topic}」についてのブログ記事を書いてください。

記事には[IMAGE_HERO], [IMAGE_1], [IMAGE_2], [IMAGE_3]のマーカーを適切な位置に配置してください。

JSON形式で返してください:
{
  "title": "記事タイトル",
  "description": "150文字のメタディスクリプション",
  "content": "マークダウン形式の本文（画像マーカー含む）",
  "tags": ["タグ1", "タグ2", "タグ3"],
  "keywords": ["キーワード1", "キーワード2"],
  "readTime": "5分",
  "toolLink": "/pdf/compress"
}`
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
EOFGEN

# 3. Fix publish API (save with images)
cat > src/app/api/admin/blog/publish/route.ts << 'EOFPUB'
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { topic, category, blogData, images } = await request.json();

    console.log('Publishing blog:', { topic, category, hasImages: !!images });

    if (!topic || !blogData) {
      return NextResponse.json({
        success: false,
        error: 'Topic and blogData required'
      }, { status: 400 });
    }

    const slug = topic
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60) + '-' + Date.now().toString().slice(-6);

    // Replace image markers with actual images
    let finalContent = blogData.content || '';
    if (images) {
      Object.entries(images).forEach(([position, url]) => {
        finalContent = finalContent.replace(
          new RegExp(`\\[${position}\\]`, 'g'),
          `\n\n![${position}](${url})\n\n`
        );
      });
    }

    const blog = {
      title: blogData.title || topic,
      slug,
      description: blogData.description || '',
      category: category || 'PDF',
      tags: blogData.tags || [],
      keywords: blogData.keywords || [],
      content: finalContent,
      readTime: blogData.readTime || '5分',
      publishDate: new Date().toISOString().split('T')[0],
      author: 'Yamada Tools編集部',
      featuredImage: images?.IMAGE_HERO || '',
      images: images || {},
      status: 'published',
      toolLink: blogData.toolLink || '/pdf/compress'
    };

    console.log('Blog object:', JSON.stringify(blog, null, 2));

    const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');
    let existingBlogs = [];

    if (fs.existsSync(blogsPath)) {
      const fileContent = fs.readFileSync(blogsPath, 'utf-8');
      existingBlogs = JSON.parse(fileContent);
    }

    existingBlogs.push(blog);
    fs.writeFileSync(blogsPath, JSON.stringify(existingBlogs, null, 2));

    console.log('Blog saved successfully!');

    revalidatePath('/blog');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'ブログを公開しました！',
      blog
    });

  } catch (error: any) {
    console.error('Publish error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}
EOFPUB

echo "✅ APIs created!"
echo "Building..."
npm run build && pm2 restart yamada-staging && pm2 save
