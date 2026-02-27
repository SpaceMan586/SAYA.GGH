"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAdminContext } from "../AdminContext";

// Components
import ProjectsTab from "@/components/admin/ProjectsTab";
import PagesTab from "@/components/admin/PagesTab";
import OverviewTab from "@/components/admin/OverviewTab";
import TrainingTab from "@/components/admin/TrainingTab";
import ChatInbox from "@/components/admin/ChatInbox";
import ProjectModal from "@/components/admin/ProjectModal";
import NewsModal from "@/components/admin/NewsModal";
import TeamModal from "@/components/admin/TeamModal";

type GalleryItem = {
  preview: string;
  file: File | null;
  isExisting: boolean;
};

type HomeHeroData = {
  desktop_urls: string[];
  mobile_urls: string[];
};

const parseGalleryUrls = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (url): url is string => typeof url === "string" && url.trim().length > 0,
    );
  }

  if (typeof value === "string" && value.trim().length > 0) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (url): url is string =>
            typeof url === "string" && url.trim().length > 0,
        );
      }
    } catch {
      return [];
    }
  }

  return [];
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });

export default function DashboardPage() {
  const { activeTab, setActiveTab } = useAdminContext();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Projects State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingProjectImageUrlMobile, setEditingProjectImageUrlMobile] =
    useState<string>("");
  const [newProject, setNewProject] = useState({
    title: "",
    location: "",
    year: "",
    status: "On Going",
    description: "",
    tags: [] as string[],
  });

  // Pages Content State
  const [activeSubTab, setActiveSubTab] = useState("home");
  const [, setHomeData] = useState<HomeHeroData>({
    desktop_urls: [],
    mobile_urls: [],
  });
  const [homeDesktopGalleryItems, setHomeDesktopGalleryItems] = useState<
    GalleryItem[]
  >([]);
  const [homeMobileGalleryItems, setHomeMobileGalleryItems] = useState<
    GalleryItem[]
  >([]);
  const [aboutData, setAboutData] = useState({
    title: "",
    body: "",
    image_url: "",
    image_url_mobile: "",
  });
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: "",
    instagram: "",
    map: "",
  });
  const [aboutValues, setAboutValues] = useState<
    { title: string; body: string }[]
  >([]);
  const [aboutMilestones, setAboutMilestones] = useState<
    { year: string; label: string }[]
  >([]);
  const [aboutCta, setAboutCta] = useState({
    eyebrow: "",
    title: "",
    body: "",
    button_label: "",
    link: "",
  });

  // News State
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [editingNewsImageUrl, setEditingNewsImageUrl] = useState<string>("");
  const [editingNewsImageUrlMobile, setEditingNewsImageUrlMobile] =
    useState<string>("");
  const [newNews, setNewNews] = useState({ title: "", date: "", content: "" });
  const [newsGalleryItems, setNewsGalleryItems] = useState<GalleryItem[]>([]);

  // Team State
  const [teamList, setTeamList] = useState<any[]>([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editingTeamImageUrl, setEditingTeamImageUrl] = useState<string>("");
  const [editingTeamImageUrlMobile, setEditingTeamImageUrlMobile] =
    useState<string>("");
  const [newTeamMember, setNewTeamMember] = useState({ name: "", role: "" });

  // Generic Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileMobile, setImageFileMobile] = useState<File | null>(null);
  const [imagePreviewMobile, setImagePreviewMobile] = useState<string | null>(
    null,
  );

  // Project Gallery State
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const categories = ["residential", "public", "details"];

  // --- DATA FETCHING ---

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setProjects(data || []);
  };

  const fetchPageContent = async () => {
    const emptyHomeData: HomeHeroData = { desktop_urls: [], mobile_urls: [] };
    const { data: home } = await supabase
      .from("page_content")
      .select("body")
      .eq("section", "home_hero")
      .maybeSingle();
    if (home?.body) {
      try {
        const parsed = JSON.parse(home.body);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const desktopUrls = parseGalleryUrls(
            (parsed as { desktop_urls?: unknown }).desktop_urls,
          );
          const mobileUrls = parseGalleryUrls(
            (parsed as { mobile_urls?: unknown }).mobile_urls,
          );

          setHomeData({ desktop_urls: desktopUrls, mobile_urls: mobileUrls });
          setHomeDesktopGalleryItems(
            desktopUrls.map((url) => ({
              preview: url,
              file: null,
              isExisting: true,
            })),
          );
          setHomeMobileGalleryItems(
            mobileUrls.map((url) => ({
              preview: url,
              file: null,
              isExisting: true,
            })),
          );
        } else {
          setHomeData(emptyHomeData);
          setHomeDesktopGalleryItems([]);
          setHomeMobileGalleryItems([]);
        }
      } catch (e) {
        console.error("Error parsing home hero body:", e);
        setHomeData(emptyHomeData);
        setHomeDesktopGalleryItems([]);
        setHomeMobileGalleryItems([]);
      }
    } else {
      setHomeData(emptyHomeData);
      setHomeDesktopGalleryItems([]);
      setHomeMobileGalleryItems([]);
    }

    const { data: about } = await supabase
      .from("page_content")
      .select("*")
      .eq("section", "about_us")
      .maybeSingle();
    if (about)
      setAboutData({
        title: about.title || "",
        body: about.body || "",
        image_url: about.image_url || "",
        image_url_mobile: about.image_url_mobile || "",
      });

    const { data: socials } = await supabase
      .from("page_content")
      .select("body")
      .eq("section", "social_links")
      .maybeSingle();
    if (socials && socials.body) {
      try {
        const parsed = JSON.parse(socials.body);
        setSocialLinks({
          whatsapp: parsed?.whatsapp || "",
          instagram: parsed?.instagram || "",
          map: parsed?.map || "",
        });
      } catch (e) {
        console.error("Error parsing social links:", e);
        setSocialLinks({ whatsapp: "", instagram: "", map: "" });
      }
    }

    const { data: values } = await supabase
      .from("page_content")
      .select("body")
      .eq("section", "about_values")
      .maybeSingle();
    if (values?.body) {
      try {
        const parsed = JSON.parse(values.body);
        if (Array.isArray(parsed)) {
          setAboutValues(
            parsed.map((v: any) => ({
              title: v?.title || "",
              body: v?.body || "",
            })),
          );
        }
      } catch (e) {
        console.error("Error parsing about values:", e);
      }
    }

    const { data: milestones } = await supabase
      .from("page_content")
      .select("body")
      .eq("section", "about_milestones")
      .maybeSingle();
    if (milestones?.body) {
      try {
        const parsed = JSON.parse(milestones.body);
        if (Array.isArray(parsed)) {
          setAboutMilestones(
            parsed.map((m: any) => ({
              year: m?.year || "",
              label: m?.label || "",
            })),
          );
        }
      } catch (e) {
        console.error("Error parsing about milestones:", e);
      }
    }

    const { data: cta } = await supabase
      .from("page_content")
      .select("body")
      .eq("section", "about_cta")
      .maybeSingle();
    if (cta?.body) {
      try {
        const parsed = JSON.parse(cta.body);
        setAboutCta({
          eyebrow: parsed?.eyebrow || "",
          title: parsed?.title || "",
          body: parsed?.body || "",
          button_label: parsed?.button_label || "",
          link: parsed?.link || "",
        });
      } catch (e) {
        console.error("Error parsing about cta:", e);
      }
    }
  };

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("date", { ascending: false });
    if (!error) setNewsList(data || []);
  };

  const fetchTeam = async () => {
    const { data, error } = await supabase
      .from("team")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error) setTeamList(data || []);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchProjects(),
      fetchPageContent(),
      fetchNews(),
      fetchTeam(),
    ]).finally(() => setLoading(false));
  }, []);

  // --- IMAGE HANDLERS ---

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

  const handleMobileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFileMobile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviewMobile(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreviewMobile(null);
    }
  };

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

  const handleHomeDesktopGalleryChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = e.target;
    const files = Array.from(input.files || []);
    if (files.length === 0) return;

    const previews = await Promise.all(files.map((file) => fileToDataUrl(file)));
    const nextItems = previews.map((preview, idx) => ({
      preview,
      file: files[idx],
      isExisting: false,
    }));
    setHomeDesktopGalleryItems((prev) => [...prev, ...nextItems]);
    input.value = "";
  };

  const handleHomeMobileGalleryChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = e.target;
    const files = Array.from(input.files || []);
    if (files.length === 0) return;

    const previews = await Promise.all(files.map((file) => fileToDataUrl(file)));
    const nextItems = previews.map((preview, idx) => ({
      preview,
      file: files[idx],
      isExisting: false,
    }));
    setHomeMobileGalleryItems((prev) => [...prev, ...nextItems]);
    input.value = "";
  };

  const removeHomeDesktopGalleryImage = (index: number) => {
    setHomeDesktopGalleryItems((prev) => prev.filter((_, i) => i !== index));
  };

  const removeHomeMobileGalleryImage = (index: number) => {
    setHomeMobileGalleryItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewsGalleryChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = e.target;
    const files = Array.from(input.files || []);
    if (files.length === 0) return;

    const previews = await Promise.all(files.map((file) => fileToDataUrl(file)));
    const nextItems = previews.map((preview, idx) => ({
      preview,
      file: files[idx],
      isExisting: false,
    }));
    setNewsGalleryItems((prev) => [...prev, ...nextItems]);
    input.value = "";
  };

  const removeNewsGalleryImage = (index: number) => {
    setNewsGalleryItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearNewsGallery = () => {
    setNewsGalleryItems([]);
  };

  const clearDesktopImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const clearMobileImage = () => {
    setImageFileMobile(null);
    setImagePreviewMobile(null);
  };

  const clearImages = () => {
    clearDesktopImage();
    clearMobileImage();
    setGalleryFiles([]);
    setGalleryPreviews([]);
    clearNewsGallery();
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) throw new Error("Upload failed: " + uploadError.message);

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  // --- HANDLERS ---

  const handleSaveProject = async () => {
    try {
      setUploading(true);
      let imageUrl = editingProjectId
        ? projects.find((p) => p.id === editingProjectId)?.image_url
        : "";
      let imageUrlMobile = editingProjectId
        ? editingProjectImageUrlMobile || ""
        : "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      if (imageFileMobile) {
        imageUrlMobile = await uploadImage(imageFileMobile);
      } else if (editingProjectId && imagePreviewMobile === null) {
        imageUrlMobile = "";
      }

      const finalGalleryUrls = [
        ...galleryPreviews.filter((p) => p.startsWith("http")),
      ];
      for (const file of galleryFiles) {
        const url = await uploadImage(file);
        finalGalleryUrls.push(url);
      }

      const projectData = {
        ...newProject,
        image_url: imageUrl,
        image_url_mobile: imageUrlMobile,
        gallery_urls: finalGalleryUrls,
      };

      if (editingProjectId) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingProjectId);
        if (error) throw error;
        alert("Project updated!");
      } else {
        const { error } = await supabase.from("projects").insert([projectData]);
        if (error) throw error;
        alert("Project added!");
      }

      setIsModalOpen(false);
      setEditingProjectId(null);
      setEditingProjectImageUrlMobile("");
      setNewProject({
        title: "",
        location: "",
        year: "",
        status: "On Going",
        description: "",
        tags: [],
      });
      clearImages();
      fetchProjects();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditProject = (project: any) => {
    setEditingProjectId(project.id);
    setEditingProjectImageUrlMobile(project.image_url_mobile || "");
    setNewProject({
      title: project.title || "",
      location: project.location || "",
      year: project.year || "",
      status: project.status || "On Going",
      description: project.description || "",
      tags: project.tags || [],
    });
    setImagePreview(project.image_url || null);
    setImagePreviewMobile(project.image_url_mobile || null);
    setGalleryPreviews(project.gallery_urls || []);
    setGalleryFiles([]);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm("Are you sure?")) {
      await supabase.from("projects").delete().eq("id", id);
      fetchProjects();
    }
  };

  const handleSaveHome = async () => {
    try {
      setUploading(true);
      const finalDesktopUrls: string[] = [];
      const finalMobileUrls: string[] = [];

      for (const item of homeDesktopGalleryItems) {
        if (item.file) {
          const uploadedUrl = await uploadImage(item.file);
          finalDesktopUrls.push(uploadedUrl);
        } else if (item.isExisting && item.preview.startsWith("http")) {
          finalDesktopUrls.push(item.preview);
        }
      }

      for (const item of homeMobileGalleryItems) {
        if (item.file) {
          const uploadedUrl = await uploadImage(item.file);
          finalMobileUrls.push(uploadedUrl);
        } else if (item.isExisting && item.preview.startsWith("http")) {
          finalMobileUrls.push(item.preview);
        }
      }

      const payload: HomeHeroData = {
        desktop_urls: finalDesktopUrls,
        mobile_urls: finalMobileUrls,
      };

      const { error } = await supabase.from("page_content").upsert({
        section: "home_hero",
        body: JSON.stringify(payload),
        updated_at: new Date(),
      });
      if (error) throw error;
      setHomeData(payload);
      alert("Homepage Slideshow saved!");
      fetchPageContent();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAbout = async () => {
    try {
      setUploading(true);
      let imageUrl = aboutData.image_url;
      let imageUrlMobile = aboutData.image_url_mobile;
      if (imageFile) imageUrl = await uploadImage(imageFile);
      if (imageFileMobile) imageUrlMobile = await uploadImage(imageFileMobile);
      const { error } = await supabase
        .from("page_content")
        .upsert({
          section: "about_us",
          title: aboutData.title,
          body: aboutData.body,
          image_url: imageUrl,
          image_url_mobile: imageUrlMobile,
          updated_at: new Date(),
        });
      if (error) throw error;
      alert("About saved!");
      clearImages();
      fetchPageContent();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSocialLinks = async () => {
    try {
      setUploading(true);
      const { error } = await supabase.from("page_content").upsert({
        section: "social_links",
        body: JSON.stringify({
          whatsapp: socialLinks.whatsapp || "",
          instagram: socialLinks.instagram || "",
          map: socialLinks.map || "",
        }),
        updated_at: new Date(),
      });
      if (error) throw error;
      alert("Social links saved!");
      fetchPageContent();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAboutExtras = async () => {
    try {
      setUploading(true);
      const { error: valuesError } = await supabase.from("page_content").upsert({
        section: "about_values",
        body: JSON.stringify(aboutValues),
        updated_at: new Date(),
      });
      if (valuesError) throw valuesError;

      const { error: milestonesError } = await supabase
        .from("page_content")
        .upsert({
          section: "about_milestones",
          body: JSON.stringify(aboutMilestones),
          updated_at: new Date(),
        });
      if (milestonesError) throw milestonesError;

      const { error: ctaError } = await supabase.from("page_content").upsert({
        section: "about_cta",
        body: JSON.stringify(aboutCta),
        updated_at: new Date(),
      });
      if (ctaError) throw ctaError;

      alert("About extras saved!");
      fetchPageContent();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddNews = async () => {
    try {
      setUploading(true);
      let imageUrl = editingNewsImageUrl || "";
      let imageUrlMobile = editingNewsImageUrlMobile || "";
      if (imageFile) imageUrl = await uploadImage(imageFile);
      if (imageFileMobile) {
        imageUrlMobile = await uploadImage(imageFileMobile);
      } else if (editingNewsId && imagePreviewMobile === null) {
        imageUrlMobile = "";
      }

      const finalGalleryUrls: string[] = [];
      for (const item of newsGalleryItems) {
        if (item.file) {
          const uploadedUrl = await uploadImage(item.file);
          finalGalleryUrls.push(uploadedUrl);
        } else if (item.isExisting && item.preview.startsWith("http")) {
          finalGalleryUrls.push(item.preview);
        }
      }

      const newsPayload = {
        ...newNews,
        image_url: imageUrl,
        image_url_mobile: imageUrlMobile,
        gallery_urls: finalGalleryUrls,
      };

      if (editingNewsId) {
        const { error } = await supabase
          .from("news")
          .update(newsPayload)
          .eq("id", editingNewsId);
        if (error) throw error;
        alert("News updated!");
      } else {
        const { error } = await supabase.from("news").insert([newsPayload]);
        if (error) throw error;
        alert("News added!");
      }
      setIsNewsModalOpen(false);
      setEditingNewsId(null);
      setEditingNewsImageUrl("");
      setEditingNewsImageUrlMobile("");
      setNewNews({ title: "", date: "", content: "" });
      clearImages();
      fetchNews();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (confirm("Delete?")) {
      await supabase.from("news").delete().eq("id", id);
      fetchNews();
    }
  };

  const handleEditNews = (news: any) => {
    clearImages();
    setEditingNewsId(news.id);
    setEditingNewsImageUrl(news.image_url || "");
    setEditingNewsImageUrlMobile(news.image_url_mobile || "");
    setNewNews({
      title: news.title || "",
      date: news.date || "",
      content: news.content || "",
    });
    setImagePreview(news.image_url || null);
    setImagePreviewMobile(news.image_url_mobile || null);
    setNewsGalleryItems(
      parseGalleryUrls(news.gallery_urls).map((url) => ({
        preview: url,
        file: null,
        isExisting: true,
      })),
    );
    setIsNewsModalOpen(true);
  };

  const handleSaveTeam = async () => {
    try {
      setUploading(true);
      let imageUrl = editingTeamId ? editingTeamImageUrl || "" : "";
      let imageUrlMobile = editingTeamId ? editingTeamImageUrlMobile || "" : "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      } else if (editingTeamId && imagePreview === null) {
        // If editing and image was cleared, remove it
        imageUrl = "";
      }
      if (imageFileMobile) {
        imageUrlMobile = await uploadImage(imageFileMobile);
      } else if (editingTeamId && imagePreviewMobile === null) {
        imageUrlMobile = "";
      }

      if (editingTeamId) {
        const { error } = await supabase
          .from("team")
          .update({
            ...newTeamMember,
            image_url: imageUrl,
            image_url_mobile: imageUrlMobile,
          })
          .eq("id", editingTeamId);
        if (error) throw error;
        alert("Team member updated!");
      } else {
        const { error } = await supabase
          .from("team")
          .insert([
            {
              ...newTeamMember,
              image_url: imageUrl,
              image_url_mobile: imageUrlMobile,
            },
          ]);
        if (error) throw error;
        alert("Team member added!");
      }
      setIsTeamModalOpen(false);
      setEditingTeamId(null);
      setEditingTeamImageUrl("");
      setEditingTeamImageUrlMobile("");
      setNewTeamMember({ name: "", role: "" });
      clearImages();
      fetchTeam();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (confirm("Delete this team member?")) {
      await supabase.from("team").delete().eq("id", id);
      fetchTeam();
    }
  };

  const handleEditTeam = (member: any) => {
    clearImages();
    setEditingTeamId(member.id);
    setEditingTeamImageUrl(member.image_url || "");
    setEditingTeamImageUrlMobile(member.image_url_mobile || "");
    setNewTeamMember({
      name: member.name || "",
      role: member.role || "",
    });
    setImagePreview(member.image_url || null);
    setImagePreviewMobile(member.image_url_mobile || null);
    setIsTeamModalOpen(true);
  };

  const handleSubTabChange = (tab: string) => {
    clearImages();
    setActiveSubTab(tab);
  };

  return (
    <>
      {activeTab === "overview" && (
        <OverviewTab
          totalProjects={projects.length}
          totalNews={newsList.length}
        />
      )}

      {activeTab === "projects" && (
        <ProjectsTab
          projects={projects}
          loading={loading}
          onAddClick={() => {
            setEditingProjectId(null);
            setEditingProjectImageUrlMobile("");
            setNewProject({
              title: "",
              location: "",
              year: "",
              status: "On Going",
              description: "",
              tags: [],
            });
            clearImages();
            setIsModalOpen(true);
          }}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      )}

      {activeTab === "pages" && (
        <PagesTab
          activeSubTab={activeSubTab}
          setActiveSubTab={handleSubTabChange}
          homeDesktopPreviews={homeDesktopGalleryItems.map((item) => item.preview)}
          homeMobilePreviews={homeMobileGalleryItems.map((item) => item.preview)}
          onHomeDesktopGalleryChange={handleHomeDesktopGalleryChange}
          onHomeMobileGalleryChange={handleHomeMobileGalleryChange}
          onRemoveHomeDesktopImage={removeHomeDesktopGalleryImage}
          onRemoveHomeMobileImage={removeHomeMobileGalleryImage}
          aboutData={aboutData}
          setAboutData={setAboutData}
          socialLinks={socialLinks}
          setSocialLinks={setSocialLinks}
          aboutValues={aboutValues}
          setAboutValues={setAboutValues}
          aboutMilestones={aboutMilestones}
          setAboutMilestones={setAboutMilestones}
          aboutCta={aboutCta}
          setAboutCta={setAboutCta}
          newsList={newsList}
          teamList={teamList}
          onSaveHome={handleSaveHome}
          onSaveAbout={handleSaveAbout}
          onSaveSocialLinks={handleSaveSocialLinks}
          onSaveAboutExtras={handleSaveAboutExtras}
          onAddNews={() => {
            clearImages();
            setEditingNewsId(null);
            setEditingNewsImageUrl("");
            setEditingNewsImageUrlMobile("");
            setIsNewsModalOpen(true);
          }}
          onEditNews={handleEditNews}
          onDeleteNews={handleDeleteNews}
          onAddTeam={() => {
            clearImages();
            setEditingTeamId(null);
            setEditingTeamImageUrl("");
            setEditingTeamImageUrlMobile("");
            setIsTeamModalOpen(true);
          }}
          onEditTeam={handleEditTeam}
          onDeleteTeam={handleDeleteTeam}
          uploading={uploading}
          imageFile={imageFile}
          imagePreview={imagePreview}
          onFileChange={handleFileChange}
          onClearImage={clearDesktopImage}
          imageFileMobile={imageFileMobile}
          imagePreviewMobile={imagePreviewMobile}
          onMobileFileChange={handleMobileFileChange}
          onClearMobileImage={clearMobileImage}
        />
      )}

      {activeTab === "training" && <TrainingTab />}
      {activeTab === "inbox" && <ChatInbox />}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProjectId(null);
        }}
        newProject={newProject}
        setNewProject={setNewProject}
        onAdd={handleSaveProject}
        editingProjectId={editingProjectId}
        uploading={uploading}
        imageFile={imageFile}
        imagePreview={imagePreview}
        onFileChange={handleFileChange}
        onClearImage={clearDesktopImage}
        imageFileMobile={imageFileMobile}
        imagePreviewMobile={imagePreviewMobile}
        onMobileFileChange={handleMobileFileChange}
        onClearMobileImage={clearMobileImage}
        galleryPreviews={galleryPreviews}
        onGalleryChange={handleGalleryChange}
        onRemoveGalleryImage={removeGalleryImage}
        categories={categories}
      />

      <NewsModal
        isOpen={isNewsModalOpen}
        onClose={() => setIsNewsModalOpen(false)}
        newNews={newNews}
        setNewNews={setNewNews}
        onAdd={handleAddNews}
        mode={editingNewsId ? "edit" : "create"}
        uploading={uploading}
        imageFile={imageFile}
        imagePreview={imagePreview}
        onFileChange={handleFileChange}
        onClearImage={clearDesktopImage}
        imageFileMobile={imageFileMobile}
        imagePreviewMobile={imagePreviewMobile}
        onMobileFileChange={handleMobileFileChange}
        onClearMobileImage={clearMobileImage}
        galleryPreviews={newsGalleryItems.map((item) => item.preview)}
        onGalleryChange={handleNewsGalleryChange}
        onRemoveGalleryImage={removeNewsGalleryImage}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        newTeamMember={newTeamMember}
        setNewTeamMember={setNewTeamMember}
        onSave={handleSaveTeam}
        mode={editingTeamId ? "edit" : "create"}
        uploading={uploading}
        imageFile={imageFile}
        imagePreview={imagePreview}
        onFileChange={handleFileChange}
        onClearImage={clearDesktopImage}
        imageFileMobile={imageFileMobile}
        imagePreviewMobile={imagePreviewMobile}
        onMobileFileChange={handleMobileFileChange}
        onClearMobileImage={clearMobileImage}
      />
    </>
  );
}
