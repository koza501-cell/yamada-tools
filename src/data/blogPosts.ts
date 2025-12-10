export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  author: string;
  image?: string;
  imageType?: 'css' | 'file';
  toolLink?: string;
  description?: string;
  keywords?: string[];
  featuredImage?: string;
  status?: string;
}

const blogPosts: BlogPost[] = [];

export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

export function getPublishedPosts(): BlogPost[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function isNewBlog(publishDate: string): boolean {
  const postDate = new Date(publishDate);
  const now = new Date();
  const diffInDays = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= 7;
}
