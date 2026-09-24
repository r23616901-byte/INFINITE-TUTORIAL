import api from './api';
import { ApiResponse } from '../types';
import { ClassItem, BoardItem, SubjectItem, BatchItem } from '../types/attendance';

export const getClassesApi = async (): Promise<ClassItem[]> => {
  const res = await api.get<ApiResponse<ClassItem[]>>('/academics/classes');
  return res.data.data || [];
};

export const addClassApi = async (data: { name: string; grade: number; description?: string }): Promise<ClassItem> => {
  const res = await api.post<ApiResponse<ClassItem>>('/academics/classes', data);
  return res.data.data as ClassItem;
};

export const getBoardsApi = async (): Promise<BoardItem[]> => {
  const res = await api.get<ApiResponse<BoardItem[]>>('/academics/boards');
  return res.data.data || [];
};

export const addBoardApi = async (data: { name: string; code: string }): Promise<BoardItem> => {
  const res = await api.post<ApiResponse<BoardItem>>('/academics/boards', data);
  return res.data.data as BoardItem;
};

export const getSubjectsApi = async (boardId?: string): Promise<SubjectItem[]> => {
  const res = await api.get<ApiResponse<SubjectItem[]>>('/academics/subjects', {
    params: boardId ? { boardId } : {},
  });
  return res.data.data || [];
};

export const addSubjectApi = async (data: { name: string; code: string; boardId?: string }): Promise<SubjectItem> => {
  const res = await api.post<ApiResponse<SubjectItem>>('/academics/subjects', data);
  return res.data.data as SubjectItem;
};

export const getBatchesApi = async (filters: { classId?: string; boardId?: string; session?: string } = {}): Promise<BatchItem[]> => {
  const res = await api.get<ApiResponse<BatchItem[]>>('/academics/batches', { params: filters });
  return res.data.data || [];
};

export const createBatchApi = async (data: {
  name: string;
  timing?: string;
  session?: string;
  startTime?: string;
  endTime?: string;
  days?: string;
  status?: string;
  classId: string;
  boardId: string;
  academicYear?: string;
  assignedTeacherName?: string;
}): Promise<BatchItem> => {
  const res = await api.post<ApiResponse<BatchItem>>('/academics/batches', data);
  return res.data.data as BatchItem;
};
