import api from './api';

export type RoleType = 'ADMIN' | 'TEACHER' | 'PARENT' | 'SYSTEM';

export type AuditActionType =
  | 'STUDENT_PROFILE_EDIT'
  | 'STUDENT_CREATE'
  | 'STUDENT_DELETE'
  | 'MARKS_ENTRY'
  | 'MARKS_EDIT'
  | 'BATCH_CHANGE'
  | 'PASSWORD_RESET'
  | 'PASSWORD_CHANGE'
  | 'ANSWER_SHEET_UPLOAD'
  | 'TEST_PAPER_UPLOAD'
  | 'FILE_UPLOAD'
  | 'FILE_DELETE'
  | 'LEAVE_APPROVAL'
  | 'LEAVE_REJECT'
  | 'ATTENDANCE_RECORD'
  | 'ATTENDANCE_CORRECTION';

export type AuditEntityType =
  | 'Student'
  | 'Mark'
  | 'Batch'
  | 'User'
  | 'AnswerSheet'
  | 'TestPaper'
  | 'LeaveRequest'
  | 'Attendance'
  | 'File';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: RoleType;
  action: AuditActionType;
  actionLabel: string;
  entity: AuditEntityType;
  entityId: string;
  entityName?: string;
  oldValue: Record<string, any> | null;
  newValue: Record<string, any> | null;
  reason?: string;
  ipAddress: string;
  device?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AuditLogFilter {
  entity?: string;
  action?: string;
  userId?: string;
  userRole?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogResponse {
  logs: AuditLogEntry[];
  total: number;
}

const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    userId: 'usr-teacher-01',
    userName: 'Mrs. Priya Sundaram',
    userRole: 'TEACHER',
    action: 'ATTENDANCE_RECORD',
    actionLabel: 'Marked Batch Attendance',
    entity: 'Attendance',
    entityId: 'batch-10a-morning',
    entityName: 'Batch 10A Morning (CBSE 10th)',
    oldValue: null,
    newValue: { session: 'MORNING', present: 38, absent: 4, date: '2026-09-24' },
    reason: 'Daily routine morning roll call',
    ipAddress: '192.168.1.45',
    device: 'Chrome / Windows 11',
    timestamp: '2026-09-24T08:35:00.000Z',
  },
  {
    id: 'aud-002',
    userId: 'usr-teacher-01',
    userName: 'Mrs. Priya Sundaram',
    userRole: 'TEACHER',
    action: 'LEAVE_APPROVAL',
    actionLabel: 'Sanctioned Student Leave',
    entity: 'LeaveRequest',
    entityId: 'lve-10012-01',
    entityName: 'Ananya Sharma (IT10012)',
    oldValue: { status: 'PENDING' },
    newValue: { status: 'APPROVED', reviewNote: 'Sanctioned. Collect notes upon returning.' },
    reason: 'Family wedding out of station',
    ipAddress: '192.168.1.45',
    device: 'Chrome / Windows 11',
    timestamp: '2026-09-21T11:20:00.000Z',
  },
  {
    id: 'aud-003',
    userId: 'usr-teacher-02',
    userName: 'Dr. Vikram Rao',
    userRole: 'TEACHER',
    action: 'MARKS_ENTRY',
    actionLabel: 'Entered Biology Test Marks',
    entity: 'Mark',
    entityId: 'tst-cbse10-bio-001',
    entityName: 'Test 1: Life Processes Diagnostic Assessment',
    oldValue: null,
    newValue: { totalEvaluated: 42, highestMark: 48, classAverage: 39.4 },
    reason: 'Internal term evaluation',
    ipAddress: '192.168.1.52',
    device: 'Firefox / macOS',
    timestamp: '2026-09-19T14:15:00.000Z',
  },
  {
    id: 'aud-004',
    userId: 'usr-teacher-01',
    userName: 'Mrs. Priya Sundaram',
    userRole: 'TEACHER',
    action: 'TEST_PAPER_UPLOAD',
    actionLabel: 'Uploaded Question Paper PDF',
    entity: 'TestPaper',
    entityId: 'tst-cbse10-phy-003',
    entityName: 'Chapter 3 Test (Light Reflection & Refraction)',
    oldValue: null,
    newValue: { fileName: 'CBSE_Class10_Physics_LightRefraction.pdf', fileSize: '685 KB' },
    reason: 'Scheduled diagnostic test question paper',
    ipAddress: '192.168.1.45',
    device: 'Chrome / Windows 11',
    timestamp: '2026-09-18T16:00:00.000Z',
  },
  {
    id: 'aud-005',
    userId: 'usr-admin-01',
    userName: 'Dr. Ramesh Sharma',
    userRole: 'ADMIN',
    action: 'PASSWORD_RESET',
    actionLabel: 'Reset Student Credentials',
    entity: 'User',
    entityId: 'usr-parent-01',
    entityName: 'Rahul Kumar (IT10025)',
    oldValue: null,
    newValue: { tempPinIssued: true, parentPhoneNotified: '6361085188' },
    reason: 'Parent forgotten password phone verification',
    ipAddress: '192.168.1.10',
    device: 'Edge / Windows Server',
    timestamp: '2026-09-17T09:40:00.000Z',
  },
  {
    id: 'aud-006',
    userId: 'usr-teacher-01',
    userName: 'Mrs. Priya Sundaram',
    userRole: 'TEACHER',
    action: 'MARKS_EDIT',
    actionLabel: 'Updated Marks Post-Recheck',
    entity: 'Mark',
    entityId: 'mrk-cbse10-phy-003',
    entityName: 'Rahul Kumar - Physics Chapter 3 Test',
    oldValue: { marksObtained: 40, percentage: 80.0 },
    newValue: { marksObtained: 42, percentage: 84.0, remarks: 'Re-evaluated Question 4 step marking' },
    reason: 'Parent request during consultation',
    ipAddress: '192.168.1.45',
    device: 'Chrome / Windows 11',
    timestamp: '2026-09-16T17:30:00.000Z',
  },
  {
    id: 'aud-007',
    userId: 'usr-admin-01',
    userName: 'Dr. Ramesh Sharma',
    userRole: 'ADMIN',
    action: 'BATCH_CHANGE',
    actionLabel: 'Transferred Student Batch',
    entity: 'Batch',
    entityId: 'batch-10a-morning',
    entityName: 'Rohan Patel (IT10034)',
    oldValue: { batchId: 'batch-10a-evening', name: 'Batch 10A Evening' },
    newValue: { batchId: 'batch-10a-morning', name: 'Batch 10A Morning' },
    reason: 'School timing schedule conflict resolved',
    ipAddress: '192.168.1.10',
    device: 'Edge / Windows Server',
    timestamp: '2026-09-14T12:00:00.000Z',
  },
  {
    id: 'aud-008',
    userId: 'usr-admin-01',
    userName: 'Dr. Ramesh Sharma',
    userRole: 'ADMIN',
    action: 'STUDENT_PROFILE_EDIT',
    actionLabel: 'Verified Parent Phone Contact',
    entity: 'Student',
    entityId: 'stu-10025',
    entityName: 'Rahul Kumar (IT10025)',
    oldValue: { parentPhone: '6361085180' },
    newValue: { parentPhone: '6361085188' },
    reason: 'Parent submitted contact correction form',
    ipAddress: '192.168.1.10',
    device: 'Edge / Windows Server',
    timestamp: '2026-09-10T10:15:00.000Z',
  },
];

