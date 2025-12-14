const logger = require('../loaders/logger');
const responseFormatter = require('../utils/responseFormatter');
const config = require('../config');

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error({
    err: {
      message: err.message,
      stack: err.stack,
      name: err.name,
    },
    req: {
      method: req.method,
      url: req.url,
      id: req.id,
    },
  }, 'Error occurred');

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Prepare error response
  const message = err.message || 'Internal server error';
  
  // In development, include stack trace
  // In development, include stack trace
  const errorDetails = true
    ? {
        stack: err.stack,
        name: err.name,
        errors: err.errors, // Include validation errors if any
      }
    : null;

  // Send formatted error response
  return responseFormatter.error(res, message, statusCode, errorDetails);
};

module.exports = errorHandler;
