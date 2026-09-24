import prisma from './prisma';
import { checkDbAvailability } from './academicService';
import {
  StudentDto,
  CreateStudentDto,
  UpdateStudentDto,
  StudentFilters,
  StudentStatusType,
} from '../types';

// Initial lookups for Academic Classes, Boards, and Batches
export const DEFAULT_CLASSES = [
  { id: 'cls-10', name: 'Class 10', grade: 10, description: '10th Secondary Grade' },
  { id: 'cls-9', name: 'Class 9', grade: 9, description: '9th Secondary Grade' },
];

export const DEFAULT_BOARDS = [
  { id: 'brd-cbse', name: 'CBSE', code: 'CBSE' },
  { id: 'brd-ksb', name: 'Karnataka State Board', code: 'KSB' },
];

export const DEFAULT_BATCHES = [
  {
    id: 'batch-10a-morning',
    name: '10-A Morning',
    timing: '07:00 AM - 09:30 AM',
    classId: 'cls-10',
    boardId: 'brd-cbse',
    academicYear: '2024-2025',
  },
  {
    id: 'batch-10b-evening',
    name: '10-B Evening',
    timing: '05:30 PM - 08:00 PM',
    classId: 'cls-10',
    boardId: 'brd-cbse',
    academicYear: '2024-2025',
  },
  {
    id: 'batch-9a-evening',
    name: '9-A Evening',
    timing: '05:00 PM - 07:30 PM',
    classId: 'cls-9',
    boardId: 'brd-ksb',
    academicYear: '2024-2025',
  },
];

// In-Memory store for fast fallback & seed demonstration
let inMemoryStudents: StudentDto[] = [
  {
    id: 'stu-10025',
    studentId: 'IT10025',
    name: 'Rahul Kumar',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    school: 'ABC Public School',
    parentId: 'parent-1',
    parentName: 'Mr. Ramesh Kumar',
    parentPhone: '6361085188',
    studentPhone: null,
    dateOfBirth: '2006-09-26T00:00:00.000Z',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    batchId: 'batch-10a-morning',
    batchName: '10-A Morning',
    academicYear: '2024-2025',
    admissionDate: '2024-06-01T00:00:00.000Z',
    status: 'ACTIVE',
    createdAt: '2024-06-01T00:00:00.000Z',
    updatedAt: '2024-06-01T00:00:00.000Z',
  },
  {
    id: 'stu-10026',
    studentId: 'IT10026',
    name: 'Sneha Verma',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    school: 'St. Joseph Convent School',
    parentId: 'parent-2',
    parentName: 'Rajesh Verma',
    parentPhone: '9845112233',
    studentPhone: '9845112234',
    dateOfBirth: '2011-08-20T00:00:00.000Z',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    batchId: 'batch-10a-morning',
    batchName: '10-A Morning',
    academicYear: '2024-2025',
    admissionDate: '2024-06-05T00:00:00.000Z',
    status: 'ACTIVE',
    createdAt: '2024-06-05T00:00:00.000Z',
    updatedAt: '2024-06-05T00:00:00.000Z',
  },
  {
    id: 'stu-10027',
    studentId: 'IT10027',
    name: 'Aditya Rao',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    school: 'National Public School',
    parentId: 'parent-3',
    parentName: 'Suresh Rao',
    parentPhone: '9812334455',
    studentPhone: null,
    dateOfBirth: '2011-03-10T00:00:00.000Z',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    batchId: 'batch-10b-evening',
    batchName: '10-B Evening',
    academicYear: '2024-2025',
    admissionDate: '2024-06-10T00:00:00.000Z',
    status: 'ACTIVE',
    createdAt: '2024-06-10T00:00:00.000Z',
    updatedAt: '2024-06-10T00:00:00.000Z',
  },
  {
    id: 'stu-10028',
    studentId: 'IT10028',
    name: 'Priya Nair',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    school: 'Delhi Public School',
    parentId: 'parent-4',
    parentName: 'Venkat Nair',
    parentPhone: '9823445566',
    studentPhone: null,
    dateOfBirth: '2012-01-25T00:00:00.000Z',
    classId: 'cls-9',
    className: 'Class 9',
    boardId: 'brd-ksb',
    boardName: 'Karnataka State Board',
    batchId: 'batch-9a-evening',
    batchName: '9-A Evening',
    academicYear: '2024-2025',
    admissionDate: '2024-06-15T00:00:00.000Z',
    status: 'ACTIVE',
    createdAt: '2024-06-15T00:00:00.000Z',
    updatedAt: '2024-06-15T00:00:00.000Z',
  },
  {
    id: 'stu-10029',
    studentId: 'IT10029',
    name: 'Rohan Patil',
    photoUrl: null,
    school: 'Kendriya Vidyalaya',
    parentId: 'parent-5',
    parentName: 'Santosh Patil',
    parentPhone: '9834556677',
    studentPhone: null,
    dateOfBirth: '2011-11-14T00:00:00.000Z',
    classId: 'cls-10',
    className: 'Class 10',
    boardId: 'brd-cbse',
    boardName: 'CBSE',
    batchId: 'batch-10b-evening',
    batchName: '10-B Evening',
    academicYear: '2024-2025',
    admissionDate: '2024-06-18T00:00:00.000Z',
    status: 'INACTIVE',
    createdAt: '2024-06-18T00:00:00.000Z',
    updatedAt: '2024-08-01T00:00:00.000Z',
  },
];

