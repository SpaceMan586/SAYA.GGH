"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { HiPhotograph } from "react-icons/hi";
import Image from "next/image";
import ResponsiveImage from "@/components/shared/ResponsiveImage";

// Define the type for a single image in the details view
interface ProjectImage {
  id: number;
  projectId: number;
  imageUrl: string;
  projectTitle: string;
}

export default function ProjectClient() {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");

  const [projects, setProjects] = useState<any[]>([]);
  const [allImages, setAllImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);

      let query = supabase
        .from("projects")
        .select(
          "id, title, location, year, image_url, image_url_mobile, gallery_urls, tags",
        )
        .order("created_at", { ascending: false });

      // If a tag is specified (and it's not 'details'), filter by it
      if (tag && tag !== "details") {
        query = query.contains("tags", [tag]);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } else {
        const projectsData = data || [];
        setProjects(projectsData);

        // If the view is 'details', process all images
        if (tag === "details") {
          let imageIdCounter = 0;
          const flattenedImages = projectsData.flatMap((project) => {
            const projectImages: ProjectImage[] = [];
            // Add the main image
            if (project.image_url) {
              projectImages.push({
                id: imageIdCounter++,
                projectId: project.id,
                imageUrl: project.image_url,
                projectTitle: project.title,
              });
            }
            // Add gallery images
            if (project.gallery_urls && Array.isArray(project.gallery_urls)) {
              project.gallery_urls.forEach((url: string) => {
                projectImages.push({
                  id: imageIdCounter++,
                  projectId: project.id,
                  imageUrl: url,
                  projectTitle: project.title,
                });
              });
            }
            return projectImages;
          });
          setAllImages(flattenedImages);
        }
      }
      setLoading(false);
    };

    fetchProjects();
  }, [tag]);

  const getHeaderText = () => {
    if (tag === "residential") return "Residential Works";
    if (tag === "public") return "Public Works";
    if (tag === "details") return "All Details";
    return "Selected Works";
  };

  const countByTag = (key: string | null) => {
    if (key === "details") return allImages.length;
    if (!key) return projects.length;
    return projects.filter((p) => Array.isArray(p.tags) && p.tags.includes(key))
      .length;
  };

  const filters = [
    { key: null, label: "Selected" },
    { key: "residential", label: "Residential" },
    { key: "public", label: "Public" },
    { key: "details", label: "Details" },
  ];

  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilter =
    filters.find((f) => f.key === tag) || filters.find((f) => f.key === null);

  const renderStandardGrid = () => (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 md:gap-6 space-y-5 md:space-y-6">
      {projects.map((project, index) => (
        <Link
          key={project.id}
          href={`/project/${project.id}`}
          className="break-inside-avoid block group"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <div className="relative overflow-hidden bg-gray-100 rounded-2xl shadow-sm transition-all duration-700 group-hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {project.image_url ? (
              <div className="relative w-full aspect-[4/3]">
                <ResponsiveImage
                  desktopSrc={project.image_url}
                  mobileSrc={project.image_url_mobile || project.image_url}
                  alt={project.title || "Project image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] flex items-center justify-center text-gray-300">
                <HiPhotograph className="w-16 h-16 opacity-20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 p-6 w-full z-10 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500">
              <h3 className="text-xl font-semibold uppercase text-white leading-none">
                {project.title}
              </h3>
              <div className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-300 mt-1">
                <span>{project.location}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                <span>{project.year}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 md:mt-4 border-l-2 border-gray-200 pl-4">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] md:tracking-[0.3em] text-gray-400">
              {project.location || "Undisclosed"}
            </p>
            <h3 className="text-base md:text-lg font-semibold tracking-tight text-black mt-1">
              {project.title}
            </h3>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mt-1">
              {project.year || "—"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderDetailsGrid = () => (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
      {allImages.map((image, index) => (
        <Link
          key={image.id}
          href={`/project/${image.projectId}`}
          className="break-inside-avoid block group"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <div className="relative overflow-hidden bg-gray-100 rounded-2xl shadow-sm transition-all duration-700 group-hover:shadow-lg group-hover:!opacity-100 opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative w-full">
              <Image
                src={image.imageUrl}
                alt={image.projectTitle || "Project image"}
                width={1200}
                height={900}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 20vw"
                className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 p-3 w-full z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <h3 className="text-xs font-bold uppercase text-white leading-none tracking-widest">
                {image.projectTitle}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-5 md:px-16 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="rounded-2xl md:rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 md:gap-8">
            <div>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.45em] text-gray-400">
                Architecture & Interior Design
              </p>
              <h1 className="text-2xl md:text-5xl font-semibold tracking-tight uppercase text-black mt-2 md:mt-3">
                {getHeaderText()}
              </h1>
              <p className="text-sm text-gray-600 mt-3 max-w-2xl">
                Browse our studio work by category or dive into details for a
                closer look at materials, light, and craft.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {filters.map((filter) => {
                const active =
                  (filter.key === null && !tag) || filter.key === tag;
                const href = filter.key
                  ? `/project?tag=${filter.key}`
                  : "/project";
                const count = countByTag(filter.key);
                return (
                  <Link
                    key={filter.label}
                    href={href}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] md:tracking-[0.3em] transition-colors ${
                      active
                        ? "bg-black text-white"
                        : "bg-white border border-gray-200 text-gray-500 hover:text-black hover:border-gray-300"
                    }`}
                  >
                    {filter.label}
                    <span className="ml-2 text-[9px] opacity-70">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="md:hidden relative">
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="flex items-center gap-3 px-4 py-2 rounded-full border border-gray-200 bg-white text-xs font-bold uppercase tracking-[0.25em] text-gray-700"
                aria-expanded={filtersOpen}
                aria-label="Toggle filters"
              >
                {activeFilter?.label || "Selected"}
                <span className="text-[9px] text-gray-400">
                  {countByTag(activeFilter?.key ?? null)}
                </span>
                <span className="text-gray-400">☰</span>
              </button>
              {filtersOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden z-10">
                  {filters.map((filter) => {
                    const href = filter.key
                      ? `/project?tag=${filter.key}`
                      : "/project";
                    const active =
                      (filter.key === null && !tag) || filter.key === tag;
                    return (
                      <Link
                        key={filter.label}
                        href={href}
                        className={`flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-[0.25em] ${
                          active ? "bg-black text-white" : "text-gray-700"
                        }`}
                        onClick={() => setFiltersOpen(false)}
                      >
                        <span>{filter.label}</span>
                        <span className="text-[9px] opacity-70">
                          {countByTag(filter.key)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 md:px-16 max-w-full mx-auto pb-20 md:pb-24">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-gray-400 font-semibold uppercase tracking-widest animate-pulse">
            Loading projects...
          </div>
        ) : (projects.length === 0 && tag !== "details") ||
          (allImages.length === 0 && tag === "details") ? (
          <div className="flex h-64 items-center justify-center text-gray-400 font-semibold uppercase tracking-widest border-2 border-dashed rounded-3xl px-6 text-center">
            No projects found for this category.
          </div>
        ) : tag === "details" ? (
          renderDetailsGrid()
        ) : (
          renderStandardGrid()
        )}
      </div>
    </div>
  );
}
