import analyticsService from '../services/analyticsService';

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
  console.log('🧪 TESTING INFINITE TUTORIAL PERFORMANCE & CHAPTER-WISE ANALYSIS (22 & 23)');
  console.log('======================================================================\n');

  try {
    // -----------------------------------------------------------
    // TEST 1: Retrieve Overall Student Graph Metrics (Rahul Kumar IT10025)
    // -----------------------------------------------------------
    console.log('--- Test 1: Validate Student Overall Graph Metrics ---');
    const analytics = await analyticsService.getStudentPerformanceAnalysis('IT10025');

    assert(!!analytics, 'Retrieved student performance analysis');
    assert(analytics.studentName === 'Rahul Kumar', `Student name is "${analytics.studentName}"`);
    assert(analytics.studentRoll === 'IT10025', `Student roll is "${analytics.studentRoll}"`);
    assert(analytics.overallPercentage > 0, `Overall percentage present: ${analytics.overallPercentage}%`);
    assert(analytics.overallAverageMarks > 0, `Average marks present: ${analytics.overallAverageMarks}`);
    assert(analytics.attendancePercentage === 91.3, `Attendance percentage present: ${analytics.attendancePercentage}%`);
    assert(analytics.totalTestsConducted === 16, `Total tests conducted tracked: ${analytics.totalTestsConducted}`);
    assert(analytics.overallComparison.length === 4, 'Multi-subject comparison contains 4 core subjects');

    console.log(`   Overall Graph metrics: [Marks: ${analytics.overallAverageMarks} | ${analytics.overallPercentage}% | Attendance: ${analytics.attendancePercentage}%]\n`);

    // -----------------------------------------------------------
    // TEST 2: Validate Step 22 Subject Graph (Line Graph Example: Physics)
    // Prompt:
    // Physics
    // Test 1      72%
    // Test 2      78%
    // Test 3      84%
    // Test 4      88%
    // -----------------------------------------------------------
    console.log('--- Test 2: Validate Step 22 Line Graph Exact Example (Physics) ---');
    const physics = analytics.subjects.physics;
    assert(!!physics, 'Physics subject breakdown exists');
    assert(physics.testProgression.length === 4, `Physics has 4 test progression points (got ${physics.testProgression.length})`);

    const t1 = physics.testProgression.find((t) => t.testNumber === 'Test 1');
    const t2 = physics.testProgression.find((t) => t.testNumber === 'Test 2');
    const t3 = physics.testProgression.find((t) => t.testNumber === 'Test 3');
    const t4 = physics.testProgression.find((t) => t.testNumber === 'Test 4');

    assert(!!t1 && t1.percentage === 72, `Physics Test 1 percentage is 72% (got ${t1?.percentage}%)`);
    assert(!!t2 && t2.percentage === 78, `Physics Test 2 percentage is 78% (got ${t2?.percentage}%)`);
    assert(!!t3 && t3.percentage === 84, `Physics Test 3 percentage is 84% (got ${t3?.percentage}%)`);
    assert(!!t4 && t4.percentage === 88, `Physics Test 4 percentage is 88% (got ${t4?.percentage}%)`);

    assert(physics.averagePercentage > 0, `Physics average percentage is ${physics.averagePercentage}%`);
    assert(physics.highestPercentage === 88, `Physics peak percentage is ${physics.highestPercentage}%`);

    console.log('   Physics Line Graph: [Test 1: 72% -> Test 2: 78% -> Test 3: 84% -> Test 4: 88%]\n');

    // -----------------------------------------------------------
    // TEST 3: Validate Step 23 Chapter-Wise Analysis (Bar Graph Example: Physics)
    // Prompt:
    // Physics
    // Motion             82%
    // Force               76%
    // Gravitation         88%
    // Electricity         91%
    // -----------------------------------------------------------
    console.log('--- Test 3: Validate Step 23 Chapter-Wise Bar Graph Exact Example (Physics) ---');
    const chapters = physics.chapterAnalysis;
    assert(chapters.length >= 4, `Physics has 4 chapter mastery bars (got ${chapters.length})`);

    const chMotion = chapters.find((c) => c.chapterName.toLowerCase().includes('motion'));
    const chForce = chapters.find((c) => c.chapterName.toLowerCase().includes('force'));
    const chGrav = chapters.find((c) => c.chapterName.toLowerCase().includes('gravitation'));
    const chElec = chapters.find((c) => c.chapterName.toLowerCase().includes('electricity'));

    assert(!!chMotion && chMotion.percentage === 82, `Physics Motion percentage is 82% (got ${chMotion?.percentage}%)`);
    assert(!!chForce && chForce.percentage === 76, `Physics Force percentage is 76% (got ${chForce?.percentage}%)`);
    assert(!!chGrav && chGrav.percentage === 88, `Physics Gravitation percentage is 88% (got ${chGrav?.percentage}%)`);
    assert(!!chElec && chElec.percentage === 91, `Physics Electricity percentage is 91% (got ${chElec?.percentage}%)`);

    console.log('   Physics Chapter Bar Graph: [Motion: 82% | Force: 76% | Gravitation: 88% | Electricity: 91%]\n');

    // -----------------------------------------------------------
    // TEST 4: Validate Support for Chemistry, Biology, and Mathematics
    // -----------------------------------------------------------
    console.log('--- Test 4: Validate Chemistry, Biology, and Mathematics Coverage ---');
    const { chemistry, biology, mathematics } = analytics.subjects;

    // Chemistry
    assert(!!chemistry, 'Chemistry analysis present');
    assert(chemistry.testProgression.length === 4, 'Chemistry has 4 test progression points');
    assert(chemistry.chapterAnalysis.length >= 4, 'Chemistry has 4 chapter mastery bars');
    assert(chemistry.chapterAnalysis.some((c) => c.chapterName.includes('Chemical Reactions')), 'Chemistry Chapter "Chemical Reactions" present');

    // Biology
    assert(!!biology, 'Biology analysis present');
    assert(biology.testProgression.length === 4, 'Biology has 4 test progression points');
    assert(biology.chapterAnalysis.length >= 4, 'Biology has 4 chapter mastery bars');
    assert(biology.chapterAnalysis.some((c) => c.chapterName.includes('Life Processes')), 'Biology Chapter "Life Processes" present');

    // Mathematics
    assert(!!mathematics, 'Mathematics analysis present');
    assert(mathematics.testProgression.length === 4, 'Mathematics has 4 test progression points');
    assert(mathematics.chapterAnalysis.length >= 4, 'Mathematics has 4 chapter mastery bars');
    assert(mathematics.chapterAnalysis.some((c) => c.chapterName.includes('Real Numbers')), 'Maths Chapter "Real Numbers" present');

    console.log('   Multi-subject analytical coverage verified across Chemistry, Biology & Mathematics.\n');

    // -----------------------------------------------------------
    // TEST 5: Alternate Candidate (Sneha Verma IT10026)
    // -----------------------------------------------------------
    console.log('--- Test 5: Alternate Candidate Analytics (Sneha Verma) ---');
    const snehaAnalytics = await analyticsService.getStudentPerformanceAnalysis('IT10026');
    assert(snehaAnalytics.studentName === 'Sneha Verma', 'Retrieved Sneha Verma analytics');
    assert(snehaAnalytics.attendancePercentage === 95.0, 'Sneha Verma attendance is 95.0%');
    assert(snehaAnalytics.subjects.physics.testProgression.length === 4, 'Sneha physics progression points present');

    console.log('\n======================================================================');
    console.log(`🎉 ALL PERFORMANCE & CHAPTER-WISE ANALYSIS TESTS COMPLETED!`);
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

runTests();
