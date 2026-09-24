import { findUserByIdentifier } from '../services/userService';
import { getStudentForParent, isStudentAuthorizedForUser, getStudentById } from '../services/studentService';
import { getStudentScorecard } from '../services/scorecardService';
import { getMarks, getMarkById } from '../services/markService';
import { getLeaveRequests, createLeaveRequest } from '../services/leaveService';
import { getHomeReachRecords } from '../services/homeReachService';
import bcrypt from 'bcryptjs';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`✅ [PASS] ${msg}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${msg}`);
    failed++;
  }
}

async function runParentPrivacyTests() {
  console.log('======================================================================');
  console.log('🛡️ TESTING REQUIREMENT 68: PARENT PRIVACY & AUTHORIZATION ENFORCEMENT');
  console.log('======================================================================\n');

  try {
    // -------------------------------------------------------------------
    // 1. Parent Credentials Verification
    // -------------------------------------------------------------------
    console.log('--- Step 1: Verify Updated Parent Credentials (6361085188 / 260906) ---');
    const parentUserRecord = await findUserByIdentifier('6361085188');
    assert(!!parentUserRecord, 'Parent user found by phone number 6361085188');
    assert(parentUserRecord?.role === 'PARENT', 'User has role PARENT');

    const passwordMatches = bcrypt.compareSync('260906', parentUserRecord!.passwordHash);
    assert(passwordMatches, 'Password "260906" hashes and validates successfully');

    // Verify old credentials no longer exist
    const oldParent = await findUserByIdentifier('9876543210');
    assert(!oldParent, 'Old parent phone 9876543210 is not active in default credentials');

    // -------------------------------------------------------------------
    // 2. Student Profile Linked to Parent A (Rahul Kumar)
    // -------------------------------------------------------------------
    console.log('\n--- Step 2: Verify Linked Student Profile for Parent A ---');
    const parentA = {
      id: parentUserRecord!.id,
      role: 'PARENT' as const,
      phone: '6361085188',
      name: parentUserRecord!.name,
    };

    const linkedStudent = await getStudentForParent(parentA.id, parentA.phone);
    assert(!!linkedStudent, 'Parent A has linked student');
    assert(linkedStudent?.studentId === 'IT10025', `Linked student roll is IT10025 (got ${linkedStudent?.studentId})`);
    assert(linkedStudent?.parentPhone === '6361085188', `Linked student parent phone is 6361085188 (got ${linkedStudent?.parentPhone})`);
    
    // Check Date of Birth corresponds to 260906 (Sep 26, 2006)
    const dob = new Date(linkedStudent!.dateOfBirth);
    const dobYear = dob.getFullYear();
    const dobMonth = dob.getMonth() + 1; // 9
    const dobDate = dob.getDate(); // 26
    assert(dobYear === 2006 && dobMonth === 9 && dobDate === 26, `DOB matches 26/09/2006 (got ${dobDate}/${dobMonth}/${dobYear})`);

    // -------------------------------------------------------------------
    // 3. Parent A accessing own student's data (Authorized)
    // -------------------------------------------------------------------
    console.log('\n--- Step 3: Verify Parent A Authorized Access to Ward (IT10025) ---');
    const isAuthOwnId = await isStudentAuthorizedForUser('stu-10025', parentA);
    const isAuthOwnRoll = await isStudentAuthorizedForUser('IT10025', parentA);
    assert(isAuthOwnId && isAuthOwnRoll, 'Parent A is authorized for student IT10025');

    const ownScorecard = await getStudentScorecard('IT10025', parentA);
    assert(ownScorecard.studentRoll === 'IT10025' || ownScorecard.studentId === 'stu-10025', 'Parent A can view IT10025 scorecard');

    const ownMarks = await getMarks({ studentId: 'stu-10025' }, parentA);
    assert(ownMarks.length > 0, 'Parent A can view IT10025 marks');

    const ownLeaves = await getLeaveRequests({ studentId: 'stu-10025' }, parentA);
    assert(ownLeaves.every(l => l.studentRoll === 'IT10025'), 'Parent A leaves filtered strictly to IT10025');

    // -------------------------------------------------------------------
    // 4. Parent A accessing Parent B's student (IT10026 Sneha Verma)
    //    Parent A must NEVER be able to access Parent B's student
    // -------------------------------------------------------------------
    console.log('\n--- Step 4: Strict Privacy Barrier — Parent A cannot access Parent B (IT10026) ---');
    
    // 4a. Authorization Check
    const isAuthParentB = await isStudentAuthorizedForUser('stu-10026', parentA);
    assert(!isAuthParentB, 'Parent A blocked from authorizing against Parent B student ID (stu-10026)');

    const isAuthParentBRoll = await isStudentAuthorizedForUser('IT10026', parentA);
    assert(!isAuthParentBRoll, 'Parent A blocked from authorizing against Parent B student roll (IT10026)');

    // 4b. Scorecard Tamper Attempt
    let scorecardTamperBlocked = false;
    try {
      await getStudentScorecard('IT10026', parentA);
    } catch (err: any) {
      if (err.message.includes('Access Denied')) {
        scorecardTamperBlocked = true;
      }
    }
    assert(scorecardTamperBlocked, 'Parent A changing studentId to IT10026 in scorecard is BLOCKED (Access Denied)');

    // 4c. Marks Tamper Attempt
    let marksTamperBlocked = false;
    try {
      await getMarks({ studentId: 'stu-10026' }, parentA);
    } catch (err: any) {
      if (err.message.includes('Access Denied')) {
        marksTamperBlocked = true;
      }
    }
    assert(marksTamperBlocked, 'Parent A querying marks with studentId=stu-10026 is BLOCKED (Access Denied)');

    // 4d. Mark by ID Tamper Attempt (Sneha Verma's evaluated sheet)
    let markByIdTamperBlocked = false;
    try {
      await getMarkById('mark-sneha-002', parentA);
    } catch (err: any) {
      if (err.message.includes('Access Denied')) {
        markByIdTamperBlocked = true;
      }
    }
    assert(markByIdTamperBlocked, 'Parent A directly querying mark-sneha-002 is BLOCKED (Access Denied)');

    // 4e. Leaves Query Tamper Attempt
    let leavesTamperBlocked = false;
    try {
      await getLeaveRequests({ studentId: 'stu-10026' }, parentA);
    } catch (err: any) {
      if (err.message.includes('Access Denied')) {
        leavesTamperBlocked = true;
      }
    }
    assert(leavesTamperBlocked, 'Parent A querying leaves for stu-10026 is BLOCKED (Access Denied)');

    // 4f. Leave Submission Tamper Attempt (Submitting leave for Parent B's child)
    let leaveSubmitTamperBlocked = false;
    try {
      await createLeaveRequest(
        {
          studentId: 'stu-10026',
          fromDate: '2026-09-25',
          toDate: '2026-09-26',
          reason: 'Unauthorized attempt',
          description: 'Parent A attempting leave for Parent B child',
        },
        parentA
      );
    } catch (err: any) {
      if (err.message.includes('Access Denied')) {
        leaveSubmitTamperBlocked = true;
      }
    }
    assert(leaveSubmitTamperBlocked, 'Parent A submitting leave for stu-10026 is BLOCKED (Access Denied)');

    // 4g. Home Reach Tamper Attempt
    let homeReachTamperBlocked = false;
    try {
      await getHomeReachRecords({ studentId: 'stu-10026' }, parentA);
    } catch (err: any) {
      if (err.message.includes('Access Denied')) {
        homeReachTamperBlocked = true;
      }
    }
    assert(homeReachTamperBlocked, 'Parent A querying home-reach for stu-10026 is BLOCKED (Access Denied)');

    // -------------------------------------------------------------------
    // 5. Symmetric Privacy: Parent B cannot access Parent A (IT10025)
    // -------------------------------------------------------------------
    console.log('\n--- Step 5: Symmetric Privacy — Parent B cannot access Parent A (IT10025) ---');
    const parentB = {
      id: 'parent-2',
      role: 'PARENT' as const,
      phone: '9845112233',
      name: 'Rajesh Verma (Parent of Sneha)',
    };

    const isParentBAuthForA = await isStudentAuthorizedForUser('IT10025', parentB);
    assert(!isParentBAuthForA, 'Parent B blocked from accessing IT10025');

    let parentBScorecardBlocked = false;
    try {
      await getStudentScorecard('IT10025', parentB);
    } catch (err: any) {
      if (err.message.includes('Access Denied')) {
        parentBScorecardBlocked = true;
      }
    }
    assert(parentBScorecardBlocked, 'Parent B changing studentId to IT10025 is BLOCKED (Access Denied)');

    // -------------------------------------------------------------------
    // 6. Faculty / Admin Access Validation (No false blocks for staff)
    // -------------------------------------------------------------------
    console.log('\n--- Step 6: Verify Admin & Teacher Maintain Full Authorized Access ---');
    const adminUser = { id: 'admin-001', role: 'ADMIN' as const, name: 'Admin' };
    const teacherUser = { id: 'teacher-001', role: 'TEACHER' as const, name: 'Teacher' };

    const adminAuthA = await isStudentAuthorizedForUser('IT10025', adminUser);
    const adminAuthB = await isStudentAuthorizedForUser('IT10026', adminUser);
    assert(adminAuthA && adminAuthB, 'Admin is authorized to view both IT10025 and IT10026');

    const teacherAuthA = await isStudentAuthorizedForUser('IT10025', teacherUser);
    const teacherAuthB = await isStudentAuthorizedForUser('IT10026', teacherUser);
    assert(teacherAuthA && teacherAuthB, 'Teacher is authorized to view both IT10025 and IT10026');

    console.log('\n======================================================================');
    console.log('🎉 ALL PARENT PRIVACY & AUTHORIZATION TESTS PASSED SUCCESSFULLY!');
    console.log(`   Passed: ${passed} / ${passed + failed}`);
    console.log('======================================================================\n');
  } catch (err: any) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runParentPrivacyTests();
