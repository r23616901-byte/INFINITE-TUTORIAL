import api from './api';
import { ApiResponse } from '../types';
import {
  TestItem,
  TestType,
  CreateTestPayload,
  UpdateTestPayload,
  TestFilters,
  UploadedTestPaperResponse,
} from '../types/test';

const getSeedTests = (): TestItem[] => [
  {
    id: 'tst-cbse10-phy-003',
    testId: 'TST-10-PHY-003',
    name: 'Chapter 3: Light Reflection & Refraction Test',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    chapter: 'Light - Reflection and Refraction',
    testType: 'Chapter Test',
    date: '2026-09-18',
    maxMarks: 50,
    duration: '90 mins',
    durationMinutes: 90,
    testPaperUrl: '/uploads/documents/Academic_Timetable_Term1_orig_1790178073793.pdf',
    testPaperName: 'CBSE_Class10_Physics_Light_Test.pdf',
    testPaperSize: 640000,
    mimeType: 'application/pdf',
    instructions: 'All questions compulsory. Draw clear ray diagrams with pencil.',
    createdById: 'teacher-001',
    createdByName: 'Prof. Rajesh Sharma (Physics)',
    createdAt: '2026-09-15T10:00:00.000Z',
    updatedAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'tst-cbse10-phy-002',
    testId: 'TST-10-PHY-002',
    name: 'Test 2: Magnetic Effects of Electric Current',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    chapter: 'Magnetic Effects of Electric Current',
    testType: 'Periodic Assessment',
    date: '2026-08-28',
    maxMarks: 40,
    duration: '60 mins',
    durationMinutes: 60,
    testPaperUrl: '/uploads/documents/Academic_Timetable_Term1_orig_1790178073793.pdf',
    testPaperName: 'CBSE_Class10_Physics_Magnetism.pdf',
    testPaperSize: 520000,
    mimeType: 'application/pdf',
    instructions: 'Include solenoid field patterns and safety earthing concepts.',
    createdById: 'teacher-001',
    createdByName: 'Prof. Rajesh Sharma (Physics)',
    createdAt: '2026-08-25T10:00:00.000Z',
    updatedAt: '2026-08-25T10:00:00.000Z',
  },
  {
    id: 'tst-cbse10-chm-002',
    testId: 'TST-10-CHM-002',
    name: 'Test 2: Acids, Bases & Salts Evaluated Paper',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    subjectId: 'sub-chm',
    subjectName: 'Chemistry',
    chapter: 'Acids, Bases and Salts',
    testType: 'Unit Test',
    date: '2026-08-28',
    maxMarks: 40,
    duration: '60 mins',
    durationMinutes: 60,
    testPaperUrl: '/uploads/documents/Academic_Timetable_Term1_orig_1790178073793.pdf',
    testPaperName: 'CBSE_Class10_Chemistry_Acids.pdf',
    testPaperSize: 490000,
    mimeType: 'application/pdf',
    instructions: 'Write balanced equations for chlor-alkali and bleaching powder.',
    createdById: 'teacher-002',
    createdByName: 'Dr. Anita Deshmukh (Chemistry)',
    createdAt: '2026-08-24T10:00:00.000Z',
    updatedAt: '2026-08-24T10:00:00.000Z',
  },
  {
    id: 'tst-cbse10-bio-001',
    testId: 'TST-10-BIO-001',
    name: 'Test 1: Life Processes Diagnostic Assessment',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    subjectId: 'sub-bio',
    subjectName: 'Biology',
    chapter: 'Life Processes',
    testType: 'Diagnostic Assessment',
    date: '2026-08-10',
    maxMarks: 50,
    duration: '90 mins',
    durationMinutes: 90,
    testPaperUrl: '/uploads/documents/Academic_Timetable_Term1_orig_1790178073793.pdf',
    testPaperName: 'CBSE_Class10_Biology_LifeProcesses.pdf',
    testPaperSize: 710000,
    mimeType: 'application/pdf',
    instructions: 'Label human nephron and double circulation neatly.',
    createdById: 'teacher-003',
    createdByName: 'Dr. Vikram Rao (Biology)',
    createdAt: '2026-08-07T10:00:00.000Z',
    updatedAt: '2026-08-07T10:00:00.000Z',
  },
  {
    id: 'tst-cbse10-mat-001',
    testId: 'TST-10-MAT-001',
    name: 'Test 1: Real Numbers & Polynomials Standard Paper',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    subjectId: 'sub-mat',
    subjectName: 'Mathematics',
    chapter: 'Real Numbers & Polynomials',
    testType: 'Periodic Assessment',
    date: '2026-08-15',
    maxMarks: 50,
    duration: '90 mins',
    durationMinutes: 90,
    testPaperUrl: '/uploads/documents/Academic_Timetable_Term1_orig_1790178073793.pdf',
    testPaperName: 'CBSE_Class10_Maths_RealNumbers.pdf',
    testPaperSize: 580000,
    mimeType: 'application/pdf',
    instructions: 'Step markings apply. Show all rough work alongside.',
    createdById: 'teacher-004',
    createdByName: 'Mrs. Priya Sundaram (Mathematics)',
    createdAt: '2026-08-12T10:00:00.000Z',
    updatedAt: '2026-08-12T10:00:00.000Z',
  },
];

