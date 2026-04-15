import React, { useState, useRef, useEffect } from 'react';
import { useCreateProject } from '../../hooks/useApi';
import apiClient from '../../api/client';

export const UploadProjectModal = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [file, setFile] = useState(null);
  
  // Collaboration states
  const [searchQuery, setSearchQuery] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fileInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const { mutate: createProject, isPending } = useCreateProject();

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
        const response = await apiClient.get(`/users/search?q=${searchQuery}`);
        // Filter out already selected collaborators
        const results = response.data?.data || [];
        const filtered = results.filter(u => !collaborators.some(c => c.id === u.id));
        setSearchResults(filtered);
      } catch (error) {
        console.error('Failed to search users', error);
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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return alert('Title is required');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('collaborators', JSON.stringify(collaborators.map(c => ({ id: c.id, name: c.name }))));
    if (file) {
      formData.append('file', file);
    }

    createProject(formData, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (err) => {
        alert(err.response?.data?.message || 'Failed to upload project');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-slate-800">Upload Project</h2>
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
                Add Collaboration
              </label>
              
              <div className="flex items-center px-4 py-3 bg-slate-50 border border-slate-100 rounded focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 focus-within:bg-white transition-colors">
                <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="@ - name"
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
                      {user.avatar ? (
                        <img src={user.avatar} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs text-purple-600 font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
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

            {/* File Upload zone */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 border border-dashed border-[#b39dd7] rounded-md bg-[#faf8ff] p-5 flex items-center justify-center cursor-pointer hover:bg-[#f6f2fe] transition group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
                className="hidden"
              />
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#d8cbf0] rounded-lg flex items-center justify-center text-[#5c249c] group-hover:bg-[#cebbed] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#1a1a2e]">
                    {file ? file.name : "Drop files here or click to upload."}
                  </p>
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Upload case files, if any."}
                  </p>
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
             Save Project
           </button>
        </div>

      </div>
    </div>
  );
};
