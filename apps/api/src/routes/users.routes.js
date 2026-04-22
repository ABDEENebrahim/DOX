import { Router } from 'express';
import {
  createUserHandler,
  createUserSchema,
  listUsersHandler
} from '../controllers/users.controller.js';
import { validateRequest } from '../middleware/validate-request.js';

const router = Router();

router.get('/', listUsersHandler);
router.post('/', validateRequest(createUserSchema), createUserHandler);

export default router;