export const getTestsApi = async (filters: TestFilters = {}): Promise<TestItem[]> => {
  try {
    const res = await api.get<ApiResponse<TestItem[]>>('/tests', { params: filters });
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  let tests = getSeedTests();
  if (filters.subjectId && filters.subjectId !== 'ALL') {
    const targetSubject = filters.subjectId.toLowerCase();
    tests = tests.filter((t) => t.subjectId === filters.subjectId || t.subjectName.toLowerCase() === targetSubject);
  }
  if (filters.testType && filters.testType !== 'ALL') {
    tests = tests.filter((t) => t.testType === filters.testType);
  }
  return tests;
};

export const getTestByIdApi = async (id: string): Promise<TestItem> => {
  try {
    const res = await api.get<ApiResponse<TestItem>>(`/tests/${id}`);
    if (res.data && res.data.success && res.data.data) {
      return res.data.data as TestItem;
    }
  } catch {
    // Fallback
  }
  const tests = getSeedTests();
  return tests.find((t) => t.id === id) || tests[0];
};

export const createTestApi = async (payload: CreateTestPayload): Promise<TestItem> => {
  const res = await api.post<ApiResponse<TestItem>>('/tests', payload);
  return res.data.data as TestItem;
};

export const updateTestApi = async (id: string, payload: UpdateTestPayload): Promise<TestItem> => {
  const res = await api.put<ApiResponse<TestItem>>(`/tests/${id}`, payload);
  return res.data.data as TestItem;
};

export const deleteTestApi = async (id: string): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete<{ success: boolean; message: string }>(`/tests/${id}`);
  return res.data;
};

export const uploadTestPaperApi = async (file: File): Promise<UploadedTestPaperResponse> => {
  const formData = new FormData();
  formData.append('testPaper', file);

  const res = await api.post<ApiResponse<UploadedTestPaperResponse>>('/tests/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data as UploadedTestPaperResponse;
};

export const getTestTypesApi = async (): Promise<TestType[]> => {
  try {
    const res = await api.get<ApiResponse<TestType[]>>('/tests/types');
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  return [
    { id: 'tt-1', name: 'Chapter Test', isDefault: true },
    { id: 'tt-2', name: 'Unit Test', isDefault: true },
    { id: 'tt-3', name: 'Periodic Assessment', isDefault: true },
    { id: 'tt-4', name: 'Mock Board Exam', isDefault: true },
  ];
};

export const addTestTypeApi = async (name: string): Promise<TestType> => {
  const res = await api.post<ApiResponse<TestType>>('/tests/types', { name });
  return res.data.data as TestType;
};

export const deleteTestTypeApi = async (id: string): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete<{ success: boolean; message: string }>(`/tests/types/${id}`);
  return res.data;
};

export default {
  getTestsApi,
  getTestByIdApi,
  createTestApi,
  updateTestApi,
  deleteTestApi,
  uploadTestPaperApi,
  getTestTypesApi,
  addTestTypeApi,
  deleteTestTypeApi,
};
