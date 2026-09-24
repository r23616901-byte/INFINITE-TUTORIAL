import prisma from './prisma';
import {
  AttendanceRecordDto,
  AttendanceSessionType,
  AttendanceStatusType,
  BatchAttendanceDetails,
  StudentAttendanceStatsDto,
  MonthlyAttendanceStat,
} from '../types';
import { getStudents } from './studentService';
import { INITIAL_BATCHES, checkDbAvailability } from './academicService';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Helper to get day name from date string (YYYY-MM-DD)
 */
export const getDayOfWeek = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return DAY_NAMES[d.getUTCDay()];
};

/**
 * Validate that date is Monday through Saturday
 */
export const isOperationalDay = (dateString: string): boolean => {
  const dayName = getDayOfWeek(dateString);
  return dayName !== 'Sunday';
};

// ---------------------------------------------------------------------------
// Seed attendance store for instant demo & fallback
// Generates exact 42 Present, 4 Absent = 46 total sessions (91.30%) for Rahul Kumar IT10025
// ---------------------------------------------------------------------------
let inMemoryAttendance: AttendanceRecordDto[] = [];

const seedHistoricalAttendance = () => {
  if (inMemoryAttendance.length > 0) return;

  const rahulId = 'stu-10025';
  const rahulName = 'Rahul Kumar';
  const rahulRoll = 'IT10025';
  const batchId = 'batch-10a-morning';
  const batchName = '10th A Morning';
  const teacherName = 'Prof. Rajesh Sharma (Physics)';

  // Other students in 10-A
  const peers = [
    { id: 'stu-10026', name: 'Sneha Verma', roll: 'IT10026' },
    { id: 'stu-10027', name: 'Aditya Rao', roll: 'IT10027' },
  ];

  // Generate 46 operational days (Mon-Sat) backwards from September 2026
  let count = 0;
  let currentDate = new Date(2026, 8, 23); // 23 Sep 2026

  const rahulStatuses: AttendanceStatusType[] = [];
  // 42 Present, 4 Absent
  // Distribute 4 absents at indices 5, 14, 28, 39
  for (let i = 0; i < 46; i++) {
    if (i === 5 || i === 14 || i === 28 || i === 39) {
      rahulStatuses.push('ABSENT');
    } else {
      rahulStatuses.push('PRESENT');
    }
  }

  while (count < 46) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0) {
      // Monday to Saturday
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayName = DAY_NAMES[dayOfWeek];
      const session: AttendanceSessionType = count % 3 === 0 ? 'EVENING' : 'MORNING';
      const rahulStatus = rahulStatuses[count];

      // Rahul record
      inMemoryAttendance.push({
        id: `att-seed-${count}-rahul`,
        date: new Date(dateStr).toISOString(),
        dateStr,
        day: dayName,
        session,
        batchId,
        batchName,
        studentId: rahulId,
        studentName: rahulName,
        studentRoll: rahulRoll,
        status: rahulStatus,
        recordedById: 'teacher-uuid-2222',
        recordedByName: teacherName,
        remarks: rahulStatus === 'ABSENT' ? 'Parent informed via SMS' : null,
        createdAt: new Date(dateStr).toISOString(),
        updatedAt: new Date(dateStr).toISOString(),
      });

      // Peer records
      peers.forEach((peer, pIdx) => {
        const peerStatus: AttendanceStatusType = (count + pIdx) % 7 === 0 ? 'ABSENT' : 'PRESENT';
        inMemoryAttendance.push({
          id: `att-seed-${count}-peer-${pIdx}`,
          date: new Date(dateStr).toISOString(),
          dateStr,
          day: dayName,
          session,
          batchId,
          batchName,
          studentId: peer.id,
          studentName: peer.name,
          studentRoll: peer.roll,
          status: peerStatus,
          recordedById: 'teacher-uuid-2222',
          recordedByName: teacherName,
          remarks: peerStatus === 'ABSENT' ? 'Sick leave' : null,
          createdAt: new Date(dateStr).toISOString(),
          updatedAt: new Date(dateStr).toISOString(),
        });
      });

      count++;
    }
    // step back 1 day
    currentDate.setDate(currentDate.getDate() - 1);
  }
};

// Initialize seed
seedHistoricalAttendance();

/**
 * Get batch attendance for a specific date and session.
 * If not already taken, returns all students belonging to the batch with default 'PRESENT' status.
 */
