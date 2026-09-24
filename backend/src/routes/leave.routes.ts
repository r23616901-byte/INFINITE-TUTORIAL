import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  createLeaveHandler,
  getLeavesHandler,
  reviewLeaveHandler,
} from '../controllers/leaveController';

const router = Router();

router.use(authenticate);

// Submit leave request (Parents and Admins)
router.post('/', authorize('PARENT', 'ADMIN'), createLeaveHandler);

// View leave requests (All authenticated roles, filtered by role in service)
router.get('/', getLeavesHandler);

// Review (Approve / Reject) leave request (Teachers and Admins)
router.put('/:id/review', authorize('TEACHER', 'ADMIN'), reviewLeaveHandler);

export default router;
