-- CreateEnum
CREATE TYPE "AttendanceSession" AS ENUM ('MORNING', 'EVENING');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "HomeReachStatus" AS ENUM ('IN_CLASS', 'LEFT_TUITION', 'REACHED_HOME', 'DELAYED');

-- AlterTable
ALTER TABLE "Batch" ADD COLUMN     "days" TEXT NOT NULL DEFAULT 'Monday-Saturday',
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "session" TEXT NOT NULL DEFAULT 'MORNING',
ADD COLUMN     "startTime" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "_BatchToTeacher" ADD CONSTRAINT "_BatchToTeacher_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BatchToTeacher_AB_unique";

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dateStr" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "session" "AttendanceSession" NOT NULL DEFAULT 'MORNING',
    "batchId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "recordedById" TEXT,
    "recordedByName" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "fromDate" TEXT NOT NULL,
    "toDate" TEXT NOT NULL,
    "session" TEXT NOT NULL DEFAULT 'BOTH',
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attachmentUrl" TEXT,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedByName" TEXT,
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "chapter" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dateStr" TEXT NOT NULL,
    "maxMarks" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 90,
    "testPaperUrl" TEXT,
    "testPaperName" TEXT,
    "testPaperSize" INTEGER,
    "mimeType" TEXT,
    "instructions" TEXT,
    "createdById" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeReachRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentRoll" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "batchName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dateStr" TEXT NOT NULL,
    "session" TEXT NOT NULL DEFAULT 'EVENING',
    "classEndedTime" TEXT NOT NULL,
    "classEndedAt" TIMESTAMP(3) NOT NULL,
    "reachedHomeTime" TEXT,
    "reachedHomeAt" TIMESTAMP(3),
    "transitMinutes" INTEGER,
    "status" "HomeReachStatus" NOT NULL DEFAULT 'LEFT_TUITION',
    "recordedById" TEXT,
    "recordedByName" TEXT,
    "confirmedById" TEXT,
    "confirmedByName" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeReachRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeReachConfig" (
    "id" TEXT NOT NULL DEFAULT 'default-config',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "alertThresholdMinutes" INTEGER NOT NULL DEFAULT 45,
    "autoNotifyParents" BOOLEAN NOT NULL DEFAULT true,
    "allowParentSelfConfirm" BOOLEAN NOT NULL DEFAULT true,
    "allowStudentSelfConfirm" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeReachConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentMark" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentRoll" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "testCode" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "maxMarks" DOUBLE PRECISION NOT NULL,
    "marksObtained" DOUBLE PRECISION NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "answerSheetUrl" TEXT,
    "answerSheetName" TEXT,
    "answerSheetSize" INTEGER,
    "mimeType" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdById" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarkAuditLog" (
    "id" TEXT NOT NULL,
    "markId" TEXT NOT NULL,
    "oldMarks" DOUBLE PRECISION NOT NULL,
    "newMarks" DOUBLE PRECISION NOT NULL,
    "oldPercentage" DOUBLE PRECISION,
    "newPercentage" DOUBLE PRECISION,
    "changedById" TEXT NOT NULL,
    "changedByName" TEXT NOT NULL,
    "changedByRole" TEXT NOT NULL DEFAULT 'TEACHER',
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarkAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attendance_batchId_idx" ON "Attendance"("batchId");

-- CreateIndex
CREATE INDEX "Attendance_studentId_idx" ON "Attendance"("studentId");

-- CreateIndex
CREATE INDEX "Attendance_dateStr_idx" ON "Attendance"("dateStr");

-- CreateIndex
CREATE INDEX "Attendance_status_idx" ON "Attendance"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_dateStr_session_batchId_key" ON "Attendance"("studentId", "dateStr", "session", "batchId");

-- CreateIndex
CREATE INDEX "LeaveRequest_studentId_idx" ON "LeaveRequest"("studentId");

-- CreateIndex
CREATE INDEX "LeaveRequest_parentId_idx" ON "LeaveRequest"("parentId");

-- CreateIndex
CREATE INDEX "LeaveRequest_status_idx" ON "LeaveRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TestType_name_key" ON "TestType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Test_testId_key" ON "Test"("testId");

-- CreateIndex
CREATE INDEX "Test_classId_idx" ON "Test"("classId");

-- CreateIndex
CREATE INDEX "Test_boardId_idx" ON "Test"("boardId");

-- CreateIndex
CREATE INDEX "Test_subjectId_idx" ON "Test"("subjectId");

-- CreateIndex
CREATE INDEX "Test_dateStr_idx" ON "Test"("dateStr");

-- CreateIndex
CREATE INDEX "Test_testType_idx" ON "Test"("testType");

-- CreateIndex
CREATE INDEX "HomeReachRecord_studentId_idx" ON "HomeReachRecord"("studentId");

-- CreateIndex
CREATE INDEX "HomeReachRecord_batchId_idx" ON "HomeReachRecord"("batchId");

-- CreateIndex
CREATE INDEX "HomeReachRecord_dateStr_idx" ON "HomeReachRecord"("dateStr");

-- CreateIndex
CREATE INDEX "HomeReachRecord_status_idx" ON "HomeReachRecord"("status");

-- CreateIndex
CREATE UNIQUE INDEX "HomeReachRecord_studentId_dateStr_session_batchId_key" ON "HomeReachRecord"("studentId", "dateStr", "session", "batchId");

-- CreateIndex
CREATE INDEX "StudentMark_studentId_idx" ON "StudentMark"("studentId");

-- CreateIndex
CREATE INDEX "StudentMark_testId_idx" ON "StudentMark"("testId");

-- CreateIndex
CREATE INDEX "StudentMark_subjectName_idx" ON "StudentMark"("subjectName");

-- CreateIndex
CREATE INDEX "StudentMark_isPublished_idx" ON "StudentMark"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "StudentMark_studentId_testId_key" ON "StudentMark"("studentId", "testId");

-- CreateIndex
CREATE INDEX "MarkAuditLog_markId_idx" ON "MarkAuditLog"("markId");

-- CreateIndex
CREATE INDEX "MarkAuditLog_changedById_idx" ON "MarkAuditLog"("changedById");

-- CreateIndex
CREATE INDEX "MarkAuditLog_changedAt_idx" ON "MarkAuditLog"("changedAt");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeReachRecord" ADD CONSTRAINT "HomeReachRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeReachRecord" ADD CONSTRAINT "HomeReachRecord_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMark" ADD CONSTRAINT "StudentMark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMark" ADD CONSTRAINT "StudentMark_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkAuditLog" ADD CONSTRAINT "MarkAuditLog_markId_fkey" FOREIGN KEY ("markId") REFERENCES "StudentMark"("id") ON DELETE CASCADE ON UPDATE CASCADE;
