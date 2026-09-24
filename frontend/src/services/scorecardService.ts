import api from './api';
import { StudentScorecard, SubjectScorecard } from '../types/scorecard';

// Pre-seeded authentic scorecard data for Rahul Kumar (IT10025, 10A Evening)
const getSeedScorecard = (): StudentScorecard => {
  const physicsTests = [
    {
      testId: 'tst-cbse10-phy-003',
      testCode: 'TST-10-PHY-003',
      testName: 'Chapter 3 Test',
      date: '18/09/2026',
      maxMarks: 50,
      marksObtained: 42,
      percentage: 84.0,
      chapter: 'Light Reflection & Refraction',
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
      chapter: 'Electricity & Circuits',
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
      chapter: 'Magnetic Effects of Electric Current',
      teacher: 'Prof. Rajesh Sharma (Physics)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Physics_Test2_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Magnetism.pdf',
      remarks: 'Good grasp of Fleming’s Left-Hand rule.',
    },
  ];

  const chemistryTests = [
    {
      testId: 'tst-cbse10-chm-001',
      testCode: 'TST-10-CHM-001',
      testName: 'Test 1',
      date: '12/08/2026',
      maxMarks: 25,
      marksObtained: 23,
      percentage: 92.0,
      chapter: 'Chemical Reactions & Equations',
      teacher: 'Dr. Anita Deshmukh (Chemistry)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Chemistry_Test1_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Chemistry_Reactions.pdf',
      remarks: 'Perfect chemical balancing and state designations.',
    },
    {
      testId: 'tst-cbse10-chm-002',
      testCode: 'TST-10-CHM-002',
      testName: 'Test 2',
      date: '28/08/2026',
      maxMarks: 40,
      marksObtained: 34,
      percentage: 85.0,
      chapter: 'Acids, Bases & Salts',
      teacher: 'Dr. Anita Deshmukh (Chemistry)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Chemistry_Test2_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Chemistry_Acids.pdf',
      remarks: 'Very thorough explanations of pH applications.',
    },
    {
      testId: 'tst-cbse10-chm-003',
      testCode: 'TST-10-CHM-003',
      testName: 'Test 3',
      date: '15/09/2026',
      maxMarks: 50,
      marksObtained: 41,
      percentage: 82.0,
      chapter: 'Metals and Non-Metals',
      teacher: 'Dr. Anita Deshmukh (Chemistry)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Chemistry_Test3_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Chemistry_Metals.pdf',
      remarks: 'Accurate extraction of metals metallurgy flow chart.',
    },
  ];

  const biologyTests = [
    {
      testId: 'tst-cbse10-bio-001',
      testCode: 'TST-10-BIO-001',
      testName: 'Test 1',
      date: '10/08/2026',
      maxMarks: 50,
      marksObtained: 47,
      percentage: 94.0,
      chapter: 'Life Processes (Nutrition & Respiration)',
      teacher: 'Dr. Vikram Rao (Biology)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Biology_Test1_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Biology_LifeProcesses.pdf',
      remarks: 'High neatness in human heart & digestive system diagram.',
    },
    {
      testId: 'tst-cbse10-bio-002',
      testCode: 'TST-10-BIO-002',
      testName: 'Test 2',
      date: '30/08/2026',
      maxMarks: 40,
      marksObtained: 35,
      percentage: 87.5,
      chapter: 'Control and Coordination',
      teacher: 'Dr. Vikram Rao (Biology)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Biology_Test2_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Biology_Coordination.pdf',
      remarks: 'Clear understanding of endocrine reflex arcs.',
    },
    {
      testId: 'tst-cbse10-bio-003',
      testCode: 'TST-10-BIO-003',
      testName: 'Test 3',
      date: '12/09/2026',
      maxMarks: 25,
      marksObtained: 21,
      percentage: 84.0,
      chapter: 'How do Organisms Reproduce',
      teacher: 'Dr. Vikram Rao (Biology)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Biology_Test3_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Biology_Reproduction.pdf',
      remarks: 'Very systematic description of pollination.',
    },
  ];

  const mathTests = [
    {
      testId: 'tst-cbse10-mat-001',
      testCode: 'TST-10-MAT-001',
      testName: 'Test 1',
      date: '15/08/2026',
      maxMarks: 50,
      marksObtained: 45,
      percentage: 90.0,
      chapter: 'Real Numbers & Polynomials',
      teacher: 'Mrs. Priya Sundaram (Mathematics)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Maths_Test1_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_RealNumbers.pdf',
      remarks: 'Flawless proofs for irrationality and Euclid lemma.',
    },
    {
      testId: 'tst-cbse10-mat-002',
      testCode: 'TST-10-MAT-002',
      testName: 'Test 2',
      date: '02/09/2026',
      maxMarks: 40,
      marksObtained: 32,
      percentage: 80.0,
      chapter: 'Linear Equations in Two Variables',
      teacher: 'Mrs. Priya Sundaram (Mathematics)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Maths_Test2_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_LinearEquations.pdf',
      remarks: 'Check graphical intersection coordinates carefully.',
    },
    {
      testId: 'tst-cbse10-mat-003',
      testCode: 'TST-10-MAT-003',
      testName: 'Test 3',
      date: '20/09/2026',
      maxMarks: 50,
      marksObtained: 38,
      percentage: 76.0,
      chapter: 'Quadratic Equations & Arithmetic Progressions',
      teacher: 'Mrs. Priya Sundaram (Mathematics)',
      answerSheetUrl: '/uploads/answer-sheets/Rahul_Kumar_Maths_Test3_Evaluated.pdf',
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_Quadratics.pdf',
      remarks: 'Practice discriminant word problems.',
    },
  ];

  const buildSubjectScorecard = (name: string, tests: typeof physicsTests): SubjectScorecard => {
    const totalMax = tests.reduce((sum, t) => sum + t.maxMarks, 0);
    const totalObtained = tests.reduce((sum, t) => sum + t.marksObtained, 0);
    const highest = Math.max(...tests.map((t) => t.percentage));
    const avg = Number(((totalObtained / totalMax) * 100).toFixed(1));

    return {
      subjectName: name,
      totalTests: tests.length,
      totalMaxMarks: totalMax,
      totalMarksObtained: totalObtained,
      averagePercentage: avg,
      highestPercentage: highest,
      tests,
    };
  };

  const physics = buildSubjectScorecard('Physics', physicsTests);
  const chemistry = buildSubjectScorecard('Chemistry', chemistryTests);
  const biology = buildSubjectScorecard('Biology', biologyTests);
  const mathematics = buildSubjectScorecard('Mathematics', mathTests);

  const subjectList = [physics, chemistry, biology, mathematics];
  const allMax = subjectList.reduce((sum, s) => sum + s.totalMaxMarks, 0);
  const allObtained = subjectList.reduce((sum, s) => sum + s.totalMarksObtained, 0);
  const overallPct = Number(((allObtained / allMax) * 100).toFixed(1));

  return {
    studentId: 'stu-10025',
    studentName: 'Rahul Kumar',
    studentRoll: 'IT10025',
    className: 'Class 10',
    boardName: 'CBSE',
    batchName: '10A Evening',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    overallPercentage: overallPct,
    overallGrade: overallPct >= 85 ? 'A+' : overallPct >= 75 ? 'A' : 'B',
    totalTestsConducted: 12,
    subjects: {
      physics,
      chemistry,
      biology,
      mathematics,
    },
    subjectList,
  };
};

export const scorecardService = {
  // Get scorecard for a specific student (Teacher / Admin)
  getStudentScorecard: async (studentId: string): Promise<StudentScorecard> => {
    try {
      const response = await api.get<{ success: boolean; data: StudentScorecard }>(
        `/scorecards/student/${studentId}`
      );
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }
    return getSeedScorecard();
  },

  // Get scorecard for the logged-in parent's child
  getMyChildScorecard: async (): Promise<StudentScorecard> => {
    try {
      const response = await api.get<{ success: boolean; data: StudentScorecard }>(
        '/scorecards/me'
      );
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }
    return getSeedScorecard();
  },
};

export default scorecardService;
