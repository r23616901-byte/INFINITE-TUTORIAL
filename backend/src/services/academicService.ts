import prisma from './prisma';
import { ClassDto, BoardDto, SubjectDto, BatchDto } from '../types';

export const INITIAL_CLASSES: ClassDto[] = [
  { id: 'cls-10', name: 'Class 10', grade: 10, description: '10th Secondary Grade' },
  { id: 'cls-9', name: 'Class 9', grade: 9, description: '9th Secondary Grade' },
];

export const INITIAL_BOARDS: BoardDto[] = [
  { id: 'brd-cbse', name: 'CBSE', code: 'CBSE' },
  { id: 'brd-ksb', name: 'Karnataka State Board', code: 'KSB' },
];

export const INITIAL_SUBJECTS: SubjectDto[] = [
  { id: 'sub-phy-10', name: 'Physics', code: 'PHY10', boardId: 'brd-cbse', boardName: 'CBSE' },
  { id: 'sub-chem-10', name: 'Chemistry', code: 'CHEM10', boardId: 'brd-cbse', boardName: 'CBSE' },
  { id: 'sub-bio-10', name: 'Biology', code: 'BIO10', boardId: 'brd-cbse', boardName: 'CBSE' },
  { id: 'sub-math-10', name: 'Mathematics', code: 'MATH10', boardId: 'brd-cbse', boardName: 'CBSE' },
  { id: 'sub-phy-9', name: 'Physics', code: 'PHY9', boardId: 'brd-ksb', boardName: 'Karnataka State Board' },
  { id: 'sub-chem-9', name: 'Chemistry', code: 'CHEM9', boardId: 'brd-ksb', boardName: 'Karnataka State Board' },
  { id: 'sub-bio-9', name: 'Biology', code: 'BIO9', boardId: 'brd-ksb', boardName: 'Karnataka State Board' },
  { id: 'sub-math-9', name: 'Mathematics', code: 'MATH9', boardId: 'brd-ksb', boardName: 'Karnataka State Board' },
];

export const INITIAL_BATCHES: BatchDto[] = [
  {
    id: 'batch-10a-morning',
    name: '10th A Morning',
    timing: '07:00 AM - 08:30 AM',
    session: 'MORNING',
    startTime: '07:00 AM',
    endTime: '08:30 AM',
    days: 'Monday-Saturday',
    status: 'ACTIVE',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    academicYear: '2024-2025',
    assignedTeacherName: 'Prof. Rajesh Sharma (Physics)',
    studentCount: 14,
  },
  {
    id: 'batch-10a-evening',
    name: '10th A Evening',
    timing: '05:30 PM - 07:00 PM',
    session: 'EVENING',
    startTime: '05:30 PM',
    endTime: '07:00 PM',
    days: 'Monday-Saturday',
    status: 'ACTIVE',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    academicYear: '2024-2025',
    assignedTeacherName: 'Prof. Rajesh Sharma (Physics)',
    studentCount: 12,
  },
  {
    id: 'batch-10b-morning',
    name: '10th B Morning',
    timing: '07:00 AM - 08:30 AM',
    session: 'MORNING',
    startTime: '07:00 AM',
    endTime: '08:30 AM',
    days: 'Monday-Saturday',
    status: 'ACTIVE',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    academicYear: '2024-2025',
    assignedTeacherName: 'Dr. Meena Iyer (Mathematics)',
    studentCount: 15,
  },
  {
    id: 'batch-10b-evening',
    name: '10th B Evening',
    timing: '05:30 PM - 07:00 PM',
    session: 'EVENING',
    startTime: '05:30 PM',
    endTime: '07:00 PM',
    days: 'Monday-Saturday',
    status: 'ACTIVE',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    academicYear: '2024-2025',
    assignedTeacherName: 'Dr. Meena Iyer (Mathematics)',
    studentCount: 16,
  },
  {
    id: 'batch-9a-morning',
    name: '9th A Morning',
    timing: '07:00 AM - 08:30 AM',
    session: 'MORNING',
    startTime: '07:00 AM',
    endTime: '08:30 AM',
    days: 'Monday-Saturday',
    status: 'ACTIVE',
    classId: 'cls-9',
    className: 'Class 9',
    boardId: 'brd-ksb',
    boardName: 'Karnataka State Board',
    academicYear: '2024-2025',
    assignedTeacherName: 'Mr. Anand Kulkarni (Biology)',
    studentCount: 11,
  },
  {
    id: 'batch-9a-evening',
    name: '9th A Evening',
    timing: '05:00 PM - 06:30 PM',
    session: 'EVENING',
    startTime: '05:00 PM',
    endTime: '06:30 PM',
    days: 'Monday-Saturday',
    status: 'ACTIVE',
    classId: 'cls-9',
    className: 'Class 9',
    boardId: 'brd-ksb',
    boardName: 'Karnataka State Board',
    academicYear: '2024-2025',
    assignedTeacherName: 'Mr. Anand Kulkarni (Biology)',
    studentCount: 13,
  },
  {
    id: 'batch-9b-morning',
    name: '9th B Morning',
    timing: '07:00 AM - 08:30 AM',
    session: 'MORNING',
    startTime: '07:00 AM',
    endTime: '08:30 AM',
    days: 'Monday-Saturday',
    status: 'ACTIVE',
    classId: 'cls-9',
    className: 'Class 9',
    boardId: 'brd-ksb',
    boardName: 'Karnataka State Board',
    academicYear: '2024-2025',
    assignedTeacherName: 'Mrs. Geetha Hegde (Chemistry)',
    studentCount: 12,
  },
  {
    id: 'batch-9b-evening',
    name: '9th B Evening',
    timing: '05:00 PM - 06:30 PM',
    session: 'EVENING',
    startTime: '05:00 PM',
    endTime: '06:30 PM',
    days: 'Monday-Saturday',
    status: 'ACTIVE',
    classId: 'cls-9',
    className: 'Class 9',
    boardId: 'brd-ksb',
    boardName: 'Karnataka State Board',
    academicYear: '2024-2025',
    assignedTeacherName: 'Mrs. Geetha Hegde (Chemistry)',
    studentCount: 14,
  },
];

