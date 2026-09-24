import api from './api';
import { ApiResponse } from '../types';
import {
  AttendanceSession,
  AttendanceStatus,
  BatchAttendanceDetails,
  StudentAttendanceStats,
  AttendanceRecord,
} from '../types/attendance';

export const fetchBatchAttendance = async (
  batchId: string,
  date: string,
  session: AttendanceSession
): Promise<BatchAttendanceDetails> => {
  const res = await api.get<ApiResponse<BatchAttendanceDetails>>('/attendance/batch', {
    params: { batchId, date, session },
  });
  return res.data.data as BatchAttendanceDetails;
};

export const saveBatchAttendance = async (payload: {
  date: string;
  session: AttendanceSession;
  batchId: string;
  records: Array<{
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
  }>;
}): Promise<{ success: boolean; message: string }> => {
  const res = await api.post<ApiResponse<{ success: boolean; message: string }>>('/attendance/batch', payload);
  return {
    success: res.data.success,
    message: res.data.message || 'Attendance saved successfully',
  };
};

export const fetchStudentAttendanceStats = async (studentId: string): Promise<StudentAttendanceStats> => {
  const res = await api.get<ApiResponse<StudentAttendanceStats>>(`/attendance/student/${studentId}`);
  return res.data.data as StudentAttendanceStats;
};

export const fetchParentAttendanceSummary = async (): Promise<StudentAttendanceStats> => {
  const res = await api.get<ApiResponse<StudentAttendanceStats>>('/attendance/parent');
  return res.data.data as StudentAttendanceStats;
};

export const correctAttendanceRecord = async (
  id: string,
  status: AttendanceStatus,
  remarks: string
): Promise<AttendanceRecord> => {
  const res = await api.put<ApiResponse<AttendanceRecord>>(`/attendance/${id}`, { status, remarks });
  return res.data.data as AttendanceRecord;
};

export const fetchAttendanceOverviewStats = async () => {
  const res = await api.get<ApiResponse<any>>('/attendance/stats');
  return res.data.data;
};
