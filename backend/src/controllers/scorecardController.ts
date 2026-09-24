import { Request, Response } from 'express';
import * as scorecardService from '../services/scorecardService';

/**
 * Get scorecard for a specific student
 * GET /api/scorecards/student/:studentId
 */
export const getStudentScorecardHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user || { id: 'admin-001', role: 'ADMIN' };
    const { studentId } = req.params;

    const scorecard = await scorecardService.getStudentScorecard(studentId, user);
    res.status(200).json({
      success: true,
      data: scorecard,
    });
  } catch (error: any) {
    const status = error.message.includes('Access Denied') ? 403 : 404;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to fetch student scorecard',
    });
  }
};

/**
 * Get scorecard for the authenticated parent's linked child
 * GET /api/scorecards/me
 */
export const getMyChildScorecardHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    const scorecard = await scorecardService.getStudentScorecard('me', user);
    res.status(200).json({
      success: true,
      data: scorecard,
    });
  } catch (error: any) {
    const status = error.message.includes('Access Denied') ? 403 : 404;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to fetch child scorecard',
    });
  }
};

export default {
  getStudentScorecardHandler,
  getMyChildScorecardHandler,
};
