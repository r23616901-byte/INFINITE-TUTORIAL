export interface SubjectTestProgressionItem {
  testNumber: string;         // e.g. "Test 1", "Test 2", "Test 3", "Test 4"
  testName: string;           // e.g. "Kinematics & Motion", "Electricity & Circuits"
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

export interface StudentOverallPerformance {
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
