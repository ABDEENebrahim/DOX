import { Router } from 'express';
import {
  createCheckoutSchema,
  createCheckoutSessionHandler
} from '../controllers/payments.controller.js';
import { validateRequest } from '../middleware/validate-request.js';

const router = Router();

router.post('/checkout-session', validateRequest(createCheckoutSchema), createCheckoutSessionHandler);

export default router;
