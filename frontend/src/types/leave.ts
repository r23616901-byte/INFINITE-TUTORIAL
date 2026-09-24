export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  className: string;
  batchName: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  fromDate: string;
  toDate: string;
  session: string; // 'MORNING', 'EVENING', 'BOTH'
  reason: string; // 'Medical', 'Family Function', 'Examination', 'Personal', 'Travel', 'Other'
  description: string;
  attachmentUrl?: string | null;
  status: LeaveStatus;
  reviewedById?: string | null;
  reviewedByName?: string | null;
  reviewNote?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeavePayload {
  studentId?: string;
  fromDate: string;
  toDate?: string;
  session?: string;
  reason: string;
  description: string;
  attachmentUrl?: string;
}

export interface ReviewLeavePayload {
  status: 'APPROVED' | 'REJECTED';
  reviewNote?: string;
}
