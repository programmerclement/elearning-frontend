import React, { useState } from 'react';

const BASE_URL = 'http://localhost:3000';

export const ViewProjectModal = ({ project, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!project) return null;

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  const displayImages = project.images && project.images.length > 0 ? project.images : 
                        project.thumbnail_url ? [project.thumbnail_url] : [];

  const currentImage = displayImages[selectedImageIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-bold text-slate-800 line-clamp-2">{project.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Image Gallery */}
          {displayImages.length > 0 && (
            <div className="space-y-4 p-6 bg-gradient-to-b from-gray-50 to-white">
              {/* Main Image */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden h-96">
                <img 
                  src={getFullImageUrl(currentImage)} 
                  alt={`Project image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling && (e.target.nextElementSibling.style.display = 'flex');
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gray-900 flex items-center justify-center text-gray-400"
                  style={getFullImageUrl(currentImage) ? { display: 'none' } : {}}
                >
                  <svg className="w-24 h-24 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                </div>

                {/* Image Counter */}
                {displayImages.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full text-white text-sm font-medium">
                    {selectedImageIndex + 1} / {displayImages.length}
                  </div>
                )}

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => (prev - 1 + displayImages.length) % displayImages.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => (prev + 1) % displayImages.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {displayImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition overflow-hidden ${
                        selectedImageIndex === idx 
                          ? 'border-purple-500 ring-2 ring-purple-300' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={getFullImageUrl(img)} 
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Project Details */}
          <div className="p-6 space-y-6">
            {/* Abstract */}
            {project.abstract && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Abstract
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {project.abstract}
                </p>
              </div>
            )}

            <hr className="border-gray-200" />

            {/* Meta Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Created Date
                </p>
                <p className="text-gray-900 font-medium">
                  {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Updated Date
                </p>
                <p className="text-gray-900 font-medium">
                  {new Date(project.updated_at || project.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Collaborators */}
            {project.collaborators && project.collaborators.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Collaborators ({project.collaborators.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.collaborators.map((collab, idx) => (
                    <div key={idx} className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm">
                      <p className="text-gray-700 font-medium">{collab.name}</p>
                      {collab.email && (
                        <p className="text-gray-500 text-xs">{collab.email}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Download */}
            {project.file_url && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1 1 0 11-2 0 1 1 0 012 0zM15 7a2 2 0 11-4 0 2 2 0 014 0zM12.5 12.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Project File</p>
                      <p className="text-xs text-blue-700">Click to download</p>
                    </div>
                  </div>
                  <a
                    href={`${BASE_URL}${project.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
                  >
                    Download
                  </a>
                </div>
              </div>
            )}

            {/* Images Count */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{displayImages.length}</span> image{displayImages.length !== 1 ? 's' : ''} in this project
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
