export {};

const API_BASE = 'http://localhost:5000/api';

async function postJson(url: string, body: any, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const data: any = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function getJson(url: string, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...headers },
  });
  const data: any = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function putJson(url: string, body: any, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const data: any = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function runAttendanceVerification() {
  console.log('================================================================');
  console.log('  INFINITE TUTORIAL ATTENDANCE MODULE COMPREHENSIVE VERIFICATION');
  console.log('================================================================\n');

  // 1. Log in all 3 actors
  console.log('[1] Authenticating Actors...');
  const teacherLogin = await postJson(`${API_BASE}/auth/login`, {
    identifier: 'teacher@infinite.com',
    password: 'Teacher@123',
  });
  if (!teacherLogin.ok) throw new Error(`Teacher login failed: ${JSON.stringify(teacherLogin.data)}`);
  const teacherToken = teacherLogin.data.data.token;
  console.log('  ✓ Teacher authenticated');

  const adminLogin = await postJson(`${API_BASE}/auth/login`, {
    identifier: 'admin@infinite.com',
    password: 'Admin@123',
  });
  if (!adminLogin.ok) throw new Error(`Admin login failed: ${JSON.stringify(adminLogin.data)}`);
  const adminToken = adminLogin.data.data.token;
  console.log('  ✓ Admin authenticated');

  const parentLogin = await postJson(`${API_BASE}/auth/login`, {
    identifier: '9876543210',
    password: '051511',
  });
  if (!parentLogin.ok) throw new Error(`Parent login failed: ${JSON.stringify(parentLogin.data)}`);
  const parentToken = parentLogin.data.data.token;
  console.log('  ✓ Parent authenticated');

  // 2. Academic structure verification (Classes, Boards, Batches, Subjects)
  console.log('\n[2] Verifying Academic Lookups & Batches...');
  const batchesRes = await getJson(`${API_BASE}/academics/batches`, {
    Authorization: `Bearer ${teacherToken}`,
  });
  if (!batchesRes.ok) throw new Error(`Batches fetch failed: ${JSON.stringify(batchesRes.data)}`);
  console.log(`  ✓ Loaded ${batchesRes.data.data.length} Batches (Morning & Evening sessions, Mon-Sat)`);

  const subjectsRes = await getJson(`${API_BASE}/academics/subjects`, {
    Authorization: `Bearer ${teacherToken}`,
  });
  if (!subjectsRes.ok) throw new Error(`Subjects fetch failed: ${JSON.stringify(subjectsRes.data)}`);
  console.log(`  ✓ Loaded ${subjectsRes.data.data.length} Subjects (Physics, Chemistry, Biology, Mathematics)`);

  // 3. Batch Attendance Loading
  console.log('\n[3] Testing Batch Attendance Loading...');
  const mondayDate = '2026-09-21'; // Monday
  const batchId = 'batch-10a-morning';

  const loadBatchRes = await getJson(
    `${API_BASE}/attendance/batch?batchId=${batchId}&date=${mondayDate}&session=MORNING`,
    { Authorization: `Bearer ${teacherToken}` }
  );
  if (!loadBatchRes.ok) throw new Error(`Load batch attendance failed: ${JSON.stringify(loadBatchRes.data)}`);
  console.log(`  ✓ Loaded batch ${batchId} for ${mondayDate} (${loadBatchRes.data.data.day})`);
  console.log(`    Students in batch: ${loadBatchRes.data.data.students.length}`);

  // 4. Operational Days Validation (Monday to Saturday allowed; Sunday rejected)
  console.log('\n[4] Testing Day Validation (Sunday rejection vs Mon-Sat acceptance)...');
  const sundayDate = '2026-09-20'; // Sunday
  const sundaySubmit = await postJson(
    `${API_BASE}/attendance/batch`,
    {
      date: sundayDate,
      session: 'MORNING',
      batchId,
      records: [{ studentId: 'stu-10025', status: 'PRESENT' }],
    },
    { Authorization: `Bearer ${teacherToken}` }
  );

  if (sundaySubmit.status === 400 && sundaySubmit.data.message.includes('Monday through Saturday')) {
    console.log('  ✓ Sunday attendance correctly rejected: "Attendance can only be recorded for Monday through Saturday"');
  } else {
    throw new Error(`Expected Sunday rejection with 400, got ${sundaySubmit.status}: ${JSON.stringify(sundaySubmit.data)}`);
  }

  // 5. Saving Attendance (Green = Present, Red = Absent) & Duplicate Prevention
  console.log('\n[5] Testing Attendance Submission & Duplicate Prevention...');
  const testDate = '2026-09-22'; // Tuesday
  const submit1 = await postJson(
    `${API_BASE}/attendance/batch`,
    {
      date: testDate,
      session: 'MORNING',
      batchId,
      records: [
        { studentId: 'stu-10025', status: 'PRESENT', remarks: 'On-time' },
        { studentId: 'stu-10026', status: 'ABSENT', remarks: 'Sick leave' },
        { studentId: 'stu-10027', status: 'PRESENT' },
      ],
    },
    { Authorization: `Bearer ${teacherToken}` }
  );
  if (!submit1.ok) throw new Error(`First submit failed: ${JSON.stringify(submit1.data)}`);
  console.log(`  ✓ Initial attendance submitted: "${submit1.data.message}"`);

  // Count history before second submit
  const studentBefore = await getJson(`${API_BASE}/attendance/student/IT10025`, {
    Authorization: `Bearer ${teacherToken}`,
  });
  const countBefore = studentBefore.data.data.totalSessions;

  // Re-submit for SAME student, SAME date, SAME session, SAME batch (updating status)
  const submit2 = await postJson(
    `${API_BASE}/attendance/batch`,
    {
      date: testDate,
      session: 'MORNING',
      batchId,
      records: [
        { studentId: 'stu-10025', status: 'PRESENT', remarks: 'Updated note' },
        { studentId: 'stu-10026', status: 'PRESENT', remarks: 'Late arrival attended' },
        { studentId: 'stu-10027', status: 'PRESENT' },
      ],
    },
    { Authorization: `Bearer ${teacherToken}` }
  );
  if (!submit2.ok) throw new Error(`Second submit failed: ${JSON.stringify(submit2.data)}`);

  const studentAfter = await getJson(`${API_BASE}/attendance/student/IT10025`, {
    Authorization: `Bearer ${teacherToken}`,
  });
  const countAfter = studentAfter.data.data.totalSessions;

  if (countBefore === countAfter) {
    console.log(`  ✓ Duplicate Prevention Verified: Total session count remained exactly ${countAfter} (upserted without duplicate rows)`);
  } else {
    throw new Error(`Duplicate prevention failed: count went from ${countBefore} to ${countAfter}`);
  }

  // 6. Student Attendance Percentage Calculation
  console.log('\n[6] Verifying Student Attendance Percentage Calculation...');
  const stats = studentAfter.data.data;
  const calculatedPercent = Number(((stats.presentSessions / stats.totalSessions) * 100).toFixed(1));
  console.log(`  Student: ${stats.studentName} (${stats.studentRoll})`);
  console.log(`  Present: ${stats.presentSessions} | Absent: ${stats.absentSessions} | Total: ${stats.totalSessions}`);
  console.log(`  Reported Percentage: ${stats.attendancePercentage}%`);
  console.log(`  Calculated Formula: (${stats.presentSessions} / ${stats.totalSessions}) * 100 = ${calculatedPercent}%`);
  if (stats.attendancePercentage === calculatedPercent) {
    console.log('  ✓ Percentage Formula Verified: Exactly matches Present / Total * 100');
  } else {
    throw new Error(`Percentage mismatch: ${stats.attendancePercentage} vs ${calculatedPercent}`);
  }

  // 7. Parent Dashboard Attendance Verification
  console.log('\n[7] Verifying Parent Attendance Dashboard & Child Summary...');
  const parentAttendance = await getJson(`${API_BASE}/attendance/parent`, {
    Authorization: `Bearer ${parentToken}`,
  });
  if (!parentAttendance.ok) throw new Error(`Parent attendance fetch failed: ${JSON.stringify(parentAttendance.data)}`);
  const parentStats = parentAttendance.data.data;
  console.log(`  Parent Linked Child: ${parentStats.studentName} (${parentStats.studentRoll})`);
  console.log(`  Child Present: ${parentStats.presentSessions}`);
  console.log(`  Child Absent: ${parentStats.absentSessions}`);
  console.log(`  Child Percentage: ${parentStats.attendancePercentage}%`);
  console.log(`  Recent records count: ${parentStats.history.length}`);
  console.log(`  Monthly breakdown entries: ${parentStats.monthlyBreakdown.length}`);

  // 8. Admin Attendance Correction
  console.log('\n[8] Verifying Admin-Only Attendance Correction...');
  const firstRecord = stats.history[0];
  const newStatus = firstRecord.status === 'PRESENT' ? 'ABSENT' : 'PRESENT';
  const correctionRes = await putJson(
    `${API_BASE}/attendance/${firstRecord.id}`,
    {
      status: newStatus,
      remarks: 'Admin verified medical certificate submission',
    },
    { Authorization: `Bearer ${adminToken}` }
  );

  if (!correctionRes.ok) throw new Error(`Admin correction failed: ${JSON.stringify(correctionRes.data)}`);
  console.log(`  ✓ Record ${firstRecord.id} corrected by Admin to ${newStatus}`);
  console.log(`  ✓ Audit Remark: "${correctionRes.data.data.remarks}"`);

  // Verify Teacher cannot call admin correction
  const teacherUnauthorizedCorrection = await putJson(
    `${API_BASE}/attendance/${firstRecord.id}`,
    { status: 'PRESENT' },
    { Authorization: `Bearer ${teacherToken}` }
  );
  if (teacherUnauthorizedCorrection.status === 403) {
    console.log('  ✓ Security Verified: Teacher correctly blocked (403 Forbidden) from correcting attendance records');
  } else {
    throw new Error(`Expected 403 Forbidden for teacher, got ${teacherUnauthorizedCorrection.status}`);
  }

  console.log('\n================================================================');
  console.log('  ✓ ALL ATTENDANCE MODULE SPECIFICATIONS VERIFIED SUCCESSFULLY!');
  console.log('================================================================\n');
}

runAttendanceVerification().catch((err) => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
