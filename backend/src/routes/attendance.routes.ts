import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getBatchAttendanceHandler,
  markBatchAttendanceHandler,
  getStudentAttendanceStatsHandler,
  getParentAttendanceSummaryHandler,
  correctAttendanceHandler,
  getAttendanceOverviewStatsHandler,
} from '../controllers/attendanceController';

const router = Router();

// All attendance routes require an authenticated user
router.use(authenticate);

// Batch attendance routes (Teachers & Admins)
router.get('/batch', authorize('TEACHER', 'ADMIN'), getBatchAttendanceHandler);
router.post('/batch', authorize('TEACHER', 'ADMIN'), markBatchAttendanceHandler);

// Overall Stats (Teachers & Admins)
router.get('/stats', authorize('TEACHER', 'ADMIN'), getAttendanceOverviewStatsHandler);

// Parent Child Attendance Dashboard & History (Parents, Teachers, Admins)
router.get('/parent', authorize('PARENT', 'ADMIN'), getParentAttendanceSummaryHandler);

// Student-wise Attendance History & Percentage (Accessible to Teacher, Admin, Parent)
router.get('/student/:studentId', authorize('TEACHER', 'ADMIN', 'PARENT'), getStudentAttendanceStatsHandler);

// Admin-only Correction of Attendance
router.put('/:id', authorize('ADMIN'), correctAttendanceHandler);

export default router;
