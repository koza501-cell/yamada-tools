'use client';

import { useState, useEffect } from 'react';
import MultiImageUpload from '@/components/MultiImageUpload';
import Link from 'next/link';

type Tab = 'create' | 'manage';

export default function BlogManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>('manage');
  
  // Create tab states
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('PDF');
  const [style, setStyle] = useState('professional');
  const [scheduledDate, setScheduledDate] = useState('');
  const [status, setStatus] = useState<'published' | 'scheduled' | 'draft'>('published');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'images'>('input');
  const [generatedBlog, setGeneratedBlog] = useState<any>(null);
  const [imagePrompts, setImagePrompts] = useState<any[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ [key: string]: string }>({});

  // Manage tab states
  const [blogs, setBlogs] = useState<any[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'manage') {
      loadBlogs();
    }
  }, [activeTab]);

  const loadBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blog/list');
      const data = await response.json();
      if (data.success) {
        // Sort by publishDate descending (newest first)
        const sortedBlogs = data.blogs.sort((a: any, b: any) => {
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        });
        setBlogs(sortedBlogs);
        setFilteredBlogs(sortedBlogs);
      }
    } catch (error) {
      console.error('Failed to load blogs:', error);
    }
  };

  const handleCategoryFilter = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog => blog.category === cat));
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      const response = await fetch(`/api/admin/blog?slug=${slug}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        loadBlogs();
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          category,
          style,
          status,
          scheduledDate: status === 'scheduled' ? scheduledDate : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedBlog(data.blog);
        setImagePrompts(data.imagePrompts || []);
        setStep('images');
      }
    } catch (error) {
      console.error('Failed to generate blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          category,
          style,
          status,
          scheduledDate: status === 'scheduled' ? scheduledDate : undefined,
          uploadedImages,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Reset and go back to manage tab
        setTopic('');
        setUploadedImages({});
        setStep('input');
        setActiveTab('manage');
        loadBlogs();
      }
    } catch (error) {
      console.error('Failed to publish blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const isNew = (publishDate: string) => {
    const blogDate = new Date(publishDate);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return blogDate >= threeDaysAgo;
  };

  const getCategoryCount = (cat: string) => {
    if (cat === 'all') return blogs.length;
    return blogs.filter(blog => blog.category === cat).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">ブログ管理</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'manage'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            管理
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'create'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            新規作成
          </button>
        </div>

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div>
            {/* Category Filter */}
            <div className="mb-6 flex gap-2 flex-wrap">
              {['all', 'PDF', 'ビジネス', '技術'].map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat === 'all' ? 'すべて' : cat} ({getCategoryCount(cat)})
                </button>
              ))}
            </div>

            {/* Blogs Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">画像</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">タイトル</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">カテゴリー</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">公開日</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ステータス</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBlogs.map(blog => (
                    <tr key={blog.slug} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {blog.featuredImage ? (
                          <img 
                            src={blog.featuredImage} 
                            alt={blog.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                            画像なし
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{blog.title}</span>
                          {isNew(blog.publishDate) && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                              NEW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {blog.publishDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-sm rounded ${
                          blog.status === 'published' 
                            ? 'bg-green-100 text-green-800'
                            : blog.status === 'scheduled'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.status === 'published' ? '公開中' : 
                           blog.status === 'scheduled' ? '予約' : '下書き'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link 
                            href={`/blog/${blog.slug}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            target="_blank"
                          >
                            表示
                          </Link>
                          <Link 
                            href={`/admin/blog/edit/${blog.slug}`}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            編集
                          </Link>
                          {deleteConfirm === blog.slug ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDelete(blog.slug)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                確認
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                              >
                                キャンセル
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(blog.slug)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              削除
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow p-6">
            {step === 'input' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    トピック
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例：PDF圧縮の効果的な方法"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    カテゴリー
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PDF">PDF</option>
                    <option value="ビジネス">ビジネス</option>
                    <option value="技術">技術</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    スタイル
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional">プロフェッショナル</option>
                    <option value="casual">カジュアル</option>
                    <option value="technical">テクニカル</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ステータス
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="published">公開</option>
                    <option value="scheduled">予約投稿</option>
                    <option value="draft">下書き</option>
                  </select>
                </div>

                {status === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      公開日
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={loading || !topic}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? '生成中...' : 'ブログを生成'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">画像をアップロード</h2>
                <MultiImageUpload
                  imagePrompts={imagePrompts}
                  uploadedImages={uploadedImages}
                  onImageUpload={(position, url) => {
                    setUploadedImages(prev => ({ ...prev, [position]: url }));
                  }}
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('input')}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
                  >
                    戻る
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? '公開中...' : '公開する'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
