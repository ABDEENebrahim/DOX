import { AILog } from '../models/ai-log.model.js';

export async function listActivityFeed(limit = 20) {
  const items = await AILog.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('eventType source createdAt traceId')
    .lean();

  return { items };
}
