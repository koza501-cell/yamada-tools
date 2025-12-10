import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');

    if (!fs.existsSync(blogsPath)) {
      return NextResponse.json({ success: true, blogs: [] });
    }

    const fileContent = fs.readFileSync(blogsPath, 'utf-8');
    const blogs = JSON.parse(fileContent);

    return NextResponse.json({ success: true, blogs });
  } catch (error: any) {
    console.error('List blogs error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
