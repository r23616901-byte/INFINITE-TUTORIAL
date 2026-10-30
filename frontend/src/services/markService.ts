import api from './api';
import {
  StudentMark,
  MarkAuditLog,
  CreateMarkPayload,
  UpdateMarkPayload,
  MarkFilters,
} from '../types/mark';

const getSeedMarks = (): StudentMark[] => [
  {
    id: 'mrk-cbse10-phy-003',
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    testId: 'tst-cbse10-phy-003',
    testCode: 'TST-10-PHY-003',
    testName: 'Chapter 3 Test (Light Reflection & Refraction)',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    maxMarks: 50,
    marksObtained: 42,
    percentage: 84.0,
    answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Physics_Ch3_Evaluated.pdf',
    answerSheetName: 'Rahul_Kumar_Physics_Ch3_Evaluated.pdf',
    answerSheetSize: 450000,
    mimeType: 'application/pdf',
    isPublished: true,
    remarks: 'Strong conceptual clarity. Rechecked question 4 (+4 marks).',
    createdById: 'teacher-001',
    createdByName: 'Prof. Rajesh Sharma (Physics)',
    createdAt: '2026-09-18T10:00:00.000Z',
    updatedAt: '2026-09-18T16:30:00.000Z',
    auditLogs: [
      {
        id: 'aud-001',
        markId: 'mrk-cbse10-phy-003',
        oldMarks: 38,
        newMarks: 42,
        oldPercentage: 76.0,
        newPercentage: 84.0,
        changedById: 'teacher-001',
        changedByName: 'Prof. Rajesh Sharma',
        changedByRole: 'TEACHER',
        changedAt: '2026-09-18T16:30:00.000Z',
        reason: 'Rechecked ray diagram refraction angle in Question 4.',
      },
    ],
  },
  {
    id: 'mrk-cbse10-phy-001',
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    testId: 'tst-cbse10-phy-001',
    testCode: 'TST-10-PHY-001',
    testName: 'Test 1 (Electricity & Circuits)',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    maxMarks: 25,
    marksObtained: 22,
    percentage: 88.0,
    answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Physics_Test1_Evaluated.pdf',
    answerSheetName: 'Rahul_Kumar_Physics_Test1_Evaluated.pdf',
    answerSheetSize: 320000,
    mimeType: 'application/pdf',
    isPublished: true,
    remarks: 'Excellent circuit diagrams and formula derivation.',
    createdById: 'teacher-001',
    createdByName: 'Prof. Rajesh Sharma (Physics)',
    createdAt: '2026-08-05T10:00:00.000Z',
    updatedAt: '2026-08-05T10:00:00.000Z',
  },
  {
    id: 'mrk-cbse10-phy-002',
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    testId: 'tst-cbse10-phy-002',
    testCode: 'TST-10-PHY-002',
    testName: 'Test 2 (Magnetic Effects of Electric Current)',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    maxMarks: 40,
    marksObtained: 35,
    percentage: 87.5,
    answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Physics_Test2_Evaluated.pdf',
    answerSheetName: 'Rahul_Kumar_Physics_Test2_Evaluated.pdf',
    answerSheetSize: 390000,
    mimeType: 'application/pdf',
    isPublished: true,
    remarks: 'Good grasp of Fleming’s Left-Hand rule.',
    createdById: 'teacher-001',
    createdByName: 'Prof. Rajesh Sharma (Physics)',
    createdAt: '2026-08-28T10:00:00.000Z',
    updatedAt: '2026-08-28T10:00:00.000Z',
  },
  {
    id: 'mrk-cbse10-chm-001',
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    testId: 'tst-cbse10-chm-001',
    testCode: 'TST-10-CHM-001',
    testName: 'Test 1 (Chemical Reactions & Equations)',
    subjectId: 'sub-chm',
    subjectName: 'Chemistry',
    maxMarks: 25,
    marksObtained: 23,
    percentage: 92.0,
    answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Chemistry_Test1_Evaluated.pdf',
    answerSheetName: 'Rahul_Kumar_Chemistry_Test1_Evaluated.pdf',
    answerSheetSize: 280000,
    mimeType: 'application/pdf',
    isPublished: true,
    remarks: 'Perfect chemical balancing and state designations.',
    createdById: 'teacher-002',
    createdByName: 'Dr. Anita Deshmukh (Chemistry)',
    createdAt: '2026-08-12T10:00:00.000Z',
    updatedAt: '2026-08-12T10:00:00.000Z',
  },
  {
    id: 'mrk-cbse10-chm-002',
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    testId: 'tst-cbse10-chm-002',
    testCode: 'TST-10-CHM-002',
    testName: 'Test 2 (Acids, Bases & Salts)',
    subjectId: 'sub-chm',
    subjectName: 'Chemistry',
    maxMarks: 40,
    marksObtained: 34,
    percentage: 85.0,
    answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Chemistry_Test2_Evaluated.pdf',
    answerSheetName: 'Rahul_Kumar_Chemistry_Test2_Evaluated.pdf',
    answerSheetSize: 310000,
    mimeType: 'application/pdf',
    isPublished: true,
    remarks: 'Very thorough explanations of pH applications.',
    createdById: 'teacher-002',
    createdByName: 'Dr. Anita Deshmukh (Chemistry)',
    createdAt: '2026-08-28T10:00:00.000Z',
    updatedAt: '2026-08-28T10:00:00.000Z',
  },
  {
    id: 'mrk-cbse10-bio-001',
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    testId: 'tst-cbse10-bio-001',
    testCode: 'TST-10-BIO-001',
    testName: 'Test 1 (Life Processes)',
    subjectId: 'sub-bio',
    subjectName: 'Biology',
    maxMarks: 50,
    marksObtained: 47,
    percentage: 94.0,
    answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Biology_Test1_Evaluated.pdf',
    answerSheetName: 'Rahul_Kumar_Biology_Test1_Evaluated.pdf',
    answerSheetSize: 420000,
    mimeType: 'application/pdf',
    isPublished: true,
    remarks: 'High neatness in human heart & digestive system diagram.',
    createdById: 'teacher-003',
    createdByName: 'Dr. Vikram Rao (Biology)',
    createdAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-08-10T10:00:00.000Z',
  },
  {
    id: 'mrk-cbse10-mat-001',
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    testId: 'tst-cbse10-mat-001',
    testCode: 'TST-10-MAT-001',
    testName: 'Test 1 (Real Numbers & Polynomials)',
    subjectId: 'sub-mat',
    subjectName: 'Mathematics',
    maxMarks: 50,
    marksObtained: 45,
    percentage: 90.0,
    answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Maths_Test1_Evaluated.pdf',
    answerSheetName: 'Rahul_Kumar_Maths_Test1_Evaluated.pdf',
    answerSheetSize: 380000,
    mimeType: 'application/pdf',
    isPublished: true,
    remarks: 'Flawless proofs for irrationality and Euclid lemma.',
    createdById: 'teacher-004',
    createdByName: 'Mrs. Priya Sundaram (Mathematics)',
    createdAt: '2026-08-15T10:00:00.000Z',
    updatedAt: '2026-08-15T10:00:00.000Z',
  },
];

