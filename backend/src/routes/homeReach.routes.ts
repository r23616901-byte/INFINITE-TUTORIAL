import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getHomeReachRecordsHandler,
  getParentHomeReachHandler,
  recordDepartureHandler,
  confirmReachedHomeHandler,
  getConfigHandler,
  updateConfigHandler,
} from '../controllers/homeReachController';

const router = Router();

router.use(authenticate);

// Records and History (Role-aware)
router.get('/', getHomeReachRecordsHandler);
router.get('/parent', getParentHomeReachHandler);

// Teacher & Admin: Record class ended & student departure
router.post('/departure', authorize('TEACHER', 'ADMIN'), recordDepartureHandler);

// Parent, Student, Teacher, Admin: Confirm reached home
router.post('/confirm', confirmReachedHomeHandler);

// Admin Configuration
router.get('/config', getConfigHandler);
router.put('/config', authorize('ADMIN'), updateConfigHandler);

export default router;
