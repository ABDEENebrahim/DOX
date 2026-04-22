import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { JarvisOrchestrator } from './ai/orchestrator.js';
import { startNotificationWorker } from './queue/worker.js';

async function startServer() {
  await connectDatabase();

  const orchestrator = new JarvisOrchestrator();
  orchestrator.start();

  startNotificationWorker();

  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'JARVIS API server listening');
  });
}

startServer().catch((error) => {
  logger.fatal({ err: error }, 'Failed to start server');
  process.exit(1);
});
