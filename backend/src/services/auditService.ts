import fs from 'fs';
import path from 'path';
import { AuditLogEntry, AuditLogFilter, RoleType, AuditActionType, AuditEntityType } from '../types';

const AUDIT_DIR = path.resolve(__dirname, '../../uploads/audit-logs');
const AUDIT_FILE = path.join(AUDIT_DIR, 'audit_registry.json');

// Ensure audit log storage directory exists
if (!fs.existsSync(AUDIT_DIR)) {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

/**
 * Utility to parse human-readable device & browser info from User-Agent string
 */
export const parseDeviceFromUserAgent = (userAgent?: string): string => {
  if (!userAgent) return 'Web Browser (Standard)';
  
  let browser = 'Unknown Browser';
  if (userAgent.includes('Edg/')) browser = 'Edge';
  else if (userAgent.includes('Chrome/')) browser = 'Chrome';
  else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) browser = 'Safari';
  else if (userAgent.includes('Firefox/')) browser = 'Firefox';

  let os = 'Unknown OS';
  if (userAgent.includes('Windows')) os = 'Windows 11';
  else if (userAgent.includes('Macintosh') || userAgent.includes('Mac OS')) os = 'macOS';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS Device';
  else if (userAgent.includes('Android')) os = 'Android Mobile';
  else if (userAgent.includes('Linux')) os = 'Linux';

  return `${browser} on ${os}`;
};

