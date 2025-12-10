'use client';
import { useState, useEffect } from 'react';
import MultiImageUpload from '@/components/MultiImageUpload';
import Link from 'next/link';

type Tab = 'create' | 'manage';

export default function BlogManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>('manage');
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('PDF');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [imagePrompts, setImagePrompts] = useState<{ position: string; prompt: string }[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState<'input' | 'images'>('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'manage') fetchBlogs();
  }, [activeTab]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/blog/list');
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
        setFilteredBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterByCategory = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog => blog.category === cat));
    }
  };

  const handleGenerateBlog = async () => {
    if (!topic.trim()) {
      alert('トピックを入力してください');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedContent(data.blogData);
        setImagePrompts(data.imagePrompts || []);
        setStep('images');
        alert('ブログ生成完了！画像をアップロードしてください。');
      } else {
        alert('生成失敗: ' + data.error);
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('エラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    try {
      console.log('Publishing with images:', uploadedImages);
      
      const res = await fetch('/api/admin/blog/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          category,
          blogData: generatedContent,
          images: uploadedImages,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('ブログを公開しました！');
        setTopic('');
        setGeneratedContent(null);
        setImagePrompts([]);
        setUploadedImages({});
        setStep('input');
        setActiveTab('manage');
        fetchBlogs();
      } else {
        alert('公開失敗: ' + data.error);
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('エラーが発生しました');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      const res = await fetch('/api/admin/blog/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      const data = await res.json();
      if (data.success) {
        alert('削除しました');
        fetchBlogs();
      } else {
        alert('削除失敗: ' + data.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('エラーが発生しました');
    }
  };

  const getBlogCount = (cat: string): number => {
    if (cat === 'all') return blogs.length;
    return blogs.filter(blog => blog.category === cat).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">ブログ管理</h1>
          <Link href="/blog" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            ブログ一覧を見る
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'manage' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 管理
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'create' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ✨ 新規作成
            </button>
          </div>
        </div>

        {activeTab === 'manage' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex gap-2 mb-6 flex-wrap">
              <button onClick={() => filterByCategory('all')} className={`px-4 py-2 rounded-lg font-medium ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                すべて ({getBlogCount('all')})
              </button>
              <button onClick={() => filterByCategory('PDF')} className={`px-4 py-2 rounded-lg font-medium ${selectedCategory === 'PDF' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                PDF ({getBlogCount('PDF')})
              </button>
              <button onClick={() => filterByCategory('業務効率化')} className={`px-4 py-2 rounded-lg font-medium ${selectedCategory === '業務効率化' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                業務効率化 ({getBlogCount('業務効率化')})
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">ブログがありません</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">画像</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">タイトル</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">カテゴリー</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">公開日</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBlogs.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).map((blog) => (
                      <tr key={blog.slug} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          {blog.featuredImage ? (
                            <img src={blog.featuredImage} alt={blog.title} className="w-16 h-16 object-cover rounded" />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">画像なし</div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium">{blog.title}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">{blog.category}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{blog.publishDate}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link href={`/blog/${blog.slug}`} className="text-blue-600 hover:text-blue-800 text-sm" target="_blank">表示</Link>
                            <button onClick={() => handleDelete(blog.slug)} className="text-red-600 hover:text-red-800 text-sm">削除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow p-6">
            {step === 'input' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">トピック</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="例: PDFファイルの圧縮方法"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリー</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                    <option value="PDF">PDF</option>
                    <option value="業務効率化">業務効率化</option>
                    <option value="ノウハウ">ノウハウ</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateBlog}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {isGenerating ? '生成中...' : 'ブログを生成'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-bold text-green-800 mb-2">✅ ブログ生成完了！</h3>
                  <p className="text-green-700 text-sm">画像をアップロードして公開してください。</p>
                </div>

                <h2 className="text-2xl font-bold">画像をアップロード</h2>

                <MultiImageUpload
                  imagePrompts={imagePrompts}
                  uploadedImages={uploadedImages}
                  onImageUpload={(position, url) => {
                    console.log('Image uploaded:', position, url);
                    setUploadedImages(prev => ({ ...prev, [position]: url }));
                  }}
                />

                <div className="flex gap-4">
                  <button onClick={() => setStep('input')} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300">
                    戻る
                  </button>
                  <button onClick={handlePublish} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">
                    公開する
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
