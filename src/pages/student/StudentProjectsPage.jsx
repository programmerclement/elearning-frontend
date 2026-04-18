import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useMyProjects, useDeleteProject } from '../../hooks/useApi';
import { UploadProjectModal } from '../../components/projects/UploadProjectModal';
import { EditProjectModal } from '../../components/projects/EditProjectModal';
import { ViewProjectModal } from '../../components/projects/ViewProjectModal';

const BASE_URL = 'http://localhost:3000';

export const StudentProjectsPage = () => {
  const { data: projectsData, isLoading, refetch } = useMyProjects();
  const deleteProjectMutation = useDeleteProject();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const projects = projectsData?.data || [];

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  const handleView = (project) => {
    setViewingProject(project);
    setIsViewModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate(projectId, {
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          alert(error.response?.data?.message || 'Failed to delete project');
        },
      });
    }
  };

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
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col h-full">
                {/* Project Background/Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-purple-400 to-purple-600 overflow-hidden group">
                  {getFullImageUrl(project.thumbnail_url) ? (
                    <img 
                      src={getFullImageUrl(project.thumbnail_url)} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : project.images && project.images.length > 0 ? (
                    <img 
                      src={getFullImageUrl(project.images[0])} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Edit/Delete Buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleView(project)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg font-medium transition"
                    >
                      👁 View
                    </button>
                    <button
                      onClick={() => handleEdit(project)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium transition"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{project.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                    {project.abstract || 'No abstract provided.'}
                  </p>

                  {/* Images Count Badge */}
                  {project.images && project.images.length > 0 && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        📸 {project.images.length} image{project.images.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  
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
                    <span className="text-gray-500">
                      {new Date(project.created_at).toLocaleDateString()} {new Date(project.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {project.file_url && (
                      <a 
                        href={`${BASE_URL}${project.file_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                      >
                        Download
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

      {isEditModalOpen && editingProject && (
        <EditProjectModal 
          project={editingProject}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProject(null);
          }} 
          onSuccess={() => {
            setIsEditModalOpen(false);
            setEditingProject(null);
            refetch();
          }} 
        />
      )}

      {isViewModalOpen && viewingProject && (
        <ViewProjectModal 
          project={viewingProject}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingProject(null);
          }} 
        />
      )}
    </DashboardLayout>
  );
};
