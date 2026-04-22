import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),
  API_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  API_RATE_LIMIT_MAX: z.coerce.number().default(200),

  META_WHATSAPP_TOKEN: z.string().min(1),
  META_WHATSAPP_PHONE_NUMBER_ID: z.string().min(1),
  META_WHATSAPP_VERIFY_TOKEN: z.string().min(1),
  META_APP_SECRET: z.string().min(1),

  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default('gpt-4.1-mini'),
  OPENAI_WHISPER_MODEL: z.string().default('whisper-1'),

  ELEVENLABS_API_KEY: z.string().min(1),
  ELEVENLABS_VOICE_ID: z.string().min(1),

  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_SUCCESS_URL: z.string().url(),
  STRIPE_CANCEL_URL: z.string().url(),
  STRIPE_PRICE_MAP_JSON: z.string().min(1)
});

const parsed = schema.parse(process.env);

export const env = {
  ...parsed,
  STRIPE_PRICE_MAP: JSON.parse(parsed.STRIPE_PRICE_MAP_JSON)
};
