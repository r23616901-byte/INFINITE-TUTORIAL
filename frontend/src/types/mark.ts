export interface MarkAuditLog {
  id: string;
  markId: string;
  oldMarks: number;
  newMarks: number;
  oldPercentage?: number | null;
  newPercentage?: number | null;
  changedById: string;
  changedByName: string;
  changedByRole: string; // "TEACHER" | "ADMIN"
  changedAt: string;
  reason: string; // e.g. "Rechecking"
  createdAt?: string;
}

export interface StudentMark {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  testId: string;
  testCode: string; // e.g. "TST-10-PHY-003"
  testName: string; // e.g. "Chapter 3 Test"
  subjectId: string;
  subjectName: string; // e.g. "Physics"
  maxMarks: number; // e.g. 50
  marksObtained: number; // e.g. 42
  percentage: number; // e.g. 84.0
  answerSheetUrl?: string | null;
  answerSheetName?: string | null;
  answerSheetSize?: number | null;
  mimeType?: string | null;
  isPublished: boolean;
  remarks?: string | null;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  auditLogs?: MarkAuditLog[];
}

export interface CreateMarkPayload {
  studentId: string;
  subjectId: string;
  testId: string;
  marksObtained: number;
  maxMarks?: number;
  answerSheetUrl?: string;
  answerSheetName?: string;
  answerSheetSize?: number;
  mimeType?: string;
  isPublished?: boolean;
  remarks?: string;
}

export interface UpdateMarkPayload {
  marksObtained?: number;
  reason: string; // Mandatory explanation for audit log
  answerSheetUrl?: string;
  answerSheetName?: string;
  answerSheetSize?: number;
  mimeType?: string;
  isPublished?: boolean;
  remarks?: string;
}

export interface MarkFilters {
  studentId?: string;
  testId?: string;
  subjectId?: string;
  subjectName?: string;
  isPublished?: boolean;
  search?: string;
}
