import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import * as fileProcessingService from '../services/fileProcessingService';
import { FileCategoryType, FileQueryFilters } from '../types';

/**
 * POST /api/files/upload
 */
export const uploadFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const category = (req.body.category as FileCategoryType) || 'DOCUMENT';
    const uploadedBy = user.name || `${user.role} User`;

    const metadata = await fileProcessingService.processAndStoreFile(
      req.file,
      category,
      uploadedBy
    );

    res.status(201).json({
      success: true,
      message: 'File processed, optimized, and saved successfully',
      data: metadata,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'File processing failed',
    });
  }
};

/**
 * GET /api/files
 */
export const listFiles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { category, search, uploaded_by, page, limit } = req.query;

    const filters: FileQueryFilters = {
      category: category as FileCategoryType,
      search: search as string,
      uploaded_by: uploaded_by as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    };

    const result = await fileProcessingService.listFiles(filters);

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
      message: error.message || 'Failed to list files',
    });
  }
};

/**
 * GET /api/files/:id
 */
export const getFileById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const file = await fileProcessingService.getFileById(id);

    if (!file) {
      res.status(404).json({ success: false, message: 'File metadata not found' });
      return;
    }

    res.json({
      success: true,
      data: file,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve file metadata',
    });
  }
};

/**
 * DELETE /api/files/:id
 */
export const deleteFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await fileProcessingService.deleteFile(id);

    res.json({
      success: true,
      message: 'File and optimized versions deleted successfully',
    });
  } catch (error: any) {
    const status = error.message?.includes('not found') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to delete file',
    });
  }
};
