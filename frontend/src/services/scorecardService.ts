import api from './api';
import { StudentScorecard } from '../types/scorecard';

export const scorecardService = {
  // Get scorecard for a specific student (Teacher / Admin)
  getStudentScorecard: async (studentId: string): Promise<StudentScorecard> => {
    const response = await api.get<{ success: boolean; data: StudentScorecard }>(
      `/scorecards/student/${studentId}`
    );
    return response.data.data;
  },

  // Get scorecard for the logged-in parent's child
  getMyChildScorecard: async (): Promise<StudentScorecard> => {
    const response = await api.get<{ success: boolean; data: StudentScorecard }>(
      '/scorecards/me'
    );
    return response.data.data;
  },
};

export default scorecardService;
