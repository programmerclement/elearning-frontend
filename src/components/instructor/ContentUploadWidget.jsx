import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { FormInput, FormSelect, FormTextArea } from '../common/Form';

/**
 * ContentUploadWidget Component
 * Upload videos, PDFs, and other course materials
 */
export const ContentUploadWidget = ({
  onUploadComplete = () => {},
  isLoading = false,
}) => {
  const [uploadType, setUploadType] = useState('video');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    order: '1',
  });
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));

      // Create preview
      if (uploadType === 'video' || uploadType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.file && formData.title) {
      onUploadComplete({
        ...formData,
        type: uploadType,
      });
      // Reset form
      setFormData({
        title: '',
        description: '',
        file: null,
        order: '1',
      });
      setPreview(null);
    }
  };

  const getFileAccept = () => {
    const accepts = {
      video: 'video/*',
      image: 'image/*',
      pdf: '.pdf',
      document: '.doc,.docx,.txt',
    };
    return accepts[uploadType] || '*/*';
  };

  const getFileIcon = () => {
    const icons = {
      video: '🎬',
      image: '🖼️',
      pdf: '📄',
      document: '📋',
    };
    return icons[uploadType] || '📦';
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Course Content</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div>
          <FormSelect
            label="Content Type"
            name="type"
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
            options={[
              { value: 'video', label: 'Video' },
              { value: 'image', label: 'Image/Thumbnail' },
              { value: 'pdf', label: 'PDF Document' },
              { value: 'document', label: 'Other Document' },
            ]}
            required
          />

          <FormInput
            label="Content Title"
            name="title"
            placeholder="e.g., Introduction Video"
            value={formData.title}
            onChange={handleInput}
            required
          />

          <FormTextArea
            label="Description"
            name="description"
            placeholder="Brief description of the content"
            value={formData.description}
            onChange={handleInput}
            rows={3}
          />

          <FormInput
            label="Order"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleInput}
            min="1"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept={getFileAccept()}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            {formData.file && (
              <p className="text-sm text-gray-600 mt-2">
                ✓ {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
          >
            Upload Content
          </Button>
        </div>

        {/* Right Column - Preview */}
        <div>
          <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center min-h-64">
            {preview ? (
              <>
                {(uploadType === 'video' || uploadType === 'image') ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full max-h-48 rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-5xl mb-4">{getFileIcon()}</div>
                    <p className="text-gray-700 font-semibold">
                      {formData.file?.name}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">{getFileIcon()}</div>
                <p className="text-gray-600 text-center font-medium">
                  Select a file to preview
                </p>
                <p className="text-gray-500 text-sm text-center mt-2">
                  Upload {uploadType} files to your course
                </p>
              </>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
};
