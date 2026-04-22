import { Router } from 'express';
import { doctorAssistantHandler, doctorAssistantSchema } from '../controllers/voice.controller.js';
import { validateRequest } from '../middleware/validate-request.js';

const router = Router();

router.post('/doctor-assistant', validateRequest(doctorAssistantSchema), doctorAssistantHandler);

export default router;
