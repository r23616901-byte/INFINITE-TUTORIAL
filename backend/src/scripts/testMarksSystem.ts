import * as markService from '../services/markService';
import { StudentMarkDto, MarkAuditLogDto } from '../types';

async function runMarksSystemTests() {
  console.log('======================================================================');
  console.log('🧪 TESTING INFINITE TUTORIAL MARKS ENTRY & ANSWER SHEET SYSTEM (18-20)');
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
    // Test 1: Validate Exact Seed Example from Prompt (Step 19)
    // Student: Rahul | Subject: Physics | Test: Chapter 3 Test | Max: 50 | Marks: 42 | 84%
    // ----------------------------------------------------------------------
    console.log('--- Test 1: Validate User Prompt Example ---');
    const marks = await markService.getMarks({}, { id: 'admin-001', role: 'ADMIN' });
    assert(marks.length > 0, `Retrieved ${marks.length} pre-seeded marks records`);

    const rahulMark = marks.find(
      (m) => (m.studentName === 'Rahul Kumar' || m.studentRoll === 'IT10025') && m.subjectName === 'Physics'
    );
    assert(!!rahulMark, 'Found Rahul Kumar Physics Chapter 3 mark entry in repository');

    if (rahulMark) {
      assert(rahulMark.studentName === 'Rahul Kumar', `Student name is "${rahulMark.studentName}"`);
      assert(rahulMark.subjectName === 'Physics', `Subject is "${rahulMark.subjectName}"`);
      assert(rahulMark.testName === 'Chapter 3 Test', `Test is "${rahulMark.testName}"`);
      assert(rahulMark.maxMarks === 50, `Maximum Marks is ${rahulMark.maxMarks}`);
      assert(rahulMark.marksObtained === 42, `Marks Obtained is ${rahulMark.marksObtained}`);
      assert(rahulMark.percentage === 84.0, `Percentage is ${rahulMark.percentage}% (Expected 84%)`);
      assert(!!rahulMark.answerSheetUrl, `Evaluated Answer Sheet URL is attached: "${rahulMark.answerSheetUrl}"`);
      console.log(`   Prompt example validated: [${rahulMark.studentName} | ${rahulMark.subjectName} | ${rahulMark.testName} | Marks: ${rahulMark.marksObtained}/${rahulMark.maxMarks} | ${rahulMark.percentage}%]\n`);
    }

    // ----------------------------------------------------------------------
    // Test 2: Validate Tamper-Proof Audit Trail (Step 20)
    // Old Marks: 38 | New Marks: 42 | Changed By: Teacher | Changed At: 18/09/2026 5:30 PM | Reason: Rechecking
    // ----------------------------------------------------------------------
    console.log('--- Test 2: Validate Mark Editing Audit Trail ---');
    if (rahulMark) {
      const auditTrail = await markService.getAuditTrail(rahulMark.id);
      assert(auditTrail.length > 0, `Audit trail contains ${auditTrail.length} revision record(s)`);
      const seedAudit = auditTrail.find((a) => a.reason === 'Rechecking');
      assert(!!seedAudit, 'Found "Rechecking" audit entry in history');

      if (seedAudit) {
        assert(seedAudit.oldMarks === 38, `Old Marks was ${seedAudit.oldMarks} (Expected 38)`);
        assert(seedAudit.newMarks === 42, `New Marks is ${seedAudit.newMarks} (Expected 42)`);
        assert(seedAudit.changedByRole === 'TEACHER', `Changed By role is "${seedAudit.changedByRole}"`);
        assert(seedAudit.reason === 'Rechecking', `Reason recorded is "${seedAudit.reason}"`);
        const dateStr = new Date(seedAudit.changedAt).toISOString();
        assert(dateStr.includes('2026-09-18'), `Changed At matches date 18/09/2026 (${dateStr})`);
        console.log(`   Audit entry validated: [Old: ${seedAudit.oldMarks} -> New: ${seedAudit.newMarks} | By: ${seedAudit.changedByName} | Reason: ${seedAudit.reason} | At: ${dateStr}]\n`);
      }
    }

    // ----------------------------------------------------------------------
    // Test 3: Marks Entry Workflow (Step 19)
    // Select Student -> Select Subject -> Select Test -> Enter Marks -> Upload Answer Sheet -> Save
    // ----------------------------------------------------------------------
    console.log('--- Test 3: Sequential Marks Entry Workflow ---');
    const newEntry = await markService.createMark(
      {
        studentId: 'stu-10026', // Sneha Verma
        subjectId: 'sub-sci',
        testId: 'tst-cbse10-phy-003', // Physics Chapter 3 Test
        marksObtained: 46,
        maxMarks: 50,
        answerSheetUrl: '/uploads/answer-sheets/Sneha_Verma_Physics_Ch3_Scanned.pdf',
        answerSheetName: 'Sneha_Verma_Physics_Ch3_Scanned.pdf',
        answerSheetSize: 2100000,
        mimeType: 'application/pdf',
        isPublished: true,
        remarks: 'Outstanding performance across numerical questions.',
      },
      { id: 'teacher-001', name: 'Prof. Rajesh Sharma', role: 'TEACHER' }
    );
    assert(!!newEntry.id, 'Successfully created marks entry through sequential workflow');
    assert(newEntry.studentName === 'Sneha Verma', `Student linked: "${newEntry.studentName}"`);
    assert(newEntry.marksObtained === 46 && newEntry.maxMarks === 50, 'Marks set: 46/50');
    assert(newEntry.percentage === 92.0, `Auto-calculated percentage: ${newEntry.percentage}% (Expected 92%)`);
    assert(!!newEntry.answerSheetUrl, `Answer sheet linked: "${newEntry.answerSheetUrl}"\n`);

    // ----------------------------------------------------------------------
    // Test 4: Validation Guards (Negative Marks & Exceeding Max Marks)
    // ----------------------------------------------------------------------
    console.log('--- Test 4: Marks Validation Guards ---');
    let negativeRejected = false;
    try {
      await markService.createMark(
        {
          studentId: 'stu-10027',
          subjectId: 'sub-mat',
          testId: 'tst-cbse10-mat-001',
          marksObtained: -5,
          maxMarks: 50,
        },
        { id: 'teacher-001', name: 'Teacher', role: 'TEACHER' }
      );
    } catch (e: any) {
      negativeRejected = true;
      assert(e.message.includes('negative'), 'Negative marks entry rejected');
    }
    assert(negativeRejected, 'Negative marks guard passed');

    let overMaxRejected = false;
    try {
      await markService.createMark(
        {
          studentId: 'stu-10027',
          subjectId: 'sub-mat',
          testId: 'tst-cbse10-mat-001',
          marksObtained: 60,
          maxMarks: 50,
        },
        { id: 'teacher-001', name: 'Teacher', role: 'TEACHER' }
      );
    } catch (e: any) {
      overMaxRejected = true;
      assert(e.message.includes('exceed'), 'Marks exceeding maxMarks rejected');
    }
    assert(overMaxRejected, 'Over-max marks guard passed\n');

    // ----------------------------------------------------------------------
    // Test 5: Mark Editing with Mandatory Audit Reason (Step 20)
    // ----------------------------------------------------------------------
    console.log('--- Test 5: Mark Editing with Mandatory Audit Reason ---');
    // Attempt edit without reason
    let missingReasonBlocked = false;
    try {
      await markService.updateMark(
        newEntry.id,
        { marksObtained: 48, reason: '' },
        { id: 'teacher-001', name: 'Prof. Rajesh Sharma', role: 'TEACHER' }
      );
    } catch (e: any) {
      missingReasonBlocked = true;
      assert(e.message.includes('reason') || e.message.includes('Audit'), 'Editing without reason was rejected');
    }
    assert(missingReasonBlocked, 'Mandatory audit reason enforcement passed');

    // Legitimate edit with reason
    const editedEntry = await markService.updateMark(
      newEntry.id,
      {
        marksObtained: 48,
        reason: 'Bonus question 5 evaluation added',
      },
      { id: 'teacher-001', name: 'Prof. Rajesh Sharma', role: 'TEACHER' }
    );
    assert(editedEntry.marksObtained === 48, `Marks updated from 46 to ${editedEntry.marksObtained}`);
    assert(editedEntry.percentage === 96.0, `New percentage updated to ${editedEntry.percentage}%`);

    const updatedAuditTrail = await markService.getAuditTrail(newEntry.id);
    assert(updatedAuditTrail.length >= 1, `Audit log entry created for the revision`);
    assert(updatedAuditTrail[0].oldMarks === 46, `Audit log shows old marks: ${updatedAuditTrail[0].oldMarks}`);
    assert(updatedAuditTrail[0].newMarks === 48, `Audit log shows new marks: ${updatedAuditTrail[0].newMarks}`);
    assert(updatedAuditTrail[0].reason === 'Bonus question 5 evaluation added', `Audit reason matches: "${updatedAuditTrail[0].reason}"\n`);

    // ----------------------------------------------------------------------
    // Test 6: Strict Privacy Barrier (Step 18)
    // A student/parent must NEVER be able to access another student's answer sheet
    // ----------------------------------------------------------------------
    console.log('--- Test 6: Strict Security & Privacy Barrier ---');
    // Parent of Rahul Kumar queries marks
    const parentMarks = await markService.getMarks(
      {},
      { id: 'parent-001', role: 'PARENT', studentId: 'IT10025' }
    );
    assert(parentMarks.length > 0, `Parent retrieved ${parentMarks.length} record(s) for linked child`);
    const allBelongToRahul = parentMarks.every(
      (m) => m.studentRoll === 'IT10025' || m.studentName === 'Rahul Kumar'
    );
    assert(allBelongToRahul, 'Parent ONLY sees their own child’s marks and answer sheets');

    // Parent of Rahul Kumar attempts to access Sneha Verma's mark by ID
    let unauthorizedAccessBlocked = false;
    try {
      await markService.getMarkById(newEntry.id, {
        id: 'parent-001',
        role: 'PARENT',
        studentId: 'IT10025',
      });
    } catch (e: any) {
      unauthorizedAccessBlocked = true;
      assert(e.message.includes('Access Denied'), `Unauthorized access attempt strictly rejected: "${e.message}"`);
    }
    assert(unauthorizedAccessBlocked, 'Cross-student answer sheet access successfully blocked with 403 Forbidden\n');

    // ----------------------------------------------------------------------
    // Test 7: Visibility Toggle (Published vs Hidden)
    // ----------------------------------------------------------------------
    console.log('--- Test 7: Visibility Toggle (Published vs Hidden) ---');
    // Hide mark from parent
    await markService.togglePublishStatus(
      rahulMark!.id,
      false,
      { id: 'admin-001', name: 'Admin', role: 'ADMIN' }
    );

    const hiddenParentView = await markService.getMarks(
      {},
      { id: 'parent-001', role: 'PARENT', studentId: 'IT10025' }
    );
    const hiddenFound = hiddenParentView.some((m) => m.id === rahulMark!.id);
    assert(!hiddenFound, 'Unpublished answer sheet is completely hidden from parent view');

    // Re-publish mark to parent
    await markService.togglePublishStatus(
      rahulMark!.id,
      true,
      { id: 'admin-001', name: 'Admin', role: 'ADMIN' }
    );
    const republishedParentView = await markService.getMarks(
      {},
      { id: 'parent-001', role: 'PARENT', studentId: 'IT10025' }
    );
    const republishedFound = republishedParentView.some((m) => m.id === rahulMark!.id);
    assert(republishedFound, 'Published answer sheet is safely visible to authorized parent\n');

    // ----------------------------------------------------------------------
    // Summary
    // ----------------------------------------------------------------------
    console.log('======================================================================');
    console.log(`🎉 ALL STUDENT MARKS & ANSWER SHEET TESTS COMPLETED!`);
    console.log(`   Passed: ${passedTests} / ${totalTests}`);
    console.log('======================================================================');
  } catch (error: any) {
    console.error('❌ Exception during marks system test:', error);
    process.exitCode = 1;
  }
}

runMarksSystemTests();
