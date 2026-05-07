const resumeParserService = require('../services/resumeParser');
const logger = require('../utils/logger');

/**
 * Resume Controller
 * Handles resume upload and parsing operations
 */
class ResumeController {
  /**
   * Upload and parse resume
   */
  async uploadResume(req, res) {
    try {
      const io = req.app.get('io');
      const clientId = req.headers['x-client-id'] || req.socket?.id;

      logger.info(`Resume upload started for client: ${clientId}`);

      // Validate file
      if (!req.file) {
        logger.warn('No file uploaded in resume upload request');
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const fileType = req.file.originalname.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
      const filePath = req.file.path;

      logger.info(`Processing ${fileType} file: ${req.file.originalname}`);

      // Start real-time progress updates
      if (io && clientId) {
        io.to(`upload-${clientId}`).emit('resume-parsing-progress', {
          progress: 5,
          message: 'Upload completed. Starting parsing...',
          timestamp: new Date().toISOString()
        });
      }

      // Parse resume with progress updates
      const resumeData = await resumeParserService.parseResume(
        filePath,
        fileType,
        io,
        clientId
      );

      // Clean up uploaded file
      if (req.cleanupFile) {
        await req.cleanupFile();
      }

      logger.info(`Resume parsing completed successfully for client: ${clientId}`);

      res.json({
        success: true,
        message: 'Resume parsed successfully',
        data: resumeData,
        fileName: req.file.originalname,
        parsedAt: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Resume upload failed:', error);

      // Clean up file on error
      if (req.cleanupFile) {
        try {
          await req.cleanupFile();
        } catch (cleanupError) {
          logger.warn('File cleanup failed:', cleanupError);
        }
      }

      // Emit error progress update
      const io = req.app.get('io');
      const clientId = req.headers['x-client-id'] || req.socket?.id;
      if (io && clientId) {
        io.to(`upload-${clientId}`).emit('resume-parsing-progress', {
          progress: 0,
          message: `Parsing failed: ${error.message}`,
          error: true,
          timestamp: new Date().toISOString()
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Resume parsing failed',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  }

  /**
   * Validate resume file before upload
   */
  async validateResume(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file provided for validation'
        });
      }

      const fileType = req.file.originalname.toLowerCase();
      const isValidType = fileType.endsWith('.pdf') || fileType.endsWith('.docx');
      const isValidSize = req.file.size <= 5 * 1024 * 1024; // 5MB

      // Clean up the validation file immediately
      if (req.cleanupFile) {
        await req.cleanupFile();
      }

      if (!isValidType) {
        return res.status(400).json({
          success: false,
          error: 'Invalid file type. Only PDF and DOCX files are allowed.'
        });
      }

      if (!isValidSize) {
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 5MB.'
        });
      }

      res.json({
        success: true,
        message: 'File validation passed',
        fileType: fileType.endsWith('.pdf') ? 'pdf' : 'docx',
        fileSize: req.file.size,
        fileName: req.file.originalname
      });

    } catch (error) {
      logger.error('File validation failed:', error);

      if (req.cleanupFile) {
        await req.cleanupFile();
      }

      res.status(500).json({
        success: false,
        error: 'File validation failed'
      });
    }
  }

  /**
   * Get parsing status (for polling fallback)
   */
  async getParsingStatus(req, res) {
    // This is a fallback for clients that can't use WebSockets
    res.json({
      success: true,
      message: 'WebSocket connection recommended for real-time updates',
      websocketUrl: process.env.WEBSOCKET_URL || `ws://localhost:${process.env.PORT || 5000}`
    });
  }
}

module.exports = new ResumeController();