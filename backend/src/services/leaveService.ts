import prisma from './prisma';
import {
  LeaveRequestDto,
  CreateLeaveRequestPayload,
  ReviewLeaveRequestPayload,
  LeaveStatusType,
} from '../types';
import { checkDbAvailability } from './academicService';
import { getStudents, getStudentForParent, isStudentAuthorizedForUser } from './studentService';

// ---------------------------------------------------------------------------
// Seed Leave Requests store for instant demo & in-memory fallback
// Pre-populated with prompt example: Rahul Kumar, 18/09/2026, Medical, Pending
// ---------------------------------------------------------------------------
let inMemoryLeaves: LeaveRequestDto[] = [
  {
    id: 'leave-seed-1',
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    className: 'Class 10',
    batchName: '10th A Morning',
    parentId: 'parent-uuid-3333-4444-555566667777',
    parentName: 'Mr. Ramesh Kumar',
    parentPhone: '6361085188',
    fromDate: '2026-09-18',
    toDate: '2026-09-19',
    session: 'MORNING',
    reason: 'Medical',
    description: 'Suffering from viral fever and throat infection. Doctor advised 2 days bed rest.',
    attachmentUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400',
    status: 'PENDING',
    reviewedById: null,
    reviewedByName: null,
    reviewNote: null,
    reviewedAt: null,
    createdAt: new Date('2026-09-17T09:30:00.000Z'),
    updatedAt: new Date('2026-09-17T09:30:00.000Z'),
  },
  {
    id: 'leave-seed-2',
    studentId: 'stu-10026',
    studentName: 'Sneha Verma',
    studentRoll: 'IT10026',
    className: 'Class 10',
    batchName: '10th A Morning',
    parentId: 'parent-2',
    parentName: 'Rajesh Verma',
    parentPhone: '9845112233',
    fromDate: '2026-09-12',
    toDate: '2026-09-12',
    session: 'BOTH',
    reason: 'Family Function',
    description: 'Attending elder sister wedding ceremony in Mysore.',
    attachmentUrl: null,
    status: 'APPROVED',
    reviewedById: 'teacher-uuid-2222',
    reviewedByName: 'Prof. Rajesh Sharma (Physics)',
    reviewNote: 'Approved. Ensure to collect Physics lecture notes and homework on return.',
    reviewedAt: new Date('2026-09-11T14:15:00.000Z'),
    createdAt: new Date('2026-09-10T18:00:00.000Z'),
    updatedAt: new Date('2026-09-11T14:15:00.000Z'),
  },
  {
    id: 'leave-seed-3',
    studentId: 'stu-10027',
    studentName: 'Aditya Rao',
    studentRoll: 'IT10027',
    className: 'Class 10',
    batchName: '10th B Evening',
    parentId: 'parent-3',
    parentName: 'Suresh Rao',
    parentPhone: '9812334455',
    fromDate: '2026-09-05',
    toDate: '2026-09-05',
    session: 'EVENING',
    reason: 'Personal',
    description: 'Family outing over the weekend.',
    attachmentUrl: null,
    status: 'REJECTED',
    reviewedById: 'admin-uuid-1111',
    reviewedByName: 'System Administrator',
    reviewNote: 'Major Mathematics Chapter 4 revision test was scheduled during this session.',
    reviewedAt: new Date('2026-09-04T16:00:00.000Z'),
    createdAt: new Date('2026-09-04T10:00:00.000Z'),
    updatedAt: new Date('2026-09-04T16:00:00.000Z'),
  },
];

/**
 * Submit a new leave request (Parent or Admin)
 */
