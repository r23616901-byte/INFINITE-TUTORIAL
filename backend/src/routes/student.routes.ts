import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getStudentsHandler,
  getMyStudentProfileHandler,
  getAcademicLookupsHandler,
  getStudentByIdHandler,
  createStudentHandler,
  updateStudentHandler,
  setStudentStatusHandler,
} from '../controllers/studentController';

const router = Router();

// Parent self-student profile (Strictly read-only)
router.get('/profile/me', authenticate, authorize('PARENT'), getMyStudentProfileHandler);

// Lookups for dropdowns (Classes, Boards, Batches)
router.get('/lookups', authenticate, getAcademicLookupsHandler);

// List students with search and filtering (Admin & Teacher)
router.get('/', authenticate, authorize('ADMIN', 'TEACHER'), getStudentsHandler);

// View single student details
router.get('/:id', authenticate, getStudentByIdHandler);

// Admin-only mutations (Add, Edit, Deactivate/Change Status)
router.post('/', authenticate, authorize('ADMIN'), createStudentHandler);
router.put('/:id', authenticate, authorize('ADMIN'), updateStudentHandler);
router.patch('/:id/status', authenticate, authorize('ADMIN'), setStudentStatusHandler);

export default router;
