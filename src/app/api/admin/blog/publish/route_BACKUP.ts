import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { slug, scheduledDate, status } = await request.json();

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
    const blogs = JSON.parse(fileContent);

    const blogIndex = blogs.findIndex((b: any) => b.slug === slug);
    
    if (blogIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Blog not found' 
      }, { status: 404 });
    }

    blogs[blogIndex].status = status;
    if (scheduledDate) {
      blogs[blogIndex].publishDate = scheduledDate;
    }

    fs.writeFileSync(blogsPath, JSON.stringify(blogs, null, 2));

    let message = '公開しました';
    if (status === 'draft') message = '下書きとして保存しました';
    if (status === 'scheduled') message = `${scheduledDate}に公開予約しました`;

    return NextResponse.json({ 
      success: true,
      message
    });

  } catch (error: any) {
    console.error('Publish error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
