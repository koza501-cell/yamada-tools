import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { topic, category, blogData, images } = await request.json();

    console.log('Publish received:', { topic, category, images });

    if (!topic || !blogData) {
      return NextResponse.json({
        success: false,
        error: 'Topic and blogData required'
      }, { status: 400 });
    }

    // Generate slug
    const slug = topic
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60) + '-' + Date.now().toString().slice(-6);

    // Replace image markers
    let finalContent = blogData.content || '';
    if (images && typeof images === 'object') {
      Object.entries(images).forEach(([position, url]) => {
        const marker = `[${position}]`;
        const imageMarkdown = `\n\n![${position}](${url})\n\n`;
        finalContent = finalContent.replace(new RegExp(`\\[${position}\\]`, 'g'), imageMarkdown);
      });
    }

    // Create blog
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

    console.log('Created blog:', blog);

    // Save
    const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');
    let existingBlogs = [];

    if (fs.existsSync(blogsPath)) {
      const fileContent = fs.readFileSync(blogsPath, 'utf-8');
      existingBlogs = JSON.parse(fileContent);
    }

    existingBlogs.push(blog);
    fs.writeFileSync(blogsPath, JSON.stringify(existingBlogs, null, 2));

    // Revalidate
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
