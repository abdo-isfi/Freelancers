/**
 * Standard response formatter for consistent API responses
 */

/**
 * Send a successful response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const success = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a paginated successful response
 * @param {Object} res - Express response object
 * @param {Array} items - Array of items
 * @param {Object} pagination - Pagination metadata
 * @param {string} message - Success message
 */
const successWithPagination = (res, items, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data: items,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      totalItems: pagination.totalItems,
      totalPages: pagination.totalPages,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
    },
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {*} errors - Additional error details
 */
const error = (res, message = 'An error occurred', statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a validation error response
 * @param {Object} res - Express response object
 * @param {Array} validationErrors - Array of validation errors
 */
const validationError = (res, validationErrors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: validationErrors,
  });
};

/**
 * Send an unauthorized error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const unauthorized = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    success: false,
    message,
  });
};

/**
 * Send a not found error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const notFound = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message,
  });
};

/**
 * Send a server error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const serverError = (res, message = 'Internal server error') => {
  return res.status(500).json({
    success: false,
    message,
  });
};

module.exports = {
  success,
  successWithPagination,
  error,
  validationError,
  unauthorized,
  notFound,
  serverError,
};
