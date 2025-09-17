'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ImageViewerProps {
  initialImageUrl?: string;
  onImageSelect: (file: File | null) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  initialImageUrl,
  onImageSelect,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(initialImageUrl || null);
  }, [initialImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
      onImageSelect(file);
    } else {
      setPreviewUrl(initialImageUrl || null);
      onImageSelect(null);
    }
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
      {previewUrl ? (
        <div className="relative w-48 h-48 mb-4">
          <Image
            src={previewUrl}
            alt="Image Preview"
            layout="fill"
            objectFit="contain"
            className="rounded-md"
          />
          <button
            type="button"
            onClick={handleClearImage}
            className="absolute cursor-pointer top-1 right-1 bg-red-500 text-white rounded-full p-2 text-xs"
            aria-label="Clear image"
          >
            X
          </button>
        </div>
      ) : (
        <div className="text-gray-500 mb-4">אין תמונה נבחרת</div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-olive file:text-green-700
          hover:file:bg-olive-dark bg-gray-200 rounded-3xl cursor-pointer"
      />
    </div>
  );
};
