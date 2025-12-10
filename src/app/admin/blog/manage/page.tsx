'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Blog = {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  readTime: string;
  publishDate: string;
  author: string;
};

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blog/list');
      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      const response = await fetch('/api/admin/blog/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (response.ok) {
        await loadBlogs();
        setDeleteConfirm(null);
      } else {
        alert('削除に失敗しました');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('削除に失敗しました');
    }
  };

  const categories = ['all', ...Array.from(new Set(blogs.map(b => b.category)))];
  const filteredBlogs = filter === 'all' ? blogs : blogs.filter(b => b.category === filter);
  const getCategoryCount = (category: string) => {
    if (category === 'all') return blogs.length;
    return blogs.filter(b => b.category === category).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ブログ管理</h1>
          <p className="text-gray-600">全 {blogs.length} 件のブログ</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">カテゴリーでフィルター</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button key={category} onClick={() => setFilter(category)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {category === 'all' ? 'すべて' : category} ({getCategoryCount(category)})
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カテゴリー</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タグ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">公開日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">読了時間</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                      <div className="text-sm text-gray-500">{blog.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{blog.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{tag}</span>
                        ))}
                        {blog.tags.length > 3 && <span className="px-2 py-1 text-xs text-gray-500">+{blog.tags.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.publishDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.readTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900">表示</a>
                      <Link href={`/admin/blog/edit/${blog.slug}`} className="text-green-600 hover:text-green-900">編集</Link>
                      <button onClick={() => setDeleteConfirm(blog.slug)} className="text-red-600 hover:text-red-900">削除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">該当するブログがありません</p>
            </div>
          )}
        </div>

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">ブログを削除</h3>
              <p className="text-gray-600 mb-6">このブログを削除すると、元に戻せません。本当に削除しますか？</p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">キャンセル</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">削除する</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
