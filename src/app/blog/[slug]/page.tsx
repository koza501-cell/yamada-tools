import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import BlogContent from '@/components/BlogContent';
import { marked } from 'marked';
import '@/app/blog.css';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');
  
  if (!fs.existsSync(blogsPath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(blogsPath, 'utf-8');
  const blogs = JSON.parse(fileContent);
  const blog = blogs.find((b: any) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  const htmlContent = String(await marked(blog.content));

  return (
    <article className="blog-article max-w-4xl mx-auto px-4 py-12">
      {/* Hero Image */}
      {blog.featuredImage && (
        <div className="mb-8 -mx-4 md:mx-0">
          <img 
            src={blog.featuredImage} 
            alt={blog.title}
            className="w-full max-h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      <header className="blog-header mb-12 text-center">
        <h1 className="blog-title text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {blog.title}
        </h1>
        
        <div className="blog-meta flex flex-wrap items-center justify-center gap-4 text-gray-600 mb-6">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {blog.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {blog.publishDate}
          </span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {blog.readTime}
          </span>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {blog.tags.map((tag: string, i: number) => (
              <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>
      
      <div className="blog-content prose prose-lg max-w-none">
        <BlogContent content={htmlContent} />
      </div>

      <footer className="blog-footer mt-16 pt-8 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            関連ツールを試してみませんか？
          </h3>
          <p className="text-gray-600 mb-6">
            この記事で紹介した機能を、無料でお試しいただけます
          </p>
          <a 
            href={blog.toolLink || '/pdf'} 
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            ツールを使ってみる
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </footer>
    </article>
  );
}

export async function generateStaticParams() {
  const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');
  
  if (!fs.existsSync(blogsPath)) {
    return [];
  }

  const fileContent = fs.readFileSync(blogsPath, 'utf-8');
  const blogs = JSON.parse(fileContent);

  return blogs.map((blog: any) => ({
    slug: blog.slug,
  }));
}
