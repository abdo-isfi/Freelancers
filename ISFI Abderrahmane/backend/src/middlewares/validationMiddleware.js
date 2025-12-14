const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }
  next();
};

/**
 * Validation rules
 */
const authValidation = {
  register: [
    body('email')
      .isEmail()
      .withMessage('Email is invalid')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain lowercase, uppercase, and numbers'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('First name must be at least 2 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Last name must be at least 2 characters'),
    body('companyName')
      .optional()
      .trim(),
    handleValidationErrors,
  ],

  login: [
    body('email')
      .isEmail()
      .withMessage('Email is invalid')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    handleValidationErrors,
  ],

  refresh: [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
    handleValidationErrors,
  ],

  logout: [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
    handleValidationErrors,
  ],
};

const clientValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Client name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email is invalid')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim(),
    body('companyName')
      .optional()
      .trim(),
    body('address')
      .optional()
      .trim(),
    body('taxId')
      .optional()
      .trim(),
    body('currency')
      .optional()
      .isLength({ min: 3, max: 3 })
      .withMessage('Currency must be a 3-letter code'),
    handleValidationErrors,
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email is invalid')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim(),
    body('companyName')
      .optional()
      .trim(),
    body('address')
      .optional()
      .trim(),
    body('taxId')
      .optional()
      .trim(),
    body('currency')
      .optional()
      .isLength({ min: 3, max: 3 })
      .withMessage('Currency must be a 3-letter code'),
    handleValidationErrors,
  ],

  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid client ID'),
    handleValidationErrors,
  ],

  delete: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid client ID'),
    handleValidationErrors,
  ],
};

const projectValidation = {
  create: [
    body('clientId')
      .isInt({ min: 1 })
      .withMessage('Client ID is required and must be a valid integer'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Project name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),
    body('description')
      .optional()
      .trim(),
    body('billingType')
      .isIn(['hourly', 'day_rate', 'fixed_price'])
      .withMessage('Billing type must be hourly, day_rate, or fixed_price'),
    body('hourlyRate')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Hourly rate must be a positive number'),
    body('dayRate')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Day rate must be a positive number'),
    body('fixedAmount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Fixed amount must be a positive number'),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    body('endDateEstimated')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid date'),
    handleValidationErrors,
  ],

  update: [
    body('clientId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Client ID must be a valid integer'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),
    body('description')
      .optional()
      .trim(),
    body('billingType')
      .optional()
      .isIn(['hourly', 'day_rate', 'fixed_price'])
      .withMessage('Billing type must be hourly, day_rate, or fixed_price'),
    body('status')
      .optional()
      .isIn(['active', 'paused', 'finished'])
      .withMessage('Status must be active, paused, or finished'),
    handleValidationErrors,
  ],

  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid project ID'),
    handleValidationErrors,
  ],

  delete: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid project ID'),
    handleValidationErrors,
  ],
};

const taskValidation = {
  create: [
    body('projectId')
      .isInt({ min: 1 })
      .withMessage('Project ID is required and must be a valid integer'),
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Task title is required')
      .isLength({ min: 2 })
      .withMessage('Title must be at least 2 characters'),
    body('description')
      .optional()
      .trim(),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    body('estimatedHours')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Estimated hours must be a positive number'),
    handleValidationErrors,
  ],

  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Title must be at least 2 characters'),
    body('status')
      .optional()
      .isIn(['todo', 'in_progress', 'in_review', 'completed'])
      .withMessage('Status must be todo, in_progress, in_review, or completed'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    handleValidationErrors,
  ],

  updateStatus: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid task ID'),
    body('status')
      .isIn(['todo', 'in_progress', 'in_review', 'completed'])
      .withMessage('Status must be todo, in_progress, in_review, or completed'),
    handleValidationErrors,
  ],

  delete: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid task ID'),
    handleValidationErrors,
  ],
};

const invoiceValidation = {
  create: [
    body('projectId')
      .isInt({ min: 1 })
      .withMessage('Project ID is required and must be a valid integer'),
    body('clientId')
      .isInt({ min: 1 })
      .withMessage('Client ID is required and must be a valid integer'),
    body('issueDate')
      .isISO8601()
      .withMessage('Issue date is required and must be a valid date'),
    body('dueDate')
      .isISO8601()
      .withMessage('Due date is required and must be a valid date'),
    body('items')
      .isArray({ min: 1 })
      .withMessage('Invoice must have at least one item'),
    body('items.*.description')
      .notEmpty()
      .withMessage('Item description is required'),
    body('items.*.quantity')
      .isFloat({ min: 0.01 })
      .withMessage('Item quantity must be greater than 0'),
    body('items.*.unitPrice')
      .isFloat({ min: 0 })
      .withMessage('Unit price must be a positive number'),
    handleValidationErrors,
  ],

  markPaid: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid invoice ID'),
    body('paidDate')
      .optional()
      .isISO8601()
      .withMessage('Paid date must be a valid date'),
    handleValidationErrors,
  ],

  delete: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid invoice ID'),
    handleValidationErrors,
  ],
};

const noteValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Note title is required')
      .isLength({ min: 1 })
      .withMessage('Title cannot be empty'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Note content is required'),
    body('projectId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Project ID must be a valid integer'),
    body('clientId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Client ID must be a valid integer'),
    body('taskId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Task ID must be a valid integer'),
    body('color')
      .optional()
      .isIn(['yellow', 'blue', 'green', 'pink', 'red'])
      .withMessage('Color must be yellow, blue, green, pink, or red'),
    handleValidationErrors,
  ],

  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Title cannot be empty'),
    body('content')
      .optional()
      .trim(),
    body('color')
      .optional()
      .isIn(['yellow', 'blue', 'green', 'pink', 'red'])
      .withMessage('Color must be yellow, blue, green, pink, or red'),
    handleValidationErrors,
  ],

  delete: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid note ID'),
    handleValidationErrors,
  ],
};

module.exports = {
  authValidation,
  clientValidation,
  projectValidation,
  taskValidation,
  invoiceValidation,
  noteValidation,
  handleValidationErrors,
};
