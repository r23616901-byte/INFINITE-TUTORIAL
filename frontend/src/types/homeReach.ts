export type HomeReachStatus = 'IN_CLASS' | 'LEFT_TUITION' | 'REACHED_HOME' | 'DELAYED';

export interface HomeReachRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  batchId: string;
  batchName: string;
  date: string; // YYYY-MM-DD
  session: string; // 'EVENING' | 'MORNING'
  classEndedTime: string; // e.g. "7:30 PM"
  classEndedAt: string;
  reachedHomeTime?: string | null; // e.g. "7:52 PM"
  reachedHomeAt?: string | null;
  transitMinutes?: number | null; // e.g. 22
  status: HomeReachStatus;
  recordedById?: string | null;
  recordedByName?: string | null;
  confirmedById?: string | null;
  confirmedByName?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HomeReachConfig {
  id: string;
  isEnabled: boolean;
  alertThresholdMinutes: number; // default 45 mins
  autoNotifyParents: boolean;
  allowParentSelfConfirm: boolean;
  allowStudentSelfConfirm: boolean;
  updatedAt?: string;
}

export interface RecordDeparturePayload {
  batchId: string;
  studentIds?: string[];
  date?: string;
  session?: string;
  classEndedTime?: string;
  notes?: string;
}

export interface ConfirmReachedHomePayload {
  recordId?: string;
  studentId?: string;
  reachedHomeTime?: string;
  notes?: string;
}

export interface UpdateHomeReachConfigPayload {
  isEnabled?: boolean;
  alertThresholdMinutes?: number;
  autoNotifyParents?: boolean;
  allowParentSelfConfirm?: boolean;
  allowStudentSelfConfirm?: boolean;
}

export interface HomeReachFilters {
  batchId?: string;
  studentId?: string;
  date?: string;
  status?: HomeReachStatus | 'ALL';
  session?: string;
  search?: string;
}
