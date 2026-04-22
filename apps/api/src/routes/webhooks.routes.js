import { Router } from 'express';
import {
  whatsappWebhookHandler,
  whatsappWebhookVerifyHandler
} from '../controllers/webhooks.controller.js';

const router = Router();

router.get('/whatsapp/webhook', whatsappWebhookVerifyHandler);
router.post('/whatsapp/webhook', whatsappWebhookHandler);

export default router;
