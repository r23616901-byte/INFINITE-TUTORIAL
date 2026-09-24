import * as homeReachService from '../services/homeReachService';
import { HomeReachRecordDto, HomeReachConfigDto } from '../types';

async function runHomeReachTests() {
  console.log('======================================================');
  console.log('🧪 TESTING INFINITE TUTORIAL HOME-REACH MODULE (STEP 13)');
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
    // Test 1: Fetch and Validate System Configuration (Admin Configurable)
    // ----------------------------------------------------------------
    console.log('--- Test 1: Validate Home-Reach Configuration ---');
    const initialConfig = await homeReachService.getHomeReachConfig();
    assert(!!initialConfig, 'Home-Reach configuration loaded successfully');
    assert(initialConfig.isEnabled === true, 'Home-Reach module is enabled by default');
    assert(typeof initialConfig.alertThresholdMinutes === 'number', 'Alert threshold minutes is numeric');
    assert(initialConfig.autoNotifyParents === true, 'Parent notification on departure is enabled');
    console.log(`   Current Alert Threshold: ${initialConfig.alertThresholdMinutes} mins\n`);

    // ----------------------------------------------------------------
    // Test 2: Admin Updates Configuration
    // ----------------------------------------------------------------
    console.log('--- Test 2: Admin Updates Configuration ---');
    const updatedConfig = await homeReachService.updateHomeReachConfig({
      alertThresholdMinutes: 50,
      autoNotifyParents: true,
      allowParentSelfConfirm: true,
    });
    assert(updatedConfig.alertThresholdMinutes === 50, 'Admin successfully updated transit alert threshold to 50 mins');
    assert(updatedConfig.allowParentSelfConfirm === true, 'Parent self-confirmation is enabled\n');

    // ----------------------------------------------------------------
    // Test 3: Validate Prompt Example (Rahul Kumar 10A Evening)
    // ----------------------------------------------------------------
    console.log('--- Test 3: Validate User Prompt Example ---');
    console.log('   Expected: Rahul Kumar | 10A Evening | Class Ended: 7:30 PM | Reached Home: 7:52 PM | Status: Reached Home');
    const records = await homeReachService.getHomeReachRecords();
    assert(records.length > 0, `Retrieved ${records.length} home-reach records`);

    const rahulRecord = records.find(r => r.studentName === 'Rahul Kumar' || r.studentRoll === 'IT10025');
    assert(!!rahulRecord, 'Found Rahul Kumar in home reach records');
    if (rahulRecord) {
      assert(rahulRecord.studentName === 'Rahul Kumar', `Student name is "${rahulRecord.studentName}"`);
      assert(rahulRecord.batchName.includes('10A') || rahulRecord.batchName.includes('Evening'), `Batch name is "${rahulRecord.batchName}"`);
      assert(rahulRecord.classEndedTime.includes('7:30 PM'), `Class Ended formatted is "${rahulRecord.classEndedTime}"`);
      assert(!!rahulRecord.reachedHomeTime && rahulRecord.reachedHomeTime.includes('7:52 PM'), `Reached Home formatted is "${rahulRecord.reachedHomeTime}"`);
      assert(rahulRecord.status === 'REACHED_HOME', `Status is "${rahulRecord.status}"`);
      assert(rahulRecord.transitMinutes === 22, `Calculated transit duration is 22 minutes (7:30 PM -> 7:52 PM)`);
      console.log(`   Exact prompt verified: [${rahulRecord.studentName} | ${rahulRecord.batchName} | Ended: ${rahulRecord.classEndedTime} | Reached: ${rahulRecord.reachedHomeTime} | Status: ${rahulRecord.status} | Duration: ${rahulRecord.transitMinutes} mins]\n`);
    }

    // ----------------------------------------------------------------
    // Test 4: Role-Based Filtering - Parent Access
    // ----------------------------------------------------------------
    console.log('--- Test 4: Role-Based Access for Parent ---');
    const parentSummary = await homeReachService.getHomeReachRecords(
      {},
      { id: 'parent-001', role: 'PARENT', phone: '9876543210' }
    );
    assert(parentSummary.length > 0, `Parent retrieved ${parentSummary.length} record(s) for linked child`);
    const allBelongToRahul = parentSummary.every(r => r.studentRoll === 'IT10025' || r.studentName === 'Rahul Kumar');
    assert(allBelongToRahul, 'Parent view only includes records for authorized student (strict privacy)');
    console.log(`   Parent view verified for child: ${parentSummary[0]?.studentName}\n`);

    // ----------------------------------------------------------------
    // Test 5: Teacher Records Batch Departure
    // ----------------------------------------------------------------
    console.log('--- Test 5: Teacher Records Batch Departure ---');
    const departureResult = await homeReachService.recordClassEnded(
      {
        studentIds: ['stu-10026'],
        batchId: 'batch-10a-evening',
        date: new Date().toISOString().split('T')[0],
        session: 'EVENING',
        classEndedTime: '7:30 PM',
        notes: 'Class dismissed on schedule'
      },
      { id: 'teacher-001', name: 'Prof. Rajesh Sharma', role: 'TEACHER' }
    );
    assert(departureResult.length === 1, 'Successfully recorded departure for student');
    assert(departureResult[0].status === 'LEFT_TUITION', 'Student status transitioned to LEFT_TUITION');
    assert(departureResult[0].classEndedTime.includes('7:30 PM'), `Class Ended formatted correctly as "${departureResult[0].classEndedTime}"`);
    console.log(`   Recorded departure: [Student: ${departureResult[0].studentName} | Ended: ${departureResult[0].classEndedTime} | Status: ${departureResult[0].status}]\n`);

    // ----------------------------------------------------------------
    // Test 6: Parent Confirms Reached Home (Arrival)
    // ----------------------------------------------------------------
    console.log('--- Test 6: Parent Confirms Reached Home ---');
    const arrivalResult = await homeReachService.confirmReachedHome(
      {
        studentId: departureResult[0].studentId,
        reachedHomeTime: '7:55 PM',
        notes: 'Safely arrived home with sibling'
      },
      { id: 'parent-002', name: 'Mrs. Verma', role: 'PARENT' }
    );
    assert(arrivalResult.status === 'REACHED_HOME', 'Student status transitioned to REACHED_HOME');
    assert(!!arrivalResult.reachedHomeTime && arrivalResult.reachedHomeTime.includes('7:55 PM'), `Reached Home formatted as "${arrivalResult.reachedHomeTime}"`);
    assert(arrivalResult.transitMinutes === 25, `Transit duration calculated accurately as ${arrivalResult.transitMinutes} mins (expected 25)`);
    assert(arrivalResult.notes === 'Safely arrived home with sibling', 'Parent remarks saved');
    console.log(`   Arrival confirmed: [Status: ${arrivalResult.status} | Reached: ${arrivalResult.reachedHomeTime} | Transit: ${arrivalResult.transitMinutes} mins]\n`);

    // ----------------------------------------------------------------
    // Test 7: Delayed Alert Status Flagging
    // ----------------------------------------------------------------
    console.log('--- Test 7: Delayed Alert Status Flagging ---');
    const delayedRecord = records.find(r => r.status === 'DELAYED');
    assert(!!delayedRecord, 'Found DELAYED status record for transit monitoring alerts');
    if (delayedRecord) {
      console.log(`   Delayed alert record: [Student: ${delayedRecord.studentName} | Status: ${delayedRecord.status} | Alert Note: ${delayedRecord.notes || 'Transit threshold exceeded'}]\n`);
    }

    // ----------------------------------------------------------------
    // Test 8: Admin Disabling Module Enforcement
    // ----------------------------------------------------------------
    console.log('--- Test 8: Admin Configuration Toggle Test ---');
    await homeReachService.updateHomeReachConfig({ isEnabled: false });
    let blockedAsExpected = false;
    try {
      await homeReachService.recordClassEnded(
        { batchId: 'batch-10a-evening' },
        { id: 'teacher-001', name: 'Prof. Rajesh Sharma', role: 'TEACHER' }
      );
    } catch (err: any) {
      blockedAsExpected = true;
      assert(err.message.includes('disabled'), 'Teacher action blocked when Admin disabled module');
    }
    assert(blockedAsExpected, 'Admin disable enforcement validated');
    // Re-enable for ongoing operations
    await homeReachService.updateHomeReachConfig({ isEnabled: true });
    console.log('   Re-enabled Home-Reach module successfully.\n');

    // ----------------------------------------------------------------
    // Summary
    // ----------------------------------------------------------------
    console.log('======================================================');
    console.log(`🎉 ALL HOME-REACH MODULE TESTS COMPLETED!`);
    console.log(`   Passed: ${passedTests} / ${totalTests}`);
    console.log('======================================================');
  } catch (error: any) {
    console.error('❌ Exception during Home-Reach tests:', error);
    process.exitCode = 1;
  }
}

runHomeReachTests();
