import api from './api';
import {
  StudentOverallPerformance,
  SubjectPerformanceBreakdown,
  SubjectTestProgressionItem,
  ChapterAnalysisItem,
} from '../types/analytics';

const getSeedAnalytics = (): StudentOverallPerformance => {
  // PHYSICS:
  // Line Graph: Test 1: 72%, Test 2: 78%, Test 3: 84%, Test 4: 88%
  // Chapter-wise Bar Graph: Motion: 82%, Force: 76%, Gravitation: 88%, Electricity: 91%
  const physicsProgression: SubjectTestProgressionItem[] = [
    { testNumber: 'Test 1', testName: 'Kinematics & Motion', percentage: 72, marksObtained: 18, maxMarks: 25, date: '05/08/2026' },
    { testNumber: 'Test 2', testName: 'Electricity & Circuits', percentage: 78, marksObtained: 19.5, maxMarks: 25, date: '20/08/2026' },
    { testNumber: 'Test 3', testName: 'Chapter 3: Light & Refraction', percentage: 84, marksObtained: 42, maxMarks: 50, date: '18/09/2026' },
    { testNumber: 'Test 4', testName: 'Magnetic Effects Unit Assessment', percentage: 88, marksObtained: 44, maxMarks: 50, date: '22/09/2026' },
  ];

  const physicsChapters: ChapterAnalysisItem[] = [
    { chapterName: 'Motion', percentage: 82, masteryLevel: 'Proficient', testsCount: 2, avgMarks: 20.5, maxMarks: 25 },
    { chapterName: 'Force & Laws of Motion', percentage: 76, masteryLevel: 'Proficient', testsCount: 2, avgMarks: 19.0, maxMarks: 25 },
    { chapterName: 'Gravitation', percentage: 88, masteryLevel: 'Mastered', testsCount: 2, avgMarks: 22.0, maxMarks: 25 },
    { chapterName: 'Electricity', percentage: 91, masteryLevel: 'Mastered', testsCount: 2, avgMarks: 22.75, maxMarks: 25 },
  ];

  const physics: SubjectPerformanceBreakdown = {
    subjectName: 'Physics',
    averageMarks: 33.8,
    averagePercentage: 80.5,
    highestPercentage: 88,
    lowestPercentage: 72,
    testProgression: physicsProgression,
    chapterAnalysis: physicsChapters,
  };

  // CHEMISTRY:
  // Line Graph: Test 1: 76%, Test 2: 82%, Test 3: 86%, Test 4: 92%
  // Chapter-wise Bar Graph: Chemical Reactions: 92%, Acids, Bases & Salts: 84%, Metals: 85%, Carbon: 89%
  const chemistryProgression: SubjectTestProgressionItem[] = [
    { testNumber: 'Test 1', testName: 'Chemical Reactions & Equations', percentage: 76, marksObtained: 19, maxMarks: 25, date: '12/08/2026' },
    { testNumber: 'Test 2', testName: 'Acids, Bases & Salts', percentage: 82, marksObtained: 20.5, maxMarks: 25, date: '28/08/2026' },
    { testNumber: 'Test 3', testName: 'Metals and Non-Metals', percentage: 86, marksObtained: 34.4, maxMarks: 40, date: '12/09/2026' },
    { testNumber: 'Test 4', testName: 'Carbon & its Compounds', percentage: 92, marksObtained: 46, maxMarks: 50, date: '21/09/2026' },
  ];

  const chemistryChapters: ChapterAnalysisItem[] = [
    { chapterName: 'Chemical Reactions', percentage: 92, masteryLevel: 'Mastered', testsCount: 2, avgMarks: 23, maxMarks: 25 },
    { chapterName: 'Acids, Bases & Salts', percentage: 84, masteryLevel: 'Proficient', testsCount: 2, avgMarks: 21, maxMarks: 25 },
    { chapterName: 'Metals & Non-Metals', percentage: 85, masteryLevel: 'Proficient', testsCount: 2, avgMarks: 34, maxMarks: 40 },
    { chapterName: 'Carbon & Compounds', percentage: 89, masteryLevel: 'Mastered', testsCount: 2, avgMarks: 44.5, maxMarks: 50 },
  ];

  const chemistry: SubjectPerformanceBreakdown = {
    subjectName: 'Chemistry',
    averageMarks: 32.5,
    averagePercentage: 84.0,
    highestPercentage: 92,
    lowestPercentage: 76,
    testProgression: chemistryProgression,
    chapterAnalysis: chemistryChapters,
  };

  // BIOLOGY:
  // Line Graph: Test 1: 85%, Test 2: 89%, Test 3: 94%, Test 4: 91%
  const biologyProgression: SubjectTestProgressionItem[] = [
    { testNumber: 'Test 1', testName: 'Life Processes (Nutrition)', percentage: 85, marksObtained: 21.25, maxMarks: 25, date: '10/08/2026' },
    { testNumber: 'Test 2', testName: 'Respiration & Transportation', percentage: 89, marksObtained: 22.25, maxMarks: 25, date: '25/08/2026' },
    { testNumber: 'Test 3', testName: 'Control and Coordination', percentage: 94, marksObtained: 47, maxMarks: 50, date: '08/09/2026' },
    { testNumber: 'Test 4', testName: 'How Organisms Reproduce', percentage: 91, marksObtained: 45.5, maxMarks: 50, date: '19/09/2026' },
  ];

  const biologyChapters: ChapterAnalysisItem[] = [
    { chapterName: 'Nutrition & Respiration', percentage: 94, masteryLevel: 'Mastered', testsCount: 2, avgMarks: 23.5, maxMarks: 25 },
    { chapterName: 'Transportation & Excretion', percentage: 88, masteryLevel: 'Mastered', testsCount: 2, avgMarks: 22.0, maxMarks: 25 },
    { chapterName: 'Control & Coordination', percentage: 91, masteryLevel: 'Mastered', testsCount: 2, avgMarks: 45.5, maxMarks: 50 },
    { chapterName: 'Reproduction', percentage: 86, masteryLevel: 'Proficient', testsCount: 2, avgMarks: 43.0, maxMarks: 50 },
  ];

  const biology: SubjectPerformanceBreakdown = {
    subjectName: 'Biology',
    averageMarks: 34.0,
    averagePercentage: 89.8,
    highestPercentage: 94,
    lowestPercentage: 85,
    testProgression: biologyProgression,
    chapterAnalysis: biologyChapters,
  };

  // MATHEMATICS:
  // Line Graph: Test 1: 74%, Test 2: 80%, Test 3: 88%, Test 4: 85%
  const mathProgression: SubjectTestProgressionItem[] = [
    { testNumber: 'Test 1', testName: 'Real Numbers & Polynomials', percentage: 74, marksObtained: 18.5, maxMarks: 25, date: '14/08/2026' },
    { testNumber: 'Test 2', testName: 'Linear Equations in Two Variables', percentage: 80, marksObtained: 20, maxMarks: 25, date: '30/08/2026' },
    { testNumber: 'Test 3', testName: 'Quadratic Equations Unit Assessment', percentage: 88, marksObtained: 44, maxMarks: 50, date: '14/09/2026' },
    { testNumber: 'Test 4', testName: 'Arithmetic Progressions', percentage: 85, marksObtained: 42.5, maxMarks: 50, date: '23/09/2026' },
  ];

  const mathChapters: ChapterAnalysisItem[] = [
    { chapterName: 'Real Numbers', percentage: 88, masteryLevel: 'Mastered', testsCount: 2, avgMarks: 22.0, maxMarks: 25 },
    { chapterName: 'Polynomials', percentage: 82, masteryLevel: 'Proficient', testsCount: 2, avgMarks: 20.5, maxMarks: 25 },
    { chapterName: 'Linear Equations', percentage: 80, masteryLevel: 'Proficient', testsCount: 2, avgMarks: 20.0, maxMarks: 25 },
    { chapterName: 'Quadratic Equations', percentage: 86, masteryLevel: 'Mastered', testsCount: 2, avgMarks: 43.0, maxMarks: 50 },
  ];

  const mathematics: SubjectPerformanceBreakdown = {
    subjectName: 'Mathematics',
    averageMarks: 31.25,
    averagePercentage: 81.8,
    highestPercentage: 88,
    lowestPercentage: 74,
    testProgression: mathProgression,
    chapterAnalysis: mathChapters,
  };

  return {
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    className: 'Class 10',
    boardName: 'CBSE',
    batchName: '10A Evening',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    overallAverageMarks: 32.9,
    overallPercentage: 84.7,
    attendancePercentage: 91.3,
    totalTestsConducted: 16,
    strongestSubject: 'Biology (89.8%)',
    needsFocusSubject: 'Physics (80.5%)',
    subjects: {
      physics,
      chemistry,
      biology,
      mathematics,
    },
    overallComparison: [
      { subject: 'Physics', averagePercentage: 80.5, attendanceRate: 92.0, benchmarkAvg: 74.0 },
      { subject: 'Chemistry', averagePercentage: 84.0, attendanceRate: 91.0, benchmarkAvg: 76.5 },
      { subject: 'Biology', averagePercentage: 89.8, attendanceRate: 93.5, benchmarkAvg: 78.0 },
      { subject: 'Mathematics', averagePercentage: 81.8, attendanceRate: 89.0, benchmarkAvg: 71.0 },
    ],
  };
};

export const getStudentAnalytics = async (studentId: string): Promise<StudentOverallPerformance> => {
  try {
    const response = await api.get(`/analytics/student/${studentId}`);
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
  } catch {
    // Fallback
  }
  return getSeedAnalytics();
};

export const getMyChildAnalytics = async (): Promise<StudentOverallPerformance> => {
  try {
    const response = await api.get('/analytics/me');
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
  } catch {
    // Fallback
  }
  return getSeedAnalytics();
};

export default {
  getStudentAnalytics,
  getMyChildAnalytics,
};
