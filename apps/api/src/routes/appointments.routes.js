import { Router } from 'express';
import {
  createAppointmentHandler,
  createAppointmentSchema,
  listAppointmentsHandler
} from '../controllers/appointments.controller.js';
import { validateRequest } from '../middleware/validate-request.js';

const router = Router();

router.get('/', listAppointmentsHandler);
router.post('/', validateRequest(createAppointmentSchema), createAppointmentHandler);

export default router;
