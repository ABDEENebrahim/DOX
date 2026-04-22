import {
  processWhatsappWebhook,
  verifyWhatsappChallenge
} from '../services/whatsapp.service.js';

export async function whatsappWebhookVerifyHandler(req, res, next) {
  try {
    const challenge = verifyWhatsappChallenge(req.query);
    if (!challenge) {
      return res.status(403).json({ error: 'Verification failed' });
    }

    return res.status(200).send(challenge);
  } catch (error) {
    return next(error);
  }
}

export async function whatsappWebhookHandler(req, res, next) {
  try {
    const result = await processWhatsappWebhook({
      rawBody: req.rawBody,
      signature: req.headers['x-hub-signature-256'],
      payload: req.body
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
