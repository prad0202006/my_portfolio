import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiCheck, FiAlertCircle, FiDownload } from 'react-icons/fi';
import { usePortfolioData } from '../contexts/PortfolioDataContext';
import axios from 'axios';

const ResumeUploader = () => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const { updatePortfolioData, setError } = usePortfolioData();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExtensions = ['.pdf', '.docx'];

    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setUploadError('Please upload a valid PDF or DOCX file');
      setUploadSuccess(false);
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      setUploadSuccess(false);
      return;
    }

    // Upload and parse resume
    await uploadResume(file);
  };

  const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/resume/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      );

      if (response.data.success) {
        setParsedData(response.data.data);
        setUploadSuccess(true);
        setUploadError(null);
        
        // Show success for 2 seconds then reset
        setTimeout(() => {
          setUploadProgress(0);
        }, 2000);
      } else {
        setUploadError(response.data.message || 'Failed to parse resume');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error.response?.data?.message || 
        error.message || 
        'Failed to upload resume'
      );
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyChanges = () => {
    if (parsedData) {
      updatePortfolioData(parsedData);
      setError(null);
      
      // Show confirmation
      setTimeout(() => {
        setUploadSuccess(false);
        setParsedData(null);
        setUploadProgress(0);
      }, 1500);
    }
  };

  const handleReset = () => {
    setParsedData(null);
    setUploadSuccess(false);
    setUploadError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-dark-900 dark:to-dark-800" id="resume-uploader">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Resume Upload
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Upload your resume (PDF or DOCX) to automatically update your portfolio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            {/* Drag & Drop Area */}
            <motion.div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={{ scale: 1.02 }}
              className={`p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                isDragging
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full flex flex-col items-center justify-center gap-4 py-12"
              >
                <motion.div
                  animate={{ y: isDragging ? -10 : 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <FiUpload className="w-12 h-12 text-cyan-500" />
                </motion.div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    {isUploading ? 'Uploading...' : 'Drag and drop your resume'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    or click to browse (PDF or DOCX, max 10MB)
                  </p>
                </div>
              </button>

              {/* Progress Bar */}
              <AnimatePresence>
                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 space-y-2"
                  >
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                      {uploadProgress}% uploaded
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Status Messages */}
            <AnimatePresence>
              {uploadError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <div className="flex gap-3 items-start">
                    <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                        Upload Error
                      </p>
                      <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                        {uploadError}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {uploadSuccess && !parsedData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                >
                  <div className="flex gap-3 items-start">
                    <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                        Upload Successful
                      </p>
                      <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                        Parsing resume data...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <AnimatePresence>
              {parsedData ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6 p-6 rounded-xl bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-gray-700"
                >
                  {/* Header */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {parsedData.name}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                      {parsedData.email && <p>📧 {parsedData.email}</p>}
                      {parsedData.phone && <p>📱 {parsedData.phone}</p>}
                      {parsedData.location && <p>📍 {parsedData.location}</p>}
                    </div>
                  </div>

                  {/* Summary */}
                  {parsedData.summary && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Professional Summary
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                        {parsedData.summary}
                      </p>
                    </div>
                  )}

                  {/* Skills Preview */}
                  {parsedData.skills && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(parsedData.skills).map(([category, skills]) => (
                          <div key={category} className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-xs font-medium text-cyan-900 dark:text-cyan-300">
                            {category}: {skills.substring(0, 30)}...
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience Preview */}
                  {parsedData.experience && parsedData.experience.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Experience ({parsedData.experience.length})
                      </h3>
                      <div className="space-y-2">
                        {parsedData.experience.slice(0, 2).map((exp, idx) => (
                          <div key={idx} className="p-2 rounded bg-gray-50 dark:bg-gray-800/50">
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {exp.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {exp.company} • {exp.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education Preview */}
                  {parsedData.education && parsedData.education.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Education ({parsedData.education.length})
                      </h3>
                      <div className="space-y-2">
                        {parsedData.education.slice(0, 2).map((edu, idx) => (
                          <div key={idx} className="p-2 rounded bg-gray-50 dark:bg-gray-800/50">
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {edu.degree}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {edu.institution}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleApplyChanges}
                      className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-shadow"
                    >
                      <FiDownload className="inline mr-2 w-4 h-4" />
                      Apply Changes to Portfolio
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReset}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <FiX className="inline mr-2 w-4 h-4" />
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-dark-800/20"
                >
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Upload a resume to see a preview of extracted data
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      The preview will appear here once parsing is complete
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
        >
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            💡 How It Works
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Upload your resume in PDF or DOCX format</li>
            <li>• Our AI-powered parser extracts your information automatically</li>
            <li>• Review the parsed data in the preview section</li>
            <li>• Click "Apply Changes" to update your portfolio instantly</li>
            <li>• Your data is saved locally and synced to your portfolio</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeUploader;
