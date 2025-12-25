"use client";

interface OverviewTabProps {
  totalProjects: number;
  totalNews: number;
}

export default function OverviewTab({ totalProjects, totalNews }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Total Projects</h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalProjects}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Total News</h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalNews}</p>
          </div>
      </div>
    </div>
  );
}