export const getBatchAttendance = async (
  batchId: string,
  dateStr: string,
  session: AttendanceSessionType
): Promise<BatchAttendanceDetails> => {
  const day = getDayOfWeek(dateStr);
  const batch = INITIAL_BATCHES.find((b) => b.id === batchId) || { name: 'Batch' };

  // Fetch students in this batch
  const { students } = await getStudents({ batchId, limit: 100 });

  // Check if attendance already recorded in DB or in-memory
  let existingRecords: AttendanceRecordDto[] = [];
  if (await checkDbAvailability()) {
    try {
      const dbRecords = await prisma.attendance.findMany({
        where: {
          batchId,
          dateStr,
          session: session as any,
        },
        include: { student: true, batch: true },
      });
      if (dbRecords.length > 0) {
        existingRecords = dbRecords.map((r: any) => ({
          id: r.id,
          date: r.date.toISOString(),
          dateStr: r.dateStr,
          day: r.day,
          session: r.session as AttendanceSessionType,
          batchId: r.batchId,
          batchName: r.batch?.name || batch.name,
          studentId: r.studentId,
          studentName: r.student?.name || '',
          studentRoll: r.student?.studentId || '',
          status: r.status as AttendanceStatusType,
          recordedById: r.recordedById,
          recordedByName: r.recordedByName,
          remarks: r.remarks,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      }
    } catch {
      // Database offline, use in-memory
    }
  }

  if (existingRecords.length === 0) {
    existingRecords = inMemoryAttendance.filter(
      (a) => a.batchId === batchId && a.dateStr === dateStr && a.session === session
    );
  }

  const isMarked = existingRecords.length > 0;
  const existingMap = new Map(existingRecords.map((r) => [r.studentId, r]));

  // If no students assigned to batch in mock, supply batch students
  const studentList =
    students.length > 0
      ? students
      : [
          { id: 'stu-10025', studentId: 'IT10025', name: 'Rahul Kumar', photoUrl: null },
          { id: 'stu-10026', studentId: 'IT10026', name: 'Sneha Verma', photoUrl: null },
          { id: 'stu-10027', studentId: 'IT10027', name: 'Aditya Rao', photoUrl: null },
        ];

  let presentCount = 0;
  let absentCount = 0;

  const studentRows = studentList.map((st) => {
    const existing = existingMap.get(st.id) || existingMap.get(st.studentId);
    const status: AttendanceStatusType = existing ? existing.status : 'PRESENT';
    if (status === 'PRESENT') presentCount++;
    else absentCount++;

    return {
      id: st.id,
      studentId: st.studentId,
      name: st.name,
      photoUrl: (st as any).photoUrl || null,
      status,
      attendanceId: existing?.id,
      remarks: existing?.remarks || null,
    };
  });

  return {
    date: dateStr,
    day,
    session,
    batchId,
    batchName: batch.name,
    isMarked,
    totalStudents: studentRows.length,
    presentCount,
    absentCount,
    students: studentRows,
  };
};

/**
 * Mark or Update batch attendance.
 * Prevents duplicates by upserting on compound key: studentId + dateStr + session + batchId.
 */
export const markBatchAttendance = async (
  dateStr: string,
  session: AttendanceSessionType,
  batchId: string,
  records: Array<{ studentId: string; status: AttendanceStatusType; remarks?: string }>,
  recordedBy: { id: string; name: string }
): Promise<{ success: boolean; count: number; message: string }> => {
  if (!isOperationalDay(dateStr)) {
    throw new Error('Attendance can only be recorded for Monday through Saturday.');
  }

  const day = getDayOfWeek(dateStr);
  const batch = INITIAL_BATCHES.find((b) => b.id === batchId) || { name: 'Batch' };
  const dateObj = new Date(`${dateStr}T12:00:00.000Z`);

  const studentMap = new Map();
  try {
    const { students } = await getStudents({ batchId, limit: 100 });
    students.forEach((s) => {
      studentMap.set(s.id, s);
      studentMap.set(s.studentId, s);
    });
  } catch {}

  // 1. Try Prisma Upsert
  if (await checkDbAvailability()) {
    try {
      for (const rec of records) {
        await prisma.attendance.upsert({
          where: {
            studentId_dateStr_session_batchId: {
              studentId: rec.studentId,
              dateStr,
              session: session as any,
              batchId,
            },
          },
          update: {
            status: rec.status as any,
            remarks: rec.remarks || null,
            recordedById: recordedBy.id,
            recordedByName: recordedBy.name,
            updatedAt: new Date(),
          },
          create: {
            date: dateObj,
            dateStr,
            day,
            session: session as any,
            batchId,
            studentId: rec.studentId,
            status: rec.status as any,
            remarks: rec.remarks || null,
            recordedById: recordedBy.id,
            recordedByName: recordedBy.name,
          },
        });
      }
    } catch {
      // Database offline, fall through to in-memory
    }
  }

  // 2. Synchronize in-memory store
  for (const rec of records) {
    const st = studentMap.get(rec.studentId);
    const studentName = st ? st.name : 'Student';
    const studentRoll = st ? st.studentId : rec.studentId;

    const existingIndex = inMemoryAttendance.findIndex(
      (a) =>
        (a.studentId === rec.studentId || a.studentRoll === rec.studentId) &&
        a.dateStr === dateStr &&
        a.session === session &&
        a.batchId === batchId
    );

    if (existingIndex >= 0) {
      // Update existing record (prevents duplicates)
      inMemoryAttendance[existingIndex] = {
        ...inMemoryAttendance[existingIndex],
        status: rec.status,
        remarks: rec.remarks || null,
        recordedById: recordedBy.id,
        recordedByName: recordedBy.name,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Insert new unique record
      inMemoryAttendance.unshift({
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        date: dateObj.toISOString(),
        dateStr,
        day,
        session,
        batchId,
        batchName: batch.name,
        studentId: rec.studentId,
        studentName,
        studentRoll,
        status: rec.status,
        recordedById: recordedBy.id,
        recordedByName: recordedBy.name,
        remarks: rec.remarks || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return {
    success: true,
    count: records.length,
    message: `Attendance successfully saved for ${records.length} students (${session} session, ${day} ${dateStr}).`,
  };
};

/**
 * Get individual student attendance history and percentage calculation
 */
export const getStudentAttendanceStats = async (
  studentIdOrRoll: string
): Promise<StudentAttendanceStatsDto> => {
  // Find student info
  const { students } = await getStudents({ search: studentIdOrRoll, limit: 10 });
  const student =
    students.find(
      (s) =>
        s.id.toLowerCase() === studentIdOrRoll.toLowerCase() ||
        s.studentId.toLowerCase() === studentIdOrRoll.toLowerCase()
    ) || students[0];

  const targetId = student ? student.id : studentIdOrRoll;
  const targetRoll = student ? student.studentId : studentIdOrRoll;

  // Query records
  let records: AttendanceRecordDto[] = [];
  if (await checkDbAvailability()) {
    try {
      const dbRecords = await prisma.attendance.findMany({
        where: {
          OR: [{ studentId: targetId }, { student: { studentId: targetRoll } }],
        },
        include: { batch: true, student: true },
        orderBy: { date: 'desc' },
      });
      if (dbRecords.length > 0) {
        records = dbRecords.map((r: any) => ({
          id: r.id,
          date: r.date.toISOString(),
          dateStr: r.dateStr,
          day: r.day,
          session: r.session as AttendanceSessionType,
          batchId: r.batchId,
          batchName: r.batch?.name || '',
          studentId: r.studentId,
          studentName: r.student?.name || '',
          studentRoll: r.student?.studentId || '',
          status: r.status as AttendanceStatusType,
          recordedById: r.recordedById,
          recordedByName: r.recordedByName,
          remarks: r.remarks,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      }
    } catch {}
  }

  if (records.length === 0) {
    records = inMemoryAttendance.filter(
      (a) =>
        a.studentId.toLowerCase() === targetId.toLowerCase() ||
        a.studentRoll.toLowerCase() === targetRoll.toLowerCase()
    );
  }

  // Calculate statistics
  let presentSessions = 0;
  let absentSessions = 0;
  let morningPresent = 0;
  let morningTotal = 0;
  let eveningPresent = 0;
  let eveningTotal = 0;

  const monthMap = new Map<string, { present: number; absent: number; total: number; year: number; month: string }>();

  records.forEach((rec) => {
    if (rec.status === 'PRESENT') {
      presentSessions++;
    } else {
      absentSessions++;
    }

    if (rec.session === 'MORNING') {
      morningTotal++;
      if (rec.status === 'PRESENT') morningPresent++;
    } else {
      eveningTotal++;
      if (rec.status === 'PRESENT') eveningPresent++;
    }

    // Monthly aggregation
    const d = new Date(rec.date);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthName = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { present: 0, absent: 0, total: 0, year: d.getFullYear(), month: monthName });
    }
    const mStat = monthMap.get(monthKey)!;
    mStat.total++;
    if (rec.status === 'PRESENT') mStat.present++;
    else mStat.absent++;
  });

  const totalSessions = presentSessions + absentSessions;
  const attendancePercentage = totalSessions > 0 ? Number(((presentSessions / totalSessions) * 100).toFixed(1)) : 0;

  const monthlyBreakdown: MonthlyAttendanceStat[] = Array.from(monthMap.values()).map((m) => ({
    month: m.month,
    year: m.year,
    present: m.present,
    absent: m.absent,
    total: m.total,
    percentage: m.total > 0 ? Number(((m.present / m.total) * 100).toFixed(1)) : 0,
  }));

  return {
    studentId: targetRoll,
    studentDbId: targetId,
    studentName: student ? student.name : 'Rahul Kumar',
    studentRoll: targetRoll,
    className: student ? student.className : 'Class 10',
    boardName: student ? student.boardName : 'CBSE',
    batchName: student ? student.batchName : '10th A Morning',
    totalSessions,
    presentSessions,
    absentSessions,
    attendancePercentage,
    morningPresent,
    morningTotal,
    eveningPresent,
    eveningTotal,
    monthlyBreakdown,
    history: records.sort((a, b) => new Date(b.dateStr).getTime() - new Date(a.dateStr).getTime()),
  };
};

/**
 * Correct attendance record (Admin only authorized function)
 */
export const correctAttendanceRecord = async (
  recordId: string,
  newStatus: AttendanceStatusType,
  remarks: string,
  adminUser: { id: string; name: string }
): Promise<AttendanceRecordDto> => {
  if (await checkDbAvailability()) {
    try {
      const updated = await prisma.attendance.update({
        where: { id: recordId },
        data: {
          status: newStatus as any,
          remarks: remarks ? `[Corrected by Admin ${adminUser.name}]: ${remarks}` : `[Corrected by Admin ${adminUser.name}]`,
          updatedAt: new Date(),
        },
        include: { student: true, batch: true },
      });
      return {
        id: updated.id,
        date: updated.date.toISOString(),
        dateStr: updated.dateStr,
        day: updated.day,
        session: updated.session as AttendanceSessionType,
        batchId: updated.batchId,
        batchName: updated.batch?.name || '',
        studentId: updated.studentId,
        studentName: updated.student?.name || '',
        studentRoll: updated.student?.studentId || '',
        status: updated.status as AttendanceStatusType,
        recordedById: adminUser.id,
        recordedByName: adminUser.name,
        remarks: updated.remarks,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
    } catch {}
  }

  const idx = inMemoryAttendance.findIndex((a) => a.id === recordId);
  if (idx >= 0) {
    inMemoryAttendance[idx] = {
      ...inMemoryAttendance[idx],
      status: newStatus,
      remarks: remarks ? `[Corrected by Admin ${adminUser.name}]: ${remarks}` : `[Corrected by Admin ${adminUser.name}]`,
      recordedById: adminUser.id,
      recordedByName: adminUser.name,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryAttendance[idx];
  }

  throw new Error(`Attendance record with ID ${recordId} not found`);
};

/**
 * Get overall attendance dashboard metrics (for Admin and Teacher overview)
 */
export const getAttendanceOverviewStats = async () => {
  const totalRecords = inMemoryAttendance.length;
  const present = inMemoryAttendance.filter((a) => a.status === 'PRESENT').length;
  const absent = inMemoryAttendance.filter((a) => a.status === 'ABSENT').length;
  const rate = totalRecords > 0 ? Number(((present / totalRecords) * 100).toFixed(1)) : 0;

  // Group by batches
  const batchStatsMap = new Map<string, { batchId: string; batchName: string; present: number; absent: number; total: number }>();
  inMemoryAttendance.forEach((a) => {
    if (!batchStatsMap.has(a.batchId)) {
      batchStatsMap.set(a.batchId, {
        batchId: a.batchId,
        batchName: a.batchName,
        present: 0,
        absent: 0,
        total: 0,
      });
    }
    const b = batchStatsMap.get(a.batchId)!;
    b.total++;
    if (a.status === 'PRESENT') b.present++;
    else b.absent++;
  });

  const batchBreakdown = Array.from(batchStatsMap.values()).map((b) => ({
    ...b,
    percentage: b.total > 0 ? Number(((b.present / b.total) * 100).toFixed(1)) : 0,
  }));

  return {
    totalRecords,
    present,
    absent,
    overallRate: rate,
    batchBreakdown,
  };
};
