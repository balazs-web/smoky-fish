'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onUpload: (file: File) => Promise<string>;
  onRemove?: (url: string) => Promise<void>;
  maxImages?: number;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value = [],
  onChange,
  onUpload,
  onRemove,
  maxImages = 1,
  disabled = false,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0 || disabled) return;

      const remainingSlots = maxImages - value.length;
      if (remainingSlots <= 0) return;

      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      
      setUploading(true);
      try {
        const uploadPromises = filesToUpload.map((file) => onUpload(file));
        const newUrls = await Promise.all(uploadPromises);
        onChange([...value, ...newUrls]);
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setUploading(false);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    },
    [value, onChange, onUpload, maxImages, disabled]
  );

  const handleRemove = useCallback(
    async (urlToRemove: string) => {
      if (disabled) return;
      
      if (onRemove) {
        try {
          await onRemove(urlToRemove);
        } catch (error) {
          console.error('Failed to delete image:', error);
        }
      }
      onChange(value.filter((url) => url !== urlToRemove));
    },
    [value, onChange, onRemove, disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const canAddMore = value.length < maxImages;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Image previews */}
      {value.length > 0 && (
        <div className={cn(
          'grid gap-3',
          maxImages === 1 ? 'grid-cols-1' : 'grid-cols-3'
        )}>
          {value.map((url, index) => (
            <div
              key={url}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 transition-colors',
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300',
            disabled && 'opacity-50 cursor-not-allowed',
            maxImages > 1 && value.length > 0 ? 'py-4' : ''
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={maxImages > 1}
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={disabled || uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          
          <div className="flex flex-col items-center justify-center text-center">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </>
            ) : (
              <>
                <div className="p-3 bg-gray-100 rounded-full mb-3">
                  {value.length > 0 ? (
                    <Upload className="w-6 h-6 text-gray-500" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {value.length > 0
                    ? `Add more (${value.length}/${maxImages})`
                    : 'Click or drag to upload'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
