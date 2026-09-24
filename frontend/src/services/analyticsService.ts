import api from './api';
import { StudentOverallPerformance } from '../types/analytics';

export const getStudentAnalytics = async (studentId: string): Promise<StudentOverallPerformance> => {
  const response = await api.get(`/analytics/student/${studentId}`);
  return response.data.data;
};

export const getMyChildAnalytics = async (): Promise<StudentOverallPerformance> => {
  const response = await api.get('/analytics/me');
  return response.data.data;
};

export default {
  getStudentAnalytics,
  getMyChildAnalytics,
};
