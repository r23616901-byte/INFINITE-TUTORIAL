export interface SubjectScorecardItem {
  testId: string;
  testCode: string;
  testName: string; // e.g. "Test 1", "Chapter 3 Test", "Unit Test"
  date: string; // e.g. "18/09/2026"
  maxMarks: number; // e.g. 50
  marksObtained: number; // e.g. 42
  percentage: number; // e.g. 84.0
  chapter: string; // e.g. "Chapter 3: Light Reflection & Refraction"
  teacher: string; // e.g. "Prof. Rajesh Sharma"
  answerSheetUrl?: string | null;
  testPaperUrl?: string | null;
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

export interface StudentScorecard {
  studentId: string;
  studentName: string;
  studentRoll: string;
  className: string; // e.g. "Class 10"
  boardName: string; // e.g. "CBSE"
  batchName: string; // e.g. "10A Evening"
  photoUrl?: string | null;
  overallPercentage: number;
  overallGrade: string; // e.g. "A+", "A", "B"
  totalTestsConducted: number;
  subjects: {
    physics: SubjectScorecard;
    chemistry: SubjectScorecard;
    biology: SubjectScorecard;
    mathematics: SubjectScorecard;
  };
  subjectList: SubjectScorecard[];
}
