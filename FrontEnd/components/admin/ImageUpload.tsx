"use client";

import { HiUpload, HiX } from "react-icons/hi";
import Image from "next/image";

interface ImageUploadProps {
  label?: string;
  imageFile?: File | null;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  compact?: boolean;
}

export default function ImageUpload({
  label = "Upload Image",
  imagePreview,
  onFileChange,
  onClear,
  compact = false,
}: ImageUploadProps) {
  const wrapperHeight = compact ? "h-28" : "h-40";
  const iconSize = compact ? "w-6 h-6 mb-2" : "w-8 h-8 mb-4";
  const labelSize = compact ? "text-[10px]" : "text-xs";
  const headingSize = compact ? "text-xs mb-1" : "text-sm mb-2";

  return (
    <div className={compact ? "space-y-1.5" : "space-y-2"}>
      <label className={`${labelSize} font-bold uppercase text-gray-400`}>
        {label}
      </label>
      {!imagePreview ? (
        <div className="flex items-center justify-center w-full">
          <label
            className={`flex flex-col items-center justify-center w-full ${wrapperHeight} border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-all`}
          >
            <div
              className={`flex flex-col items-center justify-center ${compact ? "pt-3 pb-3" : "pt-5 pb-6"}`}
            >
              <HiUpload className={`${iconSize} text-gray-500 dark:text-gray-400`} />
              <p
                className={`${headingSize} text-gray-500 dark:text-gray-400 font-semibold`}
              >
                Click to upload
              </p>
              {compact ? (
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  PNG/JPG/WebP
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or WebP (MAX. 2MB)
                </p>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onFileChange}
            />
          </label>
        </div>
      ) : (
        <div className={`relative w-full ${wrapperHeight} group`}>
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-lg border shadow-sm"
            unoptimized
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
            <button
              onClick={onClear}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
