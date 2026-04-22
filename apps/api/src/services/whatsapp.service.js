import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { eventBus } from '../events/event-bus.js';
import { EventTypes } from '../events/event-types.js';
import { JarvisOrchestrator } from '../ai/orchestrator.js';

const WHATSAPP_GRAPH_BASE = 'https://graph.facebook.com/v20.0';

function isValidWhatsappSignature(rawBody, signatureHeader) {
  if (!signatureHeader?.startsWith('sha256=')) return false;

  const received = signatureHeader.slice(7);
  const expected = crypto
    .createHmac('sha256', env.META_APP_SECRET)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

export function verifyWhatsappChallenge(query) {
  const mode = query['hub.mode'];
  const token = query['hub.verify_token'];
  const challenge = query['hub.challenge'];

  if (mode === 'subscribe' && token === env.META_WHATSAPP_VERIFY_TOKEN) {
    return challenge;
  }

  return null;
}

function extractMessages(payload) {
  return (
    payload?.entry?.flatMap((entry) =>
      entry?.changes?.flatMap((change) => change?.value?.messages || [])
    ) || []
  );
}

export async function processWhatsappWebhook({ rawBody, signature, payload }) {
  if (!isValidWhatsappSignature(rawBody, signature)) {
    const error = new Error('Invalid WhatsApp signature');
    error.statusCode = 401;
    throw error;
  }

  const orchestrator = new JarvisOrchestrator();
  const messages = extractMessages(payload);

  for (const message of messages) {
    const normalized = {
      from: message.from,
      text: message.text?.body || '',
      messageId: message.id,
      timestamp: message.timestamp
    };

    eventBus.emit(EventTypes.WHATSAPP_MESSAGE, normalized);
    const result = await orchestrator.handleEvent({ type: EventTypes.WHATSAPP_MESSAGE, payload: normalized });

    const reply = result.output.patientAgent?.message;
    if (reply) {
      await sendWhatsappMessage({ to: message.from, text: reply });
    }
  }

  return { accepted: true, processed: messages.length };
}

export async function sendWhatsappMessage({ to, text }) {
  const url = `${WHATSAPP_GRAPH_BASE}/${env.META_WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.META_WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body: text }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`WhatsApp send failed: ${message}`);
  }

  return response.json();
}
