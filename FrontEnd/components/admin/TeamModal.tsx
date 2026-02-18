"use client";

import ImageUpload from "./ImageUpload";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTeamMember: any;
  setNewTeamMember: (data: any) => void;
  onSave: () => void;
  mode: "create" | "edit";
  uploading: boolean;
  imageFile: File | null;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  imageFileMobile: File | null;
  imagePreviewMobile: string | null;
  onMobileFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearMobileImage: () => void;
}

export default function TeamModal({
  isOpen,
  onClose,
  newTeamMember,
  setNewTeamMember,
  onSave,
  mode,
  uploading,
  imageFile,
  imagePreview,
  onFileChange,
  onClearImage,
  imageFileMobile,
  imagePreviewMobile,
  onMobileFileChange,
  onClearMobileImage,
}: TeamModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-200 dark:bg-gray-800">
        <h3 className="text-2xl font-black mb-6 dark:text-white uppercase tracking-tighter italic underline decoration-blue-600 underline-offset-4">
          {mode === "edit" ? "Edit Team Member" : "New Team Member"}
        </h3>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Name
              </label>
              <input
                className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none dark:bg-gray-700 dark:text-white"
                placeholder="John Doe"
                value={newTeamMember.name}
                onChange={(e) =>
                  setNewTeamMember({ ...newTeamMember, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Role
              </label>
              <input
                className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none dark:bg-gray-700 dark:text-white"
                placeholder="e.g. Architect"
                value={newTeamMember.role}
                onChange={(e) =>
                  setNewTeamMember({ ...newTeamMember, role: e.target.value })
                }
              />
            </div>
          </div>
          <ImageUpload
            imageFile={imageFile}
            imagePreview={imagePreview}
            onFileChange={onFileChange}
            onClear={onClearImage}
          />
          <ImageUpload
            label="Mobile Image"
            imageFile={imageFileMobile}
            imagePreview={imagePreviewMobile}
            onFileChange={onMobileFileChange}
            onClear={onClearMobileImage}
          />

          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              DISCARD
            </button>
            <button
              onClick={onSave}
              disabled={uploading}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {uploading
                ? "SAVING..."
                : mode === "edit"
                  ? "SAVE CHANGES"
                  : "ADD MEMBER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