/**
 * Fetch filtered audit logs
 */
export const fetchAuditLogs = async (
  filters?: AuditLogFilter
): Promise<AuditLogResponse> => {
  try {
    const params = new URLSearchParams();
    if (filters?.entity && filters.entity !== 'ALL') params.append('entity', filters.entity);
    if (filters?.action && filters.action !== 'ALL') params.append('action', filters.action);
    if (filters?.userRole && filters.userRole !== 'ALL') params.append('userRole', filters.userRole);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const res = await api.get<{ success: boolean; data: AuditLogResponse }>(
      `/audit-logs?${params.toString()}`
    );
    if (res.data && res.data.success && res.data.data && Array.isArray(res.data.data.logs) && res.data.data.logs.length > 0) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }

  let logs = [...SEED_AUDIT_LOGS];
  if (filters?.entity && filters.entity !== 'ALL') {
    logs = logs.filter((l) => l.entity === filters.entity);
  }
  if (filters?.action && filters.action !== 'ALL') {
    logs = logs.filter((l) => l.action === filters.action);
  }
  if (filters?.userRole && filters.userRole !== 'ALL') {
    logs = logs.filter((l) => l.userRole === filters.userRole);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    logs = logs.filter(
      (l) =>
        l.userName.toLowerCase().includes(q) ||
        l.actionLabel.toLowerCase().includes(q) ||
        (l.entityName && l.entityName.toLowerCase().includes(q)) ||
        (l.reason && l.reason.toLowerCase().includes(q))
    );
  }

  return {
    logs,
    total: logs.length,
  };
};

/**
 * Fetch single audit log by ID
 */
export const fetchAuditLogById = async (id: string): Promise<AuditLogEntry> => {
  try {
    const res = await api.get<{ success: boolean; data: AuditLogEntry }>(`/audit-logs/${id}`);
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
  } catch {
    // Fallback
  }
  const found = SEED_AUDIT_LOGS.find((l) => l.id === id);
  return found || SEED_AUDIT_LOGS[0];
};

/**
 * Download Audit Logs CSV
 */
export const downloadAuditLogsCsv = async (filters?: AuditLogFilter): Promise<void> => {
  try {
    const params = new URLSearchParams();
    if (filters?.entity && filters.entity !== 'ALL') params.append('entity', filters.entity);
    if (filters?.action && filters.action !== 'ALL') params.append('action', filters.action);
    if (filters?.userRole && filters.userRole !== 'ALL') params.append('userRole', filters.userRole);
    if (filters?.search) params.append('search', filters.search);

    const res = await api.get(`/audit-logs/export?${params.toString()}`, {
      responseType: 'blob',
    });

    const blob = new Blob([res.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `infinite_tutorial_audit_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return;
  } catch {
    // Fallback CSV generation in browser
    const header = 'Timestamp,User,Role,Action,Entity,Target,Reason,IP Address\n';
    const rows = SEED_AUDIT_LOGS.map(
      (l) =>
        `"${l.timestamp}","${l.userName}","${l.userRole}","${l.actionLabel}","${l.entity}","${l.entityName || ''}","${l.reason || ''}","${l.ipAddress}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `infinite_tutorial_audit_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
