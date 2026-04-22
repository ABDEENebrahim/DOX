import { Router } from 'express';
import { triggerAIHandler, aiTriggerSchema } from '../controllers/ai.controller.js';
import { validateRequest } from '../middleware/validate-request.js';

const router = Router();

router.post('/trigger', validateRequest(aiTriggerSchema), triggerAIHandler);

export default router;
