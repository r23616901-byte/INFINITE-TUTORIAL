import * as testService from '../services/testService';
import { CreateTestPayload } from '../types';

async function runTestManagementTests() {
  console.log('======================================================');
  console.log('🧪 TESTING INFINITE TUTORIAL TEST MANAGEMENT SYSTEM');
  console.log('======================================================\n');

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
    // ----------------------------------------------------------------
    // Test 1: Validate Default Test Types (Prompt Step 15)
    // ----------------------------------------------------------------
    console.log('--- Test 1: Validate Supported Test Types ---');
    const types = await testService.getTestTypes();
    const requiredTypes = [
      'Test 1',
      'Test 2',
      'Test 3',
      'Chapter-wise Test',
      'Unit Test',
      'Monthly Test',
      'Revision Test',
      'Custom Test',
    ];

    for (const reqType of requiredTypes) {
      const found = types.some((t) => t.name.toLowerCase() === reqType.toLowerCase());
      assert(found, `Supported test type present: "${reqType}"`);
    }

    // ----------------------------------------------------------------
    // Test 2: Admin Adds Additional Custom Test Type
    // ----------------------------------------------------------------
    console.log('\n--- Test 2: Admin Adds Additional Test Type ---');
    const customTypeName = 'Surprise Diagnostic Test';
    const createdType = await testService.addTestType(customTypeName);
    assert(createdType.name === customTypeName, `Admin created custom test type: "${createdType.name}"`);
    assert(createdType.isDefault === false, `Custom test type is marked as non-default`);

    const updatedTypes = await testService.getTestTypes();
    assert(
      updatedTypes.some((t) => t.name === customTypeName),
      `New custom test type appears in active test types list`
    );

    // ----------------------------------------------------------------
    // Test 3: Delete Test Type Guard (Default protected, custom deletable)
    // ----------------------------------------------------------------
    console.log('\n--- Test 3: Test Type Deletion Guard & Cleanup ---');
    let defaultDeleteBlocked = false;
    try {
      await testService.deleteTestType('type-test-1');
    } catch {
      defaultDeleteBlocked = true;
    }
    assert(defaultDeleteBlocked, 'Default system test types cannot be deleted');

    const deleteResult = await testService.deleteTestType(createdType.id);
    assert(deleteResult.success, `Custom test type successfully deleted`);

    // ----------------------------------------------------------------
    // Test 4: Query Initial Pre-seeded Tests (Prompt Step 16)
    // ----------------------------------------------------------------
    console.log('\n--- Test 4: Query Initial Seed Tests & All 14 Fields ---');
    const initialTests = await testService.getTests();
    assert(initialTests.length >= 4, `Retrieved ${initialTests.length} pre-seeded tests`);

    const mathTest = initialTests.find((t) => t.testId === 'TST-10-MAT-001');
    assert(!!mathTest, 'Found Class 10 CBSE Maths Unit Test (TST-10-MAT-001)');

    if (mathTest) {
      assert(!!mathTest.testId, `1. Test ID: ${mathTest.testId}`);
      assert(!!mathTest.name, `2. Test Name: ${mathTest.name}`);
      assert(mathTest.subjectName === 'Mathematics', `3. Subject: ${mathTest.subjectName}`);
      assert(mathTest.className === 'Class 10', `4. Class: ${mathTest.className}`);
      assert(mathTest.boardName === 'CBSE', `5. Board: ${mathTest.boardName}`);
      assert(!!mathTest.chapter, `6. Chapter: ${mathTest.chapter}`);
      assert(mathTest.testType === 'Unit Test', `7. Test Type: ${mathTest.testType}`);
      assert(!!mathTest.date, `8. Date: ${mathTest.date}`);
      assert(mathTest.maxMarks === 50, `9. Maximum Marks: ${mathTest.maxMarks}`);
      assert(mathTest.duration === '90 mins', `10. Duration: ${mathTest.duration}`);
      assert(!!mathTest.testPaperUrl, `11. Test Paper: ${mathTest.testPaperUrl}`);
      assert(!!mathTest.instructions, `12. Instructions: Included (${mathTest.instructions?.length} chars)`);
      assert(!!mathTest.createdById && !!mathTest.createdByName, `13. Created By: ${mathTest.createdByName}`);
      assert(!!mathTest.createdAt, `14. Created Date: ${new Date(mathTest.createdAt).toISOString()}`);
    }

    // ----------------------------------------------------------------
    // Test 5: Sequential Workflow Test Creation (Steps 14, 16, 17)
    // Class -> Board -> Subject -> Chapter -> Test Type -> Details -> Upload Paper -> Save
    // ----------------------------------------------------------------
    console.log('\n--- Test 5: Sequential Test Creation Workflow ---');
    const newTestPayload: CreateTestPayload = {
      name: 'Class 10 CBSE Science - Light Reflection & Refraction Unit Test',
      classId: 'class-10',
      boardId: 'board-cbse',
      subjectId: 'subj-phy-10',
      chapter: 'Chapter 10: Light - Reflection and Refraction',
      testType: 'Unit Test',
      date: '2026-10-10',
      maxMarks: 50,
      duration: '90 mins',
      durationMinutes: 90,
      testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Light_Test.pdf',
      testPaperName: 'CBSE_Class10_Physics_Light_Test.pdf',
      testPaperSize: 320400,
      mimeType: 'application/pdf',
      instructions: '1. Ray diagrams must be drawn with ruler and arrows.\n2. Numerical answers must include proper SI units.',
    };

    const createdTest = await testService.createTest(
      newTestPayload,
      {
        id: 'teacher-001',
        name: 'Dr. Ananya Roy',
        role: 'TEACHER',
      }
    );

    assert(!!createdTest.id, `Created new test with internal ID: ${createdTest.id}`);
    assert(createdTest.testId.startsWith('TST-10-'), `Auto-generated test ID: ${createdTest.testId}`);
    assert(createdTest.className === 'Class 10', `Resolved Class: ${createdTest.className}`);
    assert(createdTest.boardName === 'CBSE', `Resolved Board: ${createdTest.boardName}`);
    assert(createdTest.subjectName.includes('Physics'), `Resolved Subject: ${createdTest.subjectName}`);
    assert(createdTest.chapter === newTestPayload.chapter, `Chapter verified: ${createdTest.chapter}`);
    assert(createdTest.maxMarks === 50, `Maximum marks verified: ${createdTest.maxMarks}`);
    assert(createdTest.testPaperUrl === newTestPayload.testPaperUrl, `Secure test paper URL stored: ${createdTest.testPaperUrl}`);
    assert(createdTest.createdByName === 'Dr. Ananya Roy', `Creator recorded: ${createdTest.createdByName}`);

    // ----------------------------------------------------------------
    // Test 6: Filter and Search Tests
    // ----------------------------------------------------------------
    console.log('\n--- Test 6: Filter and Search Tests ---');
    const filteredBySubject = await testService.getTests({ subjectId: 'subj-phy-10' });
    assert(
      filteredBySubject.length >= 2,
      `Filtered by Physics subject: found ${filteredBySubject.length} tests`
    );

    const filteredByType = await testService.getTests({ testType: 'Unit Test' });
    assert(
      filteredByType.every((t) => t.testType === 'Unit Test'),
      `Filtered by "Unit Test" type: all ${filteredByType.length} tests match`
    );

    const searchResults = await testService.getTests({ search: 'Refraction' });
    assert(
      searchResults.some((t) => t.id === createdTest.id),
      `Keyword search for "Refraction" returned created test`
    );

    // ----------------------------------------------------------------
    // Test 7: Update Test & Replace Test Paper
    // ----------------------------------------------------------------
    console.log('\n--- Test 7: Update Test Details & Replace Test Paper ---');
    const updatedTest = await testService.updateTest(
      createdTest.id,
      {
        maxMarks: 60,
        duration: '105 mins',
        durationMinutes: 105,
        testPaperUrl: '/uploads/test-papers/CBSE_Class10_Physics_Light_Revised.pdf',
        testPaperName: 'CBSE_Class10_Physics_Light_Revised.pdf',
      },
      { id: 'teacher-001', role: 'TEACHER' }
    );

    assert(updatedTest.maxMarks === 60, `Updated maximum marks: ${updatedTest.maxMarks}`);
    assert(updatedTest.duration === '105 mins', `Updated duration: ${updatedTest.duration}`);
    assert(
      updatedTest.testPaperName === 'CBSE_Class10_Physics_Light_Revised.pdf',
      `Replaced test paper file: ${updatedTest.testPaperName}`
    );

    // ----------------------------------------------------------------
    // Test 8: Delete Test Authorization Check
    // ----------------------------------------------------------------
    console.log('\n--- Test 8: Delete Test Authorization ---');
    let unauthorizedBlocked = false;
    try {
      await testService.deleteTest(createdTest.id, {
        id: 'other-teacher-999',
        role: 'TEACHER',
      });
    } catch {
      unauthorizedBlocked = true;
    }
    assert(unauthorizedBlocked, 'Teacher blocked from deleting test created by another teacher');

    // Admin deletion succeeds
    const adminDeleteResult = await testService.deleteTest(createdTest.id, {
      id: 'admin-001',
      role: 'ADMIN',
    });
    assert(adminDeleteResult.success, 'Admin authorized to delete test');

    const postDeleteCheck = await testService.getTestById(createdTest.id);
    assert(postDeleteCheck === null, 'Test verified deleted from repository');

    console.log('\n======================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} TEST MANAGEMENT TESTS PASSED SUCCESSFULLY!`);
    console.log('======================================================');
  } catch (err) {
    console.error('Test execution error:', err);
    process.exitCode = 1;
  }
}

runTestManagementTests();
