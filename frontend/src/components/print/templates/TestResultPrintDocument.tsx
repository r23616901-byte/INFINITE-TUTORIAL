import React from 'react';
import { PrintLayout } from '../PrintLayout';
import { StudentMark } from '../../../types/mark';
import { getAcademicGrade } from '../../../utils/printUtils';

export interface TestMetadata {
  id?: string;
  testId?: string;
  name: string;
  subjectName: string;
  className?: string;
  boardName?: string;
  chapter?: string;
  dateStr?: string;
  maxMarks: number;
  duration?: string;
  createdByName?: string;
}

export interface TestResultPrintDocumentProps {
  test: TestMetadata;
  marksList: StudentMark[];
  isForPreview?: boolean;
}

export const TestResultPrintDocument: React.FC<TestResultPrintDocumentProps> = ({
  test,
  marksList = [],
  isForPreview = false,
}) => {
  const totalEvaluated = marksList.length;
  const totalMarksObtained = marksList.reduce((acc, m) => acc + (m.marksObtained || 0), 0);
  const averageMarks =
    totalEvaluated > 0 ? Number((totalMarksObtained / totalEvaluated).toFixed(1)) : 0;
  const averagePercentage =
    test.maxMarks > 0 ? Number(((averageMarks / test.maxMarks) * 100).toFixed(1)) : 0;
  const highestMarks =
    totalEvaluated > 0 ? Math.max(...marksList.map((m) => m.marksObtained || 0)) : 0;
  const passCount = marksList.filter(
    (m) => test.maxMarks > 0 && (m.marksObtained / test.maxMarks) * 100 >= 35
  ).length;
  const passRate = totalEvaluated > 0 ? Math.round((passCount / totalEvaluated) * 100) : 0;

  return (
    <PrintLayout
      documentTitle="OFFICIAL EXAMINATION EVALUATION &amp; MARKS LEDGER"
      documentSubtitle="Verified Test Assessment Ledger, Student Marks Distribution &amp; Cohort Ranking"
      reportCategory="TEST RESULT LEDGER"
      metadata={{
        testName: test.name,
        subjectName: test.subjectName,
        className: test.className || 'Class 10',
        boardName: test.boardName || 'CBSE',
        testDate: test.dateStr,
        maxMarks: test.maxMarks,
        duration: test.duration || '90 mins',
        facultyName: test.createdByName,
        academicYear: 'AY 2024–2025',
      }}
      isForPreview={isForPreview}
      customFooterNote="Official Examination Record issued by Infinite Tutorial Examination Directorate. Verified teacher marks ledger."
    >
      {/* 1. Test Details & Statistics KPI Header */}
      <div className="grid grid-cols-4 gap-2.5">
        <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Class Average Score</span>
          <span className="text-xl font-black text-[#0A3622] mt-0.5 block">{averageMarks} / {test.maxMarks}</span>
          <span className="text-[8.5px] font-bold text-emerald-800">{averagePercentage}% Average</span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Highest Score</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{highestMarks} / {test.maxMarks}</span>
          <span className="text-[8.5px] font-bold text-emerald-800">
            {test.maxMarks > 0 ? Math.round((highestMarks / test.maxMarks) * 100) : 0}% Highest
          </span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Passing Rate</span>
          <span className="text-xl font-black text-[#0A3622] mt-0.5 block">{passRate}%</span>
          <span className="text-[8.5px] text-slate-600">
            {passCount} of {totalEvaluated} Passed
          </span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Evaluated Submissions</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{totalEvaluated}</span>
          <span className="text-[8.5px] text-emerald-800 font-bold">100% Certified</span>
        </div>
      </div>

      {/* 2. Student Marks Table */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide">
            Student Marks Assessment Roster &bull; {test.name}
          </h4>
          <span className="text-[9.5px] font-bold text-slate-600">
            Chapter: {test.chapter || 'Prescribed Course Syllabus'}
          </span>
        </div>

        <table className="w-full text-left text-xs border border-slate-300">
          <thead>
            <tr>
              <th className="py-2 px-2 text-center w-10">S.No</th>
              <th className="py-2 px-3">Student Full Name</th>
              <th className="py-2 px-2.5 text-center">Student Roll</th>
              <th className="py-2 px-2.5 text-center">Max Marks</th>
              <th className="py-2 px-2.5 text-center">Obtained</th>
              <th className="py-2 px-2.5 text-center">Percentage</th>
              <th className="py-2 px-2.5 text-center">Grade</th>
              <th className="py-2 px-3">Faculty Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {marksList.length > 0 ? (
              marksList.map((m, idx) => {
                const pct = m.percentage || (test.maxMarks > 0 ? (m.marksObtained / test.maxMarks) * 100 : 0);
                const grade = getAcademicGrade(pct);
                return (
                  <tr key={m.id || idx} className="hover:bg-slate-50/50">
                    <td className="py-1.5 px-2 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-1.5 px-3 font-bold text-slate-900">{m.studentName}</td>
                    <td className="py-1.5 px-2.5 text-center font-mono text-xs font-semibold text-[#0A3622]">
                      {m.studentRoll}
                    </td>
                    <td className="py-1.5 px-2.5 text-center text-slate-600">{m.maxMarks || test.maxMarks}</td>
                    <td className="py-1.5 px-2.5 text-center font-bold text-slate-900">{m.marksObtained}</td>
                    <td className="py-1.5 px-2.5 text-center font-bold text-[#0A3622]">
                      {Number(pct.toFixed(1))}%
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-slate-100 border border-slate-300">
                        {grade.grade}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-slate-700 italic text-[10.5px]">
                      {m.remarks || 'Standard evaluation recorded'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-4 text-center text-slate-500 italic">
                  No evaluated student marks recorded yet for this test.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
            <tr>
              <td colSpan={4} className="py-2 px-3 uppercase text-right text-[#0A3622]">
                Cohort Benchmark Average:
              </td>
              <td className="py-2 px-2.5 text-center font-black text-[#0A3622]">{averageMarks}</td>
              <td className="py-2 px-2.5 text-center font-black text-[#0A3622]">{averagePercentage}%</td>
              <td colSpan={2} className="py-2 px-3 text-slate-700 text-[10px]">
                {passCount} Passed / {totalEvaluated} Total Students Evaluated
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </PrintLayout>
  );
};
