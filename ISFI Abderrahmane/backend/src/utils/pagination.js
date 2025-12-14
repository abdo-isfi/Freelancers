const config = require('../config');

/**
 * Pagination utility for consistent pagination across all list endpoints
 */

/**
 * Calculate pagination metadata
 * @param {number} page - Current page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {number} totalItems - Total number of items
 * @returns {Object} Pagination metadata
 */
const getPaginationMetadata = (page, limit, totalItems) => {
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

/**
 * Parse and validate pagination parameters from request query
 * @param {Object} query - Express request query object
 * @returns {Object} Validated pagination params { page, limit, offset }
 */
const parsePaginationParams = (query) => {
  let page = parseInt(query.page) || 1;
  let limit = parseInt(query.limit) || config.pagination.defaultLimit;

  // Ensure minimum values
  page = Math.max(1, page);
  limit = Math.max(1, Math.min(limit, config.pagination.maxLimit));

  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Parse and validate sorting parameters from request query
 * @param {Object} query - Express request query object
 * @param {Array} allowedFields - Array of allowed field names for sorting
 * @param {string} defaultField - Default field to sort by
 * @returns {Array} Sequelize order array [[field, direction]]
 */
const parseSortParams = (query, allowedFields = [], defaultField = 'createdAt') => {
  const sortField = query.sort || defaultField;
  const sortOrder = (query.order || 'DESC').toUpperCase();

  // Validate sort field
  const field = allowedFields.includes(sortField) ? sortField : defaultField;
  
  // Validate sort order
  const order = ['ASC', 'DESC'].includes(sortOrder) ? sortOrder : 'DESC';

  return [[field, order]];
};

/**
 * Build Sequelize where clause from filter params
 * @param {Object} filters - Filter object with field-value pairs
 * @param {Object} Op - Sequelize operators object
 * @returns {Object} Sequelize where clause
 */
const buildWhereClause = (filters, Op) => {
  const where = {};

  Object.keys(filters).forEach(key => {
    const value = filters[key];
    
    if (value !== undefined && value !== null && value !== '') {
      // Handle different filter types
      if (Array.isArray(value)) {
        // Array values use IN operator
        where[key] = { [Op.in]: value };
      } else if (typeof value === 'string' && value.includes('%')) {
        // String with % uses LIKE operator
        where[key] = { [Op.like]: value };
      } else {
        // Exact match
        where[key] = value;
      }
    }
  });

  return where;
};

/**
 * Parse date range filter from query
 * @param {Object} query - Express request query object
 * @param {Object} Op - Sequelize operators object
 * @param {string} fieldName - Name of the date field
 * @returns {Object|null} Date range filter or null
 */
const parseDateRangeFilter = (query, Op, fieldName = 'createdAt') => {
  const { startDate, endDate } = query;
  
  if (!startDate && !endDate) {
    return null;
  }

  const dateFilter = {};

  if (startDate && endDate) {
    dateFilter[fieldName] = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  } else if (startDate) {
    dateFilter[fieldName] = {
      [Op.gte]: new Date(startDate),
    };
  } else if (endDate) {
    dateFilter[fieldName] = {
      [Op.lte]: new Date(endDate),
    };
  }

  return dateFilter;
};

module.exports = {
  getPaginationMetadata,
  parsePaginationParams,
  parseSortParams,
  buildWhereClause,
  parseDateRangeFilter,
};