let localMarks: StudentMark[] = [...getSeedMarks()];

export const markService = {
  // Get all marks (role-filtered by backend or fallback)
  getMarks: async (filters: MarkFilters = {}): Promise<StudentMark[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.studentId) params.append('studentId', filters.studentId);
      if (filters.testId && filters.testId !== 'ALL') params.append('testId', filters.testId);
      if (filters.subjectName && filters.subjectName !== 'ALL') params.append('subjectName', filters.subjectName);
      if (filters.isPublished !== undefined) params.append('isPublished', String(filters.isPublished));
      if (filters.search) params.append('search', filters.search);

      const response = await api.get<{ success: boolean; data: StudentMark[] }>(
        `/marks?${params.toString()}`
      );
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }

    let marks = [...localMarks];
    if (filters.subjectName && filters.subjectName !== 'ALL') {
      marks = marks.filter((m) => m.subjectName.toLowerCase() === filters.subjectName?.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      marks = marks.filter(
        (m) =>
          m.testName.toLowerCase().includes(q) ||
          m.testCode.toLowerCase().includes(q) ||
          m.studentName.toLowerCase().includes(q) ||
          m.studentRoll.toLowerCase().includes(q)
      );
    }
    return marks;
  },

  // Get single mark by ID
  getMarkById: async (id: string): Promise<StudentMark> => {
    try {
      const response = await api.get<{ success: boolean; data: StudentMark }>(
        `/marks/${id}`
      );
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }
    return localMarks.find((m) => m.id === id) || localMarks[0];
  },

  createMark: async (payload: CreateMarkPayload): Promise<StudentMark> => {
    try {
      const response = await api.post<{ success: boolean; data: StudentMark; message: string }>(
        '/marks',
        payload
      );
      if (response.data?.data) {
        return response.data.data;
      }
    } catch {}
    const newMark: StudentMark = {
      id: `mark-${Date.now()}`,
      studentId: payload.studentId,
      studentName: 'Student',
      studentRoll: 'IT10000',
      testId: payload.testId,
      testCode: 'TST-EVAL',
      testName: 'Evaluated Test',
      subjectId: payload.subjectId,
      subjectName: 'General',
      maxMarks: payload.maxMarks || 50,
      marksObtained: payload.marksObtained,
      percentage: Number(((payload.marksObtained / (payload.maxMarks || 50)) * 100).toFixed(1)),
      answerSheetUrl: payload.answerSheetUrl,
      answerSheetName: payload.answerSheetName,
      answerSheetSize: payload.answerSheetSize,
      mimeType: payload.mimeType || 'application/pdf',
      isPublished: payload.isPublished ?? true,
      remarks: payload.remarks,
      createdById: 'usr-teacher-01',
      createdByName: 'Prof. Sharma',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localMarks.unshift(newMark);
    return newMark;
  },

  updateMark: async (id: string, payload: UpdateMarkPayload): Promise<StudentMark> => {
    try {
      const response = await api.put<{ success: boolean; data: StudentMark; message: string }>(
        `/marks/${id}`,
        payload
      );
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }

    const idx = localMarks.findIndex((m) => m.id === id);
    if (idx !== -1) {
      const old = localMarks[idx];
      const newScore = payload.marksObtained !== undefined ? payload.marksObtained : old.marksObtained;
      const updated: StudentMark = {
        ...old,
        marksObtained: newScore,
        percentage: Number(((newScore / old.maxMarks) * 100).toFixed(1)),
        answerSheetUrl: payload.answerSheetUrl !== undefined ? payload.answerSheetUrl : old.answerSheetUrl,
        answerSheetName: payload.answerSheetName !== undefined ? payload.answerSheetName : old.answerSheetName,
        answerSheetSize: payload.answerSheetSize !== undefined ? payload.answerSheetSize : old.answerSheetSize,
        mimeType: payload.mimeType !== undefined ? payload.mimeType : (old.mimeType || 'application/pdf'),
        remarks: payload.remarks !== undefined ? payload.remarks : old.remarks,
        updatedAt: new Date().toISOString(),
      };
      localMarks[idx] = updated;
      return updated;
    }
    return localMarks[0];
  },

  uploadAnswerSheet: async (
    file: File
  ): Promise<{ fileUrl: string; fileName: string; fileSize: number; mimeType: string; isCloudinary: boolean }> => {
    try {
      const formData = new FormData();
      formData.append('answerSheet', file);

      const response = await api.post<{
        success: boolean;
        data: { fileUrl: string; fileName: string; fileSize: number; mimeType: string; isCloudinary: boolean };
      }>('/marks/upload-answer-sheet', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }

    const fakeUrl = URL.createObjectURL(file);
    return {
      fileUrl: fakeUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/pdf',
      isCloudinary: false,
    };
  },

  // Get audit trail for a mark
  getAuditTrail: async (id: string): Promise<MarkAuditLog[]> => {
    try {
      const response = await api.get<{ success: boolean; data: MarkAuditLog[] }>(
        `/marks/${id}/audit-trail`
      );
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }
    const seed = getSeedMarks();
    const mark = seed.find((m) => m.id === id);
    return mark?.auditLogs || [];
  },

  // Toggle visibility to parents/students
  toggleVisibility: async (id: string, isPublished: boolean): Promise<StudentMark> => {
    try {
      const response = await api.patch<{ success: boolean; data: StudentMark; message: string }>(
        `/marks/${id}/visibility`,
        { isPublished }
      );
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }
    const seed = getSeedMarks();
    const mark = seed.find((m) => m.id === id) || seed[0];
    return { ...mark, isPublished };
  },

  getAuditLogs: async (markId: string) => {
    try {
      const response = await api.get<{ success: boolean; data: any[] }>(`/marks/${markId}/audit-logs`);
      return response.data.data;
    } catch {
      return [];
    }
  },
};

export default markService;
