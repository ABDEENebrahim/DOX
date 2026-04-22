import { listActivityFeed } from '../services/activity.service.js';
import { eventBus } from '../events/event-bus.js';

export async function activityFeedHandler(req, res, next) {
  try {
    const limit = Number(req.query.limit || 20);
    const data = await listActivityFeed(limit);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

export function activityStreamHandler(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const handler = (payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  eventBus.on('ACTIVITY_STREAM_EVENT', handler);

  req.on('close', () => {
    eventBus.off('ACTIVITY_STREAM_EVENT', handler);
    res.end();
  });
}
