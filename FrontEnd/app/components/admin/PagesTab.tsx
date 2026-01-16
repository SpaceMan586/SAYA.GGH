"use client";

import { HiX } from "react-icons/hi";
import ImageUpload from "./ImageUpload";

interface PagesTabProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  homeData: any;
  setHomeData: (data: any) => void;
  aboutData: any;
  setAboutData: (data: any) => void;
  newsList: any[];
  teamList: any[];
  onSaveHome: () => void;
  onSaveAbout: () => void;
  onAddNews: () => void;
  onDeleteNews: (id: number) => void;
  onAddTeam: () => void;
  onDeleteTeam: (id: number) => void;
  uploading: boolean;
  imageFile: File | null;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  // New Props for Home Gallery
  homeGalleryPreviews?: string[];
  onHomeGalleryChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveHomeGalleryImage?: (index: number) => void;
}

export default function PagesTab({
  activeSubTab,
  setActiveSubTab,
  homeData,
  setHomeData,
  aboutData,
  setAboutData,
  newsList,
  teamList,
  onSaveHome,
  onSaveAbout,
  onAddNews,
  onDeleteNews,
  onAddTeam,
  onDeleteTeam,
  uploading,
  imageFile,
  imagePreview,
  onFileChange,
  onClearImage,
  homeGalleryPreviews = [],
  onHomeGalleryChange,
  onRemoveHomeGalleryImage
}: PagesTabProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Pages Content</h1>
      
      {/* Sub-Tabs */}
      <div className="flex gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        {['home', 'about', 'news'].map((tab: string) => (
          <button 
            key={tab} 
            onClick={() => setActiveSubTab(tab)} 
            className={`px-6 py-2 rounded-md text-xs font-bold uppercase transition-all ${activeSubTab === tab ? 'bg-white dark:bg-gray-700 shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* HOME EDIT */}
      {activeSubTab === 'home' && (
        <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 max-w-3xl">
          <h3 className="text-xl font-bold mb-6 dark:text-white">Home Page Hero</h3>
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Title</label>
              <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" value={homeData.title} onChange={e => setHomeData({...homeData, title: e.target.value})} />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Subtitle</label>
              <textarea className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" rows={2} value={homeData.subtitle} onChange={e => setHomeData({...homeData, subtitle: e.target.value})} />
            </div>

            {/* Main Background Upload Section */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-600">
                <h4 className="text-sm font-bold uppercase text-gray-700 dark:text-gray-300 mb-4">Main Background Image</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <ImageUpload 
                        label="Upload New Background" 
                        imageFile={imageFile} 
                        imagePreview={imagePreview} 
                        onFileChange={onFileChange} 
                        onClear={onClearImage} 
                    />
                     <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase text-gray-400">Current Background</label>
                        <div className="h-40 border rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative">
                            {homeData.image_url ? (
                                <img src={homeData.image_url} alt="Current" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs text-gray-400">No Image Set</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4 border-t pt-4">
               <h4 className="text-sm font-bold uppercase text-gray-500">Hero Slideshow / Gallery</h4>
               <p className="text-xs text-gray-400">Upload multiple images to create a background slideshow.</p>
               
               <div className="grid grid-cols-3 gap-3">
                   {/* Gallery Previews */}
                   {homeGalleryPreviews.map((src, idx) => (
                     <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border">
                       <img src={src} className="w-full h-full object-cover" />
                       <button 
                         onClick={() => onRemoveHomeGalleryImage && onRemoveHomeGalleryImage(idx)}
                         className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                       >
                         <HiX className="w-3 h-3" />
                       </button>
                     </div>
                   ))}

                   {/* Add Button */}
                   <label className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="text-2xl text-gray-400">+</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Add Slide</span>
                      <input type="file" multiple className="hidden" accept="image/*" onChange={onHomeGalleryChange} />
                   </label>
               </div>
            </div>

            <button onClick={onSaveHome} disabled={uploading} className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {uploading ? 'Processing...' : 'Save Home Content'}
            </button>
          </div>
        </div>
      )}

      {/* ABOUT EDIT */}
      {activeSubTab === 'about' && (
        <div className="space-y-12">
          <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 max-w-3xl">
            <h3 className="text-xl font-bold mb-6 dark:text-white">About Us Section</h3>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Title</label>
                <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" value={aboutData.title} onChange={e => setAboutData({...aboutData, title: e.target.value})} />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Main Description</label>
                <textarea className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" rows={6} value={aboutData.body} onChange={e => setAboutData({...aboutData, body: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <ImageUpload imageFile={imageFile} imagePreview={imagePreview} onFileChange={onFileChange} onClear={onClearImage} />
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Image</label>
                                <div className="h-40 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center dark:bg-gray-700 relative group">
                                  {aboutData.image_url ? (
                                    <>
                                      <img src={aboutData.image_url} alt="Current" className="w-full h-full object-cover" />
                                      <button 
                                         onClick={() => setAboutData({ ...aboutData, image_url: "" })}
                                         className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                                         title="Remove Image"
                                       >
                                         <HiX className="w-4 h-4" />
                                       </button>
                                    </>
                                  ) : <span className="text-gray-300">No Image</span>}
                                </div>
                              </div>              </div>
              <button onClick={onSaveAbout} disabled={uploading} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                {uploading ? 'Processing...' : 'Save About Content'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center max-w-3xl">
              <h3 className="text-xl font-bold dark:text-white uppercase tracking-tighter italic">Manage Team Members</h3>
              <button onClick={onAddTeam} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 text-sm transition-transform active:scale-95">+ Add Member</button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm max-w-3xl">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4">Portrait</th>
                    <th className="px-6 py-4">Name & Role</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {teamList.map((member: any) => (
                    <tr key={member.id} className="bg-white hover:bg-gray-50 dark:bg-gray-800 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border bg-gray-50">
                          {member.image_url && <img src={member.image_url} className="w-full h-full object-cover" alt="" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        <p className="font-bold">{member.name}</p>
                        <p className="text-[10px] text-blue-600 uppercase tracking-widest">{member.role}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => onDeleteTeam(member.id)} className="text-red-500 hover:text-red-700 font-medium">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NEWS LIST */}
      {activeSubTab === 'news' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold dark:text-white">Articles & Updates</h3>
            <button onClick={onAddNews} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 text-sm transition-transform active:scale-95">+ Write Article</button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4">Thumbnail</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {newsList.map((news: any) => (
                  <tr key={news.id} className="bg-white hover:bg-gray-50 dark:bg-gray-800 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-10 rounded overflow-hidden border bg-gray-50">
                        {news.image_url && <img src={news.image_url} className="w-full h-full object-cover" alt="" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <p className="font-bold">{news.title}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{news.date}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => onDeleteNews(news.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}