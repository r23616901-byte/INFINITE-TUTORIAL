import api from './api';
import { ApiResponse } from '../types';
import {
  TestItem,
  TestType,
  CreateTestPayload,
  UpdateTestPayload,
  TestFilters,
  UploadedTestPaperResponse,
} from '../types/test';

export const getTestsApi = async (filters: TestFilters = {}): Promise<TestItem[]> => {
  const res = await api.get<ApiResponse<TestItem[]>>('/tests', { params: filters });
  return res.data.data || [];
};

export const getTestByIdApi = async (id: string): Promise<TestItem> => {
  const res = await api.get<ApiResponse<TestItem>>(`/tests/${id}`);
  return res.data.data as TestItem;
};

export const createTestApi = async (payload: CreateTestPayload): Promise<TestItem> => {
  const res = await api.post<ApiResponse<TestItem>>('/tests', payload);
  return res.data.data as TestItem;
};

export const updateTestApi = async (id: string, payload: UpdateTestPayload): Promise<TestItem> => {
  const res = await api.put<ApiResponse<TestItem>>(`/tests/${id}`, payload);
  return res.data.data as TestItem;
};

export const deleteTestApi = async (id: string): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete<{ success: boolean; message: string }>(`/tests/${id}`);
  return res.data;
};

export const uploadTestPaperApi = async (file: File): Promise<UploadedTestPaperResponse> => {
  const formData = new FormData();
  formData.append('testPaper', file);

  const res = await api.post<ApiResponse<UploadedTestPaperResponse>>('/tests/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data as UploadedTestPaperResponse;
};

export const getTestTypesApi = async (): Promise<TestType[]> => {
  const res = await api.get<ApiResponse<TestType[]>>('/tests/types');
  return res.data.data || [];
};

export const addTestTypeApi = async (name: string): Promise<TestType> => {
  const res = await api.post<ApiResponse<TestType>>('/tests/types', { name });
  return res.data.data as TestType;
};

export const deleteTestTypeApi = async (id: string): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete<{ success: boolean; message: string }>(`/tests/types/${id}`);
  return res.data;
};
