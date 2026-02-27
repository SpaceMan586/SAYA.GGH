"use client";

import ImageUpload from "./ImageUpload";
import Image from "next/image";
import { HiX } from "react-icons/hi";

interface PagesTabProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  homeDesktopPreviews: string[];
  homeMobilePreviews: string[];
  onHomeDesktopGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHomeMobileGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveHomeDesktopImage: (index: number) => void;
  onRemoveHomeMobileImage: (index: number) => void;
  aboutData: any;
  setAboutData: (data: any) => void;
  socialLinks: { whatsapp: string; instagram: string; map: string };
  setSocialLinks: (data: {
    whatsapp: string;
    instagram: string;
    map: string;
  }) => void;
  aboutValues: { title: string; body: string }[];
  setAboutValues: (data: { title: string; body: string }[]) => void;
  aboutMilestones: { year: string; label: string }[];
  setAboutMilestones: (data: { year: string; label: string }[]) => void;
  aboutCta: {
    eyebrow: string;
    title: string;
    body: string;
    button_label: string;
    link: string;
  };
  setAboutCta: (data: {
    eyebrow: string;
    title: string;
    body: string;
    button_label: string;
    link: string;
  }) => void;
  newsList: any[];
  teamList: any[];
  onSaveHome: () => void;
  onSaveAbout: () => void;
  onSaveSocialLinks: () => void;
  onSaveAboutExtras: () => void;
  onAddNews: () => void;
  onEditNews: (news: any) => void;
  onDeleteNews: (id: number) => void;
  onAddTeam: () => void;
  onEditTeam: (member: any) => void;
  onDeleteTeam: (id: number) => void;
  uploading: boolean;

  // Generic Props (for About tab)
  imageFile: File | null;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  imageFileMobile: File | null;
  imagePreviewMobile: string | null;
  onMobileFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearMobileImage: () => void;
}

