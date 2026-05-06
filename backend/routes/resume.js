const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { parseResume } = require('../utils/resumeParser');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedExtensions = ['.pdf', '.docx'];
  
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * POST /api/resume/upload
 * Upload and parse resume file
 */
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileType = req.file.originalname.endsWith('.pdf') ? 'pdf' : 'docx';
    const filePath = req.file.path;

    // Parse the resume
    const resumeData = await parseResume(filePath, fileType);

    // Clean up uploaded file after parsing (optional)
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('Could not delete temp file:', error);
    }

    res.json({
      success: true,
      message: 'Resume parsed successfully',
      data: resumeData,
      fileName: req.file.originalname
    });
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (e) {
        console.warn('Could not delete temp file:', e);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse resume',
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
});

/**
 * POST /api/resume/save
 * Save parsed resume data to database
 */
router.post('/save', async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    // In a real application, save to database
    // For now, we'll just return success with the data
    res.json({
      success: true,
      message: 'Resume saved successfully',
      data: resumeData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save resume',
      error: error.message
    });
  }
});

/**
 * GET /api/resume/preview
 * Get the parsed resume preview
 */
router.get('/preview', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Resume preview endpoint ready'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get resume preview',
      error: error.message
    });
  }
});

module.exports = router;
