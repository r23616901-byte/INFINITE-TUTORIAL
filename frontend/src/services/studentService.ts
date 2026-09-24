import api from './api';

export type StudentStatusType = 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'COMPLETED' | 'SUSPENDED';

export interface StudentDto {
  id: string;
  studentId: string;
  name: string;
  photoUrl?: string | null;
  school: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  studentPhone?: string | null;
  dateOfBirth: string;
  classId: string;
  className: string;
  boardId: string;
  boardName: string;
  batchId: string;
  batchName: string;
  academicYear: string;
  admissionDate: string;
  status: StudentStatusType;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicLookups {
  classes: Array<{ id: string; name: string; grade: number; description?: string }>;
  boards: Array<{ id: string; name: string; code: string }>;
  batches: Array<{ id: string; name: string; timing: string; classId: string; boardId: string; academicYear: string }>;
}

export interface StudentFilters {
  search?: string;
  name?: string;
  studentId?: string;
  parentPhone?: string;
  school?: string;
  classId?: string;
  boardId?: string;
  batchId?: string;
  academicYear?: string;
  status?: StudentStatusType;
  page?: number;
  limit?: number;
}

export interface CreateStudentPayload {
  studentId?: string;
  name: string;
  photoUrl?: string | null;
  school: string;
  parentName: string;
  parentPhone: string;
  studentPhone?: string | null;
  dateOfBirth: string;
  classId: string;
  boardId: string;
  batchId: string;
  academicYear?: string;
  admissionDate?: string;
  status?: StudentStatusType;
}

export interface UpdateStudentPayload {
  name?: string;
  photoUrl?: string | null;
  school?: string;
  parentName?: string;
  parentPhone?: string;
  studentPhone?: string | null;
  dateOfBirth?: string;
  classId?: string;
  boardId?: string;
  batchId?: string;
  academicYear?: string;
  status?: StudentStatusType;
}

// Default in-memory students fallback
export const MOCK_STUDENTS: StudentDto[] = [
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

export const MOCK_LOOKUPS: AcademicLookups = {
  classes: [
    { id: 'cls-10', name: 'Class 10', grade: 10, description: '10th Secondary Grade' },
    { id: 'cls-9', name: 'Class 9', grade: 9, description: '9th Secondary Grade' },
  ],
  boards: [
    { id: 'brd-cbse', name: 'CBSE', code: 'CBSE' },
    { id: 'brd-ksb', name: 'Karnataka State Board', code: 'KSB' },
  ],
  batches: [
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
  ],
};

const localStoreStudents = [...MOCK_STUDENTS];

/**
 * Fetch academic lookups (classes, boards, batches)
 */
export const fetchAcademicLookups = async (): Promise<AcademicLookups> => {
  try {
    const res = await api.get('/students/lookups');
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
  } catch {
    // Return fallback
  }
  return MOCK_LOOKUPS;
};

/**
 * Fetch students list with search and filters
 */
export const fetchStudents = async (filters: StudentFilters = {}): Promise<{
  students: StudentDto[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const res = await api.get('/students', { params: filters });
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
  } catch {
    // Return filtered local store
  }

  let list = [...localStoreStudents];

  if (filters.status) {
    list = list.filter((s) => s.status === filters.status);
  }
  if (filters.classId) {
    list = list.filter((s) => s.classId === filters.classId || s.className.toLowerCase().includes(filters.classId!.toLowerCase()));
  }
  if (filters.boardId) {
    list = list.filter((s) => s.boardId === filters.boardId || s.boardName.toLowerCase().includes(filters.boardId!.toLowerCase()));
  }
  if (filters.batchId) {
    list = list.filter((s) => s.batchId === filters.batchId || s.batchName.toLowerCase().includes(filters.batchId!.toLowerCase()));
  }
  if (filters.school) {
    list = list.filter((s) => s.school.toLowerCase().includes(filters.school!.toLowerCase()));
  }
  if (filters.name) {
    list = list.filter((s) => s.name.toLowerCase().includes(filters.name!.toLowerCase()));
  }
  if (filters.studentId) {
    list = list.filter((s) => s.studentId.toLowerCase().includes(filters.studentId!.toLowerCase()));
  }
  if (filters.parentPhone) {
    list = list.filter((s) => s.parentPhone.includes(filters.parentPhone!));
  }
  if (filters.search) {
    const term = filters.search.toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.studentId.toLowerCase().includes(term) ||
        s.school.toLowerCase().includes(term) ||
        s.parentPhone.includes(term) ||
        s.parentName.toLowerCase().includes(term) ||
        s.batchName.toLowerCase().includes(term)
    );
  }

  return {
    students: list,
    total: list.length,
    page: filters.page || 1,
    limit: filters.limit || 50,
  };
};

/**
 * Fetch single student details by ID
 */
export const fetchStudentById = async (id: string): Promise<StudentDto | null> => {
  try {
    const res = await api.get(`/students/${id}`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  return localStoreStudents.find((s) => s.id === id || s.studentId === id) || null;
};

/**
 * Fetch linked student profile for Parent
 */
export const fetchMyStudentProfile = async (): Promise<StudentDto | null> => {
  try {
    const res = await api.get('/students/profile/me');
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
  } catch {
    // Fallback: returns Rahul Kumar (IT10025)
  }
  return localStoreStudents[0];
};

/**
 * Add a new student (Admin Only)
 */
export const createStudent = async (payload: CreateStudentPayload): Promise<StudentDto> => {
  try {
    const res = await api.post('/students', payload);
    if (res.data?.success && res.data.data) {
      localStoreStudents.unshift(res.data.data);
      return res.data.data;
    }
  } catch {
    // Fallback
  }

  const newIdNum = 10030 + localStoreStudents.length;
  const newStudent: StudentDto = {
    id: `stu-${Date.now()}`,
    studentId: payload.studentId || `IT${newIdNum}`,
    name: payload.name,
    photoUrl: payload.photoUrl || null,
    school: payload.school,
    parentId: `parent-${Date.now()}`,
    parentName: payload.parentName,
    parentPhone: payload.parentPhone,
    studentPhone: payload.studentPhone || null,
    dateOfBirth: new Date(payload.dateOfBirth).toISOString(),
    classId: payload.classId,
    className: MOCK_LOOKUPS.classes.find((c) => c.id === payload.classId)?.name || 'Class 10',
    boardId: payload.boardId,
    boardName: MOCK_LOOKUPS.boards.find((b) => b.id === payload.boardId)?.name || 'CBSE',
    batchId: payload.batchId,
    batchName: MOCK_LOOKUPS.batches.find((b) => b.id === payload.batchId)?.name || '10-A Morning',
    academicYear: payload.academicYear || '2024-2025',
    admissionDate: payload.admissionDate || new Date().toISOString(),
    status: payload.status || 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localStoreStudents.unshift(newStudent);
  return newStudent;
};

/**
 * Update an existing student (Admin Only)
 */
export const updateStudent = async (id: string, payload: UpdateStudentPayload): Promise<StudentDto> => {
  try {
    const res = await api.put(`/students/${id}`, payload);
    if (res.data?.success && res.data.data) {
      const idx = localStoreStudents.findIndex((s) => s.id === id || s.studentId === id);
      if (idx !== -1) localStoreStudents[idx] = res.data.data;
      return res.data.data;
    }
  } catch {
    // Fallback
  }

  const idx = localStoreStudents.findIndex((s) => s.id === id || s.studentId === id);
  if (idx === -1) throw new Error('Student not found');

  const existing = localStoreStudents[idx];
  const updated: StudentDto = {
    ...existing,
    name: payload.name ?? existing.name,
    photoUrl: payload.photoUrl !== undefined ? payload.photoUrl : existing.photoUrl,
    school: payload.school ?? existing.school,
    parentName: payload.parentName ?? existing.parentName,
    parentPhone: payload.parentPhone ?? existing.parentPhone,
    studentPhone: payload.studentPhone !== undefined ? payload.studentPhone : existing.studentPhone,
    dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth).toISOString() : existing.dateOfBirth,
    classId: payload.classId ?? existing.classId,
    className: payload.classId ? (MOCK_LOOKUPS.classes.find((c) => c.id === payload.classId)?.name || existing.className) : existing.className,
    boardId: payload.boardId ?? existing.boardId,
    boardName: payload.boardId ? (MOCK_LOOKUPS.boards.find((b) => b.id === payload.boardId)?.name || existing.boardName) : existing.boardName,
    batchId: payload.batchId ?? existing.batchId,
    batchName: payload.batchId ? (MOCK_LOOKUPS.batches.find((b) => b.id === payload.batchId)?.name || existing.batchName) : existing.batchName,
    academicYear: payload.academicYear ?? existing.academicYear,
    status: payload.status ?? existing.status,
    updatedAt: new Date().toISOString(),
  };

  localStoreStudents[idx] = updated;
  return updated;
};

/**
 * Change student enrollment status / deactivate (Admin Only)
 */
export const setStudentStatus = async (id: string, status: StudentStatusType): Promise<StudentDto> => {
  return updateStudent(id, { status });
};