let inMemoryClasses = [...INITIAL_CLASSES];
let inMemoryBoards = [...INITIAL_BOARDS];
let inMemorySubjects = [...INITIAL_SUBJECTS];
let inMemoryBatches = [...INITIAL_BATCHES];

let isDbAvailable: boolean | null = null;
let lastDbCheck = 0;
const DB_RECHECK_INTERVAL = 30000;

export const checkDbAvailability = async (): Promise<boolean> => {
  const now = Date.now();
  if (isDbAvailable !== null && now - lastDbCheck < DB_RECHECK_INTERVAL) {
    return isDbAvailable;
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    isDbAvailable = true;
  } catch {
    isDbAvailable = false;
  }
  lastDbCheck = now;
  return isDbAvailable;
};

export const getClasses = async (): Promise<ClassDto[]> => {
  if (await checkDbAvailability()) {
    try {
      const list = await prisma.class.findMany({ orderBy: { grade: 'desc' } });
      if (list.length > 0) return list;
    } catch {}
  }
  return inMemoryClasses;
};

export const addClass = async (data: { name: string; grade: number; description?: string }): Promise<ClassDto> => {
  const newClass: ClassDto = {
    id: `cls-${Date.now()}`,
    name: data.name,
    grade: Number(data.grade),
    description: data.description,
  };
  try {
    const created = await prisma.class.create({ data });
    return created;
  } catch {}
  inMemoryClasses.push(newClass);
  return newClass;
};

export const getBoards = async (): Promise<BoardDto[]> => {
  try {
    const list = await prisma.board.findMany({ orderBy: { name: 'asc' } });
    if (list.length > 0) return list;
  } catch {}
  return inMemoryBoards;
};

export const addBoard = async (data: { name: string; code: string }): Promise<BoardDto> => {
  const newBoard: BoardDto = {
    id: `brd-${Date.now()}`,
    name: data.name,
    code: data.code,
  };
  try {
    const created = await prisma.board.create({ data });
    return created;
  } catch {}
  inMemoryBoards.push(newBoard);
  return newBoard;
};

export const getSubjects = async (boardId?: string): Promise<SubjectDto[]> => {
  try {
    const list = await prisma.subject.findMany({
      where: boardId ? { boardId } : undefined,
      include: { board: true },
      orderBy: { name: 'asc' },
    });
    if (list.length > 0) {
      return list.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        boardId: s.boardId,
        boardName: s.board?.name || null,
      }));
    }
  } catch {}
  if (boardId) {
    return inMemorySubjects.filter((s) => s.boardId === boardId);
  }
  return inMemorySubjects;
};

