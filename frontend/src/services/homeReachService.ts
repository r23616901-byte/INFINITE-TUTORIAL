import api from './api';
import {
  HomeReachRecord,
  HomeReachConfig,
  RecordDeparturePayload,
  ConfirmReachedHomePayload,
  UpdateHomeReachConfigPayload,
  HomeReachFilters,
} from '../types/homeReach';

export const homeReachService = {
  // Get all records with optional filters (Admin / Teacher / Parent)
  getRecords: async (filters: HomeReachFilters = {}): Promise<HomeReachRecord[]> => {
    const params = new URLSearchParams();
    if (filters.batchId && filters.batchId !== 'ALL') params.append('batchId', filters.batchId);
    if (filters.studentId) params.append('studentId', filters.studentId);
    if (filters.date) params.append('date', filters.date);
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.session) params.append('session', filters.session);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get<{ success: boolean; data: HomeReachRecord[] }>(
      `/home-reach/records?${params.toString()}`
    );
    return response.data.data;
  },

  // Get parent's linked child summary
  getParentChildSummary: async (): Promise<HomeReachRecord[]> => {
    const response = await api.get<{ success: boolean; data: HomeReachRecord[] }>(
      '/home-reach/parent/summary'
    );
    return response.data.data;
  },

  // Record class ended / student departure (Teacher / Admin)
  recordClassEnded: async (payload: RecordDeparturePayload): Promise<HomeReachRecord[]> => {
    const response = await api.post<{ success: boolean; data: HomeReachRecord[]; message: string }>(
      '/home-reach/departures',
      payload
    );
    return response.data.data;
  },

  // Confirm student reached home (Parent / Student / Staff)
  confirmReachedHome: async (payload: ConfirmReachedHomePayload): Promise<HomeReachRecord> => {
    const response = await api.post<{ success: boolean; data: HomeReachRecord; message: string }>(
      '/home-reach/confirm-arrival',
      payload
    );
    return response.data.data;
  },

  // Get admin system configuration
  getConfig: async (): Promise<HomeReachConfig> => {
    const response = await api.get<{ success: boolean; data: HomeReachConfig }>(
      '/home-reach/config'
    );
    return response.data.data;
  },

  // Update admin system configuration
  updateConfig: async (payload: UpdateHomeReachConfigPayload): Promise<HomeReachConfig> => {
    const response = await api.patch<{ success: boolean; data: HomeReachConfig; message: string }>(
      '/home-reach/config',
      payload
    );
    return response.data.data;
  },
};

export default homeReachService;
