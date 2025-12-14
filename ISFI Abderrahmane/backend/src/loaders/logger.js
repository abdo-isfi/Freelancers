const pino = require('pino');
const pinoHttp = require('pino-http');
const crypto = require('crypto');
const config = require('../config');


// Base logger instance
const logger = pino({
  level: config.isDevelopment() ? 'debug' : 'info',
  transport: config.isDevelopment()
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

// HTTP logger middleware with request ID
const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    // Use existing request ID or generate new one
    return req.headers['x-request-id'] || crypto.randomUUID();
  },
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    if (res.statusCode >= 400) {
      return 'warn';
    }
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} failed with ${res.statusCode}: ${err.message}`;
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
      headers: {
        host: req.headers.host,
        userAgent: req.headers['user-agent'],
        referer: req.headers.referer,
      },
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

module.exports = logger;
module.exports.httpLogger = httpLogger;