export const addSubject = async (data: { name: string; code: string; boardId?: string }): Promise<SubjectDto> => {
  const board = inMemoryBoards.find((b) => b.id === data.boardId);
  const newSubject: SubjectDto = {
    id: `sub-${Date.now()}`,
    name: data.name,
    code: data.code,
    boardId: data.boardId,
    boardName: board ? board.name : undefined,
  };
  try {
    const created = await prisma.subject.create({
      data,
      include: { board: true },
    });
    return {
      id: created.id,
      name: created.name,
      code: created.code,
      boardId: created.boardId,
      boardName: created.board?.name || null,
    };
  } catch {}
  inMemorySubjects.push(newSubject);
  return newSubject;
};

export const getBatches = async (filters: { classId?: string; boardId?: string; session?: string } = {}): Promise<BatchDto[]> => {
  try {
    const list = await prisma.batch.findMany({
      where: {
        ...(filters.classId ? { classId: filters.classId } : {}),
        ...(filters.boardId ? { boardId: filters.boardId } : {}),
      },
      include: { class: true, board: true, students: true },
      orderBy: { name: 'asc' },
    });
    if (list.length > 0) {
      return list.map((b: any) => ({
        id: b.id,
        name: b.name,
        timing: b.timing,
        session: b.session || 'MORNING',
        startTime: b.startTime,
        endTime: b.endTime,
        days: b.days || 'Monday-Saturday',
        status: b.status || 'ACTIVE',
        classId: b.classId,
        className: b.class?.name,
        boardId: b.boardId,
        boardName: b.board?.name,
        academicYear: b.academicYear,
        studentCount: b.students?.length || 0,
      }));
    }
  } catch {}

  let results = [...inMemoryBatches];
  if (filters.classId) {
    results = results.filter((b) => b.classId === filters.classId);
  }
  if (filters.boardId) {
    results = results.filter((b) => b.boardId === filters.boardId);
  }
  if (filters.session) {
    results = results.filter((b) => b.session.toLowerCase() === filters.session?.toLowerCase());
  }
  return results;
};

export const createBatch = async (data: {
  name: string;
  timing: string;
  session?: string;
  startTime?: string;
  endTime?: string;
  days?: string;
  status?: string;
  classId: string;
  boardId: string;
  academicYear?: string;
  assignedTeacherName?: string;
}): Promise<BatchDto> => {
  const cls = inMemoryClasses.find((c) => c.id === data.classId);
  const brd = inMemoryBoards.find((b) => b.id === data.boardId);

  const newBatch: BatchDto = {
    id: `batch-${Date.now()}`,
    name: data.name,
    timing: data.timing || `${data.startTime || '07:00 AM'} - ${data.endTime || '08:30 AM'}`,
    session: data.session || 'MORNING',
    startTime: data.startTime || '07:00 AM',
    endTime: data.endTime || '08:30 AM',
    days: data.days || 'Monday-Saturday',
    status: data.status || 'ACTIVE',
    classId: data.classId,
    className: cls ? cls.name : 'Class 10',
    boardId: data.boardId,
    boardName: brd ? brd.name : 'CBSE',
    academicYear: data.academicYear || '2024-2025',
    assignedTeacherName: data.assignedTeacherName || 'Assigned Faculty',
    studentCount: 0,
  };

  try {
    const created = await prisma.batch.create({
      data: {
        name: data.name,
        timing: newBatch.timing,
        session: newBatch.session,
        startTime: newBatch.startTime,
        endTime: newBatch.endTime,
        days: newBatch.days,
        status: newBatch.status,
        classId: data.classId,
        boardId: data.boardId,
        academicYear: newBatch.academicYear,
      },
      include: { class: true, board: true },
    });
    return {
      id: created.id,
      name: created.name,
      timing: created.timing,
      session: created.session,
      startTime: created.startTime,
      endTime: created.endTime,
      days: created.days,
      status: created.status,
      classId: created.classId,
      className: created.class?.name,
      boardId: created.boardId,
      boardName: created.board?.name,
      academicYear: created.academicYear,
      studentCount: 0,
    };
  } catch {}

  inMemoryBatches.unshift(newBatch);
  return newBatch;
};