export const createLeaveRequest = async (
  payload: CreateLeaveRequestPayload,
  user: { id: string; role: string; name?: string; phone?: string }
): Promise<LeaveRequestDto> => {
  // Find linked student
  let student: any = null;

  if (user.role === 'PARENT') {
    if (payload.studentId) {
      const isAuth = await isStudentAuthorizedForUser(payload.studentId, user);
      if (!isAuth) {
        throw new Error('Access Denied: You cannot submit a leave request for another student.');
      }
    }
    student = await getStudentForParent(user.id, user.phone);
  } else {
    let targetStudentRoll = payload.studentId || 'IT10025';
    const { students } = await getStudents({ search: targetStudentRoll, limit: 1 });
    student = students[0];
  }

  const studentId = student ? student.id : 'stu-10025';
  const studentName = student ? student.name : 'Rahul Kumar';
  const studentRoll = student ? student.studentId : 'IT10025';
  const className = student ? student.className : 'Class 10';
  const batchName = student ? student.batchName : '10th A Morning';
  const parentId = student ? student.parentId : user.id;
  const parentName = user.name || (student ? student.parentName : 'Parent');
  const parentPhone = user.phone || (student ? student.parentPhone : '6361085188');

  const newLeave: LeaveRequestDto = {
    id: `leave-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    studentId,
    studentName,
    studentRoll,
    className,
    batchName,
    parentId,
    parentName,
    parentPhone,
    fromDate: payload.fromDate,
    toDate: payload.toDate || payload.fromDate,
    session: payload.session || 'BOTH',
    reason: payload.reason || 'Medical',
    description: payload.description,
    attachmentUrl: payload.attachmentUrl || null,
    status: 'PENDING',
    reviewedById: null,
    reviewedByName: null,
    reviewNote: null,
    reviewedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (await checkDbAvailability()) {
    try {
      const created = await prisma.leaveRequest.create({
        data: {
          studentId,
          parentId,
          fromDate: newLeave.fromDate,
          toDate: newLeave.toDate,
          session: newLeave.session,
          reason: newLeave.reason,
          description: newLeave.description,
          attachmentUrl: newLeave.attachmentUrl,
          status: 'PENDING',
        },
        include: { student: true, parent: true },
      });
      return {
        ...newLeave,
        id: created.id,
      };
    } catch {}
  }

  inMemoryLeaves.unshift(newLeave);
  return newLeave;
};

/**
 * Get leave requests with role-based filtering
 */
export const getLeaveRequests = async (
  filters: { status?: LeaveStatusType; search?: string; studentId?: string } = {},
  user: { id: string; role: string; phone?: string } = { id: 'admin-001', role: 'ADMIN' }
): Promise<LeaveRequestDto[]> => {
  if (await checkDbAvailability()) {
    try {
      const where: any = {};
      if (user.role === 'PARENT') {
        where.parent = { phone: user.phone };
      }
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.studentId) {
        where.student = { studentId: filters.studentId };
      }

      const list = await prisma.leaveRequest.findMany({
        where,
        include: { student: true, parent: true },
        orderBy: { createdAt: 'desc' },
      });

      if (list.length > 0) {
        return list.map((l: any) => ({
          id: l.id,
          studentId: l.studentId,
          studentName: l.student?.name || '',
          studentRoll: l.student?.studentId || '',
          className: l.student?.className || 'Class 10',
          batchName: l.student?.batchName || '10th A Morning',
          parentId: l.parentId,
          parentName: l.parent?.name || '',
          parentPhone: l.parent?.phone || '',
          fromDate: l.fromDate,
          toDate: l.toDate,
          session: l.session,
          reason: l.reason,
          description: l.description,
          attachmentUrl: l.attachmentUrl,
          status: l.status as LeaveStatusType,
          reviewedById: l.reviewedById,
          reviewedByName: l.reviewedByName,
          reviewNote: l.reviewNote,
          reviewedAt: l.reviewedAt,
          createdAt: l.createdAt,
          updatedAt: l.updatedAt,
        }));
      }
    } catch {}
  }

  let results = [...inMemoryLeaves];

  // Role constraint: Parent only sees own leaves
  if (user.role === 'PARENT') {
    const linkedStudent = await getStudentForParent(user.id, user.phone);
    if (!linkedStudent) {
      return [];
    }

    if (filters.studentId) {
      const isAuth = await isStudentAuthorizedForUser(filters.studentId, user);
      if (!isAuth) {
        throw new Error('Access Denied: You are not authorized to view another student’s leave requests');
      }
    }

    results = results.filter((l) =>
      l.studentRoll.toLowerCase() === linkedStudent.studentId.toLowerCase() ||
      l.studentId.toLowerCase() === linkedStudent.id.toLowerCase() ||
      (user.phone && l.parentPhone === user.phone)
    );
  }

  if (filters.status) {
    results = results.filter((l) => l.status === filters.status);
  }

  if (filters.studentId) {
    results = results.filter((l) => l.studentRoll === filters.studentId || l.studentId === filters.studentId);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (l) =>
        l.studentName.toLowerCase().includes(q) ||
        l.studentRoll.toLowerCase().includes(q) ||
        l.reason.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
    );
  }

  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

/**
 * Review leave request: Approve or Reject (Teacher / Admin)
 */
export const reviewLeaveRequest = async (
  leaveId: string,
  payload: ReviewLeaveRequestPayload,
  reviewer: { id: string; name: string; role: string }
): Promise<LeaveRequestDto> => {
  const reviewedAt = new Date();
  const reviewerTitle = reviewer.role === 'TEACHER' ? `Teacher ${reviewer.name}` : `Admin ${reviewer.name}`;

  if (await checkDbAvailability()) {
    try {
      const updated = await prisma.leaveRequest.update({
        where: { id: leaveId },
        data: {
          status: payload.status,
          reviewedById: reviewer.id,
          reviewedByName: reviewerTitle,
          reviewNote: payload.reviewNote || null,
          reviewedAt,
          updatedAt: reviewedAt,
        },
        include: { student: true, parent: true },
      });

      return {
        id: updated.id,
        studentId: updated.studentId,
        studentName: updated.student?.name || '',
        studentRoll: updated.student?.studentId || '',
        className: 'Class 10',
        batchName: '10th A Morning',
        parentId: updated.parentId,
        parentName: updated.parent?.name || '',
        parentPhone: updated.parent?.phone || '',
        fromDate: updated.fromDate,
        toDate: updated.toDate,
        session: updated.session,
        reason: updated.reason,
        description: updated.description,
        attachmentUrl: updated.attachmentUrl,
        status: updated.status as LeaveStatusType,
        reviewedById: updated.reviewedById,
        reviewedByName: updated.reviewedByName,
        reviewNote: updated.reviewNote,
        reviewedAt: updated.reviewedAt,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
    } catch {}
  }

  const idx = inMemoryLeaves.findIndex((l) => l.id === leaveId);
  if (idx >= 0) {
    inMemoryLeaves[idx] = {
      ...inMemoryLeaves[idx],
      status: payload.status,
      reviewedById: reviewer.id,
      reviewedByName: reviewerTitle,
      reviewNote: payload.reviewNote || (payload.status === 'APPROVED' ? 'Approved by faculty' : 'Declined'),
      reviewedAt,
      updatedAt: reviewedAt,
    };
    return inMemoryLeaves[idx];
  }

  throw new Error(`Leave request with ID ${leaveId} not found`);
};
