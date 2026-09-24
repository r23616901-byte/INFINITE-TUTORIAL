import { Response } from 'express';
import { AuthRequest, AttendanceSessionType, AttendanceStatusType } from '../types';
import * as attendanceService from '../services/attendanceService';
import { getStudentForParent, isStudentAuthorizedForUser } from '../services/studentService';

/**
 * GET /api/attendance/batch
 * Load students and marked attendance status for a batch, date, and session
 */
export const getBatchAttendanceHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { batchId, date, session } = req.query;

    if (!batchId || !date || !session) {
      res.status(400).json({
        success: false,
        message: 'batchId, date (YYYY-MM-DD), and session (MORNING/EVENING) are required',
      });
      return;
    }

    const data = await attendanceService.getBatchAttendance(
      String(batchId),
      String(date),
      String(session) as AttendanceSessionType
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve batch attendance',
    });
  }
};

/**
 * POST /api/attendance/batch
 * Submit / Update attendance for an entire batch (Teacher / Admin)
 * Prevents duplicates via unique compound key upsert
 */
export const markBatchAttendanceHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date, session, batchId, records } = req.body;

    if (!date || !session || !batchId || !Array.isArray(records)) {
      res.status(400).json({
        success: false,
        message: 'date, session, batchId, and records array are required',
      });
      return;
    }

    const user = req.user;
    const recordedBy = {
      id: user?.id || 'sys-user',
      name: user?.name || (user?.role === 'TEACHER' ? 'Faculty Teacher' : 'Administrator'),
    };

    const result = await attendanceService.markBatchAttendance(
      String(date),
      session as AttendanceSessionType,
      String(batchId),
      records,
      recordedBy
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to save attendance',
    });
  }
};

/**
 * GET /api/attendance/student/:studentId
 * Get comprehensive student attendance history and percentage calculation
 */
export const getStudentAttendanceStatsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = String(req.params.studentId);

    if (!studentId) {
      res.status(400).json({
        success: false,
        message: 'Student ID is required',
      });
      return;
    }

    // Role check: If parent, ensure this student is linked to them
    if (req.user?.role === 'PARENT') {
      const isAuthorized = await isStudentAuthorizedForUser(studentId, req.user);
      if (!isAuthorized) {
        res.status(403).json({
          success: false,
          message: 'Access Denied: You are not authorized to view another student’s attendance records.',
        });
        return;
      }
    }

    const data = await attendanceService.getStudentAttendanceStats(studentId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve student attendance statistics',
    });
  }
};

/**
 * GET /api/attendance/parent
 * Get the logged-in parent's child attendance summary
 */
export const getParentAttendanceSummaryHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const student = await getStudentForParent(req.user.id, req.user.phone);
    if (!student) {
      res.status(404).json({
        success: false,
        message: 'No student record linked to your parent account',
      });
      return;
    }

    const data = await attendanceService.getStudentAttendanceStats(student.studentId || student.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve child attendance summary',
    });
  }
};

/**
 * PUT /api/attendance/:id
 * Correct an attendance record (Admin only)
 */
export const correctAttendanceHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recordId = String(req.params.id);
    const { status, remarks } = req.body;

    if (!status || (status !== 'PRESENT' && status !== 'ABSENT')) {
      res.status(400).json({
        success: false,
        message: 'Valid status ("PRESENT" or "ABSENT") is required',
      });
      return;
    }

    const user = req.user;
    const adminUser = {
      id: user?.id || 'admin-sys',
      name: user?.name || 'System Admin',
    };

    const updated = await attendanceService.correctAttendanceRecord(
      recordId,
      status as AttendanceStatusType,
      remarks || '',
      adminUser
    );

    res.status(200).json({
      success: true,
      message: 'Attendance record successfully corrected by Admin',
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to correct attendance record',
    });
  }
};

/**
 * GET /api/attendance/stats
 * Overview stats for admin / teacher dashboards
 */
export const getAttendanceOverviewStatsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await attendanceService.getAttendanceOverviewStats();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch attendance stats',
    });
  }
};
