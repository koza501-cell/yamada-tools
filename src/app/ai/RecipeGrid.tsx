'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import BlogAdUnit from '@/components/common/BlogAdUnit';

const CATEGORIES = [
  { key: 'all', label: '全て' },
  { key: 'excel', label: 'Excel' },
  { key: 'side-job', label: '副業' },
  { key: 'career', label: '転職' },
  { key: 'business-doc', label: '文書作成' },
  { key: 'prompt', label: 'プロンプト' },
  { key: 'english', label: '英語' },
  { key: 'image', label: '画像生成' },
  { key: 'security', label: 'セキュリティ' },
  { key: 'google', label: 'Google' },
  { key: 'life', label: '生活' },
];

const GRADIENT = 'from-blue-600 to-purple-600';

export default function RecipeGrid({ posts }: { posts: any[] }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? posts
    : posts.filter((p: any) => p.category === activeCategory);

  return (
    <>
      <BlogAdUnit />

      {/* Category filter tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.key
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {activeCategory === 'all' ? '最新レシピ' : `${CATEGORIES.find(c => c.key === activeCategory)?.label}のレシピ`}{' '}
          <span className="text-gray-400 dark:text-gray-500 text-lg font-normal">({filtered.length}件)</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((post: any, index: number) => (
          <React.Fragment key={post.slug}>
            <Link
              href={'/ai/' + post.slug}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className={"h-3 bg-gradient-to-r " + GRADIENT} />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                    {post.type || 'レシピ'}
                  </span>
                  {post.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      post.difficulty === '初心者OK'
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                        : post.difficulty === '中級者向け'
                        ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
                        : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                    }`}>
                      {post.difficulty}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-500">{post.readTime || '5分'}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">{post.description || post.excerpt}</p>
                {post.timeSaved && (
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 mb-4">
                    <span className="text-green-700 dark:text-green-300 text-sm font-medium">⏱ 時短効果: {post.timeSaved}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 dark:text-gray-500">{post.publishDate || (post.publishedAt || '').slice(0, 10)}</span>
                  <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform font-medium">レシピを見る →</span>
                </div>
              </div>
            </Link>
            {(index + 1) % 6 === 0 && index + 1 < filtered.length && (
              <div className="md:col-span-2 lg:col-span-3">
                <BlogAdUnit />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">このカテゴリのレシピは準備中です</p>
        </div>
      )}
    </>
  );
}
