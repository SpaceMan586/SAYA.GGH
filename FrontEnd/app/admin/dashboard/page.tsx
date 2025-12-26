"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 

// Components
import AdminSidebar from "../../components/admin/AdminSidebar";
import OverviewTab from "../../components/admin/OverviewTab";
import ProjectsTab from "../../components/admin/ProjectsTab";
import PagesTab from "../../components/admin/PagesTab";
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
  const [homeData, setHomeData] = useState({ title: "", subtitle: "", image_url: "" });
  const [aboutData, setAboutData] = useState({ title: "", body: "", image_url: "" });

  // News State
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newNews, setNewNews] = useState({ title: "", date: "", content: "" });

  // Team State
  const [teamList, setTeamList] = useState<any[]>([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: "", role: "" });

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categories = ["RESIDENTIAL", "COMMERCIAL", "LANDSCAPE", "DETAILS"];

  // --- DATA FETCHING ---

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error) setProjects(data || []);
  };

  const fetchPageContent = async () => {
    const { data: home } = await supabase.from('page_content').select('*').eq('section', 'home_hero').maybeSingle();
    if (home) setHomeData({ title: home.title || "", subtitle: home.subtitle || "", image_url: home.image_url || "" });

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

  // --- IMAGE HANDLERS (ORIGINAL FILE) ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
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
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const projectData = {
        title: newProject.title,
        location: newProject.location,
        year: newProject.year,
        status: newProject.status,
        description: newProject.description,
        tags: newProject.tags,
        image_url: imageUrl
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
      let imageUrl = homeData.image_url;
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const { error } = await supabase.from('page_content').upsert({ section: 'home_hero', title: homeData.title, subtitle: homeData.subtitle, image_url: imageUrl, updated_at: new Date() });
      if (error) throw error;
      alert("Home saved!");
      clearImage();
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
      <AdminSidebar activeTab={activeTab} setActiveTab={(tab) => { clearImage(); setActiveTab(tab); }} />

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
            setActiveSubTab={(t) => { clearImage(); setActiveSubTab(t); }} 
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
            imageFile={imageFile}
            imagePreview={imagePreview}
            onFileChange={handleFileChange}
            onClearImage={clearImage}
          />
        )}
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