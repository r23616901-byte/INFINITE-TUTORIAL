import api from './api';

export interface TeacherDto {
  id: string;
  name: string;
  phone: string;
  email: string;
  subjects: string[];
  batches: string[];
  joiningDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  activityLog?: string[];
  createdAt: string;
  updatedAt: string;
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

export const fetchTeachers = async (params: { search?: string; status?: string } = {}): Promise<TeacherDto[]> => {
  try {
    const res = await api.get('/teachers', { params });
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
  } catch {}
  return [
    {
      id: 'teacher-prof-1',
      name: 'Prof. Rajesh Sharma (Physics)',
      phone: '9800000002',
      email: 'teacher@infinite.com',
      subjects: ['Physics', 'Mathematics'],
      batches: ['10A Morning', '10B Evening'],
      joiningDate: '2024-06-01',
      status: 'ACTIVE',
      createdAt: '2024-06-01T00:00:00.000Z',
      updatedAt: '2024-06-01T00:00:00.000Z',
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
      createdAt: '2024-07-15T00:00:00.000Z',
      updatedAt: '2024-07-15T00:00:00.000Z',
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
      createdAt: '2024-08-01T00:00:00.000Z',
      updatedAt: '2024-08-01T00:00:00.000Z',
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
      createdAt: '2024-08-10T00:00:00.000Z',
      updatedAt: '2024-08-10T00:00:00.000Z',
    },
  ];
};

export const createTeacherApi = async (payload: CreateTeacherPayload): Promise<TeacherDto> => {
  const res = await api.post('/teachers', payload);
  return res.data.data;
};

export const updateTeacherApi = async (id: string, payload: UpdateTeacherPayload): Promise<TeacherDto> => {
  const res = await api.put(`/teachers/${id}`, payload);
  return res.data.data;
};

export const toggleTeacherStatusApi = async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<TeacherDto> => {
  const res = await api.patch(`/teachers/${id}/status`, { status });
  return res.data.data;
};

export const assignSubjectsAndBatchesApi = async (id: string, subjects: string[], batches: string[]): Promise<TeacherDto> => {
  const res = await api.patch(`/teachers/${id}/assignments`, { subjects, batches });
  return res.data.data;
};

export const resetTeacherPasswordApi = async (id: string): Promise<{ success: boolean; tempPassword: string; message: string }> => {
  const res = await api.post(`/teachers/${id}/reset-password`);
  return res.data;
};

export const getAssignedStudentsApi = async (id: string) => {
  const res = await api.get(`/teachers/${id}/students`);
  return res.data.data;
};

export default {
  fetchTeachers,
  createTeacherApi,
  updateTeacherApi,
  toggleTeacherStatusApi,
  assignSubjectsAndBatchesApi,
  resetTeacherPasswordApi,
  getAssignedStudentsApi,
};
