import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  // Get axios config with auth token
  const getConfig = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      }
    };
  }, []);

  // Validate image file
  const validateImage = useCallback((file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.' 
      };
    }

    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: 'File size too large. Maximum size is 5MB.' 
      };
    }

    return { valid: true };
  }, []);

  // Create preview from file
  const createPreview = useCallback((file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  // Upload image
  const uploadImage = useCallback(async (file) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    // Validate file
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error);
      setUploading(false);
      return { success: false, error: validation.error };
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        `${API_URL}/upload`,
        formData,
        getConfig()
      );

      const imageUrl = response.data.imageUrl || response.data.url;
      
      return { 
        success: true, 
        imageUrl,
        data: response.data 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to upload image';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [validateImage, getConfig]);

  // Handle file selection
  const handleFileSelect = useCallback(async (file) => {
    if (!file) {
      return { success: false, error: 'No file selected' };
    }

    // Validate
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error);
      return { success: false, error: validation.error };
    }

    // Create preview
    createPreview(file);

    // Upload
    return await uploadImage(file);
  }, [validateImage, createPreview, uploadImage]);

  // Upload multiple images
  const uploadMultipleImages = useCallback(async (files) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    const results = [];
    const filesArray = Array.from(files);

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      const validation = validateImage(file);
      
      if (!validation.valid) {
        results.push({ 
          success: false, 
          error: validation.error, 
          fileName: file.name 
        });
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(
          `${API_URL}/upload`,
          formData,
          {
            ...getConfig(),
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                ((i + (progressEvent.loaded / progressEvent.total)) / filesArray.length) * 100
              );
              setProgress(percentCompleted);
            }
          }
        );

        results.push({
          success: true,
          imageUrl: response.data.imageUrl || response.data.url,
          fileName: file.name,
          data: response.data
        });
      } catch (err) {
        results.push({
          success: false,
          error: err.response?.data?.message || 'Upload failed',
          fileName: file.name
        });
      }
    }

    setUploading(false);
    setProgress(0);

    const allSuccess = results.every(r => r.success);
    return {
      success: allSuccess,
      results,
      message: allSuccess 
        ? 'All images uploaded successfully' 
        : 'Some images failed to upload'
    };
  }, [validateImage, getConfig]);

  // Delete image
  const deleteImage = useCallback(async (imageUrl) => {
    setUploading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/upload`, {
        data: { imageUrl },
        ...getConfig()
      });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete image';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  }, [getConfig]);

  // Clear preview
  const clearPreview = useCallback(() => {
    setPreview(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    preview,
    uploadImage,
    handleFileSelect,
    uploadMultipleImages,
    deleteImage,
    validateImage,
    createPreview,
    clearPreview,
    clearError
  };
};