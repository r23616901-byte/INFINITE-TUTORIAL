import api from './api';
import { ApiResponse } from '../types';
import { ClassItem, BoardItem, SubjectItem, BatchItem } from '../types/attendance';

const SEED_CLASSES: ClassItem[] = [
  { id: 'cls-10', name: 'Class 10', grade: 10, description: 'CBSE & State Board Secondary Division' },
  { id: 'cls-9', name: 'Class 9', grade: 9, description: 'Secondary Foundation Division' },
];

const SEED_BOARDS: BoardItem[] = [
  { id: 'brd-cbse', name: 'CBSE', code: 'CBSE' },
  { id: 'brd-state', name: 'State Board', code: 'STATE' },
];

const SEED_SUBJECTS: SubjectItem[] = [
  { id: 'sub-phy', name: 'Physics', code: 'PHY', boardId: 'brd-cbse', boardName: 'CBSE' },
  { id: 'sub-chem', name: 'Chemistry', code: 'CHEM', boardId: 'brd-cbse', boardName: 'CBSE' },
  { id: 'sub-bio', name: 'Biology', code: 'BIO', boardId: 'brd-cbse', boardName: 'CBSE' },
  { id: 'sub-mat', name: 'Mathematics', code: 'MATH', boardId: 'brd-cbse', boardName: 'CBSE' },
  { id: 'sub-eng', name: 'English', code: 'ENG', boardId: 'brd-cbse', boardName: 'CBSE' },
];

const SEED_BATCHES: BatchItem[] = [
  {
    id: 'batch-10a-morning',
    name: 'Batch 10A Morning',
    timing: '06:30 AM - 08:30 AM',
    session: 'MORNING',
    startTime: '06:30',
    endTime: '08:30',
    days: 'Mon - Sat',
    status: 'ACTIVE',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    academicYear: '2024-25',
    assignedTeacherName: 'Mrs. Priya Sundaram',
    studentCount: 42,
  },
  {
    id: 'batch-10a-evening',
    name: 'Batch 10A Evening',
    timing: '05:30 PM - 07:30 PM',
    session: 'EVENING',
    startTime: '17:30',
    endTime: '19:30',
    days: 'Mon - Sat',
    status: 'ACTIVE',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    academicYear: '2024-25',
    assignedTeacherName: 'Mrs. Priya Sundaram',
    studentCount: 38,
  },
  {
    id: 'batch-9a-morning',
    name: 'Batch 9A Morning',
    timing: '07:00 AM - 09:00 AM',
    session: 'MORNING',
    startTime: '07:00',
    endTime: '09:00',
    days: 'Mon - Sat',
    status: 'ACTIVE',
    classId: 'cls-9',
    className: 'Class 9',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    academicYear: '2024-25',
    assignedTeacherName: 'Mr. Arvind Saxena',
    studentCount: 35,
  },
];

export const getClassesApi = async (): Promise<ClassItem[]> => {
  try {
    const res = await api.get<ApiResponse<ClassItem[]>>('/academics/classes');
    if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  return SEED_CLASSES;
};

export const addClassApi = async (data: { name: string; grade: number; description?: string }): Promise<ClassItem> => {
  try {
    const res = await api.post<ApiResponse<ClassItem>>('/academics/classes', data);
    return res.data.data as ClassItem;
  } catch {
    const newClass: ClassItem = {
      id: `cls-${Date.now()}`,
      name: data.name,
      grade: data.grade,
      description: data.description,
    };
    SEED_CLASSES.push(newClass);
    return newClass;
  }
};

export const getBoardsApi = async (): Promise<BoardItem[]> => {
  try {
    const res = await api.get<ApiResponse<BoardItem[]>>('/academics/boards');
    if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  return SEED_BOARDS;
};

export const addBoardApi = async (data: { name: string; code: string }): Promise<BoardItem> => {
  try {
    const res = await api.post<ApiResponse<BoardItem>>('/academics/boards', data);
    return res.data.data as BoardItem;
  } catch {
    const newBoard: BoardItem = {
      id: `brd-${Date.now()}`,
      name: data.name,
      code: data.code,
    };
    SEED_BOARDS.push(newBoard);
    return newBoard;
  }
};

export const getSubjectsApi = async (boardId?: string): Promise<SubjectItem[]> => {
  try {
    const res = await api.get<ApiResponse<SubjectItem[]>>('/academics/subjects', {
      params: boardId ? { boardId } : {},
    });
    if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  if (boardId) {
    return SEED_SUBJECTS.filter((s) => !s.boardId || s.boardId === boardId);
  }
  return SEED_SUBJECTS;
};

export const addSubjectApi = async (data: { name: string; code: string; boardId?: string }): Promise<SubjectItem> => {
  try {
    const res = await api.post<ApiResponse<SubjectItem>>('/academics/subjects', data);
    return res.data.data as SubjectItem;
  } catch {
    const newSub: SubjectItem = {
      id: `sub-${Date.now()}`,
      name: data.name,
      code: data.code,
      boardId: data.boardId,
      boardName: data.boardId === 'brd-cbse' ? 'CBSE' : 'State Board',
    };
    SEED_SUBJECTS.push(newSub);
    return newSub;
  }
};

export const getBatchesApi = async (filters: { classId?: string; boardId?: string; session?: string } = {}): Promise<BatchItem[]> => {
  try {
    const res = await api.get<ApiResponse<BatchItem[]>>('/academics/batches', { params: filters });
    if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  let filtered = [...SEED_BATCHES];
  if (filters.classId && filters.classId !== 'ALL') {
    filtered = filtered.filter((b) => b.classId === filters.classId);
  }
  if (filters.boardId && filters.boardId !== 'ALL') {
    filtered = filtered.filter((b) => b.boardId === filters.boardId);
  }
  if (filters.session && filters.session !== 'ALL') {
    filtered = filtered.filter((b) => b.session === filters.session);
  }
  return filtered;
};

export const createBatchApi = async (data: {
  name: string;
  timing?: string;
  session?: string;
  startTime?: string;
  endTime?: string;
  days?: string;
  status?: string;
  classId: string;
  boardId: string;
  academicYear?: string;
  assignedTeacherName?: string;
}): Promise<BatchItem> => {
  try {
    const res = await api.post<ApiResponse<BatchItem>>('/academics/batches', data);
    return res.data.data as BatchItem;
  } catch {
    const newBatch: BatchItem = {
      id: `batch-${Date.now()}`,
      name: data.name,
      timing: data.timing || '06:30 AM - 08:30 AM',
      session: data.session || 'MORNING',
      startTime: data.startTime,
      endTime: data.endTime,
      days: data.days || 'Mon - Sat',
      status: data.status || 'ACTIVE',
      classId: data.classId,
      boardId: data.boardId,
      academicYear: data.academicYear || '2024-25',
      assignedTeacherName: data.assignedTeacherName || 'Mrs. Priya Sundaram',
      studentCount: 30,
    };
    SEED_BATCHES.push(newBatch);
    return newBatch;
  }
};
