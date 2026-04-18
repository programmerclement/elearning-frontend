import React, { useState, useRef, useEffect } from 'react';
import { useUpdateProject } from '../../hooks/useApi';
import apiClient from '../../api/client';

const BASE_URL = 'http://localhost:3000';

export const EditProjectModal = ({ project, onClose, onSuccess }) => {
  const [title, setTitle] = useState(project.title || '');
  const [abstract, setAbstract] = useState(project.abstract || '');
  const [newImages, setNewImages] = useState([]);
  const [file, setFile] = useState(null);
  const [existingImages, setExistingImages] = useState(project.images || []);
  const [deletedImages, setDeletedImages] = useState([]);
  
  // Collaboration states
  const [searchQuery, setSearchQuery] = useState('');
  const [collaborators, setCollaborators] = useState(project.collaborators || []);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fileInputRef = useRef(null);
  const imagesInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const { mutate: updateProject, isPending } = useUpdateProject();

  // Validate avatar URL
  const isValidAvatarUrl = (url) => {
    if (!url || typeof url !== 'string' || !url.trim()) return false;
    if (url.startsWith('data:')) {
      return url.length > 100 && url.includes(',');
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url.length > 10;
    }
    if (url.startsWith('/')) {
      return url.length > 1;
    }
    return false;
  };

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  // Search API call
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await apiClient.get(`/users/search?q=${encodeURIComponent(searchQuery)}`);
        const results = Array.isArray(response.data?.data) ? response.data.data : [];
        const filtered = results.filter(u => !collaborators.some(c => c.id === u.id));
        setSearchResults(filtered);
      } catch (error) {
        console.error('Failed to search users', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery, collaborators]);

  const handleAddCollaborator = (user) => {
    setCollaborators([...collaborators, user]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveCollaborator = (userId) => {
    setCollaborators(collaborators.filter(c => c.id !== userId));
  };

  const handleAddNewImages = (newFiles) => {
    setNewImages([...newImages, ...Array.from(newFiles)]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imagePath) => {
    setDeletedImages([...deletedImages, imagePath]);
    setExistingImages(existingImages.filter(img => img !== imagePath));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-purple-500', 'bg-purple-50');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50');
  };

  const handleDrop = (e, isImages = false) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50');
    
    if (e.dataTransfer.files) {
      if (isImages) {
        handleAddNewImages(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
      } else {
        setFile(e.dataTransfer.files[0]);
      }
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return alert('Title is required');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('collaborators', JSON.stringify(collaborators.map(c => ({ id: c.id, name: c.name }))));
    
    // Add IDs of images to delete
    if (deletedImages.length > 0) {
      formData.append('deletedImages', JSON.stringify(deletedImages));
    }
    
    // Add existing images that weren't deleted
    if (existingImages.length > 0) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }
    
    // Add new images
    newImages.forEach((image) => {
      formData.append('images', image);
    });
    
    // Add project file if provided
    if (file) {
      formData.append('file', file);
    }

    updateProject({ projectId: project.id, formData }, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (err) => {
        alert(err.response?.data?.message || 'Failed to update project');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-slate-800">Edit Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 flex-1 overflow-y-auto bg-white">
          <div className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Title / Subject
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Engineering Project Site map"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:bg-white transition-colors rounded outline-none text-slate-800"
              />
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Abstract
              </label>
              <textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Type something..."
                rows="4"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:bg-white transition-colors rounded outline-none text-slate-800 resize-none"
              />
            </div>

            {/* Collaboration */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Collaborators
              </label>
              
              <div className="flex items-center px-4 py-3 bg-slate-50 border border-slate-100 rounded focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 focus-within:bg-white transition-colors">
                <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search collaborators..."
                  className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleAddCollaborator(user)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 transition flex items-center gap-2"
                    >
                      {isValidAvatarUrl(user.avatar) ? (
                        <img 
                          src={user.avatar} 
                          className="w-6 h-6 rounded-full object-cover" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs text-purple-600 font-bold"
                        style={{display: isValidAvatarUrl(user.avatar) ? 'none' : 'flex'}}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-slate-700">{user.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Collaborator Tags */}
              {collaborators.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {collaborators.map(c => (
                    <div key={c.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8f9fc] border border-gray-100 rounded text-sm text-slate-800">
                      <span>{c.name}</span>
                      <button 
                        onClick={() => handleRemoveCollaborator(c.id)}
                        className="text-gray-400 hover:text-gray-700 p-0.5 rounded-full hover:bg-gray-200"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Current Images
                  </label>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {existingImages.length} image{existingImages.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {existingImages.map((image, idx) => (
                    <div key={idx} className="relative group">
                      <img 
                        src={getFullImageUrl(image)} 
                        alt={`Current ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400"
                        style={{display: 'none'}}
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                        </svg>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(image)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        title="Delete this image"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Multiple Images Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Add New Images
              </label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, true)}
                onClick={() => imagesInputRef.current?.click()}
                className="border border-dashed border-[#b39dd7] rounded-md bg-[#faf8ff] p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#f6f2fe] transition group"
              >
                <input 
                  type="file" 
                  ref={imagesInputRef}
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleAddNewImages(Array.from(e.target.files));
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#d8cbf0] rounded-lg flex items-center justify-center text-[#5c249c] group-hover:bg-[#cebbed] transition-colors mx-auto mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[15px] font-semibold text-[#1a1a2e]">
                    Drag images or click to upload
                  </p>
                </div>
              </div>

              {/* New Image Preview */}
              {newImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">{newImages.length} new image{newImages.length !== 1 ? 's' : ''}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {newImages.map((image, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`New ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Project File Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Update Project File (Optional)
              </label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, false)}
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-[#b39dd7] rounded-md bg-[#faf8ff] p-5 flex items-center justify-center cursor-pointer hover:bg-[#f6f2fe] transition group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files) {
                      setFile(e.target.files[0]);
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#d8cbf0] rounded-lg flex items-center justify-center text-[#5c249c] group-hover:bg-[#cebbed] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[#1a1a2e]">
                      {file ? file.name : "Drop file or click to upload"}
                    </p>
                    <p className="text-[13px] text-slate-500 mt-0.5">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF, ZIP, DOC, etc. (optional)"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Area */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
           <button
             onClick={onClose}
             className="px-5 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded outline-none transition"
           >
             Cancel
           </button>
           <button
             onClick={handleSubmit}
             disabled={isPending}
             className="px-6 py-2 bg-[#4c167b] hover:bg-[#3d1163] text-white font-medium rounded outline-none transition disabled:opacity-50 flex items-center justify-center gap-2"
           >
             {isPending && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>}
             Update Project
           </button>
        </div>

      </div>
    </div>
  );
};
