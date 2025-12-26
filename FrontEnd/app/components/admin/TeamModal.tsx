"use client";

import ImageUpload from "./ImageUpload";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTeamMember: { name: string; role: string };
  setNewTeamMember: (val: { name: string; role: string }) => void;
  onAdd: () => void;
  uploading: boolean;
  imageFile: File | null;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
}

export default function TeamModal({
  isOpen,
  onClose,
  newTeamMember,
  setNewTeamMember,
  onAdd,
  uploading,
  imageFile,
  imagePreview,
  onFileChange,
  onClearImage
}: TeamModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-200 dark:bg-gray-800">
        <h3 className="text-2xl font-black mb-6 dark:text-white uppercase tracking-tighter italic decoration-blue-600 underline-offset-4">
          New Team Member
        </h3>
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
            <input
              className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              placeholder="Member Name"
              value={newTeamMember.name}
              onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Role / Position</label>
            <input
              className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              placeholder="e.g. Lead Architect"
              value={newTeamMember.role}
              onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
            />
          </div>
          
          <ImageUpload 
            imageFile={imageFile}
            imagePreview={imagePreview}
            onFileChange={onFileChange}
            onClear={onClearImage}
          />

          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={onAdd}
              disabled={uploading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {uploading ? "SAVING..." : "ADD MEMBER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
