'use client';

import { useState } from 'react';

interface MultiImageUploadProps {
  imagePrompts: { position: string; prompt: string }[];
  uploadedImages: { [key: string]: string };
  onImageUpload: (position: string, url: string) => void;
}

export default function MultiImageUpload({ 
  imagePrompts, 
  uploadedImages,
  onImageUpload 
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  const handleImageUpload = async (position: string, file: File) => {
    setUploading(prev => ({ ...prev, [position]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onImageUpload(position, data.url);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(prev => ({ ...prev, [position]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {imagePrompts.map(({ position, prompt }) => (
        <div key={position} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{position}</h3>
            <button
              onClick={() => navigator.clipboard.writeText(prompt)}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200"
            >
              プロンプトをコピー
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4 bg-white p-3 rounded border border-gray-200">
            {prompt}
          </p>

          {uploadedImages[position] ? (
            <div className="relative">
              <img
                src={uploadedImages[position]}
                alt={position}
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={() => onImageUpload(position, '')}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                削除
              </button>
            </div>
          ) : (
            <div>
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">クリックしてアップロード</span>
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (最大 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(position, file);
                    }
                  }}
                  disabled={uploading[position]}
                />
              </label>
              {uploading[position] && (
                <div className="mt-2 text-center text-sm text-blue-600">
                  アップロード中...
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
