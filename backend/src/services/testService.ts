import prisma from './prisma';
import {
  TestDto,
  TestTypeDto,
  CreateTestPayload,
  UpdateTestPayload,
  TestFilters,
} from '../types';
import { getClasses, getBoards, getSubjects, checkDbAvailability } from './academicService';

// ----------------------------------------------------
// DEFAULT TEST TYPES (Prompt Step 15)
// ----------------------------------------------------
const DEFAULT_TEST_TYPES: TestTypeDto[] = [
  { id: 'type-test-1', name: 'Test 1', isDefault: true, createdAt: new Date('2026-01-01') },
  { id: 'type-test-2', name: 'Test 2', isDefault: true, createdAt: new Date('2026-01-01') },
  { id: 'type-test-3', name: 'Test 3', isDefault: true, createdAt: new Date('2026-01-01') },
  { id: 'type-chapter', name: 'Chapter-wise Test', isDefault: true, createdAt: new Date('2026-01-01') },
  { id: 'type-unit', name: 'Unit Test', isDefault: true, createdAt: new Date('2026-01-01') },
  { id: 'type-monthly', name: 'Monthly Test', isDefault: true, createdAt: new Date('2026-01-01') },
  { id: 'type-revision', name: 'Revision Test', isDefault: true, createdAt: new Date('2026-01-01') },
  { id: 'type-custom', name: 'Custom Test', isDefault: true, createdAt: new Date('2026-01-01') },
];

let inMemoryTestTypes: TestTypeDto[] = [...DEFAULT_TEST_TYPES];

// ----------------------------------------------------
// PRE-SEEDED REALISTIC TESTS (Prompt Step 16 & 17)
// ----------------------------------------------------
let inMemoryTests: TestDto[] = [
  {
    id: 'test-1001',
    testId: 'TST-10-MAT-001',
    name: 'Class 10 CBSE Mathematics - Real Numbers & Polynomials Unit Test',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    subjectId: 'sub-math-10',
    subjectName: 'Mathematics',
    chapter: 'Chapter 1 & 2: Real Numbers and Polynomials',
    testType: 'Unit Test',
    date: '2026-09-20',
    maxMarks: 50,
    duration: '90 mins',
    durationMinutes: 90,
    testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_Unit_Test_1.pdf',
    testPaperName: 'CBSE_Class10_Maths_Unit_Test_1.pdf',
    testPaperSize: 245800,
    mimeType: 'application/pdf',
    instructions: '1. All questions are compulsory.\n2. Section A has 10 MCQs (1 mark each).\n3. Section B has 5 short questions (2 marks each).\n4. Section C has 6 long questions (3 marks each).\n5. Section D has 3 analytical questions (4 marks each).',
    createdById: 'admin-001',
    createdByName: 'Prof. Suresh Sharma (Admin)',
    createdAt: new Date('2026-09-15T09:00:00.000Z'),
    updatedAt: new Date('2026-09-15T09:00:00.000Z'),
  },
  {
    id: 'test-1002',
    testId: 'TST-10-PHY-002',
    name: 'Class 10 CBSE Science - Electricity & Circuits Chapter Test',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    subjectId: 'sub-phy-10',
    subjectName: 'Physics',
    chapter: 'Chapter 12: Electricity',
    testType: 'Chapter-wise Test',
    date: '2026-09-25',
    maxMarks: 40,
    duration: '60 mins',
    durationMinutes: 60,
    testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Electricity.pdf',
    testPaperName: 'CBSE_Class10_Physics_Electricity.pdf',
    testPaperSize: 312450,
    mimeType: 'application/pdf',
    instructions: 'Draw neat labeled circuit diagrams wherever applicable. Numerical step marks are mandatory.',
    createdById: 'teacher-001',
    createdByName: 'Dr. Ananya Roy',
    createdAt: new Date('2026-09-18T11:30:00.000Z'),
    updatedAt: new Date('2026-09-18T11:30:00.000Z'),
  },
  {
    id: 'test-1003',
    testId: 'TST-10-CHE-003',
    name: 'Class 10 CBSE Chemistry - Chemical Reactions Test 1',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    subjectId: 'sub-chem-10',
    subjectName: 'Chemistry',
    chapter: 'Chapter 1: Chemical Reactions and Equations',
    testType: 'Test 1',
    date: '2026-09-28',
    maxMarks: 25,
    duration: '45 mins',
    durationMinutes: 45,
    testPaperUrl: '/uploads/test-papers/Chemistry_Ch1_Equations_Test1.pdf',
    testPaperName: 'Chemistry_Ch1_Equations_Test1.pdf',
    testPaperSize: 184500,
    mimeType: 'application/pdf',
    instructions: 'Write balanced equations with state symbols (s, l, g, aq) for every reaction.',
    createdById: 'teacher-002',
    createdByName: 'Prof. Rajesh Nair',
    createdAt: new Date('2026-09-20T14:15:00.000Z'),
    updatedAt: new Date('2026-09-20T14:15:00.000Z'),
  },
  {
    id: 'test-1004',
    testId: 'TST-09-MAT-004',
    name: 'Class 9 State Board Mathematics - Number Systems Monthly Test',
    classId: 'cls-9',
    className: 'Class 9',
    boardId: 'brd-ksb',
    boardName: 'Karnataka State Board',
    subjectId: 'sub-math-9',
    subjectName: 'Mathematics',
    chapter: 'Chapter 1: Number Systems',
    testType: 'Monthly Test',
    date: '2026-10-02',
    maxMarks: 50,
    duration: '90 mins',
    durationMinutes: 90,
    testPaperUrl: '/uploads/test-papers/KSB_Class9_Maths_Monthly_Test.pdf',
    testPaperName: 'KSB_Class9_Maths_Monthly_Test.pdf',
    testPaperSize: 198200,
    mimeType: 'application/pdf',
    instructions: 'Rationalisation of denominator problems must show all intermediate algebraic expansions.',
    createdById: 'admin-001',
    createdByName: 'Prof. Suresh Sharma (Admin)',
    createdAt: new Date('2026-09-21T10:00:00.000Z'),
    updatedAt: new Date('2026-09-21T10:00:00.000Z'),
  },
];

