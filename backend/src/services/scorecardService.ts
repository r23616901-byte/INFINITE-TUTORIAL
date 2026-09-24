import {
  StudentScorecardDto,
  SubjectScorecard,
  SubjectScorecardItem,
} from '../types';
import { getStudents, getStudentForParent, isStudentAuthorizedForUser } from './studentService';
import { getMarks } from './markService';
import { getTests } from './testService';

// Standard 4 Core Subjects for Infinite Tutorial
export const CORE_SUBJECTS = ['Physics', 'Chemistry', 'Biology', 'Mathematics'] as const;

/**
 * Pre-seeded sample tests for Rahul Kumar (IT10025)
 * Providing rich demonstration across Physics, Chemistry, Biology, Mathematics
 */
const DEFAULT_RAHUL_SUBJECT_TESTS: Record<string, SubjectScorecardItem[]> = {
  Physics: [
    {
      testId: 'tst-cbse10-phy-003',
      testCode: 'TST-10-PHY-003',
      testName: 'Chapter 3 Test',
      date: '18/09/2026',
      maxMarks: 50,
      marksObtained: 42,
      percentage: 84.0,
      chapter: 'Chapter 3: Light Reflection & Refraction',
      teacher: 'Prof. Rajesh Sharma (Physics)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Physics_Ch3_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Light_Test.pdf',
      remarks: 'Strong conceptual clarity. Rechecked question 4 (+4 marks).',
    },
    {
      testId: 'tst-cbse10-phy-001',
      testCode: 'TST-10-PHY-001',
      testName: 'Test 1',
      date: '05/08/2026',
      maxMarks: 25,
      marksObtained: 22,
      percentage: 88.0,
      chapter: 'Chapter 1: Electricity & Circuits',
      teacher: 'Prof. Rajesh Sharma (Physics)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Physics_Test1_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Electricity.pdf',
      remarks: 'Excellent circuit diagrams and formula derivation.',
    },
    {
      testId: 'tst-cbse10-phy-002',
      testCode: 'TST-10-PHY-002',
      testName: 'Test 2',
      date: '28/08/2026',
      maxMarks: 40,
      marksObtained: 35,
      percentage: 87.5,
      chapter: 'Chapter 2: Magnetic Effects of Electric Current',
      teacher: 'Prof. Rajesh Sharma (Physics)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Physics_Test2_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Magnetism.pdf',
      remarks: 'Good grasp of Fleming’s Left-Hand rule.',
    },
  ],
  Chemistry: [
    {
      testId: 'tst-cbse10-chm-001',
      testCode: 'TST-10-CHM-001',
      testName: 'Test 1',
      date: '12/08/2026',
      maxMarks: 25,
      marksObtained: 23,
      percentage: 92.0,
      chapter: 'Chapter 1: Chemical Reactions and Equations',
      teacher: 'Dr. Anita Desai (Chemistry)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Chemistry_Test1_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/Chemistry_Ch1_Equations_Test1.pdf',
      remarks: 'Balanced all chemical reactions perfectly.',
    },
    {
      testId: 'tst-cbse10-chm-002',
      testCode: 'TST-10-CHM-002',
      testName: 'Test 2',
      date: '02/09/2026',
      maxMarks: 25,
      marksObtained: 21,
      percentage: 84.0,
      chapter: 'Chapter 2: Acids, Bases and Salts',
      teacher: 'Dr. Anita Desai (Chemistry)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Chemistry_Test2_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/Chemistry_Ch2_Acids_Bases.pdf',
      remarks: 'Clear distinction between strong and weak acids.',
    },
    {
      testId: 'tst-cbse10-chm-003',
      testCode: 'TST-10-CHM-003',
      testName: 'Chapter Test',
      date: '19/09/2026',
      maxMarks: 40,
      marksObtained: 34,
      percentage: 85.0,
      chapter: 'Chapter 3: Metals and Non-Metals',
      teacher: 'Dr. Anita Desai (Chemistry)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Chemistry_Ch3_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/Chemistry_Ch3_Metals_NonMetals.pdf',
      remarks: 'Very neat reactivity series chart.',
    },
  ],
  Biology: [
    {
      testId: 'tst-cbse10-bio-001',
      testCode: 'TST-10-BIO-001',
      testName: 'Test 1',
      date: '15/08/2026',
      maxMarks: 30,
      marksObtained: 27,
      percentage: 90.0,
      chapter: 'Chapter 1: Life Processes - Nutrition & Respiration',
      teacher: 'Mrs. Sunita Rao (Biology)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Bio_Test1_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/Biology_Ch1_LifeProcesses.pdf',
      remarks: 'Human heart circulation diagram drawn accurately.',
    },
    {
      testId: 'tst-cbse10-bio-002',
      testCode: 'TST-10-BIO-002',
      testName: 'Test 2',
      date: '08/09/2026',
      maxMarks: 30,
      marksObtained: 26,
      percentage: 86.7,
      chapter: 'Chapter 2: Control and Coordination',
      teacher: 'Mrs. Sunita Rao (Biology)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Bio_Test2_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/Biology_Ch2_ControlCoordination.pdf',
      remarks: 'Neuron reflex arc explained concisely.',
    },
    {
      testId: 'tst-cbse10-bio-003',
      testCode: 'TST-10-BIO-003',
      testName: 'Chapter Test',
      date: '21/09/2026',
      maxMarks: 40,
      marksObtained: 36,
      percentage: 90.0,
      chapter: 'Chapter 3: How do Organisms Reproduce?',
      teacher: 'Mrs. Sunita Rao (Biology)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Bio_Ch3_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/Biology_Ch3_Reproduction.pdf',
      remarks: 'Thorough answers in pollination mechanisms.',
    },
  ],
  Mathematics: [
    {
      testId: 'tst-cbse10-mat-001',
      testCode: 'TST-10-MAT-001',
      testName: 'Test 1',
      date: '10/08/2026',
      maxMarks: 40,
      marksObtained: 38,
      percentage: 95.0,
      chapter: 'Chapter 1: Real Numbers & Fundamental Theorem',
      teacher: 'Prof. Rajesh Sharma (Mathematics)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Maths_Test1_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_Unit_Test_1.pdf',
      remarks: 'Flawless proof of irrationality.',
    },
    {
      testId: 'tst-cbse10-mat-002',
      testCode: 'TST-10-MAT-002',
      testName: 'Test 2',
      date: '25/08/2026',
      maxMarks: 40,
      marksObtained: 34,
      percentage: 85.0,
      chapter: 'Chapter 2: Polynomials & Zeroes',
      teacher: 'Prof. Rajesh Sharma (Mathematics)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Maths_Test2_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_Polynomials.pdf',
      remarks: 'Good graphical interpretation of zeroes.',
    },
    {
      testId: 'tst-cbse10-mat-003',
      testCode: 'TST-10-MAT-003',
      testName: 'Chapter Test',
      date: '16/09/2026',
      maxMarks: 50,
      marksObtained: 45,
      percentage: 90.0,
      chapter: 'Chapter 3: Linear Equations in Two Variables',
      teacher: 'Prof. Rajesh Sharma (Mathematics)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Maths_Ch3_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_LinearEquations.pdf',
      remarks: 'Cross-multiplication method applied correctly.',
    },
  ],
};

