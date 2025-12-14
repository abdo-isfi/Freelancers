const express = require('express');
const cors = require('cors');
const { helmetConfig, corsOptions } = require('./config/security');
const { apiLimiter } = require('./config/rateLimiter');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { httpLogger } = require('./loaders/logger');

const app = express();

// Security middleware
app.use(helmetConfig);

// CORS with whitelist
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.disable('etag');
app.use(express.urlencoded({ extended: true }));

// HTTP request logging with request IDs
app.use(httpLogger);

// Global rate limiting
app.use('/api', apiLimiter);

// API routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
