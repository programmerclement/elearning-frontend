import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useMyProjects } from '../../hooks/useApi';
import { UploadProjectModal } from '../../components/projects/UploadProjectModal';

export const StudentProjectsPage = () => {
  const { data: projectsData, isLoading, refetch } = useMyProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = projectsData?.data || [];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-1">Manage and upload your academic projects</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm transition"
          >
            Upload Project
          </button>
        </div>

        {/* Project List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📂
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No projects uploaded yet</h3>
            <p className="text-gray-600 mb-6">Upload your first project to share your work with collaborators and instructors.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm transition"
            >
              Upload Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{project.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {project.abstract || 'No abstract provided.'}
                  </p>
                  
                  {project.collaborators && project.collaborators.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Collaborators</p>
                      <div className="flex flex-wrap gap-2">
                        {project.collaborators.map((collab, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {collab.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <hr className="my-4 border-gray-100" />
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{new Date(project.created_at).toLocaleDateString()}</span>
                    {project.file_url && (
                      <a 
                        href={'http://localhost:3000' + project.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                      >
                        Valid File
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {isModalOpen && (
        <UploadProjectModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            refetch();
          }} 
        />
      )}
    </DashboardLayout>
  );
};
