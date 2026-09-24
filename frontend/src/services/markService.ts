import api from './api';
import {
  StudentMark,
  MarkAuditLog,
  CreateMarkPayload,
  UpdateMarkPayload,
  MarkFilters,
} from '../types/mark';

export const markService = {
  // Get all marks (role-filtered by backend)
  getMarks: async (filters: MarkFilters = {}): Promise<StudentMark[]> => {
    const params = new URLSearchParams();
    if (filters.studentId) params.append('studentId', filters.studentId);
    if (filters.testId && filters.testId !== 'ALL') params.append('testId', filters.testId);
    if (filters.subjectName && filters.subjectName !== 'ALL') params.append('subjectName', filters.subjectName);
    if (filters.isPublished !== undefined) params.append('isPublished', String(filters.isPublished));
    if (filters.search) params.append('search', filters.search);

    const response = await api.get<{ success: boolean; data: StudentMark[] }>(
      `/marks?${params.toString()}`
    );
    return response.data.data;
  },

  // Get single mark by ID
  getMarkById: async (id: string): Promise<StudentMark> => {
    const response = await api.get<{ success: boolean; data: StudentMark }>(
      `/marks/${id}`
    );
    return response.data.data;
  },

  // Workflow 19: Create new mark entry (Teacher / Admin)
  createMark: async (payload: CreateMarkPayload): Promise<StudentMark> => {
    const response = await api.post<{ success: boolean; data: StudentMark; message: string }>(
      '/marks',
      payload
    );
    return response.data.data;
  },

  // Workflow 20: Edit marks with mandatory audit reason (Teacher / Admin)
  updateMark: async (id: string, payload: UpdateMarkPayload): Promise<StudentMark> => {
    const response = await api.put<{ success: boolean; data: StudentMark; message: string }>(
      `/marks/${id}`,
      payload
    );
    return response.data.data;
  },

  // Workflow 18: Upload scanned answer sheet file
  uploadAnswerSheet: async (
    file: File
  ): Promise<{ fileUrl: string; fileName: string; fileSize: number; mimeType: string; isCloudinary: boolean }> => {
    const formData = new FormData();
    formData.append('answerSheet', file);

    const response = await api.post<{
      success: boolean;
      data: { fileUrl: string; fileName: string; fileSize: number; mimeType: string; isCloudinary: boolean };
      message: string;
    }>('/marks/upload-answer-sheet', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  // Get audit trail for a mark
  getAuditTrail: async (id: string): Promise<MarkAuditLog[]> => {
    const response = await api.get<{ success: boolean; data: MarkAuditLog[] }>(
      `/marks/${id}/audit-trail`
    );
    return response.data.data;
  },

  // Toggle visibility to parents/students
  toggleVisibility: async (id: string, isPublished: boolean): Promise<StudentMark> => {
    const response = await api.patch<{ success: boolean; data: StudentMark; message: string }>(
      `/marks/${id}/visibility`,
      { isPublished }
    );
    return response.data.data;
  },
};

export default markService;
