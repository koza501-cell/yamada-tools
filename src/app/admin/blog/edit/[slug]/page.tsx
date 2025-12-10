'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      const response = await fetch('/api/admin/blog/list');
      const data = await response.json();
      const foundBlog = data.blogs.find((b: any) => b.slug === slug);
      
      if (foundBlog) {
        setBlog(foundBlog);
      } else {
        alert('ブログが見つかりません');
        router.push('/admin/blog/manage');
      }
    } catch (error) {
      console.error('Failed to load blog:', error);
      alert('読み込みエラー');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/blog/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog),
      });

      const data = await response.json();

      if (data.success) {
        alert('保存しました');
        router.push('/admin/blog/manage');
      } else {
        alert('保存エラー: ' + data.error);
      }
    } catch (error: any) {
      alert('保存エラー: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ブログ編集</h1>
          <p className="text-gray-600">スラッグ: {slug}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトル
              </label>
              <input
                type="text"
                value={blog.title}
                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明
              </label>
              <textarea
                value={blog.description}
                onChange={(e) => setBlog({ ...blog, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリー
              </label>
              <select
                value={blog.category}
                onChange={(e) => setBlog({ ...blog, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="PDF">PDF</option>
                <option value="セキュリティ">セキュリティ</option>
                <option value="ビジネス">ビジネス</option>
                <option value="生産性">生産性</option>
                <option value="データ管理">データ管理</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ（カンマ区切り）
              </label>
              <input
                type="text"
                value={blog.tags?.join(', ')}
                onChange={(e) => setBlog({ ...blog, tags: e.target.value.split(',').map((t: string) => t.trim()) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                アイキャッチ画像URL
              </label>
              <input
                type="text"
                value={blog.featuredImage || ''}
                onChange={(e) => setBlog({ ...blog, featuredImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公開日
              </label>
              <input
                type="date"
                value={blog.publishDate}
                onChange={(e) => setBlog({ ...blog, publishDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ステータス
              </label>
              <select
                value={blog.status || 'published'}
                onChange={(e) => setBlog({ ...blog, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="published">公開</option>
                <option value="draft">下書き</option>
                <option value="scheduled">予約投稿</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                本文（Markdown）
              </label>
              <textarea
                value={blog.content}
                onChange={(e) => setBlog({ ...blog, content: e.target.value })}
                rows={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/admin/blog/manage')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
