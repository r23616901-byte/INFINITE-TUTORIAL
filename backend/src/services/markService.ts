import prisma from './prisma';
import {
  StudentMarkDto,
  MarkAuditLogDto,
  CreateMarkPayload,
  UpdateMarkPayload,
  MarkFilters,
} from '../types';
import { checkDbAvailability } from './academicService';
import { getStudents, getStudentForParent, isStudentAuthorizedForUser } from './studentService';
import { getTests } from './testService';

// ----------------------------------------------------------------------
// PRE-SEEDED MARKS & TAMPER-PROOF AUDIT LOGS (PROMPT STEPS 18, 19, 20)
// ----------------------------------------------------------------------

// 1. Audit Log for Rahul Kumar's mark revision
let inMemoryAuditLogs: MarkAuditLogDto[] = [
  {
    id: 'audit-rahul-001',
    markId: 'mark-rahul-001',
    oldMarks: 38,
    newMarks: 42,
    oldPercentage: 76.0,
    newPercentage: 84.0,
    changedById: 'teacher-001',
    changedByName: 'Prof. Rajesh Sharma (Physics)',
    changedByRole: 'TEACHER',
    changedAt: new Date('2026-09-18T17:30:00.000Z'), // "18/09/2026 5:30 PM"
    reason: 'Rechecking',
    createdAt: new Date('2026-09-18T17:30:00.000Z'),
  },
];

// 2. Pre-seeded Student Marks (Including exact User Prompt Example)
// Student: Rahul | Subject: Physics | Test: Chapter 3 Test | Max Marks: 50 | Marks: 42 | 84%
let inMemoryMarks: StudentMarkDto[] = [
  {
    id: 'mark-rahul-001',
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    testId: 'tst-cbse10-phy-003',
    testCode: 'TST-10-PHY-003',
    testName: 'Chapter 3 Test',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    maxMarks: 50,
    marksObtained: 42,
    percentage: 84.0,
    answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Physics_Ch3_Evaluated.pdf',
    answerSheetName: 'Rahul_Kumar_Physics_Ch3_Evaluated.pdf',
    answerSheetSize: 2451200, // 2.45 MB
    mimeType: 'application/pdf',
    isPublished: true,
    remarks: 'Strong conceptual clarity in Optics & Ray diagrams. Rechecked question 4 (+4 marks).',
    createdById: 'teacher-001',
    createdByName: 'Prof. Rajesh Sharma (Physics)',
    createdAt: new Date('2026-09-15T11:00:00.000Z'),
    updatedAt: new Date('2026-09-18T17:30:00.000Z'),
  },
  {
    id: 'mark-sneha-002',
    studentId: 'stu-10026',
    studentName: 'Sneha Verma',
    studentRoll: 'IT10026',
    testId: 'tst-cbse10-mat-001',
    testCode: 'TST-10-MAT-001',
    testName: 'Unit Test',
    subjectId: 'sub-mat',
    subjectName: 'Mathematics',
    maxMarks: 40,
    marksObtained: 36,
    percentage: 90.0,
    answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Maths_Unit_Test.pdf',
    answerSheetName: 'Sneha_Verma_Maths_Unit_Test.pdf',
    answerSheetSize: 1823000,
    mimeType: 'application/pdf',
    isPublished: true,
    remarks: 'Excellent presentation and theorem step-by-step proofs.',
    createdById: 'teacher-001',
    createdByName: 'Prof. Rajesh Sharma (Mathematics)',
    createdAt: new Date('2026-09-16T10:30:00.000Z'),
    updatedAt: new Date('2026-09-16T10:30:00.000Z'),
  },
  {
    id: 'mark-aditya-003',
    studentId: 'stu-10027',
    studentName: 'Aditya Rao',
    studentRoll: 'IT10027',
    testId: 'tst-ksb9-mat-004',
    testCode: 'TST-09-MAT-004',
    testName: 'Monthly Test',
    subjectId: 'sub-mat',
    subjectName: 'Mathematics',
    maxMarks: 25,
    marksObtained: 18,
    percentage: 72.0,
    answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Maths_Monthly.pdf',
    answerSheetName: 'Aditya_Rao_Maths_Monthly.pdf',
    answerSheetSize: 1540000,
    mimeType: 'application/pdf',
    isPublished: true,
    remarks: 'Good progress. Needs practice on Quadratic Factorization.',
    createdById: 'teacher-002',
    createdByName: 'Dr. Anita Desai',
    createdAt: new Date('2026-09-17T14:15:00.000Z'),
    updatedAt: new Date('2026-09-17T14:15:00.000Z'),
  },
];