/**
 * Initial Seed Audit Records strictly mirroring Prompt Examples (Step 53 / Step 24)
 */
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-001',
    userId: 'admin-1',
    userName: 'Admin Rajesh Verma',
    userRole: 'ADMIN',
    action: 'STUDENT_PROFILE_EDIT',
    actionLabel: 'Admin edited student profile',
    entity: 'Student',
    entityId: 'std-10-001',
    entityName: 'Rahul Kumar (Class 10 CBSE)',
    oldValue: {
      parentPhone: '9876543210',
      address: '14 MG Road, Bengaluru',
      emergencyContact: 'Uncle: 9811223344',
    },
    newValue: {
      parentPhone: '9876543219',
      address: '42 Residency Road, Richmond Circle, Bengaluru',
      emergencyContact: 'Mother: 9876543219',
    },
    reason: 'Parent address update and primary contact telephone correction',
    ipAddress: '192.168.1.10',
    device: 'Chrome on Windows 11',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    timestamp: '2026-09-18T10:15:30.000Z',
  },
  {
    id: 'audit-002',
    userId: 'tch-10-001',
    userName: 'Teacher Priya Sharma',
    userRole: 'TEACHER',
    action: 'MARKS_ENTRY',
    actionLabel: 'Teacher entered marks',
    entity: 'Mark',
    entityId: 'mrk-phy-101',
    entityName: 'Physics Chapter 3 Test - Rahul Kumar',
    oldValue: null,
    newValue: {
      studentId: 'std-10-001',
      studentName: 'Rahul Kumar',
      subject: 'Physics',
      testName: 'Chapter 3 Motion Test',
      maxMarks: 50,
      marksObtained: 38,
      percentage: 76,
    },
    reason: 'Initial official test evaluation submission',
    ipAddress: '192.168.1.45',
    device: 'Firefox on macOS',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0',
    timestamp: '2026-09-18T14:20:00.000Z',
  },
  {
    id: 'audit-003',
    userId: 'tch-10-001',
    userName: 'Teacher Priya Sharma',
    userRole: 'TEACHER',
    action: 'MARKS_EDIT',
    actionLabel: 'Teacher changed marks',
    entity: 'Mark',
    entityId: 'mrk-phy-101',
    entityName: 'Physics Chapter 3 Test - Rahul Kumar',
    oldValue: {
      marksObtained: 38,
      percentage: 76,
    },
    newValue: {
      marksObtained: 42,
      percentage: 84,
    },
    reason: 'Rechecking',
    ipAddress: '192.168.1.45',
    device: 'Firefox on macOS',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0',
    timestamp: '2026-09-18T17:30:00.000Z',
  },
  {
    id: 'audit-004',
    userId: 'admin-1',
    userName: 'Admin Rajesh Verma',
    userRole: 'ADMIN',
    action: 'BATCH_CHANGE',
    actionLabel: 'Admin changed batch',
    entity: 'Batch',
    entityId: 'std-10-001',
    entityName: 'Rahul Kumar (Class 10 CBSE)',
    oldValue: {
      batchId: 'batch-10-morning',
      batchName: '10A Morning',
      schedule: '07:00 AM - 09:00 AM',
    },
    newValue: {
      batchId: 'batch-10-evening',
      batchName: '10A Evening',
      schedule: '05:30 PM - 07:30 PM',
    },
    reason: 'Parent requested batch adjustment due to school extracurricular sports schedule',
    ipAddress: '192.168.1.10',
    device: 'Chrome on Windows 11',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0 Safari/537.36',
    timestamp: '2026-09-19T09:00:00.000Z',
  },
  {
    id: 'audit-005',
    userId: 'admin-1',
    userName: 'Admin Rajesh Verma',
    userRole: 'ADMIN',
    action: 'PASSWORD_RESET',
    actionLabel: 'Admin reset password',
    entity: 'User',
    entityId: 'tch-10-002',
    entityName: 'Teacher Anita Sharma (Mathematics)',
    oldValue: {
      mustChangePassword: false,
      credentialStatus: 'ACTIVE',
    },
    newValue: {
      mustChangePassword: true,
      credentialStatus: 'TEMP_CREDENTIAL_ISSUED',
      resetMethod: 'Administrative Override',
    },
    reason: 'Faculty member forgot password after phone replacement',
    ipAddress: '192.168.1.10',
    device: 'Chrome on Windows 11',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0 Safari/537.36',
    timestamp: '2026-09-19T11:45:00.000Z',
  },
  {
    id: 'audit-006',
    userId: 'tch-10-001',
    userName: 'Teacher Priya Sharma',
    userRole: 'TEACHER',
    action: 'ANSWER_SHEET_UPLOAD',
    actionLabel: 'Teacher uploaded answer sheet',
    entity: 'AnswerSheet',
    entityId: 'ans-sheet-101',
    entityName: 'Rahul Kumar - Physics Ch3 Evaluated Sheet',
    oldValue: null,
    newValue: {
      file_name: 'rahul_kumar_physics_ch3_eval.pdf',
      file_url: '/uploads/answer-sheets/rahul_kumar_physics_ch3_eval_hq_1790178496464.pdf',
      file_size: 1450230,
      preservationTier: 'HIGH_QUALITY_PRESERVED',
      isPublicToParent: true,
    },
    reason: 'Official scanned and graded answer sheet published for parent review',
    ipAddress: '192.168.1.45',
    device: 'Firefox on macOS',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0',
    timestamp: '2026-09-19T15:10:00.000Z',
  },
  {
    id: 'audit-007',
    userId: 'admin-1',
    userName: 'Admin Rajesh Verma',
    userRole: 'ADMIN',
    action: 'LEAVE_APPROVAL',
    actionLabel: 'Admin approved leave',
    entity: 'LeaveRequest',
    entityId: 'leave-101',
    entityName: 'Rahul Kumar - Leave for 18/09/2026',
    oldValue: {
      status: 'PENDING',
      leaveDate: '2026-09-18',
      reason: 'Medical',
    },
    newValue: {
      status: 'APPROVED',
      reviewedBy: 'Admin Rajesh Verma',
      reviewedAt: '2026-09-18T08:30:00.000Z',
      adminNote: 'Medical prescription attachment verified',
    },
    reason: 'Parent submitted valid doctor note; approved for full day exemption',
    ipAddress: '192.168.1.10',
    device: 'Chrome on Windows 11',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0 Safari/537.36',
    timestamp: '2026-09-18T08:30:00.000Z',
  },
  {
    id: 'audit-008',
    userId: 'tch-10-001',
    userName: 'Teacher Priya Sharma',
    userRole: 'TEACHER',
    action: 'ATTENDANCE_CORRECTION',
    actionLabel: 'Teacher corrected attendance',
    entity: 'Attendance',
    entityId: 'att-101-0918',
    entityName: 'Rahul Kumar - Attendance 18/09/2026',
    oldValue: {
      status: 'ABSENT',
      markedAt: '2026-09-18T07:15:00.000Z',
      notes: 'Initial roll call missing',
    },
    newValue: {
      status: 'PRESENT',
      markedAt: '2026-09-18T09:15:00.000Z',
      notes: 'Verified in-person presence in practical session',
    },
    reason: 'Student arrived 10 mins late due to bus traffic; verified present by faculty',
    ipAddress: '192.168.1.45',
    device: 'Firefox on macOS',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0',
    timestamp: '2026-09-18T09:15:00.000Z',
  },
];

// In-Memory store initialized with persistent records or defaults
let auditLogs: AuditLogEntry[] = [];

const loadAuditLogs = (): void => {
  try {
    if (fs.existsSync(AUDIT_FILE)) {
      const data = fs.readFileSync(AUDIT_FILE, 'utf-8');
      auditLogs = JSON.parse(data);
    } else {
      auditLogs = [...INITIAL_AUDIT_LOGS];
      saveAuditLogs();
    }
  } catch (err) {
    console.error('[AuditService] Error loading audit logs from disk:', err);
    auditLogs = [...INITIAL_AUDIT_LOGS];
  }
};

const saveAuditLogs = (): void => {
  try {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(auditLogs, null, 2), 'utf-8');
  } catch (err) {
    console.error('[AuditService] Error saving audit logs to disk:', err);
  }
};

// Initial load
loadAuditLogs();

/**
 * Record an immutable audit log entry
 */
