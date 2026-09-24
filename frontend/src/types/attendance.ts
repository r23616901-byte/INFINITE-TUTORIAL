export type AttendanceSession = 'MORNING' | 'EVENING';
export type AttendanceStatus = 'PRESENT' | 'ABSENT';

export interface AttendanceRecord {
  id: string;
  date: string;
  dateStr: string;
  day: string;
  session: AttendanceSession;
  batchId: string;
  batchName: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  status: AttendanceStatus;
  recordedById?: string | null;
  recordedByName?: string | null;
  remarks?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BatchAttendanceStudentItem {
  id: string;
  studentId: string;
  name: string;
  photoUrl?: string | null;
  status: AttendanceStatus;
  attendanceId?: string;
  remarks?: string | null;
}

export interface BatchAttendanceDetails {
  date: string;
  day: string;
  session: AttendanceSession;
  batchId: string;
  batchName: string;
  isMarked: boolean;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  students: BatchAttendanceStudentItem[];
}

export interface MonthlyAttendanceStat {
  month: string;
  year: number;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

export interface StudentAttendanceStats {
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
  history: AttendanceRecord[];
}

export interface ClassItem {
  id: string;
  name: string;
  grade: number;
  description?: string | null;
}

export interface BoardItem {
  id: string;
  name: string;
  code: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  boardId?: string | null;
  boardName?: string | null;
}

export interface BatchItem {
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
