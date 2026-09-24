import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getDailyUpdates,
  getDailyUpdateById,
  createDailyUpdate,
  updateDailyUpdate,
  deleteDailyUpdate,
} from '../controllers/dailyUpdateController';

const router = Router();

router.use(authenticate);

// List & view daily updates (accessible to all authenticated roles including PARENT)
router.get('/', getDailyUpdates);
router.get('/:id', getDailyUpdateById);

// Publish & manage daily updates (TEACHER and ADMIN only)
router.post('/', authorize('TEACHER', 'ADMIN'), createDailyUpdate);
router.put('/:id', authorize('TEACHER', 'ADMIN'), updateDailyUpdate);
router.delete('/:id', authorize('TEACHER', 'ADMIN'), deleteDailyUpdate);

export default router;
