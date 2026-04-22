import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { logger } from '../config/logger.js';

export function startNotificationWorker() {
  const worker = new Worker(
    'notifications',
    async (job) => {
      logger.info({ jobId: job.id, payload: job.data }, 'Processing notification job');
      return { delivered: true };
    },
    { connection: redisConnection, concurrency: 10 }
  );

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Notification job completed');
  });

  worker.on('failed', (job, error) => {
    logger.error({ jobId: job?.id, err: error }, 'Notification job failed');
  });

  return worker;
}
