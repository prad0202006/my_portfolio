const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Authentication middleware
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('No token provided in request');
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      logger.warn('Empty token provided');
      return res.status(401).json({
        success: false,
        error: 'Access denied. Invalid token format.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    logger.info(`Authenticated user: ${req.user.email}`);
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Access token expired'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid access token'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

/**
 * Admin authorization middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    logger.warn('Admin check failed: no user in request');
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    logger.warn(`Admin access denied for user: ${req.user.email}`);
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }

  logger.info(`Admin access granted for user: ${req.user.email}`);
  next();
};

/**
 * Optional authentication (doesn't fail if no token)
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role || 'user'
        };
        logger.debug(`Optional auth successful for user: ${req.user.email}`);
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail, just continue without user
    logger.debug('Optional auth failed, continuing without user');
    next();
  }
};

module.exports = {
  authenticate,
  requireAdmin,
  optionalAuth
};