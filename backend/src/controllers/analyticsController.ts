import { Request, Response } from 'express';
import analyticsService from '../services/analyticsService';
import { getStudentForParent, isStudentAuthorizedForUser } from '../services/studentService';

export const getStudentAnalyticsHandler = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID is required.' });
    }

    const user = (req as any).user;
    if (user?.role === 'PARENT') {
      const isAuthorized = await isStudentAuthorizedForUser(studentId, user);
      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You are not authorized to view another student’s analytics.',
        });
      }
    }

    const data = await analyticsService.getStudentPerformanceAnalysis(studentId);
    return res.status(200).json({
      success: true,
      message: 'Student performance analysis retrieved successfully.',
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error fetching performance analysis.',
    });
  }
};

export const getMyChildAnalyticsHandler = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const linkedStudent = await getStudentForParent(user.id, user.phone);
    if (!linkedStudent) {
      return res.status(404).json({
        success: false,
        message: 'No student record linked to your parent account.',
      });
    }

    const data = await analyticsService.getStudentPerformanceAnalysis(linkedStudent.id || linkedStudent.studentId);
    return res.status(200).json({
      success: true,
      message: 'Child performance analysis retrieved successfully.',
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error fetching child performance analysis.',
    });
  }
};
