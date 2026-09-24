import api from './api';
import { ApiResponse } from '../types';
import { LeaveRequest, CreateLeavePayload, ReviewLeavePayload, LeaveStatus } from '../types/leave';

export const submitLeaveRequestApi = async (payload: CreateLeavePayload): Promise<LeaveRequest> => {
  const res = await api.post<ApiResponse<LeaveRequest>>('/leaves', payload);
  return res.data.data as LeaveRequest;
};

export const getLeaveRequestsApi = async (filters: {
  status?: LeaveStatus;
  search?: string;
  studentId?: string;
} = {}): Promise<LeaveRequest[]> => {
  const res = await api.get<ApiResponse<LeaveRequest[]>>('/leaves', { params: filters });
  return res.data.data || [];
};

export const reviewLeaveRequestApi = async (
  leaveId: string,
  payload: ReviewLeavePayload
): Promise<LeaveRequest> => {
  const res = await api.put<ApiResponse<LeaveRequest>>(`/leaves/${leaveId}/review`, payload);
  return res.data.data as LeaveRequest;
};
