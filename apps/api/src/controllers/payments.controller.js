import { z } from 'zod';
import { constructStripeEvent, createCheckoutSession, processStripeEvent } from '../services/stripe.service.js';

export const createCheckoutSchema = z.object({
  userId: z.string().min(1),
  plan: z.enum(['free', 'pro', 'enterprise']),
  country: z.enum(['UAE', 'KSA', 'INDIA'])
});

export async function createCheckoutSessionHandler(req, res, next) {
  try {
    const session = await createCheckoutSession(req.body);
    return res.status(201).json(session);
  } catch (error) {
    return next(error);
  }
}

export async function stripeWebhookHandler(req, res, next) {
  try {
    const signature = req.headers['stripe-signature'];
    const event = constructStripeEvent(req.rawBody, signature);
    await processStripeEvent(event);
    return res.status(200).json({ received: true });
  } catch (error) {
    return next(error);
  }
}
