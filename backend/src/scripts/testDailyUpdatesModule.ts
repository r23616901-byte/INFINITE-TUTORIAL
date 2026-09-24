import * as dailyUpdateService from '../services/dailyUpdateService';

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

async function runTests() {
  console.log('======================================================================');
  console.log('🧪 TESTING INFINITE TUTORIAL DAILY UPDATES MODULE (STEP 37 / STEP 19)');
  console.log('======================================================================\n');

  try {
    // ------------------------------------------------------------------
    // TEST 1: Retrieve Initial Seeded Daily Updates
    // ------------------------------------------------------------------
    console.log("--- Test 1: Validate Seeded Daily Updates & Example Content ---");
    const initialList = await dailyUpdateService.getDailyUpdates({});
    assert(initialList.total >= 3, `Retrieved ${initialList.total} daily updates (expected >= 3)`);

    const update101 = await dailyUpdateService.getDailyUpdateById('update-101');
    assert(!!update101, 'Found update-101 (Prompt Example)');
    assert(update101?.batchId === 'batch-10a-morning', 'Update is for batch 10-A Morning');
    assert(update101?.date === '2026-09-23', 'Update date is 2026-09-23');

    // Validate prompt example subject breakdown
    const subjects = update101?.subjectUpdates || [];
    const phy = subjects.find(s => s.subject === 'Physics');
    const chem = subjects.find(s => s.subject === 'Chemistry');
    const math = subjects.find(s => s.subject === 'Mathematics');

    assert(phy?.status === 'Chapter 4 completed.', 'Physics: Chapter 4 completed.');
    assert(chem?.status === 'Numericals discussed.', 'Chemistry: Numericals discussed.');
    assert(math?.status === 'Exercise 5.2 completed.', 'Mathematics: Exercise 5.2 completed.');
    assert(update101?.homework === 'Complete questions 1–10.', 'Homework: Complete questions 1–10.');

    // Validate image fields (Step 19)
    assert(!!update101?.todayLesson, "Field 1: Today's lesson present");
    assert(!!update101?.homework, "Field 2: Homework present");
    assert(!!update101?.instructions, "Field 3: Important instructions present");
    assert(!!update101?.topicsCovered, "Field 4: Topics covered present");

    console.log("   Prompt example content & Step 19 four core fields verified.\n");

    // ------------------------------------------------------------------
    // TEST 2: Filter Daily Updates by Batch and Date
    // ------------------------------------------------------------------
    console.log("--- Test 2: Filter Daily Updates by Batch & Date ---");
    const morningBatch = await dailyUpdateService.getDailyUpdates({ batchId: 'batch-10a-morning' });
    assert(morningBatch.data.length >= 2, `Found ${morningBatch.data.length} updates for 10-A Morning`);
    assert(morningBatch.data.every((u: any) => u.batchId === 'batch-10a-morning'), 'All filtered results belong to 10-A Morning');

    const eveningBatch = await dailyUpdateService.getDailyUpdates({ batchId: 'batch-10b-evening' });
    assert(eveningBatch.data.length >= 1, `Found ${eveningBatch.data.length} updates for 10-B Evening`);
    assert(eveningBatch.data[0].batchId === 'batch-10b-evening', 'Filtered result belongs to 10-B Evening');

    const dateFiltered = await dailyUpdateService.getDailyUpdates({ date: '2026-09-22' });
    assert(dateFiltered.data.length >= 1, `Found ${dateFiltered.data.length} updates for 2026-09-22`);
    assert(dateFiltered.data.every((u: any) => u.date === '2026-09-22'), 'All filtered results have date 2026-09-22');

    console.log("   Filtering by batch and date verified.\n");

    // ------------------------------------------------------------------
    // TEST 3: Teacher / Admin Publishes New Daily Update
    // ------------------------------------------------------------------
    console.log("--- Test 3: Teacher/Admin Publishes New Daily Update ---");
    const teacherUser = {
      id: 'teacher-prof-1',
      name: 'Prof. Rajesh Sharma (Physics)',
      role: 'TEACHER',
    };

    const newUpdate = await dailyUpdateService.createDailyUpdate(
      {
        date: '2026-09-24',
        batchId: 'batch-10a-morning',
        batchName: '10-A Morning',
        title: "Thursday Syllabus Update",
        todayLesson: "Physics Light Refraction, Chemistry Periodic Table Trends",
        topicsCovered: "Refractive index calculations, Atomic radii variation across periods",
        homework: "Solve NCERT Exercise 10.2 questions 11-15.",
        instructions: "Bring compass and ruler for tomorrow's prism experiment.",
        subjectUpdates: [
          { subject: 'Physics', status: 'Refractive index problems solved.' },
          { subject: 'Chemistry', status: 'Modern Periodic Table trends introduced.' },
        ],
      },
      teacherUser
    );

    assert(!!newUpdate.id, `Daily update published with ID: ${newUpdate.id}`);
    assert(newUpdate.postedById === teacherUser.id, 'Posted by teacher ID verified');
    assert(newUpdate.postedByName === teacherUser.name, 'Posted by teacher name verified');
    assert(newUpdate.subjectUpdates.length === 2, 'Contains 2 subject update items');

    console.log("   Daily update creation verified.\n");

    // ------------------------------------------------------------------
    // TEST 4: Modify & Edit Daily Update
    // ------------------------------------------------------------------
    console.log("--- Test 4: Edit Daily Update ---");
    const updated = await dailyUpdateService.updateDailyUpdate(
      newUpdate.id,
      {
        homework: "Solve NCERT Exercise 10.2 questions 11-18 (extended).",
        instructions: "Bring geometry kit and scientific calculator.",
      },
      teacherUser
    );

    assert(updated.homework === "Solve NCERT Exercise 10.2 questions 11-18 (extended).", 'Homework updated successfully');
    assert(updated.instructions === "Bring geometry kit and scientific calculator.", 'Instructions updated successfully');

    // ------------------------------------------------------------------
    // TEST 5: Delete Daily Update
    // ------------------------------------------------------------------
    console.log("--- Test 5: Delete Daily Update ---");
    const deleteSuccess = await dailyUpdateService.deleteDailyUpdate(newUpdate.id, teacherUser);
    assert(deleteSuccess === true, 'Daily update deleted successfully');

    const verifyDeleted = await dailyUpdateService.getDailyUpdateById(newUpdate.id);
    assert(verifyDeleted === null, 'Verified update no longer exists in system');

    console.log("\n======================================================================");
    console.log(`🎉 ALL DAILY UPDATES TESTS COMPLETED!`);
    console.log(`   Passed: ${passed} / ${passed + failed}`);
    console.log("======================================================================\n");
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

runTests();
