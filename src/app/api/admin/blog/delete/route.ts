import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ 
        success: false, 
        error: 'Slug is required' 
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

    const updatedBlogs = blogs.filter((blog: any) => blog.slug !== slug);

    if (updatedBlogs.length === blogs.length) {
      return NextResponse.json({ 
        success: false, 
        error: 'Blog not found' 
      }, { status: 404 });
    }

    fs.writeFileSync(blogsPath, JSON.stringify(updatedBlogs, null, 2));

    // Auto-refresh blog pages
    revalidatePath('/blog');
    revalidatePath('/');

    return NextResponse.json({ 
      success: true, 
      message: 'Blog deleted successfully' 
    });
  } catch (error: any) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