/**
 * Generate unique student ID (e.g. IT10030)
 */
export const generateStudentId = (): string => {
  const existingNumbers = inMemoryStudents
    .map((s) => {
      const match = s.studentId.match(/^IT(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => n > 0);

  const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 10029;
  return `IT${maxNum + 1}`;
};

/**
 * Retrieve academic lookup options (classes, boards, batches)
 */
export const getAcademicLookups = async () => {
  if (await checkDbAvailability()) {
    try {
      const [classes, boards, batches] = await Promise.all([
        prisma.class.findMany({ orderBy: { grade: 'desc' } }),
        prisma.board.findMany({ orderBy: { name: 'asc' } }),
        prisma.batch.findMany({ include: { class: true, board: true } }),
      ]);

      if (classes.length > 0) {
        return { classes, boards, batches };
      }
    } catch (err) {
      // Database offline or unmigrated; use fallback
    }
  }

  return {
    classes: DEFAULT_CLASSES,
    boards: DEFAULT_BOARDS,
    batches: DEFAULT_BATCHES,
  };
};

/**
 * Query students with full search & multi-criteria filtering
 */
export const getStudents = async (filters: StudentFilters = {}) => {
  const {
    search,
    name,
    studentId,
    parentPhone,
    school,
    classId,
    boardId,
    batchId,
    academicYear,
    status,
    page = 1,
    limit = 50,
  } = filters;

  // Try Prisma first if available
  if (await checkDbAvailability()) {
    try {
      const where: any = {};

    if (status) {
      where.status = status;
    }
    if (academicYear) {
      where.academicYear = academicYear;
    }
    if (classId) {
      where.classId = classId;
    }
    if (boardId) {
      where.boardId = boardId;
    }
    if (batchId) {
      where.batchId = batchId;
    }
    if (school) {
      where.school = { contains: school, mode: 'insensitive' };
    }
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (studentId) {
      where.studentId = { contains: studentId, mode: 'insensitive' };
    }
    if (parentPhone) {
      where.parent = { phone: { contains: parentPhone } };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { studentId: { contains: search, mode: 'insensitive' } },
        { school: { contains: search, mode: 'insensitive' } },
        { parent: { phone: { contains: search } } },
        { parent: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          class: true,
          board: true,
          batch: true,
          parent: true,
          photo: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);

    if (students.length > 0) {
      const mapped: StudentDto[] = students.map((s: any) => ({
        id: s.id,
        studentId: s.studentId,
        name: s.name,
        photoUrl: s.photo?.fileUrl || s.photoUrl,
        school: s.school,
        parentId: s.parentId,
        parentName: s.parent?.name || s.parentName || '',
        parentPhone: s.parent?.phone || s.parentPhone || '',
        studentPhone: s.studentPhone,
        dateOfBirth: s.dateOfBirth,
        classId: s.classId,
        className: s.class?.name || '',
        boardId: s.boardId,
        boardName: s.board?.name || '',
        batchId: s.batchId,
        batchName: s.batch?.name || '',
        academicYear: s.academicYear,
        admissionDate: s.admissionDate,
        status: s.status as StudentStatusType,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      }));

      return { students: mapped, total, page, limit };
    }
  } catch (err) {
    // Database connection failed, fall through to inMemory store
  }
}

  // Fallback in-memory filter implementation
  let results = [...inMemoryStudents];

  if (status) {
    results = results.filter((s) => s.status === status);
  }
  if (academicYear) {
    results = results.filter((s) => s.academicYear === academicYear);
  }
  if (classId) {
    results = results.filter((s) => s.classId === classId || s.className.toLowerCase().includes(classId.toLowerCase()));
  }
  if (boardId) {
    results = results.filter((s) => s.boardId === boardId || s.boardName.toLowerCase().includes(boardId.toLowerCase()));
  }
  if (batchId) {
    results = results.filter((s) => s.batchId === batchId || s.batchName.toLowerCase().includes(batchId.toLowerCase()));
  }
  if (school) {
    results = results.filter((s) => s.school.toLowerCase().includes(school.toLowerCase()));
  }
  if (name) {
    results = results.filter((s) => s.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (studentId) {
    results = results.filter((s) => s.studentId.toLowerCase().includes(studentId.toLowerCase()));
  }
  if (parentPhone) {
    results = results.filter((s) => s.parentPhone.includes(parentPhone));
  }

  if (search) {
    const sTerm = search.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(sTerm) ||
        s.studentId.toLowerCase().includes(sTerm) ||
        s.school.toLowerCase().includes(sTerm) ||
        s.parentPhone.includes(sTerm) ||
        s.parentName.toLowerCase().includes(sTerm) ||
        s.batchName.toLowerCase().includes(sTerm)
    );
  }

  const total = results.length;
  const startIndex = (page - 1) * limit;
  const paginated = results.slice(startIndex, startIndex + limit);

  return {
    students: paginated,
    total,
    page,
    limit,
  };
};

/**
 * Get student by primary database ID
 */
export const getStudentById = async (id: string): Promise<StudentDto | null> => {
  if (await checkDbAvailability()) {
    try {
      const s = await prisma.student.findUnique({
      where: { id },
      include: {
        class: true,
        board: true,
        batch: true,
        parent: true,
        photo: true,
      },
    });

    if (s) {
      return {
        id: s.id,
        studentId: s.studentId,
        name: s.name,
        photoUrl: s.photo?.fileUrl || s.photoUrl,
        school: s.school,
        parentId: s.parentId,
        parentName: s.parent?.name || s.parentName || '',
        parentPhone: s.parent?.phone || s.parentPhone || '',
        studentPhone: s.studentPhone,
        dateOfBirth: s.dateOfBirth,
        classId: s.classId,
        className: s.class?.name || '',
        boardId: s.boardId,
        boardName: s.board?.name || '',
        batchId: s.batchId,
        batchName: s.batch?.name || '',
        academicYear: s.academicYear,
        admissionDate: s.admissionDate,
        status: s.status as StudentStatusType,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      };
      }
    } catch (err) {
      // Fallback
    }
  }

  return inMemoryStudents.find((s) => s.id === id || s.studentId === id) || null;
};

/**
 * Retrieve linked student for a logged-in parent
 */
export const getStudentForParent = async (parentUserId: string, parentPhone?: string): Promise<StudentDto | null> => {
  if (await checkDbAvailability()) {
    try {
      const parent = await prisma.parent.findFirst({
      where: {
        OR: [
          { userId: parentUserId },
          ...(parentPhone ? [{ phone: parentPhone }] : []),
        ],
      },
      include: {
        students: {
          include: {
            class: true,
            board: true,
            batch: true,
            photo: true,
          },
        },
      },
    });

    if (parent && parent.students.length > 0) {
      const s = parent.students[0];
      return {
        id: s.id,
        studentId: s.studentId,
        name: s.name,
        photoUrl: s.photo?.fileUrl || s.photoUrl,
        school: s.school,
        parentId: parent.id,
        parentName: parent.name,
        parentPhone: parent.phone,
        studentPhone: s.studentPhone,
        dateOfBirth: s.dateOfBirth,
        classId: s.classId,
        className: s.class?.name || '',
        boardId: s.boardId,
        boardName: s.board?.name || '',
        batchId: s.batchId,
        batchName: s.batch?.name || '',
        academicYear: s.academicYear,
        admissionDate: s.admissionDate,
        status: s.status as StudentStatusType,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      };
      }
    } catch (err) {
      // Fallback
    }
  }

  // Fallback: match by parentPhone or parentId
  if (parentPhone) {
    const found = inMemoryStudents.find((s) => s.parentPhone === parentPhone);
    if (found) return found;
  }
  if (parentUserId) {
    const found = inMemoryStudents.find((s) => s.parentId === parentUserId);
    if (found) return found;
  }
  return null;
};

/**
 * Authorization helper: Verify if a student belongs to the requesting user.
 * ADMIN and TEACHER have authorized academic access.
 * PARENT can ONLY access their own linked student.
 */
export const isStudentAuthorizedForUser = async (
  targetStudentIdOrRoll: string,
  user: { id: string; role: string; phone?: string; studentId?: string }
): Promise<boolean> => {
  if (user.role === 'ADMIN' || user.role === 'TEACHER') {
    return true;
  }

  if (user.role === 'PARENT') {
    const cleanTarget = targetStudentIdOrRoll.trim().toLowerCase();
    const linkedStudent = await getStudentForParent(user.id, user.phone);
    if (!linkedStudent) {
      return false;
    }
    return (
      linkedStudent.id.toLowerCase() === cleanTarget ||
      linkedStudent.studentId.toLowerCase() === cleanTarget
    );
  }

  return false;
};

/**
 * Create a new student (Admin Only)
 */
export const createStudent = async (data: CreateStudentDto): Promise<StudentDto> => {
  const studentId = data.studentId?.trim() || generateStudentId();

  // Find class, board, batch names
  const classes = DEFAULT_CLASSES;
  const boards = DEFAULT_BOARDS;
  const batches = DEFAULT_BATCHES;

  const classItem = classes.find((c) => c.id === data.classId) || { name: 'Class 10' };
  const boardItem = boards.find((b) => b.id === data.boardId) || { name: 'CBSE' };
  const batchItem = batches.find((b) => b.id === data.batchId) || { name: '10-A Morning' };

  const newStudent: StudentDto = {
    id: `stu-${Date.now()}`,
    studentId,
    name: data.name.trim(),
    photoUrl: data.photoUrl || null,
    school: data.school.trim(),
    parentId: `parent-${Date.now()}`,
    parentName: data.parentName.trim(),
    parentPhone: data.parentPhone.trim(),
    studentPhone: data.studentPhone?.trim() || null,
    dateOfBirth: new Date(data.dateOfBirth).toISOString(),
    classId: data.classId,
    className: classItem.name,
    boardId: data.boardId,
    boardName: boardItem.name,
    batchId: data.batchId,
    batchName: batchItem.name,
    academicYear: data.academicYear || '2024-2025',
    admissionDate: data.admissionDate ? new Date(data.admissionDate).toISOString() : new Date().toISOString(),
    status: data.status || 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Try DB persistence
  try {
    await prisma.student.create({
      data: {
        studentId: newStudent.studentId,
        name: newStudent.name,
        photoUrl: newStudent.photoUrl,
        school: newStudent.school,
        parentName: newStudent.parentName,
        parentPhone: newStudent.parentPhone,
        studentPhone: newStudent.studentPhone,
        dateOfBirth: new Date(newStudent.dateOfBirth),
        academicYear: newStudent.academicYear,
        admissionDate: new Date(newStudent.admissionDate),
        status: newStudent.status,
        class: { connect: { id: newStudent.classId } },
        board: { connect: { id: newStudent.boardId } },
        batch: { connect: { id: newStudent.batchId } },
        parent: {
          create: {
            name: newStudent.parentName,
            phone: newStudent.parentPhone,
            user: {
              create: {
                phone: newStudent.parentPhone,
                passwordHash: 'dev-placeholder',
                role: 'PARENT',
              },
            },
          },
        },
      },
    });
  } catch (err) {
    // If DB fails, maintain in-memory
  }

  inMemoryStudents.unshift(newStudent);
  return newStudent;
};

/**
 * Edit student information (Admin Only)
 */
export const updateStudent = async (id: string, data: UpdateStudentDto): Promise<StudentDto> => {
  const index = inMemoryStudents.findIndex((s) => s.id === id || s.studentId === id);
  if (index === -1) {
    throw new Error(`Student with ID ${id} not found`);
  }

  const existing = inMemoryStudents[index];

  let className = existing.className;
  if (data.classId && data.classId !== existing.classId) {
    const c = DEFAULT_CLASSES.find((item) => item.id === data.classId);
    if (c) className = c.name;
  }

  let boardName = existing.boardName;
  if (data.boardId && data.boardId !== existing.boardId) {
    const b = DEFAULT_BOARDS.find((item) => item.id === data.boardId);
    if (b) boardName = b.name;
  }

  let batchName = existing.batchName;
  if (data.batchId && data.batchId !== existing.batchId) {
    const batch = DEFAULT_BATCHES.find((item) => item.id === data.batchId);
    if (batch) batchName = batch.name;
  }

  const updated: StudentDto = {
    ...existing,
    name: data.name !== undefined ? data.name.trim() : existing.name,
    photoUrl: data.photoUrl !== undefined ? data.photoUrl : existing.photoUrl,
    school: data.school !== undefined ? data.school.trim() : existing.school,
    parentName: data.parentName !== undefined ? data.parentName.trim() : existing.parentName,
    parentPhone: data.parentPhone !== undefined ? data.parentPhone.trim() : existing.parentPhone,
    studentPhone: data.studentPhone !== undefined ? (data.studentPhone?.trim() || null) : existing.studentPhone,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : existing.dateOfBirth,
    classId: data.classId || existing.classId,
    className,
    boardId: data.boardId || existing.boardId,
    boardName,
    batchId: data.batchId || existing.batchId,
    batchName,
    academicYear: data.academicYear || existing.academicYear,
    status: data.status || existing.status,
    updatedAt: new Date().toISOString(),
  };

  try {
    await prisma.student.update({
      where: { id: existing.id },
      data: {
        name: updated.name,
        photoUrl: updated.photoUrl,
        school: updated.school,
        parentName: updated.parentName,
        parentPhone: updated.parentPhone,
        studentPhone: updated.studentPhone,
        dateOfBirth: new Date(updated.dateOfBirth),
        academicYear: updated.academicYear,
        status: updated.status,
        ...(data.classId ? { class: { connect: { id: data.classId } } } : {}),
        ...(data.boardId ? { board: { connect: { id: data.boardId } } } : {}),
        ...(data.batchId ? { batch: { connect: { id: data.batchId } } } : {}),
      },
    });
  } catch (err) {
    // DB fallback
  }

  inMemoryStudents[index] = updated;
  return updated;
};

/**
 * Deactivate or change student enrollment status (Admin Only)
 */
export const setStudentStatus = async (id: string, status: StudentStatusType): Promise<StudentDto> => {
  return updateStudent(id, { status });
};
