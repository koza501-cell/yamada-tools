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
- 合計4枚の画像（HERO + 3枚のサポート画像）を使用

===IMAGE_PROMPTS===
IMAGE_HERO: Create a professional Japanese business scene showing [describe the hero image concept based on the topic]
IMAGE_1: Create an infographic or diagram illustrating [describe supporting visual 1]
IMAGE_2: Create a detailed visualization showing [describe supporting visual 2]
IMAGE_3: Create a summary or result-focused image depicting [describe supporting visual 3]
===END===

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
  "content": "マークダウン形式の本文（画像マーカー含む）",
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

    // Extract image prompts from content
    const imagePrompts: { position: string; prompt: string }[] = [];
    const promptSection = blogData.content?.match(/===IMAGE_PROMPTS===([\s\S]*?)===END===/);
    
    if (promptSection && promptSection[1]) {
      const lines = promptSection[1].trim().split('\n');
      lines.forEach((line: string) => {
        const match = line.match(/(IMAGE_\w+):\s*(.+)/);
        if (match) {
          imagePrompts.push({
            position: match[1],
            prompt: match[2].trim()
          });
        }
      });
      
      // Remove prompt section from content
      blogData.content = blogData.content.replace(/===IMAGE_PROMPTS===[\s\S]*?===END===\n*/, '');
    }

    // Generate slug
    const slug = topic
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);

    // Replace image markers with uploaded images
    let rawContent = blogData.content || '';
    Object.entries(uploadedImages).forEach(([position, url]) => {
      const marker = `[${position}]`;
      const imageMarkdown = `\n\n![${position}](${url})\n\n`;
      rawContent = rawContent.replace(marker, imageMarkdown);
    });

    const blog = {
      title: blogData.title,
      slug: `${slug}-${Date.now().toString().slice(-6)}`,
      description: blogData.description,
      category,
      tags: blogData.tags || [],
      keywords: blogData.keywords || [],
      content: rawContent,
      readTime: blogData.readTime || '5分',
      publishDate: status === 'scheduled' && scheduledDate ? scheduledDate : new Date().toISOString().split('T')[0],
      author: 'Yamada Tools編集部',
      featuredImage: uploadedImages.IMAGE_HERO || '',
      status,
      toolLink: blogData.toolLink || '/pdf/compress'
    };

    // Always save to JSON (including drafts)
    const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');
    let existingBlogs = [];

    if (fs.existsSync(blogsPath)) {
      const fileContent = fs.readFileSync(blogsPath, 'utf-8');
      existingBlogs = JSON.parse(fileContent);
    }

    existingBlogs.push(blog);
    fs.writeFileSync(blogsPath, JSON.stringify(existingBlogs, null, 2));

    // Revalidate paths
    revalidatePath('/blog');
    revalidatePath('/');
    revalidatePath(`/blog/${blog.slug}`);

    return NextResponse.json({
      success: true,
      blog,
      imagePrompts
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
