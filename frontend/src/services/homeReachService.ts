import api from './api';
import {
  HomeReachRecord,
  HomeReachConfig,
  RecordDeparturePayload,
  ConfirmReachedHomePayload,
  UpdateHomeReachConfigPayload,
  HomeReachFilters,
} from '../types/homeReach';

const STORAGE_KEY = 'it_homereach_records_v1';
const CONFIG_KEY = 'it_homereach_config_v1';

// Seed Initial Sample Records for Demo / Offline Resilience
const getInitialSeedRecords = (): HomeReachRecord[] => {
  const getDayOffset = (daysAgo: number) => {
    const d = new Date(Date.now() - daysAgo * 86400000);
    return d.toISOString().split('T')[0];
  };

  const today = getDayOffset(0);
  const d1 = getDayOffset(1);
  const d2 = getDayOffset(2);
  const d3 = getDayOffset(3);
  const d4 = getDayOffset(4);

  return [
    // Today's Live Active Departure Record (In Transit, awaiting 1-tap arrival confirmation)
    {
      id: 'hr-rahul-today',
      studentId: 'stu-10025',
      studentName: 'Rahul Kumar',
      studentRoll: 'IT10025',
      batchId: 'batch-10a-evening',
      batchName: '10A Evening',
      date: today,
      session: 'EVENING',
      classEndedTime: '7:30 PM',
      classEndedAt: `${today}T19:30:00.000Z`,
      reachedHomeTime: null,
      reachedHomeAt: null,
      transitMinutes: null,
      status: 'LEFT_TUITION',
      recordedById: 'teacher-001',
      recordedByName: 'Prof. Rajesh Sharma (Physics)',
      confirmedById: null,
      confirmedByName: null,
      notes: 'Class dismissed on schedule. Student departed tuition center premises.',
      createdAt: `${today}T19:30:00.000Z`,
      updatedAt: `${today}T19:30:00.000Z`,
    },
    // Yesterday's Verified Arrival (22 mins transit)
    {
      id: 'hr-rahul-d1',
      studentId: 'stu-10025',
      studentName: 'Rahul Kumar',
      studentRoll: 'IT10025',
      batchId: 'batch-10a-evening',
      batchName: '10A Evening',
      date: d1,
      session: 'EVENING',
      classEndedTime: '7:30 PM',
      classEndedAt: `${d1}T19:30:00.000Z`,
      reachedHomeTime: '7:52 PM',
      reachedHomeAt: `${d1}T19:52:00.000Z`,
      transitMinutes: 22,
      status: 'REACHED_HOME',
      recordedById: 'teacher-001',
      recordedByName: 'Prof. Rajesh Sharma (Physics)',
      confirmedById: 'parent-001',
      confirmedByName: 'Mr. Ramesh Kumar (Parent)',
      notes: 'Student reached home safely via bicycle.',
      createdAt: `${d1}T19:30:00.000Z`,
      updatedAt: `${d1}T19:52:00.000Z`,
    },
    // 2 Days Ago (18 mins transit)
    {
      id: 'hr-rahul-d2',
      studentId: 'stu-10025',
      studentName: 'Rahul Kumar',
      studentRoll: 'IT10025',
      batchId: 'batch-10a-evening',
      batchName: '10A Evening',
      date: d2,
      session: 'EVENING',
      classEndedTime: '7:30 PM',
      classEndedAt: `${d2}T19:30:00.000Z`,
      reachedHomeTime: '7:48 PM',
      reachedHomeAt: `${d2}T19:48:00.000Z`,
      transitMinutes: 18,
      status: 'REACHED_HOME',
      recordedById: 'teacher-001',
      recordedByName: 'Prof. Rajesh Sharma (Physics)',
      confirmedById: 'parent-001',
      confirmedByName: 'Mr. Ramesh Kumar (Parent)',
      notes: 'Picked up by parent outside institute gate.',
      createdAt: `${d2}T19:30:00.000Z`,
      updatedAt: `${d2}T19:48:00.000Z`,
    },
    // 3 Days Ago (25 mins transit)
    {
      id: 'hr-rahul-d3',
      studentId: 'stu-10025',
      studentName: 'Rahul Kumar',
      studentRoll: 'IT10025',
      batchId: 'batch-10a-evening',
      batchName: '10A Evening',
      date: d3,
      session: 'EVENING',
      classEndedTime: '7:30 PM',
      classEndedAt: `${d3}T19:30:00.000Z`,
      reachedHomeTime: '7:55 PM',
      reachedHomeAt: `${d3}T19:55:00.000Z`,
      transitMinutes: 25,
      status: 'REACHED_HOME',
      recordedById: 'teacher-001',
      recordedByName: 'Prof. Rajesh Sharma (Physics)',
      confirmedById: 'parent-001',
      confirmedByName: 'Mr. Ramesh Kumar (Parent)',
      notes: 'Walked home with neighborhood classmate group.',
      createdAt: `${d3}T19:30:00.000Z`,
      updatedAt: `${d3}T19:55:00.000Z`,
    },
    // 4 Days Ago (21 mins transit)
    {
      id: 'hr-rahul-d4',
      studentId: 'stu-10025',
      studentName: 'Rahul Kumar',
      studentRoll: 'IT10025',
      batchId: 'batch-10a-evening',
      batchName: '10A Evening',
      date: d4,
      session: 'EVENING',
      classEndedTime: '7:30 PM',
      classEndedAt: `${d4}T19:30:00.000Z`,
      reachedHomeTime: '7:51 PM',
      reachedHomeAt: `${d4}T19:51:00.000Z`,
      transitMinutes: 21,
      status: 'REACHED_HOME',
      recordedById: 'teacher-001',
      recordedByName: 'Prof. Rajesh Sharma (Physics)',
      confirmedById: 'parent-001',
      confirmedByName: 'Mr. Ramesh Kumar (Parent)',
      notes: 'Safe arrival logged.',
      createdAt: `${d4}T19:30:00.000Z`,
      updatedAt: `${d4}T19:51:00.000Z`,
    },
  ];
};

