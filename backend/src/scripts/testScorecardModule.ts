import * as scorecardService from '../services/scorecardService';
import { StudentScorecardDto, SubjectScorecard } from '../types';

async function runScorecardTests() {
  console.log('======================================================================');
  console.log('🧪 TESTING INFINITE TUTORIAL SCORECARD MODULE (STEP 21 / STEP 15)');
  console.log('======================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  try {
    // ----------------------------------------------------------------------
    // Test 1: Generate Scorecard for Rahul Kumar (IT10025)
    // ----------------------------------------------------------------------
    console.log('--- Test 1: Validate Student Profile in Scorecard ---');
    const scorecard = await scorecardService.getStudentScorecard('IT10025', {
      id: 'admin-001',
      role: 'ADMIN',
    });

    assert(!!scorecard, 'Scorecard generated successfully');
    assert(scorecard.studentName === 'Rahul Kumar', `Student name is "${scorecard.studentName}"`);
    assert(scorecard.studentRoll === 'IT10025', `Student roll is "${scorecard.studentRoll}"`);
    assert(scorecard.className.includes('10'), `Class is "${scorecard.className}"`);
    assert(scorecard.boardName.includes('CBSE'), `Board is "${scorecard.boardName}"`);
    assert(typeof scorecard.overallPercentage === 'number', `Overall percentage computed: ${scorecard.overallPercentage}%`);
    assert(!!scorecard.overallGrade, `Overall grade calculated: "${scorecard.overallGrade}"`);
    console.log(`   Profile verified: [${scorecard.studentName} | ${scorecard.className} | ${scorecard.boardName} | GPA: ${scorecard.overallPercentage}% (${scorecard.overallGrade})]\n`);

    // ----------------------------------------------------------------------
    // Test 2: Validate 4 Required Subjects (Physics, Chemistry, Biology, Mathematics)
    // ----------------------------------------------------------------------
    console.log('--- Test 2: Validate All 4 Required Core Subjects ---');
    const requiredSubjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics'] as const;

    for (const sub of requiredSubjects) {
      const subjectKey = sub.toLowerCase() as keyof typeof scorecard.subjects;
      const subScorecard = scorecard.subjects[subjectKey];
      assert(!!subScorecard, `Core subject present: "${sub}"`);
      assert(subScorecard.subjectName === sub, `Subject name matches "${sub}"`);
      assert(subScorecard.totalTests >= 2, `Subject "${sub}" has ${subScorecard.totalTests} tests recorded (minimum 2)`);
      assert(subScorecard.averagePercentage > 0, `Subject "${sub}" average percentage: ${subScorecard.averagePercentage}%`);
      console.log(`   Subject verified: [${sub} | Tests: ${subScorecard.totalTests} | Avg: ${subScorecard.averagePercentage}% | High: ${subScorecard.highestPercentage}%]`);
    }
    console.log('');

    // ----------------------------------------------------------------------
    // Test 3: Validate All 9 Required Parameters for Every Test in Every Subject
    // Test name, Date, Maximum marks, Obtained marks, Percentage, Chapter, Teacher, Answer sheet, Test paper
    // ----------------------------------------------------------------------
    console.log('--- Test 3: Validate All 9 Required Fields Per Test Across All Subjects ---');
    for (const sub of requiredSubjects) {
      const subjectKey = sub.toLowerCase() as keyof typeof scorecard.subjects;
      const subScorecard = scorecard.subjects[subjectKey];

      for (const testItem of subScorecard.tests) {
        assert(!!testItem.testName, `[${sub}] Test name present: "${testItem.testName}"`);
        assert(!!testItem.date, `[${sub}] Date present: "${testItem.date}"`);
        assert(testItem.maxMarks > 0, `[${sub}] Maximum marks valid: ${testItem.maxMarks}`);
        assert(testItem.marksObtained >= 0, `[${sub}] Obtained marks valid: ${testItem.marksObtained}`);
        assert(testItem.percentage >= 0, `[${sub}] Percentage valid: ${testItem.percentage}%`);
        assert(!!testItem.chapter, `[${sub}] Chapter present: "${testItem.chapter}"`);
        assert(!!testItem.teacher, `[${sub}] Teacher present: "${testItem.teacher}"`);
        assert(!!testItem.answerSheetUrl, `[${sub}] Answer sheet URL present: "${testItem.answerSheetUrl}"`);
        assert(!!testItem.testPaperUrl, `[${sub}] Test paper URL present: "${testItem.testPaperUrl}"`);
      }
    }
    console.log('   All 9 required fields validated across all subject test items.\n');

    // ----------------------------------------------------------------------
    // Test 4: Validate Exact Rahul Kumar Physics Chapter 3 Test Item
    // ----------------------------------------------------------------------
    console.log('--- Test 4: Validate Physics Chapter 3 Spotlight Test ---');
    const physicsCh3 = scorecard.subjects.physics.tests.find(
      (t) => t.testName === 'Chapter 3 Test'
    );
    assert(!!physicsCh3, 'Physics Chapter 3 Test found in scorecard');
    if (physicsCh3) {
      assert(physicsCh3.maxMarks === 50, `Max marks is 50`);
      assert(physicsCh3.marksObtained === 42, `Marks obtained is 42`);
      assert(physicsCh3.percentage === 84.0, `Percentage is 84%`);
      assert(physicsCh3.teacher.includes('Rajesh Sharma'), `Teacher is "${physicsCh3.teacher}"`);
      assert(physicsCh3.answerSheetUrl!.includes('Rahul_Kumar_Physics_Ch3_Evaluated.pdf'), `Answer sheet URL verified`);
      assert(physicsCh3.testPaperUrl!.includes('.pdf'), `Test paper question sheet attached`);
      console.log(`   Physics Chapter 3 verified: [${physicsCh3.testName} | ${physicsCh3.date} | ${physicsCh3.marksObtained}/${physicsCh3.maxMarks} (${physicsCh3.percentage}%) | ${physicsCh3.teacher}]\n`);
    }

    // ----------------------------------------------------------------------
    // Test 5: Strict Security Barrier for Parent
    // ----------------------------------------------------------------------
    console.log('--- Test 5: Security Barrier & Role Access ---');
    // Parent accessing their own child
    const parentOwnScorecard = await scorecardService.getStudentScorecard('IT10025', {
      id: 'parent-001',
      role: 'PARENT',
      studentId: 'IT10025',
    });
    assert(parentOwnScorecard.studentRoll === 'IT10025', 'Parent can access linked child scorecard');

    // Parent accessing another student's scorecard
    let unauthorizedBlocked = false;
    try {
      await scorecardService.getStudentScorecard('IT10026', {
        id: 'parent-001',
        role: 'PARENT',
        studentId: 'IT10025',
      });
    } catch (e: any) {
      unauthorizedBlocked = true;
      assert(e.message.includes('Access Denied'), `Unauthorized access properly blocked: "${e.message}"`);
    }
    assert(unauthorizedBlocked, 'Cross-student scorecard access blocked with 403 Forbidden\n');

    // ----------------------------------------------------------------------
    // Summary
    // ----------------------------------------------------------------------
    console.log('======================================================================');
    console.log(`🎉 ALL SCORECARD MODULE TESTS COMPLETED!`);
    console.log(`   Passed: ${passedTests} / ${totalTests}`);
    console.log('======================================================================');
  } catch (error: any) {
    console.error('❌ Exception during scorecard tests:', error);
    process.exitCode = 1;
  }
}

runScorecardTests();
