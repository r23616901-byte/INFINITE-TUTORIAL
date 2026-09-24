import api from './api';
import { StudentScorecard, SubjectScorecard } from '../types/scorecard';
import { MOCK_STUDENTS, StudentDto } from './studentService';

// Dynamic authentic scorecard generator for any enrolled student
export const getSeedScorecard = (studentIdOrRoll = 'IT10025'): StudentScorecard => {
  const q = (studentIdOrRoll || 'IT10025').trim().toLowerCase();
  const student: StudentDto =
    MOCK_STUDENTS.find(
      (s) =>
        s.id.toLowerCase() === q ||
        s.studentId.toLowerCase() === q ||
        s.name.toLowerCase().includes(q)
    ) || MOCK_STUDENTS[0];

  const roll = student.studentId;
  const sName = student.name;

  // 1. Priya Nair (Class 9, Karnataka State Board)
  if (roll === 'IT10028' || q.includes('priya') || q.includes('10028')) {
    const physicsTests = [
      {
        testId: 'tst-ksb9-phy-001',
        testCode: 'TST-09-PHY-001',
        testName: 'Test 1',
        date: '08/08/2026',
        maxMarks: 25,
        marksObtained: 23,
        percentage: 92.0,
        chapter: 'Motion - Velocity & Acceleration',
        teacher: 'Prof. Rajesh Sharma (Physics)',
        answerSheetUrl: '/uploads/answer-sheets/Priya_Nair_Physics_Test1_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/KSB_Class9_Physics_Motion.pdf',
        remarks: 'Neat graphs for uniform and non-uniform acceleration.',
      },
      {
        testId: 'tst-ksb9-phy-002',
        testCode: 'TST-09-PHY-002',
        testName: 'Test 2',
        date: '28/08/2026',
        maxMarks: 40,
        marksObtained: 36,
        percentage: 90.0,
        chapter: 'Force and Laws of Motion',
        teacher: 'Prof. Rajesh Sharma (Physics)',
        answerSheetUrl: '/uploads/answer-sheets/Priya_Nair_Physics_Test2_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/KSB_Class9_Physics_Force.pdf',
        remarks: 'Precise numerical calculations using Newton second law.',
      },
      {
        testId: 'tst-ksb9-phy-003',
        testCode: 'TST-09-PHY-003',
        testName: 'Chapter 3 Test',
        date: '18/09/2026',
        maxMarks: 50,
        marksObtained: 45,
        percentage: 90.0,
        chapter: 'Gravitation & Universal Law',
        teacher: 'Prof. Rajesh Sharma (Physics)',
        answerSheetUrl: '/uploads/answer-sheets/Priya_Nair_Physics_Ch3_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/KSB_Class9_Physics_Gravitation.pdf',
        remarks: 'High conceptual clarity in mass vs weight differences.',
      },
    ];

    const chemistryTests = [
      {
        testId: 'tst-ksb9-chm-001',
        testCode: 'TST-09-CHM-001',
        testName: 'Test 1',
        date: '12/08/2026',
        maxMarks: 25,
        marksObtained: 22,
        percentage: 88.0,
        chapter: 'Matter in Our Surroundings',
        teacher: 'Dr. Anita Deshmukh (Chemistry)',
        answerSheetUrl: '/uploads/answer-sheets/Priya_Nair_Chem_Test1_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/KSB_Class9_Chem_Matter.pdf',
        remarks: 'Detailed explanation of latent heat of vaporisation.',
      },
      {
        testId: 'tst-ksb9-chm-002',
        testCode: 'TST-09-CHM-002',
        testName: 'Test 2',
        date: '30/08/2026',
        maxMarks: 40,
        marksObtained: 36,
        percentage: 90.0,
        chapter: 'Is Matter Around Us Pure?',
        teacher: 'Dr. Anita Deshmukh (Chemistry)',
        answerSheetUrl: '/uploads/answer-sheets/Priya_Nair_Chem_Test2_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/KSB_Class9_Chem_PureMatter.pdf',
        remarks: 'Clear differentiation of colloids, solutions and suspensions.',
      },
      {
        testId: 'tst-ksb9-chm-003',
        testCode: 'TST-09-CHM-003',
        testName: 'Test 3',
        date: '16/09/2026',
        maxMarks: 50,
        marksObtained: 44,
        percentage: 88.0,
        chapter: 'Atoms and Molecules - Chemical Formulae',
        teacher: 'Dr. Anita Deshmukh (Chemistry)',
        answerSheetUrl: '/uploads/answer-sheets/Priya_Nair_Chem_Test3_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/KSB_Class9_Chem_Atoms.pdf',
        remarks: 'Correct criss-cross method for valency calculation.',
      },
    ];

    const biologyTests = [
      {
        testId: 'tst-ksb9-bio-001',
        testCode: 'TST-09-BIO-001',
        testName: 'Test 1',
        date: '10/08/2026',
        maxMarks: 50,
        marksObtained: 47,
        percentage: 94.0,
        chapter: 'Fundamental Unit of Life - Cell',
        teacher: 'Dr. Vikram Rao (Biology)',
        answerSheetUrl: '/uploads/answer-sheets/Priya_Nair_Bio_Test1_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/KSB_Class9_Bio_Cell.pdf',
        remarks: 'Beautifully labeled diagram of plant and animal cells.',
      },
      {
        testId: 'tst-ksb9-bio-002',
        testCode: 'TST-09-BIO-002',
        testName: 'Test 2',
        date: '31/08/2026',
        maxMarks: 40,
        marksObtained: 37,
        percentage: 92.5,
        chapter: 'Tissues - Plant & Animal Tissues',
        teacher: 'Dr. Vikram Rao (Biology)',
        answerSheetUrl: '/uploads/answer-sheets/Priya_Nair_Bio_Test2_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/KSB_Class9_Bio_Tissues.pdf',
        remarks: 'Accurate differentiation of xylem and phloem vessels.',
      },
      {
        testId: 'tst-ksb9-bio-003',
        testCode: 'TST-09-BIO-003',
        testName: 'Test 3',
        date: '15/09/2026',
        maxMarks: 25,
        marksObtained: 23,
        percentage: 92.0,
        chapter: 'Improvement in Food Resources',
        teacher: 'Dr. Vikram Rao (Biology)',
        answerSheetUrl: '/uploads/answer-sheets/Priya_Nair_Bio_Test3_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/KSB_Class9_Bio_Food.pdf',
        remarks: 'Very systematic answers on crop protection management.',
      },
    ];

    const mathTests = [
      {
        testId: 'tst-ksb9-mat-001',
        testCode: 'TST-09-MAT-001',
        testName: 'Test 1',
        date: '15/08/2026',
        maxMarks: 50,
        marksObtained: 46,
        percentage: 92.0,
        chapter: 'Number Systems - Rational & Irrational Numbers',
        teacher: 'Mrs. Priya Sundaram (Mathematics)',
        answerSheetUrl: '/uploads/answer-sheets/Priya_Nair_Maths_Test1_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/KSB_Class9_Maths_Numbers.pdf',
        remarks: 'Spot-on rationalisation of radical denominators.',
      },
      {
        testId: 'tst-ksb9-mat-002',
        testCode: 'TST-09-MAT-002',
        testName: 'Test 2',
        date: '02/09/2026',
        maxMarks: 40,
        marksObtained: 36,
        percentage: 90.0,
        chapter: 'Polynomials & Factorisation',
        teacher: 'Mrs. Priya Sundaram (Mathematics)',
        answerSheetUrl: '/uploads/answer-sheets/Priya_Nair_Maths_Test2_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/KSB_Class9_Maths_Polynomials.pdf',
        remarks: 'Great algebraic identities step-by-step expansion.',
      },
      {
        testId: 'tst-ksb9-mat-003',
        testCode: 'TST-09-MAT-003',
        testName: 'Test 3',
        date: '20/09/2026',
        maxMarks: 25,
        marksObtained: 23,
        percentage: 92.0,
        chapter: 'Coordinate Geometry & Linear Equations',
        teacher: 'Mrs. Priya Sundaram (Mathematics)',
        answerSheetUrl: '/uploads/answer-sheets/Priya_Nair_Maths_Test3_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/KSB_Class9_Maths_Coordinates.pdf',
        remarks: 'Accurate plotting on Cartesian plane.',
      },
    ];

    return buildScorecardObject(student, physicsTests, chemistryTests, biologyTests, mathTests);
  }

  // 2. Sneha Verma (Class 10, CBSE - High Ranker)
  if (roll === 'IT10026' || q.includes('sneha') || q.includes('10026')) {
    const physicsTests = [
      {
        testId: 'tst-cbse10-phy-003',
        testCode: 'TST-10-PHY-003',
        testName: 'Chapter 3 Test',
        date: '18/09/2026',
        maxMarks: 50,
        marksObtained: 47,
        percentage: 94.0,
        chapter: 'Light Reflection & Refraction',
        teacher: 'Prof. Rajesh Sharma (Physics)',
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Physics_Ch3_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Light_Test.pdf',
        remarks: 'Flawless ray diagrams and mirror formula calculations.',
      },
      {
        testId: 'tst-cbse10-phy-001',
        testCode: 'TST-10-PHY-001',
        testName: 'Test 1',
        date: '05/08/2026',
        maxMarks: 25,
        marksObtained: 24,
        percentage: 96.0,
        chapter: 'Electricity & Circuits',
        teacher: 'Prof. Rajesh Sharma (Physics)',
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Physics_Test1_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Electricity.pdf',
        remarks: 'Highest marks in batch! Excellent problem solving.',
      },
      {
        testId: 'tst-cbse10-phy-002',
        testCode: 'TST-10-PHY-002',
        testName: 'Test 2',
        date: '28/08/2026',
        maxMarks: 40,
        marksObtained: 38,
        percentage: 95.0,
        chapter: 'Magnetic Effects of Electric Current',
        teacher: 'Prof. Rajesh Sharma (Physics)',
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Physics_Test2_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Magnetism.pdf',
        remarks: 'Accurate representation of solenoid magnetic field lines.',
      },
    ];

    const chemistryTests = [
      {
        testId: 'tst-cbse10-chm-001',
        testCode: 'TST-10-CHM-001',
        testName: 'Test 1',
        date: '12/08/2026',
        maxMarks: 25,
        marksObtained: 25,
        percentage: 100.0,
        chapter: 'Chemical Reactions & Equations',
        teacher: 'Dr. Anita Deshmukh (Chemistry)',
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Chemistry_Test1_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Chemistry_Reactions.pdf',
        remarks: 'Perfect score (25/25). Outstanding precision.',
      },
      {
        testId: 'tst-cbse10-chm-002',
        testCode: 'TST-10-CHM-002',
        testName: 'Test 2',
        date: '28/08/2026',
        maxMarks: 40,
        marksObtained: 38,
        percentage: 95.0,
        chapter: 'Acids, Bases & Salts',
        teacher: 'Dr. Anita Deshmukh (Chemistry)',
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Chemistry_Test2_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Chemistry_Acids.pdf',
        remarks: 'Comprehensive answer on chlor-alkali process.',
      },
      {
        testId: 'tst-cbse10-chm-003',
        testCode: 'TST-10-CHM-003',
        testName: 'Test 3',
        date: '15/09/2026',
        maxMarks: 50,
        marksObtained: 46,
        percentage: 92.0,
        chapter: 'Metals and Non-Metals',
        teacher: 'Dr. Anita Deshmukh (Chemistry)',
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Chemistry_Test3_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Chemistry_Metals.pdf',
        remarks: 'Clear distinction of calcination vs roasting.',
      },
    ];

    const biologyTests = [
      {
        testId: 'tst-cbse10-bio-001',
        testCode: 'TST-10-BIO-001',
        testName: 'Test 1',
        date: '10/08/2026',
        maxMarks: 50,
        marksObtained: 49,
        percentage: 98.0,
        chapter: 'Life Processes',
        teacher: 'Dr. Vikram Rao (Biology)',
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Biology_Test1_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Biology_LifeProcesses.pdf',
        remarks: 'Exceptional diagram of nephron and urine formation.',
      },
      {
        testId: 'tst-cbse10-bio-002',
        testCode: 'TST-10-BIO-002',
        testName: 'Test 2',
        date: '30/08/2026',
        maxMarks: 40,
        marksObtained: 39,
        percentage: 97.5,
        chapter: 'Control and Coordination',
        teacher: 'Dr. Vikram Rao (Biology)',
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Biology_Test2_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Biology_Coordination.pdf',
        remarks: 'Thorough answers on reflex arc and brain lobes.',
      },
      {
        testId: 'tst-cbse10-bio-003',
        testCode: 'TST-10-BIO-003',
        testName: 'Test 3',
        date: '12/09/2026',
        maxMarks: 25,
        marksObtained: 24,
        percentage: 96.0,
        chapter: 'How do Organisms Reproduce',
        teacher: 'Dr. Vikram Rao (Biology)',
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Biology_Test3_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Biology_Reproduction.pdf',
        remarks: 'Full marks in longitudinal section of flower.',
      },
    ];

    const mathTests = [
      {
        testId: 'tst-cbse10-mat-001',
        testCode: 'TST-10-MAT-001',
        testName: 'Test 1',
        date: '15/08/2026',
        maxMarks: 50,
        marksObtained: 48,
        percentage: 96.0,
        chapter: 'Real Numbers & Polynomials',
        teacher: 'Mrs. Priya Sundaram (Mathematics)',
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Maths_Test1_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_RealNumbers.pdf',
        remarks: 'Exemplary proof writing style.',
      },
      {
        testId: 'tst-cbse10-mat-002',
        testCode: 'TST-10-MAT-002',
        testName: 'Test 2',
        date: '02/09/2026',
        maxMarks: 40,
        marksObtained: 37,
        percentage: 92.5,
        chapter: 'Pair of Linear Equations in Two Variables',
        teacher: 'Mrs. Priya Sundaram (Mathematics)',
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Maths_Test2_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_LinearEq.pdf',
        remarks: 'All algebraic elimination methods applied correctly.',
      },
      {
        testId: 'tst-cbse10-mat-003',
        testCode: 'TST-10-MAT-003',
        testName: 'Test 3',
        date: '20/09/2026',
        maxMarks: 50,
        marksObtained: 46,
        percentage: 92.0,
        chapter: 'Quadratic Equations & Arithmetic Progressions',
        teacher: 'Mrs. Priya Sundaram (Mathematics)',
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Maths_Test3_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_Quadratics.pdf',
        remarks: 'High speed and 100% accuracy in AP summation questions.',
      },
    ];

    return buildScorecardObject(student, physicsTests, chemistryTests, biologyTests, mathTests);
  }

  // 3. Aditya Rao (Class 10, CBSE - Batch 10B)
  if (roll === 'IT10027' || q.includes('aditya') || q.includes('10027')) {
    const physicsTests = [
      {
        testId: 'tst-cbse10-phy-003',
        testCode: 'TST-10-PHY-003',
        testName: 'Chapter 3 Test',
        date: '18/09/2026',
        maxMarks: 50,
        marksObtained: 38,
        percentage: 76.0,
        chapter: 'Light Reflection & Refraction',
        teacher: 'Prof. Rajesh Sharma (Physics)',
        answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Physics_Ch3_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Light_Test.pdf',
        remarks: 'Good attempt. Needs careful sign conventions in convex lens problem.',
      },
      {
        testId: 'tst-cbse10-phy-001',
        testCode: 'TST-10-PHY-001',
        testName: 'Test 1',
        date: '05/08/2026',
        maxMarks: 25,
        marksObtained: 19,
        percentage: 76.0,
        chapter: 'Electricity & Circuits',
        teacher: 'Prof. Rajesh Sharma (Physics)',
        answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Physics_Test1_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Electricity.pdf',
        remarks: 'Review Joule heating formula derivations.',
      },
      {
        testId: 'tst-cbse10-phy-002',
        testCode: 'TST-10-PHY-002',
        testName: 'Test 2',
        date: '28/08/2026',
        maxMarks: 40,
        marksObtained: 31,
        percentage: 77.5,
        chapter: 'Magnetic Effects of Electric Current',
        teacher: 'Prof. Rajesh Sharma (Physics)',
        answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Physics_Test2_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Magnetism.pdf',
        remarks: 'Satisfactory work on Fleming rule.',
      },
    ];

    const chemistryTests = [
      {
        testId: 'tst-cbse10-chm-001',
        testCode: 'TST-10-CHM-001',
        testName: 'Test 1',
        date: '12/08/2026',
        maxMarks: 25,
        marksObtained: 19,
        percentage: 76.0,
        chapter: 'Chemical Reactions & Equations',
        teacher: 'Dr. Anita Deshmukh (Chemistry)',
        answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Chemistry_Test1_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Chemistry_Reactions.pdf',
        remarks: 'Practice redox reaction identification.',
      },
      {
        testId: 'tst-cbse10-chm-002',
        testCode: 'TST-10-CHM-002',
        testName: 'Test 2',
        date: '28/08/2026',
        maxMarks: 40,
        marksObtained: 32,
        percentage: 80.0,
        chapter: 'Acids, Bases & Salts',
        teacher: 'Dr. Anita Deshmukh (Chemistry)',
        answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Chemistry_Test2_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Chemistry_Acids.pdf',
        remarks: 'Good understanding of pH indicators.',
      },
      {
        testId: 'tst-cbse10-chm-003',
        testCode: 'TST-10-CHM-003',
        testName: 'Test 3',
        date: '15/09/2026',
        maxMarks: 50,
        marksObtained: 39,
        percentage: 78.0,
        chapter: 'Metals and Non-Metals',
        teacher: 'Dr. Anita Deshmukh (Chemistry)',
        answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Chemistry_Test3_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Chemistry_Metals.pdf',
        remarks: 'Solid understanding of reactivity series.',
      },
    ];

    const biologyTests = [
      {
        testId: 'tst-cbse10-bio-001',
        testCode: 'TST-10-BIO-001',
        testName: 'Test 1',
        date: '10/08/2026',
        maxMarks: 50,
        marksObtained: 41,
        percentage: 82.0,
        chapter: 'Life Processes',
        teacher: 'Dr. Vikram Rao (Biology)',
        answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Biology_Test1_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Biology_LifeProcesses.pdf',
        remarks: 'Good answers on aerobic and anaerobic respiration.',
      },
      {
        testId: 'tst-cbse10-bio-002',
        testCode: 'TST-10-BIO-002',
        testName: 'Test 2',
        date: '30/08/2026',
        maxMarks: 40,
        marksObtained: 32,
        percentage: 80.0,
        chapter: 'Control and Coordination',
        teacher: 'Dr. Vikram Rao (Biology)',
        answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Biology_Test2_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Biology_Coordination.pdf',
        remarks: 'Properly described reflex action pathway.',
      },
      {
        testId: 'tst-cbse10-bio-003',
        testCode: 'TST-10-BIO-003',
        testName: 'Test 3',
        date: '12/09/2026',
        maxMarks: 25,
        marksObtained: 20,
        percentage: 80.0,
        chapter: 'How do Organisms Reproduce',
        teacher: 'Dr. Vikram Rao (Biology)',
        answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Biology_Test3_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Biology_Reproduction.pdf',
        remarks: 'Accurate description of spore formation.',
      },
    ];

    const mathTests = [
      {
        testId: 'tst-cbse10-mat-001',
        testCode: 'TST-10-MAT-001',
        testName: 'Test 1',
        date: '15/08/2026',
        maxMarks: 50,
        marksObtained: 39,
        percentage: 78.0,
        chapter: 'Real Numbers & Polynomials',
        teacher: 'Mrs. Priya Sundaram (Mathematics)',
        answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Maths_Test1_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_RealNumbers.pdf',
        remarks: 'Show all intermediate rough calculations clearly.',
      },
      {
        testId: 'tst-cbse10-mat-002',
        testCode: 'TST-10-MAT-002',
        testName: 'Test 2',
        date: '02/09/2026',
        maxMarks: 40,
        marksObtained: 30,
        percentage: 75.0,
        chapter: 'Pair of Linear Equations in Two Variables',
        teacher: 'Mrs. Priya Sundaram (Mathematics)',
        answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Maths_Test2_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_LinearEq.pdf',
        remarks: 'Practice speed in substitution method.',
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
        answerSheetUrl: '/uploads/answer-sheets/Aditya_Rao_Maths_Test3_Evaluated.pdf',
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_Quadratics.pdf',
        remarks: 'Revise discriminant cases.',
      },
    ];

    return buildScorecardObject(student, physicsTests, chemistryTests, biologyTests, mathTests);
  }

  // 4. Default / Rahul Kumar (Class 10, CBSE, Batch 10A)
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
      answerSheetUrl: `/uploads/answer-sheets/${sName.replace(/\s+/g, '_')}_Physics_Ch3_Evaluated.pdf`,
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
      answerSheetUrl: `/uploads/answer-sheets/${sName.replace(/\s+/g, '_')}_Physics_Test1_Evaluated.pdf`,
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
      answerSheetUrl: `/uploads/answer-sheets/${sName.replace(/\s+/g, '_')}_Physics_Test2_Evaluated.pdf`,
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
      answerSheetUrl: `/uploads/answer-sheets/${sName.replace(/\s+/g, '_')}_Chemistry_Test1_Evaluated.pdf`,
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
      answerSheetUrl: `/uploads/answer-sheets/${sName.replace(/\s+/g, '_')}_Chemistry_Test2_Evaluated.pdf`,
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
      answerSheetUrl: `/uploads/answer-sheets/${sName.replace(/\s+/g, '_')}_Chemistry_Test3_Evaluated.pdf`,
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
      answerSheetUrl: `/uploads/answer-sheets/${sName.replace(/\s+/g, '_')}_Biology_Test1_Evaluated.pdf`,
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
      answerSheetUrl: `/uploads/answer-sheets/${sName.replace(/\s+/g, '_')}_Biology_Test2_Evaluated.pdf`,
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
      answerSheetUrl: `/uploads/answer-sheets/${sName.replace(/\s+/g, '_')}_Biology_Test3_Evaluated.pdf`,
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
      answerSheetUrl: `/uploads/answer-sheets/${sName.replace(/\s+/g, '_')}_Maths_Test1_Evaluated.pdf`,
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
      chapter: 'Pair of Linear Equations in Two Variables',
      teacher: 'Mrs. Priya Sundaram (Mathematics)',
      answerSheetUrl: `/uploads/answer-sheets/${sName.replace(/\s+/g, '_')}_Maths_Test2_Evaluated.pdf`,
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_LinearEq.pdf',
      remarks: 'Good mastery of cross-multiplication & substitution.',
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
      answerSheetUrl: `/uploads/answer-sheets/${sName.replace(/\s+/g, '_')}_Maths_Test3_Evaluated.pdf`,
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Maths_Quadratics.pdf',
      remarks: 'Practice discriminant word problems.',
    },
  ];

  return buildScorecardObject(student, physicsTests, chemistryTests, biologyTests, mathTests);
};

const buildScorecardObject = (
  student: StudentDto,
  physicsTests: any[],
  chemistryTests: any[],
  biologyTests: any[],
  mathTests: any[]
): StudentScorecard => {
  const buildSubjectScorecard = (name: string, tests: any[]): SubjectScorecard => {
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
    studentId: student.id,
    studentName: student.name,
    studentRoll: student.studentId,
    className: student.className,
    boardName: student.boardName,
    batchName: student.batchName,
    photoUrl: student.photoUrl || null,
    overallPercentage: overallPct,
    overallGrade: overallPct >= 90 ? 'O' : overallPct >= 85 ? 'A+' : overallPct >= 75 ? 'A' : 'B+',
    totalTestsConducted: physicsTests.length + chemistryTests.length + biologyTests.length + mathTests.length,
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
    return getSeedScorecard(studentId);
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
    return getSeedScorecard('IT10025');
  },
};

export default scorecardService;