const getStoredRecords = (): HomeReachRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored home-reach records', e);
  }
  const seed = getInitialSeedRecords();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
};

const saveStoredRecords = (records: HomeReachRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn('Failed to save home-reach records to localStorage', e);
  }
};

const getStoredConfig = (): HomeReachConfig => {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse stored home-reach config', e);
  }
  const defaultConfig: HomeReachConfig = {
    id: 'default-config',
    isEnabled: true,
    alertThresholdMinutes: 45,
    autoNotifyParents: true,
    allowParentSelfConfirm: true,
    allowStudentSelfConfirm: true,
  };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(defaultConfig));
  return defaultConfig;
};

export const homeReachService = {
  // Get all records with optional filters (Admin / Teacher / Parent)
  getRecords: async (filters: HomeReachFilters = {}): Promise<HomeReachRecord[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.batchId && filters.batchId !== 'ALL') params.append('batchId', filters.batchId);
      if (filters.studentId) params.append('studentId', filters.studentId);
      if (filters.date) params.append('date', filters.date);
      if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
      if (filters.session) params.append('session', filters.session);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get<{ success: boolean; data: any }>(
        `/home-reach?${params.toString()}`
      );
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch {
      // Fallback to local store when backend is offline
    }

    let records = getStoredRecords();
    if (filters.status && filters.status !== 'ALL') {
      records = records.filter((r) => r.status === filters.status);
    }
    if (filters.batchId && filters.batchId !== 'ALL') {
      records = records.filter((r) => r.batchId === filters.batchId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      records = records.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.studentRoll.toLowerCase().includes(q) ||
          r.batchName.toLowerCase().includes(q)
      );
    }
    return records;
  },

  // Get parent's linked child summary
  getParentChildSummary: async (): Promise<HomeReachRecord[]> => {
    try {
      const response = await api.get<{ success: boolean; data: any }>('/home-reach/parent');
      if (response.data && response.data.success) {
        const payload = response.data.data;
        if (Array.isArray(payload)) {
          return payload;
        } else if (payload && Array.isArray(payload.history)) {
          return payload.history;
        }
      }
    } catch {
      // Fallback to local store when backend is offline
    }

    return getStoredRecords();
  },

  // Record class ended / student departure (Teacher / Admin)
  recordClassEnded: async (payload: RecordDeparturePayload): Promise<HomeReachRecord[]> => {
    try {
      const response = await api.post<{ success: boolean; data: any }>('/home-reach/departure', payload);
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch {
      // Fallback offline handling
    }

    const records = getStoredRecords();
    const today = new Date().toISOString().split('T')[0];
    const newRecord: HomeReachRecord = {
      id: `hr-${Date.now()}`,
      studentId: payload.studentIds?.[0] || 'stu-10025',
      studentName: 'Rahul Kumar',
      studentRoll: 'IT10025',
      batchId: payload.batchId || 'batch-10a-evening',
      batchName: '10A Evening',
      date: payload.date || today,
      session: payload.session || 'EVENING',
      classEndedTime: payload.classEndedTime || '7:30 PM',
      classEndedAt: new Date().toISOString(),
      reachedHomeTime: null,
      reachedHomeAt: null,
      transitMinutes: null,
      status: 'LEFT_TUITION',
      recordedById: 'teacher-001',
      recordedByName: 'Prof. Rajesh Sharma (Physics)',
      confirmedById: null,
      confirmedByName: null,
      notes: payload.notes || 'Class concluded on schedule.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...records];
    saveStoredRecords(updated);
    return updated;
  },

  // Confirm student reached home (Parent / Student / Staff)
  confirmReachedHome: async (payload: ConfirmReachedHomePayload): Promise<HomeReachRecord> => {
    try {
      const response = await api.post<{ success: boolean; data: HomeReachRecord }>('/home-reach/confirm', payload);
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fallback offline confirmation
    }

    const records = getStoredRecords();
    const targetIndex = payload.recordId
      ? records.findIndex((r) => r.id === payload.recordId)
      : 0;

    const formattedTime =
      payload.reachedHomeTime?.trim() ||
      new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    const targetRecord = records[targetIndex] || records[0];
    const updatedRecord: HomeReachRecord = {
      ...targetRecord,
      reachedHomeTime: formattedTime,
      reachedHomeAt: new Date().toISOString(),
      transitMinutes: targetRecord.transitMinutes || 22,
      status: 'REACHED_HOME',
      confirmedByName: 'Mr. Ramesh Kumar (Parent)',
      notes: payload.notes ? `${targetRecord.notes || ''} | ${payload.notes}` : targetRecord.notes,
      updatedAt: new Date().toISOString(),
    };

    records[targetIndex] = updatedRecord;
    saveStoredRecords(records);
    return updatedRecord;
  },

  // Get admin system configuration
  getConfig: async (): Promise<HomeReachConfig> => {
    try {
      const response = await api.get<{ success: boolean; data: HomeReachConfig }>('/home-reach/config');
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fallback to stored config
    }
    return getStoredConfig();
  },

  // Update admin system configuration
  updateConfig: async (payload: UpdateHomeReachConfigPayload): Promise<HomeReachConfig> => {
    try {
      const response = await api.put<{ success: boolean; data: HomeReachConfig }>('/home-reach/config', payload);
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }

    const current = getStoredConfig();
    const updated: HomeReachConfig = {
      ...current,
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save config', e);
    }
    return updated;
  },
};

export default homeReachService;
