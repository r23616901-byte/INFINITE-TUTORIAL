import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import * as dailyUpdateService from '../services/dailyUpdateService';
import { CreateDailyUpdateDto, UpdateDailyUpdateDto, DailyUpdateFilters } from '../types';

/**
 * GET /api/daily-updates
 */
export const getDailyUpdates = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { batchId, date, search, page, limit } = req.query;

    const filters: DailyUpdateFilters = {
      batchId: batchId as string,
      date: date as string,
      search: search as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    };

    const result = await dailyUpdateService.getDailyUpdates(filters);
    res.json({
      success: true,
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve daily updates',
    });
  }
};

/**
 * GET /api/daily-updates/:id
 */
export const getDailyUpdateById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await dailyUpdateService.getDailyUpdateById(id);

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Daily update not found',
      });
      return;
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve daily update',
    });
  }
};

/**
 * POST /api/daily-updates
 */
export const createDailyUpdate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { date, batchId, batchName, title, todayLesson, topicsCovered, homework, instructions, subjectUpdates } = req.body;

    if (!batchId) {
      res.status(400).json({ success: false, message: 'Batch ID is required' });
      return;
    }

    const payload: CreateDailyUpdateDto = {
      date: date || new Date().toISOString().split('T')[0],
      batchId,
      batchName,
      title,
      todayLesson: todayLesson || '',
      topicsCovered: topicsCovered || todayLesson || '',
      homework: homework || 'No homework assigned.',
      instructions,
      subjectUpdates: subjectUpdates || [],
    };

    const created = await dailyUpdateService.createDailyUpdate(payload, {
      id: user.userId,
      name: user.name || 'Instructor',
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'Daily update published successfully',
      data: created,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to publish daily update',
    });
  }
};

/**
 * PUT /api/daily-updates/:id
 */
export const updateDailyUpdate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const payload: UpdateDailyUpdateDto = req.body;

    const updated = await dailyUpdateService.updateDailyUpdate(id, payload, {
      id: user.userId,
      name: user.name || 'Instructor',
      role: user.role,
    });

    res.json({
      success: true,
      message: 'Daily update updated successfully',
      data: updated,
    });
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to update daily update',
    });
  }
};

/**
 * DELETE /api/daily-updates/:id
 */
export const deleteDailyUpdate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    await dailyUpdateService.deleteDailyUpdate(id, {
      id: user.userId,
      name: user.name || 'Instructor',
      role: user.role,
    });

    res.json({
      success: true,
      message: 'Daily update deleted successfully',
    });
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to delete daily update',
    });
  }
};
