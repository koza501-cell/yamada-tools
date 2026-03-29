import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token || token !== process.env.ADMIN_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
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
