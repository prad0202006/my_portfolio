require('dotenv').config();

/**
 * Application Configuration
 */
const config = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // CORS Configuration
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Security Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your_secure_jwt_secret_key_here_please_change_this',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,

  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',

  // Rate Limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  UPLOAD_RATE_LIMIT_MAX: parseInt(process.env.UPLOAD_RATE_LIMIT_MAX) || 10,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Database (if using MongoDB)
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/nanotech-portfolio',

  // Email Configuration (for future use)
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  // Analytics (optional)
  GA_TRACKING_ID: process.env.GA_TRACKING_ID,

  // External APIs (for future enhancements)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY, // For AI-powered parsing improvements
  RESUME_PARSER_API_KEY: process.env.RESUME_PARSER_API_KEY,

  // Feature Flags
  ENABLE_WEBSOCKETS: process.env.ENABLE_WEBSOCKETS !== 'false',
  ENABLE_RATE_LIMITING: process.env.ENABLE_RATE_LIMITING !== 'false',
  ENABLE_FILE_VALIDATION: process.env.ENABLE_FILE_VALIDATION !== 'false',

  // Development
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://pradeepg.dev'
  ]
};

/**
 * Validate required configuration
 */
const validateConfig = () => {
  const required = ['JWT_SECRET'];

  for (const key of required) {
    if (!config[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  // Validate JWT secret strength
  if (config.JWT_SECRET.length < 32) {
    console.warn('WARNING: JWT_SECRET should be at least 32 characters long for security');
  }

  // Validate port
  if (config.PORT < 1000 || config.PORT > 65535) {
    throw new Error('PORT must be between 1000 and 65535');
  }
};

// Validate configuration on load
validateConfig();

module.exports = config;