const calculateGrade = (pct: number): string => {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  return 'D';
};

/**
 * Generate complete 4-Subject Scorecard for a Student
 * Physics, Chemistry, Biology, Mathematics
 */
export const getStudentScorecard = async (
  targetStudentId: string,
  user: { id: string; role: string; phone?: string; studentId?: string } = { id: 'admin-001', role: 'ADMIN' }
): Promise<StudentScorecardDto> => {
  const { students } = await getStudents({ limit: 100 });

  let student: any = null;

  if (targetStudentId === 'me' || (user.role === 'PARENT' && (!targetStudentId || targetStudentId === 'me'))) {
    student = await getStudentForParent(user.id, user.phone);
  } else {
    student = students.find(
      (s: any) =>
        s.id.toLowerCase() === targetStudentId.toLowerCase() ||
        s.studentId.toLowerCase() === targetStudentId.toLowerCase()
    );
  }

  if (!student) {
    throw new Error('Student not found');
  }

  // Strict Privacy Barrier: Parent can ONLY access their linked child's scorecard
  if (user.role === 'PARENT') {
    const isAuthorized = await isStudentAuthorizedForUser(student.id, user);
    if (!isAuthorized) {
      throw new Error(
        'Access Denied: You are not authorized to view another student’s scorecard'
      );
    }
  }

  // 1. Fetch live marks and test papers recorded in system
  const [allMarks, allTests] = await Promise.all([
    getMarks({ studentId: student.id }, { id: 'admin', role: 'ADMIN' }),
    getTests(),
  ]);

  // Group tests into the 4 core subjects
  const subjectMap: Record<string, SubjectScorecardItem[]> = {
    Physics: [],
    Chemistry: [],
    Biology: [],
    Mathematics: [],
  };

  // If student is Rahul Kumar or has seed, include base seed tests
  if (student.studentId === 'IT10025' || student.name === 'Rahul Kumar') {
    for (const sub of CORE_SUBJECTS) {
      subjectMap[sub] = [...(DEFAULT_RAHUL_SUBJECT_TESTS[sub] || [])];
    }
  }

  // Merge any live marks entered for this student into respective subject bucket
  for (const mark of allMarks) {
    // Only include published marks
    if (!mark.isPublished) continue;

    // Find linked test paper URL from tests catalog
    const testDef = allTests.find(
      (t) => t.id === mark.testId || t.testId === mark.testCode
    );
    const testPaperUrl = testDef?.testPaperUrl || '/uploads/test-papers/CBSE_Class10_Physics_Light_Test.pdf';
    const chapterName = testDef?.chapter || 'Chapter 3: Light Reflection & Refraction';

    const item: SubjectScorecardItem = {
      testId: mark.testId,
      testCode: mark.testCode,
      testName: mark.testName,
      date: new Date(mark.createdAt).toLocaleDateString('en-GB'),
      maxMarks: mark.maxMarks,
      marksObtained: mark.marksObtained,
      percentage: mark.percentage,
      chapter: chapterName,
      teacher: mark.createdByName || 'Faculty Teacher',
      answerSheetUrl: mark.answerSheetUrl,
      testPaperUrl,
      remarks: mark.remarks,
    };

    // Determine subject bucket
    const normSubject = mark.subjectName.toLowerCase();
    if (normSubject.includes('physic')) {
      // Replace if existing or append
      const existingIdx = subjectMap.Physics.findIndex((t) => t.testCode === mark.testCode || t.testName === mark.testName);
      if (existingIdx >= 0) subjectMap.Physics[existingIdx] = item;
      else subjectMap.Physics.unshift(item);
    } else if (normSubject.includes('chem')) {
      const existingIdx = subjectMap.Chemistry.findIndex((t) => t.testCode === mark.testCode || t.testName === mark.testName);
      if (existingIdx >= 0) subjectMap.Chemistry[existingIdx] = item;
      else subjectMap.Chemistry.unshift(item);
    } else if (normSubject.includes('bio')) {
      const existingIdx = subjectMap.Biology.findIndex((t) => t.testCode === mark.testCode || t.testName === mark.testName);
      if (existingIdx >= 0) subjectMap.Biology[existingIdx] = item;
      else subjectMap.Biology.unshift(item);
    } else if (normSubject.includes('math')) {
      const existingIdx = subjectMap.Mathematics.findIndex((t) => t.testCode === mark.testCode || t.testName === mark.testName);
      if (existingIdx >= 0) subjectMap.Mathematics[existingIdx] = item;
      else subjectMap.Mathematics.unshift(item);
    }
  }

  // Build subject scorecards
  let cumulativeMaxMarks = 0;
  let cumulativeMarksObtained = 0;
  let totalTestsConducted = 0;

  const buildSubjectScorecard = (subjectName: 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics'): SubjectScorecard => {
    const tests = subjectMap[subjectName] || [];
    const totalTests = tests.length;
    const totalMaxMarks = tests.reduce((sum, t) => sum + t.maxMarks, 0);
    const totalMarksObtained = tests.reduce((sum, t) => sum + t.marksObtained, 0);
    const averagePercentage = totalMaxMarks > 0 ? Number(((totalMarksObtained / totalMaxMarks) * 100).toFixed(1)) : 0;
    const highestPercentage = tests.length > 0 ? Math.max(...tests.map((t) => t.percentage)) : 0;

    cumulativeMaxMarks += totalMaxMarks;
    cumulativeMarksObtained += totalMarksObtained;
    totalTestsConducted += totalTests;

    return {
      subjectName,
      totalTests,
      totalMaxMarks,
      totalMarksObtained,
      averagePercentage,
      highestPercentage,
      tests,
    };
  };

  const physicsScorecard = buildSubjectScorecard('Physics');
  const chemistryScorecard = buildSubjectScorecard('Chemistry');
  const biologyScorecard = buildSubjectScorecard('Biology');
  const mathematicsScorecard = buildSubjectScorecard('Mathematics');

  const overallPercentage =
    cumulativeMaxMarks > 0
      ? Number(((cumulativeMarksObtained / cumulativeMaxMarks) * 100).toFixed(1))
      : 86.5;

  const overallGrade = calculateGrade(overallPercentage);

  return {
    studentId: student.id,
    studentName: student.name,
    studentRoll: student.studentId,
    className: student.className || 'Class 10',
    boardName: student.boardName || 'CBSE',
    batchName: student.batchName || '10A Evening',
    photoUrl: student.photoUrl,
    overallPercentage,
    overallGrade,
    totalTestsConducted,
    subjects: {
      physics: physicsScorecard,
      chemistry: chemistryScorecard,
      biology: biologyScorecard,
      mathematics: mathematicsScorecard,
    },
    subjectList: [physicsScorecard, chemistryScorecard, biologyScorecard, mathematicsScorecard],
  };
};

export default {
  getStudentScorecard,
  CORE_SUBJECTS,
};
