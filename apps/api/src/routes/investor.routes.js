import { Router } from 'express';
import { investorMetricsHandler } from '../controllers/investor.controller.js';

const router = Router();

router.get('/metrics', investorMetricsHandler);

export default router;
