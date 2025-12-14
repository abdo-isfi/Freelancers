const express = require('express');
const router = express.Router();
const responseFormatter = require('../utils/responseFormatter');
const { getSimpleHealth, getHealthDetails } = require('../utils/healthCheck');
const { verifyToken } = require('../middlewares/authMiddleware');
const db = require('../models');

/**
 * @route GET /api/health
 * @desc Simple health check endpoint
 * @access Public
 */
router.get('/', (req, res) => {
  const health = getSimpleHealth();
  return responseFormatter.success(res, health, 'Application is healthy');
});

/**
 * @route GET /api/health/details
 * @desc Detailed health check with diagnostics
 * @access Private (requires authentication)
 */
router.get('/details', verifyToken, async (req, res, next) => {
  try {
    const healthDetails = await getHealthDetails(db.sequelize);
    return responseFormatter.success(res, healthDetails, 'Health check completed');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
