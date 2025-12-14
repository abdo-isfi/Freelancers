const os = require('os');
const config = require('../config');

/**
 * Health check utilities for monitoring application status
 */

/**
 * Check database connection health
 * @param {Object} sequelize - Sequelize instance
 * @returns {Promise<Object>} Database health status
 */
const checkDatabase = async (sequelize) => {
  try {
    await sequelize.authenticate();
    return {  
      status: 'healthy',
      message: 'Database connection is active',
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database connection failed: ${error.message}`,
    };
  }
};

/**
 * Get memory usage statistics
 * @returns {Object} Memory usage stats
 */
const getMemoryUsage = () => {
  const used = process.memoryUsage();
  return {
    heapUsed: `${Math.round((used.heapUsed / 1024 / 1024) * 100) / 100} MB`,
    heapTotal: `${Math.round((used.heapTotal / 1024 / 1024) * 100) / 100} MB`,
    rss: `${Math.round((used.rss / 1024 / 1024) * 100) / 100} MB`,
    external: `${Math.round((used.external / 1024 / 1024) * 100) / 100} MB`,
  };
};

/**
 * Get system information
 * @returns {Object} System info
 */
const getSystemInfo = () => {
  return {
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    cpuCount: os.cpus().length,
    totalMemory: `${Math.round((os.totalmem() / 1024 / 1024 / 1024) * 100) / 100} GB`,
    freeMemory: `${Math.round((os.freemem() / 1024 / 1024 / 1024) * 100) / 100} GB`,
    uptime: `${Math.floor(os.uptime() / 60 / 60)} hours`,
  };
};

/**
 * Get application uptime
 * @returns {Object} Application uptime info
 */
const getAppUptime = () => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return {
    seconds: uptime,
    formatted: `${hours}h ${minutes}m ${seconds}s`,
  };
};

/**
 * Get comprehensive health check details
 * @param {Object} sequelize - Sequelize instance
 * @returns {Promise<Object>} Complete health check results
 */
const getHealthDetails = async (sequelize) => {
  const dbHealth = await checkDatabase(sequelize);

  return {
    status: dbHealth.status === 'healthy' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: process.env.npm_package_version || '1.0.0',
    database: dbHealth,
    memory: getMemoryUsage(),
    system: getSystemInfo(),
    uptime: getAppUptime(),
  };
};

/**
 * Simple health check
 * @returns {Object} Basic health status
 */
const getSimpleHealth = () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: getAppUptime().formatted,
  };
};

module.exports = {
  checkDatabase,
  getMemoryUsage,
  getSystemInfo,
  getAppUptime,
  getHealthDetails,
  getSimpleHealth,
};
