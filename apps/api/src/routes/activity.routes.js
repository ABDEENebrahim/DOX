import { Router } from 'express';
import { activityFeedHandler, activityStreamHandler } from '../controllers/activity.controller.js';

const router = Router();

router.get('/feed', activityFeedHandler);
router.get('/stream', activityStreamHandler);

export default router;
