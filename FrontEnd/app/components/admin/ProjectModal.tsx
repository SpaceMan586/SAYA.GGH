"use client";

import { HiX } from "react-icons/hi";
import ImageUpload from "./ImageUpload";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  newProject: any;
  setNewProject: (data: any) => void;
  onAdd: () => void;
  editingProjectId: number | null;
  uploading: boolean;
  imageFile: File | null;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  galleryPreviews: string[];
  onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveGalleryImage: (index: number) => void;
  categories: string[];
}

export default function ProjectModal({
  isOpen,
  onClose,
  newProject,
  setNewProject,
  onAdd,
  editingProjectId,
  uploading,
  imageFile,
  imagePreview,
  onFileChange,
  onClearImage,
  galleryPreviews,
  onGalleryChange,
  onRemoveGalleryImage,
  categories
}: ProjectModalProps) {
  if (!isOpen) return null;

  const handleTagChange = (tag: string) => {
    if (newProject.tags.includes(tag)) {
      setNewProject({ ...newProject, tags: newProject.tags.filter((t: string) => t !== tag) });
    } else {
      setNewProject({ ...newProject, tags: [...newProject.tags, tag] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto py-10 px-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl dark:bg-gray-800 m-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight">
            {editingProjectId ? 'Edit Project Entry' : 'New Portfolio Entry'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><HiX className="w-6 h-6" /></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Building Name</label>
                <input className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" placeholder="e.g. THE AVANI" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400">Location</label>
                  <input className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" placeholder="City" value={newProject.location} onChange={e => setNewProject({ ...newProject, location: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400">Year</label>
                  <input className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" placeholder="2025" value={newProject.year} onChange={e => setNewProject({ ...newProject, year: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Project Status</label>
                <select className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none dark:bg-gray-700 dark:text-white" value={newProject.status} onChange={e => setNewProject({ ...newProject, status: e.target.value })}>
                  <option value="On Going">ON GOING</option>
                  <option value="Finished">FINISHED</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Categories</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((cat: string) => (
                    <button key={cat} onClick={() => handleTagChange(cat)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${newProject.tags.includes(cat) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-400 hover:border-gray-300'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Project Narrative</label>
                <textarea className="w-full mt-1 p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" rows={6} placeholder="Describe the design philosophy..." value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
              </div>
            </div>

            <div className="space-y-6">
              <ImageUpload 
                label="Thumbnail Utama"
                imagePreview={imagePreview} 
                onFileChange={onFileChange} 
                onClear={onClearImage} 
              />
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Gallery Proyek (Slideshow)</label>
                <div className="grid grid-cols-3 gap-2">
                   {galleryPreviews.map((src, idx) => (
                     <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                       <img src={src} className="w-full h-full object-cover" />
                       <button 
                         onClick={() => onRemoveGalleryImage(idx)}
                         className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                       >
                         <HiX className="w-3 h-3" />
                       </button>
                     </div>
                   ))}
                   <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="text-2xl text-gray-400">+</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Add Photo</span>
                      <input type="file" multiple className="hidden" accept="image/*" onChange={onGalleryChange} />
                   </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t flex gap-3 justify-end bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">CANCEL</button>
          <button onClick={onAdd} disabled={uploading} className="px-10 py-2.5 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 transition-all shadow-lg active:scale-95">
            {uploading ? 'UPLOADING...' : editingProjectId ? 'SAVE CHANGES' : 'CREATE ENTRY'}
          </button>
        </div>
      </div>
    </div>
  );
}
