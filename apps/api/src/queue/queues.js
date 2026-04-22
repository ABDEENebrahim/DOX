import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

export const notificationsQueue = new Queue('notifications', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 500,
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 }
  }
});
