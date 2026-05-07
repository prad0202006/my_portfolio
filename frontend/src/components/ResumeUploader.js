import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiCheck, FiAlertCircle, FiDownload, FiZap } from 'react-icons/fi';
import { usePortfolioData } from '../contexts/PortfolioDataContext';
import axios from 'axios';
import io from 'socket.io-client';

const ResumeUploader = () => {
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [progressMessage, setProgressMessage] = useState('');
  const [clientId, setClientId] = useState(null);
  const { updatePortfolioData, setError } = usePortfolioData();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Initialize Socket.IO connection
  useEffect(() => {
    const socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      upgrade: true,
    });

    socketRef.current = socket;

    // Generate unique client ID for this session
    const sessionId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setClientId(sessionId);

    socket.on('connect', () => {
      console.log('Connected to server for real-time updates');
      socket.emit('start-resume-upload', { clientId: sessionId });
    });

    socket.on('resume-parsing-progress', (data) => {
      setParsingProgress(data.progress);
      setProgressMessage(data.message);

      if (data.error) {
        setUploadError(data.message);
        setIsParsing(false);
        setIsUploading(false);
      }

      if (data.progress >= 100) {
        setIsParsing(false);
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, [API_BASE_URL]);

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

    // Validate file size (5MB max - updated to match backend)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
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
    setIsParsing(false);
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);
    setParsingProgress(0);
    setProgressMessage('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/resume/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-client-id': clientId
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);

            if (progress >= 100) {
              setIsUploading(false);
              setIsParsing(true);
              setProgressMessage('Upload completed. Starting parsing...');
            }
          }
        }
      );

      if (response.data.success) {
        setParsedData(response.data.data);
        setUploadSuccess(true);
        setUploadError(null);
        setProgressMessage('Resume parsing completed successfully!');

        // Show success for 3 seconds then allow apply
        setTimeout(() => {
          setParsingProgress(100);
        }, 1000);
      } else {
        setUploadError(response.data.error || 'Failed to parse resume');
        setIsParsing(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error.response?.data?.error ||
        error.message ||
        'Failed to upload resume'
      );
      setUploadSuccess(false);
      setIsParsing(false);
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
        setParsingProgress(0);
        setProgressMessage('');
      }, 2000);
    }
  };

  const handleReset = () => {
    setParsedData(null);
    setUploadSuccess(false);
    setUploadError(null);
    setUploadProgress(0);
    setParsingProgress(0);
    setProgressMessage('');
    setIsUploading(false);
    setIsParsing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getProgressColor = () => {
    if (uploadError) return 'from-red-500 to-red-600';
    if (uploadSuccess) return 'from-green-500 to-green-600';
    return 'from-blue-500 to-blue-600';
  };

  const getProgressIcon = () => {
    if (uploadError) return <FiAlertCircle className="w-6 h-6" />;
    if (uploadSuccess) return <FiCheck className="w-6 h-6" />;
    if (isParsing) return <FiZap className="w-6 h-6 animate-pulse" />;
    return <FiUpload className="w-6 h-6" />;
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
            AI-Powered Resume Upload
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Upload your resume and watch as our AI instantly transforms it into a stunning portfolio.
            Real-time progress updates keep you informed every step of the way.
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
              ${isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }
              ${uploadError ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : ''}
              ${uploadSuccess ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {(isUploading || isParsing) ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center space-y-6"
                >
                  {/* Progress Icon */}
                  <div className={`p-4 rounded-full bg-gradient-to-r ${getProgressColor()} text-white shadow-lg`}>
                    {getProgressIcon()}
                  </div>

                  {/* Progress Bars */}
                  <div className="w-full max-w-md space-y-4">
                    {/* Upload Progress */}
                    {isUploading && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                          <span className="font-medium">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Parsing Progress */}
                    {isParsing && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            {progressMessage || 'Processing...'}
                          </span>
                          <span className="font-medium">{parsingProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${parsingProgress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Message */}
                  {(isUploading || isParsing) && progressMessage && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-gray-600 dark:text-gray-400 max-w-md"
                    >
                      {progressMessage}
                    </motion.p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="upload-prompt"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center space-y-6"
                >
                  <div className="p-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                    <FiUpload className="w-12 h-12" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {uploadError ? 'Upload Failed' : uploadSuccess ? 'Upload Successful!' : 'Drop your resume here'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {uploadError
                        ? uploadError
                        : uploadSuccess
                        ? 'Your resume has been parsed successfully!'
                        : 'Supports PDF and DOCX files up to 5MB'
                      }
                    </p>

                    {!uploadError && !uploadSuccess && (
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Choose File
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Parsed Data Preview */}
        <AnimatePresence>
          {parsedData && uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  📄 Parsed Resume Data
                </h2>
                <button
                  onClick={handleReset}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                    👤 Personal Information
                  </h3>
                  {parsedData.name && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
                      <p className="text-gray-900 dark:text-white">{parsedData.name}</p>
                    </div>
                  )}
                  {parsedData.email && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                      <p className="text-gray-900 dark:text-white">{parsedData.email}</p>
                    </div>
                  )}
                  {parsedData.phone && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone:</span>
                      <p className="text-gray-900 dark:text-white">{parsedData.phone}</p>
                    </div>
                  )}
                  {parsedData.location && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Location:</span>
                      <p className="text-gray-900 dark:text-white">{parsedData.location}</p>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {parsedData.skills && parsedData.skills.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                      🛠️ Skills ({parsedData.skills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills.slice(0, 10).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                      {parsedData.skills.length > 10 && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                          +{parsedData.skills.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              {parsedData.summary && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2 mb-3">
                    📝 Professional Summary
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {parsedData.summary}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={handleApplyChanges}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  ✨ Apply to Portfolio
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {uploadError && !parsedData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center space-x-3">
                <FiAlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                    Upload Failed
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mt-1">
                    {uploadError}
                  </p>
                </div>
                <button
                  onClick={() => setUploadError(null)}
                  className="ml-auto p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            🚀 Powered by Advanced AI
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Real-Time Processing',
                description: 'Watch your resume transform with live progress updates'
              },
              {
                icon: '🔒',
                title: 'Enterprise Security',
                description: 'Bank-level encryption and automatic file cleanup'
              },
              {
                icon: '🎯',
                title: 'Smart Parsing',
                description: 'AI extracts skills, experience, and projects automatically'
              },
              {
                icon: '📱',
                title: 'Mobile Optimized',
                description: 'Upload from any device with drag-and-drop support'
              },
              {
                icon: '🔄',
                title: 'Instant Updates',
                description: 'Portfolio updates immediately without page refresh'
              },
              {
                icon: '🎨',
                title: 'Premium UX',
                description: 'Beautiful animations and professional design'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeUploader;

