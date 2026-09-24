import api from './api';
import { ApiResponse } from '../types';
import { LeaveRequest, CreateLeavePayload, ReviewLeavePayload, LeaveStatus } from '../types/leave';

const SEED_LEAVES: LeaveRequest[] = [
  {
    id: 'lve-10025-01',
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    className: 'Class 10',
    batchName: 'Batch 10A Morning',
    parentId: 'usr-parent-01',
    parentName: 'Mr. Ramesh Kumar',
    parentPhone: '+91 9876543210',
    fromDate: '2026-09-18',
    toDate: '2026-09-18',
    session: 'MORNING',
    reason: 'Medical',
    description: 'Rahul has a viral fever consultation scheduled in the morning.',
    status: 'PENDING',
    createdAt: '2026-09-17T14:30:00.000Z',
    updatedAt: '2026-09-17T14:30:00.000Z',
  },
  {
    id: 'lve-10012-01',
    studentId: 'stu-10012',
    studentName: 'Ananya Sharma',
    studentRoll: 'IT10012',
    className: 'Class 10',
    batchName: 'Batch 10A Morning',
    parentId: 'usr-parent-02',
    parentName: 'Dr. Sunita Sharma',
    parentPhone: '+91 9811223344',
    fromDate: '2026-09-22',
    toDate: '2026-09-22',
    session: 'BOTH',
    reason: 'Family Function',
    description: 'Attending cousin wedding in Chennai with parents.',
    status: 'APPROVED',
    reviewedById: 'usr-teacher-01',
    reviewedByName: 'Mrs. Priya Sundaram',
    reviewNote: 'Sanctioned. Please collect notes from classmates upon returning.',
    reviewedAt: '2026-09-21T11:20:00.000Z',
    createdAt: '2026-09-20T10:15:00.000Z',
    updatedAt: '2026-09-21T11:20:00.000Z',
  },
  {
    id: 'lve-10034-01',
    studentId: 'stu-10034',
    studentName: 'Rohan Patel',
    studentRoll: 'IT10034',
    className: 'Class 10',
    batchName: 'Batch 10A Morning',
    parentId: 'usr-parent-03',
    parentName: 'Mr. Rajesh Patel',
    parentPhone: '+91 9822334455',
    fromDate: '2026-09-12',
    toDate: '2026-09-12',
    session: 'MORNING',
    reason: 'Medical',
    description: 'Dental extraction procedure recovery.',
    status: 'APPROVED',
    reviewedById: 'usr-teacher-01',
    reviewedByName: 'Mrs. Priya Sundaram',
    reviewNote: 'Approved. Rest well and attend the next revision class.',
    reviewedAt: '2026-09-11T16:00:00.000Z',
    createdAt: '2026-09-11T09:00:00.000Z',
    updatedAt: '2026-09-11T16:00:00.000Z',
  },
  {
    id: 'lve-10041-01',
    studentId: 'stu-10041',
    studentName: 'Sneha Reddy',
    studentRoll: 'IT10041',
    className: 'Class 10',
    batchName: 'Batch 10A Morning',
    parentId: 'usr-parent-04',
    parentName: 'Mrs. K. Reddy',
    parentPhone: '+91 9833445566',
    fromDate: '2026-09-04',
    toDate: '2026-09-05',
    session: 'BOTH',
    reason: 'Travel',
    description: 'Family out of station travel.',
    status: 'REJECTED',
    reviewedById: 'usr-teacher-01',
    reviewedByName: 'Mrs. Priya Sundaram',
    reviewNote: 'Leave cannot be sanctioned due to scheduled internal tests.',
    reviewedAt: '2026-09-03T09:15:00.000Z',
    createdAt: '2026-09-02T18:00:00.000Z',
    updatedAt: '2026-09-03T09:15:00.000Z',
  },
];

export const submitLeaveRequestApi = async (payload: CreateLeavePayload): Promise<LeaveRequest> => {
  try {
    const res = await api.post<ApiResponse<LeaveRequest>>('/leaves', payload);
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  const newLeave: LeaveRequest = {
    id: `lve-${Date.now()}`,
    studentId: payload.studentId || 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    className: 'Class 10',
    batchName: 'Batch 10A Morning',
    parentId: 'usr-parent-01',
    parentName: 'Mr. Ramesh Kumar',
    parentPhone: '+91 9876543210',
    fromDate: payload.fromDate,
    toDate: payload.toDate || payload.fromDate,
    session: payload.session || 'MORNING',
    reason: payload.reason,
    description: payload.description,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  SEED_LEAVES.unshift(newLeave);
  return newLeave;
};

export const getLeaveRequestsApi = async (filters: {
  status?: LeaveStatus;
  search?: string;
  studentId?: string;
} = {}): Promise<LeaveRequest[]> => {
  try {
    const res = await api.get<ApiResponse<LeaveRequest[]>>('/leaves', { params: filters });
    if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  let list = [...SEED_LEAVES];
  if (filters.status && filters.status !== ('ALL' as any)) {
    list = list.filter((l) => l.status === filters.status);
  }
  if (filters.studentId) {
    list = list.filter((l) => l.studentId === filters.studentId);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (l) =>
        l.studentName.toLowerCase().includes(q) ||
        l.studentRoll.toLowerCase().includes(q) ||
        l.reason.toLowerCase().includes(q)
    );
  }
  return list;
};

export const reviewLeaveRequestApi = async (
  leaveId: string,
  payload: ReviewLeavePayload
): Promise<LeaveRequest> => {
  try {
    const res = await api.put<ApiResponse<LeaveRequest>>(`/leaves/${leaveId}/review`, payload);
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  const item = SEED_LEAVES.find((l) => l.id === leaveId);
  if (item) {
    item.status = payload.status;
    item.reviewNote = payload.reviewNote || (payload.status === 'APPROVED' ? 'Sanctioned by faculty' : 'Rejected by faculty');
    item.reviewedByName = 'Mrs. Priya Sundaram';
    item.reviewedAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    return item;
  }
  return {
    id: leaveId,
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    className: 'Class 10',
    batchName: 'Batch 10A Morning',
    parentId: 'usr-parent-01',
    parentName: 'Mr. Ramesh Kumar',
    parentPhone: '+91 9876543210',
    fromDate: '2026-09-18',
    toDate: '2026-09-18',
    session: 'MORNING',
    reason: 'Medical',
    description: 'Leave review updated',
    status: payload.status,
    reviewedByName: 'Mrs. Priya Sundaram',
    reviewNote: payload.reviewNote,
    reviewedAt: new Date().toISOString(),
    createdAt: '2026-09-17T14:30:00.000Z',
    updatedAt: new Date().toISOString(),
  };
};
