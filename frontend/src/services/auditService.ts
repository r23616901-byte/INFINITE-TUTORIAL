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

/**
 * Fetch filtered audit logs
 */
export const fetchAuditLogs = async (
  filters?: AuditLogFilter
): Promise<AuditLogResponse> => {
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
  return res.data.data;
};

/**
 * Fetch single audit log by ID
 */
export const fetchAuditLogById = async (id: string): Promise<AuditLogEntry> => {
  const res = await api.get<{ success: boolean; data: AuditLogEntry }>(`/audit-logs/${id}`);
  return res.data.data;
};

/**
 * Download Audit Logs CSV
 */
export const downloadAuditLogsCsv = async (filters?: AuditLogFilter): Promise<void> => {
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
};
