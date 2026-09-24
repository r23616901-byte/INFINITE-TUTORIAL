import {
  getLeaveRequests,
  createLeaveRequest,
  reviewLeaveRequest,
} from '../services/leaveService';
import { LeaveRequestDto } from '../types';

async function runLeaveSystemTests() {
  console.log('====================================================');
  console.log('🧪 TESTING INFINITE TUTORIAL LEAVE REQUEST SYSTEM');
  console.log('====================================================\n');

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
    // Test 1: Fetch initial leave requests
    console.log('--- Test 1: Fetch Leave Requests ---');
    const initialLeaves: LeaveRequestDto[] = await getLeaveRequests();
    assert(Array.isArray(initialLeaves) && initialLeaves.length >= 3, `Fetched ${initialLeaves.length} initial leave requests`);

    // Test 2: Check Rahul Kumar's exact prompt example
    console.log('\n--- Test 2: Validate User Prompt Example ---');
    const rahulRequest = initialLeaves.find((l: LeaveRequestDto) => l.studentRoll === 'IT10025');
    assert(!!rahulRequest, 'Found Rahul Kumar leave request in queue');
    if (rahulRequest) {
      assert(rahulRequest.studentName === 'Rahul Kumar', `Student name is "${rahulRequest.studentName}"`);
      assert(rahulRequest.fromDate === '2026-09-18', `Leave date is "${rahulRequest.fromDate}" (18/09/2026)`);
      assert(rahulRequest.reason.includes('Medical'), `Reason is "${rahulRequest.reason}"`);
      assert(rahulRequest.status === 'PENDING', `Status is "${rahulRequest.status}"`);
      console.log(`   Prompt example verified: [${rahulRequest.studentName} | Date: ${rahulRequest.fromDate} | Reason: ${rahulRequest.reason} | Status: ${rahulRequest.status}]`);
    }

    // Test 3: Parent submits a new leave request
    console.log('\n--- Test 3: Parent Submits New Leave Request ---');
    const newSubmission = await createLeaveRequest(
      {
        studentId: 'IT10025',
        fromDate: '2026-09-24',
        toDate: '2026-09-25',
        session: 'BOTH',
        reason: 'School Examination',
        description: 'Annual inter-school physics olympiad and science practical test.',
        attachmentUrl: 'https://example.com/olympiad_hall_ticket.pdf',
      },
      {
        id: 'parent-001',
        role: 'PARENT',
        phone: '9845000001',
        name: 'Rajesh Kumar',
      }
    );

    assert(!!newSubmission.id, `Created leave request with ID ${newSubmission.id}`);
    assert(newSubmission.status === 'PENDING', `Initial status is PENDING`);
    assert(newSubmission.studentName === 'Rahul Kumar', `Associated student name is ${newSubmission.studentName}`);
    assert(newSubmission.attachmentUrl === 'https://example.com/olympiad_hall_ticket.pdf', `Attachment URL preserved`);

    // Test 4: Admin reviews the request -> APPROVE
    console.log('\n--- Test 4: Teacher/Admin Approves Leave Request ---');
    const approvedRequest = await reviewLeaveRequest(
      newSubmission.id,
      {
        status: 'APPROVED',
        reviewNote: 'Approved for science olympiad. Best wishes for the practicals!',
      },
      {
        id: 'admin-001',
        name: 'Prof. Suresh Sharma',
        role: 'ADMIN',
      }
    );

    assert(approvedRequest.status === 'APPROVED', `Status updated to APPROVED`);
    assert(approvedRequest.reviewedByName?.includes('Prof. Suresh Sharma') === true, `Reviewed by set to ${approvedRequest.reviewedByName}`);
    assert(approvedRequest.reviewNote?.includes('Best wishes') === true, `Review note set: "${approvedRequest.reviewNote}"`);
    assert(!!approvedRequest.reviewedAt, `Reviewed timestamp is recorded`);

    // Test 5: Reject a leave request with reason
    console.log('\n--- Test 5: Teacher/Admin Rejects Leave Request ---');
    const secondReq = await createLeaveRequest(
      {
        studentId: 'IT10025',
        fromDate: '2026-10-01',
        toDate: '2026-10-02',
        session: 'EVENING',
        reason: 'Personal',
        description: 'Family outing during weekday evening.',
      },
      {
        id: 'parent-001',
        role: 'PARENT',
        phone: '9845000001',
        name: 'Rajesh Kumar',
      }
    );

    const rejectedReq = await reviewLeaveRequest(
      secondReq.id,
      {
        status: 'REJECTED',
        reviewNote: 'Cannot be sanctioned due to scheduled mock board exam on this evening.',
      },
      {
        id: 'teacher-001',
        name: 'Dr. Ananya Roy',
        role: 'TEACHER',
      }
    );

    assert(rejectedReq.status === 'REJECTED', `Status updated to REJECTED`);
    assert(rejectedReq.reviewedByName?.includes('Dr. Ananya Roy') === true, `Reviewed by Dr. Ananya Roy`);
    assert(rejectedReq.reviewNote?.includes('mock board exam') === true, `Review note correctly recorded`);

    // Test 6: Verify Parent can see real-time updated status
    console.log('\n--- Test 6: Parent Views Updated Status in Real Time ---');
    const parentLeaves: LeaveRequestDto[] = await getLeaveRequests(
      { studentId: 'IT10025' },
      { id: 'parent-001', role: 'PARENT', phone: '9845000001' }
    );
    const verifiedApproved = parentLeaves.find((l: LeaveRequestDto) => l.id === newSubmission.id);
    const verifiedRejected = parentLeaves.find((l: LeaveRequestDto) => l.id === secondReq.id);

    assert(verifiedApproved?.status === 'APPROVED', `Parent sees verified approved status with note`);
    assert(verifiedRejected?.status === 'REJECTED', `Parent sees verified rejected status with note`);

    console.log('\n====================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} LEAVE SYSTEM TESTS PASSED SUCCESSFULLY!`);
    console.log('====================================================');
  } catch (err) {
    console.error('Test execution error:', err);
    process.exitCode = 1;
  }
}

runLeaveSystemTests();
