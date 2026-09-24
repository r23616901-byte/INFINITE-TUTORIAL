import { Request, Response } from 'express';
import teacherService from '../services/teacherService';
import * as auditService from '../services/auditService';

export const getTeachersHandler = async (req: Request, res: Response) => {
  try {
    const { search, status } = req.query;
    const teachers = await teacherService.getTeachers({
      search: search as string,
      status: status as string,
    });
    return res.status(200).json({ success: true, data: teachers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = await teacherService.getTeacherById(id);
    return res.status(200).json({ success: true, data: teacher });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const createTeacherHandler = async (req: Request, res: Response) => {
  try {
    const teacher = await teacherService.createTeacher(req.body);
    return res.status(201).json({
      success: true,
      message: 'Teacher successfully registered.',
      data: teacher,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTeacherHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = await teacherService.updateTeacher(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Teacher details successfully updated.',
      data: teacher,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const toggleTeacherStatusHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const teacher = await teacherService.toggleTeacherStatus(id, status);
    return res.status(200).json({
      success: true,
      message: `Teacher status updated to ${status}.`,
      data: teacher,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const assignSubjectsAndBatchesHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { subjects, batches } = req.body;
    const teacher = await teacherService.assignSubjectsAndBatches(id, subjects, batches);
    return res.status(200).json({
      success: true,
      message: 'Subjects and batches successfully assigned.',
      data: teacher,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const resetTeacherPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await teacherService.resetTeacherPassword(id);
    const user = (req as any).user;

    try {
      const teacher = await teacherService.getTeacherById(id);
      await auditService.logAudit({
        userId: user?.id || 'admin-1',
        userName: user?.name || 'Admin Rajesh Verma',
        userRole: user?.role || 'ADMIN',
        action: 'PASSWORD_RESET',
        actionLabel: 'Admin reset password',
        entity: 'User',
        entityId: id,
        entityName: teacher?.name ? `Teacher ${teacher.name}` : `Teacher (${id})`,
        oldValue: { passwordStatus: 'ACTIVE', mustChangePassword: false },
        newValue: { passwordStatus: 'RESET_TEMPORARY', mustChangePassword: true },
        reason: req.body?.reason || 'Faculty locked out after credential loss',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string,
      });
    } catch (_) {}

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAssignedStudentsHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await teacherService.getAssignedStudents(id);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message });
  }
};
