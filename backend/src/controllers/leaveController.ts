import { Response } from 'express';
import { AuthRequest, LeaveStatusType } from '../types';
import * as leaveService from '../services/leaveService';
import * as auditService from '../services/auditService';

export const createLeaveHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { studentId, fromDate, toDate, session, reason, description, attachmentUrl } = req.body;

    if (!fromDate || !reason || !description) {
      res.status(400).json({
        success: false,
        message: 'fromDate, reason, and description are required',
      });
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const data = await leaveService.createLeaveRequest(
      {
        studentId,
        fromDate,
        toDate: toDate || fromDate,
        session: session || 'BOTH',
        reason,
        description,
        attachmentUrl,
      },
      {
        id: user.id,
        role: user.role,
        name: user.name,
        phone: user.phone,
      }
    );

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully. Status: PENDING',
      data,
    });
  } catch (err: any) {
    const status = err.message.includes('Access Denied') ? 403 : 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Failed to submit leave request',
    });
  }
};

export const getLeavesHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { status, search, studentId } = req.query;

    const data = await leaveService.getLeaveRequests(
      {
        status: status ? (String(status) as LeaveStatusType) : undefined,
        search: search ? String(search) : undefined,
        studentId: studentId ? String(studentId) : undefined,
      },
      {
        id: user.id,
        role: user.role,
        phone: user.phone,
      }
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    const status = err.message.includes('Access Denied') ? 403 : 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Failed to retrieve leave requests',
    });
  }
};

export const reviewLeaveHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leaveId = String(req.params.id);
    const { status, reviewNote } = req.body;

    if (!status || (status !== 'APPROVED' && status !== 'REJECTED')) {
      res.status(400).json({
        success: false,
        message: 'Valid status ("APPROVED" or "REJECTED") is required',
      });
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const data = await leaveService.reviewLeaveRequest(
      leaveId,
      { status, reviewNote },
      {
        id: user.id,
        name: user.name || 'Faculty Member',
        role: user.role,
      }
    );

    try {
      await auditService.logAudit({
        userId: user.id,
        userName: user.name || (user.role === 'ADMIN' ? 'Admin' : 'Teacher'),
        userRole: user.role,
        action: status === 'APPROVED' ? 'LEAVE_APPROVAL' : 'LEAVE_REJECT',
        actionLabel: status === 'APPROVED' ? 'Admin approved leave' : 'Admin rejected leave',
        entity: 'LeaveRequest',
        entityId: leaveId,
        entityName: data?.studentName ? `${data.studentName} (Leave)` : `Leave ${leaveId}`,
        oldValue: { status: 'PENDING' },
        newValue: { status, reviewNote: reviewNote || null },
        reason: reviewNote || (status === 'APPROVED' ? 'Medical/official leave approved' : 'Leave request rejected'),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string,
      });
    } catch (_) {}

    res.status(200).json({
      success: true,
      message: `Leave request has been ${status.toLowerCase()} successfully`,
      data,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to review leave request',
    });
  }
};
