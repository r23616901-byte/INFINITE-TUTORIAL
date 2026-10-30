import api from './api';
import {
  StudentOverallPerformance,
  SubjectPerformanceBreakdown,
  SubjectTestProgressionItem,
  ChapterAnalysisItem,
} from '../types/analytics';
import { MOCK_STUDENTS, StudentDto, fetchMyStudentProfile } from './studentService';

export const getSeedAnalytics = (studentIdOrCode = 'IT10025'): StudentOverallPerformance => {
  const q = (studentIdOrCode || 'IT10025').trim().toLowerCase();
  const student: StudentDto =
    MOCK_STUDENTS.find(
      (s) =>
        s.id.toLowerCase() === q ||
        s.studentId.toLowerCase() === q ||
        s.name.toLowerCase().includes(q)
    ) || {
      id: q.startsWith('stu-') ? q : `stu-${q}`,
      studentId: q.toUpperCase(),
      name: `Student (${q.toUpperCase()})`,
      photoUrl: null,
      school: 'Infinite Tutorial',
      parentId: 'parent-gen',
      parentName: 'Parent Guardian',
      parentPhone: '9800000000',
      dateOfBirth: '2010-01-01',
      classId: 'cls-10',
      className: 'Class 10',
      boardId: 'brd-cbse',
      boardName: 'CBSE',
      batchId: 'batch-10-morning',
      batchName: '10th Morning',
      academicYear: '2024-2025',
      admissionDate: '2024-06-01',
      status: 'ACTIVE',
      createdAt: '2024-06-01',
      updatedAt: '2024-06-01',
    };

  const roll = student.studentId;
  const isClass9 =
    student.className.includes('9') ||
    student.boardName.toLowerCase().includes('karnataka') ||
    roll === 'IT10028';

  // Deterministic multiplier based on student
  let factor = 1.0;
  if (roll === 'IT10026') factor = 1.12; // Sneha (high achiever)
  else if (roll === 'IT10027') factor = 0.92; // Aditya
  else if (roll === 'IT10028') factor = 1.05; // Priya
  else {
    let sum = 0;
    for (let i = 0; i < roll.length; i++) sum += roll.charCodeAt(i);
    factor = 0.94 + ((sum % 14) / 100);
  }

  const clamp = (val: number, min = 40, max = 98) => Math.min(max, Math.max(min, Math.round(val * 10) / 10));

  let physicsProgression: SubjectTestProgressionItem[];
  let physicsChapters: ChapterAnalysisItem[];
  let chemistryProgression: SubjectTestProgressionItem[];
  let chemistryChapters: ChapterAnalysisItem[];
  let biologyProgression: SubjectTestProgressionItem[];
  let biologyChapters: ChapterAnalysisItem[];
  let mathProgression: SubjectTestProgressionItem[];
  let mathChapters: ChapterAnalysisItem[];

  if (isClass9) {
    // CLASS 9 CURRICULUM
    physicsProgression = [
      { testNumber: 'Test 1', testName: 'Kinematics & Motion Graphs', percentage: clamp(88 * factor), marksObtained: clamp(22 * factor, 12, 25), maxMarks: 25, date: '08/08/2026' },
      { testNumber: 'Test 2', testName: 'Force & Laws of Motion', percentage: clamp(90 * factor), marksObtained: clamp(36 * factor, 20, 40), maxMarks: 40, date: '28/08/2026' },
      { testNumber: 'Test 3', testName: 'Gravitation & Free Fall', percentage: clamp(91 * factor), marksObtained: clamp(45.5 * factor, 25, 50), maxMarks: 50, date: '18/09/2026' },
      { testNumber: 'Test 4', testName: 'Work, Energy & Power', percentage: clamp(87 * factor), marksObtained: clamp(43.5 * factor, 24, 50), maxMarks: 50, date: '25/09/2026' },
    ];

    physicsChapters = [
      { chapterName: 'Motion', percentage: clamp(92 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(23 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Force & Laws of Motion', percentage: clamp(89 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(22.25 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Gravitation', percentage: clamp(90 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(22.5 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Work & Energy', percentage: clamp(86 * factor), masteryLevel: 'Proficient', testsCount: 2, avgMarks: clamp(21.5 * factor, 10, 25), maxMarks: 25 },
    ];

    chemistryProgression = [
      { testNumber: 'Test 1', testName: 'Matter in Our Surroundings', percentage: clamp(86 * factor), marksObtained: clamp(21.5 * factor, 12, 25), maxMarks: 25, date: '12/08/2026' },
      { testNumber: 'Test 2', testName: 'Is Matter Around Us Pure?', percentage: clamp(89 * factor), marksObtained: clamp(35.6 * factor, 20, 40), maxMarks: 40, date: '30/08/2026' },
      { testNumber: 'Test 3', testName: 'Atoms and Molecules', percentage: clamp(88 * factor), marksObtained: clamp(44 * factor, 25, 50), maxMarks: 50, date: '16/09/2026' },
      { testNumber: 'Test 4', testName: 'Structure of the Atom', percentage: clamp(85 * factor), marksObtained: clamp(42.5 * factor, 24, 50), maxMarks: 50, date: '23/09/2026' },
    ];

    chemistryChapters = [
      { chapterName: 'Matter in Our Surroundings', percentage: clamp(87 * factor), masteryLevel: 'Proficient', testsCount: 2, avgMarks: clamp(21.75 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Is Matter Around Us Pure', percentage: clamp(90 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(22.5 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Atoms & Molecules', percentage: clamp(88 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(35.2 * factor, 15, 40), maxMarks: 40 },
      { chapterName: 'Structure of Atom', percentage: clamp(86 * factor), masteryLevel: 'Proficient', testsCount: 2, avgMarks: clamp(43 * factor, 20, 50), maxMarks: 50 },
    ];

    biologyProgression = [
      { testNumber: 'Test 1', testName: 'Fundamental Unit of Life (Cell)', percentage: clamp(92 * factor), marksObtained: clamp(23 * factor, 12, 25), maxMarks: 25, date: '10/08/2026' },
      { testNumber: 'Test 2', testName: 'Plant & Animal Tissues', percentage: clamp(88 * factor), marksObtained: clamp(35.2 * factor, 20, 40), maxMarks: 40, date: '26/08/2026' },
      { testNumber: 'Test 3', testName: 'Diversity in Living Organisms', percentage: clamp(85 * factor), marksObtained: clamp(42.5 * factor, 25, 50), maxMarks: 50, date: '14/09/2026' },
      { testNumber: 'Test 4', testName: 'Natural Resources & Ecology', percentage: clamp(91 * factor), marksObtained: clamp(45.5 * factor, 25, 50), maxMarks: 50, date: '21/09/2026' },
    ];

    biologyChapters = [
      { chapterName: 'Cell - Fundamental Unit', percentage: clamp(93 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(23.25 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Tissues (Plant & Animal)', percentage: clamp(88 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(22 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Diversity of Organisms', percentage: clamp(85 * factor), masteryLevel: 'Proficient', testsCount: 2, avgMarks: clamp(42.5 * factor, 20, 50), maxMarks: 50 },
      { chapterName: 'Natural Resources', percentage: clamp(90 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(45 * factor, 20, 50), maxMarks: 50 },
    ];

    mathProgression = [
      { testNumber: 'Test 1', testName: 'Number Systems & Exponents', percentage: clamp(94 * factor), marksObtained: clamp(23.5 * factor, 12, 25), maxMarks: 25, date: '14/08/2026' },
      { testNumber: 'Test 2', testName: 'Polynomials & Factorization', percentage: clamp(88 * factor), marksObtained: clamp(35.2 * factor, 20, 40), maxMarks: 40, date: '01/09/2026' },
      { testNumber: 'Test 3', testName: 'Coordinate Geometry & Linear Eq', percentage: clamp(91 * factor), marksObtained: clamp(45.5 * factor, 25, 50), maxMarks: 50, date: '15/09/2026' },
      { testNumber: 'Test 4', testName: 'Lines, Angles & Triangles', percentage: clamp(89 * factor), marksObtained: clamp(44.5 * factor, 25, 50), maxMarks: 50, date: '24/09/2026' },
    ];

    mathChapters = [
      { chapterName: 'Number Systems', percentage: clamp(94 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(23.5 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Polynomials', percentage: clamp(88 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(22 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Coordinate Geometry', percentage: clamp(92 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(36.8 * factor, 15, 40), maxMarks: 40 },
      { chapterName: 'Linear Equations in 2 Var', percentage: clamp(87 * factor), masteryLevel: 'Proficient', testsCount: 2, avgMarks: clamp(43.5 * factor, 20, 50), maxMarks: 50 },
      { chapterName: 'Lines & Angles', percentage: clamp(89 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(44.5 * factor, 20, 50), maxMarks: 50 },
    ];
  } else {
    // CLASS 10 CURRICULUM
    physicsProgression = [
      { testNumber: 'Test 1', testName: 'Kinematics & Motion', percentage: clamp(72 * factor), marksObtained: clamp(18 * factor, 10, 25), maxMarks: 25, date: '05/08/2026' },
      { testNumber: 'Test 2', testName: 'Electricity & Circuits', percentage: clamp(78 * factor), marksObtained: clamp(19.5 * factor, 10, 25), maxMarks: 25, date: '20/08/2026' },
      { testNumber: 'Test 3', testName: 'Chapter 3: Light & Refraction', percentage: clamp(84 * factor), marksObtained: clamp(42 * factor, 20, 50), maxMarks: 50, date: '18/09/2026' },
      { testNumber: 'Test 4', testName: 'Magnetic Effects Unit Assessment', percentage: clamp(88 * factor), marksObtained: clamp(44 * factor, 20, 50), maxMarks: 50, date: '22/09/2026' },
    ];

    physicsChapters = [
      { chapterName: 'Motion', percentage: clamp(82 * factor), masteryLevel: 'Proficient', testsCount: 2, avgMarks: clamp(20.5 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Force & Laws of Motion', percentage: clamp(76 * factor), masteryLevel: 'Proficient', testsCount: 2, avgMarks: clamp(19.0 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Gravitation', percentage: clamp(88 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(22.0 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Electricity', percentage: clamp(91 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(22.75 * factor, 10, 25), maxMarks: 25 },
    ];

    chemistryProgression = [
      { testNumber: 'Test 1', testName: 'Chemical Reactions & Equations', percentage: clamp(76 * factor), marksObtained: clamp(19 * factor, 10, 25), maxMarks: 25, date: '12/08/2026' },
      { testNumber: 'Test 2', testName: 'Acids, Bases & Salts', percentage: clamp(82 * factor), marksObtained: clamp(20.5 * factor, 10, 25), maxMarks: 25, date: '28/08/2026' },
      { testNumber: 'Test 3', testName: 'Metals and Non-Metals', percentage: clamp(86 * factor), marksObtained: clamp(34.4 * factor, 15, 40), maxMarks: 40, date: '12/09/2026' },
      { testNumber: 'Test 4', testName: 'Carbon & its Compounds', percentage: clamp(92 * factor), marksObtained: clamp(46 * factor, 20, 50), maxMarks: 50, date: '21/09/2026' },
    ];

    chemistryChapters = [
      { chapterName: 'Chemical Reactions', percentage: clamp(92 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(23 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Acids, Bases & Salts', percentage: clamp(84 * factor), masteryLevel: 'Proficient', testsCount: 2, avgMarks: clamp(21 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Metals & Non-Metals', percentage: clamp(85 * factor), masteryLevel: 'Proficient', testsCount: 2, avgMarks: clamp(34 * factor, 15, 40), maxMarks: 40 },
      { chapterName: 'Carbon & Compounds', percentage: clamp(89 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(44.5 * factor, 20, 50), maxMarks: 50 },
    ];

    biologyProgression = [
      { testNumber: 'Test 1', testName: 'Life Processes (Nutrition)', percentage: clamp(85 * factor), marksObtained: clamp(21.25 * factor, 10, 25), maxMarks: 25, date: '10/08/2026' },
      { testNumber: 'Test 2', testName: 'Respiration & Transportation', percentage: clamp(89 * factor), marksObtained: clamp(22.25 * factor, 10, 25), maxMarks: 25, date: '25/08/2026' },
      { testNumber: 'Test 3', testName: 'Control and Coordination', percentage: clamp(94 * factor), marksObtained: clamp(47 * factor, 20, 50), maxMarks: 50, date: '08/09/2026' },
      { testNumber: 'Test 4', testName: 'How Organisms Reproduce', percentage: clamp(91 * factor), marksObtained: clamp(45.5 * factor, 20, 50), maxMarks: 50, date: '19/09/2026' },
    ];

    biologyChapters = [
      { chapterName: 'Nutrition & Respiration', percentage: clamp(94 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(23.5 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Transportation & Excretion', percentage: clamp(88 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(22.0 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Control & Coordination', percentage: clamp(91 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(45.5 * factor, 20, 50), maxMarks: 50 },
      { chapterName: 'Reproduction', percentage: clamp(86 * factor), masteryLevel: 'Proficient', testsCount: 2, avgMarks: clamp(43.0 * factor, 20, 50), maxMarks: 50 },
    ];

    mathProgression = [
      { testNumber: 'Test 1', testName: 'Real Numbers & Polynomials', percentage: clamp(74 * factor), marksObtained: clamp(18.5 * factor, 10, 25), maxMarks: 25, date: '14/08/2026' },
      { testNumber: 'Test 2', testName: 'Linear Equations in Two Variables', percentage: clamp(80 * factor), marksObtained: clamp(20 * factor, 10, 25), maxMarks: 25, date: '30/08/2026' },
      { testNumber: 'Test 3', testName: 'Quadratic Equations Unit Assessment', percentage: clamp(88 * factor), marksObtained: clamp(44 * factor, 20, 50), maxMarks: 50, date: '14/09/2026' },
      { testNumber: 'Test 4', testName: 'Arithmetic Progressions', percentage: clamp(85 * factor), marksObtained: clamp(42.5 * factor, 20, 50), maxMarks: 50, date: '23/09/2026' },
    ];

    mathChapters = [
      { chapterName: 'Real Numbers', percentage: clamp(88 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(22.0 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Polynomials', percentage: clamp(82 * factor), masteryLevel: 'Proficient', testsCount: 2, avgMarks: clamp(20.5 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Linear Equations', percentage: clamp(80 * factor), masteryLevel: 'Proficient', testsCount: 2, avgMarks: clamp(20.0 * factor, 10, 25), maxMarks: 25 },
      { chapterName: 'Quadratic Equations', percentage: clamp(86 * factor), masteryLevel: 'Mastered', testsCount: 2, avgMarks: clamp(43.0 * factor, 20, 50), maxMarks: 50 },
    ];
  }

  const calcAvg = (prog: SubjectTestProgressionItem[], fallbackAvg: number) => {
    const pcts = prog.map((p) => p.percentage);
    const avgPct = pcts.length > 0 ? Math.round((pcts.reduce((a, b) => a + b, 0) / pcts.length) * 10) / 10 : fallbackAvg;
    const marks = prog.map((p) => p.marksObtained);
    const avgMarks = marks.length > 0 ? Math.round((marks.reduce((a, b) => a + b, 0) / marks.length) * 10) / 10 : fallbackAvg * 0.4;
    return {
      averagePercentage: avgPct,
      averageMarks: avgMarks,
      highestPercentage: pcts.length > 0 ? Math.max(...pcts) : avgPct,
      lowestPercentage: pcts.length > 0 ? Math.min(...pcts) : avgPct,
    };
  };

  const phyStat = calcAvg(physicsProgression, 80.5);
  const chmStat = calcAvg(chemistryProgression, 84.0);
  const bioStat = calcAvg(biologyProgression, 89.8);
  const matStat = calcAvg(mathProgression, 81.8);

  const physics: SubjectPerformanceBreakdown = {
    subjectName: 'Physics',
    averageMarks: phyStat.averageMarks,
    averagePercentage: phyStat.averagePercentage,
    highestPercentage: phyStat.highestPercentage,
    lowestPercentage: phyStat.lowestPercentage,
    testProgression: physicsProgression,
    chapterAnalysis: physicsChapters,
  };

  const chemistry: SubjectPerformanceBreakdown = {
    subjectName: 'Chemistry',
    averageMarks: chmStat.averageMarks,
    averagePercentage: chmStat.averagePercentage,
    highestPercentage: chmStat.highestPercentage,
    lowestPercentage: chmStat.lowestPercentage,
    testProgression: chemistryProgression,
    chapterAnalysis: chemistryChapters,
  };

  const biology: SubjectPerformanceBreakdown = {
    subjectName: 'Biology',
    averageMarks: bioStat.averageMarks,
    averagePercentage: bioStat.averagePercentage,
    highestPercentage: bioStat.highestPercentage,
    lowestPercentage: bioStat.lowestPercentage,
    testProgression: biologyProgression,
    chapterAnalysis: biologyChapters,
  };

  const mathematics: SubjectPerformanceBreakdown = {
    subjectName: 'Mathematics',
    averageMarks: matStat.averageMarks,
    averagePercentage: matStat.averagePercentage,
    highestPercentage: matStat.highestPercentage,
    lowestPercentage: matStat.lowestPercentage,
    testProgression: mathProgression,
    chapterAnalysis: mathChapters,
  };

  const allPercentages = [
    physics.averagePercentage,
    chemistry.averagePercentage,
    biology.averagePercentage,
    mathematics.averagePercentage,
  ];
  const overallPercentage = Math.round((allPercentages.reduce((a, b) => a + b, 0) / 4) * 10) / 10;
  const overallAverageMarks = Math.round(((phyStat.averageMarks + chmStat.averageMarks + bioStat.averageMarks + matStat.averageMarks) / 4) * 10) / 10;
  const attendancePercentage = roll === 'IT10026' ? 95.0 : roll === 'IT10028' ? 93.5 : roll === 'IT10027' ? 88.5 : 91.3;

  const subjectsRank = [
    { name: 'Physics', pct: physics.averagePercentage },
    { name: 'Chemistry', pct: chemistry.averagePercentage },
    { name: 'Biology', pct: biology.averagePercentage },
    { name: 'Mathematics', pct: mathematics.averagePercentage },
  ];
  subjectsRank.sort((a, b) => b.pct - a.pct);

  return {
    studentId: student.id,
    studentName: student.name,
    studentRoll: student.studentId,
    className: student.className,
    boardName: student.boardName,
    batchName: student.batchName,
    photoUrl: student.photoUrl || null,
    overallAverageMarks,
    overallPercentage,
    attendancePercentage,
    totalTestsConducted: physicsProgression.length + chemistryProgression.length + biologyProgression.length + mathProgression.length,
    strongestSubject: `${subjectsRank[0].name} (${subjectsRank[0].pct}%)`,
    needsFocusSubject: `${subjectsRank[subjectsRank.length - 1].name} (${subjectsRank[subjectsRank.length - 1].pct}%)`,
    subjects: {
      physics,
      chemistry,
      biology,
      mathematics,
    },
    overallComparison: [
      { subject: 'Physics', averagePercentage: physics.averagePercentage, attendanceRate: clamp(attendancePercentage + 1.2, 70, 99), benchmarkAvg: 74.0 },
      { subject: 'Chemistry', averagePercentage: chemistry.averagePercentage, attendanceRate: clamp(attendancePercentage - 0.8, 70, 99), benchmarkAvg: 76.5 },
      { subject: 'Biology', averagePercentage: biology.averagePercentage, attendanceRate: clamp(attendancePercentage + 1.7, 70, 99), benchmarkAvg: 78.0 },
      { subject: 'Mathematics', averagePercentage: mathematics.averagePercentage, attendanceRate: clamp(attendancePercentage + 0.5, 70, 99), benchmarkAvg: 71.0 },
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
    // Resilient fallback with student ID passed
  }
  return getSeedAnalytics(studentId);
};

export const getMyChildAnalytics = async (): Promise<StudentOverallPerformance> => {
  try {
    const response = await api.get('/analytics/me');
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
  } catch {
    // Resilient fallback
  }
  const myProfile = await fetchMyStudentProfile().catch(() => null);
  return getSeedAnalytics(myProfile?.id || myProfile?.studentId || 'IT10025');
};

export default {
  getStudentAnalytics,
  getMyChildAnalytics,
  getSeedAnalytics,
};