export default function PagesTab({
  activeSubTab,
  setActiveSubTab,
  homeDesktopPreviews,
  homeMobilePreviews,
  onHomeDesktopGalleryChange,
  onHomeMobileGalleryChange,
  onRemoveHomeDesktopImage,
  onRemoveHomeMobileImage,
  aboutData,
  setAboutData,
  socialLinks,
  setSocialLinks,
  aboutValues,
  setAboutValues,
  aboutMilestones,
  setAboutMilestones,
  aboutCta,
  setAboutCta,
  newsList,
  teamList,
  onSaveHome,
  onSaveAbout,
  onSaveSocialLinks,
  onSaveAboutExtras,
  onAddNews,
  onEditNews,
  onDeleteNews,
  onAddTeam,
  onEditTeam,
  onDeleteTeam,
  uploading,
  imageFile,
  imagePreview,
  onFileChange,
  onClearImage,
  imageFileMobile,
  imagePreviewMobile,
  onMobileFileChange,
  onClearMobileImage,
}: PagesTabProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Manage Pages Content
      </h1>

      {/* Sub-Tabs */}
      <div className="flex gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        {["home", "about", "news"].map((tab: string) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-6 py-2 rounded-md text-xs font-bold uppercase transition-all ${activeSubTab === tab ? "bg-white dark:bg-gray-700 shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* HOME SLIDESHOW EDIT */}
      {activeSubTab === "home" && (
        <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 max-w-5xl">
          <h3 className="text-xl font-bold mb-6 dark:text-white">
            Homepage Slideshow
          </h3>
          <div className="space-y-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload multiple images for desktop and mobile slideshow. Order
              follows upload/removal sequence.
            </p>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase text-gray-700 dark:text-gray-300">
                    Desktop Slides
                  </h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {homeDesktopPreviews.length} images
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {homeDesktopPreviews.map((src, idx) => (
                    <div
                      key={`${src}-${idx}`}
                      className="relative aspect-video rounded-lg overflow-hidden border bg-gray-50"
                    >
                      <Image
                        src={src}
                        alt={`Desktop slide ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 250px"
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        onClick={() => onRemoveHomeDesktopImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <HiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700">
                    <span className="text-2xl text-gray-400">+</span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">
                      Add Desktop
                    </span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/*"
                      onChange={onHomeDesktopGalleryChange}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase text-gray-700 dark:text-gray-300">
                    Mobile Slides
                  </h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {homeMobilePreviews.length} images
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {homeMobilePreviews.map((src, idx) => (
                    <div
                      key={`${src}-${idx}`}
                      className="relative aspect-[9/16] rounded-lg overflow-hidden border bg-gray-50"
                    >
                      <Image
                        src={src}
                        alt={`Mobile slide ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 150px"
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        onClick={() => onRemoveHomeMobileImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <HiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-[9/16] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700">
                    <span className="text-2xl text-gray-400">+</span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">
                      Add Mobile
                    </span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/*"
                      onChange={onHomeMobileGalleryChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={onSaveHome}
              disabled={uploading}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {uploading ? "Processing..." : "Save Slideshow"}
            </button>
          </div>
        </div>
      )}

      {/* ABOUT EDIT */}
      {activeSubTab === "about" && (
        <div className="space-y-12">
          <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 max-w-3xl">
            <h3 className="text-xl font-bold mb-6 dark:text-white">
              About Us Section
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  value={aboutData.title}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                  Main Description
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  rows={6}
                  value={aboutData.body}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, body: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <ImageUpload
                  label="Desktop Image"
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Desktop Image
                  </label>
                  <div className="h-40 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center dark:bg-gray-700 relative group">
                    {aboutData.image_url ? (
                      <Image
                        src={aboutData.image_url}
                        alt="Current desktop"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-300">No Image</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Mobile Image
                  </label>
                  <div className="h-40 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center dark:bg-gray-700 relative group">
                    {aboutData.image_url_mobile ? (
                      <Image
                        src={aboutData.image_url_mobile}
                        alt="Current mobile"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-300">No Image</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onSaveAbout}
                disabled={uploading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                {uploading ? "Processing..." : "Save About Content"}
              </button>
            </div>
          </div>

          <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 max-w-3xl">
            <h3 className="text-xl font-bold mb-6 dark:text-white">
              Social Links
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                  WhatsApp Link
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  placeholder="https://wa.me/6281234567890"
                  value={socialLinks.whatsapp}
                  onChange={(e) =>
                    setSocialLinks({
                      ...socialLinks,
                      whatsapp: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                  Instagram Link
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  placeholder="https://instagram.com/username"
                  value={socialLinks.instagram}
                  onChange={(e) =>
                    setSocialLinks({
                      ...socialLinks,
                      instagram: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                  Map Link
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  placeholder="https://maps.google.com/?q=..."
                  value={socialLinks.map}
                  onChange={(e) =>
                    setSocialLinks({
                      ...socialLinks,
                      map: e.target.value,
                    })
                  }
                />
              </div>
              <button
                onClick={onSaveSocialLinks}
                disabled={uploading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                {uploading ? "Processing..." : "Save Social Links"}
              </button>
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6 dark:text-white">
                Studio Values
              </h3>
              <div className="space-y-4">
                {aboutValues.length === 0 && (
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    No values yet. Add the first one below.
                  </p>
                )}
                {aboutValues.map((item, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-start"
                  >
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) =>
                        setAboutValues(
                          aboutValues.map((v, i) =>
                            i === idx ? { ...v, title: e.target.value } : v,
                          ),
                        )
                      }
                    />
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                      placeholder="Short description"
                      value={item.body}
                      onChange={(e) =>
                        setAboutValues(
                          aboutValues.map((v, i) =>
                            i === idx ? { ...v, body: e.target.value } : v,
                          ),
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        setAboutValues(
                          aboutValues.filter((_, i) => i !== idx),
                        )
                      }
                      className="px-3 py-2 text-xs font-bold text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setAboutValues([
                      ...aboutValues,
                      { title: "", body: "" },
                    ])
                  }
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-black"
                >
                  + Add Value
                </button>
              </div>
            </div>

            <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6 dark:text-white">
                Milestones
              </h3>
              <div className="space-y-4">
                {aboutMilestones.length === 0 && (
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    No milestones yet. Add the first one below.
                  </p>
                )}
                {aboutMilestones.map((item, idx) => (
                  <div
                    key={`${item.year}-${idx}`}
                    className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-3 items-start"
                  >
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                      placeholder="Year"
                      value={item.year}
                      onChange={(e) =>
                        setAboutMilestones(
                          aboutMilestones.map((m, i) =>
                            i === idx ? { ...m, year: e.target.value } : m,
                          ),
                        )
                      }
                    />
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                      placeholder="Milestone description"
                      value={item.label}
                      onChange={(e) =>
                        setAboutMilestones(
                          aboutMilestones.map((m, i) =>
                            i === idx ? { ...m, label: e.target.value } : m,
                          ),
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        setAboutMilestones(
                          aboutMilestones.filter((_, i) => i !== idx),
                        )
                      }
                      className="px-3 py-2 text-xs font-bold text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setAboutMilestones([
                      ...aboutMilestones,
                      { year: "", label: "" },
                    ])
                  }
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-black"
                >
                  + Add Milestone
                </button>
              </div>
            </div>

            <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6 dark:text-white">CTA</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                    Eyebrow
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="Start a Project"
                    value={aboutCta.eyebrow}
                    onChange={(e) =>
                      setAboutCta({ ...aboutCta, eyebrow: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us about your project."
                    value={aboutCta.title}
                    onChange={(e) =>
                      setAboutCta({ ...aboutCta, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="CTA description"
                    value={aboutCta.body}
                    onChange={(e) =>
                      setAboutCta({ ...aboutCta, body: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                      Button Label
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                      placeholder="Start a Project"
                      value={aboutCta.button_label}
                      onChange={(e) =>
                        setAboutCta({
                          ...aboutCta,
                          button_label: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                      Button Link
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                      placeholder="https://wa.me/..."
                      value={aboutCta.link}
                      onChange={(e) =>
                        setAboutCta({ ...aboutCta, link: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button
                  onClick={onSaveAboutExtras}
                  disabled={uploading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  {uploading ? "Processing..." : "Save About Extras"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center max-w-3xl">
              <h3 className="text-xl font-bold dark:text-white uppercase tracking-tighter italic">
                Manage Team Members
              </h3>
              <button
                onClick={onAddTeam}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 text-sm transition-transform active:scale-95"
              >
                + Add Member
              </button>
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
                    <tr
                      key={member.id}
                      className="bg-white hover:bg-gray-50 dark:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border bg-gray-50">
                          {member.image_url && (
                            <Image
                              src={member.image_url}
                              alt={
                                member.name
                                  ? `${member.name} portrait`
                                  : "Team member"
                              }
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        <p className="font-bold">{member.name}</p>
                        <p className="text-[10px] text-blue-600 uppercase tracking-widest">
                          {member.role}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onEditTeam(member)}
                          className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteTeam(member.id)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
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
      {activeSubTab === "news" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold dark:text-white">
              Articles & Updates
            </h3>
            <button
              onClick={onAddNews}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 text-sm transition-transform active:scale-95"
            >
              + Write Article
            </button>
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
                  <tr
                    key={news.id}
                    className="bg-white hover:bg-gray-50 dark:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-16 h-10 rounded overflow-hidden border bg-gray-50">
                        {news.image_url && (
                          <Image
                            src={news.image_url}
                            alt={news.title || "News thumbnail"}
                            width={64}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <p className="font-bold">{news.title}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        {news.date}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onEditNews(news)}
                        className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteNews(news.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
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
