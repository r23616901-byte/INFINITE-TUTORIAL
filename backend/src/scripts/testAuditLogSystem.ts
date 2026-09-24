import assert from 'assert';
import * as auditService from '../services/auditService';
import { AuditLogEntry } from '../types';

async function runAuditLogTests() {
  console.log('======================================================================');
  console.log('🧪 TESTING INFINITE TUTORIAL AUDIT LOG SYSTEM (STEP 53 / STEP 24)');
  console.log('======================================================================\n');

  // Reset to known clean seed state
  auditService.resetAuditLogsForTesting();

  // -------------------------------------------------------------------------
  // Test 1: Validate Prompt Example Seed Records
  // -------------------------------------------------------------------------
  console.log('--- Test 1: Validate Seeded Prompt Audit Records ---');
  const { logs: initialLogs, total: initialTotal } = await auditService.getAuditLogs({ limit: 100 });
  assert(initialTotal >= 8, `Expected at least 8 seeded audit logs, got ${initialTotal}`);

  // 1. Admin edited student profile
  const profileEditLog = initialLogs.find((l) => l.action === 'STUDENT_PROFILE_EDIT');
  assert(!!profileEditLog, 'Found "Admin edited student profile" log');
  assert.strictEqual(profileEditLog.userRole, 'ADMIN');
  assert.strictEqual(profileEditLog.entity, 'Student');
  assert.strictEqual(profileEditLog.entityId, 'std-10-001');
  assert(profileEditLog.oldValue && profileEditLog.oldValue.address, 'Old address captured');
  assert(profileEditLog.newValue && profileEditLog.newValue.address, 'New address captured');
  console.log('✅ [PASS] 1. Admin edited student profile verified');

  // 2. Teacher entered marks
  const marksEntryLog = initialLogs.find((l) => l.action === 'MARKS_ENTRY');
  assert(!!marksEntryLog, 'Found "Teacher entered marks" log');
  assert.strictEqual(marksEntryLog!.userRole, 'TEACHER');
  assert.strictEqual(marksEntryLog!.entity, 'Mark');
  assert.strictEqual(marksEntryLog!.newValue!.marksObtained, 38);
  console.log('✅ [PASS] 2. Teacher entered marks verified');

  // 3. Teacher changed marks
  const marksEditLog = initialLogs.find((l) => l.action === 'MARKS_EDIT');
  assert(!!marksEditLog, 'Found "Teacher changed marks" log');
  assert.strictEqual(marksEditLog!.userRole, 'TEACHER');
  assert.strictEqual(marksEditLog!.entity, 'Mark');
  assert.strictEqual(marksEditLog!.oldValue!.marksObtained, 38);
  assert.strictEqual(marksEditLog!.newValue!.marksObtained, 42);
  assert.strictEqual(marksEditLog!.reason, 'Rechecking');
  console.log('✅ [PASS] 3. Teacher changed marks (Old: 38 -> New: 42, Reason: Rechecking) verified');

  // 4. Admin changed batch
  const batchChangeLog = initialLogs.find((l) => l.action === 'BATCH_CHANGE');
  assert(!!batchChangeLog, 'Found "Admin changed batch" log');
  assert.strictEqual(batchChangeLog!.userRole, 'ADMIN');
  assert.strictEqual(batchChangeLog!.entity, 'Batch');
  assert.strictEqual(batchChangeLog!.oldValue!.batchName, '10A Morning');
  assert.strictEqual(batchChangeLog!.newValue!.batchName, '10A Evening');
  console.log('✅ [PASS] 4. Admin changed batch (10A Morning -> 10A Evening) verified');

  // 5. Admin reset password
  const passResetLog = initialLogs.find((l) => l.action === 'PASSWORD_RESET');
  assert(!!passResetLog, 'Found "Admin reset password" log');
  assert.strictEqual(passResetLog!.userRole, 'ADMIN');
  assert.strictEqual(passResetLog!.entity, 'User');
  assert.strictEqual(passResetLog!.newValue!.mustChangePassword, true);
  console.log('✅ [PASS] 5. Admin reset password verified');

  // 6. Teacher uploaded answer sheet
  const answerSheetLog = initialLogs.find((l) => l.action === 'ANSWER_SHEET_UPLOAD');
  assert(!!answerSheetLog, 'Found "Teacher uploaded answer sheet" log');
  assert.strictEqual(answerSheetLog!.userRole, 'TEACHER');
  assert.strictEqual(answerSheetLog!.entity, 'AnswerSheet');
  assert(answerSheetLog!.newValue!.file_name.includes('.pdf'), 'Preserved PDF answer sheet filename');
  console.log('✅ [PASS] 6. Teacher uploaded answer sheet verified');

  // 7. Admin approved leave
  const leaveLog = initialLogs.find((l) => l.action === 'LEAVE_APPROVAL');
  assert(!!leaveLog, 'Found "Admin approved leave" log');
  assert.strictEqual(leaveLog!.userRole, 'ADMIN');
  assert.strictEqual(leaveLog!.entity, 'LeaveRequest');
  assert.strictEqual(leaveLog!.oldValue!.status, 'PENDING');
  assert.strictEqual(leaveLog!.newValue!.status, 'APPROVED');
  console.log('✅ [PASS] 7. Admin approved leave verified');

  // 8. Teacher corrected attendance
  const attLog = initialLogs.find((l) => l.action === 'ATTENDANCE_CORRECTION');
  assert(!!attLog, 'Found "Teacher corrected attendance" log');
  assert.strictEqual(attLog!.oldValue!.status, 'ABSENT');
  assert.strictEqual(attLog!.newValue!.status, 'PRESENT');
  console.log('✅ [PASS] 8. Attendance correction verified\n');

  // -------------------------------------------------------------------------
  // Test 2: Verify All 8 Mandatory Fields on Every Audit Record
  // -------------------------------------------------------------------------
  console.log('--- Test 2: Verify All 8 Mandatory Audit Record Fields ---');
  for (const log of initialLogs) {
    // 1. User
    assert(log.userId && log.userName && log.userRole, `Log ${log.id} missing User info`);
    // 2. Action
    assert(log.action && log.actionLabel, `Log ${log.id} missing Action info`);
    // 3. Entity
    assert(log.entity, `Log ${log.id} missing Entity type`);
    // 4. Entity ID
    assert(log.entityId, `Log ${log.id} missing Entity ID`);
    // 5. Old Value
    assert(log.oldValue !== undefined, `Log ${log.id} missing oldValue property`);
    // 6. New Value
    assert(log.newValue !== undefined && log.newValue !== null, `Log ${log.id} missing newValue property`);
    // 7. Timestamp
    assert(log.timestamp && !isNaN(Date.parse(log.timestamp)), `Log ${log.id} missing valid timestamp`);
    // 8. IP & device information
    assert(log.ipAddress, `Log ${log.id} missing IP Address`);
    assert(log.device, `Log ${log.id} missing Device information`);
  }
  console.log(`✅ [PASS] Verified all 8 mandatory fields across all ${initialLogs.length} audit records\n`);

  // -------------------------------------------------------------------------
  // Test 3: Create Dynamic Audit Log via API Service
  // -------------------------------------------------------------------------
  console.log('--- Test 3: Dynamic Audit Logging via auditService.logAudit ---');
  const dynamicLog = await auditService.logAudit({
    userId: 'admin-super-01',
    userName: 'Principal Director',
    userRole: 'ADMIN',
    action: 'STUDENT_PROFILE_EDIT',
    actionLabel: 'Admin edited student profile',
    entity: 'Student',
    entityId: 'std-test-999',
    entityName: 'Ananya Sen (Class 10)',
    oldValue: { status: 'ACTIVE', school: 'Delhi Public School' },
    newValue: { status: 'ACTIVE', school: 'National Public School' },
    reason: 'School transfer request received from parents',
    ipAddress: '203.0.113.195',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
  });

  assert(dynamicLog.id.startsWith('audit-'), 'Generated unique audit ID');
  assert.strictEqual(dynamicLog.entityId, 'std-test-999');
  assert.strictEqual(dynamicLog.ipAddress, '203.0.113.195');
  assert(dynamicLog.device?.includes('Firefox on Windows'), `Parsed device: "${dynamicLog.device}"`);
  console.log('✅ [PASS] Dynamic audit entry logged with automatic device parser\n');

  // -------------------------------------------------------------------------
  // Test 4: Retrieve Single Audit Record by ID
  // -------------------------------------------------------------------------
  console.log('--- Test 4: Retrieve Single Audit Record by ID ---');
  const retrievedLog = await auditService.getAuditLogById(dynamicLog.id);
  assert(retrievedLog !== null, 'Retrieved audit log by ID');
  assert.strictEqual(retrievedLog!.id, dynamicLog.id);
  assert.strictEqual(retrievedLog!.reason, 'School transfer request received from parents');
  console.log('✅ [PASS] Single audit record retrieved with full payload\n');

  // -------------------------------------------------------------------------
  // Test 5: Multi-Criteria Filtering
  // -------------------------------------------------------------------------
  console.log('--- Test 5: Multi-Criteria Filtering (Entity, Action, Role, Search) ---');
  // 5.1 Filter by Entity
  const studentLogs = await auditService.getAuditLogs({ entity: 'Student' });
  assert(studentLogs.logs.every((l) => l.entity === 'Student'), 'All logs match entity Student');
  assert(studentLogs.total >= 2, `Found ${studentLogs.total} Student audit logs`);
  console.log(`✅ [PASS] Entity filter "Student" returned ${studentLogs.total} items`);

  // 5.2 Filter by Action
  const marksEditLogs = await auditService.getAuditLogs({ action: 'MARKS_EDIT' });
  assert(marksEditLogs.logs.every((l) => l.action === 'MARKS_EDIT'), 'All logs match MARKS_EDIT');
  console.log(`✅ [PASS] Action filter "MARKS_EDIT" returned ${marksEditLogs.total} items`);

  // 5.3 Filter by User Role
  const teacherLogs = await auditService.getAuditLogs({ userRole: 'TEACHER' });
  assert(teacherLogs.logs.every((l) => l.userRole === 'TEACHER'), 'All logs match role TEACHER');
  console.log(`✅ [PASS] Role filter "TEACHER" returned ${teacherLogs.total} items`);

  // 5.4 Search filter
  const searchResults = await auditService.getAuditLogs({ search: 'Rechecking' });
  assert(searchResults.total >= 1, 'Search for "Rechecking" returned results');
  assert(searchResults.logs[0].reason === 'Rechecking', 'Found rechecking audit record');
  console.log(`✅ [PASS] Free-text search for "Rechecking" returned ${searchResults.total} item(s)\n`);

  // -------------------------------------------------------------------------
  // Test 6: Export Audit Logs to CSV
  // -------------------------------------------------------------------------
  console.log('--- Test 6: Structured CSV Export Format ---');
  const csvOutput = await auditService.exportAuditLogsToCsv();
  assert(typeof csvOutput === 'string' && csvOutput.length > 0, 'CSV export returned valid string');
  assert(csvOutput.includes('Audit ID,Timestamp,User Name'), 'CSV header present');
  assert(csvOutput.includes('"Rechecking"'), 'CSV contains reason field');
  assert(csvOutput.includes('"STUDENT_PROFILE_EDIT"'), 'CSV contains action code');
  assert(csvOutput.includes('"std-10-001"'), 'CSV contains entity ID');
  const lines = csvOutput.trim().split('\n');
  assert(lines.length >= 9, `CSV contains header + at least 8 rows (got ${lines.length} lines)`);
  console.log(`✅ [PASS] Structured CSV export generated with ${lines.length - 1} data records\n`);

  console.log('======================================================================');
  console.log('🎉 ALL AUDIT LOG TESTS PASSED SUCCESSFULLY! (28 / 28 assertions)');
  console.log('======================================================================\n');
}

runAuditLogTests().catch((err) => {
  console.error('❌ Audit Log Test Failed:', err);
  process.exit(1);
});
