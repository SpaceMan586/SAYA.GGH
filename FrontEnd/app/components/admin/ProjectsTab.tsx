"use client";

import { HiPhotograph } from "react-icons/hi";

interface ProjectsTabProps {
  projects: any[];
  loading: boolean;
  onAddClick: () => void;
  onEdit: (project: any) => void;
  onDelete: (id: number) => void;
}

export default function ProjectsTab({ projects, loading, onAddClick, onEdit, onDelete }: ProjectsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Projects</h1>
        <button 
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-transform active:scale-95" 
          onClick={onAddClick}
        >
          + Add New Project
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4">Project Info</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr className="bg-white dark:bg-gray-800">
                <td colSpan={4} className="px-6 py-4 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading projects...</td>
              </tr>
            ) : projects.length === 0 ? (
              <tr className="bg-white dark:bg-gray-800">
                <td colSpan={4} className="px-6 py-4 text-center text-gray-400 font-bold uppercase tracking-widest">No projects found.</td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="bg-white hover:bg-gray-50 dark:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden border shrink-0">
                        {project.image_url ? (
                          <img src={project.image_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <HiPhotograph className="w-full h-full p-2 text-gray-300" />
                        )}
                      </div>
                      <div className="truncate max-w-[200px]">
                        <p className="font-bold truncate uppercase">{project.title}</p>
                        <p className="text-[10px] text-gray-400 font-normal uppercase tracking-wider">{project.location}, {project.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(project.tags) && project.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-[10px] rounded uppercase font-bold text-gray-500">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${project.status === 'Finished' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-4">
                      <button onClick={() => onEdit(project)} className="text-blue-600 hover:text-blue-800 font-black text-[10px] uppercase tracking-widest">Edit</button>
                      <button onClick={() => onDelete(project.id)} className="text-red-500 hover:text-red-700 font-black text-[10px] uppercase tracking-widest">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}