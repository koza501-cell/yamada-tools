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
    
    // REMOVE [IMAGE_HERO] since it's displayed as featured image
    finalContent = finalContent.replace(/\[IMAGE_HERO\]/g, '');
    
    // Replace other image markers
    if (images) {
      ['IMAGE_1', 'IMAGE_2', 'IMAGE_3'].forEach(position => {
        if (images[position]) {
          finalContent = finalContent.replace(
            new RegExp(`\\[${position}\\]`, 'g'),
            `\n\n![${position}](${images[position]})\n\n`
          );
        }
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
