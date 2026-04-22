import Stripe from 'stripe';
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';
import { eventBus } from '../events/event-bus.js';
import { EventTypes } from '../events/event-types.js';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function createCheckoutSession({ userId, plan, country }) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const countryPrices = env.STRIPE_PRICE_MAP[country];
  if (!countryPrices) throw new Error('Unsupported country');

  const price = countryPrices[plan];
  if (!price) throw new Error('Unsupported plan for country');

  const customer = user.stripeCustomerId
    ? await stripe.customers.retrieve(user.stripeCustomerId)
    : await stripe.customers.create({
        email: user.email,
        name: user.fullName,
        metadata: { userId: user.id, country }
      });

  if (!user.stripeCustomerId) {
    user.stripeCustomerId = customer.id;
    await user.save();
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customer.id,
    line_items: [{ price, quantity: 1 }],
    success_url: env.STRIPE_SUCCESS_URL,
    cancel_url: env.STRIPE_CANCEL_URL,
    metadata: { userId: user.id, plan, country }
  });

  return { id: session.id, url: session.url };
}

export function constructStripeEvent(rawBody, signature) {
  return stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
}

export async function processStripeEvent(event) {
  if (event.type === 'invoice.paid') {
    const customerId = event.data.object.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });

    if (user) {
      const plan = (event.data.object.lines.data[0]?.price?.nickname || 'pro').toLowerCase();
      user.subscription.status = 'active';
      user.subscription.plan = ['free', 'pro', 'enterprise'].includes(plan) ? plan : 'pro';
      user.subscription.aiFeaturesEnabled = true;
      await user.save();

      eventBus.emit(EventTypes.SUBSCRIPTION_ACTIVE, {
        userId: user.id,
        stripeCustomerId: customerId,
        plan: user.subscription.plan
      });
    }
  }

  if (event.type === 'invoice.payment_failed' || event.type === 'payment.failed') {
    const customerId = event.data.object.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });

    if (user) {
      user.subscription.status = 'past_due';
      user.subscription.plan = 'free';
      user.subscription.aiFeaturesEnabled = false;
      await user.save();
    }
  }
}
