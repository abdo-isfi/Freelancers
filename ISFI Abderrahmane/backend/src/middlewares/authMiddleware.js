const authService = require('../services/authService');
const logger = require('../loaders/logger');

/**
 * Verify JWT token and extract userId
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      const error = new Error('Authorization header is missing');
      error.status = 401;
      throw error;
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    const decoded = authService.verifyAccessToken(token);

    if (!decoded) {
      const error = new Error('Invalid or expired token');
      error.status = 401;
      throw error;
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.error({ error }, 'Token verification failed');
    next(error);
  }
};

module.exports = {
  verifyToken,
};
