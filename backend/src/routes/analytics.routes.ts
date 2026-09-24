import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getStudentAnalyticsHandler,
  getMyChildAnalyticsHandler,
} from '../controllers/analyticsController';

const router = Router();

router.use(authenticate);

// Parent direct child endpoint
router.get('/me', getMyChildAnalyticsHandler);

// Specific student performance graphs (Teachers, Admins, or authorized parent)
router.get('/student/:studentId', getStudentAnalyticsHandler);

export default router;
