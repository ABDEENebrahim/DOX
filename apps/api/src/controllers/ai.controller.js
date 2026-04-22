import { z } from 'zod';
import { EventTypes } from '../events/event-types.js';
import { eventBus } from '../events/event-bus.js';

export const aiTriggerSchema = z.object({
  eventType: z.enum([
    EventTypes.APPOINTMENT_CREATED,
    EventTypes.WHATSAPP_MESSAGE,
    EventTypes.SUBSCRIPTION_ACTIVE
  ]),
  payload: z.record(z.any()).default({})
});

export async function triggerAIHandler(req, res, next) {
  try {
    const { eventType, payload } = req.body;
    eventBus.emit(eventType, payload);
    res.status(202).json({ accepted: true, eventType });
  } catch (error) {
    next(error);
  }
}