// ----------------------------------------------------
// TEST TYPE SERVICES
// ----------------------------------------------------
export const getTestTypes = async (): Promise<TestTypeDto[]> => {
  if (await checkDbAvailability()) {
    try {
      const dbTypes = await prisma.testType.findMany({
        orderBy: { createdAt: 'asc' },
      });
      if (dbTypes.length > 0) {
        return dbTypes.map((t: any) => ({
          id: t.id,
          name: t.name,
          isDefault: t.isDefault,
          createdAt: t.createdAt,
        }));
      }
    } catch {}
  }
  return [...inMemoryTestTypes];
};

export const addTestType = async (name: string): Promise<TestTypeDto> => {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Test type name cannot be empty');
  }

  // Check duplicate
  const existing = inMemoryTestTypes.find(
    (t) => t.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (existing) {
    throw new Error(`Test type "${trimmed}" already exists`);
  }

  const newType: TestTypeDto = {
    id: `type-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: trimmed,
    isDefault: false,
    createdAt: new Date(),
  };

  if (await checkDbAvailability()) {
    try {
      const created = await prisma.testType.create({
        data: {
          id: newType.id,
          name: newType.name,
          isDefault: false,
        },
      });
      return {
        id: created.id,
        name: created.name,
        isDefault: created.isDefault,
        createdAt: created.createdAt,
      };
    } catch {}
  }

  inMemoryTestTypes.push(newType);
  return newType;
};

export const deleteTestType = async (id: string): Promise<{ success: boolean; message: string }> => {
  const target = inMemoryTestTypes.find((t) => t.id === id);
  if (!target) {
    throw new Error('Test type not found');
  }
  if (target.isDefault) {
    throw new Error('Default system test types cannot be deleted');
  }

  if (await checkDbAvailability()) {
    try {
      await prisma.testType.delete({ where: { id } });
    } catch {}
  }

  inMemoryTestTypes = inMemoryTestTypes.filter((t) => t.id !== id);
  return { success: true, message: `Test type "${target.name}" removed successfully.` };
};

// ----------------------------------------------------
// TEST CRUD SERVICES
// ----------------------------------------------------
export const getTests = async (filters: TestFilters = {}): Promise<TestDto[]> => {
  if (await checkDbAvailability()) {
    try {
      const where: any = {};
      if (filters.classId) where.classId = filters.classId;
      if (filters.boardId) where.boardId = filters.boardId;
      if (filters.subjectId) where.subjectId = filters.subjectId;
      if (filters.testType) where.testType = filters.testType;
      if (filters.chapter) {
        where.chapter = { contains: filters.chapter, mode: 'insensitive' };
      }
      if (filters.startDate || filters.endDate) {
        where.dateStr = {};
        if (filters.startDate) where.dateStr.gte = filters.startDate;
        if (filters.endDate) where.dateStr.lte = filters.endDate;
      }

      const list = await prisma.test.findMany({
        where,
        include: { class: true, board: true, subject: true },
        orderBy: { date: 'desc' },
      });

      if (list.length > 0) {
        let results: TestDto[] = list.map((t: any) => ({
          id: t.id,
          testId: t.testId,
          name: t.name,
          classId: t.classId,
          className: t.class?.name || 'Class 10',
          boardId: t.boardId,
          boardName: t.board?.name || 'CBSE',
          subjectId: t.subjectId,
          subjectName: t.subject?.name || 'Subject',
          chapter: t.chapter,
          testType: t.testType,
          date: t.dateStr,
          maxMarks: t.maxMarks,
          duration: t.duration,
          durationMinutes: t.durationMinutes,
          testPaperUrl: t.testPaperUrl,
          testPaperName: t.testPaperName,
          testPaperSize: t.testPaperSize,
          mimeType: t.mimeType,
          instructions: t.instructions,
          createdById: t.createdById,
          createdByName: t.createdByName,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }));

        if (filters.search) {
          const q = filters.search.toLowerCase();
          results = results.filter(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.testId.toLowerCase().includes(q) ||
              t.chapter.toLowerCase().includes(q) ||
              t.subjectName.toLowerCase().includes(q)
          );
        }
        return results;
      }
    } catch {}
  }

  // Fallback to in-memory store
  let filtered = [...inMemoryTests];

  if (filters.classId) {
    const qC = filters.classId.toLowerCase();
    filtered = filtered.filter(
      (t) => t.classId.toLowerCase() === qC || t.className.toLowerCase().includes(qC) || (qC.includes('10') && t.className.includes('10')) || (qC.includes('9') && t.className.includes('9'))
    );
  }
  if (filters.boardId) {
    const qB = filters.boardId.toLowerCase();
    filtered = filtered.filter(
      (t) => t.boardId.toLowerCase() === qB || t.boardName.toLowerCase().includes(qB) || (qB.includes('cbse') && t.boardName.toLowerCase().includes('cbse')) || (qB.includes('ksb') && t.boardName.toLowerCase().includes('state'))
    );
  }
  if (filters.subjectId) {
    const qS = filters.subjectId.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.subjectId.toLowerCase() === qS ||
        t.subjectName.toLowerCase() === qS ||
        t.subjectName.toLowerCase().includes(qS) ||
        (qS.includes('phy') && t.subjectName.toLowerCase().includes('phy')) ||
        (qS.includes('chem') && t.subjectName.toLowerCase().includes('chem')) ||
        (qS.includes('math') && t.subjectName.toLowerCase().includes('math')) ||
        (qS.includes('bio') && t.subjectName.toLowerCase().includes('bio'))
    );
  }
  if (filters.testType && filters.testType !== 'ALL') {
    filtered = filtered.filter((t) => t.testType === filters.testType);
  }
  if (filters.chapter) {
    const chapQ = filters.chapter.toLowerCase();
    filtered = filtered.filter((t) => t.chapter.toLowerCase().includes(chapQ));
  }
  if (filters.startDate) {
    filtered = filtered.filter((t) => t.date >= filters.startDate!);
  }
  if (filters.endDate) {
    filtered = filtered.filter((t) => t.date <= filters.endDate!);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.testId.toLowerCase().includes(q) ||
        t.chapter.toLowerCase().includes(q) ||
        t.subjectName.toLowerCase().includes(q)
    );
  }

  return filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getTestById = async (id: string): Promise<TestDto | null> => {
  if (await checkDbAvailability()) {
    try {
      const item = await prisma.test.findFirst({
        where: { OR: [{ id }, { testId: id }] },
        include: { class: true, board: true, subject: true },
      });
      if (item) {
        return {
          id: item.id,
          testId: item.testId,
          name: item.name,
          classId: item.classId,
          className: item.class?.name || 'Class',
          boardId: item.boardId,
          boardName: item.board?.name || 'Board',
          subjectId: item.subjectId,
          subjectName: item.subject?.name || 'Subject',
          chapter: item.chapter,
          testType: item.testType,
          date: item.dateStr,
          maxMarks: item.maxMarks,
          duration: item.duration,
          durationMinutes: item.durationMinutes,
          testPaperUrl: item.testPaperUrl,
          testPaperName: item.testPaperName,
          testPaperSize: item.testPaperSize,
          mimeType: item.mimeType,
          instructions: item.instructions,
          createdById: item.createdById,
          createdByName: item.createdByName,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      }
    } catch {}
  }

  const match = inMemoryTests.find((t) => t.id === id || t.testId === id);
  return match || null;
};

/**
 * Sequential Workflow Test Creation:
 * Class -> Board -> Subject -> Chapter -> Test Type -> Test Details -> Upload Test Paper -> Save
 */
export const createTest = async (
  payload: CreateTestPayload,
  creator: { id: string; name: string; role: string }
): Promise<TestDto> => {
  // 1. Mandatory Validations
  if (!payload.name?.trim()) throw new Error('Test Name is required');
  if (!payload.classId) throw new Error('Class selection is required');
  if (!payload.boardId) throw new Error('Board selection is required');
  if (!payload.subjectId) throw new Error('Subject selection is required');
  if (!payload.chapter?.trim()) throw new Error('Chapter name is required');
  if (!payload.testType?.trim()) throw new Error('Test Type selection is required');
  if (!payload.date) throw new Error('Test Date is required');
  if (!payload.maxMarks || payload.maxMarks <= 0) {
    throw new Error('Maximum marks must be greater than zero');
  }

  // 2. Resolve Class, Board, Subject Metadata
  const [classes, boards, subjects] = await Promise.all([
    getClasses(),
    getBoards(),
    getSubjects(),
  ]);

  const qClass = (payload.classId || '').toLowerCase();
  const matchedClass = classes.find(
    (c) =>
      c.id.toLowerCase() === qClass ||
      c.name.toLowerCase() === qClass ||
      c.name.toLowerCase().replace(/\s+/g, '') === qClass.replace(/\s+/g, '') ||
      (qClass.includes('10') && c.name.includes('10')) ||
      (qClass.includes('9') && c.name.includes('9'))
  );

  const qBoard = (payload.boardId || '').toLowerCase();
  const matchedBoard = boards.find(
    (b) =>
      b.id.toLowerCase() === qBoard ||
      b.code.toLowerCase() === qBoard ||
      b.name.toLowerCase() === qBoard ||
      (qBoard.includes('cbse') && b.code.toLowerCase().includes('cbse')) ||
      (qBoard.includes('ksb') && b.code.toLowerCase().includes('ksb')) ||
      (qBoard.includes('state') && b.code.toLowerCase().includes('ksb'))
  );

  const qSubj = (payload.subjectId || '').toLowerCase();
  const matchedSubject = subjects.find(
    (s) =>
      s.id.toLowerCase() === qSubj ||
      s.code.toLowerCase() === qSubj ||
      s.name.toLowerCase() === qSubj ||
      s.name.toLowerCase().includes(qSubj) ||
      qSubj.includes(s.name.toLowerCase()) ||
      (qSubj.includes('phy') && s.code.includes('PHY')) ||
      (qSubj.includes('chem') && s.code.includes('CHEM')) ||
      (qSubj.includes('bio') && s.code.includes('BIO')) ||
      (qSubj.includes('math') && s.code.includes('MATH'))
  );

  const className = matchedClass ? matchedClass.name : 'Class 10';
  const boardName = matchedBoard ? matchedBoard.name : 'CBSE';
  const subjectName = matchedSubject ? matchedSubject.name : (payload.subjectId || 'Subject');

  // 3. Auto-generate Test ID if not supplied
  const classNum = className.replace(/[^0-9]/g, '') || '10';
  const subjCode = (matchedSubject ? matchedSubject.code : 'GEN').substring(0, 3).toUpperCase();
  const randomSeq = Math.floor(100 + Math.random() * 900);
  const testId = payload.testId?.trim() || `TST-${classNum}-${subjCode}-${randomSeq}`;

  const durationMinutes = payload.durationMinutes || (payload.duration ? parseInt(payload.duration) || 90 : 90);
  const duration = payload.duration || `${durationMinutes} mins`;

  const newTest: TestDto = {
    id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    testId,
    name: payload.name.trim(),
    classId: payload.classId,
    className,
    boardId: payload.boardId,
    boardName,
    subjectId: payload.subjectId,
    subjectName,
    chapter: payload.chapter.trim(),
    testType: payload.testType.trim(),
    date: payload.date,
    maxMarks: Number(payload.maxMarks),
    duration,
    durationMinutes,
    testPaperUrl: payload.testPaperUrl || null,
    testPaperName: payload.testPaperName || null,
    testPaperSize: payload.testPaperSize || null,
    mimeType: payload.mimeType || null,
    instructions: payload.instructions?.trim() || null,
    createdById: creator.id,
    createdByName: creator.name || `${creator.role} User`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (await checkDbAvailability()) {
    try {
      const created = await prisma.test.create({
        data: {
          testId: newTest.testId,
          name: newTest.name,
          classId: newTest.classId,
          boardId: newTest.boardId,
          subjectId: newTest.subjectId,
          chapter: newTest.chapter,
          testType: newTest.testType,
          date: new Date(newTest.date),
          dateStr: newTest.date,
          maxMarks: newTest.maxMarks,
          duration: newTest.duration,
          durationMinutes: newTest.durationMinutes,
          testPaperUrl: newTest.testPaperUrl,
          testPaperName: newTest.testPaperName,
          testPaperSize: newTest.testPaperSize,
          mimeType: newTest.mimeType,
          instructions: newTest.instructions,
          createdById: newTest.createdById,
          createdByName: newTest.createdByName,
        },
      });
      return {
        ...newTest,
        id: created.id,
      };
    } catch {}
  }

  inMemoryTests.unshift(newTest);
  return newTest;
};

export const updateTest = async (
  id: string,
  payload: UpdateTestPayload,
  _user: { id: string; role: string }
): Promise<TestDto> => {
  const existing = await getTestById(id);
  if (!existing) {
    throw new Error(`Test with ID "${id}" not found`);
  }

  const updatedTest: TestDto = {
    ...existing,
    ...(payload.name ? { name: payload.name.trim() } : {}),
    ...(payload.classId ? { classId: payload.classId } : {}),
    ...(payload.boardId ? { boardId: payload.boardId } : {}),
    ...(payload.subjectId ? { subjectId: payload.subjectId } : {}),
    ...(payload.chapter ? { chapter: payload.chapter.trim() } : {}),
    ...(payload.testType ? { testType: payload.testType.trim() } : {}),
    ...(payload.date ? { date: payload.date } : {}),
    ...(payload.maxMarks ? { maxMarks: Number(payload.maxMarks) } : {}),
    ...(payload.duration ? { duration: payload.duration } : {}),
    ...(payload.durationMinutes ? { durationMinutes: payload.durationMinutes } : {}),
    ...(payload.testPaperUrl !== undefined ? { testPaperUrl: payload.testPaperUrl } : {}),
    ...(payload.testPaperName !== undefined ? { testPaperName: payload.testPaperName } : {}),
    ...(payload.testPaperSize !== undefined ? { testPaperSize: payload.testPaperSize } : {}),
    ...(payload.mimeType !== undefined ? { mimeType: payload.mimeType } : {}),
    ...(payload.instructions !== undefined ? { instructions: payload.instructions } : {}),
    updatedAt: new Date(),
  };

  if (await checkDbAvailability()) {
    try {
      await prisma.test.update({
        where: { id: existing.id },
        data: {
          name: updatedTest.name,
          chapter: updatedTest.chapter,
          testType: updatedTest.testType,
          date: new Date(updatedTest.date),
          dateStr: updatedTest.date,
          maxMarks: updatedTest.maxMarks,
          duration: updatedTest.duration,
          durationMinutes: updatedTest.durationMinutes,
          testPaperUrl: updatedTest.testPaperUrl,
          testPaperName: updatedTest.testPaperName,
          testPaperSize: updatedTest.testPaperSize,
          mimeType: updatedTest.mimeType,
          instructions: updatedTest.instructions,
        },
      });
    } catch {}
  }

  const idx = inMemoryTests.findIndex((t) => t.id === existing.id);
  if (idx >= 0) {
    inMemoryTests[idx] = updatedTest;
  }

  return updatedTest;
};

export const deleteTest = async (
  id: string,
  user: { id: string; role: string }
): Promise<{ success: boolean; message: string }> => {
  const existing = await getTestById(id);
  if (!existing) {
    throw new Error(`Test with ID "${id}" not found`);
  }

  // Teacher can only delete tests they created, Admin can delete any
  if (user.role === 'TEACHER' && existing.createdById !== user.id) {
    throw new Error('You are only authorized to delete tests created by you');
  }

  if (await checkDbAvailability()) {
    try {
      await prisma.test.delete({ where: { id: existing.id } });
    } catch {}
  }

  inMemoryTests = inMemoryTests.filter((t) => t.id !== existing.id);
  return { success: true, message: `Test "${existing.name}" deleted successfully.` };
};
