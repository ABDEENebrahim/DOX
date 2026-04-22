import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import { logger } from './config/logger.js';
import { env } from './config/env.js';
import usersRoutes from './routes/users.routes.js';
import appointmentsRoutes from './routes/appointments.routes.js';
import aiRoutes from './routes/ai.routes.js';
import webhooksRoutes from './routes/webhooks.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import investorRoutes from './routes/investor.routes.js';
import activityRoutes from './routes/activity.routes.js';
import { stripeWebhookHandler } from './controllers/payments.controller.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

function rawBodySaver(req, res, buf) {
  if (buf?.length) {
    req.rawBody = buf;
  }
}

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());

  app.post('/payments/webhook', express.raw({ type: 'application/json' }), (req, _res, next) => {
    req.rawBody = req.body;
    try {
      req.body = JSON.parse(req.body.toString('utf-8'));
      return next();
    } catch (error) {
      return next(error);
    }
  }, stripeWebhookHandler);

  app.use(express.json({ limit: '2mb', verify: rawBodySaver }));
  app.use(
    rateLimit({
      windowMs: env.API_RATE_LIMIT_WINDOW_MS,
      max: env.API_RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use(pinoHttp({ logger }));

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  app.use('/users', usersRoutes);
  app.use('/appointments', appointmentsRoutes);
  app.use('/ai', aiRoutes);
  app.use('/payments', paymentsRoutes);
  app.use('/voice', voiceRoutes);
  app.use('/investor', investorRoutes);
  app.use('/activity', activityRoutes);
  app.use('/', webhooksRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
