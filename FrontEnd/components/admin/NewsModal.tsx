"use client";

import Image from "next/image";
import { HiX } from "react-icons/hi";
import ImageUpload from "./ImageUpload";

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  newNews: any;
  setNewNews: (data: any) => void;
  onAdd: () => void;
  mode?: "create" | "edit";
  uploading: boolean;
  imageFile: File | null;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  imageFileMobile: File | null;
  imagePreviewMobile: string | null;
  onMobileFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearMobileImage: () => void;
  galleryPreviews: string[];
  onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveGalleryImage: (index: number) => void;
}

export default function NewsModal({
  isOpen,
  onClose,
  newNews,
  setNewNews,
  onAdd,
  mode = "create",
  uploading,
  imageFile,
  imagePreview,
  onFileChange,
  onClearImage,
  imageFileMobile,
  imagePreviewMobile,
  onMobileFileChange,
  onClearMobileImage,
  galleryPreviews,
  onGalleryChange,
  onRemoveGalleryImage,
}: NewsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-5xl h-[calc(100dvh-1.5rem)] sm:h-[calc(100dvh-2rem)] bg-white rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200 dark:bg-gray-800 flex flex-col overflow-hidden">
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl sm:text-2xl font-black dark:text-white uppercase tracking-tighter italic underline decoration-blue-600 underline-offset-4">
            {mode === "edit" ? "Edit Article" : "New Article"}
          </h3>
        </div>

        <div className="flex-1 min-h-0 p-5 sm:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            <div className="lg:col-span-7 flex flex-col gap-4 min-h-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Article Title
                  </label>
                  <input
                    className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="News Headline"
                    value={newNews.title}
                    onChange={(e) =>
                      setNewNews({ ...newNews, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none dark:bg-gray-700 dark:text-white"
                    value={newNews.date}
                    onChange={(e) =>
                      setNewNews({ ...newNews, date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Article Content
                </label>
                <textarea
                  className="w-full mt-1 h-[calc(100%-1.1rem)] min-h-[200px] p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Body text..."
                  value={newNews.content}
                  onChange={(e) =>
                    setNewNews({ ...newNews, content: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 content-start">
              <ImageUpload
                compact
                imageFile={imageFile}
                imagePreview={imagePreview}
                onFileChange={onFileChange}
                onClear={onClearImage}
              />
              <ImageUpload
                compact
                label="Mobile Image"
                imageFile={imageFileMobile}
                imagePreview={imagePreviewMobile}
                onFileChange={onMobileFileChange}
                onClear={onClearMobileImage}
              />
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">
                  Article Gallery
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {galleryPreviews.map((src, idx) => (
                    <div
                      key={`${src}-${idx}`}
                      className="relative aspect-square rounded-lg overflow-hidden border bg-gray-50"
                    >
                      <Image
                        src={src}
                        alt={`Gallery ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 33vw, 140px"
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        onClick={() => onRemoveGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <HiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700">
                    <span className="text-2xl text-gray-400">+</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Add
                    </span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/*"
                      onChange={onGalleryChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 sm:px-6 sm:py-5 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              DISCARD
            </button>
            <button
              onClick={onAdd}
              disabled={uploading}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {uploading
                ? "SAVING..."
                : mode === "edit"
                  ? "UPDATE"
                  : "PUBLISH"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
