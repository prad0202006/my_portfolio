const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { createUploadMiddleware } = require('../middleware/upload');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Create upload middleware with security
const resumeUpload = createUploadMiddleware({
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  allowedExtensions: ['.pdf', '.docx'],
  fieldName: 'resume'
});

/**
 * @route   POST /api/resume/upload
 * @desc    Upload and parse resume file
 * @access  Private (optional auth for now, can be made required)
 */
router.post('/upload',
  optionalAuth,
  resumeUpload,
  validate(schemas.resumeUpload),
  resumeController.uploadResume
);

/**
 * @route   POST /api/resume/validate
 * @desc    Validate resume file before upload
 * @access  Public
 */
router.post('/validate',
  resumeUpload,
  resumeController.validateResume
);

/**
 * @route   GET /api/resume/status
 * @desc    Get parsing status (fallback for non-WebSocket clients)
 * @access  Public
 */
router.get('/status', resumeController.getParsingStatus);

/**
 * @route   POST /api/resume/save
 * @desc    Save parsed resume data to database
 * @access  Private
 */
router.post('/save',
  authenticate,
  validate(schemas.profileUpdate),
  async (req, res) => {
    // This would save to database - implementation depends on your DB setup
    // For now, just return success
    res.json({
      success: true,
      message: 'Resume data saved successfully',
      data: req.body
    });
  }
);

module.exports = router;