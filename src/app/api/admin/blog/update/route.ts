import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const updatedBlog = await request.json();

    if (!updatedBlog.slug) {
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

    const blogIndex = blogs.findIndex((b: any) => b.slug === updatedBlog.slug);
    
    if (blogIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Blog not found' 
      }, { status: 404 });
    }

    blogs[blogIndex] = updatedBlog;

    fs.writeFileSync(blogsPath, JSON.stringify(blogs, null, 2));

    // Auto-refresh blog pages
    revalidatePath('/blog');
    revalidatePath('/');
    revalidatePath(`/blog/${updatedBlog.slug}`);

    return NextResponse.json({ 
      success: true,
      message: 'Blog updated successfully'
    });

  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
