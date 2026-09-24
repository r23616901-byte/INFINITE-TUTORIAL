import { Router, Response } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import attendanceRoutes from './attendance.routes';
import academicRoutes from './academic.routes';
import leaveRoutes from './leave.routes';
import testRoutes from './test.routes';
import homeReachRoutes from './homeReach.routes';
import markRoutes from './mark.routes';
import scorecardRoutes from './scorecard.routes';
import analyticsRoutes from './analytics.routes';
import teacherRoutes from './teacher.routes';
import dailyUpdateRoutes from './dailyUpdate.routes';
import fileRoutes from './file.routes';
import auditRoutes from './audit.routes';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

const router = Router();

// Public & Core routes
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/academics', academicRoutes);
router.use('/leaves', leaveRoutes);
router.use('/tests', testRoutes);
router.use('/home-reach', homeReachRoutes);
router.use('/marks', markRoutes);
router.use('/scorecards', scorecardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/teachers', teacherRoutes);
router.use('/daily-updates', dailyUpdateRoutes);
router.use('/files', fileRoutes);
router.use('/audit-logs', auditRoutes);

// Role-protected test routes
router.get('/test/admin', authenticate, authorize('ADMIN'), (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: `Admin access granted to ${req.user?.name}`,
    role: req.user?.role,
  });
});

router.get('/test/teacher', authenticate, authorize('TEACHER', 'ADMIN'), (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: `Teacher access granted to ${req.user?.name}`,
    role: req.user?.role,
  });
});

router.get('/test/parent', authenticate, authorize('PARENT'), (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: `Parent access granted to ${req.user?.name}`,
    role: req.user?.role,
  });
});

export default router;