export const logAudit = async (entry: {
  userId: string;
  userName: string;
  userRole: RoleType | 'SYSTEM';
  action: AuditActionType;
  actionLabel: string;
  entity: AuditEntityType;
  entityId: string;
  entityName?: string;
  oldValue: Record<string, any> | null;
  newValue: Record<string, any> | null;
  reason?: string;
  ipAddress?: string;
  device?: string;
  userAgent?: string;
  timestamp?: string;
}): Promise<AuditLogEntry> => {
  const finalIp = entry.ipAddress || '127.0.0.1';
  const finalDevice = entry.device || parseDeviceFromUserAgent(entry.userAgent);

  const newLog: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: entry.userId,
    userName: entry.userName,
    userRole: entry.userRole,
    action: entry.action,
    actionLabel: entry.actionLabel,
    entity: entry.entity,
    entityId: entry.entityId,
    entityName: entry.entityName,
    oldValue: entry.oldValue,
    newValue: entry.newValue,
    reason: entry.reason,
    ipAddress: finalIp,
    device: finalDevice,
    userAgent: entry.userAgent,
    timestamp: entry.timestamp || new Date().toISOString(),
  };

  // Prepend to maintain reverse chronological order (newest first)
  auditLogs.unshift(newLog);
  saveAuditLogs();

  return newLog;
};

/**
 * Retrieve audit logs with comprehensive multi-criteria filtering
 */
export const getAuditLogs = async (
  filters?: AuditLogFilter
): Promise<{ logs: AuditLogEntry[]; total: number }> => {
  let filtered = [...auditLogs];

  if (filters?.entity && filters.entity !== 'ALL') {
    filtered = filtered.filter(
      (l) => l.entity.toLowerCase() === filters.entity!.toLowerCase()
    );
  }

  if (filters?.action && filters.action !== 'ALL') {
    filtered = filtered.filter((l) => l.action === filters.action);
  }

  if (filters?.userRole && filters.userRole !== 'ALL') {
    filtered = filtered.filter((l) => l.userRole === filters.userRole);
  }

  if (filters?.userId) {
    filtered = filtered.filter((l) => l.userId === filters.userId);
  }

  if (filters?.startDate) {
    const start = new Date(filters.startDate).getTime();
    filtered = filtered.filter((l) => new Date(l.timestamp).getTime() >= start);
  }

  if (filters?.endDate) {
    const end = new Date(filters.endDate).getTime();
    filtered = filtered.filter((l) => new Date(l.timestamp).getTime() <= end);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.userName.toLowerCase().includes(q) ||
        l.actionLabel.toLowerCase().includes(q) ||
        (l.entityName && l.entityName.toLowerCase().includes(q)) ||
        l.entityId.toLowerCase().includes(q) ||
        (l.reason && l.reason.toLowerCase().includes(q)) ||
        l.ipAddress.includes(q)
    );
  }

  const total = filtered.length;
  const page = Number(filters?.page) || 1;
  const limit = Number(filters?.limit) || 50;
  const startIndex = (page - 1) * limit;
  const paginatedLogs = filtered.slice(startIndex, startIndex + limit);

  return { logs: paginatedLogs, total };
};

/**
 * Retrieve single audit log by ID
 */
export const getAuditLogById = async (id: string): Promise<AuditLogEntry | null> => {
  const found = auditLogs.find((l) => l.id === id);
  return found || null;
};

/**
 * Export audit logs to structured CSV string
 */
export const exportAuditLogsToCsv = async (filters?: AuditLogFilter): Promise<string> => {
  const { logs } = await getAuditLogs({ ...filters, limit: 10000 });

  const headers = [
    'Audit ID',
    'Timestamp',
    'User Name',
    'User ID',
    'User Role',
    'Action Code',
    'Action Description',
    'Entity Type',
    'Entity ID',
    'Entity Name',
    'Reason',
    'IP Address',
    'Device / Browser',
    'Old Value JSON',
    'New Value JSON',
  ];

  const rows = logs.map((l) => [
    `"${l.id}"`,
    `"${l.timestamp}"`,
    `"${l.userName.replace(/"/g, '""')}"`,
    `"${l.userId}"`,
    `"${l.userRole}"`,
    `"${l.action}"`,
    `"${l.actionLabel.replace(/"/g, '""')}"`,
    `"${l.entity}"`,
    `"${l.entityId}"`,
    `"${(l.entityName || '').replace(/"/g, '""')}"`,
    `"${(l.reason || '').replace(/"/g, '""')}"`,
    `"${l.ipAddress}"`,
    `"${(l.device || '').replace(/"/g, '""')}"`,
    `"${JSON.stringify(l.oldValue || {}).replace(/"/g, '""')}"`,
    `"${JSON.stringify(l.newValue || {}).replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

/**
 * Reset audit logs to initial seed state (primarily for automated test teardown)
 */
export const resetAuditLogsForTesting = (): void => {
  auditLogs = [...INITIAL_AUDIT_LOGS];
  saveAuditLogs();
};
