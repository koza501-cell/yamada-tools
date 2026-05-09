import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import BlogContent from '@/components/BlogContent';
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import { marked } from 'marked';
import '@/app/blog.css';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');

  if (!fs.existsSync(blogsPath)) {
    return { title: 'ブログ記事が見つかりません' };
  }

  const fileContent = fs.readFileSync(blogsPath, 'utf-8');
  const blogs = JSON.parse(fileContent);
  const blog = blogs.find((b: any) => b.slug === slug);

  if (!blog) {
    return { title: 'ブログ記事が見つかりません' };
  }

  const siteUrl = 'https://yamada-tools.jp';

  return {
    title: blog.title,
    description: blog.excerpt || blog.title,
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      url: `${siteUrl}/blog/${slug}`,
      type: 'article',
      publishedTime: blog.publishDate,
      authors: [blog.author || '合同会社山田トレード'],
      images: blog.featuredImage ? [{ url: blog.featuredImage, width: 1200, height: 630, alt: blog.title }] : [],
    },
  };
}

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

  const htmlContent = blog.content ? String(await marked(blog.content)) : '<p>この記事のコンテンツは準備中です。</p>';

  // Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt || blog.description || blog.title,
    datePublished: blog.publishDate,
    dateModified: blog.modifiedDate || blog.publishDate,
    author: {
      "@type": "Organization",
      name: blog.author || "合同会社山田トレード",
      url: "https://yamada-tools.jp",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://yamada-tools.jp/#organization",
      name: "合同会社山田トレード",
      logo: {
        "@type": "ImageObject",
        url: "https://yamada-tools.jp/logo-icon.webp",
        width: 512,
        height: 512,
      },
    },
    image: blog.featuredImage || "https://yamada-tools.jp/og-image.png",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://yamada-tools.jp/blog/${slug}`,
    },
    inLanguage: "ja",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
      { "@type": "ListItem", position: 2, name: "ブログ", item: "https://yamada-tools.jp/blog" },
      { "@type": "ListItem", position: 3, name: blog.title, item: `https://yamada-tools.jp/blog/${slug}` },
    ],
  };

  const faqSchema = blog.faq && Array.isArray(blog.faq) ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (blog.faq as Array<{ q: string; a: string }>).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } : null;

  return (
    <article className="blog-article max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* Hero Image */}
      {blog.featuredImage && (
        <div className="mb-8 -mx-4 md:mx-0">
          <Image 
            src={blog.featuredImage} 
            alt={blog.title}
            width={1200}
            height={384}
            className="w-full max-h-96 object-cover rounded-lg shadow-lg"
            priority
          />
        </div>
      )}

      <StaticAdSlot className="mb-8" />
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
      
      {(() => {
        const parts = htmlContent.split(/(?<=<\/p>)/);
        if (parts.length <= 4) {
          return (
            <>
              <div className="blog-content prose prose-lg max-w-none">
                <BlogContent content={htmlContent} />
              </div>
              <BlogAdUnit />
            </>
          );
        }
        const intro = parts.slice(0, 2).join('');
        const midPoint = Math.floor(parts.length * 0.55);
        const middle = parts.slice(2, midPoint).join('');
        const rest = parts.slice(midPoint).join('');
        return (
          <>
            <div className="blog-content prose prose-lg max-w-none">
              <BlogContent content={intro} />
            </div>
            <BlogAdUnit />
            <div className="blog-content prose prose-lg max-w-none">
              <BlogContent content={middle} />
            </div>
            <BlogAdUnit />
            <div className="blog-content prose prose-lg max-w-none">
              <BlogContent content={rest} />
            </div>
            <BlogAdUnit />
          </>
        );
      })()}
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

export const dynamicParams = true;

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
