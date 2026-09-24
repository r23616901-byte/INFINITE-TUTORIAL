export interface TestType {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface TestItem {
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestPayload {
  testId?: string;
  name: string;
  classId: string;
  boardId: string;
  subjectId: string;
  chapter: string;
  testType: string;
  date: string;
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

export interface UploadedTestPaperResponse {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}
