const Joi = require('joi');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define configuration schema
const envSchema = Joi.object({
  // Server
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(4000),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').default(''),
  TEST_DB_STORAGE: Joi.string().default(':memory:'),

  // JWT
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Security
  CORS_ORIGINS: Joi.string().default('http://localhost:3000,http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX: Joi.number().default(100),
  RATE_LIMIT_AUTH_MAX: Joi.number().default(5),

  // Email (optional)
  SMTP_HOST: Joi.string().allow('').optional(),
  SMTP_PORT: Joi.number().allow('').optional(),
  SMTP_USER: Joi.string().allow('').optional(),
  SMTP_PASSWORD: Joi.string().allow('').optional(),
  SMTP_FROM: Joi.string().email().allow('').optional(),

  // Pagination
  PAGINATION_DEFAULT_LIMIT: Joi.number().default(20),
  PAGINATION_MAX_LIMIT: Joi.number().default(100),
}).unknown(); // Allow other env variables

// Validate environment variables
const { error, value: validatedEnv } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export configuration object
const config = {
  env: validatedEnv.NODE_ENV,
  port: validatedEnv.PORT,
  
  database: {
    host: validatedEnv.DB_HOST,
    port: validatedEnv.DB_PORT,
    name: validatedEnv.DB_NAME,
    user: validatedEnv.DB_USER,
    password: validatedEnv.DB_PASSWORD,
    testStorage: validatedEnv.TEST_DB_STORAGE,
  },

  jwt: {
    accessSecret: validatedEnv.JWT_ACCESS_SECRET,
    refreshSecret: validatedEnv.JWT_REFRESH_SECRET,
    accessExpiresIn: validatedEnv.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: validatedEnv.JWT_REFRESH_EXPIRES_IN,
  },

  security: {
    corsOrigins: validatedEnv.CORS_ORIGINS.split(',').map(origin => origin.trim()),
    rateLimitWindowMs: validatedEnv.RATE_LIMIT_WINDOW_MS,
    rateLimitMax: validatedEnv.RATE_LIMIT_MAX,
    rateLimitAuthMax: validatedEnv.RATE_LIMIT_AUTH_MAX,
  },

  email: {
    host: validatedEnv.SMTP_HOST,
    port: validatedEnv.SMTP_PORT,
    user: validatedEnv.SMTP_USER,
    password: validatedEnv.SMTP_PASSWORD,
    from: validatedEnv.SMTP_FROM,
    enabled: !!(validatedEnv.SMTP_HOST && validatedEnv.SMTP_USER),
  },

  pagination: {
    defaultLimit: validatedEnv.PAGINATION_DEFAULT_LIMIT,
    maxLimit: validatedEnv.PAGINATION_MAX_LIMIT,
  },

  // Helper methods
  isDevelopment: () => validatedEnv.NODE_ENV === 'development',
  isProduction: () => validatedEnv.NODE_ENV === 'production',
  isTest: () => validatedEnv.NODE_ENV === 'test',
};

module.exports = config;
