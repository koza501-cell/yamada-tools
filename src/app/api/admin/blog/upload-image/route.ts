import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ 
        success: false, 
        error: 'No image provided' 
      }, { status: 400 });
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type' 
      }, { status: 400 });
    }

    // Create blog-images directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'blog-images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = image.name.split('.').pop();
    const filename = `blog-${timestamp}.${extension}`;
    const filepath = path.join(uploadDir, filename);

    // Convert File to Buffer and save
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filepath, buffer);

    // Return URL
    const url = `/blog-images/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url 
    });

  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
