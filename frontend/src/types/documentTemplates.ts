/**
 * Infinite Tutorial — Universal Document Template & Printing System Types
 * Defines standard interfaces for official examination papers and academic reports.
 */

export type DocumentType = 
  | 'QUESTION_PAPER'
  | 'ANSWER_KEY'
  | 'SCORECARD'
  | 'PERFORMANCE_ANALYSIS'
  | 'PORTION_COMPLETION'
  | 'ATTENDANCE_REPORT'
  | 'BATCH_REPORT'
  | 'TEACHER_REPORT'
  | 'TEST_RESULT_LEDGER'
  | 'STUDENT_PROFILE';

export type AnswerSpaceType = 'none' | 'lines' | 'box' | 'diagram' | 'calculation';

export interface DocumentMetadata {
  studentName?: string;
  studentId?: string;
  rollNumber?: string;
  className?: string;
  boardName?: string;
  batchName?: string;
  schoolName?: string;
  subjectName?: string;
  subjectCode?: string;
  facultyName?: string;
  parentName?: string;
  parentPhone?: string;
  academicYear?: string;
  reportingPeriod?: string;
  testName?: string;
  testDate?: string;
  maxMarks?: number;
  duration?: string;
  generatedBy?: string;
  generatedDate?: string;
  examNumber?: string;
}

export interface QuestionData {
  questionNumber: number;
  text: string;
  marks: number;
  options?: string[]; // Multiple choice options (e.g. A, B, C, D)
  answerKey?: string; // Teacher solution & evaluation criteria
  chapter?: string;
  subQuestions?: Array<{
    subNumber: string; // e.g. "(a)", "(b)"
    text: string;
    marks: number;
    answerKey?: string;
  }>;
  diagramUrl?: string; // Optional diagram / illustration image URL
  diagramCaption?: string;
  requiresDiagram?: boolean; // If true, adds a diagram drawing workspace
  answerSpace?: AnswerSpaceType; // Custom answer space override for this question
  answerSpaceLines?: number; // Number of ruled lines (default 4-8)
}

export interface QuestionSectionData {
  sectionName: string; // e.g. "Section A (Multiple Choice Questions)"
  instructions: string; // e.g. "Answer all questions. Each question carries 1 mark."
  totalMarks: number;
  questions: QuestionData[];
  defaultAnswerSpace?: AnswerSpaceType;
}

export interface ExaminationPaperData {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  className: string;
  classId?: string;
  boardName: string;
  boardId?: string;
  batchName?: string;
  duration: string;
  totalMarks: number;
  academicYear: string;
  examDate?: string;
  generalInstructions: string[];
  sections: QuestionSectionData[];
  customNote?: string;
}

export interface StudentScorecardItem {
  subjectName: string;
  subjectCode?: string;
  maxMarks: number;
  marksObtained: number;
  percentage: number;
  grade?: string;
  status?: 'PASS' | 'FAIL' | 'NEEDS_IMPROVEMENT' | 'DISTINCTION';
  remarks?: string;
  testsCount?: number;
  facultyName?: string;
}

export interface AcademicReportData {
  reportId: string;
  reportTitle: string;
  reportCategory: string;
  academicYear?: string;
  reportingPeriod?: string;
  metadata: DocumentMetadata;
  summaryMetrics?: Array<{
    label: string;
    value: string | number;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }>;
  tableData?: {
    columns: Array<{
      key: string;
      header: string;
      align?: 'left' | 'center' | 'right';
      width?: string;
    }>;
    rows: Array<Record<string, any>>;
  };
  customSections?: Array<{
    title: string;
    content?: React.ReactNode;
    keyValues?: Array<{ label: string; value: string | number }>;
  }>;
  chartSummary?: {
    title: string;
    description?: string;
    items: Array<{ label: string; percentage: number; value?: string | number }>;
  };
  recommendations?: string[];
  customFooterNote?: string;
}

export interface PrintSettings {
  orientation: 'portrait' | 'landscape';
  paperSize?: 'A4' | 'Letter';
  includeAnswerKey?: boolean;
  answerSpacePreference?: AnswerSpaceType;
  showSignatures?: boolean;
  showStudentDetailsFillIn?: boolean;
  prefillStudentDetails?: boolean;
  studentName?: string;
  rollNumber?: string;
  customInstructions?: string[];
}

export interface TemplateSettings {
  institutionName: string;
  institutionSubtitle: string;
  institutionAddress: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  defaultPaperSize: 'A4';
  defaultOrientation: 'portrait' | 'landscape';
  showWatermark: boolean;
  confidentialityNote: string;
}
