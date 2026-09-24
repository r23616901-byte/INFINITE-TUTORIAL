import { Request } from 'express';

export type RoleType = 'ADMIN' | 'TEACHER' | 'PARENT';

export type StudentStatusType = 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'COMPLETED' | 'SUSPENDED';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface JwtPayload {
  userId: string;
  role: RoleType;
  phone: string;
  email?: string | null;
}

export interface AuthenticatedUser {
  id: string;
  phone: string;
  email?: string | null;
  role: RoleType;
  mustChangePassword: boolean;
  name?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface LoginRequestBody {
  identifier?: string; // Phone number for Parents, or Gmail ID for Teacher/Admin
  phone?: string;
  email?: string;
  password: string;
}

export interface ChangePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
}

// ----------------------------------------------------
// STUDENT MANAGEMENT TYPES
// ----------------------------------------------------
export interface StudentDto {
  id: string;
  studentId: string;
  name: string;
  photoUrl?: string | null;
  school: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  studentPhone?: string | null;
  dateOfBirth: string | Date;
  classId: string;
  className: string;
  boardId: string;
  boardName: string;
  batchId: string;
  batchName: string;
  academicYear: string;
  admissionDate: string | Date;
  status: StudentStatusType;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateStudentDto {
  studentId?: string; // Auto-generated if not provided
  name: string;
  photoUrl?: string | null;
  school: string;
  parentName: string;
  parentPhone: string;
  studentPhone?: string | null;
  dateOfBirth: string; // ISO string or YYYY-MM-DD
  classId: string;
  boardId: string;
  batchId: string;
  academicYear?: string;
  admissionDate?: string;
  status?: StudentStatusType;
}

export interface UpdateStudentDto {
  name?: string;
  photoUrl?: string | null;
  school?: string;
  parentName?: string;
  parentPhone?: string;
  studentPhone?: string | null;
  dateOfBirth?: string;
  classId?: string;
  boardId?: string;
  batchId?: string;
  academicYear?: string;
  status?: StudentStatusType;
}

export interface StudentFilters {
  search?: string; // search student name, studentId, or parent phone
  name?: string;
  studentId?: string;
  parentPhone?: string;
  school?: string;
  classId?: string;
  boardId?: string;
  batchId?: string;
  academicYear?: string;
  status?: StudentStatusType;
  page?: number;
  limit?: number;
}

// ----------------------------------------------------
// ATTENDANCE MANAGEMENT TYPES
// ----------------------------------------------------
export type AttendanceSessionType = 'MORNING' | 'EVENING';
export type AttendanceStatusType = 'PRESENT' | 'ABSENT';

export interface AttendanceRecordDto {
  id: string;
  date: string;
  dateStr: string;
  day: string; // "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  session: AttendanceSessionType;
  batchId: string;
  batchName: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  status: AttendanceStatusType;
  recordedById?: string | null;
  recordedByName?: string | null;
  remarks?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AttendanceStudentItem {
  studentId: string; // Database ID or studentId
  studentRoll: string;
  name: string;
  status: AttendanceStatusType;
  remarks?: string;
}

export interface MarkBatchAttendancePayload {
  date: string; // "YYYY-MM-DD"
  session: AttendanceSessionType;
  batchId: string;
  records: Array<{
    studentId: string;
    status: AttendanceStatusType;
    remarks?: string;
  }>;
}

export interface BatchAttendanceDetails {
  date: string;
  day: string;
  session: AttendanceSessionType;
  batchId: string;
  batchName: string;
  isMarked: boolean;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  students: Array<{
    id: string;
    studentId: string;
    name: string;
    photoUrl?: string | null;
    status: AttendanceStatusType;
    attendanceId?: string;
    remarks?: string | null;
  }>;
}

export interface MonthlyAttendanceStat {
  month: string;
  year: number;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

export interface StudentAttendanceStatsDto {
  studentId: string;
  studentDbId: string;
  studentName: string;
  studentRoll: string;
  className: string;
  boardName: string;
  batchName: string;
  totalSessions: number;
  presentSessions: number;
  absentSessions: number;
  attendancePercentage: number;
  morningPresent: number;
  morningTotal: number;
  eveningPresent: number;
  eveningTotal: number;
  monthlyBreakdown: MonthlyAttendanceStat[];
  history: AttendanceRecordDto[];
}

// ----------------------------------------------------
// ACADEMIC (CLASS, BOARD, SUBJECT, BATCH) TYPES
// ----------------------------------------------------
export interface ClassDto {
  id: string;
  name: string;
  grade: number;
  description?: string | null;
}

export interface BoardDto {
  id: string;
  name: string;
  code: string;
}

export interface SubjectDto {
  id: string;
  name: string;
  code: string;
  boardId?: string | null;
  boardName?: string | null;
}

export interface BatchDto {
  id: string;
  name: string;
  timing: string;
  session: string;
  startTime?: string | null;
  endTime?: string | null;
  days: string;
  status: string;
  classId: string;
  className?: string;
  boardId: string;
  boardName?: string;
  academicYear: string;
  assignedTeacherName?: string;
  studentCount?: number;
}

// ----------------------------------------------------
// LEAVE REQUEST SYSTEM TYPES
// ----------------------------------------------------
export type LeaveStatusType = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LeaveSessionType = 'MORNING' | 'EVENING' | 'BOTH';

export interface LeaveRequestDto {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  className: string;
  batchName: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  fromDate: string; // YYYY-MM-DD
  toDate: string;   // YYYY-MM-DD
  session: string;  // 'MORNING' | 'EVENING' | 'BOTH'
  reason: string;   // 'Medical', 'Family Function', 'Examination', 'Personal', 'Travel', 'Other'
  description: string;
  attachmentUrl?: string | null;
  status: LeaveStatusType;
  reviewedById?: string | null;
  reviewedByName?: string | null;
  reviewNote?: string | null;
  reviewedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateLeaveRequestPayload {
  studentId?: string;
  fromDate: string;
  toDate: string;
  session?: string;
  reason: string;
  description: string;
  attachmentUrl?: string;
}

export interface ReviewLeaveRequestPayload {
  status: 'APPROVED' | 'REJECTED';
  reviewNote?: string;
}

// ----------------------------------------------------
// TEST MANAGEMENT & TEST TYPES (STEPS 14, 15, 16, 17)
// ----------------------------------------------------
export interface TestTypeDto {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt?: string | Date;
}

export interface TestDto {
  id: string;
  testId: string;               // e.g. "TST-10-MAT-001"
  name: string;                 // Test Name
  classId: string;
  className: string;            // e.g. "Class 10"
  boardId: string;
  boardName: string;            // e.g. "CBSE"
  subjectId: string;
  subjectName: string;          // e.g. "Mathematics"
  chapter: string;              // Chapter name or number
  testType: string;             // "Test 1", "Unit Test", etc.
  date: string;                 // "YYYY-MM-DD"
  maxMarks: number;             // e.g. 50
  duration: string;             // e.g. "90 mins"
  durationMinutes: number;      // e.g. 90
  testPaperUrl?: string | null; // URL / path to uploaded paper
  testPaperName?: string | null;// Original filename
  testPaperSize?: number | null;// Size in bytes
  mimeType?: string | null;     // "application/pdf", "image/png", etc.
  instructions?: string | null; // Student instructions
  createdById: string;
  createdByName: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateTestPayload {
  testId?: string;
  name: string;
  classId: string;
  boardId: string;
  subjectId: string;
  chapter: string;
  testType: string;
  date: string; // YYYY-MM-DD
  maxMarks: number;
  duration?: string;
  durationMinutes?: number;
  testPaperUrl?: string;
  testPaperName?: string;
  testPaperSize?: number;
  mimeType?: string;
  instructions?: string;
}

export interface UpdateTestPayload {
  name?: string;
  classId?: string;
  boardId?: string;
  subjectId?: string;
  chapter?: string;
  testType?: string;
  date?: string;
  maxMarks?: number;
  duration?: string;
  durationMinutes?: number;
  testPaperUrl?: string | null;
  testPaperName?: string | null;
  testPaperSize?: number | null;
  mimeType?: string | null;
  instructions?: string | null;
}

export interface TestFilters {
  classId?: string;
  boardId?: string;
  subjectId?: string;
  chapter?: string;
  testType?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// ----------------------------------------------------
// HOME-REACH / STUDENT REACHED HOME (STEP 13 & 21)
// ----------------------------------------------------
export type HomeReachStatusType = 'IN_CLASS' | 'LEFT_TUITION' | 'REACHED_HOME' | 'DELAYED';

export interface HomeReachRecordDto {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  batchId: string;
  batchName: string;
  date: string;               // YYYY-MM-DD
  session: string;            // 'EVENING' | 'MORNING'
  classEndedTime: string;     // e.g. "7:30 PM"
  classEndedAt: string | Date;
  reachedHomeTime?: string | null; // e.g. "7:52 PM"
  reachedHomeAt?: string | Date | null;
  transitMinutes?: number | null;  // e.g. 22
  status: HomeReachStatusType;
  recordedById?: string | null;
  recordedByName?: string | null;
  confirmedById?: string | null;
  confirmedByName?: string | null;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface HomeReachConfigDto {
  id: string;
  isEnabled: boolean;
  alertThresholdMinutes: number; // default 45
  autoNotifyParents: boolean;
  allowParentSelfConfirm: boolean;
  allowStudentSelfConfirm: boolean;
  updatedAt?: string | Date;
}

export interface RecordDeparturePayload {
  batchId: string;
  studentIds?: string[];      // If empty/omitted, applies to all students in batch
  date?: string;              // YYYY-MM-DD (defaults to today)
  session?: string;           // 'EVENING' | 'MORNING'
  classEndedTime?: string;    // e.g. "7:30 PM" (defaults to current time formatted)
  notes?: string;
}

export interface ConfirmReachedHomePayload {
  recordId?: string;
  studentId?: string;         // Can identify by studentId or recordId
  reachedHomeTime?: string;   // e.g. "7:52 PM" (defaults to current time formatted)
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
  status?: HomeReachStatusType | 'ALL';
  session?: string;
  search?: string;
}

// ----------------------------------------------------
// STUDENT MARKS & EVALUATED ANSWER SHEETS (STEPS 18, 19, 20)
// ----------------------------------------------------
export interface MarkAuditLogDto {
  id: string;
  markId: string;
  oldMarks: number;
  newMarks: number;
  oldPercentage?: number | null;
  newPercentage?: number | null;
  changedById: string;
  changedByName: string;
  changedByRole: string;       // "TEACHER" | "ADMIN"
  changedAt: string | Date;
  reason: string;              // e.g. "Rechecking"
  createdAt?: string | Date;
}

export interface StudentMarkDto {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  testId: string;
  testCode: string;            // e.g. "TST-10-PHY-003"
  testName: string;            // e.g. "Chapter 3 Test"
  subjectId: string;
  subjectName: string;         // e.g. "Physics"
  maxMarks: number;            // e.g. 50
  marksObtained: number;       // e.g. 42
  percentage: number;          // e.g. 84.0
  answerSheetUrl?: string | null;  // Cloudinary secure URL or storage path
  answerSheetName?: string | null;
  answerSheetSize?: number | null;
  mimeType?: string | null;
  isPublished: boolean;        // Whether visible to student/parent
  remarks?: string | null;
  createdById: string;
  createdByName: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  auditLogs?: MarkAuditLogDto[];
}

export interface CreateMarkPayload {
  studentId: string;           // Student UUID or studentRoll
  subjectId: string;
  testId: string;
  marksObtained: number;
  maxMarks?: number;           // If omitted, inferred from test definition
  answerSheetUrl?: string;     // Cloudinary or local URL
  answerSheetName?: string;
  answerSheetSize?: number;
  mimeType?: string;
  isPublished?: boolean;       // Defaults to true
  remarks?: string;
}

export interface UpdateMarkPayload {
  marksObtained?: number;
  reason: string;              // Mandatory explanation for audit log (e.g. "Rechecking")
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

// ----------------------------------------------------
// SCORECARD MODULE (STEP 21 / STEP 15)
// Physics, Chemistry, Biology, Mathematics
// ----------------------------------------------------
export interface SubjectScorecardItem {
  testId: string;
  testCode: string;
  testName: string;            // e.g. "Test 1", "Chapter 3 Test", "Unit Test"
  date: string;                // formatted date e.g. "18/09/2026"
  maxMarks: number;            // e.g. 50
  marksObtained: number;       // e.g. 42
  percentage: number;          // e.g. 84.0
  chapter: string;             // e.g. "Chapter 3: Light Reflection & Refraction"
  teacher: string;             // Faculty author e.g. "Prof. Rajesh Sharma"
  answerSheetUrl?: string | null;  // Scanned answer sheet URL
  testPaperUrl?: string | null;    // Official test question paper URL
  remarks?: string | null;
}

export interface SubjectScorecard {
  subjectName: 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics' | string;
  totalTests: number;
  totalMaxMarks: number;
  totalMarksObtained: number;
  averagePercentage: number;
  highestPercentage: number;
  tests: SubjectScorecardItem[];
}

export interface StudentScorecardDto {
  studentId: string;
  studentName: string;
  studentRoll: string;
  className: string;           // e.g. "Class 10"
  boardName: string;           // e.g. "CBSE"
  batchName: string;           // e.g. "10A Evening"
  photoUrl?: string | null;
  overallPercentage: number;
  overallGrade: string;        // e.g. "A+", "A", "B"
  totalTestsConducted: number;
  subjects: {
    physics: SubjectScorecard;
    chemistry: SubjectScorecard;
    biology: SubjectScorecard;
    mathematics: SubjectScorecard;
  };
  subjectList: SubjectScorecard[];
}

// ----------------------------------------------------
// PERFORMANCE & CHAPTER-WISE ANALYSIS (STEPS 22 & 23)
// ----------------------------------------------------
export interface SubjectTestProgressionItem {
  testNumber: string;         // e.g. "Test 1", "Test 2", "Test 3", "Test 4"
  testName: string;
  percentage: number;         // e.g. 72, 78, 84, 88
  marksObtained: number;
  maxMarks: number;
  date: string;
}

export interface ChapterAnalysisItem {
  chapterName: string;        // e.g. "Motion", "Force", "Gravitation", "Electricity"
  percentage: number;         // e.g. 82, 76, 88, 91
  masteryLevel: 'Mastered' | 'Proficient' | 'Needs Practice' | 'Critical Review';
  testsCount: number;
  avgMarks: number;
  maxMarks: number;
}

export interface SubjectPerformanceBreakdown {
  subjectName: 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics' | string;
  averageMarks: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  testProgression: SubjectTestProgressionItem[]; // For Line Graph (Step 22)
  chapterAnalysis: ChapterAnalysisItem[];         // For Bar Graph (Step 23)
}

export interface StudentOverallPerformanceDto {
  studentId: string;
  studentName: string;
  studentRoll: string;
  className: string;
  boardName: string;
  batchName: string;
  photoUrl?: string | null;
  overallAverageMarks: number;
  overallPercentage: number;
  attendancePercentage: number;  // Attendance correlation (e.g. 91.3%)
  totalTestsConducted: number;
  strongestSubject: string;
  needsFocusSubject: string;
  subjects: {
    physics: SubjectPerformanceBreakdown;
    chemistry: SubjectPerformanceBreakdown;
    biology: SubjectPerformanceBreakdown;
    mathematics: SubjectPerformanceBreakdown;
  };
  overallComparison: Array<{
    subject: string;
    averagePercentage: number;
    attendanceRate: number;
    benchmarkAvg: number;
  }>;
}

// ------------------------------------------------------
// DAILY UPDATES (STEP 37 / STEP 19)
// ------------------------------------------------------
export interface SubjectUpdateItem {
  subject: string; // e.g. "Physics", "Chemistry", "Mathematics", "Biology"
  status: string;  // e.g. "Chapter 4 completed.", "Numericals discussed."
}

export interface DailyUpdateDto {
  id: string;
  date: string;          // "YYYY-MM-DD"
  batchId: string;       // e.g. "batch-10a-morning"
  batchName: string;     // e.g. "10-A Morning"
  title: string;         // e.g. "Today's Update"
  todayLesson: string;   // "Today's lesson"
  topicsCovered: string; // "Topics covered"
  homework: string;      // "Complete questions 1–10."
  instructions?: string; // "Important instructions"
  subjectUpdates: SubjectUpdateItem[];
  postedById: string;
  postedByName: string;
  postedByRole: string;  // "TEACHER" | "ADMIN"
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateDailyUpdateDto {
  date: string;
  batchId: string;
  batchName?: string;
  title?: string;
  todayLesson: string;
  topicsCovered?: string;
  homework: string;
  instructions?: string;
  subjectUpdates?: SubjectUpdateItem[];
}

export interface UpdateDailyUpdateDto {
  title?: string;
  todayLesson?: string;
  topicsCovered?: string;
  homework?: string;
  instructions?: string;
  subjectUpdates?: SubjectUpdateItem[];
}

export interface DailyUpdateFilters {
  batchId?: string;
  date?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ------------------------------------------------------
// FILE MANAGEMENT & IMAGE PROCESSING (STEPS 41 & 42)
// ------------------------------------------------------
export type FileCategoryType =
  | 'STUDENT_PHOTO'
  | 'TEST_PAPER'
  | 'ANSWER_SHEET'
  | 'ANNOUNCEMENT'
  | 'LEAVE_ATTACHMENT'
  | 'DOCUMENT';

export interface FileMetadataDto {
  file_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string | Date;
  category: FileCategoryType;
  thumbnail_url?: string;
  medium_url?: string;
  original_size?: number;
  compressed_size?: number;
  compression_ratio?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  isImage: boolean;
}

export interface FileQueryFilters {
  category?: FileCategoryType;
  search?: string;
  uploaded_by?: string;
  page?: number;
  limit?: number;
}

// ------------------------------------------------------
// AUDIT LOG SYSTEM (STEP 53 / STEP 24)
// ------------------------------------------------------
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
  userRole: RoleType | 'SYSTEM';
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



