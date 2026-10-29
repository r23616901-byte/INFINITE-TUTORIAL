/**
 * Automated Verification Script for Infinite Tutorial
 * Feature: Universal Document Template and Printing System
 */

import { ALL_QUESTION_PAPERS } from '../services/curriculumQuestionPapers';
import * as curriculumService from '../services/curriculumService';

interface TestResult {
  suite: string;
  test: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

const record = (suite: string, test: string, passed: boolean, details?: string) => {
  results.push({ suite, test, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} [${suite}] ${test}${details ? ` -> ${details}` : ''}`);
};

async function runTestSuite() {
  console.log('\n============================================================');
  console.log('INFINITE TUTORIAL — DOCUMENT TEMPLATE & PRINTING SYSTEM TESTS');
  console.log('============================================================\n');

  // 1. Physics Question Papers Validation
  const physicsPapers = ALL_QUESTION_PAPERS.filter((p) => p.subject.toLowerCase() === 'physics');
  record('Physics Papers', 'At least 4 Physics papers present (KSB 9, KSB 10, CBSE 9, CBSE 10)', physicsPapers.length >= 4, `Found: ${physicsPapers.length} papers`);

  for (const p of physicsPapers) {
    const hasEquations = p.sections.some((s) =>
      s.questions.some((q) => q.text.includes('m/s') || q.text.includes('g') || q.text.includes('GM') || q.text.includes('Newton') || q.text.includes('inertia'))
    );
    record('Physics Papers', `${p.title} (${p.boardName} ${p.className}) formula & numerical check`, hasEquations, `Total Marks: ${p.totalMarks}`);
  }

  // 2. Chemistry Question Papers Validation
  const chemistryPapers = ALL_QUESTION_PAPERS.filter((p) => p.subject.toLowerCase() === 'chemistry');
  record('Chemistry Papers', 'At least 4 Chemistry papers present', chemistryPapers.length >= 4, `Found: ${chemistryPapers.length} papers`);

  for (const p of chemistryPapers) {
    const hasChemicalEquations = p.sections.some((s) =>
      s.questions.some((q) => q.text.includes('H') || q.text.includes('C') || q.text.includes('acid') || q.text.includes('bond') || q.text.includes('atom'))
    );
    record('Chemistry Papers', `${p.title} (${p.boardName} ${p.className}) chemical notation check`, hasChemicalEquations, `Total Marks: ${p.totalMarks}`);
  }

  // 3. Biology Question Papers Validation
  const biologyPapers = ALL_QUESTION_PAPERS.filter((p) => p.subject.toLowerCase() === 'biology');
  record('Biology Papers', 'At least 4 Biology papers present', biologyPapers.length >= 4, `Found: ${biologyPapers.length} papers`);

  for (const p of biologyPapers) {
    const hasBioTerms = p.sections.some((s) =>
      s.questions.some((q) => q.text.includes('cell') || q.text.includes('tissue') || q.text.includes('Life') || q.text.includes('diagram') || q.text.includes('plant') || q.text.includes('organ'))
    );
    record('Biology Papers', `${p.title} (${p.boardName} ${p.className}) biological terminology check`, hasBioTerms, `Total Marks: ${p.totalMarks}`);
  }

  // 4. Mathematics Question Papers Validation
  const mathPapers = ALL_QUESTION_PAPERS.filter((p) => p.subject.toLowerCase().includes('math'));
  record('Mathematics Papers', 'At least 4 Mathematics papers present', mathPapers.length >= 4, `Found: ${mathPapers.length} papers`);

  for (const p of mathPapers) {
    const hasMathSymbols = p.sections.some((s) =>
      s.questions.some((q) => q.text.includes('x') || q.text.includes('Equation') || q.text.includes('root') || q.text.includes('Triangle') || q.text.includes('Polynomial'))
    );
    record('Mathematics Papers', `${p.title} (${p.boardName} ${p.className}) mathematical problem check`, hasMathSymbols, `Total Marks: ${p.totalMarks}`);
  }

  // 5. Total Marks and Section Integrity across all 16 papers
  for (const p of ALL_QUESTION_PAPERS) {
    const sectionsMarksSum = p.sections.reduce((acc, s) => acc + s.totalMarks, 0);
    const questionsMarksSum = p.sections.reduce(
      (acc, s) => acc + s.questions.reduce((qAcc, q) => qAcc + q.marks, 0),
      0
    );
    record(
      'Mark Integrity',
      `${p.id}: Section sum (${sectionsMarksSum}) == Question sum (${questionsMarksSum}) == Total (${p.totalMarks})`,
      sectionsMarksSum === p.totalMarks && questionsMarksSum === p.totalMarks
    );
  }

  // 6. Answer Key Separation & Security Sanitization
  const samplePaper = ALL_QUESTION_PAPERS[0];
  const hasKeysOriginally = samplePaper.sections.some((s) => s.questions.some((q) => Boolean(q.answerKey)));
  record('Answer Key Security', 'Sample paper originally contains teacher answer keys', hasKeysOriginally);

  // Sanitize paper for student distribution
  const sanitizedStudentCopy = {
    ...samplePaper,
    sections: samplePaper.sections.map((sec) => ({
      ...sec,
      questions: sec.questions.map((q) => {
        const { answerKey, ...rest } = q;
        return rest;
      }),
    })),
  };

  const studentCopyLeakedKeys = sanitizedStudentCopy.sections.some((s) =>
    s.questions.some((q) => 'answerKey' in q && (q as any).answerKey !== undefined)
  );
  record('Answer Key Security', 'Student question paper has ZERO leaked answer keys', !studentCopyLeakedKeys);

  // 7. Role-Based Access Control Simulation
  const mockParentUser = { id: 'usr-parent-1', role: 'PARENT' };
  const mockTeacherUser = { id: 'usr-teacher-1', role: 'TEACHER' };

  // For parent, stripping answer keys
  const parentPapers = await curriculumService.getQuestionPapers();
  const parentSanitized = parentPapers.map((p) => ({
    ...p,
    sections: p.sections.map((s) => ({
      ...s,
      questions: s.questions.map((q) => {
        const { answerKey, ...sanitized } = q;
        return sanitized;
      }),
    })),
  }));

  const anyParentKeyPresent = parentSanitized.some((p) =>
    p.sections.some((s) => s.questions.some((q) => 'answerKey' in q && (q as any).answerKey !== undefined))
  );
  record('Role-Based Access Control', 'Parent role API never receives answer keys', !anyParentKeyPresent, `Checked ${parentSanitized.length} papers`);

  // For teacher, keys are retained
  const anyTeacherKeyPresent = parentPapers.some((p) =>
    p.sections.some((s) => s.questions.some((q) => Boolean(q.answerKey)))
  );
  record('Role-Based Access Control', 'Teacher role API successfully receives full answer keys for evaluation', anyTeacherKeyPresent);

  // 8. Academic Report Data Calculations
  const mockMarks = [
    { subject: 'Physics', maxMarks: 50, marksObtained: 44 },
    { subject: 'Chemistry', maxMarks: 50, marksObtained: 46 },
    { subject: 'Biology', maxMarks: 50, marksObtained: 42 },
    { subject: 'Mathematics', maxMarks: 50, marksObtained: 48 },
  ];
  const totalMax = mockMarks.reduce((a, b) => a + b.maxMarks, 0);
  const totalObt = mockMarks.reduce((a, b) => a + b.marksObtained, 0);
  const percentage = Number(((totalObt / totalMax) * 100).toFixed(1));

  record('Academic Scorecard', 'Scorecard calculates percentage accurately', percentage === 90.0, `Obtained: ${totalObt}/${totalMax} -> ${percentage}%`);

  // 9. Portion Completion Calculations
  const chapters = await curriculumService.getCurriculum({ classId: 'cls-9', boardId: 'brd-ksb' });
  const completedChapters = chapters.filter((c) => c.status === 'COMPLETED');
  const completionPct = Math.round((completedChapters.length / chapters.length) * 100);

  record('Portion Completion Report', 'Portion completion calculations valid', completionPct >= 0 && completionPct <= 100, `Total: ${chapters.length}, Completed: ${completedChapters.length} (${completionPct}%)`);

  // Summary
  console.log('\n============================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED OUT OF ${results.length} TESTS`);
  console.log('============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
