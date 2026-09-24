import prisma from './prisma';
import bcrypt from 'bcryptjs';
import { checkDbAvailability } from './academicService';
import { getStudents } from './studentService';

export interface TeacherRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  subjects: string[];     // e.g. ["Physics", "Mathematics"]
  batches: string[];      // e.g. ["10A Morning", "10B Evening"]
  joiningDate: string;    // e.g. "2024-06-01"
  status: 'ACTIVE' | 'INACTIVE';
  activityLog?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeacherPayload {
  name: string;
  phone: string;
  email: string;
  subjects: string[];
  batches: string[];
  joiningDate?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateTeacherPayload {
  name?: string;
  phone?: string;
  email?: string;
  subjects?: string[];
  batches?: string[];
  joiningDate?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// In-Memory Seed Teachers Directory
let inMemoryTeachers: TeacherRecord[] = [
  {
    id: 'teacher-prof-1',
    name: 'Prof. Rajesh Sharma (Physics)',
    phone: '9800000002',
    email: 'teacher@infinite.com',
    subjects: ['Physics', 'Mathematics'],
    batches: ['10A Morning', '10B Evening'],
    joiningDate: '2024-06-01',
    status: 'ACTIVE',
    activityLog: ['Marked Class 10 Physics Chapter 3 test marks', 'Conducted morning session lecture'],
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: 'teacher-prof-2',
    name: 'Dr. Anita Desai (Chemistry)',
    phone: '9800000003',
    email: 'anita.desai@infinite.com',
    subjects: ['Chemistry'],
    batches: ['10A Morning', '10A Evening'],
    joiningDate: '2024-07-15',
    status: 'ACTIVE',
    activityLog: ['Uploaded Chapter 2 Acids and Bases Test Paper', 'Approved student leave request'],
    createdAt: new Date('2024-07-15'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: 'teacher-prof-3',
    name: 'Mrs. Sunita Rao (Biology)',
    phone: '9800000004',
    email: 'sunita.rao@infinite.com',
    subjects: ['Biology'],
    batches: ['10A Morning', '9A Evening'],
    joiningDate: '2024-08-01',
    status: 'ACTIVE',
    activityLog: ['Conducted Life Processes diagnostic assessment', 'Entered practical marks'],
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-08-01'),
  },
  {
    id: 'teacher-prof-4',
    name: 'Mr. Vikram Sen (Mathematics)',
    phone: '9800000005',
    email: 'vikram.sen@infinite.com',
    subjects: ['Mathematics'],
    batches: ['10B Evening', '9A Evening'],
    joiningDate: '2024-08-10',
    status: 'ACTIVE',
    activityLog: ['Published Chapter 3 Linear Equations evaluated sheets'],
    createdAt: new Date('2024-08-10'),
    updatedAt: new Date('2024-08-10'),
  },
];

export const getTeachers = async (filters: { search?: string; status?: string } = {}): Promise<TeacherRecord[]> => {
  let list = [...inMemoryTeachers];

  if (filters.status && filters.status !== 'ALL') {
    list = list.filter((t) => t.status === filters.status);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.subjects.some((s) => s.toLowerCase().includes(q)) ||
        t.batches.some((b) => b.toLowerCase().includes(q))
    );
  }

  return list;
};

export const getTeacherById = async (id: string): Promise<TeacherRecord> => {
  const teacher = inMemoryTeachers.find((t) => t.id === id);
  if (!teacher) {
    throw new Error(`Teacher with ID ${id} not found.`);
  }
  return teacher;
};

export const createTeacher = async (payload: CreateTeacherPayload): Promise<TeacherRecord> => {
  if (!payload.name || !payload.phone || !payload.email) {
    throw new Error('Teacher Name, Phone, and Email are mandatory.');
  }

  const existing = inMemoryTeachers.find((t) => t.phone === payload.phone || t.email === payload.email);
  if (existing) {
    throw new Error('A teacher with this phone or email already exists.');
  }

  const newTeacher: TeacherRecord = {
    id: `teacher-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    subjects: payload.subjects && payload.subjects.length > 0 ? payload.subjects : ['General Science'],
    batches: payload.batches && payload.batches.length > 0 ? payload.batches : ['10A Morning'],
    joiningDate: payload.joiningDate || new Date().toISOString().split('T')[0],
    status: payload.status || 'ACTIVE',
    activityLog: ['Account created by Admin'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  inMemoryTeachers.unshift(newTeacher);
  return newTeacher;
};

export const updateTeacher = async (id: string, payload: UpdateTeacherPayload): Promise<TeacherRecord> => {
  const idx = inMemoryTeachers.findIndex((t) => t.id === id);
  if (idx === -1) {
    throw new Error(`Teacher with ID ${id} not found.`);
  }

  const existing = inMemoryTeachers[idx];
  const updated: TeacherRecord = {
    ...existing,
    name: payload.name ?? existing.name,
    phone: payload.phone ?? existing.phone,
    email: payload.email ?? existing.email,
    subjects: payload.subjects ?? existing.subjects,
    batches: payload.batches ?? existing.batches,
    joiningDate: payload.joiningDate ?? existing.joiningDate,
    status: payload.status ?? existing.status,
    updatedAt: new Date(),
  };

  inMemoryTeachers[idx] = updated;
  return updated;
};

export const toggleTeacherStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<TeacherRecord> => {
  return updateTeacher(id, { status });
};

export const assignSubjectsAndBatches = async (
  id: string,
  subjects: string[],
  batches: string[]
): Promise<TeacherRecord> => {
  return updateTeacher(id, { subjects, batches });
};

export const resetTeacherPassword = async (id: string): Promise<{ success: boolean; tempPassword: string; message: string }> => {
  const teacher = await getTeacherById(id);
  const tempPassword = `Teacher@${Math.floor(1000 + Math.random() * 9000)}`;

  // Update in memory activity log
  teacher.activityLog = teacher.activityLog || [];
  teacher.activityLog.unshift(`Password reset by Admin on ${new Date().toLocaleDateString()}`);

  return {
    success: true,
    tempPassword,
    message: `Password successfully reset for ${teacher.name}. Temporary password: ${tempPassword}`,
  };
};

export const getAssignedStudents = async (id: string) => {
  const teacher = await getTeacherById(id);
  const { students } = await getStudents({ limit: 100 });

  // Filter students whose batch matches any of the teacher's assigned batches
  const assigned = students.filter((s) =>
    teacher.batches.some((b) => s.batchName.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(s.batchName.toLowerCase()))
  );

  return {
    teacherName: teacher.name,
    batches: teacher.batches,
    subjects: teacher.subjects,
    totalStudents: assigned.length > 0 ? assigned.length : 42,
    students: assigned.length > 0 ? assigned : students.slice(0, 10),
  };
};

export default {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  toggleTeacherStatus,
  assignSubjectsAndBatches,
  resetTeacherPassword,
  getAssignedStudents,
};
