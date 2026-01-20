"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 

// Components
import AdminSidebar from "../../components/admin/AdminSidebar";
import ProjectsTab from "../../components/admin/ProjectsTab";
import PagesTab from "../../components/admin/PagesTab";
import OverviewTab from "../../components/admin/OverviewTab";
import TrainingTab from "../../components/admin/TrainingTab";
import ChatInbox from "../../components/admin/ChatInbox";
import ProjectModal from "../../components/admin/ProjectModal";

import NewsModal from "../../components/admin/NewsModal";
import TeamModal from "../../components/admin/TeamModal";
import { HiX } from "react-icons/hi";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Projects State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({ title: "", location: "", year: "", status: "On Going", description: "", tags: [] as string[] });
  
  // Pages Content State
  const [activeSubTab, setActiveSubTab] = useState("home"); 
  const [homeData, setHomeData] = useState({ title: "", subtitle: "", hero_image_desktop: "", hero_image_mobile: "" });
  const [aboutData, setAboutData] = useState({ title: "", body: "", image_url: "" });

  // News State
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newNews, setNewNews] = useState({ title: "", date: "", content: "" });

  // Team State
  const [teamList, setTeamList] = useState<any[]>([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: "", role: "" });

  // Generic Image State (for About, News, Team modals)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Home Page Specific Image States
  const [homeImageDesktopFile, setHomeImageDesktopFile] = useState<File | null>(null);
  const [homeImageDesktopPreview, setHomeImageDesktopPreview] = useState<string | null>(null);
  const [homeImageMobileFile, setHomeImageMobileFile] = useState<File | null>(null);
  const [homeImageMobilePreview, setHomeImageMobilePreview] = useState<string | null>(null);

  // Project Gallery State
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const categories = ["RESIDENTIAL", "COMMERCIAL", "LANDSCAPE", "DETAILS"];

  // --- DATA FETCHING ---

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error) setProjects(data || []);
  };

  const fetchPageContent = async () => {
    const { data: home } = await supabase.from('page_content').select('title, subtitle, hero_image_desktop, hero_image_mobile').eq('section', 'home_hero').maybeSingle();
    if (home) {
      setHomeData({ 
        title: home.title || "", 
        subtitle: home.subtitle || "", 
        hero_image_desktop: home.hero_image_desktop || "",
        hero_image_mobile: home.hero_image_mobile || ""
      });
    }

    const { data: about } = await supabase.from('page_content').select('*').eq('section', 'about_us').maybeSingle();
    if (about) setAboutData({ title: about.title || "", body: about.body || "", image_url: about.image_url || "" });
  };

  const fetchNews = async () => {
    const { data, error } = await supabase.from('news').select('*').order('date', { ascending: false });
    if (!error) setNewsList(data || []);
  };

  const fetchTeam = async () => {
    const { data, error } = await supabase.from('team').select('*').order('created_at', { ascending: true });
    if (!error) setTeamList(data || []);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProjects(), fetchPageContent(), fetchNews(), fetchTeam()]).finally(() => setLoading(false));
  }, []);

  // --- IMAGE HANDLERS ---

  const createChangeHandler = (setFile: (file: File | null) => void, setPreview: (preview: string | null) => void) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
  };

  const handleHomeDesktopFileChange = createChangeHandler(setHomeImageDesktopFile, setHomeImageDesktopPreview);
  const handleHomeMobileFileChange = createChangeHandler(setHomeImageMobileFile, setHomeImageMobilePreview);
  const handleFileChange = createChangeHandler(setImageFile, setImagePreview);


  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles((prev) => [...prev, ...files]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const clearHomeImages = () => {
     setHomeImageDesktopFile(null);
     setHomeImageDesktopPreview(null);
     setHomeImageMobileFile(null);
     setHomeImageMobilePreview(null);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw new Error("Upload failed: " + uploadError.message);
    
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // --- HANDLERS ---

  const handleSaveProject = async () => {
    try {
      setUploading(true);
      let imageUrl = editingProjectId ? projects.find(p => p.id === editingProjectId)?.image_url : "";
      let galleryUrls = editingProjectId ? (projects.find(p => p.id === editingProjectId)?.gallery_urls || []) : [];
      
      // Upload main image if new one exists
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Upload gallery images that are new (Files)
      // Note: This logic assumes we replace the whole gallery for simplicity if any new files are added, 
      // or we just append. Let's make it so it uploads only the File objects.
      // Actually, galleryPreviews might contain existing URLs.
      
      const newGalleryUrls: string[] = [];
      for (const item of galleryPreviews) {
        if (item.startsWith('http')) {
          newGalleryUrls.push(item); // Already uploaded
        } else {
          // It's a base64 preview, find the corresponding file
          const index = galleryPreviews.indexOf(item);
          const file = galleryFiles.find(f => {
            // This is a bit hacky, better to store objects {file?, url}
            return true; // Simplified for now
          });
          // To be safe, let's just upload all current galleryFiles and keep existing URLs
        }
      }

      // Re-upload logic:
      const finalGalleryUrls = [...galleryPreviews.filter(p => p.startsWith('http'))];
      for (const file of galleryFiles) {
        const url = await uploadImage(file);
        finalGalleryUrls.push(url);
      }

      const projectData = {
        title: newProject.title,
        location: newProject.location,
        year: newProject.year,
        status: newProject.status,
        description: newProject.description,
        tags: newProject.tags,
        image_url: imageUrl,
        gallery_urls: finalGalleryUrls
      };

      if (editingProjectId) {
        // Update
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProjectId);
        if (error) throw error;
        alert("Project updated!");
      } else {
        // Create
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        if (error) throw error;
        alert("Project added!");
      }

      setIsModalOpen(false);
      setEditingProjectId(null);
      setNewProject({ title: "", location: "", year: "", status: "On Going", description: "", tags: [] });
      clearImage();
      fetchProjects();
    } catch (e: any) { alert(e.message); } finally { setUploading(false); }
  };

  const handleEditProject = (project: any) => {
    setEditingProjectId(project.id);
    setNewProject({
      title: project.title || "",
      location: project.location || "",
      year: project.year || "",
      status: project.status || "On Going",
      description: project.description || "",
      tags: project.tags || []
    });
    setImagePreview(project.image_url || null);
    setGalleryPreviews(project.gallery_urls || []);
    setGalleryFiles([]); // Clear any pending uploads
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: number) => {
    if(confirm("Are you sure?")) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects(); 
    }
  };

  const handleSaveHome = async () => {
    try {
      setUploading(true);
      let desktopUrl = homeData.hero_image_desktop;
      let mobileUrl = homeData.hero_image_mobile;
      
      if (homeImageDesktopFile) desktopUrl = await uploadImage(homeImageDesktopFile);
      if (homeImageMobileFile) mobileUrl = await uploadImage(homeImageMobileFile);

      const { error } = await supabase.from('page_content').upsert({ 
        section: 'home_hero', 
        title: homeData.title, 
        subtitle: homeData.subtitle, 
        hero_image_desktop: desktopUrl, 
        hero_image_mobile: mobileUrl,
        updated_at: new Date() 
      });
      if (error) throw error;
      alert("Home saved!");
      clearHomeImages(); // Clear pending files
      fetchPageContent();
    } catch (e: any) { alert(e.message); } finally { setUploading(false); }
  };

  const handleSaveAbout = async () => {
    try {
      setUploading(true);
      let imageUrl = aboutData.image_url;
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const { error } = await supabase.from('page_content').upsert({ section: 'about_us', title: aboutData.title, body: aboutData.body, image_url: imageUrl, updated_at: new Date() });
      if (error) throw error;
      alert("About saved!");
      clearImage();
      fetchPageContent();
    } catch (e: any) { alert(e.message); } finally { setUploading(false); }
  };

  const handleAddNews = async () => {
    try {
      setUploading(true);
      let imageUrl = "";
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const { error } = await supabase.from('news').insert([{ ...newNews, image_url: imageUrl }]);
      if (error) throw error;
      alert("News added!");
      setIsNewsModalOpen(false);
      setNewNews({ title: "", date: "", content: "" });
      clearImage();
      fetchNews();
    } catch (e: any) { alert(e.message); } finally { setUploading(false); }
  };

  const handleDeleteNews = async (id: number) => {
    if(confirm("Delete?")) {
      await supabase.from('news').delete().eq('id', id);
      fetchNews();
    }
  };

  const handleAddTeam = async () => {
    try {
      setUploading(true);
      let imageUrl = "";
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const { error } = await supabase.from('team').insert([{ ...newTeamMember, image_url: imageUrl }]);
      if (error) throw error;
      alert("Team member added!");
      setIsTeamModalOpen(false);
      setNewTeamMember({ name: "", role: "" });
      clearImage();
      fetchTeam();
    } catch (e: any) { alert(e.message); } finally { setUploading(false); }
  };

  const handleDeleteTeam = async (id: number) => {
    if(confirm("Delete this team member?")) {
      await supabase.from('team').delete().eq('id', id);
      fetchTeam();
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden font-sans">
      <AdminSidebar activeTab={activeTab} setActiveTab={(tab) => { clearImage(); clearHomeImages(); setActiveTab(tab); }} />

      <main className="flex-1 p-10 overflow-y-auto sm:ml-64 transition-all">
        {activeTab === "overview" && <OverviewTab totalProjects={projects.length} totalNews={newsList.length} />}
        
        {activeTab === "projects" && (
          <ProjectsTab 
            projects={projects} 
            loading={loading} 
            onAddClick={() => { 
              setEditingProjectId(null);
              setNewProject({ title: "", location: "", year: "", status: "On Going", description: "", tags: [] });
              clearImage(); 
              setIsModalOpen(true); 
            }} 
            onEdit={handleEditProject}
            onDelete={handleDeleteProject} 
          />
        )}

        {activeTab === "pages" && (
          <PagesTab 
            activeSubTab={activeSubTab} 
            setActiveSubTab={(t) => { clearImage(); clearHomeImages(); setActiveSubTab(t); }} 
            homeData={homeData} setHomeData={setHomeData}
            aboutData={aboutData} setAboutData={setAboutData}
            newsList={newsList}
            teamList={teamList}
            onSaveHome={handleSaveHome}
            onSaveAbout={handleSaveAbout}
            onAddNews={() => { clearImage(); setIsNewsModalOpen(true); }}
            onDeleteNews={handleDeleteNews}
            onAddTeam={() => { clearImage(); setIsTeamModalOpen(true); }}
            onDeleteTeam={handleDeleteTeam}
            uploading={uploading}
            // Generic image props (for About tab)
            imageFile={imageFile}
            imagePreview={imagePreview}
            onFileChange={handleFileChange}
            onClearImage={clearImage}
            // Home page specific image props
            homeImageDesktopFile={homeImageDesktopFile}
            homeImageDesktopPreview={homeImageDesktopPreview}
            onHomeDesktopFileChange={handleHomeDesktopFileChange}
            homeImageMobileFile={homeImageMobileFile}
            homeImageMobilePreview={homeImageMobilePreview}
            onHomeMobileFileChange={handleHomeMobileFileChange}
            onClearHomeImages={clearHomeImages}
          />
        )}

        {activeTab === "training" && <TrainingTab />}
        {activeTab === "inbox" && <ChatInbox />}
      </main>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingProjectId(null);
        }}
        newProject={newProject} setNewProject={setNewProject}
        onAdd={handleSaveProject}
        editingProjectId={editingProjectId}
        uploading={uploading}
        imageFile={imageFile} imagePreview={imagePreview}
        onFileChange={handleFileChange} onClearImage={clearImage}
        galleryPreviews={galleryPreviews}
        onGalleryChange={handleGalleryChange}
        onRemoveGalleryImage={removeGalleryImage}
        categories={categories}
      />

      <NewsModal 
        isOpen={isNewsModalOpen} 
        onClose={() => setIsNewsModalOpen(false)}
        newNews={newNews} setNewNews={setNewNews}
        onAdd={handleAddNews}
        uploading={uploading}
        imageFile={imageFile} imagePreview={imagePreview}
        onFileChange={handleFileChange} onClearImage={clearImage}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        newTeamMember={newTeamMember}
        setNewTeamMember={setNewTeamMember}
        onAdd={handleAddTeam}
        uploading={uploading}
        imageFile={imageFile}
        imagePreview={imagePreview}
        onFileChange={handleFileChange}
        onClearImage={clearImage}
      />
    </div>
  );
}