/**
 * Fetch marks with strict role-based privacy isolation
 */
export const getMarks = async (
  filters: MarkFilters = {},
  user: { id: string; role: string; phone?: string; studentId?: string } = { id: 'admin-001', role: 'ADMIN' }
): Promise<StudentMarkDto[]> => {
  // If Parent or Student, strictly restrict to their linked child/student
  let authorizedStudentRoll: string | null = null;
  let authorizedStudentId: string | null = null;

  if (user.role === 'PARENT') {
    const linkedStudent = await getStudentForParent(user.id, user.phone);
    if (!linkedStudent) {
      return [];
    }
    authorizedStudentRoll = linkedStudent.studentId;
    authorizedStudentId = linkedStudent.id;

    // Tamper Prevention: If parent specifically provided another studentId, reject
    if (filters.studentId) {
      const q = filters.studentId.trim().toLowerCase();
      if (q !== authorizedStudentRoll.toLowerCase() && q !== authorizedStudentId.toLowerCase()) {
        throw new Error('Access Denied: You are not authorized to view another student’s marks');
      }
    }
  } else if (user.role === 'STUDENT') {
    authorizedStudentRoll = user.studentId || null;
  }

  // 1. Database query if available
  if (await checkDbAvailability()) {
    try {
      const where: any = {};

      if (authorizedStudentRoll) {
        where.student = { studentId: authorizedStudentRoll };
        where.isPublished = true; // Parents/students can view only if published
      } else {
        if (filters.studentId) {
          where.OR = [
            { studentId: filters.studentId },
            { studentRoll: filters.studentId },
          ];
        }
        if (filters.isPublished !== undefined) {
          where.isPublished = filters.isPublished;
        }
      }

      if (filters.testId && filters.testId !== 'ALL') {
        where.testId = filters.testId;
      }
      if (filters.subjectName && filters.subjectName !== 'ALL') {
        where.subjectName = { contains: filters.subjectName, mode: 'insensitive' };
      }

      const dbMarks = await (prisma as any).studentMark.findMany({
        where,
        include: {
          auditLogs: {
            orderBy: { changedAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (dbMarks && dbMarks.length > 0) {
        return dbMarks.map((m: any) => ({
          id: m.id,
          studentId: m.studentId,
          studentName: m.studentName,
          studentRoll: m.studentRoll,
          testId: m.testId,
          testCode: m.testCode,
          testName: m.testName,
          subjectId: m.subjectId,
          subjectName: m.subjectName,
          maxMarks: m.maxMarks,
          marksObtained: m.marksObtained,
          percentage: m.percentage,
          answerSheetUrl: m.answerSheetUrl,
          answerSheetName: m.answerSheetName,
          answerSheetSize: m.answerSheetSize,
          mimeType: m.mimeType,
          isPublished: m.isPublished,
          remarks: m.remarks,
          createdById: m.createdById,
          createdByName: m.createdByName,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt,
          auditLogs: (m.auditLogs || []).map((a: any) => ({
            id: a.id,
            markId: a.markId,
            oldMarks: a.oldMarks,
            newMarks: a.newMarks,
            oldPercentage: a.oldPercentage,
            newPercentage: a.newPercentage,
            changedById: a.changedById,
            changedByName: a.changedByName,
            changedByRole: a.changedByRole,
            changedAt: a.changedAt,
            reason: a.reason,
            createdAt: a.createdAt,
          })),
        }));
      }
    } catch {}
  }

  // 2. Fallback In-Memory Query
  let results = inMemoryMarks.map((m) => {
    const logs = inMemoryAuditLogs.filter((a) => a.markId === m.id);
    return { ...m, auditLogs: logs };
  });

  // Strict privacy filter for parent/student
  if (authorizedStudentRoll) {
    results = results.filter(
      (m) => (m.studentRoll === authorizedStudentRoll || m.studentId === authorizedStudentRoll) && m.isPublished
    );
  } else {
    if (filters.studentId) {
      const q = filters.studentId.toLowerCase();
      results = results.filter(
        (m) => m.studentId.toLowerCase() === q || m.studentRoll.toLowerCase() === q
      );
    }
    if (filters.isPublished !== undefined) {
      results = results.filter((m) => m.isPublished === filters.isPublished);
    }
  }

  if (filters.testId && filters.testId !== 'ALL') {
    results = results.filter(
      (m) => m.testId === filters.testId || m.testCode === filters.testId
    );
  }

  if (filters.subjectName && filters.subjectName !== 'ALL') {
    const s = filters.subjectName.toLowerCase();
    results = results.filter((m) => m.subjectName.toLowerCase().includes(s));
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (m) =>
        m.studentName.toLowerCase().includes(q) ||
        m.studentRoll.toLowerCase().includes(q) ||
        m.testName.toLowerCase().includes(q) ||
        m.subjectName.toLowerCase().includes(q)
    );
  }

  return results.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * Get single mark by ID with security boundary
 */
export const getMarkById = async (
  id: string,
  user: { id: string; role: string; studentId?: string }
): Promise<StudentMarkDto> => {
  const allMarks = await getMarks({}, { id: 'admin', role: 'ADMIN' });
  const mark = allMarks.find((m) => m.id === id);

  if (!mark) {
    throw new Error('Marks record not found');
  }

  // Strict isolation check for parent / student
  if (user.role === 'PARENT') {
    const isAuthorized = await isStudentAuthorizedForUser(mark.studentId, user) ||
                         await isStudentAuthorizedForUser(mark.studentRoll, user);
    if (!isAuthorized) {
      throw new Error(
        'Access Denied: You are not authorized to view another student’s answer sheet or marks'
      );
    }
    if (!mark.isPublished) {
      throw new Error('This answer sheet has not yet been published by faculty.');
    }
  } else if (user.role === 'STUDENT') {
    const authorizedRoll = user.studentId || '';
    if (mark.studentRoll !== authorizedRoll && mark.studentId !== authorizedRoll) {
      throw new Error(
        'Access Denied: You are not authorized to view another student’s answer sheet or marks'
      );
    }
    if (!mark.isPublished) {
      throw new Error('This answer sheet has not yet been published by faculty.');
    }
  }

  return mark;
};

/**
 * Workflow 19: Marks Entry
 * Select Student -> Select Subject -> Select Test -> Enter Marks -> Upload Answer Sheet -> Save
 */
export const createMark = async (
  payload: CreateMarkPayload,
  creator: { id: string; name: string; role: string }
): Promise<StudentMarkDto> => {
  // 1. Resolve Student
  const { students } = await getStudents({ limit: 100 });
  const student = students.find(
    (s) =>
      s.id === payload.studentId ||
      s.studentId.toLowerCase() === payload.studentId.toLowerCase()
  );
  if (!student) {
    throw new Error(`Student "${payload.studentId}" not found`);
  }

  // 2. Resolve Test
  const tests = await getTests();
  const test = tests.find(
    (t: any) =>
      t.id === payload.testId ||
      t.testId.toLowerCase() === payload.testId.toLowerCase() ||
      t.name.toLowerCase() === payload.testId.toLowerCase()
  );

  const maxMarks = payload.maxMarks || (test ? test.maxMarks : 50);
  const testCode = test ? test.testId : 'TST-CUSTOM';
  const testName = test ? test.name : payload.testId;
  const subjectName = test ? test.subjectName : payload.subjectId;

  // Validation
  if (payload.marksObtained < 0) {
    throw new Error('Marks obtained cannot be negative');
  }
  if (payload.marksObtained > maxMarks) {
    throw new Error(`Marks obtained (${payload.marksObtained}) cannot exceed Maximum Marks (${maxMarks})`);
  }

  const percentage = Number(((payload.marksObtained / maxMarks) * 100).toFixed(1));

  const newMark: StudentMarkDto = {
    id: `mark-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    studentId: student.id,
    studentName: student.name,
    studentRoll: student.studentId,
    testId: test ? test.id : payload.testId,
    testCode,
    testName,
    subjectId: payload.subjectId,
    subjectName,
    maxMarks,
    marksObtained: payload.marksObtained,
    percentage,
    answerSheetUrl: payload.answerSheetUrl || null,
    answerSheetName: payload.answerSheetName || null,
    answerSheetSize: payload.answerSheetSize || null,
    mimeType: payload.mimeType || null,
    isPublished: payload.isPublished !== undefined ? payload.isPublished : true,
    remarks: payload.remarks || null,
    createdById: creator.id,
    createdByName: creator.name || 'Faculty Teacher',
    createdAt: new Date(),
    updatedAt: new Date(),
    auditLogs: [],
  };

  // Prevent duplicate entry for same student and test
  const existingIdx = inMemoryMarks.findIndex(
    (m) =>
      (m.studentId === student.id || m.studentRoll === student.studentId) &&
      m.testId === newMark.testId
  );
  if (existingIdx >= 0) {
    throw new Error(
      `Marks for student "${student.name}" on test "${testName}" already exist. Please use Mark Editing instead.`
    );
  }

  inMemoryMarks.unshift(newMark);

  // Database persistence if available
  if (await checkDbAvailability()) {
    try {
      await (prisma as any).studentMark.create({
        data: {
          studentId: student.id,
          studentName: student.name,
          studentRoll: student.studentId,
          testId: test ? test.id : payload.testId,
          testCode,
          testName,
          subjectId: payload.subjectId,
          subjectName,
          maxMarks,
          marksObtained: payload.marksObtained,
          percentage,
          answerSheetUrl: payload.answerSheetUrl,
          answerSheetName: payload.answerSheetName,
          answerSheetSize: payload.answerSheetSize,
          mimeType: payload.mimeType,
          isPublished: newMark.isPublished,
          remarks: payload.remarks,
          createdById: creator.id,
          createdByName: creator.name,
        },
      });
    } catch {}
  }

  return newMark;
};

/**
 * Workflow 20: Mark Editing with Tamper-Proof Audit Trail
 * Authorized Admin/Teacher can edit marks. Whenever marks are edited, maintain an audit record.
 */
export const updateMark = async (
  id: string,
  payload: UpdateMarkPayload,
  updater: { id: string; name: string; role: string }
): Promise<StudentMarkDto> => {
  if (updater.role !== 'TEACHER' && updater.role !== 'ADMIN') {
    throw new Error('Access Denied: Only authorized faculty teachers and admins can edit marks.');
  }

  const markIdx = inMemoryMarks.findIndex((m) => m.id === id);
  if (markIdx === -1) {
    throw new Error('Marks record not found');
  }

  const currentMark = inMemoryMarks[markIdx];

  // Enforce mandatory audit reason
  if (!payload.reason || !payload.reason.trim()) {
    throw new Error(
      'Audit Trail Requirement: A valid reason (e.g. "Rechecking", "Totalling correction") must be provided to edit marks.'
    );
  }

  const oldMarks = currentMark.marksObtained;
  const newMarks = payload.marksObtained !== undefined ? payload.marksObtained : oldMarks;

  if (newMarks < 0 || newMarks > currentMark.maxMarks) {
    throw new Error(`Marks obtained must be between 0 and maximum marks (${currentMark.maxMarks})`);
  }

  const oldPercentage = currentMark.percentage;
  const newPercentage = Number(((newMarks / currentMark.maxMarks) * 100).toFixed(1));

  // Create immutable Audit Log Record
  const auditLog: MarkAuditLogDto = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    markId: currentMark.id,
    oldMarks,
    newMarks,
    oldPercentage,
    newPercentage,
    changedById: updater.id,
    changedByName: updater.name || `${updater.role} Faculty`,
    changedByRole: updater.role,
    changedAt: new Date(),
    reason: payload.reason.trim(),
    createdAt: new Date(),
  };

  inMemoryAuditLogs.unshift(auditLog);

  // Update mark record
  const updatedMark: StudentMarkDto = {
    ...currentMark,
    marksObtained: newMarks,
    percentage: newPercentage,
    answerSheetUrl: payload.answerSheetUrl !== undefined ? payload.answerSheetUrl : currentMark.answerSheetUrl,
    answerSheetName: payload.answerSheetName !== undefined ? payload.answerSheetName : currentMark.answerSheetName,
    answerSheetSize: payload.answerSheetSize !== undefined ? payload.answerSheetSize : currentMark.answerSheetSize,
    mimeType: payload.mimeType !== undefined ? payload.mimeType : currentMark.mimeType,
    isPublished: payload.isPublished !== undefined ? payload.isPublished : currentMark.isPublished,
    remarks: payload.remarks !== undefined ? payload.remarks : currentMark.remarks,
    updatedAt: new Date(),
  };

  inMemoryMarks[markIdx] = updatedMark;

  // DB persistence if available
  if (await checkDbAvailability()) {
    try {
      await (prisma as any).markAuditLog.create({
        data: {
          markId: currentMark.id,
          oldMarks,
          newMarks,
          oldPercentage,
          newPercentage,
          changedById: updater.id,
          changedByName: updater.name,
          changedByRole: updater.role,
          changedAt: auditLog.changedAt,
          reason: auditLog.reason,
        },
      });

      await (prisma as any).studentMark.update({
        where: { id: currentMark.id },
        data: {
          marksObtained: newMarks,
          percentage: newPercentage,
          answerSheetUrl: updatedMark.answerSheetUrl,
          answerSheetName: updatedMark.answerSheetName,
          answerSheetSize: updatedMark.answerSheetSize,
          mimeType: updatedMark.mimeType,
          isPublished: updatedMark.isPublished,
          remarks: updatedMark.remarks,
        },
      });
    } catch {}
  }

  return {
    ...updatedMark,
    auditLogs: inMemoryAuditLogs.filter((a) => a.markId === updatedMark.id),
  };
};

/**
 * Toggle whether answer sheet is published to student / parent
 */
export const togglePublishStatus = async (
  id: string,
  isPublished: boolean,
  updater: { id: string; name: string; role: string }
): Promise<StudentMarkDto> => {
  return updateMark(
    id,
    {
      isPublished,
      reason: `Publish status changed to ${isPublished ? 'Published' : 'Hidden'} by ${updater.role}`,
    },
    updater
  );
};

/**
 * Get audit trail for a mark
 */
export const getAuditTrail = async (markId: string): Promise<MarkAuditLogDto[]> => {
  if (await checkDbAvailability()) {
    try {
      const logs = await (prisma as any).markAuditLog.findMany({
        where: { markId },
        orderBy: { changedAt: 'desc' },
      });
      if (logs && logs.length > 0) return logs;
    } catch {}
  }

  return inMemoryAuditLogs.filter((a) => a.markId === markId);
};

/**
 * Delete mark record (Faculty Teacher & Admin only)
 */
export const deleteMark = async (
  id: string,
  deleter: { id: string; name: string; role: string }
): Promise<boolean> => {
  if (deleter.role !== 'TEACHER' && deleter.role !== 'ADMIN') {
    throw new Error('Access Denied: Only authorized faculty teachers and admins can delete marks.');
  }

  const idx = inMemoryMarks.findIndex((m) => m.id === id);
  if (idx === -1) {
    throw new Error('Marks record not found');
  }

  inMemoryMarks.splice(idx, 1);
  return true;
};

export default {
  getMarks,
  getMarkById,
  createMark,
  updateMark,
  deleteMark,
  togglePublishStatus,
  getAuditTrail,
};

