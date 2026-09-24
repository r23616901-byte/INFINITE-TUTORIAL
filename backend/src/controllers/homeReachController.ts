import { Request, Response } from 'express';
import * as homeReachService from '../services/homeReachService';

/**
 * Get all Home-Reach records with filters
 * GET /api/home-reach
 */
export const getHomeReachRecordsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user || { id: 'admin-001', role: 'ADMIN' };
    const { batchId, studentId, date, status, session, search } = req.query;

    const records = await homeReachService.getHomeReachRecords(
      {
        batchId: batchId as string,
        studentId: studentId as string,
        date: date as string,
        status: status as any,
        session: session as string,
        search: search as string,
      },
      user
    );

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (err: any) {
    const status = err.message.includes('Access Denied') ? 403 : 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Failed to fetch home reach records',
    });
  }
};

/**
 * Get parent's linked student home reach tracking & history
 * GET /api/home-reach/parent
 */
export const getParentHomeReachHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const records = await homeReachService.getHomeReachRecords({}, user);

    // Latest active or today's record
    const latestRecord = records[0] || null;

    res.status(200).json({
      success: true,
      data: {
        latest: latestRecord,
        history: records,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch student home reach status',
    });
  }
};

/**
 * Record when class ends and student(s) depart tuition (Teacher / Admin)
 * POST /api/home-reach/departure
 */
export const recordDepartureHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user || {
      id: 'teacher-001',
      name: 'Prof. Rajesh Sharma',
      role: 'TEACHER',
    };

    const records = await homeReachService.recordClassEnded(req.body, user);
    res.status(200).json({
      success: true,
      message: `Tuition dismissal recorded for ${records.length} student(s) at ${records[0]?.classEndedTime || 'departure time'}.`,
      data: records,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to record tuition departure',
    });
  }
};

/**
 * Confirm that a student reached home safely (Parent, Student, or Staff)
 * POST /api/home-reach/confirm
 */
export const confirmReachedHomeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user || {
      id: 'parent-001',
      name: 'Rajesh Kumar (Father)',
      role: 'PARENT',
    };

    const updated = await homeReachService.confirmReachedHome(req.body, user);
    res.status(200).json({
      success: true,
      message: `Confirmed ${updated.studentName} reached home safely at ${updated.reachedHomeTime} (${updated.transitMinutes} mins transit).`,
      data: updated,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to confirm student reached home',
    });
  }
};

/**
 * Get Admin Configuration
 * GET /api/home-reach/config
 */
export const getConfigHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const config = await homeReachService.getHomeReachConfig();
    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch configuration',
    });
  }
};

/**
 * Update Admin Configuration (Admin only)
 * PUT /api/home-reach/config
 */
export const updateConfigHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await homeReachService.updateHomeReachConfig(req.body);
    res.status(200).json({
      success: true,
      message: 'Home-Reach configuration updated successfully',
      data: updated,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to update configuration',
    });
  }
};
