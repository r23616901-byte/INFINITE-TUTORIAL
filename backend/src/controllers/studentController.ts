import { Response } from 'express';
import { AuthRequest } from '../types';
import * as studentService from '../services/studentService';
import * as auditService from '../services/auditService';
import { StudentStatusType } from '../types';

/**
 * GET /api/students
 * List students with search and multi-field filters (Admin & Teacher)
 */
export const getStudentsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      search,
      name,
      studentId,
      parentPhone,
      school,
      classId,
      boardId,
      batchId,
      status,
      page,
      limit,
    } = req.query;

    const filters = {
      search: search ? String(search) : undefined,
      name: name ? String(name) : undefined,
      studentId: studentId ? String(studentId) : undefined,
      parentPhone: parentPhone ? String(parentPhone) : undefined,
      school: school ? String(school) : undefined,
      classId: classId ? String(classId) : undefined,
      boardId: boardId ? String(boardId) : undefined,
      batchId: batchId ? String(batchId) : undefined,
      status: status ? (String(status) as StudentStatusType) : undefined,
      page: page ? parseInt(String(page), 10) : 1,
      limit: limit ? parseInt(String(limit), 10) : 50,
    };

    const data = await studentService.getStudents(filters);

    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve students',
    });
  }
};

/**
 * GET /api/students/profile/me
 * Retrieve the logged-in parent's linked student profile
 */
export const getMyStudentProfileHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const student = await studentService.getStudentForParent(req.user.id, req.user.phone);

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'No student record found linked to your account. Please contact Admin.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve student profile',
    });
  }
};

/**
 * GET /api/students/lookups
 * Return available classes, boards, and batches
 */
export const getAcademicLookupsHandler = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await studentService.getAcademicLookups();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve academic lookups',
    });
  }
};

/**
 * GET /api/students/:id
 * Retrieve a single student by ID
 */
export const getStudentByIdHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const student = await studentService.getStudentById(id);

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    // Role check: If parent, ensure this student is linked to them
    if (req.user?.role === 'PARENT') {
      const isAuthorized = await studentService.isStudentAuthorizedForUser(id, req.user);
      if (!isAuthorized) {
        res.status(403).json({
          success: false,
          message: 'Access Denied: You are not authorized to view another student profile.',
        });
        return;
      }
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve student details',
    });
  }
};

/**
 * POST /api/students
 * Add a new student (Admin Only)
 */
export const createStudentHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      studentId,
      name,
      photoUrl,
      school,
      parentName,
      parentPhone,
      studentPhone,
      dateOfBirth,
      classId,
      boardId,
      batchId,
      academicYear,
      admissionDate,
      status,
    } = req.body;

    if (!name || !school || !parentName || !parentPhone || !dateOfBirth || !classId || !boardId || !batchId) {
      res.status(400).json({
        success: false,
        message: 'Required fields missing: name, school, parentName, parentPhone, dateOfBirth, classId, boardId, batchId',
      });
      return;
    }

    const created = await studentService.createStudent({
      studentId,
      name,
      photoUrl,
      school,
      parentName,
      parentPhone,
      studentPhone,
      dateOfBirth,
      classId,
      boardId,
      batchId,
      academicYear,
      admissionDate,
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: created,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create student record',
    });
  }
};

/**
 * PUT /api/students/:id
 * Edit student information (Admin Only)
 */
export const updateStudentHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    let existing: any = null;
    try {
      existing = await studentService.getStudentById(id);
    } catch (_) {}

    const updated = await studentService.updateStudent(id, req.body);

    if (existing && req.user) {
      if (req.body.batchId && existing.batchId !== updated.batchId) {
        await auditService.logAudit({
          userId: req.user.id,
          userName: req.user.name || 'Admin',
          userRole: req.user.role,
          action: 'BATCH_CHANGE',
          actionLabel: 'Admin changed batch',
          entity: 'Batch',
          entityId: updated.studentId || updated.id,
          entityName: `${updated.name} (${updated.className} ${updated.boardName})`,
          oldValue: { batchId: existing.batchId, batchName: existing.batchName },
          newValue: { batchId: updated.batchId, batchName: updated.batchName },
          reason: req.body.reason || 'Batch transfer / rescheduling',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] as string,
        });
      } else {
        await auditService.logAudit({
          userId: req.user.id,
          userName: req.user.name || 'Admin',
          userRole: req.user.role,
          action: 'STUDENT_PROFILE_EDIT',
          actionLabel: 'Admin edited student profile',
          entity: 'Student',
          entityId: updated.studentId || updated.id,
          entityName: `${updated.name} (${updated.className} ${updated.boardName})`,
          oldValue: {
            name: existing.name,
            parentName: existing.parentName,
            parentPhone: existing.parentPhone,
            school: existing.school,
            className: existing.className,
            batchName: existing.batchName,
          },
          newValue: {
            name: updated.name,
            parentName: updated.parentName,
            parentPhone: updated.parentPhone,
            school: updated.school,
            className: updated.className,
            batchName: updated.batchName,
          },
          reason: req.body.reason || 'Student profile update',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] as string,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Student information updated successfully',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update student record',
    });
  }
};

/**
 * PATCH /api/students/:id/status
 * Deactivate or change enrollment status (Admin Only)
 */
export const setStudentStatusHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: 'Status is required (ACTIVE, INACTIVE, TRANSFERRED, COMPLETED, SUSPENDED)',
      });
      return;
    }

    const updated = await studentService.setStudentStatus(id, status as StudentStatusType);

    res.status(200).json({
      success: true,
      message: `Student status successfully changed to ${status}`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update student status',
    });
  }
};
