import { logger } from '../config/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  logger.error({ err, path: req.path }, 'Unhandled API error');
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
}
