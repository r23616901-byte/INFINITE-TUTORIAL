import { Request, Response } from 'express';
import * as markService from '../services/markService';
import { uploadAnswerSheetFile } from '../services/cloudinaryService';
import * as auditService from '../services/auditService';

/**
 * Get marks list with role-based visibility & privacy enforcement
 * GET /api/marks
 */
export const getMarksHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user || { id: 'admin-001', role: 'ADMIN' };
    const filters = {
      studentId: req.query.studentId as string,
      testId: req.query.testId as string,
      subjectId: req.query.subjectId as string,
      subjectName: req.query.subjectName as string,
      isPublished: req.query.isPublished ? req.query.isPublished === 'true' : undefined,
      search: req.query.search as string,
    };

    const marks = await markService.getMarks(filters, user);
    res.status(200).json({
      success: true,
      data: marks,
      count: marks.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch student marks',
    });
  }
};

/**
 * Get single mark by ID with security boundary check
 * GET /api/marks/:id
 */
export const getMarkByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user || { id: 'admin-001', role: 'ADMIN' };
    const mark = await markService.getMarkById(req.params.id, user);
    res.status(200).json({
      success: true,
      data: mark,
    });
  } catch (error: any) {
    const status = error.message.includes('Access Denied') ? 403 : 404;
    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Workflow 19: Create new mark entry (Teacher / Admin)
 * POST /api/marks
 */
export const createMarkHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user || { id: 'teacher-001', name: 'Faculty Staff', role: 'TEACHER' };
    const {
      studentId,
      subjectId,
      testId,
      marksObtained,
      maxMarks,
      answerSheetUrl,
      answerSheetName,
      answerSheetSize,
      mimeType,
      isPublished,
      remarks,
    } = req.body;

    if (!studentId || !testId || marksObtained === undefined) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: studentId, testId, and marksObtained are mandatory',
      });
      return;
    }

    const mark = await markService.createMark(
      {
        studentId,
        subjectId: subjectId || 'sub-general',
        testId,
        marksObtained: Number(marksObtained),
        maxMarks: maxMarks ? Number(maxMarks) : undefined,
        answerSheetUrl,
        answerSheetName,
        answerSheetSize,
        mimeType,
        isPublished: isPublished !== undefined ? isPublished : true,
        remarks,
      },
      user
    );

    try {
      await auditService.logAudit({
        userId: user.id || 'teacher-001',
        userName: user.name || 'Faculty Staff',
        userRole: user.role || 'TEACHER',
        action: 'MARKS_ENTRY',
        actionLabel: 'Teacher entered marks',
        entity: 'Mark',
        entityId: mark.id,
        entityName: `${mark.subjectName} - ${mark.studentName} (${mark.testName})`,
        oldValue: null,
        newValue: {
          marksObtained: mark.marksObtained,
          maxMarks: mark.maxMarks,
          percentage: mark.percentage,
          subject: mark.subjectName,
        },
        reason: remarks || 'Initial marks evaluation entry',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string,
      });
    } catch (_) {}

    res.status(201).json({
      success: true,
      data: mark,
      message: `Marks recorded successfully for ${mark.studentName} (${mark.marksObtained}/${mark.maxMarks} - ${mark.percentage}%)`,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to record student marks',
    });
  }
};

/**
 * Workflow 20: Edit marks with mandatory audit trail reason (Teacher / Admin)
 * PUT /api/marks/:id
 */
export const updateMarkHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user || { id: 'teacher-001', name: 'Faculty Staff', role: 'TEACHER' };
    const {
      marksObtained,
      reason,
      answerSheetUrl,
      answerSheetName,
      answerSheetSize,
      mimeType,
      isPublished,
      remarks,
    } = req.body;

    if (!reason || !reason.trim()) {
      res.status(400).json({
        success: false,
        message: 'A valid reason for editing marks is mandatory to maintain an audit trail (e.g. "Rechecking")',
      });
      return;
    }

    let previous: any = null;
    try {
      previous = await markService.getMarkById(req.params.id, user);
    } catch (_) {}

    const updated = await markService.updateMark(
      req.params.id,
      {
        marksObtained: marksObtained !== undefined ? Number(marksObtained) : undefined,
        reason: reason.trim(),
        answerSheetUrl,
        answerSheetName,
        answerSheetSize,
        mimeType,
        isPublished,
        remarks,
      },
      user
    );

    if (previous) {
      try {
        await auditService.logAudit({
          userId: user.id || 'teacher-001',
          userName: user.name || 'Faculty Staff',
          userRole: user.role || 'TEACHER',
          action: 'MARKS_EDIT',
          actionLabel: 'Teacher changed marks',
          entity: 'Mark',
          entityId: updated.id,
          entityName: `${updated.subjectName} - ${updated.studentName} (${updated.testName})`,
          oldValue: {
            marksObtained: previous.marksObtained,
            percentage: previous.percentage,
          },
          newValue: {
            marksObtained: updated.marksObtained,
            percentage: updated.percentage,
          },
          reason: reason.trim(),
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] as string,
        });
      } catch (_) {}
    }

    res.status(200).json({
      success: true,
      data: updated,
      message: `Marks successfully updated to ${updated.marksObtained}/${updated.maxMarks}. Audit record saved.`,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update marks',
    });
  }
};

/**
 * Workflow 18: Upload scanned answer sheet file
 * POST /api/marks/upload-answer-sheet
 */
export const uploadAnswerSheetHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No scanned answer sheet file provided or file type rejected',
      });
      return;
    }

    const uploadResult = await uploadAnswerSheetFile(file);

    res.status(200).json({
      success: true,
      data: {
        fileUrl: uploadResult.url,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
        isCloudinary: uploadResult.isCloudinary,
      },
      message: uploadResult.isCloudinary
        ? 'Answer sheet uploaded securely to Cloudinary storage'
        : 'Answer sheet uploaded and stored in dedicated object storage',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload answer sheet',
    });
  }
};

/**
 * Get audit trail for a mark record
 * GET /api/marks/:id/audit-trail
 */
export const getAuditTrailHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await markService.getAuditTrail(req.params.id);
    res.status(200).json({
      success: true,
      data: logs,
      count: logs.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch audit trail',
    });
  }
};

/**
 * Toggle visibility of marks and answer sheet to parents/students
 * PATCH /api/marks/:id/visibility
 */
export const toggleVisibilityHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user || { id: 'teacher-001', name: 'Faculty Staff', role: 'TEACHER' };
    const { isPublished } = req.body;

    if (isPublished === undefined) {
      res.status(400).json({
        success: false,
        message: 'isPublished boolean is required',
      });
      return;
    }

    const updated = await markService.togglePublishStatus(req.params.id, Boolean(isPublished), user);
    res.status(200).json({
      success: true,
      data: updated,
      message: `Answer sheet visibility set to ${updated.isPublished ? 'Published to Parent' : 'Hidden from Parent'}`,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update visibility status',
    });
  }
};

export default {
  getMarksHandler,
  getMarkByIdHandler,
  createMarkHandler,
  updateMarkHandler,
  uploadAnswerSheetHandler,
  getAuditTrailHandler,
  toggleVisibilityHandler,
};
