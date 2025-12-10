'use client';
import { useState } from 'react';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
}

export default function ImageUpload({ onImageUploaded, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }

    setUploading(true);

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/blog/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onImageUploaded(data.url);
      } else {
        alert('アップロードエラー: ' + data.error);
        setPreview('');
      }
    } catch (error: any) {
      alert('アップロードエラー: ' + error.message);
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        アイキャッチ画像
      </label>
      
      {preview && (
        <div className="mb-4">
          <img 
            src={preview} 
            alt="プレビュー" 
            className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
          />
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
          </label>
          <p className="mt-1 text-sm text-gray-500">
            PNG, JPG, WEBP (最大5MB)
          </p>
        </div>
      </div>

      {uploading && (
        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          アップロード中...
        </div>
      )}
    </div>
  );
}
