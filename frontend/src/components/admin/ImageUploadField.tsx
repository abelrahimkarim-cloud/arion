'use client';

import { useEffect, useRef, useState } from 'react';
import { adminUploadImage, BACKEND_URL } from '@/lib/adminAuth';

interface ImageUploadFieldProps {
  onImageUpload: (path: string, url: string) => void;
  onError: (error: string) => void;
  existingImage?: string;
  label?: string;
  showPreview?: boolean;
}

export default function ImageUploadField({
  onImageUpload,
  onError,
  existingImage,
  label = 'Upload image',
  showPreview = true,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(getPreviewUrl(existingImage) || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    setPreview(getPreviewUrl(existingImage));
  }, [existingImage]);

  function getPreviewUrl(path?: string) {
    if (!path) return null;
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    if (path.startsWith('/storage/')) {
      return `${BACKEND_URL}${path}`;
    }
    return `${BACKEND_URL}/storage/${path.replace(/^\/+/, '')}`;
  }

  const handleFile = async (file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      onError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const result = await adminUploadImage(file);
      if (result.success) {
        const url = result.url || getPreviewUrl(result.path);
        setPreview(url);
        onImageUpload(result.path, url);
      } else {
        onError(result.message || 'Upload failed');
      }
    } catch (error) {
      onError('Failed to upload image');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {label && <span className="text-xs font-semibold text-slate-600">{label}</span>}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
          dragActive
            ? 'border-slate-700 bg-slate-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
        } ${uploading ? 'opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mx-auto w-full disabled:cursor-not-allowed"
        >
          <div className="space-y-2">
            <svg
              className="mx-auto h-8 w-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <div className="text-sm text-slate-600">
              {uploading ? 'Uploading…' : 'Drag and drop or click to select'}
            </div>
            <div className="text-xs text-slate-500">PNG, JPG, WebP up to 5MB</div>
          </div>
        </button>
      </div>

      {showPreview && preview && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="relative inline-block">
            <img src={preview} alt="Preview" className="h-32 w-32 rounded-lg object-cover" />
          </div>
        </div>
      )}
    </div>
  );
}
