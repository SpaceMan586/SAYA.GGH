"use client";

import { HiUpload, HiX } from "react-icons/hi";

interface ImageUploadProps {
  imageFile: File | null;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export default function ImageUpload({ imageFile, imagePreview, onFileChange, onClear }: ImageUploadProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Image</label>
      {!imagePreview ? (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <HiUpload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">Click to upload</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or WebP (MAX. 2MB)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
          </label>
        </div>
      ) : (
        <div className="relative w-full h-40 group">
          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg border shadow-sm" />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
             <button onClick={onClear} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                <HiX className="w-5 h-5" />
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
