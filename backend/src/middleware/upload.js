const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sanitize = require('sanitize-filename');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

/**
 * Security configuration for file uploads
 */
const createUploadMiddleware = (options = {}) => {
  const {
    maxFileSize = 5 * 1024 * 1024, // 5MB default
    allowedMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    allowedExtensions = ['.pdf', '.docx'],
    uploadDir = path.join(__dirname, '../../uploads'),
    fieldName = 'resume'
  } = options;

  // Ensure upload directory exists
  const ensureUploadDir = async () => {
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create upload directory:', error);
      throw new Error('Upload directory creation failed');
    }
  };

  // Secure storage configuration
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      await ensureUploadDir();
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate secure filename
      const fileId = uuidv4();
      const sanitizedName = sanitize(file.originalname);
      const extension = path.extname(sanitizedName).toLowerCase();
      const secureFilename = `${fileId}${extension}`;

      logger.info(`Generated secure filename: ${secureFilename} for original: ${file.originalname}`);
      cb(null, secureFilename);
    }
  });

  // File filter with enhanced security
  const fileFilter = (req, file, cb) => {
    // Check MIME type
    if (!allowedMimes.includes(file.mimetype)) {
      logger.warn(`Rejected file with invalid MIME type: ${file.mimetype}`);
      return cb(new Error(`Invalid file type. Only ${allowedExtensions.join(', ')} files are allowed.`), false);
    }

    // Check file extension
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      logger.warn(`Rejected file with invalid extension: ${fileExtension}`);
      return cb(new Error(`Invalid file extension. Only ${allowedExtensions.join(', ')} files are allowed.`), false);
    }

    // Additional security checks
    const originalName = file.originalname;
    if (originalName.includes('..') || originalName.includes('/') || originalName.includes('\\')) {
      logger.warn(`Rejected file with suspicious path: ${originalName}`);
      return cb(new Error('Invalid filename'), false);
    }

    logger.info(`File passed security checks: ${originalName}`);
    cb(null, true);
  };

  // Create multer instance with security options
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSize,
      files: 1, // Only one file per request
      fields: 1, // Only one field
    }
  });

  // Middleware function
  return (req, res, next) => {
    const uploadSingle = upload.single(fieldName);

    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
          logger.warn(`File size limit exceeded: ${err.field}`);
          return res.status(400).json({
            success: false,
            error: `File too large. Maximum size allowed is ${maxFileSize / (1024 * 1024)}MB`
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          logger.warn('Too many files uploaded');
          return res.status(400).json({
            success: false,
            error: 'Too many files uploaded'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          logger.warn(`Unexpected field: ${err.field}`);
          return res.status(400).json({
            success: false,
            error: 'Unexpected file field'
          });
        }
      }

      if (err) {
        logger.error('Upload error:', err);
        return res.status(400).json({
          success: false,
          error: err.message || 'File upload failed'
        });
      }

      // Add file cleanup function to request
      req.cleanupFile = async () => {
        if (req.file && req.file.path) {
          try {
            await fs.unlink(req.file.path);
            logger.info(`Cleaned up file: ${req.file.path}`);
          } catch (cleanupError) {
            logger.warn(`Failed to cleanup file: ${req.file.path}`, cleanupError);
          }
        }
      };

      next();
    });
  };
};

/**
 * Cleanup middleware for failed requests
 */
const cleanupOnError = (err, req, res, next) => {
  if (req.cleanupFile) {
    req.cleanupFile().catch(cleanupErr => {
      logger.warn('Error during file cleanup:', cleanupErr);
    });
  }
  next(err);
};

module.exports = {
  createUploadMiddleware,
  cleanupOnError
};