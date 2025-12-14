import { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPosts, isNewBlog } from '@/data/blogPosts';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'ブログ | 山田ツール',
  description: 'PDFツールの活用方法、ビジネス効率化のヒント、最新機能の紹介など、お役立ち情報を発信しています。',
};

function getDynamicBlogs() {
  try {
    const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');
    if (fs.existsSync(blogsPath)) {
      const fileContent = fs.readFileSync(blogsPath, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error loading dynamic blogs:', error);
  }
  return [];
}

export default function BlogPage() {
  const staticBlogs = getPublishedPosts();
  const dynamicBlogs = getDynamicBlogs();
  const allBlogs = [...dynamicBlogs, ...staticBlogs].sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📝 ブログ
          </h1>
          <p className="text-gray-600 text-lg">
            PDFツールの活用方法、ビジネス効率化のヒント、最新機能の紹介など
          </p>
        </div>

        {allBlogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">まだブログがありません</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allBlogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  {blog.featuredImage ? (
                    <img 
                      src={blog.featuredImage} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                  )}
                  {isNewBlog(blog.publishDate) && (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                      NEW
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {blog.category}
                    </span>
                    <span className="text-sm text-gray-500">{blog.readTime}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {blog.description || blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{blog.publishDate}</span>
                    <span className="text-blue-600 group-hover:translate-x-2 transition-transform font-medium">
                      続きを読む →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
