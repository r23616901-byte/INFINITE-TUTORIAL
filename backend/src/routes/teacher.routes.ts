import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getTeachersHandler,
  getTeacherByIdHandler,
  createTeacherHandler,
  updateTeacherHandler,
  toggleTeacherStatusHandler,
  assignSubjectsAndBatchesHandler,
  resetTeacherPasswordHandler,
  getAssignedStudentsHandler,
} from '../controllers/teacherController';

const router = Router();

router.use(authenticate);

// List and get teachers (Teachers and Admins)
router.get('/', getTeachersHandler);
router.get('/:id', getTeacherByIdHandler);
router.get('/:id/students', getAssignedStudentsHandler);

// Admin-only management endpoints
router.post('/', authorize('ADMIN'), createTeacherHandler);
router.put('/:id', authorize('ADMIN'), updateTeacherHandler);
router.patch('/:id/status', authorize('ADMIN'), toggleTeacherStatusHandler);
router.patch('/:id/assignments', authorize('ADMIN'), assignSubjectsAndBatchesHandler);
router.post('/:id/reset-password', authorize('ADMIN'), resetTeacherPasswordHandler);

export default router;
